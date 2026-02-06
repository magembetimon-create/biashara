
// pwd strength

// this will hold a value that detect whether the user has alreard selected a supllier by holding the state value
 class users_mangi{
    constructor(_state){
        this.stated=_state
    }
    get state(){
      return this.stated
    }
  
    set state(newstate){
       this.stated=newstate
  
    }
  
  }
 var usr_mngg=[],
     usr_mng = new users_mangi(usr_mngg)

     
var PICHA = [],
    picha = id => PICHA.find(i=>i.id===id).picha


$(document).ready(function () {  
    $('#password').keyup(function () {  
        $('#strengthMessage').html(checkStrength($(this).val()))  
    })  
    function checkStrength(password) {  
        var strength = 0  
        if (password.length < 6) {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Short')
            $("#changepwd").prop("disabled",true) 
  
            return lang('Dhaifu mno!','very weak !')  
        }  
        if (password.length > 7) strength += 1  
        // If password contains both lower and uppercase characters, increase strength value.  
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1  
        // If it has numbers and characters, increase strength value.  
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1  
        // If it has one special character, increase strength value.  
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1  
        // If it has two special characters, increase strength value.  
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1  
        // Calculated strength value, we can return messages  
        // If value is less than 2  
        if (strength < 2) {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Weak') 
            $("#changepwd").prop("disabled",false) 
 
            return lang('Dhaifu !','Weak')  
        } else if (strength == 2) {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Good') 
            $("#changepwd").prop("disabled",false) 
            return lang('Angalau !','At least')  
        } else {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Strong')  
            $("#changepwd").prop("disabled",false) 

            return lang('Makini !','strong')
            
        }  
    }  
});  
 
 
 $('#changepwd').click(function(e) {
    e.preventDefault();
if($('#confirmpassword').val() ==$('#password').val()){
    $("#userpw").modal('hide');

    $("#loadMe").modal('show');

 var post_url = $('#change_pwd').attr("action");


 $.ajax({
   type: "POST",
   url: post_url,
    data: {
        newpass: $('#password').val(),
        oldpass:$('#ogpassword').val(),
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
 }).done(function(data) {
    $('#change_pwd').trigger("reset");

if(data.success==true){
    toastr.success(lang('Neno la siri limebadilishwa kikamilifu.','Password Chaged Successfully'), 'Success Alert', {timeOut: 2000});

}else{
        toastr.error(lang(`Neno la siri halijabadilishwa kutokana na kukosea neno la siri la awali.`,`Password could'nt  be changed due to wrong current password` ), 'Error Alert', {timeOut: 2000});

}

$("#confirmpassword , #password").removeClass('redborder')
$('#strengthMessage').html('')
$('#strengthMessage').removeClass()

$("#loadMe").modal('hide');
hideLoading()

   // check the html and use that to determine what message to prompt back to your user
 });

 } else{
$("#confirmpassword , #password").addClass('redborder')
$('#passerror').html("<label class='text-danger'><ion-icon name=\"warning-outline\"></ion-icon> uhakiki wa neno jipya la siri haufanani </label>")
}
 })


//  updating user details
$('#userdetails').submit(function(e){
    e.preventDefault();
    $("#loadMe").modal('show');
    var post_url = $(this).attr("action");
    $.ajax({
        type: "POST",
        url: post_url,
         data: {
             first_name: $('#name1').val(),
             last_name:$('#name2').val(),
             emal:$('#exampleInputEmail1').val(),
             cheo:$('#cheoUser').val(),
             simu2:$('#simu2').val(),
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
         },
      }).done(function(data) {
        $("#loadMe").modal('hide');
          hideLoading()
        if(data.success){
             $('.userdetail').each(function(){
                 if($(this).val()!=$(this).attr("value")){
                      $(this).attr("value",$(this).val())
                      toastr.success('Umefanikiwa kubadili '+$(this).attr('ya')+'.', 'Success Alert', {timeOut: 2000});
                 }
        })


        }else{
           toastr.error('Mabadiliko ya taarifa zako hayajafanikiwa tafadhari jaribu tena.', 'error Alert', {timeOut: 2000});
     
        }

       



      })
   
})



class getstaff{

    constructor(_data){
       
        this.data = _data;
    }

    allstaff(){



         var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
           type: "POST", // if you choose to use a get, could be a post
           url: "/getstaffdata",
           data: {csrfmiddlewaretoken:csrfToken}
    }).done(function(data){
        PICHA =  data.images
        

         let udt =``,
             asist=data.assist 
         usr_mng.state=data.users       
         data.users.forEach(ud => {
            //  console.log(moment(data.date.now1)-moment(ud.online))
            let d1 = new Date(data.date.now1),
                d2 = new Date(ud.online),
                di = d1 - d2,
                d_d = di/(1000*60*60*24)



            // console.log({'now':moment(data.date.now1).format('LTS'),"last":moment(ud.online).format('LTS'),'diff':di/60000})
             udt+=`
             <div  class="d-flex px-2 mt-3 ">
             <div>`
             
             if(ud.picha!=''){
                udt+=`<img src="${picha(ud.id)}" class="rounded-circle" alt="img" style="width:40px;height:40px;border:2px solid rgb(186, 191, 197);">`
             }else{
               udt+='<img src="/static/pics/userlogo.png" alt="no piic" class="rounded-circle" style="width:30px;height:30px">' 
             }
              
              if(di/1000 <=10 ) {
                  udt+=`<div class="bg-success position-relative rounded-circle" style="margin-top:-17px;margin-left:28px;height: 13px;width:13px;border:2px solid #fff"></div>`
              }
                  
              udt+=`</div>


             <a  type="button"`
              if(!ud.owner){
                  udt+=`data-toggle="modal" data-target="#user_permi" `
              }
                  
              
              
              udt+=`data-val=${ud.id} data-assist=${asist} class="name user_per px-0" style="min-width:145px" >
            
                    <div class="p-2" style="font-weight: 600;margin-top:-14px;color:rgb(42, 109, 255)" >${ud.first_name.charAt(0).toUpperCase()+ud.first_name.slice(1)}  ${ud.last_name.charAt(0).toUpperCase()+ud.last_name.slice(1)}</div>
                     <div class="p-2 fontColor" style="font-weight: 500;margin-top:-18px;font-size:11px" >
                  `
            
             if(di/1000 <=10) {
               udt+=`${lang('Online kuanzia','online from')} ${moment(ud.last_log).format('HH:mm')}`
             }

             if(di/1000>10 && moment(ud.online).format('YYMMDD')==moment(d1).format('YYMMDD')){
                 udt+=`${lang('Mwisho kutumia leo ','last seen today ')} ${moment(ud.online).format('HH:mm')}`
               
             }

             if(moment(ud.online).format('YYMMDD')!=moment(d1).format('YYMMDD') && d_d <=1  ){
                 udt+=`${lang('Mwisho kutumia jana ','last seen Yesterday ')} ${moment(ud.online).format('HH:mm')}`
             }
             if( d_d > 1 && d_d <= 6 ){
                 udt+=`${lang('Mwisho kutumia  ','last seen ')} ${moment(ud.online).format('dddd')}, ${moment(ud.online).format('HH:mm')}`
             }
             if(  d_d > 6 ){
                 udt+=`${lang('Mwisho kutumia  ','last seen ')} ${moment(ud.online).format('lll')}`
             }

            
             udt+=`</div></a>
              
             <div class="pr-2" >`
           if(!ud.owner){
               udt+= `<div class="onoffswitch mr-5">
             <form action="/updatepermissions" method="POST" data-value=${ud.id} data-change="Allow">`
              
                 udt+=`<input type="checkbox"` 
                 if(ud.Allow){
                  udt+=`checked `  
                 }
                 udt+=`name="onoffswitch"  class="onoffswitch-checkbox changePemit" id="myonoffswitch${ud.id}" tabindex="0"  >
              
               <label class="onoffswitch-label" for="myonoffswitch${ud.id}">
                   <span class="onoffswitch-inner"></span>
                   <span class="onoffswitch-switch"></span>
               </label>
               </form>
              </div>`
           }
           

             udt+=`
              <button class="btn btn-default btn-sm" onclick="getChats(${ud.to})" style="margin-top:-18px" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                    </svg>
              </button>
             </div>
           </div>     
             `
         });
        $('#staffs').html(udt) 
        $('#storeUseronline').text(data.online) 

        $('.stafflist').each(function(){
                

            if($(this).data("view")=="True" || $(this).data("allowed")=="False"  ){
                $(this).css('opacity',.3)
                $(this).children('li').find('input').prop('disabled',true)
            }else{
                 $(this).css('opacity',1)
                $(this).children('li').find('input').prop('disabled',false)
           
            }
        })


    });

   


}
}




$('body').on('click','.user_per', function () {
    
    const val=$(this).data('val'),fetch = v=>v.id===val,
          ud = usr_mng.state.find(fetch),
          assist = $(this).data('assist')
          let us = ``
          us+=`<div class="user_details d-flex p-2">
                <div class="img_wrapper mt-3">`
                  if(ud.picha!=''){
                    us+=`<img src="${picha(ud.id)}" class="rounded-circle" style="width: 65px;height:65px;border:2px solid rgb(194, 211, 241)" alt="no image">`
                  }else{
                    us+=`<img src="/static/pics/userlogo.png" class="rounded-circle" alt="no piic" style="width: 65px;height:65px;border:2px solid rgb(194, 211, 241)">`

                  }
         us+=`</div>
           <!-- <div class="name_user ml-2">
           </div> -->
           <div class="name_user ml-3 pl-2 border-left">
                  <p class="p-1" style="font-weight: 700;font-size:large">${ud.first_name.charAt(0).toUpperCase()+ud.first_name.slice(1)}  ${ud.last_name.charAt(0).toUpperCase()+ud.last_name.slice(1)}</p>
                  <p class="p-1" style="margin-top: -18px;font-weight: 700;">  ${ud.sim1}   ${ud.sim2} </p>
                  <p style="margin-top: -18px;" >${ud.cheo.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</p>
         
              </div>
              
  </div>

<hr>
    <h6> ${lang('Ruhusa Kwa ujumla','General Permissions')}</h6>
        
  <ul class="list-unstyled px-md-3  px-1">

      <li class=" smallFont font-weight-bold text-danger">${lang('Kuingia akaunti ya Biashara',' To Enter this Interprise Account')} <sup>*</sup>  <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="Allow" action="/updatepermissions"  method="POST">
                 <input type="checkbox"  name="onoffswitch-t2" `
                     if(ud.Allow ){ 
                         us+=`checked`
                     } 
                    us+=`
                        onchange="if($(this).prop('checked')){ $('.stafflist').data('allowed','True') }else{$('.stafflist').data('allowed','False')}"  
                        class="onoffswitch-checkbox-t2 changePemit" id="myonoffswitch1" tabindex="0">`
                       

                  us+=`<label class="onoffswitch-label-t2" for="myonoffswitch1">
                      <span class="onoffswitch-inner-t2"></span>
                      <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>
  </ul>
  

  <ul class="list-unstyled  px-1  px-md-3" data-view="${ud.viewi}" data-allowed="$${ud.Allow}">
  
    
      
      <li class="robotoFont smallFont text-danger">${lang('Asifanye Oparesheni yeyote','Not to do any operation')}  
      <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="viewi" action="/updatepermissions"  method="POST">
                   <input type="checkbox" name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="onlyview${ud.id}"
                   onchange="if($(this).prop('checked')){ $('.stafflist').data('allowed','False') }else{$('.stafflist').data('allowed','True')}" 
                   ` 
                   if(ud.viewi) {   us+=`checked`    }
                    us+=` tabindex="0">
                        <label class="onoffswitch-label-t2" for="onlyview${ud.id}">
                            <span class="onoffswitch-inner-t2"></span>
                            <span class="onoffswitch-switch-t2"></span>
                        </label>
              </form>
            </div>
          </span>
      </li>
      
      </ul>
  <hr>

  <h6> ${lang('Ruhusa Stoku','Stock Permissions')}</h6>
  <ul class="list-unstyled stafflist px-1 px-md-3" data-view="${ud.viewi}" data-allowed="$${ud.Allow}" `
  
  if(!ud.Allow || ud.viewi ){
          us+=`style="opacity:0.3"`
      }
    us+=`>
      <li class="robotoFont py-2  smallFont">
      ${lang('kuongeza Bidhaa  ','To add items')}
      
      <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="addproduct" action="/updatepermissions"  method="POST">
                   <input type="checkbox" name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="items_add${ud.id}"` 
                   if(ud.addproduct) {us+=`checked`}
                    us+=` tabindex="0">
                        <label class="onoffswitch-label-t2" for="items_add${ud.id}">
                            <span class="onoffswitch-inner-t2"></span>
                            <span class="onoffswitch-switch-t2"></span>
                        </label>
              </form>
            </div>
          </span>
      </li>
      
      <li class="robotoFont py-1 smallFont"> ${lang('kubadili vielelezo  vya bidhaa',"To change item features")}  <span style="float:right;margin-right:3%">
      <div class="onoffswitch-t2">
          <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="product_edit" action="/updatepermissions"  method="POST">
             <input type="checkbox"  `
               if(ud.product_edit) {us+=`checked ` } 
                us+=`name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="myonoffswitch-t2${ud.id}" tabindex="0">
                  <label class="onoffswitch-label-t2" for="myonoffswitch-t2${ud.id}">
                  <span class="onoffswitch-inner-t2"></span>
                  <span class="onoffswitch-switch-t2"></span>
              </label>
          </form>
      </div>
      </span>
  </li>

 
  <li class="robotoFont py-2 smallFont"> ${lang('Kuongeza Picha/maelezo ya bidhaa','To add item images/Item description')} <span style="float:right;margin-right:3%">
      <div class="onoffswitch-t2">
          <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="picDescription" action="/updatepermissions"  method="POST">
          <input type="checkbox"  ` 
           if(ud.picDescription){us+=`checked ` } 
               us+=`name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="pic-t2${ud.id}" tabindex="0">
                  <label class="onoffswitch-label-t2" for="pic-t2${ud.id}">
                  <span class="onoffswitch-inner-t2"></span>
                  <span class="onoffswitch-switch-t2"></span>
              </label>
          </form>
      </div>
      </span>
  </li>


  <li class="robotoFont py-1 smallFont">${lang(' Marekebisho stoku   ',' Stock Adjustments ')} 
  <span style="float:right;margin-right:3%">
      <div class="onoffswitch-t2">
          <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="stokAdjs" action="/updatepermissions"  method="POST">
               <input type="checkbox" name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="stokAdjs${ud.id}"` 
               if(ud.stokAdjs) {us+=`checked`}
                us+=` tabindex="0">
                    <label class="onoffswitch-label-t2" for="stokAdjs${ud.id}">
                        <span class="onoffswitch-inner-t2"></span>
                        <span class="onoffswitch-switch-t2"></span>
                    </label>
          </form>
        </div>
      </span>
  </li>

  <li class="robotoFont py-2 smallFont">${lang(' Kuhamisha Bidhaa  ',' Items transfer ')} 
  <span style="float:right;margin-right:3%">
      <div class="onoffswitch-t2">
          <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="hamisha" action="/updatepermissions"  method="POST">
               <input type="checkbox" name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="hamisha${ud.id}"` 
               if(ud.hamisha) {us+=`checked`}
                us+=` tabindex="0">
                    <label class="onoffswitch-label-t2" for="hamisha${ud.id}">
                        <span class="onoffswitch-inner-t2"></span>
                        <span class="onoffswitch-switch-t2"></span>
                    </label>
          </form>
        </div>
      </span>
  </li>

  <li class="robotoFont py-1 smallFont">${lang('Uzalishaji/Uchakataji wa Bidhaa  ',' Items Manufacturing/Processing')} 
  <span style="float:right;margin-right:3%">
      <div class="onoffswitch-t2">
          <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="prodxn" action="/updatepermissions"  method="POST">
               <input type="checkbox" name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="prodxn${ud.id}"` 
               if(ud.prodxn) {us+=`checked`}
                us+=` tabindex="0">
                    <label class="onoffswitch-label-t2" for="prodxn${ud.id}">
                        <span class="onoffswitch-inner-t2"></span>
                        <span class="onoffswitch-switch-t2"></span>
                    </label>
          </form>
        </div>
      </span>
  </li>
</ul>

  <hr>


<h6> ${lang('Ruhusa Kwa Mauzo','Sales Permission')}</h6> 
<ul class="list-unstyled stafflist px-1 px-md-3" data-view="${ud.viewi}" data-allowed="$${ud.Allow}" `
  if(!ud.Allow || ud.viewi ){
          us+=`style="opacity:0.3"`
      }
    us+=`>
    
      <li class="robotoFont smallFont">${lang('kurekodi taarifa za mauzo  ','To record sales')} 
      <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="mauzo_na_matumizi" action="/updatepermissions"  method="POST">
                   <input type="checkbox" name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="myonoffswitch1-t2${ud.id}"` 
                   if(ud.mauzo_na_matumizi) {us+=`checked`}
                    us+=` tabindex="0">
                        <label class="onoffswitch-label-t2" for="myonoffswitch1-t2${ud.id}">
                            <span class="onoffswitch-inner-t2"></span>
                            <span class="onoffswitch-switch-t2"></span>
                        </label>
              </form>
            </div>
          </span>
      </li>

      </ul>
      <hr>


<h6> ${lang('Manunuzi na matumizi','Purchase & Expenses')}</h6> 
        <ul class="list-unstyled stafflist px-1 px-md-3" data-view="${ud.viewi}" data-allowed="$${ud.Allow}" `
        if(!ud.Allow || ud.viewi ){
                us+=`style="opacity:0.3"`
            }
            us+=`>
      <li class="robotoFont py-2 smallFont">${lang('kurekodi taarifa za manunuzi ','To record Bills ')}  <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="kununua" action="/updatepermissions"  method="POST">
                 `
                
                    us+=`<input type="checkbox"`  
                       if(ud.kununua){us+=`checked`} 
                       us+=` name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="myonoffswitch2-t2${ud.id}" tabindex="0">
                            <label class="onoffswitch-label-t2" for="myonoffswitch2-t2${ud.id}">
                            <span class="onoffswitch-inner-t2"></span>
                            <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>
   
      <li class="robotoFont py-1 smallFont">${lang('Kuagiza bidhaa kwa ajili ya stoku ','Ordering items for Wherehouse')}  <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="manunuziOda" action="/updatepermissions"  method="POST">
                 `
                
                    us+=`<input type="checkbox"`  
                       if(ud.manunuziOda){us+=`checked`} 
                       us+=` name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="myonoffswitch21-t2${ud.id}" tabindex="0">
                            <label class="onoffswitch-label-t2" for="myonoffswitch21-t2${ud.id}">
                            <span class="onoffswitch-inner-t2"></span>
                            <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>
      
      <li class="robotoFont py-2 smallFont">${lang('kurekodi taarifa za matumizi','To record Expenses ')}  <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="expenses" action="/updatepermissions"  method="POST">
                 `
                
                    us+=`<input type="checkbox"`  
                       if(ud.expenses){us+=`checked `} 
                       us+=` name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="recodigalama${ud.id}" tabindex="0">
                            <label class="onoffswitch-label-t2" for="recodigalama${ud.id}">
                            <span class="onoffswitch-inner-t2"></span>
                            <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>

      </ul>
     <hr>

    <h6> ${lang('Wasifu wa Biashara','Interprise Plofile')}</h6> 
      <ul class="list-unstyled stafflist px-1 px-md-3" data-view="${ud.viewi}" data-allowed="$${ud.Allow}" `
        if(!ud.Allow || ud.viewi ){
                us+=`style="opacity:0.3"`
            }
          us+=`>
      <li class="robotoFont py-2 smallFont">${lang('Kubadili Muonekano wa profile','To change Interprise Profile')} <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="profile" action="/updatepermissions"  method="POST">
                   <input type="checkbox"`
                   if(ud.profile) {us+=`checked `}
                   us+=`name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="prof-t2${ud.id}" tabindex="0">
                       <label class="onoffswitch-label-t2" for="prof-t2${ud.id}">
                      <span class="onoffswitch-inner-t2"></span>
                      <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>
      

      <li class="robotoFont py-1 smallFont">${lang('Kuweka picha ya Biashara','To change Profile picture')} <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="prof_picture" action="/updatepermissions"  method="POST">
                   <input type="checkbox"`
                   if(ud.prof_picture && ud.profile) {us+=`checked `}
                   
                   us+=`name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="prof-pic${ud.id}" tabindex="0">
                       <label class="onoffswitch-label-t2" for="prof-pic${ud.id}">
                      <span class="onoffswitch-inner-t2"></span>
                      <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>

      <li class="robotoFont py-2 smallFont">${lang('Kuweka/kubadili logo ya Biashara','To change Profile logo')} <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="logo" action="/updatepermissions"  method="POST">
                   <input type="checkbox"`
                   if(ud.logo && ud.profile) {us+=`checked `}
                   
                   us+=`name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="prof-logo${ud.id}" tabindex="0">
                       <label class="onoffswitch-label-t2" for="prof-logo${ud.id}">
                      <span class="onoffswitch-inner-t2"></span>
                      <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>
   </ul>
      
    <h6> ${lang('Malipo','Payments')}</h6> 
        <ul class="list-unstyled stafflist px-1 px-md-3" data-view="${ud.viewi}" data-allowed="$${ud.Allow}" `
        if(!ud.Allow || ud.viewi ){
                us+=`style="opacity:0.3"`
            }
            us+=`>

      <li class="robotoFont py-2 smallFont">${lang('Rekodi Miamara','To record Cash transactions')} <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="miamala_Rekodi" action="/updatepermissions"  method="POST">
                   <input type="checkbox"`
                   if(ud.miamala_Rekodi) {us+=`checked `}
                   us+=`name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="rmiamala${ud.id}" tabindex="0">
                       <label class="onoffswitch-label-t2" for="rmiamala${ud.id}">
                      <span class="onoffswitch-inner-t2"></span>
                      <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>
     

      <li class="robotoFont py-1 smallFont">${lang('Onesha miamara ya siri','Show invisible cash transactions')} <span style="float:right;margin-right:3%">
          <div class="onoffswitch-t2">
              <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="miamala_siri_show" action="/updatepermissions"  method="POST">
                   <input type="checkbox"`
                   if(ud.miamala_siri_show) {us+=`checked `}
                   
                   us+=`name="onoffswitch-t2" class="onoffswitch-checkbox-t2 changePemit" id="smiamala${ud.id}" tabindex="0">
                       <label class="onoffswitch-label-t2" for="smiamala${ud.id}">
                      <span class="onoffswitch-inner-t2"></span>
                      <span class="onoffswitch-switch-t2"></span>
                  </label>
              </form>
          </div>
          </span>
      </li>
      <hr>

  </ul>
`
        if(assist == 0){

        us+=`<div class="check-wraper p-3">
                <label class="control control-checkbox">
                <span class="robotoFont smallFont">Awe msaidizi wa Admin</span>
                <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="msaidizi" action="/updatepermissions"  method="POST">
                    <input class="changePemit" type="checkbox" id="AkauntAllower${ud.id}"  />     
                    <div class="control_indicator"></div>
                </form>
                </label>
        </div>`
        }

  
    if(ud.msaidizi){
                us+=`<div class="check-wraper px-3">'
                      <label class="control control-checkbox">
                      <span class="robotoFont smallFont">${lang('Msaidizi wa admin','Admin Assistant')}</span>
                      <form data-toggle="validator" class="togleparentuso" data-value=${ud.id} data-change="msaidizi" action="/updatepermissions"  method="POST">
                      
                         <input class="changePemit" 

                         checked 
                         
                         type="checkbox" id="AkauntAllower${ud.id}"  />    
                      <div class="control_indicator"></div>
                      </form> 
                      </label>
                  </div>
                      <!-- full admin Control -->
                  <div class="check-wraper px-3">'
                     <label class="control control-checkbox">'
                      <span class="robotoFont smallFont">${lang('Rusuhu kuwa msimamizi kwa akaunti ya biashara hii','Allow to take full control to this Interprise account')}</span>
                      <form data-toggle="validator" class="togleparentuso" data-value="${ud.id}" data-change="fullcontrol" action="/updatepermissions"  method="POST">
                         <input class="changePemit" `
                       if (ud.fullcontrol && !ud.viewi) {us+=`checked`}
                         us+=` type="checkbox" id="fullcontrol${ud.id}"  />
                           
                          <div class="control_indicator"></div></form>  
                      </label>
                      </div>`
                 
  
                   }   
     
           us+=`<div class="mb-3 px-3">
             <form action="/deleteuser" id="muondoe_" data-id=${ud.id} method="POST">
              <button type="submit"  class="btn-danger btn btn-sm smallFont robotoFont ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash" viewBox="0 0 16 16">
                      <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                      <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                  Ondoa
              </button>
             </form> 
         </div>`

         $('#user_manage_data').html(us)

           
    
});


let getstaffobj= new getstaff()
getstaffobj.allstaff()

//search Member....................//
$('body').on('click','.search_member',function (){ 
    let form = $(this).data('form'),
        val  =  $(this).siblings('input'),
        code = val.val(),
        load = $(this).data('load'),
        agent =Number($(this).data('agent'))  ||  0 ,
        memberi =Number($(this).data('member')) || 0


    $(form).prop('hidden',true)

    

    if(code==''){
      redborder(`#${val.attr('id')}`)

    }else{
        $(load).fadeIn(400)
       let data={
            data:{
                code:code,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            url:'/search_member'
    }

     
    $.ajax({
        type: "POST",
        url: data.url,
        data: data.data,
        
        success: function (us) {
            $(load).fadeOut(100)
            if(us.success){
                let user = us.user[0]
                if(memberi){
                    placeUserInfo(user)
                   
                }
                 

                if(agent){
                    placeAgentInfo(user)
                    
                }
                  
            }else{
                toastr.error(lang(us.msg_swa,us.msg_eng), lang('Haijafanikiwa','Error'), {timeOut: 2000});

            }
        }
    });

    }
    
 })


 

function placeUserInfo(user){
      if(user.picha!=''){
                    $('#placeUser_img').html(`                 
                    <img class="classic_div" style="border:1px solid #0085dd;width:100%" src="/media/${user.picha}" alt="">
                    `)
                }
                
                $('#f_name').val(user.first_name)
                $('#l_name').val(user.last_name)
                $('#staffsimu').val(user.phone)
                $('#member_code').data('val',user.id)
                $('#savestaff_form').prop('hidden',false)
                $('#user_addressed').text(`${user.mtaa}, ${user.wilaya}, ${user.mkoa}`)
                
}

function placeAgentInfo(user){
      if(user.picha!=''){
                    $('#placeAent_img').html(`                 
                    <img class="classic_div" style="border:1px solid #0085dd;width:100%" src="/media/${user.picha}" alt="">
                    `)
                }
                
                $('#agent_f_name').val(user.first_name)
                $('#agent_l_name').val(user.last_name)
                $('#Aggent_phone').val(user.phone)
                $('#agent_code').data('val',user.id)
                $('#saveDAgent_form').prop('hidden',false)
                $('#agent_addressed').text(`${user.mtaa}, ${user.wilaya}, ${user.mkoa}`)
                
}


$('body').on('click','#muondoe_',function(e){
    e.preventDefault()
    
    $('#user_permi').modal('show')
    let form_ulr=$(this).attr('action'),
        csrfToken = $('input[name=csrfmiddlewaretoken]').val()
if(confirm(lang('Ondo Mtumiaji ?','Remove User?'))){
    $.ajax({
        url :form_ulr,
        data:{csrfmiddlewaretoken: csrfToken,
            value: $(this).data('id')
        },
        type: "POST",

        success: function(data) {
            if(data.done){
                toastr.success(lang('Mtumiaji ameondolewa','User Removed'), lang('Imefanikiwa','Success'), {timeOut: 2000});
                isset.state=false

                getstaffobj.allstaff()
                $('#user_permi').modal('hide')

            }else{
                toastr.error(lang('Mtumiaji Hajaondolewa','User was not removed'), lang('Haikufanikiwa','Error'), {timeOut: 2000});
      
            }

        }

    }) 
 }
})
// close site avoid



   
 	
$(".newstaff").keyup(function(){
    if($(this).val()!=''){
        $(this).removeClass('redborder')
    }
})
// Insernting images

  // form upload
  $('#saveuserimg').submit(function(e){
    e.preventDefault();
    const imgfile = document.getElementById('userpic'),
          img = imgfile.files[0],
          url = $(this).attr('action')

          if(Number(img.size/1024) <= 490){
            IMGFORM.append('IMG',img)
            let theData = {url}
                        ImageUpload(theData)
            
            }else{
            compressImg({img,url})
            }

});
// end





$('.userdetail').keyup(function(){
    
       if($(this).val()!=$(this).attr("value")){
           $('#savechanges').prop('disabled',false)
       }

})



// set staff permissions
$('body').on("change", '.changePemit', function(){
    //  $("#loadMe").modal('show');
         $('#permi-loader').show()
        var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
        post_url=$(this).parent('form').attr("action")

    var data1={
        csrfmiddlewaretoken: csrfToken,
        value:$(this).parent('form').data("value"),
        edit:$(this).parent('form').data("change"),
        state:Number($(this).prop('checked'))
    }   

    $.ajax({
        type: "POST",
        url: post_url,
         data: data1,
      }).done(function(data) {
        $('#permi-loader').hide()
         getstaffobj.allstaff()
        if(data1.edit=="viewi"){
          
            isset.state=false

        }

})

})

