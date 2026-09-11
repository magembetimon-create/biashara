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

function fmtCustomerMoney(n, curr) {
    const v = Number(n || 0)
    const s = v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    return (curr ? curr + ' ' : '') + s
}

function renderCustomerDebtPanels(data) {
    const summary = data.summary || { deni: 0, wadadaiwa: 0 }
    const curr = data.currencii || ''
    $('#customerDebtSummary').html(`
      <div class="col-md-6 mb-2">
        <div class="classic_div p-3 h-100">
          <div class="text-muted smallFont mb-1">${lang('Jumla ya deni', 'Total debt')}</div>
          <div class="h5 mb-0 weight600 text-danger">${fmtCustomerMoney(summary.deni, curr)}</div>
        </div>
      </div>
      <div class="col-md-6 mb-2">
        <div class="classic_div p-3 h-100">
          <div class="text-muted smallFont mb-1">${lang('Wateja wanaodaiwa', 'Customers with debt')}</div>
          <div class="h5 mb-0 weight600">${Number(summary.wadadaiwa || 0).toLocaleString()}</div>
        </div>
      </div>
    `)

    const branches = data.branches || []
    const bar = $('#customerBranchBar')
    const sel = $('#this_entp')
    if (!data.can_scope || branches.length < 2) {
        bar.prop('hidden', true)
        return
    }
    const currentId = Number(data.current_branch_id || sel.val())
    const selected = data.selected_branch != null ? Number(data.selected_branch) : currentId
    let opts = ''
    branches.forEach(b => {
        const id = Number(b.id)
        const label = id === 0
            ? lang('Matawi yote', 'All branches')
            : (b.name || '')
        opts += `<option value="${id}">${label}</option>`
    })
    sel.html(opts)
    sel.val(String(selected))
    if (sel.val() == null || sel.val() === '') {
        sel.val(String(currentId))
    }
    bar.prop('hidden', false)
}

function placedataTotable(data){
    
    let teja = Array.isArray(data.wateja) ? data.wateja.slice() : []

    renderCustomerDebtPanels(data)

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
            <th class="text-right"> ${lang('Deni','Debt')}</th>
            
            <th>Action</th>
        </tr>
    </thead>
    <tbody id="worker_list">

    `,
    n=1
    const curr = (data && data.currencii) || ''

    teja.forEach(w => {
        const branchLabel = w.branch_names || w.duka_jina || ''
        const deni = Number(w.deni || 0)
        const deniCls = deni > 0 ? 'text-danger weight600' : 'text-muted'
        tb+=`<tr>
           <td>${n}</td>
           
             <td class="text-capitalize" >${w.jina}</td>
             <td class="text-capitalize" >${w.address}</td>
             <td>${w.code} ${w.simu1}</td>`
            if(w.simu2){
                  tb+= `<td>${w.code} ${w.simu2}</td>`
            }else{
                 tb+= `<td>${lang('Hakuna','Null')}</td>`
            }
          
            
            tb+= `

             <td class="text-capitalize small">${branchLabel}</td>
             <td class="text-right ${deniCls}" data-order="${deni}">${fmtCustomerMoney(deni, curr)}</td>
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
    $('#table-bidhaa').DataTable({
        order: [[6, 'desc']]
    });

    $('#loadMe').modal('hide')
    hideLoading()
}

$('#this_entp').on('change', function () {
    $('#loadMe').modal('show')
    getCustomData()
})
