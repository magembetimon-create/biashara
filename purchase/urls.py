from django.urls import path

from . import views

urlpatterns=[
    path('AllBills',views.AllBills, name='AllBills'),
    path('puOrder',views.puOrder, name='puOrder'),



    path('newOda',views.newOda, name='newOda'),
    path('newBill',views.newBill, name='newBill'),
    path('addBill',views.addBill, name='addBill'),
    path('removebill',views.removebill, name='removebill'),
    path('payBill',views.payBill, name='payBill'),
    path('payBill2',views.payBill2, name='payBill2'),
    path('getBilllist',views.getBilllist, name='getBilllist'),
    path('editbill',views.editbill, name='editbill'),
    path('color_rm',views.color_rm, name='color_rm'),
    path('payManyBill',views.payManyBill, name='payManyBill'),
   
    path('viewbill',views.viewbill, name='viewbill'),
    path('markBill',views.markBill, name='markBill'),

    path('bili_return',views.bili_return, name='bili_return'),
    path('allowReturn',views.allowReturn, name='allowReturn'),
    path('viewRetrn',views.viewRetrn, name='viewRetrn'),
    path('bill_Itm_return_data',views.bill_Itm_return_data, name='bill_Itm_return_data'),
    path('bill_rudi',views.bill_rudi, name='bill_rudi'),
    path('payReturn',views.payReturn, name='payReturn'),
    path('fidiahela',views.fidiahela, name='fidiahela'),
   
    #    EXPENSES................................................................................//
    path('addExpense',views.addExpense, name='addExpense'),
    path('expenses',views.expenses, name='expenses'),
    path('expenseList',views.expenseList, name='expenseList'),
    path('editMatumizi',views.editMatumizi, name='editMatumizi'),
    path('removeExpenses',views.removeExpenses, name='removeExpenses'),


     # ADD ONLINE ITEM ORDER OR TO CART............................................//
    path('addtoCart',views.addtoCart, name='addtoCart'),
    path('addOrder',views.addOrder, name='addOrder'),
    path('AddPickup',views.AddPickup, name='AddPickup'),
    path('pickUps',views.pickUps, name='pickUps'),
    path('ViewPickup',views.ViewPickup, name='ViewPickup'),
    path('seenPick',views.seenPick, name='seenPick'),
    path('pickConfirm',views.pickConfirm, name='pickConfirm'),

    path('itemMatch',views.itemMatch, name='itemMatch'),
    path('pressOda',views.pressOda, name='pressOda'),
    path('viewOdered',views.viewOdered, name='viewOdered'),
    path('viewCart',views.viewCart, name='viewCart'),
    path('removeToCart_itm',views.removeToCart_itm, name='removeToCart_itm'),
    path('OdatoBill',views.OdatoBill, name='OdatoBill'),
    path('receives',views.receives, name='receives'),
    path('viewRecept',views.viewRecept, name='viewRecept'),
    path('Risitiprint',views.Risitiprint, name='Risitiprint'),

    # RATING THE SHOP .............
    path('purchaseRate',views.purchaseRate, name='purchaseRate'),

  
]
