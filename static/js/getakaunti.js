
class getAkaunting{
    constructor(){
  
    }
  
  getdata(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
  $.ajax({
    type: "POST", // if you choose to use a get, could be a post
      url: "/akaunting/getdata",
    data: {csrfmiddlewaretoken:csrfToken},
  }).done(function(data){
    $('#dataLoader').hide(700)

    // getCalendar(0)


    // getKuweka(Number($('#show-weka-num').val()),1)

    // getKutoa(Number($('#show-weka-num').val()),1)

    
    let rows = '',opt=`<option  data-value=0>--${lang('Chagua Akaunti','Select account')}--</option>`,opt_any=`<option  data-value=0>--Chagua Akaunti--</option>`,
                 otherOpt = opt
     
  


    data.list.filter(d=>data.duka===d.duka).forEach(ac => {

      opt+=`<option data-amount=${ac.Amount} data-value=${ac.id} data-subtext="(${ac.aina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")})" >${ac.Akaunt_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} </option>`
      opt_any+=`<option data-amount=${ac.Amount} data-Malipo="${ac.aina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}" data-itumiwe="${ac.onesha}" data-value=${ac.id} >${ac.Akaunt_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} <sub class="text-primary">(${ac.aina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")})</sub></option>`



        rows+=`
        
         <li class=" py-3"  style="border-bottom:1px solid #f2f2f2">
        

          <span  class="pl-1 latoFont">
              
                <span class="Ugoro">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-credit-card-fill mx-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4z"/>
                <path fill-rule="evenodd" d="M0 7v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3z"/>
              </svg>
        </span>


          ${ac.Akaunt_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} <sub class="text-primary">(${ac.aina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")})</sub> </span> 
            
            <label style="font-size:13px " class="float-right "><span class="smallerFont  helaForm"></span> <b>${floatValue(ac.Amount)}</b>`
            if(data.menu){
            rows+=`   <button class="btn btn-default akauntedit btn-sm p-0 ml-2" data-toggle="modal" data-target="#editAkaunting" >
            <svg width="1.1em" height="1.1em" viewBox="0 0 16 16" class=" bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
                   </button>  
                   
                   <span class="place" hidden data-place="#ac_id">${ac.id}</span>
                   <span class="place" hidden data-place="#ac_amaount">${ac.Amount}</span>
                   <span class="place" hidden data-place="#Akaunt-name2">${ac.Akaunt_name.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>
                   <span class="place" hidden data-place="#jina_la_akaumti">${ac.Akaunt_name.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}<sub class="text-primary">(${ac.aina.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")})</sub></span>
                   <span class="place" hidden data-place="#aina_ya_Akaunt2">${ac.aina.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>
                   <span class="place" hidden data-place="#Akaunt-amount2">${ac.Amount}</span>
                   <span class="place" hidden data-place="#ac_kiasi"><span class="smallerFont"></span> ${floatValue(ac.Amount)}</span>
                   <span class="place" hidden data-place="#amountCash">${ac.Amount}</span>
                   <span class="onesha" hidden >${ac.onesha}</span>`

            }

            
           rows+=`  </label>
          </li>
        
       `
    })
      data.list.filter(d=>data.duka!=d.duka).forEach(ac => {
      otherOpt+=`<option data-amount=${ac.Amount} data-value=${ac.id} >${ac.Akaunt_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} <sub class="text-primary">(${ac.aina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")})</sub></option>`
    })



  
    $('#ac_list').html(rows)
    $('#kwenda_akaunti_zilizopo').html(opt)
    $('#malipo-akaunti').html(opt)
    $('#Chagua-Akaunti').html(opt_any)
    $('#kutoa_kwenda_Nje').html(otherOpt)

    //  console.log(data.sum)
  
    $('#malipo-akaunti').selectpicker('refresh');

    const obj = document.getElementById('ac_sum');
    const num = document.getElementById('ac_num');

    $('#numberAc').text(data.Count)

    animateValue(obj, 0, Number(data.sum.Amount__sum).toFixed(FIXED_VALUE), 1000);
    animateValue(num, 0, Number(data.Count).toFixed(FIXED_VALUE), 1000);
    
    if(data.otherCount>0){
            $('#otherAkaunts').show()
    }else{

                    $('#otherAkaunts').hide()

    }
    
    $('#AkauntiChange').text(data.allsum.Amount__sum)





  })
  }
  
  } 



// animateValue(obj, 100, -25, 2000);
let getAkaunts= new getAkaunting()
getAkaunts.getdata()




//if user is recording the transaction from akaunting panel
$('body').on('click','.akauntedit',function(){
  $('.miamala-btn').prop("disabled",false)
  $('#follow-tab-classic-orange').prop('disabled',false)

  $('#customCheck1').prop('checked',false)
$('#Muamala-anywhere').hide()
$('#jina-laAkaunti').show()

  $('#editAkaunting').modal('show')
  $(this).siblings('.place').each(function(){

    if($($(this).data('place')).prop('tagName')=="INPUT"){
          $($(this).data('place')).val($(this).text())    

    }else{
          $($(this).data('place')).html($(this).html())

    }
  })


  if($(this).siblings('.onesha').text() == "true"){
$('#customCheck1').prop('checked',true)
  }else{
    $('#AkauntAllow2').prop('checked',false)
 
  }

})



 // if user wants to record Accaunting transaction from any where
  $(".muamala-genu,#rekodi-muamala2").click(function(){
    $('#ac_amaount').val(0)
    $('.miamala-btn').prop("disabled",true)

    $('#follow-tab-classic-orange').prop('disabled',true)
    $('#Muamala-anywhere').show()
    $('#jina-laAkaunti').hide()

  })


  $('#Chagua-Akaunti').change(function(){
    if($(this).find("option:selected").data('value')!="0"){
      $('#ac_id').val($(this).find("option:selected").data('value'))
      $('#ac_amaount').val($(this).find("option:selected").data('amount'))
      $('#ak_amounti').text(floatValue($(this).find("option:selected").data('amount')))
      $('.miamala-btn').prop("disabled",false)

    }else{
          $('.miamala-btn').prop("disabled",true)

    }
  })


// updating and transanctions model
$('#editAkaunting').on('shown.bs.modal', function (e) {
//Resetting all input
  $('.to_show').hide()
  $('.clear-to-zero').val(0)
  $('#ak_amounti').text('')
$('#kiasi_Kutoa').removeClass('bgAnimation')
  $('#Chagua-Akaunti').html($('#Chagua-Akaunti').html())
  $('#kutoa_Pesa').html($('#kutoa_Pesa').html())
  $('#kuweka_Pesa').html($('#kuweka_Pesa').html())
//----------------

  $(".tabs-animated a").removeClass("active")
  $('#profile-tab-classic-orange').addClass('active')
  $(".floor").addClass("staybotton")
  $('#recod_transaction').siblings(".tab_div").hide()
  $('#recod_transaction').fadeIn(600)
      getnavp()
  
  })






