var bidhaaList
function DuraTable(){
        let dta = {
            data:{ 
                    d:0,
                    r:1,
                    tf:StartDate,
                    tt:moment().format(),
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                },
                url:`/riport/${urli}`}

                $("#loadMe").modal('show');

                let fct = getRiportData(dta)

                 fct.then(function(data){
                    $("#loadMe").modal('hide');

                    let leo = moment().startOf('day').format(),
                        wk = moment().startOf('isoWeek').format(),
                        mth = moment().startOf('month').format()

                        const dy = d=>moment(d.tarehe).format()>=leo,wkf=d=>moment(d.tarehe).format()>=wk,mthf=d=>moment(d.tarehe).format()>=mth
                         
                        theData.state = [{
                                 id:1,
                                 name:lang('Leo','Today'),
                                 from:moment().startOf('day').format(),
                                 To:moment().endOf('day').format(),
                                 txt:`${lang('Leo, Kuanzia<span class="brown">','Today, From<span class="brown">')}(${moment().startOf('day').format('dddd, DD/MM/YYYY HH:mm')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                               
                                 dtI:data.itms.filter(dy), 
                                 dt:data.data.filter(dy), 
                               


                            },
                         { 
                                 id:2,
                                 name:lang('Wiki hii','This Week'),
                                 from:moment().startOf('isoWeek').format(),
                                 To:moment().endOf('isoWeek').format(),
                                 txt:`${lang('Wiki hii,  Kuanzia<span class="brown">','This Week, From<span class="brown">')}(${moment().startOf('isoWeek').format('dddd, DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`,   
                             
                                 dtI:data.itms.filter(wkf),
                                 dt:data.data.filter(wkf),
                            

                        
                            },
                         {       
                                 id:3, 
                                 name:lang('Mwezi huu','This Month'), 
                                 from:moment().startOf('month').format(),
                                 To:moment().endOf('month').format(),
                                 txt:`${lang('Mwezi huu, Kuanzia<span class="brown">','This Month, From<span class="brown">')}(${moment().startOf('month').format('dddd DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                                 
                                 dtI:data.itms.filter(mthf),
                                 dt:data.data.filter(mthf),
                               

                            
                            }]

                            AddRow()
                    
                    
                    


                     
               })

         }


DuraTable()


function createArray(name,from,to){
        const ft =d=>moment(d.tarehe).format()>=from && moment(d.tarehe).format() <= to
                let dtA = [...theData.state,...calendaData].filter(d=>d.from<=from && d.To>=to),Adt={}
                    dtI=[],dt=[],onlineI=[],directI=[],direct=[],online=[],idn = $('#riportData tr').length
 
                

                if(dtA.length>0){
                     Adt = dtA[0]
                     
                     dtI = Adt.dtI?.filter(ft)
                     dt = Adt.dt?.filter(ft)
                    

                     theArr(dtI,dt,name,from,to)
                     

                }else{

                 let dta = {data:{ 
                        d:0,
                        r:1,
                        tf:from,
                        tt:to,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                    },
                    url:`/riport/${urli}`}
                    $("#loadMe").modal('show');
                    let fct = getRiportData(dta)
    
                     fct.then(function(data){
                        $("#loadMe").modal('hide');

                         theArr(data.itms,data.data,name,from,to)

                     })
                        

                }   

                    
               
                 
                 



                }
function theArr(dtI,dt,name,from,to){
  let           
                txt = moment().startOf('year').format() == from && moment().endOf('day').format() == moment(to).endOf('day').format() ? `</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>` : `${lang('Hadi<span class="brown smallerFont">(','To<span class="brown smallerFont">(')} ${moment(to).endOf('day').format('dddd DD/MM/YYYY HH:mm')})</span>`
                 ar= { 
                        id:idn+1, 
                        name:name, 
                        from:from,
                        To:to,
                        txt:`${name},${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(from).startOf('day').format('dddd, DD/MM/YYYY')})</span>, ${txt}`, 
                        dt:dt,
                        dtI:dtI,
               
                    }

                 theData.state.push(ar)
                 AddRow()
}        


function AddRow(){
     let tr='',n=0,chk='',vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0)
        if(theData.state.length>0){        
            theData.state.forEach(td=>{
            const Df = i => !i.online,  Lf = i=>i.online,Na = ByU(),Tawi=branch(),Wvat = withVat(),
                    //  BRANCH SELECTOR FILTER
                       dt= Tawi==0?td.dt:td.dt.filter(d=>d.duka===Tawi),
                       dtI =Tawi==0?td.dtI:td.dtI.filter(d=>d.duka===Tawi),
                       amo = dt.reduce((a,b)=> a + Number(b.kiasi),0),
                       charges = dtI.reduce((a,b)=> a + Number(b.makato),0)


            
               n+=1 
                   
                chk+=` <div class="custom-control smallFont d-inline mx-2 custom-checkbox"  >
                            <input type="checkbox" onchange="$('#dataRow${n}').toggle(100)"  checked name="MonthSale" id="MonthSale${n}" class="custom-control-input" style="cursor: pointer !important;"><label class="custom-control-label" style="cursor: pointer !important;" for="MonthSale${n}">${td.name}</label>
                        </div>`
                let bg=''

                let itms = dtI?.length,
                    invo =  dt?.length
                   

                  if(n>3){
                      bg = 'table-info'
                  }

                tr+=`
                    <tr class="text-center ${bg}" id="dataRow${n}">
                    <td scope="row">
                       <span class="noWordCut"> ${td.name}</span>
                    </td>
                
                    <td class=" weight600">${Number(invo+itms).toLocaleString()}</td>
                    <td class=" weight600">${floatValue(amo+charges)}</td>
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

$('body').on('click','.showDtBtn',function(){
    let val = Number($(this).data('val')) || 0
        placeDt(val)
        $($(this).data('hide')).hide()
        $($(this).data('show')).fadeIn(100)

})


$('body').on('click','.removeTherow',function(){
    let n = $(this).data('val')
    $(`#dataRow${n}`).remove()
    $(`#MonthSale${n}`).parent('div').remove()
    theData.state = theData.state.filter(i=>Number(i.id)!=Number(n))
    
})


function placeDt(val){
        
    $('.riportOn').data('val',val || Number($('#firstR').data('val')))
    let  dt =  theData.state.filter(i=>i.id===val)
              
         if(dt.length>0){
              const  theDT = dt[0],
                  n = Number($('#riportSwitch .btn-primary').data('riport')),
                  vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),


                  Tawi =branch(), Wvat = withVat()
                  //  BRANCH SELECTOR FILTER
                let  ankara= Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)===Tawi),
                     itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)===Tawi),

                  Na = ByU()

                  duraTitle = theDT.txt

                  //Add time to hidden save riport form...........................//
                  $('#fromT').val(moment(theDT.from).startOf('day').format())                    
                  $('#toT').val(moment(theDT.To).endOf('day').format())                    

         
                  // RETURN  OFFICERS ...............//
              let    usrs = [... new Set(ankara.map(b=>b.Na))],
                      userDat = usrs.map(a=> tUser(a,ankara)),
                      opt =  `<option value=0>${lang('Wote','All')}</option>`
                      
                              function tUser(a,r){
                                let  us = r.filter(b=>b.Na === a)[0]
                               
                                  return {
                                      name:us.f_name + ' ' + us.l_name,
                                      id:a
                                  }
                              }

                              if(userDat.length<=1){
                                  opt = `<option value=${userDat[0]?.id||0}>${userDat[0]?.name||lang('Hakuna','None')}</option>`
                                  $('#Waliotumia').addClass('darkblue')
                              }else{
                                  userDat.forEach(us=>{
                                      opt+=`<option value=${us.id}>${us.name}</option>`
                                  })
                                  
                                 
                              }  

                              $('#Waliotumia').html(opt)  

                              if(Na>0||userDat.length<=1){
                                  $('#Waliotumia').addClass('darkblue')
                                  $('#Waliotumia').val(Na>=1?Na:userDat.length<=1?userDat[0]?.id:0) 
                              }else{
                                  $('#Waliotumia').removeClass('darkblue')
                              }

                            

                             ankara = Na==0?ankara:ankara.filter(s=>s.Na===Na)
                             itms = Na==0?itms:itms.filter(s=>s.Na===Na)
                            

                             let itmO = itms ,
                             vAnakara = ankara.map(a=>Varr(a))
                             function  Varr(a){
                                 let itmz =itmO.filter(m=>Number(m.mauzo_id)===a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number(b.idadi*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number(b.idadi*(vatPer(b.vat,b.bei))),0)}
                                 return ar
                             }
                             

                             summaryTable({ankara,itms})


                          switch (Number(n)) {
                              case 1:
                                  placeInvo({ankara,itms,muda:{from:theDT.from,to:theDT.To}})
                                  break;
                              case 2:
                                    placeItems({ankara,itms,val})
                                   
                                 
                                  break;
                            //   case 3:
                            //       if(n==3){
                            //           placeCategory(itms,val)
                            //       }
                            //       break;
                            //   case 4:
                            //       placeGroups(itms,val)
                            //       break;
                              case 5:
                                      placeAlipia({ankara,itms})
                                 
                                  break;
                                  
                              
                          
                          }

                        //   let btn = `  <button title="${lang('Hifadhi Riport','Save Riport')}" class="smallMadebuttons border0 text-primary float-right smallFont " data-toggle="modal" data-target="#saveRiportTime" >
                        //                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
                        //                       <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        //                       </svg>
                                              
                        //                   </button>`

                          $('#riporttitle').html(`${theDT.txt} `) 
                              

                        //   const expenesNote = document.getElementById('expensesNote'),
                        //         // itmsR = document.getElementById('Itemsreturns'),
                        //         // ilolipwa = document.getElementById('returnedAmount'),
                        //         pamo = document.getElementById('ExpensesAmount')
                       


                        //       animateValue(expenesNote, 0, Number(ankara.length).toFixed(FIXED_VALUE), 500);
                        //       animateValue(pamo, 0, Number(amo).toFixed(FIXED_VALUE), 700);
                           
                          
                      
                     // act.fct
  }
}

function summaryTable(dataa){

   
    const {ankara,itms}=dataa,
           charges = itms.reduce((a,b)=> a + Number(b.makato),0),
           amo = Number(ankara.reduce((a,b)=> a + Number(b.kiasi),0)) + Number(charges),
           leng = ankara.length + itms.length,
           adjst = ankara.filter(ad=>ad.adjst_id!=null),
           nonAdjst = ankara.filter(ad=>ad.adjst_id===null && ad.akaunti_id !=null),
           nonAdjstLen = nonAdjst.length + itms.length,
           nonAdjstAmo =Number(nonAdjst.reduce((a,b)=> a + Number(b.kiasi),0)) + Number(charges) ,
           adjstLeng = adjst.length,
           adjstAmo = Number(adjst.reduce((a,b)=> a + Number(b.kiasi),0)),
           
 
        tr = `<tr> 
                 <td>${lang('Ghalama Zilizolipwa','Paid Expenses')}</td>       
                 <td>${floatValue(nonAdjstLen)}</td>       
                 <td>${floatValue(nonAdjstAmo)}</td>       
                 <td>${floatValue(nonAdjstAmo*100/amo)}%</td>       
             </tr>
             <tr> 
                 <td>${lang('Upotevu/Matumizi ya bidhaa ','Item(s) Usage/Wastage')}</td>       
                 <td>${floatValue(adjstLeng)}</td>       
                 <td>${floatValue(adjstAmo)}</td>       
                 <td>${floatValue(adjstAmo*100/amo)}%</td>       
             </tr>
             <tr class="weight600"> 
                 <td>${lang('Jumla ','Total')}</td>       
                 <td>${floatValue(leng)}</td>       
                 <td>${floatValue(amo)}</td>       
                 <td>${floatValue(amo*100/amo)}%</td>       
             </tr>


             `

    $('#summaryTable').html(tr)

}

function placeInvo(itms){

    $('#riportMap').text(lang('Siku','Days'))
    
    const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        {ankara,muda,itms:itmd} = itms,
        dates = [...new Set([...ankara.map(i=>i.date),...itmd.map(i=>moment(i.tarehe).format('YYYY-MM-DD'))])].sort(),
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],

        mAmount= months.map(dt=>monthArr(dt)),
        amounts = dates.map(dt=>chartDt(dt)),
        

        fro = moment(muda.from),
        to   = moment(muda.to),  
        days = Number(to.diff(fro,'days')) + 1  

        
       
       
       

       function monthArr(mth){
           const mthf = l=>Number(moment(l.date).format('YYYYMM'))===Number(mth),
                 itmz = ankara.filter(mthf),
                 charges = itmd.filter(dt=>Number(moment(dt.tarehe).format('YYYYMM'))===Number(mth))
            

           return {
               month:moment(itmz[0]?.date).format('MMMM, YYYY'),
               itms:itmz,
               from:itmz.map(d=>d.date).sort()[0] || charges.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[0],
               to:itmz.map(d=>d.date).sort()[itmz.length - 1] || charges.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[charges.length - 1],
               idadi:itmz.length+charges.length,
               charges:charges,         
               cost:Number(itmz.reduce((a,b)=> a + Number(b.kiasi),0)) + Number(charges.reduce((a,b)=> a + Number(b.makato),0)) ,
            
           }
       }


       



          function chartDt(dt){
             const itmz = ankara.filter(i=>i.date===dt),
                   charges = itmd.filter(i=>moment(i.tarehe).format('YYYY-MM-DD')===dt) 
                   
                 

               return { 
                        date:dt,
                       
                        itms:itmz,
                        from:itmz.map(d=>d.date).sort()[0] || moment(charges[0]?.tarehe).format('YYYY-MM-DD'),
                        to:itmz.map(d=>d.date).sort()[itmz.length - 1] || charges.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[charges.length - 1],
                        idadi:itmz.length + charges.length,
                        charges:charges,  
                        cost:Number(itmz.reduce((a,b)=> a + Number(b.kiasi),0))+ Number(charges.reduce((a,b)=> a + Number(b.makato),0)),
                     }
          }  



       

   //    
   $('#howMany').text(`${dates.length}/${days}`)
   bidhaaList = days<=31?amounts:mAmount

    if(LoC){

               //Draw new Chart................................................................................................................./
               let title = `<h6 class="py-2" >${lang(`Takwimu za Ghalama za Uendeshaji kwa kila `,`Management Expenses Statistics on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
               
               $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
                
                   
               var canvas = document.getElementById('myChartC');
               var ctx = canvas.getContext('2d');
               var data= {
                       labels: days<=31?amounts.map(d=>moment(d.date).format('ddd, DD-MM-YYYY')):mAmount.map(m=>m.month),
                       datasets: [ {
                               label: lang("Ghalama Jumla","Total Cost"),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "#BF2B2B15",
                               borderColor: "brown", // The main line color
                           
                               // notice the gap in the data and the spanGaps: false
                               data:days<=31?amounts.map(a=>Number(a.cost).toFixed(FIXED_VALUE)):mAmount.map(m=>m.cost),
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
                                   labelString: `${lang('Kiasi','Amount')} ${currencii}`,
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
              let   td=  `<table id="InvoRiportTable" class="table table-bordered table-hover smallFont" style="width:100%">
               <thead>
                   <tr class="smallFont ">
                       <th>#</th>
                       <th>${days<=31?lang('Tarehe','Date'):lang('Mwezi','Month')}</th>
                      
                      
                       <th> ${lang('Kiasi','Amount')}<span class="text-primary latoFont">(${currencii})</span> </th>
                      
                

                       <th> ${lang('Notisi','Notice')}</th>
                    
                     
                    
                   </tr>
               </thead>
               <tbody id="products_list">`,
               num = 0
               
               amo = days<=31?amounts:mAmount
               amo.reverse().forEach(a=>{
                   num+=1
                  
                   td+=`<tr>
                     <td>${num}</td>
                    
                     <td class="TodayordCut" >${days<=31?moment(a.date).format('DD-MM-YYYY'):a.month}</td>
                     
                     <td>${floatValue(a.cost)}</td>
               
                    <td> <button data-from="${a.from}" data-to="${a.to}" class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.idadi)}</button></td>
                    
                   
                   
                     `
               })

       td+=`</tbody>
       </table>
       `   
       
   let title = `<h6 class="py-2" >${lang(`Ghalama za Uendeshaji kwa Ujumla kwa kila `,`Management Expenses in General on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
     

       $('#theDataPanel').html(`${title} ${td}`)
       

       $('#InvoRiportTable').DataTable();
    }


}

 
function   placeItems(dataa){
    const {itms:charges,ankara:itms,val} = dataa,
            LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
            bd = [... new Set(itms.map(i=>i.matumizi_id))],
            matumizi = bd.map(b=>theItms(b)),
            Tawi  = branch(),

            charged = {
                id:0,
                name:lang('Makato ya Miamala','Transanction Fees'),
                itmz:charges,
                idadi:charges.length,
                cost:charges.reduce((a,b)=> a + Number(b.makato),0),
                tawi:tawi = [... new Set(charges.map(i=>i.duka))].length
            }


        function theItms(b){
            const itmz = itms.filter(i=>i.matumizi_id === b)
            return {
                id:b,
                name:itmz[0].matumiziN,
                itms:itmz,
                idadi:itmz.length,
               
               
                cost:itmz.reduce((a,b)=> a + Number(b.kiasi),0),
              
                tawi:tawi = [... new Set(itmz.map(i=>i.duka))].length
            }
        }

        matumizi.push(charged)   

        bidhaaList =  matumizi

        if(LoC){

            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${lang(`Takwimu ya Matumizi`,`Expenses Statistics `)}, duraTitle}<h6/>`
            $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: matumizi.map(b=>b.name),
                    datasets: [ {
                            label: lang("Ghalama Jumla","Total Cost"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "brown",
                            borderColor: "brown", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matumizi.map(a=>Number(a.cost).toFixed(FIXED_VALUE)),
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
                                labelString:lang('Matumizi','Expenses'),
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
            td=  `<table id="SoldItems"table-hover class="table table-bordered smallFont" style="width:100%">
                   <thead>
            <tr class="smallFont ">
                <th>#</th>
                <th>${lang('Matumizi','Expenses')}</th>
                <th>${lang('Hesabu','Tally')}</th>
              
                <th> ${lang('Kiasi','Amount')} <span class="text-primary latoFont">(${currencii})</span> </th>
               ` 
            //    if(Tawi==0){
            //    td+=` <th> ${lang('Matawi','Branches')}</th> `
            //    }

            td+=`</tr>
                 </thead>
                <tbody id="products_list">`,
        num = 0
        
        
        matumizi.reverse().forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize" >${a.name}</td>
              
              <td class="weight600" >${floatValue(a.idadi)}</td>
              <td>${floatValue(a.cost)}</td>
              `
            
                 
        //       if(Tawi==0){
        //        td+=`<td> <button data-val="${val}" data-itm="${a.id}" data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>`
        //    }
        })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2" >${lang(`Orodha ya Matumizi `,`Expenses List`)} , ${duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
        }


}

function   placeAlipia(dataa){
    
   
    const {ankara:ment,itms:charges}=dataa,
        
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        Tawi = branch(),
        accounts = Tawi==0?ALLPAYACCOUNTS:ALLPAYACCOUNTS.filter(d=>d.duka === Tawi),
        bd = [... new Set(accounts.map(i=>i.id))],
        malipo = bd.map(b=>theItms(b)).filter(am=>am.pay>0),
        Itemsusage = {
             id:0,
            name:lang('matumizi/Upotevu wa Bidhaa','Items Usage/Wastage'),
            pay:Number(ment.filter(a=>a.akaunti_id===null).reduce((a,b)=> a + Number(b.kiasi),0))  ,
            amount:0,
        }
        

    function theItms(b){
        const aka = ment.filter(a=>a.akaunti_id===b),
              makato = charges.filter(a=>a.akaunti_id===b)
        return {
            id:b,
            name:accounts.find(ac=>ac.id===b)?.Akaunt_name || lang('matumizi/Upotevu wa Bidhaa','Items Usage/Wastage'),
            pay:Number(aka.reduce((a,b)=> a + Number(b.kiasi),0)) + Number(makato.reduce((a,b)=> a + Number(b.makato),0)) ,
            amount:Number(aka[0]?.Aamount)|| Number(makato[0]?.Aamount),

        }
    }

    if(ment.filter(a=>a.akaunti_id===null).length>0){
        malipo.push(Itemsusage)
    }
    


    if(LoC){

        //Draw new Chart................................................................................................................./
        let title = `<h6 class="py-2 " >${lang(`Takwimu ya Malipo ya Ghalama za Uendeshaji kwa kila Akaunti ya Malipo`,`Management Expenses Statistics on each Payment Account  `)}, ${duraTitle}<h6/>`
        $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

               
        var canvas = document.getElementById('myChartC');
        var ctx = canvas.getContext('2d');
        var data= {
                labels: malipo.map(b=>b.name),
                datasets: [{
                    label:lang("Malipo ya Matumizi","Expenses Payment"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "brown",
                    borderColor: "brown", // The main line color

                    
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
            <th> ${lang('Malipo ya Ghalama za Uendeshaji','Management Expenses Payment')}<span class="text-primary latoFont">(${currencii})</span> </th>
            <th> ${lang('Kiasi kilichopo','Account Amount')}<span class="text-primary latoFont">(${currencii})</span> </th>
        </tr>
    </thead>
    <tbody id="products_list">`,
    num = 0
    
    
    malipo.forEach(a=>{
        num+=1
        td+=`<tr>
          <td>${num}</td>
         
          <td class="text-capitalize" >${a.name}</td>
       
          <td class="brown weight600" >${floatValue(a.pay)}</td>
          <td  >${floatValue(a.amount)}</td>
        
          `
    })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >${lang(`Malipo ya Ghalama za Uendeshaji kwa kila Akaunti ya Malipo`,`Management Expenses Payments on each Payment Account  `)}, ${duraTitle}<h6/>`
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
            case 2:
                viewCategoryByBranch({val,id})
               break;
            case 3:
                viewGroupByBranch({val,id})
               break;
        
           
        }

        
    }
    
    
})

//SHOW ITEMS BY DATE/MONTH.................................//
$('body').on('click','.checkInvo',function(){
    viewList({from:$(this).data('from'),to:$(this).data('to')})
})

function viewList(muda){

    
 
    const {from,to} = muda, {itms,charges} =  bidhaaList.filter(d=>d.from===from && d.to===to)[0],

    bd = [... new Set(itms.map(i=>i.matumizi_id))],
    matumizi = bd.map(b=>theItms(b)),

    charged = {
        id:0,
        name:lang('Makato ya Miamala','Transanction Fees'),
        itmz:charges,
        idadi:charges.length,
        cost:charges.reduce((a,b)=> a + Number(b.makato),0),
        tawi:tawi = [... new Set(charges.map(i=>i.duka))].length
    }
    


    function theItms(b){
        const itmz = itms.filter(i=>i.matumizi_id === b)
        return {
            id:b,
            name:itmz[0].matumiziN,
            itms:itmz,
            idadi:itmz.length,
           
           
            cost:itmz.reduce((a,b)=> a + Number(b.kiasi),0),
          
          
        }
    }

    if(charges.length>0){
        matumizi.push(charged)
    }
    

    td=  `<table id="SoldItems"table-hover class="table table-bordered smallFont" style="width:100%">
    <thead>
<tr class="smallFont ">
 <th>#</th>
 <th>${lang('Matumizi','Expenses')}</th>
 <th>${lang('Hesabu','Tally')}</th>

 <th> ${lang('Kiasi','Amount')} <span class="text-primary latoFont">(${currencii})</span> </th>
` 
//    if(Tawi==0){
//    td+=` <th> ${lang('Matawi','Branches')}</th> `
//    }

td+=`</tr>
  </thead>
 <tbody id="products_list">`,
num = 0


matumizi.reverse().forEach(a=>{
num+=1
td+=`<tr>
<td>${num}</td>

<td class="text-capitalize" >${a.name}</td>

<td class="weight600" >${floatValue(a.idadi)}</td>
<td>${floatValue(a.cost)}</td>
`

  
//       if(Tawi==0){
//        td+=`<td> <button data-val="${val}" data-itm="${a.id}" data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>`
//    }
})

td+=`</tbody>
</table>
`   

                   
             const d1= moment(muda.from).format('YYYY-MM-DD'),
                    d2=moment(muda.to).format('YYYY-MM-DD'),
                    dur = d2>d1?moment(d2).format('MMMM, YYYY'):moment(d2).format('DD/MM/YYYY'),
                    title = `<h6 class="py-2 " >${lang('Matumizi Rekodiwa','Expenses On')},<span class="darkblue"> ${dur}</span><h6/>`
                

                $('#theDataPanel').html(title+td)
                $('#table-Invoices').DataTable();

             

                $('.riportOn').addClass('btn-light')
                $('.riportOn').removeClass('btn-primary')


}  


function roadRiportSave(){
    $('#theSavedRiport').show(400)
    $('#saveR_loader').show()
    let dta = {data:{ 
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        ret:1
    },
    url:'/riport/getSavedRiport'},
    riports = getRiportData(dta)
    
    riports.then(function(data){
        $('#saveR_loader').hide()

       let li=``,li2=`<p class="py-3" >${lang('Hakuna Ripoti iliyohifadhiwa','No saved report Found')}</p>`
       data.riport.reverse().forEach(l=>{
            li+=`
                <li  class="d-block border my-2 px-2 py-1">
                     <div class="py-2 border-bottom">
                         <a class=" btn-default smallFont weight700 pr-3" onclick="createArray('${l.title}',moment('${l.From}').startOf('day').format(),moment('${l.to}').endOf('day').format())" type="button"  >${l.title}</a>

                         
                             <button type="button" data-val=${l.id} onclick="removeSaved($(this).data('val'))" class="btn btn-sm float-right text-danger  border0 smallerFont btn-danger btn-light" title="${lang('Ondoa Ripoti','Remove report')}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>

                             <button type="button" onclick="createArray('${l.title}',moment('${l.From}').startOf('day').format(),moment('${l.to}').endOf('day').format())" data-val=${l.id}  class="btn btn-sm float-right text-primary  border0 smallerFont btn-danger btn-light" title="${lang('Ongeza','Add')}">
                                 <strong>+</strong> ${lang('Ongeza','Add')}
                             </button>    
                        
                     </div>

                     <div  class=" weight400">
                            ${l.desc}
                     </div>
                </li>
            `
       })

       

       $('#placeTheRiport').html(data.riport.length>0?li:li2)
       
    })


}



