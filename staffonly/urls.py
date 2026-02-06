from django.urls import path

from . import views

urlpatterns=[
    
    path('staffPanel',views.staffPanel, name='staffPanel'),
    path('loadReport',views.loadReport, name='loadReport'),
    path('AllMembers',views.AllMembers, name='AllMembers'),
    # path('savePlaces',views.savePlaces, name='savePlaces'),
    # path('saveCateg',views.saveCateg, name='saveCateg'),
]