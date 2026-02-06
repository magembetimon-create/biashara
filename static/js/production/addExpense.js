



 //to add another Expense ............................//
 $('body').off('click','#add-btn').on('click', '#add-btn', function () {

         
    let pos=$('#item_tr_tbody tr').last().data('pos'),
        hasexp=Number($(`#chagua_matumizi${pos}`).val()) || 0,
        hasAm = Number($(`#Expamount${pos}`).val()) || 0,
        nw = Number($(`#tumizi_jipya${pos}`).prop('checked')),
        newExp = $(`#tumia_jina${pos}`).val()
   
    if((hasexp>0 || (nw && newExp!='')) && hasAm > 0 ){         
            pos=pos+1
            $('#item_tr_tbody').append(tablerow(pos)) 
            $(`#chagua_matumizi${pos}`).selectpicker('refresh')
           
    }else{
        if(hasAm == 0){
            redborder(`#Expamount${pos}`)
        }

        if(nw && newExp == '' ){
           redborder(`#tumia_jina${pos}`)
        }

        if(!nw && hasexp == 0 ){
            $(`#chagua_matumizi${pos}`).selectpicker('setStyle', 'border-danger');
        }
    }
})

 //Remove  invoice item from the list......................   
 $('body').off('click','.remove_bill_item_tr').on('click', '.remove_bill_item_tr', function () {
    let hommany=document.getElementById("item_tr_tbody").childElementCount,
        pos = $(this).data('pos')

        if(hommany!=undefined){
            if(hommany>1){
               $(`#list_tr${pos}`).remove()
               summingExp()
            }else{
               
               $('#item_tr_tbody').html(tablerow(1))

            }

        }


})

$('body').on('keyup','.Expamount',function(){
    summingExp()
})

//Calculate sum
function summingExp(){
    let expSum = 0
    $('.Expamount').each(function(){
        if($(this).val()!=''){
           expSum+=Number($(this).val()) || 0
        }
        $('#malipo-akaunti').data('total',expSum)
        const sum = document.getElementById('showExp_sum');
        animateValue(sum, 0, Number(expSum), 500);
    })


}

//IF ACOUNT IS SELECTED..................................//
$('#malipo-akaunti').change(function(){
    if($(this).find('option:selected').data('value')!='0'){ $(this).selectpicker('setStyle', 'restore-border');$(this).selectpicker('setStyle', 'btn-light');}

    let hommany=document.getElementById("item_tr_tbody").childElementCount,
        total_amount=Number($(this).data('total')),
        acont_amount= Number($(this).find('option:selected').data('amount'));

    if(hommany>1){
       total_amount=Number($('#malipo-akaunti').data('total'))
    }

    if(total_amount<=acont_amount){
        $('#iliyobaki_bill').attr('placeholder',(acont_amount-total_amount).toLocaleString())
        $('#akaunti_verifier').hide();
    }else{
        $(this).selectpicker('setStyle', 'border-danger');
         $('#iliyobaki_bill').attr('placeholder',lang('Akaunti haina kiasi cha kutosha','insufficient account amount'))
        $('#akaunti_verifier').show();

    }


})

$('#iliyobaki_bill').keyup(function(){
      let val = Number($(this).val()),
         hommany=document.getElementById("item_tr_tbody").childElementCount,
        total_amount=Number($('#malipo-akaunti').data('total')),
        acont_amount= Number($('#malipo-akaunti').find('option:selected').data('amount'));

        if(hommany>1){
            total_amount=Number($('#malipo-akaunti').data('total'))
         }

        if(acont_amount < (val+total_amount)) {
            redborder(`#${$(this).attr('id')}`)
        }

})

//SAVE EXPENSES DATA...........................................///
$('#saveReduceAdj').unbind('submit').submit(function (e) {
    e.preventDefault() 
    let url=$(this).attr("action"),
      
        csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
        zer = 0,
        pr=Number($(this).data('value')) || 0,
        expense_dt =[],
        account = Number($('#malipo-akaunti').find('option:selected').data('value')) || 0 ,
        ac_amo = Number($('#malipo-akaunti').find('option:selected').data('amount')) || 0,
        exp_amo = Number($('#malipo-akaunti').data('total')) || 0,
        rem_amo = Number($('#iliyobaki_bill').data('total')) || 0

  

     

    $('.Expamount').each(function(){
        let amo = Number($(this).val()) || 0,
             pos =$(this).data('pos'),
             desc = $(`#expense_desk${pos}`).val(),
             expense = Number($(`#chagua_matumizi${pos}`).val()) || 0 ,
             newExp = $(`#tumia_jina${pos}`).val(),
             nw = Number($(`#tumizi_jipya${pos}`).prop('checked'))

        if(amo==0 || (expense==0 && !nw) || (nw && newExp=='')){
              zer += 1
        }

        if(amo == 0 && (expense>0||(nw&&newExp!=''))  ){
              redborder(`#Expamount${pos}`)
        }

        if(amo > 0 && expense > 0 && nw && newExp=='')  {
              redborder(`#Expamount${pos}`)
        }

        if(amo > 0 && expense == 0 && !nw )  {
            $(`#chagua_matumizi${pos}`).selectpicker('setStyle', 'border-danger');
        }

          let  itn = {
                exp:expense,
                nw:nw,
                desc:desc,
                amo:amo,
                newExp:newExp,
            } 
            
            expense_dt.push(itn)

    })

let data = {
    data:{
        pr:pr,
        account:account,
        remAmo:rem_amo,
        expAmo:exp_amo,
        expenses:JSON.stringify(expense_dt),
        csrfmiddlewaretoken:csrfToken, 
    },
    url:url
}
   
        if(zer==0 ){
            if(account>0){
                
                
                if(ac_amo>=exp_amo){
                   
                    if(rem_amo<ac_amo) { 
                         saveProd(data)
                    }else{
                        redborder('#iliyobaki_bill')  
                        alert(lang('Kiasi kilichobaki sio sahihi','The remaining amount is not correct '))

                    }
                    
                }else{
                   alert(lang('Akaunti uliyochagua haina kiwango cha kutosha kwa malipo ya ghalama zilizoainishwa','The account you selected does not have enough credit for the specified costs '))
                }
               
            }else{
                alert(lang('Tafadhari chagua akaunti ya malipo','Please select Payment account'))
                 $('#malipo-akaunti').selectpicker('setStyle', 'border-danger');
            }
         
        }
       
  


})

function saveProd(data){

    $("#loadMe").modal('show');

    $.ajax({
    type: "POST",
    url: data.url,
    data: data.data,
    success: function (respo) {

        if(respo.success){
            toastr.success(lang(respo.msg_swa,respo.msg_eng), 'Success Alert', {timeOut: 7000});
             
                 location.reload()
            
          
        }else{
            toastr.error(lang(respo.msg_swa,respo.msg_eng), 'Error Alert', {timeOut: 7000});

        }
        $("#loadMe").modal('hide');
        hideLoading()
        
    }
});
}
//FUNCTION YA KUSAVE STOKU....................................................
function saveWorkData(data){
    $(data.hide).modal('hide');
    $("#loadMe").modal('show');
    $.ajax({
        type: "POST",
        url: data.url,
         data: data.data,
      }).done(function(respo) {
          if(respo.success){
            toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 7000});
          
            $(data.form).data('worker_value',0)
            $(data.form).data('active_worker',0)
            $(data.form).data('edit',0)

            $('#worker-Id').val('')
            $('#worker-jina').val('')
            $('#worker-sehemu').val('')
            
            $('#worker-simu').val('')
            $('#worker-simu2').val('')
            $('#worker-mail').val('')

            


            getLabours() 
    
          }else{
              toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 7000});
              

          }
        $("#loadMe").modal('hide');
        hideLoading()
      })
}