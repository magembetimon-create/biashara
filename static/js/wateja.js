//Get all associated stoku data...................................................//

getCustomData()
function getCustomData(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    var branch = Number($('#this_entp').val())
    if (Number.isNaN(branch)) branch = 0
    $.ajax({
      type: "POST",
        url:'/mauzo/getCustomers',
      data: {csrfmiddlewaretoken:csrfToken, branch: branch},
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
        teja = teja.filter(c=>{
            const ids = c.branch_ids || (c.duka ? [c.duka] : [])
            return ids.includes(thsE) || c.duka === thsE
        })
    }

    let tb = `<table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
    <thead>
        <tr class="smallFont">
            <th>#</th>
           
            <th> ${lang('Jina','Name')}</th>
            <th> ${lang('Anwani','Address')}</th>
            <th> ${lang('SIMU 1','PHONE 1')}</th>
            <th> ${lang('SIMU 2','PHONE 2')}</th>
            <th> ${lang('Matawi','Branches')}</th>
            
            <th>Action</th>
        </tr>
    </thead>
    <tbody id="worker_list">

    `,
    n=1

    teja.forEach(w => {
        const branchLabel = w.branch_names || w.duka_jina || ''
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

             <td class="text-capitalize small">${branchLabel}</td>
             <td>
             <div class="d-flex">
               <a href="/mauzo/CustomerSales?cst=${w.id}" class="btn btn-light border0 btn-sm latoFont smallerFont" title="${lang('Angalia','View')}">
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

     if ($.fn.DataTable.isDataTable('#table-bidhaa')) {
        $('#table-bidhaa').DataTable().destroy()
     }
     $('#worker_table').html(tb)
    $('#table-bidhaa').DataTable();

    $('#loadMe').modal('hide')
}
