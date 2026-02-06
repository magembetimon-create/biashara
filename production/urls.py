from django.urls import path

from . import views

urlpatterns=[
    path('allProduction',views.allProduction, name='allProduction'),

     # Used Materials................///
    path('MaterialItems',views.MaterialItems, name='MaterialItems'),
    path('MaterialAina',views.MaterialAina, name='MaterialAina'),
    path('MaterialReg',views.MaterialReg, name='MaterialReg'),
    path('MaterialPAina',views.MaterialPAina, name='MaterialPAina'),
    path('MaterialChapa',views.MaterialChapa, name='MaterialChapa'),
    path('sambazaMaterial',views.sambazaMaterial, name='sambazaMaterial'),

    # Produced Items
    path('producedItems',views.producedItems, name='producedItems'),
    path('producedReg',views.producedReg, name='producedReg'),
    path('producedAina',views.producedAina, name='producedAina'),
    path('producedPAina',views.producedPAina, name='producedPAina'),


    path('wokers',views.wokers, name='wokers'),
    path('Workerautocomplete',views.Workerautocomplete, name='Workerautocomplete'),
    path('mfanyakazi',views.mfanyakazi, name='mfanyakazi'),
    # path('getWorkers',views.getWorkers, name='getWorkers'),
    path('labourtasks',views.labourtasks, name='labourtasks'),
    path('removeLaborer',views.removeLaborer, name='removeLaborer'),

    # production process
    path('productionUsedItems',views.productionUsedItems, name='productionUsedItems'),
    path('productonLabours',views.productonLabours, name='productonLabours'),
    path('productonYield',views.productonYield, name='productonYield'),
    path('productonReport',views.productonReport, name='productonReport'),
    path('confirmProd',views.confirmProd, name='confirmProd'),
    path('reportPrint',views.reportPrint, name='reportPrint'),
    path('productonExpenses',views.productonExpenses, name='productonExpenses'),
   
    path('addMaterial',views.addMaterial, name='addMaterial'),
    path('addWorkers',views.addWorkers, name='addWorkers'),
    path('addProducts',views.addProducts, name='addProducts'),
    path('addExpenses',views.addExpenses, name='addExpenses'),

    path('removeProducts',views.removeProducts, name='removeProducts'),
    path('removeWorkerTask',views.removeWorkerTask, name='removeWorkerTask'),
    path('removeMaterialTable',views.removeMaterialTable, name='removeMaterialTable'),
    path('removeExpense',views.removeExpense, name='removeExpense'),
    
    path('markBatch',views.markBatch, name='markBatch'),

]