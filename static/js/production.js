// save Worker.............................................
$('#form-worker').submit(function(e){
    e.preventDefault()
    var url=$(this).attr("action"),active=$(this).data('active_worker')

    var jina = $('#worker-jina').val(),
        adress=$('#worker-sehemu').val(),
        code=$('#worker-simu-code').val(),
        simu1=$('#worker-simu').val(),
        simu2=$('#worker-simu2').val(),
        kazi=$('#worker-mail').val(),
        kazi=$('#worker-mail').val(),
        namba = $('#worker-Id').val(),
        edit = $(this).data('edit'),
        value = $(this).data('valued')
    if(jina!=''){
        if(adress!=''){

            if(simu1.length>5){
                if(code.length>2){
                     var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

        var data={
       data:{
             jina:jina,
             adress:adress,
             code:code,
             simu1:simu1,
             simu2:simu2,
             isactive:active,
             valued:value,
             edit:edit,
             namba:namba,
             value:$(this).data('worker_value'),
             kazi:kazi,
            csrfmiddlewaretoken:csrfToken, 
        } ,    
            url:url,
            hide:"#workers-modal",
            form:'#form-worker'

        
        }
        if(simu2=='' || simu2.length==9){
            // supplier_selected.state=false
            if(kazi!=''){
                 saveWorkData(data)
            }else{
                redborder('#worker-mail')
            }


        }else{
            // alert(lang("Tafadhali Andika namba ya simu kwa simu2 kwa usahihi","Please write Vender contact 2 correctly"))
            redborder('#worker-simu2')
            $('#worker-simu2').siblings('small').prop('hidden',false)
        }

                }else{
                    //  alert(lang("Tafadhali Andika code ya simu kwa usahihi","Please write country code correctly"))
                    redborder('#worker-simu-code') 
                    $('#worker-simu-code').siblings('small').prop('hidden',false)
                }
               
            }else{
            //    alert(lang("Tafadhali Andika namba ya simu kwa simu1 kwa usahihi","Please write Vender contact 1 correctly"))
            redborder('#worker-simu')
            $('#worker-simu').siblings('small').prop('hidden',false)

            }
            
        }else{
            // alert(lang("Tafadhali Andika mahali mworker anapatikana","Please write Vender Address"))
            redborder('#worker-sehemu')
            $('#worker-sehemu').siblings('small').prop('hidden',false)

        }
      
    }else {
        // alert(lang("Tafadhali andika jina la mworker","Please write Vendor Name"))
        $('#worker-jina').siblings('small').prop('hidden',false)

        redborder('#worker-jina')
    }
})



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

            


            getWorkers($('#made-input').val()) 
    
          }else{
              toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 7000});
              
              $("#loadMe").modal('hide');
               hideLoading()
          }
        
       
      })
}


function getWorkers(wote){
   $("#loadMe").modal('show');
    let csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    
    $.ajax({
        type: "POST",
        url: "/getWorkers",
        data: {csrfmiddlewaretoken:csrfToken,wote:wote},
      
        success: function (wk) {

            if(wk.success){
                work = wk.worker

                let tb = `<table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
                <thead>
                    <tr class="smallFont">
                        <th>#</th>
                        <th>${lang('Utambulisho','Worker Id')}</th>
                        <th> ${lang('Jina','Name')}</th>
                        <th> ${lang('Anwani','Address')}</th>
                        <th> ${lang('SIMU 1','PHONE 1')}</th>
                        <th> ${lang('SIMU 2','PHONE 2')}</th>
                        <th>  ${lang('Kazi','Task')}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="worker_list">
    
                `,
                n=1

                work.forEach(w => {
                    tb+=`<tr>
                       <td>${n}</td>
                       <td>${w.workerId | lang('Hakuna','Null') }</td>
                         <td class="text-capitalize" >${w.jina}</td>
                         <td class="text-capitalize" >${w.address}</td>
                         <td>${w.simu1}</td>`
                        if(w.simu2){
                              tb+= `<td>${w.simu2}</td>`
                        }else{
                             tb+= `<td>${lang('Hakuna','Null')}</td>`
                        }
                      
                        
                        tb+= ` <td>${w.kazi}</td>
                         <td>
                         <div class="d-flex">
                           <button data-toggle="modal" data-target="#workers-modal" 
                           data-jina="${w.jina}" 
                           data-value="${w.id}" 
                          data-idtf="${w.workerId}" 
                           data-addr="${w.address}" 
                           data-code="${w.code}" 
                           data-simu1="${w.simu1}" 
                           data-simu2="${w.simu2}" 
                           data-kazi="${w.kazi}" 

                           data-simu1="${w.simu2}" class="btn btn-secondary border0 workerEdit btn-sm latoFont smallerFont">
                             ${lang('Kuediti','Edit')}
                           </button>

                           <a href="/EmployeeDetails?wrk=${w.id}" class="btn btn-primary border0 btn-sm latoFont smallerFont">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg> 
                           </a>
                           </div>
                         </td>
                    </tr>
                    
                    `
                   n+=1
                });

                tb+=`</tbody></table>`

                 $('#worker_table').html(tb)
                $('#table-bidhaa').DataTable();

                $('#loadMe').modal('hide')
            }
        }
    });
}

//Incase of editing .................................//
$('body').on('click','.workerEdit',function(){
   $('#worker-Id').val($(this).data('idtf'))
   $('#worker-jina').val($(this).data('jina'))
   $('#worker-sehemu').val($(this).data('addr'))
   $('.simuCode').val($(this).data('code'))
   $('#worker-simu').val($(this).data('simu1'))
   $('#worker-simu2').val($(this).data('simu2'))
   $('#worker-mail').val($(this).data('kazi'))
   $('#form-worker').data('valued',$(this).data('value'))
   $('#form-worker').data('edit',1)

   

})

getWorkers(0)


