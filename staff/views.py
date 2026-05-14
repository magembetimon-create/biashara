import traceback
from decimal import Decimal
from datetime import datetime
from collections import defaultdict

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.db.models import Sum
from django.utils import timezone
import json

from management.models import (
    Interprise,
    Workers,
    InterprisePermissions,
    EmployeeAttachments,
    deliveryAgents,
    transferList,
    bidhaa_stoku,
    PaymentAkaunts,
    savedStockState,
    SaveAkauntState,
    ItemsState,
    ColorState,
    SizeState,
    produ_colored,
    produ_size,
    ShiftSession,
    ShiftAssignment,
    ShiftActivity,
    mauzoList,
    productChangeRecord,
    toaCash,
    wekaCash,
)
from accaunts.todos import Todos


def todoFunct(request):
    usr = Todos(request)
    return usr.todoF()


def _check_admin_or_msaidizi(todo):
    """
    Check if user is admin (owner) or has msaidizi permission.
    Returns (allowed: bool, response_obj: JsonResponse or None)
    """
    cheo = todo.get('cheo')
    duka = todo.get('duka')
    useri = todo.get('useri')
    
    # Check if user is owner (admin)
    if duka and duka.owner and duka.owner == useri:
        return True, None
    
    # Check if user has msaidizi permission
    if cheo and getattr(cheo, 'msaidizi', False):
        return True, None
    
    # Permission denied
    return False, JsonResponse({
        'success': False,
        'msg_swa': 'Ninyi halisineweza kufanya hii operesheni. Inahtaji ruhusa ya msaidizi au kuwa mwenyeji.',
        'msg_eng': 'You do not have permission to perform this operation. Admin or msaidizi access required.'
    }, status=403)


def _save_opening_snapshot(duka, opener_perm, desc=''):
    state = savedStockState()
    state.Interprise = duka
    state.maelezo = desc
    state.date = timezone.now()
    state.By = opener_perm
    state.save()

    items = bidhaa_stoku.objects.filter(Q(inapacha=False) | Q(idadi__gt=0), Interprise=duka.id)
    colors = produ_colored.objects.filter(
        Q(bidhaa__idadi__gt=0) | Q(bidhaa__inapacha=False),
        color__colored=True,
        Interprise=duka.id,
    )
    sizes = produ_size.objects.filter(
        Q(bidhaa__idadi__gt=0) | Q(bidhaa__inapacha=False),
        Interprise=duka.id,
    )
    accounts = PaymentAkaunts.objects.filter(Interprise=duka.id)

    for p in accounts:
        SaveAkauntState.objects.create(sakaunt=p, kiasi=float(p.Amount), state=state)

    for it in items:
        ItemsState.objects.create(sbidhaa=it, sidadi=float(it.idadi), state=state)

    for c in colors:
        ColorState.objects.create(scolor=c, sidadi=float(c.idadi), state=state)

    for s in sizes:
        SizeState.objects.create(ssize=s, sidadi=float(s.idadi), state=state)

    return state


def _shift_enabled_or_redirect(todo):
    duka = todo.get('duka')
    if not duka or not duka.Interprise:
        return False, redirect('/userdash')
    if not duka.shift_management_enabled:
        return False, redirect('/staff/all')
    return True, None


def _generate_shift_code(duka):
    seq = ShiftSession.objects.filter(Interprise=duka.id).count() + 1
    return f"SHIFT-{timezone.now().strftime('%Y%m%d')}-{seq:04d}"


@login_required(login_url='login')
def all_staff(request):
    try:
        todo = todoFunct(request)
        duka = todo['duka']
        workers = Workers.objects.filter(Interprise=duka.id).order_by('jina')
        # Annotate each worker with whether they have a system account
        worker_ids_with_account = set(
            Workers.objects.filter(
                Interprise=duka.id,
                diactive__isnull=False
            ).values_list('pk', flat=True)
        )
        todo.update({
            'workers': workers,
            'worker_ids_with_account': worker_ids_with_account,
            'staff_page': 'all',
        })
        return render(request, 'staff/all_staff.html', todo)
    except Exception:
        traceback.print_exc() 
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
@csrf_exempt
def set_shift_management_status(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'msg': 'Invalid method'}, status=405)

    try:
        todo = todoFunct(request)
        cheo = todo.get('cheo')
        duka = todo.get('duka')

        if not cheo or not getattr(cheo, 'owner', False):
            return JsonResponse({
                'success': False,
                'msg_swa': 'Ni mmiliki wa biashara tu anaweza kubadili mpangilio huu.',
                'msg_eng': 'Only the business owner can change this setting.'
            }, status=403)

        enabled_raw = str(request.POST.get('enabled', '0')).strip().lower()
        enabled = enabled_raw in ['1', 'true', 'yes', 'on']

        Interprise.objects.filter(pk=duka.id).update(shift_management_enabled=enabled)

        return JsonResponse({
            'success': True,
            'enabled': enabled,
            'msg_swa': 'Mpangilio wa usimamizi wa wafanyakazi umebadilishwa.',
            'msg_eng': 'Staff management setting updated successfully.'
        })
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)


@login_required(login_url='login')
def add_staff(request):
    try:
        todo = todoFunct(request)
        duka = todo['duka']
        
        if request.method == 'POST':
            # Permission check: admin or msaidizi only
            allowed, perm_response = _check_admin_or_msaidizi(todo)
            if not allowed:
                return perm_response
            
            staff_id = int(request.POST.get('staff', 0))
            cheo = request.POST.get('staffcheo', '')
            
            worker = Workers.objects.filter(pk=staff_id, Interprise=duka.id).first()
            if not worker:
                return JsonResponse({'success': False, 'msg': 'Worker not found'})
            
            # Check if already added
            if InterprisePermissions.objects.filter(fanyakazi=worker.id, Interprise=duka.id).exists():
                return JsonResponse({'success': False, 'msg': 'Staff already added'})
            
            # Create InterprisePermissions
            perm = InterprisePermissions()
            perm.Interprise = duka
            perm.user = worker.diactive.where.owner if worker.diactive else todo.get('useri')
            perm.owner = False
            perm.Allow = True
            perm.discount = False
            perm.addsupplier = False
            perm.addproduct = False
            perm.profile = False
            perm.cheo = cheo or worker.kazi
            perm.admin = request.user.id
            perm.fanyakazi = worker
            perm.save()
            
            return JsonResponse({'success': True, 'msg': 'Staff added successfully'})
        
        # GET request - render form
        workers = Workers.objects.filter(Interprise=duka.id).order_by('jina')
        todo.update({
            'workers': workers,
            'staff_page': 'all',
        })
        return render(request, 'staff/add_staff.html', todo)
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)})


@login_required(login_url='login')
def view_staff(request):
    try:
        todo = todoFunct(request)
        duka = todo['duka']
        cheo = todo.get('cheo')
        worker_id = int(request.GET.get('wid', 0))
        
        worker = Workers.objects.filter(pk=worker_id, Interprise=duka.id).first()
        if not worker and duka.owner == todo.get('useri'):
            worker = Workers.objects.filter(pk=worker_id, Interprise__owner=duka.owner.id).first()

        if not worker:
            return redirect('/staff/all')
        
        attachments = EmployeeAttachments.objects.filter(employee=worker.id).order_by('-pk')

        has_user = False
        is_delivery_agent = False

        if worker.diactive is not None:
            linked_user = worker.diactive.where.owner
            has_user = InterprisePermissions.objects.filter(
                user=linked_user.id,
                Interprise=duka.id,
            ).exists()
            is_delivery_agent = deliveryAgents.objects.filter(
                Interprise=duka.id,
                agent=worker.id,
            ).exists()

        perm = InterprisePermissions.objects.filter(fanyakazi=worker.id, Interprise=duka.id).first()

        viewer_can_manage = bool(
            duka.owner == todo.get('useri') or (cheo and cheo.fullcontrol)
        )
        
        todo.update({
            'worker': worker,
            'attach': attachments,
            'theUser': has_user,
            'deliver': is_delivery_agent,
            'perm': perm,
            'viewer_can_manage': viewer_can_manage,
            'staff_page': 'all',
        })
        return render(request, 'staff/view_staff.html', todo)
    except Exception:
        traceback.print_exc()
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
def staff_with_access(request):
    try:
        todo = todoFunct(request)
        duka = todo['duka']
        # Staff who have Allow=True and are not owners (i.e. registered users)
        permissions = InterprisePermissions.objects.filter(
            Interprise=duka.id,
            owner=False,
            Allow=True,
        ).select_related('user__user', 'fanyakazi').order_by('cheo')
        todo.update({
            'permissions': permissions,
            'staff_page': 'access',
        })
        return render(request, 'staff/staff_with_access.html', todo)
    except Exception:
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
def waiters(request):
    try:
        todo = todoFunct(request)
        duka = todo['duka']
        # Waiters: users with waiter_counter=True
        waiter_perms = InterprisePermissions.objects.filter(
            Interprise=duka.id,
            owner=False,
            Allow=True,
            waiter_counter=True,
        ).select_related('user__user', 'fanyakazi').order_by('cheo')
        todo.update({
            'waiter_perms': waiter_perms,
            'staff_page': 'waiters',
        })
        return render(request, 'staff/waiters.html', todo)
    except Exception:
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
def staff_shifts(request):
    try:
        todo = todoFunct(request)
        ok, resp = _shift_enabled_or_redirect(todo)
        if not ok:
            return resp

        duka = todo['duka']
        shifts = ShiftSession.objects.filter(Interprise=duka.id).order_by('-created_at')
        has_open_shift = shifts.filter(status='open').exists()
        todo.update({
            'staff_page': 'shifts',
            'shifts': shifts,
            'has_open_shift': has_open_shift,
        })
        return render(request, 'staff/shifts.html', todo)
    except Exception:
        traceback.print_exc()
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
def new_shift(request):
    try:
        todo = todoFunct(request)
        ok, resp = _shift_enabled_or_redirect(todo)
        if not ok:
            return resp

        duka = todo['duka']
        cheo = todo['cheo']
        is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest'

        def _error_response(msg_swa, msg_eng, status=400):
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'msg_swa': msg_swa,
                    'msg_eng': msg_eng,
                }, status=status)
            return render(request, 'errorpage.html', todoFunct(request))

        if request.method == 'POST':
            if not todo.get('can_open_shift'):
                return JsonResponse({
                    'success': False,
                    'msg_swa': 'Hauna ruhusa ya kufungua shift hii.',
                    'msg_eng': 'You are not allowed to open this shift.'
                }, status=403)

            existing_shift = ShiftSession.objects.filter(
                Interprise=duka.id,
            ).exclude(status='closed').order_by('-created_at').first()
            if existing_shift:
                return _error_response(
                    'Kuna shift nyingine ambayo bado haijafungwa. Funga hiyo kwanza kabla ya kufungua mpya.',
                    'There is another shift that is not closed yet. Close it before opening a new one.',
                    status=409,
                )

            access_to = int(request.POST.get('access_to', 0))
            notes = request.POST.get('notes', '')
            shift_start_raw = (request.POST.get('shift_start') or '').strip()
            raw_staff_ids = request.POST.getlist('staff_ids') or request.POST.getlist('staff_ids[]')
            staff_ids = [int(sid) for sid in raw_staff_ids if str(sid).isdigit()]

            shift_start = timezone.now()
            if shift_start_raw:
                try:
                    parsed = datetime.strptime(shift_start_raw, '%Y-%m-%dT%H:%M')
                    shift_start = timezone.make_aware(parsed, timezone.get_current_timezone())
                except Exception:
                    shift_start = timezone.now()

            opening_cash = PaymentAkaunts.objects.filter(
                Interprise=duka.id,
                aina__iexact='Cash',
            ).aggregate(sum=Sum('Amount'))['sum'] or Decimal('0')

            access_user = InterprisePermissions.objects.filter(
                pk=access_to,
                Interprise=duka.id,
                Allow=True,
                owner=False,
            ).first()
            if not access_user:
                return _error_response(
                    'Mtumiaji wa kurekodi hajapatikana au haruhusiwi.',
                    'Selected recorder user not found or not allowed.',
                    status=400,
                )

            shift = ShiftSession.objects.create(
                Interprise=duka,
                code=_generate_shift_code(duka),
                shift_type='daily',
                status='open',
                starts_at=shift_start,
                opening_cash=opening_cash,
                notes=notes,
                opened_by=cheo,
            )

            # Assign recorder (access_user)
            ShiftAssignment.objects.get_or_create(
                shift=shift,
                staff=access_user,
                role='recorder',
                defaults={'active': True, 'assigned_by': cheo},
            )

            # Assign shift team (Workers)
            for wid in staff_ids:
                worker = Workers.objects.filter(pk=wid, Interprise=duka.id).first()
                if worker:
                    # Find InterprisePermissions for this worker
                    staff_perm = InterprisePermissions.objects.filter(
                        Interprise=duka.id,
                        fanyakazi=worker,
                        Allow=True,
                        owner=False,
                    ).first()
                    if staff_perm and staff_perm.id != access_user.id:
                        ShiftAssignment.objects.get_or_create(
                            shift=shift,
                            staff=staff_perm,
                            role='staff',
                            defaults={'active': True, 'assigned_by': cheo},
                        )

            ShiftActivity.objects.create(
                shift=shift,
                event_type='OPENING_CASH',
                amount=opening_cash,
                details='Shift opened',
                by=cheo,
            )

            snapshot = _save_opening_snapshot(duka, cheo, f"Shift opening snapshot {shift.code}")
            ShiftActivity.objects.create(
                shift=shift,
                event_type='OPENING_SNAPSHOT',
                amount=0,
                event_ref_id=snapshot.id,
                details='Opening inventory snapshot saved',
                by=cheo,
            )

            if is_ajax:
                return JsonResponse({
                    'success': True,
                    'redirect_url': f'/staff/shifts/view?sid={shift.id}',
                    'msg_swa': 'Shift imehifadhiwa kikamilifu.',
                    'msg_eng': 'Shift saved successfully.',
                })

            return redirect(f'/staff/shifts/view?sid={shift.id}')

        # Use InterprisePermissions for access_users (recorder) and Workers for shift_team
        access_users = InterprisePermissions.objects.filter(
            Interprise=duka.id,
            Allow=True,
            owner=False,
        ).select_related('user__user', 'fanyakazi').order_by('cheo')

        shift_team = Workers.objects.filter(Interprise=duka.id).order_by('jina')

        accounts = PaymentAkaunts.objects.filter(Interprise=duka.id, aina__iexact='Cash').order_by('Akaunt_name')
        stock_items = bidhaa_stoku.objects.filter(Interprise=duka.id).select_related('bidhaa').order_by('bidhaa__bidhaa_jina')
        shift_start_default = timezone.localtime(timezone.now()).strftime('%Y-%m-%dT%H:%M')
        cash_amount_total = accounts.aggregate(sum=Sum('Amount'))['sum'] or 0

        registered_items = stock_items.count()
        total_buy_value = Decimal('0')
        total_expected_sales = Decimal('0')
        for itm in stock_items:
            qty = Decimal(itm.idadi or 0)
            total_buy_value += qty * Decimal(itm.Bei_kununua or 0)
            total_expected_sales += qty * Decimal(itm.Bei_kuuza or 0)

        todo.update({
            'staff_page': 'shifts',
            'access_users': access_users,
            'shift_team': shift_team,
            'accounts': accounts,
            'stock_items': stock_items,
            'shift_start_default': shift_start_default,
            'cash_amount_total': cash_amount_total,
            'registered_items': registered_items,
            'total_buy_value': total_buy_value,
            'total_expected_sales': total_expected_sales,
        })
        return render(request, 'staff/new_shift.html', todo)
    except Exception:
        traceback.print_exc()
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
def shift_view(request):
    try:
        todo = todoFunct(request)
        ok, resp = _shift_enabled_or_redirect(todo)
        if not ok:
            return resp

        duka = todo['duka']
        sid = int(request.GET.get('sid', 0))
        shift = ShiftSession.objects.get(pk=sid, Interprise=duka.id)
        period_end = shift.ends_at or timezone.now()

        assignments = ShiftAssignment.objects.filter(shift=shift.id, active=True).select_related('staff__user__user', 'staff__fanyakazi').order_by('role', 'assigned_at')
        activities = ShiftActivity.objects.filter(shift=shift.id).order_by('-recorded_at')

        # Team rows: recorder first, then other shift members.
        shift_team_rows = []
        for a in assignments:
            staff_perm = a.staff
            worker = staff_perm.fanyakazi if staff_perm else None
            if worker:
                name = worker.jina
                role_name = 'Recorder' if a.role == 'recorder' else (worker.kazi or 'Staff')
            elif staff_perm and staff_perm.user and staff_perm.user.user:
                user_obj = staff_perm.user.user
                name = user_obj.get_full_name() or user_obj.username
                role_name = 'Recorder' if a.role == 'recorder' else (staff_perm.cheo or 'Staff')
            else:
                name = 'Unknown'
                role_name = 'Recorder' if a.role == 'recorder' else 'Staff'

            shift_team_rows.append({
                'name': name,
                'role': role_name,
                'is_recorder': a.role == 'recorder',
            })

        shift_team_rows.sort(key=lambda row: (0 if row['is_recorder'] else 1, row['name'].lower()))

        sales_rows = mauzoList.objects.filter(
            mauzo__Interprise=duka.id,
            mauzo__tarehe__gte=shift.starts_at,
            mauzo__tarehe__lte=period_end,
            mauzo__service=False,
            mauzo__order=False,
        ).values_list('idadi', 'bei')
        sales_amount = sum((row[0] or 0) * (row[1] or 0) for row in sales_rows)

        used_qty = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
            adjst__tumika=True,
        ).aggregate(sum=Sum('qty'))['sum'] or 0

        damaged_qty = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
        ).filter(Q(adjst__haribika=True) | Q(adjst__potea=True)).aggregate(sum=Sum('qty'))['sum'] or 0

        stock_now = bidhaa_stoku.objects.filter(Interprise=duka.id).aggregate(sum=Sum('idadi'))['sum'] or 0

        expenses = toaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).aggregate(sum=Sum('Amount'))['sum'] or 0

        deposits = wekaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).aggregate(sum=Sum('Amount'))['sum'] or 0

        cash_accounts = PaymentAkaunts.objects.filter(Interprise=duka.id, aina__iexact='Cash').order_by('Akaunt_name')
        opening_cash = shift.opening_cash
        current_cash = cash_accounts.aggregate(sum=Sum('Amount'))['sum'] or 0

        expected_cash = Decimal(opening_cash) + Decimal(deposits) - Decimal(expenses)

        # Get mobile payments (non-Cash accounts) for this shift
        mobile_payments = wekaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).exclude(
            Akaunt__aina__iexact='Cash'
        ).select_related('Akaunt', 'by__fanyakazi').order_by('tarehe')
        mobile_payments_total = mobile_payments.aggregate(sum=Sum('Amount'))['sum'] or Decimal('0')

        stock_items_qs = bidhaa_stoku.objects.filter(
            Interprise=duka.id,
        ).select_related('bidhaa').order_by('bidhaa__bidhaa_jina')

        opening_snapshot_activity = ShiftActivity.objects.filter(
            shift=shift.id,
            event_type='OPENING_SNAPSHOT',
            event_ref_id__isnull=False,
        ).order_by('recorded_at').first()

        before_qty_map = defaultdict(lambda: Decimal('0'))
        if opening_snapshot_activity:
            for row in ItemsState.objects.filter(state_id=opening_snapshot_activity.event_ref_id).values('sbidhaa_id', 'sidadi'):
                before_qty_map[row['sbidhaa_id']] = Decimal(row['sidadi'] or 0)

        sold_qty_map = defaultdict(lambda: Decimal('0'))
        sold_rows = mauzoList.objects.filter(
            mauzo__Interprise=duka.id,
            mauzo__tarehe__gte=shift.starts_at,
            mauzo__tarehe__lte=period_end,
            mauzo__service=False,
            mauzo__order=False,
        ).values_list('produ_id', 'idadi', 'returned', 'serviceReturn')
        for produ_id, qty, returned, service_return in sold_rows:
            net_qty = Decimal(qty or 0) - Decimal(returned or 0) - Decimal(service_return or 0)
            if net_qty > 0:
                sold_qty_map[produ_id] += net_qty

        reduction_qty_map = defaultdict(lambda: Decimal('0'))
        reduction_rows = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
        ).filter(
            Q(adjst__tumika=True) | Q(adjst__haribika=True) | Q(adjst__potea=True)
        ).values_list('prod_id', 'qty')
        for prod_id, qty in reduction_rows:
            reduction_qty_map[prod_id] += Decimal(qty or 0)

        added_qty_map = defaultdict(lambda: Decimal('0'))
        added_rows = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
            adjst__Ongezwa=True,
        ).values_list('prod_id', 'qty')
        for prod_id, qty in added_rows:
            added_qty_map[prod_id] += Decimal(qty or 0)

        transferred_qty_map = defaultdict(lambda: Decimal('0'))
        transferred_rows = transferList.objects.filter(
            toka__Interprise=duka.id,
            kwenda__receive__transfer__Interprise=duka.id,
            kwenda__receive__transfer__order=False,
            kwenda__receive__transfer__tarehe__gte=shift.starts_at,
            kwenda__receive__transfer__tarehe__lte=period_end,
        ).values_list('toka_id', 'kwenda__qty')
        for toka_id, qty in transferred_rows:
            transferred_qty_map[toka_id] += Decimal(qty or 0)

        stock_value_rows = []
        stock_value_totals = {
            'before_qty': Decimal('0'),
            'before_value': Decimal('0'),
            'before_worth': Decimal('0'),
            'added_qty': Decimal('0'),
            'added_value': Decimal('0'),
            'added_worth': Decimal('0'),
            'sold_qty': Decimal('0'),
            'sold_value': Decimal('0'),
            'sold_worth': Decimal('0'),
            'reduction_qty': Decimal('0'),
            'reduction_value': Decimal('0'),
            'reduction_worth': Decimal('0'),
            'transferred_qty': Decimal('0'),
            'transferred_value': Decimal('0'),
            'transferred_worth': Decimal('0'),
            'current_qty': Decimal('0'),
            'current_value': Decimal('0'),
            'current_worth': Decimal('0'),
        }
        # Group bidhaa_stoku by distinct bidhaa (product) – each product name appears only once
        bidhaa_groups = {}
        for itm in stock_items_qs:
            bid = itm.bidhaa_id
            if bid not in bidhaa_groups:
                bidhaa_groups[bid] = []
            bidhaa_groups[bid].append(itm)

        for bid, items in sorted(bidhaa_groups.items(), key=lambda x: (x[1][0].bidhaa.bidhaa_jina or '').lower() if x[1][0].bidhaa else ''):
            first_item = items[0]
            item_name = first_item.bidhaa.bidhaa_jina if first_item.bidhaa else ''
            units = first_item.bidhaa.vipimo if first_item.bidhaa else ''

            current_qty = Decimal('0')
            current_value = Decimal('0')
            current_worth = Decimal('0')
            before_qty = Decimal('0')
            before_value = Decimal('0')
            before_worth = Decimal('0')
            added_qty = Decimal('0')
            added_value = Decimal('0')
            added_worth = Decimal('0')
            sold_qty = Decimal('0')
            sold_value = Decimal('0')
            sold_worth = Decimal('0')
            reduction_qty = Decimal('0')
            reduction_value = Decimal('0')
            reduction_worth = Decimal('0')
            transferred_qty = Decimal('0')
            transferred_value = Decimal('0')
            transferred_worth = Decimal('0')

            for itm in items:
                ratio = Decimal(itm.bidhaa.idadi_jum or 1) if itm.bidhaa else Decimal('1')
                buy_price = Decimal(itm.Bei_kununua or 0)
                sales_price = Decimal(itm.Bei_kuuza or 0)
                iid = itm.id

                c_qty = Decimal(itm.idadi or 0)
                current_qty += c_qty
                current_value += c_qty * buy_price / ratio
                current_worth += c_qty * sales_price

                b_qty = before_qty_map[iid]
                before_qty += b_qty
                before_value += b_qty * buy_price / ratio
                before_worth += b_qty * sales_price

                a_qty = added_qty_map[iid]
                added_qty += a_qty
                added_value += a_qty * buy_price / ratio
                added_worth += a_qty * sales_price

                s_qty = sold_qty_map[iid]
                sold_qty += s_qty
                sold_value += s_qty * buy_price / ratio
                sold_worth += s_qty * sales_price

                r_qty = reduction_qty_map[iid]
                reduction_qty += r_qty
                reduction_value += r_qty * buy_price / ratio
                reduction_worth += r_qty * sales_price

                t_qty = transferred_qty_map[iid]
                transferred_qty += t_qty
                transferred_value += t_qty * buy_price / ratio
                transferred_worth += t_qty * sales_price

            stock_value_rows.append({
                'item_name': item_name,
                'units': units,
                'before_qty': before_qty,
                'before_value': before_value,
                'before_worth': before_worth,
                'added_qty': added_qty,
                'added_value': added_value,
                'added_worth': added_worth,
                'sold_qty': sold_qty,
                'sold_value': sold_value,
                'sold_worth': sold_worth,
                'reduction_qty': reduction_qty,
                'reduction_value': reduction_value,
                'reduction_worth': reduction_worth,
                'transferred_qty': transferred_qty,
                'transferred_value': transferred_value,
                'transferred_worth': transferred_worth,
                'current_qty': current_qty,
                'current_value': current_value,
                'current_worth': current_worth,
            })

            stock_value_totals['before_qty'] += before_qty
            stock_value_totals['before_value'] += before_value
            stock_value_totals['before_worth'] += before_worth
            stock_value_totals['added_qty'] += added_qty
            stock_value_totals['added_value'] += added_value
            stock_value_totals['added_worth'] += added_worth
            stock_value_totals['sold_qty'] += sold_qty
            stock_value_totals['sold_value'] += sold_value
            stock_value_totals['sold_worth'] += sold_worth
            stock_value_totals['reduction_qty'] += reduction_qty
            stock_value_totals['reduction_value'] += reduction_value
            stock_value_totals['reduction_worth'] += reduction_worth
            stock_value_totals['transferred_qty'] += transferred_qty
            stock_value_totals['transferred_value'] += transferred_value
            stock_value_totals['transferred_worth'] += transferred_worth
            stock_value_totals['current_qty'] += current_qty
            stock_value_totals['current_value'] += current_value
            stock_value_totals['current_worth'] += current_worth

        todo.update({
            'staff_page': 'shifts',
            'shift': shift,
            'assignments': assignments,
            'shift_team_rows': shift_team_rows,
            'activities': activities,
            'movement': {
                'sales_amount': sales_amount,
                'used_qty': used_qty,
                'damaged_qty': damaged_qty,
                'stock_now': stock_now,
            },
            'payments': {
                'opening_cash': opening_cash,
                'expenses': expenses,
                'deposits': deposits,
                'expected_cash': expected_cash,
                'current_cash': current_cash,
            },
            'cash_accounts': cash_accounts,
            'mobile_payments': mobile_payments,
            'mobile_payments_total': mobile_payments_total,
            'stock_value_rows': stock_value_rows,
            'stock_value_totals': stock_value_totals,
        })
        return render(request, 'staff/shift_view.html', todo)
    except Exception:
        traceback.print_exc()
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
def close_shift(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'msg': 'Invalid method'}, status=405)
    try:
        todo = todoFunct(request)
        ok, resp = _shift_enabled_or_redirect(todo)
        if not ok:
            return JsonResponse({'success': False, 'msg': 'Shift management disabled'}, status=403)

        duka = todo['duka']
        cheo = todo['cheo']
        shift_operation_allowed = todo['shift_operation_allowed']
        sid = int(request.POST.get('sid', 0))
        actual = Decimal(request.POST.get('actual_closing_cash', '0') or '0')

        shift = ShiftSession.objects.get(pk=sid, Interprise=duka.id)
        if shift.status == 'closed':
            return JsonResponse({'success': False, 'msg': 'Shift already closed'})

        is_assigned = ShiftAssignment.objects.filter(shift=shift, staff=cheo, active=True).exists()
        if not ((shift_operation_allowed and cheo.close_own_shift) or cheo.owner ):
            return JsonResponse({
                'success': False,
                'msg_swa': 'Hauna ruhusa ya kufunga shift hii.',
                'msg_eng': 'You are not allowed to close this shift.'
            }, status=403)

        period_end = timezone.now()
        expenses = toaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).aggregate(sum=Sum('Amount'))['sum'] or 0
        deposits = wekaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).aggregate(sum=Sum('Amount'))['sum'] or 0
        expected = Decimal(shift.opening_cash) + Decimal(deposits) - Decimal(expenses)

        shift.status = 'closed'
        shift.ends_at = period_end
        shift.closed_by = cheo
        shift.expected_closing_cash = expected
        shift.actual_closing_cash = actual
        shift.variance = actual - expected
        shift.save()

        ShiftActivity.objects.create(
            shift=shift,
            event_type='CLOSING_CASH',
            amount=actual,
            details='Shift closed',
            by=cheo,
        )

        return JsonResponse({'success': True, 'msg': 'Shift closed successfully'})
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)


@login_required(login_url='login')
def print_shift(request):
    """Generate print-friendly shift summary using identical logic as shift_view"""
    try:
        sid = request.GET.get('sid')
        lang = request.GET.get('lang', '0')
        items = request.GET.get('items', '1')
        include_items = str(items or '1').strip().lower() not in ('0', 'false', 'no', 'off', '')

        if not sid:
            return JsonResponse({'success': False, 'msg': 'Invalid shift ID'}, status=400)

        todo = todoFunct(request)
        duka = todo.get('duka')
        useri = todo.get('useri')

        if not duka or not useri:
            return JsonResponse({'success': False, 'msg': 'User context error'}, status=400)

        shift = ShiftSession.objects.get(pk=sid, Interprise=duka.id)
        period_end = shift.ends_at or timezone.now()

        # --- Shift team (identical to shift_view) ---
        assignments = ShiftAssignment.objects.filter(
            shift=shift.id, active=True
        ).select_related('staff__user__user', 'staff__fanyakazi').order_by('role', 'assigned_at')

        shift_team_rows = []
        for a in assignments:
            staff_perm = a.staff
            worker = staff_perm.fanyakazi if staff_perm else None
            if worker:
                name = worker.jina
                role_name = 'Recorder' if a.role == 'recorder' else (worker.kazi or 'Staff')
            elif staff_perm and staff_perm.user and staff_perm.user.user:
                user_obj = staff_perm.user.user
                name = user_obj.get_full_name() or user_obj.username
                role_name = 'Recorder' if a.role == 'recorder' else (staff_perm.cheo or 'Staff')
            else:
                name = 'Unknown'
                role_name = 'Recorder' if a.role == 'recorder' else 'Staff'
            shift_team_rows.append({'name': name, 'role': role_name, 'is_recorder': a.role == 'recorder'})
        shift_team_rows.sort(key=lambda row: (0 if row['is_recorder'] else 1, row['name'].lower()))

        # --- Activities (identical to shift_view) ---
        activities = ShiftActivity.objects.filter(shift=shift.id).order_by('-recorded_at')

        # --- Stock movement (identical to shift_view) ---
        sales_rows = mauzoList.objects.filter(
            mauzo__Interprise=duka.id,
            mauzo__tarehe__gte=shift.starts_at,
            mauzo__tarehe__lte=period_end,
            mauzo__service=False,
            mauzo__order=False,
        ).values_list('idadi', 'bei')
        sales_amount = sum((row[0] or 0) * (row[1] or 0) for row in sales_rows)

        used_qty = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
            adjst__tumika=True,
        ).aggregate(sum=Sum('qty'))['sum'] or 0

        damaged_qty = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
        ).filter(Q(adjst__haribika=True) | Q(adjst__potea=True)).aggregate(sum=Sum('qty'))['sum'] or 0

        stock_now = bidhaa_stoku.objects.filter(Interprise=duka.id).aggregate(sum=Sum('idadi'))['sum'] or 0

        # --- Cash summary (identical to shift_view) ---
        expenses = toaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).aggregate(sum=Sum('Amount'))['sum'] or 0

        deposits = wekaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).aggregate(sum=Sum('Amount'))['sum'] or 0

        cash_accounts = PaymentAkaunts.objects.filter(Interprise=duka.id, aina__iexact='Cash').order_by('Akaunt_name')
        opening_cash = shift.opening_cash
        current_cash = cash_accounts.aggregate(sum=Sum('Amount'))['sum'] or 0
        expected_cash = Decimal(opening_cash) + Decimal(deposits) - Decimal(expenses)

        # --- Mobile payments (identical to shift_view) ---
        mobile_payments = wekaCash.objects.filter(
            Interprise=duka.id,
            tarehe__gte=shift.starts_at,
            tarehe__lte=period_end,
        ).exclude(
            Akaunt__aina__iexact='Cash'
        ).select_related('Akaunt', 'by__fanyakazi').order_by('tarehe')
        mobile_payments_total = mobile_payments.aggregate(sum=Sum('Amount'))['sum'] or Decimal('0')

        # --- Stock value rows (identical to shift_view) ---
        stock_items_qs = bidhaa_stoku.objects.filter(
            Interprise=duka.id,
        ).select_related('bidhaa').order_by('bidhaa__bidhaa_jina')

        opening_snapshot_activity = ShiftActivity.objects.filter(
            shift=shift.id,
            event_type='OPENING_SNAPSHOT',
            event_ref_id__isnull=False,
        ).order_by('recorded_at').first()

        before_qty_map = defaultdict(lambda: Decimal('0'))
        if opening_snapshot_activity:
            for row in ItemsState.objects.filter(state_id=opening_snapshot_activity.event_ref_id).values('sbidhaa_id', 'sidadi'):
                before_qty_map[row['sbidhaa_id']] = Decimal(row['sidadi'] or 0)

        sold_qty_map = defaultdict(lambda: Decimal('0'))
        sold_rows = mauzoList.objects.filter(
            mauzo__Interprise=duka.id,
            mauzo__tarehe__gte=shift.starts_at,
            mauzo__tarehe__lte=period_end,
            mauzo__service=False,
            mauzo__order=False,
        ).values_list('produ_id', 'idadi', 'returned', 'serviceReturn')
        for produ_id, qty, returned, service_return in sold_rows:
            net_qty = Decimal(qty or 0) - Decimal(returned or 0) - Decimal(service_return or 0)
            if net_qty > 0:
                sold_qty_map[produ_id] += net_qty

        reduction_qty_map = defaultdict(lambda: Decimal('0'))
        reduction_rows = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
        ).filter(
            Q(adjst__tumika=True) | Q(adjst__haribika=True) | Q(adjst__potea=True)
        ).values_list('prod_id', 'qty')
        for prod_id, qty in reduction_rows:
            reduction_qty_map[prod_id] += Decimal(qty or 0)

        added_qty_map = defaultdict(lambda: Decimal('0'))
        added_rows = productChangeRecord.objects.filter(
            adjst__Interprise=duka.id,
            adjst__date__gte=shift.starts_at,
            adjst__date__lte=period_end,
            adjst__Ongezwa=True,
        ).values_list('prod_id', 'qty')
        for prod_id, qty in added_rows:
            added_qty_map[prod_id] += Decimal(qty or 0)

        transferred_qty_map = defaultdict(lambda: Decimal('0'))
        transferred_rows = transferList.objects.filter(
            toka__Interprise=duka.id,
            kwenda__receive__transfer__Interprise=duka.id,
            kwenda__receive__transfer__order=False,
            kwenda__receive__transfer__tarehe__gte=shift.starts_at,
            kwenda__receive__transfer__tarehe__lte=period_end,
        ).values_list('toka_id', 'kwenda__qty')
        for toka_id, qty in transferred_rows:
            transferred_qty_map[toka_id] += Decimal(qty or 0)

        stock_value_rows = []
        stock_value_totals = {
            'before_qty': Decimal('0'), 'before_value': Decimal('0'), 'before_worth': Decimal('0'),
            'added_qty': Decimal('0'), 'added_value': Decimal('0'), 'added_worth': Decimal('0'),
            'sold_qty': Decimal('0'), 'sold_value': Decimal('0'), 'sold_worth': Decimal('0'),
            'reduction_qty': Decimal('0'), 'reduction_value': Decimal('0'), 'reduction_worth': Decimal('0'),
            'transferred_qty': Decimal('0'), 'transferred_value': Decimal('0'), 'transferred_worth': Decimal('0'),
            'current_qty': Decimal('0'), 'current_value': Decimal('0'), 'current_worth': Decimal('0'),
        }
        # Group bidhaa_stoku by distinct bidhaa (product) – each product name appears only once
        bidhaa_groups = {}
        for itm in stock_items_qs:
            bid = itm.bidhaa_id
            if bid not in bidhaa_groups:
                bidhaa_groups[bid] = []
            bidhaa_groups[bid].append(itm)

        for bid, items in sorted(bidhaa_groups.items(), key=lambda x: (x[1][0].bidhaa.bidhaa_jina or '').lower() if x[1][0].bidhaa else ''):
            first_item = items[0]
            item_name = first_item.bidhaa.bidhaa_jina if first_item.bidhaa else ''
            units = first_item.bidhaa.vipimo if first_item.bidhaa else ''

            current_qty = Decimal('0')
            current_value = Decimal('0')
            current_worth = Decimal('0')
            before_qty = Decimal('0')
            before_value = Decimal('0')
            before_worth = Decimal('0')
            added_qty = Decimal('0')
            added_value = Decimal('0')
            added_worth = Decimal('0')
            sold_qty = Decimal('0')
            sold_value = Decimal('0')
            sold_worth = Decimal('0')
            reduction_qty = Decimal('0')
            reduction_value = Decimal('0')
            reduction_worth = Decimal('0')
            transferred_qty = Decimal('0')
            transferred_value = Decimal('0')
            transferred_worth = Decimal('0')

            for itm in items:
                ratio = Decimal(itm.bidhaa.idadi_jum or 1) if itm.bidhaa else Decimal('1')
                buy_price = Decimal(itm.Bei_kununua or 0)
                sales_price = Decimal(itm.Bei_kuuza or 0)
                iid = itm.id

                c_qty = Decimal(itm.idadi or 0)
                current_qty += c_qty
                current_value += c_qty * buy_price / ratio
                current_worth += c_qty * sales_price

                b_qty = before_qty_map[iid]
                before_qty += b_qty
                before_value += b_qty * buy_price / ratio
                before_worth += b_qty * sales_price

                a_qty = added_qty_map[iid]
                added_qty += a_qty
                added_value += a_qty * buy_price / ratio
                added_worth += a_qty * sales_price

                s_qty = sold_qty_map[iid]
                sold_qty += s_qty
                sold_value += s_qty * buy_price / ratio
                sold_worth += s_qty * sales_price

                r_qty = reduction_qty_map[iid]
                reduction_qty += r_qty
                reduction_value += r_qty * buy_price / ratio
                reduction_worth += r_qty * sales_price

                t_qty = transferred_qty_map[iid]
                transferred_qty += t_qty
                transferred_value += t_qty * buy_price / ratio
                transferred_worth += t_qty * sales_price

            stock_value_rows.append({
                'item_name': item_name,
                'units': units,
                'before_qty': before_qty,
                'before_value': before_value,
                'before_worth': before_worth,
                'added_qty': added_qty,
                'added_value': added_value,
                'added_worth': added_worth,
                'sold_qty': sold_qty,
                'sold_value': sold_value,
                'sold_worth': sold_worth,
                'reduction_qty': reduction_qty,
                'reduction_value': reduction_value,
                'reduction_worth': reduction_worth,
                'transferred_qty': transferred_qty,
                'transferred_value': transferred_value,
                'transferred_worth': transferred_worth,
                'current_qty': current_qty,
                'current_value': current_value,
                'current_worth': current_worth,
            })

            stock_value_totals['before_qty'] += before_qty
            stock_value_totals['before_value'] += before_value
            stock_value_totals['before_worth'] += before_worth
            stock_value_totals['added_qty'] += added_qty
            stock_value_totals['added_value'] += added_value
            stock_value_totals['added_worth'] += added_worth
            stock_value_totals['sold_qty'] += sold_qty
            stock_value_totals['sold_value'] += sold_value
            stock_value_totals['sold_worth'] += sold_worth
            stock_value_totals['reduction_qty'] += reduction_qty
            stock_value_totals['reduction_value'] += reduction_value
            stock_value_totals['reduction_worth'] += reduction_worth
            stock_value_totals['transferred_qty'] += transferred_qty
            stock_value_totals['transferred_value'] += transferred_value
            stock_value_totals['transferred_worth'] += transferred_worth
            stock_value_totals['current_qty'] += current_qty
            stock_value_totals['current_value'] += current_value
            stock_value_totals['current_worth'] += current_worth

        context = {
            'shift': shift,
            'shift_team_rows': shift_team_rows,
            'activities': activities,
            'movement': {
                'sales_amount': sales_amount,
                'used_qty': used_qty,
                'damaged_qty': damaged_qty,
                'stock_now': stock_now,
            },
            'payments': {
                'opening_cash': opening_cash,
                'expenses': expenses,
                'deposits': deposits,
                'expected_cash': expected_cash,
                'current_cash': current_cash,
            },
            'cash_accounts': cash_accounts,
            'mobile_payments': mobile_payments,
            'mobile_payments_total': mobile_payments_total,
            'stock_value_rows': stock_value_rows,
            'stock_value_totals': stock_value_totals,
            'useri': useri,
            'include_items': include_items,
            'lang': lang,
        }

        return render(request, 'staff/print_shift.html', context)

    except ShiftSession.DoesNotExist:
        return JsonResponse({'success': False, 'msg': 'Shift not found'}, status=404)
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)


@login_required(login_url='login')
@csrf_exempt
def grant_role(request):
    """
    Grant or update a role for a worker.
    Expects POST with:
      - worker_id: pk of Workers
      - role: 'user' or 'waiter'
    A worker can be granted a user role only if diactive is not null
    (meaning they are already linked to an Anatumia / Interprise account).
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'msg': 'Invalid method'}, status=405)
    try:
        todo = todoFunct(request)
        duka = todo['duka']
        
        # Permission check: admin or msaidizi only
        allowed, perm_response = _check_admin_or_msaidizi(todo)
        if not allowed:
            return perm_response

        data = json.loads(request.body)
        worker_id = int(data.get('worker_id', 0))
        role = data.get('role', '')

        worker = Workers.objects.get(pk=worker_id, Interprise=duka.id)

        # Worker must have an Anatumia link (diactive) to be granted a system role
        if worker.diactive is None:
            return JsonResponse({
                'success': False,
                'msg_swa': 'Mfanyakazi huyu hana akaunti ya mfumo.',
                'msg_eng': 'This worker does not have a system account link.'
            })

        # Resolve the linked Interprise owner user
        linked_user_ext = worker.diactive.where.owner
        if linked_user_ext is None:
            return JsonResponse({'success': False, 'msg': 'Linked user not found'})

        perm, created = InterprisePermissions.objects.get_or_create(
            Interprise=duka,
            user=linked_user_ext,
            defaults={
                'owner': False,
                'Allow': True,
                'discount': False,
                'addsupplier': False,
                'addproduct': False,
                'profile': False,
                'cheo': worker.kazi[:100],
                'admin': 0,
                'fanyakazi': worker,
            }
        )

        if role == 'user':
            perm.Allow = True
            perm.waiter_counter = False
            perm.fanyakazi = worker
            perm.save()
        elif role == 'waiter':
            perm.Allow = True
            perm.waiter_counter = True
            perm.fanyakazi = worker
            perm.save()
        else:
            return JsonResponse({'success': False, 'msg': 'Unknown role'})

        return JsonResponse({
            'success': True,
            'msg_swa': 'Jukumu limewekwa kikamilifu.',
            'msg_eng': 'Role granted successfully.'
        })

    except Workers.DoesNotExist:
        return JsonResponse({'success': False, 'msg': 'Worker not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)


@login_required(login_url='login')
@csrf_exempt
def update_general_permissions(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'msg': 'Invalid method'}, status=405)

    try:
        todo = todoFunct(request)
        duka = todo['duka']
        
        # Permission check: admin or msaidizi only
        allowed, perm_response = _check_admin_or_msaidizi(todo)
        if not allowed:
            return perm_response

        worker_id = int(request.POST.get('worker_id', 0))
        allow = str(request.POST.get('allow', '0')).lower() in ['1', 'true', 'yes', 'on']
        waiter_counter = str(request.POST.get('waiter_counter', '0')).lower() in ['1', 'true', 'yes', 'on']
        cash_deposit_supervisor = str(request.POST.get('cash_deposit_supervisor', '0')).lower() in ['1', 'true', 'yes', 'on']

        worker = Workers.objects.filter(pk=worker_id, Interprise=duka.id).first()
        if not worker:
            return JsonResponse({'success': False, 'msg': 'Worker not found'}, status=404)

        perm = InterprisePermissions.objects.filter(
            Interprise=duka.id,
            fanyakazi=worker.id,
        ).first()

        # Operations 3/4/5 are only allowed after operation 1 (Add User) has been done.
        if not perm:
            return JsonResponse({
                'success': False,
                'msg_swa': 'Ongeza mtumiaji kwanza kabla ya kuweka ruhusa hizi.',
                'msg_eng': 'Add user first before assigning these permissions.',
            })

        perm.Allow = allow
        perm.waiter_counter = waiter_counter
        perm.cash_deposit_supervisor = cash_deposit_supervisor
        perm.fanyakazi = worker
        perm.save()

        return JsonResponse({
            'success': True,
            'msg_swa': 'Ruhusa zimehifadhiwa kikamilifu.',
            'msg_eng': 'Permissions updated successfully.',
        })
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)

