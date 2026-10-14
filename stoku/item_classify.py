"""
Bulk classify existing items: Kundi (group), Aina (category), Chapa (brand) only.
Never creates items and never changes stock quantities or prices.
"""
from io import BytesIO

from django.db import transaction
from django.db.models import F, Q

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Protection
from openpyxl.utils import get_column_letter
from openpyxl.comments import Comment

from management.models import bidhaa, bidhaa_stoku, bidhaa_aina, mahitaji, makampuni

from .item_excel import (
    _cell_str,
    _parse_int,
    _resolve_aina,
    _resolve_brand,
)

CLASSIFY_FIELDS = [
    'bidhaa_id',
    'jina_la_bidhaa',
    'namba',
    'kundi',
    'aina',
    'chapa',
]

CLASSIFY_HEADERS_SWA = {
    'bidhaa_id': 'ID ya Bidhaa*',
    'jina_la_bidhaa': 'Jina la Bidhaa',
    'namba': 'Namba',
    'kundi': 'Kundi',
    'aina': 'Aina',
    'chapa': 'Chapa',
}

CLASSIFY_HEADERS_ENG = {
    'bidhaa_id': 'Item ID*',
    'jina_la_bidhaa': 'Item Name',
    'namba': 'Item Number',
    'kundi': 'Parent Group',
    'aina': 'Category',
    'chapa': 'Brand',
}

INSTRUCTIONS_SWA = [
    'Faili hili linapanga bidhaa ZILIZOPO tu. HAIUNGI bidhaa mpya na HAIBADILISHI stoku, bei, wala idadi.',
    'Usibadilishe safu ya ID ya Bidhaa*. Usiongeze au kufuta mistari ya bidhaa.',
    'Hariri Kundi, Aina na Chapa tu. Safu tupu = acha kama ilivyo (usifute iliyopo).',
    'Tumia majina yaliyopo kwenye sheet za Kundi / Aina / Chapa inapowezekana ili kuepuka majina maradufu.',
    'Aina mpya inahitaji Kundi. Chapa mpya itaundwa kiotomatiki ikiwa jina halipo.',
    'Pakia faili hili kwenye kitufe cha "Panga kategoria" — SI "Pakia Excel" ya bidhaa mpya.',
]

INSTRUCTIONS_ENG = [
    'This file only classifies EXISTING items. It does NOT add items and does NOT change stock, prices, or quantities.',
    'Do not change the Item ID* column. Do not add or delete item rows.',
    'Edit Parent Group, Category and Brand only. Blank cells leave the current value unchanged.',
    'Reuse names from the Group / Category / Brand sheets when possible to avoid duplicate names.',
    'A new category needs a parent group. A new brand is created automatically if the name is new.',
    'Upload this file with "Classify items" — NOT the "Upload Excel" button for new items.',
]


def _headers(lang_swa=True):
    return CLASSIFY_HEADERS_SWA if lang_swa else CLASSIFY_HEADERS_ENG


def fetch_classify_rows(intp):
    """One row per bidhaa currently listed for this shop."""
    itm_qs = bidhaa_stoku.objects.filter(
        Q(idadi__gt=0) | Q(inapacha=False) | Q(produced__notsure=True),
        Interprise_id=intp.id,
    ).annotate(
        group_name=F('bidhaa__bidhaa_aina__mahi__mahitaji'),
        namba=F('bidhaa__namba'),
        brand=F('bidhaa__kampuni__kampuni_jina'),
        ainaN=F('bidhaa__bidhaa_aina__aina'),
        bidhaaN=F('bidhaa__bidhaa_jina'),
    ).values(
        'bidhaa_id', 'bidhaaN', 'namba', 'group_name', 'ainaN', 'brand',
    ).order_by('bidhaaN', 'bidhaa_id')

    rows = []
    seen = set()
    for rec in itm_qs:
        bid = rec.get('bidhaa_id')
        if not bid or bid in seen:
            continue
        name = _cell_str(rec.get('bidhaaN'))
        if not name:
            continue
        seen.add(bid)
        rows.append({
            'bidhaa_id': bid,
            'jina_la_bidhaa': name,
            'namba': rec.get('namba') or '',
            'kundi': rec.get('group_name') or '',
            'aina': rec.get('ainaN') or '',
            'chapa': rec.get('brand') or '',
        })
    return rows


def _existing_taxonomy(intp):
    owner_id = intp.owner_id
    groups = list(
        mahitaji.objects.filter(Interprise__owner=owner_id)
        .values_list('mahitaji', flat=True)
        .distinct()
        .order_by('mahitaji')
    )
    categories = list(
        bidhaa_aina.objects.filter(Interprise__owner=owner_id)
        .annotate(kundi=F('mahi__mahitaji'))
        .values_list('kundi', 'aina')
        .distinct()
        .order_by('kundi', 'aina')
    )
    brands = list(
        makampuni.objects.filter(Interprise__owner=owner_id)
        .values_list('kampuni_jina', flat=True)
        .distinct()
        .order_by('kampuni_jina')
    )
    return groups, categories, brands


def build_classify_xlsx_bytes(data_rows, lang_swa=True, intp=None):
    if Workbook is None:
        raise RuntimeError('openpyxl is not installed')

    headers = _headers(lang_swa)
    wb = Workbook()
    ws = wb.active
    ws.title = 'Bidhaa' if lang_swa else 'Items'

    lock_fill = PatternFill('solid', fgColor='F0F0F0')
    edit_fill = PatternFill('solid', fgColor='E8F5E9')
    bold = Font(bold=True)
    id_comment = Comment(
        'Usibadilishe ID hii' if lang_swa else 'Do not change this ID',
        'TheBiashara',
    )

    ws.append([headers[f] for f in CLASSIFY_FIELDS])
    ws.append(list(CLASSIFY_FIELDS))
    for cell in ws[1]:
        cell.font = bold

    for row in data_rows or []:
        ws.append([row.get(f, '') for f in CLASSIFY_FIELDS])

    last_data = max(3, 2 + len(data_rows or []))
    for col_idx, field in enumerate(CLASSIFY_FIELDS, start=1):
        letter = get_column_letter(col_idx)
        width = 18
        if field == 'jina_la_bidhaa':
            width = 42
        elif field == 'bidhaa_id':
            width = 14
        ws.column_dimensions[letter].width = width
        fill = lock_fill if field in ('bidhaa_id', 'jina_la_bidhaa', 'namba') else edit_fill
        for r in range(3, last_data + 1):
            cell = ws.cell(row=r, column=col_idx)
            cell.fill = fill
            if field == 'bidhaa_id':
                cell.protection = Protection(locked=True)
                if r == 3:
                    cell.comment = id_comment

    ws.freeze_panes = 'A3'
    ws.auto_filter.ref = f'A1:F{last_data}'

    inst = wb.create_sheet('Maelezo' if lang_swa else 'Instructions')
    inst.append(['Maelezo' if lang_swa else 'Instructions'])
    inst['A1'].font = bold
    for line in (INSTRUCTIONS_SWA if lang_swa else INSTRUCTIONS_ENG):
        inst.append([line])
    inst.column_dimensions['A'].width = 110

    groups, categories, brands = _existing_taxonomy(intp) if intp is not None else ([], [], [])

    ws_g = wb.create_sheet('Kundi' if lang_swa else 'Groups')
    ws_g.append(['Kundi' if lang_swa else 'Parent Group'])
    ws_g['A1'].font = bold
    for name in groups:
        if _cell_str(name):
            ws_g.append([name])
    ws_g.column_dimensions['A'].width = 40

    ws_c = wb.create_sheet('Aina' if lang_swa else 'Categories')
    ws_c.append([
        'Kundi' if lang_swa else 'Parent Group',
        'Aina' if lang_swa else 'Category',
    ])
    ws_c['A1'].font = bold
    ws_c['B1'].font = bold
    for kundi, aina in categories:
        if _cell_str(aina):
            ws_c.append([kundi or '', aina])
    ws_c.column_dimensions['A'].width = 36
    ws_c.column_dimensions['B'].width = 36

    ws_b = wb.create_sheet('Chapa' if lang_swa else 'Brands')
    ws_b.append(['Chapa' if lang_swa else 'Brand'])
    ws_b['A1'].font = bold
    for name in brands:
        if _cell_str(name):
            ws_b.append([name])
    ws_b.column_dimensions['A'].width = 36

    buf = BytesIO()
    wb.save(buf)
    return buf.getvalue()


def build_ai_classify_prompt(lang_swa=True, business_description=''):
    headers = _headers(lang_swa)
    labels = [headers[f] for f in CLASSIFY_FIELDS]
    business_description = (business_description or '').strip()

    if lang_swa:
        parts = [
            'Wewe ni msaidizi wa kupanga bidhaa zilizopo kwenye mfumo wa TheBiashara.',
            '',
            'LENGO:',
            'Nitakupa Excel ya bidhaa ZILIZOSHAJILIWA. Jaza au sahihisha Kundi, Aina na Chapa ili zipangwe vizuri.',
            'Usiongeze bidhaa mpya. Usibadilishe ID ya Bidhaa wala Jina la Bidhaa. Usiguse stoku, bei, wala idadi (hazipo kwenye faili hili kwa makusudi).',
            '',
        ]
        if business_description:
            parts.extend([
                'MAELEZO YA BIASHARA YANGU:',
                business_description,
                '',
            ])
        else:
            parts.extend([
                'MAELEZO YA BIASHARA:',
                '(Hakuna maelezo. Kadiria aina ya biashara kutoka majina ya bidhaa.)',
                '',
            ])
        parts.extend([
            'MUUNDO WA MATOKEO (LAZIMA):',
            '1. Mstari wa 1: vichwa kwa mpangilio huu:',
            ' | '.join(labels),
            '2. Mstari wa 2: field keys (usibadilishe):',
            ', '.join(CLASSIFY_FIELDS),
            '3. Kuanzia mstari wa 3: kila bidhaa iliyokuwepo, ID ileile.',
            '',
            'SHERIA:',
            '1. Hifadhi bidhaa_id na jina_la_bidhaa kama zilivyo.',
            '2. Ikiwa Kundi/Aina/Chapa ni tupu au zimekosewa, zirekebishe kwa mantiki ya jina la bidhaa na biashara.',
            '3. Weka bidhaa zinazofanana kwenye Kundi na Aina moja.',
            '4. Chapa iwe brand halisi ikiwa inajulikana kutoka jina; vinginevyo acha tupu au tumia chapa iliyopo inayofaa. Usibuni brand za kila bidhaa tofauti bila sababu.',
            '5. Tumia majina yaliyopo kwenye sheet za Kundi / Aina / Chapa kwanza. Tengeneza jina jipya tu ikiwa hakuna linalofaa.',
            '6. Aina inahitaji Kundi. Usitoe Aina bila Kundi.',
            '7. Usifute mistari. Usiongeze bidhaa mpya. Usiongeze safu nyingine.',
            '8. Rudisha Excel/CSV tayari kupakiwa — bila maelezo ya ziada.',
            '',
            'FAILI / ORODHA YA BIDHAA:',
            '(Bandika au attach Excel uliyopakua kutoka TheBiashara — panga kategoria)',
        ])
        return '\n'.join(parts)

    parts = [
        'You are helping classify existing products in TheBiashara inventory.',
        '',
        'GOAL:',
        'I will give you an Excel of ALREADY REGISTERED items. Fill or correct Parent Group, Category and Brand so they are well organised.',
        'Do not add new products. Do not change Item ID or Item Name. Do not touch stock, prices, or quantities (they are intentionally not in this file).',
        '',
    ]
    if business_description:
        parts.extend([
            'MY BUSINESS CONTEXT:',
            business_description,
            '',
        ])
    else:
        parts.extend([
            'BUSINESS CONTEXT:',
            '(None provided. Infer the business type from product names.)',
            '',
        ])
    parts.extend([
        'REQUIRED OUTPUT FORMAT:',
        '1. Row 1: headers in this exact order:',
        ' | '.join(labels),
        '2. Row 2: field keys (do not change):',
        ', '.join(CLASSIFY_FIELDS),
        '3. From row 3: every existing item, same IDs.',
        '',
        'RULES:',
        '1. Keep bidhaa_id and jina_la_bidhaa unchanged.',
        '2. If Group/Category/Brand is blank or wrong, fix it from the item name and business context.',
        '3. Put similar items under the same Parent Group and Category.',
        '4. Brand should be a real brand when it is visible in the name; otherwise leave blank or reuse an existing brand. Do not invent a unique brand per item without reason.',
        '5. Prefer names already listed on the Group / Category / Brand sheets. Create a new name only when none fit.',
        '6. A category requires a parent group. Never output a category without a group.',
        '7. Do not delete rows. Do not add products. Do not add extra columns.',
        '8. Return Excel/CSV ready to upload — no extra commentary.',
        '',
        'FILE / PRODUCT LIST:',
        '(Paste or attach the Excel downloaded from TheBiashara — classify items)',
    ])
    return '\n'.join(parts)


def _header_aliases():
    alias = {}
    for field in CLASSIFY_FIELDS:
        alias[field.lower()] = field
        alias[field.replace('_', ' ').lower()] = field
        for headers in (CLASSIFY_HEADERS_SWA, CLASSIFY_HEADERS_ENG):
            label = headers.get(field, '')
            if label:
                alias[label.lower().replace('*', '').strip()] = field
    alias['id'] = 'bidhaa_id'
    alias['item id'] = 'bidhaa_id'
    alias['id ya bidhaa'] = 'bidhaa_id'
    alias['parent group'] = 'kundi'
    alias['category'] = 'aina'
    alias['brand'] = 'chapa'
    alias['item name'] = 'jina_la_bidhaa'
    return alias


def workbook_is_classify(file_obj):
    """True when the workbook is the classification template (has bidhaa_id keys)."""
    if hasattr(file_obj, 'seek'):
        file_obj.seek(0)
    wb = load_workbook(file_obj, read_only=True, data_only=True)
    try:
        ws = wb.active
        rows = []
        for i, row in enumerate(ws.iter_rows(values_only=True)):
            rows.append(row)
            if i >= 1:
                break
    finally:
        wb.close()
    if hasattr(file_obj, 'seek'):
        file_obj.seek(0)
    if not rows:
        return False
    cells0 = [_cell_str(c).lower().replace('*', '').strip() for c in (rows[0] or [])]
    cells1 = [_cell_str(c).lower().replace('*', '').strip() for c in (rows[1] or [])] if len(rows) > 1 else []
    classify_tokens = {
        'bidhaa_id', 'id ya bidhaa', 'item id', 'item id*', 'id ya bidhaa*',
    }
    return any(c in classify_tokens for c in cells0 + cells1)


def parse_classify_xlsx(file_obj):
    if load_workbook is None:
        raise RuntimeError('openpyxl is not installed')
    if hasattr(file_obj, 'seek'):
        file_obj.seek(0)
    wb = load_workbook(file_obj, read_only=True, data_only=True)
    ws = wb.active
    all_rows = list(ws.iter_rows(values_only=True))
    wb.close()
    if not all_rows:
        return []

    alias = _header_aliases()
    header_row = all_rows[0]
    data_start = 2
    if len(all_rows) >= 2:
        keys = [_cell_str(c).lower() for c in (all_rows[1] or [])]
        if 'bidhaa_id' in keys:
            data_start = 3

    rows = []
    for idx in range(data_start, len(all_rows) + 1):
        row = all_rows[idx - 1]
        if not row or all(v is None or str(v).strip() == '' for v in row):
            continue
        mapped = {}
        for col_idx, val in enumerate(row):
            if col_idx >= len(header_row):
                break
            header = _cell_str(header_row[col_idx]).lower().replace('*', '').strip()
            field = alias.get(header)
            if not field and data_start == 3 and col_idx < len(CLASSIFY_FIELDS):
                field = CLASSIFY_FIELDS[col_idx]
            if field and val is not None and str(val).strip() != '':
                mapped[field] = val
        bid = _parse_int(mapped.get('bidhaa_id'), 0)
        if bid <= 0:
            continue
        mapped['bidhaa_id'] = bid
        mapped['_row_num'] = idx
        rows.append(mapped)
    return rows


def apply_classify_rows(duka, intp, rows):
    """Update bidhaa.kundi/aina/chapa only. Returns summary dict."""
    created = 0
    failed = 0
    skipped = 0
    results = []

    allowed_ids = set(
        bidhaa_stoku.objects.filter(Interprise=duka).values_list('bidhaa_id', flat=True)
    )
    seen = set()

    for raw in rows:
        row_num = raw.get('_row_num') or 0
        bid = _parse_int(raw.get('bidhaa_id'), 0)
        if bid <= 0:
            failed += 1
            results.append({
                'row': row_num,
                'success': False,
                'message_swa': 'ID ya bidhaa haipo',
                'message_eng': 'Missing item ID',
            })
            continue
        if bid in seen:
            skipped += 1
            results.append({
                'row': row_num,
                'success': True,
                'skipped': True,
                'message_swa': 'ID imerudiwa — imeachwa',
                'message_eng': 'Duplicate ID skipped',
            })
            continue
        seen.add(bid)
        if bid not in allowed_ids:
            failed += 1
            results.append({
                'row': row_num,
                'success': False,
                'message_swa': 'Bidhaa haipo kwenye duka hili',
                'message_eng': 'Item is not in this shop',
            })
            continue

        kundi = _cell_str(raw.get('kundi'))
        aina = _cell_str(raw.get('aina'))
        chapa = _cell_str(raw.get('chapa'))
        if not kundi and not aina and not chapa:
            skipped += 1
            results.append({
                'row': row_num,
                'success': True,
                'skipped': True,
                'message_swa': 'Hakuna mabadiliko',
                'message_eng': 'No changes',
            })
            continue

        try:
            with transaction.atomic():
                produ = bidhaa.objects.select_for_update().filter(pk=bid).first()
                if not produ:
                    raise ValueError('missing')
                changed = False
                if aina:
                    selected_aina, mahi = _resolve_aina(duka, aina, kundi)
                    if not selected_aina:
                        raise ValueError('aina')
                    if produ.bidhaa_aina_id != selected_aina.id or produ.Mahi_id != (mahi.id if mahi else None):
                        produ.bidhaa_aina = selected_aina
                        produ.Mahi = mahi
                        changed = True
                if chapa:
                    brand = _resolve_brand(duka, chapa)
                    if brand and produ.kampuni_id != brand.id:
                        produ.kampuni = brand
                        changed = True
                if changed:
                    produ.save(update_fields=['bidhaa_aina', 'Mahi', 'kampuni'])
                    created += 1
                    results.append({
                        'row': row_num,
                        'success': True,
                        'message_swa': 'Imesasishwa',
                        'message_eng': 'Updated',
                    })
                else:
                    skipped += 1
                    results.append({
                        'row': row_num,
                        'success': True,
                        'skipped': True,
                        'message_swa': 'Tayari ipo hivyo',
                        'message_eng': 'Already classified',
                    })
        except ValueError as exc:
            failed += 1
            if str(exc) == 'aina':
                msg_swa = 'Aina inahitaji Kundi halali'
                msg_eng = 'Category needs a valid parent group'
            else:
                msg_swa = 'Bidhaa haikupatikana'
                msg_eng = 'Item not found'
            results.append({
                'row': row_num,
                'success': False,
                'message_swa': msg_swa,
                'message_eng': msg_eng,
            })
        except Exception:
            failed += 1
            results.append({
                'row': row_num,
                'success': False,
                'message_swa': 'Imeshindikana kusasisha',
                'message_eng': 'Could not update this item',
            })

    return {
        'updated': created,
        'failed': failed,
        'skipped': skipped,
        'results': results,
    }
