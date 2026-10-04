from decimal import Decimal

from django.db.models import Count, DecimalField, F, Q, Sum
from django.utils import timezone as dj_timezone
from django.utils.dateparse import parse_datetime

from django.db import transaction

from management.models import (
    Interprise,
    InterprisePermissions,
    PaymentAkaunts,
    bidhaa_stoku,
    manunuzi,
    MatumiziReceiptAttachment,
    toaCash,
    wasambazaji,
)
import datetime
import json


def _parse_dt(value):
    if not value:
        return None
    if isinstance(value, datetime.datetime):
        dt = value
    else:
        dt = parse_datetime(str(value))
        if dt is None:
            try:
                dt = datetime.datetime.fromisoformat(str(value).replace('Z', '+00:00'))
            except ValueError:
                return None
    if dj_timezone.is_naive(dt):
        dt = dj_timezone.make_aware(dt, dj_timezone.get_current_timezone())
    return dt


def owner_sibling_branches(duka):
    siblings = list(
        Interprise.objects.filter(owner_id=duka.owner_id, Interprise=True).values('id', 'name').order_by('name')
    )
    sibling_ids = [b['id'] for b in siblings]
    if duka.id not in sibling_ids:
        siblings.append({'id': duka.id, 'name': duka.name})
    return siblings


def allowed_vendor_scope_branches(duka, cheo):
    """Branches of this duka's owner that the signed-in user may query."""
    siblings = owner_sibling_branches(duka)
    can_scope = bool(cheo and (cheo.owner or getattr(cheo, 'msaidizi', False) or int(cheo.admin or 0)))
    if can_scope:
        return siblings, True
    perm_ids = set()
    if cheo and cheo.user_id:
        perm_ids = set(
            InterprisePermissions.objects.filter(
                user_id=cheo.user_id,
                Interprise__owner_id=duka.owner_id,
                Interprise__Interprise=True,
            ).values_list('Interprise_id', flat=True)
        )
    allowed = [b for b in siblings if b['id'] in perm_ids or b['id'] == duka.id]
    if not allowed:
        allowed = [{'id': duka.id, 'name': duka.name}]
    return allowed, False


def parse_requested_branch_ids(raw, allowed_ids, fallback_ids):
    allowed = set(int(i) for i in (allowed_ids or []))
    ids = []
    if raw not in (None, ''):
        parsed = None
        if isinstance(raw, (list, tuple)):
            parsed = raw
        else:
            text = str(raw).strip()
            if text.startswith('['):
                try:
                    parsed = json.loads(text)
                except Exception:
                    parsed = None
            if parsed is None:
                parsed = [p for p in text.split(',') if p.strip()]
        for item in parsed or []:
            try:
                ids.append(int(item))
            except (TypeError, ValueError):
                continue
    ids = [i for i in ids if i in allowed]
    if not ids:
        return list(fallback_ids or allowed_ids or [])
    return ids


def vendor_branch_ids(duka, cheo, branch_param=-1):
    siblings = list(
        Interprise.objects.filter(owner_id=duka.owner_id, Interprise=True).values('id', 'name').order_by('name')
    )
    sibling_ids = [b['id'] for b in siblings]
    if duka.id not in sibling_ids:
        sibling_ids.append(duka.id)
        siblings.append({'id': duka.id, 'name': duka.name})

    can_scope = bool(cheo and (cheo.owner or getattr(cheo, 'msaidizi', False) or int(cheo.admin or 0)))
    all_branches = branch_param == 0 and can_scope
    if all_branches:
        return sibling_ids, siblings, 0, can_scope
    branch_id = branch_param if branch_param > 0 else duka.id
    if not can_scope or branch_id not in sibling_ids:
        branch_id = duka.id
    return [branch_id], siblings, branch_id, can_scope


def _unpaid_vendor_bills_qs(branch_ids):
    return manunuzi.objects.filter(
        Interprise_id__in=list(branch_ids or []),
        supplier_id_id__isnull=False,
        order=False,
        full_returned=False,
    ).filter(amount__gt=F('ilolipwa'))


def debts_by_vendor(branch_ids, vendor_ids=None):
    qs = _unpaid_vendor_bills_qs(branch_ids)
    if vendor_ids is not None:
        qs = qs.filter(supplier_id_id__in=list(vendor_ids))
    rows = qs.values('supplier_id_id').annotate(
        deni=Sum(F('amount') - F('ilolipwa'), output_field=DecimalField()),
    )
    return {r['supplier_id_id']: float(r['deni'] or 0) for r in rows}


def vendor_debt_summary(branch_ids):
    agg = _unpaid_vendor_bills_qs(branch_ids).aggregate(
        deni=Sum(F('amount') - F('ilolipwa'), output_field=DecimalField()),
        wadadai=Count('supplier_id_id', distinct=True),
    )
    return {
        'deni': round(float(agg.get('deni') or 0), 2),
        'wadadai': int(agg.get('wadadai') or 0),
    }


def vendor_debt_by_branch(branch_ids):
    rows = _unpaid_vendor_bills_qs(branch_ids).values('Interprise_id').annotate(
        deni=Sum(F('amount') - F('ilolipwa'), output_field=DecimalField()),
        wadadai=Count('supplier_id_id', distinct=True),
    )
    return {
        r['Interprise_id']: {
            'deni': round(float(r.get('deni') or 0), 2),
            'wadadai': int(r.get('wadadai') or 0),
        }
        for r in rows
    }


def _as_decimal(value, default='0'):
    try:
        return Decimal(str(value if value is not None else default))
    except Exception:
        return Decimal(default)


def purchase_line_qty_price(qty, bei, uwiano, vipimo, vipimo_jum, vat_set=False, vatper=0):
    """Unit qty, unit price, unit label and line total — same rules as viewbill."""
    ratio = _as_decimal(uwiano, '1')
    if ratio <= 0:
        ratio = Decimal('1')
    qty_d = _as_decimal(qty)
    bei_d = _as_decimal(bei)
    vat_rate = _as_decimal(vatper) / Decimal('100')
    line_tot = (bei_d * qty_d) / ratio
    jumla_unit = (qty_d % ratio) == 0
    if jumla_unit:
        show_qty = qty_d / ratio
        units = vipimo_jum or vipimo or ''
        unit_price = bei_d
        if vat_set and vat_rate:
            unit_price = bei_d / (Decimal('1') + vat_rate)
    else:
        show_qty = qty_d
        units = vipimo or ''
        unit_price = bei_d / ratio
        if vat_set and vat_rate:
            unit_price = unit_price / (Decimal('1') + vat_rate)
    return show_qty, unit_price, str(units).strip(), line_tot


def vendor_bills_qs(duka, vendor_id, branch_ids):
    qs = manunuzi.objects.filter(
        Interprise_id__in=list(branch_ids or [duka.id]),
        order=False,
        full_returned=False,
        supplier_id_id__isnull=False,
    )
    if vendor_id:
        qs = qs.filter(supplier_id_id=vendor_id)
    return qs


def _recorded_by_name(row, fname_key, lname_key, username_key=None):
    first = str(row.get(fname_key) or '').strip()
    last = str(row.get(lname_key) or '').strip()
    name = ' '.join(part for part in (first, last) if part)
    if name:
        return name
    if username_key:
        return str(row.get(username_key) or '').strip()
    return ''


def vendor_statement_payload(duka, vendor_id, t_fr_dt, t_to_dt, branch_ids):
    bills_qs = vendor_bills_qs(duka, vendor_id, branch_ids)

    debt_agg = bills_qs.filter(amount__gt=F('ilolipwa')).aggregate(
        debt=Sum(F('amount') - F('ilolipwa'), output_field=DecimalField())
    )
    total_debt = float(debt_agg['debt'] or 0)

    totals = bills_qs.aggregate(
        total_invoices=Count('id'),
        total_purchase=Sum('amount'),
    )

    purchases_before = bills_qs.filter(tarehe__lt=t_fr_dt).aggregate(s=Sum('amount'))['s'] or Decimal('0')
    # Same bills as purchases (not orders / not fully returned). Otherwise a payment on a
    # returned bill reduces statement balance while "amount owed" still uses open bills.
    pay_scope = toaCash.objects.filter(
        pu=True,
        bill_id__in=bills_qs.values('id'),
        Interprise_id__in=list(branch_ids or [duka.id]),
    )
    payments_before = pay_scope.filter(tarehe__lt=t_fr_dt).aggregate(s=Sum('Amount'))['s'] or Decimal('0')
    opening_signed = float(purchases_before - payments_before)
    vatper = getattr(duka, 'vatper', 0) or 0

    period_bills = list(
        bills_qs.filter(tarehe__gte=t_fr_dt, tarehe__lte=t_to_dt).values(
            'id', 'code', 'amount', 'ilolipwa', 'tarehe', 'date',
            'Interprise_id', 'Interprise__name',
            'supplier_id_id', 'supplier_id__jina',
            'By__user__user__first_name',
            'By__user__user__last_name',
            'By__user__user__username',
        )
    )
    period_payments = list(
        pay_scope.filter(
            tarehe__gte=t_fr_dt,
            tarehe__lte=t_to_dt,
        )
        .annotate(
            bill_code=F('bill__code'),
            branch_name=F('Interprise__name'),
            bill_branch_name=F('bill__Interprise__name'),
            vendor_name=F('bill__supplier_id__jina'),
            vendor_id=F('bill__supplier_id_id'),
        )
        .values(
            'id', 'Amount', 'tarehe', 'maelezo', 'kwenda', 'bill_id',
            'bill_code', 'branch_name', 'bill_branch_name',
            'vendor_name', 'vendor_id',
            'by__user__user__first_name',
            'by__user__user__last_name',
            'by__user__user__username',
        )
    )

    period_purchase = sum(float(r['amount'] or 0) for r in period_bills)
    period_payments_total = sum(float(r['Amount'] or 0) for r in period_payments)

    inv_by_id = {inv['id']: inv for inv in period_bills}
    period_ids = list(inv_by_id.keys())

    line_rows = []
    inv_ids_with_lines = set()
    if period_ids:
        stocks = list(
            bidhaa_stoku.objects.filter(manunuzi__manunuzi_id__in=period_ids)
            .exclude(manunuzi__idadi=F('manunuzi__rudi'))
            .annotate(
                item_name=F('bidhaa__bidhaa_jina'),
                vipimo=F('bidhaa__vipimo'),
                vipimo_jum=F('bidhaa__vipimo_jum'),
                uwiano=F('bidhaa__idadi_jum'),
                line_qty=F('manunuzi__idadi'),
                line_rudi=F('manunuzi__rudi'),
                vat_set=F('manunuzi__vat_set'),
                bill_id=F('manunuzi__manunuzi_id'),
                list_id=F('manunuzi_id'),
            )
            .values(
                'id', 'item_name', 'vipimo', 'vipimo_jum', 'uwiano',
                'line_qty', 'line_rudi', 'Bei_kununua', 'vat_set', 'bill_id', 'list_id',
            )
        )
        by_line = {}
        for st in stocks:
            lid = st.get('list_id') or st['id']
            if lid not in by_line:
                by_line[lid] = st

        for line in by_line.values():
            inv = inv_by_id.get(line['bill_id'])
            if not inv:
                continue
            qty_base = float(line.get('line_qty') or 0) - float(line.get('line_rudi') or 0)
            if qty_base <= 0:
                continue
            inv_ids_with_lines.add(line['bill_id'])
            dt = inv['tarehe']
            show_qty, unit_price, units, line_tot = purchase_line_qty_price(
                qty_base,
                line.get('Bei_kununua') or 0,
                line.get('uwiano') or 1,
                line.get('vipimo') or '',
                line.get('vipimo_jum') or '',
                bool(line.get('vat_set')),
                vatper,
            )
            line_debt = round(float(line_tot), 2)
            line_rows.append({
                'sort': dt.isoformat() if dt else '',
                'sort_sub': 1,
                'kind': 'line',
                'id': line['id'],
                'invo_id': line['bill_id'],
                'vendor_id': inv.get('supplier_id_id'),
                'vendor': str(inv.get('supplier_id__jina') or '').strip(),
                'date': inv['date'].isoformat() if inv.get('date') else (dt.date().isoformat() if dt else ''),
                'datetime': dt.isoformat() if dt else '',
                'item': str(line.get('item_name') or '').strip() or f"BILL-{inv['code']}",
                'units': units,
                'branch': str(inv.get('Interprise__name') or '').strip(),
                'recorded_by': _recorded_by_name(
                    inv,
                    'By__user__user__first_name',
                    'By__user__user__last_name',
                    'By__user__user__username',
                ),
                'price': float(unit_price),
                'qty': float(show_qty),
                'debt': line_debt,
                'credit': 0.0,
                'affects_balance': True,
                'balance_delta': line_debt,
            })

        for inv in period_bills:
            if inv['id'] in inv_ids_with_lines:
                continue
            dt = inv['tarehe']
            amt = float(inv['amount'] or 0)
            line_rows.append({
                'sort': dt.isoformat() if dt else '',
                'sort_sub': 1,
                'kind': 'line',
                'id': inv['id'],
                'invo_id': inv['id'],
                'vendor_id': inv.get('supplier_id_id'),
                'vendor': str(inv.get('supplier_id__jina') or '').strip(),
                'date': inv['date'].isoformat() if inv.get('date') else (dt.date().isoformat() if dt else ''),
                'datetime': dt.isoformat() if dt else '',
                'item': f"BILL-{inv['code']}",
                'units': '',
                'branch': str(inv.get('Interprise__name') or '').strip(),
                'recorded_by': _recorded_by_name(
                    inv,
                    'By__user__user__first_name',
                    'By__user__user__last_name',
                    'By__user__user__username',
                ),
                'price': amt,
                'qty': 1.0,
                'debt': round(amt, 2),
                'credit': 0.0,
                'affects_balance': True,
                'balance_delta': round(amt, 2),
            })

    pay_rows = []
    for pay in period_payments:
        dt = pay['tarehe']
        credit = float(pay['Amount'] or 0)
        pay_rows.append({
            'sort': dt.isoformat() if dt else '',
            'sort_sub': 2,
            'kind': 'payment',
            'id': pay['id'],
            'invo_id': pay.get('bill_id'),
            'vendor_id': pay.get('vendor_id'),
            'vendor': str(pay.get('vendor_name') or '').strip(),
            'date': dt.date().isoformat() if dt else '',
            'datetime': dt.isoformat() if dt else '',
            'item': '',
            'units': '',
            'branch': str(pay.get('branch_name') or pay.get('bill_branch_name') or '').strip(),
            'recorded_by': _recorded_by_name(
                pay,
                'by__user__user__first_name',
                'by__user__user__last_name',
                'by__user__user__username',
            ),
            'price': 0.0,
            'qty': 0.0,
            'debt': 0.0,
            'credit': credit,
            'affects_balance': True,
            'balance_delta': -credit,
        })

    rows = line_rows + pay_rows
    rows.sort(key=lambda x: (x['sort'], x['sort_sub'], x.get('id', 0)))

    transactions = []
    balance = opening_signed
    if abs(opening_signed) >= 0.005:
        transactions.append({
            'kind': 'opening',
            'date': t_fr_dt.date().isoformat(),
            'datetime': t_fr_dt.date().isoformat(),
            'item': '',
            'units': '',
            'vendor': '',
            'vendor_id': None,
            'branch': '',
            'recorded_by': '',
            'price': 0.0,
            'qty': 0.0,
            'debt': 0.0,
            'credit': 0.0,
            'balance': round(opening_signed, 2),
            'affects_balance': False,
        })

    for row in rows:
        if row.get('affects_balance'):
            balance += row.get('balance_delta') or 0.0
        bal_display = round(balance, 2)
        if abs(bal_display) < 0.005:
            bal_display = 0.0
        transactions.append({
            'kind': row['kind'],
            'id': row['id'],
            'invo_id': row.get('invo_id'),
            'vendor': row.get('vendor') or '',
            'vendor_id': row.get('vendor_id'),
            'date': row['date'],
            'datetime': row['datetime'],
            'item': row['item'],
            'units': row.get('units', ''),
            'branch': row.get('branch', ''),
            'recorded_by': row.get('recorded_by', ''),
            'price': row['price'],
            'qty': row['qty'],
            'debt': row['debt'],
            'credit': row['credit'],
            'balance': bal_display,
            'affects_balance': row.get('affects_balance', True),
        })

    closing = round(balance, 2)
    if abs(closing) < 0.005:
        closing = 0.0

    return {
        'summary': {
            'total_debt': round(total_debt, 2),
            'total_invoices': int(totals.get('total_invoices') or 0),
            'total_purchase': float(totals.get('total_purchase') or 0),
            'period_invoices': len(period_bills),
            'period_purchase': round(period_purchase, 2),
            'period_payments': round(period_payments_total, 2),
            'opening_balance': round(opening_signed, 2),
            'closing_balance': closing,
        },
        'transactions': transactions,
    }


def vendor_period_receipts(duka, vendor_id, t_fr_dt, t_to_dt, branch_ids, request=None):
    branches = list(branch_ids or [duka.id])
    pay_atts = MatumiziReceiptAttachment.objects.filter(
        toa_cash__isnull=False,
        toa_cash__pu=True,
        toa_cash__bill__isnull=False,
        toa_cash__bill__order=False,
        toa_cash__bill__full_returned=False,
        toa_cash__bill__supplier_id_id__isnull=False,
    ).filter(
        Q(toa_cash__Interprise_id__in=branches) | Q(toa_cash__bill__Interprise_id__in=branches)
    ).filter(
        Q(toa_cash__tarehe__gte=t_fr_dt, toa_cash__tarehe__lte=t_to_dt)
        | Q(uploaded_at__gte=t_fr_dt, uploaded_at__lte=t_to_dt)
    )
    bill_atts = MatumiziReceiptAttachment.objects.filter(
        toa_cash__isnull=True,
        manunuzi__isnull=False,
        manunuzi__order=False,
        manunuzi__full_returned=False,
        manunuzi__supplier_id_id__isnull=False,
        manunuzi__Interprise_id__in=branches,
    ).filter(
        Q(manunuzi__tarehe__gte=t_fr_dt, manunuzi__tarehe__lte=t_to_dt)
        | Q(uploaded_at__gte=t_fr_dt, uploaded_at__lte=t_to_dt)
    )
    if vendor_id:
        pay_atts = pay_atts.filter(toa_cash__bill__supplier_id_id=vendor_id)
        bill_atts = bill_atts.filter(manunuzi__supplier_id_id=vendor_id)

    related = (
        'toa_cash',
        'manunuzi',
        'manunuzi__supplier_id',
        'toa_cash__bill',
        'toa_cash__bill__supplier_id',
        'toa_cash__Interprise',
        'manunuzi__Interprise',
    )
    seen = set()
    atts = []
    for att in list(pay_atts.select_related(*related).order_by('uploaded_at', 'id')) + list(
        bill_atts.select_related(*related).order_by('uploaded_at', 'id')
    ):
        if att.id in seen:
            continue
        seen.add(att.id)
        atts.append(att)

    groups = {}
    order = []
    for att in atts:
        if not att.image:
            continue
        key = att.image.name or f'att-{att.id}'
        if key not in groups:
            groups[key] = {
                'id': att.id,
                'url': '',
                'amount': 0.0,
                'pay_ids': set(),
                'bill_ids': set(),
                'vendor': '',
                'vendor_id': None,
                'date': '',
                'datetime': '',
                'kind': 'bill',
                'ref': '',
                'branch': '',
            }
            order.append(key)
            try:
                url = att.image.url
            except Exception:
                url = ''
            if url and request:
                url = request.build_absolute_uri(url)
            groups[key]['url'] = url

        row = groups[key]
        pay = att.toa_cash
        bill = att.manunuzi or (pay.bill if pay else None)
        if pay and pay.id not in row['pay_ids']:
            row['pay_ids'].add(pay.id)
            row['amount'] += float(pay.Amount or 0)
            row['kind'] = 'payment'
            dt = pay.tarehe
            if dt:
                row['datetime'] = dt.isoformat()
                row['date'] = dt.date().isoformat()
            if pay.bill_id:
                row['bill_ids'].add(pay.bill_id)
                row['ref'] = f"BILL-{pay.bill.code}" if pay.bill else row['ref']
                vendor = getattr(pay.bill.supplier_id, 'jina', '') if pay.bill else ''
                if vendor:
                    row['vendor'] = vendor
                    row['vendor_id'] = pay.bill.supplier_id_id
            br = ''
            if pay.Interprise:
                br = pay.Interprise.name
            elif pay.bill and pay.bill.Interprise:
                br = pay.bill.Interprise.name
            if br:
                row['branch'] = br
        elif not pay and bill and bill.id not in row['bill_ids']:
            row['bill_ids'].add(bill.id)
            if not row['pay_ids']:
                row['amount'] += float(bill.amount or 0)
                row['kind'] = 'bill'
            row['ref'] = f"BILL-{bill.code}"
            vendor = getattr(bill.supplier_id, 'jina', '') if bill.supplier_id_id else ''
            if vendor:
                row['vendor'] = vendor
                row['vendor_id'] = bill.supplier_id_id
            dt = bill.tarehe
            if dt and not row['datetime']:
                row['datetime'] = dt.isoformat()
                row['date'] = dt.date().isoformat() if hasattr(dt, 'date') else str(dt)
            if bill.Interprise:
                row['branch'] = bill.Interprise.name

    receipts = []
    total = 0.0
    for key in order:
        row = groups[key]
        amt = round(row['amount'], 2)
        total += amt
        receipts.append({
            'id': row['id'],
            'url': row['url'],
            'amount': amt,
            'vendor': row['vendor'],
            'vendor_id': row['vendor_id'],
            'date': row['date'],
            'datetime': row['datetime'],
            'kind': row['kind'],
            'ref': row['ref'],
            'branch': row['branch'],
            'covers': len(row['pay_ids']) or len(row['bill_ids']),
        })
    return receipts, round(total, 2)


def vendor_unpaid_bills(vendor_id, branch_ids):
    qs = manunuzi.objects.filter(
        supplier_id_id=vendor_id,
        Interprise_id__in=list(branch_ids or []),
        order=False,
        full_returned=False,
    ).filter(amount__gt=F('ilolipwa')).select_related('Interprise').order_by('tarehe', 'id')
    rows = []
    total = Decimal('0')
    for bill in qs:
        due = (bill.amount or Decimal('0')) - (bill.ilolipwa or Decimal('0'))
        if due <= 0:
            continue
        rows.append({
            'id': bill.id,
            'code': bill.code,
            'date': bill.date.isoformat() if bill.date else '',
            'tarehe': bill.tarehe.isoformat() if bill.tarehe else '',
            'branch': bill.Interprise.name if bill.Interprise else '',
            'amount': float(bill.amount or 0),
            'paid': float(bill.ilolipwa or 0),
            'due': float(due),
        })
        total += due
    return rows, total


def _parse_pay_date(raw):
    if not raw:
        return datetime.date.today()
    text = str(raw).strip()
    try:
        return datetime.date.fromisoformat(text[:10])
    except ValueError:
        pass
    parts = text.replace('/', '-').split('-')
    if len(parts) >= 3:
        try:
            return datetime.date(int(parts[0]), int(parts[1]), int(parts[2]))
        except ValueError:
            pass
    return datetime.date.today()


def _money(value, default='0'):
    try:
        return Decimal(str(value if value is not None else default))
    except Exception:
        return Decimal(default)


@transaction.atomic
def apply_vendor_fifo_payment(cheo, vendor_id, branch_ids, account_id, paid, paid_set, bal, bal_set, pay_d):
    if not cheo or not getattr(cheo, 'Interprise', None):
        return {'ok': False, 'swa': 'Hakuna ruhusa', 'eng': 'Not allowed'}

    toakwa = PaymentAkaunts.objects.select_for_update().filter(
        pk=account_id,
        Interprise__owner=cheo.Interprise.owner,
    ).first()
    if not toakwa:
        return {'ok': False, 'swa': 'Akaunti haijapatikana', 'eng': 'Account not found'}

    bills = list(
        manunuzi.objects.select_for_update()
        .filter(
            supplier_id_id=vendor_id,
            Interprise_id__in=list(branch_ids or []),
            order=False,
            full_returned=False,
        )
        .filter(amount__gt=F('ilolipwa'))
        .order_by('tarehe', 'id')
    )
    if not bills:
        return {
            'ok': False,
            'swa': 'Hakuna bili zinazodaiwa kwa matawi yaliyochaguliwa',
            'eng': 'No unpaid bills in the selected branches',
        }

    total_due = sum(((b.amount or Decimal('0')) - (b.ilolipwa or Decimal('0'))) for b in bills)

    if paid_set:
        apply_total = _money(paid)
    else:
        apply_total = total_due

    if apply_total <= 0:
        return {'ok': False, 'swa': 'Weka kiasi kinacholipwa', 'eng': 'Enter the amount to pay'}
    if apply_total > total_due + Decimal('0.005'):
        return {
            'ok': False,
            'swa': 'Kiasi kinacholipwa kimezidi deni linalodaiwa',
            'eng': 'The amount exceeds the outstanding vendor debt',
        }
    if toakwa.Amount < apply_total:
        return {
            'ok': False,
            'swa': 'Akaunti haina kiasi cha kutosha kulipia',
            'eng': 'The selected account has insufficient funds',
        }

    bal_d = _money(bal)
    if bal_set and (toakwa.Amount - apply_total) < (bal_d - Decimal('0.005')):
        return {
            'ok': False,
            'swa': 'Kiasi kinachobaki kinazidi salio halisi baada ya malipo',
            'eng': 'The remaining balance exceeds the actual account balance after payment',
        }

    pay_date = _parse_pay_date(pay_d)
    remaining = apply_total
    running = toakwa.Amount
    start_amount = toakwa.Amount
    last_toa = None
    allocated = []
    now = dj_timezone.now()

    for bill in bills:
        if remaining <= 0:
            break
        due = (bill.amount or Decimal('0')) - (bill.ilolipwa or Decimal('0'))
        if due <= 0:
            continue
        slice_amt = due if remaining >= due else remaining
        bill.ilolipwa = (bill.ilolipwa or Decimal('0')) + slice_amt
        if bill.ilolipwa >= bill.amount:
            bill.full_paid = True
            bill.kulipa = pay_date
        bill.akaunt = toakwa
        bill.save()

        toa = toaCash()
        toa.Akaunt = toakwa
        toa.Amount = slice_amt
        toa.before = running
        running = running - slice_amt
        toa.After = running
        toa.makato = 0
        toa.kwenda = 'Bill Payment'
        toa.maelezo = f'Bill Payment BILL-{bill.code}'
        toa.tarehe = now
        toa.by = cheo
        toa.Interprise = cheo.Interprise
        toa.pu = True
        toa.bill = bill
        if not toakwa.onesha:
            toa.usiri = True
        toa.save()
        last_toa = toa
        allocated.append({
            'id': bill.id,
            'code': bill.code,
            'applied': float(slice_amt),
            'closed': bool(bill.full_paid),
        })
        remaining -= slice_amt

    if not allocated:
        return {'ok': False, 'swa': 'Hakuna bili zilizolipwa', 'eng': 'No bills were paid'}

    if bal_set:
        toakwa.Amount = bal_d
        if last_toa:
            last_toa.After = bal_d
            last_toa.makato = start_amount - (bal_d + apply_total)
            last_toa.save(update_fields=['After', 'makato'])
    else:
        toakwa.Amount = running
    toakwa.save()

    return {
        'ok': True,
        'applied': float(apply_total),
        'allocated': allocated,
        'swa': 'Malipo ya bili yamefanikiwa',
        'eng': 'Bill payment recorded successfully',
    }
