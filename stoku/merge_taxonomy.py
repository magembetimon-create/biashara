"""Merge extra categories/groups into one kept record, then delete the extras."""
from django.db import transaction

from management.models import (
    InterpriseVisotrs,
    bidhaa,
    bidhaaA_edit,
    bidhaa_aina,
    bidhaa_edit,
    mahitaji,
    marketBanner,
    now_categ,
    now_group,
    salePuMatch,
    stock_side,
)


def _id_list(raw):
    if raw is None or raw == '':
        return []
    if isinstance(raw, (list, tuple)):
        parts = raw
    else:
        parts = str(raw).replace('[', '').replace(']', '').split(',')
    ids = []
    for part in parts:
        part = str(part).strip()
        if part.isdigit():
            n = int(part)
            if n > 0:
                ids.append(n)
    return ids


def merge_categories(target, source_ids):
    """Move items from source categories onto target, then delete sources."""
    if not target or not source_ids:
        return 0
    sources = list(
        bidhaa_aina.objects.filter(
            pk__in=source_ids,
            Interprise_id=target.Interprise_id,
        ).exclude(pk=target.pk)
    )
    if not sources:
        return 0
    src_ids = [s.pk for s in sources]
    with transaction.atomic():
        bidhaa.objects.filter(bidhaa_aina_id__in=src_ids).update(
            bidhaa_aina=target,
            Mahi=target.mahi,
        )
        salePuMatch.objects.filter(aina_match_id__in=src_ids).update(aina_match=target)
        now_categ.objects.filter(new_Categ_id__in=src_ids).update(new_Categ=target)
        bidhaa_edit.objects.filter(former_Categ_id__in=src_ids).update(former_Categ=target)
        bidhaaA_edit.objects.filter(aina_id__in=src_ids).update(aina=target)
        InterpriseVisotrs.objects.filter(CategoryPage_id__in=src_ids).update(CategoryPage=target)
        marketBanner.objects.filter(aina_id__in=src_ids).update(aina=target)
        for src in sources:
            for side in list(src.stock_sides.all()):
                side.aina.add(target)
                side.aina.remove(src)
        bidhaa_aina.objects.filter(pk__in=src_ids).delete()
    return len(src_ids)


def merge_groups(target, source_ids):
    """Move categories and items from source groups onto target, then delete sources."""
    if not target or not source_ids:
        return 0
    sources = list(
        mahitaji.objects.filter(
            pk__in=source_ids,
            Interprise_id=target.Interprise_id,
        ).exclude(pk=target.pk)
    )
    if not sources:
        return 0
    src_ids = [s.pk for s in sources]
    with transaction.atomic():
        bidhaa_aina.objects.filter(mahi_id__in=src_ids).update(mahi=target)
        bidhaa.objects.filter(Mahi_id__in=src_ids).update(Mahi=target)
        now_group.objects.filter(new_group_id__in=src_ids).update(new_group=target)
        bidhaaA_edit.objects.filter(former_group_id__in=src_ids).update(former_group=target)
        InterpriseVisotrs.objects.filter(GroupPage_id__in=src_ids).update(GroupPage=target)
        marketBanner.objects.filter(group_id__in=src_ids).update(group=target)
        mahitaji.objects.filter(pk__in=src_ids).delete()
    return len(src_ids)
