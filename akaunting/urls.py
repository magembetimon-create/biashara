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
    # path('wekalist',views.wekalist, name='wekalist'),
    # path('kutoalist',views.kutoalist, name='kutoalist'),
    # path('calender',views.calender, name='calender'),
  
]

