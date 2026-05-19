
var ALLPAYACCOUNTS
const is_bill = ISBILL

function getSelectedPaymentAccount(){
  var selectedRadio = $('input[name="malipo-akaunti-radio"]:checked')
  if(selectedRadio.length){
    return {
      id: Number(selectedRadio.data('value')) || 0,
      aina: String(selectedRadio.data('aina') || '').toLowerCase().trim(),
      amount: Number(selectedRadio.data('amount')) || 0
    }
  }

  var selectedOption = $('#malipo-akaunti').find('option:selected')
  return {
    id: Number(selectedOption.data('value')) || 0,
    aina: String(selectedOption.data('aina') || '').toLowerCase().trim(),
    amount: Number(selectedOption.data('amount')) || 0
  }
}

function renderMalipoAkauntiCards(accounts){
  var cardsWrap = $('#malipo-akaunti-cards')
  if(!cardsWrap.length){
    return
  }

  var current = getSelectedPaymentAccount().id
  var html = ''

  accounts.forEach(function(ac){
    var aina = String(ac.aina || '').replace(/[&\/\\#,+$~%"*?<>{}`]/g, '')
    var accountId = Number(ac.id) || 0
    var amount = Number(ac.Amount) || 0
    var checked = current === accountId ? 'checked' : ''
    var active = current === accountId ? 'active' : ''

    html += `
      <label class="pay-account-card ${active}" data-id="${accountId}">
        <input type="radio" name="malipo-akaunti-radio" data-value="${accountId}" data-aina="${aina}" data-amount="${amount}" ${checked}>
        <div class="pay-account-type">${aina || lang('Haijatajwa','Not set')}</div>
      </label>
    `
  })

  cardsWrap.html(html)
}

window.getSelectedPaymentAccount = getSelectedPaymentAccount

class getAkaunting{
    constructor(){
    }
  

  getdata(){
    
  $.ajax({
    type: "POST", // if you choose to use a get, could be a post
      url: "/akaunting/getdata",
    data: {csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
  }).done(function(data){
    // console.log("is bill",is_bill)
    ALLPAYACCOUNTS = data.list
    //  $('#ac_sum').text(parseInt(data.sum.Amount__sum).toLocaleString())   
    $('#AkauntiChange').text(data.allsum.Amount__sum)
    $('#numberAc').text(data.Count)

    let rows = '',opt=`<option  data-value=0>--${lang('Chagua Akaunti','Select Account')}--</option>`,opt_any=`<option  data-amount=0  data-value=0>--${lang('Chagua Akaunti','Select Akount')}--</option>`,
          otherOpt = opt

    const payAcc = is_bill?ALLPAYACCOUNTS:ALLPAYACCOUNTS.filter(d=>!d.supervisor_account)
    payAcc.forEach(ac => {

      opt+=`<option data-aina="${ac.aina.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")}" data-amount=${ac.Amount} data-value=${ac.id} >${ac.Akaunt_name.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")} </option>`
      opt_any+=`<option data-aina="${ac.aina.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")}" data-amount=${ac.Amount} data-subtext="(${ac.aina.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")})" data-Malipo="${ac.aina.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")}" data-itumiwe="${ac.onesha}" data-value=${ac.id} >${ac.Akaunt_name.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")} </option>`

    })

    data.list.filter(d=>data.duka!=d.duka).forEach(ac => {
      otherOpt+=`<option data-aina="${ac.aina.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")}" data-amount=${ac.Amount} data-value=${ac.id} >${ac.Akaunt_name.replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")} </option>`
    })




  
    $('#Chagua-Akaunti').html(opt_any)
    $('#matumizi_malipo-akaunti').html(opt_any)
    $('#malipo-akaunti').html(opt_any)
    $('#kwenda_akaunti_zilizopo').html(opt_any)
    $('#kutoa_kwenda_Nje').html(otherOpt)

    renderMalipoAkauntiCards(payAcc)

    

  
    // $('#ac_list').html(rows)
    
    //   console.log(data.allsum.Amount__sum)
  
    $('#malipo-akaunti').selectpicker('refresh');
    $('#matumizi_malipo-akaunti').selectpicker('refresh');
     $('#kwenda_akaunti_zilizopo').selectpicker(opt_any)
  
  })
  }
  
  } 


  

  let getAkaunts= new getAkaunting()
  getAkaunts.getdata()



  
 // if user wants to record Akaunting transaction from any where
 $(".muamala-genu,#rekodi-muamala2").click(function(){
  $('#ac_amaount').val(0)
  $('.miamala-btn').prop("disabled",true)

  $('#follow-tab-classic-orange').prop('disabled',true)
  $('#Muamala-anywhere').show()
  $('#jina-laAkaunti').hide()
  
})

$('#Chagua-Akaunti').change(function(){
$('#ak_amounti').text(floatValue($(this).find("option:selected").data('amount')))
    $('#ac_id').val($(this).find("option:selected").data('value'))
    $('#ac_amaount').val($(this).find("option:selected").data('amount'))

  if($(this).find("option:selected").data('value')!="0"){
    $('.miamala-btn').prop("disabled",false)
  }else{
        $('.miamala-btn').prop("disabled",true)

  }
})

$('body').on('change', 'input[name="malipo-akaunti-radio"]', function(){
  var $this = $(this)
  var id = Number($this.data('value')) || 0

  $('input[name="malipo-akaunti-radio"]').closest('.pay-account-card').removeClass('active')
  $this.closest('.pay-account-card').addClass('active')
  $('#malipo-akaunti-cards').removeClass('border-danger')

  var selectEl = $('#malipo-akaunti')
  if(selectEl.length){
    selectEl.find('option').prop('selected', false)
    selectEl.find(`option[data-value="${id}"]`).prop('selected', true)
    try {
      selectEl.selectpicker('refresh')
    } catch (e) {}
  }
})

$('body').on('change', '#malipo-akaunti', function(){
  $('#malipo-akaunti-cards').removeClass('border-danger')
  $('#malipo-akaunti').removeClass('border-danger')
})





// updating and transanctions model
$('#editAkaunting').on('shown.bs.modal', function (e) {
      //Resetting all input
        $('#follow-tab-classic-orange').prop('disabled',true)
      
        $('.to_show').hide()
        $('.clear-to-zero').val(0)
        $('#ak_amounti').text('')
      $('#kiasi_Kutoa').removeClass('bgAnimation')
        $('#Chagua-Akaunti').html($('#Chagua-Akaunti').html())
        $('#kutoa_Pesa').html($('#kutoa_Pesa').html())
        $('#kuweka_Pesa').html($('#kuweka_Pesa').html())
      //----------------
        
  })