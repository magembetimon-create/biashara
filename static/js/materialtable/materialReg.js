function placedataTotable(data){
    let flt = Number($('#itemsKey').val()) || 0 ,
        bflt = Number($('#brandFilter').val()) || 0 ,
        supflt = Number($('#supFilter').val()) || 0 

    // products list
let trp = ` 
<table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
<thead>
    <tr class="smallFont ">
        <th>#</th>
        <th>${lang('Picha','Image')}</th>
        <th>${lang('Namba ya Bidhaa','Item Number')}</th>
        <th>${lang('Jina la bidhaa','Item Name')}</th>
        <th> ${lang('Bidhaa','Items')} </th>
        <th> ${lang('Aina','Category')}</th>
        <th> ${lang('Kampuni','Brand')} </th>
        <th> ${lang('Vipimo','Units')} </th>
        <th> ${lang('Idadi ya Bidhaa','Items Quantity')} </th>       
        <th> ${lang('Thamani(Jumla)','Cost(Total)')} </th>
        <th>Action</th>
    </tr>
</thead>
<tbody id="products_list">`
let idadi_item=0,zilizopo=0,thamani=0,mauzo_tegemeo=0,num=0

    if(data.products.length>0){ 
        let allItm = data.products

        if(supflt>0){
            allItm = allItm.filter(x=>Number(x.msambaji_id)===Number(supflt))
        }

        const all_item = allItm.filter(x=>x.material),
            
               itemsK = [...new Set(all_item.map(i=>i.bidhaa_id))]
               let items = itemsK.map(i=>getAllItm(i))

               function getAllItm(i){
                   return {
                       id : i,
                       namba: all_item.filter(itm=>itm.bidhaa_id === i)[0].namba,
                       jina: all_item.filter(itm=>itm.bidhaa_id === i)[0].bidhaaN,
                       aina: all_item.filter(itm=>itm.bidhaa_id === i)[0].ainaN,
                       aina_id: all_item.filter(itm=>itm.bidhaa_id === i)[0].aina,
                       kampuni: all_item.filter(itm=>itm.bidhaa_id === i)[0].brand,
                       kampuni_id: all_item.filter(itm=>itm.bidhaa_id === i)[0].kampuni,
                       vipimo: all_item.filter(itm=>itm.bidhaa_id === i)[0].vipimo,
                       vipimo_jum: all_item.filter(itm=>itm.bidhaa_id === i)[0].vipimoJum,
                       idadi_jum: all_item.filter(itm=>itm.bidhaa_id === i)[0].uwiano,
                       thamani: all_item.filter(itm=>itm.bidhaa_id === i).reduce((a,b)=> a + ((b.Bei_kununua/b.uwiano)*b.idadi),0),
                       thamaniM: all_item.filter(itm=>itm.bidhaa_id === i).reduce((a,b)=> a + (b.Bei_kuuza*b.idadi),0),
                       zote: all_item.filter(itm=>itm.bidhaa_id === i).length,
                       idadi: all_item.filter(itm=>itm.bidhaa_id === i).reduce((a,b)=> a +Number( b.idadi),0),

                   }
               }


               if(flt>0){
                items = items.filter(x=>Number(x.aina_id)===Number(flt))
            }
               if(bflt>0){
                items = items.filter(x=>Number(x.kampuni_id)===Number(bflt))
            }
               
  

        items.forEach(itm => {
        idadi_item+=1
    
        let produced = prdxnCost.state.filter(i=>i.bidhaa===itm.id),prC = 0,Coast = itm.thamani
        if(produced.length>0) {
            prC =  Number(produced[0].cost) * Number(itm.idadi)
            Coast = Number(produced[0].cost) * Number(itm.idadi)
        }

        zilizopo+=Number(Number(itm.idadi))
        thamani+=Number(itm.thamani)+prC

        mauzo_tegemeo+=Number(itm.thamaniM)
        num+=1
            trp+=`<tr>
                      <td>${num}</td>   
                    <td>`  
            var imge=data.img,coount=0,im_sr=''

            for(var im in imge){
                if(imge[im].bidhaa==itm.id) {
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
            <td>${itm.jina.replace(/[&\/\\#,+=$~%"*?<>{}`]/g, "")}</td>
            <td>${itm.zote}</td>
            <td><a  href="/production/MaterialReg?f=${itm.aina_id}"> ${itm.aina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</a></td>
            <td><a  href="/production/MaterialReg?bf=${itm.kampuni_id}"> ${itm.kampuni.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</a></td>`
            if(Number(Number(itm.idadi)/Number(itm.idadi_jum))>1){

                trp+=`  <td><span class="smallerFont text-primary">${itm.vipimo_jum} </span></td>
                        <td> <span class="font-weight-bold">${(Number(itm.idadi)/Number(itm.idadi_jum)).toFixed(2)}</span> </td> 
                        <td class="maroon">${Number(Number(Coast).toFixed(2)).toLocaleString()}</td>
                        `
                   
                    }else{
                trp+=`

                        <td><span class="smallerFont text-primary">${itm.vipimo} </span></td>
                        <td> <span class="font-weight-bold">${Number(itm.idadi).toFixed(2)}</span> </td>
                        <td class="maroon">${Number(Coast.toFixed(2)).toLocaleString()}</td>
                          
                ` 
            }
           
        trp+=` 
            <td >
            <div class="d-flex">
                <a  href="/production/MaterialItems?f=${itm.id}" class="btn btn-default  btn-sm text-primary " > 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
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



