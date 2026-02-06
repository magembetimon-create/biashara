


var ADJ_WORTH = 0


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
            let Df = i => !i.online,  Lf = i=>i.online,Na = ByU(),Tawi=branch(),Wvat = withVat()
                    //  BRANCH SELECTOR FILTER
                    dt= Tawi==0?td.dt:td.dt?.filter(d=>d.duka===Tawi),
                    dtI =Tawi==0?td.dtI:td.dtI?.filter(d=>d.duka===Tawi)

                    // ONLINE OR OF LINE FILTER
                    // dt = online&&direct?dt:online&&!direct?dt.filter(Lf):direct&&!online?dt.filter(Df):[]
                    // dtI = online&&direct?dtI:online&&!direct?dtI.filter(Lf):direct&&!online?dtI.filter(Df):[]

                   //USER FILTE
                //    dt = Na==0?dt:dt.filter(s=>s.By_id==Na)
                //    dtI = Na==0?dtI:dtI.filter(s=>s.By==Na)
               n+=1 
                   
                chk+=` <div class="custom-control smallFont d-inline mx-2 custom-checkbox"  >
                            <input type="checkbox" onchange="$('#dataRow${n}').toggle(100)"  checked name="MonthSale" id="MonthSale${n}" class="custom-control-input" style="cursor: pointer !important;"><label class="custom-control-label" style="cursor: pointer !important;" for="MonthSale${n}">${td.name}</label>
                        </div>`
                let bg=''

                let invo = dt?.length,
                   itms  = dtI?.reduce((a,b)=> a + (Number(b.thamani)*(b.qty)/b.uwiano),0)
                   

                  if(n>3){
                      bg = 'table-info'
                  }

                tr+=`
                    <tr class="text-center ${bg}" id="dataRow${n}">
                    <td scope="row">
                       <span class="noWordCut"> ${td.name}</span>
                    </td>
                
                    <td class=" weight600">${Number(invo).toLocaleString()}</td>
                    <td class=" weight600">${floatValue(itms)}</td>
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
              let  theDT = dt[0],
                  n = Number($('#riportSwitch .btn-primary').data('riport')),
                  vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),


                  Tawi =branch(), Wvat = withVat(),
                  //  BRANCH SELECTOR FILTER
                  ankara= Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)===Tawi),
                  itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)===Tawi),

                  Na = ByU()


                  //Add time to hidden save riport form...........................//
                  $('#fromT').val(moment(theDT.from).startOf('day').format())                    
                  $('#toT').val(moment(theDT.To).endOf('day').format())                    

         
                  // RETURN  OFFICERS ...............//
                  duraTitle = theDT.txt
                  Descriptive({ankara,itms})


                          switch (Number(n)) {
                              case 1:
                                placeInvo(ankara,itms,{from:theDT.from,to:theDT.to})
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
                              case 5:
                                      placeAlipia(payi)
                                 
                                  break;
                                  
                              
                          
                          }

                        //   let btn = `  <button title="${lang('Hifadhi Riport','Save Riport')}" class="smallMadebuttons border0 text-primary float-right smallFont " data-toggle="modal" data-target="#saveRiportTime" >
                        //                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
                        //                       <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        //                       </svg>
                                              
                        //                   </button>`

                    $('#riporttitle').html(`${lang('Mchanganuo kwa Ufupi','Discriptive Summary')}, ${theDT.txt}`) 
                              

                     
                      
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

    const val = Number($('#itmTitle').data('val'))||0,id=Number($('#itmTitle').data('itm'))||0,num=Number($('#itmTitle').data('num'))||0
    
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

//SHOW INVOICES.................................//
$('body').on('click','.checkInvo',function(){
    viewList({from:$(this).data('from'),to:$(this).data('to')})
})


//SHOW SALES ON ITEM BY BRANCH.....................//
$('body').on('click','.checkByBranch',function(){
    let val= Number($(this).data('val')),id= Number($(this).data('itm')),num=Number($(this).data('num'))
    switch (num) {
        case 1:
            viewItembByBranch({val,id})
            break;
        // case 2:
        //     viewCategoryByBranch({val,id})
        //    break;
        // case 3:
        //     viewGroupByBranch({val,id})
        //    break;
    
       
    }
    
})
    


$('body').on('click','.riportOn',function(){
    $('.riportOn').addClass('btn-light')
    $(this).removeClass('btn-light')
    $(this).addClass('btn-primary')
    $('.riportOn').data('riport',Number($(this).data('r')))
    AddRow()
})

function Descriptive(val){
    const {itms,ankara} = val,

          Usage =itms.filter(pr=>pr.mfg==null && pr.tumika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
          Wastes =itms.filter(pr=>pr.potea).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),                
          expire =itms.filter(pr=>pr.expire).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),                
          Mnf =itms.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
          haribika =itms.filter(pr=>pr.haribika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
          tot = itms.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0)
        
       let tr=  `<tr class="usage" >
                        <td class="text-left">${lang('Matumizi','Usage')}</td>
                        <td>${ankara.filter(ad=>ad.tumika&& ad.production_id===null).length}</td>
                        <td>${floatValue(Usage)}</td>
                        <td>${floatValue(Usage*100/tot)}%</td>
                </tr>  
                
                <tr class="production" > 
                        <td class="text-left">${lang('Uzalishaji','Production')}</td>
                        <td>${ankara.filter(ad=>ad.production_id!=null).length}</td>
                        <td>${floatValue(Mnf)}</td>
                        <td>${floatValue(Mnf*100/tot)}%</td>
                </tr>
                <tr class="wastes" >
                        <td class="text-left">${lang('Kupotea','Wastes')}</td>
                        <td>${ankara.filter(ad=>ad.potea).length}</td>
                        <td>${floatValue(Wastes)}</td>
                        <td>${floatValue(Wastes*100/tot)}%</td>
                </tr>
                <tr  class="expire" >
                        <td class="text-left">${lang('Kupitwa Muda','Expire')}</td>
                        <td>${ankara.filter(ad=>ad.expire).length}</td>
                        <td>${floatValue(expire)}</td>
                        <td>${floatValue(expire*100/tot)}%</td>
                <tr class="damage" >                                
                        <td class="text-left">${lang('Kuharibika','Damage')}</td>
                        <td>${ankara.filter(ad=>ad.haribika).length}</td>
                        <td>${floatValue(haribika)}</td>
                        <td>${floatValue(haribika*100/tot)}%</td>

                  </tr> 
                <tr class="weight600 manunuzi" >                                
                        <td class="text-left">${lang('Jumla','Total')}</td>
                        <td>${ankara.length}</td>
                        <td>${floatValue(tot)}</td>
                        <td>${floatValue(tot*100/tot)}%</td>

                  </tr> 
                  
                  `

                  $('#descripition_table').html(tr)

}

function placeInvo(ankara,itms,muda){
    $('#riportMap').text(lang('Siku','Days'))
    
    const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
         Wvat = withVat(),
        dates = [...new Set(ankara.map(i=>i.Recodeddate))].sort(),
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],
        mAmount= months.map(dt=>monthArr(dt)),
        amounts = dates.map(dt=>chartDt(dt)),
        fro = moment(muda.from),
        to   = moment(muda.to),  
        days = Number(to.diff(fro,'days')) + 1  
       
       
  

       function monthArr(mth){
           const mthf = l=>Number(moment(l.Recodeddate).format('YYYYMM'))===Number(mth),
                invo = ankara.filter(mthf),
                itmz = itms.filter(l=>Number(moment(l.date).format('YYYYMM'))===Number(mth))
            //    itmz = Wvat==0?itmz:Wvat==1?itmz.filter(v=>v.vat_set):itmz.filter(v=>!v.vat_set)
              

           return {
               month:moment(invo[0].Recodeddate).format('MMMM, YYYY'),
               invo:invo,
               from:invo.map(d=>d.tarehe).sort()[0],
               to:invo.map(d=>d.tarehe).sort()[invo.length - 1],

               usage:itmz.filter(pr=>pr.mfg==null && pr.tumika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
               Wastes:itmz.filter(pr=>pr.potea).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
               expire:itmz.filter(pr=>pr.expire).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
               Mnf:itmz.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
               damage:itmz.filter(pr=>pr.haribika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
             
               cost:itmz.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
           
           }
       }


       



          function chartDt(dt){
               const invo = ankara.filter(l=>l.Recodeddate===dt),
                     itmz = itms.filter(i=>i.date===dt)

               return { 
                        date:dt,
                        from:invo[0].tarehe,
                        to:invo[invo.length - 1].tarehe,
                        invo:invo,
                        
                        usage:itmz.filter(pr=>pr.mfg==null && pr.tumika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
                        Wastes:itmz.filter(pr=>pr.potea).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
                        expire:itmz.filter(pr=>pr.expire).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
                        Mnf:itmz.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
                        damage:itmz.filter(pr=>pr.haribika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
                     
                        cost:itmz.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
                      
                     
                       }
          }  


 

   //    
   $('#howMany').text(`${dates.length}/${days}`)

    if(LoC){

               //Draw new Chart................................................................................................................./
               let title = `<h6 class="py-2" >${lang(`Takwimu ya Marekebisho ya Kupunguza Bidhaa kwa kila `,`Stock Adjustment By Reducing Statistics on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
               
               $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
                
                   
               var canvas = document.getElementById('myChartC');
               var ctx = canvas.getContext('2d');
               var data= {
                       labels: days<=31?amounts.map(d=>moment(d.date).format('ddd, DD-MM-YYYY')):mAmount.map(m=>m.month),
                       datasets: [ {
                               label: lang("Thamani","Worth"),
                               fill: true,
                               lineTension: 0,
                               backgroundColor: "rgba(160, 57, 49, 0.15)",
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
              let   td=  `<table id="InvoRiportTable" class="table table-bordered table-hover smallFont" style="width:100%">
               <thead>
                   <tr class="smallFont ">
                       <th>#</th>
                       <th>${days<=31?lang('Tarehe','Date'):lang('Mwezi','Month')}</th>
                       <th> ${lang('Kutumika','Usage')}<span class="text-primary latoFont">(${currencii})</span> </th>
                       <th> ${lang('Uzalishaji','Production')}<span class="text-primary latoFont">(${currencii})</span> </th>
                       <th> ${lang('Kupotea','Wastes')}<span class="text-primary latoFont">(${currencii})</span> </th>
                       <th> ${lang('Kuharibika','Damage')}<span class="text-primary latoFont">(${currencii})</span> </th>
                       <th> ${lang('Kupitwa Muda','Expired')}<span class="text-primary latoFont">(${currencii})</span> </th>

                       <th> ${lang('Jumla','Total')}<span class="text-primary latoFont">(${currencii})</span> </th>
                     
                       <th> ${lang('Notisi','Note')}</th>
                    
                     
                    
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
                     <td>${floatValue(a.usage)}</td>
                     <td>${floatValue(a.Mnf)}</td>
                     <td>${floatValue(a.Wastes)}</td>
                     <td>${floatValue(a.damage)}</td>
                     <td>${floatValue(a.expire)}</td>
                     <td>${floatValue(a.cost)}</td>
                    
                     <td> <button data-from="${a.from}" data-to="${a.to}" class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.invo.length)}</button></td>
                    
                   
                   
                     `
               })

       td+=`</tbody>
       </table>
       `   
       
   let title = `<h6 class="py-2" >${lang(`Orodha ya Marekebisho ya Kupunguza Bidhaa kwa kila `,`Stock Adjustment By Reducing List on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
     

       $('#theDataPanel').html(`${title} ${td}`)
       

       $('#InvoRiportTable').DataTable();
    }


}
 
function   placeItems(itms,val){
    const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        bd = [... new Set(itms.map(i=>i.bidhaa))],
        bidhaa = bd.map(b=>theItms(b)),
        Tawi  = branch()
        

        function theItms(b){
            const itm = itms.filter(i=>i.bidhaa === b),
                //   prod = [...  new Set(itm.map(it=>it.prod_id))].map(it=>{const prd =itm.filter(pr=>pr.prod_id===it)[0];return{prod:prd.prod_id,qty:prd.shelf,bei:prd.thamani,uwiano:prd.uwiano}}),
                  bei = [... new Set(itm.map(t=>t.thamani/t.uwiano))],
                  beiAv = bei.reduce((a,b)=> a + Number(b),0)/bei.length    
                  return {
                id:b,
                name:itm[0].bidhaaN,
                vipimo:itm[0].kipimo,

                bei:beiAv,

                // shelf:prod.reduce((a,b)=> a + Number(b.qty),0),
                // shelftha:prod.reduce((a,b)=> a + (b.bei*(b.qty)/b.uwiano),0),
                          
                tha:itm.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
                qty:itm.reduce((a,b)=> a + Number(b.qty),0),

                usage:itm.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
                usageqty:itm.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + Number(b.qty),0),
                
                Wastes:itm.filter(pr=>pr.potea).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
                Wastesqty:itm.filter(pr=>pr.potea).reduce((a,b)=> a + Number(b.qty),0), 

                expire:itm.filter(pr=>pr.expire).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
                expireqty:itm.filter(pr=>pr.expire).reduce((a,b)=> a + Number(b.qty),0),

                Mnf:itm.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
                Mnfqty:itm.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + Number(b.qty),0),

                damage:itm.filter(pr=>pr.haribika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),  
                damageqty:itm.filter(pr=>pr.haribika).reduce((a,b)=> a + Number(b.qty),0),  

                tawi:tawi = [... new Set(itm.map(i=>i.duka))].length,

                dtI:itm
            }
        }

        bidhaaState.state = bidhaa

        if(LoC){

            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${lang(`Takwimu ya Marekebisho ya kupunguza ya kila Bidhaa `,`Stock adjustment by Reducing Statistics on each Item  `)}, ${duraTitle}<h6/>`
            $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: bidhaa.map(b=>b.name),
                    datasets: [
                        {
                            label: lang("Thamani","Worth"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "rgba(160, 57, 49, 0.45)",
                            borderColor: "brown", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.tha).toFixed(FIXED_VALUE)),
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
            td=  `<table id="SoldItems" class="table table-hover table-bordered smallFont" style="width:100%">
        <thead>
        <tr class="smallFont latoFont">
                        <th rowspan=3 >#</th>

                        <th rowspan=3 >${lang('Bidhaa','Item')}</th>`
                    
                        if(Tawi==0){
                            td+=`<th rowspan=3  >${lang('Matawi','Branches')}</th>`
                        }
                        
                        
                      td+= `<th rowspan=3 >${lang('vipimo','Units')}</th>

                        <th rowspan=3 >${lang('Thamani','Worth')}</th>
                        
                        <tr class="smallFont latoFont">
                            
                            <th class="usage" colspan=2 >${lang('Matumizi','Usage')}</th>
                            <th class="production" colspan=2> ${lang('Uzalishaji','Manufacturing')}</th>

                            <th class="wastes" colspan=2 >${lang('Kupotea','Wastage')}</th>
                            
                            <th class="expire" colspan=2 >${lang('Kupita Muda','Expired')}</th>
                            <th class="damage" colspan=2 >${lang('Kuharibika','Damage')}</th>

                        
                            <th class="usage" colspan=2> ${lang('Jumla','Total')}</th>
                        </tr>

                        <tr class="smallFont latoFont">
                            <th class="usage"> ${lang('Idadi','Quantity')} </th>
                            <th class="usage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                            <th class="production"> ${lang('Idadi','Quantity')} </th>
                            <th class="production"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                            <th class="wastes"> ${lang('Idadi','Quantity')} </th>
                            <th class="wastes"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                            <th class="expire"> ${lang('Idadi','Quantity')} </th>
                            <th class="expire"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                            <th class="damage"> ${lang('Idadi','Quantity')} </th>
                            <th class="damage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>

                            <th class="usage"> ${lang('Idadi','Quantity')} </th>
                            <th class="usage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                            
                    
                    
                        </tr>
    

    </tr>
</thead>
        <tbody id="products_list">`,
        num = 0
        
        
        bidhaa.reverse().forEach(a=>{
            num+=1
            td+=`
            
            <tr>
              <td>${num}</td>
             
              <td class="text-capitalize noWordCut" >${a.name}</td>

              `
            if(Tawi==0){
                td+=`<td> <button data-val="${val}" data-itm="${a.id}" data-tawi=${Number(a.tawi)} data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>`
            }
            td+=  `

              <td class="text-primary" >${a.vipimo}</td>

              <td  >${floatValue(a.bei)}</td>

              <td class="weight600 usage" >${Number(a.usageqty).toFixed(FIXED_VALUE)}</td>
              <td class=" usage">${floatValue(a.usage)}</td>

              <td class="weight600 production" >${Number(a.Mnfqty).toFixed(FIXED_VALUE)}</td>
              <td class=" production">${floatValue(a.Mnf)}</td>

              <td class="weight600 wastes" >${Number(a.Wastes).toFixed(FIXED_VALUE)}</td>
              <td class=" wastes">${floatValue(a.Wastesqty)}</td>

              <td class="weight600 expire" >${Number(a.expireqty).toFixed(FIXED_VALUE)}</td>
              <td class=" expire">${floatValue(a.expire)}</td>

              <td class="weight600 damage" >${Number(a.damageqty).toFixed(FIXED_VALUE)}</td>
              <td class=" damage">${floatValue(a.damage)}</td>

              <td class="weight600 usage" >${Number(a.qty).toFixed(FIXED_VALUE)}</td>
              <td class=" usage">${floatValue(a.tha)}</td>

            

              </tr>
             `
           
              
           
          
        })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2" >${lang(`Orodha ya Marekebisho ya Kupunguza kwa kila Bidhaa `,`Stock Adjustment by Reducing List on each Item `)} , ${duraTitle}<h6/>`
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
            const itm = itms.filter(i=>i.aina === b)
            return {
                id:b,
                name:aina.filter(a=>a.id===b)[0].aina,
                tha:itm.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
           

                        usage:itm.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
                        
                        Wastes:itm.filter(pr=>pr.potea).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 

                        expire:itm.filter(pr=>pr.expire).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),

                        Mnf:itm.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 

                        damage:itm.filter(pr=>pr.haribika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),  
                     
                    }
        }


        if(LoC){

            //Draw new Chart................................................................................................................./
            let title = `<h6 class="py-2 " >${lang(`Takwimu ya Marekebisho kwa Kupunguza bidhaa kwa kila Aina ya Bidhaa `,`Stock Adjustment By Reducing Statistics on each Item Category  `)}, ${duraTitle}<h6/>`
            $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

                   
            var canvas = document.getElementById('myChartC');
            var ctx = canvas.getContext('2d');
            var data= {
                    labels: bidhaa.map(b=>b.name),
                    datasets: [{
                        label:lang("Matumizi","Usage"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: bidhaa.map(a=>a.usage),
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
                        ,

                        {
                           label: lang("Uzalishaji","Manufacturing"),
                           fill: true,
                           lineTension: 0,
                           backgroundColor: "rgba(202, 209, 104, 0.589)",
                           borderColor: "rgba(202, 209, 104, 0.9)", // The main line color
                       
                           // notice the gap in the data and the spanGaps: false
                           data:bidhaa.map(a=>Number(a.Mnf).toFixed(FIXED_VALUE)),
                           spanGaps: false,
                       }
                       ,{
                            label: lang("Kuharibika","Damage"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "rgba(160, 57, 49, 0.589)",
                            borderColor: "rgba(160, 57, 49, 0.9)", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.damage).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Kupotea","Wastes"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "rgba(243, 47, 33, 0.589)",
                            borderColor: "rgba(243, 47, 33, 0.9)", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.Wastes).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Kupita Muda","Expired"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "rgba(145, 82, 11, 0.589)",
                            borderColor: "rgba(145, 82, 11, 0.9)", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:bidhaa.map(a=>Number(a.expire).toFixed(FIXED_VALUE)),
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
            let   td=  `<table id="InvoRiportTable" class="table table-bordered table-hover smallFont" style="width:100%">
            <thead>
                <tr class="smallFont ">
                    <th>#</th>
                    <th>${lang('Aina','Category')}</th>
                    <th> ${lang('Kutumika','Usage')}<span class="text-primary latoFont">(${currencii})</span> </th>
                    <th> ${lang('Uzalishaji','Production')}<span class="text-primary latoFont">(${currencii})</span> </th>
                    <th> ${lang('Kupotea','Wastes')}<span class="text-primary latoFont">(${currencii})</span> </th>
                    <th> ${lang('Kuharibika','Damage')}<span class="text-primary latoFont">(${currencii})</span> </th>
                    <th> ${lang('Kupitwa Muda','Expired')}<span class="text-primary latoFont">(${currencii})</span> </th>

                    <th> ${lang('Jumla','Total')}<span class="text-primary latoFont">(${currencii})</span> </th>
                  
                   
                 
                  
                 
                </tr>
            </thead>
            <tbody id="products_list">`,
            num = 0
            
            
            bidhaa.reverse().forEach(a=>{
                num+=1
               
                td+=`<tr>
                  <td>${num}</td>
                 
                  <td class="noWordCut" >${a.name}</td>
                  <td>${floatValue(a.usage)}</td>
                  <td>${floatValue(a.Mnf)}</td>
                  <td>${floatValue(a.Wastes)}</td>
                  <td>${floatValue(a.damage)}</td>
                  <td>${floatValue(a.expire)}</td>
                  <td>${floatValue(a.tha)}</td>
                 
                 
                
                
                  `
            })

    td+=`</tbody>
    </table>
    `   
let title = `<h6 class="py-2 " >${lang(`Orodha ya Marekebisho ya Kupunguza Bidhaa ya kila Aina ya Bidhaa `,`Stock Adjustment By Reducing List on each Item Category  `)}, ${duraTitle}<h6/>`
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
       let itm = itms.filter(i=>i.kundi === b)
       return {
           id:b,
           name:aina.filter(a=>a.id===b)[0]?.mahitaji,
         
           tha:itm.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
           
           usage:itm.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
           
           Wastes:itm.filter(pr=>pr.potea).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 

           expire:itm.filter(pr=>pr.expire).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),

           Mnf:itm.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 

           damage:itm.filter(pr=>pr.haribika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),  
        
       }
   }


   if(LoC){

       //Draw new Chart................................................................................................................./
       let title = `<h6 class="py-2 " >${lang(`Takwimu ya Marekebisho kwa Kupunguza Bidhaa kwa kila Kundi la Bidhaa `,`Stock Adjustment By Reducing Statistics on each Items Group  `)}, ${duraTitle}<h6/>`
       $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

              
       var canvas = document.getElementById('myChartC');
       var ctx = canvas.getContext('2d');
       var data= {
               labels: bidhaa.map(b=>b.name),
               datasets: [{
                label:lang("Matumizi","Usage"),
                fill: true,
                lineTension: 0,
                backgroundColor: "#1a8cff",
                borderColor: "#1a8cff", // The main line color
                
                // notice the gap in the data and the spanGaps: true
                data: bidhaa.map(a=>a.usage),
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
                ,

                {
                   label: lang("Uzalishaji","Manufacturing"),
                   fill: true,
                   lineTension: 0,
                   backgroundColor: "rgba(202, 209, 104, 0.589)",
                   borderColor: "rgba(202, 209, 104, 0.9)", // The main line color
               
                   // notice the gap in the data and the spanGaps: false
                   data:bidhaa.map(a=>Number(a.Mnf).toFixed(FIXED_VALUE)),
                   spanGaps: false,
               }
               ,{
                    label: lang("Kuharibika","Damage"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "rgba(160, 57, 49, 0.589)",
                    borderColor: "rgba(160, 57, 49, 0.9)", // The main line color
                
                    // notice the gap in the data and the spanGaps: false
                    data:bidhaa.map(a=>Number(a.damage).toFixed(FIXED_VALUE)),
                    spanGaps: false,
                }
               ,{
                    label: lang("Kupotea","Wastes"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "rgba(243, 47, 33, 0.589)",
                    borderColor: "rgba(243, 47, 33, 0.9)", // The main line color
                
                    // notice the gap in the data and the spanGaps: false
                    data:bidhaa.map(a=>Number(a.Wastes).toFixed(FIXED_VALUE)),
                    spanGaps: false,
                }
               ,{
                    label: lang("Kupita Muda","Expired"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "rgba(145, 82, 11, 0.589)",
                    borderColor: "rgba(145, 82, 11, 0.9)", // The main line color
                
                    // notice the gap in the data and the spanGaps: false
                    data:bidhaa.map(a=>Number(a.expire).toFixed(FIXED_VALUE)),
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
                           labelString: `${lang(`Thamani`,`Worth`)}(${currencii}) `,
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
                           labelString:lang('Makundi ya Aina','Categories Groups'),
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
    let   td=  `<table id="InvoRiportTable" class="table table-bordered table-hover smallFont" style="width:100%">
    <thead>
        <tr class="smallFont ">
            <th>#</th>
            <th>${lang('Kundi','Gruop')}</th>
            <th> ${lang('Kutumika','Usage')}<span class="text-primary latoFont">(${currencii})</span> </th>
            <th> ${lang('Uzalishaji','Production')}<span class="text-primary latoFont">(${currencii})</span> </th>
            <th> ${lang('Kupotea','Wastes')}<span class="text-primary latoFont">(${currencii})</span> </th>
            <th> ${lang('Kuharibika','Damage')}<span class="text-primary latoFont">(${currencii})</span> </th>
            <th> ${lang('Kupitwa Muda','Expired')}<span class="text-primary latoFont">(${currencii})</span> </th>

            <th> ${lang('Jumla','Total')}<span class="text-primary latoFont">(${currencii})</span> </th>
          
           
         
          
         
        </tr>
    </thead>
    <tbody id="products_list">`,
    num = 0
    
    
    bidhaa.reverse().forEach(a=>{
        num+=1
       
        td+=`<tr>
          <td>${num}</td>
         
          <td class="noWordCut" >${a.name}</td>
          <td>${floatValue(a.usage)}</td>
          <td>${floatValue(a.Mnf)}</td>
          <td>${floatValue(a.Wastes)}</td>
          <td>${floatValue(a.damage)}</td>
          <td>${floatValue(a.expire)}</td>
          <td>${floatValue(a.tha)}</td>
         
         
        
        
          `
    })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >${lang(`Orodha ya Marekebisho ya Kupunguza Bidhaa kwa kila Kundi la Bidhaa `,`Stock Adjustment By Reducing List on each Item Group  `)}, ${duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
   }

}


function viewList(muda){
    const  dt =  theData.state.filter(i=>moment(i.from)<=moment(muda.from)&&moment(i.To)>=moment(muda.to))
    if(dt.length>0){
         const ft = i=>  moment(i.date).startOf('day').format() >= moment(muda.from).startOf('day').format()&& moment(i.date).endOf('day').format() <= moment(muda.to).endOf('day').format() ,
          theDT = dt[0],
          vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),
        
          Df = i => !i.online,  Lf = i=>i.online,Na = ByU(),Tawi = branch(),Wvat=withVat(),

          //  BRANCH SELECTOR FILTER
          ankara= Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)===Tawi).filter(ft),
          itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)===Tawi).filter(ft)

          tr = `<table id="table-Invoices" class="table-hover table table-bordered smallFont" style="width:100%">
                   <thead>
                        <tr class="smallerFont ">
                            
                            <th>#</th>
                            <th> ${lang('Marekebisho','Adjustment')}</th>
                            <th> ${lang('Tarehe Muda','DateTime')}</th>
                            <th> ${lang('Aina','Type')}</th> 
                            <th> ${lang('Thamani ya Bidhaa','Item(s) Worth')}<span class="text-primary latoFont">(${currencii})</span></th> 
                            <th> ${lang('Na','By')}</th>
                            <th>Action</th>
                        </tr>
                    </thead></tbody>`,n=0

                    

                ankara.reverse().forEach(a=>{
                    n+=1
                    const itmz =itms.filter(n=>n.adjst_id === a.id),

                         tha = itmz.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0)
                                                
                    tr+= `<tr> 
                      <td>${n}</td>
                      <td>ADJ-${a.code}</td>
                      <td>${moment(a.date).format('DD/MM/YYYY HH:mm')}</td>
                      <td class="text-capitalize" >${a.haribika?lang('Kuaribika','Damage'):a.expire?lang('Kupita Muda','Expired'):a.tumika&&a.production_id==null?lang('Kutumika','Usage'):a.production_id!=null?lang('Uzalishaji','Manufacturing'):a.potea?lang('Upotevu','Wastage'):lang('Mengineyo','Others')}</td>
                      <td  >${floatValue(tha)}</td>
                     
                      <td class="text-capitalize">${a.f_name} ${a.l_name}</td>
                    
                      <td>
                        <button type="button" data-val=${a.id} data-tot=${tha} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm border0 viewAdj smallerFont btn-light" title="${lang('Onesha Notisi','View Note')}">
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

                    

                    
                  
                   title = `<h6 class="py-2 " >${lang(`Orodha ya Notisi za Marekebisho ya Kupunguza Bidhaa`,`Stock Adjustment By Reducing List on`)},<span class="darkblue"> ${dur}</span><h6/>`
 
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
    

       itms =idt.dtI,

       tw =[...new Set(itms.map(m=>m.duka))], 
       matawi = tw.map(t=>formT(t))
    
    
    
       console.log(val)
    
    
    
        function formT(t){
            const ft=d=>d.duka==t,
            itm = itms.filter(ft)
            bei = [... new Set(itm.map(t=>t.thamani/t.uwiano))],
            beiAv = bei.reduce((a,b)=> a + Number(b),0)/bei.length    

            return {
          id:t,
          name:itm[0].dukaN,
          vipimo:itm[0].kipimo,

          bei:beiAv,

          // shelf:prod.reduce((a,b)=> a + Number(b.qty),0),
          // shelftha:prod.reduce((a,b)=> a + (b.bei*(b.qty)/b.uwiano),0),
                    
          tha:itm.reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
          qty:itm.reduce((a,b)=> a + Number(b.qty),0),

          usage:itm.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
          usageqty:itm.filter(pr=>pr.mfg===null && pr.tumika).reduce((a,b)=> a + Number(b.qty),0),
          
          Wastes:itm.filter(pr=>pr.potea).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
          Wastesqty:itm.filter(pr=>pr.potea).reduce((a,b)=> a + Number(b.qty),0), 

          expire:itm.filter(pr=>pr.expire).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),
          expireqty:itm.filter(pr=>pr.expire).reduce((a,b)=> a + Number(b.qty),0),

          Mnf:itm.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0), 
          Mnfqty:itm.filter(pr=>pr.mfg!=null).reduce((a,b)=> a + Number(b.qty),0),

          damage:itm.filter(pr=>pr.haribika).reduce((a,b)=> a + (b.thamani*(b.qty)/b.uwiano),0),  
          damageqty:itm.filter(pr=>pr.haribika).reduce((a,b)=> a + Number(b.qty),0),  

         // tawi:tawi = [... new Set(itm.map(i=>i.duka))].length,

       
                
    
            }
        }
    
        function summary(){
            const {bei,qty:idadi,kipimo,Mnf,Mnfqty,damage,damageqty,expire,expireqty,Wastes,Wastesqty,usage,usageqty,tha} = idt
            let  cost=0,  summary = `
                    <div class="row mx-0" >
                     
                 <div class=" col-12 weight500 mt-2" >${lang('Ufupisho','Summary')}</div>
                <div class ="col-md-6  col-sm-8 mx-0 px-0">
                    
                   
                    
                    <table class="border   latoFont table table-sm table-hover "  >
                    <tr class="smallFont text-left" >
                        <th>${lang('Marekebisho','Adjustment')}</th>
                                           
                        <th>${lang('idadi','Quantity')} (<span class="darkblue">${kipimo}</span>) </th>
                        <th>${lang('Thamani Jumla','Net Worth')}(<span class="text-primary weight400 smallerFont">${currencii}</span>)</th>
                        <th>%</th> 
                        </tr>    
                        <tbody class="cursor-pointer p-3" >
                      
                                   <tr class="usage" >
                                   <td class="text-left">${lang('Matumizi','Usage')}</td>
                                   <td>${usageqty}</td>
                                   <td>${floatValue(usage)}</td>
                                   <td>${floatValue(usageqty*100/idadi)}%</td>
                           </tr>  
                           
                           <tr class="production" > 
                                   <td class="text-left">${lang('Uzalishaji','Production')}</td>
                                   <td>${Mnfqty}</td>
                                   <td>${floatValue(Mnf)}</td>
                                   <td>${floatValue(Mnfqty*100/idadi)}%</td>
                           </tr>
                           <tr class="wastes" >
                                   <td class="text-left">${lang('Kupotea','Wastes')}</td>
                                   <td>${Wastesqty}</td>
                                   <td>${floatValue(Wastes)}</td>
                                   <td>${floatValue(Wastesqty*100/idadi)}%</td>
                           </tr>
                           <tr  class="expire" >
                                   <td class="text-left">${lang('Kupitwa Muda','Expire')}</td>
                                   <td>${expireqty}</td>
                                   <td>${floatValue(expire)}</td>
                                   <td>${floatValue(expireqty*100/idadi)}%</td>
                           <tr class="damage" >                                
                                   <td class="text-left">${lang('Kuharibika','Damage')}</td>
                                   <td>${damageqty}</td>
                                   <td>${floatValue(damage)}</td>
                                   <td>${floatValue(damageqty*100/idadi)}%</td>
           
                             </tr> 
                           <tr class="weight600 manunuzi" >                                
                                   <td class="text-left">${lang('Jumla','Total')}</td>
                                   <td>${idadi}</td>
                                   <td>${floatValue(tha)}</td>
                                   <td>${floatValue(tha*100/tha)}%</td>
           
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
                        label:lang("Matumizi","Usage"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: matawi.map(a=>a.usage),
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
                        ,

                        {
                           label: lang("Uzalishaji","Manufacturing"),
                           fill: true,
                           lineTension: 0,
                           backgroundColor: "rgba(202, 209, 104, 0.589)",
                           borderColor: "rgba(202, 209, 104, 0.9)", // The main line color
                       
                           // notice the gap in the data and the spanGaps: false
                           data:matawi.map(a=>Number(a.Mnf).toFixed(FIXED_VALUE)),
                           spanGaps: false,
                       }
                       ,{
                            label: lang("Kuharibika","Damage"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "rgba(160, 57, 49, 0.589)",
                            borderColor: "rgba(160, 57, 49, 0.9)", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.damage).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Kupotea","Wastes"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "rgba(243, 47, 33, 0.589)",
                            borderColor: "rgba(243, 47, 33, 0.9)", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.Wastes).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Kupita Muda","Expired"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "rgba(145, 82, 11, 0.589)",
                            borderColor: "rgba(145, 82, 11, 0.9)", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.expire).toFixed(FIXED_VALUE)),
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
            td=  `<table id="SoldItems" class="table table-hover table-bordered smallFont" style="width:100%">
            <thead>
            <tr class="smallFont latoFont">
                            <th rowspan=3 >#</th>
    
                            <th rowspan=3 >${lang('Tawi','Branch')}</th>
                            <th rowspan=3 >${lang('vipimo','Units')}</th>
    
                            <th rowspan=3 >${lang('Thamani','Worth')}</th>
                            
                            <tr class="smallFont latoFont">
                                
                                <th class="usage" colspan=2 >${lang('Matumizi','Usage')}</th>
                                <th class="production" colspan=2> ${lang('Uzalishaji','Manufacturing')}</th>
    
                                <th class="wastes" colspan=2 >${lang('Kupotea','Wastage')}</th>
                                
                                <th class="expire" colspan=2 >${lang('Kupita Muda','Expired')}</th>
                                <th class="damage" colspan=2 >${lang('Kuharibika','Damage')}</th>
    
                            
                                <th class="usage" colspan=2> ${lang('Jumla','Total')}</th>
                            </tr>
    
                            <tr class="smallFont latoFont">
                                <th class="usage"> ${lang('Idadi','Quantity')} </th>
                                <th class="usage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
    
                                <th class="production"> ${lang('Idadi','Quantity')} </th>
                                <th class="production"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
    
                                <th class="wastes"> ${lang('Idadi','Quantity')} </th>
                                <th class="wastes"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
    
                                <th class="expire"> ${lang('Idadi','Quantity')} </th>
                                <th class="expire"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
    
                                <th class="damage"> ${lang('Idadi','Quantity')} </th>
                                <th class="damage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
    
                                <th class="usage"> ${lang('Idadi','Quantity')} </th>
                                <th class="usage"> ${lang('Thamani','Worth')} <span class="text-primary latoFont">(${currencii})</span> </th>
                                
                        
                        
                            </tr>
        
    
        </tr>
    </thead>
            <tbody id="products_list">`,
            num = 0
            
            
            matawi.reverse().forEach(a=>{
                num+=1
                td+=`
                
                <tr>
                  <td>${num}</td>
                 
                  <td class="text-capitalize weight500 darkblue noWordCut" ><u>${a.name}</u></td>
    
    
                  <td class="text-primary" >${a.vipimo}</td>
    
                  <td  >${floatValue(a.bei)}</td>
    
                  <td class="weight600 usage" >${Number(a.usageqty).toFixed(FIXED_VALUE)}</td>
                  <td class=" usage">${floatValue(a.usage)}</td>
    
                  <td class="weight600 production" >${Number(a.Mnfqty).toFixed(FIXED_VALUE)}</td>
                  <td class=" production">${floatValue(a.Mnf)}</td>
    
                  <td class="weight600 wastes" >${Number(a.Wastes).toFixed(FIXED_VALUE)}</td>
                  <td class=" wastes">${floatValue(a.Wastesqty)}</td>
    
                  <td class="weight600 expire" >${Number(a.expireqty).toFixed(FIXED_VALUE)}</td>
                  <td class=" expire">${floatValue(a.expire)}</td>
    
                  <td class="weight600 damage" >${Number(a.damageqty).toFixed(FIXED_VALUE)}</td>
                  <td class=" damage">${floatValue(a.damage)}</td>
    
                  <td class="weight600 usage" >${Number(a.qty).toFixed(FIXED_VALUE)}</td>
                  <td class=" usage">${floatValue(a.tha)}</td>
    
                
    
                  </tr>
                 `
               
                  
               
              
            })
    
    td+=`</tbody>
    </table>
    `   
     
    
    placedataPanel.html(td)
    $('#SoldItems').DataTable();
        }
    
        
     
        placedataPanel.prepend(`<h6 id="itmTitle" class="py-3" data-itm=${id} data-val=${val} data-num=1 >${lang('Marekebisho ya Kupunguza Bidhaa kwa','Stock Adjustment By Reducing for')} <i class="darkblue text-capitalize">${itms[0].bidhaaN}</i>  ${lang('Kwa kila Tawi','In each branch')}</h6> ${summary()}`)
    
        $('.riportOn').addClass('btn-light')
        $('.riportOn').removeClass('btn-primary')
    
    
}

$('body').on('click','.viewAdj',function(){    
    $('#IfPaid').hide()
    $('#ifFidia').html('')
  
  const val = $(this).data('val'),
  worth =   Number($(this).data('tot')),  
  data={
     data:{
     val:val,
     csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
  },
  url:'/riport/theReduceAdj' 
  }, fct = getRiportData(data)
  
  ADJ_WORTH = worth
  
  $('#Invo_notFound').hide()
  $('#the_invo_page').hide()
  $('#Invo_loader').show()
  
  fct.then(function(data){
  
     $('#Invo_loader').hide()
  
         
  
     if(data.success){
         $('#theInvoAddress').html(theAdjAddress(data.invo))
       $('#ifFidia').html(AdjDesc(data.invo.maelezo))
  
        
  
        theAdjTable(data)
         $('#TheInvoPage').text(floatValue(ADJ_WORTH))
        //  $('#TheInvoBy').text(`${data.invo.f_name} ${data.invo.l_name}`)
  
          $('#adjConfirmData').html(adjConfirm(data.confirm))
  
  
  
  
         $('#the_invo_page').show()
     }else{
         $('#Invo_notFound').show()
  
         toastr.error(lang('Haikufanikiwa kutokana na hitilafu.','The operation was not successfully please try again'), lang('Haikufanikiwa','Error Alert'), {timeOut: 2000});
  
     }
    
  })
  
  
})
  

function theAdjAddress(dt){

  const   usage = `<label for="oda" class="latoFont px-2 py-1 text-light" style="color: #fff;background:rgba(145, 82, 11, 0.884)" >
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24"  fill="currentColor">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M14.77 9L12 12.11 9.23 9h5.54M21 3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9V3zM7.43 7L5.66 5h12.69l-1.78 2H7.43z"/>
                    </svg>
                        ${lang('Matumizi','Usage')} 
                    </label>`,
          damage = `   <label for="oda" class="latoFont  px-2 py-1 text-light" style="background-color: rgba(167, 64, 23, 0.815);color:#fff" >
                            <svg xmlns="http://www.w3.org/2000/svg"  height="18" width="18" viewBox="0 0 24 24"  fill="currentColor">
                                <circle cx="10.5" cy="8.5" r="1.5"/>
                                <circle cx="8.5" cy="13.5" r="1.5"/><circle cx="15" cy="15" r="1"/>
                                <path d="M21.95,10.99c-1.79-0.03-3.7-1.95-2.68-4.22c-2.97,1-5.78-1.59-5.19-4.56C7.11,0.74,2,6.41,2,12c0,5.52,4.48,10,10,10 C17.89,22,22.54,16.92,21.95,10.99z M12,20c-4.41,0-8-3.59-8-8c0-3.31,2.73-8.18,8.08-8.02c0.42,2.54,2.44,4.56,4.99,4.94 c0.07,0.36,0.52,2.55,2.92,3.63C19.7,16.86,16.06,20,12,20z"/>
                            </svg>
                            ${lang('Kuharibika','Damage')}  
                        </label>` ,    
          prodxn = `<label for="oda" class="latoFont px-2 py-1 text-light" style="color: #fff;background:rgba(11, 65, 145, 0.884)" >
          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2zM11 16l4-4-4-4v3H1v2h10v3z"/>
            </svg>
  
             ${lang('Kuzalishia','Production')} 
                    </label>`,
          expire = ` <label for="oda" class="latoFont  px-2 py-1 text-light" style="background-color: rgba(126, 82, 1, 0.575);color:#fff" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18"  height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15,1H9v2h6V1z M11,14h2V8h-2V14z M19.03,7.39l1.42-1.42c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42 C16.07,4.74,14.12,4,12,4c-4.97,0-9,4.03-9,9s4.02,9,9,9s9-4.03,9-9C21,10.88,20.26,8.93,19.03,7.39z M12,20c-3.87,0-7-3.13-7-7 s3.13-7,7-7s7,3.13,7,7S15.87,20,12,20z"/>
                        </svg>
                        ${lang(' Kupitwa na Muda','Expired')}
                    </label>` ,
          wastege =  `<label for="oda" style="background-color: rgb(117, 8, 0);color:#fff" class="latoFont  px-2 py-1 text-light" >
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18"  viewBox="0 0 24 24" fill="currentColor">
                            <path d="M0 0h24v24H0V0z" fill="none"/>
                            <path d="M3 9h2V7H3v2zm0-4h2V3H3v2zm4 16h2v-2H7v2zm0-8h2v-2H7v2zm-4 0h2v-2H3v2zm0 8h2v-2H3v2zm0-4h2v-2H3v2zM7 5h2V3H7v2zm12 12h2v-2h-2v2zm-8 4h2V3h-2v18zm8 0h2v-2h-2v2zm0-8h2v-2h-2v2zm0-10v2h2V3h-2zm0 6h2V7h-2v2zm-4-4h2V3h-2v2zm0 16h2v-2h-2v2zm0-8h2v-2h-2v2z"/>
                            </svg>
                            ${lang('Kupotea','Wastege')} 
                        </label>`   ,
         printConf = ` <a type="button" href="/stoku/printAdjstNames?item_valued=${dt.id}&lang=${lang(0,1)}&back='allBill'" target="_blank" class="btn btn-light btn-sm smallFont">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
                                </svg>
                                        Print
                                
                            </a>
                            
                            <div class="btn-group" role="group">
                                <button id="btnGroupDrop1" type="button" class="btn btn-light btn-sm smallFont dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                </button>
                                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                <a class="dropdown-item" href="/stoku/printAdjstNames?item_valued=${dt.id}&lang=0&back='allBill'" target="_blank">Swahili</a>
                                <a class="dropdown-item" href="/stoku/printAdjstNames?item_valued=${dt.id}&lang=1&back='allBill'" target="_blank">English</a>
                                </div>
                            </div>`                
                        
         $('#PrintUhakiki').html(printConf)               




    return ` <div class="row classic_div pt-3" >
    <div class="col-md-7   border-right">

    <h4 class="text-secondary mt-1 pb-3  border-bottom weight600">
    ${lang('MAREKEBISHO STOKU','STOCK ADJUSTMENT NOTE')}
    </h4>

      <div class="row">
        <div class="text-danger py-1 weight600 col-3">
            ${lang('Stoku','Stock')}  :
        </div> 
        <div class="col-9"  >
           <strong class="text-capitalize" >${dt.duka}</strong> 
           <br>
           <address class="text-capitalize" >
           (${dt.Intp_code}),
           <br>
           ${(dt.mtaa).toLowerCase()}, ${(dt.kata).toLowerCase()}, ${dt.wilaya.toLowerCase()}, ${dt.mkoa.toLowerCase()}, ${dt.nchi.toLowerCase()}


           
           </address>
        </div>                        
      </div>
     

      
      <div class="row">
        <div class="col-3 weight600 text-danger">
           ${lang('Na','By')}: 
        </div>
        <div class="col-9">
          <strong class="text-capitalize" >${dt.f_name}   ${dt.l_name}</strong>
        </div>
      </div>
   
    </div>
 <div class="col-md-5">
     
      <div class="text-md-right " style="margin-top:9px">
         <h6> <strong>  ADJ-${dt.code}</h6> 
      </div>
      <hr>

      <div class="row smallFont" style="margin-top: -6px;">
        <div class="col-5 text-right">
            <p class="text-danger weight600">
                ${lang('Ilirekodiwa','Recorded on')}   
            </p>
        </div>
        <div class="col-7 weight600 text-right">
            <p> 
           
              ${moment(dt.tarehe).format('DD/MM/YYYY  HH:mm')}
                
            </p>
        </div>  
      </div>

   <div class="row smallFont" style="margin-top: -6px;">
    <div class="col-5 text-right">
        <p class="text-danger text-right weight600">
             ${lang('Tarehe','Due date')}   
        </p>
    </div>
    <div class="col-7 weight600 text-right">
        <p>
            
            ${moment(dt.date).format('DD/MM/YYYY')}
        </p>
    </div>
    </div>

    
<div class="row text-right mb-2">
    <div class="col-5 weight600 ">
            ${lang('Aina','Type')}:
    </div>
  <div class="col-7 weight600 smallFont">
    <span class="text-danger ">
            ${lang('Kupunguza Bidhaa ','Reducing Item(s)')}
    </span>
  </div>
</div>

<div class="row text-right">
    <div class="col-5">
        <h6>
          
            ${lang('Sababu','Reason')} :
    
          </h6>
    </div>

  <h6 class="col-7">
       
       ${dt.potea?wastege:dt.mnf>0?prodxn:dt.mnf==0&&dt.tumika?usage:dt.expire?expire:dt.haribika?damage:lang('Mengineyo','Others')}
  </h6>

  </div>


    


 </div>
</div>
<hr>`
}

function AdjDesc(desc){

    return  `
    <div class="text-center py-2" style="border-left:3px solid yellow;background:#f0f8fc">
       
            <div class="p-3 d-inline" style="height: 50px;width:50px;border-radius:50%;color:rgb(191, 230, 253)">
                 <span class="text-info">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                         <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                       </svg>
                 </span>
            </div>|
       <span>${desc}</span>  
        
     </div>
    `
  }

  function theAdjTable(iv){
    $('#ifcolor').hide()
    $('#ifSize').hide()

  
    const itms=iv.itms,
        colors=iv.color,
        sizes=iv.size,
        pr = iv.bei

        if(colors.length>0){
            $('#ifcolor').show()
        }
        if(sizes.length>0){
            $('#ifSize').show()
        }

        

        let rnum=0,tr=``
        itms.forEach(itm=>{
            rnum+=1
            let col = c =>c.itm === itm.val,prc = p =>p.prod ===itm.prod
            
            const colr = colors.filter(col),prices = pr.filter(prc)
            let beis = 0 ,idadis=0,idad=0,vpmo='',sale=0,thamani = Number(itm.bei)/Number(itm.uwiano)
            
            if(itm.prdcd){
              thamani = Number(itm.prCost)
            }

            let prics = [],
                 prc1 = {
                  unit:itm.vipimo,
                  price:Number(itm.bei),
                  qty:1
                 } 

              prics.push(prc1)   

              if(Number(itm.uwiano)>1){
                  prc2={
                       unit:itm.vipimo_jum,
                       price:Number(itm.bei_jum),
                       qty:Number(itm.uwiano)
                  }
                  prics.push(prc2)

              }

              


              prics = [...prics,...pr]


             
               

          
                



            


           tr+=`<tr class="text-center   latoFont" style="padding: 10px 3px !important;">`

       
         if(colr.length==0){

          let prp = b => itm.idadi % b.qty===0,
            prop_price = prics.filter(prp)

            if(prop_price.length == 0){
              prop_price = prics.filter(b=>Number(b.qty)===1)
          }  

           prop_price.sort((a,b)=>(a.qty>b.qty)? 1 :(a.qty ===b.qty)
             ?((a.qty > b.qty)? 1 : -1) : -1 )
           let ps = prop_price[prop_price.length-1]  
                   
                      beis = Number(itm.bei)*Number(ps.qty)

                 

                  vpmo = ps.unit
                  idad = Number(itm.idadi)/Number(ps.qty)

                 

        

     
           
          tr+=`
          <td>${rnum}</td>
          <td class="text-left " > 
            <div class="d-flex">
            <div style="width:40px;height:40px" >`
              if(itm.picha!=''){
               tr+=` <img src="${itm.picha}" style="max-width:100%;max-height:100%"  >`
              }else{
                  tr+=` <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                  </svg>`
              }
          
              
            tr+=`</div>
              <div class="ml-1" >
                <div><strong class="pl-1" style="color: #3989c6"> ${titleCase(itm.jina)}</strong></div>
                <div class="pl-2 text-muted smallerFont itm_desc" style="color:blue">${itm.maelezo}</div>
                <div class="pl-2  smallerFont itm_desc font-weight-bold" >${itm.serial?itm.serial.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, ""):''}</div>
              </div>
            </div>
          </td>` 
          
          if(colors.length>0){
              tr+=`<td style="padding: 10px 3px !important;"> --- </td>` 
          }

          if(sizes.length>0){
            tr+=`<td style="padding: 10px 3px !important;"> --- </td> `
          }

           //REGULATE PRICE FOR VAT.............................//
    
      tr+=`<td style="padding: 10px 3px !important;" >${vpmo}</td>
           ` 

           tr+=`
                 <td style="padding: 10px 3px !important;" class="weight600" > ${Number(thamani*Number(ps.qty)).toLocaleString()}</td> 
                 <td style="padding: 10px 3px !important;" > ${Number(idad).toFixed(2)}</td> 
                 <td style="padding: 10px 3px !important;" class="weight700 brown" > ${Number(idad*thamani*Number(ps.qty)).toLocaleString()}</td> 
                  
          `
       
      }else{
          let span=colr.length+1
               
          if(span==2){
            span=1
          }
          
          tr+=`
          <td class="rnum"  rowspan="${span}">${rnum}</td>
          <td class="text-left  span1" id="span_${itm.val}" rowspan="${span}">
            <div class="d-flex">
            <div style="width:40px;heigth:40px" >`
              if(itm.picha!=''){
                tr+=` <img src="${itm.picha}" style="max-width:100%;max-height:100%"  >`
               }else{
                   tr+=` <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                     <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                     <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                   </svg>`
               }
            tr+=`</div>

            <div class="ml-1" >
              <div><strong class="pl-1" style="color: #3989c6"> ${titleCase(itm.jina)} </strong></div>
              <div class="pl-2 itm_desc text-muted smallerFont" style="color:blue">${itm.maelezo}</div>
             </div>
            </div>
          </td>` 
         
          colr.forEach(col=>{
              let szi = s=> s.color == col.val
              const sz = sizes.filter(szi)

        if(span>2){
             tr+=`<tr class=" text-center  latoFont" style="padding: 10px 3px !important;">`
             }

              if(sz.length==0){
              let prp = b => col.idadi % b.qty===0,
                prop_price = prics.filter(prp)

                if(prop_price.length == 0){
                  prop_price = prics.filter(b=>Number(b.qty)===1)
              }  

               prop_price.sort((a,b)=>(a.qty>b.qty)? 1 :(a.qty ===b.qty)
                 ?((a.qty > b.qty)? 1 : -1) : -1 )
               let ps = prop_price[prop_price.length-1]

              vpmo = ps.unit
              idad = Number(col.idadi)/Number(ps.qty)


         

                tr+=`<td style="padding: 10px 3px !important;" class="smallerFont text-left">
                  <label 
                  style="width:15px;
                  height:15px;
                  background:${col.color_code};
                  border-radius:100%;
                  color:rgba(240, 248, 255, 0);
                  border:1px solid #ccc"
                  >
                  ''
              </label> 
              ${titleCase(col.color_name)}
                </td> `
                if(sizes.length>0){
                tr+=`<td style="padding: 10px 3px !important;"> --- </td> `
                }

                 
                
                tr+=`<td style="padding: 10px 3px !important;" >${vpmo}</td>
                `

              
              tr+=` <td style="padding: 10px 3px !important;" class="weight600" > ${Number(thamani*Number(ps.qty)).toLocaleString()}</td> 
                    <td style="padding: 10px 3px !important;" > ${Number(idad).toFixed(2)}</td> 
                    <td style="padding: 10px 3px !important;" class="weight700 brown" > ${Number(idad*thamani*Number(ps.qty)).toLocaleString()}</td> 
                    
                     `
  
           }else{
              tr+=`<td style="padding: 10px 3px !important;" `
              if(sz.length>1){
                 tr+=` rowspan=${sz.length+1}` 
              }
              
             tr+=` data-itm="${itm.val}" class="span2 smallerFont text-left" >

                  <label 
                  style="width:15px;
                  height:15px;
                  background:${col.color_code};
                  border-radius:100%;
                  color:rgba(240, 248, 255, 0);
                  border:1px solid #ccc"
                  >
                  ''
              </label> 
                  ${titleCase(col.color_name)}</td>` 
               
               sz.forEach(s=>{

                  let prp = b => s.idadi % b.qty===0,
                   prop_price = prics.filter(prp)

                   if(prop_price.length == 0){
                    prop_price = prics.filter(b=>Number(b.qty)===1)
                }  

                   prop_price.sort((a,b)=>(a.qty>b.qty)? 1 :(a.qty ===b.qty)
                     ?((a.qty > b.qty)? 1 : -1) : -1 )
                   let ps = prop_price[prop_price.length-1]
                      beis = Number(itm.bei)*Number(ps.qty)
                  vpmo = ps.unit
                  idad = Number(s.idadi)/Number(ps.qty)
                  sale=Number(itm.sold)*Number(s.idadi)

          if( itm.vat_set){
              //REGULATE MEASUARES.............//
                  beis= (beis/(1+vatper))
                  sales+=Number(itm.sold)/(1+vatper)*Number(s.idadi)
                  sale=sale/(1+vatper)               

          }else{
                  sales+=Number(itm.sold)*Number(s.idadi)

          }
                  sub_tot+=(beis*idad)
                  if(itm.vat_set){
                      total_vat+=sale*vatper
                  }

                if(sz.length>1){
                 tr+=`<tr class="text-center   latoFont" style="padding: 10px 3px !important;"> `
                   
                }   

                 tr+=`<td class="text-center" style="padding: 10px 3px !important;"><span class="text-danger smallFont"> ${s.size}</span></td>` 
                
                 tr+=`<td style="padding: 10px 3px !important;" >${vpmo}</td>
                      `


                     tr+=`   <td style="padding: 10px 3px !important;" class="weight600" > ${Number(thamani*Number(ps.qty)).toLocaleString()}</td> 
                            <td style="padding: 10px 3px !important;" > ${Number(idad).toFixed(2)}</td> 
                            <td style="padding: 10px 3px !important;" class="weight700 brown" > ${Number(idad*thamani*Number(ps.qty)).toLocaleString()}</td> 
                      
                      `
                 if(sz.length>1){
                tr+=`  </tr>`
              }
                 
        
                   
               })
           }
            
           if(span>2){
              tr+=`</tr>`
           }

          })
         
      }

      tr+=`</tr>`




        })  


      $('#view-invo_tbody').html(tr)

      $('.span2').each(function(){
          if(Number($(this).attr('rowspan'))){
          let rowspan=Number($(this).attr('rowspan'))-1,
              parent='#span_'+$(this).data('itm'),
              prow= Number($(parent).attr('rowspan'))
         $(parent).attr('rowspan',prow + rowspan)
         $(parent).siblings('.rnum').attr('rowspan',prow + rowspan)
         }
        //  $(parent).attr('rowspan',Number(parent.attr('rowspan'))+1)
         // console.log(prow)
      })
     
     
//PRINT BILL

  }
  
  function  adjConfirm(dt){
      let tr = ``,num=0



      dt.forEach(c=>{
                const denial = ` <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                                </svg>

                                ${c.desc}`,
                       confirm = `<span class="weight700 " style="font-size: larger;" >
                                    &checkmark;
                                    </span>`         


          tr+=`  <tr>
          <td class=" text-capitalize" scope="row">
           ${num+=1}
         </td>
 
          <td class=" text-capitalize">
            ${c.admin?c.f_name+' '+c.l_name:c.u_name}
         </td>
 
          <td >
            ${c.cheo}
         </td>
         <td>

         ${c.confirmed||c.dinied?moment(c.tarehe).format('DD MMM YYYY HH:mm'):'--------'}
        
         </td>
         <td class="text-center">
              
             ${c.confirmed||c.dinied?c.confirmed?confirm:denial:'---------'}
 
         </td>

         
       </tr>
       `
      })

      return tr
  }
            


