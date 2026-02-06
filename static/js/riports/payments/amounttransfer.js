var PAYACC = [],Transactions=[]
const HIM = Number($('#HIMOWNER').val())

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
                       amo = dt.reduce((a,b)=> a + Number(b.Amount),0)
                      


            
               n+=1 
                   
                chk+=` <div class="custom-control smallFont d-inline mx-2 custom-checkbox"  >
                            <input type="checkbox" onchange="$('#dataRow${n}').toggle(100)"  checked name="MonthSale" id="MonthSale${n}" class="custom-control-input" style="cursor: pointer !important;"><label class="custom-control-label" style="cursor: pointer !important;" for="MonthSale${n}">${td.name}</label>
                        </div>`
                let bg='',
                invo =  dt?.length
                   

                  if(n>3){
                      bg = 'table-info'
                  }

                tr+=`
                    <tr class="text-center ${bg}" id="dataRow${n}">
                    <td scope="row">
                       <span class="noWordCut"> ${td.txt}</span>
                    </td>
                
                    <td class=" weight600">${Number(invo).toLocaleString()}</td>
                    <td class=" weight600">${floatValue(amo)}</td>
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
                       <button type="button" data-val=${td.id} class="btn btn-sm text-danger removeTherow border0 smallerFont btn-danger btn-light" title="${lang('Onesha zaidi','More Info')}">
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
                                 let itmz =itmO.filter(m=>Number(m.mauzo_id)==a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number(b.idadi*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number(b.idadi*(vatPer(b.vat,b.bei))),0)}
                                 return ar
                             }
                             

                             summaryTable({ankara,itms})


                          switch (Number(n)) {
                              case 1:
                                  placeInvo({ankara,itms,muda:{from:theDT.from,to:theDT.To}})
                                  break;
                            //   case 2:
                            //      //   placeItems({ankara,itms,val})
                                   
                                 
                            //       break;
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
           
           amo = Number(ankara.reduce((a,b)=> a + Number(b.kiasi),0)),
           leng = ankara.length ,
         
           
 
        tr = `
             <tr class="weight600"> 
                 <td>${lang('Miamala, ','Transactions')}  </td>       
                      
                 <td>${floatValue(leng)}</td>       
                    
             </tr>
             <tr class="weight600"> 
                 <td>${lang('Kiasi ','Amount')} <span class="text-primary smallFont latoFont">(${currencii})</span> </td>       
                      
                 <td>${floatValue(amo)}</td>       
                    
             </tr>


             `

    $('#summaryTable').html(tr)

}

function placeInvo(itms){

    $('#riportMap').text(lang('Siku','Days'))
    
    const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        {ankara,muda,itms:itmd} = itms,
        dates = [...new Set(ankara.map(i=>moment(i.tarehe).format('YYYY-MM-DD')))].sort(),
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],

        mAmount= months.map(dt=>monthArr(dt)),
        amounts = dates.map(dt=>chartDt(dt)),
        

        fro = moment(muda.from),
        to   = moment(muda.to),  
        days = Number(to.diff(fro,'days')) + 1  

        
       
       
       

       function monthArr(mth){
           const mthf = l=>Number(moment(l.tarehe).format('YYYYMM'))===Number(mth),
                 itmz = ankara.filter(mthf)
                
            

           return {
               month:moment(itmz[0]?.tarehe).format('MMMM, YYYY'),
               itms:itmz,
               from:moment(itmz[0]?.tarehe).format('YYYY-MM-DD'),
               to:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[itmz.length - 1],
               idadi:itmz.length,
               inc:[] ,     
               cost:Number(itmz.reduce((a,b)=> a + Number(b.kiasi),0)) ,
              
           }
       }


        
       



          function chartDt(dt){
             const itmz = ankara.filter(i=>moment(i.tarehe).format('YYYY-MM-DD')===dt) 
                   
                 

               return { 
                        date:dt,
                       
                        itms:itmz,
                        from:moment(itmz[0]?.tarehe).format('YYYY-MM-DD'),
                        to:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[itmz.length - 1],
                        idadi:itmz.length,
                         
                        cost:Number(itmz.reduce((a,b)=> a + Number(b.kiasi),0)),
                     }
          }  



       

   //    
   $('#howMany').text(`${dates.length}/${days}`)
   Transactions = days<=31?amounts:mAmount

    if(LoC){

               //Draw new Chart................................................................................................................./
               let title = `<h6 class="py-2" >${lang(`Takwimu za Miamala ya Kuhamisha Pesa kwa kila `,`Amount Transfer Transactions Statistics on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
               
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
                      
                

                       <th> ${lang('Miamala','Transactions')}</th>
                    
                     
                    
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
               
                    <td> <button data-from="${a.from}" data-exp=1 data-to="${a.to}" class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.idadi)}</button></td>
                    
                   
                   
                     `
               })

       td+=`</tbody>
       </table>
       `   
       
   let title = `<h6 class="py-2" >${lang(`Miamala ya Kuhamisha Pesa kwa kila `,`Amount Transfer Transactions on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
     

       $('#theDataPanel').html(`${title} ${td}`)
       

       $('#InvoRiportTable').DataTable();
    }


}

function   placeAlipia(dataa){
    
    const {ankara:exp,itms:incr}=dataa,
        
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        Tawi = branch(),
        payA = [... new Set(Tawi==0?ALLPAYACCOUNTS.map(ac=>ac.id):ALLPAYACCOUNTS.filter(dk=>dk.Interprise_id===Tawi).map(ac=>ac.id))],
        malipo = payA.map(ac=>{
          const aff=aci=>aci.Akaunt_id===ac,
                traxn = exp.filter(aff),
                recev = incr.filter(aff)
               
          return {
              ac:ac,
              name:ALLPAYACCOUNTS.find(aci=>aci.id===ac).Akaunt_name || null,
              from:ac,
              to:ac,
              withdrawA:traxn.reduce((a,b)=>a + Number(b.Amount),0),
              depositA:recev.reduce((a,b)=>a + Number(b.Amount),0),
              itms:traxn,
              inc:recev,
              amount:Number(ALLPAYACCOUNTS.find(aci=>aci.id===ac).Amount) || 0
          }
        })

        Transactions = malipo
   
        


    


    if(LoC){

        //Draw new Chart................................................................................................................./
        let title = `<h6 class="py-2 " >${lang(`Takwimu ya Kuhamisha na Kupokea Pesa kwa kila Akaunti ya Malipo`,`Amount Transfer & Receive Statistics in each Payment Account  `)}, ${duraTitle}<h6/>`
        $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
  
               
        var canvas = document.getElementById('myChartC');
        var ctx = canvas.getContext('2d');
        var data= {
                labels: malipo.map(b=>b.name),
                datasets: [
                  {
                    label:lang("Pesa Ilopokelewa","Amount Received"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "#336699",
                    borderColor: "#336699", // The main line color
  
                    
                    // notice the gap in the data and the spanGaps: true
                    data: malipo.map(a=>Number(a.depositA).toFixed(FIXED_VALUE)),
                    spanGaps: true,
                    }, 
                  {
                    label:lang("Pesa Ilohamishwa","Transfered Amount"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "brown",
                    borderColor: "brown", // The main line color
  
                    
                    // notice the gap in the data and the spanGaps: true
                    data: malipo.map(a=>Number(a.withdrawA).toFixed(FIXED_VALUE)),
                    spanGaps: true,
                    }, 
                    
                    {
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
            <th rowspan=3 >#</th>
            <th rowspan=3>${lang('Akaunti ya Malipo','Payment Account')}</th>
            <th rowspan=3> ${lang('Kiasi kilichopo','Account Amount')}<span class="text-primary latoFont">(${currencii})</span> </th>
            
            <tr>
              <th colspan=2 > ${lang('Pesa Ilohamishwa','Transfered Amount')} </th>
              <th colspan=2 > ${lang('Pesa Ilopokelewa','Received Amount')} </th>
           </tr> 
  
           <tr>
            <th> ${lang('Miamala','Transactions')} </th>
            <th> ${lang('Kiasi','Amount')} <span class="text-primary latoFont">(${currencii})</span></th>
  
            <th> ${lang('Miamala','Transactions')} </th>
            <th> ${lang('Kiasi','Amount')} <span class="text-primary latoFont">(${currencii})</span></th>
           </tr>
           
        </tr>
    </thead>
    <tbody id="products_list">`,
    num = 0
    
    
    malipo.forEach(a=>{
        num+=1
        td+=`<tr>
          <td>${num}</td>
         
          <td class="text-capitalize" >${a.name}</td>
          <td class=" weight600"  >${floatValue(a.amount)}</td>
  
          <td><button data-from="${a.ac}" data-to="${a.ac}" data-ac=1 data-exp=1 class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.itms.length)}</button></td>        
          <td>${floatValue(a.withdrawA)}</td>

          <td><button data-from="${a.ac}" data-to="${a.ac}" data-ac=1 data-exp=0 class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.inc.length)}</button></td>
          <td>${floatValue(a.depositA)}</td>  
          
        
          `
    })
  
  td+=`</tbody>
  </table>
  `   
  let title = `<h6 class="py-2 " >${lang(`Orodha ya Pesa Kuhamisha na Kupokea kwa kila Akaunti ya Malipo`,`Amount Transfer & Receive in each Payment Account List `)}, ${duraTitle}<h6/>`
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
    viewList({from:$(this).data('from'),to:$(this).data('to'),exp:Number($(this).data('exp')),ac:Number($(this).data('ac'))||0})
})

function viewList(muda){

    const {from,to,exp:xp,ac} = muda,trnsxn = Transactions.filter(d=>d.from===from && d.to===to)[0],{itms:exp,inc} = trnsxn,

    Transfered = () =>{
        let tr=  `
     <table id="table-transaxns" table-hover class="table table-bordered smallFont" style="width:100%">
      <thead>
      <tr class="smallFont ">
            <th scope="col">#</th>
            <th scope="col"> ${lang('Tarehe','Date')}   </th>
            <th scope="col"> ${lang('Akaunti','Account')}  </th>
            <th scope="col"> ${lang('kiasi','Amount')}<span class="text-primary latoFont">${currencii}</span></th>
            <th scope="col"> ${lang('Makato','Charges')}<span class="text-primary latoFont">${currencii}</span></th>
            <th scope="col"> ${lang('kabla','Before')}   <span class="text-primary latoFont">${currencii}</span></th>
            <th scope="col"> ${lang('baada','After')}   <span class="text-primary latoFont">${currencii}</span></th>
            <th scope="col"> ${lang('Kwenda','To')}    </th>
            <th scope="col"> ${lang('Maelezo','Descriptions')}</th>
            <th scope="col"> ${lang('Na','By')} </th>
     </tr>
    </thead>
          <tbody id="products_list">`,
         num = 0
    
         exp.forEach(dt => {
            tr+=`<tr>
                        <td  valign="middle">${num+=1}</td>
                        <td  valign="middle">${moment(dt.tarehe).format('DD/MM/YYYY HH:mm:ss')}</td>
                        <td  class="text-capitalize"  valign="middle">${dt.akauntiN?.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                        <td>${floatValue(dt.Amount)}</td>
                        <td>${floatValue(dt.makato)}</td>
                        <td>${floatValue(dt.before)}</td>
                        <td>${floatValue(dt.After)}</td>`
            
                        if(dt.bill_id!=null){
                          let bil = `BIL-<a class="ivoice_details" href="/purchase/viewbill?back_to=akaunting&item_valued=${dt.bill_id}" type="button"  data-id="${dt.bill_id}">${dt.bil_code}</a>`
            
                          tr+=`<td>${lang('Kulipia manunuzi',dt.kwenda.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, ""))}</td>`
                          tr+=`<td>${bil}</td>`
            
                      }else{
            
                        if(dt.kwenda_siri && !HIM){
                          tr+=` <td>${lang('Mengineyo','Others')}</td>`
                        
                        }else{
                        tr+=`<td>${dt.personal?lang('Mambo Binafsi','Personal issues'):dt.kwenda.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>`
            
                        }
                     
                      tr+=`<td>${dt.maelezo.replace(/[[,+()$~%"*{}`]/g, "")}</td>`
                      }
                      tr+=`<td class="text-capitalize" >${(dt.f_name || "None").replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "") +' '+ (dt.l_name || "None").replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                     </tr>`
                 
                  })
    
                  tr+=`</tbody></table>`
                  return tr
    
    },
    
    Received = () =>{
        let tr=  `
         <table id="table-transaxns"  table-hover class="table table-bordered smallFont" style="width:100%">
          <thead>
          <tr class="smallFont ">
                <th scope="col">#</th>
                <th scope="col"> ${lang('Tarehe','Date')}   </th>
                <th scope="col"> ${lang('Akaunti','Account')}  </th>
                <th scope="col"> ${lang('kiasi','Amount')}<span class="text-primary latoFont">${currencii}</span></th>
                <th scope="col"> ${lang('kabla','Before')}   <span class="text-primary latoFont">${currencii}</span></th>
                <th scope="col"> ${lang('baada','After')}   <span class="text-primary latoFont">${currencii}</span></th>
                <th scope="col"> ${lang('kutoka','From')}    </th>
                <th scope="col"> ${lang('Maelezo','Descriptions')}</th>
                <th scope="col"> ${lang('Na','By')} </th>
         </tr>
        </thead>
              <tbody id="products_list">`,
             num = 0
        
        
        inc?.reverse().forEach(dt => {
            tr+=`<tr>
              <td>${num+=1}</td>
              <td>${moment(dt.tarehe).format('DD/MM/YYYY HH:mm:ss')}</td>
              <td>${dt.akauntiN.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
              <td>${floatValue(dt.Amount)}</td>
              <td>${floatValue(dt.before)}</td>
              <td>${floatValue(dt.After)}</td>`
            if(dt.kutoka_siri && !HIM){
              tr+=` <td>${lang('Mengineyo','Others')}</td>`
            }else{
              //  tr+=`<td>${dt.kutoka.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>`
                if(dt.invo_id){
                      tr+=`<td>${dt.serv?lang('Mapato Kutokana na Huduma','Service Income'):lang('Mauzo ya Bidhaa','Goods Sales')}</td>
                        `
                 }else{
                     tr+=`<td>${dt.kutoka.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                  `
              }
            }
        
            if(dt.invo_id){
                  let invo = `
                  <button type="button" data-val=${dt.invo_id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm border0 viewInvo smallerFont btn-light" title="${lang('Onesha Ankara','View Invo')}">
                      INVO-<span class="text-primary">${dt.invo_code}</span>
                   </button>
                  `
                 
                 
                  tr+=`<td>${invo}</td>`
          }else{
                tr+=`<td>${dt.maelezo.replace(/[[,+()$~%"*{}`]/g, "")}</td>
               `
           
          }
        
              tr+=`
              <td class="text-capitalize" >${(dt.f_name || 'None').replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "") +' '+ (dt.l_name || "None" ).replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                </tr>`
          
        })
        
        tr+=`</tbody>
        </table>
        `   
        
        return tr
        }

 
                   
             const d1= moment(muda.from).format('YYYY-MM-DD'),
                    d2=moment(muda.to).format('YYYY-MM-DD'),
                    dur = d2>d1?moment(d2).format('MMMM, YYYY'):moment(d2).format('DD/MM/YYYY'),
                    trns = ac?trnsxn.name:dur,
                    title = `<h6 class="py-2 " >${xp?lang('Miamala ya Kuhamisha Pesa','Amount Transfer Transactions'):lang('Miamala ya Kupokea Pesa','Amount Receive Transactions')},<span class=" text-capitalize darkblue"> ${trns}</span> ${ac?','+duraTitle:''} <h6/>`,
                    tbr = xp?Transfered():Received()

                $('#theDataPanel').html(title+tbr)
                $('#table-transaxns').DataTable();

             

                $('.riportOn').addClass('btn-light')
                $('.riportOn').removeClass('btn-primary')


}  




