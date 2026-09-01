"""POS item flattening and barcode lookup helpers."""
from django.db.models import F, Q

from management.models import (
    bidhaa_stoku,
    picha_bidhaa,
    produ_colored,
    produ_size,
)


def _image_for_color(owner_user_id, color_id, bidhaa_id):
    if color_id:
        pic = picha_bidhaa.objects.filter(
            color_produ_id=color_id,
            picha__owner_id=owner_user_id,
        ).select_related('picha').first()
        if pic and pic.picha and pic.picha.picha:
            return pic.picha.picha.url
    pic = picha_bidhaa.objects.filter(
        bidhaa_id=bidhaa_id,
        picha__owner_id=owner_user_id,
    ).select_related('picha').first()
    if pic and pic.picha and pic.picha.picha:
        return pic.picha.picha.url
    return ''


def flatten_stoku_to_pos_rows(stoku, intp, image_map=None):
    """Build POS-style dict rows for one bidhaa_stoku (with variants)."""
    image_map = image_map or {}
    owner_user_id = intp.owner.user_id
    bidhaa_id = stoku.bidhaa_id
    rows = []

    colors = produ_colored.objects.filter(
        bidhaa_id=stoku.id,
        Interprise=intp,
        color__colored=True,
    ).exclude(idadi=0).select_related('color').order_by('id')

    for ci in colors:
        color_id = ci.color_id
        picha = image_map.get(color_id) or _image_for_color(owner_user_id, color_id, bidhaa_id)
        sizes = produ_size.objects.filter(
            bidhaa_id=stoku.id,
            sized__color_id=color_id,
        ).exclude(idadi=0).select_related('sized').order_by('id')

        base = {
            'id': stoku.id,
            'name': stoku.bidhaa.bidhaa_jina,
            'aina': stoku.bidhaa.bidhaa_aina_id,
            'color_name': ci.color.color_name,
            'color_nick': ci.color.nick_name or '',
            'colorAttr': stoku.bidhaa.colorAttr or '',
            'color_id': ci.id,
            'maelezo': stoku.bidhaa.maelezo or '',
            'bei': float(stoku.Bei_kuuza or 0),
            'bei_jum': float(stoku.Bei_kuuza_jum or 0),
            'thamani': float(stoku.Bei_kununua or 0),
            'bidhaa': bidhaa_id,
            'picha': picha,
            'namba': stoku.bidhaa.namba or '',
            'brand': stoku.bidhaa.kampuni.kampuni_jina if stoku.bidhaa.kampuni_id else '',
            'vipimo': stoku.bidhaa.vipimo or '',
            'uwiano': float(stoku.bidhaa.idadi_jum or 1),
            'vipimo_jum': stoku.bidhaa.vipimo_jum or '',
            'notsure': 1 if getattr(stoku, 'produced', None) and getattr(stoku.produced, 'notsure', False) else 0,
            'vat_included': bool(stoku.bidhaa.saletaxInluded),
            'timely': int(stoku.timely or 0),
            'sirio': stoku.sirio or '',
        }

        if sizes.exists():
            for szd in sizes:
                row = dict(base)
                row['size_name'] = szd.sized.size if szd.sized else ''
                row['size_id'] = szd.id
                row['idadi'] = float(szd.idadi or 0)
                rows.append(row)
        else:
            row = dict(base)
            row['size_name'] = None
            row['size_id'] = 0
            row['idadi'] = float(ci.idadi or 0)
            rows.append(row)

    if not rows:
        picha = image_map.get(bidhaa_id) or _image_for_color(owner_user_id, None, bidhaa_id)
        rows.append({
            'id': stoku.id,
            'name': stoku.bidhaa.bidhaa_jina,
            'aina': stoku.bidhaa.bidhaa_aina_id,
            'color_name': None,
            'color_nick': None,
            'colorAttr': stoku.bidhaa.colorAttr or '',
            'color_id': 0,
            'size_name': None,
            'size_id': 0,
            'idadi': float(stoku.idadi or 0),
            'maelezo': stoku.bidhaa.maelezo or '',
            'bei': float(stoku.Bei_kuuza or 0),
            'bei_jum': float(stoku.Bei_kuuza_jum or 0),
            'thamani': float(stoku.Bei_kununua or 0),
            'bidhaa': bidhaa_id,
            'picha': picha,
            'namba': stoku.bidhaa.namba or '',
            'brand': stoku.bidhaa.kampuni.kampuni_jina if stoku.bidhaa.kampuni_id else '',
            'vipimo': stoku.bidhaa.vipimo or '',
            'uwiano': float(stoku.bidhaa.idadi_jum or 1),
            'vipimo_jum': stoku.bidhaa.vipimo_jum or '',
            'notsure': 0,
            'vat_included': bool(stoku.bidhaa.saletaxInluded),
            'timely': int(stoku.timely or 0),
            'sirio': stoku.sirio or '',
        })

    return rows


def _pos_row_from_stock_values(rec):
    return {
        'id': rec['id'],
        'name': rec.get('bidhaaN') or '',
        'aina': rec.get('aina'),
        'color_name': None,
        'color_nick': None,
        'colorAttr': rec.get('colorAttr') or '',
        'color_id': 0,
        'size_name': None,
        'size_id': 0,
        'idadi': float(rec.get('idadi') or 0),
        'maelezo': rec.get('maelezo') or '',
        'bei': float(rec.get('Bei_kuuza') or 0),
        'bei_jum': float(rec.get('Bei_kuuza_jum') or 0),
        'thamani': float(rec.get('Bei_kununua') or 0),
        'bidhaa': rec.get('bidhaa_id'),
        'picha': '',
        'namba': rec.get('namba') or '',
        'brand': rec.get('brand') or '',
        'vipimo': rec.get('vipimo') or '',
        'uwiano': float(rec.get('uwiano') or 1) or 1,
        'vipimo_jum': rec.get('vipimoJum') or '',
        'notsure': 1 if rec.get('notsure') else 0,
        'vat_included': bool(rec.get('taxInclusive')),
        'vat_allow': bool(rec.get('vat_allow')),
        'timely': int(rec.get('timely') or 0),
        'sirio': rec.get('sirio') or '',
        'is_grouped_item': 1 if rec.get('is_grouped_item') else 0,
        'grouped_item_ref_id': rec.get('grouped_item_ref_id'),
        'partial_item_reduction_qty': float(rec.get('partial_item_reduction_qty') or 0),
    }


def fetch_pos_catalog(intp, is_service=False, offset=0, limit=20):
    """Slim POS list in pages so slow networks can show the first cards quickly."""
    qs = bidhaa_stoku.objects.filter(
        Q(idadi__gt=0) | Q(inapacha=False) | Q(produced__notsure=True),
        Interprise_id=intp.id,
        service=bool(is_service),
    ).annotate(
        aina=F('bidhaa__bidhaa_aina_id'),
        ainaN=F('bidhaa__bidhaa_aina__aina'),
        namba=F('bidhaa__namba'),
        material=F('bidhaa__material'),
        brand=F('bidhaa__kampuni__kampuni_jina'),
        bidhaaN=F('bidhaa__bidhaa_jina'),
        maelezo=F('bidhaa__maelezo'),
        taxInclusive=F('bidhaa__saletaxInluded'),
        vipimo=F('bidhaa__vipimo'),
        uwiano=F('bidhaa__idadi_jum'),
        vipimoJum=F('bidhaa__vipimo_jum'),
        colorAttr=F('bidhaa__colorAttr'),
        vat_allow=F('Interprise__vat_allow'),
        notsure=F('produced__notsure'),
    ).values(
        'id', 'idadi', 'Bei_kuuza', 'Bei_kuuza_jum', 'Bei_kununua', 'sirio', 'timely',
        'bidhaa_id', 'aina', 'ainaN', 'namba', 'material', 'brand', 'bidhaaN', 'maelezo',
        'taxInclusive', 'vipimo', 'uwiano', 'vipimoJum', 'colorAttr', 'vat_allow',
        'notsure', 'is_grouped_item', 'grouped_item_ref_id', 'partial_item_reduction_qty',
    ).order_by('-pk')

    recs_qs = qs.filter(Q(material=False) | Q(Bei_kuuza__gt=0))
    total_recs = recs_qs.count()

    categories = []
    seen_aina = set()
    if offset == 0:
        for r in recs_qs.values('aina', 'ainaN').distinct():
            aid = r.get('aina') if r.get('aina') not in (None, '') else -1
            if aid in seen_aina:
                continue
            seen_aina.add(aid)
            categories.append({
                'id': aid,
                'aina': r.get('ainaN') or '',
            })

    page_recs = list(recs_qs[offset:offset + limit])

    has_colors = produ_colored.objects.filter(
        Interprise_id=intp.id,
        color__colored=True,
    ).exclude(bidhaa__inapacha=True, idadi=0).exists()

    items = []
    if not has_colors:
        items = [_pos_row_from_stock_values(r) for r in page_recs]
    else:
        stoku_ids = [r['id'] for r in page_recs]
        colors_by_stoku = {}
        if stoku_ids:
            for ci in produ_colored.objects.filter(
                bidhaa_id__in=stoku_ids,
                Interprise_id=intp.id,
                color__colored=True,
            ).exclude(idadi=0).select_related('color').order_by('id'):
                colors_by_stoku.setdefault(ci.bidhaa_id, []).append(ci)

            sizes_by_stoku_color = {}
            for szd in produ_size.objects.filter(
                bidhaa_id__in=stoku_ids,
                Interprise_id=intp.id,
            ).exclude(idadi=0).select_related('sized').order_by('id'):
                if not szd.sized_id:
                    continue
                sizes_by_stoku_color.setdefault((szd.bidhaa_id, szd.sized.color_id), []).append(szd)
        else:
            sizes_by_stoku_color = {}

        for rec in page_recs:
            base = _pos_row_from_stock_values(rec)
            colors = colors_by_stoku.get(rec['id']) or []
            if not colors:
                items.append(base)
                continue
            for ci in colors:
                size_rows = sizes_by_stoku_color.get((rec['id'], ci.color_id)) or []
                row = dict(base)
                row['color_name'] = ci.color.color_name if ci.color else ''
                row['color_nick'] = (ci.color.nick_name or '') if ci.color else ''
                row['color_id'] = ci.id
                if size_rows:
                    for szd in size_rows:
                        sized = dict(row)
                        sized['size_name'] = szd.sized.size if szd.sized else ''
                        sized['size_id'] = szd.id
                        sized['idadi'] = float(szd.idadi or 0)
                        items.append(sized)
                else:
                    row['idadi'] = float(ci.idadi or 0)
                    items.append(row)

    vat_allow = False
    if page_recs:
        vat_allow = bool(page_recs[0].get('vat_allow'))
    elif offset == 0 and total_recs:
        first = recs_qs.values('vat_allow').first()
        vat_allow = bool(first.get('vat_allow')) if first else False

    processed = offset + len(page_recs)
    return {
        'items': items,
        'categories': categories,
        'vat_allow': vat_allow,
        'has_variants': has_colors,
        'count': len(items),
        'total': total_recs,
        'offset': offset,
        'limit': limit,
        'processed': processed,
        'done': processed >= total_recs,
    }


def lookup_pos_items_by_barcode(intp, code):
    """Find POS rows matching barcode (sirio) for an enterprise."""
    code = (code or '').strip()
    if not code:
        return []

    qs = bidhaa_stoku.objects.filter(
        Q(idadi__gt=0) | Q(inapacha=False),
        Interprise=intp,
        sirio__iexact=code,
    ).select_related(
        'bidhaa', 'bidhaa__kampuni', 'bidhaa__bidhaa_aina',
    ).order_by('-pk')

    rows = []
    for stoku in qs:
        rows.extend(flatten_stoku_to_pos_rows(stoku, intp))
    return rows
