$('#saveakaunt_form').submit(function(e){
    e.preventDefault();
if($('#Akaunt-name').val()!='' && $('#aina_ya_Akaunt').val()!=''){


$("#addAkaunting").modal('hide');
    $("#loadMe").modal('show');

    var post_url = $(this).attr("action");
    
    $.ajax({
        type: "POST",
        url: post_url,
         data: {
             name: $('#Akaunt-name').val(),
             amount:$('#Akaunt-amount').val(),
             aina:$('#aina_ya_Akaunt').val(),
             allow:Number($('#AkauntAllow').prop('checked')),
         
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
         },
      }).done(function(data) {

        $("#loadMe").modal('hide');
          hideLoading()

          let msg=lang(data.message_swa,data.message_eng)
  
        if(data.success){
            

           toastr.success(msg, lang('Imefanikiwa','Success'), {timeOut: 2000});

          
      


        }else{
           toastr.error(msg, lang('Haikufanikiwa','Error'), {timeOut: 2000});
     
        }

       



      })
    }else {
        alert(lang('Tafadhari Jaza sehemu zote','Please fill all requred fields'))
        $('.lazima_akaunti').each(function(){

          if($(this).val()==''){
             $(this).addClass('redborder')
          }
          

        })
          
         
    }
})

// editing Akaunti
$('#saveakaunt_form2').submit(function(e){
    e.preventDefault();
if($('#Akaunt-name2').val()!='' && $('#aina_ya_Akaunt2').val()!=''){


$("#editAkaunting").modal('hide');
    $("#loadMe").modal('show');

    var post_url = $(this).attr("action");
    
    $.ajax({
        type: "POST",
        url: post_url,
         data: {
             name: $('#Akaunt-name2').val(),
             amount:$('#Akaunt-amount2').val(),
             aina:$('#aina_ya_Akaunt2').val(),
             value:$('#ac_id').val(),
             allow:Number($('#customCheck1').prop('checked')),
         
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
         },
      }).done(function(data) {

        $("#loadMe").modal('hide');
          hideLoading()
          let msg=lang(data.message_swa,data.message_eng)

        if(data.success){
            

           toastr.success(msg, lang('Imefanikiwa','Success'), {timeOut: 2000});

          
      


        }else{
           toastr.error(msg, lang('Haikufanikiwa','Error'), {timeOut: 2000});
     
        }

        getAkaunts.getdata()




      })
    }else {
        alert(lang('Tafadhari Jaza sehemu zote',"Please fill all  required fields"))
        $('.lazima_akaunti').each(function(){

          if($(this).val()==''){
             $(this).addClass('redborder')
          }
          

        })
          
         
    }
})

$('#deleteac').click(function(){
  if(Number($('#amountCash').val())<100){


    $("#editAkaunting").modal('hide');
    $("#loadMe").modal('show');

    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    $.ajax({
        url :"/akaunting/ondoaAkaunt",
        data:{csrfmiddlewaretoken: csrfToken,
            value: $('#ac_id').val()
        },
        type: "POST",

        success: function(data) {


          $("#loadMe").modal('hide');
          hideLoading()

            if(data.done){
                toastr.success(lang('Akaunti Imeondolewa ','Account was removed'), lang('Imefanikiwa','success'), {timeOut: 2000});

                getAkaunts.getdata()

            }else{
                toastr.error(lang('Akaunti Haijaondolewa','Account was not removed'), lang('Haikufanikiwa','error'), {timeOut: 2000});
      
            }

        }

    })
  }else{

    alert(lang('Akaunti ina kiasi cha'+floatValue($('#amountCash').val())+'hivyo haitaondolewa','There is no enough money in the accont for transaction since the account has only '+floatValue($('#amountCash').val())))
  }
})


//miamala tabs
$('.miamala_nav').click(function(){
  $(this).siblings('button').removeClass('btn-primary')
  $(this).siblings('button').addClass('btn-outline-primary')

  $(this).removeClass('btn-outline-primary')
  $(this).addClass('btn-primary')
})

//  muamala wa kuweka pesa
$('#saveMuamala').submit(function(e){
  e.preventDefault();

  let is = $('#ac_id').val(),
      kutoka="Mengineyo",
      post_url = $(this).attr("action"),
     
      maelezo = $('#kuweka_maelezo').val(),
      kiasi=$('#kiasiKuweka').val(),
      opt= Number($('#kutoa_Pesa').find('option:selected').data('value')),
      sel,ni,red,valued=0,
      ac="False",
      hd=0;
      mengine=0

      if(opt==0){
            alert(lang("Tafadhari chagua Unapoweka pesa","Please Choose the account to deposit"))
            redborder('#kutoa_Pesa')
      }else{    
          if(opt==2){
              hd=1
              red = '#kuweka_toka_huduma'
              ni = lang("Tafadhali Chagua Huduma","Please select other service")
              kutoka=$("#kuweka_toka_huduma").val()
              sel = Number($('#kuweka_toka_huduma').find('option:selected').data('value'))

          }
          else if(opt==3){
              kutoka="Mengineyo"
              mengine=1
              

          }

if(Number(kiasi) > 0 ){
data={
  is:is,
  ac:ac,
  value:valued,
  hd:hd,
  kiasi: kiasi ,
  Maelezo:maelezo,
  kutoka:kutoka,
  makato:0,
  sel:sel,
  baki:0,
  csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
}

// if((ac=="True" && sel!=0 )||ac=="False" && Number($('#kuweka_akaunti_zilizopo').find('option:selected').data('amount'))>=kiasi){
if(((hd && sel!=0)|| mengine) && is!=0){
  // msg="Muamala wa kuweka fedha umefanikiwa  "
if($.trim($("#kuweka_maelezo").val())){
  $('#kutoa_Pesa').html($('#kutoa_Pesa').html())
  $('#kiasiKuweka').val('')
  $('.to_show').hide()
  $('#kuweka_maelezo').val('')
      miamalaPesa(data,post_url)

}else{
  redborder("#kuweka_maelezo")
  alert(lang("Tafadhari andika maelezo","Please write short description"))
}

}else{
  alert(lang("Tafadhari chagua Huduma nyingine","Please choose the other sevice"))
  redborder(red) 
}

// }else{
//     alert("Tafadhari chagua akaunti")
//     redborder(red)
// }

}else{
  alert(lang("Tafadhari andika kiasi","Please write the amount"))
  redborder('#kiasiKuweka')




}
}

  
 
})


//makato workout{}
$('#kiasi_Kutoa1').keyup(function(){
  // if($(this).val()>0){
      if(Number($(this).val())<=Number($('#ac_amaount').val())){
                  $('#kiasi_Kutoa').val(Number($('#ac_amaount').val())-Number($(this).val()))
$("#kiasi_Kutoa").addClass("bgAnimation")
      }else{
          alert(lang('kiasi kinachotoka kimezidi pesa iliyopo kwenye akaunti',"The amount to  withdraw acceeded the amount present"))
          $(this).val('')
      }
  // }
})


$('#kiasi_Kutoa').keyup(function(){
  if($(this).val()>0){
      if((Number($(this).val())<=(Number($('#ac_amaount').val())-(Number($('#kiasi_Kutoa1').val()))))){
                  $('#kutoa_makato').val((Number(  $('#ac_amaount').val())-(Number($(this).val())+Number($('#kiasi_Kutoa1').val()))).toLocaleString())

      }else{
          alert(lang('pesa inayobaki  imezidi pesa iliyopo kwenye akaunti na kiasi kinachotolewa','The amount is exceeding the real amount'))
          $(this).val( Number($('#ac_amaount').val())-Number($('#kiasi_Kutoa1').val()))
          $('#kutoa_makato').val(0)
      }
  }
})






//muamanla wa kutoa pesa
$('#saveKutoa').submit(function(e){
  e.preventDefault();

  let is = $('#ac_id').val(),ac_val=Number($('#ac_amaount').val()),
     kutoka="Personal",
     sel,ni,red,valued=0,ac=0,hd="False"


const opt= Number($('#kuweka_Pesa').find('option:selected').data('value')),
      post_url = $(this).attr("action"),
      kiasi=Number($('#kiasi_Kutoa1').val()),kilichobaki=$("#kiasi_Kutoa").val(),
      kwenda = opt==1?'#kwenda_akaunti_zilizopo':'#kutoa_kwenda_Nje',
      maelezo = $('#kutoa_maelezo').val()
 


if(opt==0){
  alert(lang("Tafadhari chagua Unapoweka pesa","please select the account to deposit"))
  redborder('#kuweka_Pesa')
}else{
    if(opt==1 || opt == 2){
      ac=1
      valued= Number($(kwenda).find('option:selected').data('value'))
      red = kwenda
      ni=lang("Tafadhari Chagua Akaunti","please select the account")
      kutoka=$(kwenda).val()
      sel = Number($(kwenda).find('option:selected').data('value'))
 
    }
     

if((ac && sel!=0 )||!ac ){
   
 if(kiasi<=ac_val) {

  if(kiasi>0){
       if($.trim($("#kutoa_maelezo").val())){

      data={

          is:is,
          ac:ac,
          value:valued,
          kiasi: kiasi ,
          baki:kilichobaki,
          Maelezo:maelezo,
          kutoka:kutoka,
          opt:opt,
          makato:$('#kutoa_makato').val(),
          csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

      }


if(is!=valued){
$('#kuweka_Pesa').html($('#kuweka_Pesa').html())
$(kwenda).html($(kwenda).html())
$('#kutoa_kwenda_Nje').html($('#kutoa_kwenda_Nje').html())
$('#kiasi_Kutoa1').val('')
$('#kutoa_makato').val(0)
$('#kiasi_Kutoa').val('')
$('#kutoa_maelezo').val('')
$('.to_show').hide()



            miamalaPesa(data,post_url)

          // console.log('valued',valued)

}else{
  alert(lang("Tafadhari chagua akaunti nyingine","Please Choose another account the transaction can't be done on the same akaunt"))
  $(kwenda).addClass("redborder")
}

  }else{
      alert(lang("haujandika maelezo","please write short description"))
      redborder('#kutoa_maelezo')
  }
  }else{
      alert(lang("Tafadhari andika kiasi unachohamisha","please write the amount for a transaction"))
      redborder('#kiasi_Kutoa1')
  }

 


 }else{
     alert(lang("kiasi unachokitoa ni kikubwa kuliko kilichopo","The amount is exceeding the present amount"))
 }

}else{
   alert(ni)
   redborder(red)
}


}
})






// function ya kuweka pesa
function miamalaPesa(data,post_url){

  $("#editAkaunting").modal('hide');
  $("#loadMe").modal('show');
$('#ac_id').val(0)
  $.ajax({
      type: "POST",
      url: post_url,
       data: data,
    }).done(function(respo) {

      $("#loadMe").modal('hide');
        hideLoading()
      let msg=lang(respo.message_swa,respo.message_eng)
      if(respo.success){
         
         toastr.success(msg, lang('Imefanikiwa','Success Alert'), {timeOut: 2000});
         if(data.makato=="0" && post_url=='/akaunting/kutoaPesa'){
          getAkaunts.getdata()

         }

               }
        else{
         toastr.error(msg, lang('Haikufanikwa','error Alert'), {timeOut: 2000});
   
      }

     



    })

}


function resetCashDepositModalFields() {
  $('#cashDepositCashAccount').html(`<option value="0">-- ${lang('Chagua', 'Select')} --</option>`)
  $('#cashDepositSupervisor').html(`<option value="0">-- ${lang('Chagua', 'Select')} --</option>`)
  $('#cashDepositTargetAccount').html(`<option value="0">-- ${lang('Chagua', 'Select')} --</option>`)
  $('#cashDepositAmount').val('').attr('data-cash', 0).attr('placeholder', '0')
  $('#cashDepositTo').val('')
  $('#cashDepositDesc').val('')
  $('#cashDepositSupervisorWrap').hide()
  $('#cashDepositAccountWrap').hide()
}

function getCashDepositData(callback) {
  $.ajax({
    type: 'POST',
    url: '/akaunting/getdata',
    data: { csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() }
  }).done(function (data) {
    callback(data)
  })
}

function populateCashDepositModal(data) {
  let cashOpt = `<option value="0">-- ${lang('Chagua', 'Select')} --</option>`
  let accountOpt = `<option value="0">-- ${lang('Chagua', 'Select')} --</option>`
  let supervisorOpt = `<option value="0">-- ${lang('Chagua', 'Select')} --</option>`

  const cashAccounts = data.cash_accounts || data.list.filter(a => String(a.aina).toLowerCase() === 'cash' && Number(a.duka) === Number(data.duka))
  const nonCashAccounts = data.non_cash_accounts || data.list.filter(a => String(a.aina).toLowerCase() !== 'cash' && Number(a.duka) === Number(data.duka))
  const supervisors = data.supervisors || []

  cashAccounts.forEach(ac => {
    cashOpt += `<option value="${ac.id}" data-cash="${ac.Amount}">${ac.Akaunt_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, '')} (${ac.aina})</option>`
  })

  nonCashAccounts.forEach(ac => {
    accountOpt += `<option value="${ac.id}">${ac.Akaunt_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, '')} (${ac.aina})</option>`
  })

  supervisors.forEach(sp => {
    const fullName = `${(sp.first_name || '').trim()} ${(sp.last_name || '').trim()}`.trim()
    const displayName = fullName !== '' ? fullName : (sp.username || 'Supervisor')
    supervisorOpt += `<option value="${sp.id}">${displayName}</option>`
  })

  $('#cashDepositCashAccount').html(cashOpt)
  $('#cashDepositTargetAccount').html(accountOpt)
  $('#cashDepositSupervisor').html(supervisorOpt)
}

$('#cashDepositModal').on('shown.bs.modal', function () {
  resetCashDepositModalFields()
  getCashDepositData(function (data) {
    populateCashDepositModal(data)
  })
})

$('body').on('change', '#cashDepositCashAccount', function () {
  const cashAmount = Number($(this).find('option:selected').data('cash')) || 0
  $('#cashDepositAmount')
    .attr('data-cash', cashAmount)
    .attr('placeholder', lang(`Amount yote ya Cash: ${floatValue(cashAmount)}`, `All Cash Amount: ${floatValue(cashAmount)}`))
})

function formatDepositAmountInput(rawValue) {
  const cleaned = String(rawValue || '').replace(/,/g, '').replace(/[^0-9.]/g, '')
  const parts = cleaned.split('.')
  const intPart = (parts[0] || '').replace(/^0+(\d)/, '$1')
  const decPart = parts.length > 1 ? parts.slice(1).join('').substring(0, 2) : ''
  const grouped = intPart === '' ? '' : intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart !== '' ? `${grouped}.${decPart}` : grouped
}

$('body').on('input', '#cashDepositAmount', function () {
  const cursorAtEnd = this.selectionStart === this.value.length
  const formatted = formatDepositAmountInput($(this).val())
  $(this).val(formatted)
  if (cursorAtEnd) {
    this.setSelectionRange(this.value.length, this.value.length)
  }
})

$('body').on('change', '#cashDepositTo', function () {
  const target = $(this).val()
  $('#cashDepositSupervisorWrap').hide()
  $('#cashDepositAccountWrap').hide()
  if (target === 'supervisor') {
    $('#cashDepositSupervisorWrap').show()
  }
  if (target === 'account') {
    $('#cashDepositAccountWrap').show()
  }
})

$('#saveCashDepositForm').submit(function (e) {
  e.preventDefault()

  const cashAccount = Number($('#cashDepositCashAccount').val()) || 0
  const depositTo = $('#cashDepositTo').val()
  const dataCash = Number($('#cashDepositAmount').attr('data-cash')) || 0
  const amountRawDisplay = $('#cashDepositAmount').val()
  const amountRaw = String(amountRawDisplay || '').replace(/,/g, '')
  let amount = Number(amountRaw)
  if (amountRaw === '') {
    amount = dataCash
  }

  const supervisorId = Number($('#cashDepositSupervisor').val()) || 0
  const targetAccountId = Number($('#cashDepositTargetAccount').val()) || 0
  const maelezo = $('#cashDepositDesc').val()

  if (!cashAccount) {
    redborder('#cashDepositCashAccount')
    alert(lang('Tafadhari chagua Cash account', 'Please select a cash account'))
    return
  }

  if (!depositTo) {
    redborder('#cashDepositTo')
    alert(lang('Tafadhari chagua Deposit to', 'Please select deposit destination'))
    return
  }

  if (!(amount > 0)) {
    redborder('#cashDepositAmount')
    alert(lang('Tafadhari andika kiasi sahihi', 'Please provide a valid amount'))
    return
  }

  if (depositTo === 'supervisor' && !supervisorId) {
    redborder('#cashDepositSupervisor')
    alert(lang('Tafadhari chagua supervisor', 'Please select a supervisor'))
    return
  }

  if (depositTo === 'account' && !targetAccountId) {
    redborder('#cashDepositTargetAccount')
    alert(lang('Tafadhari chagua payment account', 'Please select a payment account'))
    return
  }

  $('#cashDepositModal').modal('hide')
  $('#loadMe').modal('show')

  $.ajax({
    type: 'POST',
    url: $(this).attr('action'),
    data: {
      cash_account: cashAccount,
      amount: amountRaw,
      deposit_to: depositTo,
      supervisor_id: supervisorId,
      target_account_id: targetAccountId,
      maelezo: maelezo,
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
  }).done(function (respo) {
    $('#loadMe').modal('hide')
    hideLoading()
    const msg = lang(respo.message_swa, respo.message_eng)
    if (respo.success) {
      toastr.success(msg, lang('Imefanikiwa', 'Success Alert'), { timeOut: 2000 })
      if (typeof getAkaunts !== 'undefined' && getAkaunts && getAkaunts.getdata) {
        getAkaunts.getdata()
      }
    } else {
      toastr.error(msg, lang('Haikufanikiwa', 'Error Alert'), { timeOut: 2000 })
    }
  })
})

