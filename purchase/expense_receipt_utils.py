from django.db.models import Exists, OuterRef

from management.models import MatumiziReceiptAttachment, rekodiMatumizi


def active_branch_id(duka):
    """Branch enterprises only (not head-office / pent)."""
    if not duka or not getattr(duka, 'Interprise', False):
        return None
    return duka.pk


def _expense_receipt_exists_subquery():
    return MatumiziReceiptAttachment.objects.filter(
        rekodi_matumizi_id=OuterRef('pk'),
        Interprise_id=OuterRef('Interprise_id'),
    ).exclude(image='')


def pending_mandatory_expense_receipts_qs(duka):
    branch_id = active_branch_id(duka)
    if branch_id is None:
        return rekodiMatumizi.objects.none()
    return rekodiMatumizi.objects.filter(
        Interprise_id=branch_id,
        matumizi__attach_receipt=True,
    ).annotate(
        has_receipt=Exists(_expense_receipt_exists_subquery()),
    ).filter(has_receipt=False)


def count_pending_mandatory_expense_receipts(duka):
    return pending_mandatory_expense_receipts_qs(duka).count()


def pending_mandatory_expense_receipts_list(duka, limit=300):
    return pending_mandatory_expense_receipts_qs(duka).select_related(
        'matumizi', 'by__user__user', 'akaunti',
    ).order_by('-tarehe')[:limit]
