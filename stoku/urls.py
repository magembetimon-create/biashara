from django.urls import path

from . import views

urlpatterns=[
    # load items data ........................
    path('getStokuData',views.getStokuData, name='getStokuData'),
    path('getItems',views.getItems, name='getItems'),
    path('OutStock',views.OutStock, name='OutStock'),
    path('getItemsAssociate',views.getItemsAssociate, name='getItemsAssociate'),
    path('getItemsAll',views.getItemsAll, name='getItemsAll'),


    path('OngezaMahitaji',views.OngezaMahitaji, name='OngezaMahitaji'),    
    path('OngezaKampuni',views.OngezaKampuni, name='OngezaKampuni'),
    path('futaBrand',views.futaBrand, name='futaBrand'),
    path('OngezaAina',views.OngezaAina, name='OngezaAina'),
    path('futaAina',views.futaAina, name='futaAina'),

    path('sambazaji',views.sambazaji, name='sambazaji'),
    path('mteja',views.mteja, name='mteja'),

    path('OngezaStoku',views.OngezaStoku, name='OngezaStoku'),
    path('AddStoku',views.AddStoku, name='AddStoku'),
    path('usagePlan',views.usagePlan, name='usagePlan'),
    path('lipiaMatumiziNyuma',views.lipiaMatumiziNyuma, name='lipiaMatumiziNyuma'),


    path('ongezaBidhaa',views.ongezaBidhaa, name='ongezaBidhaa'),
    path('registeredItemsRegister',views.registeredItemsRegister, name='registeredItemsRegister'),
    path('UsajiriTokaMatawi',views.UsajiriTokaMatawi, name='UsajiriTokaMatawi'),
    path('galamaManunuzi',views.galamaManunuzi, name='galamaManunuzi'),
    path('saveItmAttr',views.saveItmAttr, name='saveItmAttr'),

    path('punguzaBidhaa',views.punguzaBidhaa, name='punguzaBidhaa'),
    path('Zipungue',views.Zipungue, name='Zipungue'),
    path('Ziongezeke',views.Ziongezeke, name='Ziongezeke'),
    path('Ziruditena',views.Ziruditena, name='Ziruditena'),
    path('futaKabisa',views.futaKabisa, name='futaKabisa'),
    path('comfirmAdst',views.comfirmAdst, name='comfirmAdst'),

    path('AllAdjs',views.AllAdjs, name='AllAdjs'),
    path('viewAdjst',views.viewAdjst, name='viewAdjst'),
    path('printAdjst',views.printAdjst, name='printAdjst'),
    path('printAdjstNames',views.printAdjstNames, name='printAdjstNames'),
    path('AddItemQuantity',views.kuongezaBidhaa, name='AddItemQuantity'),
    path('reduceItemQuantity',views.kupunguzaBidhaa, name='reduceItemQuantity'),
    path('editBidhaa',views.EditBidhaa, name='editBidhaa'),
    path('ShowItemToVistors',views.ShowItemToVistors, name='ShowItemToVistors'),
    path('ItemVoice',views.ItemVoice, name='ItemVoice'),
    path('RemoveItemAudio',views.RemoveItemAudio, name='RemoveItemAudio'),
  
#  Item Color & size.........................................................................//
    path('save_color',views.save_color, name='save_color'),
    path('save_size',views.save_size, name='save_size'),
    path('getSizeColor',views.getSizeColor, name='getSizeColor'),
    path('addSize',views.addSize, name='addSize'),
    path('addColor',views.addColor, name='addColor'),
    path('ondoa_size',views.ondoa_size, name='ondoa_size'),
    path('ondoa_color',views.ondoa_color, name='ondoa_color'),

# Item features & key values.........................................................//
    path('sifa_muhimu',views.sifa_muhimu, name='sifa_muhimu'),
    path('maelezo_kina',views.maelezo_kina, name='maelezo_kina'),
    path('ondoa_sifa',views.ondoa_sifa, name='ondoa_sifa'),
    path('ondoa_keficha',views.ondoa_keficha, name='ondoa_keficha'),
  
    path('kuwekaPicha',views.kuwekaPicha, name='kuwekaPicha'),
    path('ondoaPicha',views.ondoaPicha, name='ondoaPicha'),
    path('tafutaPicha',views.tafutaPicha, name='tafutaPicha'),


#Item Categories, Brands and  Groups navigations..........................................................//
    path('bidhaapanel',views.bidhaapanel, name='bidhaapanel'),
    path('bidhaaReg',views.bidhaaReg, name='bidhaaReg'),
    path('aina',views.bidhaaAina, name='aina'),
    path('kundi',views.bidhaaKundi, name='kundi'),
    path('chapa',views.bidhaaChapa, name='chapa'),

# Services   
    path('servicepanel',views.servicepanel, name='servicepanel'),
    path('servicesAina',views.servicesAina, name='servicesAina'),
    path('serviceKundi',views.serviceKundi, name='serviceKundi'),

  

# ITems transfer.............//
    path('kuhamisha',views.bidhaatransfer, name='kuhamisha'),
    path('hamisha_oda',views.hamisha_oda, name='hamisha_oda'),
    path('ondoa_oda',views.ondoa_oda, name='ondoa_oda'),
    path('hakiki_oda',views.hakiki_oda, name='hakiki_oda'),

    path('addtranfer',views.addtranfer, name='addtranfer'),
    path('bidhaaoda',views.bidhaaoda, name='bidhaaoda'),

    path('transferNote',views.transferNote, name='transferNote'),
    path('receiveNote',views.receiveNote, name='receiveNote'),

    path('viewTransfer',views.viewtransfer, name='viewTransfer'),
    path('viewReceives',views.viewReceives, name='viewReceives'),

    path('markReceive',views.markReceive, name='markReceive'),
    path('markAddReg',views.markAddReg, name='markAddReg'),

#item vendor & Customers Navigations.........................................//
    path('sambazajitu',views.sambazajitu, name='sambazajitu'),

    # autocomplete for supplier
    path('autocomplete',views.autocomplete, name='autocomplete'),
    path('getVendor',views.getVendor, name='getVendor'),
    path('allowFractions',views.allowFractions, name='allowFractions'),
    path('interpnavi/<int:intp>',views.interpnavi, name='interpnavi')


]
