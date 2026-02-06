
var kata = [], vijiji = [], valid = 0,validmail = false
//confirmation on register


$('#countries').change(function(){

	let c=$(this).val();
	     $(`#Kanda option ,#Mikoa option ,#Wilaya option`).hide()
	     $(`#Kanda option[data-nchi=0] ,#Mikoa option[data-nchi=0] ,#Wilaya option[data-nchi=0]`).show()
	     $(`#Kanda option[data-nchi=${c}] ,#Mikoa option[data-nchi=${c}] ,#Wilaya option[data-nchi=${c}]`).show()
	if(Number(c)>0){
		$(this).addClass('darkblue')
	}else{
		$(this).removeClass('darkblue')
	}
	$('#Kijiji').prop('disabled',true)
	$('#Kata').prop('disabled',true)
	$('#Kata').html($('#Kata').html())
	$('#Kijiji').html($('#Kijiji').html())

	checkValidity()
})


//check region
$('#Kanda').change(function(){
	let c=$(this).val();
	$('#Kijiji').prop('disabled',true)
    $('#Kata').prop('disabled',true)
	$('#Kata').html($('#Kata').html())
    $('#Kijiji').html($('#Kijiji').html())
	if(Number(c)>0){
		$(this).addClass('darkblue')
	}else{
		$(this).removeClass('darkblue')
	}
	   

	$('#Mikoa').html($('#Mikoa').html())
	$('#Wilaya').html($('#Wilaya').html())
	$('#Kata').html($('#Kata').html())
	$('#Kijiji').html($('#Kijiji').html())

	$(`#Mikoa option ,#Wilaya option`).hide()
	$(`#Mikoa option[value=0] ,#Wilaya option[value=0]`).show()
	$(`#Mikoa option[data-kanda=${c}] ,#Wilaya option[data-kanda=${c}]`).show()

	checkValidity()
});

//check distrik
$('#Mikoa').change(function(){


	let c=$(this).val(),k=$(this).find('option:selected').data('kanda');	
	$('#Kijiji').prop('disabled',true)
    $('#Kata').prop('disabled',true)
	$('#Kata').html($('#Kata').html())
    $('#Kijiji').html($('#Kijiji').html())
    
	if(Number(c)>0){
		$(this).addClass('darkblue')
	}else{
		$(this).removeClass('darkblue')
	}  
	
	
	$(`#Kanda`).val(k)
	
	$('#Wilaya').html($('#Wilaya').html())
	$('#Kata').html($('#Kata').html())
	$('#Kijiji').html($('#Kijiji').html())

	$(`#Wilaya option`).hide()
	$(`#Wilaya option[value=0]`).show()
	$(`#Wilaya option[data-mkoa=${c}]`).show()

	checkValidity()
});


$('#Wilaya').change(function(){
	let c=$(this).val(),k=$(this).find('option:selected').data('kanda');	
    $('#Kijiji').prop('disabled',true)
    $('#Kata').prop('disabled',true)
    $('#Kata').html($('#Kata').html())
    $('#Kijiji').html($('#Kijiji').html())

	if(Number(c)>0){
		$(this).addClass('darkblue')
	}else{
		$(this).removeClass('darkblue')
	}  

	dt = {
		data:{
			d:c,
			s:0
		},
		url:'/getKata'
	}
	const gt = POSTREQUEST(dt)
	gt.then(kt=>{
		
		let opt=`<option value=0 > ---${lang('Chagua Kata','Select Ward')}--- </option>`
		kt.kata.forEach(kk => {
			opt+=`<option value=${kk.id} >${(kk.kata).toLowerCase()}</option>`
		});

		$('#Kata').html(opt)
		$('#Kata').prop('disabled',!(kt.kata.length>0))
		$('#Kijiji').prop('disabled',true)
		
	}).fail((jqXHR, exception)=>{
		failRequest(jqXHR, exception)
	})

	checkValidity()
})

$('#Kata').change(function(){
	let c=$(this).val();	
    $('#Kijiji').prop('disabled',true)
	if(Number(c)>0){
		$(this).addClass('darkblue')
	}else{
		$(this).removeClass('darkblue')
	}  

	dt = {
		data:{
			d:0,
			s:c
		},
		url:'/getKata'
	}
	const gt = POSTREQUEST(dt)
	gt.then(kt=>{
		
		let opt=`<option value=0 > ---${lang('Chagua Mtaa/Kijiji','Select Street/Vilage')}--- </option>`
		kt.mitaa.forEach(kk => {
			opt+=`<option value=${kk.id} >${(kk.mtaa).toLowerCase()}</option>`
		});

		$('#Kijiji').html(opt)
		$('#Kijiji').prop('disabled',!(kt.mitaa.length>0))
	}).fail((jqXHR, exception)=>{
		failRequest(jqXHR, exception)
	})
	checkValidity()
})

$('#Kijiji').change(function(){
	const c = $(this).val()
	if(Number(c)>0){
		$(this).addClass('darkblue')
	}else{
		$(this).removeClass('darkblue')
	}  

	checkValidity()

	
})

$('#email').keyup(function(){
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
	    mail=$(this).val();
		if(mail.match(mailformat)){
			validmail = true
			$(this).removeClass('redborder')
		}else{
			validmail = false
			$(this).addClass('redborder')
		}
checkValidity()
})

$('#passwordConfirm').keyup(function(){
	const val = $(this).val(),
	      pwd = $('#password').val()
		  if(val==pwd && val!=''){
             $(this).removeClass('redborder')  
		  }else{
			$(this).addClass('redborder')
		  }
      checkValidity()
})

$('#f_name,#l_name').keyup(function(){
	checkValidity()
})

function checkValidity(){
	const f_name=$('#f_name').val(),
	      l_name = $('#l_name').val(),
		  male=$('#Male').prop('checked'),
		  female=$('#Female').prop('checked'),
		 // mail = $('#email').val(),
		  pconfirm = $('#passwordConfirm').val(),
		  pwd = $('#password').val(),
		  pers = $('#PersonalA').prop('checked'),

		  kijiji = $('#Kijiji').val(),
		  accept = $('#TermsCondition').prop('checked')

          

		  if((f_name!='' && (l_name!=''||!pers) && kijiji>0 && accept && validmail)&&(male||female || !pers)&&(pconfirm==pwd && valid>=60)){
			$('#submitBtn').prop('disabled',false)
		  }else{
			$('#submitBtn').prop('disabled',true)
		  }
}

$('body').on('click','#TermsCondition,#Male,#Female', function(){
	checkValidity()
})

$('#password').keyup(function () {  
	$('#strengthMessage').html(checkStrength($(this).val()))  
	let cpwd = $('#passwordConfirm').val()
	     if(cpwd!=''&& $(this).val()!=cpwd){
			$('#passwordConfirm').addClass('redborder')
		 }else{
			$('#passwordConfirm').removeClass('redborder')
		 }
	    checkValidity()

})  

function checkStrength(password) {  
	var strength = 0  

	// if (password.length < 6) {  
	// 	$('#strengthMessage').removeClass()  
	// 	$('#strengthMessage').addClass('Short')
	// 	$("#changepwd").prop("disabled",true) 

	// 	return lang('Dhaifu mno!','very weak !')  
	// }  


	if (password.length >= 6) strength += 1  
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


	const strong = strength * 100/5
    let txt = `` 
	
	if (strong <= 20 ) {  
		$('#strengthMessage').removeClass()  
		$('#strengthMessage').addClass('Short') 
		$("#changepwd").prop("disabled",false) 
        txt = lang('Dhaifu mno...!','Very Weak... !')
		}else if(strong == 40){
			$('#strengthMessage').removeClass()  
			$('#strengthMessage').addClass('weak') 
			$("#changepwd").prop("disabled",false) 
			txt = lang('Dhaifu... !',' Weak... !')	  

	   } else if (strong == 60) {  

		$('#strengthMessage').removeClass()  
		$('#strengthMessage').addClass('Good') 
		$("#changepwd").prop("disabled",false) 
		txt = lang('Angalau... !','At least... !') 

	   }else if(strong == 80){
        $('#strengthMessage').removeClass()  
		$('#strengthMessage').addClass('Strong') 
		$("#changepwd").prop("disabled",false) 
		txt = lang('Makini... ','Strong... ') 


	} else if(strong == 100){  

		$('#strengthMessage').removeClass()  
		$('#strengthMessage').addClass('Strong')  
		$("#changepwd").prop("disabled",false) 

		txt = lang('Makini Zaidi... ','Very Strong... ')
		
	}  

	valid = strong
    
	$('#pwdSign').css('width',(strong<=20?20:strong)+'%')
	$('#pwdSign').removeClass()
	$('#pwdSign').addClass(`Bg${strong>=80?80:strong<=20?20:strong}`)




	return txt
	
}  

$('#submitBtn,#sendMailBtn').click(function(){
	const mail = $('#email').val(),
	      mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		  pwd = Number($('#email').data('pwd')) || 0
 
		  if(mail.match(mailformat)){
			const dt={
				data:{
					mail,
					pwd
				},
				url:'/confirmMail'
			},
			kichwa = 0
			sendData = POSTREQUEST(dt)
			$('#loadMe').modal('show')
            // console.log(dt)   
			sendData.then(response=>{
				
				if(response.success){
					
					msg = lang('Tafadhari andika namba ya uthibitisho iliyotmwa kupitia ','Please write verification code sent to ')+`: <u class="weight500 darkblue"> <i>${response.mail}</i></u>`
					$('#loadMe').modal('hide')
					
					// alert(response.num)

					$('#email').data('valu',response.id)
					

					$('#ConfirmMailModal').modal('show')
					$('#mailtoConfirn').html(msg)
					countDown()
				}else{
					

					toastr.error(lang(response.msg_swa,response.msg_eng), lang('Haukufanikiwa','Error '), {timeOut: 2000});
                    $('#loadMe').modal('hide')
					hideLoading()
				} 
               $('#loadMe').modal('hide')
			   hideLoading()

			}).fail((jqXHR, exception)=>{
				failRequest(jqXHR, exception)
			})
		  }else{
			redborder('#mail')
		  }
	      
})


$('body').on('click','#tumabtn',function(){
	const f_name=$('#f_name').val(),
	      l_name = $('#l_name').val(),
		  male=Number($('#Male').prop('checked')),
		  female=Number($('#Female').prop('checked')),
		  mail = $('#email').val(),
		  pwd = $('#password').val(),
		  langi = $('#langSel').val(),
		  pers = Number($('#PersonalA').prop('checked')),
		  kijiji = $('#Kijiji').val(),
		  code = $('#emailCheck').val(),
		  dt = {
			data:{
				f_name,
				l_name,
				male,
				female,
				pwd,
				kijiji,
				mail,
				lang:langi,
				code,
				pers
			},
			url:'/register'
		  }
		  $('#confirmMailSpiner').prop('hidden',false)
		  const senddt = POSTREQUEST(dt)
		  senddt.then(resp=>{
			
			if(resp.success){
				clearTimeout(timerI)
				$('#the_phone').data('val',resp.id)
				$('#confirmMailSpiner').prop('hidden',true)
				$('#ConfirmMailModal').modal('hide')
				$('#ConfirmPhoneModal').modal('show')

			} else{
			   $('#confirmMailSpiner').prop('hidden',true)
			   toastr.error(lang(resp.msg_swa,resp.msg_eng), lang('Haukufanikiwa','Error '), {timeOut: 5000});

			}
              $('#loadMe').modal('hide')
			  hideLoading()

		  }).fail((jqXHR, exception)=>{
			failRequest(jqXHR, exception)
		})



		  

})

$('body').on('click','#sendPhone',function(){
	
	
	const phone = $('#the_phone').val(),
	code = Number($('#countries').val())
	if(phone.length==9){
		$('#confirmphoneSpiner').prop('hidden',false)
		dt = {
			data:{
				phone,
				code
			},
			url:'/confirmMail'
			
		  },
		  sendIt = POSTREQUEST(dt)
		  sendIt.then(resp=>{
			if(resp.success){
				$('#confirmphoneSpiner').prop('hidden',true)
				// alert(resp.num)
				  countDown()
				$('#confirmPhone').show(300)
			}
		  })
	}else{
		redborder('#the_phone')
		$('#confirmphoneSpiner').prop('hidden',true)
	}





})

$('body').on('click','#tumabtnPhone',function(){
	$('#PhoneConfirmSpinner').prop('hidden',false)
	const code=$('#PhoneCheck').val(),
	      val =  $('#the_phone').data('val'),
		  mail = $('#email').val(),
		  phone = $('#the_phone').val(),
		  dta={
			data:{
				code,
				val,
				mail,
				phone
			},
			url:'/register2'
		  },
	
		  sendThedt = POSTREQUEST(dta)

		  sendThedt.then(resp=>{
			$('#PhoneConfirmSpinner').prop('hidden',true)
			if(resp.success){
				location.replace('/userdash')
			}else{
				toastr.error(lang(resp.msg_swa,resp.msg_eng), lang('Haukufanikiwa','Error '), {timeOut: 5000});
	
			}
		  }).fail((jqXHR, exception)=>{
			failRequest(jqXHR, exception)
		})

})

function failRequest(jqXHR, exception){
	$('#loadMe').modal('hide')
	if (exception === 'timeout' ||  jqXHR.status === 0) {
		
		toastr.error(lang("Tatitizo la mtandao tafadhari jaribu tena","Network error please try again"), lang('Haukufanikiwa','Error '), {timeOut: 7000});

	}
$('#loadMe').modal('hide')
hideLoading()
			
}

function countDown(){
	let cnt = 60
    
	function timer(){
		cnt=cnt-1
       

         $('.downCounter').text(cnt<10?'0'+cnt:cnt)
		if(cnt>0){
			timerI = setTimeout(timer, 1000); 
		}else{
			stop()
		} 
         
	}


	function stop(){
		if($("#ConfirmPhoneModal").data('bs.modal')?._isShown){
		    $('#confirmPhone').hide(100)
			$('#PhoneCheck').val('')
		}else{
				$('#emailCheck').val('')
				$('#loadMe').modal('hide')
				hideLoading()
				$('#ConfirmMailModal').modal('hide')
				$('#confirmMailSpiner').prop('hidden',true)
		}
		

		toastr.error(lang("Muda wa uhakiki umeisha tafadhari kusanya tena","The confirmation duration expired plese resubmit the form"), lang('Muda Umeisha','Time Out '), {timeOut: 7000});
        
		clearTimeout(timerI)
	}

    timer()
}

//PASWORD RESET PURPOSE ..............................................//
$('#pwdResetForm').submit(function (e) { 
	e.preventDefault();

    const pwd = $('#password').val(),
	      conf = $('#passwordConfirm').val()
		  

		  if(pwd==conf && valid >=60 ){
			$('#loadMe').modal('show')
			const  dtSend = {
				data:{pwd},
				url:'/changePwd'
			},
			sendThen = POSTREQUEST(dtSend)
			sendThen.then(resp=>{
				if(resp.success){
                  toastr.success(lang(resp.msg_swa,resp.msg_eng), lang('Imefanikiwa','Success '), {timeOut: 2000});
				  location.replace('/userdash')
				}else{
					toastr.error(lang(resp.msg_swa,resp.msg_eng), lang('Haukufanikiwa','Error '), {timeOut: 5000});

				}
				$('#loadMe').modal('hide')
				hideLoading()
			})
              
		  }



	
});