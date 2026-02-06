# from asyncio.windows_events import NULL
# from tkinter.tix import Tree

from django.forms import NullBooleanSelect
from django.shortcuts import render

# Create your views here.
from django.shortcuts import render


from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from management.models import UserExtend,Kanda,Risiti,deliveryBy,ForPrintingPupose,customer_in_cell,invoice_desk,Interprise_Rating,mahitaji,Notifications,businessReg,wateja,salePuMatch,deliveryAgents,order_from,makampuni,bidhaa,sales_size,sales_color,order_to,bidhaa_aina,Interprise,HudumaNyingine,user_customers,bei_za_bidhaa,mauzoni,pu_ret,pu_col_ret,pu_size_ret,bill_return_pu_fidia,wekaCash,color_produ,bil_return,sizes,mauzoList,produ_colored,purchased_size,purchased_color,produ_size,toaCash,wasambazaji,picha_bidhaa,matumizi,rekodiMatumizi,productChangeRecord,manunuziList,manunuzi,bidhaa_stoku,InterprisePermissions,PaymentAkaunts
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse,HttpResponseNotFound
from django.db.models import F,FloatField
from django.core import serializers
from django.db.models import Q

from datetime import date
from django.utils import timezone
timezone.now()

from datetime import datetime,timezone

import time  
import pytz
import datetime
import re
import json
from django.db.models import Sum,Avg
from django.core.paginator import Paginator,EmptyPage

# Create your views here.
from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

from accaunts.todos import Todos, updateOrder
# Create your views here.
def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()


@register.filter(name='subtract')
def subtract(value, arg):
      return value - arg  



@login_required(login_url='login')
def Allbil_funct(request):
    todo  = todoFunct(request)
    duka=todo['duka']
    lis_t =  request.GET.get('lis_t',1)
    
    bills = manunuzi.objects.filter(Interprise=duka,order=False).exclude(full_returned=True)

    unpaid = bills.filter(ilolipwa=0)

    less = bills.filter(ilolipwa__gt=0).exclude(ilolipwa=F('amount'))
    timel = bills.filter(kulipa__lte=datetime.datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")).exclude(ilolipwa=F('amount'))
    marked = bills.filter(mark=True)
    lis_t = int(lis_t)   
    if lis_t ==2:
          bills = unpaid
    elif lis_t == 3:
          bills = less
    elif lis_t == 5:
          bills = timel     
    elif lis_t == 6:
          bills = marked            
     
    num = bills.count()
    billin = bills.order_by("-pk")

    
    p=Paginator(billin,15)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    todo.update({
      'lis_t':lis_t,
     'less':less,
     'unpaid':unpaid,
     'muda':timel,
     'marked':marked,
    'p_num':page_num,
     'pages':pg_number,
    'bil_num':num,
    'bili':page,      
    })

    return todo


@login_required(login_url='login')
def AllBills(request):

    todo = Allbil_funct(request)
    if not todo['duka'].Interprise:
        return redirect('/userdash')
    else:        
       return render(request,'billizote.html',todo)



@login_required(login_url='login')
def newOda(request):
    todo  = todoFunct(request)
    return render(request,'newoda.html',todo)

@login_required(login_url='login')
def newBill(request):
    todo  = todoFunct(request)
    duka=todo['duka']
    billno = 1
    bill_str=''
    if manunuzi.objects.filter(Interprise=duka).exists():
       bill_no = manunuzi.objects.filter(Interprise=duka).last()
    
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

    todo.update({
    'bill_no' :bill_str,   
    'rudi':False,
    'ret':None
    })
    if not duka.Interprise:
        return redirect('/userdash')
    else:        
       return render(request,'newbill.html',todo)

@login_required(login_url='login')
def markBill(request):
      if request.method == "POST":
       try:     
         bil=request.POST.get('bilMark')
         desc=request.POST.get('MarkBillDesc')
         mark=int(request.POST.get('bilMarked'))
         todo = todoFunct(request)
         duka = todo['duka']

         billed = manunuzi.objects.filter(pk=bil,Interprise=duka.id)
         
         data={
                   'success':True,
                   'msg_swa':"Bili kwa manunuzi imewekewa alama kikamilifu",
                   'msg_eng':"Bill marked successfully" 
         }
         if billed.exists():
            billed.update(mark =mark,markDesc=desc)
            if not mark:
                  data ={
                     'success':True,
                   'msg_swa':"Alama iliyowekwa kwenye bili imeondolewa kikamilifu",
                   'msg_eng':"Bill unmarked successfully"    
                  }
         else:
            data={
                  'success':False,
                  'msg_swa':"Bili Haikupatikana",
                  'msg_eng':"Bill was not Found" 
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
def addBill(request):
      if request.method == "POST":
       try:     
         sup=request.POST.get('sup')
         edit=request.POST.get('edit')
         bil_val=request.POST.get('bill')
         date=request.POST.get('date')
         bill_no_=request.POST.get('bill_no')
         code_set=int(request.POST.get('code_set'))
         inalipwa=int(request.POST.get('inalipwa'))
         akaunt=int(request.POST.get('akaunt'))
        #    tumi_set=int(request.POST.get('exp_set'))
         rudi=int(request.POST.get('rudi'))
         rudi_val=int(request.POST.get('rudi_val'))
        #    tumizi=json.loads(request.POST.get('exp_dt'))
         bill=json.loads(request.POST.get('itm_dt'))
         kulipa=request.POST.get('kulipa')
         baki=request.POST.get('baki')
         baki_set=bool(int(request.POST.get('baki_set')))
         
         entp = InterprisePermissions.objects.get(user__user = request.user, default = True)
         bill_str=bill_no_
         manunu=manunuzi()
     
        #  FIND THE BILL TOTAL AMOUNT..............................// 
         bill_sum=0
         for bil in bill:
               bill_sum+=bil['bei']*bil['idadi']

            


         beforweka=0
         if bool(inalipwa):
           toakwa= PaymentAkaunts.objects.get(pk=akaunt,Interprise=entp.Interprise)
           beforweka=toakwa.Amount

         billno = 1
         if manunuzi.objects.filter(Interprise=entp.Interprise).exists():
                  bill_no = manunuzi.objects.filter(Interprise=entp.Interprise).last()      
                  billno = bill_no.bill_no
         
         if not bool(code_set):
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


        #    INCASE THE INVOINCE AIM TO REFUND THE RETURNED ITEMS..........................//
            rudi_am=0
            if bool(rudi):
                  sr = bil_return.objects.filter(pk=rudi_val,bil__Interprise=entp.Interprise)

                  if sr.exists():
                        sup = sr.last().bil.supplier_id.id
                        bil_am = float(bill_sum)
                        ret_am = float(sr.last().amount) 
                        ret_pd = float(sr.last().ilolipwa)
                        ret_dn= ret_am - ret_pd
                        rudi_am=ret_dn

                        if bil_am >= ret_dn:
                              sr.update(ilolipwa=F('amount'))
                              manunuzi.objects.filter(pk=sr.last().bil.id).update(ilolipwa=F('ilolipwa')-sr.last().amount)
                        else:
                              sr.update(ilolipwa=bil_am)  
                              manunuzi.objects.filter(pk=sr.last().bil.id).update(ilolipwa=F('ilolipwa')-bil_am)


         manunu.Interprise=entp.Interprise
         manunu.code = bill_str
          
         if bool(int(edit)) and wasambazaji.objects.filter(pk=sup).count()==0:
             manuu=manunuzi.objects.get(pk=bil_val,Interprise=entp.Interprise)

             manunu.supplier_id = manuu.supplier_id
         else:      
            manunu.supplier_id = wasambazaji.objects.get(pk=sup)

         if bool(rudi):
               if float(rudi_am) <= float(bill_sum):
                  manunu.ilolipwa = rudi_am 
               else:
                  manunu.ilolipwa = float(bill_sum)               

         if bool(inalipwa):
            manunu.kulipa = date
            manunu.full_paid = True
            manunu.akaunt =  PaymentAkaunts.objects.get(pk=akaunt)
            manunu.ilolipwa = bill_sum

         else:   
            manunu.kulipa = kulipa

         manunu.date = date   
         manunu.tarehe = datetime.datetime.now(tz=timezone.utc)   
         manunu.bill_no = billno+1


        #    for bil in tumizi:
        #          bill_sum+=bil['amount']

         manunu.amount = bill_sum
         manunu.By = entp

         
               
         if beforweka >= bill_sum or not bool(inalipwa):
            manunu.save()     
         
         for bil in bill:
            #  SAVE BILL LIST..............................//
              produ_details = bidhaa_stoku.objects.get(pk=bil['value'],Interprise=entp.Interprise)
              Rangi = produ_colored.objects.filter(bidhaa=produ_details.id)
              size = produ_size.objects.filter(bidhaa=produ_details.id)




              sumi = bidhaa_stoku.objects.filter(bidhaa=produ_details.bidhaa.id,idadi__gt=0,Interprise=entp.Interprise.id).aggregate(sumi=Sum('idadi'))['sumi'] or 0

              list_manunu = manunuziList()
              list_manunu.manunuzi = manunu
              if bil['jum']:
                  list_manunu.idadi = bil['idadi'] * float(produ_details.bidhaa.idadi_jum)
              else:
                  list_manunu.jum =  False 
                  list_manunu.idadi = bil['idadi'] 
              list_manunu.vat_included=bil['vat_include']
              list_manunu.vat_set=bil['vat_set']
              list_manunu.before=float(sumi)
              if beforweka >= bill_sum or not bool(inalipwa):
                 list_manunu.save()

            # SAVE PROD DETAILS FOR BILL .......................// 
              take_details = bidhaa_stoku()

              take_details.bidhaa = produ_details.bidhaa
              take_details.sirio = produ_details.sirio
              take_details.Interprise = entp.Interprise
              if bil['jum']:
                  take_details.idadi = bil['idadi'] * float(produ_details.bidhaa.idadi_jum)
              else:
                  take_details.idadi = bil['idadi']
                        
            #   take_details.owner = produ_details.owner

                        
              if bool(int(edit)) and wasambazaji.objects.filter(pk=sup).count()==0:
                    manuu=manunuzi.objects.get(pk=bil_val,Interprise=entp.Interprise)
                  #   manunu.supplier_id = manunu.supplier_id
                    take_details.msambaji = wasambazaji.objects.get(pk=manuu.supplier_id.id)

              else:      
                    take_details.msambaji = wasambazaji.objects.get(pk=sup)


              if bil['bei_set'] and bil['jum']:
                 take_details.Bei_kununua=float(bil['bei'])
              elif bil['bei_set'] and not bil['jum']:
                 take_details.Bei_kununua=float(float(bil['bei'])*float(produ_details.bidhaa.idadi_jum))
                    
              else:
                  if not bil['jum']:
                     take_details.Bei_kununua=float(float(bil['bei'])*float(produ_details.bidhaa.idadi_jum))
                  else:
                     take_details.Bei_kununua=float(bil['bei'])
                           
                  #   elif bil['vat_set']  and not bil['vat_include']:
                  #     take_details.Bei_kununua=produ_details.Bei_kununua*(1+(entp.Interprise.vatper/100))
                  #   else:  
                  #     take_details.Bei_kununua=produ_details.Bei_kununua*(1+(entp.Interprise.vatper/100))
                          


              if bil['sel_set'] and bil['jum']:
                 take_details.Bei_kuuza_jum=bil['sale']
                 take_details.Bei_kuuza=produ_details.Bei_kuuza
                 
              elif not bil['sel_set'] and bil['jum']:         
                 take_details.Bei_kuuza_jum=produ_details.Bei_kuuza_jum
                 take_details.Bei_kuuza=produ_details.Bei_kuuza

              elif bil['sel_set'] and not bil['jum'] :
                    take_details.Bei_kuuza_jum=produ_details.Bei_kuuza_jum  
                    take_details.Bei_kuuza=bil['sale']
              elif not bil['sel_set'] and not bil['jum'] :   
                    take_details.Bei_kuuza_jum=produ_details.Bei_kuuza_jum  
                    take_details.Bei_kuuza=produ_details.Bei_kuuza

            

              if  bil['expire']:
                  take_details.expire_date = bil['expire']

              take_details.op_name=UserExtend.objects.get(user=request.user)
           
            #   if produ_details.idadi > 0:
            #             bidhaa_stoku.objects.filter(bidhaa=produ_details.bidhaa,Interprise=entp.Interprise).update(inapacha=True)

              take_details.manunuzi = list_manunu

             
            #   KUREKODI MANUNUZI....................................................//
              before_sum = bidhaa_stoku.objects.filter(bidhaa=produ_details.bidhaa.id).aggregate(Sum('idadi'))
         
              if beforweka >= bill_sum or not bool(inalipwa):
                  bidhaa_stoku.objects.filter(bidhaa=produ_details.bidhaa.id,Interprise=entp.Interprise,inapacha=False).update(inapacha=True) 
                  take_details.save()
                  itm={
                        "itm":take_details,
                        "request":request,
                        "out":False
                        }

                  updateOrder(itm)
                  # produ_details.inapacha = True
                  # produ_details.save()
                  
                  # check if item has associated color
                  if len(bil['color'])>=1 and (take_details.bidhaa.idadi_jum==1 or not bil['jum']):
                     for set_r in bil['color']:

                        r = color_produ.objects.get(pk=int(set_r['color']),bidhaa__owner=entp.Interprise.owner.user)
                        sumiC= produ_colored.objects.filter(color=r.id,Interprise=entp.Interprise.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0


                        rangi = produ_colored()

                        rangi.bidhaa=take_details
                        rangi.color=r
                        rangi.Interprise=entp.Interprise
                        rangi.idadi=set_r['idadi']
                        rangi.owner=entp.Interprise.owner.user
                        rangi.save()

                                 
                        bill_col=purchased_color()
                              
                        bill_col.manunuzi=list_manunu
                        bill_col.bidhaa=take_details
                        bill_col.color=rangi
                        bill_col.idadi=set_r['idadi']
                        bill_col.before=float(sumiC)
                        bill_col.save()




                                      
                  if len(bil['size'])>=1 and (take_details.bidhaa.idadi_jum==1 or not bil['jum']):

                        for sz in bil['size']:
                        
                              s = sizes.objects.get(pk=sz['size'],color__bidhaa__owner=entp.admin)
                              rn = color_produ.objects.get(pk=sz['color'],bidhaa__owner=entp.admin)
                             
                              col=produ_colored.objects.filter(color=rn.id,bidhaa=take_details.id).last()
                              
                              bil_col=purchased_color.objects.get(color=col.id,bidhaa=take_details.id)

                              sumiS = produ_size.objects.filter(sized=s.id,Interprise=entp.Interprise.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0

                              # if  produ_details.idadi > 0:
                              Size=produ_size()
                              # Size.color = s.color
                              Size.sized = s
                              Size.Interprise = entp.Interprise
                              Size.idadi = sz['idadi']
                              Size.bidhaa = take_details
                              Size.owner = s.color.bidhaa.owner
                              Size.save()

                              # s=Size
                              # else:
                                    # s.idadi=sz['idadi']
                                    # s.save() 
                              bill_size= purchased_size()             
                              bill_size.manunuzi=list_manunu
                              bill_size.bidhaa=take_details
                              bill_size.size=Size
                              bill_size.color=bil_col
                              bill_size.idadi=sz['idadi']
                              bill_size.before=float(sumiS)
                              bill_size.save()
                  # record.save()

                  
         # REKODI MATUMIZI........................................................//
        #    for bil in tumizi:
        #          kutumia = rekodiMatumizi()
        #          kutumia.Interprise = entp.Interprise          
        #          kutumia.matumizi = matumizi.objects.get(pk=bil['value'])
        #          kutumia.manunuzil = True
        #          kutumia.tarehe = datetime.datetime.now(tz=timezone.utc) 
        #          kutumia.date = date
        #          kutumia.manunuzi_id = manunu
        #          kutumia.kiasi = bil['amount']
        #          if bool(inalipwa):
        #                kutumia.akaunti =  PaymentAkaunts.objects.get(pk=akaunt)
        #          kutumia.na =  request.user.first_name + ' ' +request.user.last_name
        #          if beforweka >= bill_sum or not bool(inalipwa):
        #             kutumia.save() 


         bill_no2 = manunuzi.objects.filter(Interprise=entp.Interprise).last()
         
         billno = bill_no2.bill_no
   
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

         data={
               'success':True,
               'bil':manunu.id,
               'bill_no':'BIL-'+bill_str,
               'message_swa':"Taarifa za Bili zimehifadhiwa kikamilifu",
               'message_eng':"Bill saved successfully"
         }   

         # LIPIA BILLI KAMA INALIPWA...........................................................//     
         if bool(inalipwa) and not bool(rudi):
           toakwa= PaymentAkaunts.objects.get(pk=akaunt,Interprise=entp.Interprise)
           beforweka=toakwa.Amount 

           toa = toaCash()
           toa.Akaunt = toakwa
           toa.Amount = bill_sum
           toa.before = beforweka
           if baki_set:
                 toa.After = float(baki) 
                 toa.makato = float(beforweka)-(float(baki)+float(bill_sum))

           else :
                 toa.After = float(beforweka) - float(bill_sum) 
                 toa.makato = 0
                                   
           toa.kwenda = "Items Purchase"
           toa.maelezo = 'Items Purchase'
           toa.tarehe = datetime.datetime.now(tz=timezone.utc)
           toa.by=entp
           toa.Interprise=entp.Interprise
           toa.pu=True
           toa.bill=manunu
           if not toakwa.onesha:
                 toa.usiri =True 
           if bill_sum <=  beforweka :  
              if baki_set: 
                 toakwa.Amount =  float(baki)
              else:
                 toakwa.Amount = float(toakwa.Amount) - float(bill_sum)
              toakwa.save()              
              toa.save()

              
           else:
              data={
                  'success':False,
                  'message_swa':"Kiasi kilichopo kwenye akaunti uliyochagua ni kidogo kuliko jumla ya kiasi cha bili hivyo taarifa za bili hazikuhifadhiwa",
                  'message_eng':"Bill was not saved because the bill amount exceeds the account selected amount"  
            }

        #    produ = bidhaa_stoku()        

         if bool(rudi):
             rec =   bill_return_pu_fidia()
             rec.bil = manunu
             rec.re_am = rudi_am
             rec.fidia = True
             rec.bil_rtn = bil_return.objects.get(pk=rudi_val,bil__Interprise=entp.Interprise)
             rec.save()  

        # kama ilikuwa inaeditiwa..............................................//
         if bool(int(edit)):
             manunu=manunuzi.objects.get(pk=bil_val,Interprise=entp.Interprise)
             kwenye_list=manunuziList.objects.filter(manunuzi=manunu.id)
             for lis_t in kwenye_list:
                      
                        produ = bidhaa_stoku.objects.get(manunuzi=lis_t.id)
                        
                        produ.idadi = produ.idadi - lis_t.idadi
                        produ.save()

                       
                        # KUANGALIA KAMA KUNA BIDHAA IMEONDOLEWA KWENYE BILL.................//
                        ipo = False
                        for prd in bill:
                              if prd['value'] == produ.id:
                                    ipo = True


                        if not ipo and bidhaa_stoku.objects.filter(bidhaa=produ.bidhaa).count()>1:
                              produ.delete()
                              get_last=bidhaa_stoku.objects.filter(bidhaa=produ.bidhaa).last()
                              bidhaa_stoku.objects.filter(pk=get_last.id).update(inapacha=False)



             rekodiMatumizi.objects.filter(Interprise=entp.Interprise,manunuzi_id=manunu).delete()                    
             manunu.delete()


         return JsonResponse(data)

       except:
            
         data={
               'success':False,
               'message_swa':"Taarifa za Bili hazijafanikiwa tafadhari jaribu tena kwa usahihi",
               'message_eng':"Bill data not saved please try again correctly"  
                 }
         return JsonResponse(data)  

      else:  
            return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def getBilllist(request):
      if request.method == "POST":
         intp=request.POST.get('value')            

         duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
         bill = manunuzi.objects.get(pk=intp,Interprise=duka.Interprise)

         list_manunu = bidhaa_stoku.objects.select_related('manunuziList','bidhaa').filter(manunuzi__manunuzi=bill.id).values('id','bidhaa','bidhaa__bidhaa_jina','bidhaa__idadi_jum','bidhaa__vipimo','bidhaa__vipimo_jum','bidhaa__maelezo','manunuzi__jum','manunuzi__idadi','manunuzi__vat_included','Bei_kununua','manunuzi__vat_set')

         matum = rekodiMatumizi.objects.select_related('matumizi').filter(manunuzi_id=bill.id,Interprise=duka.Interprise).values('matumizi__matumizi','date','kiasi')
         itemImg=[]
        
         pics = picha_bidhaa.objects.filter(picha__owner= duka.Interprise.owner.user).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
         if pics.exists():
            for im in pics:
                  itemImg.append({
                  'picha__picha':im.picha.picha.url,
                  'picha':im.picha.id,
                  'id':im.id,
                  'color_produ':im.rangi,
                  'bidhaa':im.bidhaa.id

                  }) 


         bil_color =  list(purchased_color.objects.select_related('produ_colored,sizes').filter(manunuzi__manunuzi=bill.id).values('id','color__color__color_code','idadi','color__color__color_name','bidhaa','manunuzi'))
         bil_size = list(purchased_size.objects.select_related('produ_size,sizes').filter(manunuzi__manunuzi=bill.id).values('id','size__size','idadi','color','manunuzi'))
         data=dict()
         data['list_manunu'] = list(list_manunu)
         data['list_matum'] = list(matum)
         data['pic'] = list(itemImg)
         data['color'] = bil_color
         data['size'] = bil_size
         return JsonResponse(data)
      else:  
            return render(request,'pagenotFound.html',todoFunct(request))                       

def viewbill_funct(request,intp,back,lis_t):
      
            duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
           
            bill = manunuzi.objects.get(pk=intp,Interprise=duka.Interprise)

            malipo = toaCash.objects.filter(Interprise=duka.Interprise.id,bill=intp)

            list_manunu = bidhaa_stoku.objects.filter(manunuzi__manunuzi=bill.id).exclude(manunuzi__idadi=F('manunuzi__rudi'))

            matum = rekodiMatumizi.objects.filter(manunuzi_id=bill.id,Interprise=duka.Interprise)
            # user = UserExtend.objects.get(user = request.user.id )



            # list_manunu = bidhaa_stoku.objects.select_related('manunuziList','bidhaa').filter(manunuzi__manunuzi=bill.id).values('id','bidhaa','bidhaa__bidhaa_jina','bidhaa__idadi_jum','bidhaa__vipimo','bidhaa__vipimo_jum','bidhaa__maelezo','manunuzi__jum','manunuzi__idadi','manunuzi__vat_included','Bei_kununua','manunuzi__vat_set')

            # matum = rekodiMatumizi.objects.select_related('matumizi').filter(manunuzi_id=bill.id,Interprise=duka.Interprise).values('matumizi__matumizi','date','kiasi')
            # itemImg=list(picha_bidhaa.objects.select_related('picha_yenyewe').filter(picha__owner= duka.Interprise.owner).values('id','picha__picha','picha','bidhaa','color_produ'))
            itemImg=picha_bidhaa.objects.filter(picha__owner= duka.Interprise.owner.user)
            
            # bil_color =  list(purchased_color.objects.select_related('produ_colored,sizes').filter(manunuzi__manunuzi=bill.id).values('id','color__color__color_code','idadi','color__color__color_name','bidhaa','manunuzi'))
            bil_color =  purchased_color.objects.filter(manunuzi__manunuzi=bill.id)
          
            # bil_size = list(purchased_size.objects.select_related('produ_size,sizes').filter(manunuzi__manunuzi=bill.id).values('id','size__size','idadi','color','manunuzi'))
            bil_size = purchased_size.objects.filter(manunuzi__manunuzi=bill.id)
          
            # data=dict()
            # data['list_manunu'] = list(list_manunu)
            # data['list_matum'] = list(matum)
            # data['pic'] = list(itemImg)
            # data['color'] = bil_color
            # data['size'] = bil_size            

     
            todo = Allbil_funct(request)
            
            todo.update({
            'color':bil_color,  
            'pic':itemImg,  
            'size':bil_size,  
            'the_bill':bill,
            'list':list_manunu,
            'matumizi':matum,
            'back':back , 
            'malipo':malipo,   
            'success':0
            })

            return todo
            
@login_required(login_url='login')
def viewbill(request):
      try:
      # if request.method == 'POST' :

            intp= request.GET.get('item_valued','')
            back= request.GET.get('back_to','')


            lis_t= request.GET.get('lis_t',1)

            
            
            todo = viewbill_funct(request,intp,back,lis_t)

            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else:                        
                return render(request,'viewbill.html',todo)
      except:
           return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def bili_return(request):
      try:
      #   if request.method == 'POST' :

            intp= request.GET.get('item_valued','')
            back= request.GET.get('back_to','')


            lis_t= request.GET.get('lis_t',1)

            page_num =request.GET.get('page',1)

            msg = request.GET.get('msg',None)

            if msg is not None:
                  msg = json.loads(msg)

            duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
            sale_no = 1
            return_str=''
            if bil_return.objects.filter(bil__Interprise=duka.Interprise).exists():
                  invo_no = bil_return.objects.filter(bil__Interprise=duka.Interprise).last()
                  sale_no = invo_no.bill_no

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

            after={
                  'lipa':False,
                  'return_coded':return_str,
                  'msg':msg
            }  
                  
            todo = viewbill_funct(request,intp,back,lis_t)

            todo.update({'then':after})

            # then = bil_return

            if not duka.Interprise:
                  return redirect('/userdash')
            else: 
                return render(request,'bil_return.html',todo)
      except:
            
            return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def allowReturn(request):
      if request.method == 'POST': 
            try: 
                  allow= int(request.POST.get('allow',0))
                  inv= request.POST.get('invo',0)
                  todo = todoFunct(request)
                  duka = todo['duka']
                    
                  invo=mauzoni.objects.filter(pk=inv,bill_kwa__Interprise=duka.id)
                  if invo.last().user_customer.by == todo['useri'] or todo['useri'] == duka.owner:
                        invo.update(confirm_return=allow)
                        data={
                              'success':True,
                              'msg_swa':'Umeruhusu muuzaji kurudisha bidhaa ulizonunua',
                              'msg_eng':'You have enabled the vendor to return the purchased item(s) '
                        } 

                        return JsonResponse(data)
                  else:
                        
                        data={
                              'success':False,
                              'msg_swa':'Hauna ruhusa hii kwa sasa tafadhari wasiliana na uongozi',
                              'msg_eng':'You have no permission for this action please contact admin'
                        } 

                        return JsonResponse(data)


            except:
                  data={
                        'success':False,
                        'msg_swa':'kitendo haikikufanikiwa kutokana nahitilafu tafadhari jaribu tena',
                        'msg_eng':'Action was not successfully please try again'
                  } 

                  return JsonResponse(data)
      
# VIEW RETURNED ITEMS DIRECTLY................................................................//
def viewRetn_funct(request,intp,back,what,code,lis_t,page_num):
    todo  = todoFunct(request)
    duka=todo['duka']
      #     user = duka.owner
      
      #     contacts= Interprise_contacts.objects.filter(Interprise=duka,show_to_invo=True)
            
    return_zote = bil_return.objects.filter(bil__Interprise=duka)
    retrn_ = return_zote.last()

    unpaid = bil_return.objects.filter(bil__Interprise=duka,ilolipwa=0,amount__gt=0)
    less = bil_return.objects.filter(bil__Interprise=duka,ilolipwa__gt=0).exclude(amount=F('ilolipwa'))
    
    if int(lis_t) ==2:
          return_zote = unpaid
    elif int(lis_t) ==3:
          return_zote = less  
    

    if intp!='':
      if bil_return.objects.filter(pk=intp,bil__Interprise=duka).exists():
            retrn_ = bil_return.objects.get(pk=intp,bil__Interprise=duka)
    elif bil_return.objects.filter(code=code,bil__Interprise=duka).exists() and intp=='':
        retrn_ = bil_return.objects.get(code=code,bil__Interprise=duka)
             
         

    list_mauzo = manunuziList.objects.filter(manunuzi=retrn_.bil.id,rudi__gt = 0)
  
    idad_ = pu_ret.objects.filter(ret=retrn_.id)

    bei_used = []

      #     for li in list_mauzo:
      #           the_bei = bei_za_bidhaa.objects.filter(item=li.produ.bidhaa.id)
      #           for p in the_bei:
      #             bei = [{
      #                   'unit':p.jina,
      #                   'qty':p.idadi,
      #                   'price':p.bei,
      #                   'prod':p.item.id

      #             }]
      #             bei_used+=bei

      #     matum = rekodiMatumizi.objects.filter(manunuzi_id=retrn_.id,Interprise=duka.Interprise)
    user = UserExtend.objects.get(user = request.user.id )
 

    num = return_zote.count()
    invoin = return_zote.order_by("-pk")




    
    p=Paginator(invoin,15)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    Akaunti =  bill_return_pu_fidia.objects.filter(bil_rtn=retrn_.id) 
      #     if Akaunti.exists():
   

    colors= pu_col_ret.objects.filter(ret=retrn_.id)
    sizen= pu_size_ret.objects.filter(ret=retrn_.id)

    todo.update({
     'malipo': Akaunti,   
    'lis_t':lis_t,    
     'unpaid':unpaid,
     'less':less,     
    'prices':bei_used,     
    'then':what,     
    'size':sizen,      
    'color':colors,      
     #     'contact':contacts,      
    'p_num':page_num,
    'pages':pg_number,
    'bil_num':num,
    'bili':page, 
    'the_bill':retrn_,
    'list':idad_,
  #     'back':back ,
    })

    return todo  


@login_required(login_url='login')
def viewRetrn(request):
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

      todo = todoFunct(request)
      # duka = InterprisePermissions.objects.get(user__user =request.user, default = True)

      #     back= request.POST.get('back_to')
      after = {
            'lipa':False,
            'msg':msg
            
      }
      if not todo['duka'].Interprise:
            return redirect('/userdash')
      else:      
            return render(request,'bil_ret_view.html',viewRetn_funct(request,intp,back,after,code,lis_t,page_num))


# BILL ITEM RETURN.......................//
@login_required(login_url='login')
def bill_rudi(request):
    todo  = todoFunct(request)
    duka=todo['duka']
    
    lis_t = int(request.GET.get('lis_t',1))
    invo = bil_return.objects.filter(bil__Interprise=duka)
    unpaid = bil_return.objects.filter(bil__Interprise=duka,ilolipwa=0)
    less = bil_return.objects.filter(bil__Interprise=duka,ilolipwa__gt=0).exclude(amount=F('ilolipwa'))
   
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
    }) 
    return render(request,'bilRtnList.html',todo)


@login_required(login_url='login')
def bill_Itm_return_data(request):
    if request.method == 'GET':  
      intp= request.GET.get('item_valued','')
      back= request.GET.get('back_to','')
      code = request.GET.get('code','')
      lis_t= request.GET.get('lis_t',1)

      retn_no = request.GET.get('return_no',None)
      retn_reson = request.GET.get('return_reson','')
      retn_date = request.GET.get('rudisha-date','')

      paid = request.GET.get('bill_tobe_paid',False)

      ac = int(request.GET.get('ac_val_',0))

      the_data = request.GET.get('rtn_data',None)

      paid_adv = request.GET.get('lipwa_amount','')

      baki = request.GET.get('iliyobaki_bill','')

      kulipa = request.GET.get('tarehe_kulipa',None)

      date = request.GET.get('rudisha-date')

      duka = InterprisePermissions.objects.get(user__user =request.user, default = True)


      uzo = manunuzi.objects.get(pk=intp,Interprise=duka.Interprise.id)
 


      if uzo.ilolipwa == 0:
            kulipa=uzo.kulipa

      if the_data is not None:
            the_data = json.loads(the_data) 

      zote_zipo=True
      amo = 0
      tt = 0
      
      for z in the_data:
            prd = bidhaa_stoku.objects.filter(pk=z['val'],Interprise=duka.Interprise.id)
            if not prd.exists() or z['retn'] == 0:
                  zote_zipo = False
            else:
               itm =  manunuziList.objects.get(pk=prd.last().manunuzi.id)
               amo += prd.last().Bei_kununua/prd.last().bidhaa.idadi_jum  * z['retn']     
               tt +=z['retn']   
               
     
     

      msg={'is_added':True,'success':True,'swa':'Rekodi ya kurudisha bidhaa imefanikiwa kikamilifu','eng':'Sales Return saved successfully'}
      ak=PaymentAkaunts.objects.filter(pk=ac,Interprise=duka.Interprise.id)

      
      if paid_adv !='':
            paid_adv = int(paid_adv)
      else:
            paid_adv = amo   

      if (not ak.exists() and paid) or not zote_zipo :
         msg={'is_added':True,'success':False,'swa':'Rekodi  ya kurudisha bidhaa Haukafinikiwa tafadhari jaribu tena kwa usahihi','eng':'Bill`s item Return was not saved please try again correctly'}
         return redirect('/purchase/bili_return?item_valued='+str(intp)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))

      else:
         ac_amo__ = 0
         if PaymentAkaunts.objects.filter(pk=ac,Interprise=duka.Interprise.id).exists():
               ac_amo__ =   PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise.id).Amount
         if (ac_amo__ >= paid_adv) or (ac==0 and kulipa is not None) or uzo.ilolipwa == 0:  
            invono = 1
            invo_str=''
            if bil_return.objects.filter(bil__Interprise=duka.Interprise).exists():
                  invo_no = bil_return.objects.filter(bil__Interprise=duka.Interprise).last()
            
                  invono = invo_no.bill_no

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

            rtrn= bil_return() 
            rtrn.code =invo_str  

            
           
            if amo <= uzo.ilolipwa:
                  rtrn.amount = float(amo) 
            else:
                  rtrn.amount = uzo.ilolipwa     

            if retn_date !='':
               rtrn.tarehe =retn_date 
            else:
                  rtrn.tarehe = datetime.datetime.now(tz=timezone.utc)
            # if ak.exists() and  paid_adv== amo or uzo.ilolipwa==0:      
            #    rtrn.full_paid = True          
            rtrn.bill_no = invono+1
            rtrn.date = date

            if paid and ak.exists() :
                  rtrn.kulipa = date
                  # rtrn.akaunt =  PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise.id) 
                  rtrn.ilolipwa =paid_adv  

            else :
                  rtrn.kulipa = kulipa

            rtrn.bil = manunuzi.objects.get(pk=intp,Interprise=duka.Interprise.id)
            # rtrn.Interprise = duka.Interprise
            rtrn.maelezo =  retn_reson
            rtrn.By = duka
            rtrn.save()

                            # Record Notiications where to receive ......................................//
            notice = Notifications()
            notice.Interprise = duka.Interprise
            notice.date= datetime.datetime.now(tz=timezone.utc)
            notice.bilRtn= True
            notice.bilRtn_map= rtrn
            if duka.Interprise.owner.user.id == request.user.id:
                  notice.admin_read = True
            else:
                  notice.Incharge_reade = True

            notice.Incharge  = todoFunct(request)['useri']
            notice.save()

            for z in the_data:
                  prd = bidhaa_stoku.objects.filter(pk=z['val'],Interprise=duka.Interprise.id)

                  retnd = manunuziList.objects.get(pk=prd.last().manunuzi.id)
                  retnd.rudi =retnd.rudi + round(z['retn'],3)
                  retnd.save()
                  
                  retn=pu_ret.objects.filter(ret=rtrn.id,pu_list = prd.last().id)
                  if retn.exists():
                        retn.update(idadi=F('idadi') + round(z['retn'],3))
                  else:      
                        retn = pu_ret()
                        retn.idadi = float(z['retn'])
                        retn.ret = rtrn
                        retn.pu_list = prd.last()
                        retn.save()
                  
                  prd.update(idadi=F('idadi')-float(z['retn']))

                  if purchased_color.objects.filter(pk=z['color'],manunuzi=retnd.id).exists():
                        cl__ = purchased_color.objects.get(pk=z['color'],manunuzi=retnd.id)
                        cl__.rudi =cl__.rudi + round(z['retn'],3)
                        cl__.save()  
                        produ_colored.objects.filter(pk=cl__.color.id).update(idadi=F('idadi')-float(z['retn']))   
                       
                       
                        retnC=pu_col_ret.objects.filter(ret=rtrn.id,pu_list=cl__.id)
                        if retnC.exists():
                              retnC.update(idadi=F('idadi')+round(z['retn'],3))
                        else:
                              retnC = pu_col_ret()
                              retnC.idadi = float(z['retn'])
                              retnC.ret = rtrn
                              retnC.pu_list = cl__
                              retnC.save()

                  if purchased_size.objects.filter(pk=z['size'],manunuzi=retnd.id).exists():
                        sz__ = purchased_size.objects.get(pk=z['size'],manunuzi=retnd.id)
                        sz__.rudi =sz__.rudi + round(z['retn'],3)
                        sz__.save()  
                        produ_size.objects.filter(pk=sz__.size.id).update(idadi=F('idadi')-float(z['retn']))   
                    
                        retnS = pu_size_ret()
                        retnS.idadi = float(z['retn'])
                        retnS.ret = rtrn
                        retnS.pu_list = sz__
                        retnS.save() 

            sumi = bidhaa_stoku.objects.filter(manunuzi__manunuzi=uzo.id).aggregate(Sum('idadi'))
            if tt >= sumi['idadi__sum']:
                  uzo.full_returned =True
            uzo.amount=float(uzo.amount) - float(amo)
            if uzo.ilolipwa > 0 and ak.exists()  :
                  if amo<=uzo.ilolipwa:
                     uzo.ilolipwa = uzo.ilolipwa - paid_adv
                  else:
                        uzo.ilolipwa = 0   

            uzo.save()


            if ak.exists():
                  payd = amo
                  remain_set = False
                  if paid_adv>0:
                        payd=paid_adv
                  if baki !='':
                        remain_set=True
                        baki = float(baki)

                  wekakwa= PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
                  beforweka=wekakwa.Amount    
                  weka = wekaCash()
                  weka.Akaunt = wekakwa
                  weka.Amount = payd
                  weka.before = beforweka               
                  weka.After = beforweka + payd 
                  weka.kutoka = "Bill Refund"
                  weka.maelezo = 'Bill Refund'
                  weka.tarehe = datetime.datetime.now(tz=timezone.utc)
                  weka.by=duka
                  weka.Interprise=duka.Interprise
                  weka.mauzo=True
                  # weka.bill = uzo
                  if not wekakwa.onesha:
                        weka.usiri =True               
                  wekakwa.Amount =wekakwa.Amount + payd   
                  wekakwa.save()              
                  weka.save()    

                  retf=bill_return_pu_fidia ()
                  retf.bil = rtrn.bil                 
                  retf.bil_rtn = rtrn                 
                  retf.record = weka                 
                  retf.re_am = payd        
                  retf.save()         
                     
                  # lipwa_(request,ac,payd,remain_set,baki,rtrn.id,invo_str) 



     
            return redirect('/purchase/viewRetrn?item_valued='+str(intp)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))

         else:
     
            msg={'is_added':True,'success':False,'swa':'Rekodi  ya kurudisha bidhaa Haukafinikiwa tafadhari jaribu tena kwa usahihi','eng':'Sales Return not saved please try again correctly'}
            return redirect('/purchase/bili_return?item_valued='+str(intp)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))
    else:  
        return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def payReturn(request):
    if request.method == "POST":
               value=request.POST.get('value')
               back=request.POST.get('backto')
               ac=request.POST.get('ac')
               paid_set=int(request.POST.get('paid_set'))
               paid=request.POST.get('paid')
            #    bal=request.POST.get('bal')
            #    bal_set=int(request.POST.get('bal_set'))
               pay_d = request.POST.get('pay_d')   
               lis_t = request.POST.get('lis_t')   
               duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
               return_ = bil_return.objects.get(pk=value,bil__Interprise=duka.Interprise.id)
               # matum = rekodiMatumizi.objects.filter(manunuzi_id=return_.id,Interprise=duka.Interprise)
               user = UserExtend.objects.get(user = request.user.id )
               list_manunu = bidhaa_stoku.objects.filter(manunuzi__manunuzi=return_.id)

            # try: 
               ilobaki = return_.ilolipwa 
               if not bool(paid_set):
                     return_.ilolipwa = return_.amount 
                     paid = return_.amount-ilobaki
               else: 
                     paid = int(paid)
                     return_.ilolipwa = return_.ilolipwa + paid
               if (paid+ilobaki) <= return_.amount :

                  return_.akaunt = PaymentAkaunts.objects.get(pk=ac)   
                  if return_.amount == ilobaki + paid:
                        return_.full_paid = True
                        return_.kulipa = pay_d
                  return_.save()



                  wekakwa= PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
                  beforweka=wekakwa.Amount    
                  weka = wekaCash()
                  weka.Akaunt = wekakwa
                  weka.Amount = paid
                  weka.before = beforweka               
                  weka.After = beforweka + paid 
                  weka.kutoka = "Bill Refund"
                  weka.maelezo = 'Bill Refund'
                  weka.tarehe = datetime.datetime.now(tz=timezone.utc)
                  weka.by=duka
                  weka.Interprise=duka.Interprise
                  weka.mauzo=True
                  # weka.bill = bill
                  if not wekakwa.onesha:
                        weka.usiri =True               
                  wekakwa.Amount =wekakwa.Amount + paid   
                  wekakwa.save()              
                  weka.save()    

                  retf=bill_return_pu_fidia ()
                  retf.bil = return_.bil                 
                  retf.bil_rtn = return_                 
                  retf.record = weka                 
                  retf.re_am = paid        
                  retf.save()         
                 


   
               billed = bil_return.objects.get(pk=value,bil__Interprise=duka.Interprise.id)              

               sure = 1  
               swa='malipo ya Kurejesh pesa yamerekodiwa kikamilifu'
               eng='Bill Return payment recorded successfully'
               succ = True
               if paid > (return_.amount+ilobaki):
                       sure = 0
                       swa='Rekodi ya rejesho la pesa haijafanikiwa tafadhari jaribu tena kwa usahihi'
                       eng='Bill return refunding payment was not successfully please try again correctly'  
                       succ=False   

               msg={'is_added':True,'success':succ,'swa':swa,'eng':eng}

               
               return redirect('/purchase/viewRetrn?item_valued='+str(return_.id)+'&lis_t='+str(lis_t)+'&msg='+json.dumps(msg))
    else:  
        return render(request,'pagenotFound.html',todoFunct(request))

 
# REFUND BY NEW INVOICE ...................................................//
@login_required(login_url='login')
def  fidiahela(request):

     val= request.POST.get('the_value')

     todo  = todoFunct(request)
     duka=todo['duka']

     billno = 1
     bill_str=''
     if manunuzi.objects.filter(Interprise=duka).exists():
           bill_no = manunuzi.objects.filter(Interprise=duka).last()
     
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
     todo.update({
     'bill_no' :bill_str,   
     
     'rudi':False,
     'ret':None
     
     })
     
     ret = bil_return.objects.filter(pk=val,bil__Interprise=duka.id)
      
     
     if ret.exists() :
            todo['rudi'] = True
            todo['ret'] = ret.last()

            
     if not duka.Interprise:
            return redirect('/userdash')
     else: 
         return render(request,'newbill.html',todo)
              


@login_required(login_url='login')
def editbill(request):
      # if request.method == 'POST' :
      todo  = todoFunct(request)
      try: 
           
            duka=todo['duka']

            intp= request.GET.get('item_valued')
            back= request.GET.get('back_to')
            bill = manunuzi.objects.get(pk=intp,Interprise=duka)

            list_manunu = bidhaa_stoku.objects.filter(manunuzi__manunuzi=bill.id)

            matum = rekodiMatumizi.objects.filter(manunuzi_id=bill.id,Interprise=duka)
            user = UserExtend.objects.get(user = request.user.id )
            itemImg=picha_bidhaa.objects.filter(picha__owner= duka.owner.user)

            bil_color =  purchased_color.objects.filter(manunuzi__manunuzi=bill.id)
            bil_size = purchased_size.objects.filter(manunuzi__manunuzi=bill.id)
        

     
            todo.update({
                  
                'color':bil_color,
                'size': bil_size,
                'pic':itemImg,
                'the_bill':bill,
                'list':list_manunu,
                'matumizi':matum,
                'back':back ,    
                'success':0
            })
            
           
            if bill.risiti == None:  
                  if not duka.Interprise:
                        return redirect('/userdash')
                  else:                  
                        return render(request,'editBill.html',todo)

      except:
            
           return render(request,'pagenotFound.html',todo)


@login_required(login_url='login')
def removebill(request):
      if request.method == 'POST' :

            intpb= request.POST.get('bill_itm_val')
            many= request.POST.get('many')

      
            def delf(intp):
                  duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
                  bill = manunuzi.objects.get(pk=intp,Interprise=duka.Interprise)
                  list_manunu = manunuziList.objects.filter(manunuzi=bill.id)

                  for lis_t in list_manunu:
                        
                        produ = bidhaa_stoku.objects.get(manunuzi=lis_t.id)
                        if bidhaa_stoku.objects.filter(bidhaa=produ.bidhaa).count()>1 and produ.idadi - lis_t.idadi <= 0 :
                              produ.delete()
                              get_last=bidhaa_stoku.objects.filter(bidhaa=produ.bidhaa).last()
                              bidhaa_stoku.objects.filter(pk=get_last.id).update(inapacha=False)
                        else:      
                              produ.idadi = produ.idadi - lis_t.idadi

                              produ.save()

                  bill.delete()   


            if bool(many):
                  ids=json.loads(intpb)
                  for val in ids:
                        delf(val['id'])
            else:
                  delf(intpb) 
            return redirect('unpaid')
      else:  
            return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def payManyBill(request):
      if request.method == "POST":
         value=json.loads(request.POST.get('value'))
         ac=request.POST.get('ac')
         bal=int(request.POST.get('bal'))
         bal_set=int(request.POST.get('bal_set'))
         pay_d = request.POST.get('pay_d')   

         duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
         try:
            toakwa = PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
            beforweka=toakwa.Amount 

            tot = 0
            for val in value:
               bill = manunuzi.objects.get(pk=val['id'],Interprise=duka.Interprise.id)
               tot+=bill.amount - bill.ilolipwa
            bil_paid = ''   
            if toakwa.Amount >= tot:
               for val in value:
                    bill = manunuzi.objects.get(pk=val['id'],Interprise=duka.Interprise.id)
                    bill.ilolipwa = bill.amount
                    bill.full_paid = True
                    bill.akaunt = toakwa
                    bill.kulipa = pay_d
                    bill.save()
                  #   bil_paid ='BI-<a class="ivoice_details" href="/purchase/bill_view/'+str(bill.id)+'" type="button"  data-id="'+str(bill.id)+'">'+bill.code+'</a>,'
                    pd_am =bill.amount - bill.ilolipwa
                    
                    toa = toaCash()
                    toa.Akaunt = toakwa
                    toa.Amount = pd_am
                    toa.before = beforweka
                    if bool(bal_set):
                          toa.After = bal 
                          toa.makato = beforweka-(bal+pd_am)

                    else :
                          toa.After = beforweka - pd_am 
                          toa.makato = 0
                                            
                    toa.kwenda = "Bill Payment"
                    toa.maelezo = "Bill Payment"
                    toa.tarehe = datetime.datetime.now(tz=timezone.utc)
                    toa.by=duka
                    toa.Interprise=duka.Interprise
                    toa.pu=True
                    toa.bill=bill
                    if not toakwa.onesha:
                          toa.usiri =True 

                    
                    if bool(bal_set): 
                          toakwa.Amount =  bal
                    else:
                          toakwa.Amount =toakwa.Amount - pd_am

                    toakwa.save()              
                    toa.save()    

               data={
                           'success':True,
                           'val':value,
                           'message_swa':'Malipo ya bili yamefanikiwa',
                           'message_eng':'Bill payment recorded successfully'
                     }  

               return JsonResponse(data)

            else: 
                 data={
                           'success':False,
                           
                           'message_swa':'Malipo ya bili hayajafanikiwa kutokana na akaunti iliyochaguliwa kuwa na kiasi pungufu',
                           'message_eng':'Bill payment was not recorded because the selected account has insuffient amount'
              
                     } 
                 return JsonResponse(data)   
         except:
                  data={
                           'success':False,
                           'message_swa':'Malipo ya bili hayakufanikiwa kutokana na hitilafu Tafadhari Jaribu tene kwa usahihi',
                           'message_eng':'Bill payment was not recorded please try again by selecting the bill'
                     }          
                     
                  return JsonResponse(data)  
      else:  
            return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def payBill(request):
      if request.method == "POST":
         value=request.POST.get('value')
         ac=request.POST.get('ac')
         paid_set=int(request.POST.get('paid_set'))
         paid=int(request.POST.get('paid'))
         bal=int(request.POST.get('bal'))
         bal_set=int(request.POST.get('bal_set'))
         pay_d = request.POST.get('pay_d')   

         duka = InterprisePermissions.objects.get(user__user =request.user, default = True)


         try:
               bill = manunuzi.objects.get(pk=value,Interprise=duka.Interprise.id)
               ilobaki = bill.ilolipwa 
               if not bool(paid_set):
                     bill.ilolipwa = bill.amount 
                     paid = bill.amount-ilobaki
               else:
                     bill.ilolipwa = bill.ilolipwa + paid
               if (paid+ilobaki) <= bill.amount :

                  bill.akaunt = PaymentAkaunts.objects.get(pk=ac)   
                  if bill.amount == ilobaki + paid:
                        bill.full_paid = True
                        bill.kulipa = pay_d
                  bill.save()


               toakwa= PaymentAkaunts.objects.get(pk=ac,Interprise=duka.Interprise)
               beforweka=toakwa.Amount 
   
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
                                       
               toa.kwenda = "Bill Payment"
               toa.maelezo = 'Bill Payment'
               toa.tarehe = datetime.datetime.now(tz=timezone.utc)
               toa.by=duka
               toa.Interprise=duka.Interprise
               toa.pu=True
               toa.bill = bill
               if not toakwa.onesha:
                     toa.usiri =True 
   
               if paid <=  beforweka and (paid+ilobaki) <= bill.amount:  
                     if bool(bal_set): 
                        toakwa.Amount =  bal
                     else:
                        toakwa.Amount =toakwa.Amount - paid
   
                     toakwa.save()              
                     toa.save() 
               value = bill.id
               unpaid=False
               if ilobaki == 0:
                     unpaid = True
               baki = bill.ilolipwa 
               remove = False
               if not bool(paid_set):
                     remove = True     

               data={
                           'success':True,
                           'baki':baki,
                           'val':value,
                           'remove':remove,
                           'unpaid':unpaid,
                           'message_swa':'Malipo ya bili yamefanikiwa',
                           'message_eng':'Bill payment recorded successfully'
                     }  


               if paid > (bill.amount+ilobaki):
                     data={
                           'success':False,
                           
                           'message_swa':'Malipo ya bili hayajafanikiwa kiasi kilicholipwa ni kikubwa kuliko kiasi cha bili',
                           'message_eng':'Bill payment was not recorded because the paid amount exceed the bill amount'
              
                     }        

               return JsonResponse(data)     

         except:
 
                  data={
                           'success':False,
                           'message_swa':'Malipo ya bili hayakufanikiwa kutokana na hitilafu Tafadhari Jaribu tene kwa usahihi',
                           'message_eng':'Bill payment was not recorded please try again by selecting the bill'
                     }          
                     
                  return JsonResponse(data)     
      else:  
            return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def expenses(request):
      try:
            todo = todoFunct(request)
            matumizi = rekodiMatumizi.objects.filter(Interprise=todo['duka']).order_by("-pk")
            num = matumizi.count()
            p=Paginator(matumizi,15)

            page_num =request.GET.get('page',1)


            
            try:
                  page = p.page(page_num)

            except EmptyPage:
                  page= p.page(1)

            pg_number = p.num_pages

            todo.update({
            'pages':pg_number,
            'bil_num':num,
            'bili':page, 
            })
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else: 
                return render(request,'matumizilist.html',todo)
      except:
            return render(request,'pagenotFound.html',todo)
            

@login_required(login_url='login')
def expenseList(request):
      try:
            todo = todoFunct(request)
            matumiz = matumizi.objects.filter(owner=todo['duka'].owner.user.id).order_by("-pk")
            matlst=[]
            for mt in matumiz:
                  matlst.append({
                        "matumizi":matumizi.objects.get(pk=mt.id),
                        'tumika':len(rekodiMatumizi.objects.filter(matumizi=mt.id))
                  })




            todo.update({
            'bili':matlst, 
            'len':len(matlst)
            })
            if not todo['duka'].Interprise:
                  return redirect('/userdash')
            else: 
                return render(request,'matumizitu.html',todo)
      except:
            return render(request,'pagenotFound.html',todo)
            

@login_required(login_url='login')
def addExpense(request):
      if request.method == "POST":
            data={
                              'success':True,
                              'message_eng':'Expense was saved successfully',
                              'message_swa':'matumizi yamerekodiwa kikamilifu'
                              
                        }
            try:
                  is_bill = int(request.POST.get('for_bill'))
                  bil = request.POST.get('bill')
                  mpya = int(request.POST.get('mpya'))
                  name = request.POST.get('name')
                  tumi = request.POST.get('select')
                  amo = int(request.POST.get('amo'))
                  bal = int(request.POST.get('bak'))
                  bal_set = int(request.POST.get('bal_set'))
                  ac = request.POST.get('ac')
                  maelezo = request.POST.get('maelezo')
                  todo=todoFunct(request)
                  duka=todo['duka']
                  per = todo['cheo']

                  paid = float(amo)

                  

                  if (per.expenses or per.owner or per.fullcontrol) and not per.user.company  :        
                        if  mpya:
                              if matumizi.objects.filter(matumizi__istartswith=name,owner=duka.owner.user).exists():
                                 matum = matumizi.objects.filter(matumizi__istartswith=name,owner=duka.owner.user).last()
                              else:
                                    matum = matumizi()
                                    matum.owner = duka.owner.user
                                    matum.matumizi = name
                                    matum.save()
                        else:
                              matum = matumizi.objects.get(pk=tumi,owner=duka.owner.user)  

                        desk = matum.matumizi + '('+ maelezo +')' 

                        rec = rekodiMatumizi()
                        rec.Interprise=duka
                        rec.matumizi = matum 
                        if is_bill:         
                              rec.manunuzil = True  
                              bill =  manunuzi.objects.get(pk=bil,Interprise=duka.id)         
                              rec.manunuzi_id = bill        
                              manunuzi.objects.filter(pk=bil,Interprise=duka.id).update(amount=F('amount')+float(amo),ilolipwa=F('ilolipwa')+float(amo)) 

                        rec.tarehe = datetime.datetime.now(tz=timezone.utc)
                        rec.kiasi = float(amo)
                        rec.by = todo['cheo']
                        rec.maelezo = maelezo
                        rec.date = date.today()
                        rec.akaunti=PaymentAkaunts.objects.get(pk=ac,Interprise=duka)
                        rec.save()

                        toakwa= PaymentAkaunts.objects.get(pk=ac,Interprise=duka)
                        beforweka=toakwa.Amount 
            
                        toa = toaCash()
                        toa.Akaunt = toakwa
                        toa.Amount = paid
                        toa.matumizi = rec
                        toa.before = beforweka
                        if bool(bal_set):
                              bal = int(bal)
                              toa.After = bal 
                              toa.makato = beforweka-(bal+paid)
            
                        else :
                              toa.After = float(beforweka) - paid 
                              toa.makato = 0
                                                
                        toa.kwenda = matum.matumizi
                        toa.maelezo = desk
                        toa.tarehe = datetime.datetime.now(tz=timezone.utc)
                        toa.by=todo['cheo']
                        toa.Interprise=duka
                        toa.pu=True
                        if is_bill:
                              toa.bill = bill
                        if not toakwa.onesha:
                              toa.usiri =True 
            
                        if paid <=  beforweka :  
                              if bool(bal_set): 
                                    toakwa.Amount =  bal
                              else:
                                    toakwa.Amount = float(toakwa.Amount) - paid
            
                              toakwa.save()              
                              toa.save() 
                  else:
                        data={
                             'success':False,
                        'message_eng':'You have no permission to add expenses',
                        'message_swa':'Hauna ruhusa ya kuongeza matumizi'
                  
                        }            


            except:
                  data={
                        'success':False,
                        'message_eng':'Expense was not seved please try again',
                        'message_swa':'matumizi hayakurekodiwa kutokana na hitilafu tafadhhari jaribu tena kwa usahihi'
                  }

            return JsonResponse(data)      
      else:
           return render(request,'pagenotFound.html',todoFunct(request))



@login_required(login_url='login')
def removeExpenses(request):
       if request.method == "POST":
           
            try:
      
                  val = request.POST.get('val',0)


                  todo = todoFunct(request)
                  duka = todo['duka']

                  mat=matumizi.objects.filter(pk=val,owner=duka.owner.user.id)
                  mat.delete()

                  data = {
                        'success':True,
                        'msg_eng':'Expense removed successfully',
                        'msg_swa':'Matumizi yameondolewa kikamilifu'
                  }

                  return JsonResponse(data)

            except:
                  data={
                        'success':False,
                        'msg_eng':'The action was not complete please try again',
                        'msg_swa':'Oparesheni haikufanikiwa kutokana hitilafu tafadhari jaribu tena',
                  }    

                  return JsonResponse(data)


@login_required(login_url='login')
def editMatumizi(request):
       if request.method == "POST":
            data={
                              'success':True,
                              'msg_en':'Expense was saved successfully',
                              'msg_swa':'matumizi yamerekodiwa kikamilifu'
                              
                        }
            try:
                  
                  name = request.POST.get('name')
                  val = request.POST.get('value')

                  todo = todoFunct(request)
                  duka = todo['duka']

                  mat=matumizi.objects.filter(pk=val,owner=duka.owner.user.id)

                  if mat.exists():
                        if matumizi.objects.filter(matumizi__icontains=name,owner=duka.owner.user.id).exclude(pk=val).exists():
                              data={
                                   'success':False,
                                    'msg_eng':'Expense name exists',
                                    'msg_swa':'Jina la  matumizi tayari lipo'  
                              } 
                        else:
                              mat.update(matumizi=name)      


            except:
                  data={
                        'success':False,
                        'msg_eng':'Expense was not saved due to error please Try again',
                        'msg_swa':'kielelezo cha matumizi hakikufanikiwa tafadhari jaribu tena'    
                  } 
            return JsonResponse(data)           
       else:  
            return render(request,'pagenotFound.html',todoFunct(request))


def color_rm(request):
      try:
        if request.method == "POST":
            rangi_id=request.POST.get('valued')
            intp=InterprisePermissions.objects.get(user__user=request.user,default=True).Interprise 
      
            color=color_produ.objects.get(pk=rangi_id,bidhaa__owner=intp.owner.user)
            color.delete()
            colr =  list(color_produ.objects.select_related('bidhaa').filter(bidhaa__owner=intp.owner.user).values('color_code','color_name','colored','bidhaa','id','bidhaa__idadi_jum','bidhaa__vipimo','bidhaa__vipimo_jum'))
            sized=list(sizes.objects.select_related('color_produ').filter(color__bidhaa__owner=intp.owner.user).values('id','color','size','color__bidhaa','color__bidhaa__idadi_jum','color__bidhaa__vipimo','color__bidhaa__vipimo_jum'))

            data = dict()  

            data['color'] = colr
            data['size'] = sized


            datari={
                  '':colr,
                  'size':sized,
                  'success':True,
                   'swa':'Rangi imeondolewa kikamilifu',
                   'eng':'Color removed successfully'
            }
            
            data['data']=datari

            return JsonResponse(data)
        else:  
            return render(request,'pagenotFound.html',todoFunct(request))     
      except:
            data={
                   'success':False,
                   'swa':'Rangi Haijaondolewa kutokana na hitilafu tafadhari jariu tena',
                   'eng':'Color not removed  please try again '
                         
            }   
            return JsonResponse(data)   
 
#ONLINE ORDERING................................................//
@login_required(login_url='login')
def addOrder(request):
      pass
 
#ONLINE ORDERING................................................//
@login_required(login_url='login')
def pressOda(request):
   if request.method=="POST":   
      try:
           
                  
                  todo = todoFunct(request)
                  duka= todo['duka']
                  useri  = todo['useri']
                  value= request.POST.get('valued')
                  date_= request.POST.get('order_due_date')
                  agent= request.POST.get('Delivery_agenting')
                  showP= int(request.POST.get('showP'))
                  lati= request.POST.get('lat_tude','NULL')
                  longi= request.POST.get('long_tude','NULL')
                  place= request.POST.get('place_where')
                  oderi= int(request.POST.get('orderNum',0))
                  cell = int(request.POST.get('the_cell',0))
                

                  shop=Interprise.objects.get(pk=value)
                  pent = todo['pent']

                  
                  lat = 'NULL'
                  long = 'NULL' 
                  
                  try:
                        lat = float(lati)
                        long = float(longi)
                  except:
                        lat = 'NULL'
                        long = 'NULL' 

                  data = {
                        'success':True,
                        'msg_swa':'Kitendo cha kuagiza kimefanikiwa',
                        'msg_eng':'Item(s) or service(s) was ordered successfully',
                  }


                  cart=mauzoni.objects.filter(pk=oderi,Interprise=shop.id,user_customer__enteprise__in=[duka.id,pent.id],user_customer__by=useri.id,cart=True)
                  

                  if cart.exists():
                        if not cart.last().user_customer.enteprise.Interprise:
                              duka = pent
                        ag=deliveryAgents.objects.filter(pk=agent,Interprise=duka.id)

                        billno = 1
                        if manunuzi.objects.filter(Interprise=duka.id).exists():
                                    bill_no = manunuzi.objects.filter(Interprise=duka.id).last()      
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
                        pu.Interprise = duka
                        pu.code = bill_str           
                        pu.amount = float(cart.last().amount)                                             
                        pu.kulipa = date.today()          
                        pu.order = 1          
                        pu.tarehe = datetime.datetime.now(tz=timezone.utc)        
                        pu.bill_no = billno + 1       
                        pu.save()


                           
                        if ag.exists():
                              TheAgent = ag.last().agent.diactive.where
                              invono = 1
                              invo_str=''
                              if deliveryBy.objects.filter(user=TheAgent.id).exists():
                                    invo_no = deliveryBy.objects.filter(user=TheAgent.id).last()
                              
                                    invono = invo_no.Invo_no

                              if invono <10:
                                    invo_str = '000'+str(invono)
                              elif invono <100 and invono >=10:
                                    invo_str = '00' +str(invono)    
                              elif invono <1000 and invono >=100:
                                    invo_str = '0' +str(invono)    
                              #    elif invono <10000 and invono >=1000:
                              #          invo_str = '0' +str(invono)    
                              elif invono >=1000 :
                                    invo_str =str(invono) 

                              drby = deliveryBy()
                              drby.user  = TheAgent
                              drby.code  = invo_str
                              drby.Invo_no  = invono + 1
                              drby.open_package  = showP
                              drby.save()
                                
                              user_customers.objects.filter(pk=cart.last().user_customer.id).update(tr=drby)
                              
                        user_customers.objects.filter(pk=cart.last().user_customer.id).update(jengo=place)
                        if cell:
                             
                             cells = customer_in_cell.objects.filter(pk=cell,area__Interprise=shop.id)
                           
                             if cells.exists():
                                  cart.update(customer_in = cells.last())
                                                         
                        
                        cart.update(cart=False,expected_date=date_,bill_kwa=pu,date=date.today())
                        
                        
                                  
                                  

                        # return redirect('/purchase/viewOdered?value='+str(shop.id)+'&pu='+str(pu.id)) 
                        return JsonResponse(data)

                  else:
                        
                              data={
                                    'success':False,
                                    'msg_swa':'kitendo hakikufanikiwa tafadhari jaribu tena kwa usahihi',
                                    'msg_eng':'Action was not successfully please try again in correct way'
                              }
                              return  JsonResponse(data)

      except:
                    
            data={
                  'success':False,
                  'msg_swa':'kitendo hakikufanikiwa tafadhari jaribu tena kwa usahihi',
                  'msg_eng':'Action was not successfully please try again in correct way'
            }
            return  JsonResponse(data)
   else:
         return render(request,'errorpage.html',todoFunct(request))
         
#ONLINE ORDERING................................................//
@login_required(login_url='login')
def addtoCart(request):
  todo=todoFunct(request)
  duka = todo['duka']
  cheo = todo['cheo']
  if request.method == "POST":
     
     try:    
        value = request.POST.get('shop',0)
        itm_ =  request.POST.get('itm',0)   
        qty =  int(request.POST.get('qty',0))   
        cart =  int(request.POST.get('cart'))   
        newItm =  int(request.POST.get('newItm'))   
        newCat =  int(request.POST.get('newCat'))   
        wiana =  int(request.POST.get('uwiano'))   
        personal =  int(request.POST.get('ps'))   
        color =  json.loads(request.POST.get('color'))  
        size =  json.loads(request.POST.get('size')) 
        match =  request.POST.get('match')
        a_match =  request.POST.get('a_match')
        edit =  int(request.POST.get('edit'))
        useUnit = int(request.POST.get('useUnit',0))
        newUnit = int(request.POST.get('newUnit',0))
        UnitName = request.POST.get('UnitName')
        newRatio = int(request.POST.get('newRatio'))
        sale = int(request.POST.get('sale'))
        material = int(request.POST.get('material'))
        muda = int(request.POST.get('muda',1))
        sFrom = request.POST.get('sFrom',datetime.datetime.now(tz=timezone.utc))
        sTo= request.POST.get('sTo',datetime.datetime.now(tz=timezone.utc))

        zipo_zote = True

        shop = Interprise.objects.get(pk=value)
        itm = bidhaa_stoku.objects.filter(pk=itm_,Interprise=value) 
        
       

        if personal:
              duka = todo['pent']

       
        if  itm.exists():
          itm = itm.last()

          # check the selected price using 
          def  checkprice(qty):
             prices = [{'idadi':1,'bei':itm.Bei_kuuza}]
             if itm.bidhaa.idadi_jum  > 1:
               prices.append({'idadi':int(itm.bidhaa.idadi_jum),'bei':itm.Bei_kuuza_jum})

             bei = bei_za_bidhaa.objects.filter(item=itm.bidhaa.id)

             if bei.count() >0:
                  for b in bei:
                        prices.append({'idadi':int(b.idadi),'bei':b.bei})

             price = [x for x in prices if x["idadi"] == qty ] 

            

             if len(price)>0:
                    
                return price[0]['bei']

             else:
                return itm.Bei_kuuza
          
          invono = 1
          invo_str=''
          if mauzoni.objects.filter(Interprise=shop.id).exists():
                invo_no = mauzoni.objects.filter(Interprise=shop.id).last()
          
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
          userc.enteprise = duka
          userc.by=todo['useri']
          userc.save()

          mauzo=mauzoni()
          exists = False
          allCart = mauzoni.objects.filter(user_customer__enteprise=duka.id,user_customer__by=todo['useri'].id,cart=True,Interprise=shop.id)
         
          if itm.service and allCart.filter(service=True,servFrom=sFrom,servTo=sTo).exists() and cart:
                mauzo = allCart.filter(service=True,servFrom=sFrom,servTo=sTo).last()
                exists = True
          elif allCart.filter(service=False).exists() and not itm.service:
                mauzo = allCart.filter(service=False).last()
          else:      
                  mauzo.Interprise=shop
                  mauzo.code=invo_str
                   
                  mauzo.amount=float(qty) * float(checkprice(wiana))

                  mauzo.kulipa = date.today()
                  mauzo.tarehe = datetime.datetime.now(tz=timezone.utc)
                  mauzo.Invo_no = invono + 1
                  if wateja.objects.filter(mteja__user=duka.id).exists(): 
                        mauzo.saved_custom = True
                        mauzo.customer_id = wateja.objects.get(mteja__user=duka.id)

                  mauzo.mteja_jina = duka.name  
                  mauzo.simu = duka.owner.simu1  
                  mauzo.user_customer = userc 
                  mauzo.order = True 
                  mauzo.online = True
                  invo_desc = invoice_desk.objects.filter(Interprise=shop.id)
                  if invo_desc.exists():
                        mauzo.invo_desc = invo_desc.last()

                  if itm.service:
                        mauzo.servFrom = sFrom
                        mauzo.servTo = sTo
                        mauzo.service = True

                  if  cart:
                        mauzo.cart = True

                  mauzo.save()  
                   

          matching = salePuMatch()      
          tl =  mauzoList()
          if edit and exists:
               lst = mauzoList.objects.filter(mauzo=mauzo.id,produ=itm.id).delete()
               

          tl.mauzo = mauzo
          tl.idadi = float(qty*wiana)
          tl.bei = float(float(checkprice(wiana))/float(wiana))
          tl.bei_og = float(checkprice(wiana))

          if itm.bidhaa.saletaxInluded and shop.vat_allow:
                tl.vat_included = True
                tl.vat_set = True

          tl.produ= itm
          tl.saveT= muda
         
          #unit matching................................//
          if newItm and duka.Interprise:
            if newUnit:
                  matching.smallUnit = UnitName   
                  matching.Units = float(newRatio )  
                  matching.material = material  
            else:
                  matching.smallUnit = itm.bidhaa.vipimo 
                  
            matching.material = material  

            #     add matching category if the itemis new and has category ...............//
            if not newCat:
                 matching.aina_match = bidhaa_aina.objects.get(pk=a_match,Interprise__owner=duka.owner.id)   
           
            matching.salePrice = float(sale)
            matching.save()

            tl.match = matching           

          tl.save()

          actual_pr = float(float(checkprice(wiana)*qty))
           #     Add the item to match if user has matched the item..............//
          if not newItm and duka.Interprise and not itm.service:
                if not order_from.objects.filter(bidhaa__owner=duka.owner.user.id,orderto__bidhaa=itm.bidhaa.id).exists():
                       mtc_to = order_to()
                       mtc_to.bidhaa = itm.bidhaa
                       mtc_to.save()

                       mtc_i =order_from()
                       mtc_i.orderto = mtc_to  
                       mtc_i.bidhaa = bidhaa_stoku.objects.get(pk=match,Interprise=duka.id).bidhaa  
                       mtc_i.save()

          if len(color) > 0:

            actual_qty = 0    
            actual_pr = 0    
            for c in color :
              sco  = sales_color()
              sco.mauzo = tl
              sco.bidhaa = itm
              sco.color = produ_colored.objects.get(pk=c['val'])
              sco.idadi = float(c['qty'])
              sco.price = float(checkprice(c['uwiano']))
              sco.save()
        
             #  when user choose size ontop of color to avoid division by 0 uwiano
              c_uwiano = c['uwiano']
              tpr=(c['qty'] * checkprice(c['uwiano']))
              if c_uwiano > 1:
                    tpr = tpr/c_uwiano


              if len(size) > 0:
                    col_qty  = 0
                    act_pr  = 0
                    for s in size:
                          if s['rangi'] == sco.color.color.id:
                              ssi = sales_size()
                              ssi.mauzo = tl
                              ssi.bidhaa = itm
                              ssi.size = produ_size.objects.get(pk=s['val'])
                              ssi.idadi = s['qty']
                              ssi.price = float(checkprice(s['uwiano']))
                              ssi.color = sco
                              ssi.save()

                              col_qty+=s['qty']

                              act_pr+=(s['qty'] * checkprice(s['uwiano']))/s['uwiano']


                    sco.idadi = float(col_qty)
                    sco.save()

                    if  act_pr > 0 :
                          tpr = act_pr
                                


                  
              actual_qty+=sco.idadi
              actual_pr+= tpr

            tl.idadi = actual_qty
            tl.bei = float(actual_pr)/float(actual_qty)
            tl.save()

      #     Calculate total price .....................//
          theItmsA = mauzoList.objects.filter(mauzo=mauzo.id).aggregate(sum=Sum(F('saveT')*F('bei_og')*F('idadi'),output_field=FloatField()))['sum'] or 0     
          mauzo.amount = float(theItmsA)   
          mauzo.save()   

          data = {
            'success':True,
            'msg_swa':'Bidhaa zimeongezwa kikamilifu',
            'msg_eng':'Item added successfully'
          } 


          return JsonResponse(data)


     except:
        data={
          'success':False,
          'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
          'msg_eng':'Oparation was not successfully please try again',
        } 
        return JsonResponse(data)
  
  else:
     return render(request,'errorpage.html',todo)

#ONLINE ORDERING................................................//
@login_required(login_url='login')
def itemMatch(request):
  todo=todoFunct(request)
  if request.method == "POST":
     try:    
        itm_ =  request.POST.get('itm',0)   
        newItm =  int(request.POST.get('newItm'))   
        newCat =  int(request.POST.get('newCat'))   
        match =  request.POST.get('match')
        a_match =  request.POST.get('a_match')
        useUnit = int(request.POST.get('useUnit',0))
        newUnit = int(request.POST.get('newUnit',0))
        UnitName = request.POST.get('UnitName')
        newRatio = int(request.POST.get('newRatio'))
        sale = int(request.POST.get('salesP'))
        material = int(request.POST.get('material'))
        duka = todo['duka']
      #   cheo = todo['cheo']
        matching = salePuMatch()

        tl  = mauzoList.objects.get(pk=itm_,mauzo__bill_kwa__Interprise=duka.id)
        itm = tl.produ
      #unit matching................................//
        if newItm and duka.Interprise:
            if newUnit:
                  matching.smallUnit = UnitName   
                  matching.Units = float(newRatio )  
            else:
                  matching.smallUnit = itm.bidhaa.vipimo 
                  
            matching.material = material  

      #     add matching category if the itemis new and has category ...............//
        if not newCat:
            matching.aina_match = bidhaa_aina.objects.get(pk=a_match,Interprise__owner=duka.owner.id)   
      
        matching.salePrice = float(sale)
        matching.save()

        tl.match = matching           
        tl.save()

        if not newItm and duka.Interprise:
                  mtc_to = order_to()
                  mtc_to.bidhaa = itm.bidhaa
                  mtc_to.save()

                  mtc_i =order_from()
                  mtc_i.orderto = mtc_to  
                  mtc_i.bidhaa = bidhaa_stoku.objects.get(pk=match,Interprise=duka.id).bidhaa  
                  mtc_i.save()

        data={
            'success':True,
            'msg_swa':'Kuhusianisha bidhaa kumefanikiwa kikamilifu',
            'msg_eng':'Item  matched succefully',
          } 

        return JsonResponse(data)  

     except:
           data={
                 'success':False,
                 'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                 'msg_eng':'The oparation was not successfully please try again'
               
           }
           return JsonResponse(data)  
  else:
        return render(request,'pagenotFound.html',todo)

#ADD PICKUP................................................//
@login_required(login_url='login')
def GetPickups(request):
    todo = todoFunct(request)
#     duka = todo['duka']
    useri = todo['useri']
    
    pickups = mauzoni.objects.filter(user_customer__tr__user__owner=useri.id).exclude(user_customer__by=useri.id).annotate(From=F('Interprise__name'),To=F('user_customer__enteprise__name'),codi=F('user_customer__tr__code'))
            
    num = pickups.count()
    billin = pickups.order_by("-pk")

    p=Paginator(billin,15)
    page_num =request.GET.get('page',1)

    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    todo.update({
    'p_num':page_num,
     'pages':pg_number,
    'bil_num':num,
    'bili':page,      
    })

    return todo

@login_required(login_url='login')
def pickUps(request):
     return render(request,'pickups.html',GetPickups(request))

@login_required(login_url='login')
def pickConfirm(request):
     try:
            bil = int(request.POST.get('b'))
            todo = todoFunct(request)
            duka = todo['duka']
            useri = todo['useri']

            pick = mauzoni.objects.get(pk=bil,user_customer__tr__user__owner=useri.id)   
            deliveryBy.objects.filter(pk=pick.user_customer.tr.id).update(amehakiki=True) 

            notice = Notifications()
            notice.Interprise = pick.bill_kwa.Interprise
            notice.date= datetime.datetime.now(tz=timezone.utc)
            notice.puO= True
            notice.puO_map= pick.bill_kwa
            notice.Incharge = pick.user_customer.by
            notice.save()  

            data = {
                  'success':True,
                  'msg_swa':'Uhakiki wa kupokea bidhaa umefanikiwa kikamilifu',
                  'msg_eng':'Item receive confirmation is successful'
            }          

            return JsonResponse(data)

     except:
               data = {
                  'success':False,
                  'msg_swa':'Kitendo hakikufanikiwa kutona na hitilafu tafadhari jaribu tena',
                  'msg_eng':'The action was not successfuly please try again'
               }   

               return JsonResponse(data) 
          
@login_required(login_url='login')
def ViewPickup(request):
     try:
        p = int(request.GET.get('p',0))
        c = request.GET.get('c','None')
        todo = todoFunct(request)
        duka = todo['duka']
        useri = todo['useri']

        pick = mauzoni.objects.get(Q(pk=p)|Q(user_customer__tr__code=c),user_customer__tr__user__owner=useri.id)
        
        itms=mauzoList.objects.filter(mauzo=pick.id)

        totol = None 
        tot_p = 0
        itm = [] 
        how_many_ = 0
        # uzoni = mauzoni.objects.filter(bill_kwa=pu)
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

              tot_p = itms.aggregate(total=Sum(F('idadi')* F('produ__Bei_kuuza') ))['total'] 

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
                                            szz={
                                            'size':sales_size.objects.get(pk=sz.id),
                                            'price': checkprice(sz.price,lis_t.produ) 
                                            }

                                            size.append(szz)
                                else:
                                      how_many+=1   

                                cl={
                                      'color':sales_color.objects.get(pk=c.id),
                                      'img':picha_bidhaa.objects.filter(color_produ=c.color.color.id),
                                      'size':size,
                                      'sizl':len(size),
                                      'price': checkprice(c.price,lis_t.produ) 
                                }
                                col_size.append(cl)
                          how_many_+=how_many   
                    else:
                          how_many_ += 1
                    dt={

                          'itm':lis_t,
                          
                          'match':int(order_from.objects.filter(bidhaa__owner=duka.owner.user,orderto__bidhaa=it.produ.bidhaa).exists()),
                          'img':picha_bidhaa.objects.filter(bidhaa=it.produ.bidhaa),
                          'color_size':col_size,
                          'csl':len(col_size),
                          'price': checkprice(it.bei_og,lis_t.produ) 
                          
                    
                    }

                    itm.append(dt)
            


        todo.update({
             'the_bill':pick,
             'itms':itm,
             'total':totol,
             'itl':how_many_,
            #  'shop':shop,
             'tot_p':tot_p,
             'discount':(tot_p-totol.amount)
             }
        )

        todo.update(GetPickups(request))


        return render(request,'viewpickup.html',todo)
     except:
      return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def seenPick(request):
     if request.method == "POST":
          p = int(request.POST.get('bil',0))
          todo = todoFunct(request)
          useri = todo['useri']        
          pick = mauzoni.objects.get(pk=p,user_customer__tr__user__owner=useri.id)
          deliveryBy.objects.filter(pk=pick.user_customer.tr.id).update(seen=True)
          data = {
            'success':True
          }   
          return JsonResponse(data)

     else:
          return render(request,'pagenotFound.html',todoFunct(request))


#ADD PICKUP................................................//
@login_required(login_url='login')
def AddPickup(request):
     if request.method == "POST":
          try:
               agent = int(request.POST.get('agent'))
               bill = int(request.POST.get('bill'))
               show = int(request.POST.get('show'))
               vendor = int(request.POST.get('vendor'))
               todo = todoFunct(request)
               duka = todo['duka']
               useri = todo['useri']
               pent= todo['pent']

              
               mauz = mauzoni.objects.get(Q(user_customer__enteprise__in=[duka.id,pent.id],user_customer__by=useri.id)|Q(Interprise=duka.id),pk=bill)
               pickup = deliveryAgents.objects.get(agent__diactive__where=agent,Interprise__owner=duka.owner.id)
               
               invono = 1
               invo_str=''
               if deliveryBy.objects.filter(user=pickup.agent.diactive.where.id).exists():
                     invo_no = deliveryBy.objects.filter(user=pickup.agent.diactive.where.id).last()
               
                     invono = invo_no.Invo_no

               if invono <10:
                     invo_str = '000'+str(invono)
               elif invono <100 and invono >=10:
                     invo_str = '00' +str(invono)    
               elif invono <1000 and invono >=100:
                     invo_str = '0' +str(invono)    
            #    elif invono <10000 and invono >=1000:
            #          invo_str = '0' +str(invono)    
               elif invono >=1000 :
                     invo_str =str(invono)  

               deriv = deliveryBy()
               deriv.user = pickup.agent.diactive.where
               deriv.agent = pickup
               deriv.open_package = int(show)
               deriv.code = invo_str
               deriv.fromOrdered = not vendor
               deriv.Invo_no = invono + 1
               deriv.save()

               
               tr = mauz.user_customer
               if tr.tr is not None: 
                  deliveryBy.objects.filter(pk=tr.tr.id).delete() 

               tr.tr = deriv
               tr.save()
               

               data = {
                  'success':True,
                  'msg_swa':'Mfuataji wa mzigo ameongezwa kikamilifu',
                  'msg_eng':'Delivery agent added successfully'
               }

               return JsonResponse(data)

          except:
               data = {
                  'success':False,
                  'msg_swa':'Kitendo hakikufanikiwa kutona na hitilafu tafadhari jaribu tena',
                  'msg_eng':'The action was not successfuly please try again'
               }   

               return JsonResponse(data)  
     else:
          return render(request,'pagenotFound.html',todoFunct(request))
     
@login_required(login_url='login')
def viewOdered(request):
  try:
      todo=todoFunct(request)
      duka = todo['duka']
      cheo = todo['cheo']
      value = request.GET.get('value')
      pu = request.GET.get('pu',0)

      shop = Interprise.objects.get(pk=value)
      pent = todo['pent']
      en = int(request.GET.get('en',0))
  
      itms=mauzoList.objects.filter(mauzo__Interprise=shop.id,mauzo__user_customer__enteprise__in=[pent.id,duka.id],mauzo__user_customer__by=todo['useri'].id,mauzo=pu)
      # mauzoni.objects.filter(pk=itms.last().mauzo.id).delete()
      
      if not itms.exists():
            itms=mauzoList.objects.filter(mauzo__Interprise=shop.id,mauzo__user_customer__enteprise__in=[pent.id,duka.id],mauzo=pu)
    
      totol = None 
      tot_p = 0
      itm = [] 
      how_many_ = 0
      # uzoni = mauzoni.objects.filter(bill_kwa=pu)
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

            tot_p = itms.aggregate(total=Sum(F('idadi')* F('produ__Bei_kuuza') ))['total'] 

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
                                          szz={
                                          'size':sales_size.objects.get(pk=sz.id),
                                          'price': checkprice(sz.price,lis_t.produ) 
                                          }

                                          size.append(szz)
                              else:
                                    how_many+=1   

                              cl={
                                    'color':sales_color.objects.get(pk=c.id),
                                    'img':picha_bidhaa.objects.filter(color_produ=c.color.color.id),
                                    'size':size,
                                    'sizl':len(size),
                                    'price': checkprice(c.price,lis_t.produ) 
                              }
                              col_size.append(cl)
                        how_many_+=how_many   
                  else:
                        how_many_ += 1
                  dt={

                        'itm':lis_t,
                        
                        'match':int(order_from.objects.filter(bidhaa__owner=duka.owner.user,orderto__bidhaa=it.produ.bidhaa).exists()),
                        'img':picha_bidhaa.objects.filter(bidhaa=it.produ.bidhaa),
                        'color_size':col_size,
                        'csl':len(col_size),
                        'price': checkprice(it.bei_og,lis_t.produ) 
                        
                  
                  }

                  itm.append(dt)
                  
      
      if totol == None :
          return  render(request,'errorpage.html',todo) 
      else:
            if totol.cart and totol.order:
                  return redirect('/purchase/viewCart?value='+str(shop.id)+'&odd='+str(totol.id))
            elif (not totol.cart and totol.order) or (not totol.online and not totol.receved) or (totol.service and not totol.confirmRec) :     
                 
                  ulilipa = wekaCash.objects.filter(invo=totol.id)
                  delivery = deliveryAgents.objects.filter(Interprise=duka.id)
                  todo.update({'pickup':delivery,'ulilipa':ulilipa,'aina':bidhaa_aina.objects.filter(Interprise=duka.id),'en':en,'itms':itm,'total':totol,'itl':how_many_,'shop':shop,'tot_p':tot_p,'discount':(tot_p-totol.amount)})
                  
                  return render(request,'viewOrdered.html',todo)   
            else:  
                 return redirect('/purchase/viewRecept?item_valued='+str(totol.bill_kwa.id))      
  except:
      return render(request,'errorpage.html',todo)


#VIEW ONLINE The cart ITEMS  ................................................//
@login_required(login_url='login')
def viewCart(request):
  try:
      todo=todoFunct(request)
      duka = todo['duka']
      cheo = todo['cheo']
      value = request.GET.get('value')
      odd = int(request.GET.get('odd',0))
      vendor = int(request.GET.get('odd',1))

      shop = Interprise.objects.get(pk=value)
      pent = todo['pent']

      agents = deliveryAgents.objects.filter(Interprise__in=[pent.id,duka.id])

      uzoni = mauzoni.objects.filter(pk=odd,user_customer__enteprise__in=[duka.id,pent.id],Interprise=shop.id,user_customer__by=todo['useri'].id,order=True,cart=True)
      if not uzoni.exists():
            uzoni = mauzoni.objects.filter(user_customer__enteprise__in=[duka.id,pent.id],Interprise=shop.id,user_customer__by=todo['useri'].id,order=True,cart=True)
  
      uzoId = 0
      if uzoni.exists():
            uzoId = uzoni.last().id
            if uzoni.last().user_customer.enteprise.id == pent.id:
                  agents = agents.filter(Interprise=pent.id)
            else:
                  agents = agents.filter(Interprise=duka.id) 

      itms=mauzoList.objects.filter(mauzo=uzoId)
  
      totol = None 
      itm = [] 
      how_many_ = 0
      if itms.exists():
            totol = uzoni
            todo.update({
                  'total':totol.last(),
                  'amount':totol.last().amount ,
            }) 

       
 

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
                                          szz={
                                          'size':sales_size.objects.get(pk=sz.id),
                                          'price': checkprice(sz.price,lis_t.produ) 
                                          }

                                          size.append(szz)
                              else:
                                    how_many+=1   

                              cl={
                                    'color':sales_color.objects.get(pk=c.id),
                                    'img':picha_bidhaa.objects.filter(color_produ=c.color.color.id),
                                    'size':size,
                                    'sizl':len(size),
                                    'price': checkprice(c.price,lis_t.produ) 
                              }
                              col_size.append(cl)
                        how_many_+=how_many   
                  else:
                        how_many_ += 1
                  dt={

                        'itm':lis_t,
                  
                        'img':picha_bidhaa.objects.filter(bidhaa=it.produ.bidhaa),
                        'color_size':col_size,
                        'csl':len(col_size),
                        'price': checkprice(it.bei_og,lis_t.produ) 
                        
                  
                  }

                  itm.append(dt)
                  
      
      

     

      todo.update({'itms':itm,'itl':how_many_,'shop':shop,'agents':agents})


      return render(request,'viewPuCart.html',todo)   
  except:
      return render(request,'pagenotFound.html',todo)


#REMOVE ORDERED ITEMS VIA ONLINE................................................//
@login_required(login_url='login')
def removeToCart_itm(request):
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      cheo = todo['cheo']
      value = request.GET.get('value')

      it =request.GET.get('i',0)
      size =request.GET.get('s',0)
      color =request.GET.get('c',0)

      itm = mauzoList.objects.filter(pk=it,mauzo__user_customer__by=todo['useri'].id,mauzo__order=True)
      mauzo = itm.last().mauzo 
      cart = False
      if mauzo.cart :
            cart = True     
      if itm.exists(): 
            litm = itm.last()
            mauzo = litm.mauzo

            cl = sales_color.objects.filter(pk=color,mauzo=litm.id)
            sz = sales_size.objects.filter(pk=size,mauzo=litm.id)

            

            amount = 0
            qty = 0
            itm_removed = False
            oda_removed = False

            if not cl.exists() and not sz.exists() and not itm.last().packed:
                  
                  
                  
                  if itm.last().match is not None:
                        salePuMatch.objects.filter(pk=itm.last().match.id).delete()

                  itm.delete()
                  itm_removed = True   

            if sz.exists() and not sz.last().packed:
                  szn = sz.last()
                  
                  qty = szn.idadi

                  if sales_size.objects.filter(color = szn.color.id).count()>1:
                        sales_color.objects.filter(pk=szn.color.id).update(idadi=F('idadi')-float(szn.idadi))
                        sz.delete()
                  else:
                        col_del=sales_color.objects.filter(pk=szn.color.id)
                        if sales_color.objects.filter(mauzo=litm.id).count()>1:
                              col_del.delete()
                        else:
                              if itm.last().match is not None:
                                    salePuMatch.objects.filter(pk=itm.last().match.id).delete()
                              itm.delete()
                              itm_removed = True      


            if cl.exists() and not cl.last().packed  :
                  crd = cl.last()
                  
                  qty = crd.idadi
                  
                  if sales_color.objects.filter(mauzo=litm.id).count()>1:
                        cl.delete()
                  else: 
                        
                        if itm.last().match is not None:
                              salePuMatch.objects.filter(pk=itm.last().match.id).delete()
                        itm.delete()     
                        itm_removed = True


            if not itm_removed:
                  itm.update(idadi=F('idadi')-float(qty))
            
            if mauzoList.objects.filter(mauzo__user_customer__by=todo['useri'].id,mauzo__order=True,mauzo=mauzo.id).count()>0:
                  amount = mauzoList.objects.filter(mauzo=mauzo.id).aggregate(sum=Sum(F('saveT')*F('bei_og')*F('idadi'),output_field=FloatField()))['sum'] or 0  
                 
                  mauzo.amount = float(amount)
                  mauzo.save()

                  if not mauzo.cart and mauzo.order:   
                        mauzo.bill_kwa.amount=mauzo.amount
                        mauzo.bill_kwa.save()
            else:
                  if not mauzo.cart and mauzo.order:
                        manunuzi.objects.filter(pk=mauzo.bill_kwa.id).delete()
                  else: 
                        user_customers.objects.filter(pk=mauzo.user_customer.id).delete()     
                        mauzoni.objects.filter(pk=mauzo.id).delete()

                  oda_removed = True

      if not oda_removed:  
           if mauzo.cart:
                  return redirect('/purchase/viewCart?value='+str(value))
                 
           else:           
                  return redirect('/purchase/viewOdered?value='+str(value)+'&pu='+str(mauzo.id))
      else:
            if cart:
                return redirect('/purchase/viewCart?value='+str(value))
            else:      
                return redirect('/purchase/puOrder')
             
    except:
        return render(request,'errorpage.html',todo)


# ONESHA ODA KWA ALIYE ODA
@login_required(login_url='login')
def AllpuOrderFuct(request):
    todo  = todoFunct(request)
    duka =  todo['pent']
    entp = int(request.GET.get('en',0))

    if entp:
          duka = todo['duka']
    
    bills = mauzoni.objects.filter(Q(bill_kwa__order=True)|Q(cart=True)|Q(service=True,confirmRec=False),user_customer__enteprise=duka.id).exclude(ignore=True)
     
    num = bills.count()
    billin = bills.order_by("-pk")
    
    p=Paginator(billin,15)
    page_num = request.GET.get('page',1)
   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    todo.update({
    'p_num':page_num,
     'pages':pg_number,
    'bil_num':num,
    'bili':page, 
    'entp':entp     
    })

    return todo

def  checkpriceGrob(bein,it):
       prices = [{'idadi':1,'bei':it.Bei_kuuza,'vipimo':it.bidhaa.vipimo}]
       if it.bidhaa.idadi_jum  > 1:
          prices.append({'idadi':int(it.bidhaa.idadi_jum),'bei':it.Bei_kuuza_jum,'vipimo':it.bidhaa.vipimo_jum})

       bei = bei_za_bidhaa.objects.filter(item=it.bidhaa.id)

       if bei.count() >0:
             for b in bei:
                   prices.append({'idadi':int(b.idadi),'bei':b.bei,'vipimo':b.jina})

       price = [x for x in prices if float(x["bei"]/x['idadi']) == float(bein) ] 

       

       if len(price)>0:
             
           return price[0]

       else:
           return prices[0]

# ONESHA ODA KWA ALIYE ODA
@login_required(login_url='login')
def OdatoBill(request):
   if request.method == "POST": 
      try:
            od = request.POST.get('od')
            shop_use = int(request.POST.get('use',0))
            todo = todoFunct(request)
            duka = todo['duka'] 
            oda = mauzoni.objects.filter(pk=od,user_customer__enteprise=duka.id,bill_kwa__order=True,cart=False)
            if not oda.exists():
                  duka = todo['pent']
                  oda = mauzoni.objects.filter(pk=od,user_customer__enteprise=duka.id,bill_kwa__order=True,cart=False)
                  
            if oda.exists()  :
                  odi = oda.last()
                  pu=manunuzi.objects.filter(pk=odi.bill_kwa.id)
                  rv = Risiti()
                  if duka.Interprise and not shop_use and not odi.service:
                        lim = mauzoList.objects.filter(mauzo=odi.id)
                        for adl in  lim:
                              nl=manunuziList()
                              nl.manunuzi = odi.bill_kwa
                              nl.idadi = adl.idadi 
                              nl.vat_included = adl.vat_included
                              nl.vat_set = adl.vat_included
                              nl.save()
                              # the_itm = nl.prod 
                              
                              aina = bidhaa_aina()  
                              
                              itm  = bidhaa()
                              match_itm = order_from.objects.filter(bidhaa__owner=duka.owner.user.id,orderto__bidhaa=adl.produ.bidhaa.id)
                              matched = order_to()
                              saleP =  0
                        
                              if match_itm.exists():
                                    matched = match_itm.last().orderto
                                    the_itm = bidhaa.objects.filter(pk=match_itm.last().bidhaa.id)
                                    itm =  the_itm.last()
                                    if bidhaa_stoku.objects.filter(bidhaa=itm.id).exists():
                                          saleP  = bidhaa_stoku.objects.filter(bidhaa=itm.id).last().Bei_kuuza
                                    aina = the_itm.last().bidhaa_aina 
                              else:
                              
                                    if adl.match.aina_match is not None:
                                          aina =  adl.match.aina_match
                                    
                                    else:
                                          # Add item cateory............................//
                                          ItmGroup = adl.produ.bidhaa.bidhaa_aina.mahi
                                          GroupExists = mahitaji.objects.filter(Interprise=duka.id,mahitaji__icontains=ItmGroup.mahitaji)
                                          if GroupExists.exists():
                                                ItmGroup = GroupExists.last() 
                                          else:
                                                ItmGroup = mahitaji()      
                                                ItmGroup.Interprise = duka  
                                                ItmGroup.mahitaji = adl.produ.bidhaa.bidhaa_aina.mahi.mahitaji  
                                                ItmGroup.aina = ItmGroup.aina 
                                                ItmGroup.save() 
                                                
                                          
                                          aina.aina=adl.produ.bidhaa.bidhaa_aina.aina      
                                          aina.Interprise=duka     
                                          aina.mahi=ItmGroup
                                          aina.save() 


                                    itm.owner = duka.owner.user    
                                    itm.bidhaa_jina = adl.produ.bidhaa.bidhaa_jina    
                                    itm.bidhaa_aina = aina

                                    brand = makampuni.objects.filter(kampuni_jina__icontains=adl.produ.bidhaa.kampuni.kampuni_jina,Interprise=duka.id)
                                    if brand.exists():
                                          itm.kampuni  =  brand.last()
                                    else:
                                          br = makampuni()
                                          br.kampuni_jina=  adl.produ.bidhaa.kampuni.kampuni_jina
                                          br.Interprise = duka
                                          br.save()

                                          itm.kampuni=br   
                                          
                                    # bei_=checkpriceGrob((adl.bei) ,adl.produ) 
                                    # if bei_['idadi'] > 1 :  
                                    #       itm.idadi_jum = float(bei_['idadi'])   
                                    #       itm.vipimo_jum = bei_['vipimo']  
                                    # else:
                                    #       itm.idadi_jum = 1   
                                    #       itm.vipimo_jum = adl.produ.bidhaa.vipimo  

                                    if adl.match.Units>1:
                                          itm.idadi_jum = adl.match.Units
                                          itm.vipimo_jum = adl.produ.bidhaa.vipimo
                                          itm.vipimo = adl.match.smallUnit
                                          
                                    else:
                                          itm.idadi_jum = adl.produ.bidhaa.idadi_jum       
                                          itm.vipimo_jum = adl.produ.bidhaa.vipimo_jum       
                                          itm.vipimo = adl.produ.bidhaa.vipimo 
                                          


                                    saleP = adl.match.salePrice      

                                    itm.Mahi  = aina.mahi   
                                    itm.material = adl.match.material 
                                    itm.maelezo  =  adl.produ.bidhaa.maelezo
                                    itm.change_date  =  datetime.datetime.now(tz=timezone.utc)
                                    itm.save()
                                    

                                    matching = order_from()
                                    

                                    matched.bidhaa=adl.produ.bidhaa                        
                                    matched.Units=adl.match.Units  
                                    matched.save()

                                    matching.orderto = matched
                                    matching.bidhaa = itm
                                    matching.save()    

                                    salePuMatch.objects.filter(pk=adl.match.id).delete()   

                              adst = bidhaa_stoku()
                              adst.bidhaa = itm  
                              adst.Interprise = duka 
                              adst.idadi = float(adl.idadi * matched.Units)

                              sup = wasambazaji.objects.filter(owner=duka.owner.user.id,where=odi.Interprise.id)
                              lsup = wasambazaji()
                              if sup.exists():
                                    lsup = sup.last()
                              else:
                                    lsup.owner = duka.owner.user      
                                    lsup.jina = odi.Interprise.name  
                                    lsup.address = odi.Interprise.mtaa.mtaa +' '+ odi.Interprise.mtaa.kata.kata +' '+ odi.Interprise.mtaa.kata.wilaya.wilaya+' '+ odi.Interprise.mtaa.kata.wilaya.mkoa.mkoa +' '+odi.Interprise.mtaa.kata.wilaya.mkoa.kanda.nchi.name  
                                    lsup.code = odi.Interprise.countryCode  
                                    lsup.simu1 = odi.Interprise.owner.simu1
                                    lsup.where = odi.Interprise
                                    lsup.save()

                              adst.msambaji = lsup

                              adst.Bei_kununua = float(adl.bei*itm.idadi_jum)
                              adst.Bei_kuuza = float(saleP)
                              adst.Bei_kuuza_jum = float(saleP * matched.Units)
                              adst.expire_date = adl.produ.expire_date
                              adst.op_name = todo['useri']
                              adst.sirio = adl.produ.sirio
                              if match_itm.exists():
                                    bidhaa_stoku.objects.filter(bidhaa=itm.id,inapacha=False).update(inapacha=True)
                              adst.manunuzi =  nl   
                              adst.save()

                              itm={
                                    "itm":adst,
                                    "request":request,
                                    "out":False
                                    }

                              updateOrder(itm)

                              sumi = bidhaa_stoku.objects.filter(bidhaa=adst.bidhaa.id,idadi__gt=0,Interprise=duka.id).exclude(pk=adst.id).aggregate(sumi=Sum('idadi'))['sumi'] or 0
                              nl.before = float(sumi)   

                              cl = sales_color.objects.filter(mauzo=adl.id)
                              if cl.exists():
                                    for c in cl:
                                          sumiC = 0
                                          colored = color_produ.objects.filter(bidhaa=itm.id,color_code__icontains=c.color.color.color_code)
                                          nc =  color_produ() 
                                          if colored.exists():
                                                nc = colored.last()
                                                sumiC= produ_colored.objects.filter(color=nc.id,Interprise=duka.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0

                                                
                                          else:
                                          
                                                nc.color_code = c.color.color.color_code    
                                                nc.color_name = c.color.color.color_name    
                                                nc.nick_name = c.color.color.nick_name    
                                                nc.colored = c.color.color.colored    
                                                nc.bidhaa = itm   
                                                nc.save()

                                          

                                          itc = produ_colored()
                                          itc.bidhaa =  adst
                                          itc.color =  nc
                                          itc.Interprise =  duka
                                          itc.idadi =  float(c.idadi*matched.Units)
                                          itc.owner =  duka.owner.user
                                          itc.save()

                                          adc = purchased_color()
                                          adc.manunuzi = nl
                                          adc.bidhaa = adst
                                          adc.color = itc
                                          adc.before = float(sumiC)
                                          adc.idadi = float(c.idadi*matched.Units)
                                          adc.save()

                                          ss  = sales_size.objects.filter(color=c.id)

                                          if ss.exists():
                                                for s in ss:
                                                      sumiS = 0
                                                      szs = sizes.objects.filter(size__icontains=s.size.sized.size,color=nc.id)
                                                      nsz = sizes()
                                                      if szs.exists():
                                                            nsz = szs.last() 
                                                            sumiS = produ_size.objects.filter(sized=nsz.id,Interprise=duka.id,idadi__gt=0).aggregate(sumi=Sum('idadi'))['sumi'] or 0

                                                      else:
                                                            nsz.size  =  s.size.sized.size
                                                            nsz.color = nc
                                                            nsz.save()
                                                      csz = produ_size()
                                                      csz.bidhaa = adst      
                                                      csz.sized = nsz      
                                                      csz.Interprise = duka      
                                                      csz.idadi = float(s.idadi*matched.Units)  
                                                      csz.owner = duka.owner.user
                                                      csz.save() 

                                                      pus = purchased_size()
                                                      pus.manunuzi = nl
                                                      pus.bidhaa = adst
                                                      pus.size = csz
                                                      pus.before = float(sumiS)
                                                      pus.idadi = s.idadi
                                                      pus.color = adc
                                                      pus.save()

                              pu.update(matumizi=False)
                        #      Remove the comperant
                  invono = 1
                  invo_str=''
                  if Risiti.objects.filter(Interprise=duka.id).exists():
                        invo_no = Risiti.objects.filter(Interprise=duka.id).last()
                        invono = invo_no.code_num
                  if invono < 10:
                        invo_str = '0000'+str(invono)
                  elif invono < 100 and invono >=10:
                        invo_str = '000' +str(invono)    
                  elif invono < 1000 and invono >=100:
                        invo_str = '00' +str(invono)    
                  elif invono < 10000 and invono >=1000:
                        invo_str = '0' +str(invono)    
                  elif invono >=10000 :
                        invo_str =str(invono)  

                  rv.Interprise = duka      
                  rv.code = invo_str     
                  rv.date = datetime.datetime.now(tz=timezone.utc) 
                  rv.code_num = invono + 1
                  rv.save()
                  if duka.Interprise  :
                        if odi.service:
                            pu.update(By=todo['cheo'],amount=odi.amount,date=date.today(),tarehe=datetime.datetime.now(tz=timezone.utc),order=False,risiti=rv)
                              
                        else:
                            pu.update(By=todo['cheo'],amount=odi.amount,date=date.today(),tarehe=datetime.datetime.now(tz=timezone.utc),order=False,supplier_id=wasambazaji.objects.get(owner=duka.owner.user.id,where=odi.Interprise),risiti=rv)
                  else:
                        pu.update(amount=odi.amount,date=date.today(),tarehe=datetime.datetime.now(tz=timezone.utc),order=False,risiti=rv)
                        

                  if odi.service:
                        odi.confirmRec=True
                        odi.save()
                  else:      
                        odi.receved=True
                        odi.save()

                        
                  # Record Notiications to notify that package has been receiveid ......................................//
                  
                  notice = Notifications()
                  notice.Interprise = odi.Interprise
                  notice.date= datetime.datetime.now(tz=timezone.utc)
                  notice.saO= True
                  notice.saO_map= odi
                  notice.Incharge = UserExtend.objects.get(user=odi.By.user.user.id)
                  notice.save() 

                  # Saved Custemers Counter .............................//
                  svdOne = odi.Interprise
                  svdOne.onlineCustomers = int(svdOne.onlineCustomers)+1
                  svdOne.save()
                  
                  if not odi.bill_kwa.nunua:
                        noticeA = Notifications()
                        noticeA.Interprise = duka
                        noticeA.date= datetime.datetime.now(tz=timezone.utc)
                        noticeA.puO= True
                        noticeA.puO_map= odi.bill_kwa
                        noticeA.Incharge = todo['useri']
                        noticeA.Incharge_reade = True
                        if duka.owner == todo['useri']:
                              noticeA.admin_read = True
                        noticeA.save() 


                  data={
                        'success':True,
                        'msg_swa':'Manunuzi yamekamilika',
                        'msg_eng':'Purchase was succefully',
                        'id':pu.last().id
                        
                  }
                        
                  return JsonResponse(data)  
                  
            else:
                  data = {
                        'success':False,
                        'msg_swa':'Oda ya manunuzi haikupatikana',
                        'msg_eng':'Puchase Order not Found'
                  }
                  return JsonResponse(data)
      except:
            data={
                  'success':False,
                  'msg_swa':'kitendo hakikuweza kufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                  'msg_eng':'Action not successfully please try again ',
            }
            return JsonResponse(data)  
   else:
         return render(request,'pagenotFound.html',todoFunct(request))         

def get_thelist(request):
    todo  = todoFunct(request)
    duka=todo['duka']
    
    bills = mauzoni.objects.filter(Q(order=False)|Q(receved=True),user_customer__enteprise=duka.id,full_returned=False).exclude(confirmRec=False,service=True)
    bills = bills.filter(ignore=False)
    num = bills.count()
    billin = bills.order_by("-pk")
    
    p=Paginator(billin,15)
    page_num =request.GET.get('page',1)
   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    todo.update({
    'p_num':page_num,
     'pages':pg_number,
    'bil_num':num,
    'bili':page,      
    })

    return todo

@login_required(login_url='login')
def receives(request):
      try:
            todo =get_thelist(request)
            return render(request,'receipts.html',todo)
      except:
         return render(request,'pagenotFound.html',todoFunct(request))         
   
def viewReceptFuct(request):
    todo ={}
    
    intp = int(request.GET.get('item_valued',0))
    qtprint = int(request.GET.get('qp',0))
    react = int(request.GET.get('r',0))
    page_num = request.GET.get('page',1)
    pr = int(request.GET.get('pr',0))
    todo = {}

    rP = ForPrintingPupose.objects.filter(pk=react,expire__gte=datetime.datetime.now(tz=timezone.utc))
    if rP.exists():
         todo = {
              'duka':rP.last().duka,
              'useri':rP.last().user,
              'pent':Interprise.objects.get(owner = rP.last().user,Interprise=False)
         }

       
    else:    
         
         todo =todoFunct(request)
#     print(react,rP.exists())
    duka=todo['duka']
    pent = todo['pent']
    
    #     contacts= Interprise_contacts.objects.filter(Interprise=duka,show_to_invo=True)
       
    mauzo_yote = mauzoni.objects.filter(user_customer__enteprise__in=[duka.id,pent.id],full_returned=False)


    if mauzo_yote.exists():
            mauzo_ = None
            if qtprint:
                  
                  mauzo_ = mauzoni.objects.get(pk=qtprint,user_customer__enteprise__in=[duka.id,pent.id])
            else:
                  mauzo_yote = mauzo_yote.filter(Q(order=False)|Q(receved=True))
                  mauzo_ = mauzo_yote.filter(bill_kwa=intp).last() 
          
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

            akaunts = None
            bado = 0
            
            if not qtprint:
                  akaunts = toaCash.objects.filter(bill=mauzo_.bill_kwa.id)
                  bado = mauzo_.bill_kwa.amount -  mauzo_.bill_kwa.ilolipwa  

            ulilipa = wekaCash.objects.filter(invo=mauzo_.id)
           

            colors= sales_color.objects.filter(mauzo__mauzo=mauzo_.id).exclude(idadi=F('returned'))
            sizen= sales_size.objects.filter(mauzo__mauzo=mauzo_.id).exclude(idadi=F('returned'))
            
            reg=businessReg.objects.filter(Interprise=mauzo_.Interprise.id,show_to_invo=True)
            phone = InterprisePermissions.objects.filter(Interprise=mauzo_.Interprise.id)

  

            
            UnStarLast = False
            rating = Interprise_Rating.objects.filter(by=todo['useri'].id,Interprise=mauzo_.Interprise.id).order_by('-pk')
            rateAv = rating.aggregate(Av=Avg('rating'))['Av'] 

            if rating.exists():
                  UnStarLast =  (not rating.filter(invo=mauzo_.id).exists()) and mauzo_ == mauzoni.objects.filter(user_customer__by=todo['useri'].id).last()


          

            todo.update({
            'reg':reg,    
            'malipo':akaunts,    
            'ulilipa':ulilipa,
            'prices':bei_used,     
             'bado':bado,  
            'size':sizen,      
            'color':colors,      
            'contact':phone,      
            'p_num':page_num,
            'pages':pg_number,
            'bil_num':num,
            'bili':page, 
            'the_bill':mauzo_,
            'list':reList,
            'rate':rating,
            'rateAv':rateAv,
            'Unrated':UnStarLast
            
            } )

            


            

            return todo

@login_required(login_url='login')
def viewRecept(request):

          try:  
             
               todo = viewReceptFuct(request)

               return  render(request,'viewRisiti.html',todo)
                
          except:
               return  render(request,'pagenotFound.html',todoFunct(request))


# @login_required(login_url='login')
def  Risitiprint(request):
      try:
            
            lang= int(request.GET.get('lang',0))
            

            after={
                  'lipa':False,
                  'langSet':lang
            }

            todo= viewReceptFuct(request)

            todo.update({
                  'then':after
            })
            
            return render(request,'risiti.html' ,todo)

      except:
             return render(request,'errorpage.html',todoFunct(request)) 


@login_required(login_url='login')
def puOrder(request):
      try:
            todo=AllpuOrderFuct(request)
            return render(request,'purchOrder.html',todo)
      except:
           return render(request,'errorpage.html',todoFunct(request))         
         
@login_required(login_url='login')
def payBill2(request):
    if request.method == "POST":
            try: 
               value=request.POST.get('value')
               back=request.POST.get('backto')
               ac=request.POST.get('ac')
               paid_set=int(request.POST.get('paid_set'))
               paid=request.POST.get('paid')
               bal=request.POST.get('bal')
               bal_set=int(request.POST.get('bal_set'))
               pay_d = request.POST.get('pay_d')   
               lis_t = request.POST.get('lis_t')   
               to_bil = int(request.POST.get('to_bill',0))   


               duka = InterprisePermissions.objects.get(user__user =request.user, default = True)
               bill = manunuzi.objects.get(pk=value,Interprise=duka.Interprise.id)
               matum = rekodiMatumizi.objects.filter(manunuzi_id=bill.id,Interprise=duka.Interprise)
               user = UserExtend.objects.get(user = request.user.id )
               list_manunu = bidhaa_stoku.objects.filter(manunuzi__manunuzi=bill.id)                  
               ilobaki = bill.ilolipwa 
               if not bool(paid_set):
                     bill.ilolipwa = bill.amount 
                     paid = bill.amount-ilobaki
               else: 
                     paid = int(paid)
                     bill.ilolipwa = bill.ilolipwa + paid
               if (paid+ilobaki) <= bill.amount :

                  bill.akaunt = PaymentAkaunts.objects.get(pk=ac)   
                  if bill.amount == ilobaki + paid:
                        bill.full_paid = True
                        bill.kulipa = pay_d
                  bill.save()


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
                                       
               toa.kwenda = "Items Purchase"
               toa.maelezo = 'Items Purchase'
               toa.tarehe = datetime.datetime.now(tz=timezone.utc)
               toa.by=duka
               toa.Interprise=duka.Interprise
               toa.pu=True
               toa.bill = bill
               if not toakwa.onesha:
                     toa.usiri =True 
   
               if paid <=  beforweka and (paid+ilobaki) <= bill.amount:  
                     if bool(bal_set): 
                        toakwa.Amount =  bal
                     else:
                        toakwa.Amount =toakwa.Amount - paid
   
                     toakwa.save()              
                     toa.save() 
                 

               data={
                     'success':True,
                     'msg_swa':'malipo ya bili yamerekodiwa kikamilifu',
                     'msg_eng':'Bill payment recorded successfully'
               }                 

               if paid > (bill.amount+ilobaki): 
                       
                       data={
                              'success':False,
                              'msg_swa':'Bili haijalipiwa kikamilifu tafadhari jaribu tena kwa usahihi',
                              'msg_eng':'Bill payment was not recorded successfully please Try again correctly'
                        }                          

              
               return JsonResponse(data)   
                
            except:

                       
                  data={
                        'success':False,
                        'msg_swa':'Bili haijalipiwa kikamilifu tafadhari jaribu tena kwa usahihi',
                        'msg_eng':'Bill payment was not recorded successfully please Try again correctly'
                  }                          
                
                  return JsonResponse(data)     
    else:  
        return render(request,'pagenotFound.html',todoFunct(request))
        
@login_required(login_url='login')
def purchaseRate(request):
      if request.method == "POST":
            try: 
                  bil=request.POST.get('bil')
                  rate=int(request.POST.get('rate',0))
                  remarks=request.POST.get('Remarks')
                  todo = todoFunct(request)
                  
                  

                  bill=mauzoni.objects.get(user_customer__by=todo['useri'],pk=bil)

                  rati = Interprise_Rating()
                  rati.Interprise = bill.Interprise
                  rati.rating = rate
                  rati.desc = remarks
                  rati.by = todo['useri']
                  rati.invo = bill
                  rati.date = datetime.datetime.now(tz=timezone.utc)
                  rati.save()

                  data = {
                        'success':True
                  }

                  return JsonResponse(data)


            except:
                  data = {
                        'success':False,
                  }

                  return JsonResponse(data)      
      else:
            return render(request,'pagenotFound.html',todoFunct(request))   


