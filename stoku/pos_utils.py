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
