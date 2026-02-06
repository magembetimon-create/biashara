//Get all associated stoku data...................................................//

getCustomData()
function getCustomData(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", // if you choose to use a get, could be a post
        url:'/mauzo/getCustomers',
      data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
        placedataTotable(data)
    })
}

function placedataTotable(data){
    
   let teja = data.wateja
    if(data.wateja.length==0){
        teja = customers.state
    }

   

    thsE = Number($('#this_entp').val())

    if(thsE){
        teja = teja.filter(c=>c.duka==thsE)
    }

    let tb = `<table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
    <thead>
        <tr class="smallFont">
            <th>#</th>
           
            <th> ${lang('Jina','Name')}</th>
            <th> ${lang('Anwani','Address')}</th>
            <th> ${lang('SIMU 1','PHONE 1')}</th>
            <th> ${lang('SIMU 2','PHONE 2')}</th>
            <th> ${lang('Tawi','Branch')}</th>
            
            <th>Action</th>
        </tr>
    </thead>
    <tbody id="worker_list">

    `,
    n=1

    teja.forEach(w => {
        tb+=`<tr>
           <td>${n}</td>
           
             <td class="text-capitalize" >${w.jina}</td>
             <td class="text-capitalize" >${w.address}</td>
             <td>+${w.code} ${w.simu1}</td>`
            if(w.simu2){
                  tb+= `<td>+${w.code} ${w.simu2}</td>`
            }else{
                 tb+= `<td>${lang('Hakuna','Null')}</td>`
            }
          
            
            tb+= `

             <td class="text-capitalize " ><a href="#">${w.duka_jina}</a></td>
             <td>
             <div class="d-flex">
               <button data-toggle="modal" data-target="#wateja-modal" 
               data-jina="${w.jina}" 
               data-value="${w.id}" 
              data-idtf="${w.workerId}" 
               data-addr="${w.address}" 
               data-code="${w.code}" 
               data-simu1="${w.simu1}" 
               data-simu2="${w.simu2}" 
               

               data-simu1="${w.simu2}" class="btn btn-light border0 workerEdit btn-sm latoFont smallerFont">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
               <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
               <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
               </svg>
               </button>

               <a href="/mauzo/CustomerSales?cst=${w.id}" class="btn btn-light border0 btn-sm latoFont smallerFont">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
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

//Incase of editing .................................//
$('body').on('click','.workerEdit',function(){
   
    $('#mteja-jina').val($(this).data('jina'))
    $('#mteja-sehemu').val($(this).data('addr'))
    $('.simuCode').val($(this).data('code'))
    $('#mteja-simu').val($(this).data('simu1'))
    $('#mteja-simu2').val($(this).data('simu2'))
    $('#mteja-mail').val($(this).data('kazi'))
    $('#form-mteja').data({valued:$(this).data('value'),edit:1,customer_value:0,active_customer:0})
    $('#mteja-fb-id').val('')
 
    
 
 })