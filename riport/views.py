
# Create your views here.
# from asyncio.windows_events import NULL
# from email.policy import default

from genericpath import exists
from typing import Dict
from django.db import reset_queries
from django.db.models.fields import NullBooleanField
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
# from graphene import NonNull
from management.models import  UserExtend,stokAdjustment,ForPrintingPupose,InterpriseVisotrs,savedStockState,SaveAkauntState,ItemsState,ColorState,SizeState,production_color,toaCash,production_size, manunuziList,productionListDate,purchased_size,ColorChange,SizeChange,purchased_color,sale_return,productChangeRecord,transferList,rekodiMatumizi,SavedRiport,ChangedService,Cash_order_return,sale_return_mauzo_fidia,sa_col_ret,sa_size_ret,sa_ret,Kanda,Workers,sales_color,sales_size,AnswerTo,stockAdjst_confirm,question_to,chatTo,chats,Interprise,deliveryAgents,bei_za_bidhaa, color_produ,mauzoList,order_from,bidhaa_sifa, key_sifa,produ_colored,produ_size,picha_bidhaa,bidhaa_stoku,picha_bidhaa,bidhaa_aina, receive,user_Interprise,HudumaNyingine,Huduma_za_kifedha,businessReg,manunuzi,Interprise_contacts,InterprisePermissions,PaymentAkaunts, mauzoni,staff_akaunt_permissions, wekaCash
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F
from django.core import serializers
from django.db.models import Q
# from datetime import datetime
from django.core.paginator import Paginator,EmptyPage

from django.utils import timezone
timezone.now()

from datetime import date,timedelta,timezone

import time  
import pytz
import datetime
import re
import json
from django.db.models import Sum
import random 

from accaunts.todos import Todos

# Create your views here.
def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()

# SALES .........................................................................//
@login_required(login_url='login')
def riportPage(request):
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
      return render(request,'riportPage.html',todo)

@login_required(login_url='login')
def riportMauzo(request):
  todo = todoFunct(request)   
  if not todo['duka'].Interprise:
      return redirect('/userdash')
  else:   
      return render(request,'ripotMauzo.html',todo)  

@login_required(login_url='login')
def theInvo(request):
  try:
    todo = todoFunct(request)   
    duka = todo['duka']

    inv = int(request.POST.get('val',0)) 

    
    invoo=mauzoni.objects.filter(pk=inv,Interprise__owner=duka.owner.id)
   
    invo = invoo.last()
    list_mauzo = mauzoList.objects.filter(mauzo=invo.id).exclude(idadi=F('returned'))
    reList = []

    for li in list_mauzo:
            pic = picha_bidhaa.objects.filter(bidhaa=li.produ.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url
            beid = li.produ.Bei_kuuza 
            if li.bei > beid :
              beid = li.bei   

            reList.append({
                  'picha':picha,
                  'val':li.id,
                  'prod':li.produ.bidhaa.id,
                  'bidhaa':li.produ.id,
                  'sold':li.bei,
                  'bei':beid,
                  'bei_jum':li.produ.Bei_kuuza_jum,
                  'vat_include':li.vat_included,
                  'vat_set':li.vat_set,
                  'idadi':li.idadi-li.returned,
                  'jum':li.jum,
                  'maelezo':li.produ.bidhaa.maelezo,
                  'vipimo':li.produ.bidhaa.vipimo,
                  'vipimo_jum':li.produ.bidhaa.vipimo_jum,
                  'jina':li.produ.bidhaa.bidhaa_jina,
                  'uwiano':li.produ.bidhaa.idadi_jum,
                  'serial':li.serial,
                  'timely':li.produ.timely,
                  'muda':li.saveT
                  
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
    colors= sales_color.objects.filter(mauzo__mauzo=invo.id).exclude(idadi=F('returned')).annotate(color_name=F('color__color__color_name'),color_code=F('color__color__color_code')).values()
    sizen= sales_size.objects.filter(mauzo__mauzo=invo.id).exclude(idadi=F('returned')).annotate(sized=F('size__sized__size')).values()

    malipo = wekaCash.objects.filter(invo=invo.id).annotate(ByF=F('by__user__user__first_name'),ByL=F('by__user__user__last_name'),akaunti=F('Akaunt__Akaunt_name')).values()
    fidia = sale_return_mauzo_fidia.objects.filter(ivo=invo.id).annotate(ref=F('sale_rtn__code')).values()
    logo = ''
    if invo.Interprise.logo:
      logo = invo.Interprise.logo.url

    chages = ChangedService.objects.filter(Q(from_serv=invo.id)|Q(to_serv__To=invo.id)|Q(From__From=invo.id))      
    
    f_name = 'None'
    l_name = 'None'
    activeAddress = ''
    activePlace = ''

    if invo.By is not None:
      f_name = invo.By.user.user.first_name
      l_name = invo.By.user.user.last_name

    if invo.online:
        activeAddress = invo.user_customer.enteprise.mtaa.mtaa+ ', '+ invo.user_customer.enteprise.mtaa.kata.kata +', ' + invo.user_customer.enteprise.mtaa.kata.wilaya.wilaya + ', '+ invo.user_customer.enteprise.mtaa.kata.wilaya.mkoa.mkoa + ' ,'+ invo.user_customer.enteprise.mtaa.kata.wilaya.mkoa.kanda.nchi.name
        activePlace = invo.user_customer.jengo
    data ={
      'success':True,
      'fidia':list(fidia),
      'itms':reList,
      'bei':bei_used,
      'color':list(colors),
      'size':list(sizen),
      'malipo':list(malipo),
      'invo':{'f_name':f_name,'OnlineAddress':activeAddress,'onlineJengo':activePlace,'l_name':l_name,'online':invo.online,'vat':invo.Interprise.vatper,'change':invo.change,'Changed':invo.Changed,'service':invo.service,'servFrom':invo.servFrom,'servTo':invo.servTo,'Intp_code':invo.Interprise.Intp_code,'logo':logo,'jengo':invo.Interprise.jengo,'duka':invo.Interprise.name,'mtaa':invo.Interprise.mtaa.mtaa,'wilaya':invo.Interprise.mtaa.kata.wilaya.wilaya,'kata':invo.Interprise.mtaa.kata.kata,'mkoa':invo.Interprise.mtaa.kata.wilaya.mkoa.mkoa,'nchi':invo.Interprise.mtaa.kata.wilaya.mkoa.kanda.nchi.name,'code':invo.code,'amount':invo.amount,'ilolipwa':invo.ilolipwa,'date':invo.date,'kulipa':invo.kulipa,'tarehe':invo.tarehe,'mteja_jina':invo.mteja_jina,'simu':invo.simu,'address':invo.address},
     
      'changed':list(chages.filter(from_serv=invo.id).values()),
      'changedFrom':list(chages.filter(From__From=invo.id).values()),
      'changedTo':list(chages.filter(to_serv__To=invo.id).values())    
    
    }  
    return JsonResponse(data)

  except:

    data={
      'success':False
    }

    return JsonResponse(data)  

@login_required(login_url='login')
def saveRiport(request):
  if request.method == "POST":
    try:
      title = request.POST.get('SaveRiportName')
      desc = request.POST.get('saveReportDesc')
      fr = request.POST.get('fromT')
      to = request.POST.get('toT')
      sale = int(request.POST.get('sa',0))
      ret = int(request.POST.get('ret',0))
      serv = int(request.POST.get('serv',0))
      todo = todoFunct(request)


      data = {
        'success':True,
        'msg_swa':'Riport imehifadiwa kikamilifu',
        'msg_eng':'Riport saved successfully'
      }

      if   SavedRiport.objects.filter(From=fr,to=to,By=todo['cheo'].id,sales=sale,SReturn=ret).exists():
            data =  {
            'success':False,
            'msg_swa':'Riport tayari imeshahifadiwa tafadhari ondoa ripoti ya awali kwanza kama unataka kuhifadhi kwa muda ule ule',
            'msg_eng':'The same duration report exists please remove the previous riport first'
          } 
      else:    
           svRiport = SavedRiport()
           svRiport.By = todo['cheo']
           svRiport.From = fr
           svRiport.to = to
           svRiport.desc = desc
           svRiport.title = title
           svRiport.sales = sale
           svRiport.SReturn = ret
           svRiport.serviceIncome = serv
           svRiport.save()

      return JsonResponse(data)

    except:
      data={
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'The action was mot complete please try again'
      }

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def removeSaved(request):
  if request.method == "POST":
    try:
      
      val = request.POST.get('val')
      todo = todoFunct(request)

      data = {
        'success':True,
        'msg_swa':'Riport imeondolewa kikamilifu',
        'msg_eng':'Riport was removed successfully'
      }

      repo =  SavedRiport.objects.filter(pk=val,By=todo['cheo'].id)

      if repo.exists():  
         repo.delete()
      else:
          data={
          'success':False,
          'msg_swa':'Hakuna Ripoti iliyopatikana',
          'msg_eng':'Riport was not found'
        }     

      return JsonResponse(data)

    except:
      data={
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'The action was mot complete please try again'
      }

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def getSavedRiport(request):
  if request.method == "POST":
    todo = todoFunct(request)
    sale = int(request.POST.get('s',0))
    ret = int(request.POST.get('ret',0))
    serv = int(request.POST.get('serv',0))
    riport = SavedRiport.objects.filter(By=todo['cheo'].id,sales=sale,SReturn=ret,serviceIncome=serv).values()
    
    data = {
      'riport':list(riport)
    }
    return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def SalesData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        d = int(request.POST.get('d',0))
        r = int(request.POST.get('r',0))
        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)
    
      
        lst=mauzoni.objects.filter(tarehe__gte=tf,Interprise__in=br,service=False,order=False).annotate(Na=F('By__user'),duka=F('Interprise'),dukan=F('Interprise__name'),f_name=F('By__user__user__first_name'),l_name=F('By__user__user__last_name')).exclude(tarehe__gt=tt).values()
        itms = mauzoList.objects.filter(mauzo__tarehe__gte=tf,mauzo__Interprise__in=br,mauzo__service=False,mauzo__order=False).exclude(mauzo__tarehe__gt=tt).annotate(By=F('mauzo__By__user'),duka=F('mauzo__Interprise'),vat=F('mauzo__Interprise__vatper'),kipimo=F('produ__bidhaa__vipimo'),bidhaa=F('produ__bidhaa'),bidhaaN=F('produ__bidhaa__bidhaa_jina'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),date=F('mauzo__date'),user=F('mauzo__By'),online=F('mauzo__online'),thamani=F('produ__Bei_kununua'),uwiano=F('produ__bidhaa__idadi_jum'),tarehe=F('mauzo__tarehe')).values()
        malipo = wekaCash.objects.filter(invo__Interprise__in=br,invo__service=False,invo__order=False,invo__tarehe__gte=tf).exclude(invo__tarehe__gt=tt).annotate(date=F('invo__date'),taree=F('invo__tarehe'),akaunti=F('Akaunt__Akaunt_name'),amount=F('Akaunt__Amount'),Na=F('invo__By__user'),online=F('invo__online'),duka=F('Interprise')).values()

        data = {
          'data':list(lst),
          'itms':list(itms),
          'pay':list(malipo),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)

# SALES ITEMS RETURN......................................//
@login_required(login_url='login')
def SalesReturn(request):
  todo = todoFunct(request)
  duka = todo['duka']
  br = [duka.id]
  for b in todo['matawi']:
    br.append(b.Interprise.id)  
  retrns = sale_return.objects.filter(Interprise__in=br).order_by('id')   
  if retrns.exists():
    todo.update({
      'last':retrns.last(),
      'first':retrns.first()
    })
  if not duka.Interprise:
      return redirect('/userdash')
  else: 
      return render(request,'riportSalesReturn.html',todo)  

@login_required(login_url='login')
def SalesReturnData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)
    
      
        lst=sale_return.objects.filter(tarehe__gte=tf,ivo__Interprise__in=br,ivo__service=False,ivo__order=False).annotate(Na=F('By__user'),mteja=F('ivo__mteja_jina'),InvoCode=F('ivo__code'),duka=F('Interprise'),dukan=F('Interprise__name'),f_name=F('By__user__user__first_name'),l_name=F('By__user__user__last_name')).exclude(tarehe__gt=tt).values()
        itms = sa_ret.objects.filter(ret__tarehe__gte=tf,ret__Interprise__in=br).exclude(ret__tarehe__gt=tt).annotate(By=F('sa_list__mauzo__By__user'),duka=F('sa_list__mauzo__Interprise'),kipimo=F('sa_list__produ__bidhaa__vipimo'),bidhaa=F('sa_list__produ__bidhaa'),bidhaaN=F('sa_list__produ__bidhaa__bidhaa_jina'),aina=F('sa_list__produ__bidhaa__bidhaa_aina'),bei=F('sa_list__bei'),code=F('ret__code'),user=F('sa_list__mauzo__By'),thamani=F('sa_list__produ__Bei_kununua'),uwiano=F('sa_list__produ__bidhaa__idadi_jum'),tarehe=F('ret__tarehe')).values()

        data = {
          'data':list(lst),
          'itms':list(itms),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)

@login_required(login_url='login')
def theItmReturn(request):
  try:
    todo = todoFunct(request)   
    duka = todo['duka']

    inv = int(request.POST.get('val',0)) 
    invoo=sale_return.objects.filter(pk=inv,Interprise__owner=duka.owner.id)
   
    invo = invoo.last()
    list_mauzo = sa_ret.objects.filter(ret=invo.id)
    reList = []

    for li in list_mauzo:
            pic = picha_bidhaa.objects.filter(bidhaa=li.sa_list.produ.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url
            beid = li.sa_list.produ.Bei_kuuza 
            if li.sa_list.bei > beid :
              beid = li.sa_list.bei   

            reList.append({
                  'picha':picha,
                  'val':li.sa_list.id,
                  'prod':li.sa_list.produ.bidhaa.id,
                  'bidhaa':li.sa_list.produ.id,
                  'sold':li.sa_list.bei,
                  'bei':beid,
                  'bei_jum':li.sa_list.produ.Bei_kuuza_jum,
                  'vat_include':li.sa_list.vat_included,
                  'vat_set':li.sa_list.vat_set,
                  'idadi':li.idadi,
                  'jum':li.sa_list.jum,
                  'maelezo':li.sa_list.produ.bidhaa.maelezo,
                  'vipimo':li.sa_list.produ.bidhaa.vipimo,
                  'vipimo_jum':li.sa_list.produ.bidhaa.vipimo_jum,
                  'jina':li.sa_list.produ.bidhaa.bidhaa_jina,
                  'uwiano':li.sa_list.produ.bidhaa.idadi_jum,
                  'serial':li.sa_list.serial,
                  
            })

    bei_used = []

    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.sa_list.produ.bidhaa.id)
          for p in the_bei:
            bei = [{
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id

            }]
            bei_used+=bei
    colors= sa_col_ret.objects.filter(ret=invo.id).annotate(color_name=F('sa_list__color__color__color_name'),val=F('sa_list'),itm=F('sa_list__mauzo'),color_code=F('sa_list__color__color__color_code')).values()
    sizen= sa_size_ret.objects.filter(ret=invo.id).annotate(sized=F('sa_list__size__sized__size'),color=F('sa_list__color')).values()

  

    malipo =  sale_return_mauzo_fidia.objects.filter(sale_rtn=invo.id).annotate(ByF=F('recordi__by__user__user__first_name'),ByL=F('recordi__by__user__user__last_name'),akaunti=F('recordi__Akaunt__Akaunt_name'),Amount=F('recordi__Amount'),before=F('recordi__before'),After=F('recordi__After'),tarehe=F('recordi__tarehe'),tareheInvo=F('ivo__tarehe'),InvoCode=F('ivo__code')).values()
    logo = ''
    if invo.Interprise.logo:
      logo = invo.Interprise.logo.url


    data ={
      'success':True,
      'itms':reList,
      'bei':bei_used,
      'color':list(colors),
      'size':list(sizen),
      'malipo':list(malipo),
      'invo':{'invoCode':invo.ivo.code,'f_name':invo.By.user.user.first_name,'l_name':invo.By.user.user.last_name,'maelezo':invo.maelezo,'service':invo.ivo.service,'Intp_code':invo.Interprise.Intp_code,'logo':logo,'jengo':invo.Interprise.jengo,'duka':invo.Interprise.name,'mtaa':invo.Interprise.mtaa.mtaa,'wilaya':invo.Interprise.mtaa.kata.wilaya.wilaya,'mkoa':invo.Interprise.mtaa.kata.wilaya.mkoa.mkoa,'kata':invo.Interprise.mtaa.kata.kata,'nchi':invo.Interprise.mtaa.kata.wilaya.mkoa.kanda.nchi,'code':invo.code,'amount':invo.amount,'ilolipwa':invo.ilolipwa,'date':invo.date,'tarehe':invo.tarehe,'mteja_jina':invo.ivo.mteja_jina,'simu':invo.ivo.simu,'address':invo.ivo.address,'kulipa':invo.kulipa}
         
    }  
    return JsonResponse(data)

  except:

    data={
      'success':False
    }

    return JsonResponse(data)  


# AMOUNT RETURN ................................................//
@login_required(login_url='login')
def AmountReturn(request):
  todo = todoFunct(request)
  duka = todo['duka']
  s = int(request.GET.get('s',0))
  br = [duka.id]
  for b in todo['matawi']:
    br.append(b.Interprise.id)
  retrns = Cash_order_return.objects.filter(ivo__Interprise__in=br,ivo__service=s).annotate(tarehe=F('record__tarehe')).order_by('id')   
  if retrns.exists():
    todo.update({
      'last':retrns.last(),
      'first':retrns.first()
    })

  if not duka.Interprise:
      return redirect('/userdash')
  else:     
      return render(request,'riportAmountReturn.html',todo)  

@login_required(login_url='login')
def SalesAmountR(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        serv = int(request.POST.get('s',0))
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst=Cash_order_return.objects.filter(record__tarehe__gte=tf,ivo__Interprise__in=br,ivo__service=serv).annotate(Na=F('By__user'),tarehe=F('record__tarehe'),mteja=F('ivo__mteja_jina'),InvoCode=F('ivo__code'),duka=F('ivo__Interprise'),dukan=F('ivo__Interprise__name'),f_name=F('By__user__user__first_name'),l_name=F('By__user__user__last_name'),akaunti=F('record__Akaunt__Akaunt_name'),CurrentA=F('record__Akaunt__Amount')).exclude(record__tarehe__gt=tt).values()
        

        data = {
          'data':list(lst),
          'itms':[],
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def TheAmountR(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        inv = int(request.POST.get('val',0)) 
        serv = int(request.POST.get('s',0))

        duka = todo['duka']
        
        br = [duka.id]

        lst=Cash_order_return.objects.filter(pk=inv,ivo__Interprise__owner=duka.owner.id,ivo__service=serv).annotate(Na=F('By__user'),simu=F('ivo__simu'),tarehe=F('record__tarehe'),pesa=F('ivo__amount'),akaunti=F('record__Akaunt__Akaunt_name'),kabla=F('record__before'),baada=F('record__After'),address=F('ivo__address'),mteja=F('ivo__mteja_jina'),InvoCode=F('ivo__code'),mtaa=F('ivo__Interprise__mtaa'),wilaya=F('ivo__Interprise__wilaya'),mkoa=F('ivo__Interprise__mkoa'),duka=F('ivo__Interprise'),dukan=F('ivo__Interprise__name'),order=F('ivo__order'),f_name=F('By__user__user__first_name'),l_name=F('By__user__user__last_name')).values()
        

        data = {
          'invo':list(lst),
          
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'invo':[],
       

      }
      return JsonResponse(data)

# SERVICES ..........................................//
@login_required(login_url='login')
def riportServiceIncome(request):
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'riportServiceIncome.html',todo)

@login_required(login_url='login')
def riportServiceChange(request):
    todo = todoFunct(request)
    duka = todo['duka']
    br = [duka.id]
    for b in todo['matawi']:
      br.append(b.Interprise.id)    
    changed = mauzoni.objects.filter(Interprise__in=br,service=True,change=True).order_by('id')   

    if changed.exists():
      todo.update({
        'last':changed.last(),
        'first':changed.first()
      })
    if not duka.Interprise:
        return redirect('/userdash')
    else:       
      return render(request,'riportServiceChange.html',todo)


@login_required(login_url='login')
def ServiceData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        d = int(request.POST.get('d',0))
        r = int(request.POST.get('r',0))
        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
      
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)
    
      
        lst=mauzoni.objects.filter(tarehe__gte=tf,Interprise__in=br,ignore=False,service=True,order=False).annotate(Na=F('By__user'),duka=F('Interprise'),dukan=F('Interprise__name'),f_name=F('By__user__user__first_name'),l_name=F('By__user__user__last_name')).exclude(tarehe__gt=tt).values()
        itms = mauzoList.objects.filter(mauzo__tarehe__gte=tf,mauzo__Interprise__in=br,mauzo__service=True,mauzo__ignore=False,mauzo__order=False).exclude(mauzo__tarehe__gt=tt).annotate(By=F('mauzo__By__user'),duka=F('mauzo__Interprise'),vat=F('mauzo__Interprise__vatper'),receved=F('mauzo__receved'),timely=F('produ__timely'),kipimo=F('produ__bidhaa__vipimo'),bidhaa=F('produ__bidhaa'),bidhaaN=F('produ__bidhaa__bidhaa_jina'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),date=F('mauzo__date'),user=F('mauzo__By'),online=F('mauzo__online'),thamani=F('produ__Bei_kununua'),uwiano=F('produ__bidhaa__idadi_jum'),tarehe=F('mauzo__tarehe')).values()
        malipo = wekaCash.objects.filter(invo__Interprise__in=br,invo__service=True,invo__order=False,invo__tarehe__gte=tf).exclude(invo__tarehe__gt=tt).annotate(date=F('invo__date'),taree=F('invo__tarehe'),akaunti=F('Akaunt__Akaunt_name'),amount=F('Akaunt__Amount'),receved=F('invo__receved'),Na=F('invo__By__user'),online=F('invo__online'),duka=F('Interprise')).values()

        data = {
          'data':list(lst),
          'itms':list(itms),
          'pay':list(malipo),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)

@login_required(login_url='login')
def ServiceChanged(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        d = int(request.POST.get('d',0))
        r = int(request.POST.get('r',0))
        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
       
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)
    
      
        lst=mauzoni.objects.filter(tarehe__gte=tf,Interprise__in=br,change=True,service=True,receved=True).annotate(Na=F('By__user'),duka=F('Interprise'),dukan=F('Interprise__name'),f_name=F('By__user__user__first_name'),l_name=F('By__user__user__last_name')).exclude(tarehe__gt=tt).values()
        itms = mauzoList.objects.filter(mauzo__tarehe__gte=tf,mauzo__Interprise__in=br,mauzo__service=True,mauzo__change=True,mauzo__receved=True).exclude(mauzo__tarehe__gt=tt).annotate(By=F('mauzo__By__user'),duka=F('mauzo__Interprise'),vat=F('mauzo__Interprise__vatper'),timely=F('produ__timely'),kipimo=F('produ__bidhaa__vipimo'),bidhaa=F('produ__bidhaa'),bidhaaN=F('produ__bidhaa__bidhaa_jina'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),date=F('mauzo__date'),user=F('mauzo__By'),online=F('mauzo__online'),thamani=F('produ__Bei_kununua'),uwiano=F('produ__bidhaa__idadi_jum'),tarehe=F('mauzo__tarehe'),code=F('mauzo__code'),rudisha=F('mauzo__Changed')).values()
        # malipo = wekaCash.objects.filter(invo__Interprise__in=br,invo__service=True,invo__receved=True,invo__tarehe__gte=tf).exclude(invo__tarehe__gt=tt).annotate(date=F('invo__date'),taree=F('invo__tarehe'),akaunti=F('Akaunt__Akaunt_name'),amount=F('Akaunt__Amount'),Na=F('invo__By__user'),online=F('invo__online'),duka=F('Interprise')).values()

        data = {
          'data':list(lst),
          'itms':list(itms),
          # 'pay':list(malipo),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)


@login_required(login_url='login')
def AmountServReturn(request):
  todo = todoFunct(request)
  duka = todo['duka']
  br = [duka.id]
  for b in todo['matawi']:
    br.append(b.Interprise.id)
  retrns = Cash_order_return.objects.filter(ivo__Interprise__in=br,ivo__service=1).annotate(tarehe=F('record__tarehe')).order_by('id')   
  if retrns.exists():
    todo.update({
      'last':retrns.last(),
      'first':retrns.first()
    })
  if not duka.Interprise:
    return redirect('/userdash')
  else:    
        return render(request,'riportServAmountReturn.html',todo)  



# ADUSTMENT BY ADDING ..........................................//
@login_required(login_url='login')
def AddingAdjRiport(request):
    todo = todoFunct(request)
    duka = todo['duka']
    br = [duka.id]
    for b in todo['matawi']:
      br.append(b.Interprise.id)
    lastPu = stokAdjustment.objects.filter(Q(Ongezwa=True)|Q(registered=True),Interprise__in=br).annotate(tarehe=F('date')).order_by('id')
  
    if lastPu.exists():
      todo.update({
        'last':lastPu.last(),
        'first':lastPu.first()
      })
    if not duka.Interprise:
        return redirect('/userdash')
    else:       
       return render(request,'riportAddingAdj.html',todo)

@login_required(login_url='login')
def AddingAdjData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        d = int(request.POST.get('d',0))
        mark = int(request.POST.get('mark',0))
        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        # lst=bidhaa_stoku.objects.filter(manunuzi__manunuzi__order=False,manunuzi__manunuzi__Interprise__in=br,manunuzi__manunuzi__tarehe__gte=tf).exclude(manunuzi__manunuzi__tarehe__gt=tt)
        itms = mauzoList.objects.filter(produ__ongezwa__date__gte=tf,produ__ongezwa__Interprise__in=br,mauzo__service=False,mauzo__order=False).exclude(produ__ongezwa__date__gt=tt)
        # costs =   rekodiMatumizi.objects.filter(manunuzi_id__order=False,manunuzi_id__tarehe__gte=tf,manunuzi_id__Interprise__in=br).exclude(manunuzi_id__tarehe__gt=tt) 
        adjst = productChangeRecord.objects.filter(prod__ongezwa__date__gte=tf,prod__ongezwa__Interprise__in=br).exclude(prod__ongezwa__date__gt=tt)
        transfer = transferList.objects.filter(toka__ongezwa__date__gte=tf,toka__ongezwa__Interprise__in=br).exclude(toka__ongezwa__date__gt=tt)

        if mark:
          # lst=bidhaa_stoku.objects.filter(manunuzi__manunuzi__order=False,manunuzi__manunuzi__Interprise=duka.id,manunuzi__manunuzi__mark=1)
          itms = mauzoList.objects.filter(produ__ongezwa__mark=1,produ__ongezwa__Interprise__in=br,mauzo__service=False,mauzo__order=False)
          # costs =   rekodiMatumizi.objects.filter(manunuzi_id__order=False,manunuzi_id__mark=1,manunuzi_id__Interprise__in=br)
          adjst = productChangeRecord.objects.filter(prod__ongezwa__mark=1,prod__ongezwa__Interprise__in=br)
          transfer = transferList.objects.filter(toka__ongezwa__mark=1,toka__ongezwa__Interprise__in=br)

       
        # lst = lst.annotate(bili=F('manunuzi__manunuzi'),material=F('bidhaa__material'),tarehe=F('manunuzi__manunuzi__tarehe'),bqty=F('manunuzi__idadi'),rudi=F('manunuzi__rudi'),qtyBefore=F('manunuzi__before'),kipimo=F('bidhaa__vipimo'),date=F('manunuzi__manunuzi__date'),dukaN=F('manunuzi__manunuzi__Interprise__name'),shopN=F('Interprise__name'),shop=F('Interprise'),bidhaaN=F('bidhaa__bidhaa_jina'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),duka=F('manunuzi__manunuzi__Interprise'),uwiano=F('bidhaa__idadi_jum'),marked=F('manunuzi__manunuzi__mark'),code=F('manunuzi__manunuzi__code'),paid=F('manunuzi__manunuzi__ilolipwa'),supplier=F('manunuzi__manunuzi__supplier_id__jina'),vendor=F('manunuzi__manunuzi__supplier_id'))
        itms = itms.annotate(bili=F('produ__ongezwa'),add=F('produ__ongezwa__Ongezwa'),reg=F('produ__ongezwa__registered'),vat=F('mauzo__Interprise__vatper'),kipimo=F('produ__bidhaa__vipimo'),shop=F('mauzo__Interprise'),duka=F('produ__ongezwa__Interprise'),date=F('produ__ongezwa__Recodeddate'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),thamani=F('produ__Bei_kununua'),uwiano=F('produ__bidhaa__idadi_jum'),tarehe=F('produ__ongezwa__date'),marked=F('produ__ongezwa__mark'))
        # costs = costs.annotate(bili=F('manunuzi_id'),Tarehe=F('manunuzi_id__tarehe'),marked=F('manunuzi_id__mark'),duka=F('manunuzi_id__Interprise'),shop=F('Interprise'),bdate=F('manunuzi_id__date'),vendor=F('manunuzi_id__supplier_id')) 

        adjst = adjst.annotate(bili=F('prod__ongezwa'),add=F('prod__ongezwa__Ongezwa'),first_name=F('prod__ongezwa__Na__user__user__first_name'),last_name=F('prod__ongezwa__Na__user__user__last_name'),code=F('prod__ongezwa__code'),reg=F('prod__ongezwa__registered'),bidhaaN=F('prod__bidhaa__bidhaa_jina'),dukaN=F('prod__ongezwa__Interprise__name'),shopN=F('prod__Interprise__name'),bqty=F('qty'),kipimo=F('prod__bidhaa__vipimo'),idadi=F('prod__idadi'),Bei_kununua=F('prod__Bei_kununua'),material=F('prod__bidhaa__material'),mfg=F('adjst__production'),tumika=F('adjst__tumika'),Ongeza=F('adjst__Ongezwa'),shop=F('prod__Interprise'),duka=F('prod__ongezwa__Interprise'),tha=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum'),tarehe=F('prod__ongezwa__date'),date=F('prod__ongezwa__Recodeddate'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'))
        transfer= transfer.annotate(bili=F('toka__ongezwa'),add=F('toka__ongezwa__Ongezwa'),reg=F('toka__ongezwa__registered'),kwenda_duka=F('kwenda__receive__Interprise'),tarehe=F('toka__ongezwa__date'),shop=F('toka__Interprise'),duka=F('toka__ongezwa__Interprise'),date=F('toka__ongezwa__Recodeddate'),idadi=F('kwenda__qty'),tha=F('toka__Bei_kununua'),uwiano=F('toka__bidhaa__idadi_jum'),bidhaa_id=F('toka__bidhaa'),aina=F('toka__bidhaa__bidhaa_aina'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'))

        data = {
          'data':list(adjst.values()),
          'mauzo':list(itms.values()),
          # 'cost':list(costs.values()),
          'adjst':list(adjst.values()),
          'transfer':list(transfer.values()),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        # 'cost':[],
        'mauzo':[],
        'adjst':[],
        'transfer':[]
      }
      return JsonResponse(data)

@login_required(login_url='login')
def theAddAdj(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        val = int(request.POST.get('val',0))
        al = int(request.POST.get('al',0))

        duka = todo['duka']

        bil = stokAdjustment.objects.get(pk=val,Interprise__owner=duka.owner)

        # pucolor = ColorChange.objects.filter(manunuzi__manunuzi=bil.id).annotate(color_name=F('color__color__color_name'),bidhaa_a=F('bidhaa__bidhaa'),color_code=F('color__color__color_code')).values()
        # puSize = SizeChange.objects.filter(manunuzi__manunuzi=bil.id).annotate(size_name=F('size__sized__size'),bidhaa_a=F('bidhaa__bidhaa')).values()

        sto_color = produ_colored.objects.filter(bidhaa__ongezwa=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sto_size = produ_size.objects.filter(bidhaa__ongezwa=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
    
        sale_color = sales_color.objects.filter(bidhaa__ongezwa=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sale_size = sales_size.objects.filter(bidhaa__ongezwa=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()


        

        adjC = ColorChange.objects.filter(change__prod__ongezwa=bil.id).annotate(color_name=F('color__color__color_name'),color_code=F('color__color__color_code'),add=F('color__bidhaa__ongezwa__Ongezwa'),reg=F('color__bidhaa__ongezwa__registered'),uzalishaji=F('change__adjst__production'),bidhaa_id=F('color__bidhaa'),tumika=F('change__adjst__tumika'),Ongeza=F('change__adjst__Ongezwa'),bidhaa_a=F('color__bidhaa__bidhaa')).values()
        adjS = SizeChange.objects.filter(color__change__prod__ongezwa=bil.id).annotate(size_name=F('size__sized__size'),uzalishaji=F('color__change__adjst__production'),add=F('color__color__bidhaa__ongezwa__Ongezwa'),reg=F('color__color__bidhaa__ongezwa__registered'),bidhaa_id=F('color__color__bidhaa'),tumika=F('color__change__adjst__tumika'),Ongeza=F('color__change__adjst__Ongezwa'),bidhaa_a=F('color__color__bidhaa__bidhaa')).values()
        by = 'Hakuna'
        if bil.Na:
          by = bil.Na.user.user.first_name + ' ' + bil.Na.user.user.last_name
        data={
        'id':bil.id,'desc':bil.desc,'code':bil.code,'date':bil.Recodeddate,'tarehe':bil.date,'By':by,'mark':bil.mark,'markDesc':bil.markDesc,
        'success':True,

        'itms_C':list(adjC),
        'itms_S':list(adjS),

        'adjst_S':list(adjS),
        'adjst_C':list(adjC),

        'sale_C':list(sale_color),
        'sale_S':list(sale_size),

        'stock_C':list(sto_color),
        'stock_S':list(sto_size),
      }

        if al:
              # lst = bidhaa_stoku.objects.filter(ongezwa=bil.id).annotate(shop=F('Interprise'),duka=F('ongezwa__Interprise'),bidhaaN=F('bidhaa__bidhaa_jina'),kipimo=F('bidhaa__vipimo'),material=F('bidhaa__material'),tha=F('Bei_kununua'),uwiano=F('bidhaa__idadi_jum'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),addId=F('ongezwa'),addCode=F('ongezwa__code'),puId=F('manunuzi__manunuzi'),puCode=F('manunuzi__manunuzi__code'),TransId=F('uhamisho__receive'),TransCode=F('uhamisho__receive__transfer__code'),ProdId=F('produced__production__production'),ProdCode=F('produced__production__production__code'),initPu=F('manunuzi__idadi'),initPuDate=F('manunuzi__manunuzi__tarehe'),initAddedDate=F('ongezwa__date'),initTr=F('uhamisho__qty'),initTrDate=F('uhamisho__receive__transfer__tarehe'),initPro=F('produced__qty'),initProDate=F('produced__production__date'),sale=F('Bei_kuuza')).order_by('-pk')
              sale = mauzoList.objects.filter(produ__ongezwa=bil.id).annotate(shop=F('produ__Interprise'),duka=F('produ__ongezwa__Interprise'),service=F('produ__service'),material=F('produ__bidhaa__material'),uwiano=F('produ__bidhaa__idadi_jum'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('produ__uhamisho'),produced_id=F('produ__produced'),tha=F('produ__Bei_kununua'),sale=F('produ__Bei_kuuza'),manunuzi_id=F('produ__manunuzi'),ongezwa_id=F('produ__ongezwa'))
          
              transfer = transferList.objects.filter(toka__ongezwa=bil.id).annotate(shop=F('toka__Interprise'),kwenda_duka=F('kwenda__receive__Interprise'),duka=F('toka__ongezwa__Interprise'),bidhaa_id=F('toka__bidhaa'),service=F('toka__service'),qty=F('kwenda__qty'),material=F('toka__bidhaa__material'),uwiano=F('toka__bidhaa__idadi_jum'),aina=F('toka__bidhaa__bidhaa_aina'),tha=F('toka__Bei_kununua'),sale=F('toka__Bei_kuuza'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('toka__uhamisho'),produced_id=F('toka__produced'),manunuzi_id=F('toka__manunuzi'),ongezwa_id=F('toka__ongezwa'))
            
              adjst = productChangeRecord.objects.filter(prod__ongezwa=bil.id).annotate(shop=F('prod__Interprise'),shopN=F('prod__Interprise__name'),kipimo=F('prod__bidhaa__vipimo'),Bei_kununua=F('prod__Bei_kununua'),idadi=F('prod__idadi'),bidhaaN=F('prod__bidhaa__bidhaa_jina'),duka=F('prod__ongezwa__Interprise'),uhamisho_id=F('prod__uhamisho'),produced_id=F('prod__produced'),manunuzi_id=F('prod__manunuzi'),ongezwa_id=F('prod__ongezwa'),sale=F('prod__Bei_kuuza'),bqty=F('qty'),
              mfg=F('adjst__production'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),waste=F('adjst__potea'),damage=F('adjst__haribika'),Ongeza=F('adjst__Ongezwa'),register=F('adjst__registered'),tha=F('prod__Bei_kununua'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),
              service=F('prod__service'),material=F('prod__bidhaa__material'),uwiano=F('prod__bidhaa__idadi_jum'))
             
              data.update({
                      'data':list(adjst.values()),
                      'mauzo':list(sale.values()),
                      'cost':[],
                      'adjst':list(adjst.values()),
                      'transfer':list(transfer.values()),   
                     
              })
        return JsonResponse(data) 
   
    except:
      data={
        'success':False,
      }

      return JsonResponse(data)    
  else:
     return render(request,'pagenotFound.html',todoFunct(request))    

# PURCHASES ..........................................//
@login_required(login_url='login')
def purchasesRiport(request):
    todo = todoFunct(request)
    duka = todo['duka']
    br = [duka.id]
    for b in todo['matawi']:
      br.append(b.Interprise.id)
    lastPu = manunuzi.objects.filter(Interprise__in=br,order=False).order_by('id')
    if lastPu.exists():
      todo.update({
        'last':lastPu.last(),
        'first':lastPu.first()
      })
    if not duka.Interprise:
        return redirect('/userdash')
    else:       
       return render(request,'riportPurchases.html',todo)

@login_required(login_url='login')
def PurchaseData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        d = int(request.POST.get('d',0))
        mark = int(request.POST.get('mark',0))
        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst=bidhaa_stoku.objects.filter(manunuzi__manunuzi__order=False,manunuzi__manunuzi__Interprise__in=br,manunuzi__manunuzi__tarehe__gte=tf,manunuzi__manunuzi__full_returned=False).exclude(manunuzi__manunuzi__tarehe__gt=tt)
        itms = mauzoList.objects.filter(produ__manunuzi__manunuzi__order=False,produ__manunuzi__manunuzi__tarehe__gte=tf,produ__manunuzi__manunuzi__Interprise__in=br,mauzo__service=False,mauzo__order=False).exclude(produ__manunuzi__manunuzi__tarehe__gt=tt)
        costs =   rekodiMatumizi.objects.filter(manunuzi_id__order=False,manunuzi_id__tarehe__gte=tf,manunuzi_id__Interprise__in=br).exclude(manunuzi_id__tarehe__gt=tt) 
        adjst = productChangeRecord.objects.filter(prod__manunuzi__manunuzi__tarehe__gte=tf,prod__manunuzi__manunuzi__Interprise__in=br).exclude(prod__manunuzi__manunuzi__tarehe__gt=tt)
        transfer = transferList.objects.filter(toka__manunuzi__manunuzi__tarehe__gte=tf,toka__manunuzi__manunuzi__Interprise__in=br).exclude(toka__manunuzi__manunuzi__tarehe__gt=tt)

        if mark:
          lst=bidhaa_stoku.objects.filter(manunuzi__manunuzi__order=False,manunuzi__manunuzi__Interprise=duka.id,manunuzi__manunuzi__mark=1)
          itms = mauzoList.objects.filter(produ__manunuzi__manunuzi__order=False,produ__manunuzi__manunuzi__mark=1,produ__manunuzi__manunuzi__Interprise__in=br,mauzo__service=False,mauzo__order=False)
          costs =   rekodiMatumizi.objects.filter(manunuzi_id__order=False,manunuzi_id__mark=1,manunuzi_id__Interprise__in=br)
          adjst = productChangeRecord.objects.filter(prod__manunuzi__manunuzi__mark=1,prod__manunuzi__manunuzi__Interprise__in=br)
          transfer = transferList.objects.filter(toka__manunuzi__manunuzi__mark=1,toka__manunuzi__manunuzi__Interprise__in=br)

       
        lst = lst.annotate(bili=F('manunuzi__manunuzi'),material=F('bidhaa__material'),tarehe=F('manunuzi__manunuzi__tarehe'),bqty=F('manunuzi__idadi'),rudi=F('manunuzi__rudi'),qtyBefore=F('manunuzi__before'),kipimo=F('bidhaa__vipimo'),date=F('manunuzi__manunuzi__date'),dukaN=F('manunuzi__manunuzi__Interprise__name'),shopN=F('Interprise__name'),shop=F('Interprise'),bidhaaN=F('bidhaa__bidhaa_jina'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),duka=F('manunuzi__manunuzi__Interprise'),uwiano=F('bidhaa__idadi_jum'),marked=F('manunuzi__manunuzi__mark'),code=F('manunuzi__manunuzi__code'),paid=F('manunuzi__manunuzi__ilolipwa'),supplier=F('manunuzi__manunuzi__supplier_id__jina'),vendor=F('manunuzi__manunuzi__supplier_id'))
        itms = itms.annotate(bili=F('produ__manunuzi__manunuzi'),vat=F('mauzo__Interprise__vatper'),kipimo=F('produ__bidhaa__vipimo'),shop=F('mauzo__Interprise'),duka=F('produ__manunuzi__manunuzi__Interprise'),date=F('produ__manunuzi__manunuzi__date'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),thamani=F('produ__Bei_kununua'),uwiano=F('produ__bidhaa__idadi_jum'),tarehe=F('produ__manunuzi__manunuzi__tarehe'),marked=F('produ__manunuzi__manunuzi__mark'),vendor=F('produ__manunuzi__manunuzi__supplier_id'))
        costs = costs.annotate(bili=F('manunuzi_id'),Tarehe=F('manunuzi_id__tarehe'),marked=F('manunuzi_id__mark'),duka=F('manunuzi_id__Interprise'),shop=F('Interprise'),bdate=F('manunuzi_id__date'),vendor=F('manunuzi_id__supplier_id')) 

        adjst = adjst.annotate(bili=F('prod__manunuzi__manunuzi'),bidhaa=F('prod__bidhaa__bidhaa_jina'),mfg=F('adjst__production'),tumika=F('adjst__tumika'),Ongeza=F('adjst__Ongezwa'),shop=F('prod__Interprise'),duka=F('prod__manunuzi__manunuzi__Interprise'),tha=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum'),tarehe=F('prod__manunuzi__manunuzi__tarehe'),date=F('prod__manunuzi__manunuzi__date'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),vendor=F('prod__manunuzi__manunuzi__supplier_id'))
        transfer= transfer.annotate(bili=F('toka__manunuzi__manunuzi'),kwenda_duka=F('kwenda__receive__Interprise'),tarehe=F('toka__manunuzi__manunuzi__tarehe'),shop=F('toka__Interprise'),duka=F('toka__manunuzi__manunuzi__Interprise'),date=F('toka__manunuzi__manunuzi__date'),idadi=F('kwenda__qty'),tha=F('toka__Bei_kununua'),uwiano=F('toka__bidhaa__idadi_jum'),bidhaa_id=F('toka__bidhaa'),aina=F('toka__bidhaa__bidhaa_aina'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),vendor=F('toka__manunuzi__manunuzi__supplier_id'))

        data = {
          'data':list(lst.values()),
          'mauzo':list(itms.values()),
          'cost':list(costs.values()),
          'adjst':list(adjst.values()),
          'transfer':list(transfer.values()),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'cost':[],
        'mauzo':[],
        'adjst':[],
        'transfer':[]
      }
      return JsonResponse(data)

@login_required(login_url='login')
def theBill(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        val = int(request.POST.get('val',0))
        al = int(request.POST.get('al',0))

        duka = todo['duka']

        bil = manunuzi.objects.get(pk=val,Interprise__owner=duka.owner)

        pucolor = purchased_color.objects.filter(manunuzi__manunuzi=bil.id).annotate(color_name=F('color__color__color_name'),bidhaa_a=F('bidhaa__bidhaa'),color_code=F('color__color__color_code')).values()
        puSize = purchased_size.objects.filter(manunuzi__manunuzi=bil.id).annotate(size_name=F('size__sized__size'),bidhaa_a=F('bidhaa__bidhaa')).values()

        sto_color = produ_colored.objects.filter(bidhaa__manunuzi__manunuzi=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sto_size = produ_size.objects.filter(bidhaa__manunuzi__manunuzi=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
    
        sale_color = sales_color.objects.filter(bidhaa__manunuzi__manunuzi=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sale_size = sales_size.objects.filter(bidhaa__manunuzi__manunuzi=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()


        

        adjC = ColorChange.objects.filter(change__prod__manunuzi__manunuzi=bil.id).annotate(uzalishaji=F('change__adjst__production'),bidhaa_id=F('color__bidhaa'),tumika=F('change__adjst__tumika'),Ongeza=F('change__adjst__Ongezwa'),bidhaa_a=F('color__bidhaa__bidhaa')).values()
        adjS = SizeChange.objects.filter(color__change__prod__manunuzi__manunuzi=bil.id).annotate(uzalishaji=F('color__change__adjst__production'),bidhaa_id=F('color__color__bidhaa'),tumika=F('color__change__adjst__tumika'),Ongeza=F('color__change__adjst__Ongezwa'),bidhaa_a=F('color__color__bidhaa__bidhaa')).values()
        by = 'Hakuna'
        if bil.By:
          by = bil.By.user.user.first_name + ' ' + bil.By.user.user.last_name
        data={
        'id':bil.id,'code':bil.code,'phone':bil.supplier_id.code,'address':bil.supplier_id.address,'simu1':bil.supplier_id.simu1,'simu2':bil.supplier_id.simu2,'supplier':bil.supplier_id.jina,'date':bil.date,'tarehe':bil.tarehe,'By':by,'mark':bil.mark,'markDesc':bil.markDesc,
        'success':True,

        'itms_C':list(pucolor),
        'itms_S':list(puSize),

        'adjst_S':list(adjS),
        'adjst_C':list(adjC),

        'sale_C':list(sale_color),
        'sale_S':list(sale_size),

        'stock_C':list(sto_color),
        'stock_S':list(sto_size),
      }
        if al:
              lst = bidhaa_stoku.objects.filter(manunuzi__manunuzi=bil.id).annotate(shop=F('Interprise'),rudi=F('manunuzi__rudi'),paid=F('manunuzi__manunuzi__ilolipwa'),shopN=F('Interprise__name'),bqty=F('manunuzi__idadi'),duka=F('manunuzi__manunuzi__Interprise'),bidhaaN=F('bidhaa__bidhaa_jina'),kipimo=F('bidhaa__vipimo'),material=F('bidhaa__material'),tha=F('Bei_kununua'),uwiano=F('bidhaa__idadi_jum'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),addId=F('ongezwa'),addCode=F('ongezwa__code'),puId=F('manunuzi__manunuzi'),puCode=F('manunuzi__manunuzi__code'),TransId=F('uhamisho__receive'),TransCode=F('uhamisho__receive__transfer__code'),ProdId=F('produced__production__production'),ProdCode=F('produced__production__production__code'),initPu=F('manunuzi__idadi'),initPuDate=F('manunuzi__manunuzi__tarehe'),initAddedDate=F('ongezwa__date'),initTr=F('uhamisho__qty'),initTrDate=F('uhamisho__receive__transfer__tarehe'),initPro=F('produced__qty'),initProDate=F('produced__production__date'),sale=F('Bei_kuuza')).order_by('-pk')
              sale = mauzoList.objects.filter(produ__manunuzi__manunuzi=bil.id).annotate(shop=F('produ__Interprise'),duka=F('produ__manunuzi__manunuzi__Interprise'),service=F('produ__service'),material=F('produ__bidhaa__material'),uwiano=F('produ__bidhaa__idadi_jum'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('produ__uhamisho'),produced_id=F('produ__produced'),tha=F('produ__Bei_kununua'),sale=F('produ__Bei_kuuza'),manunuzi_id=F('produ__manunuzi'),ongezwa_id=F('produ__ongezwa'))
          
              transfer = transferList.objects.filter(toka__manunuzi__manunuzi=bil.id).annotate(shop=F('toka__Interprise'),kwenda_duka=F('kwenda__receive__Interprise'),duka=F('toka__manunuzi__manunuzi__Interprise'),bidhaa_id=F('toka__bidhaa'),service=F('toka__service'),qty=F('kwenda__qty'),material=F('toka__bidhaa__material'),uwiano=F('toka__bidhaa__idadi_jum'),aina=F('toka__bidhaa__bidhaa_aina'),tha=F('toka__Bei_kununua'),sale=F('toka__Bei_kuuza'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('toka__uhamisho'),produced_id=F('toka__produced'),manunuzi_id=F('toka__manunuzi'),ongezwa_id=F('toka__ongezwa'))
            
              adjst = productChangeRecord.objects.filter(prod__manunuzi__manunuzi=bil.id).annotate(shop=F('prod__Interprise'),duka=F('prod__manunuzi__manunuzi__Interprise'),uhamisho_id=F('prod__uhamisho'),produced_id=F('prod__produced'),manunuzi_id=F('prod__manunuzi'),ongezwa_id=F('prod__ongezwa'),sale=F('prod__Bei_kuuza'),
              mfg=F('adjst__production'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),waste=F('adjst__potea'),damage=F('adjst__haribika'),Ongeza=F('adjst__Ongezwa'),register=F('adjst__registered'),tha=F('prod__Bei_kununua'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),
              service=F('prod__service'),material=F('prod__bidhaa__material'),uwiano=F('prod__bidhaa__idadi_jum'))
              
              costs =   rekodiMatumizi.objects.filter(manunuzi_id=bil.id).annotate(bili=F('manunuzi_id'),Tarehe=F('manunuzi_id__tarehe'),marked=F('manunuzi_id__mark'),duka=F('manunuzi_id__Interprise'),shop=F('Interprise'),bdate=F('manunuzi_id__date'),vendor=F('manunuzi_id__supplier_id')) 

              data.update({
                      'data':list(lst.values()),
                      'mauzo':list(sale.values()),
                      'cost':list(costs.values()),
                      'adjst':list(adjst.values()),
                      'transfer':list(transfer.values()),      
              })
        return JsonResponse(data) 
   
    except:
      data={
        'success':False,
      }

      return JsonResponse(data)    
  else:
     return render(request,'pagenotFound.html',todoFunct(request))    


# PRODUCTION ..........................................//
@login_required(login_url='login')
def prodxnRiport(request):
    todo = todoFunct(request)
    duka = todo['duka']
    br = [duka.id]
    for b in todo['matawi']:
      br.append(b.Interprise.id)
    lastPu = productionListDate.objects.filter(production__Interprise__in=br).annotate(tarehe=F('date')).order_by('id')
 
    if lastPu.exists():
      todo.update({
        'last':lastPu.last(),
        'first':lastPu.first()
      })
    if not duka.Interprise:
        return redirect('/userdash')
    else:       
         return render(request,'riportProdxn.html',todo)

@login_required(login_url='login')
def prodxnData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        d = int(request.POST.get('d',0))
        mark = int(request.POST.get('mark',0))
        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst=bidhaa_stoku.objects.filter(produced__production__production__Interprise__in=br,produced__production__date__gte=tf).exclude(produced__production__date__gt=tt)
        itms = mauzoList.objects.filter(produ__produced__production__date__gte=tf,produ__produced__production__production__Interprise__in=br,mauzo__service=False,mauzo__order=False).exclude(produ__produced__production__date__gt=tt)
        # costs =   rekodiMatumizi.objects.filter(manunuzi_id__date__gte=tf,manunuzi_id__Interprise__in=br).exclude(manunuzi_id__tarehe__gt=tt) 
        adjst = productChangeRecord.objects.filter(prod__produced__production__date__gte=tf,prod__produced__production__production__Interprise__in=br).exclude(prod__produced__production__date__gt=tt)
        transfer = transferList.objects.filter(toka__produced__production__date__gte=tf,toka__produced__production__production__Interprise__in=br).exclude(toka__produced__production__date__gt=tt)

        if mark:
          lst=bidhaa_stoku.objects.filter(produced__production__production__Interprise__in=br,produced__production__mark=1)
          itms = mauzoList.objects.filter(produ__produced__production__mark=1,produ__produced__production__production__Interprise__in=br,mauzo__service=False,mauzo__order=False)
          # costs =   rekodiMatumizi.objects.filter(matumiziDeti__produxn__mark=1,manunuzi_id__Interprise__in=br)
          adjst = productChangeRecord.objects.filter(prod__produced__production__mark=1,prod__produced__production__production__Interprise__in=br)
          transfer = transferList.objects.filter(toka__produced__production__mark=1,toka__produced__production__production__Interprise__in=br)

       
        lst = lst.annotate(bili=F('produced__production'),prod=F('produced__production__production'),prodCode=F('produced__production__production__code'),Na=F('produced__production__Na'),first_name=F('produced__production__Na__user__user__first_name'),last_name=F('produced__production__Na__user__user__last_name'),material=F('bidhaa__material'),tarehe=F('produced__production__date'),bqty=F('produced__qty'),kipimo=F('bidhaa__vipimo'),date=F('produced__production__date'),dukaN=F('produced__production__production__Interprise__name'),shopN=F('Interprise__name'),shop=F('Interprise'),bidhaaN=F('bidhaa__bidhaa_jina'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),duka=F('produced__production__production__Interprise'),uwiano=F('bidhaa__idadi_jum'),marked=F('produced__production__mark'),code=F('produced__production__code'))
        itms = itms.annotate(bili=F('produ__produced__production'),Na=F('produ__produced__production__Na'),vat=F('mauzo__Interprise__vatper'),kipimo=F('produ__bidhaa__vipimo'),shop=F('mauzo__Interprise'),duka=F('produ__produced__production__production__Interprise'),date=F('produ__produced__production__date'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),thamani=F('produ__Bei_kununua'),uwiano=F('produ__bidhaa__idadi_jum'),tarehe=F('produ__produced__production__date'),marked=F('produ__produced__production__mark'))
        # costs = costs.annotate(bili=F('manunuzi_id'),Tarehe=F('manunuzi_id__tarehe'),marked=F('manunuzi_id__mark'),duka=F('manunuzi_id__Interprise'),shop=F('Interprise'),bdate=F('manunuzi_id__date'),vendor=F('manunuzi_id__supplier_id')) 

        adjst = adjst.annotate(bili=F('prod__produced__production'),Na=F('prod__produced__production__Na'),bidhaa=F('prod__bidhaa__bidhaa_jina'),mfg=F('adjst__production'),tumika=F('adjst__tumika'),Ongeza=F('adjst__Ongezwa'),shop=F('prod__Interprise'),duka=F('prod__produced__production__production__Interprise'),tha=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum'),tarehe=F('prod__produced__production__date'),date=F('prod__produced__production__date'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'))
        transfer= transfer.annotate(bili=F('toka__produced__production'),Na=F('toka__produced__production__Na'),kwenda_duka=F('kwenda__receive__Interprise'),tarehe=F('toka__produced__production__date'),shop=F('toka__Interprise'),duka=F('toka__produced__production__production__Interprise'),date=F('toka__produced__production__date'),idadi=F('kwenda__qty'),tha=F('toka__Bei_kununua'),uwiano=F('toka__bidhaa__idadi_jum'),bidhaa_id=F('toka__bidhaa'),aina=F('toka__bidhaa__bidhaa_aina'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'))

        data = {
          'data':list(lst.values()),
          'mauzo':list(itms.values()),
          'cost':[],
          'adjst':list(adjst.values()),
          'transfer':list(transfer.values()),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        # 'cost':[],
        'mauzo':[],
        'adjst':[],
        'transfer':[]
      }
      return JsonResponse(data)

@login_required(login_url='login')
def theBatch(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        val = int(request.POST.get('val',0))
        al = int(request.POST.get('al',0))

        duka = todo['duka']

        bil = productionListDate.objects.get(pk=val,production__Interprise__owner=duka.owner)

        pucolor = production_color.objects.filter(product__production=bil.id).annotate(color_name=F('color__color__color_name'),bidhaa_a=F('color__bidhaa__bidhaa'),color_code=F('color__color__color_code')).values()
        puSize = production_size.objects.filter(color__product__production=bil.id).annotate(size_name=F('size__sized__size'),bidhaa_a=F('size__bidhaa__bidhaa')).values()

        sto_color = produ_colored.objects.filter(bidhaa__produced__production=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sto_size = produ_size.objects.filter(bidhaa__produced__production=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
    
        sale_color = sales_color.objects.filter(bidhaa__produced__production=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sale_size = sales_size.objects.filter(bidhaa__produced__production=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()


        

        adjC = ColorChange.objects.filter(change__prod__produced__production=bil.id).annotate(uzalishaji=F('change__adjst__production'),bidhaa_id=F('color__bidhaa'),tumika=F('change__adjst__tumika'),Ongeza=F('change__adjst__Ongezwa'),bidhaa_a=F('color__bidhaa__bidhaa')).values()
        adjS = SizeChange.objects.filter(color__change__prod__produced__production=bil.id).annotate(uzalishaji=F('color__change__adjst__production'),bidhaa_id=F('color__color__bidhaa'),tumika=F('color__change__adjst__tumika'),Ongeza=F('color__change__adjst__Ongezwa'),bidhaa_a=F('color__color__bidhaa__bidhaa')).values()
        by = 'Hakuna'
        if bil.Na:
          by = bil.Na.user.user.first_name + ' ' + bil.Na.user.user.last_name
        data={
        'id':bil.id,'code':bil.code,'desc':bil.production.desc,'from':bil.production.Recodeddate,'complete':bil.production.complete,'to':bil.production.endDate,'prod':bil.production.id,'prodCode':bil.production.code,'date':bil.date,'By':by,'mark':bil.mark,'markDesc':bil.markDesc,
        'success':True,

        'itms_C':list(pucolor),
        'itms_S':list(puSize),

        'adjst_S':list(adjS),
        'adjst_C':list(adjC),

        'sale_C':list(sale_color),
        'sale_S':list(sale_size),

        'stock_C':list(sto_color),
        'stock_S':list(sto_size),
      }
        if al:
              lst = bidhaa_stoku.objects.filter(produced__production=bil.id).annotate(shop=F('Interprise'),shopN=F('Interprise__name'),duka=F('produced__production__production__Interprise'),bqty=F('produced__qty'),bidhaaN=F('bidhaa__bidhaa_jina'),kipimo=F('bidhaa__vipimo'),material=F('bidhaa__material'),tha=F('Bei_kununua'),uwiano=F('bidhaa__idadi_jum'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),addId=F('ongezwa'),addCode=F('ongezwa__code'),puId=F('manunuzi__manunuzi'),puCode=F('manunuzi__manunuzi__code'),TransId=F('uhamisho__receive'),TransCode=F('uhamisho__receive__transfer__code'),ProdId=F('produced__production__production'),ProdCode=F('produced__production__production__code'),initPu=F('manunuzi__idadi'),initPuDate=F('manunuzi__manunuzi__tarehe'),initAddedDate=F('ongezwa__date'),initTr=F('uhamisho__qty'),initTrDate=F('uhamisho__receive__transfer__tarehe'),initPro=F('produced__qty'),initProDate=F('produced__production__date'),sale=F('Bei_kuuza')).order_by('-pk')
              sale = mauzoList.objects.filter(produ__produced__production=bil.id).annotate(shop=F('produ__Interprise'),duka=F('produ__produced__production__production__Interprise'),service=F('produ__service'),material=F('produ__bidhaa__material'),uwiano=F('produ__bidhaa__idadi_jum'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('produ__uhamisho'),produced_id=F('produ__produced'),tha=F('produ__Bei_kununua'),sale=F('produ__Bei_kuuza'),manunuzi_id=F('produ__manunuzi'),ongezwa_id=F('produ__ongezwa'))
          
              transfer = transferList.objects.filter(toka__produced__production=bil.id).annotate(shop=F('toka__Interprise'),kwenda_duka=F('kwenda__receive__Interprise'),bidhaa_id=F('toka__bidhaa_id'),duka=F('toka__produced__production__production__Interprise'),service=F('toka__service'),qty=F('kwenda__qty'),material=F('toka__bidhaa__material'),uwiano=F('toka__bidhaa__idadi_jum'),aina=F('toka__bidhaa__bidhaa_aina'),tha=F('toka__Bei_kununua'),sale=F('toka__Bei_kuuza'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('toka__uhamisho'),produced_id=F('toka__produced'),manunuzi_id=F('toka__manunuzi'),ongezwa_id=F('toka__ongezwa'))
            
              adjst = productChangeRecord.objects.filter(prod__produced__production=bil.id).annotate(shop=F('prod__Interprise'),duka=F('prod__produced__production__production__Interprise'),uhamisho_id=F('prod__uhamisho'),produced_id=F('prod__produced'),manunuzi_id=F('prod__manunuzi'),ongezwa_id=F('prod__ongezwa'),sale=F('prod__Bei_kuuza'),
              mfg=F('adjst__production'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),waste=F('adjst__potea'),damage=F('adjst__haribika'),Ongeza=F('adjst__Ongezwa'),register=F('adjst__registered'),tha=F('prod__Bei_kununua'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),
              service=F('prod__service'),material=F('prod__bidhaa__material'),uwiano=F('prod__bidhaa__idadi_jum'))
             
              data.update({
                      'data':list(lst.values()),
                      'mauzo':list(sale.values()),
                      'cost':[],
                      'adjst':list(adjst.values()),
                      'transfer':list(transfer.values()),      
              })      

        return JsonResponse(data) 
   
    except:
      data={
        'success':False,
      }

      return JsonResponse(data)    
  else:
     return render(request,'pagenotFound.html',todoFunct(request))    


# ITEMS RECEIVES ..........................................//
@login_required(login_url='login')
def receivesRiport(request):
    todo = todoFunct(request)
    duka = todo['duka']
    br = [duka.id]
    for b in todo['matawi']:
      br.append(b.Interprise.id)
    lastPu = receive.objects.filter(Interprise__in=br).annotate(tarehe=F('transfer__tarehe')).order_by('id')
 
    if lastPu.exists():
      todo.update({
        'last':lastPu.last(),
        'first':lastPu.first()
      })
    if not duka.Interprise:
        return redirect('/userdash')
    else:       
        return render(request,'riportReceives.html',todo)

@login_required(login_url='login')
def ReceivesData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        d = int(request.POST.get('d',0))
        mark = int(request.POST.get('mark',0))
        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst=bidhaa_stoku.objects.filter(uhamisho__receive__Interprise__in=br,uhamisho__receive__transfer__tarehe__gte=tf).exclude(uhamisho__receive__transfer__tarehe__gt=tt)
        itms = mauzoList.objects.filter(produ__uhamisho__receive__transfer__tarehe__gte=tf,produ__uhamisho__receive__Interprise__in=br,mauzo__service=False,mauzo__order=False).exclude(produ__uhamisho__receive__transfer__tarehe__gt=tt)
        # costs =   rekodiMatumizi.objects.filter(manunuzi_id__date__gte=tf,manunuzi_id__Interprise__in=br).exclude(manunuzi_id__tarehe__gt=tt) 
        adjst = productChangeRecord.objects.filter(prod__uhamisho__receive__transfer__tarehe__gte=tf,prod__uhamisho__receive__Interprise__in=br).exclude(prod__uhamisho__receive__transfer__tarehe__gt=tt)
        transfer = transferList.objects.filter(toka__uhamisho__receive__transfer__tarehe__gte=tf,toka__uhamisho__receive__Interprise__in=br).exclude(toka__uhamisho__receive__transfer__tarehe__gt=tt)

        if mark:
          lst=bidhaa_stoku.objects.filter(uhamisho__receive__Interprise__in=br,uhamisho__receive__mark=1)
          itms = mauzoList.objects.filter(produ__uhamisho__receive__mark=1,produ__uhamisho__receive__Interprise__in=br,mauzo__service=False,mauzo__order=False)
          # costs =   rekodiMatumizi.objects.filter(matumiziDeti__produxn__mark=1,manunuzi_id__Interprise__in=br)
          adjst = productChangeRecord.objects.filter(prod__uhamisho__receive__mark=1,prod__uhamisho__receive__Interprise__in=br)
          transfer = transferList.objects.filter(toka__uhamisho__receive__mark=1,toka__uhamisho__receive__Interprise__in=br)

       
        lst = lst.annotate(bili=F('uhamisho__receive'),Na=F('uhamisho__receive__transfer__Interprise'),Na_name=F('uhamisho__receive__transfer__Interprise__name'),material=F('bidhaa__material'),tarehe=F('uhamisho__receive__transfer__tarehe'),bqty=F('uhamisho__qty'),kipimo=F('bidhaa__vipimo'),date=F('uhamisho__receive__transfer__tarehe'),dukaN=F('uhamisho__receive__Interprise__name'),shopN=F('Interprise__name'),shop=F('Interprise'),bidhaaN=F('bidhaa__bidhaa_jina'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),duka=F('uhamisho__receive__Interprise'),uwiano=F('bidhaa__idadi_jum'),marked=F('uhamisho__receive__mark'),code=F('uhamisho__receive__transfer__code'))
        itms = itms.annotate(bili=F('produ__uhamisho__receive'),Na=F('produ__uhamisho__receive__transfer__Interprise'),vat=F('mauzo__Interprise__vatper'),kipimo=F('produ__bidhaa__vipimo'),shop=F('mauzo__Interprise'),duka=F('produ__uhamisho__receive__Interprise'),date=F('produ__uhamisho__receive__transfer__tarehe'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),thamani=F('produ__Bei_kununua'),uwiano=F('produ__bidhaa__idadi_jum'),tarehe=F('produ__uhamisho__receive__transfer__tarehe'),marked=F('produ__uhamisho__receive__mark'))
        # costs = costs.annotate(bili=F('manunuzi_id'),Tarehe=F('manunuzi_id__tarehe'),marked=F('manunuzi_id__mark'),duka=F('manunuzi_id__Interprise'),shop=F('Interprise'),bdate=F('manunuzi_id__date'),vendor=F('manunuzi_id__supplier_id')) 

        adjst = adjst.annotate(bili=F('prod__uhamisho__receive'),Na=F('prod__uhamisho__receive__transfer__Interprise'),bidhaa=F('prod__bidhaa__bidhaa_jina'),mfg=F('adjst__production'),tumika=F('adjst__tumika'),Ongeza=F('adjst__Ongezwa'),shop=F('prod__Interprise'),duka=F('prod__uhamisho__receive__Interprise'),tha=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum'),tarehe=F('prod__uhamisho__receive__transfer__tarehe'),date=F('prod__uhamisho__receive__transfer__tarehe'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'))
        transfer= transfer.annotate(bili=F('toka__uhamisho__receive'),Na=F('toka__uhamisho__receive__transfer__Interprise'),kwenda_duka=F('kwenda__receive__Interprise'),tarehe=F('toka__uhamisho__receive__transfer__tarehe'),shop=F('toka__Interprise'),duka=F('toka__uhamisho__receive__Interprise'),date=F('toka__uhamisho__receive__transfer__tarehe'),idadi=F('kwenda__qty'),tha=F('toka__Bei_kununua'),uwiano=F('toka__bidhaa__idadi_jum'),bidhaa_id=F('toka__bidhaa'),aina=F('toka__bidhaa__bidhaa_aina'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'))

        data = {
          'data':list(lst.values()),
          'mauzo':list(itms.values()),
          'cost':[],
          'adjst':list(adjst.values()),
          'transfer':list(transfer.values()),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        # 'cost':[],
        'mauzo':[],
        'adjst':[],
        'transfer':[]
      }
      return JsonResponse(data)

@login_required(login_url='login')
def theReceive(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        val = int(request.POST.get('val',0))
        al = int(request.POST.get('al',0))

        duka = todo['duka']

        bil = receive.objects.get(pk=val,Interprise__owner=duka.owner)

        pucolor = produ_colored.objects.filter(bidhaa__uhamisho__receive=bil.id).annotate(color_name=F('color__color_name'),bidhaa_a=F('bidhaa__bidhaa'),qty=F('received__qty'),color_code=F('color__color_code')).values()
        puSize = produ_size.objects.filter(bidhaa__uhamisho__receive=bil.id).annotate(size_name=F('sized__size'),color_id=F('sized__color'),bidhaa_a=F('bidhaa__bidhaa'),qty=F('received__qty')).values()

        sto_color = produ_colored.objects.filter(bidhaa__uhamisho__receive=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sto_size = produ_size.objects.filter(bidhaa__uhamisho__receive=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
    
        sale_color = sales_color.objects.filter(bidhaa__uhamisho__receive=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()
        sale_size = sales_size.objects.filter(bidhaa__uhamisho__receive=bil.id).annotate(bidhaa_a=F('bidhaa__bidhaa')).values()


        

        adjC = ColorChange.objects.filter(change__prod__uhamisho__receive=bil.id).annotate(uzalishaji=F('change__adjst__production'),bidhaa_id=F('color__bidhaa'),tumika=F('change__adjst__tumika'),Ongeza=F('change__adjst__Ongezwa'),bidhaa_a=F('color__bidhaa__bidhaa')).values()
        adjS = SizeChange.objects.filter(color__change__prod__uhamisho__receive=bil.id).annotate(uzalishaji=F('color__change__adjst__production'),bidhaa_id=F('color__color__bidhaa'),tumika=F('color__change__adjst__tumika'),Ongeza=F('color__change__adjst__Ongezwa'),bidhaa_a=F('color__color__bidhaa__bidhaa')).values()
        by = 'Hakuna'
        if bil.By:
          by = bil.By.user.user.first_name + ' ' + bil.By.user.user.last_name
        data={
        'id':bil.id,'code':bil.transfer.code,'from':bil.transfer.Interprise.id,'fromN':bil.transfer.Interprise.name,'date':bil.transfer.date,'tarehe':bil.transfer.tarehe,'By':by,'mark':bil.mark,'markDesc':bil.markDesc,
        'success':True,

        'itms_C':list(pucolor),
        'itms_S':list(puSize),

        'adjst_S':list(adjS),
        'adjst_C':list(adjC),

        'sale_C':list(sale_color),
        'sale_S':list(sale_size),

        'stock_C':list(sto_color),
        'stock_S':list(sto_size),
      }

        if al:
              lst = bidhaa_stoku.objects.filter(uhamisho__receive=bil.id).annotate(shop=F('Interprise'),shopN=F('Interprise__name'),duka=F('uhamisho__receive__Interprise'),bqty=F('uhamisho__qty'),bidhaaN=F('bidhaa__bidhaa_jina'),kipimo=F('bidhaa__vipimo'),material=F('bidhaa__material'),tha=F('Bei_kununua'),uwiano=F('bidhaa__idadi_jum'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),addId=F('ongezwa'),addCode=F('ongezwa__code'),puId=F('manunuzi__manunuzi'),puCode=F('manunuzi__manunuzi__code'),TransId=F('uhamisho__receive'),TransCode=F('uhamisho__receive__transfer__code'),ProdId=F('produced__production__production'),ProdCode=F('produced__production__production__code'),initPu=F('manunuzi__idadi'),initPuDate=F('manunuzi__manunuzi__tarehe'),initAddedDate=F('ongezwa__date'),initTr=F('uhamisho__qty'),initTrDate=F('uhamisho__receive__transfer__tarehe'),initPro=F('produced__qty'),initProDate=F('produced__production__date'),sale=F('Bei_kuuza')).order_by('-pk')
              sale = mauzoList.objects.filter(produ__uhamisho__receive=bil.id).annotate(shop=F('produ__Interprise'),duka=F('produ__uhamisho__receive__Interprise'),service=F('produ__service'),material=F('produ__bidhaa__material'),uwiano=F('produ__bidhaa__idadi_jum'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('produ__uhamisho'),produced_id=F('produ__produced'),tha=F('produ__Bei_kununua'),sale=F('produ__Bei_kuuza'),manunuzi_id=F('produ__manunuzi'),ongezwa_id=F('produ__ongezwa'))
          
              transfer = transferList.objects.filter(toka__uhamisho__receive=bil.id).annotate(shop=F('toka__Interprise'),kwenda_duka=F('kwenda__receive__Interprise'),bidhaa_id=F('toka__bidhaa'),duka=F('toka__uhamisho__receive__Interprise'),service=F('toka__service'),qty=F('kwenda__qty'),material=F('toka__bidhaa__material'),uwiano=F('toka__bidhaa__idadi_jum'),aina=F('toka__bidhaa__bidhaa_aina'),tha=F('toka__Bei_kununua'),sale=F('toka__Bei_kuuza'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('toka__uhamisho'),produced_id=F('toka__produced'),manunuzi_id=F('toka__manunuzi'),ongezwa_id=F('toka__ongezwa'))
            
              adjst = productChangeRecord.objects.filter(prod__uhamisho__receive=bil.id).annotate(shop=F('prod__Interprise'),duka=F('prod__uhamisho__receive__Interprise'),uhamisho_id=F('prod__uhamisho'),produced_id=F('prod__produced'),manunuzi_id=F('prod__manunuzi'),ongezwa_id=F('prod__ongezwa'),sale=F('prod__Bei_kuuza'),
              mfg=F('adjst__production'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),waste=F('adjst__potea'),damage=F('adjst__haribika'),Ongeza=F('adjst__Ongezwa'),register=F('adjst__registered'),tha=F('prod__Bei_kununua'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),
              service=F('prod__service'),material=F('prod__bidhaa__material'),uwiano=F('prod__bidhaa__idadi_jum'))
             
              data.update({
                      'data':list(lst.values()),
                      'mauzo':list(sale.values()),
                      'cost':[],
                      'adjst':list(adjst.values()),
                      'transfer':list(transfer.values()),      
              })
        

        return JsonResponse(data) 
   
    except:
      data={
        'success':False,
      }

      return JsonResponse(data)    
  else:
     return render(request,'pagenotFound.html',todoFunct(request)) 

# REDUCING ADJUSTMENT......................................//
@login_required(login_url='login')
def ReduceAdj(request):
  todo = todoFunct(request)
  duka = todo['duka']
  br = [duka.id]
  for b in todo['matawi']:
    br.append(b.Interprise.id)  
  adj = stokAdjustment.objects.filter(Interprise__in=br,Ongezwa=False,registered=False,full_Return=False).annotate(tarehe=F('date')).order_by('id')  

 
  if adj.exists():
    todo.update({
      'last':adj.last(),
      'first':adj.first()
    })
  if not duka.Interprise:
      return redirect('/userdash')
  else: 
     return render(request,'riportReduceAdj.html',todo)  

@login_required(login_url='login')
def ReduceAdjData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        duka = todo['duka']
        
        br = [duka.id]

        for b in todo['matawi']:
          br.append(b.Interprise.id)
    
      
        lst=stokAdjustment.objects.filter(date__gte=tf,Interprise__in=br,Ongezwa=False,registered=False,full_Return=False).annotate(duka=F('Interprise'),tarehe=F('date'),dukan=F('Interprise__name'),f_name=F('Na__user__user__first_name'),l_name=F('Na__user__user__last_name')).exclude(date__gt=tt).values()
        itms = productChangeRecord.objects.filter(adjst__date__gte=tf,adjst__Ongezwa=False,adjst__full_Return=False,adjst__registered=False,adjst__Interprise__in=br).exclude(adjst__date__gt=tt).annotate(By=F('adjst__Na'),duka=F('adjst__Interprise'),dukaN=F('adjst__Interprise__name'),haribika=F('adjst__haribika'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),potea=F('adjst__potea'),mfg=F('adjst__production'),kipimo=F('prod__bidhaa__vipimo'),bidhaa=F('prod__bidhaa'),bidhaaN=F('prod__bidhaa__bidhaa_jina'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),user=F('adjst__Na'),thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum'),tarehe=F('adjst__date'),date=F('adjst__Recodeddate'),shelf=F('prod__idadi')).values()

        data = {
          'data':list(lst),
          'itms':list(itms),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)

@login_required(login_url='login')
def theReduceAdj(request):
  try:
    todo = todoFunct(request)   
    duka = todo['duka']

    inv = int(request.POST.get('val',0)) 
    invoo=stokAdjustment.objects.filter(pk=inv,Interprise__owner=duka.owner.id)
   
    invo = invoo.last()
    list_mauzo = productChangeRecord.objects.filter(adjst=invo.id)
    reList = []

    for li in list_mauzo:
            pic = picha_bidhaa.objects.filter(bidhaa=li.prod.bidhaa.id)
            picha=''
            if pic.exists() and pic.last().picha.picha:
                  picha = pic.last().picha.picha.url
       
            reList.append({
                  'picha':picha,
                  'val':li.id,
                  'prod':li.prod.id,
                  'idadi':li.qty,
                  'bei':li.prod.Bei_kununua,
                  'maelezo':li.prod.bidhaa.maelezo,
                  'vipimo':li.prod.bidhaa.vipimo,
                  'vipimo_jum':li.prod.bidhaa.vipimo_jum,
                  'jina':li.prod.bidhaa.bidhaa_jina,
                  'uwiano':li.prod.bidhaa.idadi_jum,
                  'prdcd':0,
               
                  
            })

    bei_used = []

    for li in list_mauzo:
          the_bei = bei_za_bidhaa.objects.filter(item=li.prod.bidhaa.id)
          for p in the_bei:
            bei = [{
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id

            }]
            bei_used+=bei

    colors = ColorChange.objects.filter(change__adjst=invo.id).annotate(itm=F('change'),val=F('color__color'),idadi=F('qty'),color_name=F('color__color__color_name'),color_code=F('color__color__color_code')).values()
    sizen = SizeChange.objects.filter(color__change__adjst=invo.id).annotate(idadi=F('qty'),color_val=F('size__sized__color'),size_name=F('size__sized__size')).values()

    comfirm_ = stockAdjst_confirm.objects.filter(adjs=invo.id).annotate(admin=F('userP__admin'),f_name=F('userP__user__user__first_name'),l_name=F('userP__user__user__last_name'),u_name=F('userP__fanyakazi__jina'),cheo=F('userP__cheo')).values()
      
    logo = ''
    if invo.Interprise.logo:
      logo = invo.Interprise.logo.url
    
    
    prodxn = 0
    if invo.production:
        prodxn = invo.production.id   
    data ={
      'success':True,
      'itms':reList,
      'bei':bei_used,
      'color':list(colors),
      'size':list(sizen),
      'confirm':list(comfirm_),
      
      'invo':{'id':invo.id,'f_name':invo.Na.user.user.first_name,'tumika':invo.tumika,'haribika':invo.haribika,'expire':invo.expire,'potea':invo.potea,'mnf':prodxn,'tumika':invo.tumika,'l_name':invo.Na.user.user.last_name,'maelezo':invo.desc,'Intp_code':invo.Interprise.Intp_code,'logo':logo,'jengo':invo.Interprise.jengo,'duka':invo.Interprise.name,'mtaa':invo.Interprise.mtaa.mtaa,'kata':invo.Interprise.mtaa.kata.kata,'wilaya':invo.Interprise.mtaa.kata.wilaya.wilaya,'nchi':invo.Interprise.mtaa.kata.wilaya.mkoa.kanda.nchi.name,'mkoa':invo.Interprise.mtaa.kata.wilaya.mkoa,'code':invo.code,'date':invo.Recodeddate,'tarehe':invo.date}
         
    }  
    return JsonResponse(data)

  except:

    data={
      'success':False
    }

    return JsonResponse(data)  

# EXPIRED ITEMS REPORT................................................//
@login_required(login_url='login')
def ExpiredItems(request):
  todo = todoFunct(request)
  duka = todo['duka']
  s = int(request.GET.get('s',0))
  br = [duka.id]
  for b in todo['matawi']:
    br.append(b.Interprise.id)
  expItems = bidhaa_stoku.objects.filter(Interprise__in=br,service=False,idadi__gt=0,expire_date__gte=date.today()).annotate(tarehe=F('expire_date')).order_by('expire_date')   
 
  if expItems.exists():
    todo.update({
      'last':expItems.last(),
      'first':expItems.first()
    })
  if not duka.Interprise:
    return redirect('/userdash')
  else:  
    return render(request,'riportExpiredItems.html',todo)  

@login_required(login_url='login')
def ExpiredData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        serv = int(request.POST.get('s',0))
        duka = todo['duka']
        
        br = [duka.id]

       

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst=bidhaa_stoku.objects.filter(Interprise__in=br,service=False,idadi__gt=0).annotate(bidhaaN=F('bidhaa__bidhaa_jina'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),kipimo=F('bidhaa__vipimo'),uwiano=F('bidhaa__idadi_jum'),duka=F('Interprise'),dukaN=F('Interprise__name'),tarehe=F('expire_date'),date=F('expire_date'))
        about = lst.filter(expire_date__gte=tf).exclude(expire_date__gt=tt).values()
        expired = lst.filter(expire_date__lte=date.today()).values()

        data = {
          'data':list(about),
          'itms':list(expired),
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request))


# EXPENSES ................................................//
@login_required(login_url='login')
def Expensesr(request):
  todo = todoFunct(request)
  if not todo['duka'].Interprise:
      return redirect('/userdash')
  else:   
     return render(request,'riportBusiExpenses.html',todo)  

@login_required(login_url='login')
def ExpensedData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        serv = int(request.POST.get('s',0))
        duka = todo['duka']
        
        br = [duka.id]

       

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst=rekodiMatumizi.objects.filter(Interprise__in=br,tarehe__gte=tf).exclude(tarehe__gt=tt).annotate(duka=F('Interprise'),akauntiN=F('akaunti__Akaunt_name'),Aamount=F('akaunti__Amount'),dukaN=F('Interprise__name'),Na=F('by'),matumiziN=F('matumizi__matumizi'),f_name=F('by__user__user__first_name'),l_name=F('by__user__user__last_name'))
        charges = toaCash.objects.filter(Interprise__in=br,tarehe__gte=tf,makato__gt=0).exclude(tarehe__gt=tt).annotate(duka=F('Interprise'),akaunti_id=F('Akaunt'),Na=F('by'),Aamount=F('Akaunt__Amount'))
      
        data = {
          'data':list(lst.values()),
          'itms':list(charges.values()),
          
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request))

# INCOME & EXPENDITURE ................................................//
@login_required(login_url='login')
def IncomeExpenditure(request):
  todo = todoFunct(request)
  if not todo['duka'].Interprise:
      return redirect('/userdash')
  else:  
     return render(request,'riportIncomeExpend.html',todo)  

@login_required(login_url='login')
def incoExpndData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        serv = int(request.POST.get('s',0))
        duka = todo['duka']
        
        br = [duka.id]

       

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        expend=toaCash.objects.filter(Interprise__in=br,tarehe__gte=tf).exclude(tarehe__gt=tt).annotate(duka=F('Interprise'),akauntiN=F('Akaunt__Akaunt_name'),Aamount=F('Akaunt__Amount'),kiasi=F('Amount'),dukaN=F('Interprise__name'),Na=F('by'),matumiziN=F('matumizi__matumizi__matumizi'),expenses=F('matumizi__matumizi'),bill_code=F('bill__code'),f_name=F('by__user__user__first_name'),l_name=F('by__user__user__last_name')).order_by('id')
        income = wekaCash.objects.filter(Interprise__in=br,tarehe__gte=tf).exclude(tarehe__gt=tt).annotate(duka=F('Interprise'),akauntiN=F('Akaunt__Akaunt_name'),other_service=F('huduma_nyingine__huduma'),Aamount=F('Akaunt__Amount'),kiasi=F('Amount'),Na=F('by'),serv=F('invo__service'),f_name=F('by__user__user__first_name'),invo_code=F('invo__code'),l_name=F('by__user__user__last_name')).order_by('id')
      
        # check each payment account initial amount .........................................................//

        allac = PaymentAkaunts.objects.filter(Interprise__in=br)
        NotExisting = []

        for ac in allac:
          expnd = toaCash.objects.filter(Akaunt=ac.id,tarehe__gte=tf).exclude(tarehe__gt=tt)
          incm = wekaCash.objects.filter(Akaunt=ac.id,tarehe__gte=tf).exclude(tarehe__gt=tt)

          if not (expnd.exists() or incm.exists()):
            NotExisting.append({'id':ac.id,'duka':ac.Interprise.id,'name':ac.Akaunt_name,'Amount':ac.Amount,'added':ac.addedDate})
        
    
        InitialAmoForNonExisting = []
        if len(NotExisting) > 0:
          for ac in NotExisting:  
            expnd = toaCash.objects.filter(Akaunt=ac['id'],tarehe__lt=tf) 
            incm = wekaCash.objects.filter(Akaunt=ac['id'],tarehe__lt=tf)

            amount = 0
            if expnd.exists() and incm.exists():
              
              if expnd.last().tarehe > incm.last().tarehe:
                amount = expnd.last().After
              else:
                amount = incm.last().After
            elif expnd.exists() and not incm.exists():
              amount = expnd.last().After   

            elif incm.exists() and not expnd.exists():
                amount = incm.last().After
            else:
              amount = 0
              # print({'added':ac['added'].astimezone().strftime('%Y-%m-%d %H:%M:%S%z') ,'tt':tt})
              if  ac['added'].astimezone().strftime('%Y-%m-%d %H:%M:%S%z') < tt:
                amount = ac['Amount']   

        # .astimezone()
        #  today_morning = leo.strftime('%Y-%m-%d 00:00:00%z') 


            InitialAmoForNonExisting.append({
              'ac':ac['id'],
              'name':ac['name'],
              'amount':amount,
              'duka':ac['duka']
            })




        data = {
          'expend':list(expend.values()),
          'income':list(income.values()),
          'nonExisting':InitialAmoForNonExisting,
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'income':[],
        'expend':[],
        'nonExisting':[]

      }
      return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request))

# AMOUNT TRANSFER ................................................//
@login_required(login_url='login')
def TansferR(request):
  todo = todoFunct(request)
  duka = todo['duka']
  s = int(request.GET.get('s',0))
  br = [duka.id]
  for b in todo['matawi']:
    br.append(b.Interprise.id)
  transfer = toaCash.objects.filter(Interprise__in=br,kuhamisha=True).order_by('id')   
 
  if transfer.exists():
    todo.update({
      'last':transfer.last(),
      'first':transfer.first()
    })
  if not duka.Interprise:
      return redirect('/userdash')
  else:  
     return render(request,'riportAmountTransfer.html',todo)  

@login_required(login_url='login')
def TransferData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        serv = int(request.POST.get('s',0))
        duka = todo['duka']
        
        br = [duka.id]

       

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst = toaCash.objects.filter(Interprise__in=br,tarehe__gte=tf,kuhamisha=True).exclude(tarehe__gt=tt).annotate(duka=F('Interprise'),akauntiN=F('Akaunt__Akaunt_name'),Aamount=F('Akaunt__Amount'),kiasi=F('Amount'),dukaN=F('Interprise__name'),Na=F('by'),matumiziN=F('matumizi__matumizi__matumizi'),expenses=F('matumizi__matumizi'),bill_code=F('bill__code'),f_name=F('by__user__user__first_name'),l_name=F('by__user__user__last_name')).order_by('id')
        itms = wekaCash.objects.filter(Interprise__in=br,tarehe__gte=tf,kuhamisha=True).exclude(tarehe__gt=tt).annotate(duka=F('Interprise'),akauntiN=F('Akaunt__Akaunt_name'),Aamount=F('Akaunt__Amount'),kiasi=F('Amount'),Na=F('by'),serv=F('invo__service'),f_name=F('by__user__user__first_name'),invo_code=F('invo__code'),l_name=F('by__user__user__last_name')).order_by('id')
        data = {
          'data':list(lst.values()),
          'itms':list(itms.values()),
          
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'itms':[]

      }
      return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request))

# STOCK STATE & TRENDS ................................................//
@login_required(login_url='login')
def StockStateR(request):
  todo = todoFunct(request)
  if not todo['duka'].Interprise:
      return redirect('/userdash')
  else:   
     return render(request,'riportStockState.html',todo)  

@login_required(login_url='login')
def StockStateData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 
        duka = todo['duka']
        br = [duka.id]
        svd = int(request.POST.get('svd',0))
        cheo = todo['cheo']

        if svd > 0:
          
          svdState = savedStockState.objects.get(pk=svd,By__user=cheo.user,By__Allow=True)

          lst = ItemsState.objects.filter(state=svdState).annotate(duka=F('sbidhaa__Interprise'),namba=F('sbidhaa__bidhaa__namba'),Bei_kuuza=F('sbidhaa__Bei_kuuza'),bidhaaN=F('sbidhaa__bidhaa__bidhaa_jina'),kipimo=F('sbidhaa__bidhaa__vipimo'),service=F('sbidhaa__service'),material=F('sbidhaa__bidhaa__material'),tha=F('sbidhaa__Bei_kununua'),Bei_kununua=F('sbidhaa__Bei_kununua'),idadi=F('sbidhaa__idadi'),uwiano=F('sbidhaa__bidhaa__idadi_jum'),aina=F('sbidhaa__bidhaa__bidhaa_aina'),kundi=F('sbidhaa__bidhaa__bidhaa_aina__mahi'),addId=F('sbidhaa__ongezwa'),addCode=F('sbidhaa__ongezwa__code'),puId=F('sbidhaa__manunuzi__manunuzi'),rudi=F('sbidhaa__manunuzi__rudi'),puCode=F('sbidhaa__manunuzi__manunuzi__code'),TransId=F('sbidhaa__uhamisho__receive'),TransCode=F('sbidhaa__uhamisho__receive__transfer__code'),uhamisho_id=F('sbidhaa__uhamisho'),produced_id=F('sbidhaa__produced'),manunuzi_id=F('sbidhaa__manunuzi'),ProdId=F('sbidhaa__produced__production'),ProdCode=F('sbidhaa__produced__production__code'),ongezwa_id=F('sbidhaa__ongezwa'),initPu=F('sbidhaa__manunuzi__idadi'),initPuDate=F('sbidhaa__manunuzi__manunuzi__tarehe'),initAddedDate=F('sbidhaa__ongezwa__date'),initTr=F('sbidhaa__uhamisho__qty'),initTrDate=F('sbidhaa__uhamisho__receive__transfer__tarehe'),initPro=F('sbidhaa__produced__qty'),initProDate=F('sbidhaa__produced__production__date'),sale=F('sbidhaa__Bei_kuuza')).order_by('-pk')
          
          sale = mauzoList.objects.filter(mauzo__tarehe__gt=svdState.date,mauzo__order=False).annotate(duka=F('produ__Interprise'),service=F('produ__service'),material=F('produ__bidhaa__material'),uwiano=F('produ__bidhaa__idadi_jum'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('produ__uhamisho'),produced_id=F('produ__produced'),tha=F('produ__Bei_kununua'),sale=F('produ__Bei_kuuza'),manunuzi_id=F('produ__manunuzi'),ongezwa_id=F('produ__ongezwa'))
      
          transfer = transferList.objects.filter(kwenda__receive__transfer__tarehe__gt=svdState.date).annotate(duka=F('toka__Interprise'),service=F('toka__service'),qty=F('kwenda__qty'),material=F('toka__bidhaa__material'),uwiano=F('toka__bidhaa__idadi_jum'),aina=F('toka__bidhaa__bidhaa_aina'),tha=F('toka__Bei_kununua'),sale=F('toka__Bei_kuuza'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('toka__uhamisho'),produced_id=F('toka__produced'),manunuzi_id=F('toka__manunuzi'),ongezwa_id=F('toka__ongezwa'))
        
          adjst = productChangeRecord.objects.filter(adjst__date__gt=svdState.date).annotate(duka=F('prod__Interprise'),uhamisho_id=F('prod__uhamisho'),produced_id=F('prod__produced'),manunuzi_id=F('prod__manunuzi'),ongezwa_id=F('prod__ongezwa'),sale=F('prod__Bei_kuuza'),
          mfg=F('adjst__production'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),waste=F('adjst__potea'),damage=F('adjst__haribika'),Ongeza=F('adjst__Ongezwa'),register=F('adjst__registered'),tha=F('prod__Bei_kununua'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),
          service=F('prod__service'),material=F('prod__bidhaa__material'),uwiano=F('prod__bidhaa__idadi_jum'))
        
          pay = SaveAkauntState.objects.filter(state=svdState).annotate(duka=F('sakaunt__Interprise'),Akaunt_name=F('sakaunt__Akaunt_name'),Amount=F('kiasi'),onesha=F('sakaunt__onesha'))

          data = {
            'svd':svd,
            'svdDate':svdState.date,
            'svdDesc':svdState.maelezo,
            'data':list(lst.values()),
            'mauzo':list(sale.values()),
            'adjst':list(adjst.values()),
            'transfer':list(transfer.values()),
            'svdData':[],
            'AllSavd':[],
            'pay':list(pay.values()),
            'success':True
          }
      
          return JsonResponse(data)  
        else:
            allSaved = savedStockState.objects.filter(By__user=cheo.user,Interprise__owner=duka.owner).annotate(duka=F('Interprise'))
            svdDt1=allSaved.filter(Interprise=duka)

            svdId1 = 0
            if svdDt1.exists():
              svdId1 = svdDt1.last().id
            svdD = [{
                'duka':duka.id,
                'svd':svdId1
            }] 

            for b in todo['matawi']:
              br.append(b.Interprise.id)
              svdId = 0
              svdDt=savedStockState.objects.filter(By__user=b.user,Interprise=b.Interprise)
              if svdDt.exists():
                svdId = svdDt.last().id
              svdD.append({
                'duka':b.Interprise.id,
                'svd':svdId
              })


            lst = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Interprise__in=br).exclude(manunuzi__manunuzi__full_returned=True).annotate(duka=F('Interprise'),namba=F('bidhaa__namba'),bidhaaN=F('bidhaa__bidhaa_jina'),kipimo=F('bidhaa__vipimo'),material=F('bidhaa__material'),tha=F('Bei_kununua'),uwiano=F('bidhaa__idadi_jum'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),addId=F('ongezwa'),addCode=F('ongezwa__code'),puId=F('manunuzi__manunuzi'),rudi=F('manunuzi__rudi'),puCode=F('manunuzi__manunuzi__code'),TransId=F('uhamisho__receive'),TransCode=F('uhamisho__receive__transfer__code'),ProdId=F('produced__production'),ProdCode=F('produced__production__code'),initPu=F('manunuzi__idadi'),initPuDate=F('manunuzi__manunuzi__tarehe'),initAddedDate=F('ongezwa__date'),initTr=F('uhamisho__qty'),initTrDate=F('uhamisho__receive__transfer__tarehe'),initPro=F('produced__qty'),initProDate=F('produced__production__date'),sale=F('Bei_kuuza')).order_by('-pk')
            sale = mauzoList.objects.filter(Q(produ__inapacha=False)|Q(produ__idadi__gt=0),produ__Interprise__in=br,mauzo__service=False).annotate(duka=F('produ__Interprise'),service=F('produ__service'),material=F('produ__bidhaa__material'),uwiano=F('produ__bidhaa__idadi_jum'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('produ__uhamisho'),produced_id=F('produ__produced'),tha=F('produ__Bei_kununua'),sale=F('produ__Bei_kuuza'),manunuzi_id=F('produ__manunuzi'),ongezwa_id=F('produ__ongezwa'))
        
            transfer = transferList.objects.filter(Q(toka__inapacha=False)|Q(toka__idadi__gt=0),toka__Interprise__in=br).annotate(duka=F('toka__Interprise'),service=F('toka__service'),qty=F('kwenda__qty'),material=F('toka__bidhaa__material'),uwiano=F('toka__bidhaa__idadi_jum'),aina=F('toka__bidhaa__bidhaa_aina'),tha=F('toka__Bei_kununua'),sale=F('toka__Bei_kuuza'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('toka__uhamisho'),produced_id=F('toka__produced'),manunuzi_id=F('toka__manunuzi'),ongezwa_id=F('toka__ongezwa'))
          
            adjst = productChangeRecord.objects.filter(Q(prod__inapacha=False)|Q(prod__idadi__gt=0),prod__Interprise__in=br).annotate(duka=F('prod__Interprise'),uhamisho_id=F('prod__uhamisho'),produced_id=F('prod__produced'),manunuzi_id=F('prod__manunuzi'),ongezwa_id=F('prod__ongezwa'),sale=F('prod__Bei_kuuza'),
            mfg=F('adjst__production'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),waste=F('adjst__potea'),damage=F('adjst__haribika'),Ongeza=F('adjst__Ongezwa'),register=F('adjst__registered'),tha=F('prod__Bei_kununua'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),
            service=F('prod__service'),material=F('prod__bidhaa__material'),uwiano=F('prod__bidhaa__idadi_jum'))
          
            pay = PaymentAkaunts.objects.filter(Interprise__in=br).annotate(duka=F('Interprise'))

            data = {
              'svd':svd,
              'data':list(lst.values()),
              'mauzo':list(sale.values()),
              'adjst':list(adjst.values()),
              'transfer':list(transfer.values()),
              'svdDate':'',
              'svdDesc':'',
              'AllSavd':list(allSaved.order_by('-pk').values()),
              'svdData':svdD,
              'pay':list(pay.values()),
              'success':True
            }
        
            return JsonResponse(data)  


    except:
      data = {
        'success':False,
        'data':[],
        'pay':[],
        'mauzo':[]

      }
      return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def SaveInventory(request):
    if request.method == 'POST':
      try:  
          shop = int(request.POST.get('duka'))
          desc = request.POST.get('stateDesc')
          todo = todoFunct(request)
          cheo = todo['cheo']
 
          duka = todo['duka']

          ShopState = InterprisePermissions.objects.get(user=cheo.user,Interprise=shop,Interprise__owner=duka.owner,Allow=True)
          state = savedStockState()
          state.Interprise = ShopState.Interprise
          state.maelezo = desc
          state.date = datetime.datetime.now(tz=timezone.utc)
          state.By = ShopState
          state.save()

          items = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Interprise=ShopState.Interprise.id) 
          color = produ_colored.objects.filter(Q(bidhaa__idadi__gt=0)|Q(bidhaa__inapacha=False),color__colored=True,Interprise=ShopState.Interprise.id)
          sizen = produ_size.objects.filter(Q(bidhaa__idadi__gt=0)|Q(bidhaa__inapacha=False),Interprise=ShopState.Interprise.id)

          akaunts = PaymentAkaunts.objects.filter(Interprise=ShopState.Interprise.id)

          # SAVE PAY ACCOUNTS .............................//
          for p in akaunts:
            saveA = SaveAkauntState()
            saveA.sakaunt = p
            saveA.kiasi = float(p.Amount)
            saveA.state = state
            saveA.save()

          # SAVE ITEMS .............................//
          for it in items:
            saveIt = ItemsState()
            saveIt.sbidhaa = it
            saveIt.sidadi = float(it.idadi)
            
            saveIt.state = state
            saveIt.save()

          # SAVE COLOR .............................//
          for c in color:
            saveC = ColorState()
            saveC.scolor = c
            saveC.sidadi = float(c.idadi)
            saveC.state = state
            saveC.save()

          # SAVE COLOR .............................//
          for s in sizen:
            saveS = SizeState()
            saveS.ssize = s
            saveS.sidadi = float(s.idadi)
            saveS.state = state
            saveS.save()

            svdData = [{
              'By_id': state.By.id,
              'Interprise_id': state.Interprise.id,
              'date':state.date,
              'duka': state.Interprise.id,
              'id': state.id,
              'maelezo': state.maelezo
            }]


          data = {
                'success':True,
                'svd':svdData,
                'msg_swa':'Hali ya sasa ya Hesabu imehifadhiwa kikamilifu',
                'msg_eng':'The inventory state Saved successfully '
          }


          return JsonResponse(data)

      except:
              data = {
                'success':False,
                'msg_swa':'Kitendo Hakikufanyika kutokana na Hitilafu',
                'msg_eng':'The action was not sucessffully Please Try again correctly'

              }
              return JsonResponse(data)
    else:
          return render(request,'pagenotFound.html',todoFunct(request))  

# @login_required(login_url='login')
def PrintStockState(request):
    try:
        todo = {}

       
        svd=request.GET.get('svd',0)
        shop = request.GET.get('entp',0)
        INV = request.GET.get('inv',0),
        react = int(request.GET.get('r',0))


        rP = ForPrintingPupose.objects.filter(pk=react,expire__gte=datetime.datetime.now(tz=timezone.utc))
        if rP.exists():
                todo = {
                      'duka':rP.last().duka,
                      'useri':rP.last().user,
                      'pent':Interprise.objects.get(owner = rP.last().user,Interprise=False),
                      'cheo':InterprisePermissions.objects.get(user = rP.last().user,Interprise = rP.last().duka)
                }
        else:    
              todo =todoFunct(request)


        duka = todo['duka']
        cheo = todo['cheo']


        permit = InterprisePermissions.objects.get(Q(Allow=True)|Q(Interprise__owner=cheo.user),user=cheo.user,Interprise=shop)

        duka = permit.Interprise      

        langSel = int(request.GET.get('lang',0))

        todo.update({
          'langSel':langSel,
          'svd':svd,
          'shop':shop,
          'duka':duka,
          'INVENTORY':INV,
          'rct':react
        })
        if not todo['duka'].Interprise:
            return redirect('/userdash')
        else: 
            return render(request,'printInventory.html',todo) 
    except:
        todo = {
          'duka':{'name':'No Shop Found'},
           'shop':0

        }

        return render(request,'printInventory.html',todo) 

@login_required(login_url='login')
def RemoveSaved(request):
  if request.method == 'POST':
    try: 
      svd = request.POST.get('id',0)
      todo = todoFunct(request)
      cheo = todo['cheo']

      svdState = savedStockState.objects.get(pk=svd,By__user=cheo.user)
      
      savedStockState.objects.filter(pk=svdState.id).delete()
      
      data={
         'success':True,
         'msg_swa':'Hali ya Hesabu Imeondolewa Kikamilifu',
        'msg_eng':'Inventory State was Removed succefully '
      }

      return JsonResponse(data)


    except:
      data = {
        'success':False,
         'msg_swa':'Kitendo Hakikufanyika kutokana na Hitilafu',
        'msg_eng':'The action was not sucessffully Please Try again correctly'

      }
      return JsonResponse(data)  
  else:
     return render(request,'pagenotFound.html',todoFunct(request)) 

# @login_required(login_url='login')
def PrintItems(request):
    if request.method == 'GET':
      try:
          save = int(request.GET.get('svd',0))
          shop = int(request.GET.get('shop',0))
          
          react = int(request.GET.get('mob',0))

          print(react)

          todo = {}   
          rP = ForPrintingPupose.objects.filter(pk=react,expire__gte=datetime.datetime.now(tz=timezone.utc))
          if rP.exists():
                  todo = {
                        'duka':rP.last().duka,
                        'useri':rP.last().user,
                        'pent':Interprise.objects.get(owner = rP.last().user,Interprise=False),
                        'cheo':InterprisePermissions.objects.get(user = rP.last().user,Interprise = rP.last().duka)
                  }
          else:    
                todo =todoFunct(request)       


          duka = todo['duka']
          cheo = todo['cheo']

          permit = InterprisePermissions.objects.get(Q(Allow=True)|Q(Interprise__owner=cheo.user),user=cheo.user,Interprise=shop)

          if save>0:
            svdState = savedStockState.objects.get(pk=save,By__user=cheo.user,By__Allow=True)

            lst = ItemsState.objects.filter(state=svdState).annotate(duka=F('sbidhaa__Interprise'),namba=F('sbidhaa__bidhaa__namba'),Bei_kuuza=F('sbidhaa__Bei_kuuza'),bidhaaN=F('sbidhaa__bidhaa__bidhaa_jina'),kipimo=F('sbidhaa__bidhaa__vipimo'),service=F('sbidhaa__service'),material=F('sbidhaa__bidhaa__material'),tha=F('sbidhaa__Bei_kununua'),Bei_kununua=F('sbidhaa__Bei_kununua'),idadi=F('sbidhaa__idadi'),uwiano=F('sbidhaa__bidhaa__idadi_jum'),aina=F('sbidhaa__bidhaa__bidhaa_aina'),kundi=F('sbidhaa__bidhaa__bidhaa_aina__mahi'),addId=F('sbidhaa__ongezwa'),addCode=F('sbidhaa__ongezwa__code'),puId=F('sbidhaa__manunuzi__manunuzi'),rudi=F('sbidhaa__manunuzi__rudi'),puCode=F('sbidhaa__manunuzi__manunuzi__code'),TransId=F('sbidhaa__uhamisho__receive'),TransCode=F('sbidhaa__uhamisho__receive__transfer__code'),uhamisho_id=F('sbidhaa__uhamisho'),produced_id=F('sbidhaa__produced'),manunuzi_id=F('sbidhaa__manunuzi'),ProdId=F('sbidhaa__produced__production'),ProdCode=F('sbidhaa__produced__production__code'),ongezwa_id=F('sbidhaa__ongezwa'),initPu=F('sbidhaa__manunuzi__idadi'),initPuDate=F('sbidhaa__manunuzi__manunuzi__tarehe'),initAddedDate=F('sbidhaa__ongezwa__date'),initTr=F('sbidhaa__uhamisho__qty'),initTrDate=F('sbidhaa__uhamisho__receive__transfer__tarehe'),initPro=F('sbidhaa__produced__qty'),initProDate=F('sbidhaa__produced__production__date'),sale=F('sbidhaa__Bei_kuuza')).order_by('-pk')
            sto_color = ColorState.objects.filter(state=svdState).annotate(color_name=F('scolor__color__color_name'),idadi=F('scolor__idadi'),color_id=F('scolor__color'),material=F('scolor__bidhaa__bidhaa__material'),service=F('scolor__bidhaa__service'),bidhaa_id=F('scolor__bidhaa'),bidhaa_a=F('scolor__bidhaa__bidhaa'),qty=F('sidadi'),color_code=F('scolor__color__color_code'))
            sto_size = SizeState.objects.filter(state=svdState).annotate(size_name=F('ssize__sized__size'),size_id=F('ssize__sized'),color_id=F('ssize__sized__color'),idadi=F('ssize__idadi'),material=F('ssize__bidhaa__bidhaa__material'),service=F('ssize__bidhaa__service'),bidhaa_id=F('ssize__bidhaa'),bidhaa_a=F('ssize__bidhaa__bidhaa'),qty=F('sidadi'))
            pay = SaveAkauntState.objects.filter(state=svdState).annotate(duka=F('sakaunt__Interprise'),Akaunt_name=F('sakaunt__Akaunt_name'),Amount=F('kiasi'),onesha=F('sakaunt__onesha'))

            data = {
                'data':list(lst.values()),
              
                'adjst':[],
              

                'puC':[],
                'puS':[],

                'prodC':[],
                'prodS':[],

                'svdDate':svdState.date,
                'svdDesc':svdState.maelezo,

                 'SVD':1,

                'adjstC':[],
                'adjstS':[],

                'PRODUXN':duka.produxn,
                'SERVICE':duka.service,
                'SALES':duka.sales,


                'StoC':list(sto_color.values()),
                'StoS':list(sto_size.values()),

                # 'saleC':list(sale_color.values()),
                # 'saleS':list(sale_size.values()),

                'pay':list(pay.values()),
                'success':True
            }
            return JsonResponse(data)
          else:

            duka = permit.Interprise

            lst = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Interprise=duka).exclude(manunuzi__manunuzi__full_returned=True).annotate(duka=F('Interprise'),bidhaaN=F('bidhaa__bidhaa_jina'),namba=F('bidhaa__namba'),kipimo=F('bidhaa__vipimo'),material=F('bidhaa__material'),tha=F('Bei_kununua'),uwiano=F('bidhaa__idadi_jum'),aina=F('bidhaa__bidhaa_aina'),kundi=F('bidhaa__bidhaa_aina__mahi'),addId=F('ongezwa'),addCode=F('ongezwa__code'),puId=F('manunuzi__manunuzi'),rudi=F('manunuzi__rudi'),puCode=F('manunuzi__manunuzi__code'),TransId=F('uhamisho__receive'),TransCode=F('uhamisho__receive__transfer__code'),ProdId=F('produced__production'),ProdCode=F('produced__production__code'),initPu=F('manunuzi__idadi'),initPuDate=F('manunuzi__manunuzi__tarehe'),initAddedDate=F('ongezwa__date'),initTr=F('uhamisho__qty'),initTrDate=F('uhamisho__receive__transfer__tarehe'),initPro=F('produced__qty'),initProDate=F('produced__production__date'),sale=F('Bei_kuuza')).order_by('-pk')
            # sale = mauzoList.objects.filter(Q(produ__inapacha=False)|Q(produ__idadi__gt=0),produ__Interprise=duka,mauzo__service=False).annotate(duka=F('produ__Interprise'),service=F('produ__service'),material=F('produ__bidhaa__material'),uwiano=F('produ__bidhaa__idadi_jum'),bidhaa_id=F('produ__bidhaa'),aina=F('produ__bidhaa__bidhaa_aina'),kundi=F('produ__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('produ__uhamisho'),produced_id=F('produ__produced'),tha=F('produ__Bei_kununua'),sale=F('produ__Bei_kuuza'),manunuzi_id=F('produ__manunuzi'),ongezwa_id=F('produ__ongezwa'))
        
            # transfer = transferList.objects.filter(Q(toka__inapacha=False)|Q(toka__idadi__gt=0),toka__Interprise=duka).annotate(duka=F('toka__Interprise'),service=F('toka__service'),qty=F('kwenda__qty'),material=F('toka__bidhaa__material'),uwiano=F('toka__bidhaa__idadi_jum'),aina=F('toka__bidhaa__bidhaa_aina'),tha=F('toka__Bei_kununua'),sale=F('toka__Bei_kuuza'),kundi=F('toka__bidhaa__bidhaa_aina__mahi'),uhamisho_id=F('toka__uhamisho'),produced_id=F('toka__produced'),manunuzi_id=F('toka__manunuzi'),ongezwa_id=F('toka__ongezwa'))
          
            adjst = productChangeRecord.objects.filter(Q(prod__inapacha=False)|Q(prod__idadi__gt=0),prod__Interprise=duka).annotate(duka=F('prod__Interprise'),uhamisho_id=F('prod__uhamisho'),produced_id=F('prod__produced'),manunuzi_id=F('prod__manunuzi'),ongezwa_id=F('prod__ongezwa'),sale=F('prod__Bei_kuuza'),
            mfg=F('adjst__production'),tumika=F('adjst__tumika'),expire=F('adjst__expire'),waste=F('adjst__potea'),damage=F('adjst__haribika'),Ongeza=F('adjst__Ongezwa'),register=F('adjst__registered'),tha=F('prod__Bei_kununua'),bidhaa_id=F('prod__bidhaa'),aina=F('prod__bidhaa__bidhaa_aina'),kundi=F('prod__bidhaa__bidhaa_aina__mahi'),
            service=F('prod__service'),material=F('prod__bidhaa__material'),uwiano=F('prod__bidhaa__idadi_jum'))
          
            pay = PaymentAkaunts.objects.filter(Interprise=duka).annotate(duka=F('Interprise'))

            # sale_color = sales_color.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate(duka=F('bidhaa__Interprise'))
            # sale_size = sales_size.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate(duka=F('bidhaa__Interprise'))

            adjC = ColorChange.objects.filter(Q(change__prod__inapacha=False)|Q(change__prod__idadi__gt=0),change__prod__Interprise=duka,color__bidhaa__ongezwa__Ongezwa=True).annotate(color_name=F('color__color__color_name'),color_code=F('color__color__color_code'),add=F('color__bidhaa__ongezwa__Ongezwa'),reg=F('color__bidhaa__ongezwa__registered'),uzalishaji=F('change__adjst__production'),bidhaa_id=F('color__bidhaa'),tumika=F('change__adjst__tumika'),Ongeza=F('change__adjst__Ongezwa'),bidhaa_a=F('color__bidhaa__bidhaa'))
            adjS = SizeChange.objects.filter(Q(color__change__prod__inapacha=False)|Q(color__change__prod__idadi__gt=0),color__change__prod__Interprise=duka).annotate(size_name=F('size__sized__size'),uzalishaji=F('color__change__adjst__production'),add=F('color__color__bidhaa__ongezwa__Ongezwa'),reg=F('color__color__bidhaa__ongezwa__registered'),bidhaa_id=F('color__color__bidhaa'),tumika=F('color__change__adjst__tumika'),Ongeza=F('color__change__adjst__Ongezwa'),bidhaa_a=F('color__color__bidhaa__bidhaa'))

            prodcolor = production_color.objects.filter(Q(color__bidhaa__inapacha=False)|Q(color__bidhaa__idadi__gt=0),color__bidhaa__Interprise=duka).annotate(color_name=F('color__color__color_name'),bidhaa_id=F('color__bidhaa'),bidhaa_a=F('color__bidhaa__bidhaa'),color_code=F('color__color__color_code')).values()
            prodSize = production_size.objects.filter(Q(size__bidhaa__inapacha=False)|Q(size__bidhaa__idadi__gt=0),size__bidhaa__Interprise=duka).annotate(size_name=F('size__sized__size'),bidhaa_id=F('size__bidhaa')).values()
          
            pucolor = purchased_color.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate(color_name=F('color__color__color_name'),bidhaa_a=F('bidhaa__bidhaa'),color_code=F('color__color__color_code')).values()
            puSize = purchased_size.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate(size_name=F('size__sized__size'),bidhaa_a=F('bidhaa__bidhaa')).values()

            # recvcolor = produ_colored.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate().values()
            # recvSize = produ_size.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate().values()

            sto_color = produ_colored.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate(color_name=F('color__color_name'),material=F('bidhaa__bidhaa__material'),service=F('bidhaa__service'),bidhaa_a=F('bidhaa__bidhaa'),qty=F('received__qty'),color_code=F('color__color_code'))
            sto_size = produ_size.objects.filter(Q(bidhaa__inapacha=False)|Q(bidhaa__idadi__gt=0),bidhaa__Interprise=duka).annotate(size_name=F('sized__size'),material=F('bidhaa__bidhaa__material'),color_id=F('sized__color'),service=F('bidhaa__service'),bidhaa_a=F('bidhaa__bidhaa'),qty=F('received__qty'))
        

          
            data = {
              'data':list(lst.values()),
            
              'adjst':list(adjst.values()),
            

              'puC':list(pucolor),
              'puS':list(puSize),

              'prodC':list(prodcolor),
              'prodS':list(prodSize),

              'svdDate':[],
              'svdDesc':[],

              'adjstC':list(adjC.values()),
              'adjstS':list(adjS.values()),

              'SVD':0,

              'PRODUXN':duka.produxn,
              'SERVICE':duka.service,
              'SALES':duka.sales,


              'StoC':list(sto_color.values()),
              'StoS':list(sto_size.values()),

              # 'saleC':list(sale_color.values()),
              # 'saleS':list(sale_size.values()),

              'pay':list(pay.values()),
              'success':True
            }
              
            return JsonResponse(data)

      except:
        data = {
          'success':False,
          'data':[],
          'pay':[],
          'mauzo':[],
          'StoC':[],
          'StoS':[],

        }
        return JsonResponse(data)
    else:
      return render(request,'pagenotFound.html',todoFunct(request))   
# EXPIRED ITEMS REPORT................................................//

@login_required(login_url='login')
def VistorsCounter(request):
  todo = todoFunct(request)
  duka = todo['duka']
  if not duka.Interprise:
      return redirect('/userdash')
  else:   
        return render(request,'riportVistors.html',todo)  

@login_required(login_url='login')
def VistorsData(request):
  if request.method == 'POST':
    try:
        todo = todoFunct(request) 

        tf = request.POST.get('tf')
        tt = request.POST.get('tt')
        serv = int(request.POST.get('s',0))
        duka = todo['duka']
        
        br = [duka.id]

       

        for b in todo['matawi']:
          br.append(b.Interprise.id)

        lst=InterpriseVisotrs.objects.filter(Interprise__in=br,date__gte=tf).exclude(date__gt=tt).annotate(duka=F('Interprise'),tarehe=F('date'),Bidhaa=F('ItemPage__bidhaa__bidhaa_jina'),Kampuni=F('BrandPage__kampuni_jina'),Aina=F('CategoryPage__aina'),Kundi=F('GroupPage__mahitaji'))
        


        data = {
          'data':list(lst.values()),
         
          'success':True
        }
    
        return JsonResponse(data)  
    except:
      data = {
        'success':False,
        'data':[],
    

      }
      return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def homePageData(request):
    if request.method == 'POST':
      try:
          todo = todoFunct(request) 

          td = request.POST.get('td')
          tdd = request.POST.get('tdd')
          l7 = request.POST.get('last7')
          duka = todo['duka']
          cheo = todo['cheo']
          
          vistors=InterpriseVisotrs.objects.filter(Interprise=duka.id,date__gte=tdd).annotate(tarehe=F('date'),Bidhaa=F('ItemPage__bidhaa__bidhaa_jina'),Kampuni=F('BrandPage__kampuni_jina'),Aina=F('CategoryPage__aina'),Kundi=F('GroupPage__mahitaji'))
          adj =  stokAdjustment.objects.filter(Interprise=duka,date__gte=td)
          transfer = receive.objects.filter(Q(Interprise=duka.id)|Q(transfer__Interprise=duka.id),transfer__tarehe__gte=td).annotate(From=F('Interprise'),to=F('transfer__Interprise'))
          pay = PaymentAkaunts.objects.filter(Q(onesha=True)|Q(Interprise__owner=cheo.user.id),Interprise=duka.id)
          sale = mauzoni.objects.filter(Q(tarehe__gte=td)|Q(amount__gt=F('ilolipwa'))|Q(order=True)|Q(service=True,receved=False),Interprise=duka.id,full_returned=False)
          expend=toaCash.objects.filter(Q(kuhamisha=False)|Q(kuhamishaNje=True),Q(Akaunt__onesha=True)|Q(Akaunt__Interprise__owner=cheo.user.id),Interprise=duka.id,tarehe__gte=l7).order_by('id')
          income = wekaCash.objects.filter(Q(kuhamisha=False)|Q(kuhamishaNje=True),Q(Akaunt__onesha=True)|Q(Akaunt__Interprise__owner=cheo.user.id),Interprise=duka.id,tarehe__gte=l7).order_by('id')
          items = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Interprise=duka.id).annotate(material=F('bidhaa__material'),name=F('bidhaa__bidhaa_jina'))
          purchase = mauzoni.objects.filter(Q(receved=False)|Q(bill_kwa__date=date.today()),user_customer__enteprise=duka.id)

          data = {
            'success':True,
            'itms':list(items.values()),
            'adj':list(adj.values()),
            'pay':list(pay.values()),
            'transfer':list(transfer.values()),
            'sale':list(sale.values()),
            'expend':list(expend.values()),
            'income':list(income.values()),
            'vistors':list(vistors.values()),
            'duka':duka.id,
            'service':int(duka.service),
            'prodxn':int(duka.produxn),
            'sales':int(duka.sales),
            'pu':list(purchase.values())
          }

          return JsonResponse(data)


      except:
        data = {
          'success':False,
          'data':[],
      

        }
        return JsonResponse(data)
    else:
      return render(request,'pagenotFound.html',todoFunct(request))            