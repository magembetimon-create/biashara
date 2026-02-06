from django.urls import path

from . import views

urlpatterns=[
    path('register',views.register, name='register'),
    path('getKata',views.getKata, name='getKata'),
    path('confirmMail',views.confirmMail, name='confirmMail'),
    path('register2',views.register2, name='register2'),
    path('saveuserimg',views.saveuserimg, name='saveuserimg'),

    path('login',views.login, name='login'),
    path('fogotpwd',views.fogotpwd, name='fogotpwd'),
    path('confirmMailPwdFoggot',views.confirmMailPwdFoggot, name='confirmMailPwdFoggot'),
    path('passWordResset',views.passWordResset, name='passWordResset'),
    path('changePwd',views.changePwd, name='changePwd'),

    path('',views.welcome, name='welcome'),
    path('terms',views.terms, name='terms'),
    path('termprivacypolice',views.termprivacypolice, name='termprivacypolice'),
    path('help',views.help, name='help'),

    path('userdash',views.userdash, name='userdash'),
    path('posts',views.posts, name='posts'),
    path('vistFromBanner',views.vistFromBanner, name='vistFromBanner'),
    path('UpdateVist',views.UpdateVist, name='UpdateVist'),
    path('loadPosts',views.loadPosts, name='loadPosts'),
    path('seenBanner',views.seenBanner, name='seenBanner'),

    path('userpwd',views.userpwd, name='userpwd'),
    path('logout',views.logout, name='logout'),
    path('userdetails',views.userdetails, name='userdetails'),
    path('ChangeUserPlace',views.ChangeUserPlace, name='ChangeUserPlace'),
    
    path('search_member',views.search_member, name='search_member'),
    path('addStaff_form',views.addStaff_form, name='addStaff_form'),

    # Users & imployees
    path('Employees',views.Employees, name='Employees'),
    path('EmployeeDetails',views.EmployeeDetails, name='EmployeeDetails'),
    path('getWorkers',views.getWorkers, name='getWorkers'),
    path('getstaffdata',views.getstaffdata, name='getstaffdata'),
    path('userImgAdd',views.userImgAdd, name='userImgAdd'),
    path('deleteuser',views.deleteuser, name='deleteuser'),

    path('RemoveAttach',views.RemoveAttach, name='RemoveAttach'),
    path('AddEmployeeAttachments',views.AddEmployeeAttachments, name='AddEmployeeAttachments'),

    path('traceChange',views.traceChange, name='traceChange'),
    path('updatepermissions',views.updatepermissions, name='updatepermissions'),

    path('interpnav/<int:intp>',views.interpnav, name='interpnav'),
    path('entpreg',views.entpreg, name='entpreg'),
    path('checkToken',views.checkToken, name='checkToken'),
    path('ActiveWarehouse',views.ActiveWarehouse, name='ActiveWarehouse'),

    # settings............
    # language
    path('langSet',views.langSet, name='langSet'),

    # INTERPRISE PROFILE
    path('biz_prof',views.biz_prof, name='biz_prof'),
    path('addOfficeNo',views.addOfficeNo, name='addOfficeNo'),
    path('showPersonalNo',views.showPersonalNo, name='showPersonalNo'),
    
    # INTERPRISE PROFILE PICTURE
    path('entprof_pic',views.entprof_pic, name='entprof_pic'),

    # INTERPRISE LOGO
    path('entlogo_pic',views.entlogo_pic, name='entlogo_pic'),

    # INTERPRISE REG PICTURE
    path('regPic',views.regPic, name='regPic'),

    # INTERPRISE POSTER
    path('poster_sound',views.poster_sound, name='poster_sound'),

    # INTERPRISE POSTER
    path('setPoster',views.setPoster, name='setPoster'),

    # INTERPRISE POSTER
    path('RemovePoster',views.RemovePoster, name='RemovePoster'),

    # INTERPRISE REGISTRATIONS......................//
    path('Buzi_reg',views.Buzi_reg, name='Buzi_reg'),


    # INTERPRISE REGISTRATIONS REMOVAL......................//
    path('remove_reg',views.remove_reg, name='remove_reg'),

    # HUDUMA NYINGINE......................//
    path('addHuduma',views.addHuduma, name='addHuduma'),
    path('SetActivity',views.SetActivity, name='SetActivity'),

#    MAREKEISHO YA KODI
    path('taxes_reg',views.taxes_reg, name='taxes_reg'),
    path('tax_settings',views.tax_settings, name='tax_settings'),
    path('saleVatSet',views.saleVatSet, name='saleVatSet'),

    #MAREKEISHO YA RISITI
    path('Risiti_Settings',views.Risiti_Settings, name='Risiti_Settings'),
    path('update_invo_desc',views.update_invo_desc, name='update_invo_desc'),
    path('setInVoFormat',views.setInVoFormat, name='setInVoFormat'),
    path('setplace',views.setplace, name='setplace'),
    path('getPlaceCells',views.getPlaceCells, name='getPlaceCells'),
    
    #WEKA LOGO KWENYE RISITI....................//
    path('setlogo_to_log',views.setlogo_to_log, name='setlogo_to_log'),

    #WEKA USAJIRI KWENYE RISITI....................//
    path('setreg_to_invo',views.setreg_to_invo, name='setreg_to_invo'),

    #WEKA NAMBA ZA SIMU KWENYE RISITI....................//
    path('setphone_to_invo',views.setphone_to_invo, name='setphone_to_invo'),

    # USERS PERSONAL SETTINGS.....................//
    path('userprofile',views.userprofile, name='userprofile'),

    # SELECT BUSINESS ACC................................//
    path('busines_ac',views.busines_ac, name='busines_ac'),
    path('activateEnterp',views.activateEnterp, name='activateEnterp'),
    path("checkUser",views.checkUser, name="checkUser"),
    path("activateThis",views.activateThis, name="activateThis"),
    
    #delete user.................................//
    path('deleteInt',views.deleteInt, name='deleteInt'),

    #Business Profile.................................//
    path('buzinessProfile',views.buzinessProfile, name='buzinessProfile'),
    path('buzinessTerms',views.buzinessTerms, name='buzinessTerms'),
    path('SaveTerms',views.SaveTerms, name='SaveTerms'),

    #Business Profile About.................................//
    path('profileAbout',views.profileAbout, name='profileAbout'),
    path('loadRatings',views.loadRatings, name='loadRatings'),
    path('profileRegistration',views.profileRegistration, name='profileRegistration'),

    path('displayProfItems',views.displayProfItems, name='displayProfItems'),
    path('searchFromIntp',views.searchFromIntp, name='searchFromIntp'),

    path('displaySelItem',views.displaySelItem, name='displaySelItem'),
    path('UserSaveItem',views.UserSaveItem, name='UserSaveItem'),

  
    # Delivery Agent
    path('getItemData',views.getItemData, name='getItemData'),
    path('getAgentdata',views.getAgentdata, name='getAgentdata'),
    path('addDeliveryAgent',views.addDeliveryAgent, name='addDeliveryAgent'),

    # Notifications
    path('notify',views.notify, name='notify'),
    path('notificationing',views.notificationing, name='notificationing'),

    # Chats
    path('getUserChats',views.getUserChats, name='getUserChats'),
    path('AllChats',views.AllChats, name='AllChats'),
    path('sendChat',views.sendChat, name='sendChat'),
    path('sendAudioChat',views.sendAudioChat, name='sendAudioChat'),
    path('markReadChat',views.markReadChat, name='markReadChat'),
    path('futatext',views.futatext, name='futatext'),
    path('asQuestion',views.asQuestion, name='asQuestion'),
    path('toaSwari',views.toaSwari, name='toaSwari'),

    path('countVistors',views.countVistors, name='countVistors'),
    path('searchAll',views.searchAll, name='searchAll'),
    path('sendIt',views.sendIt, name='sendIt'),
    path('setDarkMode',views.setDarkMode, name='setDarkMode'),
    path('dpoPay',views.dpoPay, name='dpoPay'),

]

