from management.models import Notifications,ainaMama,ainaBibi, UserExtend,Zones,Nchi,EmployeeAttachments,Kanda,Workers,sales_color,sales_size,AnswerTo,stockAdjst_confirm,question_to,chatTo,chats,Interprise,deliveryAgents,bei_za_bidhaa, color_produ,mauzoList,order_from,bidhaa_sifa, key_sifa,produ_colored,produ_size,picha_bidhaa,bidhaa_stoku,picha_bidhaa,bidhaa_aina, receive,user_Interprise,HudumaNyingine,Huduma_za_kifedha,businessReg,manunuzi,Interprise_contacts,InterprisePermissions,PaymentAkaunts, mauzoni,staff_akaunt_permissions, wasambazaji
from django.utils import timezone
from django.db.models import Q,F
from datetime import date



# FOr mails
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import requests, json

class Todos:
  def __init__(self,request):
      self.request = request 
      

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
        'ukomo':ukomo
        }




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
            'puO':None       
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