# from asyncio.windows_events import NULL
# from email.policy import default
 
from genericpath import exists
from ipaddress import ip_address
import traceback
from typing import Dict
from django.core.files import storage
from django.db import reset_queries
from django.db.models.fields import NullBooleanField
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from django.core.files.storage import default_storage # Hii inahitajika kwa kufuta faili la zamani
from django.conf import settings
# from graphql import visit
from business import settings
from management.models import Notifications,VistorsSavedItems,customer_in_cell,customer_area,Activator,invoice_desk,Activated,marketPlace,VistedBanners,marketBanner,deliveryBy,KulipaPI,PhoneMailConfirm,bidhaa,Zones,Mikoa,Mitaa,Wilaya,Kata,mahitaji,Interprise_Rating, UserExtend,EmployeeAttachments,InterpriseVisotrs, makampuni,savedStockState,Kanda,Workers,sales_color,sales_size,AnswerTo,stockAdjst_confirm,question_to,chatTo,chats,Interprise,deliveryAgents,bei_za_bidhaa, color_produ,mauzoList,order_from,bidhaa_sifa, key_sifa,produ_colored,produ_size,picha_bidhaa,bidhaa_stoku,picha_bidhaa,bidhaa_aina, receive, stokAdjustment,user_Interprise,HudumaNyingine,Huduma_za_kifedha,businessReg,manunuzi,Interprise_contacts,InterprisePermissions,PaymentAkaunts, mauzoni,staff_akaunt_permissions, wasambazaji
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import F
from django.core import serializers
from django.db.models import Q
# from datetime import datetime
from django.core.paginator import Paginator,EmptyPage
from itertools import chain

import requests
#Session model stores the session data
from django.contrib.sessions.models import Session

from django.utils import timezone
timezone.now()

from datetime import date,timedelta, timezone
import time  
# import pytz
import datetime
import re
import socket
import json
from django.db.models import Sum,Avg
import random 
import xml.etree.ElementTree as ET
import xmltodict
# from DirectPayOnline import DPO

from .todos import Todos,confirmMailF,sendSMS
# Create your views here.

def todoFunct(request):
  usr = Todos(request)
  return usr.todoF()

def AUDISIZE(request):
  todo = todoFunct(request)
  duka= todo['duka']
 
  Item = bidhaa_stoku.objects.filter(Interprise=duka.id)
  
  BforSize = len(Item.filter(bidhaa__Asize__gt=1).distinct('bidhaa'))
  BAforSize =  len(Item.filter(bidhaa__bidhaa_aina__Asize__gt=1).distinct('bidhaa__bidhaa_aina'))
  MahforSize = len(Item.filter(bidhaa__bidhaa_aina__mahi__Asize__gt=1).distinct('bidhaa__bidhaa_aina__mahi'))
  BrforSize = len(Item.filter(bidhaa__kampuni__Asize__gt=1).distinct('bidhaa__kampuni'))

  SIZES = float(BforSize) + float(BAforSize) + float(MahforSize) + float(BrforSize)
  return int(SIZES)

def register(request):
  if request.user.is_authenticated:
     return redirect('userdash')
  else:   
    if request.method == 'POST':
      
      try:
        first_name= request.POST['f_name'] 
        last_name= request.POST['l_name'] 

        mail= request.POST['mail'] 
        password= request.POST['pwd'] 
        pers = int(request.POST['pers'])
        M = int(request.POST.get('male',0))
        F = int(request.POST.get('Female',0))
        lang = int(request.POST.get('lang',0))
        code = int(request.POST.get('code',0))
        mtaa = request.POST['kijiji'] 

     

        confirm = PhoneMailConfirm.objects.get(PhoneMail__icontains=mail,code=code,duration__gte=datetime.datetime.now(tz=timezone.utc))
        confirm.confirm = True
        confirm.save()

        st=Mitaa.objects.get(pk=mtaa)

        email_exists = UserExtend.objects.filter(user__email__icontains=mail)
        
        if email_exists.filter(regstatue=2).exists()  :
            # messages.error(request,'Namba ya simu uliyoingiza Tayari inatumika !')
            data = {
              'success':False,
              'msg_swa':'Anwani ya barua pepe tayari imeshasajiriwa tafadhari igiza akaunti nyingine',
              'msg_eng':'The email address has already registered taken please use another email address'
            }

            if PhoneMailConfirm.objects.filter(PhoneMail=mail,confirm=False):
              data = {
                'success':True
              }


      
            return JsonResponse(data)

        else:  
          user = None
          if email_exists.exists():
             user  = email_exists.last().user
          else:
            user = User.objects.create_user(email=mail,username=mail,first_name=first_name, last_name=last_name, password=password )
          
          ext = UserExtend()
          # user.save()
          ext.regstatue = 1
          ext.user = user
          if M:
            ext.gender = 1
          if F:
            ext.gender = 0  

          
          ext.company = not pers

          ext.mtaa = st
          ext.langSet = lang
          ext.save()

          data = {
            'success':True,
            'id':ext.id
            }

          return JsonResponse(data)

      except:
          data = {
            'success':False,
            'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
            'msg_eng':'The action was not successfully due to error please try again'
          }

          return JsonResponse(data)


    else:
        lang = int(request.GET.get('lang',1))

        wilaya = Wilaya.objects.all()
        mikoa = Mikoa.objects.all()
        kanda=Zones.objects.all() 

        # Wilaya.objects.filter(mkoa=18).delete() 

        # kata = Kata.objects.all().count()
        # mitaa = Mitaa.objects.all().count()

        todo = {
          'lang':lang,
          'kanda':kanda,
          'mikoa':mikoa,
          'wilaya':wilaya,
         
       }
               

     
        return render(request, 'register.html',todo)


def confirmMail(request):
  if request.method == "POST":
      pwd = int(request.POST.get('pwd',0))
      pwd =0     
    # try:
      mail = request.POST.get('mail',None)
      codeN = int(request.POST.get('code',0))
      isMail = True
      if mail is None:
        mail = request.POST.get('phone')
        isMail = False

      if pwd:
         getmail = User.objects.get(email__icontains=mail)
         mail = getmail.email
         

      conf = PhoneMailConfirm.objects.filter(PhoneMail__icontains=mail)
      tm = datetime.datetime.now(tz=timezone.utc) + timedelta(seconds=80)
      randNum = random.randint(10000,99999)
      cnf = {
                   'num':randNum,
                   'to':mail,
                   'code':codeN,
                   'formail':True
            }
      try:
        if   isMail: 
              
            confirmMailF(cnf)


        else: 
                # modified here ...........//
                url = "https://messaging-service.co.tz/api/sms/v1/text/single"

                payload = json.dumps({
                  "from": "fbiashara",
                  "to": f"{codeN}{mail}",
                  "text": f"Your fanyabiashara code is {randNum}",
                  "reference": "aswqetgcv"
                })
                headers = {
                  'Authorization': 'Basic bXVzYWo6TXVzYUBtZTEy',
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }

                response = requests.request("POST", url, headers=headers, data=payload)

                # print(response.text)      
      except Exception as err:
        print(err)
        
      dura = None
      if conf.exists():
        conf.update(duration = tm,code = randNum,confirm=False)
        dura = conf.last().duration
      else:
        conf =  PhoneMailConfirm()
        conf.PhoneMail = mail
        conf.code = randNum
        conf.duration = tm
        conf.save()

        dura = conf.duration

      data = {
        'success':True,
        # 'num':randNum,
        'mail':mail,
        'id':dura

      }

      return JsonResponse(data)
 
    # except:
    #   data = {
    #     'success':False,
    #     'msg_swa':"Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi",
    #     'msg_eng':"The action was not successfully please try again correctly"
    #   }


    #   return JsonResponse(data)


  else:
    return render(request,'register.html')

def terms(request):
   lang = int(request.GET.get('lang',1))
   todo = {
      'lang':lang
   }
   return render(request,'termsconditions.html',todo)
   
def termprivacypolice(request):
   lang = int(request.GET.get('lang',1))
   todo = {
      'lang':lang
   }
   return render(request,'termprivacypolice.html',todo)


def help(request):
   lang = int(request.GET.get('lang',1))
   todo = todoFunct(request)
   useri = todo['useri']
   lang = {
      'lang':lang
   }

   if useri is  None:
     
      return render(request,'helppage1.html',lang)
   else:
      return render(request,'helppage2.html',todo)

   
   

def welcome(request):
  lang = int(request.GET.get('lang',0))
  return render(request,'index.html',{'lang':lang})

def login(request):
   
   if request.user.is_authenticated:
    #  u=User.objects.get(pk = request.user.id)
    #  u.last_login = datetime.datetime.now(tz=timezone.utc)
    #  u.save()
     return redirect('userdash')
   else:  
    
    if request.method== 'POST':
      try:
        email= request.POST.get('email') 
        password= request.POST['password']  
        val= int(request.POST.get('lang',1))
        code = int(request.POST.get('code',0))
        
        user = auth.authenticate(username=email, password=password)

       
        if user is not None:
 
          Sessions = Session.objects.all()
          otherLog = 0
          for row in Sessions:
              if str(row.get_decoded().get("_auth_user_id")) == str(user.id):
                  # print('Same sessions')
                  if code == 0:
                     otherLog = 1
                  else:   
                     mail = PhoneMailConfirm.objects.get(PhoneMail__icontains=email,code=code,duration__gte=datetime.datetime.now(tz=timezone.utc))
                     row.delete()
          # request.session['logged'] = user.id     
                  break 
          
          
    
        
          if not otherLog:   
            auth.login(request, user) 
            return redirect("/userdash")
          else:
              conf = PhoneMailConfirm.objects.filter(PhoneMail__icontains=email)
              tm = datetime.datetime.now(tz=timezone.utc) + timedelta(seconds=80)
              randNum = random.randint(10000,99999)
              conf.update(code=randNum,duration=tm)
              try:  
                  confirmMailF({
                    'to':email,
                    'num':randNum,
                    'formail':True
                  }) 
              except:
                 pass 
              # print(randNum)
            
              

              todo = {
                  'lang':val,
                  'email':email,
                  'password':password,
                  'confirm':True
              }
              return render(request,'login.html',todo)
        
        else:
            msg = "Invalid credidentials"
            if not val:
              msg="Vitambulisho Havikubaliki"

            messages.error(request, msg)   
            return redirect(f"/login?lang={val}")
      except:
        todo = {'lang':int(request.GET.get('lang',1))}
        return render(request,'login.html',todo)  
    else:  
      val= int(request.GET.get('lang',1)) 
      todo = {'lang':val}
     
      return render(request, "login.html",todo)

def fogotpwd(request):
   lang = int(request.GET.get('lang'))
   todo = {
    'lang':lang
   }


   return render(request,'foggopwd.html',todo)


# this is fir testing an email
def sendIt(request):
   confirmMailF({
    'to':'musajaphet790@gmail.com',
    'num':'111111',
    'formail':True
   })
   return redirect('/posts')

def confirmMailPwdFoggot(request):
  if request.method == "POST":
    try:
      mail = request.POST.get('mail')
      code = request.POST.get('code')
 
      confirm=PhoneMailConfirm.objects.get(confirm=False,PhoneMail__icontains=mail,code=code,duration__gte=datetime.datetime.now(tz=timezone.utc))
      confirm.confirm = True
      confirm.save()

      userI = User.objects.get(email__icontains=mail)
      UserExtend.objects.filter(user=userI.id).update(pwdResets=True)
      InterprisePermissions.objects.filter(user__user=userI.id,default=True).update(default=False)
      auth.login(request, userI)

      data = {
        'success':True,
        'msg_swa':'Uhakiki wa namba umefanikiwa kikamilifu',
        'msg_eng':'Verification code confirmed successfully'
      }


      return JsonResponse(data)

    except:
      data = {
        'success':False,
        'msg_eng':'The action was not successfully due to error please try again correctly',
        'msg_swa':'Kitendo hakikufanikiwa tafadhari jaribu tena kwa usahihi'
       
      }
      return JsonResponse(data)       

@login_required(login_url='login')
def changePwd(request):
   try:
      todo = todoFunct(request)
      useri= todo['useri']
      pwd = request.POST.get('pwd')

      data = {
        'success':True,
        'msg_eng':'Password has been reset successfully',
        'msg_eng':'Neno la siri limebadilishwa kikamilifu'
      }     
      if useri.pwdResets:
         userI = useri.user
         userI.set_password(pwd)
         userI.save()

         useri.pwdResets = False
         useri.save()
      else:
        data = {
                'success':False,
                'msg_swa':'Kitendo hakikufanikiwa tafadhari tena kwa usahihi',
                'msg_eng':'Action was not successfully please try again correctly'
              } 
      return JsonResponse(data)
   except:
    data={
      'success':False,
      'msg_swa':'Kitendo hakikufanikiwa tafadhari tena kwa usahihi',
      'msg_eng':'Action was not successfully please try again correctly'
    }
    return JsonResponse(data)
   
@login_required(login_url='login')
def passWordResset(request):
  todo = todoFunct(request)
  lang = int(request.GET.get('lang',0))
  
  useri = todo['useri']
  if useri.pwdResets:
    todo.update({
       'lang':lang
    })
    return render(request,'passReset.html',todo)
  else:
     return redirect('/userdash')
  
def getKata(request):
  if request.method == "POST":
    dist = int(request.POST.get('d',0))
    ward = int(request.POST.get('s',0))

    data = {
      'success':False
    }

    if dist > 0:
      kata=Kata.objects.filter(wilaya=dist).values()
      data = {
        'success':True,
        'kata':list(kata)
      }
    elif ward > 0:
       mitaa = Mitaa.objects.filter(kata=ward).values()
       data = {
        'success':True,
        'mitaa':list(mitaa)
       }

    return JsonResponse(data) 

  else:
    return render(request,'index.html')

def deleteInt(request):  
    # intp=User.objects.all().delete()
    return redirect(register)

def logout(request):
    
    Sessions = Session.objects.all()
    user = request.user
    for row in Sessions:
        if str(row.get_decoded().get("_auth_user_id")) == str(user.id):
           row.delete()
           break
                 
    auth.logout(request)
    lang=int(request.GET.get('lang',1))
    return redirect('/login?lang='+str(lang))

@login_required(login_url='login')
def posts(request):
  todo = todoFunct(request)
  duka = todo['duka']
  useri = todo['useri']

  wilayani=[]
  nchini=[]  
  mkoani=[]  

  maduka = Interprise.objects.filter(Q(mtaa__kata__wilaya=useri.mtaa.kata.wilaya.id)|Q(mtaa__kata__wilaya__mkoa=useri.mtaa.kata.wilaya.mkoa.id)|Q(mtaa__kata__wilaya__mkoa__kanda__nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id),marketing__gt=0,bill_tobePaid__gte=date.today())

  # produ = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0)|Q(produced__notsure=True),Bei_kuuza__gt=0)
  # produ = produ.filter(Q(Interprise=todo['duka'].id)|Q(showToVistors=True)).distinct('bidhaa')

  # wilayanii = produ.filter(Interprise__mtaa__kata__wilaya=useri.mtaa.kata.wilaya.id,Interprise__marketing=2000)[0:10]
  # mkoanii = produ.filter(Interprise__mtaa__kata__wilaya__mkoa=useri.mtaa.kata.wilaya.mkoa.id,Interprise__marketing=5000)[0:10]
  # nchinii = produ.filter(Interprise__mtaa__kata__wilaya__mkoa__kanda__nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id,Interprise__marketing=10000)

  banners =   marketPlace.objects.filter(Q(wilaya=useri.mtaa.kata.wilaya.id)|Q(mkoa=useri.mtaa.kata.wilaya.mkoa.id)|Q(nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id),Q(banner__gender=useri.gender)|Q(banner__gender=None),banner__visted__lt=F('banner__vistors')).order_by('pk')
  seenB = 0
  if banners.filter(banner__date=useri.vistedPosts).exists():
     seenB = banners.filter(banner__date=useri.vistedPosts).last().banner.id
     

  vistedB = VistedBanners.objects.filter(banner__visted__lt=F('banner__vistors'),user=useri.id)

  # print(banners.values_list('id'))
  visted = [0]
  for v in vistedB:
     visted.append(v.banner.id)
  postVist = useri.user.date_joined
  if useri.vistedPosts is not None:
      postVist = useri.vistedPosts

  newPosts =   banners.filter(banner__date__gt=postVist)
  allBanners = newPosts.union(banners.exclude(banner__in=visted).union(banners,all=True),all=True)
  
  if maduka.filter(marketing=2000,mtaa__kata__wilaya=useri.mtaa.kata.wilaya.id).exists():
    dkw = maduka.filter(marketing=2000,mtaa__kata__wilaya=useri.mtaa.kata.wilaya.id).order_by('-bill_tobePaid')[0:15]
    num = int(15/len(dkw))    

    for d in dkw:

      produ = bidhaa_stoku.objects.filter(Q(idadi__gt=0)|Q(produced__notsure=True),showToVistors=True,Bei_kuuza__gt=0,Interprise=d.id)
      produ = produ.distinct('bidhaa')[0:num] 
    
      
      for p in produ:
        img_url = None
        img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
        if img.exists():
          img_url = img.last().picha.picha
        dt={
          'id':p.id,
          'name':p.bidhaa.bidhaa_jina,
          'duka':p.Interprise.id,
          'img':img_url,
          'bei':p.Bei_kuuza,

        }
        if img.exists():  
          wilayani.append(dt)

  if maduka.filter(marketing=5000,mtaa__kata__wilaya__mkoa=useri.mtaa.kata.wilaya.mkoa.id).exists():
    dkw = maduka.filter(marketing=5000,mtaa__kata__wilaya__mkoa=useri.mtaa.kata.wilaya.mkoa.id).order_by('-bill_tobePaid')[0:15]
    num = int(15/len(dkw))    

    for d in dkw:

      produ = bidhaa_stoku.objects.filter(Q(idadi__gt=0)|Q(produced__notsure=True),showToVistors=True,Bei_kuuza__gt=0,Interprise=d.id)
      produ = produ.distinct('bidhaa')[0:num] 
    
      for p in produ:
        img_url = None
        img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
        if img.exists():
          img_url = img.last().picha.picha
        dt={
          'id':p.id,
          'name':p.bidhaa.bidhaa_jina,
          'duka':p.Interprise.id,
          'img':img_url,
          'bei':p.Bei_kuuza,

        }
        if img.exists():  
          mkoani.append(dt)


  if maduka.filter(marketing=10000,mtaa__kata__wilaya__mkoa__kanda__nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id).exists():
    dkw = maduka.filter(marketing=10000,mtaa__kata__wilaya__mkoa__kanda__nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id).order_by('-bill_tobePaid')[0:15]
    num = int(15/len(dkw))    

    for d in dkw:
      produ = bidhaa_stoku.objects.filter(Q(idadi__gt=0)|Q(produced__notsure=True),showToVistors=True,Bei_kuuza__gt=0,Interprise=d.id)
      produ = produ.distinct('bidhaa')[0:num] 
    
    for p in produ:
      img_url = None
      img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
      if img.exists():
        img_url = img.last().picha.picha
      dt={
        'id':p.id,
        'name':p.bidhaa.bidhaa_jina,
         'duka':p.Interprise.id,
        'img':img_url,
        'bei':p.Bei_kuuza,

      }
      if img.exists():  
        nchini.append(dt)
  todo.update({
    'wilayani':wilayani,
    'mkoani':mkoani,
    'nchini':nchini,
    'nchiniI':len(nchini),
    'mkoaniI':len(mkoani),
    'wilayaniI':len(wilayani),
    'banners':allBanners[0:10],
    'seenB':seenB
  })
  return render(request, 'userdashboard.html',todo)


@login_required(login_url='login')
def loadPosts(request):
  
  try:
    todo = todoFunct(request)
    useri = todo['useri']
    to = int(request.POST.get('to'))
    banners =   marketPlace.objects.filter(Q(wilaya=useri.mtaa.kata.wilaya.id)|Q(mkoa=useri.mtaa.kata.wilaya.mkoa.id)|Q(nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id),Q(banner__gender=useri.gender)|Q(banner__gender=None),banner__visted__lt=F('banner__vistors')).annotate(
       shop=F('banner__Interprise__name'),
       jengo = F('banner__Interprise__jengo'),
       desc=F('banner__desc'),
       mtaa=F('banner__Interprise__mtaa__mtaa'),
       kata=F('banner__Interprise__mtaa__kata__kata'),
       wilayaN=F('banner__Interprise__mtaa__kata__wilaya__wilaya'),
       mkoaN=F('banner__Interprise__mtaa__kata__wilaya__mkoa__mkoa'),
       nchiN=F('banner__Interprise__mtaa__kata__wilaya__mkoa__kanda__nchi__name'),
       page = F('banner__page'),
       url = F('banner__url'),
      #  img = F('banner__banner'),
       visted = F('banner__visted')
       ).order_by('pk')

    vistedB = VistedBanners.objects.filter(banner__visted__lt=F('banner__vistors'),user=useri.id)

    # print(banners.values_list('id'))
    visted = [0]
    for v in vistedB:
      visted.append(v.banner.id)
      
    allBanners = banners.exclude(banner__in=visted).union(banners,all=True)

    ban = []
    if len(allBanners) > 0:
      for bn in allBanners[to+1:to+10]:
         ban.append({
            'shop':bn.shop,
            'jengo':bn.jengo,
            'desc':bn.desc,
            'id':bn.id,
            'banner_id':bn.banner.id,
            'mtaa':bn.mtaa,
            'kata':bn.kata,
            'wilayaN':bn.wilayaN,
            'mkoaN':bn.mkoaN,
            'nchiN':bn.nchiN,
            'page':bn.page,
            'url':bn.url,
            'img':bn.banner.banner.url,
            'visted':bn.visted
         })

    
    data = {
       'success':True,
       'banners':ban
    }

    return JsonResponse(data)

  except:
    data = {
      'success':False
    }

    return JsonResponse(data)

@login_required(login_url='login')
def seenBanner(request):
  try:
    todo = todoFunct(request)
    useri = todo['useri']
    
    bn = int(request.POST.get('bnV'))
    banner = marketBanner.objects.get(pk=bn)

    useri.vistedPosts = banner.date
    useri.save()

    data = {
       'success':True
    }
    return JsonResponse(data)
  except:
    data = {
      'success':False
    }  
    return JsonResponse(data)

@login_required(login_url='login')
def UpdateVist(request):
  try:
    todo = todoFunct(request)
    useri = todo['useri']
    duka = todo['duka']
    bn = int(request.POST.get('bn'))
    
    banner = marketBanner.objects.get(pk=bn)
    if banner.Interprise.id is not duka.id:
      banner.visted = banner.visted + 1
      banner.save()

    
    if not VistedBanners.objects.filter(banner=banner.id,user=useri.id).exists():
       visted = VistedBanners()
       visted.user = useri
       visted.banner = banner
       visted.save()

    url = ''
    if banner.url is not None:
      url = banner.url
    else:
      url = '/buzinessTerms?s='+str(banner.Interprise.id)   

    data = {
       'success':True,
       'url':url
    }

    return JsonResponse(data)     
  except:
    data = {
       'success':False
    }     
    return JsonResponse(data)

@login_required(login_url='login')
def vistFromBanner(request):
  try:
    todo = todoFunct(request)
    useri = todo['useri']
    duka = todo['duka']
    bn = request.GET.get('b')
   
    banner = marketBanner.objects.get(pk=bn)
    if banner.Interprise.id is not duka.id:
      banner.visted = banner.visted + 1
      banner.save()

    
    if not VistedBanners.objects.filter(banner=banner.id,user=useri.id).exists():
       visted = VistedBanners()
       visted.user = useri
       visted.banner = banner
       visted.save()

    if banner.itm is not None:
       return redirect(f'/displaySelItem?value={str(banner.Interprise.id)}&i={str(banner.itm.id)}')
    
    if banner.brand is not None:
       return redirect('/displayProfItems?value='+str(banner.Interprise.id)+'&k='+str(banner.brand.id))
    
    if banner.aina is not None:
       return redirect('/displayProfItems?value='+str(banner.Interprise.id)+'&a='+str(banner.aina.id))
    
    if banner.group is not None:
       return redirect('/displayProfItems?value='+str(banner.Interprise.id)+'&m='+str(banner.group.id))
    
    if banner.page == 1:
       return redirect(f'/buzinessProfile?value={str(banner.Interprise.id)}')

  except:
     return redirect('/posts')

@login_required(login_url='login')
def userdash(request):
  try:
       used=request.user
       regi=UserExtend.objects.get(user = used.id) 
       wilaya = Wilaya.objects.all()
       mikoa = Mikoa.objects.all()
       kanda=Zones.objects.all()
       reg = regi.regstatue


       if reg ==  1 :
          todo = {
                'lang':regi.langSet,
                'kanda':kanda,
                'mikoa':mikoa,
                'wilaya':wilaya,
                'regi':regi
           
            }
          return render(request,'register.html',todo)
       
       elif reg ==  2 and InterprisePermissions.objects.filter(Q(Allow=True,Interprise__usage__gt=0,Interprise__bill_tobePaid__gte = date.today())|Q(Interprise__owner__user=used.id),user__user = used.id,default=True).first() is not None:  
  
           todo=todoFunct(request)
           return render(request, 'entpdashboard.html', todo)

       elif reg ==  2 and InterprisePermissions.objects.filter(Q(Allow=True,Interprise__usage__gt=0,Interprise__bill_tobePaid__gte = date.today())|Q(Interprise__owner__user=used.id),user__user = used.id,default=True).first() is  None :
        #  user = UserExtend.objects.get(user = used.id )
         todo = todoFunct(request)
         if not todo['useri'].pwdResets:
            return redirect('posts')
         else:
            return redirect('passWordResset')
  except:
      return render(request, 'pagenotFound.html',todoFunct(request))

def register2(request):
  if  request.method == 'POST':
    try:
      val = int(request.POST.get('val',0))
      code = request.POST.get('code')
      mail = request.POST.get('mail')
      phone = request.POST.get('phone')

   
      confirm = PhoneMailConfirm.objects.get(PhoneMail__icontains=phone,code=code,duration__gte=datetime.datetime.now(tz=timezone.utc))
      RegUser = UserExtend.objects.get(pk=val,user__email=mail)
      confirm.confirm = True
     
      confirm.save()
      
      RegUser.simu1 = '+'+str(RegUser.mtaa.kata.wilaya.mkoa.kanda.nchi.code)+' '+ phone
      RegUser.save()



  
     
      user_name = RegUser.user.first_name+' '+RegUser.user.last_name


      def uniqName(n,jina):
        uniq_name=jina.partition(' ')[0]      
        name = uniq_name.lower()+str(n)
        # if n < 10:
        #     name=
        # elif  n < 100:
        #     name=uniq_name.lower()+'00'+str(n)
        # elif n < 1000 :   
        #     name=uniq_name.lower()+'0'+str(n)
        # else:
        #     name=uniq_name.lower()+str(n)          

        if Interprise.objects.filter(Intp_code=name).exists():
            return uniqName(n+10,jina)
        else:
          return name  

     

      
      Interprise.objects.create(
      name = user_name,
      
      # kanda = kanda_others,
      # mkoa = mikoa_others,
      # wilaya = wilaya_others,
      mtaa = RegUser.mtaa,
      owner = RegUser,
      Interprise = 0,
      created = date.today(),
      # Personal = pers,
      # Store = store,
      countryCode=RegUser.mtaa.kata.wilaya.mkoa.kanda.nchi.code,
      # country=country,
      currencii=RegUser.mtaa.kata.wilaya.mkoa.kanda.nchi.currencii,
      Intp_code = uniqName(random.randint(1,100),user_name)
      )
      
      RegUser.regstatue = 2
      RegUser.save()

      userI = RegUser.user
      
      auth.login(request, userI)
      
      data = {
        'success':True
      }
      
      

      return JsonResponse(data)

    except:
      data = {
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'The action was not successfully please try again'
      }

      return JsonResponse(data)
  
    # pro_user = False   
 
    # UserExtend.objects.filter(user=usered).update(regstatue=2,pro=pro_user)

   
    # messages.success(request, 'Usjili wako Umekamilika Sasa')

@login_required(login_url='login')
def ChangeUserPlace(request):
     if request.method == "POST":
        try:
           mtaa = int(request.POST.get('mtaa'))
           todo = todoFunct(request)
           useri = todo['useri']
           pent = todo['pent']

           mtaani = Mitaa.objects.get(pk=mtaa)
           useri.mtaa = mtaani
           pent.mtaa = mtaani

           useri.save()
           pent.save()

           data = {
              'success':True,
              'msg_swa':'Sehemu imebadilishwa kikamilifu',
              'msg_eng':'Place changed successfully'
           }
           return JsonResponse(data)
        except:
            data={
                'success':False,
                'msg_swa':' Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
                'msg_eng':'The action was not successfully please try again',
              }
            return JsonResponse(data)
           
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 
         

@login_required(login_url='login')
def userprofile(request):
    wilaya = Wilaya.objects.all()
    mikoa = Mikoa.objects.all()
    kanda=Zones.objects.all() 
    
    todo = todoFunct(request)
  
    useri = todo['useri']

 
    kata = Kata.objects.filter(wilaya=useri.mtaa.kata.wilaya.id)  
    mitaa = Mitaa.objects.filter(kata=useri.mtaa.kata.id)  

  

    todo.update({
        'kanda':kanda,
        'mikoa':mikoa,
        'wilaya':wilaya,
         'kata':kata,
        'mitaa':mitaa
    })
    return render(request, 'userprofile.html',todo)

@login_required(login_url='login')
def showPersonalNo(request):
   if request.method == "POST":
      try:
        alw = int(request.POST.get('alw'))
        todo = todoFunct(request)
        useri = todo['useri']

        useri.showNum1 = alw
        useri.save()
        data = {
          'success':True,
          'eng':'Changes made successfully',
          'swa':'Mabadiliko yamefanyika kikamilifu'
        }
        
        return JsonResponse(data)

      except:
         data={
            'success':False,
            'swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
            'eng':'The action was not successfully please try again'
         }  
         return JsonResponse(data)
   else:
      return render(request,'pagenotFound.html',todoFunct(request)) 
  
   
@login_required(login_url='login')
def SetActivity(request):
  if request.method == "POST":
    try:
      activity = request.POST.get('set')
      prop = int(request.POST.get('change',0))
      todo = todoFunct(request)
      cheo = todo['cheo']
      duka = todo['duka']
      if cheo.user == duka.owner:
        actswa = 'Imewezeshwa'
        acteng = 'Enabled'
        if not prop:
          actswa = 'Imezimwa'
          acteng = 'Disabled'

       
        setattr(duka,activity,prop)
        duka.save()

        data = {
          'success':True,
          'msg_swa':'Shughuli '+actswa,
          'msg_eng':'Activity '+acteng
        }
        return JsonResponse(data)
      else:
        data={
          'success':False,
          'msg_swa':'Hauna Ruhusa ya kitendo hiki tafadhari wasiliana na uongozi',
          'msg_eng':'You have no permission for this action please contact admin'
        }
        return JsonResponse(data)
    except:
        data={
            'success':False,
            'msg_swa':' Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
            'msg_eng':'The action was not successfully please try again',
          }
        return JsonResponse(data)  

# business profile settings......................................//
@login_required(login_url='login')
def addHuduma(request):

  if request.method == "POST":

    data={
        'success':True,
        'msg_swa':'Umefanikiwa kuongeza huduma nyingine',
        'msg_eng':'Other service registered successfully'
      }    
    try:
      val = request.POST.get('val')
      kifedha = int(request.POST.get('kifedha'))
      change = int(request.POST.get('change'))
      hdm = request.POST.get('hdm')
      edit = int(request.POST.get('edit',0))
      futa = int(request.POST.get('remove',0))
      todo=todoFunct(request)
      duka=todo['duka']
      hdmi=None 

      if kifedha:
        hdmi = Huduma_za_kifedha.objects.get(pk=val)
        hdm = hdmi.huduma

        if not change:
          HudumaNyingine.objects.filter(kifedhaHuduma=hdmi.id,Interprise=duka.id).delete()

      if change:
        hm = HudumaNyingine()
        if edit:
          hm = HudumaNyingine.objects.get(pk=val,Interprise=duka.id)
        hm.Interprise=duka
        hm.huduma = hdm 
        if kifedha:
          hm.kifedhaHuduma = hdmi
          hm.yakifedha = True
        hm.save()  

      if futa:
          HudumaNyingine.objects.filter(id=val,Interprise=duka.id).delete()
      
     

    except:
      data={
        'success':False,
        'msg_swa':' haukufankiwa kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'Oparation was not successfully please try again',
      } 

    return JsonResponse(data)  

  else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

# business profile settings......................................//
@login_required(login_url='login')
def getPlaceCells(request):
   if request.method == "POST":
      todo = todoFunct(request)
      duka = todo['duka']
      shop = int(request.POST.get('shop',0))
     
      if not shop:
         shop = duka.id
      cells = customer_in_cell.objects.filter(area__Interprise=shop).order_by('-pk')
      places =customer_area.objects.filter(Interprise=shop).order_by('-pk')
      data = {
         'success':True,
         'place':list(places.values('id','name')),
         'cell':list(cells.values())
      }
      return JsonResponse(data)
   else:
       data = {
          'success':False
       }
       return JsonResponse(data)
   
   
@login_required(login_url='login')
def addOfficeNo(request):
  if request.method == "POST":
     try:
        phone = request.POST.get('phone')
        todo = todoFunct(request)
        duka = todo['duka']
        useri = todo['useri']
        if duka.owner == useri:
           duka.officeNo = phone
           duka.save()
           data = {
              'success':True,
              'swa':'Namba ya simu ya office imehifadhiwa kikamilifu',
              'eng':'Office phone no added successfully'
           }
           return JsonResponse(data)
        else:
           data = {
              'success':False,
              'swa':"Hauna ruhusa hii kwa sasa tafadhari wasiliana na admini",
              'eng':"You have no permission for this please contact admin"
           }
           return JsonResponse(data)
     except:
        data = {
           'success':False,
           'swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
           'eng':'The action was not successfully please try again correctly'
        }

        return JsonResponse(data)
  else:
     return render(request,'pagenotFound.html',todoFunct(request)) 



@login_required(login_url='login')
def biz_prof(request):
  todo=todoFunct(request)
  duka=todo['duka']
  busi_reg = businessReg.objects.filter(Interprise=duka.id)
  kifedha = Huduma_za_kifedha.objects.all()
  Hdm = HudumaNyingine.objects.filter(Interprise=duka.id)
  members = InterprisePermissions.objects.filter(Interprise=duka.id)
 
  
  
  kfedha = []
  for n in kifedha:
    if HudumaNyingine.objects.filter(Interprise=duka.id,kifedhaHuduma=n.id):
      kfedha.append({"id":n.id,'huduma':n.huduma,'selected':True})
    else:
      kfedha.append({"id":n.id,'huduma':n.huduma,'selected':False})
      

 

  todo.update({
    'members':members,
    'kifedha':kfedha,
    'Hdm':Hdm,
    'reg':busi_reg,
   
  })
  return render(request,'entpProfile.html',todo)


#Remove business reistration......................................//
@login_required(login_url='login')
def remove_reg(request):
  if request.method=="POST":
    try:
      val=request.POST.get('val')
      todo=todoFunct(request)
      duka=todo['duka']
      data={
        'success':True,
        'msg_swa':'Usajiri wa biashara umeondolewa kikamilifu',
        'msg_eng':'Business Registration removed successfull'
      }
      buz_=businessReg.objects.filter(pk=val,Interprise=duka.id)
      
      if buz_.exists():
        buzi = buz_.first()
        if buzi.reg_pic:
          buzi.reg_pic.delete(save=True)
        buzi.delete()
      else:
        data={
          'success':False,
        'msg_swa':'Usajiri wa biashara Haukutambulika',
        'msg_eng':'Business was not found'
        } 
        
      return JsonResponse(data)    
    except:
      traceback.print_exc()
      data={
        'success':False,
        'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'The action was not successfully please try again'
      }
      return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request)) 


#Add business registration......................................//
@login_required(login_url='login')
def Buzi_reg(request):
  if request.method=="POST":
      todo=todoFunct(request)
      duka=todo['duka']
      data={
        'success':True,
        'msg_swa':'Usajiri wa Biashara umefanikiwa kikamilifu',
        'msg_eng':'Business registration(s) was added successfully'
      }    
      try:
        # tin=request.POST.get('tin')
        reg=json.loads(request.POST.get('reg'))
        
        # if tin!='':
        #   duka.tin = tin
        #   duka.save()
        
        for r in reg:
          regst = businessReg()
          
          if int(r['edit']):
            businessReg.objects.filter(pk=r['value'],Interprise=duka.id).update(reg_name=r['reg_name'],reg_no=r['reg_id'])
          else:
            regst.Interprise=duka
            regst.reg_name=r['reg_name']
            regst.reg_no=r['reg_id']
            regst.save()

      except:
        data={
          'success':False,
          'msg_swa':'Usajiri wa Biashara haukufanikiwa kutokana na hitilafu tafadhari jaribu tena',
          'msg_eng':'Business registration(s) was not  successfully please try agin'
        }  
      return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request)) 


# business profile picture save......................................//
@login_required(login_url='login')
def entprof_pic(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      img = request.FILES['IMG']
      siz = img.size
      data={
        'success':True,
        'msg_swa':'Picha Imefanikiwa kikamilifu',
        'msg_eng':'The image uploaded successfully'
        
      }
            
      gcs_storage = default_storage
      if not settings.DEBUG:
          gcs_storage = settings.GCS_STORAGE_INSTANCE
      ext = img.name.split('.')[-1]
      filename = f'profile/{duka.id}_{duka.name}_{str(int(time.time()))}.{ext}'    
      path = gcs_storage.save(filename, img)

      if siz/1024 <=700  :
        if duka.prof_pic !='':
          duka.prof_pic.delete(save=True)        
        duka.prof_pic = path
        duka.save()
 
      else:
        data={
         'msg_swa':'File la picha lina size kubwa hakikisha picha haizidi kb 700 Hicha haikuhifadhiwa',
         'msg_eng':'The imae file size exceeds 700kb image was not saved',
        'success':False          
        } 

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Picha ya Biashara haijafanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'Profile picture was not uploaded please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))       

# business profile Poster save......................................//
@login_required(login_url='login')
def poster_sound(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      text = request.POST.get('poster_word')

      # audio = request.POST.get('audioFile',None)
     
       
      # if audio != '' :
      #   audio = request.FILES['audioFile']
      
      data={
        'success':True,
        'msg_swa':'Maelezo yamehifadhiwa kikamilifu',
        'msg_eng':'description added successfully'
        
      }

      if text:
        duka.poster = text
        duka.save()   


      # if audio: 
      #     siz = audio.size

      #     if siz/1024 <=2000  :
      #       if duka.audio !='':
      #         duka.audio.delete(save=True)        
      #       duka.audio = audio
      #       duka.save()
    
      #     else:
      #       data={
      #       'msg_swa':'Faili la audio lina size kubwa hakikisha faili haizidi Mb 2 Sauti haikuhifadhiwa',
      #       'msg_eng':'The audio file size exceeds 2Mb audio was not saved',
      #       'success':False          
      #       } 

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Bango kwa Biashara haijafanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'Plofile Poster was not successfully please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))       

# business profile Poster activate /deactivate......................................//
@login_required(login_url='login')
def setPoster(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      washa = int(request.POST.get('washa'))
      
      data={
        'success':True
        
      }

      duka.active_poster = washa
      duka.save()

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Oparesheni haukafanikiwa kutokana na hitilafu',
         'msg_eng':' Poster was not successfully please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))       

# business profile Poster Removing......................................//
@login_required(login_url='login')
def RemovePoster(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      
      
      data={
        'success':True
        
      }

      duka.audio.delete(save=True)
      

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Oparesheni haukafanikiwa kutokana na hitilafu',
         'msg_eng':' Poster was not successfully please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))       

# business profile picture save......................................//
@login_required(login_url='login')
def entlogo_pic(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      img = request.FILES['IMG']
      siz = img.size
      data={
        'success':True,
        'msg_swa':'Nembo ya biashara imefanikiwa kikamilifu',
        'msg_eng':'Enterprise logo uploaded successfully'
        
      }     

      gcp_storage = default_storage
      if not settings.DEBUG:
          gcp_storage = settings.GCS_STORAGE_INSTANCE
      ext = img.name.split('.')[-1]
      filename = f'logo/{duka.id}_{duka.name}_{str(int(time.time()))}.{ext}'    
      path = gcp_storage.save(filename, img) 

      if siz/1024 <=500  :
        if duka.logo !='':
          duka.logo.delete(save=True)        
        duka.logo = path
        duka.save()

     
      else:
        data={
         'msg_swa':'File la picha lina size kubwa hakikisha picha haizidi kb 500 Hicha haikuhifadhiwa',
         'msg_eng':'The imae file size exceeds 500kb image was not saved',
        'success':False          
        } 

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Picha ya Biashara haijafanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'Prifile picture was not installed please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))      

# business profile picture save......................................//
@login_required(login_url='login')
def regPic(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      img = request.FILES['regPic']
      
      reg= request.POST.get('reg')
      siz = img.size
      data={
        'success':True
        
      }      
     
     
      if siz/1024 <=500  :
         gcs_storage = default_storage
         if not settings.DEBUG:
             gcs_storage = settings.GCS_STORAGE_INSTANCE
         ext = img.name.split('.')[-1]
         filename = f'registration/{duka.id}_{duka.name}_{str(int(time.time()))}.{ext}'
         path = gcs_storage.save(filename, img)
         
         regst = businessReg.objects.get(pk=reg,Interprise=duka.id)
         if regst.reg_pic:
           regst.reg_pic.delete(save=True)
         regst.reg_pic = path
         regst.save()  

     
      else:
        data={
         'msg_swa':'File la picha lina size kubwa hakikisha picha haizidi kb 500 Hicha haikuhifadhiwa',
         'msg_eng':'The imae file size exceeds 500kb image was not saved',
        'success':False          
        } 

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Picha ya hati ya usajiri haijafanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'Registration certificate picture was not installed please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))      


@login_required(login_url='login')
def busines_ac(request):
  todo=todoFunct(request)
  entp = InterprisePermissions.objects.filter(user__user=request.user)
  sal_od = []
  tdy = date.today()
  pent = todo['pent']
  


  personal_order = mauzoni.objects.filter(user_customer__enteprise=pent.id).count()
  personal_notify = Notifications.objects.filter(Interprise=pent.id,AnyUser_read=False,admin_read=False).count()
  personal_chat = chats.objects.filter(to__to=pent.id,Anyuser_read=False,admin_read=False).count()

  for i in entp:
    sal_od+= [{
         'Oda':mauzoni.objects.filter(Interprise=i.Interprise.id,order=True,cart=False).count(),
         'entp':i,
         'Noti':Notifications.objects.filter(Interprise=i.Interprise.id,AnyUser_read=False,admin_read=False).count(),
         'Chat':chats.objects.filter(to__to=i.Interprise.id,Anyuser_read=False,admin_read=False).count()
         
    }]


  if todo['useri'].pwdResets:
     return redirect('userdash')
  else:

     accs = len(entp.filter(Interprise__owner=todo['useri'].id))
     todo.update({
      'dt':sal_od,
      'perOda':personal_order,
      'perChat':personal_chat,
      'perNoti':personal_notify,
      # 'Oded':mauzoni.objects.filter(Interprise=todo['duka'].id,order=True,cart=False),
      'Owner':accs > 0,
      'accs':accs,
      'leo':date.today()
    })    
     return render(request, 'business_ac.html',todo)


# business accounts......................................//
@login_required(login_url='login')
def entpreg(request):
  todo=todoFunct(request)
  return render(request,'enterpriseRegister.html',todo)

@login_required(login_url='login')
def ActiveWarehouse(request):
  if  request.method == "POST":
    try:
      num = int(request.POST.get('num'))
      todo = todoFunct(request)
      duka = todo['duka']
      useri = duka.owner
      amo = 0
      
      if useri.business == 0:
        if num > 0 and num <= 2 :
          amo = 10000
          num = 2
        else:
          amo = (num * 10000) - 10000
      else:
        amo = num * 10000 

      if float(duka.Balance) >= float(amo)  and num > 0:
        redu = float(duka.Balance) - float(amo)
        duka.Balance = float(redu)
        duka.save() 
        if useri.business > 0:
           useri.business = num + useri.business
        else:
           useri.business = num
           
        useri.save()
        data = {
          'success':True
        }

        return JsonResponse(data)
      else:
        data ={
          'success':False
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
def activateEnterp(request):
    todo = todoFunct(request)
    useri = todo['useri']
    if useri.ImModelate or useri.ImSuper:
       return render(request,'activateEntp.html',todo)
    else:
       return redirect('/userdash')
    
@login_required(login_url='login')
def activateThis(request):
  if request.method == "POST":
    try:
      ac = int(request.POST.get('val',0)) 
      re = int(request.POST.get('rch',0))
      re_amo = int(request.POST.get('re_amo',0))

      todo = todoFunct(request)
      useri = todo['useri']
      duka = todo['duka']

      data = {
         'success':True
      }

      shop = Interprise.objects.get(pk=ac)
      owner = shop.owner

      if useri.ImModelate:
         if duka.Balance >= 8000:
            if owner.business == 0:
               
               duka.Balance = float(duka.Balance - 8000)
               duka.save()

               owner.business = 2
               owner.save()

               activatr = Activator()
               activatr.activata = useri
               activatr.save()

               activtd = Activated()
               activtd.activatd = owner
               activtd.activata = activatr
               activtd.date = date.today()
               activtd.save()

            else:

              data = {
                 'success':False,
                 'msg_swa':'Akaunti tayari ilishawezeshwa',
                 'msg_eng':'The account is already activated'
              }
         else:
          data = {
             'success':False,
             'msg_swa':'Akaunti yako haina kiasi cha kutosha kuwezesha akaunti hii tafadhari ongeza salio',
             'msg_eng':'You have no enough balance to activate this account, please recharge your account'
          }

      if useri.ImSuper:
        #  If recharging add amount to the user
         if re:
            shop.Balance = float(re_amo)
            shop.save()
         else:
            owner.ImModelate = True
            owner.save()

       
      if not  (useri.ImSuper or useri.ImModelate):
         data = {
             'sucess':False,
            'msg_swa':'Kitendo Hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi.',
            'msg_eng':'Error occured during operation please try again'
         }
      return JsonResponse(data)
    except:
       data = {
          'sucess':False,
          'msg_swa':'Kitendo Hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi.',
          'msg_eng':'Error occured during operation please try again'
       }  
       return JsonResponse(data)
    
@login_required(login_url='login')
def checkUser(request):
  if request.method == "POST":
    try:
      ac = request.POST.get('user')
      getU = Interprise.objects.get(Intp_code=ac)
      data={
         'success':True,
        'id':getU.id,
        'name':getU.name,
        'address':f'{getU.mtaa.mtaa}, {getU.mtaa.kata.wilaya.wilaya}, {getU.mtaa.kata.wilaya.mkoa.mkoa}, {getU.mtaa.kata.wilaya.mkoa.kanda.nchi.name}'
      }

      return JsonResponse(data)

    
    except:
      data ={
         'success':False
      }
      return JsonResponse(data)  
        
  
@login_required(login_url='login')
def dpoPay(request):  
     if request.method == "POST":
        

        serv = 'FanyaBiashara subscription'
        amo = 5500

        url = 'https://secure.3gdirectpay.com/API/v6/'
        
        xml = f'<?xml version="1.0" encoding="utf-8"?><API3G><CompanyToken>8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3</CompanyToken><Request>createToken</Request><Transaction><PaymentAmount>{amo}</PaymentAmount><PaymentCurrency>TZS</PaymentCurrency><CompanyRef>49FKEOA</CompanyRef><CompanyRefUnique>0</CompanyRefUnique><PTL>5</PTL></Transaction><Services><Service><ServiceType>5525</ServiceType><ServiceDescription>{serv}</ServiceDescription><ServiceDate>2025/04/08 16:34</ServiceDate></Service></Services></API3G>'

        
        headers = {'Content-Type': 'application/xml'}

        r = requests.post(url, data=xml, headers=headers)
        js = xmltodict.parse(r.text)
        # print(js)

        # xml2 = f'''<?xml version="1.0" encoding="utf-8"?>
        #         <API3G>
        #           <CompanyToken>8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3</CompanyToken>
        #           <Request>GetMobilePaymentOptions</Request>
        #           <TransactionToken>{js["API3G"]['TransToken']}</TransactionToken>
        #         </API3G>
        #    '''

        xml2 =  f'''<?xml version="1.0" encoding="UTF-8"?>
            <API3G>
              <CompanyToken>8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3</CompanyToken>
              <Request>ChargeTokenMobile</Request>
              <TransactionToken>{js["API3G"]['TransToken']}</TransactionToken>
              <PhoneNumber>255625268052</PhoneNumber>
              <MNO>halopesa</MNO>
              <MNOcountry>tanzania</MNOcountry>
            </API3G>'''

        print(xml2)

        rm = requests.post(url, data=xml2, headers=headers)
        # js2 = None
        # pay = None
        # data = {
        #    'success':False,
        #    'pay':None
        # }
        # print(rm.text)
        # tree = ET.parse(rm.text)
        # xml_data = tree.getroot()
        # xmlstr = ET.tostring(xml_data, encoding='utf-8', method='xml')

        # js2 = dict(xmltodict.parse(xmlstr))
        try:
           
          #  pay = js['API3G']['TransToken']

           data = {
           'pay':rm.text,
           "success":True
        }
        except:
           pass   


        return JsonResponse(data)


    # 'https://secure.3gdirectpay.com/payv2.php?ID=1D0CC035-40E5-44A3-B5EF-034A34AD33E9'
   



  
@login_required(login_url='login')
def checkToken(request):  
  if request.method == "POST":
    try:
      token = request.POST.get('token')
      todo = todoFunct(request)
      duka = todo['duka']

      # This will be get request api
      tokens = {'token':'72034812337626','amount':100000,}
      data ={
        'success':False
      }

      if token == tokens['token'] and not KulipaPI.objects.filter(code__icontains=token).exists():
        amo = float(tokens['amount']) + float(duka.Balance)
        duka.Balance = float(amo)
        duka.save()
        
        saveToken = KulipaPI()
        saveToken.code = token
        saveToken.Interprise = duka
        saveToken.amount = int(tokens['amount'])
        saveToken.save()

        data = {
          'success':True,
          'amount':amo
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
def userpwd(request):
   if request.method == 'POST':
          newpwd = request.POST.get('newpass', '')
          oldpwd = request.POST.get('oldpass', '')
          used = newpwd
          user = auth.authenticate(username=request.user, password=oldpwd) 
          if user is not None:
            user.set_password(newpwd)
            user.save()
            data = {
              'success' : True,
              'failed' : False
            }
            return JsonResponse(data)
          else:
             data = {
              'success':False,
              'failed' : True

            }
             return JsonResponse( data)

@login_required(login_url='login')
def saveuserimg(request):
     if request.method == 'POST' :
        # foto = request.FILES['userpic']
        try:
       
            m = UserExtend.objects.get(user=request.user.id)
            if UserExtend.objects.get(user=request.user.id).picha !='':
                UserExtend.objects.get(user=request.user.id).picha.delete(save=True)

                gcs_storage = default_storage
                if not settings.DEBUG:
                    gcs_storage = settings.GCS_STORAGE_INSTANCE
                file = request.FILES['IMG']
                todo = todoFunct(request)
                useri = todo['useri']

                ext = file.name.split('.')[-1]
                filename = f"users/{useri.id}_{int(time.time())}.{ext}"
                path = gcs_storage.save(filename, file)
    
            m.picha = path

            m.save()
            url=UserExtend.objects.get(user = request.user.id ).picha.url
            data = {
              'success':True,
              'img' : url,
              'msg_swa':'Picha ya mtumiaji imewekwa kikamilifu',
              'msg_eng':'User image uploaded successfully'
            }
            return JsonResponse(data)
        except:
          traceback.print_exc()
          data = {
             'success':False,
             'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
             'msg_eng':'Image was not uploaded please try again later'
          }
          return JsonResponse(data)
     else:
       return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def userdetails(request):
  if request.method == 'POST' :

     try:

      # userper = InterprisePermissions.objects.get(user__user=request.user.id,default=True)
      # userext = UserExtend.objects.get(pk=request.user.id)
      todo = todoFunct(request)
      userext = todo['useri']
      userdetails = userext.user
      userper = todo['cheo']

      # userdetails = User.objects.get(pk=request.user.id)

      userdetails.first_name = request.POST.get('first_name',"")
      userdetails.last_name = request.POST.get('last_name',"")
      # userdetails.email = request.POST.get('emal',"")
      sim2= request.POST.get('simu2',0)
      cheoChake = request.POST.get('cheo',"")
      # userext.cheo = request.POST.get('cheo',"")



      userext.simu2 = sim2

      if userper is not None:
        userper.cheo = cheoChake
        userper.save()

       
      # if sim2 !='':
      #   if not Interprise_contacts.objects.filter(phone=sim2).exists():
      #       userp =  InterprisePermissions.objects.filter(user__user=request.user.id)
      #       for p in userp:
      
      #           contact = Interprise_contacts()
      #           contact.Interprise=p.Interprise
      #           contact.phone=sim2
      #           contact.cheo =p.cheo
      #           # contact.owner=userper.admin
      #           contact.user=p.user.user
      #           contact.Admin=p.owner
              
                    
                    
      #           contact.save()



      userdetails.save()
      userext.save()
      
      data = {
          'success':True,

        }
      return JsonResponse(data)

     except:
        data = {
      'success':False,

          }
        return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def search_member(request):
  if request.method == 'POST' :
    data={
        'success':True,
        'msg_swa':'Imefanikiwa',
        'msg_eng':'Success'
      }
    try:
      # todo = todoFunct(request)
      code = request.POST.get('code','')

      usr=Interprise.objects.filter(Intp_code__iexact=code)

      if usr.exists():
        
        user = list(Interprise.objects.filter(Intp_code__iexact=code).annotate(picha=F('owner__picha'),first_name=F('owner__user__first_name'),last_name=F('owner__user__last_name'),phone=F("owner__simu1"),simu2=F("owner__simu2"),mtaaN=F('mtaa__mtaa'),wilaya=F('mtaa__kata__wilaya__wilaya'),mkoa=F('mtaa__kata__wilaya__mkoa__mkoa'),nchi=F('mtaa__kata__wilaya__mkoa__kanda__nchi__name')).values())
        data.update({
          'user':user
        }
        )
      else:
        data={
         'success':False,
        'msg_swa':'Utambulisho wa mtumiaji haukupatikana',
        'msg_eng':'User Not Found',         
        }  
      
    except:
      data = {
        'success':False,
        'msg_swa':'Utambulisho wa mtumiaji haukupatikana',
        'msg_eng':'User Not Found',
      }  
    return JsonResponse(data)  
  else:  
       return render(request,'pagenotFound.html',todoFunct(request)) 



@login_required(login_url='login')
def addDeliveryAgent(request):
  if request.method == 'POST' :

        data={}

        try: 
          agent= request.POST.get('agent',0) 
          todo = todoFunct(request)
          duka = todo['duka']
          agnt=Workers.objects.get(pk=agent,Interprise__owner=duka.owner.id)

          available=deliveryAgents.objects.filter(agent=agnt.id,Interprise=duka.owner.id)

          if available.exists():
                  data={
                      'success':False,
                      'msg_swa':'Agenti tayari kashaongezwa ',
                      'msg_eng':'Agent  exists '
                    }

          if  not available.exists():
              da=deliveryAgents()
              da.Interprise =   duka
              da.agent =  agnt
              da.save()
              data={
                      'success':True,
                      'msg_swa':'Delivery Agent Ameongezwa Kikamilifu',
                      'msg_eng':'Delivery Agent was  added successfully'
                    }
             
              # return JsonResponse(data)  

          
        except:
            data={
                'success':False,
                'msg_swa':'Agent hakuongezwa kutokana na hitilafu tafadhari jaribu tena',
                'msg_eng':'Agent was not added please try again'
              }


        return JsonResponse(data)    

  else:
      return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def addStaff_form(request):
  if request.method == 'POST' :

    data={
            'success':True,
            'msg_swa':'Mtumiaji Ameongezwa Kikamilifu',
            'msg_eng':'Member was  added successfully'
          }

    try: 
      staff= request.POST.get('staff',"") 
      cheo= request.POST.get('staffcheo',"") 

      todo = todoFunct(request)
      duka = todo['duka']

      usr=Workers.objects.get(pk=staff,Interprise__owner=duka.owner.id)

      exist = 0
      if  InterprisePermissions.objects.filter(fanyakazi=usr.id,Interprise=duka.id).exists():
        exist = 1
        data={
          'success':False,
          'msg_swa':'Mtumiaji tayari kashaongezwa ',
          'msg_eng':'User  exists '
        }

    

      
      if InterprisePermissions.objects.get(user__user=request.user.id,default=True).owner and not exist:          
       

          entId = InterprisePermissions.objects.get(user__user=request.user.id,default=True)

          usrent=user_Interprise()
          usrent.Interprise = usr.diactive.where
          usrent.save()

          entp = InterprisePermissions()
          entp.user = usr.diactive.where.owner
          entp.user_entp=usrent
          entp.owner = False
          entp.Allow = False
          entp.discount = False
          entp.profile = False
          entp.picDescription = False
          entp.codeChange = False
          entp.ProfitView = False

          entp.addsupplier = False
          entp.addproduct = False
          # entp.addparentCat = False
          # entp.addaina = False
          # entp.addKampuni = False

          entp.Interprise = entId.Interprise
          entp.default = False
          entp.cheo = usr.kazi
          entp.admin = request.user.id
          entp.product_edit = False
          entp.fanyakazi = usr

          entp.save()



        
    except:
        data={
          'success':False,
          'msg_swa':'Mtumiaji hakuongezwa kutokana na hitilafu tafadhari jaribu tena',
          'msg_eng':'Member was not added please try again'
        }

    return JsonResponse(data)

  else:
       return render(request,'pagenotFound.html',todoFunct(request)) 


@login_required(login_url='login')
def getAgentdata(request):
  todo=todoFunct(request)

  if request.method == 'POST':
    duka = todo['duka']  
    agent = list(deliveryAgents.objects.filter(Interprise=duka.id).annotate(first_name=F('agent__diactive__where__owner__user__first_name'),pat=F('agent__diactive__where'),last_name=F('agent__diactive__where__owner__user__last_name')).values())
    data=dict()
    data['agent']= agent
    return JsonResponse(data)
  else:
      return render(request,'pagenotFound.html',todoFunct(request)) 
 

@login_required(login_url='login')
def getstaffdata(request):
  if request.method == 'POST':
    # local_tz = pytz.timezone("Africa/Dar_es_Salaam")
    todo = todoFunct(request)
    if todo['duka'].Interprise:
      entId = InterprisePermissions.objects.get(user__user=request.user.id,default=True).Interprise
      # admin = InterprisePermissions.objects.get(user__user=request.user.id,default=True).admin
      users = InterprisePermissions.objects.filter(Interprise=entId).exclude(user__user = request.user.id).annotate(
         picha=F('user__picha'),
         sim1=F('user__user__username'),
         sim2=F('user__simu2'),
         ent=F('Interprise'),
         to=F('user_entp__Interprise'),
         first_name=F('user__user__first_name'),
         last_name=F('user__user__last_name'),
         last_log=F('user__user__last_login'))
      
      # alldata= serializers.serialize("python", users)
      assistantpresent = InterprisePermissions.objects.filter(admin=entId.owner.user.id,msaidizi=True).count()
      imgs = []
      if users.exists():
         for us in users:
            pc = ''
            if us.user.picha:
               pc = us.user.picha.url
               imgs.append({
                'id':us.id,
                'picha':pc
               })

      userdetails={}
      details=[]
      det=list(users.values().order_by('-online'))
      dat='none'
      for each in users:

      
            if UserExtend.objects.get(pk=each.user.id).picha !='':
              dat+="picplaced"
            if (datetime.datetime.now(tz=timezone.utc) - each.online).seconds < 10:   
              dat+='1' 
    
            if each.Allow:
                dat+="allowed" 
    
      d=InterprisePermissions.objects.get(user__user=request.user.id,default=True).online
      n=datetime.datetime.now(tz=timezone.utc)
      diff = {
        "now1":datetime.datetime.now(tz=timezone.utc),
        "time":InterprisePermissions.objects.get(user__user=request.user.id,default=True).online,
        "diff":(n-d).seconds,
        #  "truetime":d.replace(tzinfo=pytz.utc).astimezone(local_tz).replace(tzinfo=None),

        }

        # details.append(det)

      userdetails["online"]=dat
      userdetails["users"]=det
      userdetails['images']=imgs
      userdetails["date"]=diff
      userdetails["assist"]=assistantpresent


    
  

      return JsonResponse(userdetails)
    else:
      data = {
         'online':None,
         "users":[],
         "date":None,
         "assist":None,
      }
      return JsonResponse(data)  
  else:
       return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def getWorkers(request):
    if request.method == "POST":
        wote = int(request.POST.get('wote',0))
        todo = todoFunct(request)
        duka = todo['duka']

        allworkers = Workers.objects.filter(Interprise__owner=duka.owner.id).order_by("-pk")
        if not wote:
            allworkers = allworkers.filter(Interprise=duka.id)

        pichaZao = []
        if allworkers.exists():
           for wk in allworkers:
              pc = ''
              if wk.picha:
                 pichaZao.append({
                    'picha':wk.picha.url,
                    'id':wk.id
                 })

        
        data = {
            'worker':list(allworkers.values()),
            'success':True,
            'img':pichaZao
        }
        return JsonResponse(data)
    else:
        return render(request,'pagenotFound.html',todoFunct(request))


@login_required(login_url='login')
def Employees(request):
  try:
    todo = todoFunct(request)
    return render(request,'employees.html',todo)
  except:
    return render(request,'errorpage.html',todoFunct(request))  

@login_required(login_url='login')
def EmployeeDetails(request):
  try:
    todo = todoFunct(request)
    duka = todo['duka']
    wrk = request.GET.get('wrk',0)
    
 
    worker = Workers.objects.get(pk=wrk,Interprise=duka.id)
    users = False 
    delivery = False
    if todo['useri'] == duka.owner:
      worker = Workers.objects.get(pk=wrk,Interprise__owner=duka.owner.id)

    if worker.diactive is not None:
      users = InterprisePermissions.objects.filter(user=worker.diactive.where.owner.id,Interprise=duka.id).exists()  
      delivery = deliveryAgents.objects.filter(Interprise=duka.id,agent=worker.id).exists()


    attach = EmployeeAttachments.objects.filter(employee=worker.id).order_by('-pk')
    todo.update({
      'worker':worker,
      'attach':attach,
      'theUser':users,
      'deliver':delivery
    })

    return render(request,'employeeDetail.html',todo)
  except:
    return render(request,'errorpage.html',todoFunct(request))  

# business User Image save......................................//
@login_required(login_url='login')
def userImgAdd(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      img = request.FILES['User_img_save']
      wk = request.POST.get('workerName',0)
      siz = img.size
      data={
        'success':True
        
      }

      gcs_storage = default_storage
      if not settings.DEBUG:
          gcs_storage = settings.GCS_STORAGE_INSTANCE

      ext = img.name.split('.')[-1]
      filename = f"users/{wk}_{int(time.time())}.{ext}"
      path = gcs_storage.save(filename, img)


      if siz/1024 <=500  :
        userPic = Workers.objects.get(pk=wk,Interprise=duka.id)
        if userPic.picha !='':
          userPic.picha.delete(save=True)        
        userPic.picha = path
        userPic.save()

     
      else:
        data={
         'msg_swa':'File la picha lina size kubwa hakikisha picha haizidi kb 500 Hicha haikuhifadhiwa',
         'msg_eng':'The imae file size exceeds 500kb image was not saved',
        'success':False          
        } 

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Picha ya Mfanyakazi haijafanikiwa kutokana na hitilafu tafadhari jaribu tena kwa usahihi',
         'msg_eng':'User picture was not installed please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))      



# business add user attachment ......................................//
@login_required(login_url='login')
def AddEmployeeAttachments(request):
  if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      text = request.POST.get('attachWord')
      wk = request.POST.get('workerd',0)
      att = request.POST.get('attachOne',0)

      attach = request.FILES['attachFile']
     
      workr = Workers.objects.get(pk=wk,Interprise__owner=duka.owner.id) 
    
      siz = attach.size
      data = {
        'success':True,
        'msg_swa':'Kiambatanishi kimeongezwa cha mfanyakazi kikamilifu',
        'msg_eng':'the user attachment added successfully',
      }
      if siz/1024 <=5000  :
        Uatt = EmployeeAttachments()
        if EmployeeAttachments.objects.filter(pk=att,employee=workr.id).exists():
          Uatt = EmployeeAttachments.objects.get(pk=att,employee=workr.id)

          if Uatt.fileAttach !='':
            Uatt.fileAttach.delete(save=True)    
        gcs_storage = default_storage
        if not settings.DEBUG:
            gcs_storage = settings.GCS_STORAGE_INSTANCE
        ext = attach.name.split('.')[-1]
        filename = f"users/{workr.id}_{int(time.time())}.{ext}"
        path = gcs_storage.save(filename, attach)    

        Uatt.fileAttach = path
        Uatt.desc = text
        Uatt.employee = workr
        Uatt.save()

      else:
          data={
            'msg_swa':'Faili la kiambatanishi lina saizi kubwa hakikisha halizidi 5MB utambulisho haukufanikiwa ',
            'msg_eng':'The file size is too large to be saved make sure the file does not exceed 5MB attachment was not saved',
            'success':False          
          } 

      return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhaari jaribu tena',
         'msg_eng':'Action was not successfully please try again',
        'success':False
        
      }
       return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))       


@login_required(login_url='login')
def RemoveAttach(request):
 if request.method=="POST":
    try:
      todo=todoFunct(request)
      duka = todo['duka']
      val = request.POST.get('att')
      if todo['useri'] == duka.owner or todo['cheo'].fullcontrol:
        Uatt=EmployeeAttachments.objects.filter(pk=val,employee__Interprise__owner=duka.owner.id)
        Uatt.last().fileAttach.delete(save=True)
        Uatt.delete()

        data = {
          'msg_swa':'Kiambatanishi kimeondolewa kikamilifu',
         'msg_eng':'Attachment was removed successfully',
        'success':True
        }

        return JsonResponse(data)
      else:
        data = {
           'msg_swa':'Hauna Ruhusa hii kwa sasa tafadhari wasiliana na uongozi',
          'msg_eng':'You have no permission for this action please contact admin',
          'success':False
        } 

        return JsonResponse(data)
    except:
      
       data = {
         'msg_swa':'Oparesheni haikufanikiwa kutokana na hitilafu tafadhaari jaribu tena',
         'msg_eng':'Action was not successfully please try again',
        'success':False
        
      }
       return JsonResponse(data)
 else:
    return render(request,'pagenotFound.html',todoFunct(request))   

@login_required(login_url='login')
def deleteuser(request):
  if request.method == "POST":
         
          data={
                "done":True
              }

          try:
            id= request.POST.get('value',"") 
          
            if(InterprisePermissions.objects.get(user__user=request.user.id,default=True).owner == True ):
              staff =  InterprisePermissions.objects.get(pk=id, admin = request.user.id)
              staff.delete()
             
          except:
                 data={
              "done":False
                  }    
          return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))
# User permitions

def updatepermissions(request):
  if request.method == "POST":

    data={
        "success":True,
        'msg_swa':'Ruhusa Imebadilishwa',
        'msg_eng':'Permission Changed',
      }

    try:
      id= request.POST.get('value',"")
      edit= request.POST.get('edit',"")
      state= int(request.POST.get('state',""))
    
      todo = todoFunct(request)
      duka = todo['duka']
      cheo = todo['cheo']

      uo_g=InterprisePermissions.objects.filter(user__user=request.user).last()

      if InterprisePermissions.objects.filter(pk=id,admin=uo_g.admin,Interprise=duka.id).exists() :
          if cheo.owner: 
             allow=InterprisePermissions.objects.get(pk=id,admin=uo_g.admin,Interprise=duka.id)
          else:
             allow=InterprisePermissions.objects.get(pk=id,admin=uo_g.admin,owner=False,Interprise=duka.id)
            


          setattr(allow,edit,state) 
          allow.save()
          
          if not allow.Allow:
            allow.default = False
            allow.save()

          


    except:
      data={
        'success':False,
        'msg_swa':'Ruhusa Haukubadilishwa kutokana na hitilafu tafadhari jariu tena',
        'msg_eng':'Permission was not changed please try again',
      }
    return JsonResponse(data)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))


#About Interprises  Profile................................................//
@login_required(login_url='login')
def profileRegistration(request):
  todo=todoFunct(request)
  try:
    value = request.GET.get('value',0)
    dk = Interprise.objects.filter(pk=value)
    if dk.exists():
        duka=dk.last()

        busi_reg = businessReg.objects.filter(Interprise=duka.id)
        rating = Interprise_Rating.objects.filter(Interprise=duka.id)    
        todo.update({
          'rateAv':rating.aggregate(Avg=Avg('rating'))['Avg'],
          'shop':duka,
          'reg':busi_reg,
          'kapu':mauzoList.objects.filter(mauzo__order=True,mauzo__Interprise=duka.id,mauzo__cart=True,mauzo__user_customer__enteprise=todo['duka'].id,mauzo__user_customer__by=todo['useri'].id)
        })

        return render(request,'businessProfileRegi.html',todo)
    else:
       return render(request,'pagenotFound.html',todo)
  except:
     return render(request,'pagenotFound.html',todo)


#About Interprises  Profile................................................//
@login_required(login_url='login')
def profileAbout(request):
  todo=todoFunct(request)
  try:
    value = request.GET.get('value',0)
    dk = Interprise.objects.filter(pk=value)
    if dk.exists():
        duka=dk.last()
        
        members = InterprisePermissions.objects.filter(Q(showAdmin_to_profile=True,user=duka.owner.id)|Q(showUser_to_profile=True),Interprise=duka.id)
        # no_admin = InterprisePermissions.objects.filter(Interprise=duka.id,showUser_to_profile=True)
      

        rating = Interprise_Rating.objects.filter(Interprise=duka.id)
        branches = Interprise.objects.filter(owner=duka.owner.id,Interprise=True).exclude(pk=duka.id)
        if not members.exists():
          members =  InterprisePermissions.objects.filter(Interprise=duka.id,user=duka.owner.id)
        allRate = rating.count()
        brand =  Interprise.objects.get(owner=duka.owner,Interprise=False)

        todo.update({
          'brand':brand,
          'shop':duka,
          'members':members,
          'rateAv':rating.aggregate(Avg=Avg('rating'))['Avg'],
          'AllRatings':rating.order_by('-pk')[0:5],
          'AllRate':allRate,
          '5Stars':rating.filter(rating=5).count(),
          '4Stars':rating.filter(rating=4).count(),
          '3Stars':rating.filter(rating=3).count(),
          '2Stars':rating.filter(rating=2).count(),
          '1Stars':rating.filter(rating=1).count(),
           'branches':branches,    
          'kapu':mauzoList.objects.filter(mauzo__order=True,mauzo__Interprise=duka.id,mauzo__cart=True,mauzo__user_customer__enteprise=todo['duka'].id,mauzo__user_customer__by=todo['useri'].id)
        })

        return render(request,'businessProfileAbout.html',todo)
    else:
       return render(request,'pagenotFound.html',todo)
  except:
     return render(request,'pagenotFound.html',todo)


def loadRatings(request):
  if request.method == "GET":
    try:
      num = int(request.GET.get('num'))
      shop = int(request.GET.get('shop'))

      rate = Interprise_Rating.objects.filter(Interprise=shop).annotate(first_name=F('by__user__first_name'),last_name=F('by__user__last_name'),picha=F('by__picha')).order_by('-pk')[num:num+5]
      data = {
        'success':True,
        'data':list(rate.values())
      }
      return JsonResponse(data)
    except:
      data = {
        'success':False
      }  

      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))



#Selected items brand or category for Interprises  Profile................................................//
@login_required(login_url='login')
def displayProfItems(request):
  todo=todoFunct(request)
  try:
    value = request.GET.get('value',0)
    aina = request.GET.get('a',0)
    kampuni = request.GET.get('k',0)
    mahitaji = request.GET.get('m',0)
    byi = None

    dk = Interprise.objects.filter(pk=value)
    if dk.exists():
        duka=dk.last()
        prod = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,bidhaa__bidhaa_aina=aina,Interprise=duka.id)
       
        ain = True
        brand = False
        kundi = False
        if not prod.exists():
          prod = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,bidhaa__kampuni=kampuni,Interprise=duka.id)
          if prod.exists():
            ain = False
            byi = prod.last().bidhaa.kampuni
            by = byi.kampuni_jina
            brand= True
           
          else:
             prod = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,bidhaa__bidhaa_aina__mahi=mahitaji,Interprise=duka.id)
             byi = prod.last().bidhaa.bidhaa_aina.mahi
             by = byi.mahitaji
             kundi = True
        else: 
             byi = prod.last().bidhaa.bidhaa_aina
             by = byi.aina


        itms=[]

        prod = prod.filter(Q(Interprise=todo['duka'].id)|Q(showToVistors=True))
        prod = prod.order_by('-pk')

        for p in prod:
          img_url = None
          img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
          if img.exists():
            img_url = img.last().picha.picha


          dt={
            'id':p.id,
            'name':p.bidhaa.bidhaa_jina,
            'img':img_url,
            'bei':p.Bei_kuuza,
            'agizwa':mauzoList.objects.filter(produ=p.id,mauzo__order=True,mauzo__receved=False,mauzo__user_customer__enteprise=todo['duka'].id)
          }

          itms.append(dt)

        produ = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,Interprise=duka.id)
        produ = produ.filter(Q(Interprise=todo['duka'].id)|Q(showToVistors=True))

        # aina_ = produ.distinct('bidhaa__bidhaa_aina')
        p_aina=produ.distinct('bidhaa__bidhaa_aina__mahi')
        brands = produ.distinct('bidhaa__kampuni')
        rating = Interprise_Rating.objects.filter(Interprise=duka.id)

        todo.update({
          'shop':duka,
          'bidhaa':itms,
          'ain':ain,
          'brand':brand,
          'kundi':kundi,
          'rateAv':rating.aggregate(Avg=Avg('rating'))['Avg'],
          # 'aina_':aina_,
          'kampuni':kampuni,
          'mahitaji':mahitaji,
          'aina':aina,
          'p_aina':p_aina,
          'brands':brands,
          'by':by,
          'byi':byi,
          'kapu':mauzoList.objects.filter(mauzo__order=True,mauzo__Interprise=duka.id,mauzo__cart=True,mauzo__user_customer__enteprise__in=[todo['duka'].id,todo['pent'].id],mauzo__user_customer__by=todo['useri'].id)
        })
        if duka == todo['duka']:
        
          todo.update({
            'AudioUpload':AUDISIZE(request)
          })

        return render(request,'businessProfileItems.html',todo)
    else:
       return render(request,'pagenotFound.html',todo)
  except:
     return render(request,'pagenotFound.html',todo)
  

@login_required(login_url='login')
def searchFromIntp(request):
    try:
      code = request.GET.get('bc','0')
      valu = request.GET.get('valued','')
      shop = int(request.GET.get('shop',0))

      dukani = Interprise.objects.get(pk=shop)
      todo = todoFunct(request)
      # duka = todo['duka']
      useri = todo['useri']

      itms = []

      prod = bidhaa_stoku.objects.filter(
        Q(bidhaa__bidhaa_aina__mahi__aina__jina__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__name__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__aina__jina__icontains=valu) | Q(bidhaa__bidhaa_aina__mahi__aina__aina__name__icontains=valu) |
        Q(sirio__iexact=code)|Q(bidhaa__bidhaa_jina__icontains=valu)|Q(bidhaa__maelezo__icontains=valu)|Q(bidhaa__bidhaa_aina__aina__icontains=valu)|Q(bidhaa__bidhaa_aina__mahi__mahitaji__icontains=valu)|Q(bidhaa__kampuni__kampuni_jina__icontains=valu))

      if valu ==  '':
        prod =  bidhaa_stoku.objects.filter(sirio__iexact=code)
        valu = code
      prod = prod.filter((Q(idadi__gt=0)|Q(inapacha=False)),showToVistors=True,Bei_kuuza__gt=0,Interprise__sales=True,Interprise__marketing__gt=0,Interprise__bill_tobePaid__gte=date.today(),Interprise=int(shop))

      for p in prod:
        img_url = None
        img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
        if img.exists():
          img_url = img.last().picha.picha
        dt={
          'id':p.id,
          'name':p.bidhaa.bidhaa_jina,
          'img':img_url,
          'bei':p.Bei_kuuza,
          'agizwa':mauzoList.objects.filter(produ=p.id,mauzo__order=True,mauzo__receved=False,mauzo__user_customer__enteprise=todo['duka'].id)
        }

        itms.append(dt)

      produ = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,Interprise=shop)
      produ = produ.filter(Q(Interprise=todo['duka'].id)|Q(showToVistors=True))

      rating = Interprise_Rating.objects.filter(Interprise=shop)

      todo.update({
        'shop':dukani,
        'bidhaa':itms,
        'rateAv':rating.aggregate(Avg=Avg('rating'))['Avg'],
        'valu':valu,
        'bc':code,
        'kapu':mauzoList.objects.filter(mauzo__order=True,mauzo__Interprise=shop,mauzo__cart=True,mauzo__user_customer__enteprise__in=[todo['duka'].id,todo['pent'].id],mauzo__user_customer__by=todo['useri'].id)
      })


      return render(request,'businessProfileSearch.html',todo)

    except:
      return render(request,'pagenotFound.html',todo)

  




#Display the selected item................................................//
# @login_required(login_url='login')
def displaySelItem(request):
  todo=todoFunct(request)
  try:
    value = request.GET.get('value',0)
    it = request.GET.get('i',0)
    edit = request.GET.get('e',0)
  

    dk = Interprise.objects.filter(pk=value)

    userLoged = todo['duka'] is not None
    dukaId = 0
    pentId = 0
    userId = 0
    html_page = 'viewItemNonLogin.html'

    # print(userLoged)

    if userLoged:
       dukaId = todo['duka'].id
       pentId = todo['pent'].id
       userId = todo['useri'].id
       html_page = 'viewItem.html'
    if dk.exists():
        duka=dk.last()

    else:
        duka = todo['duka']  

    prodi = bidhaa_stoku.objects.filter(pk=it,Interprise=duka.id)
    prodi = prodi.filter(Q(Interprise=dukaId)|Q(showToVistors=True))
    
    if prodi.exists():
        prod= prodi.last()
        agizwa = mauzoList.objects.filter(produ=prod.id,mauzo__order=True,mauzo__receved=False,mauzo__user_customer__enteprise=dukaId)
        color = produ_colored.objects.filter(bidhaa=prod.id)
        size = produ_size.objects.filter(bidhaa=prod.id)
        picha = picha_bidhaa.objects.filter(bidhaa=prod.bidhaa.id)
        keysifa = key_sifa.objects.filter(bidhaa=prod.bidhaa.id)
        bidhaaSifa = bidhaa_sifa.objects.filter(bidhaa=prod.bidhaa.id)
        bei = bei_za_bidhaa.objects.filter(item=prod.bidhaa.id).order_by('idadi')

        match = None
        if userLoged:
           match=order_from.objects.filter(bidhaa__owner=todo['duka'].owner.user.id,orderto__bidhaa=prod.bidhaa.id)
        
        produ = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,bidhaa__bidhaa_aina=prod.bidhaa.bidhaa_aina.id,Interprise=duka.id).exclude(pk=prod.id)
        produ = produ.filter(Q(Interprise=dukaId)|Q(showToVistors=True))

        by_a = True
        qz = []
        maswari = chats.objects.filter(qzTo__qzto=prod.bidhaa.id)
        if maswari.exists():
          for q in maswari:
            qz.append({
              'swari':q,
              'majibu':chats.objects.filter(ansTo__aswTo=q.qzTo.id)
            })
        qzLen = len(qz)
        
        if produ.count() == 0:
             produ = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,bidhaa__bidhaa_aina__mahi=prod.bidhaa.bidhaa_aina.mahi.id,Interprise=duka.id).exclude(pk=prod.id)
             by_a = False 

                
        itms=[]
        itms_with=[]
        with_= mauzoList.objects.filter(produ__bidhaa=prod.bidhaa.id,mauzo__Interprise=duka.id)
        with_ = with_.filter(Q(produ__Interprise=dukaId)|Q(produ__showToVistors=True))

        produ = produ.order_by('-pk')
        count_a = produ.count()
        
        if count_a >  16:
          produ = produ[:16]

        for w in with_:
          itm = mauzoList.objects.filter(Q(produ__inapacha=False)|Q(produ__idadi__gt=0),mauzo=w.mauzo.id,produ__Bei_kuuza__gt=0).exclude(produ__bidhaa=prod.bidhaa.id)

          for p in itm:
                    img_url_ = None
                    img = picha_bidhaa.objects.filter(bidhaa=p.produ.bidhaa)
                    if img.exists():
                      img_url_ = img.last().picha.picha
                    dt={
                      'id':p.produ.id,
                      'name':p.produ.bidhaa.bidhaa_jina,
                      'img':img_url_,
                      'bei':p.produ.Bei_kuuza,
                      'agizwa':mauzoList.objects.filter(produ=p.produ.id,mauzo__order=True,mauzo__receved=False,mauzo__user_customer__enteprise=dukaId)
                    }

                    ipo = False

                    for l in itms_with:

                      if l['id'] == dt['id']:
                         ipo = True

                    if not ipo:
                      itms_with.append(dt)

        aina = bidhaa_stoku.objects.filter(Interprise=dukaId).distinct('bidhaa__bidhaa_aina')

        for p in produ:
          img_url = None
          img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
          if img.exists():
            img_url = img.last().picha.picha
          dt={
            'id':p.id,
            'name':p.bidhaa.bidhaa_jina,
            'img':img_url,
            'bei':p.Bei_kuuza,
            'agizwa':mauzoList.objects.filter(produ=p.id,mauzo__order=True,mauzo__receved=False,mauzo__user_customer__enteprise=dukaId)
          }

          itms.append(dt)

        col= 3
        if  len(size) > 0:
          col = 2 

        orderedList = mauzoList.objects.filter(mauzo__user_customer__enteprise__in=[dukaId,pentId],mauzo__order=True,mauzo__Interprise=duka.id,mauzo__cart=True,mauzo__user_customer__by=userId)  
        if duka.Interprise:
          orderedList = orderedList.filter()

        # PREVIEW IMG
        img_url = None
        img = picha_bidhaa.objects.filter(bidhaa=prod.bidhaa)
        if img.exists():
          img_url = img.last().picha.picha

        todo.update({
          'qz':qz,
          'qzlen':qzLen,
          'img':img_url,
          'aina':aina,
          'shop':duka,
          'bidhaa':prod,
          'agizwa':agizwa,
          'match':match,
          'by_a':by_a,
          'picha':picha,
          'rangi':color,
          'size':size,
          'keySifa':keysifa,
          'bidhaaSifa':bidhaaSifa,
          'bei':bei,
          'col':col,
          'other_b':itms,
          'other_b_c':count_a,
          'with':itms_with,
          'with_c':len(itms_with),
          'kapu':orderedList,
          'services':orderedList.filter(mauzo__service=True),
          'edit':int(edit)
        })

        if todo['useri'] is not None:
          todo.update({
            'saved':int(VistorsSavedItems.objects.filter(bidhaa__bidhaa=prod.bidhaa.id,user=userId).exists())

          })

     # when is service and is paid timely
        if prod.timely: 
          muda = datetime.datetime.now(tz=timezone.utc) 
          servs = mauzoList.objects.filter(produ=prod.id,mauzo__servTo__gte=muda,mauzo__receved=False).exclude(mauzo__online=True,packed=False)
          servsColor = sales_color.objects.filter(mauzo__produ=prod.id,mauzo__mauzo__servTo__gte=muda,mauzo__mauzo__receved=False).exclude(mauzo__mauzo__online=True,packed=False)
          servsSize = sales_size.objects.filter(mauzo__produ=prod.id,mauzo__mauzo__servTo__gte=muda,mauzo__mauzo__receved=False).exclude(mauzo__mauzo__online=True,packed=False)
          
          todo.update({    
          'servs':servs,
          'servsColor':servsColor,
          'servsSize':servsSize,
          })


        if duka == todo['duka']:
        
          todo.update({
            'AudioUpload':AUDISIZE(request)
          })

        

        return render(request,html_page,todo)
    else:
       return render(request,'pagenotFound.html',todo)

  except Exception as err:
     print(err)
     traceback.print_exc()
     return render(request,'pagenotFound.html',todo)

#Selected items brand or category for Interprises  Profile................................................//
# @login_required(login_url='login')
def getItemData(request):
  todo=todoFunct(request)
  if request.method == "GET":
    try:
      value = request.GET.get('value',0)
      it = request.GET.get('i',0)
      edit = False
      dk = Interprise.objects.filter(pk=value)

      if int(value) == 0:
        dk= Interprise.objects.filter(pk=todo['duka'].id)
        
        
      if dk == todo['duka']:
        edit = True

      if dk.exists():
          duka=dk.last()
          prod = bidhaa_stoku.objects.get(pk=it,Interprise=duka.id)
          
          
          size = list(produ_size.objects.filter(bidhaa=prod.id).annotate(size_name=F('sized__size'),color=F('sized__color')).values())
          picha =  []
          pic = picha_bidhaa.objects.filter(bidhaa=prod.bidhaa.id).annotate(rangi=F('color_produ'),size=F('picha__pic_size'))
          if pic.exists():
             for im in pic:
                picha.append({
                   'img':im.picha.picha.url,
                   'size':im.size,
                   'id':im.id,
                   'rangi':im.rangi,
                   'bidhaa_id':im.bidhaa.id

                })  
          
          data={
            'success':True,
            'picha':picha,
            'size':size,
            'edit':edit
           }

          return JsonResponse(data)
      else:
        return JsonResponse({'success':False})
    except:
      return JsonResponse({'success':False})
  else:
    return render(request,'pagenotFound.html',todo)

@login_required(login_url='login')
def UserSaveItem(request):
  todo=todoFunct(request)
  if request.method == "POST":
    try:
      it = int(request.POST.get('itm',0))
      bidhaa = bidhaa_stoku.objects.get(pk=it)

      msg_swa = 'Bidhaa Imeongezwa Katika Bidhaa Muhimu'
      msg_eng = 'Item Saved Successfully'

      saved = VistorsSavedItems.objects.filter(bidhaa__bidhaa=bidhaa.bidhaa.id,user=todo['useri'].id)
      if saved.exists():
         saved.delete()

         msg_swa = 'Bidhaa Imeondolewa Katika Bidhaa Muhimu'
         msg_eng = 'Item Removed from Saved Items Successfully'   


      else:          
          sav =  VistorsSavedItems()
          sav.user = todo['useri']
          sav.bidhaa = bidhaa
          sav.save()

      data = {
                'success':True,
                'msg_swa':msg_swa,
                'msg_eng':msg_eng,
                'svd':int(saved.exists())
      }

      return JsonResponse(data)   

    except:
      return JsonResponse({'msg_swa':'Kitendo hakikufanikiwa','msg_eng':'The action was not successfully','success':False})
  else:
    return render(request,'pagenotFound.html',todo)


# Interprises Profile................................................//
# @login_required(login_url='login')
def buzinessProfile(request):
  todo=todoFunct(request)
  try:
    value = request.GET.get('value',0)
    dk = Interprise.objects.filter(pk=value)
    if dk.exists():
        userId = 0
        dukaId = 0
        html_page = 'businessProfileNoneLoged.html'

        if todo['duka'] is not None:
            userId = todo['useri'].id
            html_page = 'businessProfileHome.html'
            dukaId = todo['duka'].id

        duka=dk.last() 
        produ = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0)|Q(produced__notsure=True),Bei_kuuza__gt=0,Interprise=duka.id)
        produ = produ.filter(Q(Interprise=dukaId)|Q(showToVistors=True))

        aina = produ.distinct('bidhaa__bidhaa_aina')
        p_aina=produ.distinct('bidhaa__bidhaa_aina__mahi')
        brands = produ.distinct('bidhaa__kampuni')

        ain = []
        for a in aina:
          prod = produ.filter(bidhaa__bidhaa_aina=a.bidhaa.bidhaa_aina.id).order_by('-id') 
          itm_num = prod.count()

          prod = prod[:10]

          itms=[]
          for p in prod:
            img_url = None
            img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa)
            if img.exists():
              img_url = img.last().picha.picha
            dt={
              'id':p.id,
              'name':p.bidhaa.bidhaa_jina,
              'aina':a.bidhaa.bidhaa_aina.id,
              'img':img_url,
              'bei':p.Bei_kuuza,

            }

            if todo['duka']  is not None:
               dt.update({
                    'agizwa':mauzoList.objects.filter(produ=p.id,mauzo__order=True,mauzo__receved=False,mauzo__user_customer__enteprise=todo['duka'].id)
               })

               todo.update({
                           'kapu':mauzoList.objects.filter(mauzo__order=True,mauzo__Interprise=duka.id,mauzo__cart=True,mauzo__user_customer__enteprise__in=[todo['duka'].id,todo['pent'].id],mauzo__user_customer__by=todo['useri'].id)
               })

            itms.append(dt)
          ai={
            'id':a.bidhaa.bidhaa_aina,
            'aina':a.bidhaa.bidhaa_aina.aina,
            'bidhaa':itms,
            'itms':itm_num
          }

          ain.append(ai)

        # NEW ITEMS .............................//

        

        lastVist = InterpriseVisotrs.objects.filter(user=userId,Interprise=duka.id).exclude(date=date.today())

        New_itms=[]
        if lastVist.exists() and todo['duka'].id is not duka.id:
           l_Visted = lastVist.last()
           Nitems =  produ.filter(bidhaa__change_date__gt=l_Visted.date) 
           for p in Nitems:
            img_url = None
            img = picha_bidhaa.objects.filter(bidhaa=p.bidhaa.id)
            if img.exists():
              img_url = img.last().picha.picha
            dtN={
              'id':p.id,
              'name':p.bidhaa.bidhaa_jina,
              'aina':a.bidhaa.bidhaa_aina.id,
              'img':img_url,
              'bei':p.Bei_kuuza,

            }
            New_itms.append(dtN)


        other_services= HudumaNyingine.objects.filter(Interprise=duka.id).order_by('-yakifedha')
        rating = Interprise_Rating.objects.filter(Interprise=duka.id)
        todo.update({
          'p_aina':p_aina,
          'rateAv':rating.aggregate(Avg=Avg('rating'))['Avg'],
          'aina':ain,
          'brands':brands,
          'services':other_services,
          'shop':duka,
          'NewItems':New_itms,
          'thereIsNew':len(New_itms)
        })



        return render(request,html_page,todo)
    else:
        return render(request,'pagenotFound.html',todo)
  except:
    return render(request,'pagenotFound.html',todo)


def buzinessTerms(request):
  todo = todoFunct(request)
  sh = request.GET.get('s',0)
  shop = Interprise.objects.filter(pk=sh)
  pr = int(request.GET.get('pr',0))
  if shop.exists():
    if todo['duka'] is not None and todo['duka'].owner == todo['useri'] and shop.last() == todo['duka'] and not pr:
      st =todo['duka'].desc
      todo.update({
        'desc':st.replace('script','p')
      })
      return render(request, 'buzinessTaratibu.html',todo)

    else:
      useri = todo['useri']
      content = render(request,"maelekezo.html",{'shop':shop.last(),'useri':useri})
      # text_content = strip_tags(content)
      return HttpResponse(content)   
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

# Interprises navigations................................................//
@login_required(login_url='login')
def SaveTerms(request):
   if request.method == "POST":
      try:
         desc = request.POST.get('terms')

         data ={
                'success':True,
                'msg_swa':'Maelekezo na taatibu zimehifadhiwa kikamilifu',
                'msg_eng':'Terms and condition saved suuccessfully'
              }

         szn=(len(desc))/1024/1024   
         todo = todoFunct(request)
         duka = todo['duka']

         if szn <= 5  :

           if duka.owner == todo['useri']:
              duka.desc = desc
              duka.save()
           else:
             data ={
               'success':False,
               'msg_swa':'Hauna ruhusa hii kwa sasa tafadhari wasiliana na uongozi',
               'msg_eng':'You have no permission on this please contact admin'
             }  
         else:
           data={
             'success':False,
             'msg_swa':'Saizi ya dokumenti ya maelezo imezidi tafadhari punguza baadhi ya picha',
             'msg_eng':'The document size is too large please reduce some picture content'
           } 
         
         return JsonResponse(data)   
      
      except:
        data ={
          'success':False,
          'msg_swa':'Kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
          'msg_eng':'Action was not successfully please try again'
        }
        return JsonResponse(data)   
   else:
     return render(request,'pagenotFound.html',todoFunct(request))

# Interprises navigations................................................//
@login_required(login_url='login')
def interpnav(request,intp):
    todo = todoFunct(request)

    curr_ent=todo['cheo']

    entp= InterprisePermissions.objects.filter(Interprise=intp,user=todo['useri'].id)
    if entp.exists():
      # entpn=Interprise.objects.get(pk=intp,owner__user=curr_ent.admin)
      
        entp.update(default=True)
        InterprisePermissions.objects.filter(user=todo['useri'].id).exclude(pk=entp.last().id).update(default=False)
        # if curr_ent:
        #   curr_ent.default=False
        #   curr_ent.save()

    else:
       InterprisePermissions.objects.filter(user=todo['useri'].id,default=True).update(default=False)   

    return redirect('userdash')


# language settings ................................................//
@login_required(login_url='login')
def langSet(request):
  if request.method== "GET":
      val = int(request.GET.get('lang',1))
      usr = UserExtend.objects.filter(user=request.user)
      if val==0 or val ==1:
        usr.update(langSet = val)
        
      return redirect('userdash')
  else:
      return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def taxes_reg(request):

  todo=todoFunct(request)
  todo.update({
    'Change':0
  }
  )

  return render(request,'taxes.html',todo)

@login_required(login_url='login')
def saleVatSet(request):
  if request.method=="POST":
    todo=todoFunct(request)  

    data={
      'success':True,
      'msg_swa':'VAT imewekwa kwa mauzo ',
      'msg_eng':'VAT have been Set to sales succefully'    
      }
    try:
      allow = int(request.POST.get('val'))
      # perc = request.POST.get('vat_per',0)
      if not allow:
          data={
            'success':True,
            'msg_swa':'VAT imetolewa kwa mauzo ',
            'msg_eng':'VAT have been unset to sales succefully'    
            }
        
      per = todo['cheo']
      entp = todo['duka']
      if per.owner:
        Interprise.objects.filter(pk=entp.id).update(vat_allow=allow)
    except:
      data={
        'success':False,
        'msg_swa':'Oparetion haikufanikiwa kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'Oparetion was not successfully please try again',
      } 
    return JsonResponse(data)   
  else:
       return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def tax_settings(request):
  if request.method=="POST":
    todo=todoFunct(request)  
    msg_swa = 'Marekebisho yamefanikiwa '
    msg_eng = 'Changes have been Set succefully'    

    try:
      # allow = request.POST.get('vat_allow')
      perc = request.POST.get('vat_per',0)

      if perc == '':
         perc=0
      else:
        perc = int(perc) 

      entp=todo['duka']
      per = todo['cheo']
      if per.owner:
        Interprise.objects.filter(pk=entp.id).update(vatper=float(perc))
        todo = todoFunct(request)
        todo.update({
          'Change':1,
          "msg_swa":msg_swa,
          "msg_eng":msg_eng,
          'success':1
        })

   
    except:
          msg_swa = 'Marekebisho hayakufanikiwa '
          msg_eng = "Changes have'nt been  Set Please try again"  
          todo.update({
                    'Change':1,
                    "msg_swa":msg_swa,
                    "msg_eng":msg_eng,
                    'success':0
                  })
    return render(request,'taxes.html',todo)
  else:
       return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def Risiti_Settings(request):
  todo = todoFunct(request)
  duka = todo['duka']

  reg = businessReg.objects.filter(Interprise=duka.id)
  usrs = InterprisePermissions.objects.filter(Interprise=duka.id)
  desc = invoice_desk.objects.filter(Interprise=duka.id)
  desk = None
  desc_exists = 0
  if desc.exists():
     desk = desc.last()
     desc_exists = 1

  todo.update({
    'reg':reg,
    'namba':usrs,
    'desc':desk,
    'desc_exists':desc_exists
  })
  return render(request,'invo_setting.html',todo)


@login_required(login_url='login')
def update_invo_desc(request):
  todo = todoFunct(request)
  if request.method == "POST":
      try:
        duka = todo['duka']
        desc = request.POST.get('desc')

        invD = invoice_desk()
        invD.Interprise = duka
        invD.desc = desc
        invD.date = datetime.datetime.now(tz=timezone.utc)
        invD.save()

        data ={
           'success':True,
           'msg_swa':'Maelezo yamehifadhiwa kikamilifu',
           'msg_eng':'Description added successfully'
        }
       
        return JsonResponse(data)
      except:
         data={
          'success':False,
          'msg_swa':'kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa husahihi',
           'msg_eng':'The action was unsuccesfully due to error please try again correctly'
         }
         return  JsonResponse(data)
      

@login_required(login_url='login')
def setInVoFormat(request):
  todo = todoFunct(request)
  if request.method == "POST":
      try:
        cheo = todo['cheo']
        minInv = int(request.POST.get('min'))
        cheo.mnRecipt = minInv
        cheo.save()
        

        data ={
           'success':True,
           'msg_swa':'Maelezo yamehifadhiwa kikamilifu',
           'msg_eng':'Description added successfully'
        }
       
        return JsonResponse(data)
      except:
         data={
          'success':False,
          'msg_swa':'kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa husahihi',
           'msg_eng':'The action was unsuccesfully due to error please try again correctly'
         }
         return  JsonResponse(data)
  else:
      data = {
        'success':False
      }

      return JsonResponse(data)


@login_required(login_url='login')
def setplace(request):
  todo = todoFunct(request)
  if request.method == "POST":
      try:
        duka = todo['duka']
        name = request.POST.get('name','')
        edit = int(request.POST.get('edit',0))
        place = int(request.POST.get('place',0))
        isplace = int(request.POST.get('isplace',0))
        isSuccess = True 
        dlt = int(request.POST.get('delete',0))
        
        data ={
           'success':True,
           'msg_swa':'Sehemu imeongezwa kikamilifu',
           'msg_eng':'Place added successfully'
        }



        if edit :
           data = {
              'success':True,
              'msg_swa':'Sehemu imebadilishwa kikamilifu',
              'msg_eng':'Place changed successfully'
           }

        if dlt :
           data = {
              'success':True,
              'msg_swa':'Sehemu imeondolewa kikamilifu',
              'msg_eng':'Place removed successfully'
           }           

              
        if isplace:
            thereIs = customer_area.objects.filter(name__icontains=name,Interprise=duka.id).exists()
         

            if (not thereIs)  or edit or dlt:
              custp = customer_area()
              if edit:
                custp = customer_area.objects.get(pk=edit,Interprise=duka.id)
              if dlt:
                 custp.delete() 
              else:   
                  custp.Interprise = duka
                  custp.name = name
                  custp.save()

            else:
                    isSuccess = False
                    data={
                      'success':False,
                      'msg_swa':'Jina la sehememu tayari limeshaongezwa, hakikisha jina la sehemu halijirudii',
                      'msg_eng':'Place name arleady exists please write another name' 
                    }
        
        else:
               
             custp = customer_area.objects.get(pk=place,Interprise=duka.id)
             thereIs=customer_in_cell.objects.filter(name__icontains=name,area=custp.id,area__Interprise=duka.id).exists()
             if (not thereIs) or edit or dlt:
                cell = customer_in_cell()
                if edit:
                    cell = customer_in_cell.objects.get(pk=edit,area__Interprise=duka.id)
                if dlt:
                   cell.delete()   
                else:   
                    cell.name = name  
                    cell.area = custp  
                    cell.save()

             else:
                isSuccess = False
                data={
                  'success':False,
                  'msg_swa':'Jina la sehememu tayari limeshaongezwa, hakikisha jina la sehemu halijirudii',
                  'msg_eng':'Place name arleady exists please write another name' 
                }

        if isSuccess:
           data.update({
              'place':list(customer_area.objects.filter(Interprise=duka.id).order_by('-pk').values('id','name')),
              'cell':list(customer_in_cell.objects.filter(area__Interprise=duka.id).order_by('-pk').values())
           })  

        return JsonResponse(data)
      except:
         data={
          'success':False,
          'msg_swa':'kitendo hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena kwa husahihi',
           'msg_eng':'The action was unsuccesfully due to error please try again correctly'
         }
         return  JsonResponse(data)
  else:
      data = {
        'success':False
      }

      return JsonResponse(data)



@login_required(login_url='login')
def setlogo_to_log(request):
  todo = todoFunct(request)
  if request.method == "POST":
    val = int(request.POST.get('val'))
    data={
      'success':True,
      'msg_swa':'Nembo ya Biashara imeongezwa kwenye risiti',
      'msg_eng':'Logo added to invoice'
    }

    if not val:
          data={
              'success':True,
              'msg_swa':'Nembo ya Biashara imeondolewa kwenye risiti',
              'msg_eng':'Logo removed from invoice'
            }
    try:
      duka = todo['duka']

      duka.invo_logo = val
      duka.save()
     
    except:
      data={
        'success':False,
        'msg_swa':'Nembo ya Biashara haijaongezwa kwenye risiti kutokana na hitilafu',
        'msg_eng':'Logo was not added to invoice '
      }

    return JsonResponse(data)  

  else:
    return render(request,'invo_setting.html',todo)

@login_required(login_url='login')
def setreg_to_invo(request):
  todo = todoFunct(request)
  if request.method == "POST":
    val = int(request.POST.get('val'))
    valued = request.POST.get('valued')
    data={
      'success':True,
      'msg_swa':'Utambulisho umeongezwa kwenye risiti',
      'msg_eng':'Registration added to invoince'
    }
    if not val:
      data={
              'success':True,
              'msg_swa':'Utambulisho umeondolewa kwenye risiti',
              'msg_eng':'Registration removed to invoince'
      }
    try:
      duka = todo['duka']
      businessReg.objects.filter(pk=valued,Interprise=duka.id).update(show_to_invo=val) 

   
    except:
      data={
        'success':False,
        'msg_swa':'Utambulisho haujaongezwa kwenye risiti kutokana na hitilafu',
        'msg_eng':'Registration was not added to invoince '
      }

    return JsonResponse(data)  

  else:
    return render(request,'invo_setting.html',todo)

@login_required(login_url='login')
def setphone_to_invo(request):
  todo = todoFunct(request)
  if request.method == "POST":
    val = int(request.POST.get('val'))
    valued = request.POST.get('valued')
    simu1 = int(request.POST.get('sim1'))
    data={
      'success':True,
      'msg_swa':'Namba ya simu imeongezwa kwenye risiti',
      'msg_eng':'Phone number added to invoince'
    }
    if not val:
      data={
              'success':True,
              'msg_swa':'Namba ya simu imeondolewa kwenye risiti',
              'msg_eng':'Phone number removed to invoince'
      }
    try:
      duka = todo['duka']
      if simu1:
        InterprisePermissions.objects.filter(pk=valued,Interprise=duka.id).update(SIM1_invoince=val) 
      else:
        InterprisePermissions.objects.filter(pk=valued,Interprise=duka.id).update(SIM2_invoince=val) 
   
    except:
      data={
        'success':False,
        'msg_swa':'Namba ya simu haijaongezwa kwenye risiti kutokana na hitilafu',
        'msg_eng':'Phone number was not added to invoince '
      }

    return JsonResponse(data)  

  else:
    return render(request,'invo_setting.html',todo)

@login_required(login_url='login')
def getUserChats(request):
  
  if request.method == "POST":
    try:
      todo = todoFunct(request)
      duka = todo['duka']
      pent = todo['pent']

      Achat =  chats.objects.filter(Q(From__in=[duka.id,pent.id])|Q(to__to__in=[duka.id,pent.id]))
     
      if Achat.exists():            
        dtchat = Achat.distinct('to__to')
        dfchat= dtchat.distinct('From')
        chat = []

        for to in dfchat:
          
          if to.to.to.id != duka.id and  to.to.to.id !=pent.id :
            allChats  = chats.objects.filter(From__in=[duka.id,pent.id,to.to.to.id],to__to__in=[duka.id,pent.id,to.to.to.id])
                    
            lastChat = allChats.last()



            unr = 0 
            if duka.owner == todo['useri']:
              admin_anread = allChats.filter(admin_read=False,to__to__in=[duka.id,pent.id])
              unr = len(admin_anread) 

            aud = ''  
            log = ''
            ownPic = ''
            if lastChat.audio:
              aud  = lastChat.audio.url

            if to.to.to.logo:
              log  = to.to.to.logo.url

            if   to.to.to.owner.picha:
              ownPic = to.to.to.owner.picha.url

            chat.append({
              'name':to.to.to.name,
              'to':to.to.to.id,
              'last_chat':{'text':lastChat.msg,'audio':aud,'at':lastChat.date},
              'chatId':lastChat.id,
              'duka':to.to.to.Interprise,
              'anread':unr,
              'logo':log,
              'owner_pic':ownPic,
              'owner_name':to.to.to.owner.user.first_name + ' ' + to.to.to.owner.user.last_name          
            })
            
        for to in dfchat:
          if to.From.id != duka.id and to.From.id !=pent.id:

            allChats  = chats.objects.filter(From__in=[duka.id,pent.id,to.From.id],to__to__in=[duka.id,pent.id,to.From.id])
            lastChat = allChats.last()

            unr = 0 
            if duka.owner == todo['useri']:
              admin_anread = allChats.filter(admin_read=False,to__to__in=[duka.id,pent.id])
              unr = len(admin_anread) 

            aud = ''  
            log = ''
            ownPic = ''
            if lastChat.audio:
              aud  = lastChat.audio.url

            if to.From.logo:
              log  = to.From.logo.url

            if to.From.owner.picha:
              ownPic = to.From.owner.picha.url

            chat.append({
              'name':to.From.name,
              'last_chat':{'text':lastChat.msg,'audio':aud,'at':lastChat.date},
              'chatId':lastChat.id,
              'anread':unr,
              'to':to.From.id,
              'duka':to.From.Interprise,
              'logo':log,
              'owner_pic':ownPic,
              'owner_name':to.From.owner.user.first_name + ' ' + to.From.owner.user.last_name
            })
          
        
        seen = set()

        data = {
          'data':True,
          'chats':[seen.add(cht['to']) or cht for cht in chat if cht['to'] not in seen ]
        }
      
      return JsonResponse(data)
    except: 
      data={
        "data":False
      }
      return  JsonResponse(data)

  else:
        return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def AllChats(request):
  if request.method == "POST":
    todo = todoFunct(request)
    duka = todo['duka']
    pent = todo['pent']
    try:
      to = request.POST.get('to')
      toEntp = Interprise.objects.get(pk=to)
      img = ''
      if toEntp.logo:
        img =  toEntp.logo.url

      to_phone = toEntp.officeNo

      if not toEntp.Interprise:
        if toEntp.owner.showNum1:
           to_phone = toEntp.owner.simu1

        if toEntp.owner.picha:
          img = toEntp.owner.picha.url

      toData={
        'to':to,
        'picha':img,
        'name':toEntp.name,
        'owner':duka.owner.id is todo['useri'].id,
        'phone':to_phone
      }
      chatA=chats.objects.filter(From__in=[duka.id,pent.id,to],to__to__in=[duka.id,pent.id,to])
      chat = list(chatA.annotate(
         item=F('onItem__bidhaa__bidhaa_jina'),
         jibu=F('ansTo__aswTo'),
         item_from=F('onItem__Interprise'),
         oda=F('onOrder__code'),
         niSaOda=F('onOrder__order'),
         pu=F('onOrder'),
         puO=F('onOrder__bill_kwa__code'),
         nipuoda=F('onOrder__bill_kwa__order'),
         pickCode=F('onOrder__user_customer__tr__code'),
         thePick=F('onOrder__user_customer__tr__user'),
         odaFrom=F('onOrder__Interprise'),
         f_name=F('By__user__first_name'),
         l_name=F('By__user__last_name'),
         kwa=F('to__to'),
         dukani=F('From__Interprise')).order_by('-pk')[:15])

      cht = []
      for c in chat:
         udio ='',
         onIt = None
         onOd = None
         qzt = None
         anst = None
         if c.onItem:
            onIt = c.onItem.id

         if c.onOrder:
            onOd = c.onOrder.id

         if c.qzTo:
            qzt = c.qzTo.id

         if c.ansTo:
            anst = c.ansTo.id

         if c.audio:
            udio = c.audio.url
         cht.append({
            'item':c.item,
            'jibu':c.jibu,
            'item_from':c.item_from,
            'oda':c.oda,
            'niSaOda':c.niSaOda,
            'pu':c.pu,
            'puO':c.puO,
            'nipuoda':c.nipuoda,
            'pickCode':c.pickCode,
            'thePick':c.thePick,
            'odaFrom':c.odaFrom,
            'f_name':c.f_name,
            'l_name':c.l_name,
            'kwa':c.kwa,
            'dukani':c.dukani,
            'date':c.date,
            'From_id':c.From.id,
            'By_id':c.By.id,
            'msg':c.msg,
            'audio':udio,
            'onItem_id':onIt,
            'onOrder_id':onOd,
            'pickups':c.pickups,
            'to_id':c.to.id,
            'qzTo_id':qzt,
            'ansTo_id':anst,
            'Anyuser_read':c.Anyuser_read,
            'admin_read':c.admin_read,
            'to_deleted':c.to_deleted,
            'from_deleted':c.from_deleted,
            'deleted_byAdmin':c.deleted_byAdmin,
            'id':c.id

         })
         


     
      chats.objects.filter(From=toEntp.id,to__to__in=[duka.id,pent.id]).update(Anyuser_read=True)
      chats.objects.filter(From=toEntp.id,to__to=pent.id).update(admin_read=True)

      if duka.owner ==  todo['useri']:
            chats.objects.filter(From=toEntp.id,to__to__in=[duka.id,pent.id]).update(admin_read=True)
          
      data={
        'success':True,
        'chat':cht,
        'to':toData
      }
     
      return JsonResponse(data)
    except:
      return JsonResponse({'success':False})
  else:
    return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def asQuestion(request):
  if request.method == "POST":
    try:
      txt = request.POST.get('txt',0)
      todo = todoFunct(request)
      duka = todo['duka']
      
      pent = todo['pent']
      chat = chats.objects.filter(to__to__in=[pent.id,duka.id],pk=txt)
      if chat.exists():
        chati = chat.last()
        to = chati.to.to.id

        if to == duka.id or to == pent.id:
           to = chati.From.id
        prod =  bidhaa_stoku.objects.filter(pk=chati.onItem.id,Interprise=duka.id)
        if prod.exists():
          qzto = question_to()
          qzto.qzto = prod.last().bidhaa
          qzto.save()
          chat.update(qzTo=qzto)

          data={
              'success':True,
              'msg_swa':'Ujumbe Umewekwa kama swali lililoulizwa kuhusu Bidhaa',
              'msg_eng':'Message added to asked about the item',
              'to':to
              }
          return JsonResponse(data)    
    except:
        data = {
          'success':False,
          'msg_swa':'Ujumbe haukwekwa kama swari kwa bidhaa tafadhari jaribu tena',
          'msg_eng':'The message was not added to asked question please try again'
        }

        return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request))              

@login_required(login_url='login')
def sendChat(request):
    if request.method == "POST":
        todo = todoFunct(request)
        duka = todo['duka']
        pent = todo['pent']
        # entp = todo['cheo']
        try:
          to = request.POST.get('to')
          text = request.POST.get('text','')
          od = int(request.POST.get('od',0))
          it = int(request.POST.get('it',0))
          Ans = int(request.POST.get('ans',0))
          # audio = request.FILES['audio_chat']

          send_to = Interprise.objects.get(pk=to)
          
          chat = chats()
          chatto = chatTo()
          chatto.to = send_to
          chatto.save()

          chat.date = datetime.datetime.now(tz=timezone.utc)
          
          # entp = InterprisePermissions.objects.filter(user=send_to.owner.id,Interprise=duka.id,Allow=True)

          chat.By = todo['useri']
          chat.msg = text
          chat.to = chatto

          lastChat = chats.objects.filter(Q(From__in=[pent.id,duka.id])|Q(to__to__in=[pent.id,duka.id]))
          if lastChat.exists():
             if lastChat.last().From.id == pent.id or lastChat.last().to.to.id == pent.id:
                chat.From = pent
             if lastChat.last().From.id == duka.id or lastChat.last().to.to.id == duka.id:
                chat.From = duka    
          else:
            chat.From = pent 

          # if entp is not None :    
          #    chat.From = pent
          # else:
          #    chat.From = duka  

          if Ans > 0:
            qzt=chats.objects.filter(qzTo=Ans,onItem__Interprise=duka.id)
            if qzt.exists():
              ansT = AnswerTo()
              ansT.aswTo = qzt.last().qzTo
              ansT.save()
              chat.From = duka 
              chat.ansTo = ansT
           
                    # chat.msg = text
          
          if od>0:
            oda = mauzoni.objects.filter(Q(Interprise=send_to.id)|Q(user_customer__enteprise=send_to.id)|Q(user_customer__tr__user=send_to.id) ,pk=od)
            if oda.exists():
            
              if oda.last().user_customer.tr:
                 ifpick =   oda.last().user_customer.tr.user
                 isPick = ifpick.id == send_to.id or ifpick.owner.id == todo['useri'].id
                 chat.pickups = isPick

                 if ifpick.owner.id == todo['useri'].id:
                    chat.From = pent

              if oda.last().user_customer.enteprise.id == pent.id :
                 chat.From == pent

              elif oda.last().user_customer.enteprise.id == duka.id: 
                 chat.From == duka  

              else :
                 chat.From == duka 

              chat.onOrder =  oda.last()

          if it>0 and Ans == 0 :
            item = bidhaa_stoku.objects.filter(pk=it)
            if item.exists():
              chat.onItem = item.last()

          # chat.audio = audio
          chat.save()

          





        
          data={
            'success':True,
            'to':to
          }
        
          return JsonResponse(data)
        except:
          return JsonResponse({'success':False})
    else:
        return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def sendAudioChat(request):
    if request.method == "POST":
        todo = todoFunct(request)
        duka = todo['duka']
        pent = todo['pent']
        try:
          to = request.POST.get('to')
          od = int(request.POST.get('od',0))
          it = int(request.POST.get('it',0))
          audio = request.FILES['audio_data']
          send_to = Interprise.objects.get(pk=to)
          chat = chats()

          chatto = chatTo()
          chatto.to = send_to
          chatto.save()

          chat.date = datetime.datetime.now(tz=timezone.utc)

          lastChat = chats.objects.filter(Q(From__in=[pent.id,duka.id])|Q(to__to__in=[pent.id,duka.id]))
          if lastChat.exists():
             if lastChat.last().From.id == pent.id or lastChat.last().to.to.id == pent.id:
                chat.From = pent
             if lastChat.last().From.id == duka.id or lastChat.last().to.to.id == duka.id:
                chat.From = duka    
          else:
            chat.From = pent 


          chat.By = todo['useri']
          # chat.msg = text
          if od>0:
            oda = mauzoni.objects.filter(Q(Interprise=send_to.id)|Q(user_customer__enteprise=send_to.id)|Q(user_customer__tr__user=send_to.id),pk=od)
            if oda.exists():
              chat.onOrder =  oda.last()

              if oda.last().user_customer.tr:
                 ifpick =   oda.last().user_customer.tr.user
                 chat.pickups = ifpick.id == send_to.id or ifpick.owner.id == todo['useri'].id
                 if ifpick.owner.id == todo['useri'].id:
                    chat.From = pent

              if oda.last().user_customer.enteprise.id == pent.id :
                 chat.From == pent
              elif oda.last().user_customer.enteprise.id == duka.id: 
                 chat.From == duka  
              else :
                 chat.From == duka 

          if it>0:
            item = bidhaa_stoku.objects.filter(pk=it,Interprise__in=[send_to.id,duka.id])
            if item.exists():
              chat.onItem = item.last()

          gcs_storage = default_storage  
          if not settings.DEBUG:
            gcs_storage = settings.GCS_STORAGE_INSTANCE
          ext = audio.name.split('.')[-1]
          filename = f"chat_audios/{chat.id}_{int(time.time())}.{ext}"
          file_path = gcs_storage.save(filename, audio)
                                                                             

          chat.to = chatto
          chat.audio = file_path
          chat.save()

          data={
            'success':True,
            'to':to
          }
        
          return JsonResponse(data)
        except:
          return JsonResponse({'success':False})
    else:
        return render(request,'pagenotFound.html',todoFunct(request))

@login_required(login_url='login')
def markReadChat(request):
   if request.method == "POST":
     todo = todoFunct(request)
     duka = todo['duka']
     pent = todo['pent']
     try:
        value = request.POST.get('chat') 
        chat = chats.objects.get(pk=value)
        
        chats.objects.filter(From=chat.From.id,to__to__in=[duka.id,pent.id]).update(Anyuser_read=True)
        if duka.owner ==  todo['useri'] or chat.to.to == pent:
            chats.objects.filter(From=chat.From.id,to__to__in=[duka.id,pent.id]).update(admin_read=True)
       

          
        data= {
          'success':True,
          'to':chat.From.id
        }


        return JsonResponse(data)
     except:

        data={
          'success':False
        }   

        return JsonResponse(data)
   else:
        return render(request,'pagenotFound.html',todoFunct(request))
     
@login_required(login_url='login')
def futatext(request): 
  if request.method=="POST":
    
    try:
      txt = request.POST.get('txt',0)
      todo = todoFunct(request)
      duka = todo['duka']
      
      pent = todo['pent']
      chat = chats.objects.filter((Q(to__to__in=[pent.id,duka.id])|Q(From__in=[pent.id,duka.id])),pk=txt)
      if chat.exists():
        chati = chat.last()
        to = chati.to.to.id

        if to == duka.id or to == pent.id:
           to = chati.From.id
        data={
            'success':True,
            'msg_swa':'Ujumbe Umeondolewa',
            'msg_eng':'Messege Deleted',
            'to':to
          }  

        if (chati.From == duka or chati.From == pent) and chati.By == todo['useri']:
          chat.update(from_deleted = True)

          if chati.audio:
            chati.audio.delete(save=True)
          
          if chati.qzTo ==  None:
            chat.update(msg= '') 
            if chati.ansTo != None:
                AnswerTo.objects.filter(pk=chati.ansTo.id).delete()

        elif (chati.to.to==duka or chati.to.to == pent) and  todo['useri'] == duka.owner :
          chat.update(to_deleted = True)

        return  JsonResponse(data)
    except:
      data = {
        'success':False,
        'msg_swa':'Ujumbe Haukuondolewa kutokana na hitilafu',
        'msg_eng':'Messege was not deleted '
        
      }

      return JsonResponse(data)



  else:
    return render(request,'pagenotFound.html',todoFunct(request))

     
@login_required(login_url='login')
def toaSwari(request): 
  if request.method == "POST":
    try:
      txt = request.POST.get('txt',0)
      todo = todoFunct(request)
      duka = todo['duka']
      chat = chats.objects.filter(pk=txt,to__to=duka.id)
      if chat.exists():
        chati = chat.last()
        question_to.objects.filter(pk=chati.qzTo.id).delete()

        data ={
          'success':True,
          'msg_swa':'Ujumbe umeondolewa kama swari lililoulizwa kuhusu bidhaa',
          'msg_eng':'Message  to asked question about the item ',
          'to':chati.From.id
      
        }
        return JsonResponse(data)
    except:
      data={
        'success':False,
        'msg_swa':'Ujumbe haukuondolewa kama swari kutokana na hitilafu tafadhari jaribu tena',
        'msg_eng':'Message was not removed to asked question about the item please try again'
      }
      return JsonResponse(data)
  else:
    return render(request,'pagenotFound.html',todoFunct(request)) 

@login_required(login_url='login')
def notify(request):
  todo = todoFunct(request)
  try:
    value = request.GET.get('vl')
    duka = todo['duka']
    pent = todo['pent']
    note = Notifications.objects.get(pk=value,Interprise__in=[duka.id,pent.id])

    if duka.owner == todo['useri'] or pent.owner == todo['useri']:
      note.admin_read = True
      note.save()
      


    if note.Incharge == todo['useri'] : 
      note.Incharge_reade = True
      note.save()
     

    note.AnyUser_read = True
    note.save()
    
    if note.itmTr:
      return redirect('/stoku/viewTransfer?item_valued='+str(note.itmTr_map.id))

    if note.itmRcv:
      return redirect('/stoku/viewReceives?item_valued='+str(note.itmRcv_map.id))

    if note.puO:
      uzo=mauzoni.objects.get(bill_kwa=note.puO_map.id)
      Notifications.objects.filter(puO_map=note.puO_map.id,date__lt=note.date).update(Incharge_reade=True,admin_read=True,AnyUser_read = True)


      return redirect('/purchase/viewOdered?value='+str(uzo.Interprise.id)+'&pu='+str(uzo.id))

    if note.bilRtn:
      return redirect('/purchase/viewRetrn?item_valued='+str(note.bilRtn_map.id))

    if note.saO:
      if note.pickUp:
         return redirect('/purchase/ViewPickup?p='+str(note.saO_map.id))
      else:
        if note.saO_map.order:
            return redirect('/mauzo/viewOda?item_valued='+str(note.saO_map.id))
        else:
            return redirect('/mauzo/viewInvo?item_valued='+str(note.saO_map.id))
        
    if note.saRtn:
      return redirect('/mauzo/viewRtrn?item_valued='+str(note.saRtn_map.id))

    if note.ItemEdit:
      if note.Item_map.prod.material:
        return redirect('/production/MaterialItems?f='+str(note.Item_map.prod.id))
      else:
        itm = bidhaa_stoku.objects.filter(bidhaa=note.Item_map.prod.id,service=True) 
        if itm.exists():
           return redirect('/stoku/servicepanel?f='+str(note.Item_map.prod.id))
        else:   
           return redirect('/stoku/bidhaapanel?f='+str(note.Item_map.prod.id))

    if note.ItemCatEdit:
      return redirect('/stoku/bidhaaReg?f='+str(note.ItemCat_map.aina.id))



  except:
    return render(request,'errorpage.html',todo)

@login_required(login_url='login')
def notificationing(request):
    todo = todoFunct(request)
  # try:
    duka=todo['duka']
    ed =   int(request.GET.get('ed',0))
    ced =   int(request.GET.get('ced',0))
    po =   int(request.GET.get('po',0))
    so =   int(request.GET.get('so',0))
    it =   int(request.GET.get('it',0))
    ir =   int(request.GET.get('ir',0))
    rt =   int(request.GET.get('rt',0))
    rd =   int(request.GET.get('rd',0))
    pk =   int(request.GET.get('pk',0))
    a = 1

    
    Notice = Notifications.objects.filter(Interprise=duka.id)
    if ed or so or po or it  or ir  or rt or rd or ced:
      a=0
      Notice = Notifications.objects.filter(
      saO=so,saRtn = rd,itmTr=it,itmRcv=ir,puO=po,bilRtn=rt,ItemEdit=ed,ItemCatEdit=ced,pickUp=pk,
      Interprise=duka.id
      )
      

    num = Notice.count()
    Noti = Notice.order_by("-pk")

    
    p=Paginator(Noti,10)
    page_num =request.GET.get('page',1)


   
    try:
          page = p.page(page_num)

    except EmptyPage:
         page= p.page(1)

    pg_number = p.num_pages

    notify = []
    for nt in page:
        msg_swa=''
        msg_eng='' 
        
        if nt.ItemEdit:
            edt= nt.Item_map
            swa_edted = ''
            eng_edted = ''
            if edt.nameEdit and edt.categEdit:
              swa_edted = ' Jina na Aina'
              eng_edted = 'Name and Category'

            if edt.nameEdit and not edt.categEdit:
              swa_edted = 'Jina '
              eng_edted = 'Name '

            if not edt.nameEdit and  edt.categEdit:
              swa_edted = 'Aina '
              eng_edted = 'Category '


            msg_swa= 'Marekebisho ya <strong>'+ swa_edted + '</strong> kwa <u class="text-capitalize text-primary">'+ edt.former_name +'</u> yamefanyika na <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name +' '+nt.Incharge.user.last_name +'</span>'
            msg_eng='<strong>'+ eng_edted + '</strong>  for <u class="text-capitalize text-primary">'+ edt.former_name +'</u> was Edited by <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name +' '+ nt.Incharge.user.last_name +'</span>'

        if nt.ItemCatEdit:
            edt= nt.ItemCat_map
            swa_edted = ''
            eng_edted = ''
            if edt.nameEdit and edt.group:
              swa_edted = 'Jina la Aina na Kundi'
              eng_edted = 'Category Name and Group'

            if edt.nameEdit and not edt.group:
              swa_edted = 'Jina la aina'
              eng_edted = 'Category Name '

            if not edt.nameEdit and  edt.group:
              swa_edted = 'Kundi '
              eng_edted = 'Group '


            msg_swa= 'Marekebisho ya <strong>'+ swa_edted + '</strong> kwa <u class="text-capitalize text-primary">'+ edt.former_name +'</u> yamefanyika na <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name +' '+ nt.Incharge.user.last_name +'</span>'
            msg_eng='<strong>'+ eng_edted + '</strong>  for <u class="text-capitalize text-primary">'+ edt.former_name +'</u> was Changed by <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name +' '+ nt.Incharge.user.last_name +'</span>'
                  
        if nt.itmTr:
          msg_swa='Bidhaa zimepunguzwa stoku na kupelekwa <span class="text-primary text-capitalize">'+ receive.objects.get(transfer=nt.itmTr_map.id).Interprise.name +'</span>'
          msg_eng='Items sent to<span class="text-primary text-capitalize">'+ receive.objects.get(transfer=nt.itmTr_map.id).Interprise.name +'</span>' 
          
        if nt.itmRcv:
          msg_swa='Bidhaa zimeongezwa stoku kutoka <span class="text-primary text-capitalize">'+ receive.objects.get(pk=nt.itmRcv_map.id).transfer.Interprise.name +'</span>'
          msg_eng='Items added to stock from <span class="text-primary text-capitalize">'+ receive.objects.get(pk=nt.itmRcv_map.id).transfer.Interprise.name +'</span>' 
        
        if nt.puO:
          puo=mauzoni.objects.get(bill_kwa=nt.puO_map.id)
         
          deri_date = nt.date
          rec_date = nt.date
          tr_date = nt.date

          if puo.user_customer.tr:
            if puo.user_customer.tr.muda:
              deri_date = puo.user_customer.tr.muda
              tr_date = puo.user_customer.tr.muda
              
          if puo.bill_kwa.risiti:
            if puo.bill_kwa.risiti.date:
              rec_date = puo.bill_kwa.risiti.date
        
              

         
          
          if puo.Packed_at <= nt.date and nt.date <= deri_date:
              if puo.service:
                  msg_swa='Oda kwa Huduma no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> imeshaandaliwa'
                  msg_eng='Service Booking no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> has already Prepered' 
              else:
                  msg_swa='Oda ya manunuzi  no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> tayari imeshafungwa'
                  msg_eng='Purchase Order no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> has already Packed' 
 
          elif tr_date <= nt.date and nt.date <= rec_date and puo.user_customer.tr is not None:
              
              msg_swa='Mzigo wa Oda ya manunuzi  no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span>  umekabidhiwa kwa <span class="text-primary text-capitalize">' + puo.user_customer.tr.user.owner.user.first_name +' '+ puo.user_customer.tr.user.owner.user.last_name +'</span>'
              msg_eng='Purchase Order no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> Package has given to <span class="text-primary text-capitalize">' + puo.user_customer.tr.user.owner.user.first_name + ' '+ puo.user_customer.tr.user.owner.user.last_name +'</span>' 
          
          else:
              msg_swa='Mzigo wa Oda ya manunuzi  no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> umehakikiwa kupokelewa na <span class="text-primary text-capitalize">' + nt.Incharge.user.first_name + ' '+ nt.Incharge.user.last_name +'</span>'
              msg_eng='Purchase Order no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> Package has been receved by <span class="text-primary text-capitalize">' + nt.Incharge.user.first_name + ' '+ nt.Incharge.user.last_name +'</span>' 
          

        if nt.bilRtn :
            msg_swa='Bidhaa zimerudishwa kutoka bili no <span class="text-danger text-capitalize">'+ nt.bilRtn_map.bil.code +'</span> '
            msg_eng='Item return from bill no <span class="text-danger text-capitalize">'+ nt.bilRtn_map.bil.code +'</span> ' 
      
 
        if nt.saO :
            if nt.pickUp:
               msg_swa='Hakiki kupokea mzigo  <span class="text-danger text-capitalize">PACK-'+ nt.saO_map.user_customer.tr.code +'</span> '
               msg_eng='Confirm Package Receive <span class="text-danger text-capitalize">PACK-'+ nt.saO_map.user_customer.tr.code +'</span> ' 
            else:                   
              if nt.saO_map.service:
                msg_swa='Huduma kwa ankara  no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> imehakikiwa kukamilishwa na mteja'
                msg_eng='Service for Invoice no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> has confirmed to be complite by customer' 
                  
              else:
                  msg_swa='Mzigo wa oda no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> umepokelewa'
                  msg_eng='Package for order  no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> has received' 
                  

        if nt.saRtn :
            msg_swa='Bidhaa zimerudishwa kutoka ankara no <span class="text-danger text-capitalize">'+ nt.saRtn_map.ivo.code +'</span> '
            msg_eng='Item(s) return from order  no <span class="text-danger text-capitalize">'+ nt.saRtn_map.ivo.code +'</span> ' 
      
        notify.append({
          'note':nt.id,
          'date':nt.date,
          'msg_swa':msg_swa,
          'msg_eng':msg_eng,
          'itmTr':nt.itmTr,
          'itmRcv':nt.itmRcv,
          'ItemEdit':nt.ItemEdit,
          'bilRtn':nt.bilRtn,
          'ItemCatEdit':nt.ItemCatEdit,
          'saO':nt.saO,
          'saRtn':nt.saRtn,
          'puO':nt.puO,
         
        })

    todo.update({
      'notice':notify,
      'noting':page,
      'noticel':len(notify),
      'p_num':page_num,
      'pages':pg_number,
      'ed':ed,
      'ced':ced,
      'po':po,
      'so':so,
      'it':it,
      'ir':ir,
      'rt':rt,
      'rd':rd,
      'a':a,

      
    })

    return render(request,'notifications.html',todo)
  # except:
  #   return render(request,'pagenotFound.html',todo)

@login_required(login_url='login')
def searchAll(request):
  if request.method == "POST":

    try:
      todo = todoFunct(request)
      cheo = todo['cheo']
      shp = int(request.POST.get('duka',0))
      invo = int(request.POST.get('ankara',0))
      adj = int(request.POST.get('adj',0))
      usr = int(request.POST.get('partner',0))
      onshelf = int(request.POST.get('onshelf',0))
      code = int(request.POST.get('code',0))
      valu = request.POST.get('valued')
      shoppin = int(request.POST.get('shop',0))

      data = {
            'success':False,
            'url':'/'
      }


      if shp :
        shop = Interprise.objects.get(Intp_code__iexact=valu) 
        data = {
             'success':True,
             'url':'/buzinessProfile?value='+str(shop.id)
        }

      if invo :
        inv = mauzoni.objects.get(code__iexact=valu,Interprise=cheo.Interprise) 
        data = {
             'success':True,
             'url':'/mauzo/viewInvo?item_valued='+str(inv.id)
        }

      if adj :
        adjst = stokAdjustment.objects.get(code__iexact=valu,Interprise=cheo.Interprise) 
        data = {
             'success':True,
             'url':'/stoku/viewAdjst?item_valued='+str(adjst.id)
        }

      if usr :
        empl = Workers.objects.get(workerId__iexact=valu,Interprise=cheo.Interprise) 
        data = {
             'success':True,
             'url':'/EmployeeDetails?wrk='+str(empl.id)
        }

      if code and onshelf:
        itm = bidhaa_stoku.objects.filter(sirio__iexact=valu,Interprise=cheo.Interprise.id)
        thItem = itm.last()
        itm_url = '/stoku/bidhaapanel?f='+str(thItem.bidhaa.id)
        if thItem.bidhaa.material:
          itm_url = '/production/MaterialItems?f='+str(thItem.bidhaa.id)

        data = {
            'success':True,
            'url':itm_url
      }

      if code and not onshelf:
        itm = bidhaa_stoku.objects.filter(Q(inapacha=False)|Q(idadi__gt=0),Bei_kuuza__gt=0,showToVistors=True,sirio__iexact=valu,).exclude(Interprise=todo['duka'].id)
        url = '/ecommerce/searchpanel?bc='+str(valu)
        if shoppin:
           url = '/searchFromIntp?bc='+str(valu)+'&shop='+str(shoppin)
        thItem = itm.last()
        data = {
            'success':True,
            'url':url
      }      


      return JsonResponse(data)



    except:
        data = {
            'success':False,
            'url':''
      }
  
        return JsonResponse(data)

    
  else:
       return render(request,'pagenotFound.html',todoFunct(request))

      
@login_required(login_url='login')
def traceChange(request):
  if request.method == "POST":
    try:
      todo = todoFunct(request)
      duka = todo['duka']
      cheo = todo['cheo']      
      pent = todo['pent']
      useri = todo['useri']
      notify = []
      entId = duka
      # import os
      # print(os.getenv("COMPANY_TOKEN"))

      notice = Notifications.objects.filter(Q(admin_read=False,Interprise__owner__user=request.user.id)|Q(Incharge=todo['useri'].id,Incharge_reade=False)|Q(admin_read=False,AnyUser_read=False,Incharge_reade=False),Interprise__in=[entId,pent])
      chalst = chats.objects.filter(Q(to__to__owner=todo['useri'].id,admin_read=False)|Q(Anyuser_read=False),to__to__in=[duka.id,pent.id]).annotate(
         f_name=F('By__user__first_name'),
        #  imgBy=F('By__picha'),
        #  imgEntp=F('From__logo'),
         l_name=F('By__user__last_name'),
         kwa=F('to__to'),
         dukani=F('From__Interprise')).order_by('-pk')
    
      chat = [] 
      if chalst.exists():
           for cl in chalst:
              logo = ''
              imgBy = ''
              udio = ''
              if cl.By.picha:
                 imgBy = cl.By.picha.url
              if cl.From.logo:
                 logo =  cl.From.logo.url  

              if cl.audio:
                 udio  =  cl.audio.url

              chat.append({
                'id':cl.id,
                'f_name':cl.f_name,
                'imgBy':imgBy,
                'imgEntp':logo,
                'l_name':cl.l_name,
                'kwa':cl.kwa,
                'dukani':cl.dukani,
                'date':cl.date,
                'From_id':cl.From.id,
                'msg':cl.msg,
                'audio':udio,
                'admin_read':int(cl.admin_read),
                'Anyuser_read':int(cl.Anyuser_read),
                'to_id':cl.to.id

              })


      pickup = list(mauzoni.objects.filter(user_customer__tr__user__owner=useri.id,user_customer__tr__seen=False).annotate(From=F('Interprise__name'),To=F('user_customer__enteprise__name'),codi=F('user_customer__tr__code')).values('id','codi','From','To'))
      
      postVist = useri.user.date_joined
      if useri.vistedPosts is not None:
         postVist = useri.vistedPosts
      banners =   marketPlace.objects.filter(Q(wilaya=useri.mtaa.kata.wilaya.id)|Q(mkoa=useri.mtaa.kata.wilaya.mkoa.id)|Q(nchi=useri.mtaa.kata.wilaya.mkoa.kanda.nchi.id),Q(banner__gender=useri.gender)|Q(banner__gender=None),banner__visted__lt=F('banner__vistors'),banner__date__gt=postVist)


      if notice.exists():
        try:   
          for nt in notice:
            msg_swa=''
            msg_eng='' 
            
            if nt.ItemEdit:
              edt= nt.Item_map
              swa_edted = ''
              eng_edted = ''
              if edt.nameEdit and edt.categEdit:
                swa_edted = ' Jina na Aina'
                eng_edted = 'Name and Category'

              if edt.nameEdit and not edt.categEdit:
                swa_edted = 'Jina '
                eng_edted = 'Name '

              if not edt.nameEdit and  edt.categEdit:
                swa_edted = 'Aina '
                eng_edted = 'Category '


              msg_swa= 'Marekebisho ya <strong>'+ swa_edted + '</strong> kwa <u class="text-capitalize text-primary">'+ edt.former_name +'</u> yamefanyika na <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name + nt.Incharge.user.last_name +'</span>'
              msg_eng='<strong>'+ eng_edted + '</strong>  for <u class="text-capitalize text-primary">'+ edt.former_name +'</u> was Changed by <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name + nt.Incharge.user.last_name +'</span>'
              
            if nt.ItemCatEdit:
              edt= nt.ItemCat_map
              swa_edted = ''
              eng_edted = ''
              if edt.nameEdit and edt.group:
                swa_edted = 'Jina la Aina na Kundi'
                eng_edted = 'Category Name and Group'

              if edt.nameEdit and not edt.group:
                swa_edted = 'Jina la aina'
                eng_edted = 'Category Name '

              if not edt.nameEdit and  edt.group:
                swa_edted = 'Kundi '
                eng_edted = 'Group '


              msg_swa= 'Marekebisho ya <strong>'+ swa_edted + '</strong> kwa <u class="text-capitalize text-primary">'+ edt.former_name +'</u> yamefanyika na <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name +' '+ nt.Incharge.user.last_name +'</span>'
              msg_eng='<strong>'+ eng_edted + '</strong>  for <u class="text-capitalize text-primary">'+ edt.former_name +'</u> was Changed by <span class="text-capitalize text-primary">'+ nt.Incharge.user.first_name +' '+ nt.Incharge.user.last_name +'</span>'
              

            if nt.itmTr:
              msg_swa='Bidhaa zimepunguzwa stoku na kupelekwa <span class="text-primary text-capitalize">'+ receive.objects.get(transfer=nt.itmTr_map.id).Interprise.name +'</span>'
              msg_eng='Items sent to<span class="text-primary text-capitalize">'+ receive.objects.get(transfer=nt.itmTr_map.id).Interprise.name +'</span>' 
              


            if nt.itmRcv:
              msg_swa='Bidhaa zimeongezwa stoku kutoka <span class="text-primary text-capitalize">'+ receive.objects.get(pk=nt.itmRcv_map.id).transfer.Interprise.name +'</span>'
              msg_eng='Items added to stock from <span class="text-primary text-capitalize">'+ receive.objects.get(pk=nt.itmRcv_map.id).transfer.Interprise.name +'</span>' 
            
            if nt.puO:
              puo=mauzoni.objects.get(bill_kwa=nt.puO_map.id)
              deri_date = nt.date
              rec_date = nt.date

              
              
              if puo.user_customer.tr :
                if puo.user_customer.tr.muda:
                  deri_date = puo.user_customer.tr.muda
              if puo.bill_kwa.risiti:
                if puo.bill_kwa.risiti.date:
                  rec_date = puo.bill_kwa.risiti.date

              

              if puo.Packed_at <= nt.date and nt.date <= deri_date:
                  if puo.service:

                      msg_swa='Oda ya Huduma  no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> imeshaandaliwa'
                      msg_eng='Service Booking no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> has  Prepeared' 
                  else:
                      msg_swa='Oda ya manunuzi  no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> tayari imeshafungwa'
                      msg_eng='Purchase Order no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> has already Packed' 
                  
              elif deri_date <= nt.date and nt.date <= rec_date :
                  msg_swa='Mzigo wa Oda ya manunuzi  no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span>  umekabidhiwa kwa <span class="text-primary text-capitalize">' + puo.user_customer.tr.user.owner.user.first_name +' '+ puo.user_customer.tr.user.owner.user.last_name +'</span>'
                  msg_eng='Purchase Order no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> Package has given to <span class="text-primary text-capitalize">' + puo.user_customer.tr.user.owner.user.first_name + ' '+ puo.user_customer.tr.user.owner.user.last_name +'</span>' 
              
              else:
                  msg_swa='Mzigo wa Oda ya manunuzi  no <span class="text-danger text-capitalize">'+ puo.code +'</span> kutoka <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span>umehakikiwa na kupokelewa na <span class="text-primary text-capitalize">' + nt.Incharge.user.first_name + ' '+ nt.Incharge.user.last_name +'</span>'
                  msg_eng='Purchase Order no.<span class="text-danger text-capitalize">'+ puo.code +'</span> from <span class="text-primary text-capitalize">'+ puo.Interprise.name +'</span> Package has been received by <span class="text-primary text-capitalize">' + nt.Incharge.user.first_name + ' '+ nt.Incharge.user.last_name +'</span>' 
              

            if nt.bilRtn :
                msg_swa='Bidhaa zimerudishwa kutoka bili no <span class="text-danger text-capitalize">'+ nt.bilRtn_map.bil.code +'</span> '
                msg_eng='Item return from bill no <span class="text-danger text-capitalize">'+ nt.bilRtn_map.bil.code +'</span> ' 
          
    
            if nt.saO :
              if nt.pickUp:
                 msg_swa='Hakiki kupokea mzigo  <span class="text-danger text-capitalize">PACK-'+ nt.saO_map.user_customer.tr.code +'</span> '
                 msg_eng='Confirm Package Receive <span class="text-danger text-capitalize">PACK-'+ nt.saO_map.user_customer.tr.code +'</span> ' 
              else:   
                if nt.saO_map.service:
                  msg_swa='Huduma kwa ankara  no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> imehakikiwa kukamilishwa na mteja'
                  msg_eng='Service for Invoice no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> has confirmed to be complite by customer' 
                else:  
                  msg_swa='Mzigo wa oda no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> umepokelewa'
                  msg_eng='Package for order  no <span class="text-danger text-capitalize">'+ nt.saO_map.code +'</span> has received' 
                  

            if nt.saRtn :
                msg_swa='Bidhaa zimerudishwa kutoka ankara no <span class="text-danger text-capitalize">'+ nt.saRtn_map.ivo.code +'</span> '
                msg_eng='Item(s) return from order  no <span class="text-danger text-capitalize">'+ nt.saRtn_map.ivo.code +'</span> ' 
          

              

            notify.append({
              'note':nt.id,
              
              'msg_swa':msg_swa,
              'msg_eng':msg_eng,
              'itmTr':nt.itmTr,
              'itmRcv':nt.itmRcv,
              'bilRtn':nt.bilRtn,
              'saO':nt.saO,
              'saRtn':nt.saRtn,
              'puO':nt.puO,
              'pickUp':nt.pickUp,
              'ItemEdit':nt.ItemEdit,
              'ItemCatEdit':nt.ItemCatEdit,
            
            })

        except:
            notify=[] 
             
      
      data = {
        "notice":notify,
        "chat":chat,
        "owner":duka.owner == todo['useri'],
        "entp":duka.Interprise,
        'duka':duka.id,
        'pickup':pickup,
        'newPosts':len(banners)

      }


      if duka.Interprise:
        a=cheo.online
        b=datetime.datetime.now(tz=timezone.utc)
        
        # if (b-a).seconds > 30:
        #   upOnline = todo['useri'].user
        #   upOnline.last_login = datetime.datetime.now(tz=timezone.utc)
        #   upOnline.save()

        cheo.online=datetime.datetime.now(tz=timezone.utc)
        cheo.save()
      
        users = InterprisePermissions.objects.filter(Interprise=entId).exclude(user__user = request.user.id)
        staffonline='none'
        allAkauntisum=0

        if cheo.owner or cheo.akaunti:
          
          allAkauntisum = PaymentAkaunts.objects.filter(Interprise__owner = duka.owner.id).aggregate(Sum('Amount'))
          count=PaymentAkaunts.objects.filter(Interprise=entId).count()

        else:
            allAkauntisum = PaymentAkaunts.objects.filter(Interprise = entId, onesha = True).aggregate(Sum('Amount'))
            count=PaymentAkaunts.objects.filter(Interprise=entId,onesha=True).count()
          
        for each in users:
            if UserExtend.objects.get(pk=each.user.id).picha !='':
              staffonline+="picplaced"        
            if (datetime.datetime.now(tz=timezone.utc) - each.online).seconds < 10:   
              staffonline+='1' 
            # if InterprisePermissions.objects.get(user__user=request.user.id,default=True).owner==True or (InterprisePermissions.objects.get(user__user=request.user.id,default=True).fullcontrol and not each.owner):
            if each.Allow:
                staffonline+="allowed"  
  
        oda = mauzoni.objects.filter(Interprise=entId,online=True,order=True,packed=False,sioMuhimu=False,cart=False).count()
        adj = list(stockAdjst_confirm.objects.filter(userP=todo['cheo'].id,confirmed=False,dinied=False,userP__Allow=True).annotate(f_name=F('adjs__Na__user__user__first_name'),l_name=F('adjs__Na__user__user__last_name')).values())
        
        ratings = Interprise_Rating.objects.filter(Q(invo__By=cheo.id)|Q(Interprise__owner=cheo.user.id),Interprise=duka.id,seen=False).exists()

        data.update({
          "Count":count,
          "online":staffonline,
          "updated":True,
          "Asum":allAkauntisum,
          "allow":cheo.Allow,
          "order":oda,
          'adj':adj,
          'ratings':ratings,
          'entp':duka.Interprise
        })


        # url = "https://messaging-service.co.tz/api/sms/v1/text/single"

        # payload = json.dumps({
        #   "from": "N-SMS",
        #   "to": "255753202965",
        #   "text": "Your message",
        #   "reference": "aswqetgcv"
        # })
        # headers = {
        #   'Authorization': 'Basic bXVzYWo6TXVzYUBtZTEy',
        #   'Content-Type': 'application/json',
        #   'Accept': 'application/json'
        # }

        # response = requests.request("POST", url, headers=headers, data=payload)

        # print(response.text)
        
        # bidhaa.objects.filter(pk=22).delete()

    except:
      data = {
      "online":"error",
      "updated":False,
      "Asum":"Error"
    } 


    return JsonResponse(data)
  

  else:
       return render(request,'pagenotFound.html',todoFunct(request))


def countVistors(request):
  if request.method == "POST":

    try:
      todo = todoFunct(request)
      home=int(request.POST.get('home'))
      about=int(request.POST.get('about'))
      Gmap=int(request.POST.get('map'))
      reg=int(request.POST.get('reg'))
      item=int(request.POST.get('item'))
      brand=int(request.POST.get('brand'))
      categ=int(request.POST.get('categ'))
      group=int(request.POST.get('group'))
      shop = int(request.POST.get('shop'))
 

      shoped = Interprise.objects.get(pk=shop)

      # print({'home':home,'about':about ,'Gmap':Gmap ,'reg':reg,'item':item ,'brand':brand,'categ':categ,'group':group})

     

      x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
     
      if x_forwarded_for:
          ip = x_forwarded_for.split(',')
      else:
          ip = request.META.get('REMOTE_ADDR')

      # print(ip)  

      cheoId = 0
      cheo = todo['useri']
      if cheo is not None:
        cheoId = cheo.id
    
      vist = InterpriseVisotrs.objects.filter(Q(user=cheoId)|Q(ipaddres=ip,user=None),date=date.today(),Interprise=shop)
      if home:
        visted = vist.filter(homePage=True)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.homePage = 1
           visti.ipaddres = ip
           if cheo is not None:
             visti.user = cheo
           visti.save()   
        
      if about:
        visted = vist.filter(AboutPage=True)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.AboutPage = 1
           visti.ipaddres = ip
           if cheo is not None:
             visti.user = cheo

           visti.save() 
          
      if Gmap:
        visted = vist.filter(MapPage=True)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.MapPage = 1
           visti.ipaddres = ip           
           if cheo is not None:
             visti.user = cheo

           visti.save() 
          
      if reg:
        visted = vist.filter(RegPage=True)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.RegPage = 1
           visti.ipaddres = ip           
           if cheo is not None:
             visti.user = cheo

           visti.save() 
          
      if item>0:
        itm = bidhaa_stoku.objects.get(pk=item,Interprise=shop)

        visted = vist.filter(ItemPage=itm.id)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.ItemPage = itm
           visti.ipaddres = ip           
           if cheo is not None:
             visti.user = cheo

           visti.save() 
           itm.visted = itm.visted + 1
           itm.save()
          
      if brand>0:
        brnd = makampuni.objects.get(pk=brand,Interprise=shop)

        visted = vist.filter(BrandPage=brnd.id)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.BrandPage = brnd
           visti.ipaddres = ip           
           if cheo is not None:
             visti.user = cheo

           visti.save() 
          
      if categ>0:
        categr = bidhaa_aina.objects.get(pk=categ,Interprise=shop)
        visted = vist.filter(CategoryPage=categr.id)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.CategoryPage = categr
           visti.ipaddres = ip              
           if cheo is not None:
             visti.user = cheo
           visti.save() 
          
      if group>0:
        groupr = mahitaji.objects.get(pk=group,Interprise=shop)
        visted = vist.filter(GroupPage=groupr.id)
        if visted.exists():
          visted.update(visted=(F('visted')+1))
        else:
           visti =  InterpriseVisotrs()
           visti.Interprise = shoped
           visti.date = date.today()
           visti.visted = 1
           visti.ipaddres = ip           
           visti.GroupPage = groupr
           if cheo is not None:
             visti.user = cheo
           visti.save() 
          
      data = {
        'success':True
      }   

      return JsonResponse(data) 

    except:
      data={
        'success':False
      }  

      return JsonResponse(data)
  else:
      return render(request,'pagenotFound.html',todoFunct(request))


# SET DARKMODE........................................//
@login_required(login_url='login')
def setDarkMode(request):
  if request.method == "POST":
    try:
      val = int(request.POST.get('val',0))
      todo = todoFunct(request)
      useri = todo['useri']
      useri.darkmode = val
      useri.save()
      data = {
        'success':True
      }
      return JsonResponse(data)
    except:
      data = {
        'success':False
      }

      return JsonResponse(data)
  

  



            


   
    
    

