"""Receipt / invoice print format helpers."""

RECEIPT_A4 = 0
RECEIPT_THERMAL58 = 1
RECEIPT_THERMAL80 = 2

RECEIPT_TEMPLATES = {
    RECEIPT_A4: 'invo.html',
    RECEIPT_THERMAL58: 'minRecept.html',
    RECEIPT_THERMAL80: 'posRecept.html',
}


def normalize_receipt_paper(value):
    """Map URL / POST value to 0 (A4), 1 (58mm), or 2 (80mm POS)."""
    if value is True:
        return RECEIPT_THERMAL58
    if value is False or value is None:
        return RECEIPT_A4
    text = str(value).strip().lower()
    if text in ('2', '80', '80mm', '84mm', 'pos', 'thermal80', 'pos80'):
        return RECEIPT_THERMAL80
    if text in ('1', '58', '58mm', 'mini', 'thermal', 'thermal58', 'small', 'mnrecipt'):
        return RECEIPT_THERMAL58
    if text in ('0', 'a4', 'large', 'paper', 'invo'):
        return RECEIPT_A4
    try:
        num = int(float(text))
    except (TypeError, ValueError):
        return RECEIPT_A4
    if num in RECEIPT_TEMPLATES:
        return num
    return RECEIPT_A4


def receipt_template_for_paper(value):
    paper = normalize_receipt_paper(value)
    return RECEIPT_TEMPLATES.get(paper, 'invo.html')


def receipt_paper_from_cheo(cheo):
    if cheo is None:
        return RECEIPT_A4
    paper = getattr(cheo, 'receiptPaper', None)
    if paper is not None:
        return normalize_receipt_paper(paper)
    if getattr(cheo, 'mnRecipt', False):
        return RECEIPT_THERMAL58
    return RECEIPT_A4


def sync_legacy_mn_receipt(cheo):
    """Keep mnRecipt True for any thermal format (legacy checks)."""
    if cheo is None:
        return
    paper = receipt_paper_from_cheo(cheo)
    cheo.receiptPaper = paper
    cheo.mnRecipt = paper in (RECEIPT_THERMAL58, RECEIPT_THERMAL80)


def shift_paper_class(paper_value):
    """CSS class suffix for staff shift print pages."""
    paper = normalize_receipt_paper(paper_value)
    if paper == RECEIPT_THERMAL58:
        return 'thermal58'
    if paper == RECEIPT_THERMAL80:
        return 'thermal80'
    return 'large'


def normalize_waiter_receipt_paper(value):
    """Waiter thermal printers only: 1 (58mm) or 2 (80mm). Default 58mm."""
    paper = normalize_receipt_paper(value)
    if paper == RECEIPT_THERMAL80:
        return RECEIPT_THERMAL80
    return RECEIPT_THERMAL58


def waiter_receipt_paper_from_interprise(interprise):
    if interprise is None:
        return RECEIPT_THERMAL58
    from management.models import Interprise
    pk = getattr(interprise, 'pk', None) or getattr(interprise, 'id', None)
    if pk:
        paper = Interprise.objects.filter(pk=pk).values_list('waiter_receipt_paper', flat=True).first()
        # print("paper",paper)
        if paper is not None:
            return normalize_waiter_receipt_paper(paper)
    return normalize_waiter_receipt_paper(getattr(interprise, 'waiter_receipt_paper', RECEIPT_THERMAL58))
