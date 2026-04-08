# from asyncio.windows_events import NULL
# from email.policy import default

import traceback
from xml.dom.expatbuilder import makeBuilder
from django.shortcuts import render

import json
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from business import settings
from management.models import HudumaNyingine, Notifications,ainaBibi,ainaMama,Kata,Mitaa,Wilaya,Zones,Mikoa,wateja_active,productionList,now_categ,now_group,bidhaaA_edit,stokAdjustment,bidhaa_edit,stockAdjst_confirm, UserExtend,Kanda,bei_za_bidhaa,user_Interprise,ColorChange,SizeChange,staff_akaunt_permissions,wateja,receive,receiveList,transferList,received_confirm,transfered_size,received_size,transfered_color,received_color,transfer,sizes,mauzoList,Interprise,bidhaa_sifa,key_sifa,picha_yenyewe,productChangeRecord,InterprisePermissions,PaymentAkaunts,toaCash,wekaCash,mahitaji,bidhaa_aina,makampuni,bidhaa,wasambazaji,manunuzi,manunuziList,matumizi,rekodiMatumizi,bidhaa_stoku,color_produ,produ_colored,picha_bidhaa,produ_size
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F,FloatField
from django.core import paginator, serializers
from django.db.models import Q
from storages.backends.gcloud import GoogleCloudStorage
from django.core.files.storage import default_storage 
# from datetime import datetime
from django.utils import timezone
timezone.now()

from datetime import date,timedelta,timezone

import random
import time  
import pytz
import datetime
import re
from django.db.models import Sum
from django.forms.models import model_to_dict
import os

from django.core.paginator import Paginator,EmptyPage
# Create your views here.


from accaunts.todos import Todos,updateOrder
# Create your views here.

def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()

@login_required(login_url='login')
def getItems(request):
    todo = todoFunct(request)
    intpn = todo['cheo']
    intp = intpn.Interprise
    itmI= bidhaa_stoku.objects.filter(Q(idadi__gt=0)|Q(inapacha=False)|Q(produced__notsure=True),Interprise__owner=intp.owner.id).annotate(
            complete=F('produced__production__production__complete'),
            notsure=F('produced__notsure'),
            pr=F('produced__production__production__id'),
            st=F('Interprise'),stName=F('Interprise__name'),
            group_name=F('bidhaa__bidhaa_aina__mahi__mahitaji'),
            group=F('bidhaa__bidhaa_aina__mahi__id'),
            kampuni=F('bidhaa__kampuni__id'),
            aina=F('bidhaa__bidhaa_aina__id'),
            namba=F('bidhaa__namba'),
            material=F('bidhaa__material'),
            curenci=F('Interprise__currencii'),
            vat=F('Interprise__vatper'),
            vat_allow=F('Interprise__vat_allow'),
            user_sup=F('msambaji__where'),

            group_aina = F('bidhaa__bidhaa_aina__mahi__aina'),

            puCode=F('manunuzi__manunuzi__code'),
            TransCode=F('uhamisho__receive__transfer__code'),
            RCFrom=F('uhamisho__receive__transfer__Interprise__name'),
            ProdCode=F('produced__production__code'),
            addCode=F('ongezwa__code'),
           
            brand=F('bidhaa__kampuni_id__kampuni_jina'),
            ainaN=F('bidhaa__bidhaa_aina_id__aina'),
            vendor=F('msambaji_id__jina'),
            bidhaaN=F('bidhaa__bidhaa_jina'),
            maelezo=F('bidhaa__maelezo'),
            brandId=F('bidhaa__kampuni'),
        
            taxInclusive=F('bidhaa__saletaxInluded'),
            putaxInclusive=F('bidhaa__purchtaxInluded'),
            itmChangeDate=F('bidhaa__change_date'),
            vipimo=F('bidhaa__vipimo'),
            uwiano=F('bidhaa__idadi_jum'),
            vipimoJum=F('bidhaa__vipimo_jum')
            )


    itms = itmI.values().order_by("-pk")    

    products = list(itms.filter(st=intp.id))

    produced = itmI.filter(produced__production__production__Interprise=intp.id)
    custom = list(wateja.objects.filter(Interprise__owner=intpn.Interprise.owner.id).annotate(duka=F('Interprise'),duka_jina=F('Interprise__name')).values())

    produced_cost = []
    if produced.exists():
        for li in produced:
                    itm_cost = 0
                
                    pdcd = bidhaa_stoku.objects.filter(produced__production__production=li.produced.production.production.id)
                    
                    # prices sum for all produced on this produced
                    prices_sum = pdcd.annotate(idd=F('produced__qty')).aggregate(sum=Sum(F('Bei_kuuza')*F('idd')))['sum']

                    # cost of items used for production.....
                    mat_cost = productChangeRecord.objects.filter(adjst__production=li.produced.production.production.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
                    
                    #Other expenses .........................//
                    exp = toaCash.objects.filter(produxn__produxn=li.produced.production.production.id).aggregate(sum=Sum(F('Amount')))['sum']
                    
                    prod_sumu = float(mat_cost)

                    if exp:
                        prod_sumu += float(exp)  

                    if prices_sum > 0:
                        prc = li.Bei_kuuza * li.produced.qty
                        pr_ratio = prc/prices_sum
                        prQty = float(li.produced.qty)
                        if prQty == 0 :
                            itm_cost = 0
                        else:    
                            itm_cost = (float(pr_ratio) * float(prod_sumu)  ) / float(li.produced.qty)
                          
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        if qtysm == 0:
                            qtysm = len(pdcd)
                        itm_cost = float(prod_sumu)/float(qtysm)


                    
                    produced_cost.append({
                        'id':li.id,
                        'cost':itm_cost,
                        'idadi':li.idadi,
                        'qty':li.produced.qty,
                        'pr':li.produced.production.production.id,
                        'code':li.produced.production.production.code,
                        'sales':li.Bei_kuuza,
                        'material':li.bidhaa.material,
                        'bidhaa':li.bidhaa.id,
                        'Aina':li.bidhaa.bidhaa_aina.id,
                        'kundi':li.bidhaa.bidhaa_aina.mahi.id,
                        'brand':li.bidhaa.kampuni.id
                    })
    bidhaaRangi = list(produ_colored.objects.select_related('color_produ,bidhaa_stoku').filter(Interprise=intp,color__colored=True).exclude(bidhaa__inapacha=True,idadi=0).values('id','bidhaa','color','idadi','color__nick_name','color__color_code','color__color_name','color__colored','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum','bidhaa__bidhaa__idadi_jum','bidhaa__idadi'))  
    sized=list(produ_size.objects.select_related('sizes').filter(Interprise=intp).exclude(bidhaa__inapacha=True,idadi=0).values('id','sized__color','sized__size','bidhaa','idadi','bidhaa__bidhaa__idadi_jum','bidhaa__idadi','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum'))
    itemImg=[]
   
    pics = picha_bidhaa.objects.filter(picha__owner= intp.owner.user).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
    if pics.exists():
        for im in pics:
            itemImg.append({
                'picha__picha':im.picha.picha.url,
                'picha':im.picha.id,
                'id':im.id,
                'color_produ':im.rangi,
                'bidhaa':im.bidhaa.id

            }) 


    ImgSiZe = picha_yenyewe.objects.filter(owner= intpn.admin).aggregate(Sum('pic_size'))
    data = dict()
  
  
    data['wateja']=custom
    data['prdxnCost']=produced_cost
    data["products"]=products
    data['bidhaa_Rangi']=bidhaaRangi
    data['sized']=sized  
    data['img']=itemImg
    # data['Imgsize']=ImgSiZe
        
    return JsonResponse(data)

@login_required(login_url='login')
def OutStock(request):
    todo = todoFunct(request)
    intpn = todo['cheo']
    intp = intpn.Interprise    
    itmI= bidhaa_stoku.objects.filter(Q(idadi__gt=0)|Q(inapacha=False)|Q(produced__notsure=True),Interprise__owner=intp.owner.id).annotate(
        complete=F('produced__production__production__complete'),
        notsure=F('produced__notsure'),pr=F('produced__production__production__id'),
        st=F('Interprise'),stName=F('Interprise__name'),
        group_name=F('bidhaa__bidhaa_aina__mahi__mahitaji'),
        group=F('bidhaa__bidhaa_aina__mahi__id'),
        kampuni=F('bidhaa__kampuni__id'),
        aina=F('bidhaa__bidhaa_aina__id'),
        namba=F('bidhaa__namba'),
        material=F('bidhaa__material'),
        curenci=F('Interprise__currencii'),
        vat=F('Interprise__vatper'),
        vat_allow=F('Interprise__vat_allow'),
        user_sup=F('msambaji__where'),
        brand=F('bidhaa__kampuni_id__kampuni_jina'),

        ainaN=F('bidhaa__bidhaa_aina_id__aina'),
        vendor=F('msambaji_id__jina'),
        bidhaaN=F('bidhaa__bidhaa_jina'),
        maelezo=F('bidhaa__maelezo'),
        brandId=F('bidhaa__kampuni'),

        puCode=F('manunuzi__manunuzi__code'),
        TransCode=F('uhamisho__receive__transfer__code'),
        ProdCode=F('produced__production__code'),
        addCode=F('ongezwa__code'),

        RCFrom=F('uhamisho__receive__transfer__Interprise__name'),    
        taxInclusive=F('bidhaa__saletaxInluded'),
        putaxInclusive=F('bidhaa__purchtaxInluded'),
        itmChangeDate=F('bidhaa__change_date'),
        vipimo=F('bidhaa__vipimo'),
        uwiano=F('bidhaa__idadi_jum'),
        vipimoJum=F('bidhaa__vipimo_jum')
        )
    itms = itmI.values().order_by("-pk")
        
    stokuyanje =  list(itms.exclude(st=intp.id))
    StokubidhaaRangi =list(color_produ.objects.filter(bidhaa__owner=intp.owner.user,colored=True).annotate(prod=F('bidhaa')).values().order_by("pk"))  
   
    itemImg=[]
   
    pics = picha_bidhaa.objects.filter(picha__owner= intp.owner.user).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
    if pics.exists():
        for im in pics:
            itemImg.append({
                'picha__picha':im.picha.picha.url,
                'picha':im.picha.id,
                'id':im.id,
                'color_produ':im.rangi,
                'bidhaa':im.bidhaa.id

            })   
        
          
    Stokusized=list(sizes.objects.filter(color__bidhaa__owner=intp.owner.user).annotate(colr=F('color')).values('size','colr','id').order_by("pk"))

    data = dict()
    data['stoku_nje']=stokuyanje
    data['stokuRangi']=StokubidhaaRangi
    data['img']=itemImg
    data['stokuSize']=Stokusized
    data['Imgsize'] = []
    return JsonResponse(data)

@login_required(login_url='login')
def getItemsAll(request):
    todo = todoFunct(request)
    intpn = todo['cheo']
    intp = intpn.Interprise
    itmI= bidhaa_stoku.objects.filter(Q(idadi__gt=0)|Q(inapacha=False)|Q(produced__notsure=True),Interprise__owner=intp.owner.id).annotate(
        complete=F('produced__production__production__complete'),
        notsure=F('produced__notsure'),
        pr=F('produced__production__production__id'),
        st=F('Interprise'),stName=F('Interprise__name'),
        group_name=F('bidhaa__bidhaa_aina__mahi__mahitaji'),
        group=F('bidhaa__bidhaa_aina__mahi__id'),
        kampuni=F('bidhaa__kampuni__id'),
        aina=F('bidhaa__bidhaa_aina__id'),
        namba=F('bidhaa__namba'),
        material=F('bidhaa__material'),
        curenci=F('Interprise__currencii'),
        vat=F('Interprise__vatper'),
        vat_allow=F('Interprise__vat_allow'),
        user_sup=F('msambaji__where'),

        group_aina = F('bidhaa__bidhaa_aina__mahi__aina'),

        brand=F('bidhaa__kampuni_id__kampuni_jina'),
        ainaN=F('bidhaa__bidhaa_aina_id__aina'),
        vendor=F('msambaji_id__jina'),
        bidhaaN=F('bidhaa__bidhaa_jina'),
        maelezo=F('bidhaa__maelezo'),
        brandId=F('bidhaa__kampuni'),

        puCode=F('manunuzi__manunuzi__code'),
        TransCode=F('uhamisho__receive__transfer__code'),
        ProdCode=F('produced__production__code'),
        addCode=F('ongezwa__code'),
        RCFrom=F('uhamisho__receive__transfer__Interprise__name'),
    
        taxInclusive=F('bidhaa__saletaxInluded'),
        putaxInclusive=F('bidhaa__purchtaxInluded'),
        itmChangeDate=F('bidhaa__change_date'),
        vipimo=F('bidhaa__vipimo'),
        uwiano=F('bidhaa__idadi_jum'),
        vipimoJum=F('bidhaa__vipimo_jum')


        
        )

    itms = itmI.values().order_by("-pk")    

    products = list(itms.filter(st=intp.id))

    produced = itmI.filter(produced__production__production__Interprise=intp.id)
    
    produced_cost = []
    if produced.exists():
        for li in produced:
                    itm_cost = 0
                
                    pdcd = bidhaa_stoku.objects.filter(produced__production__production=li.produced.production.production.id)
                    
                    # prices sum for all produced on this produced
                    prices_sum = pdcd.annotate(idd=F('produced__qty')).aggregate(sum=Sum(F('Bei_kuuza')*F('idd')))['sum']
                    

                   
                    
                    # cost of items used for production.....
                    mat_cost = productChangeRecord.objects.filter(adjst__production=li.produced.production.production.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
                    
                    #Other expenses .........................//
                    exp = toaCash.objects.filter(produxn__produxn=li.produced.production.production.id).aggregate(sum=Sum(F('Amount')))['sum']
                    
                    prod_sumu = float(mat_cost)

                    if exp:
                        prod_sumu += float(exp)  

                    if prices_sum > 0:
                        prc = li.Bei_kuuza * li.produced.qty
                        pr_ratio = prc/prices_sum
                        prQty = float(li.produced.qty)
                        if prQty == 0 :
                            itm_cost = 0
                        else:    
                            itm_cost = (float(pr_ratio) * float(prod_sumu)  ) / float(li.produced.qty)
                          
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        if qtysm == 0:
                            qtysm = len(pdcd)
                        itm_cost = float(prod_sumu)/float(qtysm)


                    
                    produced_cost.append({
                        'id':li.id,
                        'cost':itm_cost,
                        'idadi':li.idadi,
                        'qty':li.produced.qty,
                        'pr':li.produced.production.production.id,
                        'code':li.produced.production.production.code,
                        'sales':li.Bei_kuuza,
                        'material':li.bidhaa.material,
                        'bidhaa':li.bidhaa.id,
                        'Aina':li.bidhaa.bidhaa_aina.id,
                        'kundi':li.bidhaa.bidhaa_aina.mahi.id,
                        'brand':li.bidhaa.kampuni.id
                    })
    bidhaaRangi = list(produ_colored.objects.select_related('color_produ,bidhaa_stoku').filter(Interprise=intp,color__colored=True).exclude(bidhaa__inapacha=True,idadi=0).values('id','bidhaa','color','idadi','color__nick_name','color__color_code','color__color_name','color__colored','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum','bidhaa__bidhaa__idadi_jum','bidhaa__idadi'))  
    sized=list(produ_size.objects.select_related('sizes').filter(Interprise=intp).exclude(bidhaa__inapacha=True,idadi=0).values('id','sized__color','sized__size','bidhaa','idadi','bidhaa__bidhaa__idadi_jum','bidhaa__idadi','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum'))
    itemImg=[]
   
    pics = picha_bidhaa.objects.filter(picha__owner= intp.owner.user).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
    if pics.exists():
        for im in pics:
            itemImg.append({
                'picha__picha':im.picha.picha.url,
                'picha':im.picha.id,
                'id':im.id,
                'color_produ':im.rangi,
                'bidhaa':im.bidhaa.id

            })    
   
    ImgSiZe = picha_yenyewe.objects.filter(owner= intpn.admin).aggregate(Sum('pic_size'))
 
  
    aina = list(bidhaa_aina.objects.filter(Interprise__owner=intp.owner.id).annotate(mahitaji=F('mahi__mahitaji')).values().order_by("-pk"))
    mahi = list(mahitaji.objects.filter(Interprise=intp).values().order_by("-pk"))
    kampuni = list(makampuni.objects.filter(Interprise__owner=intp.owner.id).values().order_by("-pk"))
    sambazaji = list(wasambazaji.objects.filter(owner=intp.owner.user.id).values().order_by("-pk"))  
    ainaMam = list(ainaMama.objects.all().annotate(aina_swa=F('aina__jina'),aina_eng=F('aina__name')).values())
    
    data = dict()
    data['prdxnCost']=produced_cost
    data["products"]=products
    data['bidhaa_Rangi']=bidhaaRangi
    data['sized']=sized  
    data['img']=itemImg
    data['Imgsize']=ImgSiZe
    data["aina"]=aina
    data["mahi"]=mahi
    data["kampuni"]=kampuni
    data["sambaza"]=sambazaji   
    data['ainaMama'] = ainaMam    
    return JsonResponse(data)

@login_required(login_url='login')
def getItemsAssociate(request):
    todo = todoFunct(request)
    intpn = todo['cheo']
    intp = intpn.Interprise 
    aina = list(bidhaa_aina.objects.filter(Interprise__owner=intp.owner.id).annotate(mahitaji=F('mahi__mahitaji')).values().order_by("-pk"))
    mahi = list(mahitaji.objects.filter(Interprise=intp).values().order_by("-pk"))
    kampuni = list(makampuni.objects.filter(Interprise=intp).values().order_by("-pk"))
    sambazaji = list(wasambazaji.objects.filter(owner=intp.owner.user.id).values().order_by("-pk"))
    matumiz = list(matumizi.objects.filter(owner=InterprisePermissions.objects.get(user__user=request.user,default=True).admin).values().order_by("-pk"))
    ainaMam = list(ainaMama.objects.all().annotate(aina_swa=F('aina__jina'),aina_eng=F('aina__name')).values())
    
    data = dict()
    data["aina"]=aina
    data["mahi"]=mahi
    data["kampuni"]=kampuni
    data["sambaza"]=sambazaji
    data['tumizi']=matumiz
    data['ainaMama']=ainaMam
    return JsonResponse(data)

@login_required(login_url='login')
def getStokuData(request):
    intpn=InterprisePermissions.objects.get(user__user=request.user,default=True)
    intp = intpn.Interprise
    stok = list(InterprisePermissions.objects.select_related('Interprise').filter(user__user=request.user,Allow=True,Interprise__owner=intp.owner).exclude(Interprise=intp.id).values('Interprise','Interprise__name','Interprise__mtaa','Interprise__wilaya','Interprise__mkoa').order_by("-pk"))
    other_stock = list(Interprise.objects.filter(owner=intp.owner.id,Interprise=True).exclude(pk=intp.id).values())
    custom = list(wateja.objects.filter(Interprise__owner=intpn.Interprise.owner.id).annotate(duka=F('Interprise'),duka_jina=F('Interprise__name')).values())
    data = dict()
    data['wateja']=custom
    data["stoku"]=stok
    data["other_stock"]=other_stock
    return JsonResponse(data)


@login_required(login_url='login')
def OngezaMahitaji(request):
     if request.method == "POST":
         entp=InterprisePermissions.objects.get(user__user=request.user,default=True)
         try:
              if entp.owner or (entp.addproduct and not entp.viewi):  
                name=request.POST.get('mahitaji')
                group=int(request.POST.get('group'))
                edit = int(request.POST.get('edit'))
                val = int(request.POST.get('val'))

                ainamam = ainaMama.objects.get(pk=group)
                
                mahi=mahitaji()
                other = mahitaji.objects.filter(mahitaji__icontains=name,Interprise=entp.Interprise.id).exclude(pk=val).exists()
                if edit:  
                    mahi = mahitaji.objects.get(pk=val,Interprise=entp.Interprise)    

                mahi.Interprise = entp.Interprise
                mahi.mahitaji = name
                mahi.aina = ainamam

                if other and not edit:
                    data={
                        'success':False,
                        'message_swa':'Tayari kuna kundi la Bidhaa lenye jina kama hili',
                        'message_eng':'The same Parent Category name  exists'
                    }

                else:
                    mahi.save()    
                    data={
                        'success':True,
                        'message_swa':'Kundi la bidhaa limeongezwa',
                        'message_eng':'Parent category added successfully'                    
                    }
                return JsonResponse(data) 

              else:
                 data={

                     'success':False,
                     'message_swa':'Hauna ruhusa ya kuongeza Kundi la bidhaa kwa sasa. Tafadhari wasiliana na uongozi wako',
                     'message_eng':'You have no permission to add parent category please contact the admin'

                 }   
         except:
             data={
                 'success':False,
                    'message_swa':'Kundi la bidhaa halijaongezwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
                    'message_eng':'Parent category was not added please try again '                    

             } 

             return JsonResponse(data)     

     else:

       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def OngezaKampuni(request):
     if request.method == "POST":
         name=request.POST.get('kampuni')
         edit=int(request.POST.get('edit',0))
         val=request.POST.get('val',0)
         entp=InterprisePermissions.objects.get(user__user=request.user,default=True)
         try:
             if entp.owner or (entp.addproduct and not entp.viewi):
                kamp=makampuni()
               
                if edit and int(val)>0:
                   findB = makampuni.objects.filter(pk=val,Interprise=entp.Interprise.id)

                   if findB.exists():
                       kamp = findB.last()

                kamp.Interprise = entp.Interprise
                kamp.kampuni_jina = name
                if makampuni.objects.filter(kampuni_jina=name,Interprise=entp.Interprise).exists():
                    data={
                        'success':False,
                        'message_swa':'Tayari kuna chapa yenye jina kama hili',
                        'message_eng':'The same  Brand name  exists'
                    }

                else:
                    kamp.save()    
                    data={
                        'success':True,
                        'message_swa':'Chapa ya bidhaa Imeongezwa',
                        'message_eng':'new Items Brand added successfully'                        
                    }
                return JsonResponse(data)
             else: 
                 data={
                     'success':False,
                     'message_swa':'Hauna ruhusa ya kuongeza Chapa ya bidhaa kwa sasa. Tafadhari wasiliana na uongozi wako',
                     'message_eng':'You have no parmission to add items Brand. Please contact your admin'
                 }  

                 return JsonResponse(data)   

         except:
              data={
                  'success':False,
              } 
              return JsonResponse(data)  
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def futaBrand(request):
     if request.method == "POST":
         
         val=request.POST.get('val',0)
         entp=InterprisePermissions.objects.get(user__user=request.user,default=True)
         try:
             if entp.owner or (entp.addproduct and not entp.viewi):
                   data={
                            'success':True,
                            'message_swa':'Chapa ya bidhaa Imeondolewa kikamilifu',
                            'message_eng':'Items Brand removed successfully'                        
                        }               
                   findB = makampuni.objects.filter(pk=val,Interprise=entp.Interprise.id)
                   if findB.exists():
                        itms=bidhaa.objects.filter(kampuni=findB.last().id)
                        
                        if not itms.exists():
                            findB.delete()
                        else:
                            data={
                                'success':False,
                                'message_swa':'Chapa ya bidhaa haikufanikiwa kuondolewa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                                'message_eng':'The oparation was not successfully please try again'
                            }    
                   else:
                       data={
                           'success':False,

                       }  
               

                   return JsonResponse(data)
             else: 
                 data={
                     'success':False,
                     'message_swa':'Hauna ruhusa ya kuongeza kampuni ya bidhaa kwa sasa. Tafadhari wasiliana na uongozi wako',
                     'message_eng':'You have no parmission to add item Company. Please contact your admin'
                 }  

                 return JsonResponse(data)   

         except:
              data={
                  'success':False,
              } 
              return JsonResponse(data)  
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def AddStoku(request):
    todo = todoFunct(request)
    wilaya = Wilaya.objects.all()
    mikoa = Mikoa.objects.all()
    kanda=Zones.objects.all() 
    edit = int(request.GET.get('edit',0))

    duka = todo['duka']
    useri = todo['useri']

    if useri.id is not duka.owner.id:
        edit = 0
    else:
        if edit:
            kata = Kata.objects.filter(wilaya=duka.mtaa.kata.wilaya.id)  
            mitaa = Mitaa.objects.filter(kata=duka.mtaa.kata.id)  
            todo.update({
                'kata':kata,
                'mitaa':mitaa
            })

    todo.update({
        'edit':edit,
        'kanda':kanda,
        'mikoa':mikoa,
        'wilaya':wilaya,
        
    })
    return render(request,'addEnterprise.html',todo)


@login_required(login_url='login')
def usagePlan(request):
    todo = todoFunct(request)
    duka = todo['duka']

    deni = duka.usage + duka.marketing

    todo.update({
        'deni':deni
    })
    return render(request,'usageplan.html',todo)

@login_required(login_url='login')
def lipiaMatumiziNyuma(request):  
  if request.method == "POST":
    try:
      malipo = int(request.POST.get('lipwa'))
      masoko = int(request.POST.get('masoko'))
      todo = todoFunct(request)
      duka = todo['duka'] 
      deni = duka.usage +  duka.marketing
      data = {
        'success':True,
        'msg_swa':'Namna ya Malipo baada ya matumizi imewezeshwa kikamilifu',
        'msg_eng':'Post Payment usage plan has been enabled successfully'
      }
      if (float(duka.Balance) >= float(deni)) and (duka.bill_tobePaid < date.today() or deni == 0 ) and (malipo == 0 or malipo == 5000) and (masoko == 2000 or masoko == 5000 or masoko == 10000):
        duka.usage =   malipo
        duka.marketing =   masoko
        duka.bill_tobePaid = date.today() + timedelta(days=30)
        duka.Balance = float(float(duka.Balance) - float(deni))
        duka.save()
      else:
        data = {
            'success':False,
            'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
            'msg_eng':'The  Action was not successfully please try again correctly'
        }   
      return JsonResponse(data)    

    except:
      data = {
        'success':False,
         'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
        'msg_eng':'The  Action was not successfully please try again correctly'       
      }  

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def OngezaStoku(request):
     if request.method == "POST":
       try:

                dukajina=request.POST.get('name')
                mtaa = int(request.POST.get('mtaa'))
                makazi = request.POST.get('makazi')
                malipo = int(request.POST.get('malipo'))
                masoko = int(request.POST.get('masoko'))
                slogan = request.POST.get('slogan')
                edit = int(request.POST.get('edit',0))


                kitaa = Mitaa.objects.get(pk=mtaa)

                todo = todoFunct(request)
                duka = todo['duka']



                data={
                            'success':True,
                            'msg_swa':'Umefanikiwa kubadilisha taarifa za Karakana',
                            'msg_eng':'Enterprise Info Changed successfully'
                        }  

                           
                if not bool(edit):
                    if (malipo == 0 or malipo == 5000) and (masoko == 0 or masoko == 2000 or masoko == 5000 or masoko == 10000):
                        uniq_name=dukajina.partition(' ')[0]
                        def uniqName(n):
                            name = ''
                            if n < 10: 
                                name=uniq_name.lower()+'0'+str(n)
                            else:
                                name=uniq_name.lower()+str(n)          
                            if Interprise.objects.filter(Intp_code=name).exists():
                                return uniqName(n+10)
                            else:
                                return name  

                        data={
                                'success':True,
                                'msg_eng':'Umefanikiwa kuongeza tawi jipya la biashasra',
                                'msg_eng':'New branch added successfully'
                            }

                        if not Interprise.objects.filter(name=dukajina).exists():

                            ent = Interprise.objects.create(
                            name = dukajina,
                            slogan = slogan,

                            mtaa = kitaa,
                            owner = duka.owner,
                            Interprise = 1,
                            created = date.today(),
                            countryCode=kitaa.kata.wilaya.mkoa.kanda.nchi.code,
                            jengo = makazi,
                            currencii=kitaa.kata.wilaya.mkoa.kanda.nchi.currencii,
                            Intp_code = uniqName(random.randint(1,10)),
                            bill_tobePaid = date.today() + timedelta(days=60),
                            usage = int(malipo),
                            marketing = int(masoko)

                            )

                            userEntp = Interprise.objects.get(owner__user=request.user,Interprise=False)

                            usrent=user_Interprise()
                            usrent.Interprise = userEntp
                            usrent.save()
                    

                            entp = InterprisePermissions()
                            entp.user = UserExtend.objects.get(user=request.user) 
                            entp.user_entp=usrent
                            entp.owner = True
                            entp.Allow = True
                            entp.discount = True
                            entp.profile = True
                            entp.picDescription = True
                            entp.codeChange = True
                            entp.ProfitView = True
                            entp.Interprise = ent
                            entp.default = False
                            entp.cheo = "Admin"
                            entp.addsupplier = True
                            entp.addproduct = True
                            # entp.addparentCat = True
                            # entp.addaina = True
                            # entp.addKampuni = True           
                            entp.admin = request.user.id

                            payA = PaymentAkaunts()
                            payA.Interprise=ent
                            payA.Akaunt_name = dukajina + ' cash'
                            payA.Amount = 0
                            payA.owner = request.user
                            payA.onesha = True
                            payA.aina = "Cash"
                            payA.addedDate = datetime.datetime.now(tz=timezone.utc)


                            payAp = staff_akaunt_permissions()
                            payAp.Akaunt = payA
                            payAp.user = request.user
                            payAp.Allow = True
                            payAp.owner = True


                        

                            entp.save()
                            payA.save()
                            payAp.save()   
                    else:
                        data = {
                            'success':False
                        }    
                else:
                    if duka.owner.id == todo['useri'].id:
                        duka.name = dukajina    
                        duka.mtaa = kitaa    
                        duka.slogan = slogan    
                        duka.makazi = makazi    
                        duka.save()
                    else:
                        data ={
                            'success':False,
                            'msg_swa':'Hauna ruhusa ya kubadili vielelezo vya biashara/karakana',
                            'msg_eng':'You have no permission to change enterprise details',
                        }
                return JsonResponse (data)  
       except:   


            data={
                    'success':False,
                    'message_swa':'Operation haikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
                    'message_eng':'The oparation was not succefully please try again'
                }
           

            return JsonResponse (data)

     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def OngezaAina(request):
     if request.method == "POST":
         name=request.POST.get('aina')
         mahi=request.POST.get('mahi')
         edit=int(request.POST.get('edit'))
         val=int(request.POST.get('value'))
         newP = int(request.POST.get('newP'))
         selPPc = int(request.POST.get('selPPc'))
         newPc=request.POST.get('newPc')

         try:
             todo = todoFunct(request)
             duka = todo['duka']

             ent=InterprisePermissions.objects.get(user__user=request.user,default=True)
             if ent.owner or ( ent.addproduct and not ent.viewi) :
                aina=bidhaa_aina()

                Pcateg = mahitaji()
                if not newP:
                     Pcateg = mahitaji.objects.get(pk=mahi)
                else:
                    ainamam = ainaMama.objects.get(pk=selPPc)
                
                    
                    otherPc = mahitaji.objects.filter(mahitaji__icontains=newPc,Interprise=duka.id)
                    if otherPc.exists():
                        Pcateg = otherPc.last()
                    else:  

                        Pcateg.Interprise = duka
                        Pcateg.mahitaji = newPc
                        Pcateg.aina = ainamam
                        Pcateg.save()



                if edit and val>0:
                    aina = bidhaa_aina.objects.get(pk=val,Interprise__owner=duka.owner.id)
                    jina = aina.aina
                    group = aina.mahi
                    
                    
                    if str(jina) != str(name) or str(group.id) != str(mahi):
                        ItmEdit = bidhaaA_edit()
                        ItmEdit.aina = aina
                        
                        ItmEdit.nameEdit = not (str(name)==str(jina))
                        ItmEdit.categEdit = not (str(mahi)==str(group.id))

                        ItmEdit.former_name = jina
                        ItmEdit.current_name = name
                        ItmEdit.former_group = group   

                        if str(aina.id) != str(mahi): 
                            newAina = now_group()   
                            newAina.new_group = Pcateg   
                            newAina.save() 
                            ItmEdit.new_group = newAina   


                        ItmEdit.save()  

                        # Record Notiications for cange initem name and category ......................................//
                        notice = Notifications()
                        notice.Interprise = duka
                        notice.date= datetime.datetime.now(tz=timezone.utc)
                        notice.ItemCatEdit= True
                        notice.ItemCat_map= ItmEdit
                        if duka.owner.user.id == request.user.id:
                            notice.admin_read = True
                        else:
                            notice.Incharge_reade = True
                            
                        notice.Incharge = todoFunct(request)['useri']    
                        notice.save()




                aina.Interprise = InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
                aina.aina = name

                aina.mahi = Pcateg
              
                if bidhaa_aina.objects.filter(aina=name,Interprise=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise).exists():
                    data={
                        'success':False,
                        'swa':'Tayari kuna aina ya bidhaa yenye jina kama hili',
                        'eng':'The same product Category name  exists'
                    }

                else:
                    aina.save()    
                    data={
                        'success':True,
                        'swa':'Aina ya  bidhaa imeongezwa kikamilifu',
                        'eng':'new Product category added successfully'                    
                    }
                return JsonResponse(data) 
             else:
                data={
                    'success':False,
                    'swa':'Hauna ruhusa ya kuongeza aina ya bidhaa tafadhari wasiliana na uongozi wako',
                    'eng':'You have no permission to add product category please contact your admin'
                }  

                return JsonResponse(data)
         except:
             data={
                 'success':False,
                 'swa':'Aina ya bidhaa haikufanikiwa kuongezwa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                 'eng':'The oparation was not successfully please try again'
             } 
             return JsonResponse(data)    
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def futaAina(request):
     if request.method == "POST":

         try:
             todo = todoFunct(request)
             duka = todo['duka']
             val=request.POST.get('val',0)
             data={
                        'success':True,
                        'message_swa':'Aina ya  bidhaa imeongezwa kikamilifu',
                        'message_eng':'new Product category added successfully'                    
                    }
             ent=InterprisePermissions.objects.get(user__user=request.user,default=True)
             if ent.owner or ( ent.addproduct and not ent.viewi) :
                  ain = bidhaa_aina.objects.filter(pk=val,Interprise=duka.id) 
                  if  ain.exists():
                      itms=bidhaa.objects.filter(bidhaa_aina=ain.last().id)
                      
                      if not itms.exists(): 
                        ain.delete()
                      else:
                          data={
                               'success':False,
                                'message_swa':'Aina ya bidhaa haikufanikiwa kuondolewa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                                'message_eng':'The oparation was not successfully please try again'
                      
                          }  
                  else:
                      data={
                          'success':False,
                          'message_swa':'Aina ya bidhaa haikufanikiwa kuondolewa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                          'message_eng':'The oparation was not successfully please try again'
                      }    
                
 
             else:
                data={
                    'success':False,
                    'message_swa':'Hauna ruhusa ya kuongeza/kupunguza aina ya bidhaa tafadhari wasiliana na uongozi wako',
                    'message_eng':'You have no permission to add/remove product category please contact your admin'
                }  

             return JsonResponse(data)
         except:
             data={
                 'success':False,
                 'message_swa':'Aina ya bidhaa haikufanikiwa kuongezwa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                 'message_eng':'The oparation was not successfully please try again'
             } 
             return JsonResponse(data)    
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def futaSup(request):
     if request.method == "POST":

         try:
             todo = todoFunct(request)
             duka = todo['duka']
             val=request.POST.get('val',0)
             data={
                        'success':True,
                        'message_swa':'Taarifa za msambazaji zimeongezwa kikamilifu',
                        'message_eng':'Supplier info was added successfully'                    
                    }
             ent=InterprisePermissions.objects.get(user__user=request.user,default=True)
             if ent.owner or ( ent.addproduct and not ent.viewi) :
                  sup = wasambazaji.objects.filter(pk=val,owner=duka.owner.user.id) 
                  if  sup.exists():
                      itms=bidhaa_stoku.objects.filter(msambaji=sup.last().id)
                      
                      if not itms.exists(): 
                        sup.delete()
                      else:
                          data={
                               'success':False,
                                'message_swa':'msambazaji hakufanikiwa kuondolewa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                                'message_eng':'The oparation was not successfully please try again'
                      
                          }  
                  else:
                      data={
                          'success':False,
                          'message_swa':'msambazaji hakufanikiwa kuondolewa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                          'message_eng':'The oparation was not successfully please try again'
                      }    
                
 
             else:
                data={
                    'success':False,
                    'message_swa':'Hauna ruhusa ya kuongeza/kuondoa vielelezo vya bidhaa tafadhari wasiliana na uongozi wako',
                    'message_eng':'You have no permission to add/remove items attributes please contact your admin'
                }  

             return JsonResponse(data)
         except:
             data={
                 'success':False,
                 'message_swa':'Msambazaji hakufanikiwa kuongezwa kutokana na hitilafu. Tafadhari jaribu tena kwa ukamilifu',
                 'message_eng':'The oparation was not successfully please try again'
             } 
             return JsonResponse(data)    
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def sambazaji(request):

     if request.method == "POST":
        try: 
             todo = todoFunct(request)
             duka = todo['duka']
             intp = todo['cheo']

             if (intp.addsupplier and not intp.viewi) or intp.owner :  

                name=request.POST.get('jina')
                address=request.POST.get('adress')
                code=request.POST.get('code')
                simu1=request.POST.get('simu1')
                simu2=request.POST.get('simu2')
                mail=request.POST.get('mail')
                isActive=request.POST.get('isactive')
                value=request.POST.get('value')
                valn=request.POST.get('valn')
                edit=int(request.POST.get('edit',0))

                

                sambaza=wasambazaji()

                todo = todoFunct(request)
                duka = todo['duka']
 
                saji = wasambazaji.objects.filter(pk=valn,owner=duka.owner.user)
      
                if bool(int(isActive)) and not saji.exists:
                    V_intp= Interprise.objects.get(pk=value)
                    name=V_intp.name
                    simu1=User.objects.get(pk=V_intp.owner.user.id).username
                    sambaza.owner = User.objects.get(pk=intp.admin)
                    sambaza.jina = V_intp.name
                    sambaza.address = address
                    sambaza.code = V_intp.countryCode
                    sambaza.simu1 = simu1
                    sambaza.simu2 = simu2
                    sambaza.email = mail
                    sambaza.active = True
                    sambaza.where = V_intp

                else:
                    if saji.exists() and edit:
                        sambaza = saji.last()
                    sambaza.owner = duka.owner.user
                    sambaza.jina = name
                    sambaza.address = address
                    sambaza.code = code
                    sambaza.simu1 = simu1
                    sambaza.simu2 = simu2
                    sambaza.email = mail
                    
                if wasambazaji.objects.filter(jina=name,owner=intp.admin,simu1=simu1).exists() and not edit:
                    data={
                        'success':False,
                        'message_swa':'Tayari kuna Msambazaji mwingine mwenye jina kama hili kama ni mwinginae unaweza kubadili jina au ondoa taarifa za msambazaji zilizowekwa awali',
                        'message_eng':'The same  Vendor name  exists you can change the name or remove the previos saved vendor details'
                    
                    }

                else:
                    sambaza.save()    
                    data={
                        'success':True,
                        'message_swa':'Taarifa za msambazaji zimehifadhiwa kikamilifu',
                        'message_eng':'new Vendor added successfully'
                        
                    }
                return JsonResponse(data)  
             else:
                 data={
                     'success':False,
                     'message_swa':'Hauna ruhusa ya kuongeza bidhaa kwa sasa tafadhari wasiliana na uongozi wako kupata ruhusa',
                     'message_eng':'You have no permission to add vendor please contact your administrator',
                 } 
                 return JsonResponse(data)    
        except:
             data={
                 'success':False,
                 'message_swa':'Taarifa za msambazaji hazijahifadhiwa kutokana na hitilafu. tafadhari jaribu tena kuweka data kwa usahihi',
                 'message_eng':'vendor info was not successfully saved. Please try again to fill correct vendor informations'
             }
             return JsonResponse(data)          
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def mteja(request):
     if request.method == "POST":
        try: 
             intp= InterprisePermissions.objects.get(user__user=request.user,default=True)

             if (intp.addsupplier and not intp.viewi) or intp.owner :  

                name=request.POST.get('jina')
                address=request.POST.get('adress')
                code=request.POST.get('code')
                simu1=request.POST.get('simu1')
                simu2=request.POST.get('simu2')
                mail=request.POST.get('mail')
                isActive=request.POST.get('isactive')
                value=request.POST.get('value')
                edit=int(request.POST.get('edit',0))
                valued=int(request.POST.get('valued',0))

                

                teja=wateja()
                wtj = wateja.objects.filter(pk=valued,Interprise__owner=intp.Interprise.owner.id)
                if edit and wtj.exists():
                    teja = wtj.last()
                else:
                    teja.Interprise = intp.Interprise 
               
                if bool(int(isActive)):
                    V_intp= Interprise.objects.get(pk=value)
                    name=V_intp.name

                    actv = wateja_active()
                    actv.user = V_intp
                    actv.save()

                    teja.jina = V_intp.name
                    teja.active = True
                    teja.mteja = actv

                else:
                    
                    teja.jina = name
                    
                teja.address = address
                teja.code = code
                teja.simu1 = simu1
                teja.simu2 = simu2
                teja.email = mail
                    
                if wateja.objects.filter(jina=name,Interprise=intp.Interprise.id,simu1=simu1).exists() and not edit:
                    data={
                        'success':False,
                        'message_swa':'Tayari kuna Mteja mwingine mwenye jina kama hili kama ni mwinginae unaweza kubadili jina au ondoa taarifa za mteja zilizowekwa awali',
                        'message_eng':'The same  Customer name  exists you can change the name or remove the previos saved Customer details'
                    
                    }

                else:
                    teja.save()    
                    data={
                        'success':True,
                        'message_swa':'Taarifa za mteja zimehifadhiwa kikamilifu',
                        'message_eng':'new Customer added successfully'
                        
                    }
                return JsonResponse(data)  
             else:
                 data={
                     'success':False,
                     'message_swa':'Hauna ruhusa ya kuongeza mteja kwa sasa tafadhari wasiliana na uongozi wako kupata ruhusa',
                     'message_eng':'You have no permission to add Customer please contact your administrator',
                 } 
                 return JsonResponse(data)    
        except:
             data={
                 'success':False,
                 'message_swa':'Taarifa za mteja hazijahifadhiwa kutokana na hitilafu. tafadhari jaribu tena kuweka data kwa usahihi',
                 'message_eng':'Customer info was not successfully saved. Please try again to fill correct Customer informations'
             }
             return JsonResponse(data)          
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

# supplier & Customer autocomplete fill up
@login_required(login_url='login')
def autocomplete(request):
    if  request.method=="GET":
        intp=InterprisePermissions.objects.get(user__user=request.user.id, default=True)
        sup=Interprise.objects.filter(Intp_code__istartswith=request.GET.get('term')).exclude(owner__user=intp.admin)
        cod=list()
        # data=dict()
        # data['list']=cod
        for cd in sup:
            cod.append(cd.Intp_code)
        return JsonResponse(cod,safe=False) 

#get vender after selecting autocomplete
def getVendor(request):
    if request.method=="POST":
        ven = list(Interprise.objects.filter(Intp_code = request.POST.get('value')).annotate(phone=F('owner__simu1'),mkoa=F('mtaa__kata__wilaya__mkoa__mkoa'),wilaya=F('mtaa__kata__wilaya__wilaya'),mtaaN=F('mtaa__mtaa')).values('id','phone','name','mkoa','wilaya','mtaaN','countryCode'))
        data=dict()
        data['vendor']=ven
        return JsonResponse(data)
    else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def allowFractions(request):
    if request.method == "POST": 
        try:
            idk=request.POST.get('value') 
            todo = todoFunct(request)
            duka = todo['duka']
            cheo = todo['cheo']
            allow = int(request.POST.get('prop')) 

            if cheo.product_edit or duka.owner == todo['useri']:
                biz=bidhaa.objects.filter(pk=idk,owner=duka.owner.user.id)
                if biz.exists():
                    biz.update(fractions=allow)
                    data = {
                        'success':True,
                        'msg_swa':'Idadi kwa sehemu imewezeshwa kwa '+  biz.last().bidhaa_jina,
                        'msg_eng':'Quantity by fraction was enabled successfull for  '+  biz.last().bidhaa_jina
                    }                    
                    if not allow:
                        data ={
                              'success':True,
                            'msg_swa':'Idadi kwa sehemu Imeondolewa kwa '+  biz.last().bidhaa_jina,
                            'msg_eng':'Quantity by fraction was disabled successfull for  '+  biz.last().bidhaa_jina
                    
                        }


                    return JsonResponse(data)

        except:
            data={
                'success':False,
                'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                'msg_eng':'Operation was not successfully please try again',
            }
            return JsonResponse()    
    else:
       return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def EditBidhaa(request):
    if request.method == "POST": 

        try:
            idk=request.POST.get('value')
            name=request.POST.get('Jina')
            produaina=request.POST.get('Aina')
            Chapa=request.POST.get('Chapa')
            sambazaji=request.POST.get('Msambazaji')
            Bei=request.POST.get('Bei')
            # zibaki=request.POST.get('zibaki')
            # punguzo=request.POST.get('punguzo')
            maelezo=request.POST.get('maelezo')
            vipimo_jum=request.POST.get('vipimo_jum')
            Bei_reja=request.POST.get('Bei_reja')
            uwiano=int(request.POST.get('uwiano'))
            vipimo_reja=request.POST.get('vipimo_reja')
            sirio=request.POST.get('sirio')
            namba=request.POST.get('namba')
            material=int(request.POST.get('material',0))

            todo=todoFunct(request)
            duka = todo['duka']
            entp=todo['cheo']
            if uwiano == 1:
                Bei_reja=Bei

            if entp.owner or ( entp.product_edit and not entp.viewi ):

                produ = bidhaa_stoku.objects.get(pk=idk,Interprise=duka.id)
                # produi=bidhaa(pk=produ.bidhaa) 
                item = bidhaa.objects.filter(pk=produ.bidhaa.id)

                jina = produ.bidhaa.bidhaa_jina
                aina = produ.bidhaa.bidhaa_aina

                # Notifications.objects.filter(Interprise=duka.id,ItemEdit=True).delete()
                if str(jina) != str(name) or str(aina.id) != str(produaina):
                    ItmEdit = bidhaa_edit()
                    ItmEdit.prod = produ.bidhaa
                    
                    ItmEdit.nameEdit = not (str(name)==str(jina))
                    ItmEdit.categEdit = not (str(produaina)==str(aina.id))

                    ItmEdit.former_name = jina
                    ItmEdit.current_name = name
                    ItmEdit.former_Categ = aina   

                    if str(aina.id) != str(produaina): 
                        newAina = now_categ()   
                        newAina.new_Categ = bidhaa_aina.objects.get(pk=produaina)   
                        newAina.save() 
                        ItmEdit.new_Categ = newAina   


                    ItmEdit.save()  

                     # Record Notiications for cange initem name and category ......................................//
                    notice = Notifications()
                    notice.Interprise = duka
                    notice.date= datetime.datetime.now(tz=timezone.utc)
                    notice.ItemEdit= True
                    notice.Item_map= ItmEdit
                    if duka.owner.user.id == request.user.id:
                        notice.admin_read = True
                    else:
                        notice.Incharge_reade = True
                        
                    notice.Incharge = todoFunct(request)['useri']    
                    notice.save()




                item.update(bidhaa_jina = name,bidhaa_aina = bidhaa_aina.objects.get(pk=produaina),
                    kampuni  =makampuni.objects.get(pk=Chapa),vipimo_jum  =vipimo_jum,vipimo  =vipimo_reja,
                    maelezo =maelezo,namba=namba,material = material
                    )


                
                produ.Bei_kuuza_jum  =Bei
                produ.sirio  = sirio
                produ.Bei_kuuza  =Bei_reja
                produ.save()


                    


                
                
                data={
                    'success':True,
                    'message_swa':'Vielelezo vya bidhaa vimebadirishwa kikamilifu',
                    'message_eng':'Item details updated successfully',
                     'edt':True
                }
                return JsonResponse(data)
            else:
                data={
                    'success':False,
                    'message_swa':'Hauna ruhusa ya Kubadili taarifa za bidhaa kwa sasa. Tafadhari wasiliana na Uongozi wako',
                    'message_eng':'You have no permission to edit item. Please contact the admin'
                } 
                return JsonResponse(data)       
        except:   
            data={
                'success':False,
                'message_swa':'Vielelezo vya bidhaa havijabadirishwa kutokana na hitilafu Tafadhari jaribu tena kwa usahihi',
                'message_eng':'Error Item details was not  updated please try again correctly'
            }
            return JsonResponse(data) 
    else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def punguzaBidhaa(request):
    try:
        if request.method == "POST": 
            idk=request.POST.get('value')
            entp=InterprisePermissions.objects.get(user__user=request.user.id, default=True)
            duka = entp.Interprise

            if entp.owner or ( entp.proFduct_edit and not entp.viewi ):
                
                 
                produ=bidhaa_stoku.objects.get(pk=idk,Interprise = duka )
                produi=produ.bidhaa
                
                # check wether item is accompanied with sales transactions ..........................//
                if mauzoList.objects.filter(produ=produ.id).exists() or productChangeRecord.objects.filter(prod=produ.id).exists() or transferList.objects.filter(toka=produ.id).exists():
                    produ.inapacha =True
                    produ.save()
                    
                   
                else:    
                    if bidhaa_stoku.objects.filter(bidhaa=produi.id).count()>1:
                        produ.delete() 
                    else:    
                        produi.delete()

                # anyother = bidhaa_stoku.objects.filter(Interprise=duka,bidhaa=produi.id,idadi__gt=0).exclude(pk=produ.id)     
                # if anyother.exists():



                data={
                        'success':True,
                        'message_swa':'Bidhaa Imeondolewa',
                        'message_eng':'Item Data removed successfully'
                    }        
                return JsonResponse(data)
            else:

                    data={
                        'success':False,
                        'message_swa':'Hauna ruhusa ya Kuondoa bidhaa kwa sasa. Tafadhari wasiliana na Uongozi wako',
                        'message_eng':'You have no permission to remove item. Please contact the admin'
                    }
                    return JsonResponse(data)   
        else:
          return render(request,'pagenotFound.html',todoFunct(request))     
    
    except:
        data = {
            'success':False,
             'message_swa':'Bidhaa haikuondolewa kutokana na hitilafu',
            'message_eng':'Item was not removed please try again'
                   

        }
        return JsonResponse(data)   

@login_required(login_url='login')
def galamaManunuzi(request):
    
        if request.method == "POST":
            name=request.POST.get('gharama')
            
            try:
                if matumizi.objects.filter(matumizi=name,owner=InterprisePermissions.objects.get(user__user=request.user,default=True).user.user.id).exists():
                    swa='Jina la ghalama tayari lipo'
                    eng = 'Expese exists'

                    data={
                        'success':False,
                        'message_swa':swa,
                        'message_eng':eng
                    }
                else:
                    matum = matumizi()
                    matum.owner = User.objects.get(pk=InterprisePermissions.objects.get(user__user=request.user,default=True).admin)  
                    matum.matumizi=name
                    matum.save()
            
                data={
                            'success':True,
                            'message_swa':'Ghalama  imeongezwa',
                            'message_eng':'new Expense  added succeffuly'
                        }


                return JsonResponse(data)

            except:

                data={
                    'success':False,
                    'message_swa':'Ghalama mpya haikufanikiwa kuongezwa kutokana na hitilafu',
                    'message_eng':'new Expense was not  added please try again'
                    }

                return JsonResponse(data)
        
        else:
           return render(request,'pagenotFound.html',todoFunct(request))  

# USAJIRI WA BIDHAA..................................................................//
@login_required(login_url='login')
def registeredItemsRegister(request):
     if request.method == "POST":
       data ={
                        'success':True,
                        'message_swa':"Bidhaa Imeongezwa kikamilifu",
                        'message_eng':'Item added successfully'
                    }
       try:  
           val = request.POST.get('itm')
           sup = request.POST.get('sup')
           idr = int(request.POST.get('idr'))
           idj = int(request.POST.get('idj'))
           rangi = json.loads(request.POST.get('rangi'))
           todo = todoFunct(request)
           duka = todo['duka']

          
           item=bidhaa_stoku.objects.filter(pk=val,Interprise__owner=duka.owner.id)
           if item.exists():
               itm = item.last()
               if bidhaa_stoku.objects.filter(bidhaa = itm.bidhaa,Interprise=duka.id).exists():
                   data={
                         'success':False,
                     'message_swa':"Bidhaa Tayari imeshasajiriwa hivyo haitasajiriwa kwa mara nyigine",
                    'message_eng':'The item was already registered hence was not reistered any more '
              
                   }

               else:

                    # regist = ItemRegister()
                    # regist.qty = (float(itm.idadi_jum)*float(idj))+float(idr)
                    # regist.By = request.user
                    # regist.date = datetime.datetime.now(tz=timezone.utc)
                    # regist.save()


                    produStock =  bidhaa_stoku()
                    produStock.bidhaa=itm.bidhaa
                    produStock.idadi=(float(itm.bidhaa.idadi_jum)*float(idj))+float(idr)
                    # produStock.owner=User.objects.get(pk=intp.admin)
                    produStock.Interprise=duka
                    if wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id).exists():
                        produStock.msambaji = wasambazaji.objects.get(pk=sup)
                    else:    
                        produStock.msambaji = itm.msambaji

                    produStock.Bei_kununua=itm.Bei_kununua
                    produStock.Bei_kuuza=itm.Bei_kuuza
                    produStock.Bei_kuuza_jum=itm.Bei_kuuza_jum
                    produStock.op_name = UserExtend.objects.get(user=request.user)
                    produStock.expire_date = itm.expire_date
                    produStock.sirio=itm.sirio
                    produStock.tanguliziwa=0
                    
                    produStock.save()
                    itm={
                            "itm":produStock,
                            "request":request,
                            "out":False
                            }

                    updateOrder(itm)

                    adjno = 1
                    if stokAdjustment.objects.filter(Interprise=duka.id).exists():
                                adj_no = stokAdjustment.objects.filter(Interprise=duka.id).last()      
                                adjno = adj_no.code_num

                    if adjno <10:
                            adj_str = '000'+str(adjno)
                    elif adjno <100 and adjno >=10:
                            adj_str = '00' +str(adjno)    
                    elif adjno <1000 and adjno >=100:
                            adj_str = '0' +str(adjno)    
                    elif adjno <10000 and adjno >=1000:
                            adj_str =str(adjno)


                    adj = stokAdjustment()
                    adj.Interprise = duka
                    adj.date = datetime.datetime.now(tz=timezone.utc)
                    adj.Recodeddate = date.today()
                    adj.code = adj_str
                    adj.code_num = adjno + 1
                    adj.Na = todo['cheo']
                    adj.registered = True
                    if (float(itm.bidhaa.idadi_jum)*float(idj))+float(idr) > 0:
                        adj.Ongezwa  = True
                    adj.save()    


                    
                    reg = productChangeRecord()
                    reg.prod = produStock  
                    reg.qty =  (float(itm.bidhaa.idadi_jum)*float(idj))+float(idr)      
                    reg.adjst = adj    
                 
                    reg.save()


                    if len(rangi) > 0:
                    
                        for r in rangi:
                            rang = color_produ()  
                            color = produ_colored()
                            recC = received_color()
                            recC.qty 
                            
                            if color_produ.objects.filter(pk=r['val'],bidhaa__owner=duka.owner.user.id).exists():
                                rang = color_produ.objects.filter(pk=r['val'],bidhaa__owner=duka.owner.user.id).last()
                            else:
                                rang.color_code = r['color_code']
                                rang.color_name = r['color_name']
                                rang.nick_name = r['other_name']
                                rang.colored = True
                                rang.bidhaa = itm.bidhaa
                                rang.save()
                            
                            color.bidhaa=produStock
                            color.color=rang
                            color.Interprise=duka
                            color.idadi=(float(itm.bidhaa.idadi_jum)*float(r['idadi_jum']))+float(r['idadi_rej'])
                            color.owner = duka.owner.user
                            color.save()

                            regC = ColorChange()
                            regC.change = reg
                            regC.color = color
                            regC.qty = float(color.idadi)
                            regC.save()



                            if len(r['sized']) > 0:
                                idd=0 

                                for s in r['sized']:
                                    szs = sizes()
                                    szd = produ_size() 
                                    if sizes.objects.filter(pk=s['val'],color=rang.id).exists():
                                        szs=sizes.objects.filter(pk=s['val'],color=rang.id).last()
                                    else: 
                                        szs.size = s['size']
                                        szs.color =  rang 
                                        szs.save()

                                    szd.bidhaa = produStock
                                    szd.sized = szs
                                    szd.Interprise = duka
                                    szd.idadi = (float(itm.bidhaa.idadi_jum)*float(s['idadi_jum']))+float(s['idadi_rej'])
                                    szd.owner = duka.owner.user
                                    szd.save()

                                    regS = SizeChange()
                                    regS.size = szd
                                    regS.color = regC
                                    regS.qty = float(szd.idadi)
                                    regS.save()

                                    idd+=szd.idadi

                                color.idadi=idd
                                color.save()
                                regC.qty=idd
                                regC.save()

                            rang.idadi = r['other_name']

           else:
               data={
                   'success':False,
                     'message_swa':"Bidhaa haijaongezwa kutokana na bidhaa iliyo chaguliwa kutotambulika kuwepo kwenye tawi lolote",
                    'message_eng':'The item selected was not found in any of owner branch '
               }




       except:
            data={
                    'success':False,
                     'message_swa':"Bidhaa haijaongezwa kutokana Hitilafu",
                    'message_eng':'Item was not added please try again '
            
            }

       return JsonResponse(data)
     else:   
           return render(request,'pagenotFound.html',todoFunct(request))  

# USAJIRI WA BIDHAA..................................................................//
@login_required(login_url='login')
def saveItmAttr(request):
     if request.method == "POST":
       try:  
            setAttr=request.POST.get('itmAttr')
            isSet=int(request.POST.get('AttrSet'))
            itm = int(request.POST.get('itm'))

            todo = todoFunct(request)
            duka = todo['duka']
            cheo = todo['cheo']

            data = {
                'success':True,
                'msg_swa':'Kielelezo cha bidhaa/huduma kimebadilishwa kikamilifu',
                'msg_eng':'Item/service attribute changed successfully'
            }

            if cheo.product_edit or cheo.owner :
               item = bidhaa.objects.get(pk=itm,owner=duka.owner.user)
               if isSet:
                   item.colorAttr = setAttr
               else:
                   item.colorAttr  = None 
               item.save()      
            else:
                  data={
                         'success':False,
                        'msg_swa':'Hauna Ruhusa ya kufanya oparesheni hii kwa sasa ',
                        'msg_eng':'You have no permission for stock adjustments'
                    }   

            return JsonResponse(data)   

       except:
             data={
                'success':False,
                'message_swa':'Taarifa za bidhaa hazijaongezwa kutokana na hitilafu Tafadhari jaribu tena kwa ukamilifu',
                'message_eng':'Item info not added. Please try again to fill correct item detail'
            }
             return JsonResponse(data) 
     else:
           return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def ongezaBidhaa(request):
     if request.method == "POST":
       try:  
          intp=InterprisePermissions.objects.get(user__user=request.user,default=True)
          if intp.owner or (intp.addproduct and not intp.viewi) :
            seltax=int(request.POST.get('saleWithtax'))
            putax=int(request.POST.get('puchWithtax'))
            name=request.POST.get('jina')
            sambazaji=request.POST.get('sambazaji')
            idadi=int(request.POST.get('idadi'))
            vipimo_jum=request.POST.get('vipimo_jum')
            code=request.POST.get('code')
            kampuni=request.POST.get('kampuni')
            sambazaji=request.POST.get('sambazaji')
            kuuza_reja=request.POST.get('kuuza_reja')
            ainai=request.POST.get('aina')
            kununua=int(request.POST.get('kununua'))
            kuuza_jum=request.POST.get('kuuza_jum')
            # punguzo=request.POST.get('punguzo')
            pimoreja=request.POST.get('pimoreja')
            uwiano=int(request.POST.get('uwiano'))
            # stoku_nje=int(request.POST.get('stoku_nje'))
            # stoku_name=request.POST.get('stoku_name')
            # idadi_stocku=int(request.POST.get('idadi_stocku'))
            maelezo=request.POST.get('maelezo')
            expire=request.POST.get('expire')
            malipo=request.POST.get('malipo')
            bei_reja=int(request.POST.get('bei_reja'))
            idadi_reja=int(request.POST.get('idadi_reja'))
            rangi=json.loads(request.POST.get('rangi'))
            namba=request.POST.get('namba')
            material=int(request.POST.get('material'))
            new=request.POST.get('new')
            colorAttr = request.POST.get('colorAttr')
            thereColorAttr = int(request.POST.get('thereIsColorAttr'))

            service = int(request.POST.get('service'))
            timel = int(request.POST.get('timeP'))

            tarehe_ya_manunuzi=request.POST.get('tarehe')
            stoku_idadi=0
            stoku_id=0

            colored_id = []


            if not expire:
                expire = None


            idadi=idadi_reja + (idadi*uwiano)


            produ=bidhaa()
            produStock=bidhaa_stoku() 
            # regist = ItemRegister()

            todo = todoFunct(request)    
            duka =  todo['duka']


            if not bidhaa.objects.filter(bidhaa_jina=name,owner=duka.owner.user.id).exists():
                 

                produ.kampuni=makampuni.objects.get(pk=kampuni)
                produ.bidhaa_aina=bidhaa_aina.objects.get(pk=ainai)
                produ.idadi_jum=float(uwiano)
                # produ.mwisho_pungu=punguzo
                produ.Mahi=mahitaji.objects.get(pk=bidhaa_aina.objects.get(pk=ainai).mahi.id)
                produ.change_date=datetime.datetime.now(tz=timezone.utc)
                produ.maelezo = maelezo
                produ.vipimo = pimoreja
                produ.vipimo_jum = vipimo_jum
                produ.bidhaa_jina = name
                produ.saletaxInluded = seltax
                produ.purchtaxInluded = putax
                produ.namba = namba
                produ.material = material
                produ.owner = User.objects.get(pk=intp.admin)
                if thereColorAttr:
                    produ.colorAttr = colorAttr

                # regist.qty = idadi
                # regist.By = request.user
                # regist.date = datetime.datetime.now(tz=timezone.utc)
                # regist.save()

                produStock.bidhaa=produ
                produStock.idadi=idadi
                # produStock.owner=User.objects.get(pk=intp.admin)
                produStock.Interprise=intp.Interprise
                if wasambazaji.objects.filter(pk=sambazaji).exists():
                    produStock.msambaji = wasambazaji.objects.get(pk=sambazaji)
                produStock.Bei_kununua=kununua
                produStock.Bei_kuuza=kuuza_reja
                produStock.Bei_kuuza_jum=kuuza_jum
                produStock.op_name = UserExtend.objects.get(user=request.user)
                produStock.expire_date = expire
                produStock.sirio=code
                produStock.tanguliziwa=0
                produStock.service=service
                produStock.timely=timel
                # produStock.ongezwa=regist

                adj = stokAdjustment()
                adjno = 1
                if stokAdjustment.objects.filter(Interprise=duka.id).exists():
                            adj_no = stokAdjustment.objects.filter(Interprise=duka.id).last()      
                            adjno = adj_no.code_num
                produ.save()

                if adjno <10:
                        adj_str = '000'+str(adjno)
                elif adjno <100 and adjno >=10:
                        adj_str = '00' +str(adjno)    
                elif adjno <1000 and adjno >=100:
                        adj_str = '0' +str(adjno)    
                elif adjno <10000 and adjno >=1000:
                        adj_str =str(adjno)  

                adj.Interprise = duka
                adj.date = datetime.datetime.now(tz=timezone.utc)  
                adj.code = adj_str
                adj.code_num = adjno + 1
                adj.Na = todo['cheo']
                adj.registered = True
                if idadi > 0:
                    adj.Ongezwa = True
                adj.save() 


                produStock.ongezwa=adj
                produStock.save()


 


                reg = productChangeRecord()
                reg.prod = produStock  
                reg.qty =  idadi     
                reg.adjst =  adj     

                reg.save()


                if len(rangi) > 0:
                    for r in rangi:
                         rang = color_produ()  
                         color = produ_colored()
                         
                         rang.color_code = r['color_code']
                         rang.color_name = r['color_name']
                         rang.nick_name = r['other_name']
                         rang.colored = True
                         rang.bidhaa = produ
                         rang.save()
                         
                         color.bidhaa=produStock
                         color.color=rang
                         color.Interprise=duka
                         color.idadi=(float(produ.idadi_jum)*float(r['idadi_jum']))+float(r['idadi_rej'])
                         color.owner = duka.owner.user
                         color.save()
                         
                         regC = ColorChange()
                         regC.change = reg
                         regC.color = color
                         regC.qty = float(color.idadi)
                         regC.save()

                         colored_id.append({
                             'pos':r['pos'],
                             'id':color.id
                         })


                         if len(r['sized']) > 0:
                             idd=0 

                             for s in r['sized']:
                                 szs = sizes()
                                 szd = produ_size() 

                                 szs.size = s['size']
                                 szs.color =  rang 
                                 szs.save()

                                 szd.bidhaa = produStock
                                 szd.sized = szs
                                 szd.Interprise = duka
                                 szd.idadi = (float(produ.idadi_jum)*float(s['idadi_jum']))+float(s['idadi_rej'])
                                 szd.owner = duka.owner.user
                                 szd.save()
                                 regS = SizeChange()
                                 regS.size = szd
                                 regS.color = regC
                                 regS.qty = float(szd.idadi)
                                 regS.save()

                                 idd+=szd.idadi

                             color.idadi=idd
                             color.save()
                             regC.qty = idd
                             regC.save()

                         rang.idadi = r['other_name']

               
                

                
                data={
                        'success':True,
                        'message_swa':'Taarifa za bidhaa zimeongezwa kikamilifu',
                        'message_eng':'Item info added succeffuly',
                        'itm':produStock.id,
                        'Color':colored_id
                    }
                return JsonResponse(data) 
            else:
                data={
                    'success':False,
                    'message_swa':'jina la bidhaa tayari limeshawekwa. Tafadhari badili jina kama bidhaa hii ni tofauiti na bidhaa iliyoingizwa hapo awari',
                    'message_eng':'The same item name exists. Item info was not saved'
                }
                return JsonResponse(data)
          else:
              data={
                  'success':False,
                  'message_swa':'Hauna ruhusa ya kuongeza bidhaa kwa sasa tafadhari wasiliana na uongozi wako',
                  'message_eng':'You have no permission on this operation please contact your admin'
              }
              return JsonResponse(data)      
       except:
             data={
                'success':False,
                'message_swa':'Taarifa za bidhaa hazijaongezwa kutokana na hitilafu Tafadhari jaribu tena kwa ukamilifu',
                'message_eng':'Item info not added. Please try again to fill correct item detail'
            }
             return JsonResponse(data) 
     else:
           return render(request,'pagenotFound.html',todoFunct(request)) 

# USAJIRI KUTOKA MATAWI MENGINE............................//
@login_required(login_url='login')
def UsajiriTokaMatawi(request):
    todo = todoFunct(request)
    if todo['matawi'] > 0:
        if not todo['duka'].Interprise:
            return redirect('/userdash')
        else:  
            return render(request,'usajiri_toka_nje.html',todo)
    else:
         return redirect('bidhaapanel')

@login_required(login_url='login')
def kupunguzaBidhaa(request):  
    todo = todoFunct(request)
    duka = todo['duka']
    adjno = 1
    if stokAdjustment.objects.filter(Interprise=duka.id).exists():
                adj_no = stokAdjustment.objects.filter(Interprise=duka.id).last()      
                adjno = adj_no.code_num

    if adjno <10:
            adj_str = '000'+str(adjno)
    elif adjno <100 and adjno >=10:
            adj_str = '00' +str(adjno)    
    elif adjno <1000 and adjno >=100:
            adj_str = '0' +str(adjno)    
    elif adjno <10000 and adjno >=1000:
            adj_str =str(adjno)
    tumizi = matumizi.objects.filter(owner=duka.owner.user.id) 
    todo.update({
        'adjst':adj_str,
        'tumizi':tumizi,
    })        
    if not duka.Interprise:
        return redirect('/userdash')
    else:  
       return render(request,'Stokuadjustment.html',todo)

@login_required(login_url='login')
def kuongezaBidhaa(request):  
    todo = todoFunct(request)
    duka = todo['duka']
    adjno = 1
    if stokAdjustment.objects.filter(Interprise=duka.id).exists():
                adj_no = stokAdjustment.objects.filter(Interprise=duka.id).last()      
                adjno = adj_no.code_num

    if adjno <10:
            adj_str = '000'+str(adjno)
    elif adjno <100 and adjno >=10:
            adj_str = '00' +str(adjno)    
    elif adjno <1000 and adjno >=100:
            adj_str = '0' +str(adjno)    
    elif adjno <10000 and adjno >=1000:
            adj_str =str(adjno)

    todo.update({
        'adjst':adj_str
    })        
    if not duka.Interprise:
        return redirect('/userdash')
    else: 
      return render(request,'addStokuItems.html',todo)

@login_required(login_url='login')
def Zipungue(request):  
    if request.method == "POST":
        try:
                waste=int(request.POST.get('waste'))
                dimage=int(request.POST.get('dimage'))
                expire=int(request.POST.get('expire'))
                use=int(request.POST.get('use'))
                others=int(request.POST.get('others'))
                name = request.POST.get('matumizi')
                mpya = int(request.POST.get('newExp'))
                whch = request.POST.get('tumizi_id')
                #  fromStore=request.POST.get('kutokastoku')
                #  stoku_name=request.POST.get('stoku_name')
                desc=request.POST.get('desc')
                code=request.POST.get('code')
                tare=request.POST.get('date')
                itm=json.loads(request.POST.get('itm'))

                todo = todoFunct(request)
                duka = todo['duka']
                cheo = todo['cheo']


                if len(itm)>0 and ((cheo.stokAdjs and not cheo.viewi) or cheo.user == duka.owner)  :
                    adj = stokAdjustment()
        
                    adjno = 1
                    if stokAdjustment.objects.filter(Interprise=duka.id).exists():
                                adj_no = stokAdjustment.objects.filter(Interprise=duka.id).last()      
                                adjno = adj_no.code_num

                    if adjno <10:
                            adj_str = '000'+str(adjno)
                    elif adjno <100 and adjno >=10:
                            adj_str = '00' +str(adjno)    
                    elif adjno <1000 and adjno >=100:
                            adj_str = '0' +str(adjno)    
                    elif adjno <10000 and adjno >=1000:
                            adj_str =str(adjno)

                    adj.Interprise = duka        
                    adj.date = datetime.datetime.now(tz=timezone.utc)        
                    adj.Recodeddate = tare 
                    adj.code_num = adjno + 1 
                    adj.Na = todo['cheo']
                    adj.desc = desc
                    adj.haribika = dimage
                    adj.tumika = use
                    adj.expire = expire
                    adj.others = others
                    adj.potea = waste
                    adj.op = True
                    if code != ''  :   
                        adj.code = code  
                    else:    
                        adj.code = adj_str    

                    adj.save()

                    for it in itm:
                        pr=bidhaa_stoku.objects.filter(pk=it['val'],Interprise=duka.id)
                        prc =  productChangeRecord()  
                        if pr.exists() and (pr.last().idadi >= it['idadi'] or pr.last().produced.notsure ):
                            
                            if pr.last().produced:
                                if pr.last().produced.notsure:
                                    productionList.objects.filter(pk=pr.last().produced.id).update(qty=F('qty')+float(it['idadi']))
                                else:
                                    pr.update(idadi=F('idadi')-float(it['idadi']))    
                            else: 
                                pr.update(idadi=F('idadi')-float(it['idadi']))
                                any_other = bidhaa_stoku.objects.filter(bidhaa=pr.last().bidhaa,idadi__gt=0,inapacha=True).exclude(pk=pr.last().id)
                                if pr.last().idadi == 0 and any_other.exists():
                                    pr.update(inapacha=True)
                                    lany = any_other.last()
                                    lany.inapacha = False
                                    lany.save()
                                    itm={
                                         "itm":pr.last(),
                                          "request":request,
                                          "out":True,
                                          "other":lany
                                    }

                                    updateOrder(itm)

                                

                            prc.prod=pr.last()
                            prc.qty=float(it['idadi'])
                            prc.adjst=adj
                            prc.save()

                            if len(it['color'])>0:
                                for cl in it['color']:
                                    rang = produ_colored.objects.get(pk=cl['color'],Interprise=duka)
                                
                                    adj_c = ColorChange()
                                    adj_c.change = prc
                                    adj_c.color = rang
                                    adj_c.qty = float(cl['idadi'])
                                    adj_c.save()

                                    rang.idadi = float(rang.idadi) - float(cl['idadi'])
                                    rang.save()

                                    if len(it['size'])>0: 
                                        for sz in it['size']:
                                            if sz['color'] == cl['color']: 
                                                szd = produ_size.objects.get(pk=sz['size'])
                                                adj_sz = SizeChange()
                                                adj_sz.qty = float(sz['idadi'])
                                                adj_sz.color = adj_c
                                                adj_sz.size = szd
                                                adj_sz.save()
                                                szd.idadi=float(szd.idadi) - float(sz['idadi'])
                                                szd.save()
                    to_comfirm = InterprisePermissions.objects.filter(Interprise=duka.id)
                    if to_comfirm.exists():
                        for tn in to_comfirm:
                            comf = stockAdjst_confirm()
                            comf.userP = tn
                            comf.adjs = adj
                            comf.save()
                    stockAdjst_confirm.objects.filter(userP=todo['cheo'].id).update(confirmed=True,tarehe=datetime.datetime.now(tz=timezone.utc)) 
                    
                  
                  #MATUMIZI .......................................//
                    if (mpya or matumizi.objects.filter(pk=whch,owner=duka.owner.user).exists()):
                        if  mpya:
                            if matumizi.objects.filter(matumizi__istartswith=name,owner=duka.owner.user).exists():
                                matum = matumizi.objects.filter(matumizi__istartswith=name,owner=duka.owner.user).last()
                            else:
                                    matum = matumizi()
                                    matum.owner = duka.owner.user
                                    matum.matumizi = name
                                    matum.save()
                        else:
                            matum = matumizi.objects.get(pk=whch,owner=duka.owner.user)  

                        rec = rekodiMatumizi()
                        rec.Interprise=duka
                        rec.matumizi = matum 

                        amo = productChangeRecord.objects.filter(adjst=adj.id).aggregate(sumi=Sum(F("qty")*F('prod__Bei_kununua')/F('prod__bidhaa__idadi_jum'),output_field=FloatField()))['sumi']
                        
                        rec.tarehe = datetime.datetime.now(tz=timezone.utc)
                        rec.date = tare
                        rec.kiasi = float(amo)
                        rec.by = todo['cheo']
                        rec.maelezo = desc
                        rec.adjst = adj
                        
                        rec.save()
                    
                    data={
                        'bil':adj.id,
                        'success':True,
                        'msg_swa':'Bidhaa zimepunguzwa stoku',
                        'msg_eng':'Items reduced from stock'
                    }           

                    return JsonResponse(data)                 
                else:
                    data={
                         'success':False,
                        'msg_swa':'Hauna Ruhusa ya kufanya oparesheni hii kwa sasa ',
                        'msg_eng':'You have no permission for stock adjustments'
                    }   
                    return JsonResponse(data)
        except:
            data={
                'success':False,
                'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                'msg_eng':'The operation was not successfully please try again'
            }     

        return JsonResponse(data)    
    else:
        return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def Ziongezeke(request):  
    if request.method == "POST":
        try:
           
                nw=int(request.POST.get('nw'))
                sup=int(request.POST.get('sup',0))
                 #  fromStore=request.POST.get('kutokastoku')
                #  stoku_name=request.POST.get('stoku_name')
                desc=request.POST.get('desc')
                code=request.POST.get('code')
                tare=request.POST.get('date')
                itm=json.loads(request.POST.get('itm'))

                todo = todoFunct(request)
                duka = todo['duka']
                cheo = todo['cheo']


                if len(itm)>0 and ((cheo.stokAdjs and not cheo.viewi) or cheo.user == duka.owner)  :
                    adj = stokAdjustment()
        
                    adjno = 1
                    if stokAdjustment.objects.filter(Interprise=duka.id).exists():
                                adj_no = stokAdjustment.objects.filter(Interprise=duka.id).last()      
                                adjno = adj_no.code_num

                    if adjno <10:
                            adj_str = '000'+str(adjno)
                    elif adjno <100 and adjno >=10:
                            adj_str = '00' +str(adjno)    
                    elif adjno <1000 and adjno >=100:
                            adj_str = '0' +str(adjno)    
                    elif adjno <10000 and adjno >=1000:
                            adj_str =str(adjno)

                    adj.Interprise = duka        
                    adj.date = datetime.datetime.now(tz=timezone.utc)        
                    adj.Recodeddate = tare 
                    adj.code_num = adjno + 1 
                    adj.Na = todo['cheo']
                    adj.desc = desc
                    adj.Ongezwa = True
                    
                    adj.op = True
                    if code != ''  :   
                        adj.code = code  
                    else:    
                        adj.code = adj_str    

                    adj.save()

                    for it in itm:
                        pr=bidhaa_stoku.objects.filter(pk=it['val'],Interprise=duka.id)
                        prc =  productChangeRecord()  
                        lpr = pr.last()
                        if pr.exists() :
                            if nw:
                                npr = bidhaa_stoku()
                                
                                npr.bidhaa = lpr.bidhaa
                                npr.Interprise = duka
                                npr.idadi = float(it['idadi'])
                                supl = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
                                if supl.exists():
                                    npr.msambaji = supl.last()
                                npr.Bei_kununua = lpr.Bei_kununua
                                npr.Bei_kuuza = lpr.Bei_kuuza
                                npr.Bei_kuuza_jum = lpr.Bei_kuuza_jum
                                npr.op_name = todo['useri']
                                npr.sirio = lpr.sirio
                                npr.ongezwa = adj
                                npr.save()
                                lpr = npr
                                itm={

                                    "itm":npr,
                                    "request":request,
                                    "out":False
                                    }

                                updateOrder(itm)

                            else:
                                pr.update(idadi=F('idadi')+float(it['idadi']))

                            prc.prod=lpr

                            prc.qty=float(it['idadi'])
                            prc.adjst=adj
                            prc.save()

                            if len(it['color'])>0:
                                for cl in it['color']:
                                    rang = produ_colored.objects.get(pk=cl['color'],Interprise=duka)
                                    cQ = rang.idadi 
                                    if nw:
                                        lcl = rang
                                        rang = produ_colored()
                                        rang.bidhaa = lpr
                                        rang.color = lcl.color
                                        rang.Interprise = duka
                                        rang.owner = duka.owner.user
                                        cQ = 0
                                    rang.idadi = float(cQ) + float(cl['idadi'])
                                    rang.save()    

                                    adj_c = ColorChange()
                                    adj_c.change = prc
                                    adj_c.color = rang
                                    adj_c.qty = float(cl['idadi'])
                                    adj_c.save()
                                          


                                    if len(it['size'])>0: 
                                        for sz in it['size']:
                                            if sz['color'] == cl['color']: 
                                                szd = produ_size.objects.get(pk=sz['size'])
                                                sQ = szd.idadi
                                                if nw:
                                                    lszd = szd
                                                    sQ = 0
                                                    szd = produ_size()
                                                    szd.bidhaa = lszd.bidhaa
                                                    szd.sized = lszd.sized
                                                    szd.Interprise = duka
                                                    szd.owner = duka.owner.user

                                                szd.idadi=float(sQ) + float(sz['idadi'])
                                                szd.save()
                                                adj_sz = SizeChange()
                                                adj_sz.qty = float(sz['idadi'])
                                                adj_sz.color = adj_c
                                                adj_sz.size = szd
                                                adj_sz.save()

                                         
                    to_comfirm = InterprisePermissions.objects.filter(Interprise=duka.id)
                   
                    if to_comfirm.exists():
                        for tn in to_comfirm:
                            comf = stockAdjst_confirm()
                            comf.userP = tn
                            comf.adjs = adj
                            comf.save()

                    stockAdjst_confirm.objects.filter(userP=todo['cheo'].id).update(confirmed=True,tarehe=datetime.datetime.now(tz=timezone.utc))        

                    data={
                        'bil':adj.id,
                        'success':True,
                        'msg_swa':'Bidhaa zimepunguzwa stoku',
                        'msg_eng':'Items reduced from stock'
                    }           

                    return JsonResponse(data)                 
                else:
                    data={
                         'success':False,
                        'msg_swa':'Hauna Ruhusa ya kufanya oparesheni hii kwa sasa ',
                        'msg_eng':'You have no permission for stock adjustments'
                    }                     
       
        except:
            data={
                'success':False,
                'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                'msg_eng':'The operation was not successfully please try again'
            }     

        return JsonResponse(data)    
    else:
        return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def Ziruditena(request):
    if request.method == "POST":
        try:
            adj=request.POST.get('adj',0)
            todo = todoFunct(request)
            duka = todo['duka']
            adjs = stokAdjustment.objects.filter(pk=adj,Interprise=duka.id)

            if adjs.exists():
                adjm  = adjs.last()
               
                if adjm.Na == todo['cheo'] or duka.owner == todo['useri']:
                    prodList = productChangeRecord.objects.filter(adjst=adjm.id)
                    adjColor = ColorChange.objects.filter(change__adjst=adjm.id)
                    adjSize = SizeChange.objects.filter(color__change__adjst=adjm.id)
                    if prodList.exists():
                        for l in prodList:
                            if adjm.Ongezwa:
                                 bidhaa_stoku.objects.filter(pk=l.prod.id).update(idadi=F('idadi')-l.qty)
                            else:
                                 bidhaa_stoku.objects.filter(pk=l.prod.id).update(idadi=F('idadi')+l.qty)
                    if adjColor.exists():
                        for c in adjColor:
                            if adjm.Ongezwa:
                               produ_colored.objects.filter(pk=c.color.id).update(idadi=F('idadi')-c.qty)        
                            else:
                               produ_colored.objects.filter(pk=c.color.id).update(idadi=F('idadi')+c.qty)        

                                
                    if adjSize.exists():
                        for s in adjSize:
                          if adjm.Ongezwa:  
                             produ_size.objects.filter(pk=s.size.id).update(idadi=F('idadi')-s.qty)    
                          else:
                             produ_size.objects.filter(pk=s.size.id).update(idadi=F('idadi')+s.qty)    
                                                
                    #  Check whether no other inputs recorded
                    adjs.update(full_Return=True,Na=todo['cheo'])
                    rekodiMatumizi.objects.filter(adjst=adjm.id).delete()


                                         
                    to_comfirm = InterprisePermissions.objects.filter(Interprise=duka.id)
                   
                    if to_comfirm.exists():
                        for tn in to_comfirm:
                            comf = stockAdjst_confirm()
                            comf.userP = tn
                            comf.adjs = adjm
                            comf.Return = 1
                            comf.save()

                    stockAdjst_confirm.objects.filter(userP=todo['cheo'].id).update(confirmed=True,tarehe=datetime.datetime.now(tz=timezone.utc))        


                    data = {
                        'success':True,
                        'msg_swa':'Kitendo cha Kutengua marekebisho ya kuongeza/kupunguza yamefanikiwa ',
                        'msg_eng':'Stock adjustment undo was succefully',
                                     
                    
                    }

                    return JsonResponse(data)
                else:
                    data={
                        'success':False,
                        'msg_swa':'Huna ruhusa ya kufanya hivyo kwa sasa',
                        'msg_eng':'You have no permission for this action'
                    }

                    return JsonResponse(data)
            else:
                data={
                    'success':False,
                    'msg_eng':'Adjustment not Found',
                    'msg_swa':'Orodha ya marekebisho stoku haikupatikana'
                } 

                return JsonResponse(data)       
        except:
                data={
                    'success':False,
                    'msg_swa':'Oparesheni haikufanikiwa tafadhari jaribu tena',
                    'msg_eng':'Oparation was not successfully please try a'
                }
                return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def futaKabisa(request):
    if request.method == "POST":
        try:
            adj=request.POST.get('adj',0)
            todo = todoFunct(request)
            duka = todo['duka']
            adjs = stokAdjustment.objects.filter(pk=adj,Interprise=duka.id)

            if adjs.exists():
                adjm  = adjs.last()
               
                if  duka.owner == todo['useri']:
                    
                    data = {
                            'success':True,
                            'msg_swa':'Kitendo cha kurekebisha stoku kutokana na marekebisho ya kuongeza/kupunguza yamefanikiwa ',
                            'msg_eng':'Stock adjustment undo was succefully',
                             'dl':1           
                        
                        }

                    confrm=stockAdjst_confirm.objects.filter(adjs=adjm,Return=True).exclude(userP=todo['cheo'].id) 
                    if not confrm.exists() or confrm.filter(confirmed=True).exists():
                        adjs.delete()      
                    else:
                        data = {
                            'success':False,
                            'msg_swa':'Kitendo hakikufanikiwa kwa sababu ya kutokuwepo uhakiki wa angalau mtumiaji mmoja kati ya waliopo kuhakiki',
                            'msg_eng':'The action was not successfully because no one else confirmed the undo of this adjustment'
                        }

                    

                    return JsonResponse(data)
                else:
                    data={
                        'success':False,
                        'msg_swa':'Huna ruhusa ya kufanya hivyo kwa sasa',
                        'msg_eng':'You have no permission for this action'
                    }

                    return JsonResponse(data)
            else:
                data={
                    'success':False,
                    'msg_eng':'Adjustment not Found',
                    'msg_swa':'Orodha ya marekebisho stoku haikupatikana'
                } 

                return JsonResponse(data)       
        except:
                data={
                    'success':False,
                    'msg_swa':'Oparesheni haikufanikiwa tafadhari jaribu tena',
                    'msg_eng':'Oparation was not successfully please try a'
                }
                return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def stokAdjFunct(request):
    undo = int(request.GET.get('un',0))
    todo  = todoFunct(request)
    duka=todo['duka']
    
    adjs = stokAdjustment.objects.filter(Interprise=duka,full_Return=undo).exclude(registered=True)

        
     
    num = adjs.count()
    adj = adjs.order_by("-pk")

    
    p=Paginator(adj,15)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages
    calpage = []

    for p in page:
            lis_t = productChangeRecord.objects.filter(adjst=p.id).annotate(uwiano=F('prod__bidhaa__idadi_jum'),thamani=F('prod__Bei_kununua'))
            tot = lis_t.aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']


            lis_t2 = lis_t.filter(prod__produced__production__production__Interprise=duka.id,thamani=0)

            if lis_t2.exists():
                itm_cost = 0
                for li in lis_t2:
                    pdcd = bidhaa_stoku.objects.filter(produced__production__production=li.prod.produced.production.production.id)
                    
                    # prices sum for all produced on this produced
                    prices_sum = pdcd.aggregate(sum=Sum(F('Bei_kuuza')*F('produced__qty')))['sum']
                    
                    # cost of items used for production.....
                    mat_cost = productChangeRecord.objects.filter(adjst__production=li.prod.produced.production.production.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
                    
                    #Other expenses .........................//
                    exp = toaCash.objects.filter(produxn__produxn=li.prod.produced.production.production.id).aggregate(sum=Sum(F('Amount')))['sum']
                    
                    prod_sumu = float(mat_cost)

                    if exp:
                        prod_sumu += float(exp)  

                    if prices_sum > 0:
                        prc = li.prod.Bei_kuuza*li.prod.produced.qty
                        pr_ratio = prc/prices_sum
                        prQty = float(li.prod.produced.qty)
                        if prQty == 0 :
                            itm_cost = 0
                        else:    
                            itm_cost = (float(pr_ratio) * float(prod_sumu)  ) / float(li.prod.produced.qty)
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        itm_cost = float(prod_sumu)/float(qtysm)  

                    tot = float(tot) + float(float(itm_cost)*float(li.qty))                 


            calpage.append({
                'ad':p,
                'total':tot
            })
            

    todo.update({
    'p_num':page_num,
     'pages':pg_number,
    'adj_num':num,
     'page':page,
    'bili':calpage,      
    'un':undo,
    })

    return todo

@login_required(login_url='login')
def AllAdjs(request):
#     manunuzi.objects.filter(Q(pk=336) | Q( pk=334) | Q(pk=335) ).delete() 
    todo = stokAdjFunct(request)
    # stokAdjustment.objects.filter(Interprise=todo['duka'].id).delete()   
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
      return render(request,'allAdjst.html',todo)

@login_required(login_url='login')
def viewAdjst(request): 
    try:
        todo = stokAdjFunct(request)
        duka = todo['duka']
        adj=request.GET.get('item_valued',0)
        code=request.GET.get('code',0)
        undo=request.GET.get('un',0)

        adjst = stokAdjustment.objects.filter(Q(pk=adj)|Q(code=code),Interprise=duka.id,full_Return=undo)

        if adjst.exists():
            the_bill = adjst.last()
            lis_t = productChangeRecord.objects.filter(adjst=the_bill.id)
            reList = []

            for li in lis_t:
                pic = picha_bidhaa.objects.filter(bidhaa=li.prod.bidhaa.id)
                picha=''
                if pic.exists() and pic.last().picha.picha:
                    picha = pic.last().picha.picha.url

                itm_cost = 0
                if li.prod.produced:
                    pdcd = bidhaa_stoku.objects.filter(produced__production__production=li.prod.produced.production.production.id)
                    
                    # prices sum for all produced on this produced
                    prices_sum = pdcd.aggregate(sum=Sum(F('Bei_kuuza')*F('produced__qty')))['sum']
                    
                    # cost of items used for production.....
                    mat_cost = productChangeRecord.objects.filter(adjst__production=li.prod.produced.production.production.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
                    
                    #Other expenses .........................//
                    exp = toaCash.objects.filter(produxn__produxn=li.prod.produced.production.production.id).aggregate(sum=Sum(F('Amount')))['sum']
                    
                    prod_sumu = float(mat_cost)

                    if exp:
                        prod_sumu += float(exp)  

                    if prices_sum > 0:
                        prs = li.prod.Bei_kuuza*li.prod.produced.qty
                        pr_ratio = prs/prices_sum
                        itm_cost = (float(pr_ratio) * float(prod_sumu)) / float(li.prod.produced.qty)    
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        itm_cost = float(prod_sumu) /float(qtysm)   

                reList.append({
                    'itm':li,
                    'picha':picha,
                    'cost':itm_cost,
                    'produced':int(li.prod.produced is not None)
                })


            color = ColorChange.objects.filter(change__adjst=the_bill.id)
            size = SizeChange.objects.filter(color__change__adjst=the_bill.id)

            comfirm_ = stockAdjst_confirm.objects.filter(adjs=the_bill.id)
            uc = stockAdjst_confirm.objects.filter(adjs=the_bill.id,userP=todo['cheo'].id,confirmed=False,dinied=False)
            
            
            bei_u = []
            for li in lis_t:
                the_bei = bei_za_bidhaa.objects.filter(item=li.prod.bidhaa.id)
                for p in the_bei:
                    bei = [{
                        'unit':p.jina,
                        'qty':p.idadi,
                        'price':p.bei,
                        'prod':p.item.id

                    }]
                    bei_u+=bei 

            prod_sum = 0    
            # cost by purchase prise
            tot = lis_t.exclude(prod__produced__production__production__Interprise=duka.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']   
           
            #Cost throug production 
            tot2 = lis_t.filter(prod__produced__production__production__Interprise=duka.id)
            if tot:
                prod_sum =  tot              
            
            if tot2.exists():
                for ps in tot2:
                    prdcd =bidhaa_stoku.objects.filter(produced__production__production=ps.prod.produced.production.production.id) 
                   
                    
                    prices_sum = prdcd.aggregate(sum=Sum(F('Bei_kuuza')*F('produced__qty')))['sum']
                   
                    mat_t = productChangeRecord.objects.filter(adjst__production=ps.prod.produced.production.production.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
                    exp = toaCash.objects.filter(produxn__produxn=ps.prod.produced.production.production.id).aggregate(sum=Sum(F('Amount')))['sum']
                    prod_sumu = float(mat_t)
                    if exp:
                        prod_sumu += float(exp)  

                    if prices_sum > 0:
                        prc = ps.prod.Bei_kuuza * ps.prod.produced.qty
                        pr_ratio = prc/prices_sum
                        prod_sum += ((float(pr_ratio) * float(ps.qty) * float(prod_sumu)) / float(ps.prod.produced.qty))  
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        prod_sum += float(prod_sumu) *float(ps.qty)/float(qtysm)
                      


                        
                        


            
                    
            
            todo.update(
                {
                    'list':reList,
                    'color':color,
                    'size':size,
                    'prices':bei_u,
                    'the_bill':the_bill,
                    'cm':comfirm_.filter(Return=0),
                    'cmR':comfirm_.filter(Return=1),
                    'uc':uc,
                    'total':prod_sum,
                    'un':undo
                    # 'all_sum':tot+prod_sum
                }
            )
            if not duka.Interprise:
                return redirect('/userdash')
            else: 
               return render(request,'viewAdjst.html',todo) 
        else:
            adjstI = stokAdjustment.objects.filter(Q(pk=adj)|Q(code=code))
            if adjstI.exists():
                duka = adjstI.last().Interprise
                per = InterprisePermissions.objects.filter(user=todo['useri'].id,Allow=True,Interprise=duka.id)
                if per.exists():
                    InterprisePermissions.objects.filter(user=todo['useri'].id).update(default=False)
                    per.update(default=True)

                    return redirect(request,'/stoku/viewAdjst?item_valued='+str(adj)+'un='+str(undo))
                else:
                   return render(request,'pagenotFound.html',todoFunct(request))       
            else:
               return render(request,'pagenotFound.html',todoFunct(request))            

    except:
        return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def printAdjstNames(request): 
    try:
        todo = stokAdjFunct(request)
        duka = todo['duka']
        adj=request.GET.get('item_valued',0)
        code=request.GET.get('code',0)
        langSel = int(request.GET.get('lang',0))
        undo = int(request.GET.get('un',0))

        adjst = stokAdjustment.objects.filter(pk=adj,Interprise=duka.id)

        if adjst.exists():
            the_bill = adjst.last()
           

            comfirm_ = stockAdjst_confirm.objects.filter(adjs=the_bill.id)
            
            
            todo.update(
                {
                    
                    'the_bill':the_bill,
                    'cm':comfirm_.filter(Return=undo),
                    'langSel':langSel
                    
                    # 'all_sum':tot+prod_sum
                }
            )
            if not duka.Interprise:
                return redirect('/userdash')
            else: 
              return render(request,'printAdjstNames.html',todo) 

        else:
           
          return render(request,'pagenotFound.html',todoFunct(request))            

    except:
        return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def printAdjst(request): 
    try:
        todo = stokAdjFunct(request)
        duka = todo['duka']
        adj=request.GET.get('item_valued',0)
        code=request.GET.get('code',0)
        langSel = int(request.GET.get('lang',0))

        

        adjst = stokAdjustment.objects.filter(Q(pk=adj)|Q(code=code),Interprise=duka.id)

        if adjst.exists():
            the_bill = adjst.last()
            lis_t = productChangeRecord.objects.filter(adjst=the_bill.id)
            reList = []

            for li in lis_t:
                pic = picha_bidhaa.objects.filter(bidhaa=li.prod.bidhaa.id)
                picha=''
                if pic.exists() and pic.last().picha.picha:
                    picha = pic.last().picha.picha.url

                itm_cost = 0
                if li.prod.produced:
                    pdcd = bidhaa_stoku.objects.filter(produced__production__production=li.prod.produced.production.production.id)
                    
                    # prices sum for all produced on this produced
                    prices_sum = pdcd.aggregate(sum=Sum(F('Bei_kuuza')*F('produced__qty')))['sum']
                    
                    # cost of items used for production.....
                    mat_cost = productChangeRecord.objects.filter(adjst__production=li.prod.produced.production.production.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
                    
                    #Other expenses .........................//
                    exp = toaCash.objects.filter(produxn__produxn=li.prod.produced.production.production.id).aggregate(sum=Sum(F('Amount')))['sum']
                    
                    prod_sumu = float(mat_cost)

                    if exp:
                        prod_sumu += float(exp)  

                    if prices_sum > 0:
                        prs = li.prod.Bei_kuuza*li.prod.produced.qty
                        pr_ratio = prs/prices_sum
                        itm_cost = (float(pr_ratio) * float(prod_sumu)) / float(li.prod.produced.qty)    
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        itm_cost = float(prod_sumu) /float(qtysm)   

                reList.append({
                    'itm':li,
                    'picha':picha,
                    'cost':itm_cost,
                    'produced':int(li.prod.produced is not None)
                })


            color = ColorChange.objects.filter(change__adjst=the_bill.id)
            size = SizeChange.objects.filter(color__change__adjst=the_bill.id)

            comfirm_ = stockAdjst_confirm.objects.filter((Q(confirmed=True)|Q(dinied=True)),adjs=the_bill.id)
            uc = stockAdjst_confirm.objects.filter(adjs=the_bill.id,userP=todo['cheo'].id,confirmed=False,dinied=False)
            
            
            bei_u = []
            for li in lis_t:
                the_bei = bei_za_bidhaa.objects.filter(item=li.prod.bidhaa.id)
                for p in the_bei:
                    bei = [{
                        'unit':p.jina,
                        'qty':p.idadi,
                        'price':p.bei,
                        'prod':p.item.id

                    }]
                    bei_u+=bei 

            prod_sum = 0    
            # cost by purchase prise
            tot = lis_t.exclude(prod__produced__production__production__Interprise=duka.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']   
           
            #Cost throug production 
            tot2 = lis_t.filter(prod__produced__production__production__Interprise=duka.id)
            if tot:
                prod_sum =  tot              
            
            if tot2.exists():
                for ps in tot2:
                    prdcd =bidhaa_stoku.objects.filter(produced__production__production=ps.prod.produced.production.production.id) 
                   
                    
                    prices_sum = prdcd.aggregate(sum=Sum(F('Bei_kuuza')*F('produced__qty')))['sum']
                   
                    mat_t = productChangeRecord.objects.filter(adjst__production=ps.prod.produced.production.production.id).annotate(thamani=F('prod__Bei_kununua'),uwiano=F('prod__bidhaa__idadi_jum')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
                    exp = toaCash.objects.filter(produxn__produxn=ps.prod.produced.production.production.id).aggregate(sum=Sum(F('Amount')))['sum']
                    prod_sumu = float(mat_t)
                    if exp:
                        prod_sumu += float(exp)  

                    if prices_sum > 0:
                        prc = ps.prod.Bei_kuuza * ps.prod.produced.qty
                        pr_ratio = prc/prices_sum
                        prod_sum += ((float(pr_ratio) * float(ps.qty) * float(prod_sumu)) / float(ps.prod.produced.qty))  
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        prod_sum += float(prod_sumu) *float(ps.qty)/float(qtysm)
                      


                        
                        


            
                    
            
            todo.update(
                {
                    'list':reList,
                    'color':color,
                    'size':size,
                    'prices':bei_u,
                    'the_bill':the_bill,
                    'cm':comfirm_,
                    'uc':uc,
                    'total':prod_sum,
                    'langSel':langSel
                }
            )
            if not duka.Interprise:
                return redirect('/userdash')
            else: 
                return render(request,'printAdj.html',todo) 
        else:
            adjstI = stokAdjustment.objects.filter(Q(pk=adj)|Q(code=code))
            if adjstI.exists():
                duka = adjstI.last().Interprise
                per = InterprisePermissions.objects.filter(user=todo['useri'].id,Allow=True,Interprise=duka.id)
                if per.exists():
                    InterprisePermissions.objects.filter(user=todo['useri'].id).update(default=False)
                    per.update(default=True)
                    if not duka.Interprise:
                        return redirect('/userdash')
                    else: 
                        return render(request,'/stoku/viewAdjst?item_valued='+str(adj))
                else:
                   return render(request,'pagenotFound.html',todoFunct(request))       
            else:
               return render(request,'pagenotFound.html',todoFunct(request))            

    except:
        return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def comfirmAdst(request):
    if request.method == "POST":
        try:
            todo = todoFunct(request)
            duka = todo['duka']  
            ad = request.POST.get('adj',0)
            desc = request.POST.get('desc')
            comf = int(request.POST.get('comf',0))
            deny = int(request.POST.get('deny',0))

            

            adj = stockAdjst_confirm.objects.filter(adjs=ad,userP=todo['cheo'].id)
           

            if adj.exists():
                adj.update(tarehe=datetime.datetime.now(tz=timezone.utc),confirmed=comf,dinied=deny,desc=desc)

                data = {
                    'success':True,
                    'msg_swa':'Umefanikiwa kuhakiki marekebisho yaliyofanyika stoku',
                    'msg_eng':'You have successfully comfirmed the stoku adjustment recorded'
                }

                return JsonResponse(data)
        except:
            data={
                'success':False,
                'msg_swa':'Uhakiki haukufanikiwa tafadhari jaribu tena kwa usahihi',
                'msg_eng':'Adjustment comfirm was not successfully'
            }   

            return JsonResponse(data)

from PIL import Image as PILImage
import io

def generate_avg_hash(img_file, size=16):
    img = PILImage.open(img_file).convert('L').resize((size, size), PILImage.LANCZOS)
    pixels = list(img.getdata())
    avg = sum(pixels) / len(pixels)
    # Tunairudisha kama String ya 0 na 1 ili iwe rahisi kusave kwenye CharField
    return "".join(['1' if p > avg else '0' for p in pixels])          
  

from django.db.models import F
from PIL import Image as PILImage
import io

@login_required(login_url='login')
def tafutaPicha(request):
    if request.method == "POST":
        try:
            from django.core.files.storage import default_storage

            uploaded_img = request.FILES.get('IMG')

            if not uploaded_img:
                return JsonResponse({'success': False, 'msg_swa': 'Picha inahitajika', 'msg_eng': 'Image required'})

            scope = request.POST.get('scope', 'wilaya')
            allowed_scopes = {'wilaya', 'mkoa', 'kanda', 'nchi'}
            if scope not in allowed_scopes:
                scope = 'wilaya'

            # 1. Tengeneza hash ya picha aliyopakia mteja
            def get_hash_list(img_file, size=16):
                img = PILImage.open(img_file).convert('L').resize((size, size), PILImage.LANCZOS)
                pixels = list(img.getdata())
                avg = sum(pixels) / len(pixels)
                return [1 if p > avg else 0 for p in pixels]

            upload_hash = get_hash_list(uploaded_img)

            # 2. Pata taarifa za eneo la mtumiaji
            todo = todoFunct(request)
            useri = todo['useri']

            place_ids = {
                'wilaya': None,
                'mkoa': None,
                'kanda': None,
                'nchi': None,
            }

            if useri and useri.mtaa and useri.mtaa.kata and useri.mtaa.kata.wilaya:
                place_ids['wilaya'] = useri.mtaa.kata.wilaya.id
                if useri.mtaa.kata.wilaya.mkoa:
                    place_ids['mkoa'] = useri.mtaa.kata.wilaya.mkoa.id
                    if useri.mtaa.kata.wilaya.mkoa.kanda:
                        place_ids['kanda'] = useri.mtaa.kata.wilaya.mkoa.kanda.id
                        if useri.mtaa.kata.wilaya.mkoa.kanda.nchi:
                            place_ids['nchi'] = useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id

            # img_text=Picha_to_text(uploaded_img)  
            # print(img_text)               

            stock_qs = bidhaa_stoku.objects.filter(idadi__gt=0)

            scope_filters = {
                'wilaya': 'Interprise__mtaa__kata__wilaya_id',
                'mkoa': 'Interprise__mtaa__kata__wilaya__mkoa_id',
                'kanda': 'Interprise__mtaa__kata__wilaya__mkoa__kanda_id',
                'nchi': 'Interprise__mtaa__kata__wilaya__mkoa__kanda__nchi_id',
            }

            scope_id = place_ids.get(scope)
            scope_field = scope_filters.get(scope)
            if scope_id and scope_field:
                stock_qs = stock_qs.filter(**{scope_field: scope_id})

            # Mahali bidhaa zilipo (duka + mtaa/kata/wilaya/mkoa)
            # na item halisi ya stoku ya kuitumia kwenye displaySelItem
            bidhaa_locations = {}
            bidhaa_shop_seen = {}
            bidhaa_primary_stock = {}

            stock_places = stock_qs.values(
                'id',
                'bidhaa_id',
                'Interprise_id',
                'Interprise__name',
                'Interprise__mtaa__mtaa',
                'Interprise__mtaa__kata__kata',
                'Interprise__mtaa__kata__wilaya__wilaya',
                'Interprise__mtaa__kata__wilaya__mkoa__mkoa'
            )

            for st in stock_places:
                bidhaa_id = st['bidhaa_id']
                if not bidhaa_id:
                    continue

                if bidhaa_id not in bidhaa_primary_stock:
                    bidhaa_primary_stock[bidhaa_id] = {
                        'bidhaa_stoku_id': st['id'],
                        'shop_id': st['Interprise_id'],
                    }

                shop_id = st['Interprise_id']
                if bidhaa_id not in bidhaa_shop_seen:
                    bidhaa_shop_seen[bidhaa_id] = set()
                    bidhaa_locations[bidhaa_id] = []

                # Epuka kurudia duka lilelile kwa bidhaa moja
                if shop_id in bidhaa_shop_seen[bidhaa_id]:
                    continue
                bidhaa_shop_seen[bidhaa_id].add(shop_id)

                bidhaa_locations[bidhaa_id].append({
                    'shop': st['Interprise__name'] or '',
                    'mtaa': st['Interprise__mtaa__mtaa'] or '',
                    'kata': st['Interprise__mtaa__kata__kata'] or '',
                    'wilaya': st['Interprise__mtaa__kata__wilaya__wilaya'] or '',
                    'mkoa': st['Interprise__mtaa__kata__wilaya__mkoa__mkoa'] or '',
                })

            bidhaa_ids = stock_qs.values_list('bidhaa_id', flat=True).distinct()

            # 3. Vuta hash zote kutoka DB za bidhaa za eneo husika TU
            all_pics = picha_bidhaa.objects.filter(
                bidhaa_id__in=bidhaa_ids
            ).values(
                'bidhaa_id', 
                'bidhaa__bidhaa_jina', 
                'picha__picha', 
                'picha__picha_hash'
            )

            best_matches = {}

            # 4. Linganisha hash ya mteja na hash za kwenye DB
            for pic in all_pics:
                stored_hash_str = pic['picha__picha_hash']
                if not stored_hash_str:
                    continue

                # Geuza string "0101..." kwenda list [0, 1, 0, 1...]
                stored_hash = [int(x) for x in stored_hash_str]
                if not stored_hash:
                    continue
                
                # Piga hesabu ya utofauti (Hamming Distance)
                distance = sum(a != b for a, b in zip(upload_hash, stored_hash))
                hash_len = min(len(upload_hash), len(stored_hash))
                if hash_len == 0:
                    continue
                similarity = round((hash_len - distance) / hash_len * 100, 1)

                # Chukua tu bidhaa zinazofanana kwa zaidi ya 50%
                if similarity > 50:
                    bidhaa_id = pic['bidhaa_id']

                    pic_name = pic.get('picha__picha')
                    pic_url = ''
                    if pic_name:
                        pic_name = str(pic_name)
                        if pic_name.startswith('http://') or pic_name.startswith('https://'):
                            pic_url = pic_name
                        else:
                            try:
                                pic_url = default_storage.url(pic_name)
                            except Exception:
                                pic_url = f"/media/{pic_name.lstrip('/')}"

                    current = best_matches.get(bidhaa_id)
                    if (not current) or (similarity > current['similarity']):
                        stock_info = bidhaa_primary_stock.get(bidhaa_id, {})
                        best_matches[bidhaa_id] = {
                            'bidhaa_id': bidhaa_id,
                            'bidhaa_stoku_id': stock_info.get('bidhaa_stoku_id'),
                            'shop_id': stock_info.get('shop_id'),
                            'jina': pic['bidhaa__bidhaa_jina'],
                            'picha': pic_url,
                            'similarity': similarity,
                            'distance': distance,
                            'locations': bidhaa_locations.get(bidhaa_id, [])
                        }

            results = list(best_matches.values())

            # 5. Panga matokeo (Inayofanana zaidi iwe juu)
            results.sort(key=lambda x: x['similarity'], reverse=True)

            return JsonResponse({
                'success': True,
                'results': results[:20], # Rudisha bidhaa 20 bora
                'count': len(results[:20]),
                'scope': scope,
            })

        except Exception as e:
            return JsonResponse({'success': False, 'msg_swa': f'Hitilafu: {str(e)}', 'msg_eng': 'Error occurred'})
    
    return render(request, 'pagenotFound.html')

from google.cloud import vision

# def Picha_to_text(img_file):
#     """
#     Inapokea picha, inatuma Google Vision AI (Text + Objects), 
#     na kurudisha orodha ya maneno yaliyopatikana.
#     """
#     if img_file:
#         try:
#             from google.cloud import vision
#             client = vision.ImageAnnotatorClient()

#             # 1. Soma picha kutoka kwenye request
#             picha = img_file
#             picha.seek(0)  # Reset file pointer to beginning
#             content = picha.read()
#             image = vision.Image(content=content)

#             # 2. Tengeneza maombi ya kutafuta Text na Labels kwa pamoja
#             features = [
#                 vision.Feature(type_=vision.Feature.Type.TEXT_DETECTION),
#                 vision.Feature(type_=vision.Feature.Type.LABEL_DETECTION),
#             ]
            
#             request_ai = vision.AnnotateImageRequest(image=image, features=features)
            
#             # 3. Tuma maombi kwa Google
#             response = client.annotate_image(request_ai)
            
#             matokeo = set() # Tunatumia set ili kuzuia maneno yanayojirudia

#             # Maneno yasiyo muhimu / generic tunayotaka kuyaondoa
#             stop_words = {
#                 'technology', 'tech', 'design', 'brand', 'product', 'products',
#                 'image', 'photo', 'picture', 'graphics', 'illustration',
#                 'object', 'objects', 'symbol', 'icon', 'font', 'text',
#                 'style', 'modern', 'simple', 'quality', 'new', 'background',
#                 'label', 'material', 'pattern', 'shape', 'line', 'number'
#             }

#             # Rangi tunazotaka zisionekane kwenye results
#             color_words = {
#                 'blue', 'red', 'white', 'black', 'green', 'yellow', 'orange',
#                 'purple', 'pink', 'brown', 'grey', 'gray', 'gold', 'silver',
#                 'beige', 'violet', 'indigo', 'cyan', 'magenta', 'maroon',
#                 'navy', 'teal', 'olive', 'lime', 'turquoise', 'cream'
#             }

#             def clean_terms(words):
#                 cleaned = []
#                 for w in words:
#                     term = re.sub(r'[^a-zA-Z0-9\-]', '', str(w).lower()).strip('-')

#                     # Ondoa terms fupi sana / zisizo na maana / rangi
#                     if len(term) < 3:
#                         continue
#                     if term.isdigit():
#                         continue
#                     if term in stop_words or term in color_words:
#                         continue

#                     cleaned.append(term)
#                 return cleaned

#             # --- A: CHUKUA MAANDISHI (OCR) ---
#             if response.text_annotations:
#                 # Tunachukua description nzima, tunaigeuza kuwa ndogo, kisha tunaigawa
#                 maandishi = response.text_annotations[0].description.lower().split()
#                 matokeo.update(clean_terms(maandishi))

#             # --- B: CHUKUA LABELS (OBJECTS) ---
#             if response.label_annotations:
#                 for label in response.label_annotations:
#                     # Tunachukua tu vitu ambavyo AI ina uhakika navyo (Score > 0.7)
#                     if label.score >= 0.70:
#                         matokeo.update(clean_terms(label.description.lower().split()))

#             # 4. Angalia kama kuna makosa kutoka kwa Google
#             if response.error.message:
#                 {'success': False, 'error': response.error.message}

#             # Rudisha majibu kama list
#             final_list = list(matokeo)
            
#             if final_list:
                
#                 return {'success': True, 'results': final_list}
#             else:
#                 return {'success': False, 'message': 'Hakuna kilichotambulika'}

#         except Exception as e:
#             print(f"Error kwenye Vision AI: {e}")
#             return {'success': False, 'error': str(e)}
            
#     return {'success': False, 'message': 'Picha haikupatikana'}

# place picrure...........................

@login_required(login_url='login')
def kuwekaPicha(request):
     if request.method == 'POST' :
       try:
          picha = request.FILES['IMG']
          picha_hash_value = generate_avg_hash(picha)
          picha.seek(0) # Rudisha pointer mwanzo baada ya kuisoma kwa PIL
          # ----------------



          value=request.POST.get('hold-color-id')
          idm=request.POST.get('hold-produ-id')

          todo = todoFunct(request)
          duka = todo['duka']
          gcs_storage = default_storage
          if not settings.DEBUG:
            #   default_storage = GoogleCloudStorage()
               gcs_storage = settings.GCS_STORAGE_INSTANCE

          ext = picha.name.split('.')[-1]
          filename = f"products/{duka.id}_{int(time.time())}.{ext}"
          path = gcs_storage.save(filename, picha)

          
        #   print(f"Storage inayotumika sasa hivi ni: {gcs_storage.__class__}")
          size= picha.size
          colorin=None
          husiana=picha_bidhaa()
          entp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
          itm = bidhaa_stoku.objects.get(pk=idm,Interprise__owner=entp.owner.id)
          SIZES = picha_bidhaa.objects.filter(bidhaa=itm.bidhaa.id).aggregate(Sizes=Sum('picha__pic_size'))['Sizes'] or 0
          colorr = None
          COLORED = False
        #   print(value)           
          if  int(value)>0:
   
            colorr = produ_colored.objects.filter(pk=value,Interprise=entp.id)
            COLORED = colorr.exists()
            colorrV = colorr.last()

            SIZES = picha_bidhaa.objects.filter(color_produ=colorrV.color.id).aggregate(Sizes=Sum('picha__pic_size'))['Sizes'] or 0
           

          if float(SIZES + size)/float(1024) <= 500:

            # print(picha_hash_value)

            if COLORED :
                # if THECOLOR.exists() :
                    photo=picha_yenyewe.objects.create(
                        picha=path,
                        pic_size=picha.size,
                        owner= entp.owner.user,     
                        picha_hash=picha_hash_value,
                              
                    )


                    husiana.picha=photo
                    husiana.color_produ=colorrV.color
                    husiana.bidhaa=colorrV.bidhaa.bidhaa
                    # husiana.owner=entp
                    husiana.save() 
                    colorin=colorrV.color.id

                # else: 
                #     color_value =  produ_colored.objects.filter(bidhaa=idm).exclude(color__colored=True).last()
                #     photo=picha_yenyewe.objects.create(
                #         picha=picha,
                #         pic_size=picha.size,
                #         owner=entp.owner.user                

                #     )                
                #     husiana.picha=photo
                #     husiana.color_produ=color_value.color
                #     husiana.bidhaa=color_value.bidhaa.bidhaa
                #     husiana.Interprise=entp
                #     husiana.save()                 
                #     colorin=color_value.color.id

            else:    
                    hamna_rangi = color_produ()
                    hamna_rangi.color_code='#ffffff'
                    hamna_rangi.color_name='none'
                    hamna_rangi.colored=False
                    hamna_rangi.bidhaa=itm.bidhaa
                    hamna_rangi.save()

                    coloring=produ_colored()
                    coloring.bidhaa=itm
                    coloring.color=hamna_rangi
                    coloring.idadi=0
                    coloring.Interprise=entp
                    coloring.owner=entp.owner.user
                    coloring.save()


                    photo=picha_yenyewe.objects.create(
                    picha=path,
                    pic_size=picha.size,
                    owner=entp.owner.user,
                    picha_hash=picha_hash_value,


                )
                    husiana.picha=photo
                    husiana.color_produ=hamna_rangi
                    husiana.bidhaa=itm.bidhaa
                    # husiana.Interprise=entp
                    husiana.save()  

                    colorin=hamna_rangi.id

            itemImg=[]
        
            pics = picha_bidhaa.objects.filter(picha__owner= entp.owner.user).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
            if pics.exists():
                for im in pics:

                    itemImg.append({
                        'picha__picha':im.picha.picha.url,
                        'picha':im.picha.id,
                        'id':im.id,
                        'color_produ':im.rangi,
                        'bidhaa':im.bidhaa.id

                    }) 
            data = {
                'success':True,
                'img' : itemImg,
                'color':colorin,
                'msg_swa':'Picha imeongezwa kikamilifu',
                'msg_eng':'Image uploaded successfully'


            }
          
          else:
            data = {
                'success':False,
                'msg_swa':'Hakuna nafasi ya kutosha kwa ajili ya picha hii, Nafasi ya Picha kwa kila bidhaa ni 500KB  ',
                 'msg_eng':'No enough space for image, the available space for each item is 500KB'
            }
          return JsonResponse(data)
       except:
            traceback.print_exc()
            data = {
            'success':False,
             'msg_swa':'Picha haikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
            'msg_eng':'The image was not succefully please try again correctly'
          
            }
            return JsonResponse(data)
     else:
           return render(request,'pagenotFound.html',todoFunct(request)) 
        
#KUONDOA PICHA YA BIDHAA...................................................................//
@login_required(login_url='login')
def ondoaPicha(request): 
    if request.method == "POST":    
        try: 
            picha_link=request.POST.get('value')
            # entp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
            todo = todoFunct(request) 
            duka = todo['duka'] 
            cheo = todo['cheo']
            if (cheo.picDescription and cheo.product_edit and not cheo.viewi) or duka.owner == cheo.user:        
                picha_id = picha_bidhaa.objects.get(pk=picha_link).picha.id
                
                kapicha=picha_bidhaa.objects.get(pk=picha_link)
                coloring= kapicha.color_produ.id
                # zipo_gapi_kwa_rangi=picha_bidhaa.objects.filter(bidhaa=kapicha.bidhaa.id).count()
                # size_zilizopo=produ_size.objects.filter(bidhaa=kapicha.bidhaa.id).count()
                # # if zipo_gapi_kwa_rangi<=1 and size_zilizopo<1:
                #         if color_produ.objects.filter(pk=kapicha.color_produ.id,colored=False).exists():
                #             colored=color_produ.objects.get(pk=kapicha.color_produ.id,colored=False)
                #             colored.delete()            
                
                zipo_gapi=picha_bidhaa.objects.filter(picha=picha_id).count()
                if zipo_gapi <=1:
                    # if color_produ.objects.filter(pk=kapicha.color_produ.id,colored=False).exists():
                    photo=picha_yenyewe.objects.get(pk=kapicha.picha.id)
                    photo.picha.delete(save=True)
                    photo.delete()
                    
                else:
                    kapicha.delete()    
                itemImg=[]
            
                pics = picha_bidhaa.objects.filter(picha__owner= duka.owner.user).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
                if pics.exists():
                    for im in pics:
                        itemImg.append({
                            'picha__picha':im.picha.picha.url,
                            'picha':im.picha.id,
                            'id':im.id,
                            'color_produ':im.rangi,
                            'bidhaa':im.bidhaa.id

                        })             
                data = {
                    'success':True,
                    'img' : itemImg,
                    'color':coloring

                }
                return JsonResponse(data)
            else:
                data = {
                'success':False,
                'message_swa':'Hauna Ruhusa ya Kubadili vielelezo vya bidhaa',
                'message_eng':'You have no permission to change item features'
            
                }
                return JsonResponse(data)  
        except:
                data = {
                'success':False,
                'message_swa':'Picha haikufanikiwa kuondolewa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
                'message_eng':'The image was not succefully removed please try again correctly'
            
                }
                return JsonResponse(data)        
    else:
           return render(request,'pagenotFound.html',todoFunct(request))  

# SIZE REMOVAL....................................................................................................................................//
@login_required(login_url='login')
def ondoa_size(request): 
    try: 
      if request.method == "POST":
        size_id=request.POST.get('valued')

        size_to_delete = produ_size.objects.get(pk=size_id , Interprise=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise)

        size_to_delete.delete()

        zipo_ngapi=list(produ_size.objects.select_related('bidhaa').filter(bidhaa=size_to_delete.bidhaa.id).values('id','color','size','bidhaa','idadi','bidhaa__bidhaa__idadi_jum','bidhaa__idadi','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum'))
      
        data={
               'sizing':zipo_ngapi,
               'rangi':size_to_delete.color.id,
              'success':True,
              'message_swa':'Size imeondolewa kwa ukamilifu',
              'message_eng':'The item size has been removed successfully'
                     
        }
            
        return JsonResponse(data)
      else:
           return render(request,'pagenotFound.html',todoFunct(request)) 
    except:
        data={
             
              'success':False,
              'message_swa':'Oparesheni ya kuondoa size haijafanikiwa kutokana na hitilafu',
              'message_eng':'Oparation was not succeffully due to error please try again'
                     
        }
            
        return JsonResponse(data)

# COLOR REMOVAL....................................................................................................................................//
@login_required(login_url='login')
def ondoa_color(request): 
    try: 

      if request.method == "POST":
        rangi_id=request.POST.get('valued')
        intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise 


        produ =produ_colored.objects.get(pk=rangi_id,Interprise=intp).bidhaa.id

        rangi_meshi=produ_colored.objects.get(pk=rangi_id).color.id
        #kama sio mpya angalia bidhaa nyingine ambazo zina rangi kama hii.............//
        zilizopo= produ_colored.objects.filter(color=produ_colored.objects.get(pk=rangi_id).color.id).count()   
        #kama zipo nyingine basi marekebisho ya rangi hii yatasaviwa kama rangi mpya vingineyo rangi iliyopo itabadilishwa
        if zilizopo <=1:

            zipo_gapi=picha_bidhaa.objects.filter(color_produ=rangi_meshi).count()
            if zipo_gapi ==1:
                picha=picha_bidhaa.objects.get(color_produ=rangi_meshi)
                photo=picha_yenyewe.objects.get(pk=picha.picha.id)
                photo.picha.delete(save=True)
                photo.delete()
            rangi=color_produ.objects.get(pk=produ_colored.objects.get(pk=rangi_id).color.id)
            rangi.delete()

        else:    
            rangi_produ=produ_colored.objects.get(pk=rangi_id)
            rangi_produ.delete()
            
   
        bidhaaRangi =list(produ_colored.objects.select_related('bidhaa_stoku','color_produ').filter(Interprise=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise,bidhaa=produ).values('id','bidhaa','color','idadi','color__color_code','color__color_name','color__colored','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum','bidhaa__bidhaa__idadi_jum','bidhaa__idadi').order_by("-pk"))  
        data={
             'rangi':bidhaaRangi,
              'success':True,
              'message_swa':'Rangi imeondolewa kwa ukamilifu',
              'message_eng':'The color has been removed successfully'
                     
        }

         

        return JsonResponse(data)    
      else:
           return render(request,'pagenotFound.html',todoFunct(request))  
    except:
         
            data={
                            'success':False,
                            'message_swa':'Oparesheni haikufanikiwa Tafadhari Jaribu tena kwa usahihi',
                            'message_eng':'The Operation was unsuccessfully please try again'
                        }

            return JsonResponse(data)

#SIZE SAVINGS....................................................................//
@login_required(login_url='login')
def save_size(request): 
    try: 
      if request.method == "POST":
         name=request.POST.get('valued')
         size_name=request.POST.get('size_name')
         color_code=request.POST.get('color_code')
         mpya=request.POST.get('mpya')
         rangi_id=request.POST.get('rangi')
         size_id=request.POST.get('size')
         idadi_jum=int(request.POST.get('idadi_jum'))
         idadi_reja=int(request.POST.get('idadi_reja'))
         intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise 
         produ = bidhaa_stoku.objects.get(pk=name)
        
        
        #  Angalia kama ni update ya size au size mpya kwa kutumia mpya valiable.............................//
         sizing=produ_size()
         sizen=sizes()

         idadi_halisi=0 
         idadi_ya_rangi=0
            #  Angalia idadi ya bidhaa zilizopo kwa rangi hii ili kuangalia kama zimezidi.......................//

         if produ_size.objects.filter(bidhaa=produ.id).exists():
            idadi_sum=produ_size.objects.filter(bidhaa=produ.id).aggregate(Sum('idadi'))
            idadi_halisi=idadi_sum['idadi__sum']
        
            if produ_size.objects.filter(bidhaa=produ.id,sized__color=rangi_id).count()>1:
                idadi_color=produ_size.objects.filter(bidhaa=produ.id,sized__color=rangi_id).exclude(pk=size_id).aggregate(Sum('idadi'))
                idadi_ya_rangi=idadi_color['idadi__sum']  

         if mpya == 'false':

            sizing=produ_size.objects.get(pk=size_id,Interprise=intp)
            sizen=sizes.objects.get(pk=sizing.sized.id)


            if produ.idadi>=(float(idadi_reja)+(float(idadi_jum)*float(produ.bidhaa.idadi_jum))):
                colored_sum=produ_colored.objects.filter(bidhaa=name,color=rangi_id).aggregate(Sum('idadi'))
                colored_one= colored_sum['idadi__sum']  

                if colored_one >=(float(idadi_ya_rangi) + float(idadi_reja)+(float(idadi_jum)*float(produ.bidhaa.idadi_jum))) or color_produ.objects.filter(pk=rangi_id,colored=False).exists():
                    sizen.size=size_name
                    # sizing.idadi=  idadi_reja+(idadi_jum*produ.bidhaa.idadi_jum) 
                    sizen.save()
                    sizing.save() 
                    
                    # sized=list(produ_size.objects.select_related('bidhaa_stoku').filter(Interprise=intp).values('id','color','size','bidhaa','idadi','bidhaa__bidhaa__idadi_jum','bidhaa__idadi','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum'))

                    data={   'rangi':rangi_id,
                                # 'sizing':sized,
                                'success':True,
                                'szn':True,
                                'message_swa':'kielelezo cha size kwa bidhaa kimefanikiwa',
                                'message_eng':'the size attribute for Item updated succeffully'
                        }

                    return JsonResponse(data)   
                else:
                    data={
                                    'success':False,
                                    'message_swa':'idadi ya bidhaa kwa size hii imezidi zilizopo stoku  kwa rangi iliyochaguliwa ',
                                    'message_eng':'The quantity for this size exceeds the actual number of selected color items in stock'
                                }

                    return JsonResponse(data)   

            else:    
                data={
                    'success':False,
                    'message_swa':'idadi ya bidhaa kwa size hii imezidi Idadi ya bidhaa zilizopo',
                    'message_eng':'The quantity for this size exceeds the actual number of items in stock'
                }

                return JsonResponse(data)                                      
         else:

            sizen.size = size_name

            sizing.bidhaa=produ
            sizing.Interprise=intp
            sizing.owner=intp.owner.user
            sizing.idadi=  idadi_reja+(idadi_jum*produ.bidhaa.idadi_jum) 



           

            if produ.idadi>=(idadi_halisi + idadi_reja+(idadi_jum*produ.bidhaa.idadi_jum)):

                if color_produ.objects.filter(pk=rangi_id).exists():
                    rangi_id=color_produ.objects.get(pk=rangi_id)
                    sizen.color=rangi_id

                    # fiding the color sum of total items and compare it to the added size sum..............................................................//
                    let = produ_colored.objects.filter(bidhaa=name,color=rangi_id.id,Interprise=intp).aggregate(Sum('idadi'))['idadi__sum']
                   
                    if let>=(idadi_ya_rangi + idadi_reja+(idadi_jum*produ.bidhaa.idadi_jum)) or color_produ.objects.filter(pk=rangi_id.id,colored=False).exists():
                        sizen.save()

                        sizing.sized=sizen
                        sizing.save() 

                        sized=list(produ_size.objects.select_related('bidhaa_stoku,sizes').filter(bidhaa=name).values('id','sized__color','sized__size','bidhaa','idadi','bidhaa__bidhaa__idadi_jum','bidhaa__idadi','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum'))

                        data={   'rangi':rangi_id.id,
                                    'sizing':sized,
                                    'success':True,
                                    'message_swa':'kielelezo cha size kwa bidhaa kimefanikiwa',
                                    'message_eng':'the size attribute for Item updated succeffully'
                            }

                        return JsonResponse(data)
                    else:
                            data={
                                            'success':False,
                                            'message_swa':'idadi ya bidhaa kwa size hii imezidi zilizopo stoku  kwa rangi iliyochaguliwa ',
                                            'message_eng':'The quantity for this size exceeds the actual number of selected color items in stock'
                                        }

                            return JsonResponse(data)                     
                else:
                    if produ_colored.objects.filter(bidhaa=name).exists():
                        color_av = produ_colored.objects.filter(bidhaa=name).last()
                        rangi_id= color_produ.objects.get(pk=color_av.color.id)
                    else:
                        rangi_id=color_produ()
                        rangi_id = color_produ()
                        rangi_id.color_code='#ffffff'
                        rangi_id.color_name='none'
                        rangi_id.colored=False
                        rangi_id.save()

                        coloring=produ_colored()
                        coloring.bidhaa=bidhaa.objects.get(pk=name)
                        coloring.color=rangi_id
                        coloring.idadi=0
                        coloring.Interprise=intp
                        coloring.owner=intp.owner.user
                        coloring.save()
        

                    sizen.color=rangi_id
                    sizen.save()
                    sizing.sized = sizen
                    sizing.save() 

                    sized=list(produ_size.objects.select_related('bidhaa_stoku,sizes').filter(bidhaa=name).values('id','sized__color','sized__size','bidhaa','idadi','bidhaa__bidhaa__idadi_jum','bidhaa__idadi','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum'))

                    data={   'rangi':rangi_id.id,
                            'sizing':sized,
                            'success':True,
                            'message_swa':'kielelezo cha size kwa bidhaa kimefanikiwa',
                            'message_eng':'the size attribute for Item updated succeffully'
                    }

                    return JsonResponse(data)

            else:    
                data={
                    'success':False,
                    'message_swa':'idadi ya bidhaa kwa size hii imezidi Idadi ya bidhaa zilizopo',
                    'message_eng':'The quantity for this size exceeds the actual number of items in stock'
                }

                return JsonResponse(data)
      else:
           return render(request,'pagenotFound.html',todoFunct(request))       
    except:
        data={
                    'success':False,
                    'message_swa':'Taarifa za size hazikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
                    'message_eng':'Size is not saved due to error please try again correctly'
                }
        return JsonResponse(data)

# Add size from purchase............................................................................................................................//
@login_required(login_url='login')
def addSize(request): 
    try:  
      if request.method == "POST":
            name=request.POST.get('valued')
            size_name=request.POST.get('size_name')
            rangi_id=request.POST.get('rangi')
            intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise 
          

            siz = sizes()
            siz.size = size_name
            siz.color=color_produ.objects.get(pk=rangi_id,bidhaa__owner=intp.owner.user.id)
            siz.save()
            sized=list(sizes.objects.select_related('color_produ').filter(color__bidhaa__owner=intp.owner.user).values('id','color','size','color__bidhaa','color__bidhaa__idadi_jum','color__bidhaa__vipimo','color__bidhaa__vipimo_jum'))

            data={   
                    'sizing':sized,
                    'success':True,
                    'message_swa':'kielelezo cha size kwa bidhaa kimefanikiwa',
                    'message_eng':'the size attribute for Item added succeffully'
            } 
            return JsonResponse(data)       
    
      else:
           return render(request,'pagenotFound.html',todoFunct(request)) 
    except:   
            data={   
                    'success':False,
                    'message_swa':'kielelezo cha size kwa bidhaa hajifanikiwa',
                    'message_eng':'the size attribute for Item was not added please try again'
            } 
            return JsonResponse(data)      

# key HIghlights SAVING....................................................................................................................................//
@login_required(login_url='login')
def addColor(request): 
     if request.method == "POST":
         try:  
            name=request.POST.get('valued')
            color_name=request.POST.get('color_name')
            color_code=request.POST.get('color_code')
            nick_name=request.POST.get('other_name')
            intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise 

            color =  color_produ()
            produ = bidhaa.objects.get(pk=name,owner=intp.owner.user)


            color.color_code = color_code
            color.color_name = color_name
            color.nick_name = nick_name
            color.colored = True
            color.bidhaa =produ
            color.save()

            colr =  list(color_produ.objects.select_related('bidhaa').filter(bidhaa__owner=intp.owner.user).values('color_code','color_name','colored','bidhaa','id','bidhaa__idadi_jum','bidhaa__vipimo','bidhaa__vipimo_jum'))

            data={
                        'rangi':colr,
                        'success':True,
                        'message_swa':'kielelezo cha rangi kwa bidhaa kimefanikiwa',
                        'message_eng':'Color attribute for Item added succeffully'
                    }
         except:
                data={
                    'success':False,
                    'messae_swa':'Kielelezo cha rani kwa bidhaa hakikufanikiwa',
                    'messae_eng':'Color was not saved'

                }        
         return JsonResponse(data)     
     else:
           return render(request,'pagenotFound.html',todoFunct(request)) 
    
# key HIghlights SAVING....................................................................................................................................//
@login_required(login_url='login')
def getSizeColor(request): 
     if request.method == "POST":

        try: 
            intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise 
            itemImg=[]
        
            pics = picha_bidhaa.objects.filter(picha__owner= intp.owner.user).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
            if pics.exists():
                for im in pics:
                    itemImg.append({
                        'picha__picha':im.picha.picha.url,
                        'picha':im.picha.id,
                        'id':im.id,
                        'color_produ':im.rangi,
                        'bidhaa':im.bidhaa.id

                    })  
            colr =  list(color_produ.objects.select_related('bidhaa').filter(bidhaa__owner=intp.owner.user).values('color_code','color_name','nick_name','colored','bidhaa','id','bidhaa__idadi_jum','bidhaa__vipimo','bidhaa__vipimo_jum'))
            sized=list(sizes.objects.select_related('color_produ').filter(color__bidhaa__owner=intp.owner.user).values('id','color','size','color__bidhaa','color__bidhaa__idadi_jum','color__bidhaa__vipimo','color__bidhaa__vipimo_jum'))
            itms = list(bidhaa_stoku.objects.select_related('wasambazaji','bidhaa','Interprise', 'bidhaa_aina', 'makampuni').filter(Interprise=intp).annotate(namba=F('bidhaa__namba'),curenci=F('Interprise__currencii'),vat=F('Interprise__vatper'),vat_allow=F('Interprise__vat_allow')).values('msambaji_id__jina','bidhaa__bidhaa_aina_id__aina','bidhaa__kampuni_id__kampuni_jina',
        'id','bidhaa','bidhaa__bidhaa_jina','Bei_kununua','Bei_kuuza','bidhaa__bidhaa_jina','Bei_kuuza_jum','idadi',
            'bidhaa__idadi_jum','bidhaa__vipimo','bidhaa__vipimo_jum','tanguliziwa','sirio','bidhaa__change_date','namba',
            'vat_allow','op_name','bidhaa__maelezo','curenci','zibaki','msambaji_id','vat','bidhaa__kampuni_id','bidhaa__bidhaa_aina_id','expire_date','bidhaa__saletaxInluded','bidhaa__purchtaxInluded'
        ).distinct('bidhaa'))

            data = dict()

            data['color'] = colr
            data['size'] = sized
            data['bizaa'] = itms
            data['picha'] = itemImg

            return JsonResponse(data)
        except:
            
            data = dict()
            data['color'] = []
            data['size'] = []
            data['bizaa'] = []
            data['picha'] = []

            return JsonResponse(data)
            

     else:
           return render(request,'pagenotFound.html',todoFunct(request)) 

# key HIghlights REMOVAL....................................................................................................................................//
@login_required(login_url='login')
def ondoa_sifa(request): 
    try: 
       if request.method == "POST":
         name=request.POST.get('value')
         intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
         sifa=bidhaa_sifa.objects.get(pk=name,owner=intp.owner.user.id) 
         sifa.delete() 
         sifia=list(bidhaa_sifa.objects.filter(owner=intp.owner.user).values('sifa','bidhaa','id'))

         data={     'sifa':sifia,
                    'success':True,
                    'message_swa':'kielelezo cha sifa muhimu kwa bidhaa kimeondolewa',
                    'message_eng':'the key highlights attribute for an Item removed succeffully',
                     'sm':True
            }

         return JsonResponse(data)         
       else:
           return render(request,'pagenotFound.html',todoFunct(request))   
   
    except:      
        data={
                 'success':False,
                   'message_swa':'Oparesheni haikufanikiwa Tafadhari Jaribu tena kwa usahihi',
                     'message_eng':'The Operation was unsuccessfully please try again'
                        }

        return JsonResponse(data)
         

# key HIghlights SAVING....................................................................................................................................//
@login_required(login_url='login')
def ondoa_keficha(request): 
    try: 
       if request.method == "POST":
         name=request.POST.get('value')
         intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
         sifa=key_sifa.objects.get(pk=name,owner=intp.owner.user.id) 
         sifa.delete() 
         keySifa=list(key_sifa.objects.filter(owner=intp.owner.user).values('sifa','bidhaa','id','key'))

         data={   'keysifa':keySifa,
                    'success':True,
                    'message_swa':'kielelezo cha Maelezo ya kina kwa bidhaa kimeondolewa',
                    'message_eng':'the General info attribute for an Item removed succeffully'
            }

         return JsonResponse(data)         
       else:
           return render(request,'pagenotFound.html',todoFunct(request))     
    except:      
        data={
                 'success':False,
                   'message_swa':'Oparesheni haikufanikiwa Tafadhari Jaribu tena kwa usahihi',
                     'message_eng':'The Operation was unsuccessfully please try again'
                        }

        return JsonResponse(data)

# GENERAL FEATURES SAVING....................................................................................................................................//
@login_required(login_url='login')
def maelezo_kina(request): 
    
    if request.method == "POST":
      try:     
         name=request.POST.get('valued')
         sifa_data=request.POST.get('sifa')
         idn=request.POST.get('value')
         elezo=request.POST.get('elezo')
         new=int(request.POST.get('new'))
         
         intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
         produ=bidhaa.objects.get(pk=name,owner=intp.owner.user) 
         keyFicha= key_sifa()
       
         if not new:
             keyFicha=key_sifa.objects.get(pk=idn,owner=intp.owner.user)
         else:
             keyFicha.bidhaa=produ
             keyFicha.owner=intp.owner.user 
         keyFicha.key=sifa_data
         keyFicha.sifa=elezo
         keyFicha.save()
         keySifa=list(key_sifa.objects.filter(bidhaa=produ.id).values('sifa','bidhaa','id','key'))

         data={   'keysifa':keySifa,
                    'success':True,
                    'message_swa':'kielelezo cha sifa muhimu kwa bidhaa kimefanikiwa',
                    'message_eng':'the key highlights attribute for an Item stored succeffully',
                    'ks':True
            }

         return JsonResponse(data)

      except:
        
        data={
                    'success':False,
                    'message_swa':'Oparesheni haikufanikiwa Tafadhari Jaribu tena kwa usahihi',
                        'message_eng':'The Operation was unsuccessfully please try again'
                        }

        return JsonResponse(data)         
    else:
        return render(request,'pagenotFound.html',todoFunct(request)) 

         

# key HIghlights SAVING....................................................................................................................................//
@login_required(login_url='login')
def sifa_muhimu(request): 
    try: 
      if request.method == "POST":
         name=request.POST.get('valued')
         sifa_data=request.POST.get('sifa')
         idn=request.POST.get('value')
         new=int(request.POST.get('new'))

         intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
         produ=bidhaa.objects.get(pk=name,owner=intp.owner.user)  
         sifa=bidhaa_sifa()
         if not new:
             sifa=bidhaa_sifa.objects.get(pk=idn,owner=intp.owner.user)
         else:    
            sifa.owner=intp.owner.user
            sifa.bidhaa=produ
         sifa.sifa=sifa_data
         sifa.save()

         sifia=list(bidhaa_sifa.objects.filter(bidhaa=produ.id).values('sifa','bidhaa','id'))


         data={     'sifa':sifia,
                    'success':True,
                    'message_swa':'kielelezo cha sifa muhimu kwa bidhaa kimefanikiwa',
                    'message_eng':'the key highlights attribute for an Item stored succeffully',
                    'sm':True,
                     
            }

         return JsonResponse(data)
      else:
           return render(request,'pagenotFound.html',todoFunct(request)) 
    except:
        
        data={
                 'success':False,
                   'message_swa':'Oparesheni haikufanikiwa Tafadhari Jaribu tena kwa usahihi',
                     'message_eng':'The Operation was unsuccessfully please try again'
                        }

        return JsonResponse(data)


# COLOR SAVING....................................................................................................................................//
@login_required(login_url='login')
def save_color(request): 
    try: 

      if request.method == "POST":
         name=request.POST.get('valued')
         color_name=request.POST.get('color_name')
         nick_name=request.POST.get('other_name')
         color_code=request.POST.get('color_code')
         mpya=request.POST.get('mpya')
         rangi_id=request.POST.get('rangi')
         idadi_jum=int(request.POST.get('idadi_jum'))
         idadi_reja=int(request.POST.get('idadi_reja'))

         entp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise
         produ = bidhaa_stoku.objects.get(pk=name)
        #  Angalia kama kuna update ya rangi au ni rangi mpya inawekwa.................//
        #  print('mpya:',mpya)
         if mpya == 'true':
            rangi=color_produ()
            rangi_produ=produ_colored()
         else:
            #kama sio mpya angalia bidhaa nyingine ambazo zina rangi kama hii.............//
            zilizopo= produ_colored.objects.filter(color=produ_colored.objects.get(pk=rangi_id).color.id).count()   
           #kama zipo nyingine basi marekebisho ya rangi hii yatasaviwa kama rangi mpya vingineyo rangi iliyopo itabadilishwa
            if zilizopo <1:
                rangi=color_produ()
            else:    
                rangi=color_produ.objects.get(pk=produ_colored.objects.get(pk=rangi_id).color.id)
            
            rangi_produ=produ_colored.objects.get(pk=rangi_id)
            if idadi_jum==0 and idadi_reja==0:
                 idadi_reja=rangi_produ.idadi
         idadi_halisi=0
         if produ_colored.objects.filter(bidhaa=produ,Interprise=entp).exists():
            #  Angalia idadi ya bidhaa zilizopo kwa rangi hii ili kuangalia kama zimezidi.............//
             if produ_colored.objects.filter(bidhaa=produ,Interprise=entp).exclude(pk=rangi_id).exists():
                idadi_sum=produ_colored.objects.filter(bidhaa=produ,Interprise=entp).exclude(pk=rangi_id).aggregate(Sum('idadi'))
                idadi_halisi=idadi_sum['idadi__sum']

         rangi.color_code=color_code
         rangi.nick_name=nick_name
         rangi.color_name=color_name
         rangi.colored=True
         rangi.bidhaa=produ.bidhaa


         rangi_produ.bidhaa=produ
         rangi_produ.color=rangi
         rangi_produ.Interprise=entp
         rangi_produ.owner=entp.owner.user
         rangi_produ.idadi=idadi_reja+(idadi_jum*produ.bidhaa.idadi_jum)
        #  Angalia kama idadi inazidi bidhaa zilizopo...............................................................//
         if produ.idadi>=(idadi_halisi + idadi_reja+(idadi_jum*produ.bidhaa.idadi_jum)):
            haina_rangi=0
            if picha_bidhaa.objects.filter(bidhaa=name).exists():
                # Angalia kwenye bidhaa na picha kama kuna picha za bidhaa hii...
                no_color_produ=picha_bidhaa.objects.filter(bidhaa=name).last()
                 # Angalia kwanza kama bidhaa hii ina picha ambazo tayari zimehifadhiwa kwa namna kwamba hazina rangi.......................................................//
                haina_rangi = color_produ.objects.filter(pk=no_color_produ.color_produ.id,colored=False).count() 
            if haina_rangi<=0:
                # kama hamna save
                rangi.save()
                rangi_produ.save()

                bidhaaRangi =list(produ_colored.objects.select_related('bidhaa_stoku','color_produ').filter(Interprise=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise,bidhaa=produ).values('id','bidhaa','color','idadi','color__color_code','color__color_name','color__colored','bidhaa__bidhaa__vipimo','bidhaa__bidhaa__vipimo_jum','bidhaa__bidhaa__idadi_jum','bidhaa__idadi'))  

                data={
                    'rangi':bidhaaRangi,
                    'success':True,
                    'message_swa':'kielelezo cha rangi kwa bidhaa kimefanikiwa',
                    'message_eng':'Color attribute for Item updated succeffully',
                    'cs':True
                }

                return JsonResponse(data)
            else:
                data={
                    'success':False,
                    'message_swa':'kielelezo cha rangi kwa bidhaa hakijafanikiwa kutokana na kuwapo kwa picha zinazoashiria bidhaa hii kutokuwa na rangi hivyo Ondoa kwanza picha hizo',
                    'message_eng':'Color attribute for Item was not succeffuly due to presence of uncolored image(s) please remove the image(s) to add color to the item'
                }

                return JsonResponse(data)                    

         else:
            data={
                'success':False,
                'message_swa':'idadi ya bidhaa kwa rangi hii imezidi Idadi ya bidhaa zilizopo',
                'message_eng':'The quantity for this color exceeds the actual number of items in stock'
            }

            return JsonResponse(data)
      else:
           return render(request,'pagenotFound.html',todoFunct(request))    
    except:
         
            data={
                            'success':False,
                            'message_swa':'Oparesheni haikufanikiwa Tafadhari Jaribu tena kwa usahihi',
                            'message_eng':'The Operation was unsuccessfully please try again'
                        }

            return JsonResponse(data)



@login_required(login_url='login')
def bidhaatransfer(request):  
    todo = todoFunct(request)
    transferno = 1
    transfer_str=''
    if transfer.objects.filter(Interprise=todo['duka']).exists():
       transfer_no = transfer.objects.filter(Interprise=todo['duka']).last()
    
       transferno = transfer_no.bill_no

    if transferno <10:
          transfer_str = '0000'+str(transferno)
    elif transferno <100 and transferno >=10:
          transfer_str = '000' +str(transferno)    
    elif transferno <1000 and transferno >=100:
          transfer_str = '00' +str(transferno)    
    elif transferno <10000 and transferno >=1000:
          transfer_str = '0' +str(transferno)    
    elif transferno >=10000:
          transfer_str =str(transferno) 


    todo.update({'transfer': transfer_str})
        
    
    
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:        
       return render(request,'itemtransfer.html',todo)

@login_required(login_url='login')
def bidhaaoda(request):  
    todo=todoFunct(request)


    transferno = 1
    transfer_str=''
    if transfer.objects.filter(Interprise=todo['duka']).exists():
       transfer_no = transfer.objects.filter(Interprise=todo['duka']).last()
    
       transferno = transfer_no.bill_no

    if transferno <10:
          transfer_str = '0000'+str(transferno)
    elif transferno <100 and transferno >=10:
          transfer_str = '000' +str(transferno)    
    elif transferno <1000 and transferno >=100:
          transfer_str = '00' +str(transferno)    
    elif transferno <10000 and transferno >=1000:
          transfer_str = '0' +str(transferno)    
    elif transferno >=10000 :
          transfer_str =str(transferno) 


    todo.update({
     'transfer': transfer_str,    
    })
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:        
      return render(request,'kuagiza.html',todo)



@login_required(login_url='login')
def addtranfer(request):
    if request.method == "POST":
       try: 
            used = request.user
            dukap = InterprisePermissions.objects.get(user__user = used.id, default = True)
            duka = dukap.Interprise

            oda=int(request.POST.get('oda'))
            code = request.POST.get('code')
            date = request.POST.get('date')
            to = int(request.POST.get('to'))
            reason = request.POST.get('reason')
            dt = json.loads(request.POST.get('itm'))

            data = {
                'success':True,
                'msg_swa' : 'Data za kurekodi uhamishaji wa bidhaa kutoka '+duka.name +' zimefanikiwa kikamilifu',
                'msg_eng':'Transfer transaction from '+duka.name +' was recordered successfully'
            }

            if  Interprise.objects.filter(pk =to,owner=duka.owner.id).exists():

                toentp = Interprise.objects.get(pk=to)
                if bool(oda):
                    temp = toentp
                    toentp = duka  
                    duka = temp

                tr_no = 1
                tr_code =''

                if transfer.objects.filter(Interprise__owner=duka.owner.id).exists():
                    tr_noo = transfer.objects.filter(Interprise__owner=duka.owner.id).last()
                    tr_no = tr_noo.bill_no + 1

                if tr_no <10:
                    tr_code = '0000'+str(tr_no)
                elif tr_no <100 and tr_no >=10:
                    tr_code = '000' +str(tr_no)    
                elif tr_no <1000 and tr_no >=100:
                    tr_code = '00' +str(tr_no)    
                elif tr_no <10000 and tr_no >=1000:
                    tr_code = '0' +str(tr_no)    
                elif tr_no >=10000 :
                    tr_code =str(tr_no)


                tr_to = transfer()
                tr_to.Interprise = duka
                tr_to.bill_no = tr_no
                tr_to.tarehe = datetime.datetime.now(tz=timezone.utc)
                tr_to.date = date

               

                if code == '' :
                   tr_to.code = tr_code
                else:
                    tr_to.code = code
                if bool(oda):
                    tr_to.order = True
                else:      
                    tr_to.By = dukap  

                tr_to.save() 

                # Record Notiications for the transfer ......................................//
                notice = Notifications()
                notice.Interprise = duka
                notice.date= datetime.datetime.now(tz=timezone.utc)
                notice.itmTr= True
                notice.itmTr_map= tr_to
                if duka.owner.user.id == request.user.id:
                    notice.admin_read = True
                else:
                    notice.Incharge_reade = True
                    
                notice.Incharge = todoFunct(request)['useri']    
                notice.save()
                


                rc = receive()
                rc.Interprise =  toentp  
                rc.transfer = tr_to
                rc.reasons = reason
                if bool(oda):
                    rc.By = dukap
                rc.save()

                # Record Notiications where to receive ......................................//
                notice = Notifications()
                notice.Interprise = toentp
                notice.date= datetime.datetime.now(tz=timezone.utc)
                notice.itmRcv= True
                notice.itmRcv_map= rc
                if duka.owner.user.id == request.user.id:
                    notice.admin_read = True
                else:
                    notice.Incharge_reade = True

                notice.Incharge = todoFunct(request)['useri']    
                notice.save()


                 
                for li in dt:
                    
                    idd = float(li['idadi']) * float(li['uwiano'])

                    rcL = receiveList()
                    rcL.receive = rc
                    rcL.qty = idd
                    rcL.uwiano = float(li['uwiano'])
                    rcL.save()
      
                    itm_ = bidhaa_stoku.objects.get(pk=li['val'],Interprise__owner=duka.owner.id)
                    prd=bidhaa_stoku()
                    if bool(oda):
                        # prd.inapacha = True 
                        idd = float(0)
                    if bidhaa_stoku.objects.filter(bidhaa=itm_.bidhaa.id,Interprise=toentp.id,inapacha=False).exists():
                       bidhaa_stoku.objects.filter(bidhaa=itm_.bidhaa.id,Interprise=toentp.id,inapacha=False).update(inapacha=True) 
                             
                    sumi = bidhaa_stoku.objects.filter(bidhaa=itm_.bidhaa.id,idadi__gt=0,Interprise=toentp.id).aggregate(sumi=Sum('idadi'))['sumi'] or 0
                    prd.bidhaa = itm_.bidhaa
                    prd.Interprise = toentp
                    prd.idadi =idd 
                    prd.msambaji = itm_.msambaji
                    prd.Bei_kununua = itm_.Bei_kununua
                    prd.Bei_kuuza = itm_.Bei_kuuza
                    prd.Bei_kuuza_jum = itm_.Bei_kuuza_jum
                    prd.expire_date = itm_.expire_date
                    prd.op_name = itm_.op_name
                    prd.sirio = itm_.sirio
                    prd.uhamisho = rcL
                    # trace if an item was purchased, manufactured or added
                    prd.produced = itm_.produced
                    prd.ongezwa = itm_.ongezwa
                    prd.manunuzi = itm_.manunuzi
                    prd.service = itm_.service

                    prd.save()
                    itm={

                            "itm":prd,
                            "request":request,
                            "out":False
                            }

                    updateOrder(itm)

                    rcL.before = float(sumi)
                    rcL.save()
                    
                    tr_l = transferList()
                    tr_l.kwenda = rcL
                    tr_l.toka = itm_
                    tr_l.qty_before = itm_.idadi
                    tr_l.save()

                    if len(li['color'])>0:
                        for cl in li['color']:
                            rang= produ_colored.objects.get(pk=cl['color'],Interprise=duka)
                            sumiC= produ_colored.objects.filter(color=rang.color.id,Interprise=toentp.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0
                           
                            rc_c = received_color()
                            rc_c.qty = float(cl['idadi'])
                            rc_c.qty_before = float(sumiC)
                            rc_c.save()


                            c_rang = produ_colored()
                            c_rang.bidhaa = prd
                            c_rang.color = rang.color
                            c_rang.idadi = float(cl['idadi'])
                            c_rang.Interprise = toentp
                            c_rang.received = rc_c
                            c_rang.owner = toentp.owner.user
                            c_rang.save()

                            if  not bool(oda):
                                produ_colored.objects.filter(pk=cl['color'],Interprise=duka).update(idadi=F('idadi')-float(cl['idadi']))


                            trf_c = transfered_color()
                            trf_c.toka = rang
                            trf_c.kwenda = rc_c
                            trf_c.save()

                    if len(li['size'])>0: 
                        for sz in li['size']:
                            szd = produ_size.objects.get(pk=sz['size'])
                            sumiS = produ_size.objects.filter(sized=szd.sized.id,Interprise=toentp.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0

                            rc_sz = received_size()
                            rc_sz.qty = float(sz['idadi'])
                            rc_sz.qty_before = float(sumiS)
                            rc_sz.save()

                            the_sz = produ_size()
                            the_sz.bidhaa = prd
                            the_sz.sized = szd.sized
                            the_sz.Interprise = toentp
                            the_sz.received = rc_sz
                            the_sz.idadi = float(sz['idadi'])
                            the_sz.owner = toentp.owner.user
                            the_sz.save()

                            tr_sz = transfered_size()
                            tr_sz.toka = szd
                            tr_sz.kwenda = rc_sz
                            tr_sz.save()

                            if not bool(oda):
                                produ_size.objects.filter(pk=sz['size']).update(idadi=F('idadi')-float(sz['idadi']))

                    if not bool(oda):
                        anyother =  bidhaa_stoku.objects.filter(bidhaa=itm_.bidhaa.id,Interprise=duka.id,idadi__gt=0,inapacha=False).exclude(pk=itm_.id)
                        if anyother.exists() and itm_.idadi == idd:
                            itm_.inapacha = True
                            lastp=anyother.last()
                            lastp.inapacha = False
                            lastp.save()

                            itm={
                                "itm":itm_,
                                "request":request,
                                "out":True,
                                "other":lastp
                                }
						
                            updateOrder(itm) 

                        itm_.idadi = float(itm_.idadi - idd)    
                        itm_.save()
                       
                    last_produ =  bidhaa_stoku.objects.filter(Interprise=toentp,bidhaa=prd.bidhaa.id).exclude(pk=prd.id).last()
                    last_produ.inapacha = True
                    last_produ.save()
                    
                to_comfirm = InterprisePermissions.objects.filter(Interprise=toentp.id)
                for tn in to_comfirm:
                   comf = received_confirm()
                   comf.user = tn.user
                   comf.receive = rc
                   
                   comf.save()




                data.update({
                     'bil':rc.id
                 })

               


                return JsonResponse(data)
            else:
                data = {
                'success':False,
                'msg_swa' : 'rekodi haikufanikiwa kutokana na stoku  ambayo bidhaa zinahamiswa kutokupatikana',
                'msg_eng':'Transfer transaction from '+duka.name +' was not recordered  because the destination stock was not found please try again'
         
                }

       except:
            data = {
                'success':False,
                'msg_swa' : 'Data za kurekodi uhamishaji wa bidhaa kutoka '+duka.name+' hazikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                'msg_eng':'Transfer transaction from '+duka.name +' was not recordered please try again'
            }     

            return JsonResponse(data)  
    else:
           return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def markReceive(request):
      if request.method == "POST":
       try:     
         bil=request.POST.get('bilMark')
         desc=request.POST.get('MarkBillDesc')
         mark=int(request.POST.get('bilMarked'))
         todo = todoFunct(request)
         duka = todo['duka']

         billed = receive.objects.filter(pk=bil,Interprise=duka.id)
         
         data={
                   'success':True,
                   'msg_swa':"Notisi ya kupokea bidhaa imewekewa alama kikamilifu",
                 'msg_eng':"Receive Note marked successfully" 
         }
         if billed.exists():
            billed.update(mark =mark,markDesc=desc)
            if not mark:
                  data ={
                     'success':True,
                   'msg_swa':"Alama iliyowekwa kwenye Notisi ya kupokea bidhaa imeondolewa kikamilifu",
                   'msg_eng':"Receive Notice unmarked successfully"    
                  }
         else:
            data={
                  'success':False,
                  'msg_swa':"Notisi Haikupatikana",
                  'msg_eng':"Receive note was not Found" 
                  }         

         return JsonResponse(data)    

       except:
             data={
                   'success':False,
                   'msg_swa':"Kitendo Hakikufanikiwa Kutokana na hitilafu tafadhari jaribu tena",
                   'msg_eng':"Action was not successfully please try again" 
             }  

             return JsonResponse(data)  

@login_required(login_url='login')
def markAddReg(request):
      if request.method == "POST":
       try:     
         bil=request.POST.get('bilMark')
         desc=request.POST.get('MarkBillDesc')
         mark=int(request.POST.get('bilMarked'))
         todo = todoFunct(request)
         duka = todo['duka']

         billed = stokAdjustment.objects.filter(pk=bil,Interprise=duka.id)
         
         data={
                   'success':True,
                   'msg_swa':"Notisi ya Kuongeza bidhaa imewekewa alama kikamilifu",
                 'msg_eng':"Adding Adjustment Note marked successfully" 
         }
         if billed.exists():
            billed.update(mark =mark,markDesc=desc)
            if not mark:
                  data ={
                     'success':True,
                   'msg_swa':"Alama iliyowekwa kwenye Notisi ya Kuongeza bidhaa imeondolewa kikamilifu",
                   'msg_eng':"Adjustment Notice unmarked successfully"    
                  }
         else:
            data={
                  'success':False,
                  'msg_swa':"Notisi Haikupatikana",
                  'msg_eng':"Adjustment note was not Found" 
                  }         

         return JsonResponse(data)    

       except:
             data={
                   'success':False,
                   'msg_swa':"Kitendo Hakikufanikiwa Kutokana na hitilafu tafadhari jaribu tena",
                   'msg_eng':"Action was not successfully please try again" 
             }  

             return JsonResponse(data)  


@login_required(login_url='login')
def hamisha_oda(request): 
    if request.method == "POST":
        i =  int(request.POST.get('itm'))
        todo = todoFunct(request)
       
        if receive.objects.filter(pk=i,transfer__Interprise=todo['duka'],transfer__order=True).exists():
            rec = receive.objects.get(pk=i)
            

            itm=bidhaa_stoku.objects.filter(uhamisho__receive=rec.id)
           
            sum_r = transferList.objects.filter(kwenda__receive=rec.id)

            sumi = itm.aggregate(Sum('uhamisho__qty'))
            sum_ri = sum_r.aggregate(Sum('toka__idadi'))

         #Compare the required items with the present one matches
            if sumi['uhamisho__qty__sum'] <= sum_ri['toka__idadi__sum']:
                for itn in itm:
                    
                    from_it = transferList.objects.get(kwenda=itn.uhamisho)
                    bidhaa_stoku.objects.filter(pk=from_it.toka.id).update(idadi=F('idadi')-itn.uhamisho.qty)
                    
                    clr_t = produ_colored.objects.filter(bidhaa = itn.id)

                    for cr in clr_t:
                        trnsc = transfered_color.objects.get(kwenda=cr.received)
                        produ_colored.objects.filter(pk=trnsc.toka.id).update(idadi=F('idadi')-trnsc.kwenda.qty)
                    
                    szn= produ_size.objects.filter(bidhaa=itn.id)
                    for sz in szn:
                        trs= transfered_size.objects.get(kwenda=sz.received)
                        produ_size.objects.filter(pk=trs.toka.id).update(idadi=F('idadi')-trs.kwenda.qty)

                    prod=bidhaa_stoku.objects.get(pk=itn.id)
                    prod.idadi=prod.uhamisho.qty 
                    prod.save()
                    

                data = {
                'success':True,
                'msg_swa' : 'rekodi ya bidhaa kuhamishwa kwenda '+rec.Interprise.name+ ' imefanikiwa kikamilifu' ,
                'msg_eng':'Ordered Items transfer to '+rec.Interprise.name+' was noted successfully',
                'bil':rec.id
                }
            
                transfer.objects.filter(pk=rec.transfer.id).update(order=False,By=request.user)
                return JsonResponse(data)

            else:
                data ={
                'success':False,
                'msg_swa' : 'rekodi ya bidhaa kuhamishwa kwenda '+rec.Interprise.name+ ' Haikufanikiwa kutokana na bidhaa zinazohitajika kuzidi zilizopo stoku' ,
                'msg_eng':'Ordered Items transfer to '+rec.Interprise.name+' was not recorded because the requiered items exceeds onstock items',
                'bil':rec.id
                }   

            return JsonResponse(data)

        else:
                 
            data = {
            'success':False,
            'msg_swa' : 'Notisi ya kuhamisha bidhaa haijafanikiwa kutokana na hitilafu tafadhali jaribu tena kwa usahihi' ,
            'msg_eng':'Transfer order was not converted please try again',
            
             }
     
            return JsonResponse(data)
   
    else:
           return render(request,'pagenotFound.html',todoFunct(request)) 

def trans_data(request):
    todo = todoFunct(request)
    lis_t = int(request.GET.get('lis_t',1))

    trans = receive.objects.filter(transfer__Interprise=todo['duka'])
    num = trans.count()
    trans=trans.order_by("-pk")

    p=Paginator(trans,15)
    page_num = request.GET.get('page',1)

    try:
        page = p.page(page_num)
    except:
        page = p.page(1)  
    pg_number = p.num_pages 

    todo.update({
        'pages':pg_number,
        'p_num':page_num,
        'bili':page,
        'bil_num':num,
        'got':1
    })    

    return todo

def receve_data(request):
    todo = todoFunct(request)
    lis_t = int(request.GET.get('lis_t',1))

    trans = receive.objects.filter(Interprise=todo['duka'])
    num = trans.count()
    trans=trans.order_by("-pk")

    p=Paginator(trans,15)
    page_num = request.GET.get('page',1)

    try:
        page = p.page(page_num)
    except:
        page = p.page(1)  
    pg_number = p.num_pages 

    todo.update({
        'pages':pg_number,
        'p_num':page_num,
        'bili':page,
        'bil_num':num,
        'got':1
    })    

    return todo

@login_required(login_url='login')
def ondoa_oda(request): 
    if request.method == "POST":
        rec = int(request.POST.get('itm'))
        try:

            todo = todoFunct(request)

            if receive.objects.filter(pk=rec,Interprise=todo['duka'],transfer__order=True):  
                rcv = receive.objects.get(pk=rec,Interprise=todo['duka'],transfer__order=True)
                tr=transfer.objects.get(pk=rcv.transfer.id)
                tr.delete()

                data = {
                    'success':True,
                    'msg_swa':'Notisi ya kuagiza bidhaa imeondolewa kikamilifu',
                    'msg_eng':'Receive order note has removed successfully'

                }

            return JsonResponse(data)

        except:
           data = {
                'success':False,
                'msg_swa':'Notisi ya kuagiza bidhaa haijaondolewa kutokana na hitilafu au tayari imeshatumwa tafadhari jaribu tena',
                'msg_eng':'Receive order note was not removed  please try again'

            }

           return JsonResponse(data)

    else:
           return render(request,'pagenotFound.html',todoFunct(request))             

@login_required(login_url='login')
def hakiki_oda(request): 
    if request.method == "POST":
        itm = int(request.POST.get('itm'))
        
        received_confirm.objects.filter(receive=itm,user__user=request.user).update(confirmed=True,tarehe=datetime.datetime.now(tz=timezone.utc))
        data={
            'success':True,
            'msg_swa':'Uhakiki wa kupokea bidhaa umefanikiwa',
            'msg_eng':'Receive confirmed successfully',
            'bil':itm
        }

        return JsonResponse(data)

    else:
           return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def transferNote(request): 
    
    todo = trans_data(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return  render(request,'transfer.html',todo)

@login_required(login_url='login')
def receiveNote(request):
    todo = receve_data(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'receives.html',todo) 

@login_required(login_url='login')
def viewReceives(request): 
    
    intp= request.GET.get('item_valued','')
    back= request.GET.get('back_to','')
    code = request.GET.get('code','')
    # lis_t= request.GET.get('lis_t',1)
    page_num =request.GET.get('page',1)

    todo = receve_data(request)
    duka = todo['duka']

    note_zote = receive.objects.filter(Interprise=todo['duka'])
    note_ = note_zote.last()
    got = False

    if intp!='':
        if receive.objects.filter(Interprise=todo['duka'],pk=intp).exists():
           note_ = receive.objects.get(Interprise=todo['duka'],pk=intp)
           got = True
    elif receive.objects.filter(Interprise=todo['duka'],transfer__code=code).exists() and intp == '':
        note_ = receive.objects.get(Interprise=todo['duka'],transfer__code=code)
        got = True
    lis_t = bidhaa_stoku.objects.filter(uhamisho__receive=note_.id)

    bei_u = []
    reList = []

    for li in lis_t:
        pic = picha_bidhaa.objects.filter(bidhaa=li.bidhaa.id)
        picha=''
        if pic.exists() and pic.last().picha.picha:
            picha = pic.last().picha.picha.url

        reList.append({
            'itm':li,
            'picha':picha
        })


    for li in lis_t:
          the_bei = bei_za_bidhaa.objects.filter(item=li.bidhaa.id)
          for p in the_bei:
            bei = [{
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id

            }]
            bei_u+=bei 

    color = produ_colored.objects.filter(bidhaa__uhamisho__receive=note_.id)              
    size = produ_size.objects.filter(bidhaa__uhamisho__receive=note_.id)  


    comfirmd =   received_confirm.objects.filter(receive=note_.id,confirmed=True)
    user_comfirm = received_confirm.objects.filter(user__user=request.user.id,receive=note_.id)
    
   

    if got:

        todo.update({
        'list':reList,
        'prices':bei_u,
        'size':size,
        'color':color,
        'the_bill':note_,
        'uc':user_comfirm.last(),
        'cm':comfirmd
          })

        

        if not duka.Interprise:
            return redirect('/userdash')
        else:         
            return render(request,'viewReceive.html',todo)
    else:
        todo.update({
            'got':0
        })
        if not duka.Interprise:
            return redirect('/userdash')
        else:  
            return render(request,'receives.html',todo)
           
@login_required(login_url='login')
def viewtransfer(request): 

    intp= request.GET.get('item_valued','')
    back= request.GET.get('back_to','')
    code = request.GET.get('code','')
    # lis_t= request.GET.get('lis_t',1)
    page_num =request.GET.get('page',1)

    todo = trans_data(request)

    note_zote = receive.objects.filter(transfer__Interprise=todo['duka'])
    note_ = note_zote.last()
    got = False
    if intp!='':
        if receive.objects.filter(transfer__Interprise=todo['duka'],pk=intp).exists():
           note_ = receive.objects.get(transfer__Interprise=todo['duka'],pk=intp)
           got =True
    elif receive.objects.filter(transfer__Interprise=todo['duka'],transfer__code=code).exists() and intp == '':
        note_ = receive.objects.get(transfer__Interprise=todo['duka'],transfer__code=code)
        got =True

    lis_t = bidhaa_stoku.objects.filter(uhamisho__receive=note_.id)

    reList = []
    for li in lis_t:
        pic = picha_bidhaa.objects.filter(bidhaa=li.bidhaa.id)
        picha=''
        if pic.exists() and pic.last().picha.picha:
            picha = pic.last().picha.picha.url

        reList.append({
            'itm':li,
            'picha':picha
        })

    bei_u = []

    for li in lis_t:
          the_bei = bei_za_bidhaa.objects.filter(item=li.bidhaa.id)
          for p in the_bei:
            bei = [{
                  'unit':p.jina,
                  'qty':p.idadi,
                  'price':p.bei,
                  'prod':p.item.id

            }]
            bei_u+=bei 

    color = produ_colored.objects.filter(bidhaa__uhamisho__receive=note_.id)              
    size = produ_size.objects.filter(bidhaa__uhamisho__receive=note_.id)  
    comfirmd =   received_confirm.objects.filter(receive=note_.id,confirmed=True)

    if got:
        todo.update({
            'list':reList,
            'prices':bei_u,
            'size':size,
            'color':color,
            'the_bill':note_,
            'cm':comfirmd
        })
        if not todo['duka'].Interprise:
            return redirect('/userdash')
        else: 
            return  render(request,'viewTransfer.html',todo)
    else:
        todo.update({
            'got':0
        })
        if not todo['duka'].Interprise:
            return redirect('/userdash')
        else:         
           return  render(request,'transfer.html',todo)

@login_required(login_url='login')
def bidhaaAina(request):  
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    sup = request.GET.get('sup',0)
    bf = request.GET.get('bf',0)
    duka = todo['duka']
    
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
 
    brand = makampuni.objects.filter(pk=bf,Interprise__owner=duka.owner.id)
    mahi=mahitaji.objects.filter(pk=f,Interprise=duka.id)
    todo.update({
        'mahi':mahi,
        'f':f,
        'bf':bf,
        'brand':brand,
        'sup':sup,
        'supp':sp

    })

    if not duka.Interprise:
        return redirect('/userdash')
    else: 
       return render(request,'bidhaaAina.html',todo)

@login_required(login_url='login')
def bidhaapanel(request):  
    f=request.GET.get('f',0)
    sup=request.GET.get('sup',0)
    todo = todoFunct(request)
    duka = todo['duka']
    
   

    pr=bidhaa.objects.filter(pk=f,owner=duka.owner.user.id)
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
    edit =  Notifications.objects.filter(Interprise=duka.id,Item_map__prod=f).order_by('-pk')
    todo.update(
        {
            'f':f,
            'prod':pr,
            'edit':edit,
            'supp':sp,
            'sup':sup
        }
    )
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'bidhaa.html',todo)    

@login_required(login_url='login')
def bidhaaReg(request):  
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    bf = request.GET.get('bf',0)
    sup = request.GET.get('sup',0)
    duka = todo['duka']
    brand = makampuni.objects.filter(pk=bf,Interprise__owner=duka.owner.id)
    aina = bidhaa_aina.objects.filter(pk=f,Interprise__owner=duka.owner.id)
    edit=Notifications.objects.filter(ItemCatEdit=True,ItemCat_map__aina=f) 
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)

    todo.update({
      'f':f,
      'bf':bf,
      'aina':aina,
      'edit':edit,
      'brand':brand,
      'sup':sup,
      'supp':sp
    })
    if not duka.Interprise:
        return redirect('/userdash')
    else: 
        return render(request,'registeredItems.html',todo)

@login_required(login_url='login')
def bidhaaKundi(request):  
    todo=todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'parentCategories.html',todo)

@login_required(login_url='login')
def bidhaaChapa(request):  
    f = request.GET.get('f',0)
    todo =todoFunct(request)
    duka=todo['duka']

    ain=bidhaa_aina.objects.filter(pk=f,Interprise=duka.id)
    todo.update({
        'f':f,
        'aina':ain
    })
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'bidhaaChapa.html',todo)

@login_required(login_url='login')
def sambazajitu(request):  
    todo =todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'suppliers.html',todo)

@login_required(login_url='login')
def servicepanel(request):  
    f=request.GET.get('f',0)
    sup=request.GET.get('sup',0)
    todo = todoFunct(request)
    duka = todo['duka']
    
    pr=bidhaa_aina.objects.filter(pk=f,Interprise__owner=duka.owner.id)
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
    edit =  Notifications.objects.filter(Interprise=duka.id,Item_map__prod=f).order_by('-pk')
    todo.update(
        {
            'f':f,
            'prod':pr,
            'edit':edit,
            'supp':sp,
            'sup':sup
        }
    )
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'servicesList.html',todo)    

@login_required(login_url='login')
def servicesAina(request):  
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    sup = request.GET.get('sup',0)
    bf = request.GET.get('bf',0)
    duka = todo['duka']
    
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
 
    brand = makampuni.objects.filter(pk=bf,Interprise__owner=duka.owner.id)
    mahi=mahitaji.objects.filter(pk=f,Interprise=duka.id)
    todo.update({
        'mahi':mahi,
        'f':f,
        'bf':bf,
        'brand':brand,
        'sup':sup,
        'supp':sp

    })
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'servicesAina.html',todo)

@login_required(login_url='login')
def serviceKundi(request):  
    todo=todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'serviceKundi.html',todo)


# Interprises navigations................................................//
@login_required(login_url='login')
def interpnavi(request,intp):
    todo = todoFunct(request)
    cheo = todo['cheo']
    curr_ent=cheo

    entp=Interprise.objects.filter(pk=intp,owner=cheo.user.id).exists()
    if entp:
      entpn=Interprise.objects.get(pk=intp,owner=cheo.user.id)
      
      new_ent= InterprisePermissions.objects.get(Interprise=entpn,user__user=request.user.id)
      
      curr_ent.default=False

      new_ent.default=True

      curr_ent.save()
      new_ent.save()
      return redirect('bidhaapanel')

      def message_def(boolean,swa,eng):
          data = {
              'success':boolean,
              'message_swa':swa,
              'message_eng':eng
          }
          return data



@login_required(login_url='login')
def ShowItemToVistors(request):
    if request.method == "POST":
       try:
        todo = todoFunct(request) 
        cheo = todo['cheo']
        duka = todo['duka']
        chk= int(request.POST.get('chk')) 
        itm = int(request.POST.get('itm'))

        if cheo.owner or ( cheo.product_edit and not cheo.viewi ):
            prod = bidhaa_stoku.objects.get(pk=itm,Interprise=duka.id)
            prod.showToVistors = chk
            prod.save()

            msg_swa = 'Bidhaa Haitaoneshwa kwa Watembeleaji'
            msg_eng = 'The Item will not be displayed to vistors'


            if chk:
                
                msg_swa = 'Bidhaa Itaoneshwa kwa Watembeleaji'
                msg_eng = 'The Item will be displayed to vistors'



            data =  {
                'success':True,
                'msg_swa':msg_swa,
                'msg_eng':msg_eng
            }

            return JsonResponse(data)

        else:
                data={
                    'success':False,
                    'message_swa':'Hauna ruhusa ya Kubadili taarifa za bidhaa kwa sasa. Tafadhari wasiliana na Uongozi wako',
                    'message_eng':'You have no permission to edit item. Please contact the admin'
                } 
                return JsonResponse(data)  


       except:
            data={
                'success':False,
                'msg_swa':'Kitendo Hakikufanikiwa Kutokana na Hitilafu Tafadhari Jaribu Tena Kwa usahihi',
                'msg_eng':'Action was not successfully please try again correctly'
            }

            return JsonResponse(data)

    else:
           return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def ItemVoice(request):
    if request.method == "POST":
       try:
        todo = todoFunct(request) 
        cheo = todo['cheo']
        duka = todo['duka']
        itm = int(request.POST.get('itm',0))
        aina = int(request.POST.get('aina',0))
        brand = int(request.POST.get('brand',0))
        kundi = int(request.POST.get('kundi',0))

       

        audio = request.FILES['audioFile']

        if cheo.owner or ( cheo.product_edit and not cheo.viewi ):
            prod = None
            
            SIZES = 0 
            if itm:
              prod = bidhaa.objects.get(pk=itm,owner=duka.owner.user.id)
            if aina:
              prod =  bidhaa_aina.objects.get(pk=aina,Interprise__owner=duka.owner.id)   
              
            if brand:
               prod = makampuni.objects.get(pk=brand,Interprise__owner=duka.owner.id)   
               
            if kundi:
               prod = mahitaji.objects.get(pk=kundi,Interprise__owner=duka.owner.id)   
               
            siz = audio.size
            
            Item = bidhaa_stoku.objects.filter(Interprise=duka.id)

            BforSize = len(Item.filter(bidhaa__Asize__gt=1).distinct('bidhaa'))
            BAforSize =  len(Item.filter(bidhaa__bidhaa_aina__Asize__gt=1).distinct('bidhaa__bidhaa_aina'))
            MahforSize = len(Item.filter(bidhaa__bidhaa_aina__mahi__Asize__gt=1).distinct('bidhaa__bidhaa_aina__mahi'))
            BrforSize = len(Item.filter(bidhaa__kampuni__Asize__gt=1).distinct('bidhaa__kampuni'))
            
            SIZES = float(BforSize) + float(BAforSize) + float(MahforSize) + float(BrforSize)

           

            if siz/1024 <=2000  and SIZES <= 15: 
                gcs_storage = default_storage
                if not settings.DEBUG:
                    gcs_storage = settings.GCS_STORAGE_INSTANCE
                ext = audio.name.split('.')[-1]
                filename = f"{prod.id}_{prod.__class__.__name__}_voice.{ext}"
                path = gcs_storage.save(f'audio/{filename}', audio) 

                prod.audio = path
                prod.Asize = float(siz)
                prod.save()


                success = True
                msg_swa = 'Maelezo kwa sauti yameongezwa kikamilifu'
                msg_eng = 'Voice Description addede successfully'
            else:
                 
                if siz/1024 > 2000: 
                    success = False
                    msg_swa = 'Faili la sauti limezidi ukubwa unaotakiwa'
                    msg_eng = 'Audio file exceeded the required size'
                else:
                        
                    success = False
                    msg_swa = 'Hakuna nafasi ya kutosha kwa faili la sauti kuhifadhiwa tafadhari punguza saizi'
                    msg_eng = 'No enough space for the file'

            data =  {
                'success':success,
                'msg_swa':msg_swa,
                'msg_eng':msg_eng
            }

            return JsonResponse(data)

        else:
                data={
                    'success':False,
                    'message_swa':'Hauna ruhusa ya Kubadili taarifa za bidhaa kwa sasa. Tafadhari wasiliana na Uongozi wako',
                    'message_eng':'You have no permission to edit item. Please contact the admin'
                } 
                return JsonResponse(data)  


       except:
            data={
                'success':False,
                'msg_swa':'Kitendo Hakikufanikiwa Kutokana na Hitilafu Tafadhari Jaribu Tena Kwa usahihi',
                'msg_eng':'Action was not successfully please try again correctly'
            }

            return JsonResponse(data)

    else:
           return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def RemoveItemAudio(request):
    if request.method == "POST":
       try:
        todo = todoFunct(request) 
        cheo = todo['cheo']
        duka = todo['duka']
     
        itm = int(request.POST.get('itm',0))
        aina = int(request.POST.get('aina',0))
        brand = int(request.POST.get('brand',0))
        kundi = int(request.POST.get('kundi',0))        

        if cheo.owner or ( cheo.product_edit and not cheo.viewi ):

            prod = None

            if itm:
              prod = bidhaa.objects.get(pk=itm,owner=duka.owner.user.id)
              
            if aina:
              prod =  bidhaa_aina.objects.get(pk=aina,Interprise__owner=duka.owner.id)   

            if brand:
               prod = makampuni.objects.get(pk=brand,Interprise__owner=duka.owner.id)   
            
            if kundi:
               prod = mahitaji.objects.get(pk=kundi,Interprise__owner=duka.owner.id)   

            
            prod.audio.delete(save=True)  

            data =  {
                'success':True,
                'msg_swa':'Maelezo ya Sauti yameondolewa Kikamilifu',
                'msg_eng':'Voice Desc removed successfully'
            }

            return JsonResponse(data)

        else:
                data={
                    'success':False,
                    'message_swa':'Hauna ruhusa ya Kubadili taarifa za bidhaa kwa sasa. Tafadhari wasiliana na Uongozi wako',
                    'message_eng':'You have no permission to edit item. Please contact the admin'
                } 
                return JsonResponse(data)  


       except:
            data={
                'success':False,
                'msg_swa':'Kitendo Hakikufanikiwa Kutokana na Hitilafu Tafadhari Jaribu Tena Kwa usahihi',
                'msg_eng':'Action was not successfully please try again correctly'
            }

            return JsonResponse(data)

    else:
           return render(request,'pagenotFound.html',todoFunct(request)) 

