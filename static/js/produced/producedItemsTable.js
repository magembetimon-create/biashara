function placedataTotable(data){
    let flt = Number($('#itemsKey').val()) || 0 ,
    supflt = Number($('#supFilter').val()) || 0 ,
    prflt = Number($('#prodfilter').val()) || 0 


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
        <th> ${lang('Uzalishaji','Production')}</th>
        
        <th> ${lang('Vipimo','Units')} </th>
        <th> ${lang('Thamani','Cost')} </th>
        <th> ${lang('Zilizotengenezwa','Manufactured')} </th>
        <th> ${lang('Zilizopo','on shelf')} </th>
       
        <th>Action</th>
    </tr>
</thead>
<tbody id="products_list">`
let idadi_item=0,zilizopo=0,thamani=0,mauzo_tegemeo=0,num = 0



if(data.products.length>0){ 
    let all_item = data.products.filter(x=>x.produced_id)
    
    if(prflt>0){
        all_item = all_item.filter(x=>Number(x.pr)===Number(prflt))
    }

    if(flt>0){
        all_item = all_item.filter(x=>Number(x.bidhaa_id)===Number(flt))
    }

    if(supflt>0){
        all_item = all_item.filter(x=>Number(x.msambaji_id)===Number(supflt))
    }

    all_item.forEach(itm => {
    idadi_item+=1



    let produced = prdxnCost.state.filter(i=>i.id===itm.id),pr,code,qty=0,prC = 0,Coast = Number(itm.Bei_kununua/itm.uwiano)
        if(produced.length>0) {
            prC =  Number(produced[0].cost) * Number(itm.idadi)
            Coast = Number(produced[0].cost)
            qty = Number(produced[0].qty)
            pr = Number(produced[0].pr)
            code = produced[0].code
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
            im_sr=`<img src="${imge[im].picha__picha}" style="max-width:3.9625em;max-height:3.9em;cursor:pointer">`
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
        <td> <a href="/production/producedItems?f=${itm.bidhaa_id}"> ${itm.bidhaaN.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</a></td>
        <td> <a  href="/production/producedReg?f=${itm.aina}"> ${itm.ainaN.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</a></td>
        <td> <a  href="/production/producedItems?pr=${pr}"> PROD-${code}</a></td>
        `
        if(Number(Number(itm.idadi)/Number(itm.uwiano))>1){

            trp+=` 
                    <td><span class="smallerFont text-primary">${itm.vipimoJum} </span></td>
                    <td class="brown weight700">${Number(Number(Coast*itm.uwiano).toFixed(2)).toLocaleString()}</td>
                    <td> <span class="font-weight-bold">${Number(Number(qty)/Number(itm.uwiano)).toFixed(2)}</span> </td>
                    <td> <span class="font-weight-bold">${Number(Number(itm.idadi)/Number(itm.uwiano)).toFixed()}</span> </td>` 
        
                }else{
            trp+=`
                    <td><span class="smallerFont text-primary">${itm.vipimo} </span></td>
                    <td class="brown weight700">${Number(Number(Coast).toFixed(2)).toLocaleString()}</td>            
                    <td> <span class="font-weight-bold">${Number(qty).toFixed(2)}</span> </td>
                    <td> <span class="font-weight-bold">${Number(itm.idadi).toFixed(2)}</span> </td>
                    ` 
        }
        trp+=`
        <td >
        <div class="d-flex">
            <a href="/displaySelItem?&i=${itm.id}" class="btn btn-default  btn-sm text-primary " > 
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
            </a>
         
            

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


animateValue(sajiriwa, 0, Number(idadi_item).toFixed(2), 1000);
animateValue(total_items, 0, Number(zilizopo).toFixed(2), 1000);
animateValue(thamani_ya_bidhaa, 0, Number(thamani).toFixed(2), 1300);
// animateValue(mauzo_tegemeoni, 0, Number(mauzo_tegemeo), 1600);
// animateValue(faida_tegemeo, 0, Number(mauzo_tegemeo-thamani), 1900);

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
