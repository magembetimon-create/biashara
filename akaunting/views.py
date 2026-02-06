from django.shortcuts import render


from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from management.models import UserExtend,Kanda,Interprise,manunuzi,HudumaNyingine,InterprisePermissions,PaymentAkaunts,toaCash,wekaCash
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F
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
from django.db.models import Sum
from django.forms.models import model_to_dict
# Create your views here.

from accaunts.todos import Todos
# Create your views here.

def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()


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
    br = [duka.id]



    for b in todo['matawi']:
        br.append(b.Interprise.id)
   
    if cheo.owner:
        Admin = True

    else:
        Admin= False

    akaunt = PaymentAkaunts.objects.filter(Interprise__owner = duka.owner)  
    IntpAc = akaunt.filter(Interprise = duka)  
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
        data["list"] = akauntilistForInt
        data["alllist"] =Allist
        data["otherCount"] = allistCounti
        data["Count"] = count
        data["menu"] = Admin
      


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
        data["list"] = akauntilistForInt
        data["alllist"] =Allist
        data["otherCount"] = allistCounti
        data["Count"] = count
        data["menu"] = Admin

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


