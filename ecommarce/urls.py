from django.urls import path

from . import views

urlpatterns=[
    path('searchpanel',views.searchpanel, name='searchpanel'),
    path('autoComlleteSearch',views.autoComlleteSearch, name='autoComlleteSearch'),
    path('marketing',views.marketing, name='marketing'),
    path('marketingBanner',views.marketingBanner, name='marketingBanner'),
    path('getPlaceusers',views.getPlaceusers, name='getPlaceusers'),

    path('addBannerDetails',views.addBannerDetails, name='addBannerDetails'),
    path('DeletePost',views.DeletePost, name='DeletePost'),

    path('descImg',views.descImg, name='descImg'),
    path('descDoc',views.descDoc, name='descDoc'),
    path('getDescImages',views.getDescImages, name='getDescImages'),
    path('removeFiles',views.removeFiles, name='removeFiles'),

    # path('getImgs',views.getImgs, name='getImgs'),

    path('allBanners',views.allBanners, name='allBanners'),
    path('itmsWithPlace',views.itmsWithPlace, name='itmsWithPlace'),
    path('servedItems',views.servedItems, name='servedItems'),
    path('servedVendors',views.servedVendors, name='servedVendors'),
    path('saveVendor',views.saveVendor, name='saveVendor'),
    path('biz_banner',views.biz_banner, name='biz_banner'),
    

]