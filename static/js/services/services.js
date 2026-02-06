function placedataTotable(data){
    let flt = Number($('#itemsKey').val()) || 0 ,
    supflt = Number($('#supFilter').val()) || 0 


    // products list
let trp = ` 
<table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
<thead>
    <tr class="smallFont">
        <th>#</th>
        <th>${lang('Picha','Image')}</th>
        <th>${lang('Namba',' Number')}</th>
        <th>${lang('Jina ',' Name')}</th>
        <th> ${lang('Aina','Category')}</th>
        <th> ${lang('Kampuni','Brand')} </th>
        <th> ${lang('Thamani','Cost')} </th>
        <th> ${lang('Vipimo','Measurents')} </th>
        <th> ${lang('Nafasi','Space')} </th>
        <th> ${lang('Msambazaji','supplier')} </th>
        <th>Action</th>
    </tr>
</thead>
<tbody id="products_list">`
let idadi_item=0,zilizopo=0,thamani=0,mauzo_tegemeo=0,num = 0

if(data.products.length>0){ 
    let all_item = data.products.filter(x=>x.service)
    
    if(flt>0){
        all_item = all_item.filter(x=>Number(x.aina)===Number(flt))
    }



    all_item.forEach(itm => {
    idadi_item+=1

    let produced = prdxnCost.state.filter(i=>i.id===itm.id),prC = 0,Coast = Number(itm.Bei_kununua/itm.uwiano)
        if(produced.length>0) {
            prC =  Number(produced[0].cost) * Number(itm.idadi)
            Coast = Number(produced[0].cost)
        }

    zilizopo+=Number(Number(itm.idadi))
    thamani+=((Number(itm.Bei_kununua)/Number(itm.uwiano))*Number(itm.idadi)) + prC
    mauzo_tegemeo+=(Number(itm.Bei_kuuza)*Number(itm.idadi))
    num+=1
        trp+=`<tr>
                  <td>${num}</td>
                <td>`  
        var imge=data.img,coount=0,im_sr=''

        for(var im in imge){
            if(imge[im].bidhaa==itm.bidhaa_id) {
            coount+=1;
            im_sr=`<img src="${imge[im].picha__picha}" style="width:3.4625em;height:3.4em;cursor:pointer">`
            }
        }
        
        if(coount>0){
            trp+=im_sr
        }else{
            trp+=`       
        <svg width="2.4625em" height="2.4em" viewBox="0 0 17 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v9l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15.002 9.5V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>`
        }
    
    trp+=`   </td> 
        <td>${itm.namba.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "") || lang('Hakuna','None') }</td>
        <td> ${itm.bidhaaN.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
        <td> <a  href="/stoku/servicepanel?f=${itm.aina}"> ${itm.ainaN.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</a></td>
        <td>  ${itm.brand.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>`
        if(Number(Number(itm.idadi)/Number(itm.uwiano))>0){

            trp+=` <td class="brown weight600">${Number(Coast*itm.uwiano).toLocaleString()}</td>
                    <td><span class="smallFont text-primary">${itm.vipimoJum} </span></td>
                    <td> <span class="font-weight-bold">${Number(Number(itm.idadi)/Number(itm.uwiano)).toFixed(FIXED_VALUE)}</span> </td>` 
        }else{
            trp+=`

                    <td class="brown weight600">${Number(Coast).toLocaleString()}</td>            
                    <td><span class="smallFont text-primary">${itm.vipimo} </span></td>
                    <td> <span class="font-weight-bold">${Number(itm.idadi).toFixed(FIXED_VALUE)}</span> </td>` 
        }
        trp+=` <td class="text-capitalize" > `
        if(itm.msambaji_id){
            trp+=` <a href="/stoku/servicepanel?sup=${(itm.msambaji_id)}" class="latoFont">${(itm.vendor || 'None' ).replace(/[&\/\\#,+()$~%="*?<>{}`]/g, "") }</a> `
           }else{
            trp+=` <a href="#" class="latoFont">${(itm.stName || 'None' ).replace(/[&\/\\#,+()$~%="*?<>{}`]/g, "") }</a> `
           }
    trp+=` </td>
        <td >
        <div class="d-flex">
            <a href="/displaySelItem?&i=${itm.id}" class="btn btn-default  btn-sm text-primary " > 
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
            </a>
         
            <button data-valued=${itm.id} class="btn btn-default btn-sm text-danger list-delete-item"> 
            <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
            </button>

            </div>
        </td>


        </tr>`
    })
}



const sajiriwa = document.getElementById('registered-stock-items');
const total_items = document.getElementById('jumla-ya-bidhaa');
const thamani_ya_bidhaa = document.getElementById('thamani-ya-zote');
const mauzo_tegemeoni = document.getElementById('tegemeo-la-mauzo');
const faida_tegemeo = document.getElementById('tegemeo-la-faida');


animateValue(sajiriwa, 0, Number(idadi_item).toFixed(FIXED_VALUE), 1000);
animateValue(total_items, 0, Number(zilizopo).toFixed(FIXED_VALUE), 1000);
animateValue(thamani_ya_bidhaa, 0, Number(thamani).toFixed(FIXED_VALUE), 1300);
// animateValue(mauzo_tegemeoni, 0, parseInt(mauzo_tegemeo), 1600);
// animateValue(faida_tegemeo, 0, parseInt(mauzo_tegemeo-thamani), 1900);

trp+=` </tbody></table>  `

//$('#products_list').html('')
if(data.products.length>0){ 
    $('#products_list').html(trp)

  $('#table-bidhaa').DataTable();
}else{
    noitems=`<p class="text-center p-4">${lang('Hakuna bidhaa','No items added')}`
        $('#products_list').html(noitems)

}



}
