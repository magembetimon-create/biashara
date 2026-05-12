from django.shortcuts import render


from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from management.models import UserExtend,Kanda,Interprise,manunuzi,HudumaNyingine,InterprisePermissions,PaymentAkaunts,toaCash,wekaCash,mauzoni,rekodiMatumizi,ShiftSession,ShiftAssignment,ShiftActivity
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F
from django.db import transaction
from django.core import serializers
from django.db.models import Q
# from datetime import datetime
from django.utils import timezone
timezone.now()

# from datetime import datetime
from datetime import date,timedelta, timezone

import time  
import pytz
import datetime
import re
from decimal import Decimal
from django.db.models import Sum
from django.forms.models import model_to_dict
# Create your views here.

from accaunts.todos import Todos
# Create your views here.

def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()


def _sum_cash_accounts(duka):
    total = PaymentAkaunts.objects.filter(Interprise=duka, aina__iexact='Cash').aggregate(Sum('Amount'))['Amount__sum']
    return total if total is not None else Decimal('0')


def _active_shift(duka):
    return ShiftSession.objects.filter(Interprise=duka, status='open').order_by('-id').first()


def _shift_feature_enabled(duka):
    return bool(getattr(duka, 'shift_management_enabled', False))


def _shift_role_allowed(shift, cheo, role='recorder'):
    if not shift or not cheo:
        return False
    if cheo.owner or shift.opened_by_id == cheo.id:
        return True
    return ShiftAssignment.objects.filter(shift=shift, staff=cheo, active=True).filter(
        Q(role=role) | Q(role='all')
    ).exists()


def _record_shift_activity(duka, cheo, event_type, amount, event_ref_id=None, details=''):
    if not _shift_feature_enabled(duka):
        return
    shift = _active_shift(duka)
    if not shift:
        return
    try:
        ShiftActivity.objects.create(
            shift=shift,
            event_type=event_type,
            amount=Decimal(str(amount if amount is not None else 0)),
            event_ref_id=event_ref_id,
            details=details,
            by=cheo,
        )
    except:
        # Shift logging should never block the core transaction flow.
        pass


def _parse_shift_time(raw_value, default_value):
    if not raw_value:
        return default_value
    try:
        dt = datetime.datetime.fromisoformat(str(raw_value).replace('Z', '+00:00'))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except:
        return default_value


@login_required(login_url='login')
def addAkaunt(request):
    try:
        if request.method == "POST":
            name=request.POST.get('name')
            amount= request.POST.get('amount')
            allow= int(request.POST.get('allow',0))
            aina= request.POST.get('aina')
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka= cheo.Interprise


            
            if PaymentAkaunts.objects.filter(Akaunt_name=name ,Interprise__owner=duka.owner.id).exists():
                data={
                    'success':False,
                    'message_swa':'Taarifa kuhusu akaunti hazijafanikiwa kutokana na kuwepo akaunti nyingine yenye jina kama hili tafadhari badili jina la akaunti',
                    'message_eng':'The same account name appear, Payment account info was not recorded. Please change the account name'
                }

                return JsonResponse(data)
            else:
                ak = PaymentAkaunts() 
                ak.Interprise = duka
                ak.Akaunt_name = name
                ak.Amount = float(amount)
                ak.onesha = allow
                ak.aina = aina
                ak.addedDate = datetime.datetime.now(tz=timezone.utc)

                ak.save()

                data={
                    'success':True,
                    'message_swa':'Taarifa kuhusu Akaunti ya malipo zimefanikiwa kurekodiwa kikamilifu',
                    'message_eng':'Payment account info added successfully'
                }

                return JsonResponse(data) 
        else:
          return render(request,'pagenotFound.html',todoFunct(request))     
    except:
        data={
            'success':False,
            'message_swa':'Akaunti ya malipo haijatengenezwa kutokana na hitilafu. Tafadhari jaribu tena kwa kujaza taarifa kwa usahihi',
            'message_eng':'Payment account info was not added. Please try again'
        }

        return JsonResponse(data)

@login_required(login_url='login')
def kuwekapesa(request):
     if request.method == "POST":
        
         try:
            ac=request.POST.get('ac')
            idn= request.POST.get('valued')
            hdm =request.POST.get('sel')
            hd = int(request.POST.get('hd'))
            eleza= request.POST.get('Maelezo')
            fromi= request.POST.get('kutoka')
            amounti= int(request.POST.get('kiasi'))
            acid= int(request.POST.get('is'))
            todo = todoFunct(request)
            useri = todo['useri']
            cheo = todo['cheo']

            if ((useri == todo['duka'].owner) or (cheo.miamala_Rekodi and not cheo.viewi)) and not cheo.user.company :  
                #  kuapdate inapoenda
                entp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
                wekakwa= PaymentAkaunts.objects.get(pk=acid,Interprise__owner=entp.owner.id)
                beforweka=wekakwa.Amount

                PaymentAkaunts.objects.filter(pk=acid,Interprise__owner=entp.owner.id).update(Amount=F('Amount')+amounti)

                wekapesa = wekaCash()
                wekapesa.Akaunt = wekakwa
                wekapesa.Amount = amounti
                wekapesa.before = beforweka
                wekapesa.After = beforweka+amounti
                wekapesa.kutoka = fromi
                wekapesa.maelezo = eleza
                if hd:
                    wekapesa.huduma_nyingine = HudumaNyingine.objects.get(pk=hdm,Interprise=entp.id)    

                wekapesa.tarehe = datetime.datetime.now(tz=timezone.utc)
                wekapesa.by=todoFunct(request)['cheo']
                wekapesa.Interprise=wekakwa.Interprise

                if not wekakwa.onesha:
                    wekapesa.usiri =True
                wekapesa.save()

                _record_shift_activity(
                    duka=wekakwa.Interprise,
                    cheo=todo['cheo'],
                    event_type='cash_deposit',
                    amount=amounti,
                    event_ref_id=wekapesa.id,
                    details=f"deposit from {fromi}"
                )
    
                data={
                    'success':True,
                    'message_swa':'Muamala wa kuweka fedha umefanikiwa',
                    'message_eng':'Cash deposit transaction recorded succeffully'
                }
            else:
                data = {
                    'success':False,
                    'message_swa':'Hauna ruhusa kwa kitendo hiki kwa sasa tafadhari wasiliana na uongozi',
                    'message_eng':'You have no permission for this action please contact your admin'

                }
            return JsonResponse(data) 
         except:
            data={
                'success':False,
                'message_swa':'Muamala wa kuweka fedha Haukufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
                'message_eng':'Cash deposit transaction was not recorded. please try again'
            }

            return JsonResponse(data) 
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

# kutoa pesa
@login_required(login_url='login')
def kutoaPesa(request):
    if request.method == "POST":    
        try:
            ac=int(request.POST.get('ac',0))
            idn= request.POST.get('value')
            eleza= request.POST.get('Maelezo')
            fromi= request.POST.get('kutoka')
            amounti= int(request.POST.get('kiasi'))
            baki= int(request.POST.get('baki'))
            acid= int(request.POST.get('is'))
            todo = todoFunct(request)
            cheo = todo['cheo']
            
            
            #  kuapdate inapoenda
            if ((cheo.user == todo['duka'].owner) or (cheo.miamala_Rekodi and not cheo.viewi)) and not cheo.user.company : 
                entp=cheo.Interprise
                toakwa= PaymentAkaunts.objects.get(pk=acid,Interprise__owner=entp.owner.id)
                beforweka=toakwa.Amount
                akaunti = toakwa # Initialize the other destination account ...............//
                if ac:
                    akaunti=PaymentAkaunts.objects.get(pk=idn,Interprise__owner=entp.owner.id)

                # PaymentAkaunts.objects.filter(pk=acid,Interprise__owner=entp.owner.id).update(Amount=baki)

                toa = toaCash()
                toa.Akaunt = toakwa
                toa.Amount = amounti
                toa.before = beforweka
                toa.After = baki
                if ac:
                    toa.kwenda = akaunti.Akaunt_name
                    if not akaunti.onesha:
                        toa.kwenda_siri = True
                else:
                    toa.kwenda = "Personal"
                if not toakwa.onesha:
                    toa.usiri =True       
                toa.maelezo = eleza
                toa.makato = beforweka-(baki+amounti)
                toa.tarehe = datetime.datetime.now(tz=timezone.utc)
                toa.by=todoFunct(request)['cheo']
                toa.Interprise=toakwa.Interprise
                toa.kuhamisha = ac  
                toa.personal = not ac  
                toa.kuhamishaNje =  akaunti.Interprise is not toakwa.Interprise
                toa.save()

                _record_shift_activity(
                    duka=toakwa.Interprise,
                    cheo=todo['cheo'],
                    event_type='cash_withdraw',
                    amount=amounti,
                    event_ref_id=toa.id,
                    details=f"withdraw to {toa.kwenda}"
                )

                toakwa.Amount = float(baki)
                toakwa.save()

                # kuapdate inapotoka
                if ac:
                    before=akaunti.Amount
                    PaymentAkaunts.objects.filter(pk=idn,Interprise__owner=entp.owner.id).update(Amount=F('Amount')+amounti)

                    #  akaunti.kiasi=akaunti.Amount-amounti
                    #  akaunti.save()

                    Change=wekaCash()
                    Change.Akaunt=akaunti
                    Change.Amount = amounti
                    Change.before=before
                    Change.After=before + amounti
                    Change.kutoka= PaymentAkaunts.objects.get(pk=acid, Interprise__owner=entp.owner.id).Akaunt_name
                    Change.maelezo = eleza
                    Change.tarehe = datetime.datetime.now(tz=timezone.utc)
                    Change.by=todoFunct(request)['cheo']
                    Change.Interprise=akaunti.Interprise
                    Change.kuhamisha = ac
                    Change.kuhamishaNje =  akaunti.Interprise is not toakwa.Interprise
                    if not PaymentAkaunts.objects.get(pk=idn, Interprise__owner=entp.owner.id).onesha:
                        Change.usiri = True
                    if not toakwa.onesha:
                        Change.kutoka_siri = True    
                    Change.save()

                data={
                    'success':True,
                    'message_swa':'Taarifa za Muamala wa kuhamisha pesa zimefanikiwa kurekodiwa kikamilifu',
                    'message_eng':'Cash withdraw transaction recorded successfully'

                }

            
                return JsonResponse(data) 
            else:
                data = {
                     'success':False,
                    'message_swa':'Huna Ruhusa ya Kufanya Kitendo hiki kwa sasa tafadhari wasiliana na uongozi',
                    'message_eng':'You have no permission for this action please contact admin'
  
                }
                return JsonResponse(data)
        except:
            data={
                'success':False,
                'message_swa':'Taarifa za Muamala wa kuhamisha pesa hazijafanikiwa kurekodiwa kutokana na hitilafu. Tafadhari jaribu tena kwa usahihi',
                'message_eng':'Cash withdraw transaction was not recorded. Please try again'
            }
        return JsonResponse(data)
    else:
           return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def cashDepositFromCash(request):
    if request.method == "POST":
        try:
            cash_account_id = int(request.POST.get('cash_account', 0))
            amount_raw = (request.POST.get('amount') or '').strip()
            deposit_to = (request.POST.get('deposit_to') or '').strip().lower()
            supervisor_id = int(request.POST.get('supervisor_id', 0))
            target_account_id = int(request.POST.get('target_account_id', 0))
            maelezo = (request.POST.get('maelezo') or '').strip()

            todo = todoFunct(request)
            useri = todo['useri']
            cheo = todo['cheo']
            duka = cheo.Interprise

            if not (((useri == todo['duka'].owner) or (cheo.cash_deposit_record and not cheo.viewi)) and not cheo.user.company):
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Hauna ruhusa kwa kitendo hiki kwa sasa tafadhari wasiliana na uongozi',
                    'message_eng': 'You have no permission for this action please contact your admin'
                })

            source_account = PaymentAkaunts.objects.get(
                pk=cash_account_id,
                Interprise=duka,
                aina__iexact='Cash'
            )

            source_amount = float(source_account.Amount)
            amounti = source_amount if amount_raw == '' else float(amount_raw)

            if amounti <= 0:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Kiasi hakikubaliki, tafadhari weka kiasi sahihi',
                    'message_eng': 'Invalid amount, please provide a valid amount'
                })

            if amounti > source_amount:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Kiasi ulichoingiza kimezidi kiasi kilichopo kwenye cash account',
                    'message_eng': 'The amount exceeds available cash account balance'
                })

            destination_account = None
            kwenda = ''
            supervisor = None

            if deposit_to == 'supervisor':
                supervisor = InterprisePermissions.objects.get(pk=supervisor_id, Interprise__owner=duka.owner.id)
                if not (supervisor.cash_deposit_supervisor or supervisor.owner):
                    return JsonResponse({
                        'success': False,
                        'message_swa': 'Mhusika aliyechaguliwa si msimamizi wa kupokea deposit',
                        'message_eng': 'Selected user is not allowed to receive supervisor deposits'
                    })

                destination_account = PaymentAkaunts.objects.filter(
                    Interprise__owner=duka.owner.id,
                    supervisor_account=True
                ).first()

                if not destination_account:
                    destination_account = PaymentAkaunts.objects.create(
                        Interprise=duka,
                        Akaunt_name='supervisor',
                        Amount=0,
                        onesha=True,
                        addedDate=datetime.datetime.now(tz=timezone.utc),
                        aina='supervisor',
                        supervisor_account=True
                    )

                kwenda = f"Supervisor - {supervisor.user.user.first_name} {supervisor.user.user.last_name}".strip()

            elif deposit_to == 'account':
                destination_account = PaymentAkaunts.objects.get(pk=target_account_id, Interprise__owner=duka.owner.id)
                if str(destination_account.aina).strip().lower() == 'cash':
                    return JsonResponse({
                        'success': False,
                        'message_swa': 'Akaunti ya kupelekewa hairuhusiwi kuwa aina ya Cash',
                        'message_eng': 'Destination account cannot be of type Cash'
                    })
                if destination_account.supervisor_account:
                    return JsonResponse({
                        'success': False,
                        'message_swa': 'Akaunti ya supervisor hairuhusiwi kwenye chaguo la payment account',
                        'message_eng': 'Supervisor account is not allowed in payment account destination'
                    })
                kwenda = destination_account.Akaunt_name
            else:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Tafadhari chagua aina ya destination sahihi',
                    'message_eng': 'Please select a valid destination type'
                })

            if destination_account.id == source_account.id:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Akaunti ya kutoa na kupokea haiwezi kuwa moja',
                    'message_eng': 'Source and destination accounts cannot be the same'
                })

            now_dt = datetime.datetime.now(tz=timezone.utc)

            with transaction.atomic():
                source_account = PaymentAkaunts.objects.select_for_update().get(pk=source_account.id)
                destination_account = PaymentAkaunts.objects.select_for_update().get(pk=destination_account.id)

                if float(source_account.Amount) < amounti:
                    return JsonResponse({
                        'success': False,
                        'message_swa': 'Kiasi kilichopo kwenye cash account hakitoshi kwa muamala huu',
                        'message_eng': 'Insufficient funds on cash account for this transaction'
                    })

                before_from = float(source_account.Amount)
                before_to = float(destination_account.Amount)

                source_account.Amount = before_from - amounti
                source_account.save(update_fields=['Amount'])

                destination_account.Amount = before_to + amounti
                destination_account.save(update_fields=['Amount'])

                toa = toaCash()
                toa.Interprise = duka
                toa.tarehe = now_dt
                toa.Akaunt = source_account
                toa.Amount = amounti
                toa.before = before_from
                toa.After = before_from - amounti
                toa.kwenda = kwenda
                toa.maelezo = maelezo
                toa.makato = 0
                toa.by = cheo
                toa.kuhamisha = True
                toa.personal = False
               
                toa.kuhamishaNje = False
                if supervisor is not None:
                    toa.supervisor_deposit = supervisor
                if not source_account.onesha:
                    toa.usiri = True
                if not destination_account.onesha:
                    toa.kwenda_siri = True
                toa.save()

                incoming = wekaCash()
                incoming.Interprise = duka
                incoming.tarehe = now_dt
                incoming.Akaunt = destination_account
                incoming.Amount = amounti
                incoming.before = before_to
                incoming.After = before_to + amounti
                incoming.kutoka = source_account.Akaunt_name
                incoming.maelezo = maelezo
                incoming.by = cheo
                incoming.kuhamisha = True

                incoming.kuhamishaNje = False
                if not destination_account.onesha:
                    incoming.usiri = True
                if not source_account.onesha:
                    incoming.kutoka_siri = True
                incoming.save()

                toa.deposit_to = incoming
                toa.save(update_fields=['deposit_to'])


                _record_shift_activity(
                    duka=duka,
                    cheo=cheo,
                    event_type='cash_transfer_deposit',
                    amount=amounti,
                    event_ref_id=incoming.id,
                    details=f"source cash account {source_account.id}"
                )

            return JsonResponse({
                'success': True,
                'message_swa': 'Muamala wa cash deposit umefanikiwa kurekodiwa',
                'message_eng': 'Cash deposit transaction recorded successfully'
            })
        except:
            return JsonResponse({
                'success': False,
                'message_swa': 'Muamala wa cash deposit haujafanikiwa, tafadhari jaribu tena',
                'message_eng': 'Cash deposit transaction was not recorded, please try again'
            })
    else:
        return render(request, 'pagenotFound.html', todoFunct(request))


@login_required(login_url='login')
def openShift(request):
    if request.method == "POST":
        try:
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka = cheo.Interprise

            if not _shift_feature_enabled(duka):
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Kipengele cha zamu kimezimwa na admin',
                    'message_eng': 'Shift management is disabled by admin'
                })

            if not ((cheo.owner or (cheo.miamala_Rekodi and not cheo.viewi)) and not cheo.user.company):
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Hauna ruhusa ya kufungua zamu',
                    'message_eng': 'You are not allowed to open shift'
                })

            active = _active_shift(duka)
            if active:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Kuna zamu inayoendelea tayari, ifunge kwanza',
                    'message_eng': 'There is an active shift already, close it first',
                    'shift_id': active.id,
                    'shift_code': active.code,
                })

            shift_type = (request.POST.get('shift_type') or 'daily').strip().lower()
            if shift_type not in ['daily', 'weekly', 'monthly']:
                shift_type = 'daily'

            now_dt = datetime.datetime.now(tz=timezone.utc)
            starts_at = _parse_shift_time(request.POST.get('starts_at'), now_dt)
            opening_cash_raw = (request.POST.get('opening_cash') or '').strip()
            notes = (request.POST.get('notes') or '').strip()
            opening_cash = _sum_cash_accounts(duka) if opening_cash_raw == '' else Decimal(str(opening_cash_raw))

            code = f"SHF-{duka.id}-{now_dt.strftime('%Y%m%d%H%M%S')}"

            shift = ShiftSession.objects.create(
                Interprise=duka,
                code=code,
                shift_type=shift_type,
                status='open',
                starts_at=starts_at,
                opening_cash=opening_cash,
                notes=notes,
                opened_by=cheo,
            )

            ShiftAssignment.objects.get_or_create(
                shift=shift,
                staff=cheo,
                role='all',
                defaults={'active': True, 'assigned_by': cheo}
            )

            return JsonResponse({
                'success': True,
                'message_swa': 'Zamu imefunguliwa kikamilifu',
                'message_eng': 'Shift opened successfully',
                'shift': {
                    'id': shift.id,
                    'code': shift.code,
                    'status': shift.status,
                    'shift_type': shift.shift_type,
                    'starts_at': shift.starts_at,
                    'opening_cash': float(shift.opening_cash),
                }
            })
        except:
            return JsonResponse({
                'success': False,
                'message_swa': 'Zamu haikufunguka kutokana na hitilafu, tafadhari jaribu tena',
                'message_eng': 'Shift was not opened due to an error, please try again'
            })
    else:
        return render(request, 'pagenotFound.html', todoFunct(request))


@login_required(login_url='login')
def assignShiftMember(request):
    if request.method == "POST":
        try:
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka = cheo.Interprise

            if not _shift_feature_enabled(duka):
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Kipengele cha zamu kimezimwa na admin',
                    'message_eng': 'Shift management is disabled by admin'
                })

            if not cheo.owner:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Ni mmiliki tu anaweza kupanga wanaoshiriki zamu',
                    'message_eng': 'Only owner can assign shift members'
                })

            shift_id = int(request.POST.get('shift_id', 0))
            staff_id = int(request.POST.get('staff_id', 0))
            role = (request.POST.get('role') or 'recorder').strip().lower()
            if role == '':
                role = 'recorder'

            shift = ShiftSession.objects.get(pk=shift_id, Interprise=duka)
            if shift.status != 'open':
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Zamu hii imefungwa, huwezi kuongeza assignment',
                    'message_eng': 'Shift is not open for assignment'
                })

            staff = InterprisePermissions.objects.get(pk=staff_id, Interprise=duka)
            assigned, created = ShiftAssignment.objects.get_or_create(
                shift=shift,
                staff=staff,
                role=role,
                defaults={'active': True, 'assigned_by': cheo}
            )
            if not created:
                assigned.active = True
                assigned.assigned_by = cheo
                assigned.save(update_fields=['active', 'assigned_by'])

            return JsonResponse({
                'success': True,
                'message_swa': 'Assignment ya zamu imehifadhiwa',
                'message_eng': 'Shift assignment saved successfully'
            })
        except:
            return JsonResponse({
                'success': False,
                'message_swa': 'Assignment haikufanikiwa kutokana na hitilafu',
                'message_eng': 'Shift assignment failed due to an error'
            })
    else:
        return render(request, 'pagenotFound.html', todoFunct(request))


@login_required(login_url='login')
def closeShift(request):
    if request.method == "POST":
        try:
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka = cheo.Interprise

            if not _shift_feature_enabled(duka):
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Kipengele cha zamu kimezimwa na admin',
                    'message_eng': 'Shift management is disabled by admin'
                })

            shift_id = int(request.POST.get('shift_id', 0))
            notes = (request.POST.get('notes') or '').strip()

            if shift_id > 0:
                shift = ShiftSession.objects.get(pk=shift_id, Interprise=duka)
            else:
                shift = _active_shift(duka)

            if not shift:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Hakuna zamu inayoendelea kwa sasa',
                    'message_eng': 'No active shift found'
                })

            if shift.status != 'open':
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Zamu tayari imefungwa',
                    'message_eng': 'Shift is already closed'
                })

            if not (cheo.owner or shift.opened_by_id == cheo.id or _shift_role_allowed(shift, cheo, 'supervisor')):
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Hauna ruhusa ya kufunga zamu hii',
                    'message_eng': 'You are not allowed to close this shift'
                })

            close_dt = datetime.datetime.now(tz=timezone.utc)
            income = wekaCash.objects.filter(Interprise=duka, tarehe__gte=shift.starts_at, tarehe__lte=close_dt).aggregate(Sum('Amount'))['Amount__sum'] or Decimal('0')
            expenditure = toaCash.objects.filter(Interprise=duka, tarehe__gte=shift.starts_at, tarehe__lte=close_dt).aggregate(Sum('Amount'))['Amount__sum'] or Decimal('0')

            expected = Decimal(str(shift.opening_cash)) + Decimal(str(income)) - Decimal(str(expenditure))
            actual_raw = (request.POST.get('actual_closing_cash') or '').strip()
            actual = _sum_cash_accounts(duka) if actual_raw == '' else Decimal(str(actual_raw))
            variance = actual - expected

            shift.status = 'closed'
            shift.ends_at = close_dt
            shift.closed_by = cheo
            shift.expected_closing_cash = expected
            shift.actual_closing_cash = actual
            shift.variance = variance
            shift.notes = ((shift.notes or '') + ('\n' if shift.notes and notes else '') + notes).strip()
            shift.save(update_fields=['status', 'ends_at', 'closed_by', 'expected_closing_cash', 'actual_closing_cash', 'variance', 'notes', 'updated_at'])

            return JsonResponse({
                'success': True,
                'message_swa': 'Zamu imefungwa kikamilifu',
                'message_eng': 'Shift closed successfully',
                'summary': {
                    'shift_id': shift.id,
                    'shift_code': shift.code,
                    'income': float(income),
                    'expenditure': float(expenditure),
                    'opening_cash': float(shift.opening_cash),
                    'expected_closing_cash': float(expected),
                    'actual_closing_cash': float(actual),
                    'variance': float(variance),
                }
            })
        except:
            return JsonResponse({
                'success': False,
                'message_swa': 'Kufunga zamu hakukufanikiwa kutokana na hitilafu',
                'message_eng': 'Failed to close shift due to an error'
            })
    else:
        return render(request, 'pagenotFound.html', todoFunct(request))


@login_required(login_url='login')
def verifyShift(request):
    if request.method == "POST":
        try:
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka = cheo.Interprise

            if not _shift_feature_enabled(duka):
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Kipengele cha zamu kimezimwa na admin',
                    'message_eng': 'Shift management is disabled by admin'
                })

            if not cheo.owner:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Ni mmiliki tu anaweza kuhakiki zamu',
                    'message_eng': 'Only owner can verify shifts'
                })

            shift_id = int(request.POST.get('shift_id', 0))
            shift = ShiftSession.objects.get(pk=shift_id, Interprise=duka)
            if shift.status != 'closed':
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Zamu lazima iwe imefungwa kabla ya uhakiki',
                    'message_eng': 'Shift must be closed before verification'
                })

            shift.status = 'verified'
            shift.verified_by = cheo
            shift.verified_at = datetime.datetime.now(tz=timezone.utc)
            shift.locked = True
            shift.save(update_fields=['status', 'verified_by', 'verified_at', 'locked', 'updated_at'])

            return JsonResponse({
                'success': True,
                'message_swa': 'Uhakiki wa zamu umefanikiwa',
                'message_eng': 'Shift verified successfully'
            })
        except:
            return JsonResponse({
                'success': False,
                'message_swa': 'Uhakiki wa zamu haukufanikiwa',
                'message_eng': 'Shift verification failed'
            })
    else:
        return render(request, 'pagenotFound.html', todoFunct(request))


@login_required(login_url='login')
def shiftReportData(request):
    if request.method == 'POST':
        try:
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka = cheo.Interprise

            tf = _parse_shift_time(request.POST.get('tf'), datetime.datetime.now(tz=timezone.utc) - timedelta(days=30))
            tt = _parse_shift_time(request.POST.get('tt'), datetime.datetime.now(tz=timezone.utc))
            branch_filter = int(request.POST.get('branch', duka.id))

            branches = [duka.id]
            for b in todo['matawi']:
                branches.append(b.Interprise.id)

            if branch_filter > 0:
                branches = [branch_filter]

            shifts = ShiftSession.objects.filter(
                Interprise__in=branches,
                starts_at__gte=tf,
                starts_at__lte=tt
            ).select_related('opened_by__user__user', 'closed_by__user__user', 'Interprise').order_by('-starts_at')

            result = []
            total_sales = Decimal('0')
            total_expenses = Decimal('0')
            total_deposits = Decimal('0')
            total_variance = Decimal('0')

            for sh in shifts:
                end_dt = sh.ends_at if sh.ends_at else tt
                sales = mauzoni.objects.filter(Interprise=sh.Interprise, tarehe__gte=sh.starts_at, tarehe__lte=end_dt).aggregate(Sum('amount'))['amount__sum'] or Decimal('0')
                expenses = rekodiMatumizi.objects.filter(Interprise=sh.Interprise, tarehe__gte=sh.starts_at, tarehe__lte=end_dt).aggregate(Sum('kiasi'))['kiasi__sum'] or Decimal('0')
                deposits = wekaCash.objects.filter(Interprise=sh.Interprise, tarehe__gte=sh.starts_at, tarehe__lte=end_dt).aggregate(Sum('Amount'))['Amount__sum'] or Decimal('0')
                withdrawals = toaCash.objects.filter(Interprise=sh.Interprise, tarehe__gte=sh.starts_at, tarehe__lte=end_dt).aggregate(Sum('Amount'))['Amount__sum'] or Decimal('0')

                total_sales += Decimal(str(sales))
                total_expenses += Decimal(str(expenses))
                total_deposits += Decimal(str(deposits))
                total_variance += Decimal(str(sh.variance or 0))

                opened_by = ''
                closed_by = ''
                if sh.opened_by and sh.opened_by.user and sh.opened_by.user.user:
                    opened_by = f"{sh.opened_by.user.user.first_name} {sh.opened_by.user.user.last_name}".strip()
                if sh.closed_by and sh.closed_by.user and sh.closed_by.user.user:
                    closed_by = f"{sh.closed_by.user.user.first_name} {sh.closed_by.user.user.last_name}".strip()

                result.append({
                    'id': sh.id,
                    'code': sh.code,
                    'branch_id': sh.Interprise.id,
                    'branch_name': sh.Interprise.name,
                    'status': sh.status,
                    'shift_type': sh.shift_type,
                    'starts_at': sh.starts_at,
                    'ends_at': sh.ends_at,
                    'opened_by': opened_by,
                    'closed_by': closed_by,
                    'opening_cash': float(sh.opening_cash or 0),
                    'expected_closing_cash': float(sh.expected_closing_cash or 0),
                    'actual_closing_cash': float(sh.actual_closing_cash or 0),
                    'variance': float(sh.variance or 0),
                    'sales': float(sales),
                    'expenses': float(expenses),
                    'deposits': float(deposits),
                    'withdrawals': float(withdrawals),
                })

            return JsonResponse({
                'success': True,
                'rows': result,
                'shift_enabled': _shift_feature_enabled(duka),
                'summary': {
                    'sales': float(total_sales),
                    'expenses': float(total_expenses),
                    'deposits': float(total_deposits),
                    'variance': float(total_variance),
                    'count': len(result)
                }
            })
        except:
            return JsonResponse({
                'success': False,
                'rows': [],
                'summary': {'sales': 0, 'expenses': 0, 'deposits': 0, 'variance': 0, 'count': 0},
                'message_swa': 'Ripoti ya zamu haikupatikana kutokana na hitilafu',
                'message_eng': 'Shift report failed due to an error'
            })
    else:
        return render(request, 'pagenotFound.html', todoFunct(request))


@login_required(login_url='login')
def currentShiftData(request):
    todo = todoFunct(request)
    cheo = todo['cheo']
    duka = cheo.Interprise
    sh = _active_shift(duka)

    if not sh:
        return JsonResponse({'success': True, 'has_shift': False, 'shift_enabled': _shift_feature_enabled(duka)})

    members = ShiftAssignment.objects.filter(shift=sh, active=True).annotate(
        first_name=F('staff__user__user__first_name'),
        last_name=F('staff__user__user__last_name')
    ).values('id', 'staff', 'role', 'first_name', 'last_name')

    return JsonResponse({
        'success': True,
        'has_shift': True,
        'shift_enabled': _shift_feature_enabled(duka),
        'shift': {
            'id': sh.id,
            'code': sh.code,
            'status': sh.status,
            'shift_type': sh.shift_type,
            'starts_at': sh.starts_at,
            'opening_cash': float(sh.opening_cash),
            'notes': sh.notes or ''
        },
        'members': list(members)
    })


@login_required(login_url='login')
def setShiftManagementStatus(request):
    if request.method == "POST":
        try:
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka = cheo.Interprise

            if not cheo.owner:
                return JsonResponse({
                    'success': False,
                    'message_swa': 'Ni admin/miliki tu anaweza kubadili hii setting',
                    'message_eng': 'Only owner/admin can update this setting'
                })

            enabled_raw = str(request.POST.get('enabled', '0')).strip().lower()
            enabled = enabled_raw in ['1', 'true', 'yes', 'on']

            Interprise.objects.filter(pk=duka.id).update(shift_management_enabled=enabled)

            return JsonResponse({
                'success': True,
                'enabled': enabled,
                'message_swa': 'Mpangilio wa zamu umebadilishwa kikamilifu',
                'message_eng': 'Shift management setting updated successfully'
            })
        except:
            return JsonResponse({
                'success': False,
                'message_swa': 'Kubadili mpangilio wa zamu hakukufanikiwa',
                'message_eng': 'Failed to update shift management setting'
            })
    else:
        return render(request, 'pagenotFound.html', todoFunct(request))
    
@login_required(login_url='login')
def editAkaunt(request):
    try:
        if request.method == "POST":
            name=request.POST.get('name')
            amount= request.POST.get('amount')
            allow= int(request.POST.get('allow',0))
            aina= request.POST.get('aina')
            idn= request.POST.get('value')
            todo = todoFunct(request)
            cheo = todo['cheo']
            duka = cheo.Interprise

           

            
            if idn !='':
                
                ak = PaymentAkaunts.objects.get(pk=idn , Interprise__owner=duka.owner.id) 
                #  ak.Interprise = InterprisePermissions.objects.get(user=request.user.id, default=True).Interprise
                ak.Akaunt_name = name
                # ak.Amount = int(amount)
                ak.onesha = allow
                ak.aina = aina

                ak.save()

                data={
                    'success':True
                }

                return JsonResponse(data) 


            else: 
                data={
                    'success':False
                }

                return JsonResponse(data)
        else:
          return render(request,'pagenotFound.html',todoFunct(request))         
    except:
        data={
            'success':False
        }

@login_required(login_url='login')
def akaunts(request):  
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:
       todo['akaunt_page'] = 'accounts'
       return render(request,'akaunting.html',todo)
    
@login_required(login_url='login')
def getdata(request):
    data={}
    data =  dict()

    # akauntisum = 0
    # allAkauntisum = 0
    todo = todoFunct(request)
    duka = todo['duka']
    cheo = todo['cheo']
    if not cheo or not duka:
        return JsonResponse({'sum': None, 'allsum': None, 'list': [], 'alllist': {}, 'otherCount': 0, 'Count': 0, 'menu': False})
    br = [duka.id]
    active_shift = _active_shift(duka)



    for b in todo['matawi']:
        br.append(b.Interprise.id)
   
    if cheo.owner:
        Admin = True

    else:
        Admin= False

    akaunt = PaymentAkaunts.objects.filter(Interprise__owner = duka.owner) 

    IntpAc = akaunt.filter(Interprise = duka)  
    cash_accounts = list(IntpAc.filter(aina__iexact='Cash').values('id', 'Akaunt_name', 'Amount', 'aina', 'onesha'))
    non_cash_accounts = list(
        IntpAc.exclude(aina__iexact='Cash').exclude(supervisor_account=True).values('id', 'Akaunt_name', 'Amount', 'aina', 'onesha')
    )
    supervisors = list(
        InterprisePermissions.objects.filter(Interprise__owner=duka.owner).filter(
            Q(cash_deposit_supervisor=True) | Q(owner=True)
        ).annotate(
            first_name=F('user__user__first_name'),
            last_name=F('user__user__last_name'),
            username=F('user__user__username')
        ).values('id', 'first_name', 'last_name', 'username', 'owner', 'cash_deposit_supervisor')
    )

    payaccs_ = PaymentAkaunts.objects.filter(
            Interprise__owner=duka.owner,

        ).exclude(aina__iexact='Cash') if duka else PaymentAkaunts.objects.none()

    servCash_ = PaymentAkaunts.objects.filter(
            Interprise=duka,
            aina__iexact='Cash'
        ) if duka else PaymentAkaunts.objects.none()


    payaccs_ = payaccs_ | servCash_
    
    is_supervisor = InterprisePermissions.objects.filter(user=cheo.user,Interprise__owner=duka.owner, cash_deposit_supervisor=True).exists()
    
    if not (cheo.owner  or  cheo.akaunti) : 
        payaccs_ = payaccs_.exclude(onesha=False)    

    if not (cheo.owner or is_supervisor):
        payaccs_ = payaccs_.exclude(supervisor_account=True)
       


    if cheo.owner  or  cheo.akaunti :
        akauntisum = IntpAc.aggregate(Sum('Amount'))
        allAkauntisum = akaunt.aggregate(Sum('Amount'))
        
        akauntilistForInt = list(PaymentAkaunts.objects.filter(Interprise__in = br).annotate(duka=F('Interprise')).values().order_by("-Amount"))
        
        Allist = list(akaunt.annotate(duka=F('Interprise')).values().order_by("-Amount"))
        allistCounti = akaunt.exclude( Interprise=duka).count()

        count=IntpAc.count()
        data =  dict()



        data["sum"] = akauntisum
        data["allsum"] = allAkauntisum
        # data["list"] = akauntilistForInt
        data["alllist"] =Allist
        data["otherCount"] = allistCounti
        data["Count"] = count
        data["menu"] = Admin
        data["cash_accounts"] = cash_accounts
        data["non_cash_accounts"] = non_cash_accounts
        data["supervisors"] = supervisors
        data["shift_management_enabled"] = _shift_feature_enabled(duka)
        data["active_shift"] = {
            'id': active_shift.id,
            'code': active_shift.code,
            'status': active_shift.status,
            'shift_type': active_shift.shift_type,
            'starts_at': active_shift.starts_at,
        } if active_shift else None
      

    else:
        showAc = IntpAc.filter(onesha = True)
        akauntisum = showAc.aggregate(Sum('Amount'))
        allAkauntisum =0
        akauntilistForInt = list(PaymentAkaunts.objects.filter(Interprise__in = br,onesha=True).annotate(duka=F('Interprise')).values().order_by("-Amount"))
        Allist = {'none':"none"}
        
        allistCounti=0
        count=showAc.count()
        data =  dict()
        # allist =  serializers.serialize('json', Allist)
        # thislist =  serializers.serialize('python', akauntilistForInt)

    



   


        data["sum"] = akauntisum
        data["allsum"] = akauntisum
        # data["list"] = akauntilistForInt
        data["alllist"] =Allist
        data["otherCount"] = allistCounti
        data["Count"] = count
        data["menu"] = Admin
        data["cash_accounts"] = cash_accounts
        data["non_cash_accounts"] = non_cash_accounts
        data["supervisors"] = supervisors
        data["shift_management_enabled"] = _shift_feature_enabled(duka)
        data["active_shift"] = {
            'id': active_shift.id,
            'code': active_shift.code,
            'status': active_shift.status,
            'shift_type': active_shift.shift_type,
            'starts_at': active_shift.starts_at,
        } if active_shift else None

    # wekanum= wekaCash.objects.filter(Interprise=InterprisePermissions.objects.get(user=request.user).Interprise).count()
    # data['wekanum']=wekanum
    # if wekanum>0:
    #     data =  dict()

    #     # data['kuweka'] =  list(wekaCash.objects.filter(Interprise=InterprisePermissions.objects.get(user=request.user).Interprise))  
   
    # toanum= toaCash.objects.filter(Interprise=InterprisePermissions.objects.get(user=request.user).Interprise).count()
    # data['toanum']=toanum
    # if toanum>0:
    #     data =  dict()

        # data['kutoa'] =  list(toaCash.objects.filter(Interprise=InterprisePermissions.objects.get(user=request.user).Interprise))  
    data['duka'] = duka.id
    data['list'] = list(payaccs_.order_by('-pk').annotate(duka=F('Interprise')).values().order_by("-Amount"))
    return JsonResponse(data)      

# @login_required(login_url='login')
# def wekalist(request):
#     if request.method == "POST":
#         num=int(request.POST.get('show_num'))
#         strt= int(request.POST.get('strt')) # this is the number that data should start from in database indexing
#         show = strt*num  # multiply the number of how many data should the user show .......
#         strt = num*(strt-1)

#         per =  InterprisePermissions.objects.get(user__user=request.user,default=True)
#         duka = per.Interprise 

#         wekanum= wekaCash.objects.filter(Interprise=duka).count()
        
#         wekacash=list(wekaCash.objects.filter(Interprise=duka).annotate(Akaunti=F('Akaunt__Akaunt_name'),invo_code=F('invo__code'),naf=F('by__user__user__first_name'),nal=F('by__user__user__last_name')).values(
#         ).order_by("-pk"))[strt:show] 
      
#     # ficha kwa wasioruhusiwa miamala ya siri ....
#         wekanumlim= wekaCash.objects.filter(Interprise=duka,usiri=False).count()
#         wekacashlim=list(wekaCash.objects.filter(Interprise=duka,usiri=False).annotate(Akaunti=F('Akaunt__Akaunt_name'),naf=F('by__user__user__first_name'),nal=F('by__user__user__last_name')).values(
#         ).order_by("-pk"))[strt:show] 
      

#         if InterprisePermissions.objects.get(user__user=request.user,default=True).owner:
#             Admin = True

#         else:
#             Admin= False

#         data =  dict()

#         if wekanum>0:
#             if InterprisePermissions.objects.get(user__user=request.user,default=True, Interprise=duka).owner  or   per.miamala_siri_show:
      
#                     data['kuweka'] =  wekacash 

#                     data['wekanum']=wekanum

#             else:
                        
#                 data['kuweka'] =  wekacashlim 
#                 data['wekanum']=wekanumlim

#             data['him']=Admin

#         else:
#             data['wekanum']=0 

#         return JsonResponse(data)      
#     else:
#        return render(request,'pagenotFound.html',todoFunct(request))     

# @login_required(login_url='login')
# def kutoalist(request):
#     if request.method == "POST":
#         num=int(request.POST.get('show_num'))
#         strt= int(request.POST.get('strt'))
#         show = strt*num  
#         strt = num*(strt-1)
     
#         per =  InterprisePermissions.objects.get(user__user=request.user,default=True)
#         duka = per.Interprise

#         toanum= toaCash.objects.filter(Interprise=duka).count()
#         toa=list(toaCash.objects.filter(Interprise=duka).annotate(Akaunti=F('Akaunt__Akaunt_name'),bil_code=F('bill__code'),naf=F('by__user__user__first_name'),nal=F('by__user__user__last_name')).values(
#            ).order_by("-pk"))[strt:show] 
       
#         toanumsiri= toaCash.objects.filter(Interprise=duka,usiri=False).count()
#         toasiri=list(toaCash.objects.filter(Interprise=duka,usiri=False).annotate(Akaunti=F('Akaunt__Akaunt_name'),naf=F('by__user__user__first_name'),bil_code=F('bill__code'),nal=F('by__user__user__last_name')).values(
#         ).order_by("-pk"))[strt:show] 
       
#         if per.owner:
#             Admin = True

#         else:
#             Admin= False        
        
#         data =  dict()

#         if toanum>0:
#             if per.owner  or  per.miamala_siri_show:
      
#                 data['kutoa'] =  toa 

#                 data['toanum']=toanum

#             else:
#                 data['kutoa'] =  toasiri 

#                 data['toanum']=toanumsiri                        
               
#             data['him']=Admin
           
#             return JsonResponse(data)
#         else:
#             data['toanum']=0 
#             return JsonResponse(data)         
    
#     else:
#        return render(request,'pagenotFound.html',todoFunct(request)) 

# @login_required(login_url='login')
# def calender(request):
#     if request.method == "POST":
#         month=int(request.POST.get('monthcode'))
#         dt =request.POST.get('dt')
            
#         per =  InterprisePermissions.objects.get(user__user=request.user,default=True)
#         duka = per.Interprise
#         toa_first = toaCash.objects.filter(Interprise=duka).first()
#         weka_first =wekaCash.objects.filter(Interprise=duka).first()
    
#         toa_last = toaCash.objects.filter(Interprise=duka).last()
#         weka_last =wekaCash.objects.filter(Interprise=duka).last()
        

#         if toa_first is not None and weka_first is not None:
#             if toa_first.tarehe <= weka_first.tarehe:
#                 firstDate = weka_first.tarehe
#             else:
#                 firstDate = weka_first.tarehe

#             if toa_last.tarehe >= weka_last.tarehe:
#                 lastDate = toa_last.tarehe
#             else:
#                 lastDate = weka_last.tarehe
#             toa = True
#             weka = True   

#         elif toa_first is not None and weka_first is  None: 
#                 firstDate = toa_first.tarehe
#                 lastDate = toa_last.tarehe
#                 toa = True
#                 weka = False

#         elif toa_first is  None and weka_first is not  None: 
#                 firstDate = weka_first.tarehe
#                 lastDate = weka_last.tarehe
#                 toa = False
#                 weka = True
#         else:
#                 firstDate = datetime.datetime.now(tz=timezone.utc)
#                 lastDate = datetime.datetime.now(tz=timezone.utc)
#                 toa = False
#                 weka = False


#         if month == 0:
#             current = lastDate    
#         else:
#             toa_lasti = toaCash.objects.filter(Interprise=duka,monthcode=month).last()
#             weka_lasti =wekaCash.objects.filter(Interprise=duka,monthcode=month).last()
           
#             if weka_lasti is not None and toa_lasti is not None:
#                 if toa_lasti.tarehe >= weka_lasti.tarehe:
#                     lastDatei = toa_lasti.tarehe
#                 else:
#                     lastDatei = weka_lasti.tarehe
#                 toa = True
#                 weka = True   

#             elif weka_lasti is not None and toa_lasti is  None: 
#                     lastDatei = weka_lasti.tarehe
#                     toa = False
#                     weka = True

#             elif weka_lasti is  None and toa_lasti is not  None: 
#                     lastDatei = toa_lasti.tarehe
#                     toa = True
#                     weka = False
#             else:
#                     lastDatei = datetime.datetime.strptime(dt,"%d %B, %Y")
#                     toa = False
#                     weka = False
#             current = lastDatei    
    



#         if month == 0:        
#             if toa:                   
#                 toa_cash = list(toaCash.objects.filter(Interprise=duka,monthcode=int((lastDate).strftime("%Y%m"))).annotate(Akaunti=F('Akaunt__Akaunt_name'),naf=F('by__user__user__first_name'),nal=F('by__user__user__last_name')).values(
#         ).order_by("-pk"))  
#             else:
#                 toa_cash = [] 
#             if weka:       
#                 weka_cash = list(wekaCash.objects.filter(Interprise=duka,monthcode=int((lastDate).strftime("%Y%m"))).annotate(Akaunti=F('Akaunt__Akaunt_name'),naf=F('by__user__user__first_name'),nal=F('by__user__user__last_name')).values(
#         ).order_by("-pk"))           
#             else:
#                 weka_cash = []

             
#         else:        
#             if toa:                   
#                 toa_cash = list(toaCash.objects.filter(Interprise=duka,monthcode=month).annotate(Akaunti=F('Akaunt__Akaunt_name'),naf=F('by__user__user__first_name'),nal=F('by__user__user__last_name')).values(
#         ).order_by("-pk"))
#             else:
#                 toa_cash = []
#             if weka:       
#                 weka_cash = list(wekaCash.objects.filter(Interprise=duka,monthcode=month).annotate(Akaunti=F('Akaunt__Akaunt_name'),naf=F('by__user__user__first_name'),nal=F('by__user__user__last_name')).values(
#         ).order_by("-pk"))        
#             else:
#                 weka_cash = [] 

              


#         data =  dict()
#         data['current'] = current
#         data['wekalist']=weka_cash
#         data['toalist'] = toa_cash
#         data['toa']=toa
#         data['weka']=weka    
#         data['firstDate']=  firstDate
#         data['lastDate'] = lastDate

#         return JsonResponse(data)  
#     else:
#        return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def ondoaAkaunt(request):
    if request.method == "POST":
          id= request.POST.get('value',"")
          cheo = todoFunct(request)['cheo']
          duka= cheo.Interprise

          if cheo.owner:
            ac =  PaymentAkaunts.objects.get(pk=id,Interprise__owner=duka.owner.id)
            ac.delete()

            data={
              "done":True
            }

            return JsonResponse(data)
    else:
       return render(request,'pagenotFound.html',todoFunct(request)) 


# ─── Cash Deposits page & API ─────────────────────────────────────────────────

@login_required(login_url='login')
def cash_deposits_page(request):
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    duka = todo['duka'].Interprise
    # recorders who have made deposits (deposit_to is not null)
    recorders = list(
        toaCash.objects.filter(Interprise=duka, deposit_to__isnull=False)
        .values('by__id', 'by__user__user__first_name', 'by__user__user__last_name')
        .distinct()
    )
    todo['akaunt_page'] = 'cash_deposits'
    todo['recorders'] = recorders
    return render(request, 'cash_deposits.html', todo)


@login_required(login_url='login')
def cash_deposits_data(request):
    todo = todoFunct(request)
    duka = todo['duka']
    cheo = todo['cheo']

    period = request.GET.get('period', 'today')   # today | week | month | custom
    date_from_str = request.GET.get('date_from', '')
    date_to_str = request.GET.get('date_to', '')
    by_id = request.GET.get('by_id', '')

    today = date.today()

    if period == 'today':
        start = today
        end = today
    elif period == 'week':
        start = today - timedelta(days=today.weekday())
        end = today
    elif period == 'month':
        start = today.replace(day=1)
        end = today
    elif period == 'custom':
        try:
            start = date.fromisoformat(date_from_str)
            end = date.fromisoformat(date_to_str)
        except (ValueError, TypeError):
            start = today
            end = today
    else:
        start = today
        end = today

    # print(start, end)    

    qs = toaCash.objects.filter(
        Interprise=duka.id,
        deposit_to__isnull=False,
        tarehe__date__gte=start,
        tarehe__date__lte=end,
    )

    # print(qs.exists())
    if by_id:
        qs = qs.filter(by__id=by_id)

    # Summary row for this period
    agg = qs.aggregate(total=Sum('Amount'), count=Sum(F('pk') - F('pk') + 1))
    total_amount = float(agg.get('total') or 0)
    count = qs.count()

    # Detailed rows
    show_hidden = bool(cheo.owner or getattr(cheo, 'msaidizi', False))
    rows = list(
        qs.annotate(
            akaunti_name=F('Akaunt__Akaunt_name'),
            by_fname=F('by__user__user__first_name'),
            by_lname=F('by__user__user__last_name'),
            deposit_name=F('deposit_to__Akaunt__Akaunt_name'),
        ).values(
            'id', 'Amount', 'tarehe', 'admin_approve',
            'akaunti_name', 'by_fname', 'by_lname', 'deposit_name',
            'by__id',
        ).order_by('-tarehe')
    )

    # Convert datetime to string for JSON serialisation
    for r in rows:
        if r.get('tarehe'):
            r['tarehe'] = r['tarehe'].strftime('%Y-%m-%d %H:%M')

    # Summary table (always today / week / month regardless of period filter)
    def _period_sum(s, e):
        q = toaCash.objects.filter(
            Interprise=duka, deposit_to__isnull=False,
            tarehe__date__gte=s, tarehe__date__lte=e,
        )
        if by_id:
            q = q.filter(by__id=by_id)
        agg2 = q.aggregate(total=Sum('Amount'))
        return {'count': q.count(), 'amount': float(agg2.get('total') or 0)}

    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)

    summary = {
        'today': _period_sum(today, today),
        'week': _period_sum(week_start, today),
        'month': _period_sum(month_start, today),
    }

    return JsonResponse({
        'success': True,
        'period': period,
        'count': count,
        'total_amount': total_amount,
        'rows': rows,
        'summary': summary,
    })


@login_required(login_url='login')
@csrf_exempt
def approve_cash_deposit(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'msg': 'Invalid method'}, status=405)
    todo = todoFunct(request)
    cheo = todo['cheo']
    duka = todo['duka'].Interprise

    if not (cheo.owner or getattr(cheo, 'msaidizi', False)):
        return JsonResponse({'success': False, 'msg': 'Not authorised'}, status=403)

    dep_id = request.POST.get('id', '')
    if not dep_id:
        return JsonResponse({'success': False, 'msg': 'Missing id'}, status=400)

    updated = toaCash.objects.filter(pk=dep_id, Interprise=duka, deposit_to__isnull=False).update(admin_approve=True)
    if updated:
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'msg': 'Record not found'}, status=404)


# ─── Mobile Payments page & API ───────────────────────────────────────────────

@login_required(login_url='login')
def mobile_payments_page(request):
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    duka = todo['duka'].Interprise
    recorders = list(
        wekaCash.objects.filter(Interprise=duka)
        .exclude(Akaunt__aina__iexact='Cash')
        .values('by__id', 'by__user__user__first_name', 'by__user__user__last_name')
        .distinct()
    )
    todo['akaunt_page'] = 'mobile_payments'
    todo['recorders'] = recorders
    return render(request, 'mobile_payments.html', todo)


@login_required(login_url='login')
def mobile_payments_data(request):
    todo = todoFunct(request)
    duka = todo['duka']

    period = request.GET.get('period', 'today')
    date_from_str = request.GET.get('date_from', '')
    date_to_str = request.GET.get('date_to', '')
    by_id = request.GET.get('by_id', '')

    today = date.today()

    if period == 'today':
        start = today
        end = today
    elif period == 'week':
        start = today - timedelta(days=today.weekday())
        end = today
    elif period == 'month':
        start = today.replace(day=1)
        end = today
    elif period == 'custom':
        try:
            start = date.fromisoformat(date_from_str)
            end = date.fromisoformat(date_to_str)
        except (ValueError, TypeError):
            start = today
            end = today
    else:
        start = today
        end = today

    qs = wekaCash.objects.filter(
        Interprise=duka.id,
        tarehe__date__gte=start,
        tarehe__date__lte=end,
    ).exclude(Akaunt__aina__iexact='Cash')

    if by_id:
        qs = qs.filter(by__id=by_id)

    total_amount = float(qs.aggregate(total=Sum('Amount')).get('total') or 0)
    count = qs.count()

    rows = list(
        qs.annotate(
            akaunti_name=F('Akaunt__Akaunt_name'),
            aina=F('Akaunt__aina'),
            by_fname=F('by__user__user__first_name'),
            by_lname=F('by__user__user__last_name'),
        ).values(
            'id', 'Amount', 'tarehe', 'admin_approve',
            'akaunti_name', 'aina', 'by_fname', 'by_lname', 'by__id',
        ).order_by('-tarehe')
    )

    for r in rows:
        if r.get('tarehe'):
            r['tarehe'] = r['tarehe'].strftime('%Y-%m-%d %H:%M')

    def _period_sum(s, e):
        q = wekaCash.objects.filter(
            Interprise=duka,
            tarehe__date__gte=s, tarehe__date__lte=e,
        ).exclude(Akaunt__aina__iexact='Cash')
        if by_id:
            q = q.filter(by__id=by_id)
        agg2 = q.aggregate(total=Sum('Amount'))
        return {'count': q.count(), 'amount': float(agg2.get('total') or 0)}

    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)

    summary = {
        'today': _period_sum(today, today),
        'week': _period_sum(week_start, today),
        'month': _period_sum(month_start, today),
    }

    return JsonResponse({
        'success': True,
        'period': period,
        'count': count,
        'total_amount': total_amount,
        'rows': rows,
        'summary': summary,
    })


