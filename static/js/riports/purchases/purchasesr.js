
function DuraTable(){
        let dta = {
            data:{ 
                    d:0,
                    r:1,
                    tf:StartDate,
                    tt:moment().format(),
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                },
                url:'/riport/PurchaseData'}

                $("#loadMe").modal('show');

                let fct = getRiportData(dta)

                 fct.then(function(data){
                    $("#loadMe").modal('hide');

                  const leo = moment().startOf('day').format(),
                        wk = moment().startOf('isoWeek').format(),
                        mth = moment().startOf('month').format(),
                        dy = d=>moment(d.tarehe).format()>=leo,wkf=d=>moment(d.tarehe).format()>=wk,mthf=d=>moment(d.tarehe).format()>=mth
                        
                        theData.state = [{
                                 id:1,
                                 name:lang('Leo','Today'),
                                 from:moment().startOf('day').format(),
                                 To:moment().format(),
                                 txt:`${lang('Leo, Kuanzia<span class="brown">','Today, From<span class="brown">')}(${moment().startOf('day').format('dddd DD/MM/YYYY HH:mm')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                               
                                 dtS:data.mauzo.filter(dy), 
                                 dtP:data.data.filter(dy), 
                                 dtC:data.cost.filter(d=>moment(d.Tarehe).format()>leo), 
                                 dtAdj:data.adjst.filter(dy), 
                                 dtTr:data.transfer.filter(dy), 

                                 mark:0,
                              


                            },
                         { 
                                 id:2,
                                 name:lang('Wiki hii','This Week'),
                                 from:moment().startOf('isoWeek').format(),
                                 To:moment().format(),
                                 txt:`${lang('Wiki hii,  Kuanzia<span class="brown">','This Week, From<span class="brown">')}(${moment().startOf('isoWeek').format('dddd, DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`,   
                             
                                 dtS:data.mauzo.filter(wkf),
                                 dtP:data.data.filter(wkf),
                                 dtC:data.cost.filter(d=>moment(d.Tarehe).format()>wk),
                                 dtAdj:data.adjst.filter(wkf), 
                                 dtTr:data.transfer.filter(wkf), 
                                 mark:0
                               

                        
                            },
                         {       
                                 id:3, 
                                 name:lang('Mwezi huu','This Month'), 
                                 from:moment().startOf('month').format(),
                                 To:moment().format(),
                                 txt:`${lang('Mwezi huu, Kuanzia<span class="brown">','This Month, From<span class="brown">')}(${moment().startOf('month').format('dddd, DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                                 
                                 dtS:data.mauzo.filter(mthf),
                                 dtP:data.data.filter(mthf),
                                 dtC:data.cost.filter(d=>moment(d.Tarehe).format()>mth),
                                 dtAdj:data.adjst.filter(mthf), 
                                 dtTr:data.transfer.filter(mthf), 
                                 mark:0
                               

                            
                            }]

                            ITEMSADDING=1,

                            AddRow()
                    
                    
                    


                     
               })

         }


DuraTable()


function createArray(name,from,to,mark){
        
        const ft =d=>moment(d.tarehe).format()>=from && moment(d.tarehe).format() <= to
                let dtA = !Number(mark)?theData.state.filter(d=>d.from<=from && d.To>=to):theData.state.filter(d=>d.mark),Adt={}
                    dtI=[],dt=[],onlineI=[],directI=[],direct=[],online=[],idn = $('#riportData tr').length
 
                if(dtA.length>0){
                     Adt = dtA[0]
                     
                   const   dtS = Adt.dtS.filter(ft),
                            dtP = Adt.dtP.filter(ft),
                            dtC = Adt.dtC.filter(ft),
                            dtAdj=Adt.dtAdj.filter(ft),
                            dtTr=Adt.dtTr.filter(ft)

                      
                     
                     theArr(dtS,dtP,dtC,dtTr,dtAdj,name,from,to)

                }else{

                 let dta = {data:{ 
                        d:0,
                        r:1,
                        mark:mark,
                        tf:from,
                        tt:to,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                    },
                    url:'/riport/PurchaseData'}
                    $("#loadMe").modal('show');
                    let fct = getRiportData(dta)
    
                     fct.then(function(data){
                        $("#loadMe").modal('hide');

                         theArr(data.mauzo,data.data,data.cost,data.adjst,data.transfer,name,from,to,mark)

                     })
                        

                }   

                }

function theArr(dtS,dtP,dtC,dtAdj,dtTr,name,from,to,mark){
  let           
                txt = moment().startOf('year').format() == from && moment().endOf('day').format() == moment(to).endOf('day').format() ? `</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>` : `${lang('Hadi<span class="brown smallerFont">(','To<span class="brown smallerFont">(')} ${moment(to).endOf('day').format('dddd, DD/MM/YYYY HH:mm')})</span>`,
                muda_ = `, ${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(from).startOf('day').format('dddd, DD/MM/YYYY')})</span>, ${txt}`
                 
                ar= { 
                        id:idn+1, 
                        name:name, 
                        from:from,
                        To:to,
                        txt:`${name}${mark?'':muda_}`, 
                        dtP:dtP,
                        dtS:dtS,
                        dtC:dtC,
                        dtAdj:dtAdj, 
                        dtTr:dtTr, 
                        mark:mark
                        
                    }

                 theData.state.push(ar)
                 AddRow()
}        

function AddRow(){
     let tr='',n=0,chk='',vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0)
        if(theData.state.length>0){        
            theData.state.forEach(td=>{
            let Df = i => !i.online,  Lf = i=>i.online,Na = ByU(),Tawi=branch(),Wvat = withVat()
                    //  BRANCH SELECTOR FILTER
                    dtP= td.dtP.filter(d=>d.duka===Tawi),
                    dtS = td.dtS.filter(d=>d.duka===Tawi),
                    dtC = td.dtC.filter(d=>d.duka===Tawi)
                   
               n+=1 
                   
                chk+=` <div class="custom-control smallFont d-inline mx-2 custom-checkbox"  >
                            <input type="checkbox" onchange="$('#dataRow${n}').toggle(100)"  checked name="MonthSale" id="MonthSale${n}" class="custom-control-input" style="cursor: pointer !important;"><label class="custom-control-label" style="cursor: pointer !important;" for="MonthSale${n}">${td.name}</label>
                        </div>`
                let bg=''

                let tha = dtP.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
                    shelf = dtP.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
                    uzo =  dtS.reduce((a,b)=> a + Number(b.idadi)*Number(b.bei),0),
                    cost =  dtC.reduce((a,b)=> a + Number(b.kiasi),0),
                    vat=Number(dtS.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0))
                    uzo = uzo - vat
                  
                    bg = n>3?'table-info':''

            
                

                tr+=`
                    <tr class="text-center ${bg}" id="dataRow${n}">
                    <td scope="row">
                       <span class="noWordCut"> ${td.name}</span>
                    </td>
                
                    <td class=" weight600">${Number(tha+cost).toLocaleString()}</td>
                    <td class=" weight600">${Number(shelf).toLocaleString()}</td>
                    
                    `
                    
                    
                    tr+=`<td>
                       <div class="d-flex">
                        <button type="button" data-val=${td.id} data-show=".RiportDataPanel" data-hide=".PeriodTableData" class="btn btn-sm border0 showDtBtn smallerFont btn-light" title="${lang('Onesha zaidi','More Info')}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z">
                                </path><circle cx="12" cy="12" r="3"></circle>
                                </svg>
                        </button>
                    `

                    if(n>3){
                    tr+=`
                       <button type="button" data-val=${td.id} class="btn btn-sm text-danger removeTherow border0 smallerFont btn-danger btn-light" title="${lang('Ondoa','Remove')}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    `
                }
                    
                 tr+=`</div></td></tr>`
            })        
        
            $('#riportData').html(tr)

            $('#mapSelector').html(chk)

            v = Number($('#riportSwitch .btn-primary').data('val'))
            placeDt(v)
            
        }

}
      

    $('body').on('click','.removeTherow',function(){
        let n = $(this).data('val')
        $(`#dataRow${n}`).remove()
        $(`#MonthSale${n}`).parent('div').remove()
        theData.state = theData.state.filter(i=>Number(i.id)!=Number(n))
        
    })

    $('body').on('click','.showDtBtn',function(){
        let val = Number($(this).data('val')) || 0
            placeDt(val)
            $($(this).data('hide')).hide()
            $($(this).data('show')).fadeIn(100)

    })


function placeDt(val){

      VAL = val //This valiable is used to fetch data from the timely list data array
        
      $('.riportOn').data('val',val || Number($('#firstR').data('val')))
      const  dt =  theData.state.filter(i=>i.id===val)

               
                
           if(dt.length>0){
                const  theDT = dt[0],
                    n = Number($('#riportSwitch .btn-primary').data('riport')),
                    vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),


                    Df = i => !i.online,  Lf = i=>i.online,Tawi =branch(), NaV = byVendor(),
                    //  BRANCH SELECTOR FILTER
                    br  = d=>Number(d.duka)===Tawi && Number(d.shop)===Tawi && Number, nbr=d=>Number(d.shop)!=Tawi && Number(d.duka)===Tawi,
                    wheNoV = v=>v.vendor>=0, whenV= v => v.vendor===NaV,
                    ByVn = NaV==0?wheNoV:whenV,   

                    Purchases= {this:theDT.dtP.filter(r=>Number(r.rudi)!=Number(r.bqty)).filter(br).filter(ByVn),other:theDT.dtP.filter(nbr).filter(r=>Number(r.rudi)!=Number(r.bqty)).filter(ByVn)},                    
                    Sales = {this:theDT.dtS.filter(br).filter(ByVn),other:theDT.dtS.filter(nbr).filter(ByVn)},
                    other_cost = {this:theDT.dtC.filter(br).filter(ByVn),other:theDT.dtC.filter(nbr).filter(ByVn)},
                    adjst = {this:theDT.dtAdj.filter(br).filter(ByVn),other:theDT.dtAdj.filter(nbr).filter(ByVn)},
                    transfer = {this:theDT.dtTr.filter(br).filter(ByVn),other:theDT.dtTr.filter(nbr).filter(ByVn)},

                    //VENDORS SELECTOR.................//
                    vendor = [...new Set(theDT.dtP.filter(br).map(vn=>vn.vendor))].map(v=> `<option class="text-capitalize" value="${v}" >${theDT.dtP.filter(vn=>vn.vendor===v)[0].supplier}</option>`) 

                    $('#NaVendor').html(`${vendor.length>1?`<option value="0" selected>${lang('Wote','All')}</option>`:''}  ${vendor}`)

                    if(NaV>0||vendor.length<=1){
                        $('#NaVendor').addClass('darkblue')
                        
                        if(vendor.length>1){
                            $('#NaVendor').val(NaV)
                        }
                    }else{
                        $('#NaVendor').removeClass('darkblue')
                    }

                    ItemsTrends({Purchases,transfer,adjst,Sales,other_cost})
                 
                    //Add time to hidden save riport form...........................//
                    $('#fromT').val(moment(theDT.from).startOf('day').format())                    
                    $('#toT').val(moment(theDT.To).endOf('day').format())                    


                          

                             duraTitle =  theDT.txt   
                             let trnd  = lang('Mwenendo wa Bidhaa Zilizonunuliwa','The Trend of Purchased Items')
                             $('#riporttitle').html(`${trnd}, ${theDT.txt} `)
                            $('#riporttitle').data('val',val)       
                            
                            placedataPanel = $('#theDataPanel')

                            switch (Number(n)) {
                                case 1:
                                    placeInvo(Purchases,{transfer,adjst,Sales,other_cost},{from:theDT.from,to:theDT.To})
                                    break;
                                case 2:
                                    placeItems({Purchases,transfer,adjst,Sales,other_cost},val)
                                    
                                    break;
                                case 3:
                                    if(n==3){
                                        placeCategory({Purchases,transfer,adjst,Sales,other_cost},val)
                                    }
                                    break;
                                case 4:
                                    placeGroups({Purchases,transfer,adjst,Sales,other_cost},val)
                                    break;
                                case 5:
                                      placeVendor({Purchases,transfer,adjst,Sales,other_cost},val)
                                    break;
                              
                            
                            }

                        
                

                       
    
    
                       

    
                    }
}

function ItemsTrends(data){

          const {Purchases,transfer,adjst,other_cost,Sales} = data,
                
            tha = {
                    this:Purchases.this.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
                    other:Purchases.other.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0)
                },
            
           pay = [... new Set(Purchases.this.map(b=>b.bili))].map(l=>{return{bili:l,ilolipwa:Purchases.this.filter(bl=>bl.bili===l)[0].paid}}),
 
           paid = pay.reduce((a,b)=> a + Number(b.ilolipwa),0),

            shelfForSale ={ 
                this:Purchases.this.filter(s=>!s.service && !s.material).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                other:Purchases.other.filter(s=>!s.service && !s.material).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
            
            },

            shelfMaterial ={ 
                this:Purchases.this.filter(s=>!s.service && s.material).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                other:Purchases.other.filter(s=>!s.service && s.material).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
            
            },


            asset ={ 
                this:Purchases.this.filter(s=>s.service).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                other:Purchases.other.filter(s=>s.service).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
            
            },

            Tr ={ 
                this:transfer.this.reduce((a,b)=> a + (b.tha*(b.idadi)/b.uwiano),0),
                other:transfer.other.reduce((a,b)=> a + (b.tha*(b.idadi)/b.uwiano),0),
            
            },

            Usage ={ 
                this:adjst.this.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                other:adjst.other.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
            
            },

            Wastes ={ 
                this:adjst.this.filter(pr=>pr.mfg===null && !pr.tumika && !pr.Ongeza).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                other:adjst.other.filter(pr=>pr.mfg===null && !pr.tumika && !pr.Ongeza).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
            
            },

            Ongeza ={ 
                this:adjst.this.filter(pr=>pr.Ongeza).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                other:adjst.other.filter(pr=>pr.Ongeza).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
            
            },

            Mnf ={ 
                this:adjst.this.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                other:adjst.other.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
            
            },

            sold =  {
                this:Sales.this.reduce((a,b)=> a + Number(b.idadi-b.returned)*Number(b.bei),0),
                other:Sales.other.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
            },

            soldtha =  {
                this:Sales.this.reduce((a,b)=> a + Number(b.idadi-b.returned)*Number(b.thamani)/Number(b.uwiano),0),
                other:Sales.other.reduce((a,b)=> a + Number(b.idadi-b.returned)*Number(b.thamani)/Number(b.uwiano),0),
            },

            cost =  {
                this:other_cost.this.reduce((a,b)=> a + Number(b.kiasi),0),
                other:other_cost.other.reduce((a,b)=> a + Number(b.kiasi),0),
            },


            vat={
                this:Number(Sales.this.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
                other:Number(Sales.other.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
                
                }

               

                Uzalishaji = Number(Mnf.this + Mnf.other)>0?true:false

                let matawi=$('#Matawini').data('branches')
                       tr = `
                       <tr>
                            <td colspan="${Number(matawi)==0?3:4}" class="brown weight600 manunuzi pt-3" >${lang('Manunuzi','Purchases')}</td>
                        
                       </tr>
                       <tr class="manunuzi" >
                            <td>${lang('Thamani ya Bidhaa','Items Worth')}</td>
                            <td>${floatValue(tha.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">----</td>
                            <td></td>
                       </tr>
                       <tr class="manunuzi" >
                            <td>${lang('Galama Nyingine','Other Costs')}</td>
                            <td>${floatValue(cost.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">-----</td>
                            <td></td>
                       </tr>
                       <tr class=" manunuzi weight600" >
                            <td>${lang('Jumla','Total')}</td>
                            <td class="brown" >${floatValue(cost.this+tha.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">-----</td>
                            <td></td>
                       </tr>

                       <tr class=" manunuzi weight500" >
                            <td>${lang('Malipo','Payment')}</td>
                            <td  >${floatValue(paid)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">-----</td>
                            <td>${floatValue(paid*100/(cost.this+tha.this))}%</td>
                       </tr>

                       <tr class="bg-default" >
                           <td class="text-right" colspan="${Number(matawi)==0?3:4}">
                              <button onclick="$('.forMore').toggle(200)" class="btn btn-light btn-sm " title=${lang('Zaidi..','More..')} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                    </svg>
                              </button>
                           </td>
                       </tr>

                       <tr class="hamishwa forMore" >
                            <td colspan="${Number(matawi)==0?3:4}" class="brown weight600  pt-3" >${lang('Bidhaa Kuhamishwa','Items Transfer')} </td>
                          
                       </tr>
                       <tr class="hamishwa forMore" >
                            <td>${lang('Thamani Zilizohamishwa','Transfered Worth')}</td>
                            <td>${floatValue(Tr.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(Tr.other)}</td>
                            <td></td>
                       </tr>
                    
                      `

                       if(Mnf.this>0||Mnf.other>0){
                          tr+= `
                            <tr class="production forMore" >
                                <td colspan="${Number(matawi)==0?3:4}" class="brown usage weight600 pt-3" >${lang('Uzalishai/Uchakataji Bidhaa','Items Manufacturing/Processing')} </td>
                               
                        </tr>
                          <tr class="production forMore">
                            <td>${lang('Thamani ya Zilizotumika','Items Used Worth')}</td>
                            <td class="weight600" >${floatValue(Mnf.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''} weight600">${floatValue(Mnf.other)}</td>
                            <td class="weight600" >${floatValue((((Mnf.this+Mnf.other)*100)/tha.this)||0)}%</td>
                       </tr>`
                       }
                       

                      tr+= `
                      <tr class="usage forMore" >
                            <td class="brown weight600 pt-3" colspan="${Number(matawi)==0?3:4}" >${lang('Matumizi na Upotevu','Usage & Wastage/Damage')} </td>
                        
                       </tr>
                      
                      <tr class="usage forMore" >
                            <td>${lang('Matumizi','Usage')}</td>
                            <td>${floatValue(Usage.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(Usage.other)}</td>
                            <td></td>
                       </tr>

                      <tr class="usage forMore" >
                            <td>${lang('Upotevu/Kuharibika','Wastage/Damage')}</td>
                            <td>${floatValue(Wastes.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(Wastes.other)}</td>
                            <td></td>
                       </tr>

                      <tr class="weight600 usage forMore" >
                            <td>${lang('Jumla','Total')}</td>
                            <td>${floatValue(Wastes.this + Usage.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(Wastes.other + Usage.other)}</td>
                            <td>${floatValue((((Wastes.this + Usage.this+Wastes.other + Usage.other)*100)/tha.this) || 0)}%</td>
                       </tr>


                       <tr class="mauzo forMore"  >
                            <td class="brown weight600 pt-3" colspan="${Number(matawi)==0?3:4}" >${lang('Bidhaa Zilizouzwa','Sold Items')} </td>
                           
                       </tr>

                       <tr class="mauzo forMore">
                            <td>${lang('Thamani ya Bidhaa','Items Worth')}</td>
                            <td>${floatValue(soldtha.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(soldtha.other)}</td>
                            <td class="weight600" >${floatValue((((soldtha.this + soldtha.other)*100)/tha.this)||0)}%</td>
                        </tr>`

                        if(vat.this>0||vat.other>0){
                                tr+=`<tr class="mauzo forMore">
                                        <td>${lang('Mauzo kwa Bei','Sales By Price')}</td>
                                        <td class="weight600 brown" >${floatValue(sold.this-vat.this)}</td>
                                        <td class="weight600 brown ${Number(matawi)==0?'d-none':''}" >${floatValue(sold.other-vat.other)}</td>
                                        <td></td>
                                    </tr>
                                
                                <tr class="mauzo forMore">
                                    <td>${lang('VAT','VAT')}</td>
                                    <td>${floatValue(vat.this)}</td>
                                    <td class="${Number(matawi)==0?'d-none':''}">${floatValue(vat.other)}</td>
                                    <td></td>
                                </tr>`
                        }
                     

                   tr+=`<tr class="bg-light weight600 forMore" >
                            <td>${lang('Mauzo Jumla','Total Sales')}</td>
                            <td>${floatValue(sold.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(sold.other)}</td>
                            <td></td>
                        </tr>`

                     if(Ongeza.other>0 || Ongeza.this>0){
                            tr+=`<tr class="hamishwa forMore">
                                    <td class="brown weight600 pt-3" colspan="${Number(matawi)==0?3:4}" >${lang('Bidhaa zilizoongezwa','Added Items')} </td>
                                 
                            </tr>

                            <tr class="hamishwa forMore">
                                    <td>${lang(' Thamani ya Bidhaa','Items Worth')}</td>
                                    <td>${floatValue(Ongeza.this)}</td>
                                    <td class="${Number(matawi)==0?'d-none':''}">${floatValue(Ongeza.other)}</td>
                                    <td>${floatValue(((Ongeza.this+Ongeza.other)*100)/tha.this)}%</td>
                                </tr>`
                     }



                      tr+=`<tr class="zilizopo" >
                            <td class="brown weight600 pt-3" colspan="${Number(matawi)==0?3:4}"  >${lang('Zilizopo','Onshelf')} </td>
                          
                       </tr>

                       <tr  class="zilizopo" >
                            <td>${lang('Bidhaa za Kuuza','Goods For Sales')}</td>
                            <td>${floatValue(shelfForSale.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(shelfForSale.other)}</td>
                            <td></td>
                        </tr>`
                        if(shelfMaterial.this>0||shelfMaterial.other>0){
                                    tr+=`<tr class="zilizopo" >
                                            <td>${lang('Nyenzo za Uzalishaji','Production Material')}</td>
                                            <td>${floatValue(shelfMaterial.this)}</td>
                                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(shelfMaterial.other)}</td>
                                            <td></td>
                                        </tr>` 
                                    }
                    if(asset.this>0||asset.other>0){
                       tr+=`<tr class="zilizopo" >
                            <td>${lang('Aseti','Assets')}</td>
                            <td>${floatValue(asset.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(asset.other)}</td>
                            <td></td>
                       </tr>`   
                    }    

                       tr+=`<tr class="weight600 zilizopo" >
                            <td>${lang('Jumla','Total')}</td>
                            <td>${floatValue(asset.this+shelfForSale.this+shelfMaterial.this)}</td>
                            <td class="${Number(matawi)==0?'d-none':''}">${floatValue(asset.other+shelfForSale.other+shelfMaterial.other)}</td>
                            <td>${floatValue((((asset.this+shelfForSale.this+shelfMaterial.this+asset.other+shelfForSale.other+shelfMaterial.other)*100)/tha.this)||0)}%</td>
                       </tr>    
                       `

                      

                       $('#mwenendoRiport').html(tr)
}

function placeInvo(ankara,itms,muda){
    $('#riportMap').text(lang('Siku','Days'))
    let LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        Wvat = withVat(),
        ipu =ankara.this,
        ocst = itms.other_cost.this,
        Adjst = [...itms.adjst.this,...itms.adjst.other],
        aitms = [...ankara.this,...ankara.other],
        sales = [...itms.Sales.this,...itms.Sales.other],

        dates = [...new Set(ipu.map(i=>i.date))].sort(),
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],

        amounts =  dates.map((d)=>{
            let ft=t=>t.date == d,
                pui =  ipu.filter(ft),
                nnt = pui.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
                cost = ocst.filter(t=>t.bdate==d).reduce((a,b)=> a + Number(b.kiasi),0),
                adj = Adjst.filter(ft),
                itms = aitms.filter(ft),
                sale = sales.filter(ft)
                invo = [...new Set(pui.map(d=>d.tarehe))]

            return   { 
                       date:d,
                       invo:invo,
                       manunuzi:nnt+cost,
                       uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       mauzo:sale.reduce((a,b)=> a + Number(b.idadi)*Number(b.bei),0),
                       zilizopo:itms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                       from:invo.sort()[0],
                       to:invo.sort()[invo.length - 1],
            }

        }),

        mAmount =  months.map((d)=>{
            let ft=t=> Number(moment(t.date).format('YYYYMM')) == Number(d),
                pui =  ipu.filter(ft),
                nnt =  pui.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
                cost = ocst.filter(t=>Number(moment(t.bdate).format('YYYYMM')) == Number(d)).reduce((a,b)=> a + Number(b.kiasi),0),
                adj = Adjst.filter(ft),
                itms = aitms.filter(ft),
                sale = sales.filter(ft),
                invo = [...new Set(pui.map(d=>d.tarehe))]

               

                
              
            return   { 
                       invo:invo,
                       month:moment(pui[0].date).format('MMMM, YYYY'),
                       manunuzi:nnt+cost,
                       uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                       upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),

                       mauzo:sale.reduce((a,b)=> a + Number(b.idadi-b.returned)*Number(b.bei),0),

                       zilizopo:itms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                       from:invo.sort()[0],
                       to:invo.sort()[invo.length - 1],
            }

        })


        

       

        

        fro = moment(muda.from),
        to   = moment(muda.to),  
        days = Number(to.diff(fro,'days')) + 1  

        
    

  

   //    
   $('#howMany').text(`${dates.length}/${days}`)

    if(LoC){

               //Draw new Chart................................................................................................................./
               let title = `<h6 class="py-2" >${lang(`Takwimu za mwenendo wa bidhaa zilizonunuliwa kwa kila `,`The Trend for Purchased Goods Statistics on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
               
               $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
                
                   
               var canvas = document.getElementById('myChartC');
               var ctx = canvas.getContext('2d');
               var data= {
                       labels: days<=31?amounts.map(d=>moment(d.date).format('ddd, DD-MM-YYYY')):mAmount.map(m=>m.month),
                       datasets: [{
                           label:lang("Manunuzi","Purchases"),
                           fill: true,
                           lineTension: 0,
                           backgroundColor: "#1a8dff15",
                           borderColor: "#1a8cff", // The main line color
                           
                           // notice the gap in the data and the spanGaps: true
                           data: days<=31?amounts.map(a=>a.manunuzi):mAmount.map(m=>m.manunuzi),
                           spanGaps: true,
                           }
                           , {
                               label: lang("Matumizi","Usage"),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "#BF2B2B15",
                               borderColor: "#BF2B2B", // The main line color
                           
                               // notice the gap in the data and the spanGaps: false
                               data:days<=31?amounts.map(a=>Number(a.matumizi).toFixed(FIXED_VALUE)):mAmount.map(m=>m.matumizi),
                               spanGaps: false,
                           }
                           , {
                               label: lang("Uharibifu/Upotevu","Damage/Wastage"),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "#c0502a15",
                               borderColor: "#C04F2A", // The main line color
                           
                               // notice the gap in the data and the spanGaps: false
                               data:days<=31?amounts.map(a=>Number(a.upotevu).toFixed(FIXED_VALUE)):mAmount.map(m=>m.upotevu),
                               spanGaps: false,
                           }
                          
                          ,{
                               label: lang("Mauzo","Sales"),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "rgba(2, 88, 2, 0.15)",
                               borderColor: "darkgreen", // The main line color
                           
                               // notice the gap in the data and the spanGaps: false
                               data:days<=31?amounts.map(a=>Number(a.mauzo).toFixed(FIXED_VALUE)):mAmount.map(m=>m.mauzo),
                               spanGaps: false,
                           }
                          ,{
                               label: lang("Zilizopo","Onshelf"),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "rgba(0, 128, 0, 0.15)",
                               borderColor: "green", // The main line color
                           
                               // notice the gap in the data and the spanGaps: false
                               data:days<=31?amounts.map(a=>Number(a.zilizopo).toFixed(FIXED_VALUE)):mAmount.map(m=>m.zilizopo),
                               spanGaps: false,
                           }
                           ]
                       };

                       if(Uzalishaji){
                           data.datasets.push({
                               label: lang("Uzalishaji/Uchakataji",'Manufacturing/Proccessing'),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "#62692d15",
                               borderColor: "#62692D", // The main line color
                           
                               // notice the gap in the data and the spanGaps: false
                               data:days<=31?amounts.map(a=>Number(a.uzalishaji).toFixed(FIXED_VALUE)):mAmount.map(m=>m.uzalishaji),
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
                                       display:window.outerWidth>800?true:false
                                   },
                                    scaleLabel: {
                                   display:true,
                                   labelString:days<=31?lang('Tarehe','Date'):lang('Miezi','Months'),
                                   fontSize: 13 
                               }
                               }
                           ]            
                       }  
               };

               // Chart declaration:
               var myBarChart = new Chart(ctx, {
               type: 'line',
               data: data,
               options: options
               });	
         

       

    }else{
              let   td=  `<table id="InvoRiportTable" class="table table-bordered smallFont" style="width:100%">
               <thead>
                   <tr class="smallFont ">
                       <th>#</th>
                       <th>${days<=31?lang('Tarehe','Date'):lang('Mwezi','Month')}</th>
                       <th> ${lang('Manunuzi','Purchases')}<span class="text-primary latoFont">(${currencii})</span> </th>
                       <th> ${lang('Matumizi','Usage')}<span class="text-primary latoFont">(${currencii})</span></th>
                       <th> ${lang('Uharibifu/Upotevu','Damage/Wastage')}<span class="text-primary latoFont">(${currencii})</span></th>
                     `

                     if(Uzalishaji){
                        td+= `<th> ${lang('Uzalishaji','Manufacturing')}<span class="text-primary latoFont">(${currencii})</span></th>`
                     }
                     
                  td+= `<th> ${lang('Mauzo','Sales')}<span class="text-primary latoFont">(${currencii})</span></th>
                       <th> ${lang('Zilizopo','On Shelf')}<span class="text-primary latoFont">(${currencii})</span></th>
                       <th> ${lang('Bili','Bill(s)')}</th>
                   </tr>
               </thead>
               <tbody id="products_list">`,
               num = 0
               
               amo = days<=31?amounts:mAmount
               amo.reverse().forEach(a=>{
                   num+=1
                  
                   td+=`<tr>
                     <td>${num}</td>
                    
                     <td class="noWordCut" >${days<=31?moment(a.date).format('DD-MM-YYYY'):a.month}</td>
                     <td>${floatValue(a.manunuzi)}</td>
                     <td>${floatValue(a.matumizi)}</td>
                     <td>${floatValue(a.upotevu)}</td>`
                     if(Uzalishaji){
                        td+=`<td >${floatValue(a.uzalishaji)}</td>`   
                     }

                     td+=`<td >${floatValue(a.mauzo)}</td>
                    
                     <td>${floatValue(a.zilizopo)}</td>
                     <td> <button data-from="${a.from}" data-to="${a.to}" class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.invo.length)}</button></td>
                     `
               })

       td+=`</tbody>
       </table>
       `   
       
   let title = `<h6 class="py-2" >${lang(`Orodha ya Manunuzi kwa kila `,`Purchase List on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
     

       $('#theDataPanel').html(`${title} ${td}`)
       

       $('#InvoRiportTable').DataTable();
    }


}

function   placeItems(itms,val){

    
    
    const pui = itms.Purchases.this,
        allpu = [...itms.Purchases.this,...itms.Purchases.other],
        Adjst = [...itms.adjst.this,...itms.adjst.other],
        sales = [...itms.Sales.this,...itms.Sales.other],

        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        bd = [... new Set(pui.map(i=>i.bidhaa_id))],
        bidhaa = bd.map(b=>theItms(b)),
        Tawi  = branch()

        bidhaaState.state = bidhaa


        function theItms(b){
            const  ft=i=>i.bidhaa_id == b ,
                 itm = pui.filter(ft),
                 alitms = allpu.filter(ft),
                 adj = Adjst.filter(ft),
                 sale = sales.filter(ft),
                 branches = [...new Set(alitms.map(s=>s.shop))],
                 bei = [... new Set(itm.map(t=>t.Bei_kununua/t.uwiano))],
                 beiAv = bei.reduce((a,b)=> a + Number(b),0)/bei.length 
            return {
                id:b,
                name:itm[0].bidhaaN,
                tawi:branches.length,

                tha:itm.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
                idadi:itm.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + Number((b.bqty-b.rudi)),0),
                bqty:itm.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + Number((b.bqty-b.rudi)),0),

                shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                shelfqty:alitms.reduce((a,b)=> a + Number((b.idadi)),0),

                sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
                saleqty:sale.reduce((a,b)=> a + Number((b.idadi-b.returned)),0),


                added:adj.filter(pr=>pr.Ongeza).reduce((a,b)=> a + Number((b.qty)),0),


                kipimo:itm[0].kipimo,

                uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                uzalishajiqty:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + Number((b.qty)),0),
                
                upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                upotevuqty:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + Number((b.qty)),0),

                matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                matumiziqty:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + Number((b.qty)),0),
                
                bei:beiAv
               
            }
        }


        if(LoC){

            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${lang(`Takwimu ya Manunuzi na Mwenendo  kwa kila Bidhaa `,`Purchesed and Trends Statistics on each Item  `)}, ${duraTitle}<h6/>`
             $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: bidhaa.map(b=>b.name),
                    datasets: [{
                        label:lang("Manunuzi","Purchases"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: bidhaa.map(a=>a.tha),
                        spanGaps: true,
                        }, {
                            label: lang("Matumizi","Usage"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#BF2B2B",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.matumizi).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Uharibifu/Upotevu","Damage/Wastage"),
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
                                labelString: `${lang(`Thamani`,`Worth`)}(${currencii})`,
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
            td=  `<table id="SoldItems" class="table table-bordered table-hover   smallFont" style="width:100%">
             <thead>
            <tr class="smallFont latoFont">
                <th rowspan=3 >#</th>

                <th rowspan=3 >${lang('Bidhaa','Item')}</th>

                <th rowspan=3  >${lang('Matawi','Branches')}</th>
                
                <th rowspan=3 >${lang('vipimo','Units')}</th>

                <th rowspan=3 >${lang('Bei','Price')}</th>
                
                <tr class="smallFont latoFont">
                    <th class="manunuzi" colspan=2 >${lang('Manunuzi','Purchases')}</th>
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
                   <th class="manunuzi"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                   <th class="usage"> ${lang('Idadi','Quantity')} </th>
                   <th class="usage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                   <th class="wastes"> ${lang('Idadi','Quantity')} </th>
                   <th class="wastes"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
`            
                if(Uzalishaji){
                    td+=`
                        <th class="production"> ${lang('Idadi','Quantity')} </th>
                        <th class="production"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                         `
                    }
                  

                td+= `<th class="mauzo"> ${lang('Idadi','Quantity')} </th>
                      <th class="mauzo"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                      <th class="zilizopo"> ${lang('Idadi','Quantity')} </th>
                      <th class="zilizopo"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                </tr>

               `
              
               
           
             
            td+=`

            

            </tr>
        </thead>
        <tbody id="products_list" class="cursor-pointer">`,
        num = 0
        
        
        bidhaa.reverse().forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize noWordCut" >${a.name}</td>
              <td> <button data-val="${val}" data-itm="${a.id}"  data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>
              <td class="text-primary" >${a.kipimo}</td>
              <td class="brown" >${floatValue(a.bei)}</td>

              <td class="weight600 manunuzi" >${a.idadi.toFixed(FIXED_VALUE)}</td>
              <td class="manunuzi">${floatValue(a.tha)}</td>

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

              </tr>
              `

             
        })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2" >${lang(`Orodha ya Manunuzi na mwenendo kwa kila Bidhaa `,`Purchase and Trends List on each Item Purchased`)} , ${duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
        }


}

function   placeCategory(itms,val){
    let aina = Categs.state,
     
        pui = itms.Purchases.this,
        allpu = [...itms.Purchases.this,...itms.Purchases.other],
        Adjst = [...itms.adjst.this,...itms.adjst.other],
        sales = [...itms.Sales.this,...itms.Sales.other]

        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        bd = [... new Set(pui.map(i=>i.aina))],
        bidhaa = bd.map(b=>theItms(b)),
        Tawi  = branch()
        function theItms(b){
            let  ft=i=>i.aina === b ,
                 itm = pui.filter(ft),
                 alitms = allpu.filter(ft),
                 adj = Adjst.filter(ft),
                 sale = sales.filter(ft)
            return {
                id:b,
                name:aina.filter(i=>i.id===b)[0].aina,
                
                tha:itm.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
              

                shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
              

                sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
    
                uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
              
                matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
                upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
             
                
           
               
            }
        }



        if(LoC){

            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${lang(`Takwimu ya Manunuzi namwenendo wa kila Aina ya Bidhaa `,`Purchases and Trends Statistics on each Item Category  `)}, ${duraTitle}<h6/>`
            $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                labels: bidhaa.map(b=>b.name),
                datasets: [{
                    label:lang("Manunuzi","Purchases"),
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
            td=  `<table id="SoldItems" class="table table-bordered smallFont" style="width:100%">
        <thead>
            <tr class="smallFont ">
                <th>#</th>
                <th>${lang('Aina','Category')}</th>
            
                <th> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Matumizi','Usage')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Uharibifu/Upotevu','Damage/Wastage')} <span class="text-primary latoFont">(${currencii})</span> </th>`
                if(Uzalishaji){
                   td+=` <th> ${lang('Uzalishaji','Manufacturing')}<span class="text-primary latoFont">(${currencii})</span></th>`
                }
               td+=`<th> ${lang('Mauzo','Sales')}<span class="text-primary latoFont">(${currencii})</span></th>`
               
             
               
                   td+=`<th> ${lang('Zilizopo','OnShelf')}</th>`  
            
             
            td+=`</tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        bidhaa.forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize" >${a.name}</td>
           
              <td>${floatValue(a.tha)}</td>
              <td>${floatValue(a.matumizi)}</td>
              <td>${floatValue(a.upotevu)}</td>
              
              `
           if(Uzalishaji){
               td+=`<td>${floatValue(a.uzalishaji)}</td>`
           }          
              

              td+=`<td >${floatValue(a.sale)}</td>
                  <td >${floatValue(a.shelf)}</td>`
        })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >${lang(`Orodha ya Manunuzi na Mwenendo wa kila Aina ya Bidhaa `,`Purchases and Trend List on each Item Category  `)}, ${duraTitle}<h6/>`
                $('#theDataPanel').html(title+td)
                $('#SoldItems').DataTable();
        }

        

        

  

}

 
function   placeGroups(itms,val){
    
    let aina = pcategs.state,
        pui = itms.Purchases.this,
        allpu = [...itms.Purchases.this,...itms.Purchases.other],
        Adjst = [...itms.adjst.this,...itms.adjst.other],
        sales = [...itms.Sales.this,...itms.Sales.other]

    LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
    bd = [... new Set(pui.map(i=>i.kundi))],
    bidhaa = bd.map(b=>theItms(b)),
    Tawi  = branch()
   
    function theItms(b){
        let  ft=i=>i.kundi === b ,
             itm = pui.filter(ft),
             alitms = allpu.filter(ft),
             adj = Adjst.filter(ft),
             sale = sales.filter(ft)
        return {
            id:b,
            name:aina.filter(i=>i.id===b)[0]?.mahitaji,
            
            tha:itm.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
          

            shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
          

            sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),

            uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
          
            matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
            upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
         
            
       
           
        }
    }


    if(LoC){

        //Draw new Chart................................................................................................................./
        let title = `<h6 class="py-2 " >${lang(`Takwimu ya Manunuzi na mwenendo wa kila Kundi la Bidhaa `,`Purchases and Trends Statistics on each Item Category Group `)}, ${duraTitle}<h6/>`
        $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

               
        var canvas = document.getElementById('myChartC');
        var ctx = canvas.getContext('2d');
        var data= {
            labels: bidhaa.map(b=>b.name),
            datasets: [{
                label:lang("Manunuzi","Purchases"),
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
            <th>${lang('Aina','Category')}</th>
        
            <th> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
            <th> ${lang('Matumizi','Usage')} <span class="text-primary latoFont">(${currencii})</span> </th>
            <th> ${lang('Uharibifu/Upotevu','Damage/Wastage')} <span class="text-primary latoFont">(${currencii})</span> </th>
            
            `
            if(Uzalishaji){
               td+=` <th> ${lang('Uzalishaji','Manufacturing')}<span class="text-primary latoFont">(${currencii})</span></th>`
            }
           td+=`<th> ${lang('Mauzo','Sales')}<span class="text-primary latoFont">(${currencii})</span></th>`
           
         
           
               td+=`<th> ${lang('Zilizopo','OnShelf')}</th>`  
        
         
        td+=`</tr>
    </thead>
    <tbody id="products_list">`,
    num = 0
    
    
    bidhaa.forEach(a=>{
        num+=1
        td+=`<tr>
          <td>${num}</td>
         
          <td class="text-capitalize" >${a.name}</td>
       
          <td>${floatValue(a.tha)}</td>
          <td>${floatValue(a.matumizi)}</td>
          <td>${floatValue(a.upotevu)}</td>`
       if(Uzalishaji){
           td+=`<td>${floatValue(a.uzalishaji)}</td>`
       }          
          

          td+=`<td >${floatValue(a.sale)}</td>
              <td >${floatValue(a.shelf)}</td>`
    })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >${lang(`Orodha ya Manunuzi na Mwenendo wa kila Kundi la Bidhaa `,`Purchases and Trend List on each Item Category Group  `)}, ${duraTitle}<h6/>`
            $('#theDataPanel').html(title+td)
            $('#SoldItems').DataTable();
    }

}
 
function   placeVendor(itms){
    
    const aina = pcategs.state,
        pui = itms.Purchases.this,
        allpu = [...itms.Purchases.this,...itms.Purchases.other],
        Adjst = [...itms.adjst.this,...itms.adjst.other],
        sales = [...itms.Sales.this,...itms.Sales.other],

    LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
    bd = [... new Set(pui.map(i=>i.vendor))],
    billsi = [...new Set(pui.map(i=>i.bili))],
    pay = billsi.map(l=>{return{bili:l,vendor:pui.filter(bi=>bi.bili===l)[0].vendor,ilolipwa:pui.filter(bl=>bl.bili===l)[0].paid}}),
    Vendor = bd.map(b=>theItms(b)),
    

    Tawi  = branch()

 
    function theItms(b){
        let  ft=i=>i.vendor === b ,
             itm = pui.filter(ft),
             alitms = allpu.filter(ft),
             adj = Adjst.filter(ft),
             sale = sales.filter(ft)
        return {
            id:b,
            name:pui.filter(ft)[0]?.supplier,
            
            tha:itm.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
            malipo:pay.filter(ft).reduce((a,b)=> a + Number(b.ilolipwa),0), 

            shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
          

            sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
            saletha:sale.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),

            uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
          
            matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
            upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
         
            
       
           
        }
    }


    if(LoC){

        //Draw new Chart................................................................................................................./
        let title = `<h6 class="py-2 " >${lang(`Takwimu ya Manunuzi na mwenendo wa kila Msambazaji `,`Purchases and Trends Statistics by each Vendor `)}, ${duraTitle}<h6/>`
        $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

               
        var canvas = document.getElementById('myChartC');
        var ctx = canvas.getContext('2d');
        var data= {
            labels: Vendor.map(b=>b.name),
            datasets: [{
                label:lang("Manunuzi","Purchases"),
                fill: true,
                lineTension: 0,
                backgroundColor: "#1a8cff",
                borderColor: "#1a8cff", // The main line color
                
                // notice the gap in the data and the spanGaps: true
                data: Vendor.map(a=>a.tha),
                spanGaps: true,
                }
                ,{
                    label: lang("Matumizi","Usage"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "#BF2B2B",
                    borderColor: "#BF2B2B", // The main line color
                
                    // notice the gap in the data and the spanGaps: false
                    data:Vendor.map(a=>Number(a.matumizi).toFixed(FIXED_VALUE)),
                    spanGaps: false,
                }
                ,{
                    label: lang("Upotevu/Uharibifu","Wastage/Damage"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "#336699",
                    borderColor: "#336699", // The main line color
                
                    // notice the gap in the data and the spanGaps: false
                    data:Vendor.map(a=>Number(a.upotevu).toFixed(FIXED_VALUE)),
                    spanGaps: false,
                }
               ,{
                    label: lang("Mauzo","Sales"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "darkgreen",
                    borderColor: "darkgreen", // The main line color
                
                    // notice the gap in the data and the spanGaps: false
                    data:Vendor.map(a=>Number(a.sale).toFixed(FIXED_VALUE)),
                    spanGaps: false,
                }
               ,{
                    label: lang("Zilizopo","Onhelf"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "green",
                    borderColor: "green", // The main line color
                
                    // notice the gap in the data and the spanGaps: false
                    data:Vendor.map(a=>Number(a.shelf).toFixed(FIXED_VALUE)),
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
                   data:Vendor.map(a=>Number(a.uzalishaji).toFixed(FIXED_VALUE)),
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
                            labelString:lang('Wasambazaji','Vendors'),
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
        td=`<table id="SoldItems" class="table table-bordered table-hover smallFont" style="width:100%">
            <thead>
                <tr class="smallFont ">
                    <th rowspan=3 >#</th>
                    <th rowspan=3  >${lang('Msambazaji','Vendor')}</th>
                    <th rowspan=3 >  ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                    <tr>
                        <th colspan=2 class="kuhamishwa" > ${lang('Malipo','Payments')}  </th>
                        <th colspan=2 class="usage"> ${lang('Matumizi','Usage')}  </th>
                        <th colspan=2 class="wastes"> ${lang('Uharibifu/Upotevu','Damage/Wastage')}  </th>
                    
                    `
                        if(Uzalishaji){
                            td+=` <th colspan=2 class="production"> ${lang('Uzalishaji','Manufacturing')}</th>`
                        }

                  td+=`
                    <th colspan=2  class="mauzo"> ${lang('Mauzo','Sales')}</th>
                    <th colspan=2  class="zilizopo"> ${lang('Zilizopo','OnShelf')}</th>
                    </tr>

                    <tr class="smallerFont" >
                       <th class="kuhamishwa">${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span></th>
                       <th class="kuhamishwa">%</th>

                       <th class="usage">${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span></th>
                       <th class="usage">%</th>

                       <th class="wastes">${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span></th>
                       <th class="wastes">%</th>`
                       
                     if(Uzalishaji){
                            td+=` <th class="production">${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span></th>
                            <th class="production">%</th>`
                     }

                      td+= `<th class="mauzo">${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span></th>
                       <th class="mauzo">%</th>

                       <th class="zilizopo" >${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span></th>
                       <th class="zilizopo">%</th>

                    </tr>
                </tr>
             </thead>
            <tbody id="products_list">`,
            num = 0
            Vendor.forEach(a=>{
                num+=1
                td+=`
                <tr class="weigth500" >
                        <td>${num}</td>
                        
                        <td class="text-capitalize" >${a.name}</td>
                    
                        <td>${floatValue(a.tha)}</td>


                        <td class="kuhamishwa">${floatValue(a.malipo)}</td>
                        <td class="kuhamishwa">${floatValue(a.malipo*100/a.tha)}%</td>

                        <td class="usage">${floatValue(a.matumizi)}</td>
                        <td class="usage">${floatValue(a.matumizi*100/a.tha)}%</td>

                        <td class="wastes">${floatValue(a.upotevu)}</td>
                        <td class="wastes">${floatValue(a.upotevu*100/a.tha)}%</td>
                        
                        
                        `
                    if(Uzalishaji){
                        td+=`
                        <td class="production">${floatValue(a.uzalishaji)}</td>
                        <td class="production">${floatValue(a.uzalishaji*100/a.tha)}%</td>

                        
                        `
                    }          
                        

                        td+=`
                            <td  class="mauzo">${floatValue(a.sale)}</td>
                            <td  class="mauzo">${floatValue(a.saletha*100/a.tha)}% </td>

                            <td  class="zilizopo">${floatValue(a.shelf)}</td>
                            <td  class="zilizopo">${floatValue(a.shelf*100/a.tha)}%</td>
                            

                </tr>
                `
                    })

        td+=`</tbody>
        </table>
`   
let title = `<h6 class="py-2 " >${lang(`Orodha ya Manunuzi na Mwenendo wa kila Msambazaji`,`Purchases and Trend List on each Vendor  `)}, ${duraTitle}<h6/>`
            $('#theDataPanel').html(title+td)
            $('#SoldItems').DataTable();
    }

}



$('body').on('click','.riportOn',function(){
    $('.riportOn').addClass('btn-light')
    $(this).removeClass('btn-light')
    $(this).addClass('btn-primary')
    $('.riportOn').data('riport',Number($(this).data('r')))
    AddRow()
})


$('body').on('click','.riportListChatOn',function(){
    $('.riportListChatOn').addClass('btn-light')
    $('.riportListChatOn').data('riport',Number($(this).data('r')))
    $(this).removeClass('btn-light')
    $(this).addClass('btn-secondary')

    let val = Number($('#itmTitle').data('val'))||0,id=Number($('#itmTitle').data('itm'))||0,num=Number($('#itmTitle').data('num'))||0
    
    
    if(val===0){
       AddRow()
    }else{
        switch (num) {
            case 1:
                  viewItembByBranch({val,id})
                break;
        }
    }
   
    
    
})


//SHOW SALES ON ITEM BY BRANCH.....................//
$('body').on('click','.checkByBranch',function(){
    let val= Number($(this).data('val')),id= Number($(this).data('itm')),num=Number($(this).data('num'))
    switch (num) {
        case 1:
            viewItembByBranch({val,id})
            break;
        case 2:
            viewCategoryByBranch({val,id})
           break;
        case 3:
            viewGroupByBranch({val,id})
           break;
    
       
    }
    
})


//SHOW BILLS.................................//
$('body').on('click','.checkInvo',function(){
    viewList({from:$(this).data('from'),to:$(this).data('to')})
})


//SHOW BIL.................................//
$('body').on('click','.viewBill',function(){
    showBill({bil:$(this).data('val'),from:$(this).data('from'),to:$(this).data('to')})
})

//SHOW BIL WHILE ON BILI VIEW .................................//
$('body').on('click','.viewBill2',function(){
     $('#the_billed').html(theBilled({bil:$(this).data('val'),from:$(this).data('from'),to:$(this).data('to')})) 
     $(this).parent('li').siblings('li').removeClass('activeList')
     $(this).parent('li').addClass('activeList')

     placedataPanel = $('#billedItms')

    if(window.outerWidth<=800){
        $('#listin').hide(200)
    }
})



function viewList(muda){
    

    const val = $('#riporttitle').data('val'),
          dt =  theData.state.filter(i=>i.id===val)
    if(dt.length>0){
         const ftt = i=>  moment(i.tarehe).startOf('day').format() >= moment(muda.from).startOf('day').format()&& moment(i.tarehe).endOf('day').format() <= moment(muda.to).endOf('day').format() ,
          theDT = dt[0],
          vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),
          Tawi = branch(),NaV = byVendor(),

          br  = d=>Number(d.duka)===Tawi && Number(d.shop)===Tawi, nbr=d=>Number(d.shop)!=Tawi && Number(d.duka)===Tawi,
          wheNoV = v=>v.vendor>=0, whenV= v => v.vendor===NaV,
          ByVn = NaV==0?wheNoV:whenV, 

          Purchases= {this:theDT.dtP.filter(br).filter(r=>Number(r.rudi)!=Number(r.bqty)).filter(ByVn),other:theDT.dtP.filter(nbr).filter(r=>Number(r.rudi)!=Number(r.bqty)).filter(ByVn)},                    
          Sales = {this:theDT.dtS.filter(br).filter(ByVn),other:theDT.dtS.filter(nbr).filter(ByVn)},
          other_cost = {this:theDT.dtC.filter(br).filter(ByVn),other:theDT.dtC.filter(nbr).filter(ByVn)},
          adjst = {this:theDT.dtAdj.filter(br).filter(ByVn),other:theDT.dtAdj.filter(nbr).filter(ByVn)},
          transfer = {this:theDT.dtTr.filter(br).filter(ByVn),other:theDT.dtTr.filter(nbr).filter(ByVn)},

         
          
          pua =Purchases.this.filter(ftt),
          

          pui = pua.filter(h=>h.uhamisho_id===null),

        

          allpu = [...Purchases.this,...Purchases.other],
          bil = [...new Set(pui.map(b=>b.bili))],
          Adjst = [...adjst.this,...adjst.other],
          sales = [...Sales.this,...Sales.other],
          cost = [...other_cost.this,...other_cost.other],
           

          billsii = bil.map(b=>{
            let  ft=i=>i.bili === b ,
            itm = pui.filter(ft),
            alitms = allpu.filter(ft),
            adj = Adjst.filter(ft),
            sale = sales.filter(ft),

            tha = itm.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
            costed = cost.filter(ft),
            costi = costed.reduce((a,b)=> a + Number(b.kiasi),0)

          
        MARKED = theDT.mark  //this varible is a recognition of marked bill list  to  iew bill list

        return {
           id:b,
           code:itm.filter(i=>i.bili===b)[0]?.code,
           tarehe:itm.filter(i=>i.bili===b)[0]?.date,
           supplier:itm.filter(i=>i.bili===b)[0]?.supplier,
           ilolipwa:itm.filter(i=>i.bili===b)[0]?.paid,
           
           tha:tha+costi,
           costi:costi,
           shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
         

           sale:sale.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
           saleV:sale.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),

           uzalishaji:adj.filter(pr=>pr.mfg).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
         
           matumizi:adj.filter(u=>!u.Ongeza&&u.mfg===null&&u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
           upotevu:adj.filter(u=>!u.Ongeza&&u.mfg===null&&!u.tumika).reduce((a,b)=> a + (b.tha*(b.qty)/b.uwiano),0),
        
           allpu:alitms,
           pui:itm,
           adj:adj,
           cost:costed,
           sold:sale

           
      
          
       }
          })


     let     tr = `<table id="table-Invoices" class="table table-bordered smallFont" style="width:100%">
                   <thead>
                        <tr class="smallerFont ">
                            
                            <th>#</th>
                            
                            <th> ${lang('Bili','Bill')}</th>
                            <th> ${lang('Tarehe','Date')}</th>
                            <th> ${lang('Kutoka','From')}</th>
                            <th> ${lang('Thamani','Worth')}<span class="text-primary latoFont">(${currencii})</span></th> 
                            <th> ${lang('Ilolipwa','Paid')}<span class="text-primary latoFont">(${currencii})</span></th> 

                            <th> ${lang('Matumizi','Usage')}<span class="text-primary latoFont">(${currencii})</span></th> 
                            <th> ${lang('Uharibifu/Upotevu','Damage/Wastage')}<span class="text-primary latoFont">(${currencii})</span></th> 
                           
                            `
                            
                            if(Uzalishaji){
                                tr+=`<th> ${lang('Uzalishaji','Manufacturing')} <span class="text-primary latoFont">(${currencii})</span> </th>`
                            }      
     
                           tr+=`<th> ${lang('Mauzo','Sales')}<span class="text-primary latoFont">(${currencii})</span></th> 
                                <th> ${lang('Zilizopo','OnShelf')}<span class="text-primary latoFont">(${currencii})</span></th>
                                <th>Action</th>
                        </tr>
                    </thead></tbody>`,n=0

                bilList.state = billsii   
        

                billsii.forEach(a=>{
                    n+=1
                   
                         
                    tr+= `<tr> 
                      <td>${n}</td>
                      <td>BILL-${a.code}</td>
                      <td>${moment(a.tarehe).format('DD-MM-YYYY')}</td>
                      <td class="text-capitalize" >${a.supplier}</td>

                      <td  >${floatValue(a.tha)}</td>
                      <td class="${Number(a.tha)>Number(a.ilolipwa)?'text-danger weight600':''}" >${floatValue(a.ilolipwa)}</td>

                      <td  >${floatValue(a.matumizi)}</td>
                      <td  >${floatValue(a.upotevu)}</td>

                   
                      `
                            if(Uzalishaji){
                                tr+=`<td>${floatValue(a.uzalishaji)}</td>`
                            }      
     
                           tr+=`

                       <td class="brown">${floatValue(a.sale)}</td>

                       <td class="brown">${floatValue(a.shelf)}</td>
                    
                       <td>
                        <button type="button" data-val=${a.id} data-from="${muda.from}" data-to="${muda.to}" class="btn btn-sm border0 viewBill smallerFont btn-light" title="${lang('Onesha Bili','View Bill')}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z">
                                </path><circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                     </td>
                      </tr>
                    ` 
                })   

                
                tr+=`</tbody></table>`

                let d1= moment(muda.from).format('YYYY-MM-DD'),
                    d2=moment(muda.to).format('YYYY-MM-DD'),
                    dur = d2>d1?moment(d2).format('MMMM, YYYY'):moment(d2).format('DD/MM/YYYY')


                    title = `<h6 class="py-2 " >${lang(`Orodha ya Bili za Manunuzi ${theDT.mark?' Zilizowekwa alama':''}`,`${theDT.mark?'Marked':''} Purchases Bills List on`)},<span class="darkblue"> ${dur}</span><h6/>`
  
                $('#theDataPanel').html(title+tr)
                $('#table-Invoices').DataTable();

                $('.riportOn').addClass('btn-light')
                $('.riportOn').removeClass('btn-primary')



        }    
}


function viewItembByBranch(vl){
  
    const {id,val} = vl,Wvat=withVat(),Na=ByU(),
        dt =  theData.state.filter(i=>i.id===val),  theDT = dt[0],
        n = Number($('#riportSwitch .btn-primary').data('riport')),
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),

        Df = i=>i.bidhaa_id==id,  Lf = i=>i.online,Tawi =branch(),
        idt = bidhaaState.state.find(bs=>bs.id===id),






       Purchases= theDT.dtP.filter(Df).filter(r=>Number(r.rudi)!=Number(r.bqty)),                    
       Sales = theDT.dtS.filter(Df),
       other_cost = theDT.dtC.filter(Df),
       adjst = theDT.dtAdj.filter(Df),
       transfer = theDT.dtTr.filter(Df),
      
       pu =Purchases,
       itms =Purchases,
       tw =[...new Set(itms.map(m=>m.shop))], 
       matawi = tw.map(t=>formT(t))


   
       
   


        function formT(t){
            const ft=d=>d.shop==t,
                    itmz = itms.filter(ft),
                    pui =  itms.filter(d=>d.duka===t && d.uhamisho_id===null),
                  
                    alitms = itms.filter(ft),
                    adj = adjst.filter(ft),
                    sale = Sales.filter(ft),
                    tr_to = transfer.filter(to=>to.kwenda_duka===t),
                    tr_fro = transfer.filter(ft),

                    bei = [... new Set(itmz.map(t=>t.Bei_kununua/t.uwiano))],
                    beiAv = bei.reduce((a,b)=> a + Number(b),0)/bei.length 

            return {
                id:t,
                duka:itmz[0]?.duka,
                shop:itmz[0]?.shop,

                name:itmz[0]?.shopN,
               
    
                vat:Number(itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
               
                    
                tha:pui.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.bqty-b.rudi)/b.uwiano),0),
                idadi:pui.reduce((a,b)=> a + Number((b.bqty-b.rudi)),0),

                shelf:alitms.reduce((a,b)=> a + (Number(b.Bei_kununua)*(b.idadi)/b.uwiano),0),
                shelfqty:alitms.reduce((a,b)=> a + Number((b.idadi)),0),

                rc:tr_to.reduce((a,b)=> a + Number((b.idadi)),0),
                tr:tr_fro.reduce((a,b)=> a + Number((b.idadi)),0),
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
                        <th>${lang('Thamani Jumla','Net Worth')}(<span class="text-primary weight400 smallerFont">${currencii}</span>)</th>
                    </tr>    
                        <tbody class="cursor-pointer p-3" >
                      
                        
                                    <tr  class="cursor-pointer manunuzi weight600 ">    
                                        <td class="">${lang('Manunuzi','Purchases')}</td>
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
          let td=  `<table id="SoldItems" class="table table-sm table-bordered table-hover   smallFont" style="width:100%">
             <thead>
            <tr class="smallFont latoFont">
                <th rowspan=3 >#</th>

                <th rowspan=3 >${lang('Tawi','Branch')}</th>

                
                
                <th rowspan=3 >${lang('vipimo','Units')}</th>

                <th rowspan=3 >${lang('Bei','Price')}</th>
                
                <tr class="smallFont latoFont">
                    <th class="manunuzi" colspan=2 >${lang('Manunuzi','Purchases')}</th>

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
                   <th class="manunuzi"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                
                   <th class="kupokewa"> ${lang('Idadi','Quantity')} </th>
                   <th class="kupokewa"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                
                   <th class="kuongezwa"> ${lang('Idadi','Quantity')} </th>
                   <th class="kuongezwa"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                
                   <th class="kuhamishwa"> ${lang('Idadi','Quantity')} </th>
                   <th class="kuhamishwa"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                   <th class="usage"> ${lang('Idadi','Quantity')} </th>
                   <th class="usage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                   <th class="wastes"> ${lang('Idadi','Quantity')} </th>
                   <th class="wastes"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
`            

 
                if(Uzalishaji){
                    td+=`
                        <th class="production"> ${lang('Idadi','Quantity')} </th>
                        <th class="production"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                         `
                    }
                  

                td+= `<th class="mauzo"> ${lang('Idadi','Quantity')} </th>
                      <th class="mauzo"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                      <th class="zilizopo"> ${lang('Idadi','Quantity')} </th>
                      <th class="zilizopo"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
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
`   
     
    
    placedataPanel.html(td)
    $('#SoldItems').DataTable();
        }
    
        
     
        placedataPanel.prepend(`<h6 id="itmTitle" class="py-3" data-itm=${id} data-val=${val} data-num=1 >${lang('Manunuzi na Mwenendo kwa','Purchase and trends for')} <i class="darkblue text-capitalize">${itms[0].bidhaaN}</i>  ${lang('Kwa kila Tawi','In each branch')}</h6> ${summary()}`)

        $('.riportOn').addClass('btn-light')
        $('.riportOn').removeClass('btn-primary')


}


function showBill(bil){

         
      const bil_id = bil.bil
      // billl =  billData.state.filter(n=>n.id===bil_id)
     let  header = `<div class="d-md-none text-right d-block"> 
                   <button class="btn btn-light" onclick="$('#listin').toggle(400)" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                        </svg>
                   </button>                                
             </div>`
    ,




         showbill = `<div class="d-block ">
                        ${header}

                        <div class="row ">

                            <div class="col-md-3 ">
                               <h6>${lang('Bili','Bills')}</h6>
                               <div class="listin " id="listin" style="height:100vh;">
                                   <ul class="list-unstyled Fixed_div"  >
                                      ${bills({bil:bil.bil,from:bil.from,to:bil.to})}
                                   </ul>
                                </div>   
                            </div>


                            <div class="col-md-9 ">
                            
                               

                                 <div id="the_billed" class="p-md-3 p-1 "  >
                                    ${theBilled(bil)}
                                 </div>
                            </div>

                           
                         </div>

                    </div>`


                    let d1= moment(bil.from).format('YYYY-MM-DD'),
                    d2=moment(bil.to).format('YYYY-MM-DD'),
                    dur = d2>d1?moment(d2).format('MMMM, YYYY'):moment(d2).format('DD/MM/YYYY')



                
                    title = `<h6 class="py-2 " >${lang(`Onesha Bili za Manunuzi ${MARKED?' Zilizowekwa Alama':''}`,`View ${MARKED?' Marked':''} Purchase Bills on`)},<span class="darkblue"> ${dur}</span><h6/>`
                    $('#theDataPanel').html(title+showbill)

                    placedataPanel = $('#billedItms')

                   

                  



}


const bills = (bil) =>{
    let bil_id = bil.bil,
        muda = {from:bil.from,to:bil.to}      
           li=``
        

           bilList.state.forEach(b=>{
                 li+=`<li class="p-2  border-bottom  ${Number(b.id)==Number(bil_id)?'activeList':''} "  >

                        <a class="row px-0 smallerFont text-decoration-none  viewBill2" data-val=${b.id} data-from="${muda.from}" data-to="${muda.to}" style="color: rgb(51, 51, 51);" type="button" >
                            <div class="col-6 mx-0">
                                 <strong class="text-capitalize" >${b.supplier}</strong> 
                            </div>
                            <div class="col-6 mx-0 text-right">
                                <span class="text-primary smallerFont text-capitalize">${currencii}</span>.   <span class="smallFont weight600">${floatValue(b.tha)}</strong> 
                            </div>

                            <div class="col-7 mx-0 latoFont  pt-0">
                                <span class="text-primary btn btn-default btn-sm smallFont px-0 latoFont">BIL-${b.code}</span> | ${moment(b.tarehe).format('DD/MM/YYYY')}
                            </div>

                            <div class="col-5 mx-0 text-right pt-1">

                                    <span class="py-1 px-0 btn btn-sm  btn-default smallFont brown weight400  latoFont"  >
                                        <span class="smallerFont text-primary" >${currencii}</span>. ${floatValue(b.shelf)}
                                    </span>

                            </div>

                          </a>  


              </li>`
           })


           return li


}



function theBilled(bil){
    
     const    bili=billData.state.find(b=>b.id === bil.bil)
            //
     

         if(bili){

            const  {itms_C:puColor,itms_S:puSize,adjst_C,adjst_S,stock_C,stock_S,id,sale_S,sale_C} = bili,
                 {allpu,pui,costi,sold,cost,adj,tha,upotevu,uzalishaji,sale,matumizi,shelf,saleV,ilolipwa}  = bilList.state.find(b=>b.id==id),
                 
                 bd = [... new Set(pui.map(i=>i.bidhaa_id))],

                 brnch = [...new Set(allpu.map(br=>br.shop))],
                 Brnch = brnch.length > 1,
               
                 itms = bd?.map(i=>{
                        const ft=bn=>bn.bidhaa_id === i,
                                itm = pui.filter(ft),
                                alitms = allpu.filter(ft),
                                adji = adj.filter(ft),
                                bei = [... new Set(itm.map(t=>t.Bei_kununua/t.uwiano))],
                                beiAv = bei.reduce((a,b)=> a + Number(b),0)/bei.length 
                    return {
                        name:itm[0].bidhaaN,

                        id:i,

                        bqty:itm.filter(h=>h.uhamisho_id===null).reduce((a,b)=> a + Number((b.bqty-b.rudi)),0),
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

                        puC:puColor.filter(b=>b.bidhaa_a===i),
                        puS:puSize.filter(b=>b.bidhaa_a===i),

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
                
            
          billTitle = () =>{
        let  billTitle = `
                <h5>BIL-${bili.code}</h5>
                <address>
                <div class="weight600" >${lang('Kutoka','From')}:</div>
                <div class="text-capitalize" >${bili.supplier}</div>
                <div class="text-capitalize" >${bili.address}</div>
                <div> <span class="weight600"> ${lang('Simu 1','Phone 1')}</span>: ${bili.simu1}</div>`
                
            
                
            
                if(bili.simu2){
                    billTitle+= `<div> <span class="weight600"> ${lang('Simu 1','Phone 1')}</span>: ${bili.simu2}</div>`
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
            }   

          trendsT = () =>{           

               let      trendsT = `
                     <div class="table-responsive ">
                     <table id="prod_table" class="table-hover table-bordered table table-sm"  data-row=1>
                     <tr class="bg-light smallerFont ">
                         <th rowspan=3 >#</th>
                         <th rowspan=3  >${lang('Bidhaa','Item')}</th>`
                         
                         if(Brnch){
                             trendsT+=`<th  rowspan=3  > ${lang('Matawi','Branches')} </th>`
                         }
                         

                         if(puColor.length>0){
                             trendsT+=`<th rowspan=3 > ${lang('Rangi','Color')}</th>`
                         }
                        
                        if(puSize.length>0){
                             trendsT+=`<th rowspan=3 > ${lang('Saizi','Size')}</th>`
                        }
                        
                         trendsT+=`<th  rowspan=3  > ${lang('Vipimo','Units')}  </th>
                                   <th  rowspan=3  > ${lang('Bei','Price')} </th>
                                   

                         <tr class="smallerFont latoFont" >
                            <th colspan=2 class="manunuzi" > ${lang('Manunuzi','Purchase')}</th>
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
                         <th class="manunuzi">${lang('Thamani','Worth')}</th>

                         <th class="wastes" >${lang('Idadi','Qty')}</th>
                         <th class="wastes">${lang('Thamani','Worth')}</th>

                         <th class="usage" >${lang('Idadi','Qty')}</th>
                         <th class="usage" >${lang('Thamani','Worth')}</th>`
                         
                            if(Uzalishaji){
                                trendsT+=`<th class="production" >${lang('Idadi','Qty')}</th>
                                        <th class="production">${lang('Thamani','Worth')}</th>`
                                }

                         trendsT+=`<th class="mauzo">${lang('Idadi','Qty')}</th>
                                   <th class="mauzo">${lang('Thamani','Worth')}</th>
                         
                         <th class="zilizopo">${lang('Idadi','Qty')}</th>
                         <th class="zilizopo">${lang('Thamani','Worth')}</th>
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
                                   <tr>
                                        <td ${ss>0?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''}>${n+=1}</td>
                                            <td ${ss>0?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} class="text-capitalize "  > ${it.name} </td>`

                                        
                                      if(Brnch){
                                            trendsT+=` <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} > <button  data-itm="${it.id}" data-val=${VAL}  data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(it.tawi)}</button></td>`
                                        }
                                       
                                       //Check weter itmem a s color .......................................//      
                                       
                                           if(cc>0){ 
                                               
                                               it.puC.forEach(c=>{
                                                   let sz = it.puS.filter(cr=>cr.color_id==c.id),
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
                                              ${row1?'':'<tr>'}
                                                <td ${szl>0?'rowspan='+szll:''} >${cl}</td>`


                                           if(sz.length>0){
                                                //Check for sizes if tere is more than one size te loop through........
                                               
                                                    
                                                   sz.forEach(s => {
                                                     let  wsq = it.wst_S.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                          mfq = it.mfg_S.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                          usq = it.usd_S.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.qty)),0),
                                                          slq = it.saS.filter(z=>z.size_id===s.size_id).reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
                                                          shq = it.shelf_S.filter(z=>z.id===s.size_id).reduce((a,b)=> a + Number((b.idadi)),0)
                                                      
                                                          trendsT+=`${row1?'':'<tr>'}
                                                                 <td style="padding: 10px 3px !important;"><span class="text-danger smallFont"> ${s.size_name}</span></td>
                                                                 <td>${it.kipimo}</td> 
                                                                 <td>${floatValue(it.bei)}</td> 
                                                                

                                                                 <td class="weight600 manunuzi " >${Number(s.idadi).toFixed(FIXED_VALUE)}</td> 
                                                                 <td class="manunuzi">${floatValue(it.bei*s.idadi)}</td> 

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
                                                          shq = it.shelf_C.filter(z=>z.id===c.color_id).reduce((a,b)=> a + Number((b.idadi)),0)
                                                      
                                                              trendsT+=`<td>${it.kipimo}</td> 
                                                                 <td>${floatValue(it.bei)}</td> 
                                                                

                                                                 <td class="weight600 manunuzi" >${Number(c.idadi).toFixed(FIXED_VALUE)}</td> 
                                                                 <td class="manunuzi">${floatValue(it.bei*c.idadi)}</td> 

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
                            }

          summary = () =>{
                 let    summary = `
                    <div class="row mx-0" >
                       <div class ="col-md-5"></div>

                <div class ="col-md-7  mx-0 px-0">
                    <div class=" weight500 mt-2" >${lang('Ufupisho','Summary')}</div>
                   
                    
                    <table class="border   latoFont table table-sm table-hover " >
                        <tbody class="cursor-pointer p-3" >
                       
                       `

                          
                       if(costi>0){

                        summary += `

                           
                                    
                                    
                                    <tr  class="cursor-pointer">  
                                        <td >${lang('Thamani ya Bidhaa','Items Worth')}</td>
                                        <td ></td>
                                        <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(tha-costi)}</span> </td>
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
                                        <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500 brown">${floatValue(tha)}</span> </td>
                                    </tr>  

                                    <tr  class="cursor-pointer"  >    
                                        <td class="">${lang('Malipo ya Bili','Bill Payment')}</td>
                                        <td >${floatValue((ilolipwa*100)/tha)}%</td>
                                        <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500 brown">${floatValue(ilolipwa)}</span> </td>
                                    </tr>  
                                    `
                                    if(tha>ilolipwa){
                                        summary+=`
                                                <tr  class="cursor-pointer"  >    
                                                    <td class="">${lang('Deni','Debt')}</td>
                                                    <td >${floatValue(((tha-ilolipwa)*100)/tha)}%</td>
                                                    <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500 brown">${floatValue(tha-ilolipwa)}</span> </td>
                                                </tr>`  
                                    }
                                    

                                    summary+=`<tr  class="cursor-pointer wastes">
                                        <td class="">${lang('Upotevu/Uharibifu','Wastage/Damage')}</td>
                                        <td >${floatValue(upotevu*100/tha)}%</td>
                                        <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(upotevu)}</span> </td> 
                                    </tr>
                                    <tr  class="cursor-pointer usage">
                                        <td class="">${lang('Kutumika','Usage')}</td>
                                        <td >${floatValue(matumizi*100/tha)}%</td>
                                        <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(matumizi)}</span> </td> 
                                     </tr>   
                                        `
                                        
                              if(Uzalishaji)  {
                                   summary += `
                                         <tr  class="cursor-pointer production">
                                             <td class="">${lang('Uzalishaji','Production')}</td>
                                             <td >${floatValue(uzalishaji*100/tha)}%</td>
                                             <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(uzalishaji)}</span> </td> 
                                          </tr>
                                    `
                              }    
                                
                                 summary += `
                                          <tr  class="cursor-pointer mauzo">
                                             <td class="">${lang('Thamani ya Zilizouzwa','Sold Worth')}</td>
                                             <td >${floatValue(saleV*100/tha)}%</td>
                                             <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(saleV)}</span> </td> 
                                          </tr>

                                          <tr  class="cursor-pointer">
                                             <td class="">${lang('Mauzo Jumla','Total Sales')}</td>
                                             <td ></td>
                                             <td class="text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500">${floatValue(sale)}</span> </td> 
                                          </tr>
                                           
                                           <tr  class="cursor-pointer border-top-danger zilizopo">
                                             <td >${lang('Zilizopo','OnShelf')}</td>
                                             <td >${floatValue(shelf*100/tha)}%</td>
                                             <td class="border-top text-right"><span class="text-primary weight400 smallerFont">${currencii}</span>.<span class="weight500 brown">${floatValue(shelf)}</span> </td> 
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

           markbtn = () =>{
              let   markbtn = `<div class="row smallFont my-2 py-2 border-bottom" >
                <div class="col-9">
                    ${bili.markDesc!=null&&bili.markDesc!=''?'<span class="pl-1" style="border-left:2px solid brown">'+bili.markDesc+'</span>':''}
                     
                </div>
               

                <div  class="col-3 text-right">
                    <button id="markTheBill" data-from="${bil.from}" data-to="${bil.to}" title="${!bili.mark?lang('Weka Alama','Mark Bill'):lang('Ondoa Alama','Unmark Bill')}" data-bil=${bili.id} data-mark=${Number(bili.mark)} data-toggle="modal" data-target="#saveBillMarked" class="smallMadebuttons  p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${bili.mark?'brown':'none'}" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                    </button>
                </div>
            </div>`

            return markbtn
           }         
                
                return `${markbtn()} <div class="Fixed_div pb-5">${billTitle()} <div id="billedItms"> ${trendsT()} ${summary()} </div> </div>`
         
         
            }else{
               loadBill(bil)          
               return lang('Tafadhari Subiri.....','Please Wait ...')
         }



        
        
}



loadBill = (bil)=>{

    $("#loadMe").modal('show');
           let data={
                data:{
                val:bil.bil,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
            },
           url:'/riport/theBill' 
            }, fct = getRiportData(data)

            fct.then(data=>{
                 
                if(data.success){
                  $("#loadMe").modal('hide');
                    billData.state.push(data)
                    showBill(bil)
                }
                
            })
}


//MARK THE BILL .................................//
$('body').on('click','#markTheBill',function(){
    const mark = Number($(this).data('mark')),
          bil = $(this).data('bil'),
          from = $(this).data('from'),
          to = $(this).data('to') 
          
        

        $('#markDesk').prop('hidden',mark)
        $('#bilMark').val(bil)

        $('#bilMark').data({to:to,from:from})

        $('#bilMarked').val(Number(!mark))
        $('#markTite').text(mark?lang('Ondoa Alama kwenye Manunuzi','unMark Bill'):lang('Wekea  Alama Manunuzi','Mark Bill'))
        $('#SubmitMark').text(mark?lang('Ondoa Alama','unMark Bill'):lang('Weka  Alama','Mark Bill'))
   

    
})





