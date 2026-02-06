$('#lipabill_form').unbind('submit').submit(function (e) { 
    e.preventDefault();
    let val=$(this).data('val'),
        url = $(this).attr('action'),
        ac =$('#malipo-akaunti').find('option:selected').data('value'),
        ac_am =$('#malipo-akaunti').find('option:selected').data('amount'),
        paid_set = false,
        paid=Number($('#bill-lipwa-amount').data('amount')),
        act=paid,
        bal = 0,
        bal_set = false;

     let d=new Date(),
         pay_date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()  

          
        let csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
         
        if($('#bill-lipwa-amount').val()!=''){
           paid= $('#bill-lipwa-amount').val()
           paid_set = true
        }

        if($('#ac-baki-amount').val()!=''){
            bal = $('#ac-baki-amount').val()
            bal_set=true
        }


    data = {

        data:{
            value:val,
            pay_d:pay_date,
            ac:ac,
            paid_set:Number(paid_set),
            bal_set:Number(bal_set),
            paid:paid,
            bal:bal,
            csrfmiddlewaretoken:csrfToken, 


        },
        url:url,
        hide:'#lipiaBill',
        form:'#lipabill_form'


    }
    if(ac>0){
       
        if(ac_am>=paid){
            if(((ac_am-paid)>=bal)|| !bal_set){
                if(act>=paid){
                    if($(this).data('many')){
                       let val = []

                       $('.checkbill').each(function(){
                           if($(this).prop('checked')){
                           val.push({'id':$(this).data('val')})

                           }
                       })

                        datar={
                            data:{
                                value:JSON.stringify(val),
                                pay_d:pay_date,
                                ac:ac,
                                bal_set:Number(bal_set),
                                bal:bal,
                                csrfmiddlewaretoken:csrfToken, 
                            },
                            url:'/purchase/payManyBill',
                            hide:'#lipiaBill',
                            form:'#lipabill_form'

                        }
                       payManyBill(datar)

                    }else{
                      payBill(data)

                    }

                }

            }
    }
    }else{
        $('#helpinId2').prop('hidden',false)

    }
    

});



function payBill(data) { 
    $("#loadMe").modal('show');
     $(data.hide).modal('hide')
    $.ajax({
        type: "POST",
        url: data.url,
        data: data.data,
        success: function (respo) {
            if(respo.success){

                toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 2000});
                $(data.form).children().find('.input-data').val('')

                if(respo.remove || respo.unpaid){
                    $(`#bil_row${respo.val}`).remove()
                }

                if(!respo.unpaid){
                    $(`#amountpaid${respo.val}`).text(Number(respo.baki).toLocaleString())
                    $(`#pay_btn${respo.val}`).data('paid',Number(respo.baki))
                }

            }else{
                toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 2000});

            }

            $("#loadMe").modal('hide');
           hideLoading()
     
        }
    });
 }


function payManyBill(data) { 
    $("#loadMe").modal('show');
     $(data.hide).modal('hide')
    $.ajax({
        type: "POST",
        url: data.url,
        data: data.data,
        success: function (respo) {
            if(respo.success){

                toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 2000});
                $(data.form).children().find('.input-data').val('')
                
                respo.val.forEach(del => {
                    $(`#bil_row${del.id}`).remove()
                });
                
            }else{
                toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 2000});

            }

            $("#loadMe").modal('hide');
           hideLoading()
     
        }
    });
 }