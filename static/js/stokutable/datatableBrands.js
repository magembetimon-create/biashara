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
         <th> ${lang('Thamani kwa Kuuza(Jumla)','Value for Sales(Total)')}</th>
         <th>Action</th>
     </tr>
 </thead>
 <tbody id="products_list">`
 let idadi_item=0,zilizopo=0,thamani=0,mauzo_tegemeo=0,num=0
 
     if(brands.state.length>0){ 
         const itemsK = [...new Set(data.products.map(i=>i.kampuni))],
                all_item = data.products.filter(x=>(Number(x.Bei_kuuza)>0 || !x.material) && !x.service)
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
         thamani+=Number(itm.thamani)+ prC

 
         mauzo_tegemeo+=Number(itm.thamaniM)
         num+=1
             trp+=`<tr>
             <td>${num}</td>
             <td class="text-capitalize" >${itm.jina.replace(/[&\/\\#,+=$~%"*?<>{}`]/g, "")}</td>
             <td> <a class="btn btn-default smallFont text-primary" href="/stoku/aina?bf=${itm.id}" >${itm.ainas}</a></td>
             <td>${itm.zote}</td>
             `
                 trp+=`
 
                         <td> <span class="font-weight-bold">${Number(itm.idadi)}</span> </td>
                         <td class="maroon">${Number(Coast).toLocaleString()}</td>
                         <td class="greyscale">${Number(itm.thamaniM).toLocaleString()}</td>  
                 ` 
           
         trp+=` 
             <td >
             <div class="d-flex">
 
                 <button data-target="#kampuni-modal" data-toggle="modal" onclick="$('#kampuni-form').data({edit:1,value:${itm.id}});$('#kampuni-name').val('${itm.jina}');" data-id=${itm.id} class="btn btn-default btn-sm">
                      <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                             <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                             <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                         </svg>
                 </button>

                 <button  data-id=${itm.id} 
                 onclick="
                      if(${itm.zote==0}){
                          if(confirm('${lang('Odoa Chapa ya bidhaa','Remove Items Brand')}?')){
                              let data={data:{val:${itm.id},csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},url:'/stoku/futaBrand'};
                                saveStokuData(data) 
                          }
                         
                      }else{
                          alert('${lang('Chapa Haiwezi kufutwa kutokana na Kuwa na Bidhaa','Items Brand can not be deleted due to presence number of associated brand items')}')
                        }
                        
                        " class="btn btn-default text-danger btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
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
 
 
 animateValue(sajiriwa, 0, Number(idadi_item).toFixed(2), 1000);
 animateValue(total_items, 0, Number(zilizopo).toFixed(2), 1000);
 animateValue(thamani_ya_bidhaa, 0, Number(thamani).toFixed(2), 1300);
 animateValue(mauzo_tegemeoni, 0, Number(mauzo_tegemeo).toFixed(2), 1600);
 animateValue(faida_tegemeo, 0, Number(mauzo_tegemeo-thamani).toFixed(2), 1900);
 
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
 
 
 
 