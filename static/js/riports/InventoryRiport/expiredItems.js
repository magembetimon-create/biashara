
//Regulate to Datetime if the weekend is greeter than the month end.......................//
const monthEnd = moment().endOf('month').format('YYYY-MM-DD'),
      weekEnd =  moment().endOf('isoWeek').format('YYYY-MM-DD'),
      EndTime =  monthEnd>=weekEnd?monthEnd:weekEnd  
var EXPIRED = 0,bidhaaList=[]
function DuraTable(){
        let dta = {
            data:{ 
                    d:0,
                    r:1,
                   
                    tf:moment().startOf('month').format('YYYY-MM-DD'),
                    tt:EndTime,
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                },
                url:'/riport/ExpiredData'}

                $("#loadMe").modal('show');

                let fct = getRiportData(dta)

                 fct.then(function(data){
                    $("#loadMe").modal('hide');
                   
                    
                    const leo = moment().startOf('day').format(),
                        wk = moment().endOf('isoWeek').format(),
                        mth = moment().endOf('month').format(),
                        dy = d=>moment(d.tarehe).format()<=leo,wkf=d=>moment(d.tarehe).format()<=wk && moment(d.tarehe).format() >leo  ,mthf=d=>moment(d.tarehe).format()<=mth && moment(d.tarehe).format() >leo
                         
                        theData.state = [{
                                 id:1,
                                 name:lang('Leo','Today'),
                                 from:moment().startOf('day').format(),
                                 To:moment().endOf('day').format(),
                                 txt:`${lang('Bidhaa Zilizopitwa Muda wa Matumizi','Expired Item(s)')}`, 
                               
                                 dtI:data.itms.filter(dy), 
                                 dt:[], 
                               


                            },
                         { 
                                 id:2,
                                 name:lang('Wiki hii','This Week'),
                                 from:moment().startOf('isoWeek').format(),
                                 To:moment().endOf('isoWeek').format(),
                                 txt:`${lang('Ndani ya Wiki hii,  <span style="color:green">Kuanzia Leo </span>','Within This Week, <span style="color:green">From Today</span>')}, ${lang('Hadi','To')} <span class="brown">(${moment().endOf('isoWeek').format('dddd, DD/MM/YYYY')})</span>`,   
                             
                                 dtI:[],
                                 dt:data.data.filter(wkf),
                            

                        
                            },
                         {       
                                 id:3, 
                                 name:lang('Mwezi huu','This Month'), 
                                 from:moment().startOf('month').format(),
                                 To:moment().endOf('month').format(),
                                 txt:`${lang('Ndani ya Mwezi Huu, <span style="color:green">Kuanzia Leo</span>','Within This Month, <span style="color:green">From Today </span>')}, ${lang('Hadi','To')} <span class="brown">(${moment().endOf('month').format('dddd DD/MM/YYYY')})</span>`, 
                                 
                                 dtI:[],
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
                      
                        tf:moment(from).format('YYYY-MM-DD'),
                        tt:moment(to).format('YYYY-MM-DD'),
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                    },
                    url:'/riport/ExpiredData'}
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
                txt = moment().startOf('year').format() == from && moment().endOf('day').format() == moment(to).endOf('day').format() ? `</span> <span style="color:green"> ${lang('Hadi Leo','Up to Today')}</span>` : `${lang('Hadi<span class="brown smallerFont">(','To<span class="brown smallerFont">(')} ${moment(to).endOf('day').format('dddd DD/MM/YYYY HH:mm')})</span>`
                 ar= { 
                        id:idn+1, 
                        name:name, 
                        from:from,
                        To:to,
                        txt:`${name},${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(from).startOf('day').format('dddd DD/MM/YYYY')})</span>, ${txt}`, 
                        dt:dt,
                        dtI:[],
               
                    }

                 theData.state.push(ar)
                 AddRow()
}        


function AddRow(){
     let tr='',n=0,chk='',vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0)
        if(theData.state.length>0){        
            theData.state.forEach(td=>{
            const Df = i => !i.online,  Lf = i=>i.online,Na = ByU(),Tawi=branch(),Wvat = withVat()
                    //  BRANCH SELECTOR FILTER
                 let   dt= [...td.dt,...td.dtI]
                   
                  dt = Tawi==0?dt:dt.filter(d=>d.duka===Tawi) 
                  const  amo = Number(dt.reduce((a,b)=> a + Number(b.Bei_kununua*b.idadi/b.uwiano),0))
   
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
                       <span class="TodayordCut"> ${td.name}</span>
                    </td>
                
                    <td class=" weight600">${floatValue(invo)}</td>
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

        OnlyDate = 1

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
         EXPIRED = Number(val)==1?1:0    

         if(dt.length>0){
              const  theDT = dt[0],
                  n = Number($('#riportSwitch .btn-primary').data('riport')),
                  vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),


                  Tawi =branch(), Wvat = withVat()
                  //  BRANCH SELECTOR FILTER
                 let itms = [...theDT.dt,...theDT.dtI]

                    itms =Tawi==0?itms:itms.filter(d=>Number(d.duka)===Tawi)
                    duraTitle = theDT.txt
                        

                  


                  //Add time to hidden save riport form...........................//
                  $('#fromT').val(moment(theDT.from).startOf('day').format())                    
                  $('#toT').val(moment(theDT.To).endOf('day').format())                    

         
                  // RETURN  OFFICERS ...............//

                                

                            

                      const amo = Number(itms.reduce((a,b)=> a + Number(b.Bei_kununua*b.idadi/b.uwiano),0)),
                             sale = itms.reduce((a,b)=> a + Number(b.Bei_kuuza*b.idadi),0)
                       
                      switch (Number(n)) {
                        case 1:
                            placeInvo({itms,muda:{from:theDT.from,to:theDT.To}})
                            break;
                        case 2:
                            placeItems(itms,val)
                            break;
                        case 3:
                            if(n==3){
                                placeCategory(itms,val)
                            }
                            break;
                        case 4:
                            placeGroups(itms,val)
                            break;
                                 
                        }

                          

                          $('#riporttitle').html(`${lang('Ufupisho','Summary')}, ${theDT.txt}`) 
                              

                          const retns = document.getElementById('ExpiredItms'),
                               // itmsR = document.getElementById('Itemsreturns'),
                                mauzo = document.getElementById('ExpiredSales'),
                                pamo = document.getElementById('ExpiredAmount')
                       

                                       
                              animateValue(retns, 0, Number(itms.length).toFixed(FIXED_VALUE), 500);
                             animateValue(mauzo, 0, Number(sale).toFixed(FIXED_VALUE), 500);
                              //animateValue(ilolipwa, 0, Number(ret).toFixed(2), 700);
                              animateValue(pamo, 0, Number(amo).toFixed(FIXED_VALUE), 700);
                           
                          
                      
                     // act.fct
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

      
function placeInvo(itms){

    $('#riportMap').text(lang('Siku','Days'))
    
    const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        {itms:ankara,muda} = itms,
        dates = [...new Set(ankara.map(i=>i.tarehe))].sort(),
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],
        mAmount= months.map(dt=>monthArr(dt)),
        amounts = dates.map(dt=>chartDt(dt)),
        fro = moment(muda.from),
        to   = moment(muda.to),  
        days = Number(to.diff(fro,'days')) + 1  
       
       
  

       function monthArr(mth){
           const mthf = l=>Number(moment(l.tarehe).format('YYYYMM'))===Number(mth)
           const  itmz = ankara.filter(mthf)
            

           return {
               month:moment(itmz[0].tarehe).format('MMMM, YYYY'),
               itms:itmz,
               from:itmz.map(d=>d.tarehe).sort()[0],
               to:itmz.map(d=>d.tarehe).sort()[itmz.length - 1],
               idadi:itmz.reduce((a,b)=> a + Number(b.idadi),0),
              
              
               cost:itmz.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
               mauzo:itmz.reduce((a,b)=> a + (b.Bei_Kuuza*(b.idadi)),0)
            
           }
       }


       



          function chartDt(dt){
             const itmz = ankara.filter(i=>i.tarehe===dt)
              
               return { 
                        date:dt,
                        from:itmz[0].tarehe,
                        itms:itmz,
                        from:itmz.map(d=>d.tarehe).sort()[0],
                        to:itmz.map(d=>d.tarehe).sort()[itmz.length - 1],
                        idadi:itmz.reduce((a,b)=> a + Number(b.idadi),0),
                        
                        cost:itmz.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
                        mauzo:itmz.reduce((a,b)=> a + Number(b.Bei_kuuza*b.idadi),0)                       }
          }  



       

   //    
   $('#howMany').text(`${dates.length}/${days}`)
   bidhaaList = days<=31?amounts:mAmount

    if(LoC){

               //Draw new Chart................................................................................................................./
               let title = `<h6 class="py-2" >${EXPIRED?lang('Takwimu za Bidhaa Zilizopitwa na Muda wa Matumizi','Expired Items Statistics'):lang(`Takwimu za Bidhaa Zitakazopitwa na Muda wa Matumizi kwa kila `,`Items About to Expire Statistics on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${EXPIRED?'':duraTitle}<h6/>`
               
               $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
                
                   
               var canvas = document.getElementById('myChartC');
               var ctx = canvas.getContext('2d');
               var data= {
                       labels: days<=31?amounts.map(d=>moment(d.date).format('ddd, DD-MM-YYYY')):mAmount.map(m=>m.month),
                       datasets: [{
                           label:lang("Mauzo","Sales"),
                           fill: true,
                           lineTension: 0,
                           backgroundColor: "#1a8cff28",
                           borderColor: "#1a8cff", // The main line color
                           
                           // notice the gap in the data and the spanGaps: true
                           data: days<=31?amounts.map(a=>a.mauzo):mAmount.map(m=>m.mauzo),
                           spanGaps: true,
                           }, {
                               label: lang("Galama","Cost"),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "#33669928",
                               borderColor: "#336699", // The main line color
                           
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
                                   labelString: `${lang('Thamani','Worth')} ${currencii}`,
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
                      
                       <th> ${lang('Idadi ya Bidhaa','Items Quantity')} </th>
                       <th> ${lang('Thamani','Cost')}<span class="text-primary latoFont">(${currencii})</span> </th>
                      
                       <th> ${lang('Thamani kwa Mauzo','Amount By Sales')}<span class="text-primary latoFont">(${currencii})</span></th>
                

                       <th> ${lang('Bidhaa','Items')}</th>
                    
                     
                    
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
                     <td>${floatValue(a.idadi)}</td>
                     <td>${floatValue(a.cost)}</td>
                    <td>${floatValue(a.mauzo)}</td>
                    <td> <button data-from="${a.from}" data-to="${a.to}" class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.itms.length)}</button></td>
                    
                   
                   
                     `
               })

       td+=`</tbody>
       </table>
       `   
       
   let title = `<h6 class="py-2" >${EXPIRED?lang('Orodha za Bidhaa Zilizopitwa na Muda wa Matumizi kwa kila','Expired Items List On Each'):lang(`Orodha ya Bidhaa Zitakazopitwa Muda kwa kila `,`Items About to Expire List on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${EXPIRED?'':duraTitle}<h6/>`
     

       $('#theDataPanel').html(`${title} ${td}`)
       

       $('#InvoRiportTable').DataTable();
    }


}
 
function   placeItems(itms,val){
    const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
            bd = [... new Set(itms.map(i=>i.bidhaa_id))],
            bidhaa = bd.map(b=>theItms(b)),
            Tawi  = branch()


        function theItms(b){
            const itmz = itms.filter(i=>i.bidhaa_id === b)
            return {
                id:b,
                name:itmz[0].bidhaaN,
                itms:itmz,
                idadi:itmz.reduce((a,b)=> a + Number(b.idadi),0),
               
               
                cost:itmz.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
                mauzo:itmz.reduce((a,b)=> a + (b.Bei_kuuza*(b.idadi)),0),

                kipimo:itmz[0].kipimo,
                tawi:tawi = [... new Set(itmz.map(i=>i.duka))].length
            }
        }


        bidhaaList =  bidhaa

        if(LoC){

            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${EXPIRED?lang('Takwimu za Bidhaa Zilizopitwa na Muda wa Matumizi','Expired Items Statistics'):lang(`Takwimu ya Bidhaa Zitakazopitwa na Muda wa Matumizi`,`Items About to Expire Statistics `)}, ${EXPIRED?'':duraTitle}<h6/>`
            $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: bidhaa.map(b=>b.name),
                    datasets: [{
                        label:lang("Mauzo","Sales"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: bidhaa.map(a=>a.mauzo),
                        spanGaps: true,
                        }, {
                            label: lang("Thamani","Cost"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.cost).toFixed(FIXED_VALUE)),
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
            td=  `<table id="SoldItems"table-hover class="table table-bordered smallFont" style="width:100%">
        <thead>
            <tr class="smallFont ">
                <th>#</th>
                <th>${lang('Bidhaa','Item')}</th>
                <th>${lang('vipimo','Units')}</th>
                <th>${lang('Idadi','Quantity')}</th>
                <th> ${lang('Thamani','Cost')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Thamani kwa Mauzo','Amount By Sales')} <span class="text-primary latoFont">(${currencii})</span> </th>
               ` 
               if(Tawi==0){
               td+=` <th> ${lang('Matawi','Branches')}</th> `
               }

            td+=`</tr>
                 </thead>
                <tbody id="products_list">`,
        num = 0
        
        
        bidhaa.reverse().forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize" >${a.name}</td>
              <td class="text-primary" >${a.kipimo}</td>
              <td class="weight600" >${a.idadi.toFixed(FIXED_VALUE)}</td>
              <td>${floatValue(a.cost)}</td>
              <td>${floatValue(a.mauzo)}</td>`
            
                 
              if(Tawi==0){
               td+=`<td> <button data-val="${val}" data-itm="${a.id}" data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>`
           }
        })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2" >${EXPIRED?lang('Orodha za Bidhaa Zilizopitwa na Muda wa Matumizi','Expired Items List'):lang(`Orodha ya Bidhaa Zitakazopitwa na Muda wa Matumizi `,`Items About to Expire List`)} , ${EXPIRED?'':duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
        }


}
 
function   placeCategory(itms,val){
    const aina = Categs.state,
            LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
            bd = [... new Set(itms.map(i=>i.aina))],
            bidhaa = bd.map(b=>theItms(b)),Tawi=branch()

        function theItms(b){
            const itmz = itms.filter(i=>i.aina === b)
            return {
                id:b,
                name:aina.filter(a=>a.id===b)[0].aina,
                idadi:itmz.reduce((a,b)=> a + Number(b.idadi),0),
               
               
                cost:itmz.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
                mauzo:itmz.reduce((a,b)=> a + (b.Bei_kuuza*(b.idadi)),0),
            }
        }


        if(LoC){

            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${EXPIRED?lang('Takwimu za Aina za Bidhaa Zilizopitwa na Muda wa Matumizi','Expired Items Categories Statistics'):lang(`Takwimu ya Aina za Bidhaa Zitakazopitwa na Muda wa Matumizi `,`Items Categories About to Expire Statistics  `)}, ${duraTitle}<h6/>`
            $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: bidhaa.map(b=>b.name),
                    datasets: [{
                        label:lang("Mauzo","Sales"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: bidhaa.map(a=>a.mauzo),
                        spanGaps: true,
                        }, {
                            label: lang("Thamani","Cost"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.cost).toFixed(FIXED_VALUE)),
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
            td=  `<table id="SoldItems" class="table-hover table table-bordered smallFont" style="width:100%">
        <thead>
            <tr class="smallFont ">
                <th>#</th>
                <th>${lang('Aina','Category')}</th>
                <th> ${lang('Idadi ya Bidhaa','Items Quantity')}</th>
                <th> ${lang('Thamani','Cost')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Thamani kwa Mauzo','Amount By Sales')} <span class="text-primary latoFont">(${currencii})</span> </th></tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        bidhaa.forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize" >${a.name}</td>
           
              <td>${floatValue(a.idadi)}</td>
              <td>${floatValue(a.cost)}</td>
              <td>${floatValue(a.mauzo)}</td>
              `
                
              

                    
        })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >${EXPIRED?lang('Orodha za Aina za Bidhaa Zilizopitwa na Muda wa Matumizi','Expired Items Categories List'):lang(`Orodha ya Aina za Bidhaa Zitakazopitwa na Muda wa Matumizi`,` Items Categories About to Expire List `)}, ${EXPIRED?'':duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
        }

        

        

  

}
 
function   placeGroups(itms,val){
   
   const aina = pcategs.state,
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        bd = [... new Set(itms.map(i=>i.kundi))],
        bidhaa = bd.map(b=>theItms(b)),Tawi = branch()

   

   function theItms(b){
       const itmz = itms.filter(i=>i.kundi === b)
       return {
           id:b,
           name:aina.filter(a=>a.id===b)[0]?.mahitaji,
     
           idadi:itmz.reduce((a,b)=> a + Number(b.idadi),0),
          
          
           cost:itmz.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
           mauzo:itmz.reduce((a,b)=> a + (b.Bei_kuuza*(b.idadi)),0),
       }
   }


   if(LoC){

       //Draw new Chart................................................................................................................./
       let title = `<h6 class="py-2 " >${EXPIRED?lang('Takwimu ya Makundi ya Aina za Bidhaa Zilizopitwa na Muda wa Matumizi','Expired Items Categories Groups Statistics'):lang(`Takwimu ya Makundi ya Aina za Bidhaa Zitakazopitwa na Muda wa Matumizi`,` Items Categories Groups About to Expire Statistics `)}, ${EXPIRED?'':duraTitle}<h6/>`
       $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

              
       var canvas = document.getElementById('myChartC');
       var ctx = canvas.getContext('2d');
       var data= {
               labels: bidhaa.map(b=>b.name),
               datasets: [{
                   label:lang("Mauzo","Sales"),
                   fill: true,
                   lineTension: 0,
                   backgroundColor: "#1a8cff",
                   borderColor: "#1a8cff", // The main line color
                   
                   // notice the gap in the data and the spanGaps: true
                   data: bidhaa.map(a=>a.mauzo),
                   spanGaps: true,
                   }, {
                       label: lang("Thamani","Cost"),
                       fill: true,
                       lineTension: 0,
                       backgroundColor: "#336699",
                       borderColor: "#336699", // The main line color
                   
                       // notice the gap in the data and the spanGaps: false
                       data:bidhaa.map(a=>Number(a.cost).toFixed(FIXED_VALUE)),
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
       td=  `<table id="SoldItems" class="table-hover table table-bordered smallFont" style="width:100%">
   <thead>
       <tr class="smallFont ">
           <th>#</th>
           <th>${lang('Kundi','Group')}</th>
           <th> ${lang('Idadi ya Bidhaa','Items Quantity')}</th>
           <th> ${lang('Thamani','Cost')} <span class="text-primary latoFont">(${currencii})</span> </th>
           <th> ${lang('Thamani kwa Mauzo','Amount By Sales')} <span class="text-primary latoFont">(${currencii})</span> </th></tr>
   </thead>
   <tbody id="products_list">`,
   num = 0
   
   
   bidhaa.forEach(a=>{
       num+=1
       td+=`<tr>
         <td>${num}</td>
        
         <td class="text-capitalize" >${a.name}</td>
      
         <td>${floatValue(a.idadi)}</td>
         <td>${floatValue(a.cost)}</td>
         <td>${floatValue(a.mauzo)}</td>
         `
           
         

               
   })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >${EXPIRED?lang('Orodha ya Makundi ya Aina za Bidhaa Zilizopitwa na Muda wa Matumizi','Expired Items Categories Groups List'):lang(`Orodha ya Makundi ya Aina za Bidhaa  Zitakazopitwa na Muda wa Matumizi`,` Items Categories Groups About to Expire List `)}, ${EXPIRED?'':duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
   }

   

    }

//SHOW ITEMS BY DATE/MONTH.................................//
$('body').on('click','.checkInvo',function(){
    viewList({from:$(this).data('from'),to:$(this).data('to')})
})

function viewList(muda){

    const {from,to} = muda, itms =  bidhaaList.filter(d=>d.from===from&&d.to===to)[0].itms,

            bd = [... new Set(itms.map(i=>i.bidhaa_id))],
            bidhaa = bd.map(b=>theItms(b))
            


        function theItms(b){
            const itmz = itms.filter(i=>i.bidhaa_id === b)
            return {
                id:b,
                name:itmz[0].bidhaaN,
            
                idadi:itmz.reduce((a,b)=> a + Number(b.idadi),0),
            
            
                cost:itmz.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
                mauzo:itmz.reduce((a,b)=> a + (b.Bei_kuuza*(b.idadi)),0),

                kipimo:itmz[0].kipimo,
                tawi:tawi = [... new Set(itmz.map(i=>i.duka))].length
            }
        }



   let     td=  `<table id="SoldItems"table-hover class="table table-bordered smallFont" style="width:100%">
        <thead>
            <tr class="smallFont ">
                <th>#</th>
                <th>${lang('Bidhaa','Item')}</th>
                <th>${lang('vipimo','Units')}</th>
                <th>${lang('Idadi','Quantity')}</th>
                <th> ${lang('Thamani','Cost')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Thamani kwa Mauzo','Amount By Sales')} <span class="text-primary latoFont">(${currencii})</span> </th>
               ` 
              

            td+=`</tr>
                 </thead>
                <tbody id="products_list">`,
        num = 0
        
        
        bidhaa.reverse().forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize" >${a.name}</td>
              <td class="text-primary" >${a.kipimo}</td>
              <td class="weight600" >${a.idadi.toFixed(FIXED_VALUE)}</td>
              <td>${floatValue(a.cost)}</td>
              <td>${floatValue(a.mauzo)}</td>`
            
                 
             
        })

td+=`</tbody>
</table>
`   
                   
             const d1= moment(muda.from).format('YYYY-MM-DD'),
                    d2=moment(muda.to).format('YYYY-MM-DD'),
                    dur = d2>d1?moment(d2).format('MMMM, YYYY'):moment(d2).format('DD/MM/YYYY'),
                    title = `<h6 class="py-2 " >->${EXPIRED?lang(`Orodha ya Bidhaa Zilizopitwa na Muda wa Matumizi`,`Items Expired List on`):lang('Bidhaa Zitakazopitwa na Muda wa Matumizi','Items About to Expire on')},<span class="darkblue"> ${dur}</span><h6/>`
                

                $('#theDataPanel').html(title+td)
                $('#table-Invoices').DataTable();

             

                $('.riportOn').addClass('btn-light')
                $('.riportOn').removeClass('btn-primary')


        }    


        //SHOW EXPIRED ITEMS ON ITEM BY BRANCH.....................//
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

function viewItembByBranch(vl){
    const {id,val}=vl,
          LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
          itms = bidhaaList.filter(i=>i.id===id)[0].itms,
        
        tw =[...new Set(itms?.map(m=>m.duka))] ,
        matawi = tw?.map(t=>formT(t))
        
        
        function formT(t){
            const itmz = itms.filter(d=>d.duka===t)
            return {
                id:t,
                name:itmz.filter(d=>d.duka===t)[0].dukaN,
                idadi:itmz.reduce((a,b)=> a + Number(b.idadi),0),
            
            
                tha:itmz.reduce((a,b)=> a + (b.Bei_kununua*(b.idadi)/b.uwiano),0),
                sale:itmz.reduce((a,b)=> a + (b.Bei_kuuza*(b.idadi)),0),

                kipimo:itmz[0].kipimo,
                tawi:tawi = [... new Set(itmz.map(i=>i.duka))].length
            }
        }



        if(LoC){

            //Draw new Chart................................................................................................................./
            $('#theDataPanel').html(`<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
    
                    
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: matawi.map(b=>b.name),
                    datasets: [{
                        label:lang("Kwa Mauzo","By Sales"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: matawi.map(a=>a.sale),
                        spanGaps: true,
                        }, {
                            label: lang("Ghalama","Cost"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.tha).toFixed(FIXED_VALUE)),
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
                                labelString: `${lang('Thamani','Worth')} ${currencii}`,
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
                                labelString:lang('Matawi','Branches'),
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
                <th>${lang('Tawi','Branch')}</th>
                <th>${lang('vipimo','Units')}</th>
                <th>${lang('Idadi','Quantity')}</th>
                
                <th> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Thamani kwa Mauzo','Worth By Sales')}<span class="text-primary latoFont">(${currencii})</span> </th>

            </tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        matawi.forEach(a=>{
            
            td+=`<tr>
                <td>${num+=1}</td>
                <td class="text-capitalize weight600 text-primary " ><u>${a.name}</u></td>
                <td class="text-primary" >${a.kipimo}</td>
                <td >${a.idadi}</td>
                <td>${floatValue(a.tha)}</td>
                <td>${floatValue(a.sale)}</td>
                `
        })
    
    td+=`</tbody>
    </table>
    `   
    
    $('#theDataPanel').html(td)
    $('#SoldItems').DataTable();
        }
    
        
        
        $('#theDataPanel').prepend(`<h6 id="itmTitle" class="py-3" data-itm=${id} data-val=${val} data-num=1 ><i class="darkblue text-capitalize">${itms[0].bidhaaN}</i> ${EXPIRED?lang('Zilizopitwa na Muda wa Matumizi','Expired'):lang('Zitakazopitwa na Muda wa Matumizi ','About to Expire')} ${lang('Kwa kila Tawi','In each branch')}</h6>`)

        $('.riportOn').addClass('btn-light')
        $('.riportOn').removeClass('btn-primary')


}





 







