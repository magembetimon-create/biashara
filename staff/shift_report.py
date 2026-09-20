from collections import defaultdict
from decimal import Decimal

from django.db.models import Case, DateTimeField, F, Q, Sum, When
from django.utils import timezone

from management.models import (
    ItemsState,
    PaymentAkaunts,
    ShiftActivity,
    ShiftAssignment,
    bidhaa_stoku,
    grouped_item_member,
    mauzoList,
    mauzoni,
    productChangeRecord,
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


def completed_sales_qs(duka, starts_at, period_end):
    return mauzoni.objects.filter(
        Interprise=duka.id,
        service=False,
        order=False,
        cart=False,
        ignore=False,
    ).annotate(event_at=sale_event_at()).filter(
        event_at__gte=starts_at,
        event_at__lte=period_end,
    )


def completed_sale_lines_qs(duka, starts_at, period_end):
    return mauzoList.objects.filter(
        mauzo__Interprise=duka.id,
        mauzo__service=False,
        mauzo__order=False,
        mauzo__cart=False,
        mauzo__ignore=False,
    ).annotate(event_at=sale_event_at('mauzo__')).filter(
        event_at__gte=starts_at,
        event_at__lte=period_end,
    )


def shift_sales_amounts(duka, shifts):
    """Completed sales totals per shift, matching shift view Stock Movement sales."""
    now = timezone.now()
    amounts = {}
    windows = []
    for shift in shifts:
        period_end = shift.ends_at or now
        amounts[shift.id] = Decimal('0')
        if shift.starts_at:
            windows.append((shift.id, shift.starts_at, period_end))
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
        for shift_id, starts_at, period_end in windows:
            if starts_at <= event_at <= period_end:
                amounts[shift_id] += line_amount
    return amounts


def _shift_time_windows(shifts, now=None):
    now = now or timezone.now()
    windows = []
    for shift in shifts:
        if not shift.starts_at:
            continue
        windows.append((shift.id, shift.starts_at, shift.ends_at or now))
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
        for shift_id, starts_at, period_end in windows:
            if starts_at <= event_at <= period_end:
                amounts[shift_id] += amt
    return amounts


def build_shifts_period_report(duka, shifts):
    now = timezone.now()
    windows = _shift_time_windows(shifts, now)
    sales_map = shift_sales_amounts(duka, shifts)
    expenses_map = _amounts_in_windows(
        windows,
        toaCash.objects.filter(Interprise=duka.id),
    )
    deposits_map = _amounts_in_windows(
        windows,
        wekaCash.objects.filter(Interprise=duka.id),
    )

    rows = []
    totals = {
        'opening': Decimal('0'),
        'closing': Decimal('0'),
        'sales': Decimal('0'),
        'expenses': Decimal('0'),
        'deposits': Decimal('0'),
        'balance': Decimal('0'),
        'count': 0,
        'open_count': 0,
        'closed_count': 0,
    }

    for shift in shifts:
        sales = Decimal(str(sales_map.get(shift.id, 0) or 0))
        expenses = Decimal(str(expenses_map.get(shift.id, 0) or 0))
        deposits = Decimal(str(deposits_map.get(shift.id, 0) or 0))
        opening = Decimal(str(shift.opening_cash or 0))
        balance = opening + deposits - expenses
        if shift.status == 'closed' and shift.actual_closing_cash is not None:
            closing = Decimal(str(shift.actual_closing_cash))
        elif shift.status == 'closed' and shift.expected_closing_cash is not None:
            closing = Decimal(str(shift.expected_closing_cash))
        else:
            closing = balance

        row = {
            'shift': shift,
            'opening': opening,
            'closing': closing,
            'sales': sales,
            'expenses': expenses,
            'deposits': deposits,
            'balance': balance,
        }
        rows.append(row)
        totals['opening'] += opening
        totals['closing'] += closing
        totals['sales'] += sales
        totals['expenses'] += expenses
        totals['deposits'] += deposits
        totals['balance'] += balance
        totals['count'] += 1
        if shift.status == 'closed':
            totals['closed_count'] += 1
        else:
            totals['open_count'] += 1

    return rows, totals


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


def _snapshot_qty_map(activity):
    qty_map = defaultdict(lambda: Decimal('0'))
    if not activity or not activity.event_ref_id:
        return qty_map
    for row in ItemsState.objects.filter(state_id=activity.event_ref_id).values('sbidhaa_id', 'sidadi'):
        qty_map[row['sbidhaa_id']] = Decimal(row['sidadi'] or 0)
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


def _money(qty, buy_price, sales_price, ratio):
    ratio = ratio or Decimal('1')
    if ratio == 0:
        ratio = Decimal('1')
    return qty * buy_price / ratio, qty * sales_price


def build_shift_report(duka, shift):
    period_end = shift.ends_at or timezone.now()
    starts_at = shift.starts_at
    is_closed = str(shift.status or '') == 'closed'

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

    line_qs = completed_sale_lines_qs(duka, starts_at, period_end).select_related(
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

    before_qty_map = _snapshot_qty_map(opening_snapshot_activity)
    closing_qty_map = _snapshot_qty_map(closing_snapshot_activity)

    for line in line_qs:
        net_qty = Decimal(line.idadi or 0) - Decimal(line.returned or 0) - Decimal(line.serviceReturn or 0)
        if net_qty <= 0:
            continue
        line_amount = net_qty * Decimal(line.bei or 0)
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
            for sid, part in _allocate_qty(member_ids, net_qty, before_qty_map).items():
                sold_qty_map[sid] += part
        elif produ:
            sold_qty_map[produ.id] += net_qty

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
        tarehe__gte=starts_at,
        tarehe__lte=period_end,
    )
    pending_sales_amount = pending_qs.aggregate(sum=Sum('amount'))['sum'] or Decimal('0')
    pending_sales_count = pending_qs.count()

    used_qty = productChangeRecord.objects.filter(
        adjst__Interprise=duka.id,
        adjst__date__gte=starts_at,
        adjst__date__lte=period_end,
        adjst__tumika=True,
    ).aggregate(sum=Sum('qty'))['sum'] or 0

    damaged_qty = productChangeRecord.objects.filter(
        adjst__Interprise=duka.id,
        adjst__date__gte=starts_at,
        adjst__date__lte=period_end,
    ).filter(Q(adjst__haribika=True) | Q(adjst__potea=True)).aggregate(sum=Sum('qty'))['sum'] or 0

    expenses = toaCash.objects.filter(
        Interprise=duka.id,
        tarehe__gte=starts_at,
        tarehe__lte=period_end,
    ).aggregate(sum=Sum('Amount'))['sum'] or 0

    deposits = wekaCash.objects.filter(
        Interprise=duka.id,
        tarehe__gte=starts_at,
        tarehe__lte=period_end,
    ).aggregate(sum=Sum('Amount'))['sum'] or 0

    cash_accounts = PaymentAkaunts.objects.filter(Interprise=duka.id, aina__iexact='Cash').order_by('Akaunt_name')
    opening_cash = shift.opening_cash
    live_cash = cash_accounts.aggregate(sum=Sum('Amount'))['sum'] or 0
    current_cash = shift.actual_closing_cash if is_closed and shift.actual_closing_cash is not None else live_cash
    expected_cash = Decimal(opening_cash) + Decimal(deposits) - Decimal(expenses)

    mobile_payments = wekaCash.objects.filter(
        Interprise=duka.id,
        tarehe__gte=starts_at,
        tarehe__lte=period_end,
    ).exclude(
        Akaunt__aina__iexact='Cash'
    ).select_related('Akaunt', 'by__fanyakazi').order_by('tarehe')
    mobile_payments_total = mobile_payments.aggregate(sum=Sum('Amount'))['sum'] or Decimal('0')

    reduction_qty_map = defaultdict(lambda: Decimal('0'))
    reduction_rows = productChangeRecord.objects.filter(
        adjst__Interprise=duka.id,
        adjst__date__gte=starts_at,
        adjst__date__lte=period_end,
    ).filter(
        Q(adjst__tumika=True) | Q(adjst__haribika=True) | Q(adjst__potea=True)
    ).values_list('prod_id', 'qty')
    for prod_id, qty in reduction_rows:
        reduction_qty_map[prod_id] += Decimal(qty or 0)

    added_qty_map = defaultdict(lambda: Decimal('0'))
    added_rows = productChangeRecord.objects.filter(
        adjst__Interprise=duka.id,
        adjst__date__gte=starts_at,
        adjst__date__lte=period_end,
        adjst__Ongezwa=True,
    ).values_list('prod_id', 'qty')
    for prod_id, qty in added_rows:
        added_qty_map[prod_id] += Decimal(qty or 0)

    transferred_qty_map = defaultdict(lambda: Decimal('0'))
    transferred_rows = transferList.objects.filter(
        toka__Interprise=duka.id,
        kwenda__receive__transfer__Interprise=duka.id,
        kwenda__receive__transfer__order=False,
        kwenda__receive__transfer__tarehe__gte=starts_at,
        kwenda__receive__transfer__tarehe__lte=period_end,
    ).values_list('toka_id', 'kwenda__qty')
    for toka_id, qty in transferred_rows:
        transferred_qty_map[toka_id] += Decimal(qty or 0)

    received_qty_map = defaultdict(lambda: Decimal('0'))
    received_rows = bidhaa_stoku.objects.filter(
        Interprise=duka.id,
        uhamisho__isnull=False,
        uhamisho__receive__transfer__order=False,
        uhamisho__receive__transfer__tarehe__gte=starts_at,
        uhamisho__receive__transfer__tarehe__lte=period_end,
    ).values_list('id', 'uhamisho__qty')
    for prod_id, qty in received_rows:
        received_qty_map[prod_id] += Decimal(qty or 0)

    live_items = list(
        bidhaa_stoku.objects.filter(Interprise=duka.id).select_related('bidhaa').order_by('bidhaa__bidhaa_jina')
    )
    items_by_id = {itm.id: itm for itm in live_items}

    relevant_ids = set(items_by_id.keys()) | set(before_qty_map.keys()) | set(closing_qty_map.keys())
    relevant_ids |= set(sold_qty_map.keys()) | set(added_qty_map.keys()) | set(reduction_qty_map.keys())
    relevant_ids |= set(transferred_qty_map.keys()) | set(received_qty_map.keys())

    missing_ids = [iid for iid in relevant_ids if iid not in items_by_id]
    if missing_ids:
        for itm in bidhaa_stoku.objects.filter(pk__in=missing_ids).select_related('bidhaa'):
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
        first_item = items[0]
        item_name = first_item.bidhaa.bidhaa_jina if first_item.bidhaa else ''
        units = first_item.bidhaa.vipimo if first_item.bidhaa else ''
        buckets = defaultdict(lambda: Decimal('0'))

        for itm in items:
            ratio = Decimal(itm.bidhaa.idadi_jum or 1) if itm.bidhaa else Decimal('1')
            buy_price = Decimal(itm.Bei_kununua or 0)
            sales_price = Decimal(itm.Bei_kuuza or 0)
            iid = itm.id

            if is_closed and closing_qty_map:
                c_qty = closing_qty_map.get(iid, Decimal(itm.idadi or 0))
            else:
                c_qty = Decimal(itm.idadi or 0)
            b_qty = before_qty_map[iid]
            a_qty = added_qty_map[iid]
            s_qty = sold_qty_map[iid]
            r_qty = reduction_qty_map[iid]
            t_qty = transferred_qty_map[iid]
            rc_qty = received_qty_map[iid]
            expected_qty = b_qty + a_qty + rc_qty - s_qty - r_qty - t_qty
            variance_qty = c_qty - expected_qty

            c_val, c_worth = _money(c_qty, buy_price, sales_price, ratio)
            b_val, b_worth = _money(b_qty, buy_price, sales_price, ratio)
            a_val, a_worth = _money(a_qty, buy_price, sales_price, ratio)
            s_val, s_worth = _money(s_qty, buy_price, sales_price, ratio)
            r_val, r_worth = _money(r_qty, buy_price, sales_price, ratio)
            t_val, t_worth = _money(t_qty, buy_price, sales_price, ratio)
            rc_val, rc_worth = _money(rc_qty, buy_price, sales_price, ratio)

            buckets['current_qty'] += c_qty
            buckets['current_value'] += c_val
            buckets['current_worth'] += c_worth
            buckets['before_qty'] += b_qty
            buckets['before_value'] += b_val
            buckets['before_worth'] += b_worth
            buckets['added_qty'] += a_qty
            buckets['added_value'] += a_val
            buckets['added_worth'] += a_worth
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
            buckets['expected_qty'] += expected_qty
            buckets['variance_qty'] += variance_qty

        has_activity = any(
            buckets[k] for k in (
                'before_qty', 'added_qty', 'sold_qty', 'reduction_qty',
                'transferred_qty', 'received_qty', 'current_qty', 'variance_qty',
            )
        )
        if not has_activity:
            continue

        row = {
            'item_name': item_name,
            'units': units,
            **buckets,
        }
        stock_value_rows.append(row)
        total_current_qty += buckets['current_qty']
        for k, v in buckets.items():
            stock_value_totals[k] += v

    stock_now = total_current_qty if (is_closed and closing_qty_map) else (
        bidhaa_stoku.objects.filter(Interprise=duka.id).aggregate(sum=Sum('idadi'))['sum'] or 0
    )

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
            'stock_frozen': bool(is_closed and closing_qty_map),
        },
        'payments': {
            'opening_cash': opening_cash,
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
        'sales_breakdown_rows': sales_breakdown_rows,
        'sales_breakdown_totals': sales_breakdown_totals,
    }
