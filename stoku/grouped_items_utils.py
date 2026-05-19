"""
Utilities for grouped items reconciliation and stock management.
Handles deferred stock reduction for grouped items.
"""
from django.db.models import F, DecimalField, Sum
from django.db import transaction
from django.utils import timezone
from management.models import (
    grouped_item,
    grouped_item_member,
    grouped_item_reconciliation,
    mauzoList,
    bidhaa_stoku,
    mauzoni
)
from decimal import Decimal


def should_reduce_stock_for_mauzolist(mauzo_list_entry):
    """
    Check if stock should be reduced for a mauzoList entry.
    Returns False if it's a grouped item (stock reduction deferred until reconciliation).
    """
    if not mauzo_list_entry or not mauzo_list_entry.produ:
        return False
    
    # Check if the product is marked as grouped item
    try:
        produ = mauzo_list_entry.produ
        if produ.is_grouped_item:
            return False
    except:
        pass
    
    return True


def get_grouped_items_for_duka(duka_id, date=None):
    """
    Get all grouped items for a duka, optionally filtered by date.
    Returns reconciliation status + computed display quantities (sum of member quantities).
    """
    from django.db.models import Q
    
    items = grouped_item.objects.filter(
        Interprise__id=duka_id,
        active=True
    ).select_related('Interprise').prefetch_related('members')
    
    result = []
    for gi in items:
        members = grouped_item_member.objects.filter(
            grouped=gi,
            active=True,
            bidhaa_stoku__isnull=False,
        ).select_related('bidhaa_stoku')
        
        grouped_by_bidhaa = {}
        for link in members:
            stock = link.bidhaa_stoku
            if not stock:
                continue
            
            remaining = Decimal(str(stock.idadi or 0)) - Decimal(str(stock.partial_item_reduction_qty or 0))
            if remaining < 0:
                remaining = Decimal('0')
            
            grouped_by_bidhaa[stock.bidhaa_id] = grouped_by_bidhaa.get(stock.bidhaa_id, Decimal('0')) + remaining
        
        display_qty = sum(grouped_by_bidhaa.values(), Decimal('0'))
        
        if date:
            recon = grouped_item_reconciliation.objects.filter(
                grouped=gi,
                Interprise__id=duka_id,
                date=date
            ).first()
            
            result.append({
                'id': gi.id,
                'name': gi.name,
                'description': gi.description,
                'bei_kununua': float(gi.Bei_kununua),
                'bei_kuuza': float(gi.Bei_kuuza),
                'idadi': float(display_qty),
                'members_count': gi.members.count(),
                'reconciliation_status': recon.status if recon else None,
                'recorded_qty': float(recon.recorded_qty) if recon else 0,
                'actual_qty': float(recon.actual_qty) if recon else None,
            })
        else:
            result.append({
                'id': gi.id,
                'name': gi.name,
                'bei_kuuza': float(gi.Bei_kuuza),
                'idadi': float(display_qty),
                'members_count': gi.members.count(),
            })
    
    return result


def create_reconciliation_from_sales(duka_id, date, by_user):
    """
    Create reconciliation entries for grouped items based on sales for the day.
    Called at end of shift/day to set up reconciliation.
    """
    from management.models import Interprise
    
    try:
        duka = Interprise.objects.get(id=duka_id)
    except:
        return {'success': False, 'msg': 'Duka not found'}
    
    # Find all grouped items with sales on this date
    # Sales are tracked via mauzoList where produ is a grouped item
    grouped_sales = {}
    
    sales_entries = mauzoList.objects.filter(
        mauzo__Interprise=duka,
        mauzo__date=date,
        produ__is_grouped_item=True
    ).select_related('produ__grouped_item_ref').values(
        'produ__grouped_item_ref'
    ).annotate(total_qty=Sum('idadi', output_field=DecimalField()))
    
    for entry in sales_entries:
        if entry['produ__grouped_item_ref']:
            grouped_sales[entry['produ__grouped_item_ref']] = entry['total_qty']
    
    # Create reconciliation entries
    created_count = 0
    for grouped_id, qty in grouped_sales.items():
        try:
            gi = grouped_item.objects.get(id=grouped_id)
            recon, created = grouped_item_reconciliation.objects.get_or_create(
                grouped=gi,
                Interprise=duka,
                date=date,
                defaults={
                    'recorded_qty': qty or Decimal('0'),
                    'by': by_user,
                    'status': 'pending'
                }
            )
            if created:
                created_count += 1
        except Exception as e:
            pass
    
    return {
        'success': True,
        'created': created_count,
        'msg': f'Created {created_count} reconciliation entries'
    }


def approve_grouped_item_reconciliation(reconciliation_id, actual_qty, by_user):
    """
    Approve reconciliation and reduce stock for grouped item.
    """
    try:
        recon = grouped_item_reconciliation.objects.get(id=reconciliation_id)
    except:
        return {'success': False, 'msg': 'Reconciliation not found'}
    
    if recon.status != 'pending':
        return {'success': False, 'msg': 'Only pending reconciliations can be approved'}
    
    try:
        with transaction.atomic():
            # Update reconciliation
            recon.actual_qty = actual_qty
            recon.status = 'approved'
            recon.approved_at = timezone.now()
            recon.by = by_user
            recon.save()
            
            # Reduce stock for grouped item based on actual_qty
            grouped = recon.grouped
            try:
                stock = bidhaa_stoku.objects.get(
                    is_grouped_item=True,
                    grouped_item_ref=grouped
                )
                stock.idadi = F('idadi') - actual_qty
                stock.save(update_fields=['idadi'])
            except:
                pass
            
            return {
                'success': True,
                'msg': f'Reconciliation approved. Stock reduced by {actual_qty}'
            }
    except Exception as e:
        return {'success': False, 'msg': f'Error: {str(e)}'}


def get_grouped_item_members(grouped_id):
    """
    Get all member items in a grouped item.
    """
    try:
        gi = grouped_item.objects.get(id=grouped_id)
        members = gi.members.filter(active=True).select_related('bidhaa_stoku')
        
        return [{
            'id': m.bidhaa_stoku.id,
            'name': m.bidhaa_stoku.bidhaa.bidhaa_jina if m.bidhaa_stoku else '-',
            'stock': float(m.bidhaa_stoku.idadi) if m.bidhaa_stoku else 0,
        } for m in members if m.bidhaa_stoku]
    except:
        return []


def build_grouped_member_bidhaa_map(interprise_id):
    """
    Return grouped -> member bidhaa ids map for frontend-only quantity aggregation.
    Shape: {grouped_id: [bidhaa_id, ...]}
    """
    grouped_map = {}

    links = grouped_item_member.objects.filter(
        grouped__Interprise_id=interprise_id,
        grouped__active=True,
        active=True,
        bidhaa_stoku__isnull=False,
    ).values('grouped_id', 'bidhaa_stoku__bidhaa_id')

    for row in links:
        grouped_id = row.get('grouped_id')
        bidhaa_id = row.get('bidhaa_stoku__bidhaa_id')
        if not grouped_id or not bidhaa_id:
            continue

        key = str(grouped_id)
        if key not in grouped_map:
            grouped_map[key] = []
        if bidhaa_id not in grouped_map[key]:
            grouped_map[key].append(bidhaa_id)

    return grouped_map


def build_grouped_display_qty_maps(interprise_id):
    """
    Build quantity maps used by POS/waiter pages.
    - member_qty_map: effective qty for each member stock row (idadi - partial_item_reduction_qty)
    - grouped_qty_map: effective qty for each grouped representative stock row
      (sum of distinct member bidhaa effective qty)
    """
    member_qty_map = {}
    grouped_qty_by_group_id = {}
    grouped_qty_map = {}

    members = grouped_item_member.objects.filter(
        grouped__Interprise_id=interprise_id,
        active=True,
        bidhaa_stoku__isnull=False,
    ).select_related('bidhaa_stoku')

    grouped_bidhaa_totals = {}
    for link in members:
        stock = link.bidhaa_stoku
        if not stock:
            continue

        remaining = Decimal(str(stock.idadi or 0)) - Decimal(str(stock.partial_item_reduction_qty or 0))
        if remaining < 0:
            remaining = Decimal('0')

        member_qty_map[stock.id] = remaining

        bidhaa_key = (link.grouped_id, stock.bidhaa_id)
        grouped_bidhaa_totals[bidhaa_key] = grouped_bidhaa_totals.get(bidhaa_key, Decimal('0')) + remaining

    for (grouped_id, _bidhaa_id), qty in grouped_bidhaa_totals.items():
        grouped_qty_by_group_id[grouped_id] = grouped_qty_by_group_id.get(grouped_id, Decimal('0')) + qty

    grouped_stocks = bidhaa_stoku.objects.filter(
        Interprise_id=interprise_id,
        is_grouped_item=True,
        grouped_item_ref_id__isnull=False,
    ).values('id', 'grouped_item_ref_id')

    for row in grouped_stocks:
        grouped_qty_map[row['id']] = grouped_qty_by_group_id.get(row['grouped_item_ref_id'], Decimal('0'))

    return member_qty_map, grouped_qty_map


def get_grouped_stock_display_qty(grouped_stock):
    """Get computed sellable qty for one grouped representative stock row."""
    if not grouped_stock or not getattr(grouped_stock, 'grouped_item_ref_id', None):
        return Decimal('0')

    members = grouped_item_member.objects.filter(
        grouped_id=grouped_stock.grouped_item_ref_id,
        active=True,
        bidhaa_stoku__Interprise_id=grouped_stock.Interprise_id,
    ).select_related('bidhaa_stoku')

    print(
        f"[GROUPED DEBUG] grouped_stock_id={getattr(grouped_stock, 'id', None)} "
        f"grouped_item_ref_id={getattr(grouped_stock, 'grouped_item_ref_id', None)} "
        f"members_count={members.count()}"
    )

    member_bidhaa_ids = set()
    for link in members:
        stock = link.bidhaa_stoku
        if stock and stock.bidhaa_id:
            member_bidhaa_ids.add(stock.bidhaa_id)
            bidhaa_name = ''
            try:
                bidhaa_name = stock.bidhaa.bidhaa_jina if stock.bidhaa else ''
            except Exception:
                bidhaa_name = ''

            print(
                f"[GROUPED MEMBER] link_id={link.id} grouped_id={link.grouped_id} "
                f"stock_id={stock.id} bidhaa_id={stock.bidhaa_id} "
                f"bidhaa_name={bidhaa_name} idadi={stock.idadi} "
                f"partial_reduction={stock.partial_item_reduction_qty}"
            )

    if not member_bidhaa_ids:
        print("[GROUPED DEBUG] No member bidhaa_ids found for grouped_item_member")
        return Decimal('0')

    grouped_by_bidhaa = {}
    all_related_rows = bidhaa_stoku.objects.filter(
        Interprise_id=grouped_stock.Interprise_id,
        is_grouped_item=False,
        service=False,
        bidhaa_id__in=member_bidhaa_ids,
    ).select_related('bidhaa').order_by('bidhaa_id', 'id')

    print(
        f"[GROUPED DEBUG] member_bidhaa_ids={sorted(member_bidhaa_ids)} "
        f"matching_stock_rows={all_related_rows.count()}"
    )

    for stock in all_related_rows:
        remaining = Decimal(str(stock.idadi or 0)) - Decimal(str(stock.partial_item_reduction_qty or 0))
        if remaining < 0:
            remaining = Decimal('0')

        bidhaa_name = ''
        try:
            bidhaa_name = stock.bidhaa.bidhaa_jina if stock.bidhaa else ''
        except Exception:
            bidhaa_name = ''

        print(
            f"[GROUPED MATCH] stock_id={stock.id} bidhaa_id={stock.bidhaa_id} "
            f"bidhaa_name={bidhaa_name} idadi={stock.idadi} "
            f"partial_reduction={stock.partial_item_reduction_qty} remaining={remaining}"
        )

        grouped_by_bidhaa[stock.bidhaa_id] = grouped_by_bidhaa.get(stock.bidhaa_id, Decimal('0')) + remaining

    print(f"[GROUPED TOTALS BY BIDHAA] {grouped_by_bidhaa}")

    return sum(grouped_by_bidhaa.values(), Decimal('0'))


def reduce_grouped_members_stock(grouped_stock, qty_to_reduce):
    """
    Allocate grouped sales qty to member items by updating:
    - partial_item_reduction_qty (source of truth for grouped deductions)

    Strategy:
    1) If one member has enough remaining qty, allocate there.
    2) Otherwise split across members by highest remaining qty first.
    """
    if not grouped_stock or not getattr(grouped_stock, 'is_grouped_item', False) or not getattr(grouped_stock, 'grouped_item_ref_id', None):
        return {'success': False, 'msg': 'Grouped stock row is invalid', 'allocations': []}

    try:
        qty = Decimal(str(qty_to_reduce or 0))
    except Exception:
        return {'success': False, 'msg': 'Invalid qty', 'allocations': []}

    if qty <= 0:
        return {'success': True, 'allocations': []}

    member_links = list(
        grouped_item_member.objects.filter(
            grouped_id=grouped_stock.grouped_item_ref_id,
            active=True,
            bidhaa_stoku__Interprise_id=grouped_stock.Interprise_id,
        ).select_related('bidhaa_stoku')
    )

    member_bidhaa_ids = set()
    for link in member_links:
        stock = link.bidhaa_stoku
        if stock and stock.bidhaa_id:
            member_bidhaa_ids.add(stock.bidhaa_id)

    if not member_bidhaa_ids:
        return {
            'success': False,
            'msg': 'Grouped members are missing bidhaa links',
            'allocations': []
        }

    all_related_rows = list(
        bidhaa_stoku.objects.filter(
            Interprise_id=grouped_stock.Interprise_id,
            is_grouped_item=False,
            service=False,
            bidhaa_id__in=member_bidhaa_ids,
        ).order_by('id')
    )

    members = []
    total_available = Decimal('0')
    for stock in all_related_rows:
        remaining = Decimal(str(stock.idadi or 0)) - Decimal(str(stock.partial_item_reduction_qty or 0))
        if remaining < 0:
            remaining = Decimal('0')

        if remaining > 0:
            members.append({'stock_id': stock.id, 'remaining': remaining})
            total_available += remaining

    if total_available < qty:
        return {
            'success': False,
            'msg': f'Grouped members stock is not enough ({total_available} < {qty})',
            'available': total_available,
            'allocations': []
        }

    allocations = []
    remaining_qty = qty

    single_member = next((m for m in members if m['remaining'] >= qty), None)
    if single_member:
        allocations.append({'stock_id': single_member['stock_id'], 'qty': qty})
        remaining_qty = Decimal('0')
    else:
        members.sort(key=lambda x: x['remaining'], reverse=True)
        for member in members:
            if remaining_qty <= 0:
                break

            alloc_qty = min(member['remaining'], remaining_qty)
            if alloc_qty <= 0:
                continue

            allocations.append({'stock_id': member['stock_id'], 'qty': alloc_qty})
            remaining_qty -= alloc_qty

    if remaining_qty > 0:
        return {'success': False, 'msg': 'Failed to allocate grouped qty', 'allocations': allocations}

    for alloc in allocations:
        bidhaa_stoku.objects.filter(pk=alloc['stock_id']).update(
            partial_item_reduction_qty=F('partial_item_reduction_qty') + alloc['qty'],
        )

    return {'success': True, 'allocations': allocations}


def restore_grouped_members_stock(grouped_stock, qty_to_restore):
    """
    Reverse grouped sales allocation from member items by reducing:
    - partial_item_reduction_qty
    """
    if not grouped_stock or not getattr(grouped_stock, 'is_grouped_item', False) or not getattr(grouped_stock, 'grouped_item_ref_id', None):
        return {'success': False, 'msg': 'Grouped stock row is invalid', 'allocations': []}

    try:
        qty = Decimal(str(qty_to_restore or 0))
    except Exception:
        return {'success': False, 'msg': 'Invalid qty', 'allocations': []}

    if qty <= 0:
        return {'success': True, 'allocations': []}

    member_links = list(
        grouped_item_member.objects.filter(
            grouped_id=grouped_stock.grouped_item_ref_id,
            active=True,
            bidhaa_stoku__Interprise_id=grouped_stock.Interprise_id,
        ).select_related('bidhaa_stoku')
    )

    member_bidhaa_ids = set()
    for link in member_links:
        stock = link.bidhaa_stoku
        if stock and stock.bidhaa_id:
            member_bidhaa_ids.add(stock.bidhaa_id)

    if not member_bidhaa_ids:
        return {
            'success': False,
            'msg': 'Grouped members are missing bidhaa links',
            'allocations': []
        }

    all_related_rows = list(
        bidhaa_stoku.objects.filter(
            Interprise_id=grouped_stock.Interprise_id,
            is_grouped_item=False,
            service=False,
            bidhaa_id__in=member_bidhaa_ids,
        ).order_by('id')
    )

    members = []
    total_reversible = Decimal('0')
    for stock in all_related_rows:
        sold_qty = Decimal(str(stock.partial_item_reduction_qty or 0))
        if sold_qty > 0:
            members.append({'stock': stock, 'sold_qty': sold_qty})
            total_reversible += sold_qty

    if total_reversible < qty:
        return {
            'success': False,
            'msg': f'Grouped sold counters are not enough to restore ({total_reversible} < {qty})',
            'available': total_reversible,
            'allocations': []
        }

    allocations = []
    remaining_qty = qty

    single_member = next((m for m in members if m['sold_qty'] >= qty), None)
    if single_member:
        allocations.append({'stock': single_member['stock'], 'qty': qty})
        remaining_qty = Decimal('0')
    else:
        members.sort(key=lambda x: x['sold_qty'], reverse=True)
        for member in members:
            if remaining_qty <= 0:
                break

            alloc_qty = min(member['sold_qty'], remaining_qty)
            if alloc_qty <= 0:
                continue

            allocations.append({'stock': member['stock'], 'qty': alloc_qty})
            remaining_qty -= alloc_qty

    if remaining_qty > 0:
        return {'success': False, 'msg': 'Failed to restore grouped qty', 'allocations': []}

    for alloc in allocations:
        stock = alloc['stock']
        qty_back = alloc['qty']

        new_partial = Decimal(str(stock.partial_item_reduction_qty or 0)) - qty_back
        if new_partial < 0:
            new_partial = Decimal('0')

        stock.partial_item_reduction_qty = new_partial
        stock.save(update_fields=['partial_item_reduction_qty'])

    return {
        'success': True,
        'allocations': [
            {'stock_id': a['stock'].id, 'qty': a['qty']} for a in allocations
        ]
    }
