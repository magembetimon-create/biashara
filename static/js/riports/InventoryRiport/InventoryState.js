var INVENTORY = 1,SVD=0,SVDD=[],ALLSAVED=[],STATE=[],Uzalishaji = 0,BIDHAA=[],THE_INITIAL=[],ITEM_BRANCH = {},THE_ITEMS = [],Back_to_categ = 0,Back_to_group = 0
const SELECTED = () =>$('#Matawini').find('option:selected')
         
     
function loadStockDate(){

    theData.state =     STATE.find(s=>s.svd===SVD)
    if(theData.state){
        CreateView()
    }else{
    let dta = {
        data:{ 
                svd:SVD,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
            },
            url:`/riport/StockStateData`}

            $("#loadMe").modal('show');

            let fct = getRiportData(dta)

             fct.then(function(data){
                $("#loadMe").modal('hide');

                if(data.success){
                    STATE.push(data)
                    
                      
                    theData.state = STATE.find(s=>s.svd===SVD)
                     
                     SVDD=SVD>0?SVDD:data.svdData
                     ALLSAVED=SVD>0?ALLSAVED:data.AllSavd


                     

                     CreateView()
                }else{
                    toastr.error(lang('Hakuna Hesabu iliyopo kwa Sasa','No Inventory State Available'), lang('Haikufanikwa','error Alert'), {timeOut: 2000});
                }
               

                 
           })        
    }
     }
     loadStockDate()


   function  CreateView(){

        const Tawi = branch(),dkf=d=>d.duka===Tawi,     
              PRODUXN = Number(SELECTED().data('production')),
              SERVICES = Number(SELECTED().data('service')),
              SALES = Number(SELECTED().data('sales')), 

                PuCheck = $('#PurchaseIn').prop('checked'),
                ProdCheck = $('#ProducedIn').prop('checked'),
                RecevCheck = $('#ReceiveIn').prop('checked'),
                AddedCheck = $('#RegisterIn').prop('checked'),

                svdStates = SVDD.find(d=>d.duka===Tawi)?.svd
                $('#toSave').data('svd',svdStates)

               


        let {data:shelfu,pay,adjst,mauzo,transfer,svdDate,svdDesc,svdData} = theData.state,
              
             shelf = shelfu.filter(dkf)
             adjst =  adjst.filter(dkf)
             mauzo =  mauzo.filter(dkf)
             pay = pay.filter(dkf)
             transfer = transfer.filter(dkf)

      
         

            const ftF = INVENTORY==1?b => !b.service && !b.material:INVENTORY==2?b=>b.material:b=>b.service, //Products/Material/assets filter ...............//
                  sale = filterDt(mauzo),
                  adjsted = filterDt(adjst),
                  transfd = filterDt(transfer),
                  shefu = filterDt(shelf),
                  item = INVENTORY==1?lang('Bidhaa','Item(s)'):INVENTORY==2?lang('Nyenzo','Material Item(s)'):lang('Aseti','Assets'),
                  n = Number($('#riportSwitch .btn-primary').data('riport'))



            function filterDt(dte){
                    
                    const dt = dte.filter(ftF),

                        excludeTra = p=>(p.manunuzi_id!=null || p.produced_id!=null || p.ongezwa_id!=null) && p.uhamisho_id===null,
                        TransF = p => p.uhamisho_id!=null

                        let toFilter = dt.filter(excludeTra),
                            TransFer = dt.filter(TransF),
                            others = dt.filter(p=>p.ongezwa_id===null && p.uhamisho_id===null && p.manunuzi_id === null && p.produced_id === null)

                            toFilter = PuCheck?toFilter.filter(p=>Number(p.rudi)!=Number(p.initialPu)):toFilter.filter(p=>p.manunuzi_id===null)
                            toFilter = ProdCheck?toFilter:toFilter.filter(p=>p.produced_id===null)
                            toFilter = RecevCheck?[... toFilter, ...TransFer]:toFilter,
                            toFilter = AddedCheck?[... toFilter, ...others]:toFilter.filter(p=>p.ongezwa_id===null) 

                            return toFilter
                            
            }
             
             const InventorySummary = () =>{
                 const acc = pay.reduce((a,b)=>a + Number(b.Amount),0),
                       prod = shelf.filter(b=>!b.service&&!b.material).reduce((a,b)=>a + Number(b.Bei_kununua*(SVD>0?b.sidadi:b.idadi))/Number(b.uwiano),0),
                       material = shelf.filter(b=>b.material).reduce((a,b)=>a + Number(b.Bei_kununua*(SVD>0?b.sidadi:b.idadi))/Number(b.uwiano),0),
                       assets = shelf.filter(b=>b.service).reduce((a,b)=>a + Number(b.Bei_kununua*(SVD>0?b.sidadi:b.idadi))/Number(b.uwiano),0),
                       tot = acc + prod + material + assets,

                    svBtn = `  
                    <span class="brown">(${moment().format('DD/MM/YYYY HH:mm')})</span>
                    <button type="button" data-toggle="modal" data-target="#SaveInventoryState" class="btn btn-light darkblue  float-right btn-sm" data-r="0" data-riport="0" data-val="0" title="${lang('Hifadhi Hali ya sasa','Save Current State')}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="#ccc" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                        <polyline points="7 3 7 8 15 8"></polyline>
                                </svg>
                                </button>`,  
                     
                    morebtn =` <button type="button" onclick="$('#forSaved').toggle(200)" class="btn btn-default py-1 px-2 btn-sm float-right btn-sm"  title="${lang('Onesha Orodha','Show List')}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                </button>`,   

                    titleBtn = SVD?morebtn:svBtn   ,        

                    stateTitle = SVD==0?lang('Hali ya Hesabu na Thamani Kwa Sasa','Current Inventory State'):lang(`Hali ya Hesabu Kama Ilivyokuwa <span class="darkblue"> ${moment(svdDate).format('DD/MM/YYYY HH:mm')} </span> `,`Inventory State As Of <span class="darkblue">${moment(svdDate).format('DD/MM/YYYY HH:mm')}</span>`)
                    $('#stateTitle').html(stateTitle+titleBtn)

                    let tr = `
                        <table class="table  table-hover table-striped latoFont table-sm border">
                            <thead>
                                <tr>
                                    <th>${lang('Hesabu','Inventory')}</th>
                                    <th>%</th>
                                    <th>${lang('Thamani','Worth')} ${CURRENCII} </th>
                                    
                                </tr>
                            </thead>
                            <tbody >
                               <tr class="py-3">
                                   <td>${lang('Pesa Taslimu','Cash Amount')}</td>
                                   <td>${floatValue(acc*100/tot)}%</td>
                                   <td>${floatValue(acc)}</td>
                               </tr>
                               <tr class="py-3">
                                   <td>${lang(`Bidhaa${SALES?' za Kuuza':'/Vitu'} `,`Goods${SALES?' For Sales':'/Item(s)'} `)}</td>
                                   <td>${floatValue(prod*100/tot)}%</td>
                                   <td>${floatValue(prod)}</td>
                               </tr>`

                               if(PRODUXN){
                                    tr+=`<tr class="py-3">
                                        <td>${lang('Nyezo za Uzalishaji','Production Materials')}</td>
                                        <td>${floatValue(material*100/tot)}%</td>
                                        <td>${floatValue(material)}</td>
                                    </tr>`
                               }
                              
                               if(SERVICES){
                                    tr+=`<tr class="py-3">
                                            <td>${lang('Aseti za Huduma','Services Assets')}</td>
                                            <td>${floatValue(assets*100/tot)}%</td>
                                            <td>${floatValue(assets)}</td>
                                        </tr>`  
                               }
                           

                               tr+=`<tr class="weight600 bg-light py-3">
                                   <td>${lang('Jumla','Total')}</td>
                                   <td>100%</td>
                                   <td>${floatValue(tot)}</td>
                               </tr>
                               </tbody>
                               </table>
                    `   

                    return tr
                },

                 
                InventoryState = () =>{


                    const  
                        shelfu =  shelf.filter(ftF),
                        initialPu =  PuCheck?shelfu.filter(p=>p.manunuzi_id!=null && p.uhamisho_id===null && Number(p.inialPu)!=Number(p.rudi)):[],
                        initialProd =  ProdCheck?shelfu.filter(p=>p.produced_id!=null && p.uhamisho_id===null):[],
                        initialRecev =  RecevCheck?shelfu.filter(p=>p.uhamisho_id!=null):[],
                        initialAdded =  AddedCheck?shelfu.filter(p=>(p.ongezwa_id!=null && p.uhamisho_id===null) || (p.ongezwa_id===null && p.uhamisho_id===null && p.manunuzi_id === null && p.produced_id === null)):[],
                        initialAdd =  AddedCheck?adjst.filter(ftF).filter(p=>(p.Ongeza || p.register) && (p.manunuzi_id===null && p.uhamisho_id===null && p.produced_id===null)):[],

                        shelfi = [...initialPu,...initialProd,...initialRecev,...initialAdded],
                    
                        Pu = {qty:initialPu.length,tha:initialPu.reduce((a,b)=>a+Number(b.tha*b.initPu/b.uwiano),0),sale:initialPu.reduce((a,b)=>a+Number((b.initPu-b.rudi)*b.sale),0)},
                        Mnf = {qty:initialProd.length,tha:initialProd.reduce((a,b)=>a+Number(b.tha*b.initPro/b.uwiano),0),sale:initialProd.reduce((a,b)=>a+Number(b.initPro*b.sale),0)},
                        Recv = {qty:initialRecev.length,tha:initialRecev.reduce((a,b)=>a+Number(b.tha*b.initTr/b.uwiano),0),sale:initialRecev.reduce((a,b)=>a+Number(b.initTr*b.sale),0)},
                       
                        
                        Add = {qty:initialAdded.length,tha:initialAdd.reduce((a,b)=>a + Number(b.tha*b.qty/b.uwiano),0),sale:initialAdd.reduce((a,b)=>a+Number(b.sale*b.qty),0)},
                    
                        curent = {qty:shelfi.length,tha:shelfi.reduce((a,b)=>a+Number(b.tha*b.idadi/b.uwiano),0),sale:shelfi.reduce((a,b)=>a + Number(b.Bei_kuuza*b.idadi),0)},
                        saved = {qty:shelfi.length,tha:shelfi.reduce((a,b)=>a+Number(b.tha*b.sidadi/b.uwiano),0),sale:shelfi.reduce((a,b)=>a + Number(b.Bei_kuuza*b.sidadi),0)},
                       
                        sold = {qty:[... new Set(sale.map(p=>p.produ_id))].length,tha:sale.reduce((a,b)=>a+Number(b.tha*(b.idadi-b.returned)/b.uwiano),0),sale:sale.reduce((a,b)=>a + Number(b.sale*(b.idadi-b.returned)),0)},
                        transfered = {qty:[... new Set(transfd.map(p=>p.toka_id))].length,tha:transfd.reduce((a,b)=>a+Number(b.tha*b.qty/b.uwiano),0),sale:transfd.reduce((a,b)=>a + Number(b.sale*b.qty),0)},
                        waste = {qty:[... new Set(adjsted.filter(ad=>ad.waste).map(p=>p.prod_id))].length,tha:adjsted.filter(ad=>ad.waste).reduce((a,b)=>a+Number(b.tha*b.qty/b.uwiano),0),sale:adjsted.filter(ad=>ad.waste).reduce((a,b)=>a + Number(b.sale*b.qty),0)},
                        expire = {qty:[... new Set(adjsted.filter(ad=>ad.expire).map(p=>p.prod_id))].length,tha:adjsted.filter(ad=>ad.expire).reduce((a,b)=>a+Number(b.tha*b.qty/b.uwiano),0),sale:adjsted.filter(ad=>ad.expire).reduce((a,b)=>a + Number(b.sale*b.qty),0)},
                        damage = {qty:[... new Set(adjsted.filter(ad=>ad.damage).map(p=>p.prod_id))].length,tha:adjsted.filter(ad=>ad.damage).reduce((a,b)=>a+Number(b.tha*b.qty/b.uwiano),0),sale:adjsted.filter(ad=>ad.damage).reduce((a,b)=>a + Number(b.sale*b.qty),0)},
                        usage = {qty:[... new Set(adjsted.filter(ad=>ad.tumika && !ad.mfg).map(p=>p.prod_id))].length,tha:adjsted.filter(ad=>ad.tumika && !ad.mfg).reduce((a,b)=>a+Number(b.tha*b.qty/b.uwiano),0),sale:adjsted.filter(ad=>ad.tumika && !ad.mfg).reduce((a,b)=>a + Number(b.sale*b.qty),0)},
                        prodxn = {qty:[... new Set(adjsted.filter(ad=>ad.mfg).map(p=>p.prod_id))].length,tha:adjsted.filter(ad=>ad.mfg).reduce((a,b)=>a+Number(b.tha*b.qty/b.uwiano),0),sale:adjsted.filter(ad=>ad.mfg).reduce((a,b)=>a + Number(b.sale*b.qty),0)},

                       totQty = Pu.qty + Mnf.qty + Recv.qty + Add.qty,
                       totWorth = Pu.tha + Mnf.tha + Recv.tha + Add.tha,
                       totSale =  Pu.sale + Mnf.sale + Recv.sale + Add.sale


                      

                 

                       $('#ProducedInLabel').prop('hidden',shelfu.filter(p=>p.produced_id!=null && p.uhamisho_id===null).length==0)
                       $('#PurchaseInLabel').prop('hidden',shelfu.filter(p=>p.manunuzi_id!=null && p.uhamisho_id===null).length==0)
                       $('#ReceiveInLabel').prop('hidden',shelfu.filter(p=>p.uhamisho_id!=null).length==0)
                       $('#RegisterInLabel').prop('hidden',shelfu.filter(p=>(p.ongezwa_id!=null && p.uhamisho_id===null) || (p.ongezwa_id===null && p.uhamisho_id===null && p.manunuzi_id === null && p.produced_id === null)).length==0)

                      

                       
                       const awali = () =>{
                           let tr = `  <div class="stockState smallFont">
                                            <h6>${lang('Hali ya Awali','Initial State')}</h6>
                                            <div class="row ">
                                                <div class="col-7">${item}</div>
                                                <div class="col-5 weight600">${floatValue(totQty)}</div>
                                                <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                <div class="col-5 weight600">${floatValue(totWorth)}</div>`
                                                if(INVENTORY==1||INVENTORY==2){
                                                      tr+=  `<div class="col-7">${lang('Tegemeo la Mauzo','Sales Expectetion')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                             <div class="col-5 weight600">${floatValue(totSale)}</div>`
                                                  }

                                              tr+=`
                                            </div>
                                        </div>`

                                        return tr
                                },
                             sasa = () =>{
                                                let tr=`<div class="stockState row smallFont">
                                                            <h6 class=" col-12  row"  > 
                                                            <div class="col-10">
                                                            <h6>${lang('Hali ya Sasa','Current State')}</h6>
                                                            </div> 
                                                            <div class="col-2 ">${floatValue(curent.tha*100/totWorth || 0)}%</div>
                                                        </h6>         
                                                        <div class="col-10">
                                            
                                                        <div class="row ">
                                                                <div class="col-7">${item}</div>
                                                            <div class="col-5 weight600">${floatValue(curent.qty)}</div>
                                                            <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                            <div class="col-5 weight600">${floatValue(curent.tha)}</div>`

                                                        if(INVENTORY==1||INVENTORY==2){
                                                                tr+=  `<div class="col-7">${lang('Tegemeo la Mauzo','Sales Expectetion')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                                    <div class="col-5 weight600">${floatValue(curent.sale)}</div>`
                                                            }
                                                    
                                                
                                                        tr+=`</div>                
                                                            </div>
                                                
                                                            <div class="col-2">
                                                                <div class="progress progress-bar-vertical">
                                                                    <div class="progress-bar " role="progressbar" aria-valuenow="${curent.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${curent.tha*100/totWorth}%;">
                                                                    
                                                                    </div>
                                                                </div>
                                                            </div>
                                            
                                            
                                                    </div>`
                                    return tr
                                },
                             kuuzwa = () =>{
                                    let tr = `  <div class="stockState row smallFont">
                                                        <h6 class=" col-12  row"  > 
                                                            <div class="col-10">
                                                            <h6>${lang('Mauzo','Sales')}</h6>
                                                            </div> 
                                                            <div class="col-2 ">${floatValue(sold.tha*100/totWorth || 0)}%</div>
                                                        </h6>         
                                                        <div class="col-10">
                                            
                                                        <div class="row ">
                                                                <div class="col-7">${item}</div>
                                                            <div class="col-5 weight600">${floatValue(sold.qty)}</div>
                                                            <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                            <div class="col-5 weight600">${floatValue(sold.tha)}</div>`

                                                        if(INVENTORY==1||INVENTORY==2){
                                                                tr+=  `<div class="col-7">${lang('Jumla ya Mauzo','Total Sales')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                                    <div class="col-5 weight600">${floatValue(sold.sale)}</div>`
                                                            }
                                                    
                                                
                                                        tr+=`</div>                
                                                            </div>
                                                
                                                            <div class="col-2">
                                                                <div class="progress progress-bar-vertical">
                                                                    <div class="progress-bar " role="progressbar" aria-valuenow="${sold.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${sold.tha*100/totWorth}%;">
                                                                    
                                                                    </div>
                                                                </div>
                                                            </div>
                                            
                                            
                                                    </div>`
                                    
                                    return tr


                                },
                             tumika = () => {
                                           
                                         let tmk= `<div class="stockState row smallFont">
                                                <h6 class=" col-12  row"  > 
                                                <div class="col-10">
                                                <h6>${lang('Kutumika','Usage')}</h6>
                                                </div> 
                                                <div class="col-2 ">${floatValue(usage.tha*100/totWorth || 0)}%</div>
                                            </h6>         
                                            <div class="col-10">
                                
                                            <div class="row ">
                                                    <div class="col-7">${item}</div>
                                                <div class="col-5 weight600">${floatValue(usage.qty)}</div>
                                                <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                <div class="col-5 weight600">${floatValue(usage.tha)}</div>`

                                              if(INVENTORY==1||INVENTORY==2){
                                                    tmk+=  `<div class="col-7">${lang('Jumla ya Mauzo','Total Sales')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                           <div class="col-5 weight600">${floatValue(usage.sale)}</div>`
                                                }
                                         
                                      
                                            tmk+=`</div>                
                                                </div>
                                    
                                                <div class="col-2">
                                                    <div class="progress progress-bar-vertical">
                                                        <div class="progress-bar " role="progressbar" aria-valuenow="${usage.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${usage.tha*100/totWorth}%;">
                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                
                                
                                        </div>`

                                        return tmk
                                    },

                             Saved = () => {
                                           
                                         let tmk= `<div class="stockState row smallFont">
                                                <h6 class=" col-12  row"  > 
                                                <div class="col-10">
                                                <h6>${lang('Hali Ilivyokuwa','Saved State')}</h6>
                                                </div> 
                                                <div class="col-2 ">${floatValue(saved.tha*100/totWorth || 0)}%</div>
                                            </h6>         
                                            <div class="col-10">
                                
                                            <div class="row ">
                                                    <div class="col-7">${item}</div>
                                                <div class="col-5 weight600">${floatValue(saved.qty)}</div>
                                                <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                <div class="col-5 weight600">${floatValue(saved.tha)}</div>`

                                              if(INVENTORY==1||INVENTORY==2){
                                                    tmk+=  `<div class="col-7">${lang('Jumla ya Mauzo','Total Sales')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                           <div class="col-5 weight600">${floatValue(saved.sale)}</div>`
                                                }
                                         
                                      
                                            tmk+=`</div>                
                                                </div>
                                    
                                                <div class="col-2">
                                                    <div class="progress progress-bar-vertical">
                                                        <div class="progress-bar " role="progressbar" aria-valuenow="${saved.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${saved.tha*100/totWorth}%;">
                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                
                                
                                        </div>`

                                        return tmk
                                    },
                            //  expired = () => {
                                           
                            //              let tmk= `<div class="stockState row smallFont">
                            //                     <h6 class=" col-12  row"  > 
                            //                     <div class="col-10">
                            //                     <h6>${lang('Kupitwa Muda','Expired')}</h6>
                            //                     </div> 
                            //                     <div class="col-2 ">${floatValue(expire.tha*100/totWorth || 0)}%</div>
                            //                 </h6>         
                            //                 <div class="col-10">
                                
                            //                 <div class="row ">
                            //                         <div class="col-7">${item}</div>
                            //                     <div class="col-5 weight600">${floatValue(expire.qty)}</div>
                            //                     <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                            //                     <div class="col-5 weight600">${floatValue(expire.tha)}</div>`

                            //                   if(INVENTORY==1||INVENTORY==2){
                            //                         tmk+=  `<div class="col-7">${lang('Jumla ya Mauzo','Total Sales')}<span class="text-primary smallerFont">(${currencii})</span></div>
                            //                                <div class="col-5 weight600">${floatValue(expire.sale)}</div>`
                            //                     }
                                         
                                      
                            //                 tmk+=`</div>                
                            //                     </div>
                                    
                            //                     <div class="col-2">
                            //                         <div class="progress progress-bar-vertical">
                            //                             <div class="progress-bar " role="progressbar" aria-valuenow="${expire.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${expire.tha*100/totWorth}%;">
                                                        
                            //                             </div>
                            //                         </div>
                            //                     </div>
                                
                                
                            //             </div>`

                            //             return tmk
                            //         },
                            //  kupotea = () => {
                                           
                            //              let tmk= `<div class="stockState row smallFont">
                            //                     <h6 class=" col-12  row"  > 
                            //                     <div class="col-10">
                            //                     <h6>${lang('Upotevu','Wastes')}</h6>
                            //                     </div> 
                            //                     <div class="col-2 ">${floatValue(waste.tha*100/totWorth || 0)}%</div>
                            //                 </h6>         
                            //                 <div class="col-10">
                                
                            //                 <div class="row ">
                            //                         <div class="col-7">${item}</div>
                            //                     <div class="col-5 weight600">${floatValue(waste.qty)}</div>
                            //                     <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                            //                     <div class="col-5 weight600">${floatValue(waste.tha)}</div>`

                            //                   if(INVENTORY==1||INVENTORY==2){
                            //                         tmk+=  `<div class="col-7">${lang('Jumla ya Mauzo','Total Sales')}<span class="text-primary smallerFont">(${currencii})</span></div>
                            //                                <div class="col-5 weight600">${floatValue(waste.sale)}</div>`
                            //                     }
                                         
                                      
                            //                 tmk+=`</div>                
                            //                     </div>
                                    
                            //                     <div class="col-2">
                            //                         <div class="progress progress-bar-vertical">
                            //                             <div class="progress-bar " role="progressbar" aria-valuenow="${waste.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${waste.tha*100/totWorth}%;">
                                                        
                            //                             </div>
                            //                         </div>
                            //                     </div>
                                
                                
                            //             </div>`

                            //             return tmk
                            //         },
                             hamishwa = () => {
                                           
                                         let tmk= `<div class="stockState row smallFont">
                                                <h6 class=" col-12  row"  > 
                                                <div class="col-10">
                                                <h6>${lang('Kuhamishwa','Transfered')}</h6>
                                                </div> 
                                                <div class="col-2 ">${floatValue(transfered.tha*100/totWorth || 0)}%</div>
                                            </h6>         
                                            <div class="col-10">
                                
                                            <div class="row ">
                                                    <div class="col-7">${item}</div>
                                                <div class="col-5 weight600">${floatValue(transfered.qty)}</div>
                                                <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                <div class="col-5 weight600">${floatValue(transfered.tha)}</div>`

                                              if(INVENTORY==1||INVENTORY==2){
                                                    tmk+=  `<div class="col-7">${lang('Jumla ya Mauzo','Total Sales')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                           <div class="col-5 weight600">${floatValue(transfered.sale)}</div>`
                                                }
                                         
                                      
                                            tmk+=`</div>                
                                                </div>
                                    
                                                <div class="col-2">
                                                    <div class="progress progress-bar-vertical">
                                                        <div class="progress-bar " role="progressbar" aria-valuenow="${transfered.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${transfered.tha*100/totWorth}%;">
                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                
                                
                                        </div>`

                                        return tmk
                                    },
                             uzalishaji = () => {
                                           
                                         let tmk= `<div class="stockState row smallFont">
                                                <h6 class=" col-12  row"  > 
                                                <div class="col-10">
                                                <h6>${lang('Uzalishaji','Production')}</h6>
                                                </div> 
                                                <div class="col-2 ">${floatValue(prodxn.tha*100/totWorth || 0)}%</div>
                                            </h6>         
                                            <div class="col-10">
                                
                                            <div class="row ">
                                                    <div class="col-7">${item}</div>
                                                <div class="col-5 weight600">${floatValue(prodxn.qty)}</div>
                                                <div class="col-7">${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                <div class="col-5 weight600">${floatValue(prodxn.tha)}</div>`

                                              if(INVENTORY==1||INVENTORY==2){
                                                    tmk+=  `<div class="col-7">${lang('Thamani kwa Mauzo','Total By Sales')}<span class="text-primary smallerFont">(${currencii})</span></div>
                                                           <div class="col-5 weight600">${floatValue(prodxn.sale)}</div>`
                                                }
                                         
                                      
                                            tmk+=`</div>                
                                                </div>
                                    
                                                <div class="col-2">
                                                    <div class="progress progress-bar-vertical">
                                                        <div class="progress-bar " role="progressbar" aria-valuenow="${prodxn.tha*100/totWorth}" aria-valuemin="0" aria-valuemax="100" style="height: ${prodxn.tha*100/totWorth}%;">
                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                
                                
                                        </div>`

                                        return tmk
                                    },
                             
                                tr=awali()+(SVD>0?Saved():''),
                                Trend = (INVENTORY==1?SALES?transfered.qty>0&&sold.qty==0?hamishwa():kuuzwa():transfered.qty>0&&usage.qty==0?hamishwa():tumika():INVENTORY==2?transfered.qty>0&&prodxn.qty==0?hamishwa():uzalishaji():'')+sasa()

                                 //+hamishwa()+tumika()+uzalishaji()+haribika()+expired()+kupotea()

                   if(n==1){
                    placeGeneral = () =>{
                         let tr=`
                            <h6 class="py-2" > ${lang(`Hali na Mwenendo wa ${item} Kwa Ujumla`,`${item} General State & Trends`)} </h6>
                              <div class="table-responsive">
                                        <table class="table  table-hover  latoFont table-sm border">
                                        <thead>
                                            <tr  >
                                              
                                                <th class="text-left">${lang(`Hali/Mwenendo` ,`State/Trends`)}</th>
                                                
                                                <th class="text-left">${item}</th>
                                                <th class="text-left">${lang(`Thamani`,`Worth`)} ${CURRENCII}</th>
                                                <th class="text-left">%</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                               <tr class="manunuzi" >
                                                  
                                                   <td>${lang(`Awali`,`Initially`)}</td>
                                                   <td>${floatValue(totQty)}</td>
                                                   <td>${floatValue(totWorth)}</td>
                                                   <td>100%</td>
                                                 
                                               </tr>

                                               
                                           `
                                          if(SVD>0) {
                                            tr+=`
                                                <tr class="savedState">
                                                    
                                                    <td>${lang(`Ilivyokuwa`,`Saved State`)}</td>
                                                    <td>${floatValue(saved.qty)}</td>
                                                        <td>${floatValue(saved.tha||0)}</td>
                                                    <td>${floatValue(saved.tha*100/totWorth || 0)}%</td>
                                                
                                                    
                                                </tr>`                                            
                                          }

                                          if(transfered.qty>0) {
                                            tr+=`
                                                <tr class="hamishwa">
                                                    
                                                    <td>${lang(`Kuhamishwa`,`Transfered`)}</td>
                                                    <td>${floatValue(transfered.qty)}</td>
                                                        <td>${floatValue(transfered.tha||0)}</td>
                                                    <td>${floatValue(transfered.tha*100/totWorth || 0)}%</td>
                                                
                                                    
                                                </tr>`                                            
                                          }
                                          if(sold.qty>0) {
                                            tr+=`
                                                <tr class="mauzo">
                                                 
                                                    <td>${lang(`Mauzo`,`Sales`)}</td>
                                                    <td>${floatValue(sold.qty)}</td>
                                                        <td>${floatValue(sold.tha||0)}</td>
                                                    <td>${floatValue(sold.tha*100/totWorth || 0)}%</td>
                                                   
                                                    
                                                </tr>`                                            
                                          }
                                          if(INVENTORY==2) {
                                            tr+=`
                                                <tr class="uzalishaji">
                                                  
                                                    <td>${lang(`Uzalishaji`,`Production`)}</td>
                                                    <td>${floatValue(prodxn.qty)}</td>
                                                        <td>${floatValue(prodxn.tha||0)}</td>
                                                    <td>${floatValue(prodxn.tha*100/totWorth || 0)}%</td>
                                                   
                                                    
                                                </tr>`                                            
                                          }

                                          
                                         tr+=`
                                                <tr class="usage">
                                                   
                                                    <td>${lang(`Matumizi`,`Usage`)}</td>
                                                    <td>${floatValue(usage.qty)}</td>
                                                        <td>${floatValue(usage.tha||0)}</td>
                                                    <td>${floatValue(usage.tha*100/totWorth || 0)}%</td>
                                                
                                                    
                                                </tr>

                                                <tr class="damage">
                                               
                                                    <td>${lang(`Uharibifu`,`Damages`)}</td>
                                                    <td>${floatValue(damage.qty)}</td>
                                                        <td>${floatValue(damage.tha||0)}</td>
                                                    <td>${floatValue(damage.tha*100/totWorth || 0)}%</td>
                                                   
                                                    
                                                </tr>
                                                <tr class="wastes">
                                               
                                                    <td>${lang(`Upotevu`,`Wastege`)}</td>
                                                    <td>${floatValue(waste.qty)}</td>
                                                        <td>${floatValue(waste.tha||0)}</td>
                                                    <td>${floatValue(waste.tha*100/totWorth || 0)}%</td>
                                                   
                                                    
                                                </tr>
                                                <tr class="expire">
                                               
                                                    <td>${lang(`Kupitwa Muda`,`Expired`)}</td>
                                                    <td>${floatValue(expire.qty)}</td>
                                                        <td>${floatValue(expire.tha||0)}</td>
                                                    <td>${floatValue(expire.tha*100/totWorth || 0)}%</td>
                                                   
                                                    
                                                </tr>

                                            <tr class="zilizopo">
                                                   
                                                <td>${lang(`Kwa Sasa`,`Current State`)}</td>
                                                <td>${floatValue(curent.qty)}</td>
                                                    <td>${floatValue(curent.tha||0)}</td>
                                                <td>${floatValue(curent.tha*100/totWorth || 0)}%</td>
                                            
                                                
                                            </tr>
                                                
                                                
                                                `


                                         tr+=`</tbody>
                                    </table>
                                 </div>   
                         `
                         $('#theDataPanel').html(tr)

                    }

                    placeGeneral()
                   }              

                   return tr + Trend

                }
                
                const SvdDesc = `
                   <span  class="border-right p-1 mx-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                            </svg>
                   </span>

                   ${svdDesc}
              `
                $('#SaveDesc').html(SVD?SvdDesc:'')

             if(SVD){

                allSavedDt()
             }

             $('#InventoryWorth').html(InventorySummary)   
             $('#stockStated').html(InventoryState)   

             
             Back_to_categ = 0
             Back_to_group = 0

               //GENERATE URLS FOR PRINTING ..........................................//
            URL1 = `/riport/PrintStockState?entp=${Tawi}&inv=${INVENTORY}&svd=${SVD}`,
            urlbtn = `
                            <button type="button" data-lang="${lang(0,1)}" data-href="${URL1}&lang=${lang(0,1)}" title="${lang('Kuchapa','Print')}"  class="btn btn-light actionbtns border-secondary btn-sm smallFont  ">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                                            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
                                    </svg>
                                    ${lang('Chapa','Print')}
                               </button>
                        
                        <div class="btn-group" role="group" >
                          <button id="btnGroupDrop1" type="button" class="btn btn-light border-secondary btn-sm smallFont dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                     
                           </button>
                                    <div class="dropdown-menu smallerFont" aria-labelledby="btnGroupDrop1">
                                    <button class="dropdown-item btn btn-default actionbtns" data-lang=0 data-href="${URL1}&lang=0" >Kiswahili</button>
                                    <button class="dropdown-item btn btn-default actionbtns" data-lang=1 data-href="${URL1}&lang=1" >English</button>
                            </div>

                        </div>




            `

           $('#printURLS').html(urlbtn)  
           
           
             
             switch (Number(n)) {
                case 5:
                    placeAlipia(pay)
                    break;
                case 2:
                    placeItems({sale,adjsted,transfd,shefu,item})
                    
                    break;
                case 3:
                    if(n==3){
                        placeCategory({sale,adjsted,transfd,shefu,item})
                    }
                    break;
                case 4:
                    placeGroups({sale,adjsted,transfd,shefu,item})
                    break;
            }
         
     }
//FOR SAVED INVENTORY STATES ONLY ....................//
   function  allSavedDt(){
        const Tawi = branch()
        let ul = ``
        ALLSAVED.filter(d=>d.duka===Tawi).forEach(l=>{
             ul+= `<li class="border-bottom py-1 pl-1 ${SVD==l.id?'activeList':''} "  >
                       <a type="button" data-svd=${l.id} data-sv=1 class="currentOrSaved pr-5" >
                         ${moment(l.date).format('DD/MM/YYYY HH:mm')} |  ${l.maelezo}
                       </a>

                       <button class="float-right btn btn-sm px-1 py-0 btn-light " onclick="if(confirm('${lang('Ondoa Hali ya Hesabu ?','Remove Imventory State ?')}')){removeSavedState(${l.id})}" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17">
                                </line>
                        </svg>
                       </button>
                    </li>`
                
        })
       $('#forSaved').html(ul)  
    }

    

     function placeItems(itmes){
             const  td = itemsTable(itmes)
                $('#theDataPanel').html(td)
                $('#ItemsTable').DataTable();
          


     }

     itemsTable =(itmes)=>{

        const {sale,adjsted,transfd,shefu,item} = itmes
       
        const   PRODUXN = Number(SELECTED().data('production')),
        SERVICES = Number(SELECTED().data('service')),
        SALES = Number(SELECTED().data('sales')), 
        HAMISHWA = transfd.length > 0,
        bidhaa = shefu.map(b=>{
        const  ft=i=>i.bidhaa_id == b.id,
        
            adj = adjsted.filter(i=>i.prod_id===(SVD>0?b.sbidhaa_id:b.id)),
            sales = sale.filter(i=>i.produ_id===(SVD>0?b.sbidhaa_id:b.id)),
                  
            added = adj.filter(p=>p.Ongeza||p.register).reduce((a,b)=>a+Number(b.qty),0),
            initqty =  Number(b.initTr || (b.initPu-b.rudi) || b.initPro || added || 0),

  
            initialN = b.uhamisho_id!=null?lang('Kupokewa','Received'):b.produced_id!=null?lang('Uzalishaji','Production'):b.manunuzi_id!=null?lang('Manunuzi','Purchases'):lang('Kuongezwa','Added'),
            hamishwa = transfd.filter(t=>t.toka_id===(SVD>0?b.sbidhaa_id:b.id)),
            code = [
                      {
                          active:b.uhamisho_id!=null,
                          code:`RC-${b.TransCode}`,
                          num:1,
                          id:b.TransId

                        }
                        ,
                         {
                          active:b.manunuzi_id!=null,
                          code:`BILL-${b.puCode}`,
                          num:2,
                          id:b.puId
                        
                        }
                        ,
                         {
                          active:b.produced_id!=null,
                          code:`BATCH-${b.ProdCode}`,
                          num:3,
                          id:b.ProdId
                          
                        }
                        ,
                         {
                          active:b.ongezwa_id!=null,
                          code:`ADJ-${b.addCode}`,
                          num:4,
                          id:b.addId
                        
                        }
                        ]
                 
      

   return {
       id:b.id,
       name:b.bidhaaN,
       bidhaa:b.bidhaa_id,
       namba:b.namba || lang('Hakuna','None'),
       Id:code.filter(n=>n.active)[0]?.id,

      
       intitDate:b.initTrDate || b.initProDate || b.initPuDate || b.initAddedDate,
       initialN:initialN,
       code:code.filter(n=>n.active)[0],

       svd:(SVD>0?Number(b.sidadi*b.Bei_kununua/b.uwiano):0),
       svdSale:(SVD>0?Number(b.sidadi*b.Bei_kuuza):0),
       svdQty:(SVD>0?Number(b.sidadi):0),
       

       tha:Number(initqty*Number(b.Bei_kununua/b.uwiano)),
       thaSale:Number(initqty*Number(b.sale)),
       idadi:initqty,
       bqty:initqty,

       shelf:Number(b.Bei_kununua*b.idadi/b.uwiano),
       shelfSale:Number(b.sale*b.idadi),
       shelfqty:Number(b.idadi),
       

       sale:sales.reduce((a,b)=> a + (b.tha*(b.idadi-b.returned)/Number(b.uwiano)),0),
       saleSale:sales.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
       saleqty:sales.reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
       saleDt:sales,


       added:adj.filter(pr=>pr.Ongeza).reduce((a,b)=> a + Number((b.qty)),0),
       addedDt:adj.filter(pr=>pr.Ongeza),

       hamishwa:hamishwa.reduce((a,b)=>a + Number(b.tha*b.qty/b.uwiano),0),
       hamishwaqty:hamishwa.reduce((a,b)=>a + Number(b.qty),0),
       hamishwaSale:hamishwa.reduce((a,b)=>a + Number(b.sale*b.qty),0),
       hamishwaDt:hamishwa,


       kipimo:b.kipimo,

       uzalishaji:adj.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
       uzalishajiqty:adj.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + Number((b.qty)),0),
       uzalishajiDt:adj.filter(pr=>pr.mfg!=null),
       
       upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
       upotevuqty:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + Number((b.qty)),0),
       upotevuDt:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika),

       matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
       matumiziqty:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + Number((b.qty)),0),
       matumiziDt:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika),
       
       bei:Number(b.Bei_kununua)/Number(b.uwiano)
      
   } 
      }),

     prdxv = adjsted.filter(m=>m.mfg!=null),
     Uzalishaji = Number(prdxv.length>0),
     title = `<h6 class="py-2" >${lang(`Orodha ya ${item} zote zilizopo na mwenendo `,`All ${item} onshelf & Trends`)}<h6/>`
     BIDHAA = bidhaa
      
          tds= () =>{                     
           let  td=  `<table id="ItemsTable" class="table table-bordered table-hover table-sm  smallFont" style="width:100%">
           <thead>
                <tr class="smallFont latoFont">
                    <th rowspan=3 >#</th>
                    <th rowspan=3 >${lang('Namba','Number')}</th>

                    <th rowspan=3 >${item}</th>
                    <th rowspan=3 >${lang('TareheMuda','DateTime')}</th>
                    <th rowspan=3 >${lang('Kutokana','From')}</th>
                    <th rowspan=3 >${lang('Kielelezo','Code')}</th>

            
                    
                    <th rowspan=3 >${lang('vipimo','Units')}</th>

                    <th rowspan=3 >${lang('Thamani/kipimo','Worth/Unit')}${CURRENCII}</th>
                    
                    <tr class="smallFont latoFont">
                        <th class="expire" colspan=${SALES && INVENTORY!=3?3:2} >${lang('Awali','Initial')}</th>
                        ${SVD>0?`<th class="savedState" colspan=${SALES && INVENTORY!=3?3:2} >${lang('Ilivyokuwa','Saved State')}</th>`:''}
                        ${HAMISHWA?`<th class="hamishwa" colspan=${SALES && INVENTORY!=3?3:2} >${lang('Kuhamishwa','Transfered')}</th>`:''}
                        `
                    

                        if(SALES && INVENTORY!=3){
                            td+=`<th class="mauzo" colspan=${SALES && INVENTORY!=3?3:2}> ${lang('Mauzo','Sales')}</th>`
                        }


                        td+=`<th class="usage" colspan=2 >${lang('Matumizi','Usage')}</th>
                        `
                
                    if(Uzalishaji)  {
                        td+= `<th class="production" colspan=2> ${lang('Uzalishaji','Manufacturing')}</th>` 
                    }
                    
                    td+= `
                    <th class="wastes" colspan=2 >${lang('Upotevu/Uharibifu','Wastage/Damage')}</th>

                    <th class="zilizopo" colspan=${SALES && INVENTORY!=3?3:2}> ${lang('Kwa Sasa','Currently')}</th>
                    </tr>

                    <tr class="smallFont latoFont">
                        <th class="expire"> ${lang('Idadi','Qty')} </th>
                        <th class="expire"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
                        ${SALES && INVENTORY!=3?`<th class="expire"> <abbr title="${lang('Tegemeo la Mauzo','Sales Expectation')}">${lang('TM','SE')}</abbr> ${CURRENCII} </th>`:''}
                        `
                            if(SVD>0){
                            td+=`  
                                <th class="savedState"> ${lang('Idadi','Qty')} </th>
                                <th class="savedState"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
                                ${SALES && INVENTORY!=3?`<th class="savedState"> <abbr title="${lang('Tegemeo la Mauzo','Sales Expectation')}">${lang('TM','SE')}</abbr> ${CURRENCII} </th>`:''}
                            `
                            }

                            if(HAMISHWA){
                            td+=`  
                                <th class="hamishwa"> ${lang('Idadi','Qty')} </th>
                                <th class="hamishwa"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
                                ${SALES && INVENTORY!=3?`<th class="hamishwa"> <abbr title="${lang('Tegemeo la Mauzo','Sales Expectation')}">${lang('TM','SE')}</abbr> ${CURRENCII} </th>`:''}
                            `
                            }

                      
                    if(SALES && INVENTORY!=3){
                    td+=`       
                        <th class="mauzo"> ${lang('Idadi','Qty')} </th>
                        <th class="mauzo"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
                        ${SALES && INVENTORY!=3?`<th class="mauzo"> ${lang('Mauzo','Sales')} ${CURRENCII} </th>`:''}
                        `
                    }   
                
                td+=`
                        <th class="usage"> ${lang('Idadi','Qty')} </th>
                        <th class="usage"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
                `            
                    if(Uzalishaji){
                        td+=`
                            <th class="production"> ${lang('Idadi','Qty')} </th>
                            <th class="production"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
                            `
                        }
                    

                    td+= `   
                        <th class="wastes"> ${lang('Idadi','Qty')} </th>
                        <th class="wastes"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
              
                        <th class="zilizopo"> ${lang('Idadi','Qty')} </th>
                        <th class="zilizopo"> ${lang('<abbr title="Thamani">Thmn</abbr>','Worth')} ${CURRENCII} </th>
                        ${SALES && INVENTORY!=3?`<th class="zilizopo"> <abbr title="${lang('Tegemeo la Mauzo','Sales Expectation')}">${lang('TM','SE')}</abbr> ${CURRENCII} </th>`:''}

                        </tr>

                    `
                
                td+=`

                

                </tr>
            </thead>
            <tbody id="products_list" class="cursor-pointer">`,
            num = 0
            
            
            bidhaa.forEach(a=>{
                num+=1
                td+=`<tr style="cursor:pointer" onclick="theBilled({bil:${a.code?.id},num:${a.code?.num},itm:${a.bidhaa}})" >
                <td>${num}</td>
                
                <td class="text-capitalize smallFont noWordCut" >${a.namba}</td>
                <td class="text-capitalize darkblue noWordCut" > ${a.name}</td>
                <td class="text-capitalize noWordCut" >${moment(a.intitDate).format('YYYY-MM-DD HH:mm')}</td>
                <td class="brown" >${a.initialN}</td>
                <td class="darkblue noWordCut" ><a role="button" onclick="theBilled({bil:${a.code?.id},num:${a.code?.num},itm:${a.bidhaa}})"  >${a.code?.code}</a></td>
                <td class="text-primary" >${a.kipimo}</td>
                <td class="brown" >${floatValue(a.bei)}</td>

                <td class="weight600 expire" >${Number(a.idadi).toFixed(FIXED_VALUE)}</td>
                <td class="expire">${floatValue(a.tha)}</td>
                ${SALES && INVENTORY!=3?`<td class="expire">${floatValue(a.thaSale)}</td>`:''}
                `
                if(SVD>0){
                    td+=`
                        <td class="weight600 brown savedState" >${a.svdQty.toFixed(FIXED_VALUE)}</td>
                            <td class="brown savedState" >${floatValue(a.svd)}</td>
                            ${SALES && INVENTORY!=3?`<td class="brown savedState" >${floatValue(a.svdSale)}</td>`:''}
                    `
                }
                if(HAMISHWA){
                    td+=`
                        <td class="weight600 brown hamishwa" >${a.hamishwaqty.toFixed(FIXED_VALUE)}</td>
                            <td class="brown hamishwa" >${floatValue(a.hamishwa)}</td>
                            ${SALES && INVENTORY!=3?`<td class="brown hamishwa" >${floatValue(a.hamishwaSale)}</td>`:''}
                    `
                }
                
           
                
                if(SALES && INVENTORY!=3){
                    td+=`<td class="weight600 mauzo" >${a.saleqty.toFixed(FIXED_VALUE)}</td>
                <td class="mauzo" >${floatValue(a.sale)}</td>
                    ${SALES && INVENTORY!=3?`<td class="mauzo" >${floatValue(a.saleSale)}</td>`:''}
                
                    `

                }    
                
            
                td+=`<td class="weight600 usage" >${Number(a.matumiziqty || 0).toFixed(FIXED_VALUE)}</td>
                <td class="usage" >${floatValue(a.matumizi)}</td>

                
                `

                if(Uzalishaji){
                td+=`<td class="weight600 production" >${a.uzalishajiqty.toFixed(FIXED_VALUE)}</td>
                        <td class="production" >${floatValue(a.uzalishaji)}</td>`
                }

                td+= `
                    <td class="weight600 wastes" >${a.upotevuqty.toFixed(FIXED_VALUE)}</td>
                    <td class="wastes" > ${floatValue(a.upotevu)}</td>

                    <td class="weight600 brown zilizopo" >${a.shelfqty.toFixed(FIXED_VALUE)}</td>
                    <td class="brown zilizopo" >${floatValue(a.shelf)}</td>
                    ${SALES && INVENTORY!=3?`<td class="brown zilizopo" >${floatValue(a.shelfSale)}</td>`:''}
                `

                
            })

            td+=`</tbody>
            </table>
     ` 

        return td 

        }

        return title + tds()
     }

     
function   placeAlipia(pay){

    let LoC = Number($('#riportChatRist .btn-secondary').data('riport'))

            if(LoC){

                //Draw new Chart................................................................................................................./
                let title = `<h6 class="py-2 " >${lang(`Takwimu ya Malipo ya Mauzo kwa kila Akaunti ya Malipo`,`Sales Payments Statistics on each Payment Account  `)}, ${duraTitle}<h6/>`
                $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

                    
                var canvas = document.getElementById('myChartC');
                var ctx = canvas.getContext('2d');
                var data= {
                        labels: malipo.map(b=>b.name),
                        datasets: [{
                            label:lang("Malipo ya Mauzo","Sales Payment"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color

                            
                            // notice the gap in the data and the spanGaps: true
                            data: malipo.map(a=>Number(a.pay).toFixed(FIXED_VALUE)),
                            spanGaps: true,
                            }, {
                                label: lang("Kiasi Kilichopo","Account Current Amount"),
                                fill: true,
                                lineTension: 0,
                                backgroundColor: "#1a8cff",
                                borderColor: "#1a8cff", // The main line color
                                                    
                                // notice the gap in the data and the spanGaps: false
                                data:malipo.map(a=>Number(a.amount).toFixed(FIXED_VALUE)),
                                spanGaps: false,
                            }
                        
                            ]
                        };
                
                        var options = {
                            plugins: [{
                            beforeInit: function (chart) {
                            chart.data.labels.forEach(function (e, i, a) {
                                if (/\n/.test(e)) {
                                a[i] = e.split(/\n/)
                                }
                            })
                            }
                        }],
                    
                    tooltips: {
                                bodyFontSize: window.outerWidth>800?19:15,
                                enabled: true,
                                callbacks: {
                                    label: function (tooltipItems, data) {
                                        return data.datasets[tooltipItems.datasetIndex].label + ` ${currencii} : `+ tooltipItems.yLabel.toLocaleString();
                                    }
                                }
                            },
                    
                    
                scales: {
                            yAxes: [{
                                
                                ticks: {
                                    beginAtZero:true,
                                    display:window.outerWidth>800?true:false
                                    
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: ` ${currencii}`,
                                    fontSize: 13 
                                }
                            }],
                            xAxes:[
                                {
                                    ticks:{
                                        display:false
                                    },
                                    scaleLabel: {
                                    display:true,
                                    labelString:lang('Akaunti za Malipo','Payment Accounts'),
                                    fontSize: 13 
                                }
                                }
                            ]            
                        }  
                };

                // Chart declaration:
                var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options
                });	
        

            }else{
                td=  `<table id="SoldItems" class="table table-bordered " style="width:100%">
            <thead>
                <tr class="smallFont ">
                    <th>#</th>
                    <th>${lang('Akaunti ya Malipo','Payment Account')}</th>
                    <th> ${lang('Kiasi kilichopo','Account Amount')}<span class="text-primary latoFont">(${currencii})</span> </th>
                </tr>
            </thead>
            <tbody id="products_list">`,
            num = 0
            
            
            pay.forEach(a=>{
                num+=1
                td+=`<tr>
                <td>${num}</td>
                
                <td class="text-capitalize" >${a.Akaunt_name}</td>
            
               
                <td  >${floatValue(a.Amount)}</td>
                
                `
            })

        td+=`</tbody>
        </table>
        `   
        let title = `<h6 class="py-2 " >${lang(`Akaunti za Malipo na Kiasi Kilichopo`,`Payment Accounts and Amounts  `)}<h6/>`
        $('#theDataPanel').html(title+td)
        $('#SoldItems').DataTable();
            }
     }


     function   placeCategory(itms){
        const aina = Categs.state
           let {sale:sales,adjsted:Adjst,transfd,shefu:pui,item} = itms,Tawi  = branch()
           pui = pui.filter(h=>((h.uhamisho_id===null)&&(h.manunuzi_id!=null || h.produced_id!=null || h.ongezwa_id!=null))|| (h.uhamisho_id!=null && (h.manunuzi_id===null && h.produced_id===null && h.ongezwa_id===null))) 

          const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
            bd = [... new Set(pui.map(i=>i.aina))],
            bidhaa = bd.map(b=>theItms(b))
            

            const   PRODUXN = INVENTORY===2,
                    SERVICES = Number(SELECTED().data('service')),
                    SALES = Number(SELECTED().data('sales')), 
                    HAMISHWA = transfd.length > 0
    

                 
            function theItms(b){
                const  ft=i=>i.aina === b,
                        itm = pui.filter(ft),
                        adj = Adjst.filter(ft),
                        sale = sales.filter(ft),
                        transfered = transfd.filter(ft),

                    
                   
                     
                     initially = l => {
                       const   added = adj.filter(p=>p.prod_id===l.id && (p.Ongeza||p.register)).reduce((a,b)=>a+Number(b.qty),0),
                              initqty =  Number(l.initTr || (l.initPu-l.rudi) || l.initPro || added || 0)
                              return initqty

                     }
                     
                     

                return {
                    id:b,
                    name:aina.filter(i=>i.id==b)[0].aina,
                    itms:{sale:sale,adjsted:adj,transfd:transfered,shefu:itm,item},
                    tha:itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(initially(b))/b.uwiano),0),
                    svd:itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.sidadi)/b.uwiano),0),

                    shelf:itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                    items:itm.length, 
                    transfer:transfered.reduce((a,b)=> a + (Number(b.tha)*(b.qty)/b.uwiano),0),
    
                    sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
        
                    uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                  
                    matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                    upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                 
                    
               
                   
                }
            }

            THE_ITEMS = bidhaa,

            drawChat = () =>{

            }


           
 
            if(LoC){
             
                //Draw new Chart................................................................................................................./
                let title = `<h6 class="py-2 " >${lang(`Takwimu ya Bidhaa zilizopo namwenendo wa kila Aina ya ${item} `,`All ${item} and Trends Statistics on each Item Category  `)}, ${duraTitle}<h6/>`
                $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);
               
                var canvas = document.getElementById('myChartC');
                var ctx = canvas.getContext('2d');
                var data= {
                    labels: bidhaa.map(b=>b.name),
                    datasets: [{
                        label:lang("Awali","Inittialy"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: bidhaa.map(a=>a.tha),
                        spanGaps: true,
                        }
                        ,{
                            label: lang("Matumizi","Usage"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#BF2B2B",
                            borderColor: "#BF2B2B", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.matumizi).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                        ,{
                            label: lang("Upotevu/Uharibifu","Wastage/Damage"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#C04F2A",
                            borderColor: "#C04F2A", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.upotevu).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Mauzo","Sales"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "darkgreen",
                            borderColor: "darkgreen", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.sale).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Zilizopo","Onhelf"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "green",
                            borderColor: "green", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.shelf).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                        ]
                    };
    
                    if(Uzalishaji){
                       data.datasets.push({
                           label: lang("Uzalishaji","Manufacturing"),
                           fill: true,
                           lineTension: 0,
                           backgroundColor: "#62692D",
                           borderColor: "#62692D", // The main line color
                       
                           // notice the gap in the data and the spanGaps: false
                           data:bidhaa.map(a=>Number(a.uzalishaji).toFixed(FIXED_VALUE)),
                           spanGaps: false,
                       })
                   }
                        var options = {
                            plugins: [{
                            beforeInit: function (chart) {
                            chart.data.labels.forEach(function (e, i, a) {
                                if (/\n/.test(e)) {
                                a[i] = e.split(/\n/)
                                }
                            })
                            }
                        }],
                    
                    tooltips: {
                                bodyFontSize: window.outerWidth>800?19:15,
                                enabled: true,
                                callbacks: {
                                    label: function (tooltipItems, data) {
                                        return data.datasets[tooltipItems.datasetIndex].label + ` ${currencii} : `+ tooltipItems.yLabel.toLocaleString();
                                    }
                                }
                            },
                    
                    
                scales: {
                            yAxes: [{
                                
                                ticks: {
                                    beginAtZero:true,
                                    display:window.outerWidth>800?true:false
                                    
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: ` ${lang(`Thamani`,`Worth`)}(${currencii})`,
                                    fontSize: 13 
                                }
                            }],
                            xAxes:[
                                {
                                    ticks:{
                                        display:false
                                    },
                                     scaleLabel: {
                                    display:true,
                                    labelString:lang('Aina za Bidhaa','Items Categories'),
                                    fontSize: 13 
                                }
                                }
                            ]            
                        }  
                };
    
                // Chart declaration:
                var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options
                });	
          
    
            }else{
                td=  `<table id="SoldItems" class="table table-sm table-bordered smallFont" style="width:100%">
            <thead>
                <tr class="smallFont ">
                    <th>#</th>
                    <th>${lang('Aina','Category')}</th>

                    <th>${item}</th>
                
                    <th> ${lang('Awali','Initially')} <span class="text-primary latoFont">(${currencii})</span> </th>
                    ${SVD>0?`<th> ${lang('Ilivyokuwa','Saved State')} ${CURRENCII} </th>`:''}
                    ${HAMISHWA?`<th> ${lang('Kuhamishwa','Transfered')} ${CURRENCII} </th>`:''}
                    <th> ${lang('Matumizi','Usage')} <span class="text-primary latoFont">(${currencii})</span> </th>
                    <th> ${lang('Uharibifu/Upotevu','Damage/Wastage')} <span class="text-primary latoFont">(${currencii})</span> </th>`
                    if(PRODUXN){
                       td+=` <th> ${lang('Uzalishaji','Manufacturing')}<span class="text-primary latoFont">(${currencii})</span></th>`
                    }
                     td+=`<th> ${lang('Mauzo','Sales')}<span class="text-primary latoFont">(${currencii})</span></th>`
                   
                   
                       td+=`<th> ${lang('Kwa Sasa','Currently')} ${CURRENCII}</th>`  
                
                 
                td+=`</tr>
            </thead>
            <tbody id="products_list">`,
            num = 0
            
            
            bidhaa.forEach(a=>{
                num+=1
                td+=`<tr>
                  <td>${num}</td>
                 
                  <td class="text-capitalize darkblue" > ${a.name}</td>
               
                  
                  <td class="text-primary largerFont" ><a type="button" onclick="showCategoryItems(${a.id})" >${a.items}</a></td>
                  
                  <td>${floatValue(a.tha)}</td>
                  ${SVD>0?`<td>${floatValue(a.svd)}</td>`:''}
                  ${HAMISHWA?`<td>${floatValue(a.transfer)}</td>`:''}
                  <td>${floatValue(a.matumizi)}</td>
                  <td>${floatValue(a.upotevu)}</td>
                  
                  `
               if(PRODUXN){
                   td+=`<td>${floatValue(a.uzalishaji)}</td>`
               }          
                  
    
                  td+=`<td >${floatValue(a.sale)}</td>
                      <td >${floatValue(a.shelf)}</td>`
            })
    
    td+=`</tbody>
    </table>
    `   
    let title = `<h6 class="py-2 " >${lang(`Aina ya ${item} zilizopo na Mwenendo `,`Avaialable ${item} Groups & Trend List  `)} ${duraTitle}<h6/>`
                    $('#theDataPanel').html(title+td)
                    $('#SoldItems').DataTable();
            }

    }


    function   placeGroups(itms){
        
       const aina = pcategs.state
       let {sale:sales,adjsted:Adjst,transfd,shefu:pui,item} = itms,Tawi  = branch()
       pui = pui.filter(h=>((h.uhamisho_id===null)&&(h.manunuzi_id!=null || h.produced_id!=null || h.ongezwa_id!=null))|| (h.uhamisho_id!=null && (h.manunuzi_id===null && h.produced_id===null && h.ongezwa_id===null))) 

      const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        bd = [... new Set(pui.map(i=>i.kundi))],
        bidhaa = bd.map(b=>theItms(b))
        
        function theItms(b){
            const  ft=i=>i.kundi === b ,
                    itm = pui.filter(ft),
                    adj = Adjst.filter(ft),
                    sale = sales.filter(ft),
                    transfered = transfd.filter(ft),

                
               
                 
                 initially = l => {
                   const   added = adj.filter(p=>p.prod_id===l.id && (p.Ongeza||p.register)).reduce((a,b)=>a+Number(b.qty),0),
                          initqty =  Number(l.initTr || (l.initPu-l.rudi) || l.initPro || added || 0)
                          return initqty

                 },
          
       
                 hamishwa = transfd.filter(t=>t.toka_id===b.id)
                 
                 

            return {
                id:b,
                name:aina.filter(i=>i.id===b)[0]?.mahitaji,
                itms:itms,
                categs:[... new Set(itm.map(a=>a.aina))].length,
                tha:itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(initially(b))/b.uwiano),0),
                itms:{sale:sale,adjsted:adj,transfd:transfered,shefu:itm,item},
                shelf:itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                svd:itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.sidadi)/b.uwiano),0),
               
                transfer:transfered.reduce((a,b)=> a + (Number(b.tha)*(b.qty)/b.uwiano),0),

                sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
    
                uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
              
                matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
             
                
           
               
            }
        }

        const   PRODUXN = INVENTORY === 2,
        SERVICES = Number(SELECTED().data('service')),
        SALES = Number(SELECTED().data('sales')), 
        HAMISHWA = transfd.length > 0

        if(LoC){
    
            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${lang(`Takwimu ya ${item} na mwenendo wa kila Kundi la Bidhaa `,`${item} and Trends Statistics on each Item Category Group `)}, ${duraTitle}<h6/>`
            $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);
    
                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                labels: bidhaa.map(b=>b.name),
                datasets: [{
                    label:lang("Awali","Initially"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "#1a8cff",
                    borderColor: "#1a8cff", // The main line color
                    
                    // notice the gap in the data and the spanGaps: true
                    data: bidhaa.map(a=>a.tha),
                    spanGaps: true,
                    }
                    ,{
                        label: lang("Matumizi","Usage"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#BF2B2B",
                        borderColor: "#BF2B2B", // The main line color
                    
                        // notice the gap in the data and the spanGaps: false
                        data:bidhaa.map(a=>Number(a.matumizi).toFixed(FIXED_VALUE)),
                        spanGaps: false,
                    }
                    ,{
                        label: lang("Upotevu/Uharibifu","Wastage/Damage"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#336699",
                        borderColor: "#336699", // The main line color
                    
                        // notice the gap in the data and the spanGaps: false
                        data:bidhaa.map(a=>Number(a.upotevu).toFixed(FIXED_VALUE)),
                        spanGaps: false,
                    }
                   ,{
                        label: lang("Mauzo","Sales"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "darkgreen",
                        borderColor: "darkgreen", // The main line color
                    
                        // notice the gap in the data and the spanGaps: false
                        data:bidhaa.map(a=>Number(a.sale).toFixed(FIXED_VALUE)),
                        spanGaps: false,
                    }
                   ,{
                        label: lang("Zilizopo","Onhelf"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "green",
                        borderColor: "green", // The main line color
                    
                        // notice the gap in the data and the spanGaps: false
                        data:bidhaa.map(a=>Number(a.shelf).toFixed(FIXED_VALUE)),
                        spanGaps: false,
                    }
                    ]
                };
    
                if(Uzalishaji){
                   data.datasets.push({
                       label: lang("Uzalishaji","Manufacturing"),
                       fill: true,
                       lineTension: 0,
                       backgroundColor: "#62692D",
                       borderColor: "#62692D", // The main line color
                   
                       // notice the gap in the data and the spanGaps: false
                       data:bidhaa.map(a=>Number(a.uzalishaji).toFixed(FIXED_VALUE)),
                       spanGaps: false,
                   })
               }
                    var options = {
                        plugins: [{
                        beforeInit: function (chart) {
                        chart.data.labels.forEach(function (e, i, a) {
                            if (/\n/.test(e)) {
                            a[i] = e.split(/\n/)
                            }
                        })
                        }
                    }],
                
                tooltips: {
                            bodyFontSize: window.outerWidth>800?19:15,
                            enabled: true,
                            callbacks: {
                                label: function (tooltipItems, data) {
                                    return data.datasets[tooltipItems.datasetIndex].label + ` ${currencii} : `+ tooltipItems.yLabel.toLocaleString();
                                }
                            }
                        },
                
                
            scales: {
                        yAxes: [{
                            
                            ticks: {
                                beginAtZero:true,
                                display:window.outerWidth>800?true:false
                                
                            },
                            scaleLabel: {
                                display: true,
                                labelString: ` ${lang(`Thamani`,`Worth`)}(${currencii})`,
                                fontSize: 13 
                            }
                        }],
                        xAxes:[
                            {
                                ticks:{
                                    display:false
                                },
                                 scaleLabel: {
                                display:true,
                                labelString:lang('Aina za Bidhaa','Items Categories'),
                                fontSize: 13 
                            }
                            }
                        ]            
                    }  
            };
    
            // Chart declaration:
            var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
            });	
      
    
        }else{
            td=  `<table id="SoldItems" class="table table-bordered smallFont" style="width:100%">
        <thead>
            <tr class="smallFont ">
                <th>#</th>
                <th>${lang('Kundi','Group')}</th>
            
                <th> ${lang('Awali','Initially')} <span class="text-primary latoFont">(${currencii})</span> </th>
                ${SVD>0?`<th> ${lang('Ilivyokuwa','Saved State')} ${CURRENCII} </th>`:''}
                ${HAMISHWA?`<th> ${lang('Kuhamishwa','Transfered')} ${CURRENCII} </th>`:''}
                <th> ${lang('Matumizi','Usage')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Uharibifu/Upotevu','Damage/Wastage')} <span class="text-primary latoFont">(${currencii})</span> </th>
                
                `
                if(PRODUXN){
                   td+=` <th> ${lang('Uzalishaji','Manufacturing')}<span class="text-primary latoFont">(${currencii})</span></th>`
                }
               td+=`<th> ${lang('Mauzo','Sales')}<span class="text-primary latoFont">(${currencii})</span></th>`
               
             
               
                   td+=`<th> ${lang('Kwa Sasa','Currently')}</th>`  
            
             
            td+=`</tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        bidhaa.forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize darkblue" >${a.name}</td>
           
              <td>${floatValue(a.tha)}</td>
              ${SVD>0?`<td>${floatValue(a.svd)}</td>`:''}
              ${HAMISHWA?`<td>${floatValue(a.transfer)}</td>`:''}
              <td>${floatValue(a.matumizi)}</td>
              <td>${floatValue(a.upotevu)}</td>`

           if(PRODUXN){
               td+=`<td>${floatValue(a.uzalishaji)}</td>`
           }          
              
    
              td+=`<td >${floatValue(a.sale)}</td>
                  <td >${floatValue(a.shelf)}</td>`
        })
    
    td+=`</tbody>
    </table>
    `   
    let title = `<h6 class="py-2 " >${lang(`Makundi ya ${item} Zilizopo na Mwenendo`,`Available ${item} Groups & Trends  `)}, ${duraTitle}<h6/>`
                $('#theDataPanel').html(title+td)
                $('#SoldItems').DataTable();
        }

        
    
    }


   
  function  showCategoryItems(itm){
           const items  = THE_ITEMS.find(c=>c.id===itm),
                 HAMISHWA = items.transfer > 0,
                 PRODUXN = items.uzalishaji > 0,
                  

                  
                 categ = `
                    <h6 class="pt-2   darkblue text-capitalize" ><i>${items.name}</i></h6>
                    <table class="table table-sm smallerFont border">
                    <thead>
                    <tr >
                       
                        <th class="text-left" > ${lang('Awali','Initially')} <span class="text-primary latoFont">(${currencii})</span> </th>
                        ${HAMISHWA?`<th class="text-left" > ${lang('Kuhamishwa','Transfered')} ${CURRENCII} </th>`:''}
                        <th class="text-left" > ${lang('Matumizi','Usage')} <span class="text-primary latoFont">(${currencii})</span> </th>
                        <th class="text-left" > ${lang('Uharibifu/Upotevu','Damage/Wastage')} <span class="text-primary latoFont">(${currencii})</span> </th>
                        ${PRODUXN?`<th class="text-left" > ${lang('Uzalishaji','Manufacturing')}<span class="text-primary latoFont">(${currencii})</span></th>`:''}
                        <th class="text-left" > ${lang('Mauzo','Sales')}<span class="text-primary latoFont">(${currencii})</span></th>
                       
                         <th class="text-left" > ${lang('Zilizopo','OnShelf')} ${CURRENCII}</th></tr>
                </thead>
                <tbody id="products_list">
                
                
                    <td>${floatValue(items.tha)}</td>
                      ${HAMISHWA?`<td>${floatValue(items.transfer)}</td>`:''}
                      <td>${floatValue(items.matumizi)}</td>
                      <td>${floatValue(items.upotevu)}</td>
                      
                     ${PRODUXN?`<td>${floatValue(items.uzalishaji)}</td>`:``}
                    
                      
                    <td >${floatValue(items.sale)}</td>
                    <td >${floatValue(items.shelf)}</td>
                    </tbody>
               </table>` ,

               backbtn =`  <div class="RiportDataPanel showDt text-right" style="position: fixed;top:90vh;right:10px">
                                    <button class="btn btn-danger btn-sm    showDtBtn" onclick="$('#showItemState').hide();$('#theDataPanel').fadeIn(200)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
                                            <line x1="19" y1="12" x2="5" y2="12"></line>
                                            <polyline points="12 19 5 12 12 5"></polyline>
                                        </svg>
                                    </button>
                        </div>`,
                          
        
        
            theInitial = categ + backbtn + itemsTable(items.itms)
            Back_to_categ = itm
            $('#showInitial').html(theInitial)    

            $('#theDataPanel').hide()
            $('#showItemState').fadeIn(100)
            
            $('#ItemsTable').DataTable();

         


    }


function theBilled(bil){

   
    const    bili=THE_INITIAL.find(b=>b.id === bil.bil && b.num === bil.num)?.data,
             {num,itm:bidhaaId} = bil,
             item = INVENTORY==1?lang('Bidhaa','Item(s)'):INVENTORY==2?lang('Nyenzo','Material Item(s)'):lang('Aseti','Assets')

           //
        if(bili){
   
           const  {itms_C:puColor,data,cost,mauzo,adjst,transfer,itms_S:puSize,adjst_C,adjst_S,stock_C,stock_S,id,sale_S,sale_C} = bili
        
           ITEM_BRANCH = {bil,data,mauzo,adjst,transfer}      
            const  ft = d=>d.duka === branch(),

                itm = data.filter(ft).filter(h=>h.uhamisho_id===null || num==1),
                alitms = data,
                adji = adjst,
                sales = mauzo,
             

                  dt = { 
                        tha:num==2?itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*Number(b.bqty-b.rudi)/Number(b.uwiano)),0):itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty)/b.uwiano),0),

                        shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                        ilolipwa:Number(itm[0]?.paid),
                
                        sale:sales.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
                        saleV:sales.reduce((a,b)=> a + (b.tha*(b.idadi-b.returned)/b.uwiano),0),
                
                        uzalishaji:adji.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                    
                        matumizi:adji.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                        upotevu:adji.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                        costi:cost.reduce((a,b)=> a + Number(b.kiasi),0),
                        allpu:alitms,
                        pui:itm,
                        adj:adji,

                        sold:sales
                },

                {allpu,pui,costi,ilolipwa,sold,adj,tha,upotevu,uzalishaji,sale,matumizi,shelf,saleV}  = dt,
                
                bd = [... new Set(pui.map(i=>i.bidhaa_id))],
   
                brnch = [...new Set(allpu.map(br=>br.shop))],
                Brnch = brnch.length > 1,
              
                itms = bd?.map(i=>{
                       const ft=bn=>bn.bidhaa_id === i,
                               itm = pui.filter(r=>Number(r.rudi)!=Number(r.bqty)).filter(ft),
                               alitms = allpu.filter(ft),
                               adji = adj.filter(ft),
                               bei = [... new Set(itm.map(t=>t.Bei_kununua/t.uwiano))],
                               beiAv = bei.reduce((a,b)=> a + Number(b),0)/bei.length 
                   return {
                       name:itm[0].bidhaaN,
                       namba:itm[0].namba || lang('Hakuna','None') ,
   
                       id:i,
   
                       bqty:itm.filter(h=>h.uhamisho_id===null || num==1).reduce((a,b)=> a + Number((b.bqty)),0),
                       idadi:allpu.filter(ft).reduce((a,b)=> a + Number((b.idadi)),0),
   
                       tawi:[...new Set(alitms.map(br=>br.shop))].length,
   
                       uwiano:itm[0].uwiano,
   
   
                       shelf:allpu.filter(ft).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                       shelfqty:allpu.filter(ft).reduce((a,b)=> a + Number((b.idadi)),0),
   
                       sale:sold.filter(ft).reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
                       saleqty:sold.filter(ft).reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
   
   
                       kipimo:itm[0].kipimo,
                       bei:beiAv,
   
                       uzalishaji:adji.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       uzalishajiqty:adji.filter(pr=>pr.mfg).reduce((a,b)=> a + Number((b.qty)),0),
                       
                       upotevu:adji.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       upotevuqty:adji.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + Number((b.qty)),0),
   
                       matumizi:adji.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       matumiziqty:adji.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + Number((b.qty)),0),
   
                       puC:num==1?puColor.filter(b=>b.bidhaa_a===i).map(c=>{ return {id:c.id,color_id:c.id,color_code:c.color_code,color_name:c.color_name,qty:c.qty,idadi:c.qty,bidhaa_a:c.bidhaa_a}}):puColor.filter(b=>b.bidhaa_a===i),
                       puS:num==1?puSize.filter(b=>b.bidhaa_a===i).map(s=>{return {id:s.id,size_name:s.size_name,bidhaa_a:s.bidhaa_a,qty:s.qty,idadi:s.idadi,color_id:s.color_id}}):puSize.filter(b=>b.bidhaa_a===i),
   
                       shelf_C:stock_C.filter(b=>b.bidhaa_a===i),
                       shelf_S:stock_S.filter(b=>b.bidhaa_a===i),
   
                       saC:sale_C.filter(b=>b.bidhaa_a===i),
                       saS:sale_S.filter(b=>b.bidhaa_a===i),
   
                       mfg_C:adjst_C.filter(b=>b.bidhaa_a===i && i.uzalishaji!=null),
                       mfg_S:adjst_S.filter(b=>b.bidhaa_a===i && i.uzalishaji!=null),
   
                       usd_C:adjst_C.filter(b=>b.bidhaa_a===i && i.uzalishaji===null && i.tumika),
                       usd_S:adjst_S.filter(b=>b.bidhaa_a===i && i.uzalishaji===null && i.tumika),
                    
                       wst_C:adjst_C.filter(b=>b.bidhaa_a===i && i.uzalishaji===null && !i.tumika && !i.Ongeza),
                       wst_S:adjst_S.filter(b=>b.bidhaa_a===i && i.uzalishaji===null && !i.tumika && !i.Ongeza),
   
                   } 
                })
   
                

         bidhaaState.state  = itms
               
           
     const    ProdTitle = () =>{
                    let  billTitle = `
                            <h5>BATCH-${bili.code}</h5>
                            <address>
                            <div class="weight600" >${lang('Uzalishaji','Production')}:</div>
                            <div class="text-capitalize" > <a href="/production/reportPrint?pr=${bili.prod}&ln=${lang(1,0)}&prnt=0" target="_blank"  > PROD-${bili.prodCode}</a></div>
                            
                            <div > <span${bili?.desc!=''?'style="border-left:2px solid darkblue"':''} class="px-1">${bili?.desc}</span> </div>
                
                            <div> <span class="weight600"> ${lang('Kuanzia','From')}</span>: ${moment(bili.from).format('DD/MM/YYYY HH:mm')}</div>
                            <div> <span class="weight600"> ${lang('Hadi','To')}</span>: ${moment(bili.to).format('DD/MM/YYYY HH:mm')}</div>`
                            
                        billTitle+= `</address>`
                
                            billTitle+= `<div class="row mt-2 latoFont" style="max-width:360px" >
                                <div class="col-4  weight600" > ${lang('Tarehe na Muda','Batch Datetime')} </div>
                                <div class="col-8 " >  ${moment(bili.date).format('DD/MM/YYYY HH:mm')}</div>
                            </div>`   
                            

                    billTitle+=` <div class="row my-2 mb-2" style="max-width:360px" >
                                    <div class="col-4  weight600"> ${lang('Na','By')} </div>
                                    <div class="col-8  darkblue text-capitalize weight500" > <u>${bili.By}</u> </div>
                
                            </div>`
                
                        return  billTitle   
           },


         PuTitle = () =>{
            let  billTitle = `
                    <h5>BIL-${bili.code}</h5>
                    <address>
                    <div class="weight600" >${lang('Kutoka','From')}:</div>
                    <div class="text-capitalize" >${bili.supplier}</div>
                    <div class="text-capitalize" >${bili.address}</div>
                    <div> <span class="weight600"> ${lang('Simu 1','Phone 1')}</span>: ${bili.simu1}</div>`
                    
                
                    
                
                    if(bili.simu2){
                        billTitle+= `<div> <span class="weight600"> ${lang('Simu 1','Phone 1')}</span>:  ${bili.simu2}</div>`
                    }
                   billTitle+= `</address> `

                    billTitle+= `<div class="row mt-2 latoFont" style="max-width:360px" >
                        <div class="col-4  weight600" > ${lang('Tarehe ya Bili','Bill Date')} </div>
                        <div class="col-8 " >  ${moment(bili.date).format('DD/MM/YYYY')}</div>

                        <div class="col-4 weight600" >  ${lang('Kurekodiwa','Recorded')}</div>
                        <div class="col-8" > ${moment(bili.tarehe).format('DD/MM/YYYY HH:mm')} </div>
                    </div>`   
                    

                    


                    billTitle+=` <div class="row my-2 mb-2" style="max-width:360px" >
                                    <div class="col-4  weight600"> ${lang('Na','By')} </div>
                                    <div class="col-8  darkblue text-capitalize weight500" > <u>${bili.By}</u> </div>

                            </div>`

                return  billTitle    
           }, 
          
         addTitle  = () =>{
            let  billTitle = `
                            <h5>ADJ-${bili.code}</h5>
                            <div style="border-left:2px solid blue" class="pl-1">${bili?.desc}</div>
                            <address>
                        
                            `
                        
                        billTitle+= `</address> `

                            billTitle+= `<div class="row mt-2 latoFont" style="max-width:360px" >
                            <div class="col-4  weight600" > ${lang('Kuongezwa','Added on')}: </div>
                                <div class="col-8 " >  ${moment(bili.tarehe).format('DD/MM/YYYY HH:mm')}</div>
                            </div>`   
                            

                            


                    billTitle+=` <div class="row my-2 mb-2" style="max-width:360px" >
                                    <div class="col-4  weight600"> ${lang('Na','By')} </div>
                                    <div class="col-8  darkblue text-capitalize weight500" > <u>${bili.By}</u> </div>

                            </div>`

                return  billTitle   
         },

         receiveTitle = () =>{
            let  billTitle = `
            <h5>RC-${bili.code}</h5>
            <address>
            <div class="weight600" >${lang('Kutoka','From')}:</div>
            <div class="text-capitalize" > <a href="#"   > ${bili.fromN}</a></div>
       
        `
     
            billTitle+= `</address> `

                billTitle+= `<div class="row mt-2 latoFont" style="max-width:360px" >
                    <div class="col-4  weight600" > ${lang('Tarehe na Muda','Receive Datetime')} </div>
                    <div class="col-8 " >  ${moment(bili.tarehe).format('DD/MM/YYYY HH:mm')}</div>
                </div>`   
                

        


            billTitle+=` <div class="row my-2 mb-2" style="max-width:360px" >
                            <div class="col-4  weight600"> ${lang('Na','By')} </div>
                            <div class="col-8  darkblue text-capitalize weight500" > <u>${bili.By}</u> </div>

                    </div>`

          return  billTitle   
         },
         theTitle = num==3?ProdTitle():num==1?receiveTitle():num==2?PuTitle():addTitle(),
   
         trendsT = () =>{           
   
              let      trendsT = `
                    <div class="table-responsive ">
                    <table id="prod_table" class="table-hover table-bordered table table-sm"  data-row=1>
                    <tr class="bg-light smallerFont ">
                        <th rowspan=3 >#</th>
                        <th rowspan=3  >${item}</th>`
                        
                        if(Brnch || itms.length >1){
                            trendsT+=`<th  rowspan=3  > ${lang('Matawi','Branches')} </th>`
                        }

                        if(puColor.length>0){
                            trendsT+=`<th rowspan=3 > ${lang('Rangi','Color')}</th>`
                        }
                       
                       if(puSize.length>0){
                            trendsT+=`<th rowspan=3 > ${lang('Saizi','Size')}</th>`
                       }
                       
                        trendsT+=`<th  rowspan=3  > ${lang('Vipimo','Units')}  </th>
                                  <th  rowspan=3  > ${lang('Thamani/Kipimo','Worth/Unit')} ${CURRENCII} </th>
                                  
   
                        <tr class="smallerFont latoFont" >
                           <th colspan=2 class="manunuzi" > ${lang('Awali','Initial')}</th>
                           <th colspan=2 class="wastes" >${lang('Upotevu','Wastage')}</th>
                           <th colspan=2 class="usage" >${lang('Matumizi','Usage')}</th>`
   
                        if(Uzalishaji){
                            trendsT+=`<th colspan=2 class="production" >${lang('Uzalishaji','Production')}</th>` 
                        }
                       
                       trendsT+=`<th colspan=2 class="mauzo" >${lang('Mauzo','Sales')}</th>
                                <th colspan=2 class="zilizopo">${lang('Zilizopo','Onshelf')}</th>
                        </tr>   
   
                        <tr class="smallerFont latoFont">
   
                        <th class="manunuzi">${lang('Idadi','Qty')}</th>
                        <th class="manunuzi">${lang('Thamani','Worth')} (${CURRENCII}) </th>
   
                        <th class="wastes" >${lang('Idadi','Qty')}</th>
                        <th class="wastes">${lang('Thamani','Worth')} ${CURRENCII}</th>
   
                        <th class="usage" >${lang('Idadi','Qty')}</th>
                        <th class="usage" >${lang('Thamani','Worth')} ${CURRENCII}</th>`
                        
                           if(Uzalishaji){
                               trendsT+=`<th class="production" >${lang('Idadi','Qty')}</th>
                                       <th class="production">${lang('Thamani','Worth')} ${CURRENCII}</th>`
                               }
   
                        trendsT+=`<th class="mauzo">${lang('Idadi','Qty')}</th>
                                  <th class="mauzo">${lang('Thamani','Worth')} ${CURRENCII}</th>
                        
                        <th class="zilizopo">${lang('Idadi','Qty')}</th>
                        <th class="zilizopo">${lang('Thamani','Worth')} ${CURRENCII}</th>
                        </tr>                      
                    </tr>
   
   
   
                            <tbody class="smallFont" id="view-invo_tbody">`
                            let n = 0
   
                               itms.reverse().forEach(it=>{
                                   let ss= it.puS.length,
                                       cc  = it.puC.length,
                                       AllSizeColor  =  [...new Set(it.puS.map(clr=>clr.color_id))].length

                                       rcc = cc+1 ,
                                       rss = ss + 1 + rcc - 1
   
                                       rss=ss == 1 && cc == 1?0:rss
   
                                       row1 = (ss==1 && cc == 1) || (cc==1 && ss==0)
                                       
   
                                     
                                   trendsT+=`
                                   
                                  <tr ${bidhaaId==it.id?'class="activeItem"':''} >
                                       <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''}>${n+=1}</td>
                                           <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} class="text-capitalize "  > ${it.name}</td>`
   
                                       
                                           if(Brnch || itms.length>1){
                                            trendsT+=` <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} > <button  data-itm="${it.id}" data-val=${VAL} data-itms=${itms.length} data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(it.tawi)}</button></td>`
                                           }
                                     
                                      
                                      //Check weter itmem a s color .......................................//      
                                      
                                          if(cc>0){ 
                                              
                                              it.puC.forEach(c=>{
                                                  const sz = it.puS.filter(cr=>cr.color_id===(num==1?c.color_id:c.id)),
                                                      szl = sz.length,
                                                      szll=szl+1,
                                                      cl = `<div class="d-flex noWordCut justify-content-center align-items-center ">
                                                       <label class="mr-1"
                                                           style="width:12px;
                                                           height:12px;
                                                           background:${c?.color_code};
                                                           border-radius:100%;
                                                           color:rgba(240, 248, 255, 0);
                                                           border:1px solid #ccc"
                                                           >
                                                           ''
                                                       </label> 
                                                       ${c?.color_name}
                                                   </div>`
   
                                          trendsT+=`  
                                             ${row1?'':`<tr ${bidhaaId==it.id?'class="activeItem"':''}>`}
                                               <td ${szl>0?'rowspan='+szll:''} >${cl}</td>`
   
   
                                          if(sz.length>0){
                                               //Check for sizes if tere is more than one size te loop through........
                                              
                                                   
                                                  sz.forEach(s => {
                                                    // console.log(s);
                                                    let  wsq = it.wst_S.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                         mfq = it.mfg_S.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                         usq = it.usd_S.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                         slq = it.saS.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
                                                         shq = it.shelf_S.filter(z=>z.id===s.size_id).reduce((a,b)=> a + Number((b.idadi)),0)
                                                     
                                                         trendsT+=`${row1?'':`<tr ${bidhaaId==it.id?'class="activeItem"':''} >`}
                                                                <td style="padding: 10px 3px !important;"><span class="text-danger smallFont"> ${s.size_name}</span></td>
                                                                <td>${it.kipimo}</td> 
                                                                <td>${floatValue(it.bei)}</td> 
                                                               
   
                                                                <td class="weight600 manunuzi " >${Number(s.qty).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="manunuzi">${floatValue(it.bei*s.qty)}</td> 
   
                                                                <td class="weight600 wastes" >${Number(wsq).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="wastes" >${floatValue(it.bei*wsq)}</td>
   
                                                                <td class="weight600 usage">${Number(usq).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="usage" >${floatValue(it.bei*usq)}</td>
                                                                `
                                                                if(Uzalishaji){
                                                                     trendsT+= `<td class="weight600 production ">${Number(mfq).toFixed(FIXED_VALUE)}</td> 
                                                                               <td class="production" >${floatValue(it.bei*mfq)}</td> `
                                                                }
             
                                                       trendsT+= `
                                                                   <td class="weight600 mauzo ">${Number(slq).toFixed(FIXED_VALUE)}</td> 
                                                                   <td class="mauzo" >${floatValue(it.bei*slq)}</td>   
   
                                                                   <td class="weight600 zilizopo">${Number(shq).toFixed(FIXED_VALUE)}</td> 
                                                                   <td class="zilizopo">${floatValue(it.bei*shq)}</td>   
   
   
                                                                   ${row1?'':'</tr>'}`
                                                 
                                                 
                                                   });
                                                                      
                                               
                                              
                                             
                                                
                                                
                                          }else{
   
                                              if(puSize.length>0){
                                                trendsT+=`<td>---</td>`   
                                              }
                                                        let  wsq = it.wst_C.filter(z=>z.color_id===c.color_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                         mfq = it.mfg_C.filter(z=>z.color_id===c.color_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                         usq = it.usd_C.filter(z=>z.color_id===c.color_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                         slq = it.saC.filter(z=>z.color_id===c.color_id).reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
                                                         shq = it.shelf_C.filter(z=>(z.id===c.color_id)).reduce((a,b)=> a + Number((b.idadi)),0)
                                                     
                                                             trendsT+=`<td>${it.kipimo}</td> 
                                                                <td>${floatValue(it.bei)}</td> 
                                                               
   
                                                                <td class="weight600 manunuzi" >${Number(c.idadi || c.qty).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="manunuzi">${floatValue(it.bei*(c.idadi || c.qty))}</td> 
   
                                                                <td class="weight600 wastes">${Number(wsq).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="wastes" >${floatValue(it.bei*wsq)}</td>
   
                                                                <td class="weight600 usage">${Number(usq).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="usage" >${floatValue(it.bei*usq)}</td>
                                                                `
                                                                if(Uzalishaji){
                                                                     trendsT+= `<td class="weight600 production ">${Number(mfq).toFixed(FIXED_VALUE)}</td> 
                                                                               <td class="production" >${floatValue(it.bei*mfq)}</td> `
                                                                }
             
                                                       trendsT+= `
                                                                   <td class="weight600 mauzo ">${Number(slq).toFixed(FIXED_VALUE)}</td> 
                                                                   <td class="mauzo" >${floatValue(it.bei*slq)}</td>   
   
                                                                   <td class="weight600 zilizopo">${Number(shq).toFixed(FIXED_VALUE)}</td> 
                                                                   <td class="zilizopo">${floatValue(it.bei*shq)}</td>
                                                                   ${row1?'':'</tr>'}
                                                                   `
                                          }
   
                                           })
   
                                           
   
                                          
                                       }else{
   
                                           if(puColor.length>0){
                                              trendsT+=`<td >------</td>`
                                          }
   
                                           if(puSize.length>0){
                                              trendsT+=`<td >------</td>`
                                          }
   
                                                         trendsT+=`<td>${it.kipimo}</td> 
                                                                <td>${floatValue(it.bei)}</td> 
                                                                
   
                                                                <td class="weight600 manunuzi" >${Number(it.bqty).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="manunuzi" >${floatValue(it.bei*it.bqty)}</td> 
   
                                                                <td class="weight600 wastes ">${Number(it.upotevuqty).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="wastes" >${floatValue(it.upotevu)}</td>
   
                                                                <td class="weight600 usage">${Number(it.matumiziqty).toFixed(FIXED_VALUE)}</td> 
                                                                <td class="usage" >${floatValue(it.matumizi)}</td>
                                                                `
                                                                if(Uzalishaji){
                                                                     trendsT+= `<td class="weight600 production ">${Number(it.uzalishajiqty).toFixed(FIXED_VALUE)}</td> 
                                                                               <td class="production" >${floatValue(it.uzalishaji)}</td> `
                                                                }
             
                                                       trendsT+= `
                                                                   <td class="weight600 mauzo">${Number(it.saleqty).toFixed(FIXED_VALUE)}</td> 
                                                                   <td class="mauzo" >${floatValue(it.sale)}</td>   
   
                                                                   <td class="weight600 zilizopo">${Number(it.shelfqty).toFixed(FIXED_VALUE)}</td> 
                                                                   <td class="zilizopo" >${floatValue(it.shelf)}</td>`
   
   
                                      }
                                     
                                   
                                    trendsT+=`</tr>`
                               })
   
   
                                
                            trendsT+=`</tbody>
   
                    </table>
                    </div>
                    `
   
                    return trendsT
                           },
   
         summary = () =>{
                let    summary = `
                   <div class="row mx-0" >
                      <div class ="col-md-5"></div>
   
               <div class ="col-md-7  mx-0 px-0">
                   <div class=" weight500 mt-2" >${lang('Ufupisho','Summary')}</div>
                  
                   
                   <table class="border   latoFont table table-sm table-hover " >
                       <tbody class="cursor-pointer p-3" >
                      
                      `,
   
                         
                      
   
                       Prdxnsummary = `
                       
                                   <tr  class="cursor-pointer manunuzi">    
                                       <td class="">${num==1?lang('Thamani ya Zilizopokelewa Jumla','Total Received Worth'):num==3?lang(`Thamani ya Toleo Jumla`,'Total Batch Worth'):lang('Thamani ya Bidhaa Zilizoongezwa','Total Added Item Worth')}</td>
                                       <td ></td>
                                       <td class="text-right">${CURRENCII}.<span class="weight500 brown">${floatValue(tha)}</span> </td>
                                   </tr>  
                          
                                   `,
                  
                       BillSummary =  () =>{
                        let summary = ''
                                    if(costi>0){
                                                summary += `

                                                            <tr  class="cursor-pointer">  
                                                                <td >${lang(`Thamani ya ${item}`,`${item} Worth`)}</td>
                                                                <td ></td>
                                                                <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(tha)}</span> </td>
                                                            </tr>

                                                            <tr  class="cursor-pointer">
                                                                <td >${lang('Ghalama Nyingine','Other Costs')}</td>
                                                                <td ></td>
                                                                <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(costi)}</span> </td>
                                                            </tr>    `
                                    
                                                }  

                                        summary += `
                                        
                                                    <tr  class="cursor-pointer manunuzi">    
                                                        <td class="">${lang('Ghalama za Bili Jumla','Total Bill Costs')}</td>
                                                        <td ></td>
                                                        <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500 brown">${floatValue(tha+costi)}</span> </td>
                                                    </tr>  

                                                    <tr  class="cursor-pointer"  >    
                                                        <td class="">${lang('Malipo ya Bili','Bill Payment')}</td>
                                                        <td >${floatValue((ilolipwa*100)/(tha+costi))}%</td>
                                                        <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500 brown">${floatValue(ilolipwa)}</span> </td>
                                                    </tr>  
                                                    `
                                                    if(tha+costi > ilolipwa){
                                                        summary+=`
                                                                <tr  class="cursor-pointer"  >    
                                                                    <td class="">${lang('Deni','Debt')}</td>
                                                                    <td >${floatValue((((tha+costi)-ilolipwa)*100)/tha)}%</td>
                                                                    <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500 brown">${floatValue(tha-ilolipwa)}</span> </td>
                                                                </tr>`  
                                                    }  
                               return summary                     
                         } 

                          summary += num==2?BillSummary():Prdxnsummary
                            

                                   summary+=`<tr  class="cursor-pointer wastes">
                                       <td class="">${lang('Upotevu/Uharibifu','Wastage/Damage')}</td>
                                       <td >${floatValue(upotevu*100/tha)}%</td>
                                       <td class="text-right">${CURRENCII}.<span class="weight500">${floatValue(upotevu)}</span> </td> 
                                   </tr>
                                   <tr  class="cursor-pointer usage">
                                       <td class="">${lang('Kutumika','Usage')}</td>
                                       <td >${floatValue(matumizi*100/tha)}%</td>
                                       <td class="text-right">${CURRENCII}.<span class="weight500">${floatValue(matumizi)}</span> </td> 
                                    </tr>   
                                       `
                                     
                             if(Uzalishaji)  {
                                  summary += `
                                        <tr  class="cursor-pointer production">
                                            <td class="">${lang('Uzalishaji','Production')}</td>
                                            <td >${floatValue(uzalishaji*100/tha)}%</td>
                                            <td class="text-right">${CURRENCII}.<span class="weight500">${floatValue(uzalishaji)}</span> </td> 
                                         </tr>
                                   `
                             }    
                               
                                summary += `
                                         <tr  class="cursor-pointer mauzo">
                                            <td class="">${lang('Thamani ya Zilizouzwa','Sold Worth')}</td>
                                            <td >${floatValue(saleV*100/tha)}%</td>
                                            <td class="text-right">${CURRENCII}.<span class="weight500">${floatValue(saleV)}</span> </td> 
                                         </tr>
   
                                         <tr  class="cursor-pointer">
                                            <td class="">${lang('Mauzo Jumla','Total Sales')}</td>
                                            <td ></td>
                                            <td class="text-right">${CURRENCII}.<span class="weight500">${floatValue(sale)}</span> </td> 
                                         </tr>
                                          
                                          <tr  class="cursor-pointer border-top-danger zilizopo">
                                            <td >${lang('Zilizopo','OnShelf')}</td>
                                            <td >${floatValue(shelf*100/tha)}%</td>
                                            <td class="border-top text-right">${CURRENCII}.<span class="weight500 brown">${floatValue(shelf)}</span> </td> 
                                          </tr>
   
                                         
                                   `
                      
   
               
                     summary +=` 
                           </tbody>
                           </table>
                                      
                     
                     </div>
                   </div>
                    `
   
                    return summary  
                   },
   
          markbtn = () =>{
             let   markbtn = `<div class="row smallFont my-2 py-2 border-bottom" >
               <div class="col-9">
                   ${bili.markDesc!=null&&bili.markDesc!=''?'<span class="pl-1" style="border-left:2px solid brown">'+bili.markDesc+'</span>':''}
                    
               </div>
              
   
               <div  class="col-3 text-right">
                   <button id="markTheBill" data-from="${bil.from}" data-to="${bil.to}" title="${!bili.mark?lang('Weka Alama Toleo','Mark Batch'):lang('Ondoa Alama','Unmark Batch')}" data-bil=${bili.id} data-mark=${Number(bili.mark)} data-toggle="modal" data-target="#saveBillMarked" class="smallMadebuttons  p-1">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${bili.mark?'brown':'none'}" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star">
                                       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                               </svg>
                   </button>
               </div>
           </div>`
   
           return markbtn
          },        
               
         thebackbtn = () =>{
           let btn =` <div class="RiportDataPanel showDt text-right" style="position: fixed;top:90vh;right:10px">
                            <button class="btn btn-danger btn-sm    showDtBtn" onclick="${Back_to_categ>0?`showCategoryItems(${Back_to_categ})`:`$('#showItemState').hide();$('#theDataPanel').fadeIn(200)`}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </button>
                </div>`

                return btn
         },      
         theInitial =  `${markbtn()} <div class="Fixed_div pb-5">${theTitle} <div id="billedItms"> ${trendsT()} ${summary()} ${thebackbtn()} </div> </div>`
         
         $('#theDataPanel').hide()
         $('#showItemState').fadeIn(100)
        $('#showInitial').html(theInitial)
           }else{
              loadBill(bil)          
              
        }
   
   
   
       
       
   }
   

   const loadBill = (bil)=>{
      const num = bil.num
   
   $("#loadMe").modal('show');
          let data={
               data:{
               val:bil.bil,
               al:1,
               csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
           },
          url:`/riport/${num==3?'theBatch':num==1?'theReceive':num==2?'theBill':'theAddAdj'}` 
           }, fct = getRiportData(data)
   
           fct.then(data=>{
               
               if(data.success){
                 $("#loadMe").modal('hide');
                   THE_INITIAL.push({id:bil.bil,num:bil.num,data})
                
                   theBilled(bil)

               }
               
           })
   }

   function viewItembByBranch(vl){
  
    const {id,val} = vl,
       
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')) || 0,
       
        Df = i=>i.bidhaa_id==id,  Lf = i=>i.online,Tawi =branch(),
        idt = bidhaaState.state.find(bs=>bs.id===id),




       {bil,data:items,mauzo,adjst:adjs,transfer:hamishwa} = ITEM_BRANCH,

       {num:nim,itm:bidhaaId} = bil,
       itms = items.filter(Df),                    
       Sales = mauzo.filter(Df),
      
       adjst = adjs.filter(Df),
       transfer = hamishwa.filter(Df),
      
   
      
       tw =[...new Set(itms.map(m=>m.shop))], 
       matawi = tw.map(t=>formT(t)),
       thebackbtn = () =>{
        let btn =` <div class=" text-right" style="position: fixed;top:90vh;right:10px">
                         <button class="btn btn-danger btn-sm   " onclick="theBilled({bil:${bil.bil},num:${bil.num},itm:${bil.itm}})">
                             <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
                                 <line x1="19" y1="12" x2="5" y2="12"></line>
                                 <polyline points="12 19 5 12 12 5"></polyline>
                             </svg>
                         </button>
             </div>`

             return btn
      } 


   
  
  


        function formT(t){
            const ft=d=>d.shop==t,
                    itmz = itms.filter(ft),
                    pui =  nim==1?itms.filter(d=>d.duka===t ):itms.filter(d=>d.duka===t && d.uhamisho_id===null),
                  
                    alitms = itms.filter(ft),
                    adj = adjst.filter(ft),
                    sale = Sales.filter(ft),
                    tr_to = transfer.filter(to=>to.kwenda_duka===t),
                    tr_fro = transfer.filter(ft),

                    bei = [... new Set(itmz.map(t=>t.Bei_kununua/t.uwiano))],
                    beiAv = bei.reduce((a,b)=> a + Number(b),0)/bei.length ,
                    initialqtyPu = b => b.bqty - b.rudi,
                    initialqtyOther = b => b.bqty
                    

            return {
                id:t,
                duka:itmz[0]?.duka,
                shop:itmz[0]?.shop,

                name:itmz[0]?.shopN,
               
    
               
                    
                tha:pui.reduce((a,b)=> a + (Number(b.Bei_kununua)*(nim==2?initialqtyPu(b):initialqtyOther(b))/b.uwiano),0),
                idadi:pui.reduce((a,b)=> a + Number((nim==2?initialqtyPu(b):initialqtyOther(b))),0),

                shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                shelfqty:alitms.reduce((a,b)=> a + Number((b.idadi)),0),

                rc:tr_to.reduce((a,b)=> a + Number((b.qty)),0),
                tr:tr_fro.reduce((a,b)=> a + Number((b.qty)),0),
                added:adj.filter(pr=>pr.Ongeza).reduce((a,b)=> a + Number((b.qty)),0),

                sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
                saleqty:sale.reduce((a,b)=> a + Number((b.idadi-b.returned)),0),


                kipimo:itmz[0].kipimo,

                uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                uzalishajiqty:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + Number((b.qty)),0),
                
                upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                upotevuqty:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + Number((b.qty)),0),

                matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                matumiziqty:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + Number((b.qty)),0),
                
                bei:beiAv
                

            }
        }

        function summary(){
            const {bei,bqty:idadi,kipimo,shelfqty,sale,uzalishajiqty,matumiziqty,upotevuqty,saleqty,added} = idt
         
            let  cost=0,  summary = `
                    <div class="row mx-0" >
                     
                 <div class=" col-12 weight500 mt-2" >${lang('Ufupisho','Summary')}</div>
                <div class ="col-md-6  col-sm-8 mx-0 px-0">
                    
                   
                    
                    <table class="border   latoFont table table-sm table-hover "  >
                    <tr class="smallFont text-left" >
                        <th>${lang('Mwenendo','Trend')}</th>
                        <th>%</th>                    
                        <th>${lang('idadi','Quantity')} (<span class="darkblue">${kipimo}</span>) </th>
                        <th>${lang('Thamani Jumla','Net Worth')}${CURRENCII}</th>
                    </tr>    
                        <tbody class="cursor-pointer p-3" >
                      
                        
                                    <tr  class="cursor-pointer manunuzi weight600 ">    
                                        <td class="">${lang('Awali','Initially')}</td>
                                        <td ></td>
                                        <td class="weigth500" >${Number(idadi).toFixed(2)}</td>
                                        <td class="text-right"><span class="brown">${floatValue(idadi*bei)}</span> </td>
                                    </tr>  

                                   <tr  class="cursor-pointer wastes">
                                        <td class="">${lang('Upotevu','Wastage')}</td>
                                        <td >${floatValue(upotevuqty*100/idadi)}%</td>
                                        <td >${Number(upotevuqty).toFixed(FIXED_VALUE)}</td>
                                        <td class="text-right"><span class="weight500">${floatValue(upotevuqty*bei)}</span> </td> 
                                 
                                        </tr>
                                    <tr  class="cursor-pointer usage">
                                        <td class="">${lang('Kutumika','Usage')}</td>
                                        <td >${floatValue(matumiziqty*100/idadi)}%</td>
                                        <td >${Number(matumiziqty).toFixed(FIXED_VALUE)}</td>
                                        <td class="text-right"><span class="weight500">${floatValue(matumiziqty*bei)}</span> </td> 
                                 
                                    </tr>   
                                        `
                                        
                              if(Uzalishaji)  {
                                   summary += `
                                         <tr  class="cursor-pointer production">
                                             <td class="">${lang('Uzalishaji','Production')}</td>
                                             <td >${floatValue(uzalishajiqty*100/idadi)}%</td>
                                             <td >${Number(uzalishajiqty).toFixed(FIXED_VALUE)}</td>
                                             <td class="text-right"><span class="weight500">${floatValue(uzalishajiqty*bei)}</span> </td> 
                                 
                                             </tr>
                                    `
                              }    
                                
                                 summary += `
                                          <tr  class="cursor-pointer mauzo">
                                             <td class="">${lang('Thamani ya Zilizouzwa','Sold Worth')}</td>
                                             <td >${floatValue(saleqty*100/idadi)}%</td>
                                             <td >${Number(saleqty).toFixed(FIXED_VALUE)}</td>
                                             <td class="text-right"><span class="weight500">${floatValue(saleqty*bei)}</span> </td> 
                                 
                                             </tr>

                                          <tr  class="cursor-pointer">
                                             <td class="">${lang('Mauzo Jumla','Total Sales')}</td>
                                             <td ></td>
                                             <td ></td>
                                             <td class="text-right"><span class="weight500">${floatValue(sale)}</span> </td> 
                                 
                                             </tr>`

                                             if(added>0){
                                                   summary +=  `<tr  class="cursor-pointer  border-top-danger kuongezwa">
                                                                <td >${lang('Zilizongezwa','Added')}</td>
                                                                <td >${floatValue(added*100/idadi)}%</td>
                                                                <td  >${Number(added).toFixed(FIXED_VALUE)}</td>
                                                                <td class="text-right">${floatValue(added*bei)} </td> 
                                                    
                                                                </tr>

                                                            
                                                        `
                                             }
                                           
                                         summary +=  `<tr  class="cursor-pointer weight600 border-top-danger zilizopo">
                                             <td >${lang('Zilizopo','OnShelf')}</td>
                                             <td >${floatValue(shelfqty*100/idadi)}%</td>
                                             <td  >${Number(shelfqty).toFixed(FIXED_VALUE)}</td>
                                             <td class="text-right">${floatValue(shelfqty*bei)} </td> 
                                 
                                             </tr>

                                          
                                    `
                       

                
                      summary +=` 
                            </tbody>
                            </table>
                                       
                      
                      </div>
                    </div>
                     `

                     return summary
        }


        if(LoC){

            //Draw new Chart................................................................................................................./
            placedataPanel.html(`<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
    
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: matawi.map(tw=>tw.name),
                    datasets: [{
                        label:lang("Manunuzi","Purchases"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: matawi.map(a=>a.tha),
                        spanGaps: true,
                        }, {
                            label: lang("Matumizi","Usage"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#BF2B2B",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.matumizi).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Uharibifu/Upotevu","Damage/Wastage"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#C04F2A",
                            borderColor: "#C04F2A", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.upotevu).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Mauzo","Sales"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "darkgreen",
                            borderColor: "darkgreen", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.sale).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Zilizopo","Onhelf"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "green",
                            borderColor: "green", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.shelf).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                        ]
                    };

                    if(Uzalishaji){
                       data.datasets.push({
                           label: lang("Uzalishaji","Manufacturing"),
                           fill: true,
                           lineTension: 0,
                           backgroundColor: "#62692D",
                           borderColor: "#62692D", // The main line color
                       
                           // notice the gap in the data and the spanGaps: false
                           data:matawi.map(a=>Number(a.uzalishaji).toFixed(FIXED_VALUE)),
                           spanGaps: false,
                       })
                   }

                    var options = {
                        plugins: [{
                        beforeInit: function (chart) {
                        chart.data.labels.forEach(function (e, i, a) {
                            if (/\n/.test(e)) {
                            a[i] = e.split(/\n/)
                            }
                        })
                        }
                    }],
                
                tooltips: {
                            bodyFontSize: window.outerWidth>800?19:15,
                            enabled: true,
                            callbacks: {
                                label: function (tooltipItems, data) {
                                    return data.datasets[tooltipItems.datasetIndex].label + ` ${currencii} : `+ tooltipItems.yLabel.toLocaleString();
                                }
                            }
                        },
                
                
            scales: {
                        yAxes: [{
                            
                            ticks: {
                                beginAtZero:true,
                                display:window.outerWidth>800?true:false
                                
                            },
                            scaleLabel: {
                                display: true,
                                labelString: ` ${lang(`Thamani`,`Worth`)}(${currencii})`,
                                fontSize: 13 
                            }
                        }],
                        xAxes:[
                            {
                                ticks:{
                                    display:false
                                },
                                 scaleLabel: {
                                display:true,
                                labelString:lang('Bidhaa','Items'),
                                fontSize: 13 
                            }
                            }
                        ]            
                    }  
            };

            // Chart declaration:
            var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
            });	
    
        }else{
          let td=  `
          <div class="table-responsive">
          <table id="SoldItems" class="table table-sm table-bordered table-hover   smallFont" style="width:100%">
             <thead>
            <tr class="smallFont latoFont">
                <th rowspan=3 >#</th>

                <th rowspan=3 >${lang('Tawi','Branch')}</th>

                
                
                <th rowspan=3 >${lang('vipimo','Units')}</th>

                <th rowspan=3 >${lang('Thamani/Kipimo','Price/unit')}${CURRENCII}</th>
                
                <tr class="smallFont latoFont">
                    <th class="manunuzi" colspan=2 >${lang('Awali','Initial')}</th>

                    <th class="kupokewa" colspan=2 >${lang('Kupokelewa','Receved')}</th>

                    <th class="kuongezwa" colspan=2 >${lang('Kuongezwa','Added')}</th>
                    <th class="zilizopo" colspan=2 >${lang('Kuhamishwa','Transfered')}</th>

                    <th class="usage" colspan=2 >${lang('Matumizi','Usage')}</th>
                    <th class="wastes" colspan=2 >${lang('Upotevu/Uharibifu','Wastage/Damage')}</th>`
            
                  if(Uzalishaji)  {
                     td+= `<th class="production" colspan=2> ${lang('Uzalishaji','Manufacturing')}</th>` 
                  }
                  
                  td+= `<th class="mauzo" colspan=2> ${lang('Mauzo','Sales')}</th>
                        <th class="zilizopo" colspan=2> ${lang('Zilizopo','Onshelf')}</th>
                 </tr>

                <tr class="smallFont latoFont">
                   <th class="manunuzi"> ${lang('Idadi','Quantity')} </th>
                   <th class="manunuzi"> ${lang('Thamani','Worth')} ${CURRENCII} </th>
                
                   <th class="kupokewa"> ${lang('Idadi','Quantity')} </th>
                   <th class="kupokewa"> ${lang('Thamani','Worth')} ${CURRENCII} </th>
                
                   <th class="kuongezwa"> ${lang('Idadi','Quantity')} </th>
                   <th class="kuongezwa"> ${lang('Thamani','Worth')} ${CURRENCII} </th>
                
                   <th class="kuhamishwa"> ${lang('Idadi','Quantity')} </th>
                   <th class="kuhamishwa"> ${lang('Thamani','Worth')} ${CURRENCII} </th>

                   <th class="usage"> ${lang('Idadi','Quantity')} </th>
                   <th class="usage"> ${lang('Thamani','Worth')} ${CURRENCII} </th>

                   <th class="wastes"> ${lang('Idadi','Quantity')} </th>
                   <th class="wastes"> ${lang('Thamani','Worth')} ${CURRENCII} </th>
`            

 
                if(Uzalishaji){
                    td+=`
                        <th class="production"> ${lang('Idadi','Quantity')} </th>
                        <th class="production"> ${lang('Thamani','Worth')} ${CURRENCII} </th>
                         `
                    }
                  

                td+= `<th class="mauzo"> ${lang('Idadi','Quantity')} </th>
                      <th class="mauzo"> ${lang('Thamani','Worth')} ${CURRENCII} </th>

                      <th class="zilizopo"> ${lang('Idadi','Quantity')} </th>
                      <th class="zilizopo"> ${lang('Thamani','Worth')} ${CURRENCII} </th>
                </tr>

               `
              
               
           
             
            td+=`

            

            </tr>
        </thead>
        <tbody id="products_list" class="cursor-pointer">`,
        num = 0
        
        
        matawi.forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize weight500 darkblue noWordCut" ><u>${a.name}</u></td>
              <td class="text-primary" >${a.kipimo}</td>
              <td class="brown" >${floatValue(a.bei)}</td>

              <td class="weight600 manunuzi" >${a.duka==a.shop?a.idadi.toFixed(FIXED_VALUE):'------'}</td>
              <td class="manunuzi">${a.duka==a.shop?floatValue(a.tha):'-------'}</td>

              <td class="weight600 kupokewa" >${Number(a.rc).toFixed(FIXED_VALUE)}</td>
              <td class="kupokewa">${floatValue(a.rc*a.bei)}</td>

              <td class="weight600 kuongezwa" >${Number(a.added).toFixed(FIXED_VALUE)}</td>
              <td class="kuongezwa">${floatValue(a.added*a.bei)}</td>
              
              <td class="weight600 kuhamishwa" >${Number(a.tr).toFixed(FIXED_VALUE)}</td>
              <td class="kuhamishwa">${floatValue(a.tr*a.bei)}</td>

              <td class="weight600 usage" >${a.matumiziqty.toFixed(FIXED_VALUE)}</td>
              <td class="usage" >${floatValue(a.matumizi)}</td>

              <td class="weight600 wastes" >${a.upotevuqty.toFixed(FIXED_VALUE)}</td>
              <td class="wastes" > ${floatValue(a.upotevu)}</td>
              `

              if(Uzalishaji){
              td+=`<td class="weight600 production" >${a.uzalishajiqty.toFixed(FIXED_VALUE)}</td>
                    <td class="production" >${floatValue(a.uzalishaji)}</td>`
              }

             td+= `<td class="weight600 mauzo" >${a.saleqty.toFixed(FIXED_VALUE)}</td>
              <td class="mauzo" >${floatValue(a.sale)}</td>

              <td class="weight600 brown zilizopo" >${a.shelfqty.toFixed(FIXED_VALUE)}</td>
              <td class="brown zilizopo" >${floatValue(a.shelf)}</td>

              
              `

             
        })

td+=`</tbody>
</table>

</div>
`   
     
    
    $('#showInitial').html(td+thebackbtn())
    $('#SoldItems').DataTable();
        }
    
        
     
        $('#showInitial').prepend(`<h6 id="itmTitle" class="py-3" data-itm=${id} data-val=${val} data-num=1 >${lang(`${nim==1?'Kupokelewa':nim==2?'Manunuzi':nim==3?'Uzalishaji':'Kuongezwa'} na Mwenendo kwa`,`${nim==1?'Receives':nim==2?'Purchases':nim==3?'Production':'Adding'} and trends for`)} <i class="darkblue text-capitalize">${itms[0].bidhaaN}</i>  ${lang('Kwa kila Tawi','In each branch')}</h6> ${summary()}`)

   


}
 

//SHOW SALES ON ITEM BY BRANCH.....................//
$('body').on('click','.checkByBranch',function(){
    let val= Number($(this).data('val')),id= Number($(this).data('itm')),num=Number($(this).data('num'))
         
            viewItembByBranch({val,id})    
})

$('body').on('click','#invState a',function(){
    $('#invState a').removeClass('active')
    $('#invState a').removeClass('text-primaryi')
    $(this).addClass('active')
    $(this).addClass('text-primaryi')

    INVENTORY = Number($(this).data('val'))
    CreateView()
})

$('body').on('click','.riportOn',function(){
$('.riportOn').addClass('btn-light')
$(this).removeClass('btn-light')
$(this).addClass('btn-primary')


$('.riportOn').data('riport',Number($(this).data('r')))

$('#showItemState').hide()
$('#theDataPanel').fadeIn(100)

CreateView()
})

$('body').on('click','.currentOrSaved',function(){
         SVD  = Number($(this).data('svd'))   
  const  SV = Number($(this).data('sv'))  
  
  if(SV&&SVD==0){
    toastr.info(lang('Hakuna Hesabu iliyopo kwa sasa','No Saved Inventory State Available'), lang('Taarifa','info'), {timeOut: 2000});

  }else{
    $('.stateSel').removeClass('actively')
    $(this).parent('li').addClass('actively')

    $('#showItemState').hide()
    $('#theDataPanel').fadeIn(100)
    loadStockDate()
  }
 
  if(!SV){
    $('#forSaved').hide(200)
  }
    


})

$('body').on('click','#showCheckState label input',function(){
    CreateView()
})


function removeSavedState(dt){
  const  dta = {
        data:{
            id:dt,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },
        url:`/riport/RemoveSaved`
    }
        $("#loadMe").modal('show');
        let fct = getRiportData(dta)

        fct.then(function(data){
           $("#loadMe").modal('hide');
           if(data.success){
            toastr.success(lang(data.msg_swa,data.msg_eng), lang('Imefanikiwa','Success'), {timeOut: 2000});
             ALLSAVED   = ALLSAVED.filter(sv=>sv.id!=dt)
             $('#toSave').data('svd',ALLSAVED[0].id)
             allSavedDt()
             
        }else{
             toastr.error(lang(data.msg_swa,data.msg_eng), lang('Haijafanikiwa','Error'), {timeOut: 2000});

           }
        })

}