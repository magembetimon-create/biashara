
function getData(){
    
    const saved = Number($('#SavedState').val()),
          shop = Number($('#shopReg').val()),
          mob = Number($('#isMobile').val())

         const data = {
            data:{
                   'svd':saved,
                   'shop':shop
            },
            url:`/riport/PrintItems?mob=${mob}`
            
          },

          itms = getRiportData(data)
        //  console.log(saved)
          itms.then(data=>{

            $('#loadMe').modal('hide')
            $('#loadMe').modal('hide')  

            if(data.success){
                const  {data:shelf,pay,PRODUXN,SERVICE,SALES,SVD,svdDate,svdDesc} = data,theDate = Number(SVD)?moment(svdDate):moment(),
            tite = lang('Hali ya Hesabu Kama Ilivyokuwa ','Inventory State As Of ')+ theDate.format('DD/MM/YYYY HH:mm') +(SVD?`, ${lang('Na Baadaye ', 'And Then ')} ${moment().format('DD/MM/YYYY HH:mm')}`:''),
            desc = `<h6>${lang('Maelekezo','Remarks')}</h6>
                    <div>${svdDesc}</div>
                    `
            

            $('#stateTitle').html(tite)
            $('#Maelekezo').html(SVD?desc:'')

            const InventorySummary = () =>{
              const acc = pay.reduce((a,b)=>a + Number(b.Amount),0),
                    prod = shelf.filter(b=>!b.service&&!b.material).reduce((a,b)=>a + Number(b.Bei_kununua*(SVD?b.sidadi:b.idadi))/Number(b.uwiano),0),
                    material = shelf.filter(b=>b.material).reduce((a,b)=>a + Number(b.Bei_kununua*(SVD?b.sidadi:b.idadi))/Number(b.uwiano),0),
                    assets = shelf.filter(b=>b.service).reduce((a,b)=>a + Number(b.Bei_kununua*(SVD?b.sidadi:b.idadi))/Number(b.uwiano),0),
                    tot = acc + prod + material + assets


                 let tr = `
                        <table class="table  table-hover table-striped latoFont table-sm border">
                        <thead>
                            <tr>
                                <th>${lang('Hesabu','Inventory')}</th>
                                <th>%</th>
                                <th>${lang('Thamani','Worth')}<span class="text-primary smallerFont">(${currencii})</span> </th>
                                
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>${lang('Akaunti za Malipo','Payment Accounts')}</td>
                                <td>${floatValue(acc*100/tot || 0)}%</td>
                                <td>${floatValue(acc)}</td>
                            </tr>
                            <tr>
                                <td>${lang(`Bidhaa${SALES?' za Kuuza':'/Vitu'} `,`Goods${SALES?' For Sales':'/Item(s)'} `)}</td>
                                <td>${floatValue(prod*100/tot || 0)}%</td>
                                <td>${floatValue(prod)}</td>
                            </tr>`

                            if(PRODUXN){
                                 tr+=`<tr>
                                     <td>${lang('Nyezo za Uzalishaji','Production Materials')}</td>
                                     <td>${floatValue(material*100/tot || 0)}%</td>
                                     <td>${floatValue(material)}</td>
                                 </tr>`
                            }
                           
                            if(SERVICE){
                                 tr+=`<tr>
                                         <td>${lang('Aseti za Huduma','Services Assets')}</td>
                                         <td>${floatValue(assets*100/tot || 0)}%</td>
                                         <td>${floatValue(assets)}</td>
                                     </tr>`  
                            }
                        

                            tr+=`<tr class="weight600 bg-light">
                                <td>${lang('Jumla','Total')}</td>
                                <td>${tot>0?100:0}%</td>
                                <td>${floatValue(tot)}</td>
                            </tr>

                         
                            </tbody>
                            </table>
                 `   

                 return tr
             }

             $('#InventoryWorth').html(InventorySummary)


             placeAlipia(pay)

             placeItems(data)
            }else{
                $('#loadMe').modal('hide')
                $('#loadMe').modal('hide')   
                $('.classic_div').hide()               
                toastr.error(lang('Hakuna Hesabu iliyopatikana kwa sasa','No  Inventory State Found'), lang('Haikufanikiwa','Error'), {timeOut: 7000});

            }
            

          })

}


function   placeAlipia(pay){


              td=  `<table id="SoldItems" class="table table-bordered table-sm" style="width:100%">
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
      
        tot = `<div class="row"> 
                     <div class="col-7 text-right"  > <strong> ${lang('Jumla','Total')} </strong></div>
                     <div class="col-5 text-right" >  ${currencii}.<strong>${floatValue(pay.reduce((a,b)=>a+Number(b.Amount),0))}</strong></div>
               </div>`

          $('#payAccounts').html(td+tot)
      
  }
 
  function placeItems(data){
       const  {data:shelf,pay,adjst,puC,SVD,puS,prodC,prodS,StoC,svdDate,StoS,adjstS,adjstC,PRODUXN,SERVICES,SALES} = data,
               items = shelf.filter(i=>!i.service && !i.material),color=StoC.filter(i=>!i.service && !i.material),size=StoS.filter(i=>!i.service && !i.material),
               service = shelf.filter(s=>s.service),Scolor=StoC.filter(i=>i.service),Ssize=StoS.filter(i=>i.service),
               material = shelf.filter(m=>m.material),Mcolor=StoC.filter(i=>i.material),Msize=StoS.filter(i=>i.material)

              
              


    const  inventoryTable = (dt)=>{
            const {shefu,colored,sized,item} = dt

    const bidhaa = shefu.map(b=>{
        const  ft=i=>i.bidhaa_id === (SVD?b.sbidhaa_id:b.id),
            adj = adjst.filter(i=>i.prod_id===b.id),
            added = adj.filter(p=>p.Ongeza||p.register).reduce((a,b)=>a+Number(b.qty),0),
            initqty =  SVD?Number(b.sidadi):Number(b.initTr || (b.initPu-b.rudi) || b.initPro || added || 0),
            initialN = b.uhamisho_id!=null?lang('Kupokewa','Received'):b.produced_id!=null?lang('Uzalishaji','Production'):b.manunuzi_id!=null?lang('Manunuzi','Purchases'):lang('Kuongezwa','Added'),
            code = [
                      {
                          active:b.uhamisho_id!=null,
                          code:`RC-${b.TransCode}`,
                          num:1,
                          id:b.TransId,
                          color:StoC.filter(ft).map(c=>{ return {id:c.id,color_id:c.color_id,color_code:c.color_code,color_name:c.color_name,qty:c.qty,idadi:c.idadi,bidhaa_a:c.bidhaa_a}}),
                          size:StoS.filter(ft).map(s=>{return {id:s.id,size_name:s.size_name,bidhaa_a:s.bidhaa_a,qty:s.qty,idadi:s.idadi,color_id:s.color_id}})

                        }
                        ,
                         {
                          active:b.manunuzi_id!=null,
                          code:`BILL-${b.puCode}`,
                          num:2,
                          id:b.puId,
                          color:puC.filter(ft),
                          size:puS.filter(ft),
                        
                        }
                        ,
                         {
                          active:b.produced_id!=null,
                          code:`BATCH-${b.ProdCode}`,
                          num:3,
                          id:b.ProdId,
                          color:prodC.filter(ft),
                          size:prodS.filter(ft),  
                        }
                        ,
                         {
                          active:b.ongezwa_id!=null,
                          code:`ADJ-${b.addCode}`,
                          num:4,
                          id:b.addId,
                          color:adjstC.filter(ft),
                          size:adjstS.filter(ft)
                        
                        }
                        ],
                 
      activeCode =  code.filter(n=>n.active)[0]     

   

   return {
       id:b.id,
       name:b.bidhaaN,
       bidhaa:b.bidhaa_id,
       namba:b.namba || lang('Hakuna','None') ,
       Id:activeCode?.id,
      
       intitDate:b.initTrDate || b.initProDate || b.initPuDate || b.initAddedDate,
       initialN:initialN,
       code:activeCode,

       tha:Number(initqty*Number(b.Bei_kununua/b.uwiano)),
       thaSale:Number(initqty*Number(b.sale)),
       idadi:initqty,
       bqty:initqty,

       shelf:Number(b.Bei_kununua*b.idadi/b.uwiano),
       shelfSale:Number(b.sale*b.idadi),
       shelfqty:Number(b.idadi),
       

       added:adj.filter(pr=>pr.Ongeza).reduce((a,b)=> a + Number((b.qty)),0),
       addedDt:adj.filter(pr=>pr.Ongeza),

       puC:SVD?StoC.filter(ft).map(c=>{ return {id:c.id,color_id:c.color_id,color_code:c.color_code,color_name:c.color_name,qty:c.qty,idadi:c.idadi,bidhaa_a:c.bidhaa_a}}):activeCode?.color || [],
       puS:SVD?StoS.filter(ft).map(s=>{return {id:s.id,size_name:s.size_name,bidhaa_a:s.bidhaa_a,qty:s.qty,idadi:s.idadi,color_id:s.color_id}}):activeCode?.size || [],

       shelf_C:StoC.filter(ft),
       shelf_S:StoS.filter(ft),


       kipimo:b.kipimo,

       
       
       bei:Number(b.Bei_kununua)/Number(b.uwiano)
      
   } 
      })
      


      trendsT =`
         <table id="prod_table" class="table-hover table-bordered table table-sm"  data-row=1>
         <tr class="bg-light smallerFont ">
             <th rowspan=3 >#</th>
             <th rowspan=3 >${lang('Namba','Number')}</th>
             <th rowspan=3  >${item}</th>
             <th rowspan=3 >${lang('TareheMuda','DateTime')}</th>
             <th rowspan=3 >${lang('Kutokana','From')}</th>
             <th rowspan=3 >${lang('Kielelezo','Code')}</th>
             `,n=0

             if(colored.length>0){
                 trendsT+=`<th rowspan=3 > ${lang('Rangi','Color')}</th>`
             }
            
            if(sized.length>0){
                 trendsT+=`<th rowspan=3 > ${lang('Saizi','Size')}</th>`
            }
            
             trendsT+=`<th  rowspan=3  > ${lang('Vipimo','Units')}  </th>
                       <th  rowspan=3  > ${lang('Thamani/Kipimo','Worth/Unit')} ${CURRENCII} </th>
                       

             <tr class="smallerFont latoFont" >
                <th colspan=2 class="manunuzi" > ${SVD?lang('Ilivyokuwa ','Then ')+moment(svdDate).format('DD/MM/YYYY HH:mm'):lang('Awali','Initial')}</th>
       
                <th colspan=2 class="zilizopo">${SVD?lang('Baada ','After ')+moment().format('DD/MM/YYYY HH:mm'):lang('Kwa wakati','At Moment')}</th>
             </tr>   

             <tr class="smallerFont latoFont">

             <th class="manunuzi">${lang('Idadi','Qty')}</th>
             <th class="manunuzi">${lang('Thamani','Worth')} (${CURRENCII}) </th>

             
             <th class="zilizopo">${lang('Idadi','Qty')}</th>
             <th class="zilizopo">${lang('Thamani','Worth')} ${CURRENCII}</th>
             </tr>                      
         </tr>

        <tbody class="smallFont" id="view-invo_tbody">
      `

      bidhaa.forEach(it=>{
        let ss= it.puS.length,
            cc  = it.puC.length,
            // AllSizeColor  =  [...new Set(it.puS.map(clr=>clr.color_id))].length

            rcc = cc+1 ,
            rss = ss + 1 + rcc - 1

            rss=ss == 1 && cc == 1?0:rss

            row1 = (ss==1 && cc == 1) || (cc==1 && ss==0)
            

          
        trendsT+=`
        
       <tr>
            <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''}>${n+=1}</td>
            <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''}>${it.namba}</td>
            <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} class="text-capitalize "  > ${it.name}</td>
            <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} class="text-capitalize noWordCut" >${moment(it.intitDate).format('DD/MM/YYYY HH:mm')}</td>
            <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} class="brown" >${it.initialN}</td>
            <td ${ss>1?'rowspan='+(Number(rss)):cc>1?'rowspan='+rcc:''} class="darkblue noWordCut" >${it.code?.code}</td>

            `

            
          
          
           
           //Check weter itmem a s color .......................................//      
           
               if(cc>0){ 
                   
                   it.puC.forEach(c=>{
                       const sz = it.puS.filter(cr=>cr.color_id==(SVD?c.color_id:c.id)),
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
                  ${row1?'':`<tr>`}
                    <td ${szl>0?'rowspan='+szll:''} >${cl}</td>`


               if(sz.length>0){
                    //Check for sizes if tere is more than one size te loop through........
                   
                        
                       sz.forEach(s => {
                         let 
                              shq = it.shelf_S.filter(z=>(SVD||it.code.num==1?z.id===s.id:z.size_id===s.size_id)).reduce((a,b)=> a + Number((b.idadi)),0)
                          
                              trendsT+=`${row1?'':`<tr >`}
                                     <td style="padding: 10px 3px !important;"><span class="text-danger smallFont"> ${s.size_name}</span></td>
                                     <td>${it.kipimo}</td> 
                                     <td>${floatValue(it.bei)}</td> 
                                    

                                     <td class="weight600 manunuzi " >${Number((!(SVD||it.code.num)==1?s.qty:s.idadi)).toFixed(FIXED_VALUE)}</td> 
                                     <td class="manunuzi">${floatValue(it.bei*Number(!(SVD||it.code.num)==1?s.qty:s.idadi))}</td> 

                                    <td class="weight600 zilizopo">${Number(shq).toFixed(FIXED_VALUE)}</td> 
                                    <td class="zilizopo">${floatValue(it.bei*shq)}</td>   


                                    ${row1?'':'</tr>'}`
                      
                      
                        });
                                           
                    
                   
                  
                     
                     
               }else{

                   if(sized.length>0){
                     trendsT+=`<td>---</td>`   
                   }
                             let 
                              shq = it.shelf_C.filter(z=>((SVD||it.code.num==1?z.color_id:z.id)===c.color_id)).reduce((a,b)=> a + Number((b.idadi)),0)
                          
                                  trendsT+=`<td>${it.kipimo}</td> 
                                     <td>${floatValue(it.bei)}</td> 
                                    

                                     <td class="weight600 manunuzi" >${Number((!(SVD||it.code.num)==1?c.qty:c.idadi)).toFixed(FIXED_VALUE)}</td> 
                                     <td class="manunuzi">${floatValue(it.bei*Number(!(SVD||it.code.num)==1?c.qty:c.idadi))}</td> 

                                    

                                        <td class="weight600 zilizopo">${Number(shq).toFixed(FIXED_VALUE)}</td> 
                                        <td class="zilizopo">${floatValue(it.bei*shq)}</td>
                                        ${row1?'':'</tr>'}
                                        `
               }

                })

                

               
            }else{

                if(colored.length>0){
                   trendsT+=`<td >---</td>`
               }

                if(sized.length>0){
                   trendsT+=`<td >---</td>`
               }

                              trendsT+=`<td>${it.kipimo}</td> 
                                     <td>${floatValue(it.bei)}</td> 
                                     

                                     <td class="weight600 manunuzi" >${Number(it.bqty).toFixed(FIXED_VALUE)}</td> 
                                     <td class="manunuzi" >${floatValue(it.bei*it.bqty)}</td> 

                                    

                                    <td class="weight600 zilizopo">${Number(it.shelfqty).toFixed(FIXED_VALUE)}</td> 
                                    <td class="zilizopo" >${floatValue(it.shelf)}</td>`


           }
          
        
         trendsT+=`</tr>`
    })

    trendsT+=`</table></table>`

    trendsT += `<div class="row"> 
    <div class="col-7 text-right"  > <strong> ${lang('Thamani ya zilizopo Jumla','Onshelf Net Worth')} </strong></div>
    <div class="col-5 text-right" >  ${currencii}.<strong>${floatValue(shefu.reduce((a,b)=>a+Number((SVD?b.sidadi:b.idadi) * b.Bei_kununua/b.uwiano),0))}</strong></div>
</div>`
       return trendsT
               },
               
        salesDt = () =>{
           const  sale =`
                <div class="classic_div py-2">
                <h6>
                    ${lang('Bidhaa/Vitu zilizopo/vilivyopo','Available Items')}
        
                </h6>
        
                <div id="payAccounts">
                     ${inventoryTable({shefu:items,colored:color,sized:size,item:lang('Bidhaa','Item')})}
                </div>
              </div>
        
                `

                return  sale
        },
        materialDt = () =>{
           const  theMaterial =`
                <div class="classic_div py-2">
                <h6>
                    ${lang('Nyenzo za Uchakataji/Uzalishaji bidhaa','Available Material Items')}
        
                </h6>
        
                <div id="payAccounts">
                     ${inventoryTable({shefu:material,colored:Mcolor,sized:Msize,item:lang('Nyenzo','Material')})}
                </div>
              </div>
        
                `

                return  material.length>0?theMaterial:''
        },
        serviceDt = () =>{
           const  Assets =`
                <div class="classic_div py-2">
                <h6>
                    ${lang('Asseti kwa Huduma','Services Assets')}
        
                </h6>
        
                <div id="payAccounts">
                     ${inventoryTable({shefu:service,colored:Scolor,sized:Ssize,item:lang('Aseti','Assets')})}
                </div>
              </div>
        
                `

                return  service.length>0?Assets:''
        }
      
        


        $('#AllItems').html(salesDt() + materialDt() + serviceDt() )

         setTimeout(function(){window.print();}, 200)
  }


getData()

function getRiportData(data){

  $("#loadMe").modal(`${window.outerWidth>800?'show':'hide'}`);
    return   $.ajax({
                 type: "GET",
                 url: data.url,
                 data: data.data,
               
       })
       
 }

 window.onafterprint = function(e){
    closeMe()

}

function closeMe()
  {
      
      window.opener = self;
      try{
          if(window.outerWidth>800){
            setTimeout(function(){window.close();}, 100)
            
         }else{
             window.open()
             
             setTimeout(function(){window.close();}, 5000)
         }
         }catch(err){
          alert(err.message)
      }
       
  }
