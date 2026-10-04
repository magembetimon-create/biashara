from django.db.models import Exists, OuterRef, Q

from management.models import (
    MatumiziReceiptAttachment,
    manunuzi,
    receive,
    toaCash,
    wekaCash,
)
from purchase.expense_receipt_utils import count_pending_mandatory_expense_receipts


def is_shop_admin(cheo):
    if not cheo:
        return False
    return bool(
        getattr(cheo, 'owner', False)
        or getattr(cheo, 'msaidizi', False)
        or getattr(cheo, 'fullcontrol', False)
    )


def _branch_id(duka):
    if not duka or not getattr(duka, 'Interprise', False):
        return None
    return duka.pk


def pending_receives_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return receive.objects.none()
    return receive.objects.filter(Interprise_id=bid, admin_approved=False)


def pending_purchases_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return manunuzi.objects.none()
    return manunuzi.objects.filter(
        Interprise_id=bid,
        order=False,
        full_returned=False,
        admin_approved=False,
    )


def pending_purchase_payments_qs(duka):
    bid = _branch_id(duka)
    if not bid or not getattr(duka, 'require_purchase_payment_receipt', False):
        return toaCash.objects.none()
    has_receipt = MatumiziReceiptAttachment.objects.filter(
        toa_cash_id=OuterRef('pk'),
    ).exclude(image='')
    return toaCash.objects.filter(
        Interprise_id=bid,
        pu=True,
        bill__isnull=False,
        matumizi__isnull=True,
    ).annotate(has_receipt=Exists(has_receipt)).filter(has_receipt=False)


def pending_customer_payments_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return wekaCash.objects.none()
    return wekaCash.objects.filter(
        Interprise_id=bid,
        invo__isnull=False,
        admin_approve=False,
    ).exclude(
        Q(by__owner=True) | Q(by__msaidizi=True) | Q(by__fullcontrol=True)
    )


def pending_noncash_payments_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return wekaCash.objects.none()
    return wekaCash.objects.filter(
        Interprise_id=bid,
        invo__isnull=False,
        admin_approve=False,
    ).exclude(Akaunt__aina__iexact='Cash')


def apply_weka_admin_flag(weka, cheo):
    weka.admin_approve = is_shop_admin(cheo)
    return weka


def apply_record_admin_flag(obj, cheo):
    if is_shop_admin(cheo):
        obj.admin_approved = True
        obj.admin_approved_by = cheo
        try:
            from django.utils import timezone as dj_tz
            obj.admin_approved_at = dj_tz.now()
        except Exception:
            pass
    else:
        obj.admin_approved = False
    return obj


def hub_approval_counts(duka):
    expenses = count_pending_mandatory_expense_receipts(duka)
    receive_n = pending_receives_qs(duka).count()
    purchases = pending_purchases_qs(duka).count()
    pay_receipts = pending_purchase_payments_qs(duka).count()
    cust_ids = set(pending_customer_payments_qs(duka).values_list('pk', flat=True))
    non_ids = set(pending_noncash_payments_qs(duka).values_list('pk', flat=True))
    return {
        'receive': receive_n,
        'purchases': purchases,
        'expenses': expenses,
        'purchase_pay': pay_receipts,
        'customer_pay': len(cust_ids),
        'noncash': len(non_ids),
        'total': receive_n + purchases + expenses + pay_receipts + len(cust_ids | non_ids),
        'require_purchase_receipt': bool(getattr(duka, 'require_purchase_payment_receipt', False)),
    }
