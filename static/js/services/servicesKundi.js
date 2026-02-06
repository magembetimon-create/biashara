function placedataTotable(data){
    
    

    // products list
let trp = ` 
<table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
<thead>
    <tr class="smallFont ">
        
        <th>#</th>
        <th> ${lang('Jina la kundi','Group Name')}</th>
        <th>${lang('Aina za Bidhaa','Items Categories')}</th>
        <th> ${lang('Bidhaa','Items')} </th>      
        <th> ${lang('Idadi','Quantity')} </th>      
        <th> ${lang('Thamani(Jumla)','Cost(Total)')} </th>
        <th>Action</th>
    </tr>
</thead>
<tbody id="products_list">`

let idadi_item=0,zilizopo=0,thamani=0,mauzo_tegemeo=0,num=0

    if(pcategs.state.length>0){ 

        const all_item = data.products.filter(x=>x.service),
               itemsK = [...new Set(all_item.map(i=>i.group))],
               items = itemsK.map(i=>getAllItm(i))

               function getAllItm(i){
                   if(all_item.filter(itm=>itm.group===i).length > 0){
                       return {
                       id : i,
                       jina: all_item.filter(itm=>Number(itm.group) === i)[0].group_name,
                       kundi_id: all_item.filter(itm=>Number(itm.group) === i )[0].group,
                       g_aina:all_item.filter(itm=>Number(itm.group) === i)[0].group_aina,

                       aina: Categs.state.filter(itm=>itm.mahi_id === i ).length,
                       idadi_jum: all_item.filter(itm=>Number(itm.group) === i)[0].uwiano,
                       thamani: all_item.filter(itm=>Number(itm.group) === i).reduce((a,b)=> a + ((b.Bei_kununua/b.uwiano)*b.idadi),0),
                       thamaniM: all_item.filter(itm=>Number(itm.group) === i).reduce((a,b)=> a + (b.Bei_kuuza*b.idadi),0),
                       zote: all_item.filter(itm=>Number(itm.group) === i).length,
                       idadi: all_item.filter(itm=>Number(itm.group) === i).reduce((a,b)=> a +Number( b.idadi),0),
                       vipimo: all_item.filter(itm=>Number(itm.group) === i)[0].vipimo,
                       vipimo_jum: all_item.filter(itm=>Number(itm.group) === i)[0].vipimoJum,
                   }
                }else{
                    return{
                        id : i,
                        jina: pcategs.state.find(itm=>Number(itm.id) === i).mahitaji,
                        kundi_id: i,
                        aina: Categs.state.filter(itm=>itm.mahi_id === i ).length,
                        idadi_jum: 0,
                        thamani: 0,
                        thamaniM: 0,
                        zote: 0,
                        idadi: 0,
                        vipimo: 0,
                        vipimo_jum: 0,
                        g_aina:0,
                    }
                }
                   
               }



               
    
            
        items.forEach(itm => {
        idadi_item+=1

        let produced = prdxnCost.state.filter(i=>i.kundi===Number(itm.id)),prC = 0,Coast = itm.thamani

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
            <td class="text-capitalize" >${itm.aina}</td>
            <td>${itm.zote}</td>
            `
          
            trp+=`
                    
                    <td> <span class="font-weight-bold">${parseInt(itm.idadi)}</span> </td>
                    <td class="maroon">${parseInt(Coast).toLocaleString()}</td>
            ` 
        
           
        trp+=` 
            <td >
            <div class="d-flex">

                <button data-id=${itm.id} data-aina=${itm.g_aina} data-toggle="modal" data-target="#kundi-modal"  data-name="${itm.jina.replace(/[&\/\\#,+=$~%"*?<>{}`]/g, "")}" class="btn edit_group btn-default text-primary btn-sm" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                
                <a href="/stoku/servicesAina?f=${itm.id}"  class="btn btn-default text-primary btn-sm  " > 
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


animateValue(sajiriwa, 0, Number(idadi_item).toFixed(FIXED_VALUE), 1000);
animateValue(total_items, 0, Number(zilizopo).toFixed(FIXED_VALUE), 1000);
animateValue(thamani_ya_bidhaa, 0, Number(thamani).toFixed(FIXED_VALUE), 1300);

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



