from management.models import stock_column, stock_item_place, stock_row, stock_side


def serialize_sides(duka_id):
    sides = stock_side.objects.filter(Interprise_id=duka_id).order_by('sort', 'id')
    out = []
    for s in sides:
        out.append({
            'id': s.id,
            'name': s.name,
            'sort': s.sort,
            'aina_ids': list(s.aina.values_list('id', flat=True)),
            'rows': list(s.rows.order_by('sort', 'id').values('id', 'name', 'sort')),
            'columns': list(s.columns.order_by('sort', 'id').values('id', 'name', 'sort')),
        })
    return out


def place_dict(place):
    if not place:
        return None
    return {
        'side_id': place.side_id,
        'row_id': place.row_id,
        'col_id': place.column_id or 0,
        'side': place.side.name if place.side_id else '',
        'row': place.row.name if place.row_id else '',
        'col': place.column.name if place.column_id else '',
    }


def places_by_bidhaa(intp_id, bidhaa_ids):
    if not bidhaa_ids:
        return {}
    qs = stock_item_place.objects.filter(
        Interprise_id=intp_id,
        bidhaa_id__in=list(set(bidhaa_ids)),
    ).select_related('side', 'row', 'column')
    return {p.bidhaa_id: place_dict(p) for p in qs}


def attach_places(intp_id, items):
    ids = [i.get('bidhaa') for i in items if i.get('bidhaa')]
    mp = places_by_bidhaa(intp_id, ids)
    for i in items:
        pl = mp.get(i.get('bidhaa')) or {}
        i['place_side'] = pl.get('side') or ''
        i['place_row'] = pl.get('row') or ''
        i['place_col'] = pl.get('col') or ''
    return items


def upsert_item_place(duka, item, side_id, row_id, col_id):
    try:
        side_id = int(side_id or 0)
        row_id = int(row_id or 0)
        col_id = int(col_id or 0)
    except (TypeError, ValueError):
        return False
    if not side_id:
        stock_item_place.objects.filter(Interprise=duka, bidhaa=item).delete()
        return True
    side = stock_side.objects.filter(pk=side_id, Interprise=duka).first()
    row = stock_row.objects.filter(pk=row_id, side=side).first() if side else None
    if not side or not row:
        return False
    col = None
    if col_id:
        col = stock_column.objects.filter(pk=col_id, side=side).first()
    stock_item_place.objects.update_or_create(
        Interprise=duka,
        bidhaa=item,
        defaults={'side': side, 'row': row, 'column': col},
    )
    return True
