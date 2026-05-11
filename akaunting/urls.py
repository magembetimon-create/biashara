from django.urls import path

from . import views

urlpatterns=[
    path('addAkaunt',views.addAkaunt, name='addAkaunt'),
    path('',views.akaunts, name='akaunts'),
    path('getdata',views.getdata, name='getdata'),
    path('editAkaunt',views.editAkaunt, name='editAkaunt'),
    path('ondoaAkaunt',views.ondoaAkaunt, name='ondoaAkaunt'),
    path('kuwekapesa',views.kuwekapesa, name='kuwekapesa'),
    path('kutoaPesa',views.kutoaPesa, name='kutoaPesa'),
    path('cashDepositFromCash',views.cashDepositFromCash, name='cashDepositFromCash'),
    path('openShift',views.openShift, name='openShift'),
    path('assignShiftMember',views.assignShiftMember, name='assignShiftMember'),
    path('closeShift',views.closeShift, name='closeShift'),
    path('verifyShift',views.verifyShift, name='verifyShift'),
    path('shiftReportData',views.shiftReportData, name='shiftReportData'),
    path('currentShiftData',views.currentShiftData, name='currentShiftData'),
    path('setShiftManagementStatus',views.setShiftManagementStatus, name='setShiftManagementStatus'),
    path('cash-deposits', views.cash_deposits_page, name='cash_deposits_page'),
    path('cash-deposits/data', views.cash_deposits_data, name='cash_deposits_data'),
    path('cash-deposits/approve', views.approve_cash_deposit, name='approve_cash_deposit'),
    path('mobile-payments', views.mobile_payments_page, name='mobile_payments_page'),
    path('mobile-payments/data', views.mobile_payments_data, name='mobile_payments_data'),
    # path('wekalist',views.wekalist, name='wekalist'),
    # path('kutoalist',views.kutoalist, name='kutoalist'),
    # path('calender',views.calender, name='calender'),
  
]

