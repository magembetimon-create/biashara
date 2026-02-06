from django.urls import path

from . import views

urlpatterns=[
path('riportPage',views.riportPage, name='riportPage'),

path('riportMauzo',views.riportMauzo, name='riportMauzo'),
path('SalesData',views.SalesData, name='SalesData'),
path('theInvo',views.theInvo, name='theInvo'),

path('SalesReturn',views.SalesReturn, name='SalesReturn'),
path('SalesReturnData',views.SalesReturnData, name='SalesReturnData'),
path('theItmReturn',views.theItmReturn, name='theItmReturn'),

path('AmountReturn',views.AmountReturn, name='AmountReturn'),
path('SalesAmountR',views.SalesAmountR, name='SalesAmountR'),
path('TheAmountR',views.TheAmountR, name='TheAmountR'),

# SAVE RIPORT FOR SALES & SERVICES RIPORTS.........................................//
path('saveRiport',views.saveRiport, name='saveRiport'),
path('getSavedRiport',views.getSavedRiport, name='getSavedRiport'),
path('removeSaved',views.removeSaved, name='removeSaved'),

# SERVICE RIPORT ................................................//
path('riportServiceIncome',views.riportServiceIncome, name='riportServiceIncome'),
path('ServiceData',views.ServiceData, name='ServiceData'),
path('riportServiceChange',views.riportServiceChange, name='riportServiceChange'),
path('ServiceChanged',views.ServiceChanged, name='ServiceChanged'),
path('AmountServReturn',views.AmountServReturn, name='AmountServReturn'),

# ADJUSTMENT BY ADDING RIPORT..................................................//
path('AddingAdjRiport',views.AddingAdjRiport, name='AddingAdjRiport'),
path('AddingAdjData',views.AddingAdjData, name='AddingAdjData'),
path('theAddAdj',views.theAddAdj, name='theAddAdj'),

# PURCHASES RIPORT..................................................//
path('purchasesRiport',views.purchasesRiport, name='purchasesRiport'),
path('PurchaseData',views.PurchaseData, name='PurchaseData'),
path('theBill',views.theBill, name='theBill'),

# PURCHASES RIPORT..................................................//
path('prodxnRiport',views.prodxnRiport, name='prodxnRiport'),
path('prodxnData',views.prodxnData, name='prodxnData'),
path('theBatch',views.theBatch, name='theBatch'),

# RECEIVES RIPORT..................................................//
path('receivesRiport',views.receivesRiport, name='receivesRiport'),
path('ReceivesData',views.ReceivesData, name='ReceivesData'),
path('theReceive',views.theReceive, name='theReceive'),

# REDUCE ADJST RIPORT..................................................//
path('ReduceAdj',views.ReduceAdj, name='ReduceAdj'),
path('ReduceAdjData',views.ReduceAdjData, name='ReduceAdjData'),
path('theReduceAdj',views.theReduceAdj, name='theReduceAdj'),


# expired or about to expire..................................................//
path('ExpiredItems',views.ExpiredItems, name='ExpiredItems'),
path('ExpiredData',views.ExpiredData, name='ExpiredData'),

# EXPENSES RIPORT..................................................//
path('Expensesr',views.Expensesr, name='Expensesr'),
path('ExpensedData',views.ExpensedData, name='ExpensedData'),

# INCOME & EXPENDITURE..................................................//
path('IncomeExpenditure',views.IncomeExpenditure, name='IncomeExpenditure'),
path('incoExpndData',views.incoExpndData, name='incoExpndData'),

# AMOUNT TRANSFER..................................................//
path('TansferR',views.TansferR, name='TansferR'),
path('TransferData',views.TransferData, name='TransferData'),

# STOCK STATE..................................................//
path('StockStateR',views.StockStateR, name='StockStateR'),
path('StockStateData',views.StockStateData, name='StockStateData'),
path('PrintItems',views.PrintItems, name='PrintItems'),
path('PrintStockState',views.PrintStockState, name='PrintStockState'),

path('SaveInventory',views.SaveInventory, name='SaveInventory'),
path('RemoveSaved',views.RemoveSaved, name='RemoveSaved'),

# INTERPRISE VISTORS,...........................................//
path('VistorsCounter',views.VistorsCounter, name='VistorsCounter'),
path('VistorsData',views.VistorsData, name='VistorsData'),

# HOME PAGE DATA
path('homePageData',views.homePageData, name='homePageData'),



]
