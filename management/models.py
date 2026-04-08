from ipaddress import ip_address
from re import I
from django.db import models

# Create your models here.

from django.db import models


from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.utils import timezone
from django.utils import timezone
import time  
import pytz
import datetime



class Nchi(models.Model):
    name = models.CharField(max_length=80)
    code = models.IntegerField()
    currencii = models.CharField(max_length=10)

class Kanda(models.Model):
    kanda = models.CharField(max_length=70)
    mikoa = models.CharField(max_length=80)
    wiaya = models.CharField(max_length=80)


    def __str__(self):
        return self.wiaya

class Zones(models.Model):
    kanda = models.CharField(max_length=70)
    nchi = models.ForeignKey(Nchi,null=True,blank=True,on_delete=models.SET_NULL)

class Mikoa(models.Model):
    mkoa = models.CharField(max_length=80)
    kanda = models.ForeignKey(Zones,null=True,blank=True,on_delete=models.CASCADE)

class Wilaya(models.Model):
    wilaya = models.CharField(max_length=80)
    mkoa = models.ForeignKey(Mikoa,null=True,blank=True,on_delete=models.CASCADE)

class Kata(models.Model):
    kata = models.CharField(max_length=80)
    wilaya = models.ForeignKey(Wilaya,null=True,blank=True,on_delete=models.CASCADE)

class Mitaa(models.Model):
    mtaa = models.CharField(max_length=80)
    kata = models.ForeignKey(Kata,null=True,blank=True,on_delete=models.CASCADE)



class UserExtend(models.Model):
    user= models.OneToOneField(User,on_delete=models.CASCADE)
    picha = models.ImageField(upload_to="pics",null=True, blank=True) 
    regstatue = models.IntegerField()
    simu1 = models.CharField(max_length=15,blank=True,null=True)
    showNum1 = models.BooleanField(default=True)
    simu2 = models.CharField(max_length=15)
    langSet = models.IntegerField(default=1)
    pro = models.BooleanField(default=False)

    gender = models.IntegerField(null=True,blank=True)

    ImSuper = models.BooleanField(default=False)
    ImModelate = models.BooleanField(default=False)
    
    company = models.BooleanField(default=False)
    brand = models.TextField(blank=True,null=True)
    mtaa = models.ForeignKey(Mitaa,null=True,blank=True,on_delete=models.SET_NULL)
    business = models.IntegerField(default=0)

    vistedPosts = models.DateTimeField(blank=True,null=True)
    pwdResets = models.BooleanField(default=False)
    darkmode = models.BooleanField(default=False)
    



class Activator(models.Model):
    activata = models.ForeignKey(UserExtend,on_delete = models.CASCADE,null=True,blank=True)    
    lastpaid = models.DateField(null=True,blank=True)   

class Activated(models.Model):
    activatd = models.ForeignKey(UserExtend,on_delete = models.CASCADE,null=True,blank=True)    
    activata = models.ForeignKey(Activator,on_delete = models.CASCADE,null=True,blank=True)    
    date = models.DateField()    

class PhoneMailConfirm(models.Model):
    PhoneMail = models.CharField(max_length=100)
    confirm = models.BooleanField(default=False)
    code = models.IntegerField()
    duration = models.DateTimeField()

    # def __str__(self):
    #    return self.user.username

class Interprise(models.Model):
    name = models.CharField(max_length=200)
    # int_type = models.CharField(max_length=100)
    slogan = models.TextField(null=True,blank=True)
    owner = models.ForeignKey(UserExtend,on_delete = models.CASCADE,null=True,blank=True)
 
    mtaa = models.ForeignKey(Mitaa,null=True,blank=True,on_delete=models.SET_NULL)
    
    jengo = models.CharField(max_length=200,blank=True)
    long =  models.DecimalField(max_digits=20,decimal_places=10,null=True)
    lat =  models.DecimalField(max_digits=20,decimal_places=10,null=True)


    prof_pic = models.ImageField(null=True, blank=True)
    Interprise = models.BooleanField()
    # Store = models.BooleanField()
    # Personal = models.BooleanField()
    publish = models.BooleanField(default=False)
    countryCode = models.IntegerField(default=222)

    # country = models.CharField(max_length=100)

    Intp_code = models.CharField(max_length=90)

    currencii = models.CharField(max_length=14)
    vatper =  models.DecimalField(default=0,max_digits=10,decimal_places=3)
    vat_allow = models.BooleanField(default=False)
    prof_pic = models.ImageField(upload_to="pics",null=True,blank=True)
    logo = models.ImageField(upload_to="pics",null=True,blank=True)
    invo_logo = models.BooleanField(default=False)

    audio = models.FileField(upload_to="audio",null=True,blank=True)
    poster = models.TextField(blank=True)
    desc = models.TextField(blank=True)
    desc_Pro_To = models.DateField(null=True,blank=True)

    active_poster = models.BooleanField(default=False)

    service =  models.BooleanField(default=True)
    produxn =  models.BooleanField(default=True)
    sales =  models.BooleanField(default=True)
    officeNo = models.CharField(max_length=200,blank=True)
    # tin_pic = models.ImageField(upload_to="pics",null=True,blank=True)

    onlineCustomers = models.IntegerField(default=0)
    Balance = models.DecimalField(default=0,max_digits=10,decimal_places=2)

    # USAGE PLAN ..................................//
    usage = models.IntegerField(default=0)
    marketing = models.IntegerField(default=0)
    bill_tobePaid = models.DateField(null=True,blank=True)

    created = models.DateField(null=True,blank=True)

    def __str__(self):
        return self.name

class DescImages(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE,null=True,blank=True)
    size = models.IntegerField(default=0)
    image = models.ImageField(upload_to="sharedFolder",null=True,blank=True)
    attach = models.FileField(upload_to="sharedFolder",null=True,blank=True)
        
        
class KulipaPI(models.Model):
    code = models.CharField(max_length=20)
    Interprise = models.ForeignKey(Interprise,on_delete=models.SET_NULL,null=True,blank=True)
    amount = models.IntegerField()

class businessReg(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    reg_name =  models.CharField(max_length=90)
    reg_no =  models.CharField(max_length=50)
    reg_pic = models.ImageField(upload_to="pics",null=True,blank=True)
    show_to_invo = models.BooleanField(default=False)

class Anatumia(models.Model):
    where = models.ForeignKey(Interprise,on_delete=models.SET_NULL,null=True,blank=True)
    
class Workers(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete = models.CASCADE,null=True)
    jina = models.CharField(max_length=500)
    workerId = models.CharField(max_length=20,blank=True)
    address = models.CharField(max_length=500)
    code = models.CharField(max_length=6)
    simu1 = models.CharField(max_length=15)
    simu2 = models.CharField(max_length=15,null=True, blank=True)
    # email = models.EmailField(max_length=100,null=True, blank=True)
    kazi = models.TextField()
    active = models.BooleanField(default=False)
    diactive = models.ForeignKey(Anatumia,on_delete=models.SET_NULL,null=True,blank=True)
    # mteja =  models.OneToOneField(wateja_active,on_delete=models.SET_NULL,null=True,blank=True)
    picha = models.ImageField(upload_to="attachments",null=True,blank=True)


class EmployeeAttachments(models.Model):
    employee = models.ForeignKey(Workers, on_delete=models.CASCADE)
    fileAttach = models.FileField(upload_to="attachments",null=True,blank=True)
    desc = models.TextField()

class user_Interprise(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)

class InterprisePermissions(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    user = models.ForeignKey(UserExtend, on_delete=models.CASCADE)
    user_entp=models.ForeignKey(user_Interprise, on_delete=models.CASCADE,blank=True,null=True)
    owner = models.BooleanField()

    Allow = models.BooleanField()
    discount = models.BooleanField()
    addsupplier=models.BooleanField()
    addproduct=models.BooleanField()
    # addparentCat=models.BooleanField()
    # addaina=models.BooleanField()
    # addKampuni=models.BooleanField()

    profile = models.BooleanField()
    
    logo = models.BooleanField(default=True)
    prof_picture = models.BooleanField(default=True)
    prof_sound = models.BooleanField(default=True)

    picDescription = models.BooleanField(default=False)
    stokAdjs = models.BooleanField(default=False)
    hamisha = models.BooleanField(default=False)
    prodxn = models.BooleanField(default=False)

    codeChange = models.BooleanField(default=False)
    ProfitView = models.BooleanField(default=False)
    default = models.BooleanField(default=False)
    product_edit = models.BooleanField(default=True)

    manunuziOda = models.BooleanField(default=False)
    expenses = models.BooleanField(default=False)

    manunuziii = models.BooleanField(default=False)
    manunuzit = models.BooleanField(default=False)
    kununua = models.BooleanField(default=False)
    kununub = models.BooleanField(default=False)
    kununuab = models.BooleanField(default=False)
    ununue = models.BooleanField(default=False)

    cheo = models.CharField(max_length=100)
    online = models.DateTimeField(auto_now_add=True, blank=True)
    admin = models.IntegerField()

    akaunti =models.BooleanField(default=False)
    viewi = models.BooleanField(default=False)
    miamala_siri_show = models.BooleanField(default=False)
    miamala_Rekodi = models.BooleanField(default=False)  

    msaidizi = models.BooleanField(default=False)
    fullcontrol = models.BooleanField(default=False)

    onesha_profile = models.BooleanField(default=False)
    mauzo_na_matumizi = models.BooleanField(default=False)

    showUser_to_profile=models.BooleanField(default=False)
    showAdmin_to_profile=models.BooleanField(default=True)
    SIM1_invoince = models.BooleanField(default=False)
    SIM2_invoince = models.BooleanField(default=False)

    mnRecipt = models.BooleanField(default=False)
    receiptSet = models.BooleanField(default=False)

    # if is employee
    fanyakazi = models.ForeignKey(Workers, on_delete=models.CASCADE,blank=True,null=True) 


    def __str__(self):
        return self.Allow
 
class Interprise_contacts(models.Model):
    Interprise=models.ForeignKey(Interprise,on_delete=models.CASCADE)
    phone = models.IntegerField()
    show = models.BooleanField(default=False)
    cheo = models.CharField(max_length=90)
    Admin = models.BooleanField()
    user = models.ForeignKey(User,on_delete = models.CASCADE)
    # owner = models.IntegerField()
    show_to_invo = models.BooleanField(default=True)

class PaymentAkaunts(models.Model):
      Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
      Akaunt_name = models.CharField(max_length=500)
      Amount = models.DecimalField(max_digits=20,decimal_places=2)
      onesha = models.BooleanField(default=True)
    #   owner = models.ForeignKey(User,on_delete=models.CASCADE)
      addedDate = models.DateTimeField(null=True,blank=True)
      aina = models.CharField(max_length = 300)

class makampuni(models.Model):
     Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
     kampuni_jina = models.CharField(max_length=100)
     audio = models.FileField(upload_to="ItemsAudio",null=True,blank=True)    
     Asize = models.DecimalField(max_digits=10,decimal_places=3,default=0)

class ainaBibi(models.Model):
    name = models.CharField(max_length = 100)
    jina = models.CharField(max_length = 100)

class ainaMama(models.Model):
    name = models.CharField(max_length = 100)
    jina = models.CharField(max_length = 100)
    aina = models.ForeignKey(ainaBibi,on_delete=models.CASCADE)

class mahitaji(models.Model):
     Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
     mahitaji = models.CharField(max_length = 100)
     audio = models.FileField(upload_to="ItemsAudio",null=True,blank=True)
     Asize = models.DecimalField(max_digits=10,decimal_places=3,default=0)
     aina = models.ForeignKey(ainaMama,on_delete=models.SET_NULL,null=True,blank=True)

class bidhaa_aina(models.Model):
     Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
     aina = models.CharField(max_length=100)
     mahi = models.ForeignKey(mahitaji,on_delete=models.CASCADE)
     audio = models.FileField(upload_to="ItemsAudio",null=True,blank=True)
     Asize = models.DecimalField(max_digits=10,decimal_places=3,default=0)

class wasambazaji(models.Model):
      owner = models.ForeignKey(User,on_delete = models.CASCADE)
      jina = models.CharField(max_length=500)
      address = models.CharField(max_length=500)
      code = models.CharField(max_length=6)
      simu1 = models.CharField(max_length=15)
      simu2 = models.CharField(max_length=15,null=True, blank=True)
      email = models.EmailField(max_length=100,null=True, blank=True)
      active = models.BooleanField(default=False)
      where = models.ForeignKey(Interprise,on_delete=models.SET_NULL,null=True,blank=True)

class wateja_active(models.Model): 
    user = models.ForeignKey(Interprise,on_delete=models.SET_NULL,null=True,blank=True)

class wateja(models.Model):
    # owner = models.ForeignKey(User,on_delete = models.CASCADE)
    Interprise = models.ForeignKey(Interprise,on_delete = models.CASCADE,null=True,blank=True)
    jina = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    code = models.CharField(max_length=6)
    simu1 = models.CharField(max_length=15)
    simu2 = models.CharField(max_length=15,null=True, blank=True)
    email = models.EmailField(max_length=100,null=True, blank=True)
    active = models.BooleanField(default=False)
    # where = models.ForeignKey(Interprise,on_delete=models.SET_NULL,null=True,blank=True)
    mteja =  models.OneToOneField(wateja_active,on_delete=models.SET_NULL,null=True,blank=True)

class Huduma_za_kifedha(models.Model):
    # Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    huduma=models.CharField(max_length=90)

class HudumaNyingine(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    huduma=models.CharField(max_length=200)
    kifedhaHuduma= models.ForeignKey(Huduma_za_kifedha,on_delete=models.CASCADE,null=True)
    yakifedha= models.BooleanField(default=False)        

class bidhaa(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    bidhaa_jina = models.CharField(max_length=300)
    kampuni = models.ForeignKey(makampuni,on_delete=models.CASCADE)
    bidhaa_aina = models.ForeignKey(bidhaa_aina,on_delete=models.CASCADE)
    idadi_jum = models.DecimalField(max_digits=10,decimal_places=3,default=1)
    vipimo = models.CharField(max_length=100)
    vipimo_jum = models.CharField(max_length=100)
    # mwisho_pungu = models.IntegerField(default=0)
    Mahi = models.ForeignKey(mahitaji,on_delete=models.CASCADE)
    change_date = models.DateTimeField()
    maelezo = models.TextField(default="none")
    saletaxInluded = models.BooleanField(default=False)
    purchtaxInluded = models.BooleanField(default=False)
    material = models.BooleanField(default=False)
    fractions = models.BooleanField(default=False)
    namba= models.CharField(max_length=20,blank=True)

    audio = models.FileField(upload_to="ItemsAudio",null=True,blank=True)
    Asize = models.DecimalField(max_digits=10,decimal_places=3,default=0)

    colorAttr = models.CharField(max_length=100,blank=True,null=True)
    
    class Meta:
       verbose_name_plural = "bidhaa"

class Risiti(models.Model):
      Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE,null=True)
      code = models.CharField(max_length=17) 
      code_num = models.IntegerField()
      date =  models.DateTimeField(null=True)

class manunuzi(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
    code = models.CharField(max_length=17)  
    akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.CASCADE,null=True)
    amount = models.DecimalField(max_digits=10,decimal_places=3)
    ilolipwa = models.DecimalField(default=0,max_digits=10,decimal_places=3)
    supplier_id = models.ForeignKey(wasambazaji,on_delete=models.SET_NULL,null=True) 
    date =  models.DateField(null=True,blank=True)
    kulipa = models.DateField()
    tarehe = models.DateTimeField()
    full_paid = models.BooleanField(default=False)
    bill_no = models.IntegerField()
    order = models.BooleanField(default=False)
    
    nunua = models.BooleanField(default=False)
    full_returned = models.BooleanField(default=False)
    matumizi = models.BooleanField(default=True)
    By  = models.ForeignKey(InterprisePermissions,on_delete=models.SET_NULL,null=True) 
    risiti = models.ForeignKey(Risiti,on_delete=models.SET_NULL,null=True) 
    
    mark = models.BooleanField(default=False)
    markTitle = models.TextField(null=True,blank=True)
    markDesc = models.TextField(null=True,blank=True)

class manunuziList(models.Model):
    manunuzi=  models.ForeignKey(manunuzi,on_delete=models.CASCADE)  
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    before = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    vat_included = models.BooleanField(default=False)
    vat_set = models.BooleanField(default=False)
    jum = models.BooleanField(default=True)
    rudi = models.DecimalField(max_digits=10,decimal_places=3,default=0)

# Transfer item from:
class transfer(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
    code = models.CharField(max_length=17)
    order =  models.BooleanField(default=False)  
    bill_no = models.IntegerField()
    tarehe = models.DateTimeField()
    date = models.DateField(blank=True,null=True)
    By = models.ForeignKey(InterprisePermissions,on_delete=models.CASCADE,null=True,blank=True)

# Destination for transfer..........................//
class receive(models.Model):
    # destination interprise
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
    reasons = models.TextField(blank=True,null=True)
    transfer = models.OneToOneField(transfer,on_delete=models.CASCADE,null=True,blank=True)
    # thamani = models.DecimalField(max_digits=10,decimal_places=3)
    By = models.ForeignKey(InterprisePermissions,on_delete=models.CASCADE,null=True,blank=True)
    mark =   models.BooleanField(default=False) 
    markDesc = models.TextField(null=True,blank=True)

class receiveList(models.Model):
    receive = models.ForeignKey(receive,on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    uwiano = models.DecimalField(max_digits=10,decimal_places=3)
    before = models.DecimalField(max_digits=10,decimal_places=3,default=0)

class production(models.Model):
    Interprise = models.ForeignKey(Interprise, on_delete=models.CASCADE)
    date = models.DateTimeField()
    Recodeddate =  models.DateTimeField(null=True)
    endDate =  models.DateTimeField(null=True)
    code = models.CharField(max_length=20)
    code_num = models.IntegerField()
    Na = models.ForeignKey(InterprisePermissions, on_delete=models.SET_NULL,null=True,blank=True)
    desc =  models.TextField(blank=True,null=True)    
    complete =  models.BooleanField(default=False)  

class productionConfirm(models.Model):
    prodxn = models.ForeignKey(production, on_delete=models.CASCADE)     
    user = models.ForeignKey(InterprisePermissions, on_delete=models.CASCADE)     
    comfirm =  models.BooleanField(default=False)    
    desc =  models.TextField(blank=True,null=True)  
    date = models.DateTimeField(null=True)

class productionListDate(models.Model):
    production = models.ForeignKey(production, on_delete=models.CASCADE) 
    date = models.DateTimeField()
    Na = models.ForeignKey(InterprisePermissions, on_delete=models.SET_NULL,null=True,blank=True)
    mark =   models.BooleanField(default=False) 
    markDesc = models.TextField(null=True,blank=True)
    code = models.CharField(max_length=20,null=True)
    code_num = models.IntegerField(null=True,blank=True)

class productionList(models.Model):
    production = models.ForeignKey(productionListDate, on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    expqty = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    before = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    notsure = models.BooleanField(default=False)
     
class productionWorkersDate(models.Model):
    production = models.ForeignKey(production, on_delete=models.CASCADE) 
    date = models.DateTimeField()
    Na = models.ForeignKey(InterprisePermissions, on_delete=models.SET_NULL,null=True,blank=True)

class productionWorkers(models.Model):
    worker = models.ForeignKey(Workers, on_delete=models.SET_NULL,null=True)
    date = models.ForeignKey(productionWorkersDate, on_delete=models.CASCADE,null=True)
    task = models.TextField(blank=True,null=True)
    comfirmed = models.BooleanField(default=False)
    date_comfim =  models.DateTimeField(null=True)
    
class stokAdjustment(models.Model):
    Interprise = models.ForeignKey(Interprise, on_delete=models.CASCADE)
    date = models.DateTimeField()
    Recodeddate =  models.DateField(null=True)

    code = models.CharField(max_length=20)
    code_num = models.IntegerField()

    Na = models.ForeignKey(InterprisePermissions, on_delete=models.SET_NULL,null=True,blank=True)
    desc =  models.TextField(blank=True,null=True)

    production = models.ForeignKey(production, on_delete=models.SET_NULL,null=True,blank=True)
    haribika = models.BooleanField(default=False)
    expire = models.BooleanField(default=False)
    tumika = models.BooleanField(default=False)
    potea = models.BooleanField(default=False)
    Ongezwa = models.BooleanField(default=False)
    registered = models.BooleanField(default=False)  
    op = models.BooleanField(default=False)  
    others = models.BooleanField(default=False)  
    full_Return = models.BooleanField(default=False)
    mark =   models.BooleanField(default=False) 
    markDesc = models.TextField(null=True,blank=True)

class stockAdjst_confirm(models.Model):
    userP = models.ForeignKey(InterprisePermissions,on_delete=models.CASCADE,null=True,blank=True)
    adjs = models.ForeignKey(stokAdjustment,on_delete=models.CASCADE,null=True,blank=True)
    confirmed = models.BooleanField(default=False)
    dinied = models.BooleanField(default=False)
    desc = models.TextField(blank=True,default='')
    tarehe = models.DateTimeField(null=True,blank=True)
    Return = models.BooleanField(default=False)  

class bidhaa_stoku(models.Model):
    bidhaa=models.ForeignKey(bidhaa,on_delete=models.CASCADE)
    Interprise=models.ForeignKey(Interprise,on_delete=models.CASCADE)
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    zibaki = models.IntegerField(default=0)
    msambaji = models.ForeignKey(wasambazaji,on_delete=models.CASCADE,null=True,blank=True)
    Bei_kununua = models.DecimalField(max_digits=20,decimal_places=5,default=0)
    Bei_kuuza = models.DecimalField(max_digits=15,decimal_places=4)
    Bei_kuuza_jum = models.DecimalField(max_digits=10,decimal_places=3)
    tanguliziwa = models.IntegerField(default=0)
    expire_date = models.DateField(null=True, blank=True)
    op_name = models.ForeignKey(UserExtend,on_delete=models.SET_NULL,null=True,blank=True)
    sirio = models.CharField(max_length=100,default="none")
    addedfrom = models.IntegerField(default=0)
    inapacha = models.BooleanField(default=False)
    manunuzi = models.ForeignKey(manunuziList,on_delete=models.CASCADE,null=True,blank=True)
    uhamisho = models.OneToOneField(receiveList,on_delete=models.CASCADE,null=True,blank=True)
    # from_add = models.BooleanField(default=False)
    ongezwa = models.ForeignKey(stokAdjustment,on_delete=models.CASCADE,null=True,blank=True)
    produced = models.ForeignKey(productionList,on_delete=models.CASCADE,null=True,blank=True)
    service =  models.BooleanField(default=False)
    timely = models.IntegerField(default=0)

    visted = models.IntegerField(default=0)
    showToVistors = models.BooleanField(default=True)

class transferList(models.Model):
    kwenda = models.OneToOneField(receiveList,on_delete=models.CASCADE)
    qty_before = models.DecimalField(max_digits=10,decimal_places=3)
    toka = models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)

class received_confirm(models.Model):
    user = models.ForeignKey(UserExtend,on_delete=models.CASCADE,null=True,blank=True)
    receive = models.ForeignKey(receive,on_delete=models.CASCADE,null=True,blank=True)
    confirmed = models.BooleanField(default=False)
    tarehe = models.DateTimeField(null=True,blank=True)

class bil_return(models.Model):
    code = models.CharField(max_length=17)  
    # akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.SET_NULL,null=True)
    amount = models.DecimalField(max_digits=20,decimal_places=2)
    ilolipwa = models.DecimalField(max_digits=20,decimal_places=2,default=0)
    tarehe = models.DateTimeField()
    full_paid = models.BooleanField(default=False)
    bill_no = models.IntegerField()
    date =  models.DateField(null=True,blank=True)

    kulipa = models.DateField()
    bil = models.ForeignKey(manunuzi,on_delete=models.SET_NULL,null=True)
    # Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
    maelezo = models.TextField(blank=True)
    By = models.ForeignKey(InterprisePermissions,on_delete=models.SET_NULL,null=True,blank=True)

class pu_ret(models.Model):
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    ret =  models.ForeignKey(bil_return,on_delete=models.CASCADE)
    pu_list = models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE,null=True)

class  deliveryAgents(models.Model):
    agent = models.ForeignKey(Workers,on_delete=models.CASCADE,null=True) 
    Interprise= models.ForeignKey(Interprise,on_delete=models.CASCADE,null=True) 
  
class  deliveryBy(models.Model):
    user = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
    code = models.CharField(max_length=20,null=True)
    Invo_no = models.IntegerField(default=0)
    open_package = models.BooleanField(default=False)
    received_pack = models.BooleanField(default=False)
    confirm_receive = models.BooleanField(default=False)

    fromOrdered = models.BooleanField(default=True)

    aliyekabidhi = models.ForeignKey(InterprisePermissions,on_delete=models.SET_NULL,null=True) 
    aliyekabidhiwa = models.BooleanField(default=False)
    
    amehakiki = models.BooleanField(default=False)
    seen = models.BooleanField(default=False)
    muda = models.DateTimeField(null=True)
    agent = models.ForeignKey(deliveryAgents,on_delete=models.SET_NULL,null=True) 

class user_customers(models.Model):
      enteprise = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
      by = models.ForeignKey(UserExtend,on_delete=models.SET_NULL,null=True) 
      tr = models.ForeignKey(deliveryBy,on_delete=models.SET_NULL,null=True) 
      amekabidhiwa = models.BooleanField(default=False)
      

      long =  models.DecimalField(max_digits=20,decimal_places=10,null=True)
      lat =  models.DecimalField(max_digits=20,decimal_places=10,null=True)
      jengo = models.TextField(blank=True)

class invoice_desk(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    desc = models.TextField()
    date = models.DateTimeField()

class customer_area(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    name = models.TextField()

class customer_in_cell(models.Model):
    area = models.ForeignKey(customer_area,on_delete=models.CASCADE)
    name = models.TextField()
    


class mauzoni(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
    invo_desc = models.ForeignKey(invoice_desk,on_delete=models.SET_NULL,null=True,blank=True) 
    code = models.CharField(max_length=17)  
    akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.SET_NULL,null=True)
    amount = models.DecimalField(max_digits=20,decimal_places=4)
    ilolipwa = models.DecimalField(max_digits=20,decimal_places=4,default=0)

    date =  models.DateField(null=True,blank=True)
    kulipa = models.DateField()
    tarehe = models.DateTimeField()
    full_paid = models.BooleanField(default=False)
    Invo_no = models.IntegerField()

    saved_custom = models.BooleanField(default=False)
    mteja_jina = models.CharField(max_length=100,null=True,blank=True)
    simu = models.CharField(max_length=17,null=True,blank=True) 
    address = models.CharField(max_length=100,null=True,blank=True) 
    mail = models.CharField(max_length=100,null=True,blank=True) 

    customer_id = models.ForeignKey(wateja,on_delete=models.SET_NULL,null=True) 
    user_customer = models.ForeignKey(user_customers,on_delete=models.SET_NULL,null=True) 
    customer_in =  models.ForeignKey(customer_in_cell,on_delete=models.SET_NULL,null=True,blank=True)
     
    
    # if is given to coworker
    labour = models.ForeignKey(Workers,on_delete=models.SET_NULL,null=True) 

    # RETURN ........................//
    confirmed = models.BooleanField(default=False)
    returned = models.BooleanField(default=False)
    full_returned = models.BooleanField(default=False)
     

    # Incase the invoice is online..................//
    confirm_return = models.BooleanField(default=False)
    request_return = models.BooleanField(default=False)


    # Incase its order
    order = models.BooleanField(default=False)
    online = models.BooleanField(default=False)
    packed= models.BooleanField(default=False)
    Packed_at = models.DateTimeField(null=True,blank=True)

    # Incase is service.................................//
    service= models.BooleanField(default=False)
    servFrom= models.DateTimeField(null=True,blank=True)
    servTo= models.DateTimeField(null=True,blank=True)
    desc= models.TextField(null=True,blank=True)

    # Service Changed    
    change = models.BooleanField(default=False) 
    Changed= models.DateTimeField(null=True,blank=True)
    ignore = models.BooleanField(default=False) 


    derivered= models.BooleanField(default=False)
    cart = models.BooleanField(default=False)
    expected_date = models.DateTimeField(null=True,blank=True)
    bill_kwa = models.ForeignKey(manunuzi,on_delete=models.CASCADE,null=True,blank=True)
    receved = models.BooleanField(default=False)

    # For service confirm if receved ...........................//
    confirmRec = models.BooleanField(default=False)

    sioMuhimu = models.BooleanField(default=False)
    By = models.ForeignKey(InterprisePermissions,on_delete=models.SET_NULL,null=True,blank=True)

class ForPrintingPupose(models.Model):
    user = models.ForeignKey(UserExtend,on_delete=models.CASCADE)
    mauzo = models.ForeignKey(mauzoni,on_delete=models.CASCADE,null=True)
    duka = models.ForeignKey(Interprise,on_delete=models.CASCADE,null=True)
    expire = models.DateTimeField()
    ipaddre = models.CharField(max_length=100) 

class Interprise_Rating(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    rating = models.IntegerField(default=0)
    desc = models.TextField(blank=True,null=True)
    reply = models.TextField(blank=True,null=True)
    by = models.ForeignKey(UserExtend,on_delete=models.SET_NULL,null=True)
    invo = models.ForeignKey(mauzoni,on_delete=models.SET_NULL,null=True)
    date = models.DateTimeField(null=True)
    seen = models.BooleanField(default=False)
    repDate = models.DateTimeField(null=True)
    
class SavedRiport(models.Model):
    By = models.ForeignKey(InterprisePermissions,on_delete=models.CASCADE)
    From = models.DateTimeField()
    to = models.DateTimeField()
    title = models.TextField()
    desc = models.TextField(null=True,blank=True)
    sales = models.BooleanField(default=False)
    SReturn = models.BooleanField(default=False)
    serviceIncome = models.BooleanField(default=False)

class remainedFromOda(models.Model):
    from_oda = models.ForeignKey(mauzoni,on_delete=models.CASCADE)
    to_bil = models.ForeignKey(manunuzi,on_delete=models.CASCADE)

class ChangedServiceTo(models.Model):
    To = models.ForeignKey(mauzoni,on_delete=models.CASCADE)

class ChangedServiceFrom(models.Model):
    From = models.ForeignKey(mauzoni,on_delete=models.CASCADE)

class ChangedService(models.Model):
    from_serv = models.ForeignKey(mauzoni,on_delete=models.CASCADE)
    to_serv = models.ForeignKey(ChangedServiceTo,on_delete=models.CASCADE,null=True,blank=True)
    From = models.ForeignKey(ChangedServiceFrom,on_delete=models.CASCADE,null=True,blank=True)
    
class sale_return(models.Model):
    code = models.CharField(max_length=17)  
    akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.SET_NULL,null=True)
    amount = models.DecimalField(max_digits=20,decimal_places=2)
    ilolipwa = models.DecimalField(max_digits=20,decimal_places=2,default=0)
    tarehe = models.DateTimeField()
    full_paid = models.BooleanField(default=False)
    Invo_no = models.IntegerField()
    date =  models.DateField(null=True,blank=True)

    kulipa = models.DateField()
    ivo = models.ForeignKey(mauzoni,on_delete=models.SET_NULL,null=True)

    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE) 
    maelezo = models.TextField(blank=True)
    By = models.ForeignKey(InterprisePermissions,on_delete=models.SET_NULL,null=True,blank=True)

class bei_za_bidhaa(models.Model):
    jina = models.CharField(max_length=100,null=True,blank=True) 
    idadi = models.DecimalField(max_digits=10,decimal_places=5)
    bei = models.DecimalField(max_digits=20,decimal_places=10)
    item = models.ForeignKey(bidhaa,on_delete=models.CASCADE)
    
class salePuMatch(models.Model):
    aina_match = models.ForeignKey(bidhaa_aina,on_delete=models.SET_NULL,null=True)
    smallUnit = models.TextField(blank=True)
    Units = models.DecimalField(max_digits=10,decimal_places=5,default=1)
    salePrice =  models.DecimalField(max_digits=20,decimal_places=4)
    material = models.BooleanField(default=False)

class mauzoList(models.Model):
    mauzo=  models.ForeignKey(mauzoni,on_delete=models.CASCADE)  
    idadi = models.DecimalField(max_digits=10,decimal_places=5)
    vat_included = models.BooleanField(default=False)
    vat_set = models.BooleanField(default=False)
    jum = models.BooleanField(default=True)
    bei = models.DecimalField(max_digits=20,decimal_places=10)
    bei_og = models.DecimalField(max_digits=20,decimal_places=10,default=0)
    produ = models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)
    serial = models.TextField(blank=True,null=True)
    returned = models.DecimalField(max_digits=10,decimal_places=3,default=0.000)
    packed = models.BooleanField(default=False)

    # For matching item puurpose
    match = models.ForeignKey(salePuMatch,on_delete=models.SET_NULL,null=True)

    # For services only
    saveT =  models.IntegerField(default=1)  
    serviceReturn =  models.DecimalField(max_digits=10,decimal_places=3,default=0)  


# MATCHIN ORDERED ITEMS FROM WHERE THEY  HAVE ORDERED TO
# bidhaa  zilikoagizwa
class order_to(models.Model):
    bidhaa = models.ForeignKey(bidhaa,on_delete=models.CASCADE)
    Units = models.DecimalField(max_digits=10,decimal_places=5,default=1)

#Aliyeagiza...............................//
class order_from(models.Model):
    orderto = models.ForeignKey(order_to,on_delete=models.CASCADE)
    bidhaa = models.ForeignKey(bidhaa,on_delete=models.CASCADE)


class sa_ret(models.Model):
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    ret =  models.ForeignKey(sale_return,on_delete=models.CASCADE)
    sa_list = models.ForeignKey(mauzoList,on_delete=models.CASCADE)


class color_produ(models.Model):
    color_code=models.CharField(max_length=20)
    color_name=models.CharField(max_length=30)
    nick_name=models.TextField(blank=True,null=True)
    colored = models.BooleanField()
    bidhaa = models.ForeignKey(bidhaa,on_delete=models.CASCADE,blank=True,null=True)
    banned = models.BooleanField(default=False)

class received_color(models.Model):
    # bidhaa=models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE,blank=True,null=True)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    qty_before = models.DecimalField(max_digits=10,decimal_places=3)
    
  
class produ_colored(models.Model):
    bidhaa=models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE,blank=True,null=True)
    color=models.ForeignKey(color_produ,on_delete=models.CASCADE)
    Interprise=models.ForeignKey(Interprise,on_delete=models.CASCADE)
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    received = models.OneToOneField(received_color,on_delete=models.CASCADE,blank=True,null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class transfered_color(models.Model):
    toka = models.ForeignKey(produ_colored,on_delete=models.CASCADE)
    kwenda = models.OneToOneField(received_color,on_delete=models.CASCADE)

class picha_yenyewe(models.Model):      
    picha=models.ImageField(upload_to="pics")
    picha_hash = models.CharField(max_length=600, null=True, blank=True, db_index=True)
    pic_size=models.IntegerField()
    owner=models.ForeignKey(User, on_delete=models.CASCADE)
   
class picha_bidhaa(models.Model):
    color_produ=models.ForeignKey(color_produ,on_delete=models.CASCADE)
    picha=models.ForeignKey(picha_yenyewe,on_delete=models.CASCADE)
    bidhaa=models.ForeignKey(bidhaa,on_delete=models.CASCADE)
    # owner=models.ForeignKey(User,on_delete=models.CASCADE) 

class sizes(models.Model):
    size = models.CharField(max_length=100)
    color=models.ForeignKey(color_produ,on_delete=models.CASCADE)    

class received_size(models.Model):
    # color=models.ForeignKey(produ_colored,on_delete=models.CASCADE,blank=True,null=True)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    qty_before = models.DecimalField(max_digits=10,decimal_places=3)

class produ_size(models.Model):
    bidhaa=models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE,blank=True,null=True)    
    sized=models.ForeignKey(sizes,on_delete=models.CASCADE,blank=True,null=True) 
    Interprise=models.ForeignKey(Interprise,on_delete=models.CASCADE)
    idadi=models.DecimalField(max_digits=10,decimal_places=3)
    received =models.ForeignKey(received_size,on_delete=models.CASCADE,blank=True,null=True)   
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # addedfromprodu = models.IntegerField(default=0)
   
class transfered_size(models.Model):
    toka = models.ForeignKey(produ_size,on_delete=models.CASCADE)
    kwenda = models.OneToOneField(received_size,on_delete=models.CASCADE)
    # qty_before = models.DecimalField(max_digits=10,decimal_places=3)

class production_color(models.Model):
    product = models.ForeignKey(productionList,on_delete=models.CASCADE) 
    color =  models.ForeignKey(produ_colored,on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    before = models.DecimalField(max_digits=10,decimal_places=3,default=0)

class production_size(models.Model):
    size = models.ForeignKey(produ_size,on_delete=models.CASCADE) 
    color =  models.ForeignKey(production_color,on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    before = models.DecimalField(max_digits=10,decimal_places=3,default=0)

class productChangeRecord(models.Model):
    prod =models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    qty_b = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    qty_a = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    adjst = models.ForeignKey(stokAdjustment,on_delete=models.CASCADE,null=True)

class ColorChange(models.Model):
    change =models.ForeignKey(productChangeRecord,on_delete=models.CASCADE)
    color = models.ForeignKey(produ_colored,on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    
class SizeChange(models.Model):
    size = models.ForeignKey(produ_size,on_delete=models.CASCADE)
    color =models.ForeignKey(ColorChange,on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
   
class sales_color(models.Model):
    mauzo=models.ForeignKey(mauzoList,on_delete=models.CASCADE)
    bidhaa=models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)
    color=models.ForeignKey(produ_colored,on_delete=models.SET_NULL,null=True,blank=True)    
    idadi=models.DecimalField(max_digits=10,decimal_places=3)
    returned = models.DecimalField(max_digits=10,decimal_places=3,default=0.000)
    price = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    packed = models.BooleanField(default=False)
    serviceReturn =  models.DecimalField(max_digits=10,decimal_places=3,default=0) 

class sa_col_ret(models.Model):
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    ret =  models.ForeignKey(sale_return,on_delete=models.CASCADE)
    sa_list = models.ForeignKey(sales_color,on_delete=models.CASCADE)

class sales_size(models.Model):
    mauzo=models.ForeignKey(mauzoList,on_delete=models.CASCADE)
    bidhaa=models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)
    size=models.ForeignKey(produ_size,on_delete=models.SET_NULL,null=True,blank=True)    
    idadi=models.DecimalField(max_digits=10,decimal_places=3)
    color=models.ForeignKey(sales_color,on_delete=models.CASCADE)
    returned = models.DecimalField(max_digits=10,decimal_places=3,default=0.000)
    price = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    packed = models.BooleanField(default=False)
    serviceReturn =  models.DecimalField(max_digits=10,decimal_places=3,default=0)

class sa_size_ret(models.Model):
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    ret =  models.ForeignKey(sale_return,on_delete=models.CASCADE)
    sa_list = models.ForeignKey(sales_size,on_delete=models.CASCADE)

class purchased_color(models.Model):
    manunuzi=models.ForeignKey(manunuziList,on_delete=models.CASCADE)
    bidhaa=models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)
    color=models.OneToOneField(produ_colored,on_delete=models.SET_NULL,null=True,blank=True)    
    idadi=models.DecimalField(max_digits=10,decimal_places=3)
    rudi = models.DecimalField(max_digits=10,decimal_places=3,default=0)
    before = models.DecimalField(max_digits=10,decimal_places=3,default=0)

class pu_col_ret(models.Model):
    idadi = models.DecimalField(max_digits=10,decimal_places=3)
    ret =  models.ForeignKey(bil_return,on_delete=models.CASCADE)
    pu_list = models.ForeignKey(purchased_color,on_delete=models.CASCADE)

class purchased_size(models.Model):
    manunuzi=models.ForeignKey(manunuziList,on_delete=models.CASCADE)
    bidhaa=models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)
    size=models.OneToOneField(produ_size,on_delete=models.CASCADE,null=True,blank=True)      
    idadi=models.DecimalField(max_digits=10,decimal_places=4)
    color=models.ForeignKey(purchased_color,on_delete=models.CASCADE)
    rudi = models.DecimalField(max_digits=10,decimal_places=4,default=0)
    before = models.DecimalField(max_digits=10,decimal_places=4,default=0)


class pu_size_ret(models.Model):
    idadi = models.DecimalField(max_digits=10,decimal_places=4)
    ret =  models.ForeignKey(bil_return,on_delete=models.CASCADE)
    pu_list = models.ForeignKey(purchased_size,on_delete=models.CASCADE)

class bidhaa_sifa(models.Model):
    owner=models.ForeignKey(User,on_delete=models.CASCADE) 
    bidhaa=models.ForeignKey(bidhaa,on_delete=models.CASCADE)
    sifa= models.CharField(max_length=300)

class key_sifa(models.Model):
    owner=models.ForeignKey(User,on_delete=models.CASCADE,null=True) 
    bidhaa=models.ForeignKey(bidhaa,on_delete=models.CASCADE)
    key= models.CharField(max_length=300)
    sifa= models.CharField(max_length=300)

class manunuzi_bidhaa(models.Model):
    bidhaa = models.ForeignKey(bidhaa,on_delete=models.CASCADE,null=True)       
    manunuzi = models.ForeignKey(manunuziList,on_delete=models.CASCADE)       
    Interprise = models.IntegerField() 
    outstocku = models.IntegerField()
 
class matumizi(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    matumizi=models.CharField(max_length=700)

class matumiziTarehe(models.Model):
    produxn = models.ForeignKey(production, on_delete=models.CASCADE,blank=True, null=True)
    date = models.DateTimeField(null=True,blank=True)
    Na =models.ForeignKey(InterprisePermissions, on_delete=models.CASCADE,blank=True, null=True)

class rekodiMatumizi(models.Model):
    Interprise = models.ForeignKey(Interprise, on_delete=models.CASCADE)
    matumizi = models.ForeignKey(matumizi, on_delete=models.CASCADE)
    manunuzil = models.BooleanField(default=False)
    date = models.DateField(null=True,blank=True)
    tarehe = models.DateTimeField()
    matumiziDeti = models.ForeignKey(matumiziTarehe, on_delete=models.CASCADE,blank=True, null=True)
    manunuzi_id = models.ForeignKey(manunuzi, on_delete=models.CASCADE,blank=True, null=True)
    adjst= models.ForeignKey(stokAdjustment, on_delete=models.CASCADE,blank=True, null=True)
 
    kiasi = models.DecimalField(max_digits=20,decimal_places=4)
    ilolipwa = models.DecimalField(max_digits=20,decimal_places=4,default=0)
    akaunti = models.ForeignKey(PaymentAkaunts, on_delete=models.CASCADE,blank=True, null=True)
    by = models.ForeignKey(InterprisePermissions, on_delete=models.CASCADE,blank=True, null=True)
    maelezo = models.TextField(blank=True)

class staff_akaunt_permissions(models.Model):
    Akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    Allow = models.BooleanField(default=False)
    owner = models.BooleanField()

class chatTo(models.Model):  
    to = models.ForeignKey(Interprise,on_delete=models.CASCADE)  

class question_to(models.Model):
    qzto = models.ForeignKey(bidhaa,on_delete=models.SET_NULL,null=True)

class AnswerTo(models.Model):
    aswTo = models.ForeignKey(question_to,on_delete=models.CASCADE)  
    answer = models.BooleanField(default=False)


class chats(models.Model):  
    date = models.DateTimeField(null=True)
    From = models.ForeignKey(Interprise,on_delete=models.CASCADE)  
    By = models.ForeignKey(UserExtend,on_delete=models.CASCADE,null=True)  
    msg = models.TextField(blank=True)
    audio = models.FileField(upload_to="audio",null=True,blank=True)
    onItem = models.ForeignKey(bidhaa_stoku,on_delete=models.SET_NULL,null=True)
    onOrder = models.ForeignKey(mauzoni,on_delete=models.SET_NULL,null=True)
    pickups = models.BooleanField(default=False)
    to = models.ForeignKey(chatTo,on_delete=models.SET_NULL,null=True)

    qzTo = models.ForeignKey(question_to,on_delete=models.SET_NULL,null=True)  
    ansTo = models.ForeignKey(AnswerTo,on_delete=models.SET_NULL,null=True)  

    Anyuser_read = models.BooleanField(default=False)
    admin_read = models.BooleanField(default=False)

    to_deleted = models.BooleanField(default=False)
    from_deleted = models.BooleanField(default=False)
    deleted_byAdmin = models.BooleanField(default=False)

class now_categ(models.Model):
    new_Categ = models.ForeignKey(bidhaa_aina,on_delete=models.SET_NULL,null=True)
        
class now_group(models.Model):
    new_group = models.ForeignKey(mahitaji,on_delete=models.SET_NULL,null=True)
        
class bidhaa_edit(models.Model):
    prod = models.ForeignKey(bidhaa,on_delete=models.CASCADE,null=True)
    nameEdit = models.BooleanField(default=False)
    categEdit = models.BooleanField(default=False)
    former_name = models.TextField(blank=True)
    current_name = models.TextField(blank=True)
    former_Categ = models.ForeignKey(bidhaa_aina,on_delete=models.SET_NULL,null=True)
    new_Categ = models.ForeignKey(now_categ,on_delete=models.SET_NULL,null=True)

class bidhaaA_edit(models.Model):
    aina = models.ForeignKey(bidhaa_aina,on_delete=models.CASCADE,null=True)
    nameEdit = models.BooleanField(default=False)
    group = models.BooleanField(default=False)
    former_name = models.TextField(blank=True)
    current_name = models.TextField(blank=True)
    former_group = models.ForeignKey(mahitaji,on_delete=models.SET_NULL,null=True)
    new_group = models.ForeignKey(now_group,on_delete=models.SET_NULL,null=True)


class Notifications(models.Model):
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE,null=True)
    date = models.DateTimeField()
    # notifications concern.............................................//
    itmTr = models.BooleanField(default=False)
    itmRcv = models.BooleanField(default=False)
    puO = models.BooleanField(default=False)
    pickUp = models.BooleanField(default=False)

    bilRtn = models.BooleanField(default=False)
    ItemEdit = models.BooleanField(default=False)
    ItemCatEdit = models.BooleanField(default=False)
    # when  user receive the itm.................//
    saO = models.BooleanField(default=False)
    
    saRtn = models.BooleanField(default=False)
    Sett = models.BooleanField(default=False)

    # mapp to respect model where there is a change
    itmTr_map = models.ForeignKey(transfer,on_delete=models.CASCADE,null=True)
    itmRcv_map = models.ForeignKey(receive,on_delete=models.CASCADE,null=True)
    puO_map = models.ForeignKey(manunuzi,on_delete=models.CASCADE,null=True)
    bilRtn_map = models.ForeignKey(bil_return,on_delete=models.CASCADE,null=True)
    saO_map = models.ForeignKey(mauzoni,on_delete=models.CASCADE,null=True)
   
    saRtn_map = models.ForeignKey(sale_return,on_delete=models.CASCADE,null=True)
    Item_map = models.ForeignKey(bidhaa_edit,on_delete=models.CASCADE,null=True)
    ItemCat_map = models.ForeignKey(bidhaaA_edit,on_delete=models.CASCADE,null=True)
   

    Incharge = models.ForeignKey(UserExtend,on_delete=models.CASCADE,null=True)

    # Who has read it................................//
    admin_read = models.BooleanField(default=False)
    AnyUser_read = models.BooleanField(default=False)
    Incharge_reade = models.BooleanField(default=False)
    
class wekaCash(models.Model):
    Interprise=models.ForeignKey(Interprise,on_delete=models.CASCADE)
    tarehe = models.DateTimeField()
    Akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.CASCADE)
    Amount = models.DecimalField(max_digits=20,decimal_places=4)
    before = models.DecimalField(max_digits=20,decimal_places=4)
    After = models.DecimalField(max_digits=20,decimal_places=4)
    kutoka =  models.CharField(max_length=500) 
    maelezo = models.CharField(max_length=500,blank=True,null=True)
    by= models.ForeignKey(InterprisePermissions,on_delete=models.CASCADE,null=True)
    # monthcode=models.IntegerField(default =int(datetime.datetime.now(tz=timezone.utc).strftime("%Y%m")) )
    usiri = models.BooleanField(default=False)
    kutoka_siri = models.BooleanField(default=False)
    mauzo = models.BooleanField(default=False)
    order = models.BooleanField(default=False)
    invo = models.ForeignKey(mauzoni,on_delete=models.SET_NULL,null=True)
    bill_ref = models.ForeignKey(bil_return,on_delete=models.SET_NULL,null=True)
    huduma = models.BooleanField(default=False)
    kuhamisha = models.BooleanField(default=False)
    kuhamishaNje = models.BooleanField(default=False)
    mtaji = models.BooleanField(default=False)
    huduma_nyingine = models.ForeignKey(HudumaNyingine,on_delete=models.SET_NULL,null=True)

class  toaCash(models.Model):
    Interprise=models.ForeignKey(Interprise,on_delete=models.CASCADE)     
    tarehe = models.DateTimeField()  
    Akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.CASCADE)
    Amount = models.DecimalField(max_digits=20,decimal_places=4)
    before = models.DecimalField(max_digits=20,decimal_places=4)
    After = models.DecimalField(max_digits=20,decimal_places=4)
    kwenda =  models.CharField(max_length=500) 
    maelezo = models.CharField(max_length=500)
    makato = models.IntegerField(default=0)
    # monthcode=models.IntegerField(default =int(datetime.datetime.now(tz=timezone.utc).strftime("%Y%m")) )
    by= models.ForeignKey(InterprisePermissions,on_delete=models.CASCADE,null=True)
  
    usiri = models.BooleanField(default=False)
    kwenda_siri = models.BooleanField(default=False)

    kuhamishaNje = models.BooleanField(default=False)
    kuhamisha = models.BooleanField(default=False)
    personal = models.BooleanField(default=False)

    matumizi = models.ForeignKey(rekodiMatumizi,on_delete=models.SET_NULL,null=True)

#INCASE OF BILL PAYMENT......................................//
    pu = models.BooleanField(default=False)
    bill = models.ForeignKey(manunuzi,on_delete=models.SET_NULL,null=True)

    produxn = models.ForeignKey(matumiziTarehe,on_delete=models.SET_NULL,null=True)
    prdxn  = models.BooleanField(default=False)
    
#   INCASE OF SOLD OR ORDERED ITEM CASH REFUND.....//
    sale_fidia = models.BooleanField(default=False)
    oda_fidia = models.BooleanField(default=False)
    # rudi = models.ForeignKey(mauzoni,on_delete=models.SET_NULL,null=True)

class sale_return_mauzo_fidia(models.Model):
    ivo = models.ForeignKey(mauzoni,on_delete=models.CASCADE,null=True)
    sale_rtn = models.ForeignKey(sale_return,on_delete=models.CASCADE)
    fidia = models.BooleanField(default=False) 
    recordi = models.ForeignKey(toaCash,on_delete=models.CASCADE,null=True) 
    re_am = models.DecimalField(max_digits=20,decimal_places=4,default=0) 

class bill_return_pu_fidia(models.Model):
    bil = models.ForeignKey(manunuzi,on_delete=models.CASCADE,null=True)
    bil_rtn = models.ForeignKey(bil_return,on_delete=models.CASCADE)
    fidia = models.BooleanField(default=False) 
    record = models.ForeignKey(wekaCash,on_delete=models.CASCADE,null=True) 
    re_am = models.DecimalField(max_digits=20,decimal_places=4,default=0) 


class Cash_order_return(models.Model):
    code = models.CharField(max_length=17)  
    akaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.SET_NULL,null=True)
    amount = models.DecimalField(max_digits=20,decimal_places=4)
    maelezo = models.TextField(blank=True)
    date =  models.DateField(null=True,blank=True)
    ivo = models.ForeignKey(mauzoni,on_delete=models.CASCADE,null=True)
    makato = models.DecimalField(max_digits=20,decimal_places=4,default=0)
    Invo_no = models.IntegerField()
    By = models.ForeignKey(InterprisePermissions,on_delete=models.SET_NULL,null=True,blank=True)
    customer_comfirm = models.BooleanField(default=False)
    record = models.ForeignKey(toaCash,on_delete=models.CASCADE,null=True) 

class savedStockState(models.Model):
    maelezo = models.TextField(blank=True)
    By = models.ForeignKey(InterprisePermissions,on_delete=models.CASCADE,null=True,blank=True)
    date =  models.DateTimeField(null=True,blank=True)
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)


class SaveAkauntState(models.Model):
    sakaunt = models.ForeignKey(PaymentAkaunts,on_delete=models.SET_NULL,null=True)
    kiasi = models.DecimalField(max_digits=20,decimal_places=4)
    state = models.ForeignKey(savedStockState,on_delete=models.CASCADE)

class ItemsState(models.Model):
    sbidhaa = models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE)
    sidadi = models.DecimalField(max_digits=20,decimal_places=4)
    state = models.ForeignKey(savedStockState,on_delete=models.CASCADE,null=True,blank=True)

class ColorState(models.Model):
    state = models.ForeignKey(savedStockState,on_delete=models.CASCADE,null=True,blank=True)
    sidadi = models.DecimalField(max_digits=20,decimal_places=4)
    scolor = models.ForeignKey(produ_colored,on_delete=models.CASCADE)


class SizeState(models.Model):
    ssize = models.ForeignKey(produ_size,on_delete=models.CASCADE)
    sidadi = models.DecimalField(max_digits=20,decimal_places=4)
    state = models.ForeignKey(savedStockState,on_delete=models.CASCADE,null=True,blank=True)

class InterpriseVisotrs(models.Model): 
    Interprise = models.ForeignKey(Interprise,on_delete=models.CASCADE)
    date = models.DateField()
    user = models.ForeignKey(UserExtend,on_delete=models.SET_NULL,null=True,blank=True)
    ipaddres = models.CharField(max_length=100)    

    homePage = models.IntegerField(default=False)   
    AboutPage = models.IntegerField(default=False)   
    MapPage = models.IntegerField(default=False)   
    RegPage = models.IntegerField(default=False) 

    ItemPage = models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE,null=True,blank=True)
    CategoryPage = models.ForeignKey(bidhaa_aina,on_delete=models.CASCADE,null=True,blank=True)
    GroupPage = models.ForeignKey(mahitaji,on_delete=models.CASCADE,null=True,blank=True)
    BrandPage = models.ForeignKey(makampuni,on_delete=models.CASCADE,null=True,blank=True)

    visted = models.IntegerField(default=0) 

class VistorsSavedItems(models.Model):  
    user =  models.ForeignKey(UserExtend,on_delete=models.CASCADE,null=True,blank=True) 
    bidhaa = models.ForeignKey(bidhaa_stoku,on_delete=models.CASCADE,null=True,blank=True)

class VistorsSavedVendor(models.Model):
    user =  models.ForeignKey(UserExtend,on_delete=models.CASCADE,null=True,blank=True) 
    vendor = models.ForeignKey(Interprise,on_delete=models.CASCADE,null=True,blank=True)
    desk = models.TextField(null=True,blank=True)
    

class marketBanner(models.Model):
     banner = models.ImageField(upload_to="banners",null=True,blank=True)
     date = models.DateTimeField(null=True,blank=True)
     vistors = models.IntegerField(default=0)
     amount = models.IntegerField(default=0)
     visted = models.IntegerField(default=0)
     gender = models.IntegerField(null=True,blank=True)
     page = models.IntegerField(null=True,blank=True)

     itm = models.ForeignKey(bidhaa_stoku,null=True,blank=True,on_delete=models.CASCADE)
     brand = models.ForeignKey(makampuni,null=True,blank=True,on_delete=models.CASCADE)
     aina = models.ForeignKey(bidhaa_aina,null=True,blank=True,on_delete=models.CASCADE)
     group = models.ForeignKey(mahitaji,null=True,blank=True,on_delete=models.CASCADE)

     url = models.URLField(null=True,blank=True)
     Interprise = models.ForeignKey(Interprise,null=True,blank=True,on_delete=models.CASCADE)
     desc = models.TextField(null=True,blank=True)
     by = models.ForeignKey(UserExtend,null=True,blank=True,on_delete=models.CASCADE)

class marketPlace(models.Model): 
    wilaya = models.ForeignKey(Wilaya,on_delete=models.SET_NULL,null=True,blank=True)    
    mkoa = models.ForeignKey(Mikoa,on_delete=models.SET_NULL,null=True,blank=True)    
    nchi = models.ForeignKey(Nchi,on_delete=models.SET_NULL,null=True,blank=True)    
    banner = models.ForeignKey(marketBanner,on_delete=models.CASCADE)

class VistedBanners(models.Model):
    user = models.ForeignKey(UserExtend,on_delete=models.CASCADE)
    banner = models.ForeignKey(marketBanner,on_delete=models.CASCADE)
 