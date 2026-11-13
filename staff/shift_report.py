from collections import defaultdict
from datetime import timedelta
from decimal import Decimal

from django.db.models import Case, DateTimeField, F, Prefetch, Q, Sum, When
from django.utils import timezone

from management.models import (
    ItemsState,
    PaymentAkaunts,
    SaveAkauntState,
    ShiftActivity,
    ShiftAssignment,
    ShiftSession,
    bidhaa_stoku,
    grouped_item_member,
    mauzoList,
    mauzoni,
    productChangeRecord,
    pu_ret,
    sa_ret,
    toaCash,
    transferList,
    wekaCash,
)


def sale_event_at(prefix=''):
    """POS stock leaves at tarehe; waiter stock leaves at first print (Packed_at)."""
    p = prefix
    return Case(
        When(
            **{f'{p}waiter_order_id__isnull': False, f'{p}Packed_at__isnull': False},
            then=F(f'{p}Packed_at'),
        ),
        default=F(f'{p}tarehe'),
        output_field=DateTimeField(),
    )


def _dt_range_kwargs(field, starts_at, period_end, start_exclusive=False):
    op = 'gt' if start_exclusive else 'gte'
    return {
        f'{field}__{op}': starts_at,
        f'{field}__lte': period_end,
    }


def _minute_floor(dt):
    if not dt:
        return dt
    return dt.replace(second=0, microsecond=0)


def _shift_window_lower(duka, starts_at, duka_ids=None):
    """Lower bound for events owned by this shift.

    Sales through the previous close stay on that shift. If close and open
    share the same displayed minute (HH:mm), this shift starts at the next minute.
    Returns (bound, exclusive) where exclusive True means event_at > bound.
    """
    if not starts_at:
        return starts_at, False
    qs = ShiftSession.objects.filter(
        status='closed',
        starts_at__lt=starts_at,
        ends_at__isnull=False,
    )
    shop_ids = _shop_ids(duka, duka_ids) if duka is not None else []
    if shop_ids:
        qs = qs.filter(Interprise_id__in=shop_ids)
    prev = qs.order_by('-starts_at').first()
    if not prev or not prev.ends_at:
        return starts_at, False
    start_min = _minute_floor(starts_at)
    prev_min = _minute_floor(prev.ends_at)
    if prev_min == start_min:
        return start_min + timedelta(minutes=1), False
    if prev.ends_at >= starts_at:
        return prev.ends_at, True
    return starts_at, False


def _event_shift_id(windows, event_at):
    """If a timestamp sits on two shift edges, keep it on the earlier (closing) shift."""
    matches = [w for w in windows if w[1] <= event_at <= w[2]]
    if not matches:
        return None
    matches.sort(key=lambda w: (w[1], w[0]))
    return matches[0][0]


def completed_sales_qs(duka, starts_at, period_end, start_exclusive=False):
    qs = mauzoni.objects.filter(
        Interprise=duka.id,
        service=False,
        order=False,
        cart=False,
        ignore=False,
    ).annotate(event_at=sale_event_at())
    return qs.filter(**_dt_range_kwargs('event_at', starts_at, period_end, start_exclusive))


class CalendarPeriod:
    """A single calendar window that period_* helpers can treat like a shift."""
    calendar = True

    def __init__(self, starts_at, ends_at, live=True):
        self.id = 0
        self.code = ''
        self.starts_at = starts_at
        self.ends_at = ends_at
        self.status = 'open' if live else 'closed'
        self.opening_cash = Decimal('0')
        self.actual_closing_cash = None


def calendar_period_span(start, end, now=None):
    now = now or timezone.now()
    live = bool(end and end >= now - timedelta(seconds=30))
    return CalendarPeriod(start, end, live=live)


class PeriodShiftSlice:
    """A shift clipped to the selected report period (continuation-aware)."""
    calendar = False

    def __init__(self, shift, starts_at, ends_at, period_start, period_end):
        self.id = shift.id
        self.code = shift.code
        self.starts_at = starts_at
        self.ends_at = ends_at
        self.status = shift.status
        self.opening_cash = shift.opening_cash
        self.actual_closing_cash = shift.actual_closing_cash
        self.source_shift = shift
        self.continued = bool(period_start and shift.starts_at and shift.starts_at < period_start)
        closed_inside = (
            str(shift.status or '') == 'closed'
            and bool(shift.ends_at)
            and (not period_end or shift.ends_at <= period_end)
        )
        self.use_opening_snapshot = not self.continued
        self.use_closing_snapshot = closed_inside
        if not closed_inside:
            self.actual_closing_cash = None


SHIFT_COVERAGE_IN = 'in'
SHIFT_COVERAGE_PRIOR = 'prior'
SHIFT_COVERAGE_ALL = (SHIFT_COVERAGE_IN, SHIFT_COVERAGE_PRIOR)


def shift_coverage_flags(request):
    """Which shift groups the report should include. Default: both."""
    raw = [(x or '').strip().lower() for x in request.GET.getlist('sc')]
    selected = [x for x in raw if x in SHIFT_COVERAGE_ALL]
    if not selected:
        selected = list(SHIFT_COVERAGE_ALL)
    return {
        'in': SHIFT_COVERAGE_IN in selected,
        'prior': SHIFT_COVERAGE_PRIOR in selected,
        'selected': selected,
    }


def filter_shifts_by_coverage(shifts, start, end, flags):
    """Keep shifts that started in the period and/or started earlier.

    prior = started before the period and either closed inside it or still open.
    """
    want_in = bool(flags.get('in'))
    want_prior = bool(flags.get('prior'))
    if want_in and want_prior:
        return list(shifts)
    out = []
    for shift in shifts:
        starts_at = getattr(shift, 'starts_at', None)
        if not starts_at:
            continue
        started_in = start <= starts_at < end
        started_before = starts_at < start
        ends_at = getattr(shift, 'ends_at', None)
        closed = str(getattr(shift, 'status', '') or '') == 'closed' and bool(ends_at)
        closed_in = closed and start < ends_at <= end
        still_open = not closed
        if want_in and started_in:
            out.append(shift)
            continue
        if want_prior and started_before and (closed_in or still_open):
            out.append(shift)
    return out


def shifts_overlapping_period(shop_id, start, end):
    """Shifts that cover any part of [start, end], including earlier still-open ones."""
    qs = ShiftSession.objects.filter(
        Interprise=shop_id,
        starts_at__lt=end,
    ).filter(
        Q(ends_at__isnull=True) | Q(ends_at__gt=start)
    ).select_related(
        'Interprise', 'opened_by__user__user', 'closed_by__user__user',
    ).order_by('starts_at')
    found = list(qs)
    if found:
        return found
    open_shift = ShiftSession.objects.filter(
        Interprise=shop_id,
        status='open',
        starts_at__lt=end,
    ).select_related(
        'Interprise', 'opened_by__user__user', 'closed_by__user__user',
    ).order_by('-starts_at').first()
    return [open_shift] if open_shift else []


def clip_shifts_to_period(duka, shifts, period_start, period_end, now=None):
    """Clip each shift to the report clock window using the same ownership as shift view."""
    now = now or timezone.now()
    if period_end is None:
        period_end = now
    out = []
    for shift in shifts:
        if getattr(shift, 'calendar', False):
            out.append(shift)
            continue
        owned_from, exclusive = _shift_window_lower(duka, shift.starts_at)
        if not owned_from:
            owned_from = shift.starts_at
        if exclusive:
            owned_from = owned_from + timedelta(microseconds=1)
        owned_end = shift.ends_at or now
        start = owned_from
        end = owned_end
        if period_start and start < period_start:
            start = period_start
        if end > period_end:
            end = period_end
        if not start or start > end:
            continue
        out.append(PeriodShiftSlice(shift, start, end, period_start, period_end))
    return out


def _shop_ids(duka, duka_ids=None):
    if duka_ids:
        return [int(x) for x in duka_ids]
    return [int(duka.id)]


def completed_sale_lines_qs(duka, starts_at, period_end, duka_ids=None, start_exclusive=False):
    qs = mauzoList.objects.filter(
        mauzo__Interprise_id__in=_shop_ids(duka, duka_ids),
        mauzo__service=False,
        mauzo__order=False,
        mauzo__cart=False,
        mauzo__ignore=False,
    ).annotate(event_at=sale_event_at('mauzo__'))
    return qs.filter(**_dt_range_kwargs('event_at', starts_at, period_end, start_exclusive))


def shift_sales_paid_unpaid(duka, shifts):
    """Invoice paid vs remaining debt per shift, using the same sale window as sales."""
    now = timezone.now()
    unpaid = {shift.id: Decimal('0') for shift in shifts}
    paid = {shift.id: Decimal('0') for shift in shifts}
    windows = _shift_time_windows(shifts, now)
    if not windows:
        return unpaid, paid

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    sales = completed_sales_qs(duka, range_start, range_end).exclude(full_returned=True).values(
        'amount', 'ilolipwa', 'event_at'
    )
    for row in sales:
        event_at = row.get('event_at')
        if not event_at:
            continue
        amt = _dec(row.get('amount'))
        paid_amt = _dec(row.get('ilolipwa'))
        if paid_amt < 0:
            paid_amt = Decimal('0')
        if paid_amt > amt:
            paid_amt = amt
        debt = amt - paid_amt
        if debt < 0:
            debt = Decimal('0')
        sid = _event_shift_id(windows, event_at)
        if sid is None:
            continue
        unpaid[sid] += debt
        paid[sid] += paid_amt
    return unpaid, paid


def shift_sales_amounts(duka, shifts):
    """Completed sales totals per shift, matching shift view Stock Movement sales."""
    now = timezone.now()
    amounts = {shift.id: Decimal('0') for shift in shifts}
    windows = _shift_time_windows(shifts, now)
    if not windows:
        return amounts

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    for line in completed_sale_lines_qs(duka, range_start, range_end):
        net_qty = Decimal(line.idadi or 0) - Decimal(line.returned or 0) - Decimal(line.serviceReturn or 0)
        if net_qty <= 0:
            continue
        event_at = getattr(line, 'event_at', None)
        if not event_at:
            continue
        line_amount = net_qty * Decimal(line.bei or 0)
        sid = _event_shift_id(windows, event_at)
        if sid is None:
            continue
        amounts[sid] += line_amount
    return amounts


def _shift_time_windows(shifts, now=None):
    now = now or timezone.now()
    dated = []
    for shift in shifts:
        if not shift.starts_at:
            continue
        dated.append((shift.id, shift.starts_at, shift.ends_at or now))
    dated.sort(key=lambda w: (w[1], w[0]))
    windows = []
    for i, (sid, start, end) in enumerate(dated):
        adj_end = end
        if i + 1 < len(dated):
            next_start = dated[i + 1][1]
            if _minute_floor(end) == _minute_floor(next_start):
                minute_end = _minute_floor(next_start) + timedelta(minutes=1) - timedelta(microseconds=1)
                if minute_end > adj_end:
                    adj_end = minute_end
        windows.append((sid, start, adj_end))
    return windows


def _amounts_in_windows(windows, qs, date_field='tarehe', amount_field='Amount'):
    amounts = {sid: Decimal('0') for sid, _, _ in windows}
    if not windows:
        return amounts
    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    rows = qs.filter(**{
        f'{date_field}__gte': range_start,
        f'{date_field}__lte': range_end,
    }).values(date_field, amount_field)
    for row in rows:
        event_at = row.get(date_field)
        if not event_at:
            continue
        amt = Decimal(str(row.get(amount_field) or 0))
        sid = _event_shift_id(windows, event_at)
        if sid is None:
            continue
        amounts[sid] += amt
    return amounts


def _dec(value):
    return Decimal(str(value or 0))


def shift_payment_flows(duka, starts_at, period_end, start_exclusive=False):
    """Cash-drawer and report figures for one shift window.

    Cash deposit = money taken from cash into another payment account
    (toaCash.deposit_to), matching /akaunting/cash-deposits.
    Expenses = recorded operating expenses (toaCash.matumizi).
    Cash in/out = movements on Cash payment accounts only, used for expected till.
    """
    time_kw = _dt_range_kwargs('tarehe', starts_at, period_end, start_exclusive)
    expenses = toaCash.objects.filter(
        Interprise=duka.id,
        matumizi__isnull=False,
        **time_kw,
    ).aggregate(sum=Sum('Amount'))['sum'] or 0
    deposits = toaCash.objects.filter(
        Interprise=duka.id,
        deposit_to__isnull=False,
        **time_kw,
    ).aggregate(sum=Sum('Amount'))['sum'] or 0
    cash_in = wekaCash.objects.filter(
        Interprise=duka.id,
        Akaunt__aina__iexact='Cash',
        **time_kw,
    ).aggregate(sum=Sum('Amount'))['sum'] or 0
    cash_out = toaCash.objects.filter(
        Interprise=duka.id,
        Akaunt__aina__iexact='Cash',
        **time_kw,
    ).aggregate(sum=Sum('Amount'))['sum'] or 0
    return {
        'expenses': _dec(expenses),
        'deposits': _dec(deposits),
        'cash_in': _dec(cash_in),
        'cash_out': _dec(cash_out),
    }


def expected_cash_from_flows(opening, flows):
    return _dec(opening) + _dec(flows.get('cash_in')) - _dec(flows.get('cash_out'))


def build_shifts_period_report(duka, shifts):
    now = timezone.now()
    windows = _shift_time_windows(shifts, now)
    sales_map = shift_sales_amounts(duka, shifts)
    unpaid_map, paid_map = shift_sales_paid_unpaid(duka, shifts)
    expenses_map = _amounts_in_windows(
        windows,
        toaCash.objects.filter(Interprise=duka.id, matumizi__isnull=False),
    )
    deposits_map = _amounts_in_windows(
        windows,
        toaCash.objects.filter(Interprise=duka.id, deposit_to__isnull=False),
    )
    cash_in_map = _amounts_in_windows(
        windows,
        wekaCash.objects.filter(Interprise=duka.id, Akaunt__aina__iexact='Cash'),
    )
    cash_out_map = _amounts_in_windows(
        windows,
        toaCash.objects.filter(Interprise=duka.id, Akaunt__aina__iexact='Cash'),
    )

    rows = []
    totals = {
        'opening': Decimal('0'),
        'closing': Decimal('0'),
        'sales': Decimal('0'),
        'unpaid': Decimal('0'),
        'paid': Decimal('0'),
        'expenses': Decimal('0'),
        'deposits': Decimal('0'),
        'cash_in': Decimal('0'),
        'balance': Decimal('0'),
        'count': 0,
        'open_count': 0,
        'closed_count': 0,
    }

    for shift in shifts:
        sales = _dec(sales_map.get(shift.id, 0))
        unpaid = _dec(unpaid_map.get(shift.id, 0))
        paid = _dec(paid_map.get(shift.id, 0))
        expenses = _dec(expenses_map.get(shift.id, 0))
        deposits = _dec(deposits_map.get(shift.id, 0))
        cash_in = _dec(cash_in_map.get(shift.id, 0))
        cash_out = _dec(cash_out_map.get(shift.id, 0))
        opening = _dec(shift.opening_cash)
        balance = expected_cash_from_flows(opening, {'cash_in': cash_in, 'cash_out': cash_out})
        if shift.status == 'closed' and shift.actual_closing_cash is not None:
            closing = _dec(shift.actual_closing_cash)
        else:
            closing = balance

        rows.append({
            'shift': getattr(shift, 'source_shift', shift),
            'continued': bool(getattr(shift, 'continued', False)),
            'opening': opening,
            'closing': closing,
            'sales': sales,
            'unpaid': unpaid,
            'paid': paid,
            'expenses': expenses,
            'deposits': deposits,
            'cash_in': cash_in,
            'balance': balance,
        })
        totals['sales'] += sales
        totals['unpaid'] += unpaid
        totals['paid'] += paid
        totals['expenses'] += expenses
        totals['deposits'] += deposits
        totals['cash_in'] += cash_in
        totals['count'] += 1
        if shift.status == 'closed':
            totals['closed_count'] += 1
        else:
            totals['open_count'] += 1

    dated = [r for r in rows if getattr(r['shift'], 'starts_at', None)]
    dated.sort(key=lambda r: r['shift'].starts_at)
    if dated:
        totals['opening'] = dated[0]['opening']
        totals['closing'] = dated[-1]['closing']
        totals['balance'] = dated[-1]['balance']

    return rows, totals


def _qty2(value):
    return str(_dec(value).quantize(Decimal('0.01')))


def _is_cash_aina(aina):
    return (aina or '').strip().lower() == 'cash'


def _sorted_account_rows(rows):
    return sorted(
        rows,
        key=lambda r: (0 if _is_cash_aina(r.get('aina')) else 1, (r.get('aina') or '').lower(), (r.get('name') or '').lower()),
    )


def _pack_account_breakdown(rows, as_of=None, shift_code='', source=''):
    rows = _sorted_account_rows(rows)
    total = sum((_dec(r.get('amount')) for r in rows), Decimal('0'))
    cash_total = sum((_dec(r.get('amount')) for r in rows if _is_cash_aina(r.get('aina'))), Decimal('0'))
    return {
        'as_of': as_of.isoformat() if as_of else '',
        'shift_code': shift_code or '',
        'source': source or '',
        'total': _qty2(total),
        'cash_total': _qty2(cash_total),
        'rows': [
            {
                'name': r.get('name') or '—',
                'aina': r.get('aina') or '',
                'amount': _qty2(r.get('amount')),
                'is_cash': _is_cash_aina(r.get('aina')),
            }
            for r in rows
        ],
    }


def _shift_snapshot_id(shift, event_type):
    if not shift:
        return None
    newest_first = event_type == 'CLOSING_SNAPSHOT'
    act = ShiftActivity.objects.filter(
        shift=shift.id,
        event_type=event_type,
        event_ref_id__isnull=False,
    ).order_by('-recorded_at' if newest_first else 'recorded_at').first()
    return act.event_ref_id if act else None


def _account_rows_from_snapshot(state_id):
    if not state_id:
        return []
    rows = []
    qs = SaveAkauntState.objects.filter(state_id=state_id).select_related('sakaunt')
    for rec in qs:
        acc = rec.sakaunt
        rows.append({
            'id': acc.id if acc else None,
            'name': acc.Akaunt_name if acc else '—',
            'aina': acc.aina if acc else '',
            'amount': _dec(rec.kiasi),
        })
    return rows


def _account_balances_at(duka, at_dt):
    accounts = list(
        PaymentAkaunts.objects.filter(Interprise=duka.id).order_by('aina', 'Akaunt_name')
    )
    if not accounts:
        return []
    ids = [a.id for a in accounts]
    weka_after = dict(
        wekaCash.objects.filter(
            Interprise=duka.id, Akaunt_id__in=ids, tarehe__gt=at_dt,
        ).values('Akaunt_id').annotate(s=Sum('Amount')).values_list('Akaunt_id', 's')
    )
    toa_after = dict(
        toaCash.objects.filter(
            Interprise=duka.id, Akaunt_id__in=ids, tarehe__gt=at_dt,
        ).values('Akaunt_id').annotate(s=Sum('Amount')).values_list('Akaunt_id', 's')
    )
    rows = []
    for acc in accounts:
        hist = _dec(acc.Amount) - _dec(weka_after.get(acc.id)) + _dec(toa_after.get(acc.id))
        rows.append({
            'id': acc.id,
            'name': acc.Akaunt_name,
            'aina': acc.aina,
            'amount': hist,
        })
    return rows


def _received_by_account(duka, shifts):
    windows = _shift_time_windows(shifts)
    if not windows:
        return []
    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    qs = wekaCash.objects.filter(
        Interprise=duka.id,
        tarehe__gte=range_start,
        tarehe__lte=range_end,
    ).values('Akaunt_id', 'Akaunt__Akaunt_name', 'Akaunt__aina', 'tarehe', 'Amount')
    totals = {}
    for row in qs:
        event_at = row.get('tarehe')
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        key = row.get('Akaunt_id') or 0
        if key not in totals:
            totals[key] = {
                'id': key,
                'name': row.get('Akaunt__Akaunt_name') or '—',
                'aina': row.get('Akaunt__aina') or '',
                'amount': Decimal('0'),
            }
        totals[key]['amount'] += _dec(row.get('Amount'))
    return list(totals.values())


def _live_account_rows(duka):
    return [
        {
            'id': a.id,
            'name': a.Akaunt_name,
            'aina': a.aina,
            'amount': _dec(a.Amount),
        }
        for a in PaymentAkaunts.objects.filter(Interprise=duka.id).order_by('aina', 'Akaunt_name')
    ]


def period_cash_account_breakdowns(duka, shifts):
    """Per payment-account split for period opening, closing, live current, and money received."""
    empty = _pack_account_breakdown([])
    current_rows = _live_account_rows(duka)
    current_pack = _pack_account_breakdown(
        current_rows, as_of=timezone.now(), source='current',
    )
    dated = [s for s in shifts if getattr(s, 'starts_at', None)]
    dated.sort(key=lambda s: s.starts_at)
    if not dated:
        return {
            'opening': empty,
            'closing': empty,
            'current': current_pack,
            'received': empty,
        }

    first, last = dated[0], dated[-1]
    calendar = any(getattr(s, 'calendar', False) for s in dated)
    use_open_snap = (not calendar) and getattr(first, 'use_opening_snapshot', True)
    use_close_snap = (not calendar) and getattr(
        last, 'use_closing_snapshot', last.status == 'closed' and bool(last.ends_at),
    )
    recon_opening = _account_balances_at(duka, first.starts_at)
    closing_at = last.ends_at or timezone.now()
    if calendar or not use_open_snap:
        opening_rows = recon_opening
        opening_source = 'reconstructed'
        if use_close_snap:
            closing_sid = _shift_snapshot_id(last, 'CLOSING_SNAPSHOT')
            closing_rows = _account_rows_from_snapshot(closing_sid)
            closing_source = 'snapshot'
            if not closing_rows:
                closing_rows = _account_balances_at(duka, closing_at)
                closing_source = 'reconstructed'
        elif last.ends_at and last.ends_at < timezone.now() - timedelta(seconds=30):
            closing_rows = _account_balances_at(duka, last.ends_at)
            closing_source = 'reconstructed'
        else:
            closing_rows = current_rows
            closing_source = 'current'
            closing_at = timezone.now()
    else:
        opening_sid = _shift_snapshot_id(first, 'OPENING_SNAPSHOT')
        opening_rows = _account_rows_from_snapshot(opening_sid)
        opening_source = 'snapshot'
        if not opening_rows:
            opening_rows = recon_opening
            opening_source = 'reconstructed'
        else:
            snap_total = sum((_dec(r.get('amount')) for r in opening_rows), Decimal('0'))
            recon_total = sum((_dec(r.get('amount')) for r in recon_opening), Decimal('0'))
            if abs(snap_total - recon_total) > Decimal('0.01'):
                opening_rows = recon_opening
                opening_source = 'reconstructed'

        closing_sid = _shift_snapshot_id(last, 'CLOSING_SNAPSHOT') if use_close_snap else None
        closing_rows = _account_rows_from_snapshot(closing_sid)
        closing_source = 'snapshot'
        if not closing_rows:
            if last.ends_at and (use_close_snap or last.ends_at < timezone.now() - timedelta(seconds=30)):
                closing_rows = _account_balances_at(duka, last.ends_at)
                closing_source = 'reconstructed'
            else:
                closing_rows = current_rows
                closing_source = 'current'
                closing_at = timezone.now()

    return {
        'opening': _pack_account_breakdown(
            opening_rows, as_of=first.starts_at, shift_code=first.code, source=opening_source,
        ),
        'closing': _pack_account_breakdown(
            closing_rows, as_of=closing_at, shift_code=last.code, source=closing_source,
        ),
        'current': current_pack,
        'received': _pack_account_breakdown(
            _received_by_account(duka, dated), source='movements',
        ),
    }


def _qty_str(value):
    d = _dec(value)
    if d == d.to_integral_value():
        return str(int(d))
    return format(d.quantize(Decimal('0.001')), 'f').rstrip('0').rstrip('.')


def _sale_line_unit_cost(line):
    """Purchase cost of one sold unit: wholesale buy if jum, else retail (buy / ratio)."""
    produ = getattr(line, 'produ', None)
    if not produ:
        return Decimal('0')
    sell = _dec(line.bei)
    bidhaa = produ.bidhaa if produ.bidhaa_id else None
    ratio = _dec(getattr(bidhaa, 'idadi_jum', 1) or 1)
    if ratio == 0:
        ratio = Decimal('1')
    buy = _dec(produ.Bei_kununua)
    retail_cost = buy / ratio
    if line.jum and abs(sell - buy) <= abs(sell - retail_cost):
        return buy
    return retail_cost


def period_sales_item_breakdown(duka, shifts):
    """Sold items in the same shift windows as Sales / Income."""
    empty = {
        'rows': [],
        'total': '0.00',
        'cost_total': '0.00',
        'qty_total': '0',
        'count': 0,
    }
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty
    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    grouped = {}
    for line in completed_sale_lines_qs(duka, range_start, range_end).select_related(
        'produ__bidhaa__bidhaa_aina',
    ):
        event_at = getattr(line, 'event_at', None)
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        net_qty = _dec(line.idadi) - _dec(line.returned) - _dec(line.serviceReturn)
        if net_qty <= 0:
            continue
        produ = line.produ
        name = '—'
        unit_cost = _sale_line_unit_cost(line)
        item_id = 0
        sell = _dec(line.bei)
        aina = None
        if produ:
            item_id = produ.id
            name = produ.bidhaa.bidhaa_jina if produ.bidhaa_id else '—'
            if produ.bidhaa_id and produ.bidhaa:
                aina = produ.bidhaa.bidhaa_aina
        key = (item_id, _qty2(sell), _qty2(unit_cost))
        if key not in grouped:
            grouped[key] = {
                'name': name or '—',
                'sell': sell,
                'qty': Decimal('0'),
                'cost': unit_cost,
                'value': Decimal('0'),
                'cost_value': Decimal('0'),
                'aina_id': aina.id if aina else -1,
                'aina_name': ((aina.aina or '').strip() if aina else ''),
            }
        grouped[key]['qty'] += net_qty
        grouped[key]['value'] += net_qty * sell
        grouped[key]['cost_value'] += net_qty * unit_cost

    rows = sorted(grouped.values(), key=lambda r: (r['name'] or '').lower())
    qty_total = sum((r['qty'] for r in rows), Decimal('0'))
    value_total = sum((r['value'] for r in rows), Decimal('0'))
    cost_total = sum((r['cost_value'] for r in rows), Decimal('0'))
    return {
        'count': len(rows),
        'qty_total': _qty_str(qty_total),
        'cost_total': _qty2(cost_total),
        'total': _qty2(value_total),
        'rows': [
            {
                'name': r['name'],
                'sell': _qty2(r['sell']),
                'qty': _qty_str(r['qty']),
                'cost': _qty2(r['cost_value']),
                'value': _qty2(r['value']),
                'aina_id': r.get('aina_id') if r.get('aina_id') is not None else -1,
                'aina_name': r.get('aina_name') or '',
            }
            for r in rows
        ],
    }


def period_sales_staff_breakdown(duka, shifts):
    """Completed sales by recorder / waiter: total, paid, remaining debt."""
    empty = {
        'count': 0,
        'total': '0.00',
        'paid_total': '0.00',
        'debt_total': '0.00',
        'rows': [],
    }
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    sales = completed_sales_qs(duka, range_start, range_end).exclude(full_returned=True).select_related(
        'By__user__user',
        'By__fanyakazi',
        'By__user_entp__Interprise',
        'waiter_order__user__user',
        'waiter_order__fanyakazi',
        'waiter_order__user_entp__Interprise',
    )

    grouped = {}
    for sale in sales:
        event_at = getattr(sale, 'event_at', None)
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        amount = _dec(sale.amount)
        paid_amt, debt = _sale_paid_and_debt(sale.amount, sale.ilolipwa)
        actor = sale.waiter_order if sale.waiter_order_id else sale.By
        key = actor.id if actor else 0
        role = 'waiter' if sale.waiter_order_id else 'recorder'
        if key not in grouped:
            grouped[key] = {
                'name': staff_display_name(actor),
                'role': role,
                'total': Decimal('0'),
                'paid': Decimal('0'),
                'debt': Decimal('0'),
            }
        elif grouped[key]['role'] and grouped[key]['role'] != role:
            grouped[key]['role'] = 'both'
        grouped[key]['total'] += amount
        grouped[key]['paid'] += paid_amt
        grouped[key]['debt'] += debt

    rows = sorted(grouped.values(), key=lambda r: (-r['total'], (r.get('name') or '').lower()))
    total = sum((r['total'] for r in rows), Decimal('0'))
    paid_total = sum((r['paid'] for r in rows), Decimal('0'))
    debt_total = sum((r['debt'] for r in rows), Decimal('0'))
    return {
        'count': len(rows),
        'total': _qty2(total),
        'paid_total': _qty2(paid_total),
        'debt_total': _qty2(debt_total),
        'rows': [
            {
                'name': r['name'] or '—',
                'role': r['role'] or '',
                'total': _qty2(r['total']),
                'paid': _qty2(r['paid']),
                'debt': _qty2(r['debt']),
            }
            for r in rows
        ],
    }


def period_sales_category_breakdown(duka, shifts):
    """Sold amounts grouped by item category (bidhaa_aina)."""
    empty = {
        'count': 0,
        'total': '0.00',
        'cost_total': '0.00',
        'qty_total': '0',
        'rows': [],
    }
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty
    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    grouped = {}
    for line in completed_sale_lines_qs(duka, range_start, range_end).select_related(
        'produ__bidhaa__bidhaa_aina',
    ):
        event_at = getattr(line, 'event_at', None)
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        net_qty = _dec(line.idadi) - _dec(line.returned) - _dec(line.serviceReturn)
        if net_qty <= 0:
            continue
        cat = None
        produ = line.produ
        if produ and produ.bidhaa_id and produ.bidhaa:
            cat = produ.bidhaa.bidhaa_aina
        cat_id = cat.id if cat else 0
        cat_name = ((cat.aina or '').strip() if cat else '')
        unit_cost = _sale_line_unit_cost(line)
        if cat_id not in grouped:
            grouped[cat_id] = {
                'name': cat_name,
                'qty': Decimal('0'),
                'value': Decimal('0'),
                'cost': Decimal('0'),
            }
        grouped[cat_id]['qty'] += net_qty
        grouped[cat_id]['value'] += net_qty * _dec(line.bei)
        grouped[cat_id]['cost'] += net_qty * unit_cost

    rows = sorted(
        grouped.values(),
        key=lambda r: (0 if r['name'] else 1, (r['name'] or '').lower()),
    )
    qty_total = sum((r['qty'] for r in rows), Decimal('0'))
    value_total = sum((r['value'] for r in rows), Decimal('0'))
    cost_total = sum((r['cost'] for r in rows), Decimal('0'))
    return {
        'count': len(rows),
        'qty_total': _qty_str(qty_total),
        'cost_total': _qty2(cost_total),
        'total': _qty2(value_total),
        'rows': [
            {
                'name': r['name'],
                'qty': _qty_str(r['qty']),
                'cost': _qty2(r['cost']),
                'value': _qty2(r['value']),
            }
            for r in rows
        ],
    }


def sales_time_grain(start, end):
    """Month buckets when the selected period is longer than three months."""
    if not start or not end:
        return 'date'
    months = (end.year - start.year) * 12 + (end.month - start.month)
    if end.day < start.day:
        months -= 1
    return 'month' if months > 3 else 'date'


def _event_local(event_at, tzinfo=None):
    if not event_at:
        return None
    if timezone.is_naive(event_at):
        event_at = timezone.make_aware(event_at, timezone.get_current_timezone())
    if tzinfo is not None:
        return event_at.astimezone(tzinfo)
    return timezone.localtime(event_at)


def _empty_sales_time(grain):
    return {
        'grain': grain or 'date',
        'count': 0,
        'total': '0.00',
        'cost_total': '0.00',
        'qty_total': '0',
        'rows': [],
    }


def period_sales_time_breakdown(duka, shifts, grain='date', tzinfo=None):
    """Sold qty and value grouped by calendar date or month in shift windows."""
    grain = 'month' if grain == 'month' else 'date'
    empty = _empty_sales_time(grain)
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty
    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    grouped = {}
    for line in completed_sale_lines_qs(duka, range_start, range_end).select_related(
        'produ__bidhaa',
    ):
        event_at = getattr(line, 'event_at', None)
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        net_qty = _dec(line.idadi) - _dec(line.returned) - _dec(line.serviceReturn)
        if net_qty <= 0:
            continue
        local = _event_local(event_at, tzinfo)
        if not local:
            continue
        key = local.strftime('%Y-%m') if grain == 'month' else local.strftime('%Y-%m-%d')
        unit_cost = _sale_line_unit_cost(line)
        if key not in grouped:
            grouped[key] = {
                'key': key,
                'qty': Decimal('0'),
                'value': Decimal('0'),
                'cost': Decimal('0'),
            }
        grouped[key]['qty'] += net_qty
        grouped[key]['value'] += net_qty * _dec(line.bei)
        grouped[key]['cost'] += net_qty * unit_cost
    rows = [grouped[k] for k in sorted(grouped)]
    qty_total = sum((r['qty'] for r in rows), Decimal('0'))
    value_total = sum((r['value'] for r in rows), Decimal('0'))
    cost_total = sum((r['cost'] for r in rows), Decimal('0'))
    return {
        'grain': grain,
        'count': len(rows),
        'qty_total': _qty_str(qty_total),
        'cost_total': _qty2(cost_total),
        'total': _qty2(value_total),
        'rows': [
            {
                'key': r['key'],
                'qty': _qty_str(r['qty']),
                'cost': _qty2(r['cost']),
                'value': _qty2(r['value']),
            }
            for r in rows
        ],
    }


def coalesce_sales_time_breakdown(pack, grain='date'):
    """Merge concatenated multi-shop date/month rows."""
    grain = (pack or {}).get('grain') or grain or 'date'
    if grain != 'month':
        grain = 'date'
    grouped = {}
    for row in (pack or {}).get('rows') or []:
        key = str(row.get('key') or '')
        if not key:
            continue
        if key not in grouped:
            grouped[key] = {
                'key': key,
                'qty': Decimal('0'),
                'value': Decimal('0'),
                'cost': Decimal('0'),
            }
        grouped[key]['qty'] += _dec(row.get('qty'))
        grouped[key]['value'] += _dec(row.get('value'))
        grouped[key]['cost'] += _dec(row.get('cost'))
    rows = [grouped[k] for k in sorted(grouped)]
    qty_total = sum((r['qty'] for r in rows), Decimal('0'))
    value_total = sum((r['value'] for r in rows), Decimal('0'))
    cost_total = sum((r['cost'] for r in rows), Decimal('0'))
    return {
        'grain': grain,
        'count': len(rows),
        'qty_total': _qty_str(qty_total),
        'cost_total': _qty2(cost_total),
        'total': _qty2(value_total),
        'rows': [
            {
                'key': r['key'],
                'qty': _qty_str(r['qty']),
                'cost': _qty2(r['cost']),
                'value': _qty2(r['value']),
            }
            for r in rows
        ],
    }


def staff_display_name(staff_perm):
    if not staff_perm:
        return 'Unknown'
    user_extend = getattr(staff_perm, 'user', None)
    auth_user = getattr(user_extend, 'user', None) if user_extend else None
    first_name = (getattr(auth_user, 'first_name', '') or '').strip() if auth_user else ''
    last_name = (getattr(auth_user, 'last_name', '') or '').strip() if auth_user else ''
    full_name = (f'{first_name} {last_name}').strip()
    if not full_name:
        full_name = (
            auth_user.get_full_name().strip()
            if auth_user and hasattr(auth_user, 'get_full_name') and auth_user.get_full_name()
            else (auth_user.username if auth_user else '')
        )
    if not full_name and getattr(staff_perm, 'fanyakazi', None):
        full_name = (staff_perm.fanyakazi.jina or '').strip()

    entp_code = ''
    user_entp = getattr(staff_perm, 'user_entp', None)
    if user_entp and getattr(user_entp, 'Interprise', None):
        entp_code = (user_entp.Interprise.Intp_code or '').strip()

    if full_name and entp_code:
        return f'{full_name} ({entp_code})'
    if full_name:
        return full_name
    if entp_code:
        return entp_code
    return 'Unknown'


def _sale_paid_and_debt(amount, ilolipwa):
    amt = _dec(amount)
    paid_amt = _dec(ilolipwa)
    if paid_amt < 0:
        paid_amt = Decimal('0')
    if paid_amt > amt:
        paid_amt = amt
    debt = amt - paid_amt
    if debt < 0:
        debt = Decimal('0')
    return paid_amt, debt


def _sale_remaining_debt(amount, ilolipwa):
    return _sale_paid_and_debt(amount, ilolipwa)[1]


def recorder_shift_sales_summary(duka, shift, recorder):
    """Completed POS sales by the shift recorder (not waiter orders) in this shift window."""
    empty = {
        'total': Decimal('0'),
        'paid': Decimal('0'),
        'debt': Decimal('0'),
        'invoices': [],
    }
    if not shift or not shift.starts_at:
        return empty
    period_end = shift.ends_at or timezone.now()
    owned_from, start_exclusive = _shift_window_lower(duka, shift.starts_at)
    qs = completed_sales_qs(
        duka, owned_from, period_end,
        start_exclusive=start_exclusive,
    ).exclude(full_returned=True).filter(
        waiter_order__isnull=True,
    )
    if recorder:
        qs = qs.filter(By=recorder)
    invoices = []
    total = Decimal('0')
    paid = Decimal('0')
    for sale in qs.order_by('tarehe', 'id'):
        amt = _dec(sale.amount)
        paid_amt, debt = _sale_paid_and_debt(sale.amount, sale.ilolipwa)
        total += amt
        paid += paid_amt
        invoices.append({
            'id': sale.id,
            'code': sale.code or '',
            'amount': amt,
            'paid': paid_amt,
            'debt': debt,
        })
    debt = total - paid
    if debt < 0:
        debt = Decimal('0')
    return {
        'total': total,
        'paid': paid,
        'debt': debt,
        'invoices': invoices,
    }


def _bump_money_group(group_map, key, name, role, amount):
    if amount <= 0:
        return
    if key not in group_map:
        group_map[key] = {
            'name': name or '—',
            'role': role or '',
            'amount': Decimal('0'),
        }
    elif role and group_map[key]['role'] and group_map[key]['role'] != role:
        group_map[key]['role'] = 'both'
    group_map[key]['amount'] += amount


def _pack_unpaid_group(rows):
    rows = sorted(rows, key=lambda r: (-_dec(r.get('amount')), (r.get('name') or '').lower()))
    total = sum((_dec(r.get('amount')) for r in rows), Decimal('0'))
    return {
        'count': len(rows),
        'total': _qty2(total),
        'rows': [
            {
                'name': r.get('name') or '—',
                'role': r.get('role') or '',
                'amount': _qty2(r.get('amount')),
            }
            for r in rows
        ],
    }


def period_unpaid_breakdowns(duka, shifts):
    """Unpaid and paid portions of completed sales, by recorder/waiter and saved customers."""
    empty = _pack_unpaid_group([])
    empty_pair = {'staff': empty, 'customers': empty}
    windows = _shift_time_windows(shifts)
    if not windows:
        return {**empty_pair, 'paid': empty_pair}

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    sales = completed_sales_qs(duka, range_start, range_end).exclude(full_returned=True).select_related(
        'By__user__user',
        'By__fanyakazi',
        'By__user_entp__Interprise',
        'waiter_order__user__user',
        'waiter_order__fanyakazi',
        'waiter_order__user_entp__Interprise',
        'customer_id',
    )

    unpaid_staff = {}
    unpaid_customers = {}
    paid_staff = {}
    paid_customers = {}
    for sale in sales:
        event_at = getattr(sale, 'event_at', None)
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        paid_amt, debt = _sale_paid_and_debt(sale.amount, sale.ilolipwa)
        actor = sale.waiter_order if sale.waiter_order_id else sale.By
        staff_key = actor.id if actor else 0
        role = 'waiter' if sale.waiter_order_id else 'recorder'
        staff_name = staff_display_name(actor)
        _bump_money_group(unpaid_staff, staff_key, staff_name, role, debt)
        _bump_money_group(paid_staff, staff_key, staff_name, role, paid_amt)
        if sale.customer_id_id:
            cust = sale.customer_id
            cust_name = (cust.jina if cust else '') or '—'
            _bump_money_group(unpaid_customers, sale.customer_id_id, cust_name, '', debt)
            _bump_money_group(paid_customers, sale.customer_id_id, cust_name, '', paid_amt)

    return {
        'staff': _pack_unpaid_group(list(unpaid_staff.values())),
        'customers': _pack_unpaid_group(list(unpaid_customers.values())),
        'paid': {
            'staff': _pack_unpaid_group(list(paid_staff.values())),
            'customers': _pack_unpaid_group(list(paid_customers.values())),
        },
    }


def _iso(dt):
    if not dt:
        return ''
    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt, timezone.utc)
    return dt.isoformat()


def _empty_expense_time(grain):
    return {
        'grain': grain or 'date',
        'count': 0,
        'total': '0.00',
        'times_total': 0,
        'rows': [],
    }


def coalesce_expense_time_breakdown(pack, grain='date'):
    grain = (pack or {}).get('grain') or grain or 'date'
    if grain != 'month':
        grain = 'date'
    grouped = {}
    for row in (pack or {}).get('rows') or []:
        key = str(row.get('key') or '')
        if not key:
            continue
        if key not in grouped:
            grouped[key] = {
                'key': key,
                'times': 0,
                'amount': Decimal('0'),
            }
        grouped[key]['times'] += int(row.get('times') or 0)
        grouped[key]['amount'] += _dec(row.get('amount'))
    rows = [grouped[k] for k in sorted(grouped)]
    times_total = sum((r['times'] for r in rows), 0)
    amount_total = sum((r['amount'] for r in rows), Decimal('0'))
    return {
        'grain': grain,
        'count': len(rows),
        'times_total': times_total,
        'total': _qty2(amount_total),
        'rows': [
            {
                'key': r['key'],
                'times': r['times'],
                'amount': _qty2(r['amount']),
            }
            for r in rows
        ],
    }


def period_expenses_breakdowns(duka, shifts, grain='date', tzinfo=None):
    """Operating expenses (toaCash.matumizi) as records, types, and date/month."""
    grain = 'month' if grain == 'month' else 'date'
    empty_records = {'count': 0, 'total': '0.00', 'rows': []}
    empty_types = {'count': 0, 'total': '0.00', 'rows': []}
    empty_time = _empty_expense_time(grain)
    windows = _shift_time_windows(shifts)
    if not windows:
        return {'records': empty_records, 'types': empty_types, 'time': empty_time}

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    qs = toaCash.objects.filter(
        Interprise=duka.id,
        matumizi__isnull=False,
        tarehe__gte=range_start,
        tarehe__lte=range_end,
    ).select_related(
        'by__user__user',
        'by__fanyakazi',
        'by__user_entp__Interprise',
        'matumizi__matumizi',
    ).order_by('-tarehe', '-id')

    records = []
    types_map = {}
    time_map = {}
    for row in qs:
        event_at = row.tarehe
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        amount = _dec(row.Amount)
        rec = row.matumizi
        expense_name = '—'
        type_key = 0
        note = (row.maelezo or '').strip()
        if rec:
            type_key = rec.matumizi_id or rec.id
            if rec.matumizi_id and rec.matumizi:
                expense_name = (rec.matumizi.matumizi or '').strip() or '—'
            if not note:
                note = (rec.maelezo or '').strip()
        records.append({
            'at': _iso(event_at),
            'name': staff_display_name(row.by),
            'note': note,
            'expense': expense_name,
            'amount': _qty2(amount),
        })
        if type_key not in types_map:
            types_map[type_key] = {
                'name': expense_name,
                'times': 0,
                'amount': Decimal('0'),
            }
        types_map[type_key]['times'] += 1
        types_map[type_key]['amount'] += amount
        local = _event_local(event_at, tzinfo)
        if local:
            tkey = local.strftime('%Y-%m') if grain == 'month' else local.strftime('%Y-%m-%d')
            if tkey not in time_map:
                time_map[tkey] = {
                    'key': tkey,
                    'times': 0,
                    'amount': Decimal('0'),
                }
            time_map[tkey]['times'] += 1
            time_map[tkey]['amount'] += amount

    records_total = sum((_dec(r['amount']) for r in records), Decimal('0'))
    type_rows = sorted(
        types_map.values(),
        key=lambda r: (-_dec(r['amount']), (r.get('name') or '').lower()),
    )
    types_total = sum((r['amount'] for r in type_rows), Decimal('0'))
    time_rows = [time_map[k] for k in sorted(time_map)]
    time_total = sum((r['amount'] for r in time_rows), Decimal('0'))
    times_total = sum((r['times'] for r in time_rows), 0)
    return {
        'records': {
            'count': len(records),
            'total': _qty2(records_total),
            'rows': records,
        },
        'types': {
            'count': len(type_rows),
            'times_total': sum((r['times'] for r in type_rows), 0),
            'total': _qty2(types_total),
            'rows': [
                {
                    'name': r['name'],
                    'times': r['times'],
                    'amount': _qty2(r['amount']),
                }
                for r in type_rows
            ],
        },
        'time': {
            'grain': grain,
            'count': len(time_rows),
            'times_total': times_total,
            'total': _qty2(time_total),
            'rows': [
                {
                    'key': r['key'],
                    'times': r['times'],
                    'amount': _qty2(r['amount']),
                }
                for r in time_rows
            ],
        },
    }


def _account_name(account, fallback=''):
    if account and getattr(account, 'Akaunt_name', None):
        name = (account.Akaunt_name or '').strip()
        if name:
            return name
    return (fallback or '').strip() or '—'


def period_cash_deposit_breakdown(duka, shifts):
    """Cash deposits (toaCash.deposit_to) in the same shift windows as the KPI."""
    empty = {'count': 0, 'total': '0.00', 'rows': []}
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    qs = toaCash.objects.filter(
        Interprise=duka.id,
        deposit_to__isnull=False,
        tarehe__gte=range_start,
        tarehe__lte=range_end,
    ).select_related(
        'Akaunt',
        'deposit_to__Akaunt',
    ).order_by('-tarehe', '-id')

    rows = []
    total = Decimal('0')
    for row in qs:
        event_at = row.tarehe
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        amount = _dec(row.Amount)
        dest = row.deposit_to
        rows.append({
            'at': _iso(event_at),
            'cash_account': _account_name(row.Akaunt),
            'to_account': _account_name(dest.Akaunt if dest else None, row.kwenda),
            'before': _qty2(row.before),
            'after': _qty2(row.After),
            'amount': _qty2(amount),
        })
        total += amount

    return {
        'count': len(rows),
        'total': _qty2(total),
        'rows': rows,
    }


def _empty_prior_party_pack():
    return {
        'count': 0,
        'total': '0.00',
        'paid_total': '0.00',
        'remaining_total': '0.00',
        'rows': [],
    }


def _pack_prior_party_rows(grouped):
    rows = sorted(
        grouped.values(),
        key=lambda r: (-r['paid'], -r['owed'], (r.get('name') or '').lower()),
    )
    owed_total = sum((r['owed'] for r in rows), Decimal('0'))
    paid_total = sum((r['paid'] for r in rows), Decimal('0'))
    remaining_total = sum((r['remaining'] for r in rows), Decimal('0'))
    return {
        'count': len(rows),
        'total': _qty2(owed_total),
        'paid_total': _qty2(paid_total),
        'remaining_total': _qty2(remaining_total),
        'rows': [
            {
                'name': r['name'] or '—',
                'role': r.get('role') or '',
                'owed': _qty2(r['owed']),
                'paid': _qty2(r['paid']),
                'remaining': _qty2(r['remaining']),
            }
            for r in rows
        ],
    }


def period_prior_invoice_payments(duka, shifts, period_start=None):
    """Payments received in these shifts for sales/waiter orders dated before the period."""
    empty_records = {'count': 0, 'total': '0.00', 'rows': []}
    empty_party = _empty_prior_party_pack()
    empty = {
        'count': 0,
        'total': '0.00',
        'rows': [],
        'records': empty_records,
        'staff': empty_party,
        'customers': empty_party,
    }
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    cutoff = period_start or range_start
    invo_related = tuple(f'invo__{field}' for field in _SALE_PARTY_RELATED)
    qs = wekaCash.objects.filter(
        Interprise=duka.id,
        tarehe__gte=range_start,
        tarehe__lte=range_end,
    ).filter(
        Q(invo__isnull=False, invo__cart=False, invo__ignore=False)
        | Q(from_waiter_payments__isnull=False)
        | Q(mauzo=True)
        | Q(order=True)
        | Q(huduma=True)
    ).select_related(
        'Akaunt',
        'by__user__user',
        'by__fanyakazi',
        'by__user_entp__Interprise',
        'invo',
        'from_waiter_payments',
        *invo_related,
    ).prefetch_related(_weka_sales_prefetch()).annotate(
        sale_at=sale_event_at('invo__'),
    ).order_by('-tarehe', '-id')

    rows = []
    total = Decimal('0')
    sale_paid = {}
    for row in qs:
        paid_at = row.tarehe
        if not paid_at:
            continue
        if not any(start <= paid_at <= end for _, start, end in windows):
            continue
        if _weka_is_internal(row) or not _weka_is_sales(row):
            continue
        prior_amt, _, prior_sales, _, prior_alloc = _weka_prior_current_split(row, cutoff)
        if prior_amt <= 0:
            continue
        item = _weka_sales_item(row, prior_amt, prior_sales)
        rows.append(item)
        total += prior_amt
        for sale, take in prior_alloc:
            if not sale or not sale.id:
                continue
            info = sale_paid.setdefault(sale.id, {'sale': sale, 'paid': Decimal('0')})
            info['paid'] += _dec(take)

    staff_map = {}
    customer_map = {}
    for info in sale_paid.values():
        sale = info['sale']
        period_paid = info['paid']
        _, remaining = _sale_paid_and_debt(sale.amount, sale.ilolipwa)
        owed = period_paid + remaining
        actor = sale.waiter_order if sale.waiter_order_id else sale.By
        staff_key = actor.id if actor else 0
        role = 'waiter' if sale.waiter_order_id else 'recorder'
        if staff_key not in staff_map:
            staff_map[staff_key] = {
                'name': staff_display_name(actor),
                'role': role,
                'owed': Decimal('0'),
                'paid': Decimal('0'),
                'remaining': Decimal('0'),
            }
        elif staff_map[staff_key]['role'] and staff_map[staff_key]['role'] != role:
            staff_map[staff_key]['role'] = 'both'
        staff_map[staff_key]['owed'] += owed
        staff_map[staff_key]['paid'] += period_paid
        staff_map[staff_key]['remaining'] += remaining

        if not sale.customer_id_id:
            continue
        cust = sale.customer_id
        cust_name = ((cust.jina if cust else '') or '').strip() or '—'
        cust_key = sale.customer_id_id
        if cust_key not in customer_map:
            customer_map[cust_key] = {
                'name': cust_name,
                'role': '',
                'owed': Decimal('0'),
                'paid': Decimal('0'),
                'remaining': Decimal('0'),
            }
        customer_map[cust_key]['owed'] += owed
        customer_map[cust_key]['paid'] += period_paid
        customer_map[cust_key]['remaining'] += remaining

    records = {
        'count': len(rows),
        'total': _qty2(total),
        'rows': rows,
    }
    return {
        'count': records['count'],
        'total': records['total'],
        'rows': rows,
        'records': records,
        'staff': _pack_prior_party_rows(staff_map),
        'customers': _pack_prior_party_rows(customer_map),
    }


def period_external_account_in(duka, shifts):
    """Money added to this branch's accounts from the Transactions deposit modal or other enterprises."""
    empty = {'count': 0, 'total': '0.00', 'rows': []}
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    qs = wekaCash.objects.filter(
        Interprise=duka.id,
        invo__isnull=True,
        mauzo=False,
        order=False,
        huduma=False,
        from_waiter_payments__isnull=True,
        tarehe__gte=range_start,
        tarehe__lte=range_end,
    ).filter(
        Q(kuhamisha=False) | Q(kuhamishaNje=True),
    ).select_related(
        'Akaunt',
        'huduma_nyingine',
        'by__user__user',
        'by__fanyakazi',
        'by__user_entp__Interprise',
    ).order_by('-tarehe', '-id')

    rows = []
    total = Decimal('0')
    for row in qs:
        event_at = row.tarehe
        if not event_at:
            continue
        if not any(start <= event_at <= end for _, start, end in windows):
            continue
        from_name = (row.kutoka or '').strip()
        if row.huduma_nyingine_id and row.huduma_nyingine:
            from_name = (row.huduma_nyingine.huduma or from_name).strip() or from_name
        amount = _dec(row.Amount)
        rows.append({
            'at': _iso(event_at),
            'account': _account_name(row.Akaunt),
            'source': from_name or '—',
            'note': (row.maelezo or '').strip(),
            'name': staff_display_name(row.by),
            'amount': _qty2(amount),
        })
        total += amount

    return {
        'count': len(rows),
        'total': _qty2(total),
        'rows': rows,
    }


def _empty_flow_pack():
    return {'count': 0, 'total': '0.00', 'rows': []}


def _flow_pack(rows):
    total = sum((_dec(r.get('amount')) for r in rows), Decimal('0'))
    return {
        'count': len(rows),
        'total': _qty2(total),
        'rows': rows,
    }


def _weka_is_internal(row):
    return bool(row.kuhamisha and not row.kuhamishaNje)


def _toa_is_internal(row):
    return bool(row.deposit_to_id) or bool(row.kuhamisha and not row.kuhamishaNje)


def _weka_is_sales(row):
    return bool(
        row.invo_id
        or row.mauzo
        or row.huduma
        or row.order
        or row.from_waiter_payments_id
    )


def _sale_when(sale):
    if not sale:
        return None
    if sale.waiter_order_id and sale.Packed_at:
        return sale.Packed_at
    return sale.tarehe


def _sale_customer(sale):
    if not sale:
        return ''
    if sale.customer_id_id and sale.customer_id:
        name = (sale.customer_id.jina or '').strip()
        if name:
            return name
    return (sale.mteja_jina or '').strip()


def _waiter_clearing_label(row):
    raw = (row.kutoka or '').strip()
    lower = raw.lower()
    if 'waiter clearing' in lower and '-' in raw:
        return raw.split('-', 1)[-1].strip() or raw
    return raw


_SALE_PARTY_RELATED = (
    'customer_id',
    'By__user__user',
    'By__fanyakazi',
    'By__user_entp__Interprise',
    'waiter_order__user__user',
    'waiter_order__fanyakazi',
    'waiter_order__user_entp__Interprise',
)


def _weka_related_sales(row):
    clearing = getattr(row, 'from_waiter_payments', None)
    if clearing is not None:
        sales = list(getattr(clearing, 'cleared_sales', None) or [])
        if not sales and row.from_waiter_payments_id:
            sales = list(
                mauzoni.objects.filter(
                    waiter_order_cleared_id=row.from_waiter_payments_id,
                    cart=False,
                    ignore=False,
                ).select_related(*_SALE_PARTY_RELATED)
            )
        if sales:
            return sales
    if row.invo_id and row.invo and not row.invo.cart and not row.invo.ignore:
        return [row.invo]
    return []


def _weka_sales_prefetch():
    return Prefetch(
        'from_waiter_payments__mauzoni_set',
        queryset=mauzoni.objects.filter(cart=False, ignore=False).select_related(*_SALE_PARTY_RELATED),
        to_attr='cleared_sales',
    )


def _codes_from_sales(sales, fallback=''):
    codes = []
    seen = set()
    for sale in sales or []:
        code = (sale.code or '').strip()
        if code and code not in seen:
            seen.add(code)
            codes.append(code)
    if codes:
        return ', '.join(codes)
    return (fallback or '').strip() or '—'


def _weka_prior_current_split(row, cutoff):
    """Split a sales weka into prior vs current by related sale dates."""
    amount = _dec(row.Amount)
    sales = _weka_related_sales(row)
    if not sales:
        return Decimal('0'), amount, [], sales, []
    remaining = amount
    prior_amt = Decimal('0')
    current_amt = Decimal('0')
    prior_sales = []
    current_sales = []
    prior_alloc = []
    ordered = sorted(sales, key=lambda s: (s.id or 0))
    for sale in ordered:
        if remaining <= 0:
            break
        take = min(_dec(sale.amount), remaining)
        if take <= 0:
            take = remaining
        when = _sale_when(sale)
        if when and cutoff and when < cutoff:
            prior_amt += take
            prior_sales.append(sale)
            prior_alloc.append((sale, take))
        else:
            current_amt += take
            current_sales.append(sale)
        remaining -= take
    if remaining > 0:
        last = ordered[-1]
        when = _sale_when(last)
        if when and cutoff and when < cutoff:
            prior_amt += remaining
            if last not in prior_sales:
                prior_sales.append(last)
            prior_alloc.append((last, remaining))
        else:
            current_amt += remaining
            if last not in current_sales:
                current_sales.append(last)
    return prior_amt, current_amt, prior_sales, current_sales, prior_alloc


def _weka_sales_item(row, amount, sales):
    sale = sales[0] if sales else getattr(row, 'invo', None)
    cust = _sale_customer(sale)
    if not cust:
        cust = _waiter_clearing_label(row)
    sale_at = None
    for item in sales or []:
        when = _sale_when(item)
        if when and (sale_at is None or when < sale_at):
            sale_at = when
    if sale_at is None:
        sale_at = _sale_when(sale) or getattr(row, 'sale_at', None)
    return {
        'at': _iso(row.tarehe),
        'sale_at': _iso(sale_at),
        'code': _codes_from_sales(sales, sale.code if sale else ''),
        'customer': cust or '—',
        'account': _account_name(row.Akaunt),
        'source': (row.kutoka or '').strip() or '—',
        'note': (row.maelezo or '').strip(),
        'name': staff_display_name(row.by),
        'amount': _qty2(amount),
    }


def period_sales_payments_by_account(duka, shifts, period_start=None):
    """Sales payments (wekaCash) received into each payment account during these shifts."""
    empty = _pack_account_breakdown([])
    windows = _shift_time_windows(shifts)
    if not windows:
        return empty

    range_start = min(start for _, start, _ in windows)
    range_end = max(end for _, _, end in windows)
    cutoff = period_start or range_start
    qs = wekaCash.objects.filter(
        Interprise=duka.id,
        tarehe__gte=range_start,
        tarehe__lte=range_end,
    ).select_related('Akaunt', 'invo', 'from_waiter_payments').prefetch_related(
        _weka_sales_prefetch(),
    ).annotate(sale_at=sale_event_at('invo__'))

    totals = {}
    for row in qs:
        paid_at = row.tarehe
        if not paid_at:
            continue
        if not any(start <= paid_at <= end for _, start, end in windows):
            continue
        if _weka_is_internal(row) or not _weka_is_sales(row):
            continue
        _, current_amt, _, _, _ = _weka_prior_current_split(row, cutoff)
        if current_amt <= 0:
            continue
        key = row.Akaunt_id or 0
        if key not in totals:
            totals[key] = {
                'id': key,
                'name': _account_name(row.Akaunt),
                'aina': (row.Akaunt.aina if row.Akaunt else '') or '',
                'amount': Decimal('0'),
            }
        totals[key]['amount'] += current_amt
    return _pack_account_breakdown(list(totals.values()), source='sales_payments')


def period_recon_movements(duka, shifts, period_start=None):
    """Ledger in/out between first-shift open and period close, excluding internal transfers."""
    empty = _empty_flow_pack()
    dated = [s for s in shifts if getattr(s, 'starts_at', None)]
    dated.sort(key=lambda s: s.starts_at)
    if not dated:
        return {
            'sales_in': empty,
            'bills': empty,
            'other_out': empty,
            'other_in': empty,
            'in_total': '0.00',
            'out_total': '0.00',
        }

    first, last = dated[0], dated[-1]
    opening_at = first.starts_at
    closing_at = last.ends_at or timezone.now()
    cutoff = period_start or opening_at
    calendar = any(getattr(s, 'calendar', False) for s in dated)
    period_slice = any(getattr(s, 'source_shift', None) for s in dated)
    weka_time = {'tarehe__lte': closing_at}
    toa_time = {'tarehe__lte': closing_at}
    if calendar or period_slice:
        weka_time['tarehe__gte'] = opening_at
        toa_time['tarehe__gte'] = opening_at
    else:
        weka_time['tarehe__gt'] = opening_at
        toa_time['tarehe__gt'] = opening_at

    wekas = wekaCash.objects.filter(
        Interprise=duka.id,
        **weka_time,
    ).select_related(
        'Akaunt',
        'huduma_nyingine',
        'by__user__user',
        'by__fanyakazi',
        'by__user_entp__Interprise',
        'invo',
        'invo__customer_id',
        'from_waiter_payments',
    ).prefetch_related(_weka_sales_prefetch()).annotate(
        sale_at=sale_event_at('invo__'),
    ).order_by('-tarehe', '-id')

    toas = toaCash.objects.filter(
        Interprise=duka.id,
        **toa_time,
    ).select_related(
        'Akaunt',
        'bill',
        'bill__supplier_id',
        'matumizi__matumizi',
        'by__user__user',
        'by__fanyakazi',
        'by__user_entp__Interprise',
    ).order_by('-tarehe', '-id')

    sales_in = []
    other_in = []
    bills = []
    other_out = []

    for row in wekas:
        if _weka_is_internal(row):
            continue
        amount = _dec(row.Amount)
        if _weka_is_sales(row):
            _, current_amt, _, current_sales, _ = _weka_prior_current_split(row, cutoff)
            if current_amt > 0:
                sales_in.append(_weka_sales_item(row, current_amt, current_sales))
            continue
        else:
            # External deposits are shown separately; keep leftovers only.
            if not row.invo_id and not row.mauzo and not row.order and not row.huduma and not row.from_waiter_payments_id:
                continue
            other_in.append({
                'at': _iso(row.tarehe),
                'sale_at': _iso(getattr(row, 'sale_at', None)),
                'code': '—',
                'customer': '—',
                'account': _account_name(row.Akaunt),
                'source': (row.kutoka or '').strip() or '—',
                'note': (row.maelezo or '').strip(),
                'name': staff_display_name(row.by),
                'amount': _qty2(amount),
            })

    for row in toas:
        if _toa_is_internal(row):
            continue
        amount = _dec(row.Amount)
        item = {
            'at': _iso(row.tarehe),
            'account': _account_name(row.Akaunt),
            'to': (row.kwenda or '').strip() or '—',
            'note': (row.maelezo or '').strip(),
            'name': staff_display_name(row.by),
            'amount': _qty2(amount),
        }
        if row.matumizi_id:
            continue
        if row.pu or row.bill_id:
            vendor = ''
            if row.bill_id and row.bill and row.bill.supplier_id_id and row.bill.supplier_id:
                vendor = (row.bill.supplier_id.jina or '').strip()
            item['vendor'] = vendor or '—'
            bills.append(item)
        else:
            other_out.append(item)

    sales_pack = _flow_pack(sales_in)
    bills_pack = _flow_pack(bills)
    other_out_pack = _flow_pack(other_out)
    other_in_pack = _flow_pack(other_in)
    in_total = _dec(sales_pack['total']) + _dec(other_in_pack['total'])
    out_total = _dec(bills_pack['total']) + _dec(other_out_pack['total'])
    return {
        'sales_in': sales_pack,
        'bills': bills_pack,
        'other_out': other_out_pack,
        'other_in': other_in_pack,
        'in_total': _qty2(in_total),
        'out_total': _qty2(out_total),
    }


def _snapshot_qty_map(activity):
    qty_map = defaultdict(lambda: Decimal('0'))
    if not activity or not activity.event_ref_id:
        return qty_map
    for row in ItemsState.objects.filter(state_id=activity.event_ref_id).values('sbidhaa_id', 'sidadi'):
        qty_map[row['sbidhaa_id']] = Decimal(row['sidadi'] or 0)
    return qty_map


def _dec_qty(val):
    return Decimal(str(val or 0))


def _stock_qty_map_at(duka, at_dt, closing=False, duka_ids=None):
    """Live lots rolled back to at_dt, using Packed_at for waiter sales.

    Opening and closing at the same instant match, except lots born at that
    instant (inbound) which belong to the new shift. Movements at at_dt already
    happened on the closing shift, so only later movements are rewound.
    """
    qty_map = defaultdict(lambda: Decimal('0'))
    if not at_dt:
        return qty_map
    items = list(
        bidhaa_stoku.objects.filter(
            Interprise_id__in=_shop_ids(duka, duka_ids),
            is_grouped_item=False,
            service=False,
        ).values(
            'id', 'idadi',
            'manunuzi__manunuzi__tarehe',
            'manunuzi__idadi',
            'ongezwa__date',
            'uhamisho__receive__transfer__tarehe',
            'uhamisho__qty',
            'produced__production__date',
            'produced__qty',
        )
    )
    ids = [row['id'] for row in items]
    delta = defaultdict(lambda: Decimal('0'))
    when_kw = 'gt'

    def _after(field):
        return {f'{field}__{when_kw}': at_dt}

    if ids:
        sales = mauzoList.objects.filter(
            produ_id__in=ids,
            mauzo__service=False,
            mauzo__order=False,
            mauzo__cart=False,
            mauzo__ignore=False,
        ).annotate(event_at=sale_event_at('mauzo__')).filter(
            **_after('event_at'),
        ).values_list('produ_id', 'idadi')
        for pid, qty in sales:
            delta[pid] += _dec_qty(qty)

        returns = sa_ret.objects.filter(
            sa_list__produ_id__in=ids,
            **_after('ret__tarehe'),
        ).values_list('sa_list__produ_id', 'idadi')
        for pid, qty in returns:
            delta[pid] -= _dec_qty(qty)

        transfers = transferList.objects.filter(
            toka_id__in=ids,
            kwenda__receive__transfer__order=False,
            **_after('kwenda__receive__transfer__tarehe'),
        ).values_list('toka_id', 'kwenda__qty')
        for pid, qty in transfers:
            delta[pid] += _dec_qty(qty)

        reductions = productChangeRecord.objects.filter(
            prod_id__in=ids,
            adjst__Ongezwa=False,
            **_after('adjst__date'),
        ).filter(
            Q(adjst__tumika=True) | Q(adjst__haribika=True) | Q(adjst__potea=True)
            | Q(adjst__expire=True) | Q(adjst__others=True) | Q(adjst__full_Return=True)
        ).values_list('prod_id', 'qty')
        for pid, qty in reductions:
            delta[pid] += _dec_qty(qty)

        added = productChangeRecord.objects.filter(
            prod_id__in=ids,
            adjst__Ongezwa=True,
            **_after('adjst__date'),
        ).values_list('prod_id', 'qty')
        for pid, qty in added:
            delta[pid] -= _dec_qty(qty)

        registered = productChangeRecord.objects.filter(
            prod_id__in=ids,
            adjst__registered=True,
            **_after('adjst__date'),
        ).values_list('prod_id', 'qty')
        for pid, qty in registered:
            delta[pid] -= _dec_qty(qty)

        pu_returns = pu_ret.objects.filter(
            pu_list_id__in=ids,
            **_after('ret__tarehe'),
        ).values_list('pu_list_id', 'idadi')
        for pid, qty in pu_returns:
            delta[pid] += _dec_qty(qty)

        inbound = bidhaa_stoku.objects.filter(
            pk__in=ids,
            uhamisho__isnull=False,
            uhamisho__receive__transfer__order=False,
            **_after('uhamisho__receive__transfer__tarehe'),
        ).values_list('id', 'uhamisho__qty')
        for pid, qty in inbound:
            delta[pid] -= _dec_qty(qty)

        purchased = bidhaa_stoku.objects.filter(
            pk__in=ids,
            manunuzi__isnull=False,
            manunuzi__manunuzi__order=False,
            **_after('manunuzi__manunuzi__tarehe'),
        ).values_list('id', 'manunuzi__idadi', 'manunuzi__rudi')
        for pid, qty, rudi in purchased:
            delta[pid] -= _dec_qty(qty) - _dec_qty(rudi)

    for row in items:
        origin = (
            row['manunuzi__manunuzi__tarehe']
            or row['ongezwa__date']
            or row['uhamisho__receive__transfer__tarehe']
            or row['produced__production__date']
        )
        if origin is not None and (origin > at_dt if closing else origin >= at_dt):
            continue
        q = _dec_qty(row['idadi']) + delta.get(row['id'], Decimal('0'))
        qty_map[row['id']] = q
    return qty_map


def _grouped_member_stock_ids(produ):
    if not produ or not getattr(produ, 'is_grouped_item', False) or not produ.grouped_item_ref_id:
        return []
    member_ids = list(
        grouped_item_member.objects.filter(
            grouped_id=produ.grouped_item_ref_id,
            active=True,
            bidhaa_stoku__Interprise_id=produ.Interprise_id,
        ).values_list('bidhaa_stoku_id', flat=True)
    )
    member_bidhaa_ids = list(
        bidhaa_stoku.objects.filter(pk__in=member_ids).values_list('bidhaa_id', flat=True)
    )
    if not member_bidhaa_ids:
        return member_ids
    return list(
        bidhaa_stoku.objects.filter(
            Interprise_id=produ.Interprise_id,
            is_grouped_item=False,
            bidhaa_id__in=member_bidhaa_ids,
        ).values_list('id', flat=True)
    )


def _allocate_qty(stock_ids, qty, weight_map):
    allocations = defaultdict(lambda: Decimal('0'))
    if qty <= 0:
        return allocations
    if not stock_ids:
        return allocations
    weights = [max(Decimal('0'), Decimal(weight_map.get(sid) or 0)) for sid in stock_ids]
    total_w = sum(weights, Decimal('0'))
    if total_w <= 0:
        share = qty / Decimal(len(stock_ids))
        for sid in stock_ids:
            allocations[sid] += share
        return allocations
    remaining = qty
    for i, sid in enumerate(stock_ids):
        if i == len(stock_ids) - 1:
            allocations[sid] += remaining
        else:
            part = (qty * weights[i] / total_w).quantize(Decimal('0.0001'))
            allocations[sid] += part
            remaining -= part
    return allocations


def _distribute_stock_qty(qty_map, produ, qty, before_qty_map):
    qty = Decimal(qty or 0)
    if qty == 0 or not produ:
        return
    if getattr(produ, 'is_grouped_item', False):
        for sid, part in _allocate_qty(_grouped_member_stock_ids(produ), qty, before_qty_map).items():
            qty_map[sid] += part
    else:
        qty_map[produ.id] += qty


def _window_sale_returns(duka, starts_at, period_end, sold_qty_map, before_qty_map, duka_ids=None, start_exclusive=False):
    """Returns in this window, including items sold in the same shift."""
    returned_map = defaultdict(lambda: Decimal('0'))
    rows = sa_ret.objects.filter(
        sa_list__produ__Interprise_id__in=_shop_ids(duka, duka_ids),
        **_dt_range_kwargs('ret__tarehe', starts_at, period_end, start_exclusive),
    ).select_related('sa_list__produ')
    for row in rows:
        qty = Decimal(row.idadi or 0)
        if qty <= 0:
            continue
        produ = row.sa_list.produ if row.sa_list_id else None
        _distribute_stock_qty(returned_map, produ, qty, before_qty_map)
    return returned_map


def _money(qty, buy_price, sales_price, ratio):
    ratio = ratio or Decimal('1')
    if ratio == 0:
        ratio = Decimal('1')
    return qty * buy_price / ratio, qty * sales_price


def _scale_qty_money(buckets, prefix, new_qty):
    old_qty = buckets.get(f'{prefix}_qty') or Decimal('0')
    buckets[f'{prefix}_qty'] = new_qty
    if old_qty == new_qty:
        return
    if old_qty:
        factor = new_qty / old_qty
        buckets[f'{prefix}_value'] *= factor
        buckets[f'{prefix}_worth'] *= factor
        return
    current_qty = buckets.get('current_qty') or Decimal('0')
    if current_qty:
        buckets[f'{prefix}_value'] = (buckets.get('current_value') or Decimal('0')) * new_qty / current_qty
        buckets[f'{prefix}_worth'] = (buckets.get('current_worth') or Decimal('0')) * new_qty / current_qty
        return
    buckets[f'{prefix}_value'] = Decimal('0')
    buckets[f'{prefix}_worth'] = Decimal('0')


def _rebase_group_before_to_current(buckets):
    """Set opening so the row identity matches live/closing stock.

    Returns via /mauzo/return and lots received onto an older origin date can
    inflate Stock Before without changing shelf qty. Current stock is the
    source of truth: opening = current - in + out + sold - returned.
    """
    added_in = (
        (buckets.get('added_qty') or Decimal('0'))
        + (buckets.get('purchased_qty') or Decimal('0'))
        + (buckets.get('received_qty') or Decimal('0'))
    )
    reduced_in = (
        (buckets.get('reduction_qty') or Decimal('0'))
        + (buckets.get('transferred_qty') or Decimal('0'))
    )
    implied_before = (
        (buckets.get('current_qty') or Decimal('0'))
        - added_in
        - (buckets.get('returned_qty') or Decimal('0'))
        + (buckets.get('sold_qty') or Decimal('0'))
        + reduced_in
    )
    if implied_before == (buckets.get('before_qty') or Decimal('0')):
        return
    _scale_qty_money(buckets, 'before', implied_before)


STOCK_FLOW_METRIC_KEYS = (
    'before_qty', 'before_value', 'before_worth',
    'added_qty', 'added_value', 'added_worth',
    'purchased_qty', 'purchased_value', 'purchased_worth',
    'reduction_qty', 'reduction_value', 'reduction_worth',
    'transferred_qty', 'transferred_value', 'transferred_worth',
    'received_qty', 'received_value', 'received_worth',
    'returned_qty', 'returned_value', 'returned_worth',
    'available_qty', 'available_value', 'available_worth',
    'sold_qty', 'sold_value', 'sold_worth',
    'current_qty', 'current_value', 'current_worth',
)


def _assemble_stock_value_panel(duka, starts_at, period_end, before_qty_map, closing_qty_map, sold_qty_map, is_closed, returned_qty_map=None, duka_ids=None, start_exclusive=False):
    """Stock Value Panel rows/totals for a time window, matching shift view."""
    shop_ids = _shop_ids(duka, duka_ids)
    reduction_qty_map = defaultdict(lambda: Decimal('0'))
    reduction_rows = productChangeRecord.objects.filter(
        adjst__Interprise_id__in=shop_ids,
        **_dt_range_kwargs('adjst__date', starts_at, period_end, start_exclusive),
    ).filter(
        Q(adjst__tumika=True) | Q(adjst__haribika=True) | Q(adjst__potea=True)
        | Q(adjst__expire=True) | Q(adjst__others=True) | Q(adjst__full_Return=True)
    ).values_list('prod_id', 'qty')
    for prod_id, qty in reduction_rows:
        reduction_qty_map[prod_id] += Decimal(qty or 0)

    pu_return_rows = pu_ret.objects.filter(
        pu_list__Interprise_id__in=shop_ids,
        **_dt_range_kwargs('ret__tarehe', starts_at, period_end, start_exclusive),
    ).values_list('pu_list_id', 'idadi')
    for prod_id, qty in pu_return_rows:
        reduction_qty_map[prod_id] += Decimal(qty or 0)

    added_qty_map = defaultdict(lambda: Decimal('0'))
    added_rows = productChangeRecord.objects.filter(
        adjst__Interprise_id__in=shop_ids,
        **_dt_range_kwargs('adjst__date', starts_at, period_end, start_exclusive),
    ).filter(Q(adjst__Ongezwa=True) | Q(adjst__registered=True)).values_list('prod_id', 'qty')
    for prod_id, qty in added_rows:
        added_qty_map[prod_id] += Decimal(qty or 0)

    produced_rows = bidhaa_stoku.objects.filter(
        Interprise_id__in=shop_ids,
        produced__isnull=False,
        **_dt_range_kwargs('produced__production__date', starts_at, period_end, start_exclusive),
    ).values_list('id', 'produced__qty')
    for prod_id, qty in produced_rows:
        added_qty_map[prod_id] += Decimal(qty or 0)

    if returned_qty_map is None:
        returned_qty_map = defaultdict(lambda: Decimal('0'))

    transferred_qty_map = defaultdict(lambda: Decimal('0'))
    transferred_rows = transferList.objects.filter(
        toka__Interprise_id__in=shop_ids,
        kwenda__receive__transfer__order=False,
        **_dt_range_kwargs('kwenda__receive__transfer__tarehe', starts_at, period_end, start_exclusive),
    ).exclude(
        kwenda__receive__Interprise_id__in=shop_ids,
    ).values_list('toka_id', 'kwenda__qty')
    for toka_id, qty in transferred_rows:
        transferred_qty_map[toka_id] += Decimal(qty or 0)

    received_qty_map = defaultdict(lambda: Decimal('0'))
    received_rows = bidhaa_stoku.objects.filter(
        Interprise_id__in=shop_ids,
        uhamisho__isnull=False,
        uhamisho__receive__transfer__order=False,
        **_dt_range_kwargs('uhamisho__receive__transfer__tarehe', starts_at, period_end, start_exclusive),
    ).exclude(
        uhamisho__receive__transfer__Interprise_id__in=shop_ids,
    ).values_list('id', 'uhamisho__qty')
    for prod_id, qty in received_rows:
        received_qty_map[prod_id] += Decimal(qty or 0)

    purchased_qty_map = defaultdict(lambda: Decimal('0'))
    purchased_rows = bidhaa_stoku.objects.filter(
        Interprise_id__in=shop_ids,
        is_grouped_item=False,
        manunuzi__isnull=False,
        manunuzi__manunuzi__Interprise_id__in=shop_ids,
        manunuzi__manunuzi__order=False,
        **_dt_range_kwargs('manunuzi__manunuzi__tarehe', starts_at, period_end, start_exclusive),
    ).values_list('id', 'manunuzi__idadi', 'manunuzi__rudi')
    for prod_id, qty, rudi in purchased_rows:
        net_qty = Decimal(qty or 0) - Decimal(rudi or 0)
        if net_qty:
            purchased_qty_map[prod_id] += net_qty

    live_items = list(
        bidhaa_stoku.objects.filter(
            Interprise_id__in=shop_ids,
            is_grouped_item=False,
        ).select_related('bidhaa__bidhaa_aina').order_by('bidhaa__bidhaa_jina')
    )
    items_by_id = {itm.id: itm for itm in live_items}

    relevant_ids = set(items_by_id.keys()) | set(before_qty_map.keys()) | set(closing_qty_map.keys())
    relevant_ids |= set(sold_qty_map.keys()) | set(added_qty_map.keys()) | set(reduction_qty_map.keys())
    relevant_ids |= set(returned_qty_map.keys())
    relevant_ids |= set(transferred_qty_map.keys()) | set(received_qty_map.keys())
    relevant_ids |= set(purchased_qty_map.keys())

    missing_ids = [iid for iid in relevant_ids if iid not in items_by_id]
    if missing_ids:
        for itm in bidhaa_stoku.objects.filter(pk__in=missing_ids, is_grouped_item=False).select_related('bidhaa__bidhaa_aina'):
            items_by_id[itm.id] = itm

    stock_items = list(items_by_id.values())
    bidhaa_groups = {}
    for itm in stock_items:
        bid = itm.bidhaa_id
        bidhaa_groups.setdefault(bid, []).append(itm)

    stock_value_rows = []
    stock_value_totals = defaultdict(lambda: Decimal('0'))
    total_current_qty = Decimal('0')

    for bid, items in sorted(
        bidhaa_groups.items(),
        key=lambda x: ((x[1][0].bidhaa.bidhaa_jina or '') if x[1][0].bidhaa else '').lower(),
    ):
        items = [itm for itm in items if not getattr(itm, 'is_grouped_item', False)]
        if not items:
            continue
        first_item = items[0]
        item_name = first_item.bidhaa.bidhaa_jina if first_item.bidhaa else ''
        units = first_item.bidhaa.vipimo if first_item.bidhaa else ''
        buckets = defaultdict(lambda: Decimal('0'))

        for itm in items:
            ratio = Decimal(itm.bidhaa.idadi_jum or 1) if itm.bidhaa else Decimal('1')
            buy_price = Decimal(itm.Bei_kununua or 0)
            sales_price = Decimal(itm.Bei_kuuza or 0)
            iid = itm.id

            b_qty = before_qty_map[iid]
            a_qty = added_qty_map[iid]
            p_qty = purchased_qty_map[iid]
            s_qty = sold_qty_map[iid]
            r_qty = reduction_qty_map[iid]
            t_qty = transferred_qty_map[iid]
            rc_qty = received_qty_map[iid]
            rt_qty = returned_qty_map[iid]
            # New receive/purchase lots must not also sit in opening.
            if rc_qty or p_qty:
                b_qty = max(Decimal('0'), b_qty - rc_qty - p_qty)
            reconstructed = b_qty + a_qty + p_qty + rc_qty + rt_qty - s_qty - r_qty - t_qty
            if is_closed and closing_qty_map:
                c_qty = closing_qty_map[iid]
            elif is_closed:
                c_qty = reconstructed
            else:
                c_qty = Decimal(itm.idadi or 0)

            c_val, c_worth = _money(c_qty, buy_price, sales_price, ratio)
            b_val, b_worth = _money(b_qty, buy_price, sales_price, ratio)
            a_val, a_worth = _money(a_qty, buy_price, sales_price, ratio)
            p_val, p_worth = _money(p_qty, buy_price, sales_price, ratio)
            s_val, s_worth = _money(s_qty, buy_price, sales_price, ratio)
            r_val, r_worth = _money(r_qty, buy_price, sales_price, ratio)
            t_val, t_worth = _money(t_qty, buy_price, sales_price, ratio)
            rc_val, rc_worth = _money(rc_qty, buy_price, sales_price, ratio)
            rt_val, rt_worth = _money(rt_qty, buy_price, sales_price, ratio)

            buckets['current_qty'] += c_qty
            buckets['current_value'] += c_val
            buckets['current_worth'] += c_worth
            buckets['before_qty'] += b_qty
            buckets['before_value'] += b_val
            buckets['before_worth'] += b_worth
            buckets['added_qty'] += a_qty
            buckets['added_value'] += a_val
            buckets['added_worth'] += a_worth
            buckets['purchased_qty'] += p_qty
            buckets['purchased_value'] += p_val
            buckets['purchased_worth'] += p_worth
            buckets['sold_qty'] += s_qty
            buckets['sold_value'] += s_val
            buckets['sold_worth'] += s_worth
            buckets['reduction_qty'] += r_qty
            buckets['reduction_value'] += r_val
            buckets['reduction_worth'] += r_worth
            buckets['transferred_qty'] += t_qty
            buckets['transferred_value'] += t_val
            buckets['transferred_worth'] += t_worth
            buckets['received_qty'] += rc_qty
            buckets['received_value'] += rc_val
            buckets['received_worth'] += rc_worth
            buckets['returned_qty'] += rt_qty
            buckets['returned_value'] += rt_val
            buckets['returned_worth'] += rt_worth

        _rebase_group_before_to_current(buckets)
        has_activity = any(
            buckets[k] for k in (
                'before_qty', 'added_qty', 'purchased_qty', 'sold_qty', 'reduction_qty',
                'transferred_qty', 'received_qty', 'returned_qty', 'current_qty',
            )
        )
        if not has_activity:
            continue

        aina = first_item.bidhaa.bidhaa_aina if first_item.bidhaa else None
        price_item = next(
            (i for i in items if not getattr(i, 'inapacha', False) and Decimal(i.idadi or 0) > 0),
            None,
        ) or next((i for i in items if Decimal(i.idadi or 0) > 0), None) or first_item
        added_in_qty = buckets['added_qty'] + buckets['purchased_qty'] + buckets['received_qty']
        reduced_in_qty = buckets['reduction_qty'] + buckets['transferred_qty']
        buckets['available_qty'] = buckets['before_qty'] + added_in_qty - reduced_in_qty
        buckets['available_value'] = (
            buckets['before_value'] + buckets['added_value'] + buckets['purchased_value']
            + buckets['received_value'] - buckets['reduction_value'] - buckets['transferred_value']
        )
        buckets['available_worth'] = (
            buckets['before_worth'] + buckets['added_worth'] + buckets['purchased_worth']
            + buckets['received_worth'] - buckets['reduction_worth'] - buckets['transferred_worth']
        )
        row = {
            'item_name': item_name,
            'units': units,
            'bidhaa_id': first_item.bidhaa_id,
            'aina_id': aina.id if aina else -1,
            'aina_name': (aina.aina if aina else '') or '',
            'sales_price': Decimal(price_item.Bei_kuuza or 0),
            'is_service': bool(getattr(first_item, 'service', False)),
            'added_in_qty': added_in_qty,
            'reduced_in_qty': reduced_in_qty,
            **buckets,
        }
        stock_value_rows.append(row)
        total_current_qty += buckets['current_qty']
        for k, v in buckets.items():
            stock_value_totals[k] += v

    def _qty_used(key):
        try:
            return abs(Decimal(stock_value_totals.get(key) or 0)) > 0
        except Exception:
            return False

    stock_optional_groups = {
        'added': _qty_used('added_qty'),
        'purchased': _qty_used('purchased_qty'),
        'reduction': _qty_used('reduction_qty'),
        'transferred': _qty_used('transferred_qty'),
        'received': _qty_used('received_qty'),
        'returned': _qty_used('returned_qty'),
    }
    stock_now = total_current_qty if is_closed else (
        bidhaa_stoku.objects.filter(
            Interprise_id__in=shop_ids, is_grouped_item=False
        ).aggregate(sum=Sum('idadi'))['sum'] or 0
    )
    return {
        'rows': stock_value_rows,
        'totals': stock_value_totals,
        'optional_groups': stock_optional_groups,
        'stock_now': stock_now,
        'stock_frozen': bool(is_closed),
    }


def _stock_flow_summary_rows(totals, optional_groups, stock_frozen):
    rows = [
        {'key': 'before', 'name_swa': 'Stoku ya awali', 'name_eng': 'Stock before', 'prefix': 'before', 'optional': False, 'tint': ''},
        {'key': 'added', 'name_swa': 'Zilizongezwa', 'name_eng': 'Added', 'prefix': 'added', 'optional': True, 'tint': 'sr-tint-in'},
        {'key': 'purchased', 'name_swa': 'Zilizonunuliwa', 'name_eng': 'Purchased', 'prefix': 'purchased', 'optional': True, 'tint': 'sr-tint-in'},
        {'key': 'reduction', 'name_swa': 'Zilizopunguzwa', 'name_eng': 'Reduction', 'prefix': 'reduction', 'optional': True, 'tint': 'sr-tint-out'},
        {'key': 'transferred', 'name_swa': 'Zilizohamishwa', 'name_eng': 'Transferred', 'prefix': 'transferred', 'optional': True, 'tint': 'sr-tint-out'},
        {'key': 'received', 'name_swa': 'Zilizopokelewa', 'name_eng': 'Received', 'prefix': 'received', 'optional': True, 'tint': 'sr-tint-in'},
        {'key': 'available', 'name_swa': 'Jumla kabla ya mauzo', 'name_eng': 'Total before sales', 'prefix': 'available', 'optional': False, 'tint': ''},
        {'key': 'sold', 'name_swa': 'Zilizouzwa', 'name_eng': 'Sold', 'prefix': 'sold', 'optional': False, 'tint': 'sr-tint-sales'},
        {'key': 'returned', 'name_swa': 'Zilizorudishwa', 'name_eng': 'Returned', 'prefix': 'returned', 'optional': True, 'tint': 'sr-tint-in'},
        {
            'key': 'current',
            'name_swa': 'Stoku ya kufunga',
            'name_eng': 'Closing stock',
            'prefix': 'current',
            'optional': False,
            'tint': 'sr-sum-close',
        },
    ]
    out = []
    for row in rows:
        if row['optional'] and not optional_groups.get(row['key']):
            continue
        prefix = row['prefix']
        out.append({
            'key': row['key'],
            'name_swa': row['name_swa'],
            'name_eng': row['name_eng'],
            'qty': _qty2(totals.get(f'{prefix}_qty')),
            'value': _qty2(totals.get(f'{prefix}_value')),
            'worth': _qty2(totals.get(f'{prefix}_worth')),
            'tint': row['tint'],
        })
    return out


def _pack_stock_panel_json(panel):
    totals = panel.get('totals') or {}
    optional = panel.get('optional_groups') or {}
    rows = []
    for r in panel.get('rows') or []:
        item = {
            'item_name': r.get('item_name') or '',
            'units': r.get('units') or '',
            'aina_id': r.get('aina_id') if r.get('aina_id') is not None else -1,
            'aina_name': r.get('aina_name') or '',
        }
        for key in STOCK_FLOW_METRIC_KEYS:
            item[key] = _qty2(r.get(key))
        rows.append(item)
    packed_totals = {key: _qty2(totals.get(key)) for key in STOCK_FLOW_METRIC_KEYS}
    frozen = bool(panel.get('stock_frozen'))
    return {
        'rows': rows,
        'totals': packed_totals,
        'optional_groups': optional,
        'stock_frozen': frozen,
        'count': len(rows),
        'summary': _stock_flow_summary_rows(packed_totals, optional, frozen),
    }


def merge_period_payload(a, b):
    """Combine two period-report dicts (rows concatenated, numeric totals summed)."""
    if not a:
        return b
    if not b:
        return a
    if not isinstance(a, dict) or not isinstance(b, dict):
        return a
    out = dict(a)
    for k, bv in b.items():
        av = out.get(k)
        if isinstance(av, dict) and isinstance(bv, dict):
            out[k] = merge_period_payload(av, bv)
        elif isinstance(av, list) and isinstance(bv, list):
            out[k] = list(av) + list(bv)
        elif k in ('count', 'times_total'):
            try:
                out[k] = int(av or 0) + int(bv or 0)
            except Exception:
                out[k] = bv
        else:
            summed = False
            if k in ('total', 'cost_total', 'qty_total', 'cash_total', 'amount') or (
                isinstance(k, str) and k.endswith('_total')
            ):
                try:
                    out[k] = _qty2(_dec(av) + _dec(bv))
                    summed = True
                except Exception:
                    summed = False
            if not summed and k not in out:
                out[k] = bv
    return out


def period_stock_value_report(duka, shifts, duka_ids=None):
    """Period stock flow from first shift open to last shift close (or now)."""
    empty = _pack_stock_panel_json({
        'rows': [],
        'totals': {},
        'optional_groups': {
            'added': False,
            'purchased': False,
            'reduction': False,
            'transferred': False,
            'received': False,
            'returned': False,
        },
        'stock_frozen': False,
    })
    dated = [s for s in shifts if getattr(s, 'starts_at', None)]
    dated.sort(key=lambda s: s.starts_at)
    if not dated:
        return empty

    first, last = dated[0], dated[-1]
    starts_at = first.starts_at
    period_end = max((s.ends_at or timezone.now() for s in dated), default=timezone.now())
    now = timezone.now()
    slice_ended = bool(period_end and period_end < now - timedelta(seconds=30))
    is_closed = slice_ended or all(
        str(s.status or '') == 'closed' and bool(s.ends_at) for s in dated
    )
    calendar = any(getattr(s, 'calendar', False) for s in dated)
    use_open_snap = (not calendar) and getattr(first, 'use_opening_snapshot', True)
    use_close_snap = (not calendar) and getattr(last, 'use_closing_snapshot', False) and is_closed

    shop_ids = _shop_ids(duka, duka_ids)
    multi = len(shop_ids) > 1
    opening_snapshot_activity = None
    closing_snapshot_activity = None
    if not calendar and not multi:
        if use_open_snap:
            opening_snapshot_activity = ShiftActivity.objects.filter(
                shift=first.id,
                event_type='OPENING_SNAPSHOT',
                event_ref_id__isnull=False,
            ).order_by('recorded_at').first()
        if use_close_snap:
            closing_snapshot_activity = ShiftActivity.objects.filter(
                shift=last.id,
                event_type='CLOSING_SNAPSHOT',
                event_ref_id__isnull=False,
            ).order_by('-recorded_at').first()

    before_qty_map = _stock_qty_map_at(duka, starts_at, duka_ids=shop_ids)
    if not before_qty_map and opening_snapshot_activity:
        before_qty_map = _snapshot_qty_map(opening_snapshot_activity)
    closing_qty_map = _stock_qty_map_at(duka, period_end, closing=True, duka_ids=shop_ids) if is_closed else defaultdict(lambda: Decimal('0'))
    if is_closed and not closing_qty_map and closing_snapshot_activity:
        closing_qty_map = _snapshot_qty_map(closing_snapshot_activity)
    sold_qty_map = defaultdict(lambda: Decimal('0'))
    for line in completed_sale_lines_qs(duka, starts_at, period_end, duka_ids=shop_ids).select_related('produ'):
        sold_qty = Decimal(line.idadi or 0)
        if sold_qty <= 0:
            continue
        produ = line.produ
        if produ and getattr(produ, 'is_grouped_item', False):
            member_ids = _grouped_member_stock_ids(produ)
            for sid, part in _allocate_qty(member_ids, sold_qty, before_qty_map).items():
                sold_qty_map[sid] += part
        elif produ:
            sold_qty_map[produ.id] += sold_qty

    returned_qty_map = _window_sale_returns(
        duka, starts_at, period_end, sold_qty_map, before_qty_map, duka_ids=shop_ids,
    )
    panel = _assemble_stock_value_panel(
        duka, starts_at, period_end, before_qty_map, closing_qty_map, sold_qty_map, is_closed,
        returned_qty_map=returned_qty_map, duka_ids=shop_ids,
    )
    return _pack_stock_panel_json(panel)


def build_shift_report(duka, shift):
    period_end = shift.ends_at or timezone.now()
    starts_at = shift.starts_at
    is_closed = str(shift.status or '') == 'closed'
    owned_from, start_exclusive = _shift_window_lower(duka, starts_at)
    if not owned_from:
        owned_from = starts_at

    assignments = ShiftAssignment.objects.filter(
        shift=shift.id, active=True
    ).select_related('staff__user__user', 'staff__fanyakazi').order_by('role', 'assigned_at')
    activities = ShiftActivity.objects.filter(shift=shift.id).order_by('-recorded_at')

    shift_team_rows = []
    for a in assignments:
        staff_perm = a.staff
        worker = staff_perm.fanyakazi if staff_perm else None
        if worker:
            name = worker.jina
            role_name = 'Recorder' if a.role == 'recorder' else (worker.kazi or 'Staff')
        elif staff_perm and staff_perm.user and staff_perm.user.user:
            user_obj = staff_perm.user.user
            name = user_obj.get_full_name() or user_obj.username
            role_name = 'Recorder' if a.role == 'recorder' else (staff_perm.cheo or 'Staff')
        else:
            name = 'Unknown'
            role_name = 'Recorder' if a.role == 'recorder' else 'Staff'
        shift_team_rows.append({
            'name': name,
            'role': role_name,
            'is_recorder': a.role == 'recorder',
        })
    shift_team_rows.sort(key=lambda row: (0 if row['is_recorder'] else 1, row['name'].lower()))

    line_qs = completed_sale_lines_qs(duka, owned_from, period_end, start_exclusive=start_exclusive).select_related(
        'produ',
        'mauzo__waiter_order__user__user',
        'mauzo__waiter_order__user_entp__Interprise',
        'mauzo__waiter_order__fanyakazi',
        'mauzo__By__user__user',
        'mauzo__By__user_entp__Interprise',
        'mauzo__By__fanyakazi',
    )

    sales_amount = Decimal('0')
    sold_qty_map = defaultdict(lambda: Decimal('0'))
    breakdown = {}
    counted_sales = set()

    opening_snapshot_activity = ShiftActivity.objects.filter(
        shift=shift.id,
        event_type='OPENING_SNAPSHOT',
        event_ref_id__isnull=False,
    ).order_by('recorded_at').first()
    closing_snapshot_activity = ShiftActivity.objects.filter(
        shift=shift.id,
        event_type='CLOSING_SNAPSHOT',
        event_ref_id__isnull=False,
    ).order_by('-recorded_at').first()

    before_qty_map = _stock_qty_map_at(duka, owned_from)
    if not before_qty_map:
        before_qty_map = _snapshot_qty_map(opening_snapshot_activity)
    closing_qty_map = _stock_qty_map_at(duka, period_end, closing=True) if is_closed else defaultdict(lambda: Decimal('0'))
    if is_closed and not closing_qty_map:
        closing_qty_map = _snapshot_qty_map(closing_snapshot_activity)

    for line in line_qs:
        sold_qty = Decimal(line.idadi or 0)
        net_qty = sold_qty - Decimal(line.returned or 0) - Decimal(line.serviceReturn or 0)
        if sold_qty <= 0:
            continue
        line_amount = max(net_qty, Decimal('0')) * Decimal(line.bei or 0)
        sales_amount += line_amount

        sale = line.mauzo
        actor = sale.waiter_order if sale.waiter_order_id else sale.By
        key = actor.id if actor else 0
        if key not in breakdown:
            breakdown[key] = {
                'actor_id': actor.id if actor else None,
                'name': staff_display_name(actor),
                'sales_count': 0,
                'total_amount': Decimal('0'),
            }
        if sale.id not in counted_sales:
            counted_sales.add(sale.id)
            breakdown[key]['sales_count'] += 1
        breakdown[key]['total_amount'] += line_amount

        produ = line.produ
        if produ and getattr(produ, 'is_grouped_item', False):
            member_ids = _grouped_member_stock_ids(produ)
            for sid, part in _allocate_qty(member_ids, sold_qty, before_qty_map).items():
                sold_qty_map[sid] += part
        elif produ:
            sold_qty_map[produ.id] += sold_qty

    returned_qty_map = _window_sale_returns(
        duka, owned_from, period_end, sold_qty_map, before_qty_map, start_exclusive=start_exclusive,
    )

    sales_breakdown_rows = sorted(breakdown.values(), key=lambda x: (x['name'] or '').lower())
    sales_breakdown_totals = {
        'sales_count': sum(row['sales_count'] for row in sales_breakdown_rows),
        'total_amount': sum((row['total_amount'] for row in sales_breakdown_rows), Decimal('0')),
    }

    pending_qs = mauzoni.objects.filter(
        Interprise=duka.id,
        service=False,
        order=True,
        cart=False,
        ignore=False,
        **_dt_range_kwargs('tarehe', owned_from, period_end, start_exclusive),
    )
    pending_sales_amount = pending_qs.aggregate(sum=Sum('amount'))['sum'] or Decimal('0')
    pending_sales_count = pending_qs.count()

    used_qty = productChangeRecord.objects.filter(
        adjst__Interprise=duka.id,
        adjst__tumika=True,
        **_dt_range_kwargs('adjst__date', owned_from, period_end, start_exclusive),
    ).aggregate(sum=Sum('qty'))['sum'] or 0

    damaged_qty = productChangeRecord.objects.filter(
        adjst__Interprise=duka.id,
        **_dt_range_kwargs('adjst__date', owned_from, period_end, start_exclusive),
    ).filter(Q(adjst__haribika=True) | Q(adjst__potea=True)).aggregate(sum=Sum('qty'))['sum'] or 0

    flows = shift_payment_flows(duka, owned_from, period_end, start_exclusive=start_exclusive)
    expenses = flows['expenses']
    deposits = flows['deposits']

    cash_accounts = PaymentAkaunts.objects.filter(Interprise=duka.id, aina__iexact='Cash').order_by('Akaunt_name')
    opening_cash = shift.opening_cash
    live_cash = cash_accounts.aggregate(sum=Sum('Amount'))['sum'] or 0
    current_cash = shift.actual_closing_cash if is_closed and shift.actual_closing_cash is not None else live_cash
    expected_cash = expected_cash_from_flows(opening_cash, flows)

    mobile_payments = wekaCash.objects.filter(
        Interprise=duka.id,
        kuhamisha=False,
        **_dt_range_kwargs('tarehe', owned_from, period_end, start_exclusive),
    ).exclude(
        Akaunt__aina__iexact='Cash'
    ).select_related('Akaunt', 'by__fanyakazi').order_by('tarehe')
    mobile_payments_total = mobile_payments.aggregate(sum=Sum('Amount'))['sum'] or Decimal('0')

    stock_panel = _assemble_stock_value_panel(
        duka, owned_from, period_end, before_qty_map, closing_qty_map, sold_qty_map, is_closed,
        returned_qty_map=returned_qty_map, start_exclusive=start_exclusive,
    )
    stock_value_rows = stock_panel['rows']
    stock_value_totals = stock_panel['totals']
    stock_optional_groups = stock_panel['optional_groups']
    stock_now = stock_panel['stock_now']

    return {
        'assignments': assignments,
        'activities': activities,
        'shift_team_rows': shift_team_rows,
        'movement': {
            'sales_amount': sales_amount,
            'pending_sales_amount': pending_sales_amount,
            'pending_sales_count': pending_sales_count,
            'used_qty': used_qty,
            'damaged_qty': damaged_qty,
            'stock_now': stock_now,
            'stock_frozen': bool(is_closed),
        },
        'payments': {
            'opening_cash': opening_cash,
            'cash_in': flows['cash_in'],
            'expenses': expenses,
            'deposits': deposits,
            'expected_cash': expected_cash,
            'current_cash': current_cash,
        },
        'cash_accounts': cash_accounts,
        'mobile_payments': mobile_payments,
        'mobile_payments_total': mobile_payments_total,
        'stock_value_rows': stock_value_rows,
        'stock_value_totals': stock_value_totals,
        'stock_optional_groups': stock_optional_groups,
        'sales_breakdown_rows': sales_breakdown_rows,
        'sales_breakdown_totals': sales_breakdown_totals,
    }
