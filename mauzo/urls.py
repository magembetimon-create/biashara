from django.urls import path

from . import views

urlpatterns=[
    path('mauzo',views.mauzo, name='mauzo'),
    path('POStab',views.POStab, name='POStab'),
    path('waiterpage',views.waiterpage, name='waiterpage'),
    path('waiter_counter_activate',views.waiter_counter_activate, name='waiter_counter_activate'),
    path('waiter_items_data',views.waiter_items_data, name='waiter_items_data'),
    path('waiter_order',views.waiter_order, name='waiter_order'),
    path('waiter_orders_data',views.waiter_orders_data, name='waiter_orders_data'),
    path('waiter_orders_summary',views.waiter_orders_summary, name='waiter_orders_summary'),
    path('waiter_orders_summary_data',views.waiter_orders_summary_data, name='waiter_orders_summary_data'),
    path('waiter_summary_order_details',views.waiter_summary_order_details, name='waiter_summary_order_details'),
    path('waiter_summary_delete_order',views.waiter_summary_delete_order, name='waiter_summary_delete_order'),
    path('waiter_summary_waiter_payment_records',views.waiter_summary_waiter_payment_records, name='waiter_summary_waiter_payment_records'),
    path('waiter_summary_clear_waiter_payments',views.waiter_summary_clear_waiter_payments, name='waiter_summary_clear_waiter_payments'),
    path('waiter_cleared_report',views.waiter_cleared_report, name='waiter_cleared_report'),
    path('waiter_cleared_report_clearings',views.waiter_cleared_report_clearings, name='waiter_cleared_report_clearings'),
    path('waiter_cleared_report_clearing_orders',views.waiter_cleared_report_clearing_orders, name='waiter_cleared_report_clearing_orders'),
    path('waiter_cleared_report_order_items',views.waiter_cleared_report_order_items, name='waiter_cleared_report_order_items'),
    path('waiter_clearing_list',views.waiter_clearing_list, name='waiter_clearing_list'),
    path('waiter_clear_order',views.waiter_clear_order, name='waiter_clear_order'),
    path('waiter_print_order',views.waiter_print_order, name='waiter_print_order'),
    path('waiter_Invoprint',views.waiter_Invoprint, name='waiter_Invoprint'),
    path('waiter_delete_order',views.waiter_delete_order, name='waiter_delete_order'),
    path('waiter_pay_order',views.waiter_pay_order, name='waiter_pay_order'),
    path('waiter_settings',views.waiter_settings, name='waiter_settings'),
        path('waiter_set_pin',views.waiter_set_pin, name='waiter_set_pin'),
        path('waiter_pos_device_session',views.waiter_pos_device_session, name='waiter_pos_device_session'),
        path('waiter_device_exit',views.waiter_device_exit, name='waiter_device_exit'),
        path('waiter_pos_manage',views.waiter_pos_manage, name='waiter_pos_manage'),
        path('waiter_pos',views.waiter_pos, name='waiter_pos'),
        path('waiter_device_dashboard',views.waiter_device_dashboard, name='waiter_device_dashboard'),
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
