from decimal import Decimal

from django.db.models import Sum

from accaunts.todos import updateOrder
from management.models import bidhaa_stoku, produ_colored, produ_size


def stock_out_error(item_name, need=None, have=None):
    name = (item_name or '').replace('|', ' ').strip() or 'bidhaa'
    need_s = '' if need is None else str(need)
    have_s = '' if have is None else str(have)
    return ValueError(f'OUT_OF_STOCK|{name}|{need_s}|{have_s}')


def stock_short_messages(exc):
    parts = str(exc).split('|')
    if not parts or parts[0] not in ('OUT_OF_STOCK', 'ITEM_OUT_OF_STOCK'):
        return None
    name = parts[1].strip() if len(parts) > 1 else ''
    if name:
        return {
            'item': name,
            'message_swa': (
                f'Stoku haitoshi kwa {name}. Bidhaa nyingine kwenye orodha hazijahifadhiwa. '
                'Tafadhali hakiki idadi ya bidhaa hii kisha jaribu tena.'
            ),
            'message_eng': (
                f'Not enough stock for {name}. Other items in this list were not saved. '
                'Check this item quantity and try again.'
            ),
            'msg_swa': (
                f'Stoku haitoshi kwa {name}. Bidhaa nyingine kwenye orodha hazijahifadhiwa. '
                'Tafadhali hakiki idadi ya bidhaa hii kisha jaribu tena.'
            ),
            'msg_eng': (
                f'Not enough stock for {name}. Other items in this list were not saved. '
                'Check this item quantity and try again.'
            ),
        }
    return {
        'item': '',
        'message_swa': 'Baadhi ya bidhaa hazina stock ya kutosha. Hakuna kilichohifadhiwa.',
        'message_eng': 'One or more items are out of stock. Nothing was saved.',
        'msg_swa': 'Baadhi ya bidhaa hazina stock ya kutosha. Hakuna kilichohifadhiwa.',
        'msg_eng': 'One or more items are out of stock. Nothing was saved.',
    }


def _enterprise_id(duka):
    return getattr(duka, 'id', duka)


def stock_batches_for_bidhaa(duka, bidhaa_id, lock=False):
    qs = bidhaa_stoku.objects.filter(
        Interprise_id=_enterprise_id(duka),
        bidhaa_id=bidhaa_id,
        is_grouped_item=False,
        service=False,
        idadi__gt=0,
    )
    if lock:
        qs = qs.select_for_update()
    return qs


def available_qty_for_bidhaa(duka, bidhaa_id):
    total = stock_batches_for_bidhaa(duka, bidhaa_id).aggregate(s=Sum('idadi'))['s']
    return Decimal(str(total or 0))


def take_from_stock_batch(batch, take, bidhaa_id, duka, request):
    avail = Decimal(str(batch.idadi or 0))
    take = Decimal(str(take or 0))
    if take <= 0 or avail <= 0:
        return Decimal('0')
    if take > avail:
        take = avail
    batch.idadi = avail - take
    batch.save(update_fields=['idadi'])

    color_need = take
    for col in produ_colored.objects.filter(bidhaa=batch, idadi__gt=0).order_by('id'):
        if color_need <= 0:
            break
        cavail = Decimal(str(col.idadi or 0))
        ctake = cavail if cavail <= color_need else color_need
        col.idadi = cavail - ctake
        col.save(update_fields=['idadi'])
        color_need -= ctake
        size_need = ctake
        for sz in produ_size.objects.filter(bidhaa=batch, idadi__gt=0).order_by('id'):
            if size_need <= 0:
                break
            savail = Decimal(str(sz.idadi or 0))
            stake = savail if savail <= size_need else size_need
            sz.idadi = savail - stake
            sz.save(update_fields=['idadi'])
            size_need -= stake

    if Decimal(str(batch.idadi or 0)) == 0:
        others = stock_batches_for_bidhaa(duka, bidhaa_id).exclude(pk=batch.id)
        if others.exists():
            nxt = others.filter(inapacha=False).first() or others.first()
            if nxt and nxt.inapacha:
                nxt.inapacha = False
                nxt.save(update_fields=['inapacha'])
            if not batch.inapacha:
                batch.inapacha = True
                batch.save(update_fields=['inapacha'])
            updateOrder({'itm': batch, 'request': request, 'out': True, 'other': nxt})
    return take


def consume_bidhaa_qty(duka, bidhaa_id, extra_qty, request, item_name=''):
    """Deduct qty from live bidhaa_stoku rows of the same product on this branch.

    Prefer one batch that already has enough; otherwise split across batches.
    """
    remaining = Decimal(str(extra_qty or 0))
    used = []
    if remaining <= 0:
        return used

    have = available_qty_for_bidhaa(duka, bidhaa_id)
    if remaining > have + Decimal('0.0001'):
        raise stock_out_error(item_name, remaining, have)

    qs = stock_batches_for_bidhaa(duka, bidhaa_id, lock=True)
    enough = list(qs.filter(idadi__gte=remaining).order_by('inapacha', '-idadi', 'id'))
    if enough:
        batch = enough[0]
        taken = take_from_stock_batch(batch, remaining, bidhaa_id, duka, request)
        if taken > 0:
            used.append((batch, taken))
            remaining -= taken
        if remaining > Decimal('0.0001'):
            raise stock_out_error(item_name, extra_qty, have)
        return used

    for batch in qs.order_by('inapacha', 'id'):
        if remaining <= 0:
            break
        avail = Decimal(str(batch.idadi or 0))
        if avail <= 0:
            continue
        taken = take_from_stock_batch(
            batch,
            remaining if remaining <= avail else avail,
            bidhaa_id,
            duka,
            request,
        )
        if taken > 0:
            used.append((batch, taken))
            remaining -= taken

    if remaining > Decimal('0.0001'):
        raise stock_out_error(item_name, extra_qty, have)
    return used
