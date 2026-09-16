from decimal import Decimal

from django.db.models import Count, DecimalField, F, Sum
from django.utils import timezone as dj_timezone
from django.utils.dateparse import parse_datetime

from management.models import (
    Interprise,
    bidhaa_stoku,
    manunuzi,
    toaCash,
    wasambazaji,
)
import datetime


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


def vendor_bills_qs(duka, vendor_id, branch_ids):
    return manunuzi.objects.filter(
        supplier_id_id=vendor_id,
        Interprise_id__in=list(branch_ids or [duka.id]),
        order=False,
        full_returned=False,
    )


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
    payments_before = toaCash.objects.filter(
        pu=True,
        bill__supplier_id_id=vendor_id,
        bill__Interprise_id__in=list(branch_ids or [duka.id]),
        tarehe__lt=t_fr_dt,
    ).aggregate(s=Sum('Amount'))['s'] or Decimal('0')
    opening_signed = float(purchases_before - payments_before)

    period_bills = list(
        bills_qs.filter(tarehe__gte=t_fr_dt, tarehe__lte=t_to_dt).values(
            'id', 'code', 'amount', 'ilolipwa', 'tarehe', 'date',
        )
    )
    period_payments = list(
        toaCash.objects.filter(
            pu=True,
            bill__supplier_id_id=vendor_id,
            bill__Interprise_id__in=list(branch_ids or [duka.id]),
            tarehe__gte=t_fr_dt,
            tarehe__lte=t_to_dt,
        )
        .annotate(bill_code=F('bill__code'))
        .values('id', 'Amount', 'tarehe', 'maelezo', 'kwenda', 'bill_id', 'bill_code')
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
            .annotate(
                item_name=F('bidhaa__bidhaa_jina'),
                vipimo=F('bidhaa__vipimo'),
                line_qty=F('manunuzi__idadi'),
                line_rudi=F('manunuzi__rudi'),
                bill_id=F('manunuzi__manunuzi_id'),
                list_id=F('manunuzi_id'),
            )
            .values('id', 'item_name', 'vipimo', 'line_qty', 'line_rudi', 'Bei_kununua', 'bill_id', 'list_id')
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
            inv_ids_with_lines.add(line['bill_id'])
            dt = inv['tarehe']
            qty = float(line.get('line_qty') or 0) - float(line.get('line_rudi') or 0)
            if qty < 0:
                qty = 0.0
            price = float(line.get('Bei_kununua') or 0)
            line_debt = round(qty * price, 2)
            line_rows.append({
                'sort': dt.isoformat() if dt else '',
                'sort_sub': 1,
                'kind': 'line',
                'id': line['id'],
                'invo_id': line['bill_id'],
                'date': inv['date'].isoformat() if inv.get('date') else (dt.date().isoformat() if dt else ''),
                'datetime': dt.isoformat() if dt else '',
                'item': str(line.get('item_name') or '').strip() or f"BILL-{inv['code']}",
                'units': str(line.get('vipimo') or '').strip(),
                'price': price,
                'qty': qty,
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
                'date': inv['date'].isoformat() if inv.get('date') else (dt.date().isoformat() if dt else ''),
                'datetime': dt.isoformat() if dt else '',
                'item': f"BILL-{inv['code']}",
                'units': '',
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
        desc = (pay.get('maelezo') or pay.get('kwenda') or '').strip()
        if not desc and pay.get('bill_code'):
            desc = f"BILL-{pay['bill_code']}"
        credit = float(pay['Amount'] or 0)
        pay_rows.append({
            'sort': dt.isoformat() if dt else '',
            'sort_sub': 2,
            'kind': 'payment',
            'id': pay['id'],
            'invo_id': pay.get('bill_id'),
            'date': dt.date().isoformat() if dt else '',
            'datetime': dt.isoformat() if dt else '',
            'item': desc or '—',
            'units': '',
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
            'date': row['date'],
            'datetime': row['datetime'],
            'item': row['item'],
            'units': row.get('units', ''),
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
