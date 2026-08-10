from collections import defaultdict

from django.db.models import F

from management.models import Interprise, InterprisePermissions, customer_Interprise, wateja


def assignable_branches_qs(cheo):
    """Branches the user may operate (permissions) under the same owner as current branch."""
    if not cheo or not cheo.Interprise_id:
        return Interprise.objects.none()
    owner_id = cheo.Interprise.owner_id
    branch_ids = (
        InterprisePermissions.objects.filter(
            user_id=cheo.user_id,
            Interprise__owner_id=owner_id,
        )
        .values_list('Interprise_id', flat=True)
        .distinct()
    )
    return Interprise.objects.filter(id__in=branch_ids, Interprise=True).order_by('name')


def _validate_branch_ids(cheo, branch_ids):
    allowed = set(assignable_branches_qs(cheo).values_list('id', flat=True))
    return [bid for bid in branch_ids if bid in allowed]


def sync_customer_branches(mteja_obj, branch_ids, cheo):
    branch_ids = _validate_branch_ids(cheo, branch_ids)
    if not branch_ids and cheo and cheo.Interprise_id:
        branch_ids = [cheo.Interprise_id]
    customer_Interprise.objects.filter(mteja=mteja_obj).exclude(branch_id__in=branch_ids).delete()
    for bid in branch_ids:
        customer_Interprise.objects.get_or_create(mteja=mteja_obj, branch_id=bid)


def customers_for_branch_qs(cheo, branch_id=None, all_branches=False):
    owner_id = cheo.Interprise.owner_id
    base = wateja.objects.filter(Interprise__owner_id=owner_id)
    if all_branches:
        return base
    bid = branch_id or cheo.Interprise_id
    return base.filter(customer_interprise_links__branch_id=bid).distinct()


def enrich_wateja_rows(rows):
    if not rows:
        return rows
    ids = [r['id'] for r in rows]
    links = customer_Interprise.objects.filter(mteja_id__in=ids).select_related('branch')
    by_customer = defaultdict(list)
    for link in links:
        by_customer[link.mteja_id].append({'id': link.branch_id, 'name': link.branch.name})
    for row in rows:
        branches = by_customer.get(row['id'], [])
        if not branches and row.get('duka'):
            branches = [{'id': row['duka'], 'name': row.get('duka_jina') or ''}]
        row['branches'] = branches
        row['branch_ids'] = [b['id'] for b in branches]
        row['branch_names'] = ', '.join(b['name'] for b in branches if b['name']) or (row.get('duka_jina') or '')
    return rows


def customers_for_branch_list(cheo, branch_id=None, all_branches=False):
    qs = customers_for_branch_qs(cheo, branch_id=branch_id, all_branches=all_branches)
    rows = list(qs.annotate(duka=F('Interprise'), duka_jina=F('Interprise__name')).values())
    return enrich_wateja_rows(rows)


def customer_visible_on_branch(mteja_id, branch_id, owner_id):
    return customer_Interprise.objects.filter(
        mteja_id=mteja_id,
        branch_id=branch_id,
        mteja__Interprise__owner_id=owner_id,
    ).exists()
