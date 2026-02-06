from django.urls import path

from . import views

urlpatterns=[
    path('mauzo',views.mauzo, name='mauzo'),
    path('POStab',views.POStab, name='POStab'),
    path('mauzo_rudi',views.mauzo_rudi, name='mauzo_rudi'),
 
    path('newInvoice',views.newInvoice, name='newInvoice'),
    path('newService',views.newService, name='newService'),

    path('saleOda',views.saleOda, name='saleOda'),
    path('newsaleOda',views.newsaleOda, name='newsaleOda'),
    path('saleOdaItems',views.saleOdaItems, name='saleOdaItems'),
    path('editOda',views.editOda, name='editOda'),
    path('change_toInvo',views.change_toInvo, name='change_toInvo'),
    path('printforInv',views.printforInv, name='printforInv'),


    path('giveForSales',views.giveForSales, name='giveForSales'),
    path('newGiveForSale',views.newGiveForSale, name='newGiveForSale'),
 
    path('customer',views.customer, name='customer'),
    path('getCustomers',views.getCustomers, name='getCustomers'),
    path('CustomerSales',views.CustomerSales, name='CustomerSales'),
    
    # path('getInvo',views.getInvo, name='getInvo'),
    path('addInvoice',views.addInvoice, name='addInvoice'),
    path('return',views.itm_return, name='return'),
    path('Itm_return_data',views.Itm_return_data, name='Itm_return_data'),
    path('viewRtrn',views.viewRtrn, name='viewRtrn'),
    #FIDIA HELA YA BIDHAA ZILIZORUDI KWA MANUNUZI
    path('fidiahela',views.fidiahela, name='fidiahela'),

    
    path('lipaInvo',views.lipaInvo, name='lipaInvo'),
    path('payReturn',views.payReturn, name='payReturn'),
   
    path('oda_refund',views.oda_refund, name='oda_refund'),
    path('oda_refunds',views.oda_refunds, name='oda_refunds'),
    path('viewRef',views.viewRef, name='viewRef'),
    path('viewOdaRef',views.viewOdaRef, name='viewOdaRef'),
    path('activateOda',views.activateOda, name='activateOda'),
    path('ReFprint',views.ReFprint, name='ReFprint'),

    path('viewInvo',views.viewInvo, name='viewInvo'),
    path('viewOda',views.viewOda, name='viewOda'),

    path('ondoaInvo',views.ondoaInvo, name='ondoaInvo'),
    path('Invoprint',views.Invoprint, name='Invoprint'),
 
    path('Bei_tu',views.Bei_tu, name='Bei_tu'),
    path('addUnits',views.addUnits, name='addUnits'),
    path('removeUnit',views.removeUnit, name='removeUnit'),

    # SERVICES.....................................//
    path('inservice',views.inservice, name='inservice'),
    path('Inservings',views.Inservings, name='Inservings'),
    path('HudumiaHuduma',views.HudumiaHuduma, name='HudumiaHuduma'),
    path('HudumiaHudumaData',views.HudumiaHudumaData, name='HudumiaHudumaData'),
    path('inserviceBook',views.inserviceBook, name='inserviceBook'),
    path('SevicesBook',views.SevicesBook, name='SevicesBook'),
    path('Hudumiwa',views.Hudumiwa, name='Hudumiwa'),
    path('viewServing',views.viewServing, name='viewServing'),

    path('ServiceStarted',views.ServiceStarted, name='ServiceStarted'),
    path('endServs',views.endServs, name='endServs'),
    path('EndSomeServs',views.EndSomeServs, name='EndSomeServs'),
    path('changeServs',views.changeServs, name='changeServs'),
    path('ExchangeServs',views.ExchangeServs, name='ExchangeServs'),
    path('ChangeSomeServs',views.ChangeSomeServs, name='ChangeSomeServs'),


    # online oder processing..........................
    path('viewCustomOrder',views.viewCustomOrder, name='viewCustomOrder'),
    path('setPack',views.setPack, name='setPack'),
    path('create_package',views.create_package, name='create_package'),
    path('unpack_items',views.unpack_items, name='unpack_items'),
    path('not_important',views.not_important, name='not_important'),
    path('packegeTransfer',views.packegeTransfer, name='packegeTransfer'),
  
    # RATING

    path('AllRatings',views.AllRatings, name='AllRatings'),
    path('ReplyRating',views.ReplyRating, name='ReplyRating'),
    path('markRateAsSeen',views.markRateAsSeen, name='markRateAsSeen'),

  
]
