function placedataTotable(data){
    let flt = Number($('#itemsKey').val()) || 0 
 
 
     // products list
 let trp = ` 
 <table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
 <thead>
     <tr class="smallFont ">
         <th>#</th>
         <th>${lang('Jina la chapa','Brand Name')}</th>
         <th> ${lang('Aina','Categories')} </th>  
         <th> ${lang('Bidhaa','Items')} </th>      
         <th> ${lang('Idadi','Quantity')} </th>      
         <th> ${lang('Thamani(Jumla)','Cost(Total)')} </th>

     </tr>
 </thead>
 <tbody id="products_list">`
 let idadi_item=0,zilizopo=0,thamani=0,mauzo_tegemeo=0,num=0
 
     if(brands.state.length>0){ 
         const all_item = data.products.filter(x=>x.material),
                itemsK = [...new Set(all_item.map(i=>i.kampuni))]

                let items = itemsK.map(i=>getAllItm(i))
                function getAllItm(i){
                    if(all_item.filter(itm=>itm.kampuni === i).length>0){
                        return {
                            id : i,
                            jina: all_item.filter(itm=>itm.kampuni === i)[0].brand,
                            kundi: all_item.filter(itm=>itm.kampuni === i )[0].group_name,
                            aina: all_item.filter(itm=>itm.kampuni === i )[0].aina,
                            ainas:[... new Set(all_item.filter(itm=>itm.kampuni === i ).map(a=>a.aina))].length,
                            kundi_id: all_item.filter(itm=>itm.kampuni === i )[0].group,
                            idadi_jum: all_item.filter(itm=>itm.kampuni === i)[0].uwiano,
                            thamani: all_item.filter(itm=>itm.kampuni === i).reduce((a,b)=> a + ((b.Bei_kununua/b.uwiano)*b.idadi),0),
                            thamaniM: all_item.filter(itm=>itm.kampuni === i).reduce((a,b)=> a + (b.Bei_kuuza*b.idadi),0),
                            zote: all_item.filter(itm=>itm.kampuni === i).length,
                            idadi: all_item.filter(itm=>itm.kampuni === i).reduce((a,b)=> a +Number( b.idadi),0),
                            vipimo: all_item.filter(itm=>itm.kampuni === i)[0].vipimo,
                            vipimo_jum: all_item.filter(itm=>itm.kampuni === i)[0].vipimoJum,
                    
                        }
                    }else{
                        return {
                            id : i,
                            jina: brands.state.find(itm=>itm.id === i).kampuni_jina,
                            idadi_jum: 0,
                            thamani:0,
                            thamaniM: 0,
                            zote: 0,
                            aina:0,
                            ainas:0,
                            idadi: 0,
                            vipimo: 0,
                            vipimo_jum: 0,
                    
                        }
                    }

                }
 
 
             if(flt>0){
                 items = items.filter(x=>Number(x.aina)===Number(flt))
             }
                
         
 
         items.forEach(itm => {
         idadi_item+=1
         let produced = prdxnCost.state.filter(i=>i.brand===itm.id),prC = 0,Coast = itm.thamani
         if(produced.length>0) {
             prC =  Number(produced.reduce((a,b)=> a + ((b.cost)*b.idadi),0))
             Coast = prC
         }
 
         zilizopo+=Number(Number(itm.idadi))
         thamani+=Number(itm.thamani) + prC

 
         mauzo_tegemeo+=Number(itm.thamaniM)
         num+=1
             trp+=`<tr>
             <td>${num}</td>
             <td class="text-capitalize" >${itm.jina.replace(/[&\/\\#,+=$~%"*?<>{}`]/g, "")}</td>
             <td> <a class="btn btn-default smallFont text-primary" href="/production/MaterialAina?bf=${itm.id}" >${itm.ainas}</a></td>
             <td>${itm.zote}</td>
             `
                 trp+=`
 
                         <td> <span class="font-weight-bold">${Number(itm.idadi).toFixed(2)}</span> </td>
                         <td class="maroon">${Number((Coast).toFixed(2)).toLocaleString()}</td>
               
     
     
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
 
 
 
 