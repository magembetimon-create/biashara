from django.db.models import Count, Exists, OuterRef, Q

from management.models import (
    MatumiziReceiptAttachment,
    Notifications,
    manunuzi,
    receive,
    received_confirm,
    rekodiMatumizi,
    stockAdjst_confirm,
    toaCash,
    wekaCash,
)


def is_shop_admin(cheo):
    if not cheo:
        return False
    return bool(
        getattr(cheo, 'owner', False)
        or getattr(cheo, 'msaidizi', False)
        or getattr(cheo, 'fullcontrol', False)
    )


def _saved_by_admin_q(field):
    return (
        Q(**{f'{field}__owner': True})
        | Q(**{f'{field}__msaidizi': True})
        | Q(**{f'{field}__fullcontrol': True})
    )


def exclude_saved_by_admin(qs, *fields):
    for field in fields:
        qs = qs.exclude(_saved_by_admin_q(field))
    return qs


def _branch_id(duka):
    if not duka or not getattr(duka, 'Interprise', False):
        return None
    return duka.pk


def pending_receives_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return receive.objects.none()
    return exclude_saved_by_admin(
        receive.objects.filter(Interprise_id=bid, admin_approved=False),
        'By',
        'transfer__By',
    )


def pending_purchases_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return manunuzi.objects.none()
    return exclude_saved_by_admin(
        manunuzi.objects.filter(
            Interprise_id=bid,
            order=False,
            full_returned=False,
            admin_approved=False,
        ),
        'By',
    )


def pending_purchase_payments_qs(duka):
    bid = _branch_id(duka)
    if not bid or not getattr(duka, 'require_purchase_payment_receipt', False):
        return toaCash.objects.none()
    has_receipt = MatumiziReceiptAttachment.objects.filter(
        toa_cash_id=OuterRef('pk'),
    ).exclude(image='')
    return exclude_saved_by_admin(
        toaCash.objects.filter(
            Interprise_id=bid,
            pu=True,
            bill__isnull=False,
            matumizi__isnull=True,
        ).annotate(has_receipt=Exists(has_receipt)).filter(has_receipt=False),
        'by',
    )


def _followup_customer_pay_qs(duka):
    """Later payments on a saved invoice for a registered /mauzo/customer — not POS checkout."""
    bid = _branch_id(duka)
    if not bid:
        return wekaCash.objects.none()
    from django.db.models.functions import Trim
    return wekaCash.objects.filter(
        Interprise_id=bid,
        invo__isnull=False,
        invo__customer_id__isnull=False,
    ).annotate(_pay_from=Trim('kutoka')).exclude(_pay_from__iexact='Sales')


def pending_customer_payments_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return wekaCash.objects.none()
    return exclude_saved_by_admin(
        _followup_customer_pay_qs(duka).filter(admin_approve=False),
        'by',
    )


def pending_noncash_payments_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return wekaCash.objects.none()
    return exclude_saved_by_admin(
        _followup_customer_pay_qs(duka).filter(admin_approve=False).exclude(
            Akaunt__aina__iexact='Cash',
        ),
        'by',
    )


def pending_expense_receipts_qs(duka):
    bid = _branch_id(duka)
    if not bid:
        return rekodiMatumizi.objects.none()
    has_receipt = MatumiziReceiptAttachment.objects.filter(
        rekodi_matumizi_id=OuterRef('pk'),
        Interprise_id=OuterRef('Interprise_id'),
    ).exclude(image='')
    return exclude_saved_by_admin(
        rekodiMatumizi.objects.filter(
            Interprise_id=bid,
            matumizi__attach_receipt=True,
        ).annotate(has_receipt=Exists(has_receipt)).filter(has_receipt=False),
        'by',
    )


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


def pending_adjusts_qs(cheo, duka):
    if not cheo or not duka or not getattr(duka, 'Interprise', False):
        return stockAdjst_confirm.objects.none()
    return stockAdjst_confirm.objects.filter(
        userP_id=cheo.id,
        confirmed=False,
        dinied=False,
        userP__Allow=True,
        adjs__Interprise_id=duka.id,
        adjs__isnull=False,
    )


def hub_approval_counts(duka, cheo=None):
    expenses = pending_expense_receipts_qs(duka).count()
    receive_n = pending_receives_qs(duka).count()
    purchases = pending_purchases_qs(duka).count()
    pay_receipts = pending_purchase_payments_qs(duka).count()
    cust_ids = set(pending_customer_payments_qs(duka).values_list('pk', flat=True))
    non_ids = set(pending_noncash_payments_qs(duka).values_list('pk', flat=True))
    adjust_n = pending_adjusts_qs(cheo, duka).count()
    return {
        'receive': receive_n,
        'purchases': purchases,
        'expenses': expenses,
        'purchase_pay': pay_receipts,
        'customer_pay': len(cust_ids),
        'noncash': len(non_ids),
        'adjust': adjust_n,
        'total': receive_n + purchases + expenses + pay_receipts + len(cust_ids | non_ids) + adjust_n,
        'require_purchase_receipt': bool(getattr(duka, 'require_purchase_payment_receipt', False)),
    }


def branch_notification_count(duka, cheo, useri, request_user):
    """Hub pending + unread info for one branch (no receive double-count)."""
    if not duka or not getattr(duka, 'Interprise', False):
        return 0
    hub = 0
    info = 0
    try:
        hub = int(hub_approval_counts(duka, cheo).get('total', 0) or 0)
    except Exception:
        hub = 0
    try:
        info = int(info_unread_counts(duka, useri, request_user).get('all', 0) or 0)
    except Exception:
        info = 0
    return hub + info


def exclude_pending_receive_info(qs, *dukas):
    """Receive items that wait for hub approval must not also appear as info notices."""
    pending = Q()
    for duka in dukas:
        if not duka:
            continue
        pending |= Q(itmRcv=True, itmRcv_map_id__in=pending_receives_qs(duka).values('pk'))
    if pending:
        qs = qs.exclude(pending)
    return qs


def mark_receive_info_notes_read(duka, receive_ids):
    if not duka or not receive_ids:
        return 0
    return Notifications.objects.filter(
        Interprise_id=duka.id,
        itmRcv=True,
        itmRcv_map_id__in=list(receive_ids),
    ).update(admin_read=True, AnyUser_read=True, Incharge_reade=True)


def mark_receive_peer_confirms(receive_ids, when=None):
    """Hub admin approve also closes Hakiki kupokea on viewReceives."""
    if not receive_ids:
        return 0
    if when is None:
        from django.utils import timezone as dj_tz
        when = dj_tz.now()
    return received_confirm.objects.filter(receive_id__in=list(receive_ids)).update(
        confirmed=True,
        tarehe=when,
    )


def unread_info_filter(useri, request_user):
    uid = getattr(useri, 'id', None)
    ru = getattr(request_user, 'id', None)
    return (
        Q(admin_read=False, Interprise__owner__user_id=ru)
        | Q(Incharge_id=uid, Incharge_reade=False)
        | Q(admin_read=False, AnyUser_read=False, Incharge_reade=False)
    )


def is_info_notification_unread(nt, useri, request_user):
    if getattr(nt, 'itmRcv', False):
        return False
    ru = getattr(request_user, 'id', None)
    uid = getattr(useri, 'id', None)
    owner_user_id = None
    try:
        owner_user_id = nt.Interprise.owner.user_id
    except Exception:
        owner_user_id = None
    if ru and owner_user_id == ru and not nt.admin_read:
        return True
    if uid and nt.Incharge_id == uid and not nt.Incharge_reade:
        return True
    if not nt.admin_read and not nt.AnyUser_read and not nt.Incharge_reade:
        return True
    return False


def info_unread_counts(duka, useri, request_user):
    keys = ('all', 'ed', 'ced', 'po', 'it', 'so', 'ir', 'rt', 'rd', 'pk')
    empty = {k: 0 for k in keys}
    if not duka:
        return empty
    qs = Notifications.objects.filter(Interprise_id=duka.id).filter(
        unread_info_filter(useri, request_user)
    ).exclude(itmRcv=True)
    qs = exclude_pending_receive_info(qs, duka)
    data = qs.aggregate(
        all=Count('pk'),
        ed=Count('pk', filter=Q(ItemEdit=True)),
        ced=Count('pk', filter=Q(ItemCatEdit=True)),
        po=Count('pk', filter=Q(puO=True)),
        it=Count('pk', filter=Q(itmTr=True)),
        so=Count('pk', filter=Q(saO=True)),
        ir=Count('pk', filter=Q(itmRcv=True)),
        rt=Count('pk', filter=Q(bilRtn=True)),
        rd=Count('pk', filter=Q(saRtn=True)),
        pk=Count('pk', filter=Q(pickUp=True)),
    )
    return {k: int(data.get(k) or 0) for k in keys}


def qty_unit_display(base_qty, bidhaa, jum=None):
    """Show qty/unit using jumla vs rejareja ratio, like viewbill / viewTransfer."""
    try:
        qty = float(base_qty or 0)
    except (TypeError, ValueError):
        qty = 0.0
    uw = 1.0
    try:
        uw = float(getattr(bidhaa, 'idadi_jum', None) or 1) or 1.0
    except (TypeError, ValueError):
        uw = 1.0
    reja = (getattr(bidhaa, 'vipimo', None) or '').strip()
    jumla = (getattr(bidhaa, 'vipimo_jum', None) or '').strip()

    def _n(n):
        if abs(n - round(n)) < 1e-6:
            return str(int(round(n)))
        return ('%.2f' % n).rstrip('0').rstrip('.')

    if uw <= 1:
        return _n(qty), reja

    packs = int(qty // uw) if uw else 0
    rem = qty - (packs * uw)
    if abs(rem) < 1e-6:
        rem = 0.0

    if jum is False:
        return _n(qty), reja
    if jum is True:
        if rem:
            return f'{_n(packs)} + {_n(rem)}', f'{jumla} + {reja}'.strip(' +')
        return _n(qty / uw if uw else qty), (jumla or reja)

    if packs >= 1 and rem == 0:
        return _n(qty / uw), (jumla or reja)
    if packs >= 1 and rem > 0:
        return f'{_n(packs)} + {_n(rem)}', f'{jumla} + {reja}'.strip(' +')
    return _n(qty), reja
