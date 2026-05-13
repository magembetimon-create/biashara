from management.models import Notifications,ainaMama,ainaBibi, UserExtend,Zones,Nchi,EmployeeAttachments,Kanda,Workers, customer_area, customer_in_cell,sales_color,sales_size,AnswerTo,stockAdjst_confirm,question_to,chatTo,chats,Interprise,deliveryAgents,bei_za_bidhaa, color_produ,mauzoList,order_from,bidhaa_sifa, key_sifa,produ_colored,produ_size,picha_bidhaa,bidhaa_stoku,picha_bidhaa,bidhaa_aina, receive,user_Interprise,HudumaNyingine,Huduma_za_kifedha,businessReg,manunuzi,Interprise_contacts,InterprisePermissions,PaymentAkaunts, mauzoni,staff_akaunt_permissions, wasambazaji,ShiftSession,ShiftAssignment
from django.utils import timezone
from django.db.models import Q,F
from datetime import date



# FOr mails
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import requests, json


def _shift_staff_name(staff_perm):
  if not staff_perm:
    return ''
  if getattr(staff_perm, 'fanyakazi', None):
    return str(staff_perm.fanyakazi.jina or '').strip()
  user_extend = getattr(staff_perm, 'user', None)
  user_obj = getattr(user_extend, 'user', None) if user_extend else None
  if user_obj:
    full_name = user_obj.get_full_name().strip()
    return full_name or user_obj.username
  return str(getattr(staff_perm, 'cheo', '') or '').strip()


def shift_operation_block_payload(todo):
  msg_swa = todo.get('shift_operation_block_reason_swa') or 'Operesheni hii inahitaji shift inayoendelea na assignment yako kwenye shift hiyo.'
  msg_eng = todo.get('shift_operation_block_reason_eng') or 'This operation requires an active shift assigned to you.'
  return {
    'success': False,
    'msg_swa': msg_swa,
    'msg_eng': msg_eng,
    'message_swa': msg_swa,
    'message_eng': msg_eng,
    'shift_management_enabled': bool(todo.get('shift_management_enabled')),
    'has_active_shift': bool(todo.get('has_active_shift')),
  }

class Todos:
  def __init__(self,request):
      self.request = request 

  def _shift_context(self, duka, dukap):
    shift_data = {
      'shift_management_enabled': False,
      'active_shift': None,
      'has_active_shift': False,
      'active_shift_assigned_to': None,
      'active_shift_assigned_name': '',
      'is_assigned_to_active_shift': False,
      'can_open_shift': False,
      'can_close_shift': False,
      'shift_operation_allowed': True,
      'shift_status_swa': 'Usimamizi wa shift haujawezeshwa',
      'shift_status_eng': 'Shift management is disabled',
      'shift_operation_block_reason_swa': '',
      'shift_operation_block_reason_eng': '',
    }

    if not duka or not getattr(duka, 'Interprise', False):
      return shift_data

    shift_enabled = bool(getattr(duka, 'shift_management_enabled', False))
    shift_data['shift_management_enabled'] = shift_enabled
    shift_data['can_open_shift'] = bool(dukap and (dukap.owner or dukap.open_own_shift))

    if not shift_enabled:
      shift_data['shift_status_swa'] = 'Usimamizi wa shift haujawezeshwa kwa biashara hii'
      shift_data['shift_status_eng'] = 'Shift management is disabled for this business'
      return shift_data

    active_shift = ShiftSession.objects.filter(
      Interprise=duka.id,
      ends_at__isnull=True,
    ).order_by('-starts_at', '-id').first()

    shift_data['active_shift'] = active_shift
    shift_data['has_active_shift'] = active_shift is not None

    recorder_assignment = None
    if active_shift:
      recorder_assignment = ShiftAssignment.objects.filter(
        shift=active_shift,
        active=True,
      ).filter(Q(role='recorder') | Q(role='all')).select_related('staff__user__user', 'staff__fanyakazi').order_by('-id').first()
      if not recorder_assignment:
        recorder_assignment = ShiftAssignment.objects.filter(
          shift=active_shift,
          active=True,
        ).select_related('staff__user__user', 'staff__fanyakazi').order_by('-id').first()

    assigned_staff = recorder_assignment.staff if recorder_assignment else None
    shift_data['active_shift_assigned_to'] = assigned_staff
    shift_data['active_shift_assigned_name'] = _shift_staff_name(assigned_staff)

    is_assigned = False
    if active_shift and dukap:
      is_assigned = ShiftAssignment.objects.filter(
        shift=active_shift,
        staff=dukap,
        active=True,
      ).exists()

    shift_data['is_assigned_to_active_shift'] = is_assigned
    shift_data['can_close_shift'] = bool(
      active_shift and dukap and is_assigned and (dukap.owner or dukap.close_own_shift)
    )
    shift_data['shift_operation_allowed'] = bool(active_shift and is_assigned)

    if not active_shift:
      shift_data['shift_status_swa'] = 'Hakuna shift inayoendelea kwa sasa'
      shift_data['shift_status_eng'] = 'There is no active shift at the moment'
      shift_data['shift_operation_block_reason_swa'] = 'Hakuna shift inayoendelea kwa sasa, hivyo operesheni hii hairuhusiwi hadi admin au mwenye ruhusa afungue shift.'
      shift_data['shift_operation_block_reason_eng'] = 'There is no active shift right now, so this operation is blocked until an authorized user opens a shift.'
    else:
      shift_code = str(active_shift.code or active_shift.id)
      assigned_name = shift_data['active_shift_assigned_name']
      if assigned_name:
        shift_data['shift_status_swa'] = f'Shift {shift_code} inaendelea, assigned to {assigned_name}'
        shift_data['shift_status_eng'] = f'Shift {shift_code} is active and assigned to {assigned_name}'
      else:
        shift_data['shift_status_swa'] = f'Shift {shift_code} inaendelea'
        shift_data['shift_status_eng'] = f'Shift {shift_code} is active'

      if not is_assigned:
        shift_data['shift_operation_block_reason_swa'] = 'Operesheni hii inaruhusiwa tu kwa mtumiaji aliyepangiwa shift inayoendelea.'
        shift_data['shift_operation_block_reason_eng'] = 'This operation is only allowed for the user assigned to the active shift.'

    return shift_data
      

  def todoF(self):  
      todo = {}
      try:
        used = self.request.user
        dukap=None
        duka = None
        user = UserExtend.objects.get(user = used.id ) 
        pent = Interprise.objects.get(owner = user,Interprise=False)
        duka = pent
        p = InterprisePermissions.objects.filter(Q(Allow=True,Interprise__usage__gt=0,Interprise__bill_tobePaid__gte = date.today())|Q(Interprise__owner=user.id),user__user = used.id, default = True)
        if p.exists():
          dukap=p.last()
          duka = dukap.Interprise

        huduma = HudumaNyingine.objects.filter(Interprise=duka.id)
        matawi = InterprisePermissions.objects.filter(user=user.id,Interprise__owner=duka.owner)
        if p.exists():
          matawi = matawi.exclude(pk=dukap.id)
        Puorder = manunuzi.objects.filter(Interprise__in=[duka.id,pent.id],order=True)
       
        ukomo = duka.Interprise and (duka.usage > 0 or duka.marketing > 0) and duka.bill_tobePaid < date.today()
        waiter_counter = InterprisePermissions.objects.filter(user=user.id,waiter_counter=True,Interprise__waiter_counter=True)
        # payaccs_waiter = PaymentAkaunts.objects.filter(Interprise__in=[wc.Interprise.id for wc in waiter_counter.filter(servicing=True)]) if waiter_counter.exists() else None
        waiter_duka = waiter_counter.first().Interprise if waiter_counter.exists() else None
        payaccs_waiter = PaymentAkaunts.objects.filter(
            Interprise__owner=waiter_duka.owner,
            onesha=True,
            supervisor_account=False
        ).exclude(aina__iexact='Cash') if waiter_duka else PaymentAkaunts.objects.none()

        # 2. Pata serving waiter
        serving_waiter = waiter_counter.filter(servicing=True).first() if waiter_counter.exists() else None

        # 3. Pata akaunti ya Cash ya duka husika
        servCash_account = PaymentAkaunts.objects.filter(
            Interprise=serving_waiter.Interprise,
            aina__iexact='Cash'
        ) if serving_waiter else PaymentAkaunts.objects.none()

        # 4. COMBINE: Unganisha zote mbili kuwa moja
        payaccs_waiter = payaccs_waiter | servCash_account
        
        customer_table = customer_in_cell.objects.filter(area__Interprise__in=[wc.Interprise.id for wc in waiter_counter.filter(servicing=True)]) if waiter_counter.exists() else None
        waiter_uncleared_waiters_count = 0
        if duka and duka.Interprise and duka.waiter_counter:
          waiter_uncleared_waiters_count = mauzoni.objects.filter(
            Interprise=duka,
            waiter_order__isnull=False,
            By__isnull=True,
            full_returned=False,
          ).values('waiter_order').distinct().count()
        shift_data = self._shift_context(duka, dukap)
        todo = {
        'cheo':dukap,
        'duka':duka,
        'useri':user,
        # 'wilaya' :wilaya, 
        # 'mikoa':mikoa, 
        # 'kanda':kanda,
        'hdm':huduma,
        'matawi':matawi,
        'pent':pent,
        'puO':Puorder,
        'ukomo':ukomo,
        'waiter_counter':waiter_counter,
        'waiter_uncleared_waiters_count':waiter_uncleared_waiters_count,
        'payaccs_waiter':payaccs_waiter,
        'customer_table':customer_table
        }
        todo.update(shift_data)




      except:
        todo={
              'cheo':None,
            'duka':None,
            'useri':None,
            # 'wilaya' :wilaya, 
            # 'mikoa':mikoa, 
            # 'kanda':kanda,
            'hdm':None,
            'matawi':None,
            'pent':None,
            'puO':None,
            'waiter_uncleared_waiters_count':0,
            'shift_management_enabled':False,
            'active_shift':None,
            'has_active_shift':False,
            'active_shift_assigned_to':None,
            'active_shift_assigned_name':'',
            'is_assigned_to_active_shift':False,
            'can_open_shift':False,
            'can_close_shift':False,
            'shift_operation_allowed':True,
            'shift_status_swa':'Usimamizi wa shift haujawezeshwa',
            'shift_status_eng':'Shift management is disabled',
            'shift_operation_block_reason_swa':'',
            'shift_operation_block_reason_eng':''
        }
      return todo

def confirmMailF(mail):
      html_content = None
      if mail['formail']:
          html_content = render_to_string("mailtemp.html",{'num':mail['num']})
      else:
          
          html_content =  render_to_string("order_notify.html",mail['data'])    
      text_content = strip_tags(html_content)
      emaili =  EmailMultiAlternatives(
          "Confirmation",
          text_content,
          settings.EMAIL_HOST_USER,
          # 'Dont Reply <do_not_reply@gmail.com>',
          [mail['to']]
      )
      emaili.attach_alternative(html_content,"text/html")
      emaili.send()
    
        # change item mapping the order  when new item added
def  updateOrder(itm):
    todo = Todos(itm['request']).todoF()
    duka = todo['duka']
    # print(itm['finished'])
    theitm=mauzoList.objects.filter(produ__bidhaa=itm['itm'].bidhaa.id,mauzo__Interprise=duka.id,mauzo__order=True,produ__idadi=0)
    for it in theitm:
        colored = produ_colored.objects.filter(bidhaa=it.produ.id)
        # print(theitm.exists(),colored.exists())
        if not colored.exists():
            it.produ = itm['itm']
            if itm['out']:
                it.produ = itm['other']
            it.save()

# if ordered item has been fineshed and there is another same item
def updateOrdered(itm):
    pass
    


def  sendSMS(sms):
        # print(sms)
        url = "https://messaging-service.co.tz/api/sms/v1/text/single"
      
        payload = json.dumps({
          "from": "fbiashara",
          "to": f"{sms['code']}{sms['to']}",
          "text": f"Your verification code is: {sms['num']}",
          "reference": "aswqetgcv"
        })
        headers = {
          'Authorization': 'Basic bXVzYWo6TXVzYUBtZTEy',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        # print(response.text)