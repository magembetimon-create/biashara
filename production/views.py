from math import prod
from threading import activeCount
from typing import ItemsView
from django.shortcuts import render

import json
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from management.models import HudumaNyingine, Notifications,productionConfirm,Anatumia,matumiziTarehe,productionList,production_color,production_size,productionListDate,productionWorkers,productionWorkersDate,stockAdjst_confirm,stokAdjustment,production,Workers,UserExtend,Kanda,bei_za_bidhaa,user_Interprise,ColorChange,SizeChange,staff_akaunt_permissions,wateja,receive,receiveList,transferList,received_confirm,transfered_size,received_size,transfered_color,received_color,transfer,sizes,mauzoList,Interprise,bidhaa_sifa,key_sifa,picha_yenyewe,productChangeRecord,InterprisePermissions,PaymentAkaunts,toaCash,wekaCash,mahitaji,bidhaa_aina,makampuni,bidhaa,wasambazaji,manunuzi,manunuziList,matumizi,rekodiMatumizi,bidhaa_stoku,color_produ,produ_colored,picha_bidhaa,produ_size

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F,FloatField
from django.core import paginator, serializers
from django.db.models import Q
# from datetime import datetime
from datetime import date
from django.utils import timezone
import random
import time  
import pytz
import datetime
import re
from django.db.models import Sum
from django.forms.models import model_to_dict
import os
timezone.now()
from django.core.paginator import Paginator,EmptyPage

from accaunts.todos import Todos,updateOrder
# Create your views here.


def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()

@login_required(login_url='login')
def allProdFunct(request):
    
    todo  = todoFunct(request)
    duka=todo['duka']
    
    prdxn = production.objects.filter(Interprise=duka)


        
     
    num = prdxn.count()
    prdn = prdxn.order_by("-pk")

    
    p=Paginator(prdn,15)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages


    calcP =[]
    if prdxn.exists(): 
        for p in page:
            mat_tot = 0
            exptot = 0
               
            mat = productChangeRecord.objects.filter(adjst__production=p.id).annotate(uwiano=F('prod__bidhaa__idadi_jum'),itQty=F('qty'),thamani=F('prod__Bei_kununua'))
           
            expS = toaCash.objects.filter(produxn__produxn=p.id)
            
            if mat.exists():
                mat_tot = mat.aggregate(sum=Sum(F('thamani')*F('itQty')/F('uwiano')))["sum"]

            lis_t = mat.filter(prod__produced__production__production__Interprise=duka.id,thamani=0)

            if lis_t.exists():
                itm_cost = 0
                for li in lis_t:
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
                        prs = li.prod.Bei_kuuza * li.prod.produced.qty
                        pr_ratio = prs/prices_sum
                        itm_cost = (float(pr_ratio) * float(prod_sumu)) / float(li.prod.produced.qty)   
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        itm_cost = float(prod_sumu) /float(qtysm)

                    mat_tot = float(mat_tot) + float(float(itm_cost)*float(li.qty))                 

            if expS.exists():
                exptot = expS.aggregate(sum=Sum(F('Amount')))['sum']    



            calcP.append({
                'prd':p,
                'mat_tot':mat_tot,
                'exptot':exptot,
                'total':float(mat_tot) + float(exptot)
            })
        

    todo.update({
     
     
    'p_num':page_num,
     'pages':pg_number,
    'prdn_num':num,
    'page':page,
    'bili':calcP,      
    })

    return todo

@login_required(login_url='login')
def allProduction(request):
    todo = allProdFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'allproduction.html',todo)

@login_required(login_url='login')
def producedItems(request):
    f=request.GET.get('f',0)
    sup=request.GET.get('sup',0)
    pr=request.GET.get('pr',0)
    todo = todoFunct(request)
    duka = todo['duka']
    
    prdxn = production.objects.filter(pk=pr,Interprise=duka.id)
    prod=bidhaa.objects.filter(pk=f,owner=duka.owner.user.id)
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
    edit =  Notifications.objects.filter(Interprise=duka.id,Item_map__prod=f).order_by('-pk')
    todo.update(
        {
            'f':f,
            'prod':prod,
            'edit':edit,
            'sup':sup,
            'supp':sp,
            'pr':pr,
            'prdxn':prdxn
        }
    )
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'producedItems.html',todo)

@login_required(login_url='login')
def producedReg(request):
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    bf = request.GET.get('bf',0)
    sup = request.GET.get('sup',0)
    duka = todo['duka']
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
    brand = makampuni.objects.filter(pk=bf,Interprise__owner=duka.owner.id)
    aina = bidhaa_aina.objects.filter(pk=f,Interprise__owner=duka.owner.id)
    edit=Notifications.objects.filter(ItemCatEdit=True,ItemCat_map__aina=f) 
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
       return render(request,'producedReg.html',todo)

@login_required(login_url='login')
def producedAina(request):
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    bf = request.GET.get('bf',0)
    duka = todo['duka']

    brand = makampuni.objects.filter(pk=bf,Interprise__owner=duka.owner.id)
    mahi=mahitaji.objects.filter(pk=f,Interprise=duka.id)
    todo.update({
        'mahi':mahi,
        'f':f,
        'bf':bf,
        'brand':brand,

    })
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'producedAina.html',todo)

@login_required(login_url='login')
def producedPAina(request):
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'producedPAina.html',todo)

@login_required(login_url='login')
def MaterialItems(request):
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
            'sup':sup,
            'supp':sp
        }
    )
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'MaterialItems.html',todo)

@login_required(login_url='login')
def MaterialAina(request):
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    bf = request.GET.get('bf',0)
    duka = todo['duka']

    brand = makampuni.objects.filter(pk=bf,Interprise__owner=duka.owner.id)
    mahi=mahitaji.objects.filter(pk=f,Interprise=duka.id)
    todo.update({
        'mahi':mahi,
        'f':f,
        'bf':bf,
        'brand':brand,

    })
    if not duka.Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'MaterialAina.html',todo)

@login_required(login_url='login')
def MaterialReg(request):
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    bf = request.GET.get('bf',0)
    sup = request.GET.get('sup',0)
    duka = todo['duka']
    sp = wasambazaji.objects.filter(pk=sup,owner=duka.owner.user.id)
    brand = makampuni.objects.filter(pk=bf,Interprise__owner=duka.owner.id)
    aina = bidhaa_aina.objects.filter(pk=f,Interprise__owner=duka.owner.id)
    edit=Notifications.objects.filter(ItemCatEdit=True,ItemCat_map__aina=f) 
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
         return render(request,'MaterialReg.html',todo)

@login_required(login_url='login')
def MaterialPAina(request):
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'MaterialPAina.html',todo)

@login_required(login_url='login')
def sambazaMaterial(request):
    todo = todoFunct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
        return render(request,'sambazajiMaterial.html',todo)

@login_required(login_url='login')
def MaterialChapa(request):
    todo = todoFunct(request)
    f = request.GET.get('f',0)
    duka=todo['duka']
    ain=bidhaa_aina.objects.filter(pk=f,Interprise=duka.id)
    todo.update({
        'f':f,
        'aina':ain
    })
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:     
       return render(request,'MaterialChapa.html',todo)

def produxnFunct(duka,pr):
    prdxn = pr
    adjst = stokAdjustment.objects.filter(production=prdxn.last().id,Interprise=duka.id)
    work =  productionWorkersDate.objects.filter(production=prdxn.last().id)
    products = productionListDate.objects.filter(production=prdxn.last().id)
    expens =  matumiziTarehe.objects.filter(produxn=prdxn.last().id)
    todo ={
        'Uses':len(adjst),
        'Work':len(work),
        'product':len(products),
        'expense':len(expens)
    }

    return todo
    
@login_required(login_url='login')
def productionUsedItems(request):
    todo = todoFunct(request)
    duka = todo['duka']
    pr =  int(request.GET.get('pr',0))
    
    prdn = 1
    prdn_str=''

    prdxn = production.objects.filter(Interprise=duka.id,pk=pr)
    usedM = []
    if prdxn.exists():
        prdn_str = prdxn.last().code

        adjst = stokAdjustment.objects.filter(production=prdxn.last().id,Interprise=duka.id)

        for ad in adjst:
            the_bill = ad
            lis_t = productChangeRecord.objects.filter(adjst=the_bill.id)
            reList = []

            tot = lis_t.annotate(uwiano=F('prod__bidhaa__idadi_jum'),thamani=F('prod__Bei_kununua')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
            
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
                        prs = li.prod.Bei_kuuza * li.prod.produced.qty
                        pr_ratio = prs/prices_sum
                        itm_cost = (float(pr_ratio) * float(prod_sumu)) / float(li.prod.produced.qty)   

                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        itm_cost = float(prod_sumu)/float(qtysm)  

                    tot = float(tot) + float(float(itm_cost)*float(li.qty)) 

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

            usedM.append(
                {
                    'list':reList,
                    'color':color,
                    'size':size,
                    'prices':bei_u,
                    'the_bill':the_bill,
                    'cm':comfirm_,
                    'uc':uc,
                    'total':tot
                }
            )

          

    else:
        if production.objects.filter(Interprise=duka.id).exists() :
                    prdnn_no = production.objects.filter(Interprise=duka.id).last()      
                    prdn = prdnn_no.code_num



        if prdn <10:
                prdn_str = '000'+str(prdn)
        elif prdn <100 and prdn >=10:
                prdn_str = '00' +str(prdn)    
        elif prdn <1000 and prdn >=100:
                prdn_str = '0' +str(prdn)    
        elif prdn <10000 and prdn >=1000:
                prdn_str =str(prdn)

      
  
                    
    todo.update({
        "pr":pr,
        "code":prdn_str,
        "prdn":prdxn,
        'usedM':usedM,
        
    })
    if prdxn.exists():
       todo.update(produxnFunct(duka,prdxn))

    if not duka.Interprise:
        return redirect('/userdash')
    else: 

        return render(request,'productionUsedMaterial.html',todo)

@login_required(login_url='login')
def productonLabours(request):
    pr = int(request.GET.get('pr',0))
    todo = todoFunct(request)
    duka= todo['duka']

    prdxn = production.objects.filter(Interprise=duka.id,pk=pr)
    # adjst = stokAdjustment.objects.filter(production=prdxn.last().id,Interprise=duka.id)
    if prdxn.exists():
        worked = []
        work =  productionWorkersDate.objects.filter(production=prdxn.last().id)
        if work.exists():
            for w in work:
                worked.append({
                    'the_bill':w,
                    'list':productionWorkers.objects.filter(date=w.id)

                })

        todo.update({
            'pr':pr,
            'prdn':prdxn,
            'code':prdxn.last().code,
            'Works':worked,
        })

        
        todo.update(produxnFunct(duka,prdxn))
        if not duka.Interprise:
            return redirect('/userdash')
        else:         
            return render(request,'productionLabors.html',todo)
    else:
        return redirect('/production/productionUsedItems')
            
@login_required(login_url='login')
def productonExpenses(request):
    pr = int(request.GET.get('pr',0))
    todo = todoFunct(request)
    duka= todo['duka']

    prdxn = production.objects.filter(Interprise=duka.id,pk=pr)
    
    if prdxn.exists():
        expensed = []
        expens =  matumiziTarehe.objects.filter(produxn=prdxn.last().id)
        tumizi = matumizi.objects.filter(owner=duka.owner.user.id)
        if expens.exists():
            for ex in expens:
                toas = None
                toa_m = toaCash.objects.filter(produxn=ex.id)
                if toa_m.exists():
                    toas = toa_m.last()

                expensed.append({
                    'the_bill':ex,
                    'toa':toas,
                    'list':rekodiMatumizi.objects.filter(matumiziDeti=ex.id)

                })

        todo.update({
            'pr':pr,
            'prdn':prdxn,
            'code':prdxn.last().code,
            'expenses':expensed,
            'matumizi':tumizi
        })

        
        todo.update(produxnFunct(duka,prdxn))
        if not duka.Interprise:
            return redirect('/userdash')
        else:         
           return render(request,'productionExpenses.html',todo)
    else:
        return redirect('/production/productionUsedItems')
            
@login_required(login_url='login')
def productonYield(request):
    pr = request.GET.get('pr',0)
    todo = todoFunct(request)
    duka = todo['duka']

    prdxn = production.objects.filter(pk=pr,Interprise=duka.id)
    products = []
    if prdxn.exists():
        

        prodctDt = productionListDate.objects.filter(production=prdxn.last().id)

        for ad in prodctDt:
            the_bill = ad
            lis_t = bidhaa_stoku.objects.filter(produced__production=the_bill.id)
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

            color = production_color.objects.filter(product__production=the_bill.id)
            size = production_size.objects.filter(color__product__production=the_bill.id)

              
            
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

            products.append(
                {
                    'list':reList,
                    'color':color,
                    'size':size,
                    'prices':bei_u,
                    'the_bill':the_bill,
                  
                }
            )

    
    

        todo.update({
            'pr':int(pr),
            'prdn':prdxn,
            'code':prdxn.last().code,
            'products':products
        })

        todo.update(produxnFunct(duka,prdxn))
        if not duka.Interprise:
            return redirect('/userdash')
        else:         
            return render(request,'productionYield.html',todo)
    else:
        return redirect('/production/productionUsedItems')

@login_required(login_url='login')
def productonReport(request):
    pr = request.GET.get('pr',0)
    
    
    todo=allProdFunct(request)
    duka = todo['duka']

    prdxn = production.objects.filter(pk=pr,Interprise=duka.id)


    if prdxn.exists():

    # USED MATERIALS
          
        
       
        def getMaterial():
            liss=[] 
            lis_t=productChangeRecord.objects.filter(adjst__production=prdxn.last().id)
            usedMTotal = 0
            reList = []
            tot = lis_t.annotate(uwiano=F('prod__bidhaa__idadi_jum'),thamani=F('prod__Bei_kununua')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
            
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
                        prs = li.prod.Bei_kuuza * li.prod.produced.qty
                        pr_ratio = prs/prices_sum
                        itm_cost = (float(pr_ratio) * float(prod_sumu)) / float(li.prod.produced.qty) 
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        itm_cost = float(prod_sumu)/float(qtysm)     

                    tot = float(tot) + float(float(itm_cost)*float(li.qty)) 
                    

                reList.append({
                    'itm':li,
                    'picha':picha,
                    'cost':itm_cost,
                    'produced':int(li.prod.produced is not None)
                })

            color = ColorChange.objects.filter(change__adjst__production=prdxn.last().id)
            size = SizeChange.objects.filter(color__change__adjst__production=prdxn.last().id)

            
            
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

            liss.append({
                            'list':reList,
                            'color':color,
                            'size':size,
                            'prices':bei_u,
                            'total':tot
                        })
            return {'liss':liss,'tot':tot}            
        
        def getProducts():
            products = []
            tot_sales = 0
            lis_t = bidhaa_stoku.objects.filter(produced__production__production=pr)
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

            color = production_color.objects.filter(product__production__production=pr)
            size = production_size.objects.filter(color__product__production__production=pr)

              
            
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

            products.append(
                {
                    'list':reList,
                    'color':color,
                    'size':size,
                    'prices':bei_u,
                    
                   
                  
                }
            )

            notSureAmount = lis_t.filter(produced__notsure=True).aggregate(sum=Sum(F('produced__expqty')*F('Bei_kuuza')))['sum'] or 0
            SureAmount = lis_t.filter(produced__notsure=False).aggregate(sum=Sum(F('produced__qty')*F('Bei_kuuza')))['sum'] or 0
            epA =  notSureAmount + SureAmount
            pdcd = {'prodLen':len(lis_t),'products':products,'totalSales':epA }

            return pdcd
            

        usedM= getMaterial()['liss']

        producedItems = getProducts()

         
        todo.update({
            'pr':int(pr),
            'prdn':prdxn,
            'code':prdxn.last().code,
            'usedM':usedM,
            'totalUsd':getMaterial()['tot'],
            'producedItems':producedItems['products'],
            'prodLen':producedItems['prodLen'],
            'TotalSale':producedItems['totalSales'],
            'conf':productionConfirm.objects.filter(prodxn=prdxn.last().id),
           'vibarua':productionWorkers.objects.filter(date__production=prdxn.last().id),
           'ghalama':rekodiMatumizi.objects.filter(matumiziDeti__produxn=prdxn.last().id),
           'expTotal':toaCash.objects.filter(produxn__produxn=prdxn.last().id).aggregate(sum=Sum(F('Amount')))['sum']
        })

        
        todo.update(produxnFunct(duka,prdxn))
        
        if not duka.Interprise:
            return redirect('/userdash')
        else:         
           return render(request,'productionRiport.html',todo)
    else:
        return redirect('/production/productionUsedItems')        

@login_required(login_url='login')
def reportPrint(request):
    pr = request.GET.get('pr',0)
    langSel = int(request.GET.get('ln',0))
    prnt= int(request.GET.get('prnt',1))
    
    
    todo=allProdFunct(request)
    duka = todo['duka']
    br = [duka.id]

    for b in todo['matawi']:
        br.append(b.Interprise.id)

    prdxn = production.objects.filter(pk=pr,Interprise__in=br)


    if prdxn.exists():

    # USED MATERIALS
          
        
       
        def getMaterial():
            liss=[] 
            lis_t=productChangeRecord.objects.filter(adjst__production=prdxn.last().id)
            usedMTotal = 0
            reList = []
            tot = lis_t.annotate(uwiano=F('prod__bidhaa__idadi_jum'),thamani=F('prod__Bei_kununua')).aggregate(sum=Sum(F('thamani')*F('qty')/F('uwiano')))['sum']
            
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
                        prs = li.prod.Bei_kuuza * li.prod.produced.qty
                        pr_ratio = prs/prices_sum
                        itm_cost = (float(pr_ratio) * float(prod_sumu)) / float(li.prod.produced.qty) 
                    else:
                        qtysm = pdcd.aggregate(sum=Sum('produced__qty'))['sum']
                        itm_cost = float(prod_sumu)/float(qtysm)     

                    tot = float(tot) + float(float(itm_cost)*float(li.qty)) 
                    

                reList.append({
                    'itm':li,
                    'picha':picha,
                    'cost':itm_cost,
                    'produced':int(li.prod.produced is not None)
                })

            color = ColorChange.objects.filter(change__adjst__production=prdxn.last().id)
            size = SizeChange.objects.filter(color__change__adjst__production=prdxn.last().id)

            
            
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

            liss.append({
                            'list':reList,
                            'color':color,
                            'size':size,
                            'prices':bei_u,
                            'total':tot
                        })
            return {'liss':liss,'tot':tot}            
        
        def getProducts():
            products = []
            tot_sales = 0
            lis_t = bidhaa_stoku.objects.filter(produced__production__production=pr)
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

            color = production_color.objects.filter(product__production__production=pr)
            size = production_size.objects.filter(color__product__production__production=pr)

              
            
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

            products.append(
                {
                    'list':reList,
                    'color':color,
                    'size':size,
                    'prices':bei_u,
                    
                   
                  
                }
            )

            pdcd = {'prodLen':len(lis_t),'products':products,'totalSales':lis_t.aggregate(sum=Sum(F('produced__qty')*F('Bei_kuuza')))['sum'] }

            return pdcd
            

        usedM= getMaterial()['liss']

        producedItems = getProducts()

         
        todo.update({
            'pr':int(pr),
            'prdn':prdxn,
            'code':prdxn.last().code,
            'usedM':usedM,
            'langSel':langSel,
            'totalUsd':getMaterial()['tot'],
            'producedItems':producedItems['products'],
            'prodLen':producedItems['prodLen'],
            'TotalSale':producedItems['totalSales'],
            'conf':productionConfirm.objects.filter(prodxn=prdxn.last().id),
           'vibarua':productionWorkers.objects.filter(date__production=prdxn.last().id),
           'ghalama':rekodiMatumizi.objects.filter(matumiziDeti__produxn=prdxn.last().id),
           'expTotal':toaCash.objects.filter(produxn__produxn=prdxn.last().id).aggregate(sum=Sum(F('Amount')))['sum'],
           'prnt':prnt
        })

        
        todo.update(produxnFunct(duka,prdxn))
        
        if not duka.Interprise:
            return redirect('/userdash')
        else:         
            return render(request,'ProdxnReportPrint.html',todo)
    else:
        return redirect('/production/productionUsedItems')        

@login_required(login_url='login')
def confirmProd(request):
    if request.method == "POST":
        try:
            pr = request.POST.get('prd')
            comf = int(request.POST.get('comf'))
            desc = request.POST.get('desc')
            todo = todoFunct(request)
            duka = todo['duka']

            prdxn=production.objects.get(pk=pr,Interprise=duka.id)
            productionConfirm.objects.filter(prodxn=prdxn.id,user=todo['cheo']).update(comfirm=comf,date=datetime.datetime.now(tz=timezone.utc),desc=desc)
            data={
                'success':True,
                'msg_swa':'Uhakiki umefanikiwa',
                'msg_eng':'Confirmation was done successfully'
            }   

            return JsonResponse(data)
        except:
            data={
                'success':False,
                'msg_swa':'Kitendo hakikufanyika kutokana na hitilafu',
                'msg_eng':'The action was not completed please try again'
            }

            return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))

def CheckInputs(prxn):
    material=stokAdjustment.objects.filter(production=prxn)
    matumizi=matumiziTarehe.objects.filter(produxn=prxn)
    labor=productionWorkersDate.objects.filter(production=prxn)

    if material.exists() or matumizi.exists() or labor.exists():
        return False
    else:
        return True    

@login_required(login_url='login')
def removeMaterialTable(request):
    if request.method == "POST":
        try:
            adj=request.POST.get('adj',0)
            todo = todoFunct(request)
            duka = todo['duka']
            adjs = stokAdjustment.objects.filter(pk=adj,production__complete=False,Interprise=duka.id)

            if adjs.exists():
                adjm  = adjs.last()
                prdxn = adjm.production.id
                if adjm.Na == todo['cheo'] or duka.owner == todo['useri']:
                    prodList = productChangeRecord.objects.filter(adjst=adjm.id)
                    adjColor = ColorChange.objects.filter(change__adjst=adjm.id)
                    adjSize = SizeChange.objects.filter(color__change__adjst=adjm.id)
                    if prodList.exists():
                        for l in prodList:
                            bidhaa_stoku.objects.filter(pk=l.prod.id).update(idadi=F('idadi')+l.qty)
                    if adjColor.exists():
                        for c in adjColor:
                            produ_colored.objects.filter(pk=c.color.id).update(idadi=F('idadi')+c.qty)        
                
                    if adjSize.exists():
                        for s in adjSize:
                             produ_size.objects.filter(pk=s.size.id).update(idadi=F('idadi')+s.qty)    

                    #  Check whether no other inputs recorded
                    adjs.delete()

                    if CheckInputs(prdxn):
                        production.objects.filter(pk=prdxn).delete()



                    data = {
                        'success':True,
                        'msg_swa':'Orodha ya vitu vilivyoingizwa kutumika imeondolewa na idadi ya vitu vilivyoondolewa imerejeshwa stoku kwa bidhaa husika',
                        'msg_eng':'The list of recorded production material was removed successfull and the quantity restored to stock items',
                        'pr':adjm.production.id                    
                    
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
def removeProducts(request):
    if request.method == "POST":
        try:
            prd=request.POST.get('prd',0)
            todo = todoFunct(request)
            duka = todo['duka']
            prodL = productionListDate.objects.filter(pk=prd,production__Interprise=duka.id)
            sitm = None
            if prodL.exists():
                prdDt  = prodL.last()
                prdxn = prdDt.production.id
                if prdDt.Na == todo['cheo'] or duka.owner == todo['useri']:
                    itms = bidhaa_stoku.objects.filter(produced__production = prdDt.id)     
                    for it in itms :
                       lpr=bidhaa_stoku.objects.filter(bidhaa=it.bidhaa.id).exclude(pk=it.id) 
                       if lpr.filter(idadi__gt=0).exists():
                          glpr = lpr.filter(idadi__gt=0).last() 
                          glpr.inapacha = False
                          glpr.save()
                          sitm = glpr
						

                       else:  

                          ppr=lpr.last()
                          ppr.inapacha = False 
                          ppr.save()
                          sitm = ppr

                    itm={
                    "itm":prodL.last(),
                    "request":request,
                    "out":True,
                    "other":sitm
                    }
                    updateOrder(itm)

                    prodL.delete()

                    
                    if CheckInputs(prdxn):
                        production.objects.filter(pk=prdxn).delete()

                    data = {
                        'success':True,
                        'msg_swa':'Orodha ya vitu vilivyoingizwa kutumika imeondolewa na idadi ya vitu vilivyoondolewa imerejeshwa stoku kwa bidhaa husika',
                        'msg_eng':'The list of recorded production material was removed successfull and the quantity restored to stock items'                      
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

# PRODUCTION EXPENSES..................................................//
@login_required(login_url='login')
def addExpenses(request):
    if request.method=="POST":
        try:
                pr=request.POST.get('pr',0)
                exp=json.loads(request.POST.get('expenses'))
                ac=int(request.POST.get('account'))
                amoRem=int(request.POST.get('remAmo'))
                expAmo=int(request.POST.get('expAmo'))

                todo = todoFunct(request)
                duka = todo['duka']
                cheo = todo['cheo']
                prdn = 1

                data={
                        'success':True,
                        'msg_swa':'Bidhaa zilizozalishwa zimeongezwa stoku kikamilifu',
                        'msg_eng':'Manufactured items/goods added to stock successfully'
                    }  
               

                if (cheo.stokAdjs and not cheo.viewi) or cheo.user == duka.owner :                    

                    acc = PaymentAkaunts.objects.get(pk=ac,Interprise__owner=duka.owner.id)  
                    prodxn = production.objects.get(pk=pr,Interprise=duka.id)  

                    if acc.Amount >= expAmo and amoRem + expAmo  <= acc.Amount and len(exp)>0:
                        ztaree = matumiziTarehe()
                        ztaree.produxn = prodxn
                        ztaree.date = datetime.datetime.now(tz=timezone.utc)
                        ztaree.Na = todo['cheo']
                        ztaree.save()

                        for ex in exp:
                            expense_n = matumizi()
                            if not int(ex['nw']):
                                expense_n = matumizi.objects.get(pk=ex['exp'],owner=duka.owner.user.id)
                            else:
                                exis = matumizi.objects.filter(matumizi__icontains=ex['newExp'])
                                if exis.exists():
                                    expense_n = exis.last()
                                else:
                                    expense_n.owner = duka.owner.user    
                                    expense_n.matumizi = ex['newExp']   
                                    expense_n.save()  

                            tumizi = rekodiMatumizi()
                            tumizi.Interprise = duka
                            tumizi.matumizi = expense_n
                            tumizi.date = date.today()
                            tumizi.tarehe = datetime.datetime.now(tz=timezone.utc)
                            tumizi.matumiziDeti = ztaree
                            
                            tumizi.kiasi = float(ex['amo'])
                            tumizi.ilolipwa = float(ex['amo'])
                            tumizi.akaunti = acc

                            tumizi.maelezo = ex['desc']
                            tumizi.by = todo['cheo']
                            tumizi.save()

                        beforweka=acc.Amount 
                        toa = toaCash()
                        toa.Akaunt = acc
                        toa.Amount = float(expAmo)
                        toa.before = beforweka
                        if amoRem > 0:
                                
                                toa.After = float(amoRem) 
                                toa.makato = beforweka-float(amoRem)
            
                        else :
                                toa.After = beforweka - expAmo 
                                toa.makato = 0
                                                
                        toa.kwenda = "Production Expense"
                        toa.maelezo = 'BIL-<a class="ivoice_details" href="/production/productonExpenses?pr='+str(prodxn.id)+'" type="button"  data-id="'+str(prodxn.id)+'">'+prodxn.code+'</a>'
                        toa.tarehe = datetime.datetime.now(tz=timezone.utc)
                        toa.by=todo['cheo']
                        toa.Interprise=duka

                        toa.prdxn=True
                        toa.produxn = ztaree

                        if not acc.onesha:
                                toa.usiri =True 
            
                        
                        if int(amoRem)>0: 
                            acc.Amount =  float(amoRem)
                        else:
                            acc.Amount = float(float(acc.Amount) - float(expAmo))

                        acc.save()              
                        toa.save() 

                        data = {
                            'success':True,
                            'msg_swa':'Ghalama nyingin za uzalishaji zimeingizwa kikamilifu',
                            'msg_eng':'Other expenses during production saved successfully',
                        }

                        return JsonResponse(data)


                    else:
                        
                        data={
                            'success':False,
                            'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                            'msg_eng':'The operation was not successfully please try again'
                        }     

                        return JsonResponse(data)   
                else:
                    data = {
                       'success':False,
                        'msg_swa':'Hauna ruhusa hii kwa sasa tafadhari wasiliana na uongozi ',
                        'msg_eng':'You have no  permission for this action please contact admin' 
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
# PRODUCTION YIELD..................................................//

@login_required(login_url='login')
def addProducts(request):
    
    if request.method=="POST":
        try:
                pr=request.POST.get('pr',0)
                itm=json.loads(request.POST.get('itm'))
                endDate=request.POST.get('date','')
                kamili=int(request.POST.get('kamili'))
                
                notsure = int(request.POST.get('notSure',0))

                todo = todoFunct(request)
                duka = todo['duka']
                cheo = todo['cheo']
                prdn = 1

                if (cheo.stokAdjs and not cheo.viewi) or cheo.user == duka.owner :

                    data={
                            'success':True,
                            'msg_swa':'Bidhaa zilizozalishwa zimeongezwa stoku kikamilifu',
                            'msg_eng':'Manufactured items/goods added to stock successfully'
                        }  


                    prodxn = production.objects.get(pk=pr,Interprise=duka.id)

                    if len(itm)>0 and ((kamili and notsure == 0) or not kamili):
                        prdn = 1
                        prdn_str=''
                        
                        if productionListDate.objects.filter(production__Interprise=duka.id).exists() :
                                    prdnn_no = productionListDate.objects.filter(production__Interprise=duka.id).last()      
                                    prdn = prdnn_no.code_num

                        if prdn <10:
                                prdn_str = '000'+str(prdn)
                        elif prdn <100 and prdn >=10:
                                prdn_str = '00' +str(prdn)    
                        elif prdn <1000 and prdn >=100:
                                prdn_str = '0' +str(prdn)    
                        elif prdn <10000 and prdn >=1000:
                            prdn_str =str(prdn)   

                        prdDate=productionListDate()
                        prdDate.production = prodxn
                        prdDate.date = datetime.datetime.now(tz=timezone.utc)
                        prdDate.Na = todo['cheo']
                        prdDate.code = prdn_str
                        prdDate.code_num = prdn + 1
                        prdDate.save()

                        for it in itm:

                            pr=bidhaa_stoku.objects.filter(pk=it['val'],Interprise=duka.id)
                            lpr = pr.last()
                            sumi = bidhaa_stoku.objects.filter(bidhaa=lpr.bidhaa.id,idadi__gt=0,Interprise=duka.id).aggregate(sumi=Sum('idadi'))['sumi'] or 0
                          
                            prL = productionList()
                            prL.production = prdDate
                            prL.before = float(sumi)
                            prL.notsure = it['notsure']
                            if it['notsure']:
                                prL.qty = 0
                                prL.expqty = it['idadi']
                            else:    
                                prL.qty = it['idadi']

                            prL.save()


                            stL = bidhaa_stoku()
                            stL.bidhaa = lpr.bidhaa
                            stL.Interprise = duka
                            if it['notsure']:
                                stL.idadi = 0
                            else:    
                                stL.idadi = float(it['idadi'])
                        
                            stL.Bei_kununua = 0
                            stL.Bei_kuuza = lpr.Bei_kuuza
                            stL.Bei_kuuza_jum = lpr.Bei_kuuza_jum
                            stL.op_name = todo['useri']
                            stL.sirio = lpr.sirio
                            stL.expire_date = it['expire'] or None
                            stL.produced = prL
                            stL.save()
                            itm={
                                "itm":stL,
                                "request":request,
                                "out":False
                                }

                            updateOrder(itm)

                            bidhaa_stoku.objects.filter(bidhaa=stL.bidhaa,Interprise=duka.id,inapacha=False).exclude(pk=stL.id).update(inapacha=True)

                            

                            if len(it['color']) > 0 and not it['notsure']:
                                for c in it['color']:
                                    rang = color_produ.objects.get(pk=c['color'],bidhaa=stL.bidhaa.id)

                                    sumiC= produ_colored.objects.filter(color=rang.id,Interprise=duka.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0


                                    prodColor = production_color()
                                    stColor = produ_colored()

                                    stColor.bidhaa = stL
                                    stColor.color = rang
                                    stColor.Interprise = duka
                                    stColor.idadi = float(c['idadi'])
                                    stColor.owner = duka.owner.user
                                    stColor.save()

                                    prodColor.product=prL
                                    prodColor.color=stColor
                                    prodColor.qty=float(c['idadi'])
                                    prodColor.before=float(sumiC)
                                    prodColor.save()

                                    if len(it['size']) > 0:
                                        for sz in it['size']:
                                            if sz['color'] == c['color']:
                                                szd = sizes.objects.get(pk=sz['size'],color=c['color'])
                                                stSize = produ_size()
                                                prodSize = production_size()

                                                sumiS = produ_size.objects.filter(sized=szd.id,Interprise=duka.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0


                                                stSize.bidhaa = stL
                                                stSize.sized = szd
                                                stSize.Interprise = duka
                                                stSize.idadi = float(sz['idadi'])
                                                stSize.owner = duka.owner.user
                                                stSize.save()

                                                prodSize.size = stSize
                                                prodSize.color = prodColor
                                                prodSize.qty = float(sz['idadi'])
                                                prodSize.before = float(sumiS)
                                                prodSize.save()

                        
                    else:

                        if not productionListDate.objects.filter(production=prodxn.id).exists():
                            data={
                                    'success':False,
                                    'msg_swa':'Oparesheni haikufanikiwa kwa sababu hakuna bidhaa iliyozalishwa',
                                    'msg_eng':'The operation was not successfully , There is no any manufactured goods'
                                }    

                    if kamili and notsure == 0 :

                        # if production is complete close all not sure quantity ..........//
                        productionList.objects.filter(production__production=prodxn.id).update(notsure=False)
                        to_comfirm = InterprisePermissions.objects.filter(Interprise=duka.id)
                        
                        # all users must comfirm and sign to the process
                        if to_comfirm.exists():
                            for tn in to_comfirm:
                                comf = productionConfirm()
                                comf.prodxn = prodxn
                                comf.user = tn
                                
                                comf.save()
                        
                        # assign the costs of produced items according to production expenses............
                        itmspr = bidhaa_stoku.objects.filter(produced__production__production=prodxn.id) 
                        for li in itmspr:
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

                            # update item cost.................................//
                            li.Bei_kununua = float(itm_cost) * float(li.bidhaa.idadi_jum)
                            li.save()

                        # Check for used items and recalculate and update the cost
                        tumiwa =  productChangeRecord.objects.filter(prod__produced__production__production=prodxn.id)
                        if tumiwa.exists():
                            for tm in tumiwa:
                                matum=rekodiMatumizi.objects.filter(adjst=tm.adjst.id)
                                amo = productChangeRecord.objects.filter(adjst=matum.last().adjst.id).aggregate(sumi=Sum(F("qty")*F('prod__Bei_kununua')/F('prod__bidhaa__idadi_jum'),output_field=FloatField()))['sumi']
                                matum.update(kiasi=float(amo),ilolipwa=float(amo)) 
                                     
                        prodxn.endDate = endDate
                        prodxn.complete = True
                        prodxn.save()
                    return JsonResponse(data)       
                else:
                    data={
                        'success':False,
                        'msg_swa':'Hauna ruhusa hii kwa sasa tafadhari wasiliana na uongozi ',
                        'msg_eng':'You have no  permission for this action please contact admin'
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

# PRODUCTION MATERIALS..................................................//
@login_required(login_url='login')
def addMaterial(request):
    if request.method=="POST":
        try:
                tare=request.POST.get('date')
                
                produ=request.POST.get('valu')
                desc=request.POST.get('desc')
                itm=json.loads(request.POST.get('itm'))

                todo = todoFunct(request)
                duka = todo['duka']
                cheo = todo['cheo']

                prdn = 1
                prdn_str=''
                
                if production.objects.filter(Interprise=duka.id).exists() :
                            prdnn_no = production.objects.filter(Interprise=duka.id).last()      
                            prdn = prdnn_no.code_num

                if prdn <10:
                        prdn_str = '000'+str(prdn)
                elif prdn <100 and prdn >=10:
                        prdn_str = '00' +str(prdn)    
                elif prdn <1000 and prdn >=100:
                        prdn_str = '0' +str(prdn)    
                elif prdn <10000 and prdn >=1000:
                        prdn_str =str(prdn)                


                if (cheo.stokAdjs and not cheo.viewi) or (cheo.user == duka.owner) and (duka.usage > 0 and duka.bill_tobePaid >= date.today()) :

                    prdxn = production()

                    produxn = production.objects.filter(pk=produ,Interprise=duka.id)
                    if produxn.exists():
                        prdxn=produxn.last()
                        produxn.update(desc=desc)
                    else:
                        prdxn.Interprise = duka
                        # prdxn.Recodeddate = datetime.datetime.now(tz=timezone.utc)
                        prdxn.code = prdn_str
                        prdxn.code_num = prdn+1
                        prdxn.Na = todo['cheo']
                        prdxn.desc = desc
                        
                       
                        if tare != '':
                           prdxn.Recodeddate =  tare
                        else:
                           prdxn.Recodeddate = datetime.datetime.now(tz=timezone.utc)
                       
                        prdxn.date = datetime.datetime.now(tz=timezone.utc)   
                        prdxn.save()

                  
                    

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
                    adj.Recodeddate = date.today() 
                    adj.code_num = adjno + 1 
                    adj.Na = todo['cheo']
                    adj.production = prdxn
                    adj.desc = desc
                    adj.code = adj_str    
                    adj.save()

                    for it in itm:
                        pr=bidhaa_stoku.objects.filter(pk=it['val'],Interprise=duka.id)
                        prc =  productChangeRecord()  
                        if pr.exists() and pr.last().idadi >= it['idadi']:
                           
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
                    to_comfirm = InterprisePermissions.objects.filter(Interprise=duka.id).exclude(user=todo['useri'].id)
                    if to_comfirm.exists():
                        for tn in to_comfirm:
                            comf = stockAdjst_confirm()
                            comf.userP = tn
                            comf.adjs = adj
                            comf.save()

                    data={
                        'pr':prdxn.id,
                        'success':True,
                        'msg_swa':'Muamala wa kuongeza bidhaa zilizotumika katika uzalishaji umefanikiwa kikamilifu',
                        'msg_eng':'New production transaction added successfully'
                    }           

                    return JsonResponse(data)                 
                else:
                    data={
                         'success':False,
                        'msg_swa':'Hauna Ruhusa ya kufanya oparesheni hii kwa sasa ',
                        'msg_eng':'You have no permission for this action'
                    } 
                    if not (duka.usage > 0 and duka.bill_tobePaid >= date.today()):
                        data = {
                             'success':False,
                            'msg_swa':'Oparesheni haijafanikiwa tafadhari  wezesha malipo baada ya matumizi ',
                            'msg_eng':'The operation was unsuccessfuly please activate payment after usage plan'
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

#ADD PRODUCTION WORKERs..................................................//
@login_required(login_url='login')
def addWorkers(request):
    if request.method == "POST":
        try:
            pr = request.POST.get('pr',0)
            work = json.loads(request.POST.get('workers'))
            todo = todoFunct(request)
            duka= todo['duka']

        

            prdxn = production.objects.filter(pk=pr,Interprise=duka.id)

           


            if prdxn.exists() and len(work)>0:
                prdn = prdxn.last()

                dateWork = productionWorkersDate()
                dateWork.production = prdn
                dateWork.date = datetime.datetime.now(tz=timezone.utc)
                dateWork.Na = todo['cheo']
                dateWork.save()

                data = {
                    'success':True,
                    'msg_swa':'Wafanyakazi na kazi walizozifanya zimeongezwa kikamilifu',
                    'msg_eng':'Workers and tasks assiggned to them added successfull',
                    'pr':int(pr)
                }

                for w in work:

                    wrk = productionWorkers()
                    wrk.worker = Workers.objects.get(pk=w['val'],Interprise=duka.id)
                    wrk.date = dateWork
                    wrk.task = w['task']
                    wrk.save()
                
                return JsonResponse(data)
            else:
                
                data={
                    'success':False,
                    'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena',
                    'msg_eng':'The action was not successfully please try again'
                }    
                return JsonResponse(data)


        except:
            data={
                'success':False,
                'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena',
                'msg_eng':'The action was not successfully please try again'
            }    
            return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))

#ADD PRODUCTION WORKERs..................................................//
@login_required(login_url='login')
def removeWorkerTask(request):
    if request.method == "POST":
        try:
            
            wk = request.POST.get('wk')
            todo = todoFunct(request)
            duka= todo['duka']
            cheo = todo['cheo']

            if (cheo.stokAdjs and not cheo.viewi) or todo['useri'] == duka.owner :
                work = productionWorkersDate.objects.filter(pk=wk,production__Interprise=duka.id)
                
                if work.exists():
                    pr =  work.last().production.id
                    work.delete()
                    
                    if CheckInputs(pr):
                        production.objects.filter(pk=pr).delete()

                    data={
                        'success':True,
                        'msg_swa':'Orodha ya wafanyakazi na kazi imeondolewa kikamilifu',
                        'msg_eng':'Workers and Task table removed successfully',
                        'pr':pr
                    }

                    return JsonResponse(data)
                else:
                    data={
                        'success':False,
                        'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena',
                        'msg_eng':'The action was not successfully please try again'
                    }    
                    return JsonResponse(data)   
            else:
                data={
                        'success':False,
                        'msg_swa':'Hauna ruhusa hii kwa sasa tafadhari wasiliana na uongozi ',
                        'msg_eng':'You have no  permission for this action please contact admin'
                    } 

                return JsonResponse(data)

        except:
            data={
                'success':False,
                'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena',
                'msg_eng':'The action was not successfully please try again'
            }    
            return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))
    
#ADD PRODUCTION WORKERs..................................................//
@login_required(login_url='login')
def removeExpense(request):
    if request.method == "POST":
        try:
            
            exp = request.POST.get('exp')
            todo = todoFunct(request)
            duka= todo['duka']
            cheo = todo['cheo']

            if (cheo.stokAdjs and not cheo.viewi) or todo['useri'] == duka.owner :
                exp = matumiziTarehe.objects.filter(pk=exp,produxn__Interprise=duka.id)
           
            
                if exp.exists():
                    pr =  exp.last().produxn.id
                    toa = toaCash.objects.filter(produxn=exp.last().id)
                    if toa.exists():
                        ac = toa.last().Akaunt
                        ac.Amount = float(float(ac.Amount) + float(toa.last().Amount))
                        ac.save()

                    exp.delete()
                    
                    if CheckInputs(pr):
                        production.objects.filter(pk=pr).delete()

                    data={
                        'success':True,
                        'msg_swa':'Ghalama za matumizi zimeondolewa kikamilifu',
                        'msg_eng':'Other expenses table removed successfully',
                        'pr':pr
                    }

                    return JsonResponse(data)
                else:
                    data={
                        'success':False,
                        'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena',
                        'msg_eng':'The action was not successfully please try again'
                    }    
                    return JsonResponse(data)   
            else:
                data={
                    'success':False,
                    'msg_swa':'Hauna ruhusa hii kwa sasa tafadhari wasiliana na uongozi ',
                    'msg_eng':'You have no  permission for this action please contact admin'
                } 

                return JsonResponse(data) 
                    
        except:
            data={
                'success':False,
                'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena',
                'msg_eng':'The action was not successfully please try again'
            }    
            return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))
    
# Workers autocomplete fill up
@login_required(login_url='login')
def Workerautocomplete(request):
    if  request.method=="GET":
        try:
            intp=InterprisePermissions.objects.get(user__user=request.user.id, default=True)
            sup=Interprise.objects.filter(Intp_code__istartswith=request.GET.get('term'),Interprise=False).exclude(owner__user=intp.admin)
            cod=list()
            # data=dict()
            # data['list']=cod
            for cd in sup:
                cod.append(cd.Intp_code)
            return JsonResponse(cod,safe=False) 
        except:
            return JsonResponse({'success':False})    

@login_required(login_url='login')
def mfanyakazi(request):
     if request.method == "POST":
        try: 
            #  intp= InterprisePermissions.objects.get(user__user=request.user,default=True)

             todo = todoFunct(request)
             duka = todo['duka']
             useri = todo['useri']
             intp = todo['cheo']

             if duka.owner.id == useri.id or (intp.addsupplier and not intp.viewi):  

                name=request.POST.get('jina')
                address=request.POST.get('adress')
                code=request.POST.get('code')
                simu1=request.POST.get('simu1')
                simu2=request.POST.get('simu2')
                kazi=request.POST.get('kazi')
                isActive=request.POST.get('isactive')
                value=request.POST.get('value')
                wId=request.POST.get('namba')
                edit=int(request.POST.get('edit'))
                wid=int(request.POST.get('valued'))


               
               
               
                worker=Workers()

                if edit:
                    worker = Workers.objects.get(pk=wid,Interprise=duka.id)

                if bool(int(isActive)):
                    V_intp= Interprise.objects.get(pk=value)
                    where = Anatumia()
                    where.where = V_intp
                    where.save()

                    name=V_intp.name
                    simu1=UserExtend.objects.get(pk=V_intp.owner.id).simu1
                    worker.Interprise = duka
                    worker.jina = V_intp.name
                    worker.address = address
                    worker.code = V_intp.countryCode
                    worker.simu1 = simu1
                    worker.simu2 = simu2
                    worker.kazi = kazi
                    worker.active = True
                    worker.diactive = where
                    worker.workerId = wId

                else:
                    worker.Interprise = duka
                    worker.jina = name
                    worker.address = address
                    worker.code = code
                    worker.simu1 = simu1
                    worker.simu2 = simu2
                    worker.kazi = kazi
                    worker.workerId = wId
                    
                if Workers.objects.filter(jina=name,Interprise=duka.id,simu1=simu1).exists() and not edit :
                    data={
                        'success':False,
                        'message_swa':'Tayari kuna  mwingine mwenye jina kama hili kama ni mwinginae unaweza kubadili jina au ondoa taarifa za mworker zilizowekwa awali',
                        'message_eng':'The same  Customer name  exists you can change the name or remove the previos saved Customer details'
                    
                    }

                else:
                    worker.save()    
                    data={
                        'success':True,
                        'message_swa':'Taarifa za mfanyakazi zimehifadhiwa kikamilifu',
                        'message_eng':'new Worker added successfully'
                        
                    }
                return JsonResponse(data)  
             else:
                 data={
                     'success':False,
                     'message_swa':'Hauna ruhusa ya kuongeza mfanyakazi kwa sasa tafadhari wasiliana na uongozi wako kupata ruhusa',
                     'message_eng':'You have no permission to add Worker please contact your administrator',
                 } 
                 return JsonResponse(data)    
        except:
             data={
                 'success':False,
                 'message_swa':'Taarifa za mfanyakazi hazijahifadhiwa kutokana na hitilafu. tafadhari jaribu tena kuweka data kwa usahihi',
                 'message_eng':'Worker info was not successfully saved. Please try again to fill correct Customer informations'
             }
             return JsonResponse(data)          
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def wokers(request):
    todo = todoFunct(request)
    
    duka=todo['duka']

    wk = productionWorkers.objects.filter(worker__Interprise=duka.id)
    
    todo.update({
        'worker':wk.distinct('worker'),
        
    })  
    if not duka.Interprise:
        return redirect('/userdash')
    else:       
       return render(request,'productionWokers.html',todo)

@login_required(login_url='login')
def labourtasks(request):
    try:
        todo = todoFunct(request)
        wrk = request.GET.get('wrk',0)
        duka = todo['duka']

        wrkr = Workers.objects.get(pk=wrk,Interprise=duka.id)
        wrkt=productionWorkers.objects.filter(worker=wrkr.id)
        
        
        num = wrkt.count()
        task = wrkt.order_by("-pk")

        
        p=Paginator(task,15)
        page_num =request.GET.get('page',1)


    
        try:
            page = p.page(page_num)

        except EmptyPage:
            page= p.page(1)

        pg_number = p.num_pages



        todo.update({
            'worker':wrkr,
            'p_num':page_num,
            'pages':pg_number,
            'num':num,
            'page':page,
        })
        if not duka.Interprise:
            return redirect('/userdash')
        else:         
            return render(request,'productionLabourTask.html',todo)
    except:
        return render(request,'errorpage.html',todoFunct(request))

@login_required(login_url='login')
def removeLaborer(request):
    if request.method == "POST":
        try:
            wk = request.POST.get('wk',0)
            todo = todoFunct(request)
            duka = todo['duka']
            cheo = todo['cheo']
            wrkt=productionWorkers.objects.filter(worker=wk,worker__owner=duka.owner.user.id)
            if wrkt.exists() and (cheo.user == duka.owner or (cheo.msaidizi and not cheo.viewi)) :   
                data = {
                    'success':False,
                    'msg_swa':'Mfanyakazi hakuondolewa kutokana nauwepo wa kazi alizozifanya',
                    'msg_eng':'Worker was not removed because there is task(s) which was assigned to this worker'
                }    

                return JsonResponse(data)     
            else:
                data={
                    'success':True,
                    'msg_swa':'Mfanyakazi ameondolewa kikamilifu',
                    'msg_eng':'Worker removed successfully'
                }

                Workers.objects.filter(pk=wk,Interprise=duka.id).delete()

                return JsonResponse(data)
        except:
            data={
                'success':False,
                'msg_swa':'Oparesheni Haikufanikiwa  tafadhari jaribu tena',
                'msg_eng':'Action was not successfully please try again'
            }    

            return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def markBatch(request):
      if request.method == "POST":
       try:     
         bil=request.POST.get('bilMark')
         desc=request.POST.get('MarkBillDesc')
         mark=int(request.POST.get('bilMarked'))
         todo = todoFunct(request)
         duka = todo['duka']

         billed = productionListDate.objects.filter(pk=bil,production__Interprise__owner=duka.owner.id)
         
         data={
                   'success':True,
                   'msg_swa':"Toleo la uzalishaji limewekewa alama kikamilifu",
                   'msg_eng':"Batch marked successfully" 
         }
         if billed.exists():
            billed.update(mark =mark,markDesc=desc)
            if not mark:
                  data ={
                     'success':True,
                   'msg_swa':"Alama iliyowekwa kwenye Toleo la uzalisaji imeondolewa kikamilifu",
                   'msg_eng':"Batch unmarked successfully"    
                  }
         else:
            data={
                  'success':False,
                  'msg_swa':"Toleo la uzalishaji Halikupatikana",
                  'msg_eng':"Batch was not Found" 
                  }         

         return JsonResponse(data)    

       except:
             data={
                   'success':False,
                   'msg_swa':"Kitendo Hakikufanikiwa Kutokana na hitilafu tafadhari jaribu tena",
                   'msg_eng':"Action was not successfully please try again" 
             }  

             return JsonResponse(data)  
