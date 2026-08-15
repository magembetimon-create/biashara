from datetime import date

from django.db.models import F, FloatField, Sum
from django.utils import timezone

from management.models import (
    Interprise,
    Notifications,
    bei_za_bidhaa,
    bidhaa_stoku,
    customer_area,
    customer_in_cell,
    mauzoList,
    mauzoni,
)


def shop_has_compound_positions(shop):
    shop_id = shop.pk if hasattr(shop, 'pk') else shop
    return customer_in_cell.objects.filter(area__Interprise_id=shop_id).exists()


def get_guest_cell(request, shop_id):
    cell_id = request.session.get(f'compound_cell_{shop_id}')
    if not cell_id:
        return None
    return customer_in_cell.objects.filter(
        pk=cell_id,
        area__Interprise_id=shop_id,
    ).select_related('area').first()


def set_guest_cell(request, shop_id, cell_id):
    cell = customer_in_cell.objects.filter(
        pk=cell_id,
        area__Interprise_id=shop_id,
    ).select_related('area').first()
    if not cell:
        return None
    request.session[f'compound_cell_{shop_id}'] = cell.id
    request.session.modified = True
    return cell


def clear_guest_cart_session(request, shop_id):
    request.session.pop(f'compound_cart_{shop_id}', None)
    request.session.modified = True


def _next_invo_code(shop_id):
    invono = 1
    if mauzoni.objects.filter(Interprise_id=shop_id).exists():
        invono = mauzoni.objects.filter(Interprise_id=shop_id).last().Invo_no or 1
    if invono < 10:
        invo_str = '0000' + str(invono)
    elif invono < 100:
        invo_str = '000' + str(invono)
    elif invono < 1000:
        invo_str = '00' + str(invono)
    elif invono < 10000:
        invo_str = '0' + str(invono)
    else:
        invo_str = str(invono)
    return invo_str, invono


def _item_unit_price(itm, uwiano):
    prices = [{'idadi': 1, 'bei': itm.Bei_kuuza}]
    if itm.bidhaa.idadi_jum > 1:
        prices.append({'idadi': int(itm.bidhaa.idadi_jum), 'bei': itm.Bei_kuuza_jum})
    for b in bei_za_bidhaa.objects.filter(item=itm.bidhaa_id):
        prices.append({'idadi': int(b.idadi), 'bei': b.bei})
    matched = [x for x in prices if x['idadi'] == uwiano]
    if matched:
        return float(matched[0]['bei'])
    return float(itm.Bei_kuuza)


def _recalc_cart_amount(cart):
    total = mauzoList.objects.filter(mauzo=cart).aggregate(
        sum=Sum(F('saveT') * F('bei_og') * F('idadi'), output_field=FloatField()),
    )['sum'] or 0
    cart.amount = float(total)
    cart.save(update_fields=['amount'])
    return cart.amount


def next_default_customer_name(shop):
    """Same numbering as POStab checkout (Customer-1, Customer-2, ...)."""
    leo = timezone.now()
    today_morning = leo.replace(hour=0, minute=0, second=0, microsecond=0)
    if timezone.is_aware(leo) and timezone.is_naive(today_morning):
        today_morning = timezone.make_aware(today_morning, timezone.get_current_timezone())
    custom_no = mauzoni.objects.filter(Interprise=shop, tarehe__gte=today_morning).count()
    return f'Customer-{custom_no + 1}'


def get_or_create_guest_cart(request, shop):
    key = f'compound_cart_{shop.id}'
    cart_id = request.session.get(key)
    cart = None
    if cart_id:
        cart = mauzoni.objects.filter(
            pk=cart_id,
            Interprise=shop,
            cart=True,
            order=True,
            user_customer__isnull=True,
        ).first()
    if not cart:
        invo_str, invono = _next_invo_code(shop.id)
        cart = mauzoni()
        cart.Interprise = shop
        cart.code = invo_str
        cart.amount = 0
        cart.kulipa = date.today()
        cart.tarehe = timezone.now()
        cart.date = date.today()
        cart.Invo_no = invono + 1
        cart.order = True
        cart.online = True
        cart.cart = True
        cart.save()
        request.session[key] = cart.id
        request.session.modified = True

    cell = get_guest_cell(request, shop.id)
    if cell and cart.customer_in_id != cell.id:
        cart.customer_in = cell
        cart.save(update_fields=['customer_in'])
    return cart


def compound_guest_orders_qs(duka):
    return mauzoni.objects.filter(
        Interprise=duka,
        order=True,
        cart=False,
        receved=False,
        packed=False,
        customer_in__isnull=False,
        user_customer__isnull=True,
        waiter_order__isnull=True,
        online=True,
    ).select_related('customer_in', 'customer_in__area').order_by('-tarehe')


def count_compound_guest_orders(duka):
    return compound_guest_orders_qs(duka).count()


def notify_compound_order(sale):
    notice = Notifications()
    notice.Interprise = sale.Interprise
    notice.date = timezone.now()
    notice.saO = True
    notice.saO_map = sale
    notice.save()


def guest_cell_payload(cell):
    if not cell:
        return None
    return {
        'id': cell.id,
        'name': cell.name,
        'area_id': cell.area_id,
        'area_name': cell.area.name if cell.area_id else '',
    }


def shop_cells_payload(shop_id):
    areas = []
    for area in customer_area.objects.filter(Interprise_id=shop_id).prefetch_related('customer_in_cell_set'):
        areas.append({
            'id': area.id,
            'name': area.name,
            'cells': list(area.customer_in_cell_set.values('id', 'name').order_by('name')),
        })
    return areas
