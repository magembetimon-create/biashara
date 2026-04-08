# from asyncio.windows_events import NULL
# from email.policy import default
 
from genericpath import exists
from ipaddress import ip_address
from typing import Dict
from django.db import reset_queries
from django.db.models.fields import NullBooleanField
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
# from graphql import visit
from management.models import Notifications,bidhaa,VistorsSavedVendor,DescImages,VistorsSavedItems,ainaBibi,Zones,ainaMama,Wilaya,Kata,Mikoa,Mitaa,marketBanner,marketPlace,mahitaji, UserExtend,EmployeeAttachments,InterpriseVisotrs, makampuni,savedStockState,Kanda,Workers,sales_color,sales_size,AnswerTo,stockAdjst_confirm,question_to,chatTo,chats,Interprise,deliveryAgents,bei_za_bidhaa, color_produ,mauzoList,order_from,bidhaa_sifa, key_sifa,produ_colored,produ_size,picha_bidhaa,bidhaa_stoku,picha_bidhaa,bidhaa_aina, receive, stokAdjustment,user_Interprise,HudumaNyingine,Huduma_za_kifedha,businessReg,manunuzi,Interprise_contacts,InterprisePermissions,PaymentAkaunts, mauzoni,staff_akaunt_permissions, wasambazaji
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
from django.core.files.storage import default_storage # For GCS Storage
from django.conf import settings

import time  
import pytz
import datetime
import re
import socket
import json
from django.db.models import Sum
import random 

from accaunts.todos import Todos

from django.http import FileResponse

def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()

def autoComlleteSearch(request):
  if request.method == 'GET':
    valu = str(request.GET.get('valued',''))
    shop = int(request.GET.get('forShop',0))

    itms = bidhaa_stoku.objects.all()
    if shop > 0:
          itms = itms.filter(Interprise=shop)
   

    itms = itms.filter(
      Q(bidhaa__bidhaa_aina__mahi__aina__jina__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__name__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__aina__jina__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__aina__name__icontains=valu) |
      Q(bidhaa__bidhaa_jina__icontains=valu)|Q(bidhaa__maelezo__icontains=valu)|Q(bidhaa__bidhaa_aina__aina__icontains=valu)|Q(bidhaa__bidhaa_aina__mahi__mahitaji__icontains=valu)|Q(bidhaa__kampuni__kampuni_jina__icontains=valu)|Q(Interprise__Intp_code__icontains=valu),Bei_kuuza__gt=0,inapacha=False,showToVistors=True,Interprise__sales=True,Interprise__marketing__gt=0,Interprise__bill_tobePaid__gte=date.today()).annotate(
     
      itm_name =  F('bidhaa__bidhaa_jina'),
      categ_name = F('bidhaa__bidhaa_aina__aina'),
      itm_desc = F('bidhaa__maelezo'),
      group_name = F('bidhaa__bidhaa_aina__mahi__mahitaji'),
      brand = F('bidhaa__kampuni__kampuni_jina'),
      Mama_swa = F('bidhaa__bidhaa_aina__mahi__aina__jina'),
      Mama_eng = F('bidhaa__bidhaa_aina__mahi__aina__name'),
      Bibi_swa = F('bidhaa__bidhaa_aina__mahi__aina__aina__jina'),
      Bibi_eng = F('bidhaa__bidhaa_aina__mahi__aina__aina__name'),
      duka = F('Interprise__name'),
      code = F('Interprise__Intp_code')

    ).order_by('pk')[0:15]
    
    # print(itms.exists())
        
    data ={
      'list':list(itms.values())

    }

    return JsonResponse(data)

  else:
  
    return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def saveVendor(request):
  if request.method == "POST":
    try:
      desc = request.POST.get('desc')
      shopI = request.POST.get('shop')
      todo = todoFunct(request)
      useri = todo['useri']

      
      shop =  Interprise.objects.get(pk=shopI)  
      saveV = VistorsSavedVendor()
      VendorSaved = VistorsSavedVendor.objects.filter(user=useri.id,vendor=shop.id)
      if VendorSaved.exists():
        saveV = VendorSaved.last()

      saveV.user = useri   
      saveV.vendor = shop   
      saveV.desk = desc   
      saveV.save()

      data = {
        'success':True,
        'msg_swa':'Mfanyabiashara ameongezwa kikamilifu',
        'msg_eng':'Vendor added successfully'
      }

      return JsonResponse(data)

    except:
      data = {
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena baadaye',
        'msg_eng':'The action was not successfully please try again correctly'
      }  

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def itmsWithPlace(request):
    ds = int(request.GET.get('d',0))
    rg = int(request.GET.get('r',0))
    cr = int(request.GET.get('c',0))
    gr = int(request.GET.get('gr',0))
    grp = int(request.GET.get('grp',0))

    todo = todoFunct(request)

    maduka = bidhaa_stoku.objects.filter(Q(Interprise__mtaa__kata__wilaya=ds,Interprise__marketing=2000)|Q(Interprise__mtaa__kata__wilaya__mkoa=rg,Interprise__marketing=5000)|Q(Interprise__mtaa__kata__wilaya__mkoa__kanda__nchi=cr,Interprise__marketing=10000),Interprise__bill_tobePaid__gte=date.today()).annotate(hadi=F('Interprise__bill_tobePaid'))
    produ = maduka.filter(Q(idadi__gt=0)|Q(produced__notsure=True),showToVistors=True,Bei_kuuza__gt=0)


    bibi = produ.distinct('bidhaa__bidhaa_aina__mahi__aina__aina')
    mama = produ.distinct('bidhaa__bidhaa_aina__mahi__aina')
      
    if gr > 0:
      produ = produ.filter(bidhaa__bidhaa_aina__mahi__aina=gr)
      if produ.exists():
        ainMama = ainaMama.objects.get(pk=gr)
        todo.update({
          'the_group':ainMama,
          'the_Pgroup':ainMama.aina
        })

    if grp > 0:
      produ = produ.filter(bidhaa__bidhaa_aina__mahi__aina__aina=grp)
      if produ.exists():
        todo.update({
          'the_Pgroup':ainaBibi.objects.get(pk=grp)
        })        

    p=Paginator(produ.order_by('-hadi'),15)

    page_num =request.GET.get('page',1)
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages    

    
    num = int(15/len(page))    
    
    itms = []
    # for d in page:
      
      # produ = produ.distinct('bidhaa')[0:num] 
  
    for p in page:
      img_url = None
      img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
      if img.exists():
        img_url = img.last().picha.picha
      dt={
        'id':p.id,
        'name':p.bidhaa.bidhaa_jina,
        'shop':p.Interprise,
        'img':img_url,
        'bei':p.Bei_kuuza,
        


      }
      # if img.exists():  
      itms.append(dt)

    todo.update({
      'bidhaa':itms,
      'wilaya': ds > 0,
      'mkoa': rg > 0,
      'nchi': cr > 0,
      'c':cr,
      'r':rg,
      'd':ds,
      'p_num':page_num,
      'pages':pg_number,
      'page':page,
      'bil_num':num,
      'mama':mama,
      'bibi':bibi,
      'gr':gr,
      'grp':grp
    })      

    return render(request,'ecorm/ItemsPlace.html',todo)

@login_required(login_url='login')
def servedVendors(request):
  todo = todoFunct(request)
  useri = todo['useri']
  rg = int(request.GET.get('r',0))
  ds = int(request.GET.get('d',0))
  gr = int(request.GET.get('gr',0))
  grp = int(request.GET.get('grp',0))

  served = VistorsSavedVendor.objects.filter(user=useri.id,vendor__bill_tobePaid__gte=date.today())
  intps = []

  mikoa = served.distinct('vendor__mtaa__kata__wilaya__mkoa')
  wilaya = served.distinct('vendor__mtaa__kata__wilaya')

  if ds > 0:
    served = served.filter(vendor__mtaa__kata__wilaya = ds)
    todo.update({
      'wilayani':served.last().vendor.mtaa.kata.wilaya,
      'mkoani':served.last().vendor.mtaa.kata.wilaya.mkoa
    })

  if rg > 0:
    served = served.filter(vendor__mtaa__kata__wilaya__mkoa = rg)
    todo.update({
      # 'wilayani':served.last().vendor.mtaa.kata.wilaya,
      'mkoani':served.last().vendor.mtaa.kata.wilaya.mkoa
    })

  if served.exists():
    for s in served:
      intps.append(s.vendor.id)

  mahi = mahitaji.objects.filter(Interprise__in=intps) 

  if gr > 0:
    mahii = mahi.filter(aina=gr) 
    intpGr = []    
    for m in mahii:
      intpGr.append(m.Interprise.id)
    served = served.filter(vendor__in=intpGr)
    mikoa = served.distinct('vendor__mtaa__kata__wilaya__mkoa')
    wilaya = served.distinct('vendor__mtaa__kata__wilaya')
    todo.update({
      'the_group':mahii.last().aina,
      'the_Pgroup':mahii.last().aina.aina,
    })

  if grp > 0:
    mahii = mahi.filter(aina__aina=grp) 
    intpGr = []    
    for m in mahii:
      intpGr.append(m.Interprise.id)
    served = served.filter(vendor__in=intpGr)
    mikoa = served.distinct('vendor__mtaa__kata__wilaya__mkoa')
    wilaya = served.distinct('vendor__mtaa__kata__wilaya')
    todo.update({
      # 'the_group':mahii.last().aina,
      'the_Pgroup':mahii.last().aina.aina,
    })

 


   


  # print(len(intps))
  mama = mahi.distinct('aina')    
  bibi = mahi.distinct('aina__aina')

  p=Paginator(served.order_by('-pk'),15)

  page_num =request.GET.get('page',1)
  try:
        page = p.page(page_num)

  except EmptyPage:
        page= p.page(1)

  pg_number = p.num_pages    


  itms = []

  for p in page:
    lastVist = InterpriseVisotrs.objects.filter(user=useri.id,Interprise=p.vendor.id).last()
    items =  bidhaa.objects.filter(owner=p.vendor.owner.user,change_date__gt=lastVist.date)  
    itms.append({
      'vendor':p,
      'new':len(items)

    })

  itms.sort(key=lambda x: x.get('new'), reverse=True)

  todo.update({
    'vendors':itms,
    'mama':mama,
    'bibi':bibi,
    'mikoa':mikoa,
    'wilaya':wilaya,
    'p_num':page_num,
    'pages':pg_number,
    'page':page,
    'zipo':len(page),
    'd':ds,
    'r':rg,
    'gr':gr,
    'grp':grp
  })   


  return render(request,'ecorm/sevedVendors.html',todo)

@login_required(login_url='login')
def servedItems(request):
  rg = int(request.GET.get('r',0))
  ds = int(request.GET.get('d',0))
  gr = int(request.GET.get('gr',0))
  grp = int(request.GET.get('grp',0))

  todo = todoFunct(request)
  useri = todo['useri']

  produ = VistorsSavedItems.objects.filter(user=useri.id,bidhaa__Interprise__bill_tobePaid__gte=date.today())

  bibi = produ.distinct('bidhaa__bidhaa__bidhaa_aina__mahi__aina__aina')
  mama = produ.distinct('bidhaa__bidhaa__bidhaa_aina__mahi__aina')

  # mkoani = produ.distinct('bidhaa__bidhaa__Interprise__mtaa__kata__wilaya__mkoa')
  # wilayani = produ.distinct('bidhaa__bidhaa__Interprise__mtaa__kata__wilaya')
    
  if gr > 0:
    produ = produ.filter(bidhaa__bidhaa__bidhaa_aina__mahi__aina=gr)
    if produ.exists():
      ainMama = ainaMama.objects.get(pk=gr)
      todo.update({
        'the_group':ainMama,
        'the_Pgroup':ainMama.aina
      })

  if grp > 0:
    produ = produ.filter(bidhaa__bidhaa__bidhaa_aina__mahi__aina__aina=grp)
    if produ.exists():
      todo.update({
        'the_Pgroup':ainaBibi.objects.get(pk=grp)
      })        

  p=Paginator(produ.order_by('-pk'),15)

  page_num =request.GET.get('page',1)
  try:
        page = p.page(page_num)

  except EmptyPage:
        page= p.page(1)

  pg_number = p.num_pages    

  
  # num = int(15/len(page))   

  itms = []
  # for d in page:
    
    # produ = produ.distinct('bidhaa')[0:num] 

  for p in page:
    img_url = None
    img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa.bidhaa.id)
    theItem = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),bidhaa=p.bidhaa.bidhaa.id).order_by('idadi')

    if img.exists():
      img_url = img.last().picha.picha.url
    dt={
     
      'itm':theItem.last(),
      'img':img_url,
     
      


    }
    # if img.exists():  
    itms.append(dt)

  todo.update({
    'bidhaa':itms,
    'wilaya': ds > 0,
    'mkoa': rg > 0,
    # 'mkoani':mkoani,
    # 'wilayani':wilayani,

    'r':rg,
    'd':ds,
    'p_num':page_num,
    'pages':pg_number,
    'page':page,
    'zipo':len(page),
    'mama':mama,
    'bibi':bibi,
    'gr':gr,
    'grp':grp
  })      

  return render(request,'ecorm/servedItems.html', todo)

  
@login_required(login_url='login')
def searchpanel(request):
    code = request.GET.get('bc','0')
    valu = request.GET.get('valued','')
    d = int(request.GET.get('d',0))
    r = int(request.GET.get('r',0))
    c = int(request.GET.get('c',0))
    w = int(request.GET.get('w',0))
    s = int(request.GET.get('s',0))


    todo = todoFunct(request)
    duka = todo['duka']
    useri = todo['useri']

    itms = bidhaa_stoku.objects.filter(
      Q(bidhaa__bidhaa_aina__mahi__aina__jina__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__name__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__aina__jina__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__aina__name__icontains=valu) |
      Q(sirio__iexact=code)|Q(bidhaa__bidhaa_jina__icontains=valu)|Q(bidhaa__maelezo__icontains=valu)|Q(bidhaa__bidhaa_aina__aina__icontains=valu)|Q(bidhaa__bidhaa_aina__mahi__mahitaji__icontains=valu)|Q(bidhaa__kampuni__kampuni_jina__icontains=valu))

    if valu ==  '':
      itms =  bidhaa_stoku.objects.filter(sirio__iexact=code)

    itms = itms.filter((Q(idadi__gt=0)|Q(inapacha=False)),showToVistors=True,Bei_kuuza__gt=0,Interprise__sales=True,Interprise__marketing__gt=0,Interprise__bill_tobePaid__gte=date.today())

    # if duka is not None:
    #   itms = itms.exclude(Interprise=duka.id)

    kata =  None  
    wilaya =  None   
    Mkoa =  None    
    nchi =  None 
    mtaa = None
    mitaas = None
    katas = None
    wilayas = None
    mikoas = None
    nameR = None
    nameD = None
    nameW = None
    nameS = None
    sehemu = 0   

    if not (d or w or c or s or r):
      kataL =  itms.filter(Interprise__mtaa__kata=useri.mtaa.kata.id)    
      wilayaL =  itms.filter(Interprise__mtaa__kata__wilaya=useri.mtaa.kata.wilaya.id)    
      MkoaL =  itms.filter(Interprise__mtaa__kata__wilaya__mkoa=useri.mtaa.kata.wilaya.mkoa.id)    
      nchiL =  itms.filter(Interprise__mtaa__kata__wilaya__mkoa__kanda__nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id) 
      mtaaL = itms.filter(Interprise__mtaa = useri.mtaa.id)

      if nchiL.exists():
        nchi = nchiL

      if MkoaL.exists():
        Mkoa = MkoaL
        nchi = None

      if wilayaL.exists():
        wilaya = wilayaL    
        Mkoa = None

      if kataL.exists():
        kata = kataL
        wilaya = None

      if mtaaL.exists():
        mtaa = mtaaL
        kata = None

    # print({
    #   'mtaa': mtaa is not None,
    #   'kata': kata is not None,
    #   'wilaya': wilaya is not None,
    #   'mkoa': Mkoa is not None,
    #   'nchi': nchi is not None,
    # })

    if s > 0 or mtaa is not None:
      if s > 0:
        itms = itms.filter(Interprise__mtaa=s)
        nameS = Mitaa.objects.get(pk=w)
        nameW = Kata.objects.get(pk=nameS.kata.id)
        nameD = Wilaya.objects.get(pk=nameS.kata.wilaya.id)
        nameR = Mikoa.objects.get(pk=nameS.kata.wilaya.mkoa.id)
        mtaa =  itms
      else:
        itms = mtaa  
      sehemu = 1
    

    if w > 0 or (kata is not None and mtaa is None ):
      
      if w > 0:

        itms = itms.filter(Interprise__mtaa__kata=w)
     
        nameW = Kata.objects.get(pk=w)
        nameD = Wilaya.objects.get(pk=nameW.wilaya.id)
        nameR = Mikoa.objects.get(pk=nameW.wilaya.mkoa.id)
        kata =  itms

        
     
      else:
        itms = kata  

      mitaas = itms.distinct('Interprise__mtaa')
      sehemu = 0 

    if d > 0 or (wilaya is not None and kata is None  and mtaa is None):
      
      if d > 0:
        itms = itms.filter(Interprise__mtaa__kata__wilaya=d)
        nameD = Wilaya.objects.get(pk=d)
        nameR = Mikoa.objects.get(pk=nameD.mkoa.id)
        wilaya = itms
      else:
        itms = wilaya  

      katas = itms.distinct('Interprise__mtaa__kata') 
      sehemu = 0

    if r > 0 or (Mkoa is not None and wilaya is None and kata is None and mtaa is None):
    
      if r > 0:
        itms = itms.filter(Interprise__mtaa__kata__wilaya__mkoa=r)
        nameR = Mikoa.objects.get(pk=r)
        Mkoa = itms
      else:
        itms = Mkoa 

      wilayas = itms.distinct('Interprise__mtaa__kata__wilaya') 
      itms = itms.filter(Interprise__marketing__gte=5000)
      sehemu = 0

    if c > 0 or (nchi is not None  and Mkoa is None and wilaya is None and kata is None and mtaa is None):
      if c > 0:
        itms = itms.filter(Interprise__mtaa__kata__wilaya__mkoa__kanda__nchi = c)
      else:  
        itms = nchi
      mikoas = itms.distinct('Interprise__mtaa__kata__wilaya__mkoa') 
      itms = itms.filter(Interprise__marketing__gte=10000)


    itmed = itms.order_by("-pk")
    num = itms.count()
  

    p=Paginator(itmed,10)

    page_num =request.GET.get('page',1)
   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    ItemImg = []

    for it in page:
      img_url = None
      img=picha_bidhaa.objects.filter(bidhaa=it.bidhaa.id)

      if img.exists():
        img_url = img.last().picha.picha.url
      ItemImg.append({    
        'itm':it,
        'img':img_url
        })
    if code == '0':
      code = ''    

    todo.update({
    'p_num':page_num,
     'pages':pg_number,
    'bil_num':num,
    'itmsImg':ItemImg,  
    'itms':page ,   
    'valued':valu,
    'zipo':len(ItemImg) > 0,
    'valu':str(code) + str(valu),
    'bc':code,
    'kata':katas,
    'mitaa':mitaas,
    'wilaya':wilayas,
    'mikoa':mikoas,
    'nameD':nameD,
    'nameR':nameR,
    'nameW':nameW,
    'nameS':nameS,
    'sehemu':sehemu
    
    })
    
   
    return render(request,'ecorm/itemserach.html',todo)

@login_required(login_url='login')
def marketing(request):
  banner = int(request.GET.get('bn',0))
  hm = int(request.GET.get('hm',0))
  itm = int(request.GET.get('itm',0))
  br = int(request.GET.get('br',0))
  cat = int(request.GET.get('cat',0))
  gr = int(request.GET.get('gr',0))

  todo = todoFunct(request)
  duka = todo['duka']


  
  requered = Interprise.objects.filter(Interprise=False,owner__company=False)
  wilayaidadi = requered.filter(mtaa__kata__wilaya=duka.mtaa.kata.wilaya.id)
  mkoaidadi = requered.filter(mtaa__kata__wilaya__mkoa=duka.mtaa.kata.wilaya.mkoa.id)
  nchiidadi = requered.filter(mtaa__kata__wilaya__mkoa__kanda__nchi=duka.mtaa.kata.wilaya.mkoa.kanda.nchi.id)

  kanda = Zones.objects.filter(nchi=duka.mtaa.kata.wilaya.mkoa.kanda.nchi.id)
  mikoa = Mikoa.objects.filter(kanda__nchi=duka.mtaa.kata.wilaya.mkoa.kanda.nchi.id)
  wilaya = Wilaya.objects.filter(mkoa__kanda__nchi=duka.mtaa.kata.wilaya.mkoa.kanda.nchi.id)
  
  if hm > 0 :
    todo.update({
      'hm':1
    })
  
  if itm > 0:
     itms =  bidhaa_stoku.objects.filter(pk=itm,Interprise=duka.id)  
     todo.update({
      'itms':itms
     })

  if br > 0:
     brs =  makampuni.objects.filter(pk=br,Interprise=duka.id)  
     todo.update({
      'brs':brs
     })

  if cat > 0:
     cats =  bidhaa_aina.objects.filter(pk=cat,Interprise=duka.id)  
     todo.update({
      'cats':cats
     })

  if gr > 0:
     grs =  mahitaji.objects.filter(pk=gr,Interprise=duka.id)  
     todo.update({
      'grs':grs
     })

  todo.update({
    'wilayaIdadi':{'M':wilayaidadi.filter(owner__gender=1).count(),'F':wilayaidadi.filter(owner__gender=0).count(),'total':wilayaidadi.count()},
    'mkoaIdadi':{'M':mkoaidadi.filter(owner__gender=1).count(),'F':mkoaidadi.filter(owner__gender=0).count(),'total':mkoaidadi.count()},
    'nchiIdadi':{'M':nchiidadi.filter(owner__gender=1).count(),'F':nchiidadi.filter(owner__gender=0).count(),'total':nchiidadi.count()},
     'kanda':kanda,
     'mikoa':mikoa,
     'wilaya':wilaya,
     'br':br,
     'itm':itm,
     'gr':gr,
     'cat':cat,
     'hm':hm
  })


  if banner > 0 and  (hm==1 or itm > 0 or br > 0 or cat > 0 or gr > 0):
 
    bn = marketBanner.objects.get(pk=banner,Interprise=duka)
    mktPlace = marketPlace.objects.filter(banner=bn.id)
    howMany = 0
    places = []
    if mktPlace.exists():
      if mktPlace.last().wilaya is not None:
        for mk in mktPlace:
            places.append(mk.wilaya.id)
        howMany = UserExtend.objects.filter(mtaa__kata__wilaya__in=places).count()

      if mktPlace.last().mkoa is not None:
        for mk in mktPlace:
            places.append(mk.mkoa.id)
        howMany = UserExtend.objects.filter(mtaa__kata__wilaya__mkoa__in=places).count()

      if mktPlace.last().nchi is not None:
        for mk in mktPlace:
            places.append(mk.nchi.id)
        howMany = UserExtend.objects.filter(mtaa__kata__wilaya__mkoa__kanda__nchi__in=places).count()

    
    todo.update({
      'banner':bn,
      'banned':True,
      'mktPlace':mktPlace,
      'Users':howMany
    })


   

  else:
    todo.update({
      'banned':False,
      'Users':0
    })

  return render(request,'marketing.html',todo)

@login_required(login_url='login')
def getPlaceusers(request):
  if request.method == "POST":
    try:
      mkoa = int(request.POST.get('mkoa',0))
      wilaya = int(request.POST.get('wilaya',0))
      
      requered = Interprise.objects.filter(Interprise=False,owner__company=False)

      data = {}

      if mkoa > 0:
        mkoaidadi = requered.filter(mtaa__kata__wilaya__mkoa=mkoa)   
        data = {
          'success':True,
          'mkoaIdadi':{'M':mkoaidadi.filter(owner__gender=1).count(),'F':mkoaidadi.filter(owner__gender=0).count(),'total':mkoaidadi.count()},
        }

      if wilaya > 0:  
        wilayaidadi = requered.filter(mtaa__kata__wilaya=wilaya)

        data = {
              'success':True,
              'wilayaIdadi':{'M':wilayaidadi.filter(owner__gender=1).count(),'F':wilayaidadi.filter(owner__gender=0).count(),'total':wilayaidadi.count()},

        }

      return JsonResponse(data)    

    except:
      data={
        'msg_swa':'Haikufanikiwa Kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'The action was not successfully please try again',
        'success':False
      }

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def marketingBanner(request):
  if request.method == "POST":
    try:
      img = request.FILES['IMG']
      edit = int(request.POST.get('edit',0))
      hm = int(request.POST.get('hm',0))
      itm = int(request.POST.get('itm',0))
      br = int(request.POST.get('br',0))
      cat = int(request.POST.get('cat',0))
      gr = int(request.POST.get('gr',0))

      todo = todoFunct(request)
      duka = todo['duka']
      banner = marketBanner()
      if edit>0:
        banner = marketBanner.objects.get(pk=edit,Interprise=duka)

      siz = img.size
      data = {
      }
      
      to = 'hm=1'

      if hm > 0 :
        banner.page = 1

      if itm > 0:
        itms =  bidhaa_stoku.objects.filter(pk=itm,Interprise=duka.id)  
        to = 'itm='+str(itms.last().id)
        banner.itm = itms.last()

      if br > 0:
        brs =  makampuni.objects.filter(pk=br,Interprise=duka.id)  
        to = 'br='+str(brs.last().id)
        banner.brand = brs.last()

      if cat > 0:
        cats =  bidhaa_aina.objects.filter(pk=cat,Interprise=duka.id)  
        to = 'cat='+str(cats.last().id)
        banner.aina = cats.last()

      if gr > 0:
        grs =  mahitaji.objects.filter(pk=gr,Interprise=duka.id)  
        to = 'gr'+str(grs.last().id) 
        banner.group = grs.last()

      if siz <= (600 * 1024):
        gcs_storage = default_storage
        if not settings.DEBUG:
          gcs_storage = settings.GCS_STORAGE_INSTANCE

        ext = img.name.split('.')[-1]
        filename = f"banners/{duka.id}_{int(time.time())}.{ext}"  
        path = gcs_storage.save(filename, img)

        banner.banner = path
        banner.Interprise = duka
        banner.by = todo['useri']
        banner.save()

        data = {
          'success':True,
          'msg_swa':'Picha ya tangazo imehifadhiwa kikamilifu',
          'msg_eng':'Image added successfully',
          'bn':banner.id,
          'to':to
        }
        
      else:
        data = {
          'success':False,
          'msg_swa':'Faili la picha ni kubwa kuliko saizi inayokubalika',
          'msg_eng':'Image File size exceeds the required size'
        }  
      return JsonResponse(data)
      
    except:
      data = {
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu',
        'msg_eng':'The action was not successfully please try again',
      }

      return JsonResponse(data)

@login_required(login_url='login')
def allBanners(request):
  c = int(request.GET.get('c',0))
  p = int(request.GET.get('p',0))

  todo = todoFunct(request)
  duka = todo['duka']
  banners = marketBanner.objects.filter(Interprise=duka.id).order_by('-pk')
  if p:
    banners = banners.filter(amount=0)
  if c:
    banners = banners.filter(vistors=F('visted'))



  todo.update({
    'banners':banners,
    'p':p,
    'c':c
   
  })

  return render(request,'allBanners.html',todo)

@login_required(login_url='login')
def DeletePost(request):
  if request.method == "POST":
    try:
      bn = int(request.POST.get('bn',0))
      todo = todoFunct(request)
      
      useri = todo['useri']
      banner = marketBanner.objects.get(Q(by=useri.id)|Q(Interprise__owner=useri.id),pk=bn) 
      # thebnner=marketBanner.objects.filter(pk=banner.id).delete()
      banner.banner.delete(save=True)
      banner.delete()

      data = {
        'success':True,
        'msg_swa':'Chapisho limeondolewa kikamilifu',
        'msg_eng':'Post Deleted successfully'
      } 

      return JsonResponse(data)
    except:
      data = {
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu',
        'msg_eng':'The action was not successfully please try again',
      }

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def descImg(request):
   if request.method == "POST":
     try:
       img = request.FILES['IMG']
       gcs_storage = default_storage
       if not settings.DEBUG:
          gcs_storage = settings.GCS_STORAGE_INSTANCE
       ext = img.name.split('.')[-1]
       siz = img.size
       todo = todoFunct(request)
       duka = todo['duka']
       data = {
         'success':True,
         'msg_swa':'Picha imehifadhiwa kikamilifu',
         'msg_eng':'Image file uploaded successfull'
       }



       filename = f"descImages/{duka.id}_{int(time.time())}.{ext}"
       path = gcs_storage.save(filename, img)

       if siz <= (1024 * 1024):
         addTo = DescImages()
         addTo.Interprise = duka
         addTo.size = siz
         addTo.image = path
         addTo.save()

         return JsonResponse(data)
       else:
         data = {
           'success':False,
           'msg_swa':'Faili la picha halikubariki',
           'msg_eng':'Invalid image file'
         }

         return JsonResponse(data)
         
     except:
       data = {
         'success':False,
         'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'The action was not successfully due to error please try again correctly'
       }

       return JsonResponse(data)
     
@login_required(login_url='login')
def descDoc(request):
   if request.method == "POST":
     try:
       doc = request.FILES['addDocInput']
       siz = doc.size
       todo = todoFunct(request)
       duka = todo['duka']
       data = {
         'success':True,
         'msg_swa':'Picha imehifadhiwa kikamilifu',
         'msg_eng':'Image file uploaded successfull'
       }

       gcs_storage = default_storage
       if not settings.DEBUG:
          gcs_storage = settings.GCS_STORAGE_INSTANCE

       ext = doc.name.split('.')[-1]
       filename = f"descDocs/{duka.id}_{int(time.time())}.{ext}"
       path = gcs_storage.save(filename, doc)
       
       if siz <= (1024 * 1024 * 5):
         addTo = DescImages()
         addTo.Interprise = duka
         addTo.size = siz
         addTo.attach = path
         addTo.save()

         return JsonResponse(data)
       else:
         data = {
           'success':False,
           'msg_swa':'Faili la picha halikubariki',
           'msg_eng':'Invalid image file'
         }

         return JsonResponse(data)
         
     except:
       data = {
         'success':False,
         'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'The action was not successfully due to error please try again correctly'
       }

       return JsonResponse(data)
     

@login_required(login_url='login')
def getDescImages(request):
  if request.method == "POST":
    todo = todoFunct(request)
    duka = todo['duka']
    imgs = DescImages.objects.filter(Interprise=duka.id).order_by('-pk')
    imgF = []
    docF = []



    for i in imgs :
      if i.image != '':
        imgF.append({
          'img':i.image.url,
          'id':i.id,
          'size':i.size
        })

      if  i.attach != '':
        docF.append({
          'doc':i.attach.url,
          'id':i.id,
          'size':i.size
        })  

    data = {
      'imgF':imgF,
      'docF':docF
    }   
    return JsonResponse(data) 
  

  else:
    return render(request,'pagenotFound.html',todoFunct(request))
  

@login_required(login_url='login')
def removeFiles(request):
  if request.method == "POST":
    try:
      val = int(request.POST.get('val',0))
      todo = todoFunct(request)
      duka = todo['duka']

      data = {
        'success':True,
        'msg_swa':'Faili limeondolewa kikamilifu',
        'msg_eng':'File removed successfully'
      }

      fi = DescImages.objects.get(pk=val,Interprise=duka)
      if fi.image !='':
        fi.image.delete(save=True)
      if fi.attach !='':
        fi.attach.delete(save=True)  

      fi.delete()  

      return JsonResponse(data)


    

    except:
        data = {
         'success':False,
         'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'The action was not successfully due to error please try again correctly'
       }

        return JsonResponse(data)     


# @login_required(login_url='login')
def biz_banner(request):
  try:
    duka = int(request.GET.get('s',0))
    lang = int(request.GET.get('l',0))
    entp = Interprise.objects.get(pk=duka)

    todo = {
            'duka':entp,
             'useri':{'langSet':lang}
             }

    if todo['duka'].Interprise:
      return render(request,'biz_banner.html',todo)
    else:
      return HttpResponse('success:False')
  except:
    return HttpResponse('success:False')



@login_required(login_url='login')
def addBannerDetails(request):
  if request.method == "POST":
    try:
      bn = int(request.POST.get('banner',0))
      desc = request.POST.get('desc')
      url = request.POST.get('url')
      place = json.loads(request.POST.get('place'))
      hm = int(request.POST.get('hm',0))

      dist = int(request.POST.get('dist',0))
      edit = int(request.POST.get('edit',0))
      reg = int(request.POST.get('reg',0))
      cont = int(request.POST.get('cont',0))
      custDistr = int(request.POST.get('custDistr',0))
      custReg = int(request.POST.get('custReg',0))
      gender = int(request.POST.get('gender',0))
      page = int(request.POST.get('page',0))
      idadi = int(request.POST.get('idadi',0))
      todo = todoFunct(request)
      duka = todo['duka']
     
      banner = marketBanner.objects.get(pk=bn,Interprise=duka)
      allExists = False
      data = {
          'success':True,
          'msg_swa':'Vielelezo vya tangazo imehifadhiwa kikamilifu',
          'msg_eng':'Banner details added successfully',
          'bn':banner.id,
        
        }
        
      amo  = 0
      if edit:
        if float(idadi) <= float(duka.Balance):
          banner.vistors = banner.vistors + idadi
          if gender > 0:
              banner.gender = gender - 1
          banner.save()
          duka.Balance = float(float(duka.Balance) - float(idadi*10))
          duka.save()
        else:
          data = {
            'success':False,
            'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu',
            'msg_eng':'The action was not successfully please try again',
          }
      else:  
        if dist or reg or cont:
          allExists = True
          if dist :
            amo = 1000
          if reg :
            amo = 2000
          if cont :
            amo = 10000

        if custDistr :
          allExists = Wilaya.objects.filter(pk__in=place).count() == len(place)
          amo = len(place) * 1000

        if custReg :
          allExists = Mikoa.objects.filter(pk__in=place).count() == len(place)
          amo = len(place) * 2000
      
        if idadi >= 1 and allExists and float(amo+(idadi*10)) <= float(duka.Balance):  
          banner.date = datetime.datetime.now(tz=timezone.utc)
          banner.vistors = idadi
          banner.amount = amo
          banner.desc = desc
          banner.Interprise = duka

          if gender > 0:
            banner.gender = gender - 1

          if hm > 0:
            if url != '':
              banner.url = url
            banner.page = page

          banner.save()
          if dist or reg or cont:
            mktPlace = marketPlace()
            mktPlace.banner = banner
            if dist:
              mktPlace.wilaya = duka.mtaa.kata.wilaya
            if reg:
              mktPlace.mkoa = duka.mtaa.kata.wilaya.mkoa
            if cont:
              mktPlace.nchi = duka.mtaa.kata.wilaya.mkoa.kanda.nchi
            mktPlace.save()
          
          if custDistr:
            for p in place:
              mktPlace = marketPlace()
              mktPlace.banner = banner
              mktPlace.wilaya = Wilaya.objects.get(pk=p)
              mktPlace.save()

          if custReg:
            for p in place:
              mktPlace = marketPlace()
              mktPlace.banner = banner
              mktPlace.mkoa = Mikoa.objects.get(pk=p)
              mktPlace.save()

          duka.Balance = float(float(duka.Balance) - float(amo+(idadi*10)))
          duka.save()

        else:
          data = {
            'success':False,
            'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
            'msg_eng':'The action was not successfully please try again'
          }

     
      return JsonResponse(data)
      
    except:
      data = {
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu',
        'msg_eng':'The action was not successfully please try again',
      }

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))