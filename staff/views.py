import traceback
from decimal import Decimal
from datetime import datetime
from collections import defaultdict

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Sum, F
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils import timezone
import json

from management.models import (
    Interprise,
    Workers,
    UserExtend,
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
    mauzoni,
    mauzoList,
    productChangeRecord,
    toaCash,
    wekaCash,
)
from accaunts.todos import Todos
from staff.shift_report import build_shift_report, completed_sales_qs


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

    items = bidhaa_stoku.objects.filter(Interprise=duka.id)
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
    """Allow shift pages (view/open/close) regardless of shift_management_enabled.

    shift_management_enabled only controls operation blocking elsewhere
    (sales/stock/etc). Shift list/view/open/close stay available for
    users with open/close permissions or shift assignment.
    """
    duka = todo.get('duka')
    if not duka or not duka.Interprise:
        return False, redirect('/userdash')
    return True, None


def _generate_shift_code(duka):
    seq = ShiftSession.objects.filter(Interprise=duka.id).count() + 1
    return f"SHIFT-{timezone.now().strftime('%Y%m%d')}-{seq:04d}"


@login_required(login_url='login')
def all_staff(request):
    try:
        todo = todoFunct(request)
        duka = todo['duka']
        cheo = todo.get('cheo')
        workers = Workers.objects.filter(Interprise__owner=duka.owner.id).order_by('jina')
        # Annotate each worker with whether they have a system account
        # print("here is reachin")
        if not cheo.owner:
            workers = workers.filter(Interprise=duka.id).order_by('jina')
               
        worker_ids_with_account = set(
            workers.filter(
                diactive__isnull=False
            ).values_list('pk', flat=True)
        )


        # all_counters_with_pin_set = InterprisePermissions.objects.filter(
        #     Interprise__owner=duka.owner.id,
        #     waiter_counter = True,
        #     waiter_pin_set = True,

        # )

        # for wt in all_counters_with_pin_set:
        #     InterprisePermissions.objects.filter(user=wt.user,admin=duka.owner.id,waiter_counter=True,waiter_pin_set=False).exclude(pk=wt.pk).update(waiter_pin=wt.waiter_pin,waiter_pin_set=True)


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


def _get_linked_user_for_worker(worker):
    if not worker or worker.diactive is None:
        return None
    return getattr(worker.diactive.where, 'owner', None)


def _ensure_interprise_permission(worker, branch, linked_user, *, allow_state=False, waiter_state=False, role='allow', admin_user=None, added=False):
    if not branch or not linked_user:
        return None

    # if not added:
    #     InterprisePermissions.objects.filter(
    #         Interprise=branch,
    #         user=linked_user,
    #     ).delete()
    #     return None

    perm = InterprisePermissions.objects.filter(
        Interprise=branch,
        user=linked_user,
    ).order_by('pk').first()

    target_worker = None
    if worker and worker.diactive and worker.diactive.where:
        is_worker = Workers.objects.filter(diactive__where=worker.diactive.where, Interprise=branch.id)
        if not is_worker.exists():
            target_worker = Workers.objects.create(
                Interprise=branch,
                jina=worker.jina,
                kazi=worker.kazi,
                address=worker.address,
                code=worker.code,
                simu1=worker.simu1,
                simu2=worker.simu2,
                tin=worker.tin or '',
                diactive=worker.diactive,
                active=True,
            )
        else:
            target_worker = is_worker.first()
    else:
        target_worker = worker

    if perm is None:
        perm = InterprisePermissions.objects.create(
            Interprise=branch,
            user=linked_user,
            owner=False,
            Allow=bool(allow_state) or bool(waiter_state),
            discount=False,
            addsupplier=False,
            addproduct=False,
            profile=False,
            cheo=(target_worker.kazi or '')[:100] if target_worker else '',
            admin=admin_user.id if admin_user else 0,
            fanyakazi=target_worker,
            waiter_counter=bool(waiter_state),
        )
    else:
        perm.fanyakazi = target_worker or perm.fanyakazi
        if role == 'allow':
            perm.Allow = bool(allow_state)
        elif role == 'waiter':
            perm.waiter_counter = bool(waiter_state)
            if perm.waiter_counter:
                perm.Allow = True
        else:
            perm.Allow = bool(allow_state)
            perm.waiter_counter = bool(waiter_state)
        perm.save()

    return perm


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
        linked_user = _get_linked_user_for_worker(worker)

        if linked_user is not None:
            has_user = InterprisePermissions.objects.filter(
                user=linked_user.id,
                Interprise=duka.id,
            ).exists()
            is_delivery_agent = deliveryAgents.objects.filter(
                Interprise=duka.id,
                agent=worker.id,
            ).exists()

        perm = InterprisePermissions.objects.filter(fanyakazi=worker.id, Interprise=duka.id).first()
        # print(f'perm exists {perm is not None}')
        viewer_can_manage = bool(
            duka.owner == todo.get('useri') or (cheo and cheo.fullcontrol)
        )

        branches = Interprise.objects.filter(owner=duka.owner,Interprise=True).exclude(id=duka.id).order_by('name') if duka.owner else Interprise.objects.none()
        branch_permission_options = []
        for branch in branches:
            branch_perm = None
            if linked_user is not None:
                branch_perm = InterprisePermissions.objects.filter(
                    Interprise=branch,
                    user=linked_user,
                    # fanyakazi=worker,
                ).first()
            branch_permission_options.append({
                'enterprise': branch,
                'perm': branch_perm,
                'is_added': branch_perm is not None,
                'is_allowed': bool(branch_perm and branch_perm.Allow) if branch_perm else False,
                'is_waiter': bool(branch_perm and branch_perm.waiter_counter) if branch_perm else False,
            })
        
        todo.update({
            'worker': worker,
            'attach': attachments,
            'theUser': has_user,
            'deliver': is_delivery_agent,
            'perm': perm,
            'viewer_can_manage': viewer_can_manage,
            'staff_page': 'all',
            'branch_permission_options': branch_permission_options,
            'linked_user': linked_user,
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
        # Waiters: users with waiter_counter=True for this enterprise
        waiter_perms = InterprisePermissions.objects.filter(
            Interprise=duka.id,
            owner=False,
            waiter_counter=True,
        ).select_related('user__user', 'fanyakazi').order_by('cheo')

        current_waiter_user_ids = set(waiter_perms.values_list('user_id', flat=True))

        branch_perms = InterprisePermissions.objects.filter(
            Interprise__owner=duka.owner,
            owner=False,
        ).select_related('user__user', 'fanyakazi', 'Interprise').order_by('user_id')

        candidate_by_user = {}
        for perm in branch_perms:
            uid = perm.user_id
            if uid not in candidate_by_user:
                full_name = ''
                if perm.user and getattr(perm.user, 'user', None):
                    full_name = (perm.user.user.get_full_name() or perm.user.user.username).strip()
                if not full_name and perm.fanyakazi:
                    full_name = perm.fanyakazi.jina
                candidate_by_user[uid] = {
                    'user_id': uid,
                    'display_name': full_name or 'Unknown',
                    'job_title': perm.cheo or '',
                    'branch_names': set(),
                    'branch_ids': set(),
                    'is_waiter_anywhere': False,
                    'is_current_waiter': uid in current_waiter_user_ids,
                }
            candidate_by_user[uid]['branch_names'].add(str(perm.Interprise.name or ''))
            candidate_by_user[uid]['branch_ids'].add(str(perm.Interprise.id))
            if perm.waiter_counter:
                candidate_by_user[uid]['is_waiter_anywhere'] = True

        candidate_workers = [
            {
                'user_id': entry['user_id'],
                'display_name': entry['display_name'],
                'job_title': entry['job_title'],
                'branch_names': sorted(entry['branch_names']),
                'branch_ids': sorted(entry['branch_ids']),
                'is_waiter_anywhere': entry['is_waiter_anywhere'],
            }
            for entry in candidate_by_user.values()
            if not entry['is_current_waiter']
        ]

        branch_options = Interprise.objects.filter(owner=duka.owner,Interprise=True).order_by('name')

        todo.update({
            'waiter_perms': waiter_perms,
            'candidate_workers': candidate_workers,
            'branch_options': branch_options,
            'staff_page': 'waiters',
        })
        return render(request, 'staff/waiters.html', todo)
    except Exception:
        traceback.print_exc()
        return render(request, 'errorpage.html', todoFunct(request))


@login_required(login_url='login')
@csrf_exempt
def save_waiters(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'msg': 'Invalid method'}, status=405)

    try:
        todo = todoFunct(request)
        duka = todo['duka']
        allowed, perm_response = _check_admin_or_msaidizi(todo)
        if not allowed:
            return perm_response

        payload = json.loads(request.body or '{}')
        user_ids = payload.get('user_ids', []) or []
        selected_user_ids = set()
        for uid in user_ids:
            try:
                selected_user_ids.add(int(uid))
            except (TypeError, ValueError):
                continue

        current_waiters = InterprisePermissions.objects.filter(
            Interprise=duka.id,
            owner=False,
            waiter_counter=True,
        )
        if current_waiters.exists():
            current_waiters.exclude(user_id__in=selected_user_ids).update(waiter_counter=False)

        if selected_user_ids:
            linked_users = {
                u.id: u
                for u in UserExtend.objects.filter(pk__in=selected_user_ids)
            }

            source_perms = InterprisePermissions.objects.filter(
                user_id__in=selected_user_ids,
                Interprise__owner=duka.owner,
            ).select_related('fanyakazi', 'user')
            source_workers = {}
            for perm in source_perms:
                if perm.user_id not in source_workers and perm.fanyakazi:
                    source_workers[perm.user_id] = perm.fanyakazi

            for user_id in selected_user_ids:
                linked_user = linked_users.get(user_id)
                if not linked_user:
                    continue

                current_worker = Workers.objects.filter(
                    Interprise=duka,
                    diactive__where__owner=linked_user,
                ).first()
                source_worker = current_worker or source_workers.get(user_id)
                if not current_worker and source_worker:
                    current_worker = Workers.objects.create(
                        Interprise=duka,
                        jina=source_worker.jina,
                        address=source_worker.address,
                        code=source_worker.code,
                        simu1=source_worker.simu1,
                        simu2=source_worker.simu2,
                        kazi=source_worker.kazi,
                        tin=source_worker.tin or '',
                        active=source_worker.active,
                        diactive=source_worker.diactive,
                        picha=source_worker.picha,
                    )

                perm = InterprisePermissions.objects.filter(
                    Interprise=duka,
                    user=linked_user,
                ).first()
                if perm:
                    perm.Allow = True
                    perm.waiter_counter = True
                    if current_worker:
                        perm.fanyakazi = current_worker
                    perm.save(update_fields=['Allow', 'waiter_counter', 'fanyakazi'])
                else:
                    _ensure_interprise_permission(
                        current_worker or source_worker,
                        duka,
                        linked_user,
                        allow_state=True,
                        waiter_state=True,
                        role='waiter',
                        admin_user=request.user,
                        added=True,
                    )

        return JsonResponse({
            'success': True,
            'msg_swa': 'Wahudumu wamehifadhiwa kwa mafanikio.',
            'msg_eng': 'Waiters saved successfully.',
        })
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)


@login_required(login_url='login')
def staff_shifts(request):
    try:
        todo = todoFunct(request)
        ok, resp = _shift_enabled_or_redirect(todo)
        if not ok:
            return resp

        duka = todo['duka']
        shifts_qs = ShiftSession.objects.filter(Interprise=duka.id).order_by('-created_at')
        has_open_shift = shifts_qs.filter(status='open').exists()

        search_q = (request.GET.get('q') or '').strip()
        if search_q:
            shifts_qs = shifts_qs.filter(
                Q(code__icontains=search_q)
                | Q(shift_type__icontains=search_q)
                | Q(status__icontains=search_q)
            )

        paginator = Paginator(shifts_qs, 15)
        page_num = request.GET.get('page', 1)
        try:
            page_obj = paginator.page(page_num)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        todo.update({
            'staff_page': 'shifts',
            'shifts': page_obj,
            'page_obj': page_obj,
            'paginator': paginator,
            'search_q': search_q,
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
        report = build_shift_report(duka, shift)
        assignments = report['assignments']
        activities = report['activities']
        shift_team_rows = report['shift_team_rows']

        todo.update({
            'staff_page': 'shifts',
            'shift': shift,
            'assignments': assignments,
            'shift_team_rows': shift_team_rows,
            'activities': activities,
            'movement': report['movement'],
            'payments': report['payments'],
            'cash_accounts': report['cash_accounts'],
            'mobile_payments': report['mobile_payments'],
            'mobile_payments_total': report['mobile_payments_total'],
            'stock_value_rows': report['stock_value_rows'],
            'stock_value_totals': report['stock_value_totals'],
            'sales_breakdown_rows': report['sales_breakdown_rows'],
            'sales_breakdown_totals': report['sales_breakdown_totals'],
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
            return JsonResponse({'success': False, 'msg': 'Invalid business context'}, status=403)

        duka = todo['duka']
        cheo = todo['cheo']
        sid = int(request.POST.get('sid', 0))
        actual = Decimal(request.POST.get('actual_closing_cash', '0') or '0')

        shift = ShiftSession.objects.get(pk=sid, Interprise=duka.id)
        if shift.status == 'closed':
            return JsonResponse({'success': False, 'msg': 'Shift already closed'})

        is_assigned = ShiftAssignment.objects.filter(shift=shift, staff=cheo, active=True).exists()
        if not (cheo.owner or (is_assigned and cheo.close_own_shift)):
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

        closing_state = _save_opening_snapshot(duka, cheo, desc=f'Closing snapshot {shift.code}')
        ShiftActivity.objects.create(
            shift=shift,
            event_type='CLOSING_SNAPSHOT',
            event_ref_id=closing_state.id,
            details='Closing stock snapshot',
            by=cheo,
        )

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
        paper = str(request.GET.get('paper', 'large') or 'large').strip().lower()
        from mauzo.receipt_format import shift_paper_class
        paper_size = shift_paper_class(paper)
        include_items = str(items or '1').strip().lower() not in ('0', 'false', 'no', 'off', '')

        if not sid:
            return JsonResponse({'success': False, 'msg': 'Invalid shift ID'}, status=400)

        todo = todoFunct(request)
        duka = todo.get('duka')
        useri = todo.get('useri')

        if not duka or not useri:
            return JsonResponse({'success': False, 'msg': 'User context error'}, status=400)

        shift = ShiftSession.objects.get(pk=sid, Interprise=duka.id)
        report = build_shift_report(duka, shift)

        context = {
            'shift': shift,
            'shift_team_rows': report['shift_team_rows'],
            'activities': report['activities'],
            'movement': report['movement'],
            'payments': report['payments'],
            'cash_accounts': report['cash_accounts'],
            'mobile_payments': report['mobile_payments'],
            'mobile_payments_total': report['mobile_payments_total'],
            'stock_value_rows': report['stock_value_rows'],
            'stock_value_totals': report['stock_value_totals'],
            'useri': useri,
            'include_items': include_items,
            'lang': lang,
            'paper_size': paper_size,
            'sales_breakdown_rows': report['sales_breakdown_rows'],
            'sales_breakdown_totals': report['sales_breakdown_totals'],
        }

        return render(request, 'staff/print_shift.html', context)

    except ShiftSession.DoesNotExist:
        return JsonResponse({'success': False, 'msg': 'Shift not found'}, status=404)
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)


@login_required(login_url='login')
def shift_actor_sales(request):
    """View/print sold item list by a specific staff actor within a shift."""
    try:
        todo = todoFunct(request)
        ok, resp = _shift_enabled_or_redirect(todo)
        if not ok:
            return resp

        sid = int(request.GET.get('sid', 0) or 0)
        actor_id = int(request.GET.get('actor', 0) or 0)
        should_print = str(request.GET.get('print', '0')).strip().lower() in ('1', 'true', 'yes', 'on')
        paper = str(request.GET.get('paper', 'large') or 'large').strip().lower()
        from mauzo.receipt_format import shift_paper_class
        paper_size = shift_paper_class(paper)

        duka = todo.get('duka')
        if not duka or sid <= 0 or actor_id < 0:
            return JsonResponse({'success': False, 'msg': 'Invalid parameters'}, status=400)

        shift = ShiftSession.objects.get(pk=sid, Interprise=duka.id)
        period_end = shift.ends_at or timezone.now()

        all_staff = actor_id == 0
        actor = None
        actor_name = ''
        actor_code = ''
        if not all_staff:
            actor = InterprisePermissions.objects.filter(pk=actor_id, Interprise=duka.id).select_related(
                'user__user', 'fanyakazi', 'user_entp__Interprise'
            ).first()
            if not actor:
                return JsonResponse({'success': False, 'msg': 'Staff actor not found'}, status=404)

            first_name = (actor.user.user.first_name or '').strip() if actor.user and actor.user.user else ''
            last_name = (actor.user.user.last_name or '').strip() if actor.user and actor.user.user else ''
            actor_name = (f"{first_name} {last_name}").strip()
            if not actor_name:
                actor_name = (
                    actor.user.user.get_full_name().strip()
                    if actor.user and actor.user.user and actor.user.user.get_full_name()
                    else ''
                )
            if not actor_name and actor.fanyakazi:
                actor_name = (actor.fanyakazi.jina or '').strip()
            if not actor_name:
                actor_name = 'Unknown'

            if actor.user_entp and actor.user_entp.Interprise:
                actor_code = (actor.user_entp.Interprise.Intp_code or '').strip()
        else:
            actor_name = 'Wafanyakazi wote' if todo.get('useri') and getattr(todo.get('useri'), 'langSet', 1) == 0 else 'All staff'

        actor_sales = completed_sales_qs(duka, shift.starts_at, period_end)
        if not all_staff:
            actor_sales = actor_sales.filter(
                Q(waiter_order_id=actor_id) |
                (Q(waiter_order__isnull=True) & Q(By_id=actor_id))
            )

        item_buckets = {}
        sold_lines = mauzoList.objects.filter(
            mauzo_id__in=actor_sales.values_list('id', flat=True)
        ).select_related('produ__bidhaa')

        for line in sold_lines:
            net_qty = Decimal(line.idadi or 0) - Decimal(line.returned or 0) - Decimal(line.serviceReturn or 0)
            if net_qty <= 0:
                continue

            bidhaa_obj = line.produ.bidhaa if line.produ and line.produ.bidhaa else None
            bidhaa_id = bidhaa_obj.id if bidhaa_obj else (line.produ_id or 0)
            item_name = bidhaa_obj.bidhaa_jina if bidhaa_obj else f"Item #{line.produ_id}"
            item_units = bidhaa_obj.vipimo if bidhaa_obj else '-'
            key = (bidhaa_id, item_name, item_units)

            if key not in item_buckets:
                item_buckets[key] = {
                    'item_name': item_name,
                    'units': item_units,
                    'qty': Decimal('0'),
                    'amount': Decimal('0'),
                }

            amount = net_qty * Decimal(line.bei or 0)
            item_buckets[key]['qty'] += net_qty
            item_buckets[key]['amount'] += amount

        item_rows = sorted(item_buckets.values(), key=lambda x: (x['item_name'] or '').lower())
        totals = {
            'qty': sum((row['qty'] for row in item_rows), Decimal('0')),
            'amount': sum((row['amount'] for row in item_rows), Decimal('0')),
            'sales_count': actor_sales.count(),
        }

        todo.update({
            'shift': shift,
            'actor_name': actor_name,
            'actor_code': actor_code,
            'actor_id': actor_id,
            'all_staff': all_staff,
            'item_rows': item_rows,
            'totals': totals,
            'should_print': should_print,
            'paper_size': paper_size,
        })
        return render(request, 'staff/shift_actor_sales.html', todo)

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
        branch_permissions_json = request.POST.get('branch_permissions', '{}')

        worker = Workers.objects.filter(pk=worker_id, Interprise__owner=duka.owner.id).first()
        if not worker:
            return JsonResponse({'success': False, 'msg': 'Worker not found'}, status=404)

        linked_user = _get_linked_user_for_worker(worker)
        if not linked_user:
            return JsonResponse({
                'success': False,
                'msg_swa': 'Ongeza mtumiaji kwanza kabla ya kuweka ruhusa hizi.',
                'msg_eng': 'Add user first before assigning these permissions.',
            })

        perm = InterprisePermissions.objects.filter(
            Interprise=duka.id,
            fanyakazi=worker.id,
        ).first()

        if not perm:
            perm = _ensure_interprise_permission(
                worker,
                duka,
                linked_user,
                allow_state=allow,
                waiter_state=waiter_counter,
                role='allow',
                admin_user=request.user,
                added = added
            )
        if perm is not None:
            perm.Allow = allow
            perm.waiter_counter = waiter_counter
            perm.cash_deposit_supervisor = cash_deposit_supervisor
            perm.fanyakazi = worker
            perm.save(update_fields=['Allow', 'waiter_counter', 'cash_deposit_supervisor', 'fanyakazi'])

        branch_updates = {}
        try:
            branch_updates = json.loads(branch_permissions_json or '{}') or {}
        except Exception:
            branch_updates = {}

        if isinstance(branch_updates, dict):
            allow_updates = branch_updates.get('allow', {}) or {}
            waiter_updates = branch_updates.get('waiter', {}) or {}

            for branch_id, payload in allow_updates.items():
                try:
                    branch = Interprise.objects.filter(pk=int(branch_id), owner=duka.owner).first()
                except (TypeError, ValueError):
                    continue
                if not branch:
                    continue
                added = bool(payload.get('added')) if isinstance(payload, dict) else False
                allowed = bool(payload.get('allowed')) if isinstance(payload, dict) else False
                # print(f"Processing allow update for branch id-{branch_id} name-{branch.name}: allowed={allowed}, added={added}")
                perm = _ensure_interprise_permission(
                    worker,
                    branch,
                    linked_user,
                    allow_state=allowed,
                    waiter_state=False,
                    role='allow',
                    admin_user=request.user,
                    added = added
                )

                perm.Allow = allowed
                perm.save()

            for branch_id, payload in waiter_updates.items():
                try:
                    branch = Interprise.objects.filter(pk=int(branch_id), owner=duka.owner).first()
                except (TypeError, ValueError):
                    continue
                if not branch:
                    continue
                added = bool(payload.get('added')) if isinstance(payload, dict) else False
                allowed = bool(payload.get('allowed')) if isinstance(payload, dict) else False
                perm = _ensure_interprise_permission(
                    worker,
                    branch,
                    linked_user,
                    allow_state=allowed,
                    waiter_state=allowed,
                    role='waiter',
                    admin_user=request.user,
                    added = added
                )
                perm.waiter_counter = allowed 
                perm.save()

        return JsonResponse({
            'success': True,
            'msg_swa': 'Ruhusa zimehifadhiwa kikamilifu.',
            'msg_eng': 'Permissions updated successfully.',
        })
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)


@login_required(login_url='login')
@csrf_exempt
def disable_waiter(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'msg': 'Invalid method'}, status=405)

    try:
        todo = todoFunct(request)
        duka = todo['duka']
        allowed, perm_response = _check_admin_or_msaidizi(todo)
        if not allowed:
            return perm_response

        data = json.loads(request.body)
        perm_id = int(data.get('perm_id', 0))

        perm = InterprisePermissions.objects.filter(
            pk=perm_id,
            Interprise=duka.id,
            waiter_counter=True,
        ).first()
        if not perm:
            return JsonResponse({
                'success': False,
                'msg_swa': 'Mhudumu huyo hayupo au tayari amezimwa.',
                'msg_eng': 'Waiter not found or already disabled.',
            }, status=404)

        perm.waiter_counter = False
        perm.save(update_fields=['waiter_counter'])

        return JsonResponse({
            'success': True,
            'msg_swa': 'Mhudumu ameondolewa kwa mafanikio.',
            'msg_eng': 'Waiter disabled successfully.',
        })
    except Exception as e:
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'msg': str(e)}, status=500)

