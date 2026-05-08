# from genericpath import exists
# from tkinter import OFF
import traceback

from django.shortcuts import render

import json
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from management.models import UserExtend,Interprise_Rating,ForPrintingPupose,ChangedServiceFrom,invoice_desk,HudumaNyingine,ChangedServiceTo,ChangedService,Kanda,Workers,Notifications,deliveryAgents,productionList,deliveryBy,salePuMatch,manunuzi,remainedFromOda, manunuziList,order_from,order_to,bidhaa_aina,sale_return,user_customers,businessReg,sale_return_mauzo_fidia,sa_ret,sa_col_ret,sa_size_ret,picha_bidhaa,Cash_order_return,Interprise,toaCash,bei_za_bidhaa,bidhaa,Interprise_contacts,wekaCash,produ_size,color_produ,produ_colored,bidhaa_stoku,wateja,sales_color,sales_size,mauzoni,mauzoList,InterprisePermissions,PaymentAkaunts,customer_in_cell,waiterPayments,WaiterPosDeviceSession,waiter_clearing
from management.models import customer_area
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F,FloatField,Count
from django.db import transaction
from django.core import serializers
from django.db.models import Q
# from datetime import datetime
from django.utils import timezone
timezone.now()
from datetime import date, timedelta,tzinfo,timezone


import time  
import pytz
import datetime
import re
from django.db.models import Sum
from django.core.paginator import Paginator,EmptyPage



from accaunts.todos import Todos , confirmMailF, updateOrder
# Create your views here.

def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()

# ALL INVOICES...................................//
def allMauzoFunct(request):
    todo=todoFunct(request)
    duka=todo['duka']

    serv = int(request.GET.get('s',0))

    lis_t = int(request.GET.get('lis_t',1))
    invo = mauzoni.objects.filter(Interprise=duka,full_returned=False,order=False,service=serv)

    if serv:
          invo = invo.filter(receved=True)
   
    unpaid = invo.filter(ilolipwa=0)
    less = invo.filter(ilolipwa__lt=F('amount')).exclude(ilolipwa=0)
    change = invo.filter(change=True)
    timel =invo.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))
    
    if lis_t ==2:
          invo = unpaid
    elif lis_t ==3:
          invo = less
    elif lis_t == 5:
          invo = timel        
    elif lis_t == 8:
          invo = change        
                
    num = invo.count()
    invoin = invo.order_by("-pk")

    
    p=Paginator(invoin,15)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    todo.update({
       'muda':timel ,  
      'unpaid':unpaid,
      'change':change,
      'less':less,
      'p_num':page_num,
      'pages':pg_number,
      'bil_num':num,
      'bili':page, 
      'serv':serv,
      'lis_t':int(lis_t)
       })

    return todo   

@login_required(login_url='login')
def mauzo(request):
    todo = allMauzoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
      return render(request,'mauzo.html',todo)

@login_required(login_url='login')
def Hudumiwa(request):
    todo = allMauzoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'servicesInvo.html',todo)

# SALE RETURN.......................//
@login_required(login_url='login')
def mauzo_rudi(request):
  
    todo = todoFunct(request)
    duka=todo['duka']
    lis_t = int(request.GET.get('lis_t',1))
    invo = sale_return.objects.filter(Interprise=duka)
    
    unpaid = sale_return.objects.filter(Interprise=duka,ilolipwa=0)
    less = sale_return.objects.filter(Interprise=duka,ilolipwa__gt=0).exclude(amount=F('ilolipwa'))
   
    if lis_t ==2:
          invo = unpaid
    elif lis_t ==3:
          invo = less  
                
    num = invo.count()
    invoin = invo.order_by("-pk")

    
    p=Paginator(invoin,15)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    todo.update({
      'unpaid':unpaid,
      'less':less,
      'p_num':page_num,
      'pages':pg_number,
      'bil_num':num,
      'bili':page, 
      
    } )
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'saleRtn.html',todo)   

# SALE RETURN.......................//
@login_required(login_url='login')
def oda_refunds(request):
    todo =todoFunct(request)
    duka=todo['duka']
    lis_t = int(request.GET.get('lis_t',1))
    invo = Cash_order_return.objects.filter(ivo__Interprise=duka)             
    num = invo.count()
    invoin = invo.order_by("-pk")

    
    p=Paginator(invoin,15)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    todo.update({
      # 'unpaid':unpaid,
      # 'less':less,
      'p_num':page_num,
      'pages':pg_number,
      'bil_num':num,
      'bili':page, 
      
    })
    if not duka.Interprise:
        return redirect('/userdash')
    else: 
       return render(request,'odaRefunds.html',todo)
    

@login_required(login_url='login')
def  newInvo_funct(request):
    todo =todoFunct(request)
    bil=request.GET.get('bl',0)
    ch=int(request.GET.get('ch',0))
    duka=todo['duka']
    invono = 1
    invo_str=''
    starti = mauzoni.objects.filter(pk=bil,Interprise=duka.id)
    if mauzoni.objects.filter(Interprise=duka).exists():
       invo_no = mauzoni.objects.filter(Interprise=duka).last()
    
       invono = invo_no.Invo_no

    if invono <10:
          invo_str = '0000'+str(invono)
    elif invono <100 and invono >=10:
          invo_str = '000' +str(invono)    
    elif invono <1000 and invono >=100:
          invo_str = '00' +str(invono)    
    elif invono <10000 and invono >=1000:
          invo_str = '0' +str(invono)    
    elif invono >=10000 :
          invo_str =str(invono) 
          
    leo = datetime.datetime.now().astimezone()
    today_morning = leo.strftime('%Y-%m-%d 00:00:00%z') 
#     print({'leo':today_morning}) 
    
    custom_no = mauzoni.objects.filter(Interprise=duka,tarehe__gte=today_morning).count()
    todo.update({
      'invo': invo_str,  
      'rudi':False,
      'ret':None,
      'start':starti,
      'ch':ch,
      'custom':custom_no + 1
    })

    return todo   

@login_required(login_url='login')
def  newInvoice(request):
    todo = newInvo_funct(request) 
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'newInvoice.html',todo)
    
@login_required(login_url='login')
def  POStab(request):
    serv = int(request.GET.get('s',0)) 
    todo = newInvo_funct(request) 
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       todo.update({
            'serv':serv
       })
       return render(request,'pos_tab.html',todo)

@login_required(login_url='login')
def waiterpage(request):
      todo = newInvo_funct(request)
      # if not todo['duka'].Interprise:
      #       return redirect('/userdash')

      if not todo.get('waiter_counter', False):
            return redirect('/userdash')

      counters = todo['waiter_counter']
      servicing_counter = counters.filter(
           
            servicing=True
      )

      if servicing_counter.exists():
            todo.update({'servicing_counter': servicing_counter.last()})
            return render(request, 'waiterpage.html', todo)

     
      todo.update({'waiter_counters': counters})
      return render(request, 'waiter_counter_select.html', todo)


def _waiter_counter_mode(counter_obj):
      if not counter_obj:
            return 'all'

      raw = f"{counter_obj.cheo or ''} {counter_obj.user.user.first_name or ''} {counter_obj.user.user.last_name or ''}".lower()
      if re.search(r'(kinywaji|drink|beverage|bar|juice|soda)', raw):
            return 'drinks'
      if re.search(r'(chakula|food|kitchen|jikoni|meal)', raw):
            return 'kitchen'
      return 'all'


def _waiter_mode_accepts(counter_mode, bidhaa_obj):
      if counter_mode == 'all':
            return True

      aina_name = ''
      try:
            aina_name = str(bidhaa_obj.bidhaa.bidhaa_aina.aina or '').lower()
      except:
            aina_name = ''

      if counter_mode == 'drinks':
            return re.search(r'(kinywaji|drink|beverage|bar|juice|soda)', aina_name) is not None
      if counter_mode == 'kitchen':
            return re.search(r'(chakula|food|kitchen|jikoni|meal)', aina_name) is not None
      return True


def _resolve_waiter_context(request):
      """Resolve waiter context either from device session or logged-in waiter counter."""
      device_id = str(
            request.POST.get('device_id', '')
            or request.GET.get('device_id', '')
            or request.session.get('waiter_pos_device', '')
            or ''
      ).strip()

      biz_id_raw = request.POST.get('biz', '') or request.GET.get('biz', '') or request.session.get('waiter_pos_biz', 0)
      try:
            biz_id = int(biz_id_raw or 0)
      except:
            biz_id = 0

      if device_id:
            device_qs = WaiterPosDeviceSession.objects.select_related('Interprise', 'active_user').filter(
                  device_id=device_id,
                  active=True,
            )

            if biz_id:
                  device_qs = device_qs.filter(Interprise__id=biz_id)

            device_session = device_qs.order_by('-updated_at').first()
            if device_session and device_session.active_user and device_session.active_user.waiter_counter:
                  request.session['waiter_pos_biz'] = device_session.Interprise.id
                  request.session['waiter_pos_device'] = device_id
                  return {
                        'ok': True,
                        'source': 'device',
                        'duka': device_session.Interprise,
                        'cheo': device_session.active_user,
                        'device_id': device_id,
                  }

            return {
                  'ok': False,
                  'msg': 'Kifaa hakijasajiliwa kwa waiter POS',
            }

      if not request.user.is_authenticated:
            return {
                  'ok': False,
                  'msg': 'No active waiter counter',
            }

      todo = todoFunct(request)
      counters = todo.get('waiter_counter')
      active_counter = counters.filter(servicing=True).first() if counters is not None else None
      duka = active_counter.Interprise if active_counter else None
      cheo = active_counter if active_counter else None

      if not duka or not cheo:
            return {
                  'ok': False,
                  'msg': 'No active waiter counter',
            }

      return {
            'ok': True,
            'source': 'user',
            'duka': duka,
            'cheo': cheo,
            'device_id': '',
      }


def waiter_order(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'message_swa': 'Njia si sahihi', 'message_eng': 'Invalid request method'})

      try:
            raw_items = request.POST.get('itm_dt', '[]')
            itm_dt = json.loads(raw_items)
      except:
            return JsonResponse({'success': False, 'message_swa': 'Data za items sio sahihi', 'message_eng': 'Invalid items payload'})

      if not isinstance(itm_dt, list) or not itm_dt:
            return JsonResponse({'success': False, 'message_swa': 'Hakuna bidhaa kwenye oda', 'message_eng': 'No items in order'})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'message_swa': 'Hakuna counter active', 'message_eng': str(ctx.get('msg') or 'No active waiter counter')})

      active_counter = ctx['cheo']
      duka = ctx['duka']
      counter_mode = _waiter_counter_mode(active_counter)

      table_name = str(request.POST.get('cusom_name', '') or '').strip()
      if len(table_name) < 1:
            return JsonResponse({'success': False, 'message_swa': 'Weka meza/mteja', 'message_eng': 'Set table/customer'})

      akaunt_id = int(request.POST.get('akaunt', 0) or 0)
      ilolipwa = float(request.POST.get('inalipwa', 0) or 0)

      table_id = int(request.POST.get('table_id', 0) or 0)
      if table_id:
            table_obj = customer_in_cell.objects.filter(pk=table_id, area__Interprise=duka.id).last()
      else:
            table_obj = customer_in_cell.objects.filter(area__Interprise=duka.id, name=table_name).last()
      pay_acc = PaymentAkaunts.objects.filter(pk=akaunt_id, Interprise=duka.id).last() if akaunt_id else None

      try:
            with transaction.atomic():
                  last_invo = mauzoni.objects.filter(Interprise=duka.id).order_by('-pk').first()
                  invono = int(last_invo.Invo_no) if last_invo else 0
                  code = str(invono).zfill(5)

                  sale = mauzoni()
                  sale.Interprise = duka
                  sale.code = code
                  sale.kulipa = date.today()
                  sale.tarehe = datetime.datetime.now(tz=timezone.utc)
                  sale.date = date.today()
                  sale.Invo_no = invono + 1
                  sale.order = True
                  sale.desc = str(request.POST.get('desc', '') or '')
                  # sale.By = active_counter
                  sale.waiter_order = active_counter
                  sale.customer_in = table_obj
                  sale.mteja_jina = table_name
                  if pay_acc:
                        sale.akaunt = pay_acc

                  amount_total = 0.0
                  pending_lines = []

                  for line in itm_dt:
                        stock_id = int(line.get('idn', 0) or 0)
                        qty = float(line.get('idadi', 0) or 0)
                        if stock_id <= 0 or qty <= 0:
                              continue

                        bidhaa_qs = bidhaa_stoku.objects.select_related('bidhaa__bidhaa_aina').filter(
                              pk=stock_id,
                              Interprise=duka.id
                        )
                        if not bidhaa_qs.exists():
                              raise ValueError('ITEM_NOT_FOUND')

                        bidhaa_obj = bidhaa_qs.last()
                        # if not _waiter_mode_accepts(counter_mode, bidhaa_obj):
                        #       raise ValueError('ITEM_NOT_ALLOWED_FOR_COUNTER')

                        bei = float(bidhaa_obj.Bei_kuuza or 0)
                        if bei <= 0:
                              raise ValueError('ITEM_PRICE_INVALID')

                        amount_total += qty * bei
                        pending_lines.append((bidhaa_obj, qty, bei, float(line.get('vat_include', 0) or 0), float(line.get('vat_set', 0) or 0), int(line.get('match', 0) or 0)))

                  if not pending_lines:
                        return JsonResponse({'success': False, 'message_swa': 'Hakuna items halali', 'message_eng': 'No valid order items'})

                  sale.amount = amount_total
                  sale.waiter_pay = min(float(ilolipwa), float(amount_total))
                  # sale.full_paid = float(sale.ilolipwa) >= float(amount_total)
                  sale.save()

                  # Record initial payment in waiterPayments if any amount was paid
                  if ilolipwa > 0 and pay_acc:
                        wp = waiterPayments()
                        wp.waiter = active_counter
                        wp.amount = sale.waiter_pay
                        wp.tarehe = datetime.datetime.now(tz=timezone.utc)
                        wp.account = pay_acc
                        wp.sale = sale
                        wp.confirmed = True
                        wp.customerName = table_name
                        wp.save()

                  for bidhaa_obj, qty, bei, vat_included, vat_set, match_id in pending_lines:
                        ln = mauzoList()
                        ln.mauzo = sale
                        ln.produ = bidhaa_obj
                        ln.idadi = qty
                        ln.bei = bei
                        ln.bei_og = bei
                        ln.vat_included = bool(vat_included)
                        ln.vat_set = bool(vat_set)
                        if match_id and salePuMatch.objects.filter(pk=match_id).exists():
                              ln.match = salePuMatch.objects.get(pk=match_id)
                        ln.save()

      except ValueError as er:
            code = str(er)
            if code == 'ITEM_NOT_ALLOWED_FOR_COUNTER':
                  return JsonResponse({'success': False, 'message_swa': 'Baadhi ya bidhaa haziruhusiwi kwa counter hii', 'message_eng': 'Some items are not allowed for this waiter counter'})
            if code == 'ITEM_NOT_FOUND':
                  return JsonResponse({'success': False, 'message_swa': 'Kuna item haijapatikana', 'message_eng': 'One or more items were not found'})
            if code == 'ITEM_PRICE_INVALID':
                  return JsonResponse({'success': False, 'message_swa': 'Bei ya item sio sahihi', 'message_eng': 'Invalid item price found'})
            return JsonResponse({'success': False, 'message_swa': 'Data sio sahihi', 'message_eng': 'Invalid data'})
      except:
            traceback.print_exc()
            return JsonResponse({'success': False, 'message_swa': 'Hitilafu imetokea wakati wa kuhifadhi', 'message_eng': 'Failed to save waiter order'})

      return JsonResponse({'success': True, 'bil': sale.id})


def waiter_items_data(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'products': []})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'products': []})

      servicing_counter = ctx['cheo']
      duka = ctx['duka']

      
      mode = _waiter_counter_mode(servicing_counter)

      products_qs = bidhaa_stoku.objects.filter(
            Q(idadi__gt=0) | Q(inapacha=False) | Q(produced__notsure=True),
            Interprise=duka.id,
            Bei_kuuza__gt=0
      ).annotate(
            st=F('Interprise'),
            stName=F('Interprise__name'),
            group_name=F('bidhaa__bidhaa_aina__mahi__mahitaji'),
            group=F('bidhaa__bidhaa_aina__mahi__id'),
            kampuni=F('bidhaa__kampuni__id'),
            aina=F('bidhaa__bidhaa_aina__id'),
            namba=F('bidhaa__namba'),
            material=F('bidhaa__material'),
            curenci=F('Interprise__currencii'),
            vat=F('Interprise__vatper'),
            ainaN=F('bidhaa__bidhaa_aina__aina'),
            bidhaaN=F('bidhaa__bidhaa_jina'),
            maelezo=F('bidhaa__maelezo'),
            brand=F('bidhaa__kampuni__kampuni_jina'),
            brandId=F('bidhaa__kampuni'),
            taxInclusive=F('bidhaa__saletaxInluded'),
            vat_allow=F('Interprise__vat_allow'),
            notsure=F('produced__notsure'),
            vipimo=F('bidhaa__vipimo'),
            uwiano=F('bidhaa__idadi_jum'),
            vipimoJum=F('bidhaa__vipimo_jum'),
            # bidhaa_id=F('bidhaa__id')
      ).values().order_by('-pk')

      products = list(products_qs)
      if mode == 'drinks':
            products = [x for x in products if re.search(r'(kinywaji|drink|beverage|bar|juice|soda)', str(x.get('ainaN', '')).lower())]
      elif mode == 'kitchen':
            products = [x for x in products if re.search(r'(chakula|food|kitchen|jikoni|meal)', str(x.get('ainaN', '')).lower())]

      bidhaaRangi = list(
            produ_colored.objects.select_related('color_produ', 'bidhaa_stoku').filter(
                  Interprise=duka.id,
                  color__colored=True
            ).exclude(
                  bidhaa__inapacha=True,
                  idadi=0
            ).values(
                  'id',
                  'bidhaa',
                  'color',
                  'idadi',
                  'color__nick_name',
                  'color__color_code',
                  'color__color_name',
                  'color__colored',
                  'bidhaa__bidhaa__vipimo',
                  'bidhaa__bidhaa__vipimo_jum',
                  'bidhaa__bidhaa__idadi_jum',
                  'bidhaa__idadi'
            )
      )

      sized = list(
            produ_size.objects.select_related('sizes').filter(
                  Interprise=duka.id
            ).exclude(
                  bidhaa__inapacha=True,
                  idadi=0
            ).values(
                  'id',
                  'sized__color',
                  'sized__size',
                  'bidhaa',
                  'idadi',
                  'bidhaa__bidhaa__idadi_jum',
                  'bidhaa__idadi',
                  'bidhaa__bidhaa__vipimo',
                  'bidhaa__bidhaa__vipimo_jum'
            )
      )

      itemImg = []
      pics = picha_bidhaa.objects.filter(picha__owner=duka.owner.user).annotate(
            rangi=F('color_produ'),
            size=F('picha__pic_size')
      )
      if pics.exists():
            for im in pics:
                  itemImg.append({
                        'picha__picha': im.picha.picha.url,
                        'picha': im.picha.id,
                        'id': im.id,
                        'color_produ': im.rangi,
                        'bidhaa': im.bidhaa.id
                  })

      # customer_table = customer_in_cell.objects.filter(area__Interprise=duka.id).order_by('area__name', 'name')
      area_qs = customer_area.objects.filter(Interprise=duka.id).prefetch_related('customer_in_cell_set').order_by('name')
      table_areas = []
      for area in area_qs:
            tables_in_area = list(area.customer_in_cell_set.values('id', 'name').order_by('name'))
            for tb in tables_in_area:
                  tb['area_id'] = area.id
                  tb['area_name'] = area.name
            table_areas.append({
                  'id': area.id,
                  'name': area.name,
                  'tables': tables_in_area
            })

      return JsonResponse({
            'success': True,
            'products': products,
            'bidhaa_Rangi': bidhaaRangi,
            'sized': sized,
            'img': itemImg,
            'counter_mode': mode,
            'counter_id': servicing_counter.id if servicing_counter else 0,
            'counter_name': servicing_counter.Interprise.name if servicing_counter else '',
            'counter_staff': f"{servicing_counter.user.user.first_name} {servicing_counter.user.user.last_name}".strip() if servicing_counter else '',
            'counter_role': servicing_counter.cheo if servicing_counter else '',
            'table_areas': table_areas,
      })


@login_required(login_url='login')
def waiter_counter_activate(request):
      default_redirect = '/mauzo/waiterpage'
      next_url = str(request.POST.get('next', '') or request.GET.get('next', '') or '').strip()
      if not next_url.startswith('/') or next_url.startswith('//'):
            next_url = default_redirect
      if not (next_url.startswith('/mauzo/') or next_url.startswith('/userdash')):
            next_url = default_redirect

      if request.method != 'POST':
            return redirect(next_url)

      todo = todoFunct(request)
      counters = todo['waiter_counter']

      if  not counters.exists():
            return redirect('/userdash')

      try:
            counter_id = int(request.POST.get('counter', 0))
      except:
            return redirect(next_url)

      

      if not counters.filter(pk=counter_id).exists():
            return redirect(next_url)

      counters.update(servicing=False)
      counters.filter(pk=counter_id).update(servicing=True)

      return redirect(next_url)

@login_required(login_url='login')
def  newService(request):
    todo = newInvo_funct(request) 
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
      return render(request,'newService.html',todo)

# REFUND BY NEW INVOICE ...................................................//
@login_required(login_url='login')
def  fidiahela(request):

     val= request.POST.get('the_value')
     duka = InterprisePermissions.objects.get(user__user =request.user, default = True)

     todo = newInvo_funct(request) 
     
     ret = sale_return.objects.filter(pk=val,Interprise=duka.Interprise.id)
      
     
     if ret.exists() :
            todo['rudi'] = True
            todo['ret'] = ret.last()
     if not todo['duka'].Interprise:
         return redirect('/userdash')
     else: 
         return render(request,'newInvoice.html',todo)
       
# VIEW INVOINCE DIRECTLY................................................................//
def viewInvo_funct(request):
    intp= request.GET.get('item_valued','')
    back= request.GET.get('back_to','')
    code = request.GET.get('code','')
    lis_t= request.GET.get('lis_t',1)
    react = int(request.GET.get('r',0))
    page_num =request.GET.get('page',1)
    lang= int(request.GET.get('lang',1))
    msg = request.GET.get('msg',None)
    labour = int(request.GET.get('lb',0))  

    todo = {}
    rP = ForPrintingPupose.objects.filter(pk=react,expire__gte=datetime.datetime.now(tz=timezone.utc))
    if rP.exists():
         todo = {
              'duka':rP.last().duka,
              'useri':rP.last().user
         }
    else:    
         todo =todoFunct(request)

#     is_weiter = todo['waiter_counter'].filter(servicing=True).first() if todo.get('waiter_counter') is not None else None
    duka=todo['duka']
#     if is_weiter is not None and duka is  None:
#           duka = is_weiter.Interprise
    emp = request.GET.get('emp',0)

    #     contacts= Interprise_contacts.objects.filter(Interprise=duka,show_to_invo=True)
    labourer  = None 
    mauzo_tu = mauzoni.objects.filter(Interprise=duka,full_returned=False)
    mauzo_yote = mauzo_tu.filter(order=False,service=False)
    
    if int(labour):
         mauzo_yote = mauzo_yote.exclude(labour=None)
         labourer = mauzo_yote.distinct('labour')
         if mauzo_yote.filter(labour=emp).exists():
               mauzo_yote = mauzo_yote.filter(labour=emp)

    mauzo_ = mauzo_tu.last()

    unpaid = mauzo_yote.filter(ilolipwa=0)
    less = mauzo_yote.filter(ilolipwa__gt=0).exclude(amount=F('ilolipwa')) 
    timel = mauzo_yote.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))

    if int(lis_t) ==2:
          mauzo_yote = unpaid
    elif int(lis_t) ==3:
          mauzo_yote =  less 
    elif int(lis_t) == 5:
          mauzo_yote = timel


    if intp!='':
        mauzo_ = mauzoni.objects.get(pk=intp,Interprise=duka)
    elif code!='' and intp=='':
        mauzo_ = mauzoni.objects.get(code=code,Interprise=duka)
             
         

    list_mauzo = mauzoList.objects.filter(mauzo=mauzo_.id).exclude(idadi=F('returned'))
    reList = []

    for li in list_mauzo:
            pic = picha_bidhaa.objects.filter(bidhaa=li.produ.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url

            reList.append({
                  'itm':li,
                  'picha':picha
            })

    bei_used = []

    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.produ.bidhaa.id)
          for p in the_bei:
            bei = [{
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id

            }]
            bei_used+=bei

      #     matum = rekodiMatumizi.objects.filter(manunuzi_id=mauzo_.id,Interprise=duka.Interprise)
      #     user = UserExtend.objects.get(user = request.user.id )
      

    num = mauzo_yote.count()
    invoin = mauzo_yote.order_by("-pk")




    
    p=Paginator(invoin,15)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    akaunts = wekaCash.objects.filter(invo=mauzo_.id).order_by('-pk')
    fidia = sale_return_mauzo_fidia.objects.filter(ivo=mauzo_.id)
    retrn = sale_return.objects.filter(ivo=mauzo_.id)

    rudi = Cash_order_return.objects.filter(ivo=mauzo_.id)
    colors= sales_color.objects.filter(mauzo__mauzo=mauzo_.id).exclude(idadi=F('returned'))
    sizen= sales_size.objects.filter(mauzo__mauzo=mauzo_.id).exclude(idadi=F('returned'))
    
    reg=businessReg.objects.filter(Interprise=duka.id,show_to_invo=True)
    phone = InterprisePermissions.objects.filter(Interprise=duka.id)

    rate = Interprise_Rating.objects.filter(invo=mauzo_.id)

    todo.update({
      'rate':rate,
      'reg':reg,    
     'rudi': retrn,
     'rudis':rudi,
     'fidia':fidia.last(),
     'malipo':akaunts,     
    'muda':timel,
    'lis_t':int(lis_t),    
     'unpaid':unpaid,
     'less':less,     
    'prices':bei_used,     
     'then':{'langSet':lang} ,
    'size':sizen,      
    'color':colors,      
    'contact':phone,      
    'p_num':page_num,
    'pages':pg_number,
    'bil_num':num,
    'bili':page, 
    'the_bill':mauzo_,
    'list':reList,
    'lb':int(labour),
    'wakazi':labourer,
    'emp':emp
 #     'back':back ,
    
    } )
    return todo  


def viewWaiterInvo_funct(request):
    """Build print context for waiter orders only (separate from viewInvo_funct)."""
    intp = request.GET.get('item_valued', '')
    code = request.GET.get('code', '')
    lang = int(request.GET.get('lang', 1))

    ctx = _resolve_waiter_context(request)
    if not ctx.get('ok'):
          raise ValueError('NO_ACTIVE_WAITER_COUNTER')

    duka = ctx['duka']
    cheo = ctx['cheo']
    todo = {
          'duka': duka,
          'useri': cheo.user,
    }

    waiter_scope = Q(waiter_order=cheo)
    mauzo_qs = mauzoni.objects.filter(
          waiter_scope,
          Interprise=duka,
          By__isnull=True,
          full_returned=False,
    )

    if intp != '':
          mauzo_qs = mauzo_qs.filter(pk=intp)
    elif code != '':
          mauzo_qs = mauzo_qs.filter(code=code)

    if not mauzo_qs.exists():
          raise ValueError('WAITER_ORDER_NOT_FOUND')

    mauzo_ = mauzo_qs.last()

    list_mauzo = mauzoList.objects.filter(mauzo=mauzo_.id).exclude(idadi=F('returned'))
    reList = []
    for li in list_mauzo:
          pic = picha_bidhaa.objects.filter(bidhaa=li.produ.bidhaa.id)
          picha = ''
          if pic.exists() and pic.last().picha.picha:
                picha = pic.last().picha.picha.url

          reList.append({
                'itm': li,
                'picha': picha
          })

    bei_used = []
    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.produ.bidhaa.id)
          for p in the_bei:
                bei_used.append({
                      'unit': p.jina,
                      'qty': p.idadi,
                      'price': p.bei,
                      'prod': p.item.id
                })

    colors = sales_color.objects.filter(mauzo__mauzo=mauzo_.id).exclude(idadi=F('returned'))
    sizen = sales_size.objects.filter(mauzo__mauzo=mauzo_.id).exclude(idadi=F('returned'))

    # Waiter print uses waiterPayments history for this sale.
    malipo = waiterPayments.objects.filter(sale=mauzo_.id, confirmed=True).order_by('-pk')

    reg = businessReg.objects.filter(Interprise=duka.id, show_to_invo=True)
    phone = InterprisePermissions.objects.filter(Interprise=duka.id)

    todo.update({
          'duka': duka,
          'reg': reg,
          'malipo': malipo,
          'prices': bei_used,
          'then': {'langSet': lang},
          'size': sizen,
          'color': colors,
          'contact': phone,
          'the_bill': mauzo_,
          'list': reList,
    })

    return todo

def  AllsaleOdaFuct(request):
    todo =todoFunct(request)
    duka=todo['duka']
    lis_t = int(request.GET.get('lis_t',1))
    packed = int(request.GET.get('pac',0))
    derivered = int(request.GET.get('der',0))
    received = int(request.GET.get('rec',0))
    pend = int(request.GET.get('pend',0))

    invo = mauzoni.objects.filter(Interprise=duka,full_returned=False,order=True,cart=False)
     
     

    pending = invo.filter(packed=False,online=True)
    pack = invo.filter(packed=True,derivered=False)
    deriver = invo.filter(derivered=True,receved=False)
    receive = invo.filter(receved=True)

    msg={
          'msg_swa':'Zote',
          'msg_eng':'All'
    } 
    if packed:
          invo = pack 
          msg={
                  'msg_swa':'Zilizofungwa',
                  'msg_eng':'Packed'
            } 
    if derivered:
          invo = deriver 
          msg={
                  'msg_swa':'Zilizotumwa',
                  'msg_eng':'Derivered'
            } 
    if received:
          invo = receive 
          msg={
                  'msg_swa':'Zilizopokelewa',
                  'msg_eng':'Received'
            } 


    if pend:
          invo = pending 
          msg={
                  'msg_swa':'Zinazosubiri..',
                  'msg_eng':'Pending..'
            } 
    unpaid = invo.filter(ilolipwa=0)
    less = invo.filter(full_paid=False).exclude(ilolipwa=0)
    timel = invo.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))
    
    if lis_t ==2:
          invo = unpaid
    elif lis_t ==3:
          invo = less
    elif lis_t == 5:
          invo = timel  

           

        
                
    num = invo.count()
    invoin = invo.order_by("-pk")

    
    p=Paginator(invoin,15)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages
    todo.update({
      'muda':timel ,  
      'unpaid':unpaid,
      'less':less,
      'p_num':page_num,
      'pages':pg_number,
      'bil_num':num,
      'bili':page, 
      'receved':len(receive),
      'derivered':len(deriver),
      'packed':len(pack),
      'pend':len(pending),
      'msg':msg
      

    })
    return todo

@login_required(login_url='login')
def  giveForSales(request):
      todo = todoFunct(request)
      duka = todo['duka']
      
      lis_t = int(request.GET.get('lis_t',1))
      emp = request.GET.get('emp',0)

      invo = mauzoni.objects.filter(Interprise=duka,full_returned=False,order=False,labour__gt=0)
      employee = invo.filter(labour=emp)
      wakazi = invo.distinct('labour')

      if employee.exists():
            invo = employee

      
      unpaid = invo.filter(ilolipwa=0)
      less = invo.filter(full_paid=False).exclude(ilolipwa=0)
      timel = invo.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))
   
   
      if lis_t ==2:
            invo = unpaid
      elif lis_t ==3:
            invo = less
      elif lis_t == 5:
            invo = timel        
                  
      num = invo.count()
      invoin = invo.order_by("-pk")

      
      p=Paginator(invoin,15)
      page_num =request.GET.get('page',1)


      
      try:
            page = p.page(page_num)

      except EmptyPage:
            page= p.page(1)

      pg_number = p.num_pages

      todo.update({
            'muda':timel ,  
            'unpaid':unpaid,
            'less':less,
            'p_num':page_num,
            'pages':pg_number,
            'bil_num':num,
            'bili':page, 
            'wakazi':wakazi,
            'emp':emp
            })

      if not duka.Interprise:
            return redirect('/userdash')
      else:             
            return render(request,'giveForSaleList.html',todo)

@login_required(login_url='login')
def  newGiveForSale(request):
      todo = newInvo_funct(request)
      if not todo['duka'].Interprise:
            return redirect('/userdash')
      else:       
         return render(request,'giveForSaleNew.html',todo)

@login_required(login_url='login')
def printforInv(request):
     if request.method == "POST":
      try:
            todo = todoFunct(request)
            duka = todo['duka']
            pent = todo['pent']
            sP = ForPrintingPupose()
            PrExists = ForPrintingPupose.objects.filter(user=todo['useri'].id)
            if PrExists.exists():
                 sP = PrExists.last()
            sP.user = todo['useri']

            invo = int(request.POST.get('i',0))
            pu = int(request.POST.get('p',0))

            sP.user = todo['useri']
            if invo:
                sP.mauzo = mauzoni.objects.get(pk=invo,Interprise=duka)

            if pu:
                 sP.mauzo =   mauzoni.objects.get(pk=pu,user_customer__enteprise__in=[duka.id,pent.id])

            sP.expire =  datetime.datetime.now(tz=timezone.utc) + timedelta(seconds=60)     
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
     
            if x_forwarded_for:
               ip = x_forwarded_for.split(',')
            else:
               ip = request.META.get('REMOTE_ADDR')
            sP.ipaddre = ip
            sP.duka = duka
            sP.save()

            data = {
                 'success':True,
                 'id':sP.id
            }

            return JsonResponse(data)
      
      except:
            data = {
                  'success':False,
                  'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu, tafadhari jaribu tena',
                  'msg_eng':'The action was unsuccessfully, please Try again'
            }   

            return JsonResponse(data)
     else:
          data = {
               'success':False
          }
          return JsonResponse(data)
# VIEW INVOINCE DIRECTLY................................................................//
def viewOda_funct(request):
    intp= request.GET.get('item_valued','')
    back= request.GET.get('back_to','')
    code = request.GET.get('code','')
    lis_t= request.GET.get('lis_t',1)
    page_num =request.GET.get('page',1)

    msg = request.GET.get('msg',None)  

    todo =todoFunct(request)
    duka=todo['duka']
      #     user = duka.owner
      
      #     contacts= Interprise_contacts.objects.filter(Interprise=duka,show_to_invo=True)
            
    mauzo_yote = mauzoni.objects.filter(Interprise=duka,full_returned=False,order=True,cart=False)
    mauzo_ = mauzo_yote.last()

    unpaid = mauzo_yote.filter(ilolipwa=0)
    less = mauzo_yote.filter(full_paid=False).exclude(ilolipwa=0)
    
    timel = mauzo_yote.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))
    if int(lis_t) ==2:
   
          mauzo_yote = unpaid
    elif int(lis_t) ==3:
          mauzo_yote = less  
    elif int(lis_t) == 5:
          mauzo_yote = timel 


    if intp!='':
       mauzo_ = mauzoni.objects.get(pk=intp,Interprise=duka,cart=False)
    elif code!='' and intp=='':
        mauzo_ = mauzoni.objects.get(code=code,Interprise=duka,cart=False)
             
         

    list_mauzo = mauzoList.objects.filter(mauzo=mauzo_.id).exclude(idadi=F('returned'))
    reList = []

    for li in list_mauzo:
            pic = picha_bidhaa.objects.filter(bidhaa=li.produ.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url

            reList.append({
                  'itm':li,
                  'picha':picha
            })

    bei_used = []

    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.produ.bidhaa.id)
          
          for p in the_bei:
            bei = {
                  'id':p.id,
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id
            }
            
            bei_used.append(bei)

      #     matum = rekodiMatumizi.objects.filter(manunuzi_id=mauzo_.id,Interprise=duka.Interprise)
      #     user = UserExtend.objects.get(user = request.user.id )
 

   

    colors= sales_color.objects.filter(mauzo__mauzo=mauzo_.id)
    sizen= sales_size.objects.filter(mauzo__mauzo=mauzo_.id)

    itemImg=picha_bidhaa.objects.filter(picha__owner= duka.owner.user)
    rudi = Cash_order_return.objects.filter(ivo=mauzo_)
    malipo = wekaCash.objects.filter(invo=mauzo_)

    reg=businessReg.objects.filter(Interprise=duka.id,show_to_invo=True)
    phone = InterprisePermissions.objects.filter(Interprise=duka.id)

    todo.update({
     'reg':reg,
     'rudi':rudi,
     'malipo':malipo,   

    
    'lis_t':lis_t,    
    'pic':itemImg,

     

    'prices':bei_used,     
      
    'size':sizen,      
    'color':colors,      
    'contact':phone,   

    
   
    'the_bill':mauzo_,
    'list':reList,
      #     'back':back ,
    }) 

    todo.update(AllsaleOdaFuct(request))

    return todo  

# VIEW INVOINCE DIRECTLY................................................................//
def viewServ_funct(request):
    intp= request.GET.get('item_valued','')
    back= request.GET.get('back_to','')
    code = request.GET.get('code','')
    lis_t= request.GET.get('lis_t',1)
    page_num =request.GET.get('page',1)
    bk = int(request.GET.get('bk',0))
    rc = int(request.GET.get('rc',0))

    msg = request.GET.get('msg',None)  

    todo =todoFunct(request)
    duka=todo['duka']
      #     user = duka.owner
      
      #     contacts= Interprise_contacts.objects.filter(Interprise=duka,show_to_invo=True)
            
    mauzo_yote = mauzoni.objects.filter(Interprise=duka,full_returned=False,service=True)
    
    
    mauzo_ = mauzo_yote.last()
    mauzo_yote = mauzo_yote
    


    unpaid = mauzo_yote.filter(ilolipwa=0)
    less = mauzo_yote.filter(ilolipwa__gt=0).exclude(amount=F('ilolipwa'))
    change = mauzo_yote.filter(change=True)
    timel = mauzo_yote.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))
    
    if int(lis_t) ==2:
  
          mauzo_yote = unpaid
    elif int(lis_t) ==3:
          mauzo_yote = less  
#     elif int(lis_t) == 5:
#           mauzo_yote = timel 


    if intp!='':
            mauzo_ = mauzoni.objects.get(pk=intp,Interprise=duka)
    elif code!="" and intp=='':
        mauzo_ = mauzoni.objects.get(code=code,Interprise=duka)
             
    if mauzo_.order:
          mauzo_yote = mauzo_yote.filter(order=True)  
          unpaid = unpaid.filter(order=True)  
          less = less.filter(order=True)  
          timel = mauzo_yote.filter(order=True,servTo__lte=datetime.datetime.now(tz=timezone.utc))  

    if not mauzo_.order and not mauzo_.receved:
          mauzo_yote = mauzo_yote.filter(order=False,receved=False)
          unpaid = unpaid.filter(order=False,receved=False)  
          less = less.filter(order=False,receved=False)  
          timel = mauzo_yote.filter(order=False,receved=False,servTo__lte=datetime.datetime.now(tz=timezone.utc)) 

    if  mauzo_.receved:
          mauzo_yote = mauzo_yote.filter(receved=True)
          unpaid = unpaid.filter(receved=True)  
          less = less.filter(receved=True)  
          timel = timel.filter(receved=True) 
          
    if mauzo_.receved and int(lis_t) == 5:
          mauzo_yote = mauzo_yote.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))       
    elif int(lis_t) == 5:
         mauzo_yote = mauzo_yote.filter(servTo__lte=datetime.datetime.now(tz=timezone.utc))      
         timel = mauzo_yote

    if int(lis_t) == 8:
          mauzo_yote =  mauzo_yote.filter(change=True)    

    list_mauzo = mauzoList.objects.filter(mauzo=mauzo_.id).exclude(idadi=F('returned'))
    reList = []

    for li in list_mauzo:
            pic = picha_bidhaa.objects.filter(bidhaa=li.produ.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url

            reList.append({
                  'itm':li,
                  'picha':picha
            })

    bei_used = []

    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.produ.bidhaa.id)
          
          for p in the_bei:
            bei = {
                  'id':p.id,
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id
            }
            
            bei_used.append(bei)

      #     matum = rekodiMatumizi.objects.filter(manunuzi_id=mauzo_.id,Interprise=duka.Interprise)
      #     user = UserExtend.objects.get(user = request.user.id )
 
     

    num = mauzo_yote.count()
    invoin = mauzo_yote.order_by("-pk")




    
    p=Paginator(invoin,15)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages
   

    colors= sales_color.objects.filter(mauzo__mauzo=mauzo_.id)
    sizen= sales_size.objects.filter(mauzo__mauzo=mauzo_.id)

    itemImg=picha_bidhaa.objects.filter(picha__owner= duka.owner.user)
   
    malipo = wekaCash.objects.filter(invo=mauzo_)

    reg=businessReg.objects.filter(Interprise=duka.id,show_to_invo=True)
    phone = InterprisePermissions.objects.filter(Interprise=duka.id)

    todo.update({
     'reg':reg,
   
     'malipo':malipo,   
    'lis_t':int(lis_t),    
    'pic':itemImg,
    'prices':bei_used,     
    'size':sizen,      
    'color':colors,      
    'contact':phone,   
    'bk':bk,
    'the_bill':mauzo_,
    'list':reList,
    'muda':timel ,  
      'unpaid':unpaid,
      'less':less,
      'p_num':page_num,
      'pages':pg_number,
      'bil_num':num,
      'bili':page, 
      'change':change, 
      #     'back':back ,
    }) 

    

    return todo  

# VIEW RETURNED ITEMS DIRECTLY................................................................//
def viewRetn_funct(request,intp,back,what,code,lis_t,page_num):

    todo =todoFunct(request)
    duka=todo['duka']
    #     contacts= Interprise_contacts.objects.filter(Interprise=duka,show_to_invo=True)
       
    return_zote = sale_return.objects.filter(Interprise=duka)
    retrn_ = return_zote.last()

    unpaid = sale_return.objects.filter(Interprise=duka,ilolipwa=0,amount__gt=0)
    less = sale_return.objects.filter(Interprise=duka,ilolipwa__gt=0).exclude(amount=F('ilolipwa'))
    
    if int(lis_t) ==2:
          return_zote = unpaid
    elif int(lis_t) ==3:
          return_zote = less  
    

    if intp!='':
      if sale_return.objects.filter(pk=intp,Interprise=duka).exists():
            retrn_ = sale_return.objects.get(pk=intp,Interprise=duka)
    elif sale_return.objects.filter(code=code,Interprise=duka).exists() and intp=='':
        retrn_ = sale_return.objects.get(code=code,Interprise=duka)
             
         

    list_mauzo = mauzoList.objects.filter(mauzo=retrn_.ivo.id,returned__gt = 0)
  


    idad_ = sa_ret.objects.filter(ret=retrn_.id)


    reList = []

    for li in idad_:
            pic = picha_bidhaa.objects.filter(bidhaa=li.sa_list.produ.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url

            reList.append({
                  'itm':li,
                  'picha':picha
            })    

    bei_used = []

    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.produ.bidhaa.id)
          for p in the_bei:
            bei = [{
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id

            }]
            bei_used+=bei

      #     matum = rekodiMatumizi.objects.filter(manunuzi_id=retrn_.id,Interprise=duka.Interprise)
      #     user = UserExtend.objects.get(user = request.user.id )
      

    num = return_zote.count()
    invoin = return_zote.order_by("-pk")




    
    p=Paginator(invoin,15)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    Akaunti =  sale_return_mauzo_fidia.objects.filter(sale_rtn=retrn_.id) 
     

    colors= sa_col_ret.objects.filter(ret=retrn_.id)
    sizen= sa_size_ret.objects.filter(ret=retrn_.id)

   
    todo.update({
     'malipo': Akaunti,   
    'lis_t':lis_t,    
     'unpaid':unpaid,
     'less':less,     
    'prices':bei_used,     
    'then':what,     
    'size':sizen,      
    'color':colors,      
          
    'p_num':page_num,
    'pages':pg_number,
    'bil_num':num,
    'bili':page, 
    'the_bill':retrn_,
    'list':reList,
      #     'back':back ,
    })

    return todo  

# VIEW RETURNED ITEMS DIRECTLY................................................................//
def viewRefnd_funct(request):

    intp= request.GET.get('item_valued','')
    back= request.GET.get('back_to','')
    code = request.GET.get('code','')
    lis_t= request.GET.get('lis_t',1)
    page_num =request.GET.get('page',1)  

    todo =todoFunct(request)
    duka=todo['duka']
      #     user = duka.owner
      
      #     contacts= Interprise_contacts.objects.filter(Interprise=duka,show_to_invo=True)
            
    return_zote = Cash_order_return.objects.filter(ivo__Interprise=duka)
    retrn_ = return_zote.last()

      #     unpaid = sale_return.objects.filter(Interprise=duka,ilolipwa=0,amount__gt=0)
      #     less = sale_return.objects.filter(Interprise=duka,ilolipwa__gt=0).exclude(amount=F('ilolipwa'))
      
      #     if int(lis_t) ==2:
      #           return_zote = unpaid
      #     elif int(lis_t) ==3:
      #           return_zote = less  
      

    if intp!='':
      od_r =  Cash_order_return.objects.filter(pk=intp,ivo__Interprise=duka)   
      if od_r.exists():
            retrn_ = Cash_order_return.objects.get(pk=intp,ivo__Interprise=duka)
    elif Cash_order_return.objects.filter(ivo__code=code,ivo__Interprise=duka).exists() and intp=='':
        retrn_ = Cash_order_return.objects.filter(code=code,ivo__Interprise=duka).last()
             
         

    list_mauzo = mauzoList.objects.filter(mauzo=retrn_.ivo.id)
    reList = []

    for li in list_mauzo:
            pic = picha_bidhaa.objects.filter(bidhaa=li.produ.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url

            reList.append({
                  'itm':li,
                  'picha':picha
            })    

    bei_used = []

    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.produ.bidhaa.id)
          for p in the_bei:
            bei = [{
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id

            }]
            bei_used+=bei

      #     matum = rekodiMatumizi.objects.filter(manunuzi_id=retrn_.id,Interprise=duka.Interprise)
      #     user = UserExtend.objects.get(user = request.user.id )
      

    num = return_zote.count()
    invoin = return_zote.order_by("-pk")




    
    p=Paginator(invoin,15)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    colors= sales_color.objects.filter(mauzo__mauzo=retrn_.ivo.id,returned__gt = 0)
    sizen= sales_size.objects.filter(mauzo__mauzo=retrn_.ivo.id,returned__gt = 0)
  #     malipo= Cash_order_return.objects.filter(ivo=retrn_.ivo.id)

    
    todo.update({
  #      'malipo':malipo,     
    'lis_t':lis_t,    
  #      'unpaid':unpaid,
   #      'less':less,     
    'prices':bei_used,     
#     'then':what,     
    'size':sizen,      
    'color':colors,      
    'p_num':page_num,
    'pages':pg_number,
    'bil_num':num,
    'bili':page, 
    'the_bill':retrn_,
    'list':reList,
 #     'back':back ,
    }) 

    return todo  

# RemoveInvo ...................................................//
@login_required(login_url='login')
def  ondoaInvo(request):
     value= request.GET.get('val','')
   
     try:
            duka = InterprisePermissions.objects.get(user__user =request.user, default = True,Allow=True)

           
            bill = mauzoni.objects.get(pk=value,Interprise=duka.Interprise.id)
            Ortn = Cash_order_return.objects.filter(ivo=bill.id)
            if bill.By == duka or duka.owner:
                  if Ortn.exists():
                        bill.full_returned=True
                        bill.save()
                        mauzoList.objects.filter(mauzo=bill.id).update(returned=F('idadi'))
                  else:
                        bill.delete()

            if bill.order: 
                        if  mauzoni.objects.filter(Interprise=duka.Interprise.id,order=True).exists():
                                    the_id = mauzoni.objects.filter(Interprise=duka.Interprise.id,order=True).last()
                                    return redirect('/mauzo/viewOda?item_valued='+str(the_id.id))
                        else:
                              return redirect('saleOda') 
            else:      
                        if  mauzoni.objects.filter(Interprise=duka.Interprise.id,order=False).exists():
                                    the_id = mauzoni.objects.filter(Interprise=duka.Interprise.id,order=False).last()
                                    return redirect('/mauzo/viewInvo?item_valued='+str(the_id.id))
                        else:
                              return redirect('mauzo') 
     except:
           return render(request,'errorpage.html',todoFunct(request))

# LOAD INVOINCE DATA ...................................................//
@login_required(login_url='login')
def  viewInvo(request):
    try:
      todo = viewInvo_funct(request)

      bil = todo['the_bill']

      if bil.order:  
           return redirect('/mauzo/viewOda?item_valued='+str(bil.id))
      elif bil.service:
           return redirect('/mauzo/viewServing?item_valued='+str(bil.id))
      else:
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:            
                return render(request,'viewInvo.html',todo)
    except:
            todo =todoFunct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:             
                   return render(request,'no_invo.html',todo)       

# VIEW INVOICE...................................................//
@login_required(login_url='login')
def  viewServing(request):
    try:
      todo = viewServ_funct(request)
      bil = todo['the_bill']
      if bil.service:  
           duka = todo['duka']
           starti = bil.servFrom < datetime.datetime.now(tz=timezone.utc) 
           sale_no = 1
           return_str=''
           if Cash_order_return.objects.filter(ivo__Interprise=duka.id).exists():
                 invo_no = Cash_order_return.objects.filter(ivo__Interprise=duka.id).last()          
                 sale_no = invo_no.Invo_no          
           if sale_no <10:
                 return_str = '0000'+str(sale_no)
           elif sale_no <100 and sale_no >=10:
                 return_str = '000' +str(sale_no)    
           elif sale_no <1000 and sale_no >=100:
                 return_str = '00' +str(sale_no)    
           elif sale_no <10000 and sale_no >=1000:
                 return_str = '0' +str(sale_no)    
           elif sale_no >=10000 :
                 return_str =str(sale_no)    

           chages = ChangedService.objects.filter(Q(from_serv=bil.id)|Q(to_serv__To=bil.id)|Q(From__From=bil.id))      

           todo.update({
                    'acs':PaymentAkaunts.objects.filter(Interprise=duka.id),
                    'ref':return_str,
                    'changed':chages.filter(from_serv=bil.id),
                    'changedFrom':chages.filter(From__From=bil.id),
                    'changedTo':chages.filter(to_serv__To=bil.id)
              })     


           if bil.order: 
              if bil.online and not bil.packed: 

                    return redirect('/mauzo/viewCustomOrder?ord='+str(bil.id))
              else:    
                  todo.update({
                        'acs':PaymentAkaunts.objects.filter(Interprise=duka.id),
                        'starting':starti,
                        'ref':return_str,
                        
                  }) 
                  if not duka.Interprise:
                        return redirect('/userdash')
                  else: 
                         return render(request,'viewInvoBooking.html',todo)
           elif not bil.order and not bil.receved:
              todo.update({
                  'servsN':len(todo['list']), 
                  'fqty':todo['list'][0]['itm'].idadi,
                  
              })  
              if not duka.Interprise:
                  return redirect('/userdash')
              else:                
                 return render(request,'viewInvoServing.html',todo)  

           else:
              
                  if not duka.Interprise:
                        return redirect('/userdash')
                  else:                    
                         return render(request,'viewInvoServ.html',todo) 
      else:
            if not duka.Interprise:
                  return redirect('/userdash')
            else:             
                 return redirect('/mauzo/viewInvo?item_valued='+str(bil.id))

    except:
            todo =todoFunct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:  
                  if not todo['duka'].Interprise:
                        return redirect('/userdash')
                  else:                              
                       return render(request,'no_invo.html',todo) 


# CHANGE SERVICE
@login_required(login_url='login')
def  ExchangeServs(request):
    try:
      todo = viewServ_funct(request)
      bil = todo['the_bill']
      if bil.service:  
           
           if not bil.order and not bil.receved:
                  if not todo['duka'].Interprise:
                        return redirect('/userdash')
                  else: 
                      return render(request,'ServingExchange.html',todo) 
           else:
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:             
               return redirect('/mauzo/viewServing?item_valued='+str(bil.id)) 
              

      else:
           return redirect('/mauzo/viewInvo?item_valued='+str(bil.id))

    except:
            todo =todoFunct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:             
                   return render(request,'no_invo.html',todo) 



@login_required(login_url='login')
def  endServs(request):
    try:
      todo = viewServ_funct(request)
      bil = todo['the_bill']
      if bil.service:  
           duka = todo['duka']
           if bil.order: 
              starti = bil.servFrom < datetime.datetime.now(tz=timezone.utc) 
              sale_no = 1
              return_str=''
              if Cash_order_return.objects.filter(ivo__Interprise=duka.id).exists():
                    invo_no = Cash_order_return.objects.filter(ivo__Interprise=duka.id).last()
              
                    sale_no = invo_no.Invo_no

              if sale_no <10:
                    return_str = '0000'+str(sale_no)
              elif sale_no <100 and sale_no >=10:
                    return_str = '000' +str(sale_no)    
              elif sale_no <1000 and sale_no >=100:
                    return_str = '00' +str(sale_no)    
              elif sale_no <10000 and sale_no >=1000:
                    return_str = '0' +str(sale_no)    
              elif sale_no >=10000 :
                    return_str =str(sale_no)

      
  
              todo.update({
                    'acs':PaymentAkaunts.objects.filter(Interprise=duka.id),
                    'starting':starti,
                   'ref':return_str,
                    
              }) 
              if not duka.Interprise:
                  return redirect('/userdash')
              else: 
                  return render(request,'viewInvoBooking.html',todo)
           elif not bil.order and not bil.receved:
              todo.update({
                  'servsN':len(todo['list']), 
                  'fqty':todo['list'][0]['itm'].idadi
              })  
              if not duka.Interprise:
                  return redirect('/userdash')
              else:                
                  return render(request,'viewInvoServingSomeComplete.html',todo)  

           else:   
                  if not duka.Interprise:
                        return redirect('/userdash')
                  else:             
                          return render(request,'viewInvoServ.html',todo) 
      else:
           return redirect('/mauzo/viewInvo?item_valued='+str(bil.id))

    except:
            todo =todoFunct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:             
                return render(request,'no_invo.html',todo) 

# LOAD INVOINCE DATA ...................................................//
@login_required(login_url='login')
def  viewOda(request):
    try:
     
      todo=viewOda_funct(request)
      duka= todo['duka']
      sale_no = 1
      return_str=''
      if Cash_order_return.objects.filter(ivo__Interprise=duka).exists():
            invo_no = Cash_order_return.objects.filter(ivo__Interprise=duka).last()
      
            sale_no = invo_no.Invo_no

      if sale_no <10:
            return_str = '0000'+str(sale_no)
      elif sale_no <100 and sale_no >=10:
            return_str = '000' +str(sale_no)    
      elif sale_no <1000 and sale_no >=100:
            return_str = '00' +str(sale_no)    
      elif sale_no <10000 and sale_no >=1000:
            return_str = '0' +str(sale_no)    
      elif sale_no >=10000 :
            return_str =str(sale_no)

      
      acs =  {
            'acs':PaymentAkaunts.objects.filter(Interprise=duka.id),
              'ref':return_str         
            }
      
      todo.update(acs)

      oda = todo['the_bill']

     

      if oda.order and ((oda.online and not oda.packed) or not oda.service) :

            if oda.online and not todo['the_bill'].packed:
               return redirect('/mauzo/viewCustomOrder?ord='+str(todo['the_bill'].id))
            else:
                  if not duka.Interprise:
                        return redirect('/userdash')
                  else:                   
                       return render(request,'viewOda.html',todo)    
      elif oda.service and (not oda.online or  oda.packed):   
             return redirect('/mauzo/viewServing?item_valued='+str(oda.id))        
      else:
            return redirect('/mauzo/viewInvo?item_valued='+str(oda.id))        
    
    except:
            todo =todoFunct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:             
                   return render(request,'no_OdaFound.html',todo)

@login_required(login_url='login')
def inservice(request):  
    todo=todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'inserviceInvo.html',todo)

@login_required(login_url='login')
def HudumiaHuduma(request):  
    todo=todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'inserviceServs.html',todo)

@login_required(login_url='login')
def inserviceBook(request):  
    todo=todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
      return render(request,'inserviceBookingInvo.html',todo)

@login_required(login_url='login')
def SevicesBook(request):  
    todo=todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'inserviceBookingServs.html',todo)

@login_required(login_url='login')
def Inservings(request): 
      if request.method == "POST":
            try:
                  todo=todoFunct(request)
                  duka = todo['duka']
                  t = datetime.datetime.now(tz=timezone.utc)
                  b = int(request.POST.get('b',0))
                

                  # timi = timezone.make_aware(t,True)

                  # print({'timi':timi,'t':t})
                  
                  inserv = mauzoni.objects.filter(Interprise=duka.id,service=True).order_by('-pk')
                  if b:
                        inserv = inserv.filter(order=True,cart=False)
                        
                  else:      
                        inserv = inserv.filter(order=False,receved=False)
                        
                  inservs = list(inserv.annotate(NaF=F('By__user__user__first_name'),NaL=F('By__user__user__last_name')).values('code','amount','ilolipwa','mteja_jina','id','servFrom','servTo','desc','NaF','NaL'))
                  
                  data={
                        'success':True,
                        'servs':inservs
                  }
                     
                  return JsonResponse(data)

            except:
                  data = {
                        "success":False,
                       'servs':[]

                  }

                  return JsonResponse(data)
      else:
            return render(request,'pagenotFound.html',todo)

@login_required(login_url='login')
def ServiceStarted(request): 
      if request.method == "POST":
            try:
                  todo=todoFunct(request)
                  duka = todo['duka']
                  bil = int(request.POST.get('bill',0))
                  complete = int(request.POST.get('c',0))
                  starting = int(request.POST.get('s',0))
                  serv=mauzoni.objects.get(pk=bil,Interprise=duka.id)
                               
                  if serv.By == todo['cheo'] or todo['useri'] == duka.owner:
                        data={
                              'success':True,
                              'msg_swa':'Statasi ya huduma iliyowekewa nafasi imebadilishwa kikamilifu',
                              'msg_eng':'Service booking status changed to servicing successfully'
                        }                        
                        # If service is starting
                        if starting:
                              serv.order = False
                             
                                                     
                        if complete:
                              serv.receved = True 
                              data={
                                    'success':True,
                                    'msg_swa':'Statasi ya huduma  imebadilishwa kikamilifu',
                                    'msg_eng':'Service status changed to serviced successfully'
                              }                        
                             
                        serv.save()

                        
                        return JsonResponse(data)
                  else:
                        data = {
                              "success":False,
                              'msg_swa':'Hauna Ruhusa hii kwa sasa tafadhari wasiliana na uongozi ',
                              'msg_eng':'You have no permission for this action please contact admin'

                              }

                        return JsonResponse(data)   
            except:
                  data = {
                        "success":False,
                         'msg_swa':'Kitendo hakikukamilika kutokana na hitilafu tafadhari jaribu tena',
                         'msg_eng':'The action was not successfully please try again'

                  }

                  return JsonResponse(data)
      else:
            return render(request,'pagenotFound.html',todo)

@login_required(login_url='login')
def EndSomeServs(request): 
   if request.method == 'POST':     
      try:   
            intp= request.POST.get('item_valued',0)
            the_data = request.POST.get('rtn_data',None)
            todo = todoFunct(request)
            duka =  todo['duka']
            cheo = todo['cheo']

            uzo = mauzoni.objects.get(pk=intp,Interprise=duka.id)
            if uzo.By == cheo or todo['useri'] == duka.owner and the_data is not None:  
                  
                  the_data = json.loads(the_data) 

                  msg={'success':True,'swa':'Rekodi ya kukamilisha baadhi ya huduma imefanikiwa kikamilifu','eng':'Some complete services saved successfully'}
            
                  for z in the_data:
                        retnd = mauzoList.objects.get(pk=z['val'],mauzo=uzo.id)
                        retnd.serviceReturn = float(retnd.serviceReturn) + float(z['retn'])
                        retnd.save() 

                        if sales_color.objects.filter(pk=z['color'],mauzo=retnd.id).exists():
                              cl__ = sales_color.objects.get(pk=z['color'],mauzo=retnd.id)
                              cl__.serviceReturn = float(cl__.serviceReturn)+ float( z['retn'])
                              cl__.save()  
                        
                        if sales_size.objects.filter(pk=z['size'],mauzo=retnd.id).exists():
                              sz__ = sales_size.objects.get(pk=z['size'],mauzo=retnd.id)
                              sz__.serviceReturn = float(sz__.serviceReturn) + float( z['retn'])
                              sz__.save()  
                        
                  sumi = mauzoList.objects.filter(mauzo=uzo.id).aggregate(Sum('idadi'))['idadi__sum']
                  tt = mauzoList.objects.filter(mauzo=uzo.id).aggregate(jumla=Sum('serviceReturn'))['jumla']

                  # compare  complete & uncomplete serviceses if are sum
                  if tt == sumi:
                        uzo.receved =True
                  
                  uzo.save()
      
            else:
      
                  msg={'success':False,'swa':'Rekodi  ya kukamilisha  Haukufanikiwa tafadhari jaribu tena kwa usahihi','eng':'Service terminating not saved please try again correctly'}
                  

            return JsonResponse(msg)
      except:

            msg={'success':False,'swa':'Rekodi  ya kukamilisha  Haukufanikiwa tafadhari jaribu tena kwa usahihi','eng':'Service terminating not saved please try again correctly'}
            return JsonResponse(msg)    
   else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

# Excanging some services.................................................................//
@login_required(login_url='login')
def ChangeSomeServs(request): 
   if request.method == 'POST':     
      try:   
            intp= request.POST.get('item_valued',0)
            the_data = request.POST.get('rtn_data',None)
            why = request.POST.get('return_reson','')
            tare = request.POST.get('ChangedDate',datetime.datetime.now(tz=timezone.utc))

            todo = todoFunct(request)
            duka =  todo['duka']
            cheo = todo['cheo']

            msg = {}

            uzo = mauzoni.objects.get(pk=intp,Interprise=duka.id)
            
            if uzo.By == cheo or todo['useri'] == duka.owner and the_data is not None:  
                  invono = 1
                  invo_str=''

                  if mauzoni.objects.filter(Interprise=duka).exists():
                        invo_no = mauzoni.objects.filter(Interprise=duka).last()
                  
                        invono = invo_no.Invo_no

                  if invono <10:
                        invo_str = '0000'+str(invono)
                  elif invono <100 and invono >=10:
                        invo_str = '000' +str(invono)    
                  elif invono <1000 and invono >=100:
                        invo_str = '00' +str(invono)    
                  elif invono <10000 and invono >=1000:
                        invo_str = '0' +str(invono)    
                  elif invono >=10000 :
                        invo_str =str(invono)  


                  the_data = json.loads(the_data) 
                  mauzi  = mauzoni()
                  mauzi.Interprise = uzo.Interprise
                  mauzi.code = invo_str
                  mauzi.amount = 0
                  mauzi.ilolipwa = 0
                  mauzi.date = uzo.date
                  mauzi.kulipa = uzo.kulipa
                  mauzi.tarehe = uzo.tarehe
                  mauzi.Invo_no = invono + 1
                  mauzi.saved_custom = uzo.saved_custom
                  mauzi.mteja_jina = uzo.mteja_jina
                  mauzi.simu = uzo.simu
                  mauzi.address = uzo.address
                  mauzi.mail = uzo.mail
                  mauzi.customer_id = uzo.customer_id
                  mauzi.user_customer = uzo.user_customer
                  mauzi.receved = uzo.receved
                  mauzi.change = True
                  mauzi.Changed = tare
                  mauzi.desc = why
                  mauzi.desc = why
                  mauzi.By = cheo
                  mauzi.service = True
                  mauzi.servFrom = uzo.servFrom
                  mauzi.servTo = uzo.servTo
                  mauzi.save()

                  msg={'bil':mauzi.id,'success':True,'swa':'Rekodi ya Kubadilisha baadhi ya huduma imefanikiwa kikamilifu','eng':'Some Changed services saved successfully'}

            
                  for z in the_data:
                        retnd = mauzoList.objects.get(pk=z['val'],mauzo__in=[uzo.id,mauzi.id])
                        exchL = mauzoList() 
                        if  retnd.mauzo == uzo:
                            retndach = mauzoList.objects.filter(produ=retnd.produ.id,mauzo=mauzi.id)
                            if retndach.exists():
                               retndach.update(idadi=F('idadi')+float(z['retn'])) 
                               exchL = retndach.last()
                            else:
                                  exchL.mauzo = mauzi    
                                  exchL.idadi = float(z['retn'])   
                                  exchL.jum = retnd.jum   
                                  exchL.bei = retnd.bei   
                                  exchL.bei_og = retnd.bei_og   
                                  exchL.produ = retnd.produ   
                                  exchL.serial = retnd.serial   
                                  exchL.saveT = retnd.saveT   
                                  exchL.save()

                            retnd.idadi =float(float(retnd.idadi) - float(z['retn']))
                            retnd.save()



                            exCl = sales_color()
                            if sales_color.objects.filter(pk=z['color'],mauzo=retnd.id).exists():
                                    cl__ = sales_color.objects.get(pk=z['color'],mauzo=retnd.id)        
                                
                                    exCll = sales_color.objects.filter(color=cl__.color,mauzo=exchL.id) 
                                    if exCll.exists():
                                          exCll.update(idadi=F('idadi')+float(z['retn']))
                                          exCl = exCll.last()
                                    else:      
                                          exCl.mauzo = exchL
                                          exCl.bidhaa = cl__.bidhaa
                                          exCl.color = cl__.color
                                          exCl.idadi = float(z['retn'])
                                          exCl.price = cl__.price
                                          exCl.packed = cl__.packed
                                          exCl.save()
                                    cl__.idadi = float(float(cl__.idadi )- float(z['retn']))                                                                                    
                                    cl__.save()                                                                                   

                            
                            if sales_size.objects.filter(pk=z['size'],mauzo=retnd.id).exists():
                                  sz__ = sales_size.objects.get(pk=z['size'],mauzo=retnd.id)
                                  if sz__.idadi == z['retn']:
                                        sz__.mauzo = exchL
                                        sz__.color = exCl
                                        sz__.save()
                                  else:
                                       exSz =  sales_size() 
                                       exSz.mauzo = exchL
                                       exSz.bidhaa = sz__.bidhaa
                                       exSz.size = sz__.size
                                       exSz.idadi = float(z['retn'])
                                       exSz.color = exCl
                                       exSz.price = sz__.price
                                       exSz.packed = sz__.packed
                                       exSz.save()

                  changesFrom = ChangedServiceFrom()          
                  changesFrom.From = uzo  
                  changesFrom.save() 

                  changes = ChangedService()
                  changes.from_serv = mauzi
                  changes.From = changesFrom
                  changes.save() 

                  listedF =  mauzoList.objects.filter(mauzo=uzo.id)
                  sales_color.objects.filter(mauzo__mauzo=uzo.id,idadi=0).delete()
                  sales_size.objects.filter(mauzo__mauzo=uzo.id,idadi=0).delete()

                  listedF.filter(idadi=0).delete()    
                   
                  sumA = listedF.aggregate(sumi = Sum(F('bei')*F('idadi')*F('saveT'),output_field=FloatField()))['sumi']  or 0
                  sumA2 = mauzoList.objects.filter(mauzo=mauzi.id).aggregate(sumi = Sum(F('bei')*F('idadi')*F('saveT'),output_field=FloatField()))['sumi']  or 0

                
                  uzo.amount = float(sumA)
                  if uzo.ilolipwa > sumA:
                        mauzi.ilolipwa = float(float(uzo.ilolipwa) - float(sumA))
                        uzo.ilolipwa = float(sumA)

                  mauzi.amount = float(sumA2)
                  mauzi.receved = True
                  mauzi.save()
                  uzo.save()

                  if not listedF.exists() or listedF.aggregate(sum=Sum(F('idadi')))['sum'] <= 0 :
                        mauzoni.objects.filter(pk=uzo.id).delete()

            else:
      
                  msg={'success':False,'swa':'Rekodi  ya kubadilisha  Haukufanikiwa tafadhari jaribu tena kwa usahihi','eng':'Service changes was not saved please try again correctly'}
                  

            return JsonResponse(msg)
      except:

            msg={'success':False,'swa':'Rekodi  ya kubadilisha  Haukufanikiwa tafadhari jaribu tena kwa usahihi','eng':'Service changes was not saved please try again correctly'}
            return JsonResponse(msg)    
   else:
       return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def changeServs(request): 
   if request.method == 'POST':     
      try:   
            intp= request.POST.get('servBil',0)
            reason = request.POST.get('kurudisaSababu',None)
            timely = request.POST.get('ChangedDate')
            todo = todoFunct(request)
            duka =  todo['duka']
            cheo = todo['cheo']

            uzo = mauzoni.objects.get(pk=intp,Interprise=duka.id)
            msg={'bl':uzo.id,'success':True,'msg_swa':'Ankara ya huduma zinazobadilishwa imefanikiwa kikamilifu','msg_eng':'Invoice for service changes was successfully'}

            if uzo.By == cheo or todo['useri'] == duka.owner and reason is not None:  
                  uzo.change = True
                  uzo.desc = reason
                  uzo.Changed = timely
                  uzo.receved = True
                  uzo.save()

                  changes = ChangedService()
                  changes.from_serv = uzo
                  changes.save() 

            else:
                  msg={'success':False,'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena kwa usahihi','msg_eng':'Action was not successfully please try again correctly'}
                  
            return JsonResponse(msg)
      except:

            msg={'success':False,'msg_swa':'Kitendo Hakikufanikiwa tafadhari jaribu tena kwa usahihi','msg_eng':'Action was not successfully please try again correctly'}
            return JsonResponse(msg)    
   else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def HudumiaHudumaData(request): 
      if request.method == "POST":
            try:
                  todo=todoFunct(request)
                  duka = todo['duka']
                  t = datetime.datetime.now(tz=timezone.utc)
                  b = int(request.POST.get('b',0))
                  s = int(request.POST.get('serv',1))

                  # timi = timezone.make_aware(t,True)

                  # print({'timi':timi,'t':t})
                  
                  inserved = mauzoList.objects.filter(mauzo__Interprise=duka.id,mauzo__service=s)
                  if b:
                        inserved = inserved.filter(mauzo__order=True)
                  else:
                        inserved = inserved.filter(mauzo__order=False,mauzo__receved=False)      
                        
                  inserv = inserved.annotate(ilolipwa=F('mauzo__ilolipwa'),kiasi=F('mauzo__amount'),aina=F('produ__bidhaa__bidhaa_aina'),ainaName=F('produ__bidhaa__bidhaa_aina__aina'),bidhaa=F('produ__bidhaa__bidhaa_jina'),vipimo_jum=F('produ__bidhaa__vipimo_jum'),vipimo=F('produ__bidhaa__vipimo'),uwiano=F('produ__bidhaa__idadi_jum'),From=F('mauzo__servFrom'),To=F('mauzo__servTo'),timely=F('produ__timely'),mteja=F('mauzo__mteja_jina'),code=F('produ__bidhaa__namba'),expected=F('mauzo__expected_date'),Agizwa=F('mauzo__date'),dueDate=F('mauzo__kulipa'),online=F('mauzo__online'))
                  inservs = list(inserv.order_by('-pk').values())
                  
                 
                  data={
                        'success':True,
                        'servs':inservs,
                        
                  }
                     
                  return JsonResponse(data)

            except:
                  data = {
                        "success":False,
                       'servs':[]

                  }

                  return JsonResponse(data)
      else:
            return render(request,'pagenotFound.html',todo)

#VIEW ORDERED ITEMS VIA ONLINE................................................//
@login_required(login_url='login')
def viewCustomOrder(request):
  try:
      todo=todoFunct(request)
      duka = todo['duka']
      cheo = todo['cheo']
      
      ord = request.GET.get('ord')
      itms=mauzoList.objects.filter(mauzo__Interprise=duka,mauzo__order=True,mauzo__cart=False,mauzo=ord)
      # mauzoni.objects.filter(pk=itms.last().mauzo.id).delete()
      # if not itms.exists():
      #       itms=mauzoList.objects.filter(mauzo__Interprise=shop.id,mauzo__order=True,mauzo__cart=False,pk=sa)
      
      totol = None 
      itm = [] 
      how_many_ = 0
      if itms.exists():
            totol = mauzoni.objects.get(pk=itms.last().mauzo.id)
            def  checkprice(bein,it):
                  prices = [{'idadi':1,'bei':it.Bei_kuuza,'vipimo':it.bidhaa.vipimo}]
                  if it.bidhaa.idadi_jum  > 1:
                     prices.append({'idadi':int(it.bidhaa.idadi_jum),'bei':it.Bei_kuuza_jum,'vipimo':it.bidhaa.vipimo_jum})

                  bei = bei_za_bidhaa.objects.filter(item=it.bidhaa.id)

                  if bei.count() >0:
                        for b in bei:
                              prices.append({'idadi':int(b.idadi),'bei':b.bei,'vipimo':b.jina})

                  price = [x for x in prices if float(x["bei"]) == float(bein) ] 

                  

                  if len(price)>0:
                        
                      return price[0]

                  else:
                       return prices[0]
            
            for it in itms:
                  lis_t=  mauzoList.objects.get(pk=it.id)

                  color = sales_color.objects.filter(mauzo=it.id)

                  col_size=[]
                  if color.count()>0:
                        how_many = 0
                        for c in  color:
                        
                              size = []
                              szn=sales_size.objects.filter(color=c.id)
                              if szn.count() > 0:
                                    
                                    how_many +=len(szn)
                                    for sz in szn:
                                          servsS = 0
                                          if totol.service:
                                              servsS  = sales_size.objects.filter(size=sz.size.id,mauzo__mauzo__servTo__gte=lis_t.mauzo.servFrom,mauzo__mauzo__servFrom__lte=lis_t.mauzo.servTo,mauzo__mauzo__receved=False).exclude(mauzo__mauzo__online=True,packed=False).aggregate(sumi=Sum('idadi'))['sumi']  or 0       

                                          szz={
                                                'servs':servsS,  
                                                'rSpace':sz.size.idadi - servsS,    
                                                'size':sales_size.objects.get(pk=sz.id),
                                                'price': checkprice(sz.price,lis_t.produ) 
                                          }

                                          size.append(szz)
                              else:
                                    how_many+=1  
                              servsC = 0
                              if totol.service:
                                  servsC  = sales_color.objects.filter(color=c.color.id,mauzo__mauzo__servTo__gte=lis_t.mauzo.servFrom,mauzo__mauzo__servFrom__lte=lis_t.mauzo.servTo,mauzo__mauzo__receved=False).exclude(mauzo__mauzo__online=True,packed=False).aggregate(sumi=Sum('idadi'))['sumi']  or 0       

                              cl={
                                    'color':sales_color.objects.get(pk=c.id),
                                    'servs':servsC,
                                    'rSpace':c.color.idadi - servsC,
                                    'img':picha_bidhaa.objects.filter(color_produ=c.color.color.id),
                                    'size':size,
                                    'sizl':len(size),
                                    'price': checkprice(c.price,lis_t.produ) 
                              }
                              col_size.append(cl)
                        how_many_+=how_many   
                  else:
                        how_many_ += 1

                  servsIt = 0
                  if totol.service:
                      servsIt  = mauzoList.objects.filter(produ=lis_t.produ.id,mauzo__servTo__gte=lis_t.mauzo.servFrom,mauzo__servFrom__lte=lis_t.mauzo.servTo,mauzo__receved=False).exclude(mauzo__online=True,packed=False).aggregate(sumi=Sum('idadi'))['sumi']  or 0  
                  
                  dt={

                        'itm':lis_t,
                        'servs':servsIt,
                        'rSpace':lis_t.produ.idadi - servsIt,
                        'img':picha_bidhaa.objects.filter(bidhaa=it.produ.bidhaa),
                        'color_size':col_size,
                        'csl':len(col_size),
                        'price': checkprice(it.bei_og,lis_t.produ) 
                        
                  
                  }

                  # print(dt['rSpace'])

                  itm.append(dt)
                  
      

      todo.update({'itms':itm,'total':totol,'itl':how_many_})
      if not duka.Interprise:
            return redirect('/userdash')
      else: 
            return render(request,'viewCustomOrder.html',todo)   
  except:
      return render(request,'pagenotFound.html',todo)

# PACK ORDERED ITEMS ...................................................//
@login_required(login_url='login')
def setPack(request):
      
      todo = todoFunct(request)
      duka = todo['duka']
      data = {} 
      if request.method=="POST":
         try:
               c = request.POST.get('c')
               s = request.POST.get('s')
               i = request.POST.get('i')
               p = int(request.POST.get('p'))

                

            #    print({'i':i,'s':s,'c':c,'p':p})
               it = mauzoList.objects.filter(pk=i,mauzo__Interprise=duka.id)
               sc = sales_color.objects.filter(pk=c,mauzo=it.last().id)
               ss = sales_size.objects.filter(pk=s,mauzo=it.last().id)
               notSure = False

               uzo = it.last().mauzo

               if it.last().produ.produced:
                     notSure = it.last().produ.produced.notsure

            
               if ((it.last().idadi <= it.last().produ.idadi) or notSure ) or not p: 
                   
                  if ss.exists():
                        ls=ss.last()
                        if not uzo.service:
                              if p:
                                    produ_size.objects.filter(pk=ls.size.id).update(idadi=F('idadi')-ls.idadi) 
                                    produ_colored.objects.filter(pk=ls.color.color.id).update(idadi=F('idadi')-ls.idadi) 
                                    itm=bidhaa_stoku.objects.filter(pk=ls.mauzo.produ.id).update(idadi=F('idadi')-ls.idadi) 
                              else:
                                    produ_size.objects.filter(pk=ls.size.id).update(idadi=F('idadi')+ls.idadi) 
                                    produ_colored.objects.filter(pk=ls.color.color.id).update(idadi=F('idadi')+ls.idadi) 
                                    bidhaa_stoku.objects.filter(pk=ls.mauzo.produ.id).update(idadi=F('idadi')+ls.idadi) 

                        ss.update(packed=p)
                        unp=sales_size.objects.filter(color=ls.color.id).exclude(pk=ls.id,packed=bool(p))
                        if unp.count() == 0:
                              sales_color.objects.filter(pk=ls.color.id).update(packed=p)
                              unpc = sales_color.objects.filter(mauzo=ls.mauzo.id).exclude(packed=bool(p))
                              if unpc.count() == 0:
                                    mauzoList.objects.filter(pk=ls.mauzo.id).update(packed=p)
                              else :     
                                    mauzoList.objects.filter(pk=ls.mauzo.id).update(packed=False)
                        else:        
                              sales_color.objects.filter(pk=ls.color.id).update(packed=False)

                  if sc.exists():
                        lc = sc.last() 
                        if not uzo.service:
                              if p:
                                    produ_colored.objects.filter(pk=lc.color.id).update(idadi=F('idadi')-lc.idadi) 
                                    bidhaa_stoku.objects.filter(pk=lc.mauzo.produ.id).update(idadi=F('idadi')-lc.idadi) 
                              else:
                                    produ_colored.objects.filter(pk=lc.color.id).update(idadi=F('idadi')+lc.idadi) 
                                    bidhaa_stoku.objects.filter(pk=lc.mauzo.produ.id).update(idadi=F('idadi')+lc.idadi) 
                        
                        sc.update(packed=p)
                        unpc_ = sales_color.objects.filter(mauzo=lc.mauzo.id).exclude(packed=bool(p))
                  
                        if unpc_.count() == 0:
                              mauzoList.objects.filter(pk=lc.mauzo.id).update(packed=p)
                        else:
                              mauzoList.objects.filter(pk=lc.mauzo.id).update(packed=False)                           

                  if  it.exists() and not sc.exists() and not ss.exists():
                        lit =  it.last()
                        if not uzo.service:
                              if p:
                                    if notSure:
                                          productionList.objects.filter(pk=lit.produ.produced.id).update(qty=F('qty')+lit.idadi)
                                    else:
                                          bidhaa_stoku.objects.filter(pk=lit.produ.id).update(idadi=F('idadi')-lit.idadi)          
                              else:
                                    if notSure:
                                          productionList.objects.filter(pk=lit.produ.produced.id).update(qty=F('qty')-lit.idadi)

                                    else:
                                          bidhaa_stoku.objects.filter(pk=lit.produ.id).update(idadi=F('idadi')+lit.idadi)

                        it.update(packed=p) 
                  if p and it.exists():
                        l_itm = it.last().produ
                        other_st = bidhaa_stoku.objects.filter(bidhaa=l_itm.bidhaa.id,idadi__gt=0).exclude(pk=l_itm.id)
                        notSure = False
                        if l_itm.produced:
                              notSure = l_itm.produced.notsure
                        if l_itm.idadi == 0 and notSure and other_st.exists():

                              l_itm.inapacha=True
                              l_itm.save()

                              ost=other_st.last()
                              ost.inapacha=False
                              ost.save()
                              itm={
                              "itm":l_itm,
                              "request":request,
                              "out":True,
                               "other":ost
                              }
                              updateOrder(itm)

                                          


                              

               data = {'success':True,'p':p}

               return JsonResponse(data)

         except:
               data={
                     'success':False
               }
               return JsonResponse(data)               
      else:
          return render(request,'pagenotFound.html',todo)   

# TRANSFER THE PACKAGE ...................................................//
@login_required(login_url='login')
def  packegeTransfer(request):
      if request.method == "POST":
            try:
                        bil= int(request.POST.get('oda',0))
                        ag = int(request.POST.get('ag',0))
                       
                        nw = int(request.POST.get('agnt',0))
                        todo=todoFunct(request)
                        duka=todo['duka']


                        oda=mauzoni.objects.filter(pk=bil,Interprise=duka.id)
                       
                        if oda.exists():
                              odi=oda.last()
                              # print({
                              # 'tooffer':odi.user_customer.tr.user.owner.id,
                              # 'given':ag
                              # })
                              usr = None
                              
                              # This is when customer added his/her own agent   
                              agentin = deliveryAgents.objects.filter(agent__diactive__where__owner=ag,Interprise__in=[odi.user_customer.enteprise.id,duka.id,])
                              
                              # if not agentin.exists():
                              #       # when delivery agent from interprise is employed
                              #       agentin = deliveryAgents.objects.filter(pk=ag,Interprise__in=[odi.user_customer.enteprise.id,duka.id])  
                             
                              # print(agentin.exists())
                              
                              if nw:
                                    usr = agentin.last().agent.diactive.where.owner
                                    # print(agentin.last().agent.diactive.where.owner.id)
                              else:
                                    usr=UserExtend.objects.get(pk=ag)

                              givn=oda.filter(user_customer__by=usr.id)

                              # print(givn.exists())

                              if givn.exists() :
                                    there_is = False
                                    if odi.user_customer.tr :
                                          there_is = odi.user_customer.tr.user.owner is usr
                                         

                                    if  there_is:
                                          odi.user_customer.tr.muda = datetime.datetime.now(tz=timezone.utc)
                                          odi.user_customer.tr.save()

                                    else:
                                          drvB = deliveryBy()
                                          drvB.user = odi.user_customer.enteprise
                                          drvB.seen = True
                                          drvB.aliyekabidhi = todo['cheo']
                                          drvB.muda = datetime.datetime.now(tz=timezone.utc)
                                          drvB.save()
                                          user_customers.objects.filter(pk=odi.user_customer.id).update(tr=drvB)
                                           

                                    if givn.exists():
                                          user_customers.objects.filter(pk=odi.user_customer.id).update(amekabidhiwa=True)
                              
                                    # user_customers.objects.filter(pk=odi.user_customer.id).update(tr=drvB)
                        
                                          
                              else:

                                    dlv= deliveryBy.objects.filter(pk=odi.user_customer.tr.id,user__owner=usr.id)
                                    dlv.update(received_pack=True,aliyekabidhi=todo['cheo'],muda=datetime.datetime.now(tz=timezone.utc))
                                    


                              oda.update(derivered=True)

                              # Record Notiications to notify that items has transfered ......................................//

                              incharge_   = odi.user_customer.by
                              if incharge_ != usr:

                                    noticeR = Notifications()
                                    noticeR.Interprise = agentin.last().agent.diactive.where
                                    noticeR.date= datetime.datetime.now(tz=timezone.utc)
                                    noticeR.pickUp= True
                                    noticeR.saO_map = odi
                                    noticeR.saO = True
                                    noticeR.Incharge = usr
                                    noticeR.save()
                                    try:
                                          confirmMailF({
                                                'to':incharge_.user.email,
                                                'data':{    
                                                            'service':odi.service,
                                                            'pack':False, 
                                                            'shop':duka.name,
                                                            'order':odi.code,
                                                            'lang':incharge_.langSet,
                                                            'deliverer':usr.user.first_name + ' ' + usr.user.last_name,
                                                            'delivCode':Interprise.objects.get(owner=usr.id).Intp_code
                                                            },
                                                'formail':False
                                                })  
                                    except:
                                          pass      

                              else:
                                    notice = Notifications()
                                    notice.Interprise = odi.bill_kwa.Interprise
                                    notice.date= datetime.datetime.now(tz=timezone.utc)
                                    notice.puO= True
                                    notice.puO_map= odi.bill_kwa
                                    notice.Incharge = odi.user_customer.by
                                    notice.save()
                                    
                        data = {
                             'success':True,
                             'msg_swa':'Uhakiki wa kukabidhi bidhaa umefanikiwa kikamilifu',
                             'msg_eng':'Goods handover verification is successful'
                        } 
                        return JsonResponse(data)
            except:
               data = {
                    'success':False,
                    'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                    'msg_eng':"the action was not successful please try again"
               }
               return JsonResponse(data)

      else:
           return render(request,'pagenotFound.html',todoFunct(request))      
# CREATE THE PACKAGE ...................................................//
@login_required(login_url='login')
def  not_important(request):
      if request.method == "POST":
            try:
                  i= request.POST.get('value',0)
                  bil= request.POST.get('b',0)
                  todo=todoFunct(request)
                  duka=todo['duka']

                  

                  shop=Interprise.objects.get(pk=i)
                  oda=mauzoni.objects.filter(pk=bil,Interprise=duka.id,user_customer__enteprise=shop.id)
                  if oda.exists:
                        oda.update(sioMuhimu=True)
                        data = {
                              'success':True,
                              'msg_swa':'Oda imeondolewa kwenye oda muhimu',
                              'msg_eng':'Order removed to important orders'
                        }
                        return JsonResponse(data)
            except:
                  data={
                        'success':False,
                        'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena ',
                        'msg_eng':'Oparetion was not successfully please try again',
                  }

                  return JsonResponse(data)
      else:
            return render(request,'pagenotFound.html',todoFunct(request))

# CREATE THE PACKAGE ...................................................//
@login_required(login_url='login')
def  create_package(request):
    try:  
      i= request.GET.get('value',0)
      bil= request.GET.get('b',0)
      todo=todoFunct(request)
      duka=todo['duka']

      shop=Interprise.objects.get(pk=i)
      oda=mauzoni.objects.filter(pk=bil,Interprise=duka.id,user_customer__enteprise=shop.id)
      
      pi=mauzoList.objects.filter(mauzo=oda.last().id,packed=True)
      pc=sales_color.objects.filter(mauzo__mauzo=oda.last().id,packed=True)
      ps=sales_size.objects.filter(mauzo__mauzo=oda.last().id,packed=True)

      upi=mauzoList.objects.filter(mauzo=oda.last().id,packed=False)
      upc=sales_color.objects.filter(mauzo__mauzo=oda.last().id,packed=False)
      ups=sales_size.objects.filter(mauzo__mauzo=oda.last().id,packed=False)


      if (upi.exists() or upc.exists() or ups.exists())  and  (pi.exists() or pc.exists() or ps.exists()) : 

                        billno = 1
                        if manunuzi.objects.filter(Interprise=shop.id).exists():
                                    bill_no = manunuzi.objects.filter(Interprise=shop.id).last()      
                                    billno = bill_no.bill_no
            
                        if billno <10:
                              bill_str = '0000'+str(billno)
                        elif billno <100 and billno >=10:
                              bill_str = '000' +str(billno)    
                        elif billno <1000 and billno >=100:
                              bill_str = '00' +str(billno)    
                        elif billno <10000 and billno >=1000:
                              bill_str = '0' +str(billno)    
                        elif billno >=10000 :
                                    bill_str =str(billno)  


                        
                        pu = manunuzi()
                        pu.Interprise = shop
                        pu.code = bill_str           
                        pu.amount = 0                                             
                        pu.order = 1                                             
                        pu.kulipa = date.today()          
                        pu.tarehe = datetime.datetime.now(tz=timezone.utc)        
                        pu.bill_no = billno + 1       
                        pu.save() 




                        invono = 1
                        invo_str=''
                        if mauzoni.objects.filter(Interprise=duka.id).exists():
                              invo_no = mauzoni.objects.filter(Interprise=duka.id).last()
                              invono = invo_no.Invo_no
                        if invono <10:
                              invo_str = '0000'+str(invono)
                        elif invono <100 and invono >=10:
                              invo_str = '000' +str(invono)    
                        elif invono <1000 and invono >=100:
                              invo_str = '00' +str(invono)    
                        elif invono <10000 and invono >=1000:
                              invo_str = '0' +str(invono)    
                        elif invono >=10000 :
                              invo_str =str(invono)  

                        userc = user_customers()
                        userc.enteprise = upi.last().mauzo.user_customer.enteprise
                        userc.by=upi.last().mauzo.user_customer.by
                        userc.save()

                        mauzo=mauzoni()
                        
                        mauzo.Interprise=duka
                        mauzo.code=invo_str
                              
                        mauzo.amount=0

                        mauzo.kulipa = date.today()
                        mauzo.tarehe = oda.last().tarehe
                        mauzo.date = oda.last().date
                        mauzo.Invo_no = invono + 1
                        if wateja.objects.filter(mteja__user=duka.id).exists(): 
                              mauzo.saved_custom = True
                              mauzo.customer_id = upi.last().mauzo.customer_id

                        mauzo.mteja_jina = upi.last().mauzo.mteja_jina  
                        mauzo.simu = upi.last().mauzo.simu  
                        mauzo.user_customer = userc 
                        mauzo.order = True 
                        mauzo.online = True
                        mauzo.bill_kwa = pu

                       

                        mauzo.save()   

                        for ui in upi:
                             

                              usc=sales_color.objects.filter(mauzo=ui.id,packed=False)
                              psc=sales_color.objects.filter(mauzo=ui.id,packed=True)
                              # ss=sales_size.objects.filter(mauzo=ui.id,packed=False)


                              if not psc.exists() or not usc.exists():
                                  
                                   mauzoList.objects.filter(pk=ui.id).update(mauzo=mauzo)
                                

                              else: 
                                    tl =  mauzoList()
                                    tl.mauzo = mauzo
                                    tl.idadi = 0
                                    tl.bei = ui.bei
                                    tl.bei_og = ui.bei_og

                                    
                                    tl.vat_included = ui.vat_included
                                    tl.vat_set = ui.vat_set

                                    tl.produ= ui.produ
                                    #     add matching category if the itemis new and has category ...............//
                                    
                                    tl.match = ui.match   
                                    tl.save()    
                                     


                                    for c in usc:
                                          uss=sales_size.objects.filter(color=c.id,mauzo=ui.id,packed=False)
                                          pss=sales_size.objects.filter(color=c.id,mauzo=ui.id,packed=True)

                                          if not uss.exists() or not pss.exists():
                                                mauzoList.objects.filter(pk=c.mauzo.id).update(packed=True,idadi=F('idadi')-c.idadi)
                                                
                                                tl.idadi=float(tl.idadi+c.idadi)
                                                
                                                tl.save()


                                                sales_color.objects.filter(pk=c.id).update(mauzo=tl)
                                          else:

                                                sum_i = float(uss.aggregate(Sum('idadi'))['idadi_sum'])
                                                sco  = sales_color()
                                                sco.mauzo = tl
                                                sco.bidhaa = c.bidhaa
                                                sco.color = c.color
                                                sco.idadi = sum_i
                                                sco.price = c.price
                                                sco.save()

                                                tl.idadi=float(float(tl.idadi)+float(sum_i))
                                                tl.save()
                                               
                                                sales_color.objects.filter(pk=c.id).update(packed=True,idadi=F('idadi')-sum_i)
                                                uss.update(mauzo=tl,color=sco)
                        
                        totAmo = mauzoList.objects.filter(mauzo=mauzo.id).aggregate(sumi=Sum(F('idadi')*F('bei')*F('saveT'),output_field=FloatField()))['sumi']
                        mauzo.amount = float(totAmo)                        
                        mauzo.save() 
                        pu.amount = float(totAmo)                      
                        pu.save()  
                                          
                        oda.update(amount=F('amount')-mauzo.amount)
                        manunuzi.objects.filter(pk=oda.last().bill_kwa.id).update(amount=F('amount')-pu.amount)
                        
                        # Incase not  all items packed..............
                        remains = remainedFromOda()
                        remains.from_oda=oda.last()
                        remains.to_bil=pu
                        remains.save()

      
      if pi.exists() or pc.exists() or ps.exists():
            oda.update(packed=True,By=todo['cheo'],Packed_at=datetime.datetime.now(tz=timezone.utc))
          
            # Record Notiications For returning te itm ......................................//
            
           
            theOda_ = oda.last()
            incharge_ = theOda_.user_customer.by
            notice = Notifications()
            notice.date= datetime.datetime.now(tz=timezone.utc)
            notice.Interprise= theOda_.bill_kwa.Interprise
            notice.puO= True
            notice.puO_map= theOda_.bill_kwa
            notice.Incharge  = incharge_
            notice.save()  
            try:
                  confirmMailF({
                  'to':incharge_.user.email,
                  'data':{   
                            'service':theOda_.service, 
                             'pack':True, 
                              'shop':duka.name,
                              'order':theOda_.code,
                              'lang':incharge_.langSet
                              
                              },
                  'formail':False
                  })  
            except:
                 pass      
 
      return  redirect('/mauzo/viewOda?item_valued='+str(oda.last().id)) 
    except:
        return render(request,'errorpage.html',todo)
            
# LOAD INVOINCE DATA ...................................................//
@login_required(login_url='login')
def  unpack_items(request):
    oda= request.GET.get('oda',0)
    todo=todoFunct(request)
    duka=todo['duka']
    mauzoni.objects.filter(pk=oda,Interprise=duka.id).update(packed=False)

    return redirect('/mauzo/viewCustomOrder?ord='+str(oda))

# LOAD INVOINCE DATA ...................................................//
@login_required(login_url='login')
def  editOda(request):
    try:
      todo = viewOda_funct(request)
      oda= todo['the_bill']
      if oda.order:
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:             
               return render(request,'editOda.html',todo)
      else:
         return redirect('/mauzo/viewInvo?item_valued='+str(oda.id))               
    except:
       todo =todoFunct(request)   
       return render(request,'no_OdaFound.html',todo)  


def _deduct_stock_for_order(sale):
      if sale.online:
            return

      the_list = mauzoList.objects.filter(mauzo=sale)
      for l in the_list:
            if l.produ.produced and l.produ.produced.notsure:
                  productionList.objects.filter(pk=l.produ.produced.id).update(qty=F('qty')+l.idadi)
            else:
                  bidhaa_stoku.objects.filter(pk=l.produ.id).update(idadi=F('idadi')-l.idadi)

            if sales_color.objects.filter(mauzo=l.id).exists():
                  sale_c = sales_color.objects.filter(mauzo=l.id)
                  for sc in sale_c:
                        produ_colored.objects.filter(pk=sc.color.id).update(idadi=F('idadi')-sc.idadi)

            if sales_size.objects.filter(mauzo=l.id).exists():
                  sale_s = sales_size.objects.filter(mauzo=l.id)
                  for ss in sale_s:
                        produ_colored.objects.filter(pk=ss.size.id).update(idadi=F('idadi')-ss.idadi)


def _restore_stock_for_order(sale):
      if sale.online:
            return

      the_list = mauzoList.objects.filter(mauzo=sale)
      for l in the_list:
            if l.produ.produced and l.produ.produced.notsure:
                  productionList.objects.filter(pk=l.produ.produced.id).update(qty=F('qty')-l.idadi)
            else:
                  bidhaa_stoku.objects.filter(pk=l.produ.id).update(idadi=F('idadi')+l.idadi)

            if sales_color.objects.filter(mauzo=l.id).exists():
                  sale_c = sales_color.objects.filter(mauzo=l.id)
                  for sc in sale_c:
                        produ_colored.objects.filter(pk=sc.color.id).update(idadi=F('idadi')+sc.idadi)

            if sales_size.objects.filter(mauzo=l.id).exists():
                  sale_s = sales_size.objects.filter(mauzo=l.id)
                  for ss in sale_s:
                        produ_colored.objects.filter(pk=ss.size.id).update(idadi=F('idadi')+ss.idadi)


def _parse_waiter_desc(desc):
      table_name = ''
      counter_name = 'all'
      if not desc or not str(desc).startswith('WAITER|'):
            return {
                  'table': table_name,
                  'counter': counter_name,
            }

      for part in str(desc).split('|'):
            if '=' not in part:
                  continue
            key, value = part.split('=', 1)
            if key == 'table':
                  table_name = value
            if key == 'counter':
                  counter_name = value

      return {
            'table': table_name,
            'counter': counter_name,
      }


@login_required(login_url='login')
def  change_toInvo(request):
      intp= request.GET.get('item_valued',0)
      page_num= request.GET.get('page',1)
      duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
      od =  mauzoni.objects.filter(pk=intp,Interprise=duka.Interprise.id,order=True)
      if od.exists() and od.last().ilolipwa <= od.last().amount :
            sale = mauzoni.objects.get(pk=intp,Interprise=duka.Interprise.id,order=True)

            _deduct_stock_for_order(sale)
            
            sale.order=False
            sale.save()           
            return redirect('/mauzo/viewInvo?item_valued='+str(intp))
   
   
      else:
            msg={'lipa':True,'success':False,'swa':'Oda ya mauzo haikufanikiwa kuwa Ankara Kutokana na kutotambulika','eng':'Sales Order was not converted to invoice the order  '} 
            return redirect('/mauzo/viewOda?item_valued='+str(intp)+'&page='+str(page_num)+'&msg='+json.dumps(msg))


def waiter_orders_data(request):
      if request.method != 'POST':
            return JsonResponse({'success': False})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'pending': [], 'printed': [], 'items': {}, 'enable_print': False})

      duka = ctx['duka']
      cheo = ctx['cheo']
      device_mode = bool(ctx.get('device_id'))

      waiter_scope = Q(waiter_order=cheo)

      pending_qs = mauzoni.objects.filter(
            waiter_scope,
            Interprise=duka,
            By__isnull=True,
            full_returned=False,
            order=True,
            # desc__startswith='WAITER|'
      ).select_related('customer_in__area').order_by('-pk')[:50]

      printed_qs = mauzoni.objects.filter(
            waiter_scope,
            Interprise=duka,
            By__isnull=True,
            full_returned=False,
            order=False,
            receved=True,
            # desc__startswith='WAITER|'
      ).select_related('customer_in__area').order_by('-pk')[:50]

      pending_ids = [x.id for x in pending_qs]
      printed_ids = [x.id for x in printed_qs]
      all_ids = pending_ids + printed_ids

      items_map = {}
      if all_ids:
            lines = mauzoList.objects.filter(mauzo__in=all_ids).select_related('produ__bidhaa')
            for line in lines:
                  if line.mauzo_id not in items_map:
                        items_map[line.mauzo_id] = []
                  items_map[line.mauzo_id].append({
                        'name': line.produ.bidhaa.bidhaa_jina,
                        'qty': float(line.idadi),
                        'unit': line.produ.bidhaa.vipimo,
                        'price': float(line.bei),
                        'total': float(line.bei) * float(line.idadi),
                  })

      def serialize_order(order_obj, status_name):
            dmeta = _parse_waiter_desc(order_obj.desc)
            amount = float(order_obj.amount or 0)
            paid_amount = float(order_obj.waiter_pay or 0)
            is_paid = paid_amount >= amount and amount > 0
            table_name = ''
            place_name = ''

            if getattr(order_obj, 'customer_in_id', None):
                  try:
                        table_name = str(order_obj.customer_in.name or '').strip()
                        area_obj = getattr(order_obj.customer_in, 'area', None)
                        place_name = str(area_obj.name or '').strip() if area_obj else ''
                  except:
                        table_name = ''
                        place_name = ''

            table_name = table_name or dmeta['table']
            place_name = place_name or dmeta['counter']

            return {
                  'id': order_obj.id,
                  'code': order_obj.code,
                  'table': table_name,
                  'place': place_name,
                  'counter': dmeta['counter'],
                  'date': str(order_obj.date),
                  'created': order_obj.tarehe.strftime('%Y-%m-%d %H:%M') if order_obj.tarehe else '',
                  'amount': amount,
                  'paid_amount': paid_amount,
                  'remaining': max(0, amount - paid_amount),
                  'is_paid': is_paid,
                  'printed_number': int(order_obj.printed_number or 0),
                  'status': status_name,
            }

      pending_data = [serialize_order(o, 'pending') for o in pending_qs]
      printed_data = [serialize_order(o, 'printed') for o in printed_qs]
      all_data = pending_data + printed_data

      data = {
            'success': True,
            'pending': pending_data,
            'printed': printed_data,
            'items': items_map,
            'enable_print': True if device_mode else bool(cheo.enable_print),
            'counts': {
                  'pending': len(pending_data),
                  'printed': len(printed_data),
                  'all': len(all_data),
                  'my_orders': len(all_data),
                  'paid': len([x for x in all_data if x.get('is_paid')]),
                  'unpaid': len([x for x in all_data if not x.get('is_paid')]),
            }
      }
      return JsonResponse(data)


def _waiter_orders_summary_data(duka):
      base_qs = mauzoni.objects.filter(
            Interprise=duka,
            waiter_order__isnull=False,
            By__isnull=True,
            full_returned=False,
            printed_number__gt=0,
      )

      grouped = list(
            base_qs.values(
                  'waiter_order',
                  'waiter_order__cheo',
                  'waiter_order__fanyakazi__jina',
                  'waiter_order__user__user__first_name',
                  'waiter_order__user__user__last_name',
                  'waiter_order__user_entp__Interprise__Intp_code',
            ).annotate(
                  orders_count=Count('id'),
                  total_amount=Sum('amount'),
            ).order_by('-orders_count', '-total_amount', 'waiter_order__user__user__first_name')
      )

      rows = []
      total_amount = 0
      total_orders = 0

      for row in grouped:
            waiter_name = str(row.get('waiter_order__fanyakazi__jina') or '').strip()
            if not waiter_name:
                  waiter_name = f"{str(row.get('waiter_order__user__user__first_name') or '').strip()} {str(row.get('waiter_order__user__user__last_name') or '').strip()}".strip()
            if not waiter_name:
                  waiter_name = str(row.get('waiter_order__cheo') or '').strip() or 'Waiter'

            waiter_code = str(row.get('waiter_order__user_entp__Interprise__Intp_code') or '').strip()
            orders_count = int(row.get('orders_count') or 0)
            amount = float(row.get('total_amount') or 0)

            total_orders += orders_count
            total_amount += amount
            rows.append({
                  'waiter_id': row.get('waiter_order'),
                  'waiter_name': waiter_name,
                  'waiter_code': waiter_code,
                  'cheo': str(row.get('waiter_order__cheo') or '').strip() or '-',
                  'orders_count': orders_count,
                  'total_amount': amount,
            })

      return {
            'rows': rows,
            'totals': {
                  'waiters': len(rows),
                  'orders': total_orders,
                  'amount': total_amount,
            }
      }


@login_required(login_url='login')
def waiter_orders_summary(request):
      todo = newInvo_funct(request)
      duka = todo.get('duka')
      cheo = todo.get('cheo')

      if not duka or not duka.waiter_counter:
            return redirect('/userdash')

      can_view_waiter_orders_detail = bool(cheo and (getattr(cheo, 'owner', False) or getattr(cheo, 'waiter_check_up', False)))
      can_delete_waiter_orders = bool(cheo and (getattr(cheo, 'owner', False) or getattr(cheo, 'waiter_delete_order', False)))
      can_clear_waiter_payments = bool(
            cheo and (
                  getattr(cheo, 'owner', False)
                  or (getattr(cheo, 'waiter_check_up', False) and getattr(cheo, 'akaunti', False))
            )
      )

      try:
            selected_waiter_id = int(request.GET.get('waiter', 0) or 0)
      except:
            selected_waiter_id = 0

      if selected_waiter_id and not can_view_waiter_orders_detail:
            selected_waiter_id = 0

      selected_waiter_orders = []
      selected_waiter_name = ''
      selected_waiter_code = ''
      selected_waiter_orders_count = 0
      selected_waiter_orders_total_amount = 0
      selected_waiter_has_non_cash_payments = False
      selected_waiter_payment_accounts = []
      if selected_waiter_id:
            selected_qs = mauzoni.objects.filter(
                  Interprise=duka,
                  waiter_order__id=selected_waiter_id,
                  waiter_order__isnull=False,
                  By__isnull=True,
                  full_returned=False,
                  printed_number__gt=0,
            ).select_related('customer_in__area').order_by('-pk')[:120]

            if selected_qs.exists():
                  waiter_obj = selected_qs.first().waiter_order
                  selected_waiter_code = ''
                  try:
                        selected_waiter_code = str(waiter_obj.user_entp.Interprise.Intp_code or '').strip()
                  except:
                        selected_waiter_code = ''
                  selected_waiter_name = ''
                  try:
                        selected_waiter_name = str(waiter_obj.fanyakazi.jina or '').strip()
                  except:
                        selected_waiter_name = ''
                  if not selected_waiter_name:
                        selected_waiter_name = f"{str(waiter_obj.user.user.first_name or '').strip()} {str(waiter_obj.user.user.last_name or '').strip()}".strip()
                  if not selected_waiter_name:
                        selected_waiter_name = str(waiter_obj.cheo or '').strip() or 'Waiter'

                  for od in selected_qs:
                        table_name = '-'
                        place_name = '-'
                        try:
                              if od.customer_in:
                                    table_name = str(od.customer_in.name or '').strip() or '-'
                                    place_name = str(od.customer_in.area.name or '').strip() if od.customer_in.area else '-'
                        except:
                              table_name = '-'
                              place_name = '-'

                        row_amount = float(od.amount or 0)
                        selected_waiter_orders_total_amount += row_amount
                        selected_waiter_orders.append({
                              'id': od.id,
                              'code': od.code,
                              'date': od.tarehe,
                              'amount': row_amount,
                              'table': table_name,
                              'place': place_name,
                        })

                  selected_sale_ids = [x.id for x in selected_qs]
                  non_cash_groups = list(
                        waiterPayments.objects.filter(
                              waiter__id=selected_waiter_id,
                              sale__id__in=selected_sale_ids,
                              confirmed=True,
                              account__isnull=False,
                        ).exclude(
                              account__aina__iexact='Cash'
                        ).values(
                              'account',
                              'account__Akaunt_name',
                              'account__aina',
                        ).annotate(
                              amount=Sum('amount'),
                              records=Count('id'),
                        ).order_by('account__Akaunt_name')
                  )

                  non_cash_total = 0
                  if non_cash_groups:
                        selected_waiter_has_non_cash_payments = True
                        for row in non_cash_groups:
                              acc_amount = float(row.get('amount') or 0)
                              non_cash_total += acc_amount
                              selected_waiter_payment_accounts.append({
                                    'account_id': int(row.get('account') or 0),
                                    'name': str(row.get('account__Akaunt_name') or '').strip() or '-',
                                    'type': str(row.get('account__aina') or '').strip() or '-',
                                    'amount': acc_amount,
                                    'default_amount': acc_amount,
                                    'records': int(row.get('records') or 0),
                                    'is_cash': False,
                              })

                  cash_default_amount = max(0, float(selected_waiter_orders_total_amount or 0) - float(non_cash_total or 0))
                  cash_account = PaymentAkaunts.objects.filter(
                        Interprise=duka,
                        aina__iexact='Cash'
                  ).order_by('pk').last()
                  if cash_account:
                        selected_waiter_payment_accounts.append({
                              'account_id': cash_account.id,
                              'name': str(cash_account.Akaunt_name or '').strip() or '-',
                              'type': str(cash_account.aina or '').strip() or '-',
                              'amount': cash_default_amount,
                              'default_amount': cash_default_amount,
                              'records': 0,
                              'is_cash': True,
                        })

            selected_waiter_orders_count = len(selected_waiter_orders)

      todo.update({
            'waiter_summary': _waiter_orders_summary_data(duka),
            'can_view_waiter_orders_detail': can_view_waiter_orders_detail,
            'can_delete_waiter_orders': can_delete_waiter_orders,
            'can_clear_waiter_payments': can_clear_waiter_payments,
            'selected_waiter_id': selected_waiter_id,
            'selected_waiter_name': selected_waiter_name,
            'selected_waiter_code': selected_waiter_code,
            'selected_waiter_orders': selected_waiter_orders,
            'selected_waiter_orders_count': selected_waiter_orders_count,
            'selected_waiter_orders_total_amount': selected_waiter_orders_total_amount,
            'selected_waiter_has_non_cash_payments': selected_waiter_has_non_cash_payments,
            'selected_waiter_payment_accounts': selected_waiter_payment_accounts,
            'selected_waiter_payment_accounts_json': json.dumps(selected_waiter_payment_accounts),
      })
      return render(request, 'waiter_orders_summary.html', todo)


@login_required(login_url='login')
def waiter_orders_summary_data(request):
      if request.method not in ['GET', 'POST']:
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      todo = newInvo_funct(request)
      duka = todo.get('duka')

      if not duka or not duka.waiter_counter:
            return JsonResponse({'success': False, 'msg': 'Waiter counter is disabled'})

      summary = _waiter_orders_summary_data(duka)
      return JsonResponse({
            'success': True,
            'rows': summary['rows'],
            'totals': summary['totals'],
      })


@login_required(login_url='login')
def waiter_summary_order_details(request):
      if request.method not in ['GET', 'POST']:
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            order_id = int(request.GET.get('order', 0) or request.POST.get('order', 0) or 0)
      except:
            order_id = 0

      if not order_id:
            return JsonResponse({'success': False, 'msg': 'Invalid order id'})

      todo = newInvo_funct(request)
      duka = todo.get('duka')
      cheo = todo.get('cheo')

      if not duka or not duka.waiter_counter:
            return JsonResponse({'success': False, 'msg': 'Waiter counter is disabled'})

      can_view_waiter_orders_detail = bool(cheo and (getattr(cheo, 'owner', False) or getattr(cheo, 'waiter_check_up', False)))
      can_delete_waiter_orders = bool(cheo and (getattr(cheo, 'owner', False) or getattr(cheo, 'waiter_delete_order', False)))
      if not can_view_waiter_orders_detail:
            return JsonResponse({'success': False, 'msg': 'Permission denied'})

      sale = mauzoni.objects.filter(
            pk=order_id,
            Interprise=duka,
            waiter_order__isnull=False,
            By__isnull=True,
            full_returned=False,
            printed_number__gt=0,
      ).select_related('customer_in__area').last()

      if not sale:
            return JsonResponse({'success': False, 'msg': 'Order not found'})

      items = []
      lines = mauzoList.objects.filter(mauzo=sale.id).select_related('produ__bidhaa')
      for ln in lines:
            qty = float(ln.idadi or 0)
            price = float(ln.bei or 0)
            items.append({
                  'name': str(ln.produ.bidhaa.bidhaa_jina or '').strip(),
                  'qty': qty,
                  'unit': str(ln.produ.bidhaa.vipimo or '').strip(),
                  'price': price,
                  'total': qty * price,
            })

      table_name = '-'
      place_name = '-'
      try:
            if sale.customer_in:
                  table_name = str(sale.customer_in.name or '').strip() or '-'
                  place_name = str(sale.customer_in.area.name or '').strip() if sale.customer_in.area else '-'
      except:
            table_name = '-'
            place_name = '-'

      return JsonResponse({
            'success': True,
            'can_delete': can_delete_waiter_orders,
            'order': {
                  'id': sale.id,
                  'code': sale.code,
                  'table': table_name,
                  'place': place_name,
                  'date': sale.tarehe.strftime('%d/%m/%Y %H:%M') if sale.tarehe else '',
                  'amount': float(sale.amount or 0),
            },
            'items': items,
      })


@login_required(login_url='login')
def waiter_summary_delete_order(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            order_id = int(request.POST.get('order', 0) or 0)
      except:
            order_id = 0

      if not order_id:
            return JsonResponse({'success': False, 'msg': 'Invalid order id'})

      todo = newInvo_funct(request)
      duka = todo.get('duka')
      cheo = todo.get('cheo')

      if not duka or not duka.waiter_counter:
            return JsonResponse({'success': False, 'msg': 'Waiter counter is disabled'})

      can_delete_waiter_orders = bool(cheo and (getattr(cheo, 'owner', False) or getattr(cheo, 'waiter_delete_order', False)))
      if not can_delete_waiter_orders:
            return JsonResponse({'success': False, 'msg': 'Permission denied'})

      sale = mauzoni.objects.filter(
            pk=order_id,
            Interprise=duka,
            waiter_order__isnull=False,
            By__isnull=True,
            full_returned=False,
            printed_number__gt=0,
      ).last()

      if not sale:
            return JsonResponse({'success': False, 'msg': 'Order not found'})

      with transaction.atomic():
            _restore_stock_for_order(sale)
            mauzoList.objects.filter(mauzo=sale.id).delete()
            sale.delete()

      return JsonResponse({'success': True})


@login_required(login_url='login')
def waiter_summary_waiter_payment_records(request):
      if request.method not in ['GET', 'POST']:
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            waiter_id = int(request.GET.get('waiter', 0) or request.POST.get('waiter', 0) or 0)
            account_id = int(request.GET.get('account', 0) or request.POST.get('account', 0) or 0)
      except:
            return JsonResponse({'success': False, 'msg': 'Invalid data'})

      if not waiter_id or not account_id:
            return JsonResponse({'success': False, 'msg': 'Waiter and account required'})

      todo = newInvo_funct(request)
      duka = todo.get('duka')
      cheo = todo.get('cheo')

      if not duka or not duka.waiter_counter:
            return JsonResponse({'success': False, 'msg': 'Waiter counter is disabled'})

      can_view_waiter_orders_detail = bool(cheo and (getattr(cheo, 'owner', False) or getattr(cheo, 'waiter_check_up', False)))
      if not can_view_waiter_orders_detail:
            return JsonResponse({'success': False, 'msg': 'Permission denied'})

      selected_sale_ids = list(
            mauzoni.objects.filter(
                  Interprise=duka,
                  waiter_order__id=waiter_id,
                  waiter_order__isnull=False,
                  By__isnull=True,
                  full_returned=False,
                  printed_number__gt=0,
            ).values_list('id', flat=True)
      )

      if not selected_sale_ids:
            return JsonResponse({'success': True, 'records': []})

      records_qs = waiterPayments.objects.filter(
            waiter__id=waiter_id,
            sale__id__in=selected_sale_ids,
            account__id=account_id,
            confirmed=True,
      ).exclude(account__aina__iexact='Cash').select_related('sale').order_by('-pk')[:120]

      records = []
      for rp in records_qs:
            records.append({
                  'customerName': str(rp.customerName or '').strip() or '-',
                  'amount': float(rp.amount or 0),
                  'order': str(rp.sale.code or '').strip() if rp.sale else '-',
                  'date': rp.tarehe.strftime('%d/%m/%Y %H:%M') if rp.tarehe else '',
            })

      return JsonResponse({'success': True, 'records': records})


@login_required(login_url='login')
def waiter_summary_clear_waiter_payments(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            waiter_id = int(request.POST.get('waiter', 0) or 0)
            raw_payments = request.POST.get('payments', '[]')
      except:
            return JsonResponse({'success': False, 'msg': 'Invalid data'})

      if not waiter_id:
            return JsonResponse({'success': False, 'msg': 'Waiter required'})

      todo = newInvo_funct(request)
      duka = todo.get('duka')
      cheo = todo.get('cheo')

      if not duka or not duka.waiter_counter:
            return JsonResponse({'success': False, 'msg': 'Waiter counter is disabled'})

      can_clear_waiter_payments = bool(
            cheo and (
                  getattr(cheo, 'owner', False)
                  or (getattr(cheo, 'waiter_check_up', False) and getattr(cheo, 'akaunti', False))
            )
      )
      if not can_clear_waiter_payments:
            return JsonResponse({'success': False, 'msg': 'Permission denied'})

      waiter_obj = InterprisePermissions.objects.filter(pk=waiter_id, Interprise=duka).last()
      if not waiter_obj:
            return JsonResponse({'success': False, 'msg': 'Waiter not found'})

      try:
            payments_data = json.loads(raw_payments or '[]')
      except:
            payments_data = []

      if not isinstance(payments_data, list):
            return JsonResponse({'success': False, 'msg': 'Invalid payments format'})

      selected_qs = mauzoni.objects.filter(
            Interprise=duka,
            waiter_order__id=waiter_id,
            waiter_order__isnull=False,
            By__isnull=True,
            full_returned=False,
            printed_number__gt=0,
      ).order_by('pk')

      if not selected_qs.exists():
            return JsonResponse({'success': False, 'msg': 'No uncleared waiter orders found'})

      selected_sale_ids = list(selected_qs.values_list('id', flat=True))
      total_orders_amount = float(selected_qs.aggregate(s=Sum('amount')).get('s') or 0)

      non_cash_recorded_total = float(
            waiterPayments.objects.filter(
                  waiter__id=waiter_id,
                  sale__id__in=selected_sale_ids,
                  confirmed=True,
                  account__isnull=False,
            ).exclude(account__aina__iexact='Cash').aggregate(
                  s=Sum('amount')
            ).get('s') or 0
      )

      posted_amount_by_account = {}
      for row in payments_data:
            if not isinstance(row, dict):
                  continue
            try:
                  acc_id = int(row.get('account_id', 0) or 0)
                  acc_amount = float(row.get('amount', 0) or 0)
            except:
                  continue
            if acc_id and acc_amount > 0:
                  posted_amount_by_account[acc_id] = acc_amount

      if not posted_amount_by_account:
            return JsonResponse({'success': False, 'msg': 'Amount must be greater than zero'})

      pay_accounts = {
            x.id: x for x in PaymentAkaunts.objects.filter(
                  Interprise=duka,
                  pk__in=list(posted_amount_by_account.keys())
            )
      }
      if len(pay_accounts.keys()) != len(posted_amount_by_account.keys()):
            return JsonResponse({'success': False, 'msg': 'Some payment accounts are invalid'})

      clear_amount = float(sum(posted_amount_by_account.values()) or 0)
      if clear_amount <= 0:
            return JsonResponse({'success': False, 'msg': 'Amount must be greater than zero'})

      # Prevent over-clearing against current waiter orders total.
      if clear_amount > float(total_orders_amount or 0):
            return JsonResponse({'success': False, 'msg': 'Selected amount exceeds waiter total amount'})

      waiter_name = ''
      try:
            waiter_name = str(waiter_obj.fanyakazi.jina or '').strip()
      except:
            waiter_name = ''
      if not waiter_name:
            waiter_name = f"{str(waiter_obj.user.user.first_name or '').strip()} {str(waiter_obj.user.user.last_name or '').strip()}".strip()
      if not waiter_name:
            waiter_name = str(waiter_obj.cheo or '').strip() or 'Waiter'

      with transaction.atomic():
            clear_rec = waiter_clearing()
            clear_rec.waiter = waiter_obj
            clear_rec.amount = clear_amount
            clear_rec.tarehe = datetime.datetime.now(tz=timezone.utc)
            clear_rec.By = cheo
            clear_rec.save()

            # Record account movements per entered payment account.
            for account_id, acc_amount in posted_amount_by_account.items():
                  acc_obj = pay_accounts.get(account_id)
                  if not acc_obj:
                        continue
                  before = float(acc_obj.Amount or 0)
                  after = before + float(acc_amount)
                  PaymentAkaunts.objects.filter(pk=acc_obj.id).update(Amount=after)

                  cash_in = wekaCash()
                  cash_in.Interprise = duka
                  cash_in.tarehe = datetime.datetime.now(tz=timezone.utc)
                  cash_in.Akaunt = acc_obj
                  cash_in.Amount = float(acc_amount)
                  cash_in.before = before
                  cash_in.After = after
                  cash_in.kutoka = f'WAITER CLEARING - {waiter_name}'
                  cash_in.maelezo = f'Orders total: {total_orders_amount}'
                  cash_in.by = cheo
                  cash_in.order = True
                  cash_in.from_waiter_payments = clear_rec
                  cash_in.save()

            # Allocate paid amount through waiter orders in sequence.
            paidAmo = float(clear_amount or 0)
            for od in selected_qs:
                  order_amount = float(od.amount or 0)
                  if paidAmo <= 0:
                        break

                  if paidAmo >= order_amount:
                        order_paid = order_amount
                        new_full_paid = True
                        new_by_id = cheo.id if cheo else None
                        new_clear_id = clear_rec.id
                        paidAmo = float(paidAmo - order_amount)
                  else:
                        order_paid = float(paidAmo)
                        new_full_paid = False
                        new_by_id = None
                        new_clear_id = None
                        paidAmo = 0

                  mauzoni.objects.filter(pk=od.id).update(
                        ilolipwa=order_paid,
                        waiter_pay=order_paid,
                        full_paid=new_full_paid,
                        By_id=new_by_id,
                        waiter_order_cleared_id=new_clear_id,
                  )

                  if paidAmo <= 0 and order_paid < order_amount:
                        break

      return JsonResponse({
            'success': True,
            'amount': clear_amount,
            'total_orders_amount': total_orders_amount,
            'non_cash_recorded_total': non_cash_recorded_total,
      })


def _waiter_person_name(counter_obj, default_name='Waiter'):
      if not counter_obj:
            return default_name

      name = ''
      try:
            name = str(counter_obj.fanyakazi.jina or '').strip()
      except:
            name = ''

      if not name:
            try:
                  name = f"{str(counter_obj.user.user.first_name or '').strip()} {str(counter_obj.user.user.last_name or '').strip()}".strip()
            except:
                  name = ''

      if not name:
            try:
                  name = str(counter_obj.cheo or '').strip()
            except:
                  name = ''

      return name or default_name


def _waiter_report_period_dates(period_key, custom_from='', custom_to=''):
      today = date.today()

      if period_key == 'day':
            return {
                  'start': today,
                  'end': today,
                  'label': 'Siku ya Leo',
            }

      if period_key == 'week':
            week_start = today - timedelta(days=today.weekday())
            return {
                  'start': week_start,
                  'end': today,
                  'label': 'Wiki Hii',
            }

      if period_key == 'month':
            month_start = today.replace(day=1)
            return {
                  'start': month_start,
                  'end': today,
                  'label': 'Mwezi Huu',
            }

      if period_key == 'custom':
            try:
                  start_date = datetime.datetime.strptime(str(custom_from or '').strip(), '%Y-%m-%d').date()
                  end_date = datetime.datetime.strptime(str(custom_to or '').strip(), '%Y-%m-%d').date()
            except:
                  return None

            if end_date < start_date:
                  return None

            return {
                  'start': start_date,
                  'end': end_date,
                  'label': 'Custom Period',
            }

      return None


def _waiter_cleared_period_rows(duka, waiter_obj, custom_from='', custom_to=''):
      rows = []
      base_qs = mauzoni.objects.filter(
            Interprise=duka,
            waiter_order=waiter_obj,
            waiter_order_cleared__isnull=False,
            full_returned=False,
      )

      period_defs = [
            ('day', 'Siku' if waiter_obj.user.langSet ==  0 else  'Day'),
            ('week', 'Wiki' if waiter_obj.user.langSet ==  0 else  'Week'),
            ('month', 'Mwezi' if waiter_obj.user.langSet ==  0 else  'Month'),
            ('custom', 'Weka Muda' if waiter_obj.user.langSet ==  0 else  'Custom Period'),
      ]

      for period_key, period_title in period_defs:
            period_meta = _waiter_report_period_dates(period_key, custom_from, custom_to)
            if not period_meta:
                  rows.append({
                        'period': period_key,
                        'title': period_title,
                        'start': custom_from if period_key == 'custom' else '',
                        'end': custom_to if period_key == 'custom' else '',
                        'orders': 0,
                        'amount': 0,
                  })
                  continue

            qs = base_qs.filter(
                  waiter_order_cleared__tarehe__date__gte=period_meta['start'],
                  waiter_order_cleared__tarehe__date__lte=period_meta['end'],
            )
            agg = qs.aggregate(
                  orders_count=Count('id'),
                  total_amount=Sum('amount'),
            )

            rows.append({
                  'period': period_key,
                  'title': period_title,
                  'start': period_meta['start'].strftime('%Y-%m-%d'),
                  'end': period_meta['end'].strftime('%Y-%m-%d'),
                  'orders': int(agg.get('orders_count') or 0),
                  'amount': float(agg.get('total_amount') or 0),
            })

      return rows


@login_required(login_url='login')
def waiter_cleared_report(request):
      todo = newInvo_funct(request)

      if not todo.get('waiter_counter', False):
            return redirect('/userdash')

      counters = todo['waiter_counter']
      servicing_counter = counters.filter(servicing=True)

      if not servicing_counter.exists():
            todo.update({'waiter_counters': counters})
            return render(request, 'waiter_counter_select.html', todo)

      cheo = servicing_counter.last()
      duka = cheo.Interprise

      if not duka or not duka.waiter_counter:
            return redirect('/userdash')

      custom_from = str(request.GET.get('from', '') or '').strip()
      custom_to = str(request.GET.get('to', '') or '').strip()
      rows = _waiter_cleared_period_rows(duka, cheo, custom_from, custom_to)

      todo.update({
            'servicing_counter': cheo,
            'waiter_name': _waiter_person_name(cheo, 'Waiter'),
            'period_rows': rows,
            'custom_from': custom_from,
            'custom_to': custom_to,
      })
      return render(request, 'waiter_cleared_report.html', todo)


@login_required(login_url='login')
def waiter_cleared_report_clearings(request):
      if request.method not in ['GET', 'POST']:
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      period_key = str(request.GET.get('period', '') or request.POST.get('period', '') or '').strip().lower()
      custom_from = str(request.GET.get('from', '') or request.POST.get('from', '') or '').strip()
      custom_to = str(request.GET.get('to', '') or request.POST.get('to', '') or '').strip()

      period_meta = _waiter_report_period_dates(period_key, custom_from, custom_to)
      if not period_meta:
            return JsonResponse({'success': False, 'msg': 'Invalid period'})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'msg': str(ctx.get('msg') or 'No active waiter counter')})

      duka = ctx['duka']
      cheo = ctx['cheo']

      clearings = waiter_clearing.objects.filter(
            waiter=cheo,
            tarehe__date__gte=period_meta['start'],
            tarehe__date__lte=period_meta['end'],
      ).select_related(
            'By__fanyakazi',
            'By__user__user'
      ).order_by('-pk')

      rows = []
      for rec in clearings:
            order_qs = mauzoni.objects.filter(
                  Interprise=duka,
                  waiter_order=cheo,
                  waiter_order_cleared=rec,
                  full_returned=False,
            )
            order_agg = order_qs.aggregate(
                  c=Count('id'),
                  s=Sum('amount'),
            )

            rows.append({
                  'id': rec.id,
                  'date': rec.tarehe.strftime('%d/%m/%Y %H:%M') if rec.tarehe else '',
                  'amount': float(rec.amount or 0),
                  'orders_count': int(order_agg.get('c') or 0),
                  'orders_amount': float(order_agg.get('s') or 0),
                  'by_name': _waiter_person_name(rec.By, '-'),
            })

      return JsonResponse({
            'success': True,
            'period_label': period_meta['label'],
            'period_start': period_meta['start'].strftime('%Y-%m-%d'),
            'period_end': period_meta['end'].strftime('%Y-%m-%d'),
            'rows': rows,
      })


@login_required(login_url='login')
def waiter_cleared_report_clearing_orders(request):
      if request.method not in ['GET', 'POST']:
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            clearing_id = int(request.GET.get('clearing', 0) or request.POST.get('clearing', 0) or 0)
      except:
            clearing_id = 0

      if not clearing_id:
            return JsonResponse({'success': False, 'msg': 'Invalid clearing id'})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'msg': str(ctx.get('msg') or 'No active waiter counter')})

      duka = ctx['duka']
      cheo = ctx['cheo']

      clearing_obj = waiter_clearing.objects.filter(
            pk=clearing_id,
            waiter=cheo,
      ).last()
      if not clearing_obj:
            return JsonResponse({'success': False, 'msg': 'Clearing record not found'})

      orders_qs = mauzoni.objects.filter(
            Interprise=duka,
            waiter_order=cheo,
            waiter_order_cleared=clearing_obj,
            full_returned=False,
      ).select_related('customer_in__area').order_by('-pk')

      rows = []
      for od in orders_qs:
            table_name = '-'
            place_name = '-'
            try:
                  if od.customer_in:
                        table_name = str(od.customer_in.name or '').strip() or '-'
                        place_name = str(od.customer_in.area.name or '').strip() if od.customer_in.area else '-'
            except:
                  table_name = '-'
                  place_name = '-'

            rows.append({
                  'id': od.id,
                  'code': od.code,
                  'date': od.tarehe.strftime('%d/%m/%Y %H:%M') if od.tarehe else '',
                  'amount': float(od.amount or 0),
                  'table': table_name,
                  'place': place_name,
            })

      return JsonResponse({
            'success': True,
            'clearing': {
                  'id': clearing_obj.id,
                  'amount': float(clearing_obj.amount or 0),
                  'date': clearing_obj.tarehe.strftime('%d/%m/%Y %H:%M') if clearing_obj.tarehe else '',
            },
            'rows': rows,
      })


@login_required(login_url='login')
def waiter_cleared_report_order_items(request):
      if request.method not in ['GET', 'POST']:
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            order_id = int(request.GET.get('order', 0) or request.POST.get('order', 0) or 0)
      except:
            order_id = 0

      if not order_id:
            return JsonResponse({'success': False, 'msg': 'Invalid order id'})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'msg': str(ctx.get('msg') or 'No active waiter counter')})

      duka = ctx['duka']
      cheo = ctx['cheo']

      sale = mauzoni.objects.filter(
            pk=order_id,
            Interprise=duka,
            waiter_order=cheo,
            waiter_order_cleared__isnull=False,
            full_returned=False,
      ).select_related('customer_in__area').last()

      if not sale:
            return JsonResponse({'success': False, 'msg': 'Order not found'})

      items = []
      lines = mauzoList.objects.filter(mauzo=sale.id).select_related('produ__bidhaa')
      for ln in lines:
            qty = float(ln.idadi or 0)
            price = float(ln.bei or 0)
            items.append({
                  'name': str(ln.produ.bidhaa.bidhaa_jina or '').strip(),
                  'qty': qty,
                  'unit': str(ln.produ.bidhaa.vipimo or '').strip(),
                  'price': price,
                  'total': qty * price,
            })

      table_name = '-'
      place_name = '-'
      try:
            if sale.customer_in:
                  table_name = str(sale.customer_in.name or '').strip() or '-'
                  place_name = str(sale.customer_in.area.name or '').strip() if sale.customer_in.area else '-'
      except:
            table_name = '-'
            place_name = '-'

      return JsonResponse({
            'success': True,
            'order': {
                  'id': sale.id,
                  'code': sale.code,
                  'table': table_name,
                  'place': place_name,
                  'date': sale.tarehe.strftime('%d/%m/%Y %H:%M') if sale.tarehe else '',
                  'amount': float(sale.amount or 0),
            },
            'items': items,
      })


@login_required(login_url='login')
def waiter_clearing_list(request):
      todo = newInvo_funct(request)
      duka = todo.get('duka')
      cheo = todo.get('cheo')

      if not duka or not duka.waiter_counter:
            return redirect('/userdash')

      can_view = bool(cheo and (getattr(cheo, 'owner', False) or getattr(cheo, 'waiter_check_up', False)))
      if not can_view:
            return redirect('/userdash')

      qs = waiter_clearing.objects.filter(
            waiter__Interprise=duka
      ).select_related(
            'waiter__fanyakazi',
            'waiter__user__user',
            'By__fanyakazi',
            'By__user__user',
      ).order_by('-pk')

      paginator = Paginator(qs, 15)
      page_num = request.GET.get('page', 1)
      try:
            page_obj = paginator.page(page_num)
      except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

      rows = []
      for rec in page_obj:
            waiter_name = _waiter_person_name(rec.waiter, 'Waiter')
            by_name = _waiter_person_name(rec.By, '-')

            rows.append({
                  'id': rec.id,
                  'waiter_name': waiter_name,
                  'amount': rec.amount,
                  'tarehe': rec.tarehe,
                  'by_name': by_name,
            })

      todo.update({
            'clearing_rows': rows,
            'page_obj': page_obj,
            'paginator': paginator,
      })
      return render(request, 'waiter_clearing_list.html', todo)


def waiter_print_order(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            order_id = int(request.POST.get('order', 0))
      except:
            return JsonResponse({'success': False, 'msg': 'Invalid order id'})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'msg': str(ctx.get('msg') or 'No active waiter counter')})

      duka = ctx['duka']
      cheo = ctx['cheo']
      device_mode = bool(ctx.get('device_id'))

      if not device_mode and not bool(cheo.enable_print):
            return JsonResponse({'success': False, 'msg': 'Print mode is disabled'})

      waiter_scope = Q(waiter_order=cheo)
      with transaction.atomic():
            sale = mauzoni.objects.select_for_update().filter(
                  waiter_scope,
                  pk=order_id,
                  Interprise=duka,
                  By__isnull=True,
                  full_returned=False,
            ).last()

            if not sale:
                  return JsonResponse({'success': False, 'msg': 'Order not found'})

            first_print = int(sale.printed_number or 0) <= 0

            if first_print:
                  _deduct_stock_for_order(sale)

            sale.order = False
            sale.receved = True
            sale.Packed_at = datetime.datetime.now(tz=timezone.utc)
            sale.printed_number = int(sale.printed_number or 0) + 1
            sale.save(update_fields=['order', 'receved', 'Packed_at', 'printed_number'])

      return JsonResponse({
            'success': True,
            'first_print': first_print,
            'printed_number': int(sale.printed_number or 0),
      })


def waiter_clear_order(request):
      # Backward-compatible alias to the new print endpoint.
      return waiter_print_order(request)


def waiter_delete_order(request):
      try:
            if request.method != 'POST':
                  return JsonResponse({'success': False})

            try:
                  order_id = int(request.POST.get('order', 0))
            except:
                  return JsonResponse({'success': False, 'msg': 'Invalid order id'})

            ctx = _resolve_waiter_context(request)
            if not ctx.get('ok'):
                  return JsonResponse({'success': False, 'msg': str(ctx.get('msg') or 'No active waiter counter')})

            duka = ctx['duka']
            cheo = ctx['cheo']

            waiter_scope = Q(waiter_order=cheo)
            od = mauzoni.objects.filter(
                  waiter_scope,
                  pk=order_id,
                  Interprise=duka,
                  By__isnull=True,
                  full_returned=False,
            )

            if not od.exists():
                  return JsonResponse({'success': False, 'msg': 'Order not found'})

            sale = od.last()
            if not sale.order:
                  return JsonResponse({'success': False, 'msg': 'Printed orders cannot be deleted'})

            with transaction.atomic():
                  mauzoList.objects.filter(mauzo=sale.id).delete()
                  sale.delete()

            return JsonResponse({'success': True})
      except:
           traceback.print_exc()
           return JsonResponse({'success': False, 'msg': 'An error occurred while deleting the order'})


def waiter_pay_order(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            order_id = int(request.POST.get('order', 0))
            pay_amount = float(request.POST.get('amount', 0) or 0)
            akaunt_id = int(request.POST.get('akaunt', 0) or 0)
            customer_name = str(request.POST.get('customer_name', '') or '').strip()
      except:
            return JsonResponse({'success': False, 'msg': 'Invalid data'})

      if pay_amount <= 0:
            return JsonResponse({'success': False, 'msg': 'Amount must be greater than zero'})

      if not akaunt_id:
            return JsonResponse({'success': False, 'msg': 'Payment account required'})

      ctx = _resolve_waiter_context(request)
      if not ctx.get('ok'):
            return JsonResponse({'success': False, 'msg': str(ctx.get('msg') or 'No active waiter counter')})

      duka = ctx['duka']
      cheo = ctx['cheo']

      pay_acc = PaymentAkaunts.objects.filter(pk=akaunt_id, Interprise=duka.id).last()
      if not pay_acc:
            return JsonResponse({'success': False, 'msg': 'Payment account not found'})

      waiter_scope = Q(waiter_order=cheo)
      od = mauzoni.objects.filter(
            waiter_scope,
            pk=order_id,
            Interprise=duka,
            By__isnull=True,
            full_returned=False,
      )

      if not od.exists():
            return JsonResponse({'success': False, 'msg': 'Order not found'})

      sale = od.last()
      amount = float(sale.amount or 0)
      already_paid = float(sale.waiter_pay or 0)
      remaining = max(0, amount - already_paid)

      if remaining <= 0:
            return JsonResponse({'success': False, 'msg': 'Order already fully paid'})

      actual_payment = min(pay_amount, remaining)

      with transaction.atomic():
            wp = waiterPayments()
            wp.waiter = cheo
            wp.amount = actual_payment
            wp.tarehe = datetime.datetime.now(tz=timezone.utc)
            wp.account = pay_acc
            wp.sale = sale
            wp.confirmed = True
            wp.customerName = customer_name
            wp.save()

            new_paid = already_paid + actual_payment
            mauzoni.objects.filter(pk=sale.id).update(waiter_pay=new_paid)

            if customer_name:
                  mauzoni.objects.filter(pk=sale.id).update(mteja_jina=customer_name)

      return JsonResponse({
            'success': True,
            'paid_amount': new_paid,
            'remaining': max(0, amount - new_paid),
            'is_paid': new_paid >= amount,
      })


@login_required(login_url='login')
def waiter_set_pin(request):
      """Allow a waiter user to set or change their own waiter PIN."""
      todo = todoFunct(request)
      counters = todo.get('waiter_counter')
      if counters is None or not counters.exists():
            return redirect('/userdash')

      if request.method == 'POST':
            pin = str(request.POST.get('pin', '') or '').strip()
            pin_confirm = str(request.POST.get('pin_confirm', '') or '').strip()

            if len(pin) < 4 or not pin.isdigit():
                  return render(request, 'waiter_set_pin.html', {**todo, 'error': 'PIN lazima iwe nambari za 4 hadi 10'})

            if pin != pin_confirm:
                  return render(request, 'waiter_set_pin.html', {**todo, 'error': 'PIN hazifanani'})

            # Set the PIN on all counters belonging to this user
            counters.update(waiter_pin=pin, waiter_pin_set=True)
            return render(request, 'waiter_set_pin.html', {**todo, 'success': True})

      return render(request, 'waiter_set_pin.html', todo)


@login_required(login_url='login')
def waiter_settings(request):
      """Settings list page for waiter counter: set PIN and print mode toggle."""
      todo = todoFunct(request)
      counters = todo.get('waiter_counter')
      if counters is None or not counters.exists():
            return redirect('/userdash')

      active_counter = counters.filter(servicing=True).first()
      if not active_counter:
            return redirect('/mauzo/waiterpage')

      if request.method == 'POST':
            enable_print = bool(request.POST.get('enable_print'))
            InterprisePermissions.objects.filter(pk=active_counter.id).update(enable_print=enable_print)
            active_counter.enable_print = enable_print
            return render(request, 'waiter_settings.html', {**todo, 'active_counter': active_counter, 'saved': True})

      return render(request, 'waiter_settings.html', {**todo, 'active_counter': active_counter})


@login_required(login_url='login')
@login_required(login_url='login')
def waiter_pos_device_session(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            device_id   = str(request.POST.get('device_id',   '') or '').strip()
            device_name = str(request.POST.get('device_name', '') or '').strip()
      except:
            return JsonResponse({'success': False, 'msg': 'Data sio sahihi'})

      if len(device_id) < 4:
            return JsonResponse({'success': False, 'msg': 'Device ID haipo'})

      todo = todoFunct(request)
      duka = todo.get('duka')
      if not duka:
            return JsonResponse({'success': False, 'msg': 'Biashara haikupatikana'})

      if not duka.waiter_counter:
            return JsonResponse({'success': False, 'msg': 'Biashara haina waiter counter'})

      WaiterPosDeviceSession.objects.update_or_create(
            Interprise=duka,
            device_id=device_id,
            defaults={
                  'active': True,
                  'device_name': device_name if device_name else None,
            },
      )

      request.session['waiter_pos_biz']    = duka.id
      request.session['waiter_pos_device'] = device_id

      return JsonResponse({
            'success': True,
            'redirect': f'/mauzo/waiter_pos?biz={duka.id}&device_id={device_id}',
      })


def waiter_device_exit_session(request):
      if request.method != 'POST':
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      try:
            device_id = str(request.POST.get('device_id', '') or '').strip()
            biz_id = int(request.POST.get('biz', 0) or request.session.get('waiter_pos_biz', 0) or 0)
      except:
            return JsonResponse({'success': False, 'msg': 'Data sio sahihi'})

      if len(device_id) < 4:
            return JsonResponse({'success': False, 'msg': 'Device ID haipo'})

      session_qs = WaiterPosDeviceSession.objects.filter(device_id=device_id)
      if biz_id:
            session_qs = session_qs.filter(Interprise__id=biz_id)

      session_obj = session_qs.order_by('-updated_at').first()
      if not session_obj:
            fallback = f'/mauzo/waiter_pos?biz={biz_id}&device_id={device_id}' if biz_id else '/mauzo/waiter_pos'
            return JsonResponse({'success': False, 'msg': 'Device session not found', 'redirect': fallback})

      session_qs.update(active_user=None)

      request.session['waiter_pos_biz'] = session_obj.Interprise.id
      request.session['waiter_pos_device'] = device_id

      return JsonResponse({
            'success': True,
            'redirect': f'/mauzo/waiter_pos?biz={session_obj.Interprise.id}&device_id={device_id}',
      })


@login_required(login_url='login')
def waiter_pos_manage(request):
      """Ukurasa wa kusimamia vifaa vya shared Waiter POS."""
      todo = todoFunct(request)
      duka = todo.get('duka')
      if not duka or not duka.waiter_counter:
            return redirect('/userdash')

      if request.method == 'POST':
            action    = request.POST.get('action', '')
            device_id = str(request.POST.get('device_id', '') or '').strip()
            if action == 'deactivate' and device_id:
                  WaiterPosDeviceSession.objects.filter(
                        Interprise=duka.Interprise, device_id=device_id
                  ).update(active=False)
            elif action == 'delete' and device_id:
                  WaiterPosDeviceSession.objects.filter(
                        Interprise=duka.Interprise, device_id=device_id
                  ).delete()
            return redirect('/mauzo/waiter_pos_manage')

      devices = WaiterPosDeviceSession.objects.filter(
            Interprise=duka.Interprise
      ).order_by('-updated_at')

      todo.update({'devices': devices})
      return render(request, 'waiter_pos_manage.html', todo)


def waiter_pos(request):
      """
      Public/shared POS computer page for waiter PIN login.
      GET: Show all waiter counter users for a given business (by ?biz=<interprise_id>)
           OR let user pick a business first.
      POST: Verify PIN and set a session flag for the waiter, then redirect to waiterpage.
      """
      biz_id = int(request.GET.get('biz', 0) or request.POST.get('biz', 0) or 0)
      device_id = str(request.GET.get('device_id', '') or request.POST.get('device_id', '') or request.session.get('waiter_pos_device', '') or '').strip()
      duka = Interprise.objects.filter(pk=biz_id).first() if biz_id else None
      device_session_ok = False

      if duka and device_id:
            device_session_ok = WaiterPosDeviceSession.objects.filter(
                  Interprise=duka,
                  device_id=device_id,
                  active=True,
            ).exists()
            if device_session_ok:
                  request.session['waiter_pos_biz'] = biz_id
                  request.session['waiter_pos_device'] = device_id

      if request.method == 'POST':
            counter_id = int(request.POST.get('counter', 0) or 0)
            pin = str(request.POST.get('pin', '') or '').strip()

            if not biz_id or not counter_id or not pin:
                  return JsonResponse({'success': False, 'msg': 'Data haipo'})

            if not device_id:
                  return JsonResponse({'success': False, 'msg': 'Kifaa hakijatambulika'})

            if not device_session_ok:
                  return JsonResponse({'success': False, 'msg': 'Kifaa hakijasajiliwa kwa waiter POS'})

            counter = InterprisePermissions.objects.filter(
                  pk=counter_id,
                  Interprise__id=biz_id,
                  waiter_counter=True,
                  waiter_pin=pin,
            ).first()

            if not counter:
                  return JsonResponse({'success': False, 'msg': 'PIN si sahihi'})

            # Mark this counter as servicing (deactivate others first)
            InterprisePermissions.objects.filter(
                  Interprise__id=biz_id,
                  waiter_counter=True,
            ).update(servicing=False)
            InterprisePermissions.objects.filter(pk=counter_id).update(servicing=True)

            # Set session so the logged-in user (the device account) can proceed
            request.session['waiter_pos_counter'] = counter_id
            request.session['waiter_pos_biz'] = biz_id

            # Save active_user to device session
            WaiterPosDeviceSession.objects.filter(
                  Interprise__id=biz_id,
                  device_id=device_id,
            ).update(active_user=counter)

            return JsonResponse({'success': True, 'redirect': f'/mauzo/waiter_device_dashboard?biz={biz_id}&device_id={device_id}'})

      # GET: load counters for selected business
      counters = []
      if duka:
            counters = list(
                  InterprisePermissions.objects.filter(
                        Interprise=duka,
                        waiter_counter=True,
                  ).select_related('user__user').values(
                        'id',
                        'cheo',
                        'user__user__first_name',
                        'user__user__last_name',
                        'waiter_pin',
                        'user_entp__Interprise__Intp_code'
                  )
            )
            # Only expose whether a PIN has been set, not the actual PIN
            for c in counters:
                  c['has_pin'] = bool(c.pop('waiter_pin', None))

      return render(request, 'waiter_pos.html', {
            'duka': duka,
            'biz_id': biz_id,
            'device_id': device_id,
            'device_session_ok': device_session_ok,
            'counters': counters,
      })


def waiter_device_exit(request):
      """Clear active waiter user for a shared waiter POS device and return to PIN page."""
      if request.method != 'POST':
            return JsonResponse({'success': False, 'msg': 'Invalid method'})

      device_id = str(request.POST.get('device_id', '') or request.session.get('waiter_pos_device', '') or '').strip()
      try:
            biz_id = int(request.POST.get('biz', 0) or request.session.get('waiter_pos_biz', 0) or 0)
      except:
            biz_id = 0

      if not device_id:
            return JsonResponse({'success': False, 'msg': 'Kifaa hakijatambulika'})

      ds_qs = WaiterPosDeviceSession.objects.filter(device_id=device_id, active=True)
      if biz_id:
            ds_qs = ds_qs.filter(Interprise__id=biz_id)

      ds = ds_qs.select_related('Interprise').order_by('-updated_at').first()
      if not ds:
            return JsonResponse({'success': False, 'msg': 'Kifaa hakijasajiliwa'})

      ds.active_user = None
      ds.save(update_fields=['active_user', 'updated_at'])

      request.session['waiter_pos_biz'] = ds.Interprise.id
      request.session['waiter_pos_device'] = device_id

      return JsonResponse({
            'success': True,
            'redirect': f'/mauzo/waiter_pos?biz={ds.Interprise.id}&device_id={device_id}',
      })


def waiter_device_dashboard(request):
      """
      Device-authenticated waiter POS dashboard.
      Similar to waiterpage but uses device session instead of user login.
      Print button always visible (force enable_print=True).
      """
      try:
            biz_id = int(request.GET.get('biz', 0) or request.POST.get('biz', 0) or request.session.get('waiter_pos_biz', 0) or 0)
            device_id = str(request.GET.get('device_id', '') or request.POST.get('device_id', '') or request.session.get('waiter_pos_device', '') or '').strip()

            if not biz_id or not device_id:
                  return redirect('/mauzo/waiter_pos')

            duka = Interprise.objects.filter(pk=biz_id, waiter_counter=True).first()
            if not duka:
                  return redirect('/mauzo/waiter_pos')

            device_session = WaiterPosDeviceSession.objects.filter(
                  Interprise=duka,
                  device_id=device_id,
                  active=True,
            ).first()

            if not device_session or not device_session.active_user:
                  return redirect(f'/mauzo/waiter_pos?biz={biz_id}')

            active_counter = device_session.active_user
            counters = InterprisePermissions.objects.filter(
                  Interprise=duka,
                  waiter_counter=True,
            )

            payaccs_waiter = PaymentAkaunts.objects.filter(Interprise=duka.id, onesha=True)
            customer_table = customer_in_cell.objects.filter(area__Interprise=duka.id).select_related('area').order_by('area__name', 'name')
            customer_area = customer_table.distinct('area')
            class _UserLangObj:
                  langSet = 1

            todo = {
                  'duka': duka,
                  'useri': _UserLangObj(),
                  'waiter_counter': counters,
                  'customer_table': customer_table,
                  'customer_area': customer_area,
                  'payaccs_waiter': payaccs_waiter,
            }

            todo.update({
                  'waiter_counters': counters,
                  'active_waiter': active_counter,
                  'device_id': device_id,
                  'biz_id': biz_id,
                  'force_enable_print': True,  # Force print button visible
            })

            return render(request, 'waiter_device_dashboard.html', todo)

      except:
            traceback.print_exc()
            return redirect('/mauzo/waiter_pos')


def waiter_Invoprint(request):
      """Waiter-only print view, separate from Invoprint."""
      try:
            print_todo = viewWaiterInvo_funct(request)
            m = int(request.GET.get('m', 0))
            goto = 'minRecept.html' if m else 'invo.html'
            return render(request, goto, print_todo)
      except ValueError as er:
            code = str(er)
            if code == 'NO_ACTIVE_WAITER_COUNTER':
                  return redirect('/mauzo/waiter_pos')
            return redirect('/mauzo/waiter_pos')
      except:
            traceback.print_exc()
            return redirect('/mauzo/waiter_pos')


# @login_required(login_url='login')
def  Invoprint(request):
      
      try:
            todo = viewInvo_funct(request)
            m=int(request.GET.get('m',0))
           
            bil = todo['the_bill']
            goto = 'invo.html'
            if m:
               goto = 'minRecept.html'
            if bil.order:  
                  if not todo['duka'].Interprise:
                        return redirect('/userdash')
                  else:   
                                    
                        return render(request,goto ,viewInvo_funct(request))
            else:
                  if not todo['duka'].Interprise:
                        return redirect('/userdash')
                  else:             
                        return render(request,goto ,todo)
      except:
            traceback.print_exc()
            return render(request,'errorpage.html',todoFunct(request))          

# WHEN RETURN ITEM BUTTON IS CLICLED......................................//    
@login_required(login_url='login')
def  itm_return(request):
      try:
            todo = viewInvo_funct(request)
            duka = todo['duka']
            sale_no = 1
            return_str=''
            if sale_return.objects.filter(Interprise=duka.id).exists():
              invo_no = sale_return.objects.filter(Interprise=duka.id).last()
            
              sale_no = invo_no.Invo_no

            if sale_no <10:
                  return_str = '0000'+str(sale_no)
            elif sale_no <100 and sale_no >=10:
                  return_str = '000' +str(sale_no)    
            elif sale_no <1000 and sale_no >=100:
                  return_str = '00' +str(sale_no)    
            elif sale_no <10000 and sale_no >=1000:
                  return_str = '0' +str(sale_no)    
            elif sale_no >=10000 :
                  return_str =str(sale_no) 

            todo.update({
                  'return_coded':return_str,
            }) 
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:              
                  return render(request,'saleReturn.html' ,todo)
      except:
            traceback.print_exc()
            return render(request,'errorpage.html' ,todoFunct(request))

# LOAD SALES RETURN DATA ...................................................//
@login_required(login_url='login')
def  viewRtrn(request):
    intp= request.GET.get('item_valued','')
    back= request.GET.get('back_to','')
    code = request.GET.get('code','')
    lis_t= request.GET.get('lis_t',1)
    page_num =request.GET.get('page',1)

    msg = request.GET.get('msg',None)

    if msg is not None:
          msg = json.loads(msg)    
    else:
          msg={'pay':False}

#     duka = InterprisePermissions.objects.get(user__user =request.user, default = True)

  #     back= request.POST.get('back_to')
    after = {
          'lipa':False,
          'msg':msg
        
    }
    return render(request,'returnNotes.html',viewRetn_funct(request,intp,back,after,code,lis_t,page_num))

# LOAD ORder CASh REFUND DATA ...................................................//
@login_required(login_url='login')
def  viewRef(request):
    try:
      todo = viewRefnd_funct(request)
      if not todo['duka'].Interprise:
            return redirect('/userdash')
      else:       
         return render(request,'odaRef.html',todo)
    except:
        traceback.print_exc()
        return render(request,'errorpage.html',todoFunct(request))    


# LOAD SALES RETURN DATA ...................................................//
@login_required(login_url='login')
def  activateOda(request):
    try:
            todo = viewRefnd_funct(request)
            od = todo['the_bill']
            if od.exists():
                  od.update(full_returned=False)
                  mauzoList.objects.filter(mauzo=od.last().id).update(returned=0)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else: 
               return render(request,'refOdaView.html',todo)
    except:
           todo = todoFunct(request) 
           return render(request,'pagenotFound.html',todo)


# LOAD SALES RETURN DATA ...................................................//
@login_required(login_url='login')
def  viewOdaRef(request):
    try:
      todo = viewRefnd_funct(request)
      if not todo['duka'].Interprise:
            return redirect('/userdash')
      else:       
          return render(request,'refOdaView.html',todo)
    except:
         return render(request,'errorpage.html',todoFunct(request))   


@login_required(login_url='login')
def  ReFprint(request):
      try:
            todo =   viewRefnd_funct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else: 
                  if not todo['duka'].Interprise:
                        return redirect('/userdash')
                  else:                               
                      return render(request,'OdaRtnPrint.html' ,todo)
      except:
            todo = todoFunct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:             
                 return render(request,'OdaRtnPrint.html' ,todo)

@login_required(login_url='login')
def lipia_(request,ac,paid,bal_set,bal,itm_val,Code):
               duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
      
               toakwa= PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
               beforweka=toakwa.Amount 
               rtn = sale_return.objects.get(pk=itm_val,Interprise=duka.Interprise)
   
               toa = toaCash()
               toa.Akaunt = toakwa
               toa.Amount = paid
               toa.before = beforweka
               if bool(bal_set):
                     toa.After = bal 
                     toa.makato = beforweka-(bal+paid)
   
               else :
                     toa.After = beforweka - paid 
                     toa.makato = 0
                                       
               toa.kwenda = "Refund"
               toa.maelezo = 'RE-<a class="ivoice_details" href="/mauzo/viewRtrn?item_valued='+str(itm_val)+'" type="button"  >'+str(Code)+'</a>'
               toa.tarehe = datetime.datetime.now(tz=timezone.utc)
               toa.by=duka
               toa.Interprise=duka.Interprise
               toa.fidia=True
               toa.mauzo=rtn.ivo

               if not toakwa.onesha:
                     toa.usiri =True 
   
            #    if paid <=  beforweka and (paid+ilobaki) <= bill.amount:  
               if bool(bal_set): 
                   toakwa.Amount =  bal
               else:
                   toakwa.Amount =toakwa.Amount - paid

               toakwa.save()              
               toa.save() 

               rec_ = sale_return_mauzo_fidia()
               rec_.sale_rtn = rtn
               rec_.recordi = toa
               rec_.save()


# LOAD INVOINCE DATA ...................................................//
@login_required(login_url='login')
def  Itm_return_data(request):
   try:   
    if request.method == 'POST':  
      intp= request.POST.get('item_valued','')
      back= request.POST.get('back_to','')
      code = request.POST.get('code','')
      lis_t= request.POST.get('lis_t',1)

      retn_no = request.POST.get('return_no',None)
      retn_reson = request.POST.get('return_reson','')
      retn_date = request.POST.get('rudisha-date','')

      paid = request.POST.get('bill_tobe_paid',False)

      ac = int(request.POST.get('ac_val_',0))

      the_data = request.POST.get('rtn_data',None)

      paid_adv = request.POST.get('lipwa_amount','')

      baki = request.POST.get('iliyobaki_bill','')

      kulipa = request.POST.get('tarehe_kulipa',None)

      date = request.POST.get('rudisha-date')

      duka = InterprisePermissions.objects.get(user__user =request.user, default = True)

      uzo = mauzoni.objects.get(pk=intp,Interprise=duka.Interprise.id)
 


      if uzo.ilolipwa == 0:
            kulipa=uzo.kulipa

      if the_data is not None:
            the_data = json.loads(the_data) 

      zote_zipo=True
      amo = 0
      tt = 0
      
      for z in the_data:
            if not mauzoList.objects.filter(pk=z['val'],mauzo__Interprise=duka.Interprise.id).exists() or z['retn'] == 0:
                  zote_zipo = False
            else:
               itm =  mauzoList.objects.get(pk=z['val'],mauzo__Interprise=duka.Interprise.id)
               amo += itm.bei  * z['retn']     
               tt +=z['retn']   
               
     
     

      msg={'success':True,'swa':'Rekodi ya kurudisha bidhaa imefanikiwa kikamilifu','eng':'Sales Return saved successfully'}
      ak=PaymentAkaunts.objects.filter(pk=ac,Interprise=duka.Interprise.id)

      # print(amo) 
      if paid_adv !='':
            paid_adv = int(paid_adv)
      else:
            paid_adv = amo   


      if (not ak.exists() and paid) or not zote_zipo :
         msg={'success':False,'swa':'Rekodi  ya kurudisha bidhaa Haukafinikiwa tafadhari jaribu tena kwa usahihi','eng':'Sales Return not saved please try again correctly'}
         return redirect('/mauzo/return?item_valued='+str(intp)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))

      else:
         ac_amo__ = 0
         if PaymentAkaunts.objects.filter(pk=ac,Interprise=duka.Interprise.id).exists():
               ac_amo__ =   PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise.id).Amount
         if (ac_amo__ >= paid_adv) or (ac==0 and kulipa is not None) or uzo.ilolipwa == 0:  
            invono = 1
            invo_str=''
            if sale_return.objects.filter(Interprise=duka.Interprise).exists():
                  invo_no = sale_return.objects.filter(Interprise=duka.Interprise).last()
            
                  invono = invo_no.Invo_no

            if invono <10:
                  invo_str = '0000'+str(invono)
            elif invono <100 and invono >=10:
                  invo_str = '000' +str(invono)    
            elif invono <1000 and invono >=100:
                  invo_str = '00' +str(invono)    
            elif invono <10000 and invono >=1000:
                  invo_str = '0' +str(invono)    
            elif invono >=10000 :
                  invo_str =str(invono)

            rtrn= sale_return() 
            rtrn.code =invo_str  

            
           
            if amo <= uzo.ilolipwa:
                  rtrn.amount =amo 
            else:
                  rtrn.amount = uzo.ilolipwa     

            
            
            if ak.exists() and  paid_adv== amo or uzo.ilolipwa==0:      
               rtrn.full_paid = True          
            rtrn.Invo_no = invono+1
            rtrn.date = date
            rtrn.tarehe = datetime.datetime.now(tz=timezone.utc)

            if paid and ak.exists() :
                  rtrn.kulipa = date
                  rtrn.akaunt =  PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise.id) 
                  rtrn.ilolipwa =paid_adv  

            else :
                  rtrn.kulipa = kulipa

            rtrn.ivo = mauzoni.objects.get(pk=intp,Interprise=duka.Interprise.id)
            rtrn.Interprise = duka.Interprise
            rtrn.maelezo =  retn_reson
            rtrn.By = duka
            rtrn.save()

            msg.update({
                  'rt':rtrn.id,
                  'list':lis_t
            })



            for z in the_data:
                  retnd = mauzoList.objects.get(pk=z['val'],mauzo__Interprise=duka.Interprise.id)
                  retnd.returned += round(z['retn'],3)
                  retnd.save()
                  
                   
                  retn = sa_ret.objects.filter(ret=rtrn.id,sa_list=retnd.id)
                  if retn.exists():
                        retn.update(idadi=F('idadi') + float(z['retn']) )
                  else:
                        retn = sa_ret()            
                        retn.idadi = float(z['retn'])
                        retn.ret = rtrn
                        retn.sa_list = retnd

                        retn.save()     

                  bidhaa_stoku.objects.filter(pk=retnd.produ.id).update(idadi=F('idadi')+float(z['retn']))

                  if sales_color.objects.filter(pk=z['color'],mauzo=retnd.id).exists():
                        cl__ = sales_color.objects.get(pk=z['color'],mauzo=retnd.id)
                        cl__.returned += round( z['retn'],3)
                        cl__.save()  
                        produ_colored.objects.filter(pk=cl__.color.id).update(idadi=F('idadi')+float(z['retn']))   
                    
                        retnC = sa_col_ret.objects.filter(ret=rtrn.id,sa_list=cl__.id)
                        if retnC.exists():
                              retnC.update(idadi=F('idadi')+float(z['retn']))
                        else: 
                              retnC = sa_col_ret()
                              retnC.idadi = float(z['retn'])
                              retnC.ret = rtrn
                              retnC.sa_list = cl__
                              retnC.save()

                  if sales_size.objects.filter(pk=z['size'],mauzo=retnd.id).exists():
                        sz__ = sales_size.objects.get(pk=z['size'],mauzo=retnd.id)
                        sz__.returned +=round( z['retn'],3)
                        sz__.save()  
                        produ_size.objects.filter(pk=sz__.size.id).update(idadi=F('idadi')+float(z['retn']))   
                      
                        retnS = sa_size_ret()
                        retnS.idadi = float(z['retn'])
                        retnS.ret = rtrn
                        retnS.sa_list = sz__
                        retnS.save()  

            sumi = mauzoList.objects.filter(mauzo=uzo.id).aggregate(Sum('idadi'))
            if tt == sumi['idadi__sum']:
                  uzo.full_returned =True

            uzo.amount=uzo.amount - amo
            if uzo.ilolipwa > 0 and ak.exists()  :
                  if amo<=uzo.ilolipwa:
                     uzo.ilolipwa = uzo.ilolipwa - paid_adv
                  else:
                        uzo.ilolipwa = 0   

            uzo.confirm_return = False
            uzo.save()


            if ak.exists():
                  payd = amo
                  remain_set = False
                  if paid_adv>0:
                        payd=paid_adv
                  if baki !='':
                        remain_set=True
                        baki = float(baki)
                     
                  lipia_(request,ac,payd,remain_set,baki,rtrn.id,invo_str) 



            # Record Notiications For returning te itm ......................................//
            notice = Notifications()
            notice.date= datetime.datetime.now(tz=timezone.utc)
            notice.Interprise= duka.Interprise
            notice.saRtn= True
            notice.saRtn_map= rtrn
            if duka.Interprise.owner.user == request.user:
                notice.admin_read = True
            else:
                notice.Incharge_reade = True

            notice.Incharge = todoFunct(request)['useri']    
            notice.save() 


     
            # return redirect('/mauzo/viewRtrn?item_valued='+str(intp)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))

         else:
     
            msg={'success':False,'swa':'Rekodi  ya kurudisha bidhaa Haukafinikiwa tafadhari jaribu tena kwa usahihi','eng':'Sales Return not saved please try again correctly'}
            
            # return redirect('/mauzo/return?item_valued='+str(intp)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))

         return JsonResponse(msg)
    else:
       return render(request,'pagenotFound.html',todoFunct(request))      
   except:

       msg={'success':False,'swa':'Rekodi  ya kurudisha bidhaa Haukafinikiwa tafadhari jaribu tena kwa usahihi','eng':'Sales Return not saved please try again correctly'}
       return JsonResponse(msg)    

# KuRUDISHA BIDHAA..........................................//
@login_required(login_url='login')
def payReturn(request):
    if request.method == "POST":
          # try: 
               value=request.POST.get('value')
               back=request.POST.get('backto')
               ac=request.POST.get('ac')
               paid_set=int(request.POST.get('paid_set'))
               paid=request.POST.get('paid')
               bal=request.POST.get('bal')
               bal_set=int(request.POST.get('bal_set'))
               pay_d = request.POST.get('pay_d')   
               lis_t = request.POST.get('lis_t')  


               todo = todoFunct(request) 
               duka = todo['cheo']
               return_ = sale_return.objects.get(pk=value,Interprise=duka.Interprise.id)
               # matum = rekodiMatumizi.objects.filter(manunuzi_id=return_.id,Interprise=duka.Interprise)
               user = duka.user
               
               list_manunu = bidhaa_stoku.objects.filter(manunuzi__manunuzi=return_.id)

            
               ilobaki = return_.ilolipwa 
               if not bool(paid_set):
                     return_.ilolipwa = return_.amount 
                     paid = return_.amount-ilobaki
               else: 
                     paid = int(paid)
                     return_.ilolipwa = return_.ilolipwa + paid
               if (paid+ilobaki) <= return_.amount :

                  return_.akaunt = PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)   
                  if return_.amount == ilobaki + paid:
                        return_.full_paid = True
                        return_.kulipa = pay_d
                  return_.save()

            #    UPDATE TO THE SALES  
               mauzoni.objects.filter(pk=return_.ivo.id).update(ilolipwa=float(paid)) 

               toakwa= PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
               beforweka=toakwa.Amount 
   
               toa = toaCash()
               toa.Akaunt = toakwa
               toa.Amount = paid
               toa.before = beforweka
               if bool(bal_set):
                     bal = int(bal)
                     toa.After = bal 
                     toa.makato = beforweka-(bal+paid)
   
               else :
                     toa.After = beforweka - paid 
                     toa.makato = 0
                                       
               toa.kwenda = "Refunding"
               toa.maelezo = 'Return no RE-<a class="ivoice_details" href="/mauzo/viewRtrn?item_valued='+str(return_.id)+'" type="button"  data-id="'+str(return_.id)+'">'+return_.code+'</a>'
               toa.tarehe = datetime.datetime.now(tz=timezone.utc)
               toa.by=duka
               toa.Interprise=duka.Interprise
               toa.manunuzi=True
               if not toakwa.onesha:
                     toa.usiri =True 
   
               if paid <=  beforweka and (paid+ilobaki) <= return_.amount:  
                     if bool(bal_set): 
                        toakwa.Amount =  bal
                     else:
                        toakwa.Amount =toakwa.Amount - paid
   
                     toakwa.save()              
                     toa.save() 
                     
                  #    rekodi payment means. for futher reference...........................//
                     record = sale_return_mauzo_fidia()

                     record.sale_rtn=return_
                     record.recordi=toa

                     record.save()
                 


   
               billed = sale_return.objects.get(pk=value,Interprise=duka.Interprise.id)              

               sure = 1  
               swa='malipo ya Kurejesh pesa yamerekodiwa kikamilifu'
               eng='Sales Return payment recorded successfully'
               succ = True
               if paid > (return_.amount+ilobaki):
                       sure = 0
                       swa='Rekodi ya rejesho la pesa haijafanikiwa tafadhari jaribu tena kwa usahihi'
                       eng='Sales return refunding payment was not successfully please try again correctly'  
                       succ=False   

               msg={'is_added':True,'success':succ,'swa':swa,'eng':eng}

               
               return redirect('/mauzo/viewRtrn?item_valued='+str(return_.id)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))
    else:
        return render(request,'pagenotFound.html',todoFunct(request))      

                
@login_required(login_url='login')
def oda_refund(request):
    if request.method == "POST":
          try:
               value=int(request.POST.get('the_invo',0))
               back=request.POST.get('backto','all')
               ac=request.POST.get('rac')
            #    paid_set=int(request.POST.get('paid_set'))
               paid=request.POST.get('rudi_kiasi')

               bal=request.POST.get('rudi_ac_baki',0)
               if bal != '':
                     bal = float(bal)
               else:
                     bal = 0      

               ref=request.POST.get('kumbu_namba',None)
               charge = request.POST.get('rudi_kiasi_kato',0)
               if charge!='':
                  charge = int(charge)
                  charge = float(charge)
               else:
                     charge = 0   

               maelezo = request.POST.get('rudisha_maelezo',None) 

               lis_t = request.POST.get('lis_t',1)   

               duka = InterprisePermissions.objects.get(user__user =request.user, default = True)

               user = UserExtend.objects.get(user = request.user.id )

               toakwa = PaymentAkaunts.objects.filter(pk=ac,Interprise=duka.Interprise)
                
           

               data={
                           'msg_swa':'malipo ya Kurejesh pesa yamerekodiwa kikamilifu',
                           'msg_eng':'Order amount Return payment recorded successfully' ,
                           'success':True,  
                     }

               billed = mauzoni.objects.filter(pk=value,Interprise=duka.Interprise.id) 

               if paid =='':
                     paid = float(billed.last().ilolipwa) - charge
               else:
                     paid = float(paid)     

               if toakwa.exists() and toakwa.last().Amount>=paid and billed.exists() :
                     toakwa=PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
                     billed = billed.last()


                  #  UPDATE ORDER STUTUS ..................//
                     billed.ilolipwa =  float(billed.ilolipwa )  - (paid + charge)
                     billed.save()

                     sale_no = 1
                     return_str=ref
                     if ref =='':
                           if Cash_order_return.objects.filter(ivo__Interprise=duka.Interprise).exists():
                                 invo_no = Cash_order_return.objects.filter(ivo__Interprise=duka.Interprise).last()
                           
                                 sale_no = invo_no.Invo_no + 1
                           if sale_no <10:
                                 return_str = '0000'+str(sale_no)
                           elif sale_no <100 and sale_no >=10:
                                 return_str = '000' +str(sale_no)    
                           elif sale_no <1000 and sale_no >=100:
                                 return_str = '00' +str(sale_no)    
                           elif sale_no <10000 and sale_no >=1000:
                                 return_str = '0' +str(sale_no)    
                           elif sale_no >=10000 :
                                 return_str =str(sale_no)   
               
                                 
                     bal_set = False
                     paid_set =False   
                     if paid >0:
                           paid_set = True 
                     if bal > 0:
                           bal_set = True    
                     return_ = Cash_order_return()
                     return_.code = return_str
                     return_.akaunt=toakwa
                     return_.amount=paid   
                     return_.date=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")
                     return_.maelezo=maelezo
                     return_.ivo=billed
                     return_.makato=float(charge)
                     return_.By = duka
                     return_.Invo_no = sale_no
                        
                     
                     beforweka=float(toakwa.Amount) 
         
                     toa = toaCash()
                     toa.Akaunt = toakwa
                     toa.Amount = paid
                     toa.before = beforweka
                     if bool(bal_set):
                           bal = int(bal)
                           toa.After = bal 
                           toa.makato = beforweka-(bal+paid)
         
                     else :
                           toa.After = beforweka - paid 
                           toa.makato = 0
                                             
                     toa.kwenda = "Order Refund"
                     toa.oda_fidia = True
                  #    toa.rudi = 
                     toa.maelezo = 'Order Refund'
                     toa.tarehe = datetime.datetime.now(tz=timezone.utc)
                     toa.by=duka
                     toa.Interprise=duka.Interprise
                  #    toa.manunuzi=True
                     if not toakwa.onesha:
                           toa.usiri =True 
         
                     if paid <=  beforweka :  
                           if bool(bal_set): 
                                 toakwa.Amount =  bal
                           else:
                                 toakwa.Amount =float(toakwa.Amount) - paid
         
                           toakwa.save()              
                           toa.save() 
                           return_.record=toa
                           return_.save()
                           toa.maelezo = 'REF-<a class="ivoice_details" href="/mauzo/viewRef?item_valued='+str(return_.id)+'" type="button"  data-id="'+str(return_.id)+'">'+return_.code+'</a>'
                           toa.save() 
                     # kwa makato......................//

                           

                     
         
                     sure = 1  
                     data.update({'rtn':return_.id})

            

               else:     
                     data={
                           'msg_swa':'Akaunti ya malipo uliyoichagua haina kiasi cha kutosha au akaaunti sio sahihi tafadhari jaribu tena kwa usahihi',
                           'msg_eng':'Oda refund record was not successfully recorder this may be due to unknown Payment account or the account has insufficient amount please try again' ,
                           'success':False,  
                     }

               return JsonResponse(data)
          except:
                data={
                      'success':False,
                      'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
                      'msg_eng':'Action was not successfully please try again'
                } 

                return JsonResponse(data)                    
              
              
            #    msg={'is_added':True,'success':succ,'swa':swa,'eng':eng}   
                     
            #    return redirect('/mauzo/viewRef?item_valued='+str(return_.id)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))
            
    else:
      return render(request,'pagenotFound.html',todoFunct(request))      


# pay  INVOINCE .........................................//
@login_required(login_url='login')
def  lipaInvo(request):
      
      if request.method == 'POST':
            try:
                  value=request.POST.get('invo_value')
                  ac=request.POST.get('invo_ac_id')
                  back = 'allInvo'
                  page_num =request.POST.get('page',1)
                  

                  paid_amo = int(request.POST.get('invo_amo'))  
                  pay_d = request.POST.get('pay_d')
                  desc = request.POST.get('lipaElezo','')
                  #    print(paid_amo)

                  duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
                  
                  after={
                        'pay':True,  
                        'success':True,
                        'msg_swa' : 'Data za Malipo ya ankara zimehifadhiwa kikamilifu' ,
                        'msg_eng' : 'Invoice Payment recorded succefully',
                  }
            
                  
                  
                  if  PaymentAkaunts.objects.filter(pk=ac,Interprise=duka.Interprise.id).exists():
                  
                        bill = mauzoni.objects.get(pk=value,Interprise=duka.Interprise.id)
                        ilobaki = bill.ilolipwa                
                        if (paid_amo+ilobaki) <= bill.amount :
                              bill.akaunt = PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise.id)   
                              if bill.amount == ilobaki + paid_amo:
                                    bill.full_paid = True

                              if  (paid_amo+ilobaki) == bill.amount:
                                    bill.kulipa = pay_d

                              bill.ilolipwa = bill.ilolipwa + paid_amo
                              bill.save()

                              wekakwa= PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
                              beforweka=wekakwa.Amount    
                              weka = wekaCash()
                              weka.Akaunt = wekakwa
                              weka.Amount = paid_amo
                              weka.before = beforweka               
                              weka.After = beforweka + paid_amo 
                              weka.kutoka = "Goods Sales"
                              weka.maelezo = desc
                              weka.tarehe = datetime.datetime.now(tz=timezone.utc)
                              weka.by=duka
                              weka.Interprise=duka.Interprise
                              weka.mauzo=True
                              weka.invo = bill
                              if not wekakwa.onesha:
                                    weka.usiri =True               
                              wekakwa.Amount =wekakwa.Amount + paid_amo   
                              wekakwa.save()              
                              weka.save()
                              
                        else:
                              after={
                                    'pay':True,  
                                    'success':False,
                                    'swa' : 'Data za Malipo ya ankara hazijafanikiwa  kutokana na kiasi kinacholipwa kuzidi kiasi halisi cha ankara' ,
                                    'eng' : 'Invoice Payment was not recorded, because the paid amount exceeds the invoice amount',
                              }     
                  else:
                        after={
                                    'pay':True,  
                                    'success':False,
                                    'msg_swa' : 'Data za Malipo ya ankara hazijafanikiwa  kutokana na akaunti ya malipo kutokutambulika tafadhari jaribu tena kwa usahihi' ,
                                    'msg_eng' : 'Invoice Payment was not recorded, because The selected payment account does not exists please again to submit payment correctly',
                              }
                  return JsonResponse(after)    
            except:
                  data={
                         
                                    'success':False,
                                    'msg_swa' : 'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena' ,
                                    'msg_eng' : 'Action was not successfully please try again',
                              
                  }  

                  return JsonResponse(data)

         
      else:
         return render(request,'pagenotFound.html',todoFunct(request))      

    
@login_required(login_url='login')
def  saleOda(request):
    try: 
      todo =  AllsaleOdaFuct(request)
      if not todo['duka'].Interprise:
            return redirect('/userdash')
      else:          
         return render(request,'salesOda.html',todo)
    except:
            todo = todoFunct(request)
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:       
                 return render(request,'salesOda.html',todo)

@login_required(login_url='login')
def  saleOdaItems(request):
    try: 
      todo = todoFunct(request)
      if not todo['duka'].Interprise:
            return redirect('/userdash')
      else:       
         return render(request,'salesOdaItems.html',todo)
    except:
          return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def  newsaleOda(request):
    used = request.user
    dukap = InterprisePermissions.objects.get(user__user = used.id, default = True)
          #  maduka = Interprise.objects.get(pk = dukap.id )
    duka = Interprise.objects.get(pk = dukap.Interprise.id  )
    user = UserExtend.objects.get(user = used.id )
    
    invono = 1
    invo_str=''
    if mauzoni.objects.filter(Interprise=dukap.Interprise).exists():
       invo_no = mauzoni.objects.filter(Interprise=duka).last()
    
       invono = invo_no.Invo_no

    if invono <10:
          invo_str = '0000'+str(invono)
    elif invono <100 and invono >=10:
          invo_str = '000' +str(invono)    
    elif invono <1000 and invono >=100:
          invo_str = '00' +str(invono)    
    elif invono <10000 and invono >=1000:
          invo_str = '0' +str(invono)    
    elif invono >=10000 :
          invo_str =str(invono) 

    todo =todoFunct(request)
    todo.update({
          'invo':invo_str
    })
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'newSaleOda.html',todo)

@login_required(login_url='login')
def  addInvoice(request):
      if request.method == "POST":
       try:     
         sup=request.POST.get('sup')
         edit=int(request.POST.get('edit'))
         bil_val=request.POST.get('bill')
         date=request.POST.get('date')
         bill_no_=request.POST.get('bill_no')
         code_set=int(request.POST.get('code_set'))
         inalipwa=int(request.POST.get('inalipwa'))
         akaunt=int(request.POST.get('akaunt'))
         oda=int(request.POST.get('oda'))
         rudi=int(request.POST.get('rudi'))
         rudi_val=int(request.POST.get('rudi_val'))
            #    tumi_set=int(request.POST.get('exp_set'))
            #    tumizi=json.loads(request.POST.get('exp_dt'))
         bill=json.loads(request.POST.get('itm_dt'))
         kulipa=request.POST.get('kulipa')
         toLabor=int(request.POST.get('toLabor'))

         amount=float(request.POST.get('amount'))
         invo_am=float(request.POST.get('invo_am'))
         amount_set=bool(int(request.POST.get('amount_set')))

         cust_set=request.POST.get('custom_set')
         # Custom details 
         cust_name=request.POST.get('cusom_name')
         cust_reg=int(request.POST.get('reg'))
         cust_entp=request.POST.get('reg_val')
         address=request.POST.get('address')
         simu=request.POST.get('simu')
         mail=request.POST.get('mail')
         service=int(request.POST.get('service',0))
         servFrom=request.POST.get('servFrom')
         servTo=request.POST.get('servTo')
         desc=request.POST.get('desc')
         paydesc=request.POST.get('lipaEleza')
         sasa=request.POST.get('now')
         ch=int(request.POST.get('ch',0))
         resev=int(request.POST.get('resev',0))
         todo = todoFunct(request)
         duka = todo['duka']


         entp = InterprisePermissions.objects.get((Q(user=duka.owner.id)|Q(viewi=False,mauzo_na_matumizi=True)),user__user = request.user, default = True)
         
         bill_str=bill_no_

         reg_custom = user_customers()
         mauzi = mauzoni()
         online = False
         bill_sum=0
 
         for bil in bill:
               thesum = 1
                        
               bill_sum+=bil['bei']*bil['idadi']*bil['servT']
               
         if edit:
             mauzi=mauzoni.objects.get(pk=bil_val,Interprise=entp.Interprise)
             kwenye_list=mauzoList.objects.filter(mauzo=mauzi.id)
             if mauzi.online:
                   online = True
            
             kwenye_list.delete()                        
         else:
             invo_desc = invoice_desk.objects.filter(Interprise=duka.id)
             if invo_desc.exists():
                  mauzi.invo_desc = invo_desc.last()

         beforweka=0
         if inalipwa and not edit:
                  wekakwa= PaymentAkaunts.objects.get(pk=akaunt,Interprise=entp.Interprise)
                  beforweka=wekakwa.Amount
         invono = 1
         invo_str=''
         if mauzoni.objects.filter(Interprise=entp.Interprise).exists():
               invo_no = mauzoni.objects.filter(Interprise=entp.Interprise).last()
         
               invono = invo_no.Invo_no

         if invono <10:
               invo_str = '0000'+str(invono)
         elif invono <100 and invono >=10:
               invo_str = '000' +str(invono)    
         elif invono <1000 and invono >=100:
               invo_str = '00' +str(invono)    
         elif invono <10000 and invono >=1000:
               invo_str = '0' +str(invono)    
         elif invono >=10000 :
               invo_str =str(invono)  

       


         #    INCASE THE INVOINCE AIM TO REFUND THE RETURNED ITEMS..........................//
         rudi_am=0
         if bool(rudi):
              sr = sale_return.objects.filter(pk=rudi_val,Interprise=entp.Interprise)
              if sr.exists():
                    bil_am = float(bill_sum)
                    ret_am = float(sr.last().amount) 
                    ret_pd = float(sr.last().ilolipwa)
                    ret_dn= ret_am - ret_pd
                    rudi_am=ret_dn

                    if bil_am >= ret_dn:
                          sr.update(ilolipwa=F('amount'))
                          mauzoni.objects.filter(pk=sr.last().ivo.id).update(ilolipwa=F('ilolipwa')-sr.last().amount)
                    else:
                          sr.update(ilolipwa=bil_am)  
                          mauzoni.objects.filter(pk=sr.last().ivo.id).update(ilolipwa=F('ilolipwa')-bil_am)





         mauzi.Interprise=entp.Interprise             
         mauzi.code = invo_str
         if inalipwa and not edit:
            mauzi.akaunt =  PaymentAkaunts.objects.get(pk=akaunt)
            #    if amount_set:         
            #       mauzi.akaunt =  PaymentAkaunts.objects.get(pk=akaunt)

         if  edit and wateja.objects.filter(pk=sup).count()==0:
             mauzi.customer_id = mauzi.customer_id
             mauzi.user_customer = mauzi.user_customer
             mauzi.mteja_jina = mauzi.mteja_jina
             mauzi.simu = mauzi.simu
             mauzi.address = mauzi.address
             mauzi.mail = mauzi.mail
            
         else:      
            if  wateja.objects.filter(pk=sup,Interprise=entp.Interprise.id).exists() and not toLabor:
                watj = wateja.objects.get(pk=sup,Interprise=entp.Interprise.id)  
                mauzi.customer_id = watj
                mauzi.saved_custom =True
                if watj.active:
                  reg_custom.enteprise = watj.mteja.user
                  reg_custom.save()
                  cust_reg = 1
                  cust_entp = reg_custom.enteprise.id

            laborere = None
            
            if toLabor:
                  laborer = Workers.objects.get(pk=sup,Interprise__owner=duka.owner.id) 
                  mauzi.labour =laborer
                  if laborer.diactive:
                        laborere = laborer.diactive.where
            
            if cust_reg or laborere:
               regCu = laborere
               if laborere:
                     regCu = laborere
               else:
                     regCu = Interprise.objects.get(pk=cust_entp)       

               reg_custom.enteprise = regCu
               reg_custom.by = regCu.owner 
               reg_custom.save()
               mauzi.user_customer = reg_custom

               billno = 1
               if manunuzi.objects.filter(Interprise=regCu.id).exists():
                        bill_no = manunuzi.objects.filter(Interprise=regCu.id).last()      
                        billno = bill_no.bill_no

               if billno <10:
                     bill_str = '0000'+str(billno)
               elif billno <100 and billno >=10:
                     bill_str = '000' +str(billno)    
               elif billno <1000 and billno >=100:
                     bill_str = '00' +str(billno)    
               elif billno <10000 and billno >=1000:
                     bill_str = '0' +str(billno)    
               elif billno >=10000 :
                              bill_str =str(billno)  
              
               pu = manunuzi()
               pu.Interprise = regCu
               pu.code = bill_str           
               pu.amount = float(bill_sum)                                             
               pu.kulipa =  date       
               pu.order = True 
               pu.nunua = True 
                    
               pu.tarehe = datetime.datetime.now(tz=timezone.utc)        
               pu.bill_no = billno + 1       
               pu.save()

               mauzi.bill_kwa = pu
               mauzi.Packed_at = datetime.datetime.now(tz=timezone.utc)  


            mauzi.mteja_jina = cust_name
            mauzi.simu = simu
            mauzi.address = address
            mauzi.mail = mail   

         if amount==invo_am and bool(inalipwa):
            mauzi.kulipa = date
            mauzi.full_paid = True

         else:   
            mauzi.kulipa = kulipa     
         mauzi.date = date   
         mauzi.tarehe = datetime.datetime.now(tz=timezone.utc)   
         mauzi.Invo_no = invono+1 

      #    INCASE ITS SERVICE  
         mauzi.service = service  
         mauzi.servFrom = servFrom 
         mauzi.servTo = servTo 
         mauzi.desc = desc  
        #    mauzi.code = invo_str
        


         mauzi.amount = round(bill_sum,2)
        #    print(round(bill_sum,2))

         if bool(inalipwa) and not amount_set and not bool(rudi):
               mauzi.ilolipwa = round(bill_sum,2)
         elif bool(inalipwa) and amount_set and not bool(rudi):
               mauzi.ilolipwa= amount
         elif bool(rudi):
               if float(rudi_am) <= float(bill_sum):
                  mauzi.ilolipwa = rudi_am 
               else:
                  mauzi.ilolipwa = float(bill_sum) 
                                  

         if bool(oda):
               mauzi.order = True
               mauzi.confirmed = True
        #    if beforweka >= bill_sum or not bool(inalipwa):
         mauzi.By=todo['cheo']
         mauzi.save()   

    
         # EXCHANGING SERVICES....////////
         if ch:
               exch = mauzoni.objects.get(Q(By=entp.id)|Q(Interprise__owner=duka.owner),pk=bil_val,Interprise=entp.Interprise,service=True)
            
               chg = ChangedServiceTo()
               chg.To = mauzi
               chg.save()

               changi=ChangedService.objects.get(from_serv=exch.id)
               changi.to_serv = chg
               changi.save()
               listed=mauzoList.objects.filter(mauzo=exch.id)
               #    if the previos invo is to be ignored
               if resev:
                     mauzi.ilolipwa = exch.ilolipwa
                     mauzi.save()
                     exch.ignore = True
                     exch.ilolipwa = 0
                     exch.amount = 0
                     exch.save()
                     listed.update(saveT=0)
                     
               else:
                  servedFrom = exch.servFrom
                  servedTo = exch.Changed
                  diff = (servedTo-servedFrom).total_seconds()

                  dura = [
                           {
                                'value':0,
                                'duration':1
                           },
                              {
                              'value':1,
                              'duration':int((diff)/60)
                        },
                              {
                              'value':2,
                              'duration':int(((diff)/60)/60)
                              },
                              {
                              'value':3,
                              'duration':int((((diff)/60)/60)/24)
                              },
                              {
                              'value':4,
                              'duration':int(((((diff)/60)/60)/24)/7)    
                              },
                              {
                              'value':5,
                              'duration':int(((((diff)/60)/60)/24)/31)  
                              },
                              {
                              'value':6,
                              'duration':int((((((diff)/60)/60)/24)/31)/12)
                              }
                        
                        ]
                 
                  
                  for l in listed:
                        muda = 1
                        if l.produ.timely > 0:
                              muda = next(x for x in dura if x["value"]==int(l.produ.timely))['duration']
                        mauzoList.objects.filter(pk=l.id).update(saveT=muda)

                  TotAmount = listed.aggregate(sumi = Sum(F('bei')*F('idadi')*F('saveT'),output_field=FloatField()))['sumi']      
                  PrPaid = exch.ilolipwa
                  exch.amount = float(TotAmount)
                  if PrPaid >= TotAmount:
                        exch.ilolipwa = float(TotAmount)
                        mauzi.ilolipwa = float(PrPaid) - float(TotAmount)     
                        mauzi.save()    
                  exch.save()
                  # muda = next(x for x in dura if x["value"]==6)

                


  
         
         
         for bil in bill:
            #  SAVE BILL LIST..............................//
              produ_details = bidhaa_stoku.objects.get(pk=bil['value'],Interprise=entp.Interprise)
              Rangi = produ_colored.objects.filter(bidhaa=produ_details.id)
              size = produ_size.objects.filter(bidhaa=produ_details.id)

              list_mauzo = mauzoList()
              list_mauzo.mauzo = mauzi
              list_mauzo.bei = bil['bei']/bil['uwiano']
              list_mauzo.produ = produ_details
              list_mauzo.serial = bil['serial']
              list_mauzo.bei_og = bil['bei']
              list_mauzo.packed = 0
              list_mauzo.saveT = int(bil['servT'])
              if  online:
                    matched = salePuMatch.objects.filter(pk=bil['match'])
                    if matched.exists():
                        list_mauzo.match=matched.last()              

              the_qty = 0
              if bil['jum']:
                  list_mauzo.idadi = bil['idadi'] * produ_details.bidhaa.idadi_jum
                  the_qty = bil['idadi'] * produ_details.bidhaa.idadi_jum
              else:
                  list_mauzo.jum =  False 
                  list_mauzo.idadi = bil['idadi'] * bil['uwiano']
                  the_qty=bil['idadi'] * bil['uwiano']
              
              
              list_mauzo.vat_included=bil['vat_include']
              list_mauzo.vat_set=bil['vat_set']

              NOTSURE = False
              if produ_details.produced is not None:
                  NOTSURE = produ_details.produced.notsure
              
             
              if (produ_details.idadi >= the_qty or NOTSURE ) or bool(oda):
                 
                 list_mauzo.save() 

                 if not bool(oda):
                      if not bil['notsure'] and not produ_details.service: 
                        produ_details.idadi = float(produ_details.idadi) - float(list_mauzo.idadi)
                        
                        produ_details.save()
                        if produ_details.idadi == 0:
                             inapacha_ = bidhaa_stoku.objects.filter(bidhaa=produ_details.bidhaa.id,idadi__gt=0).exclude(pk=produ_details.id)
                             if inapacha_.exists():
                                   inapa = inapacha_.last()
                                   inapa.inapacha = False
                                   inapa.save() 
                                   itm={
                                          "itm":produ_details,
                                          "request":request,
                                          "out":True,
                                          "other":inapa
                                          }
                                   updateOrder(itm)

                                   produ_details.inapacha = True
                                   produ_details.save()
                      elif bil['notsure']:
                          productionList.objects.filter(pk=produ_details.produced.id).update(qty=F('qty')+list_mauzo.idadi)    
            #      fordit_col= sales_color.objects.filter(mauzo=list_mauzo)      
            #      if fordit_col.exists():
            #            fordit_col.delete()

 
                  
                 if len(bil['color'])>=1 :
                          for set_r in bil['color']:
                                rangi = produ_colored.objects.get(pk=set_r['color'],Interprise=entp.Interprise)
                                if not bool(oda) and not produ_details.service:
                                    
                                    rangi.idadi = rangi.idadi - set_r['idadi']
                                    
                                    rangi.save()
  
                                      
                                invo_col=sales_color()
                                      
                                invo_col.mauzo=list_mauzo
                                invo_col.bidhaa=produ_details
                                invo_col.color=rangi
                                invo_col.packed=0
                                invo_col.idadi=set_r['idadi']
                                invo_col.save()
  
  
  
  
                                            
                 if len(bil['size'])>=1 :
  
                                for sz in bil['size']:
                                      # s = sizes.objects.get(pk=sz['size'],color__bidhaa__owner=entp.admin)
                                      # rn = color_produ.objects.get(pk=sz['color'],bidhaa__owner=entp.admin)
                                
                                      col=produ_colored.objects.filter(pk=sz['color'],bidhaa=produ_details.id).last()
                                      
                                      bil_col=sales_color.objects.filter(color=col.id,mauzo=list_mauzo.id).last()
  
                                      
                                      # if  produ_details.idadi > 0:
                                      Size=produ_size.objects.get(pk=sz['size'],Interprise=entp.Interprise)

                                      if not bool(oda) and not produ_details.service:
                                          Size.idadi = Size.idadi - sz['idadi']
                                          Size.save()
  
                                      # s=Size
                                      # else:
                                            # s.idadi=sz['idadi']
                                            # s.save() 
                                      bill_size= sales_size()             
                                      bill_size.mauzo=list_mauzo
                                      bill_size.bidhaa=produ_details
                                      bill_size.size=Size
                                      bill_size.packed=0
                                      bill_size.color=bil_col
                                      bill_size.idadi=sz['idadi']
                                      bill_size.save()                 
  

                 
         invo_no2 = mauzoni.objects.filter(Interprise=entp.Interprise).last()
         
         invono = invo_no2.Invo_no
   
         if invono <10:
               invo_str = '0000'+str(invono)
         elif invono <100 and invono >=10:
               invo_str = '000' +str(invono)    
         elif invono <1000 and invono >=100:
               invo_str = '00' +str(invono)    
         elif invono <10000 and invono >=1000:
               invo_str = '0' +str(invono)    
         elif invono >=10000 :
             invo_str =str(invono) 

         data={
               'success':True,
               'bill_no':'INVO-'+invo_str,
               'bil':mauzi.id,
               'message_swa':"Taarifa za Ankara zimehifadhiwa kikamilifu",
               'message_eng':"Invonce saved successfully"
         }  
        # LIPIA BILLI KAMA INALIPWA...........................................................//     
         if inalipwa and not edit and not rudi:
           wekakwa= PaymentAkaunts.objects.get(pk=akaunt,Interprise=entp.Interprise)
           beforweka=float(wekakwa.Amount)

           weka = wekaCash()
           weka.Akaunt = wekakwa
           weka.before = beforweka
           if amount_set:
                 weka.After =  beforweka + amount
                 weka.Amount =  amount

           else :
                 weka.After = beforweka + round(bill_sum) 
                 weka.Amount = round(bill_sum,2)
                                 
           weka.kutoka = "Sales "
           weka.maelezo = paydesc
           weka.tarehe = datetime.datetime.now(tz=timezone.utc)
           weka.by=entp
           weka.Interprise=entp.Interprise
           weka.mauzo=True
           weka.invo = mauzi
           
           if not wekakwa.onesha:
                 weka.usiri =True 

        #      if bill_sum <=  beforweka :  
           if amount_set: 
                 wekakwa.Amount =  float(wekakwa.Amount) + amount
           else:
         
                 wekakwa.Amount =float(wekakwa.Amount) + round(bill_sum,2)
                 

           wekakwa.save()              
           weka.save()

         if bool(rudi):
             rec =   sale_return_mauzo_fidia()
             rec.ivo = mauzi
             rec.re_am = rudi_am
             rec.fidia = True
             rec.sale_rtn = sale_return.objects.get(pk=rudi_val,Interprise=entp.Interprise)
             rec.save()

         return JsonResponse(data)

       except:
         todo = todoFunct(request) 
         cheo = todo['cheo'] 
         duka = todo['duka']  

         data={
               'success':False,
               'message_swa':"Taarifa za Ankara hazijafanikiwa tafadhari jaribu tena kwa usahihi",
               'message_eng':"Invoice  data not saved please try again correctly"  
                 }

         if (cheo.viewi or not cheo.mauzo_na_matumizi) and not cheo.user == duka.owner:
               data ={
                     'success':False,
                     'message_swa':"Hauna ruhusa ya kurekodi mauzo tafadhari wasiliana na uongozi",
                     'message_eng':"You have no permission to record sales invoice please contact admin" 
               }

         return JsonResponse(data)
      else:
       return render(request,'pagenotFound.html',todoFunct(request))      


@login_required(login_url='login')
def  customer(request):
    todo =todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'watejapanel.html',todo)
       
@login_required(login_url='login')
def  getCustomers(request):
    used = request.user
    dukap = InterprisePermissions.objects.get(user__user = used.id, default = True)
    custom = list(wateja.objects.filter(Interprise__owner=dukap.Interprise.owner.id).annotate(duka=F('Interprise'),duka_jina=F('Interprise__name')).values())
    
    data=dict()
    data['wateja']=custom     
    data['watejatu'] = 1
    return JsonResponse(data)

# CUSTOMERS & SALES
@login_required(login_url='login')
def CustomerSales(request):
    try:
        todo = todoFunct(request)
        wrk = request.GET.get('cst',0)
        duka = todo['duka']

        mteja = wateja.objects.get(pk=wrk,Interprise=duka.id)
        uzia = mauzoni.objects.filter(customer_id=mteja.id)
        
        
        num = uzia.count()
        task = uzia.order_by("-pk")

        
        p=Paginator(task,15)
        page_num =request.GET.get('page',1)


    
        try:
            page = p.page(page_num)

        except EmptyPage:
            page= p.page(1)

        pg_number = p.num_pages



        todo.update({
            'mteja':mteja,
            'p_num':page_num,
            'pages':pg_number,
            'num':num,
            'page':page,
        })
        if not duka.Interprise:
            return redirect('/userdash')
        else:         
           return render(request,'SalesCustomer.html',todo)
    except:
        return render(request,'errorpage.html',todoFunct(request))


# @login_required(login_url='login')
# def  getInvo(request):
#     used = request.user
#     dukap = InterprisePermissions.objects.get(user = used.id, default = True)
#     invo = mauzoni.objects.filter(Interprise=dukap.Interprise.id)
    
#     data=dict()
#     data['wateja']=invo     
#     return JsonResponse(data)

#get vender after selecting autocomplete
@login_required(login_url='login')
def getInvo(request):
    if request.method=="GET":
        used = request.user
        dukap = InterprisePermissions.objects.get(user__user = used.id, default = True)
        invo = mauzoni.objects.filter(code__icontains=request.GET.get('term'),Interprise=dukap.Interprise)
        data=list()

        for i in invo:
            #   li = "<a class='px-2' href={% url 'viewInvo' %}?item_valued="+str(i.id)+"&back_to='allbill'>"+i.code+"</a>"
              data.append(i.code)
        
        return JsonResponse(data,safe=False)
    else:  
        return render(request,'pagenotFound.html',todoFunct(request))      


# GET ALL USED PRICES..................//
@login_required(login_url='login')
def addUnits(request):
      if request.method == "POST":
            try:     
                  itm=request.POST.get('itm')
                  s_bei=float(request.POST.get('price'))
                  qty=float(request.POST.get('qty'))  
                  name=request.POST.get('name')   
                  val=request.POST.get('val')   
                  edit=int(request.POST.get('edit'))   

                  dukap = InterprisePermissions.objects.get(user__user = request.user.id, default = True)



                  if bidhaa_stoku.objects.filter(pk=itm,Interprise=dukap.Interprise.id).exists():
                        
                        items_val = bidhaa_stoku.objects.get(pk=itm,Interprise=dukap.Interprise.id)
                        bei = bei_za_bidhaa()

                        if bool(edit):
                              bei = bei_za_bidhaa.objects.get(pk=val,item=items_val.bidhaa.id)

                        bei.jina = name
                        bei.idadi = round(qty,5)
                        bei.bei = round(s_bei,10)
                        bei.item = bidhaa.objects.get(pk=items_val.bidhaa.id)
                        bei.save()
                        
                        price = [{
                              'id':0,
                              'unit':items_val.bidhaa.vipimo,
                              'qty':1,
                              'price':items_val.Bei_kuuza,
                              'made':False
                        }]

                        if items_val.bidhaa.idadi_jum > 1:
                              price+=[{
                                    'id':0,
                              'unit':items_val.bidhaa.vipimo_jum,
                              'qty':items_val.bidhaa.idadi_jum,
                              'price':items_val.Bei_kuuza_jum ,
                              'made':False 
                              }]
                        prc =bei_za_bidhaa.objects.filter(item=items_val.bidhaa.id)
                        if prc.count() >0:
                              for p in prc :
                                    price+=[{
                                    'id':p.id,     
                                    'unit':p.jina,
                                    'qty':p.idadi,
                                    'price':p.bei,
                                    'made':True  
                                    }]

                        data={
                        'price':price,  
                        'sm':items_val.bidhaa.vipimo,
                        'success':True,
                        'swa':'Bei kwa idadi imeongezwa kikamilifu',
                        'eng':'Unit price added successfully'
                        }

                        return JsonResponse(data)


                  else: 
                        data ={
                              'success':False,
                              'swa':'Bei mpya kwa idadi hikuongezwa tafadhari jaribu tena kwa usahihi',
                              'eng':'The unit price was not added please try again correctly'
                        } 

                        return JsonResponse(data)   
            except:
               data ={
                     'success': False,
                    'swa':'Haikufanikiwa kwa sababu ya hitilifu tafadhari jaribu tena',
                    'eng':'The action was unsuccessfully please try again'
               }  
               return JsonResponse(data)
      else:  
            return render(request,'pagenotFound.html',todoFunct(request))
         

# GET ALL USED PRICES..................//
@login_required(login_url='login')
def removeUnit(request):
       if request.method == "POST":
      #  try:     
         itm=request.POST.get('itm')
         val=request.POST.get('val')
         dukap = InterprisePermissions.objects.get(user__user = request.user.id, default = True)

         if bei_za_bidhaa.objects.filter(pk=val,item__owner=dukap.Interprise.owner.user.id).exists():

               bei_za_bidhaa.objects.get(pk=val,item__owner=dukap.Interprise.owner.user.id).delete()
               data={
                     'success':True,
                     'swa':'Kipimo kimeondolewa Kikamilifu',
                     'eng':' Quantity Unit removed successfully'
               }

               return JsonResponse(data)

         else:
               data={
                     'success':False,
                     'swa':'Kipimo hakikuondolewa kutokana na kutokutambulika tafadhari jaribu tena kwa usahihi',
                     'eng':'Unity Quantity was not removed , The unit quantity does not exist'
               } 

               return JsonResponse(data)   
       else:  
            return render(request,'pagenotFound.html',todoFunct(request))         

# GET ALL USED PRICES..................//
@login_required(login_url='login')
def Bei_tu(request):
    used = request.user
   #     dukap = InterprisePermissions.objects.get(user__user = request.user.id, default = True)
    serv = int(request.POST.get('s',0))
    time = request.POST.get('t',datetime.datetime.now(tz=timezone.utc))
    todo = todoFunct(request)
    dukap=todo['cheo']

    intp = dukap.Interprise



    servs = list(mauzoList.objects.filter(produ__service=True,mauzo__Interprise=intp,mauzo__servTo__gte=time,mauzo__receved=False).exclude(mauzo__online=True,packed=False).annotate(From=F('mauzo__servFrom'),to=F('mauzo__servTo'),bil=F('mauzo')).values('bil','produ','From','to','id','idadi','serviceReturn'))
    servsColor = list(sales_color.objects.filter(mauzo__produ__service=True,mauzo__mauzo__Interprise=intp,mauzo__mauzo__servTo__gte=time,mauzo__mauzo__receved=False).exclude(mauzo__mauzo__online=True,packed=False).annotate(From=F('mauzo__mauzo__servFrom'),bil=F('mauzo__mauzo'),to=F('mauzo__mauzo__servTo'),produ=F('mauzo__produ')).values('bil','produ','From','to','id','idadi','color','serviceReturn'))
    servsSize = list(sales_size.objects.filter(mauzo__produ__service=True,mauzo__mauzo__Interprise=intp,mauzo__mauzo__servTo__gte=time,mauzo__mauzo__receved=False).exclude(mauzo__mauzo__online=True,packed=False).annotate(From=F('mauzo__mauzo__servFrom'),bil=F('mauzo__mauzo'),to=F('mauzo__mauzo__servTo'),produ=F('mauzo__produ')).values('bil','produ','From','to','id','idadi','size','serviceReturn'))
    
    bei = list(bei_za_bidhaa.objects.filter(item__owner=dukap.Interprise.owner.user.id).values())
    Stokusized=list(produ_size.objects.select_related('sizes').filter(owner=intp.owner.user).exclude(Interprise=intp).values('id','sized__color','sized__size','bidhaa','idadi','bidhaa__bidhaa__idadi_jum','bidhaa__idadi','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum','bidhaa__expire_date'))
    StokubidhaaRangi =list(produ_colored.objects.select_related('color_produ,bidhaa_stoku').filter(owner=intp.owner.user,color__colored=True).exclude(Interprise=intp).annotate(prod=F('bidhaa__bidhaa')).values('id','prod','bidhaa','color','idadi','color__color_code','color__color_name','color__colored','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum','bidhaa__bidhaa__idadi_jum','bidhaa__idadi').order_by("-pk"))  
 
    data=dict()
    data['stokuRangi']=StokubidhaaRangi
    data['bei']=bei
    data['servs']=servs
    data['servsC']=servsColor
    data['servsS']=servsSize
    data['stokuSize']=Stokusized
    return JsonResponse(data)
     


@login_required(login_url='login')
def AllRatings(request):
      todo = todoFunct(request)
      duka = todo['duka']
      unseen = int(request.GET.get('us',0))
      unreplied = int(request.GET.get('ur',0))

      rate = Interprise_Rating.objects.filter(Q(invo__By=todo['cheo'].id)|Q(Interprise__owner=todo['useri'].id),Interprise=duka.id)
     
      if unseen:
            rate=rate.filter(seen=False) 

      if unreplied:
            rate = rate.filter(Q(reply='')|Q(reply=None))    
            
      num = rate.count()
      rate = rate.order_by("-pk")       
        
      p=Paginator(rate,15)
      page_num =request.GET.get('page',1)



      try:
        page = p.page(page_num)
      except EmptyPage:
         page= p.page(1)

      pg_number = p.num_pages



      todo.update({
      'p_num':page_num,
      'pages':pg_number,
      'num':num,
      'page':page,
      'us':unseen,
      'ur':unreplied
      })

      if not duka.Interprise:
            return redirect('/userdash')
      else:  
           return render(request,'AllRatings.html',todo)

@login_required(login_url='login')
def markRateAsSeen(request):
      if request.method == 'POST':
            try:
                  valu = request.POST.get('valu')
                  todo = todoFunct(request) 
                
                  duka = todo['duka']
                  rate=Interprise_Rating.objects.get(pk=valu,Interprise=duka)
                 
                  rate.seen = True

                  rate.save()   
                  data ={
                        'success':True
                  }   

                  return JsonResponse(data)

            except:
                  data = {
                        'success':False
                  }

                  return JsonResponse(data)
      else:
            return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def ReplyRating(request):
      if request.method == 'POST':
            try:
                  valu = request.POST.get('valu')
                  reply = request.POST.get('replyRate')
                  ur = int(request.POST.get('ur',0))
                  us = int(request.POST.get('us',0))
                  invo = int(request.POST.get('invo',0))
                  rt = int(request.POST.get('rt',0))
                  inv = int(request.POST.get('inv',0))
                  todo = todoFunct(request) 

                  whch = ''

                  if ur :
                        whch = '?ur=1'
                  if us :
                        whch = '?us=1'
                
                  duka = todo['duka']
                 
                  if rt:
                        rate = Interprise_Rating.objects.get(pk=valu,by=todo['useri'])
                        rate.desc = reply
                        rate.seen = False
                        rate.save()
                        return redirect('/purchase/viewRecept?item_valued='+str(invo))
                  else:
                        rate = Interprise_Rating.objects.get(pk=valu,Interprise=duka)
                        rate.reply = reply
                        if reply != '':
                              rate.seen = True

                        rate.save()      
                        if inv:
                              return redirect('/mauzo/viewInvo?item_valued='+str(invo))
                        else:     
                              return redirect('/mauzo/AllRatings'+whch)

            except:
                  return redirect('/mauzo/AllRatings')
      else:
            return render(request,'pagenotFound.html',todoFunct(request))