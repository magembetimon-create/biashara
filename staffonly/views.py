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
from management.models import Notifications,VistorsSavedItems,ainaMama,ainaBibi,Zones,Mikoa,Wilaya,Kata,Mitaa,mahitaji,Interprise_Rating, UserExtend,EmployeeAttachments,InterpriseVisotrs, makampuni,savedStockState,Kanda,Workers,sales_color,sales_size,AnswerTo,stockAdjst_confirm,question_to,chatTo,chats,Interprise,deliveryAgents,bei_za_bidhaa, color_produ,mauzoList,order_from,bidhaa_sifa, key_sifa,produ_colored,produ_size,picha_bidhaa,bidhaa_stoku,picha_bidhaa,bidhaa_aina  , receive, stokAdjustment,user_Interprise,HudumaNyingine,Huduma_za_kifedha,businessReg,manunuzi,Interprise_contacts,InterprisePermissions,PaymentAkaunts, mauzoni,staff_akaunt_permissions, wasambazaji
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F
from django.core import serializers
from django.db.models import Q
# from datetime import datetime
from django.core.paginator import Paginator,EmptyPage

from django.utils import timezone
from datetime import date
import time  
import pytz
import datetime
import re
import socket
import json
from django.db.models import Sum,Avg
import random 
timezone.now()
from accaunts.todos import Todos
# Create your views here.

def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()



        
@login_required(login_url='login')
def AllMembers(request):  
    todo = todoFunct(request)
    useri = todo['useri']
    if useri.ImSuper:
          #  tdy = datetime.datetime.strptime("2020-01-22", '%Y-%m-%d')
          #  wk = (tdy-datetime.timedelta(days=7))

          #  users_re_today =  Interprise.objects.filter(Interprise=False,created=tdy)  
          #  Entpr_re_today =  Interprise.objects.filter(Interprise=True,created=tdy)  
           
          #  users_re_week =  Interprise.objects.filter(Interprise=False,created=)  
          #  Entpr_re_today =  Interprise.objects.filter(Interprise=True,created=date.today())  

           return render(request,'staffs/StaffMembers.html',todo)
    else:
        return redirect('/userdash')    

        
@login_required(login_url='login')
def staffPanel(request):  
   
    todo = todoFunct(request)
    useri = todo['useri']
    if useri.ImSuper:
          #  tdy = datetime.datetime.strptime("2020-01-22", '%Y-%m-%d')
          #  wk = (tdy-datetime.timedelta(days=7))

          #  users_re_today =  Interprise.objects.filter(Interprise=False,created=tdy)  
          #  Entpr_re_today =  Interprise.objects.filter(Interprise=True,created=tdy)  
           
          #  users_re_week =  Interprise.objects.filter(Interprise=False,created=)  
          #  Entpr_re_today =  Interprise.objects.filter(Interprise=True,created=date.today())  

           return render(request,'staffs/staffdash.html',todo)
    else:
        return redirect('/userdash')
    


@login_required(login_url='login')
def loadReport(request):  
    if request.method == "POST":
      todo = todoFunct(request)
      useri = todo['useri']
      if useri.ImSuper:
          mth = request.POST.get('mth')
          totalEnt = Interprise.objects.filter(Interprise=True).count()
          UsersR = Interprise.objects.filter(Interprise=False).count()

          allMonthly = list(Interprise.objects.filter(created__gte=mth).values('created','Interprise'))

          data ={
              'totalEnt':totalEnt,
              'users':UsersR,
              'dta':allMonthly
          }

          return JsonResponse(data)




      else:
          data = {
              'success':False
          }

          return JsonResponse(data)
    else:
        return redirect('/userdash')

@login_required(login_url='login')
def saveCateg(request):
    categs = [
    {
     "categ_swa":'Vifaa vya umeme',
     "categ_eng":'Electrical appliances',
     "aina":[
       { "swa":'vifaa vya ofsini na majumbani',"eng":'Office & Home Appliances'},
       { "swa":'Vifaa vya kiufundi',"eng":'Workshop appliances'},
       { "swa":'Huduma za kiufundi',"eng":'Appliances maintanance servicing '},
    ]

    },

    {
     "categ_swa":'Vifaa vya kielectroniki',
     "categ_eng":'Electronics Devices',
     "aina":[
      
       { "swa":'Simu na vifaa vyake',"eng":'Mobile phone & accessories'},
       { "swa":'komputa na vifaa vyake',"eng":'Computers & accessories'},
       { "swa":'Vifaa kwa matumizi binafsi',"eng":'Personal care portable devices'},
       { "swa":'Vifaa vya nyumbani na ofsini',"eng":'Office & Home devices'},
       { "swa":'Kazi za kiufundi',"eng":'Workshop devices'},
       { "swa":'Vifaa kwa matukio',"eng":'Events used devices'},
       { "swa":'Huduma za Kiufundi',"eng":'Maintanance & servicing'},
    ]
             
    },

    {
     "categ_swa":'Thamani za ndani',
     "categ_eng":'Funitures',
     "aina":[
      
       { "swa":'Meza',"eng":'Tables'},
       { "swa":'Makochi na sofa',"eng":'Couches & Sofa'},
       { "swa":'Makabati',"eng":'Cabinets'},
       { "swa":'Usafi',"eng":'Cleanlines'},
    
       { "swa":'Huduma za Kiufundi',"eng":'Maintanance & servicing'},
    ]
             
    },

    {
     "categ_swa":'Mapishi na Huduma',
     "categ_eng":'Cookware & Services',
     "aina":[
      
       { "swa":'Vyombo vya Kupikia',"eng":'Cooking essentials'},
       { "swa":'Vyombo vya mezani/kupakulia',"eng":'Tableware & servings'},
       { "swa":'Vifaa vya jikoni',"eng":'Kitchen tools'},
       { "swa":'Uhifadhi chakula',"eng":'Food Storage'},

       { "swa":'Kuwekea  vyombo',"eng":'cooking-ware placing '},
       { "swa":'Usafi wa vyombo na Jikoni',"eng":'Kitchen & Cookware care'},
       { "swa":'Huduma za mapishi',"eng":'Services'},
    ]
             
    },

    {
     "categ_swa":'Afya na Ukakamavu',
     "categ_eng":'Health & Fitness',
     "aina":[
      
            { "swa":'Vifaa vya Mazoezi',"eng":'Fitness '},
            { "swa":'Ushauri na Uelekezaji Mazoezi',"eng":'Fitness Consultant & Instructor'},

            { "swa":'Vifaa tiba',"eng":'Medical equipment'},
            { "swa":'Tiba na ushauri',"eng":'Medical consultant & cure'},

         ]
             
    },

    {
     "categ_swa":'Usafi na Urembo',
     "categ_eng":'Cleanliness & Beuty',
     "aina":[
      
       { "swa":'Usafi Wanaume',"eng":'Cleanliness Mens '},
       { "swa":'Usafi na Urembo Wanawake',"eng":'Cleanliness & Beuty for Womens'},
       { "swa":'Usafi kwa Wote',"eng":'General Cleanliness'},

       { "swa":'Watoto',"eng":'Baby & Kids'},
       { "swa":'Huduma na Ushauri',"eng":'Services & Consultants'},

         ]
             
    },

    {
     "categ_swa":'Hoteli na Migahawa',
     "categ_eng":'Hotel & Grocery',
     "aina":[
      
       { "swa":'Vyakula',"eng":'Food '},
       { "swa":'Vinywaji',"eng":'Drinks'},

    

         ]
             
    },

    {
     "categ_swa":'Maladhi na Pango',
     "categ_eng":'ApartMent & lodges',
     "aina":[
      
       { "swa":'Vyumba vya kulala',"eng":'Lodge service '},
       { "swa":'Nyumba/vyumba vya kupanga',"eng":'Apartment/Rooms for rent'},
       { "swa":'Huduma',"eng":'Services'},

         ]
             
    },

    {
     "categ_swa":'Vyombo vya moto na Vifaa',
     "categ_eng":'Automobile  & accesories',
     "aina":[
      
       { "swa":'Pikipiki na vifaa vyake',"eng":'Motocycle & accesories'},
       { "swa":'Magari na vifaa vyake',"eng":'Cars & accesories'},
       { "swa":'Huduma za kiufundi',"eng":'Services & Maintanace'},

    

         ]
             
    },

    {
     "categ_swa":'Mashine na Vifaa ',
     "categ_eng":'Machinery & Tools',
     "aina":[
      
       { "swa":'Nyumbani na Maofsini',"eng":'Home & Office'},
       { "swa":'Sehemu za kazi',"eng":'Workshop tools'},
       { "swa":'Viwandani',"eng":'Industrial'},
       
       { "swa":'Huduma ya Ufundi ',"eng":'Servicing & maintanance'},

    

         ]
             
    },

    {
     "categ_swa":'Ujenzi',
     "categ_eng":'Contruction',
     "aina":[
      
       { "swa":'Vifaa vya ujenzi',"eng":'Controctions tools'},
       { "swa":'Nyenzo za ujenzi',"eng":'Contruction Materials & components'},
       { "swa":'Mashine za Ujenzi ',"eng":'Construction machinery'},
       { "swa":'Huduma za kiufundi na ushauri',"eng":'Consultants & servicing'},
      

    

         ]
             
    },

    {
     "categ_swa":'Kilimo na Ufugaji',
     "categ_eng":'Agriculture',
     "aina":[
      
       { "swa":'Vifaa vya kilimo',"eng":'agricultural  tools'},
       { "swa":'Vifaa vya Ufugaji',"eng":'livestock keeping  tools'},
       { "swa":'Mashine za kilimo',"eng":'Agricultural machinery'},
       { "swa":'Nyenzo za kilimo',"eng":'Agricultural input essentials '},
       { "swa":'Maelekezo na Ushauri',"eng":'Agricultural Consultants'},
       

    

         ]
             
    },

    {
     "categ_swa":'Mavazi na mitindo',
     "categ_eng":'Fashions',
     "aina":[
      
       { "swa":'Watoto',"eng":'Baby & Kids'},
       { "swa":'Wanawake',"eng":'Womens'},
       { "swa":'Wanafunzi',"eng":'Pupil & stodents'},
       { "swa":'Wanaume',"eng":'Mens '},
       { "swa":'Huduma za kiufundi',"eng":'Technical services'},
       
       

    

         ]
             
    },
    {
     "categ_swa":'Vifaa Kwa Elimu',
     "categ_eng":'Educational Equipments',
     "aina":[
      
       { "swa":'Wanafunzi',"eng":'Pupil & Students'},
       { "swa":'Maabala',"eng":'Laboratory'},
       { "swa":'Office',"eng":'Ofsini'},
       { "swa":'Huduma na ushauri ',"eng":'Educational consultants '},
       
       

    

         ]
             
    },

]  
    for c in categs:
        ainB = ainaBibi()
        ainB.name = c['categ_eng']
        ainB.jina = c['categ_swa']
        ainB.save()
        for ct in c['aina']:
            ain = ainaMama()
            ain.name = ct['eng']
            ain.jina = ct['swa']
            ain.aina = ainB
            ain.save()

    return redirect('/posts')

@login_required(login_url='login')
def savePlaces(request):  
    if request.method == "POST":
        mkoa = ''

        try:
            # mkoa = request.POST.get('REGION')
            # wilaya = json.loads(request.POST.get('DISTRICTS'))
            # # //print(wilaya)
            # data = {
            #     'msg':mkoa + ' SuccessFully..'
            # }

            # data = []
            # msg = ''
        # Buchosa Wards
            # wd = [  
            #     'Bangwe',
            #     'Bugoro',
            #     'Buhama',
            #     'Bukokwa',
            #     'Bulyaheke',
            #     'Bupandwa',
            #     'Iligamba',
            #     'Irenza',
            #     'Kafunzo',
            #     'Kalebezo',
            #     'Kasisa',
            #     'Katwe',
            #     'Kazunzu',
            #     'Lugata',
            #     'Luhuza',
            #     'Maisome',
            #     'Nyakaliro',
            #     'Nyakasasa',
            #     'Nyakasungwa',
            #     'Nyanzenda',
            #     'Nyehunge',
            #     'Uharanyonga',
            # ]
 
            # for w in wd:
            #    kata =  Kata.objects.filter(kata__icontains=w,wilaya=381) 
               
               
            #    if kata.exists():
            #         msg =  w + ' got ' + str(kata.last().id)
            #         kata.update(wilaya= Wilaya.objects.get(pk=386))
                    

            #    else:
            #         msg = w + ' Not Found '  
                 
 

            #    data.append(msg)
            # mikoa = Mikoa.objects.filter(mkoa__icontains= str(mkoa) )
            # if not mikoa.exists():
            #     mkoa = Mikoa()
            #     data ={
            #         'msg':mkoa + ' Hauopo..'
            #     }
            # else:
            #     for wl in wilaya:
            #         wil =  Wilaya()
            #         wil.wilaya = str(wl['DISTRICT'])
            #         wil.mkoa = mikoa.last()
            #         wil.save()

            #         for wd in wl['WARDS']:
            #             kata = Kata()
            #             kata.kata = wd['WARD']
            #             kata.wilaya = wil
            #             kata.save()

            #             for mt in wd['VILLAGES']:
            #                 mtaa = Mitaa()
            #                 mtaa.mtaa = str(mt)
            #                 mtaa.kata = kata
            #                 mtaa.save()

           
            return JsonResponse({'data':data})
        except:
            data={
            
                'msg':' Operation Failed ....'
            }
            return JsonResponse(data)