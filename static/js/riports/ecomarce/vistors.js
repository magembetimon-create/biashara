
//Regulate to Datetime if the weekend is greeter than the month end.......................//
const monthStart = moment().startOf('month').format('YYYY-MM-DD'),
      weekStart =  moment().startOf('isoWeek').format('YYYY-MM-DD'),
      StartTime =  monthStart>=weekStart?monthStart:weekStart 
 var N = 0,nvar=1,ITMS = [],itmed = 0,MUDA = {},NAME = '',ITMID = 0
function DuraTable(){
    let dta = {
        data:{ 
                d:0,
                r:1,
                tf:StartTime,
                tt:moment().format('YYYY-MM-DD'),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
            },
            url:'/riport/VistorsData'}

            $("#loadMe").modal('show');

            let fct = getRiportData(dta)

             fct.then(function(data){
                $("#loadMe").modal('hide');
                
                
              
                let leo = moment().startOf('day').format(),
                    wk = moment().startOf('isoWeek').format(),
                    mth = moment().startOf('month').format()

                    const dy = d=>moment(d.date).format()>=leo,wkf=d=>moment(d.date).format()>=wk,mthf=d=>moment(d.date).format()>=mth



                    theData.state = [{
                             id:1,
                             name:lang('Leo','Today'),
                             from:moment().startOf('day').format(),
                             To:moment().format(),
                             txt:`${lang('Leo, Kuanzia<span class="brown">','Today, From<span class="brown">')}(${moment().startOf('day').format('dddd, DD/MM/YYYY HH:mm')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                          
                             dt:data.data.filter(dy), 
                           


                        },
                     { 
                             id:2,
                             name:lang('Wiki hii','This Week'),
                             from:moment().startOf('isoWeek').format(),
                             To:moment().format(),
                             txt:`${lang('Wiki hii,  Kuanzia<span class="brown">','This Week, From<span class="brown">')}(${moment().startOf('isoWeek').format('dddd DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`,   
                         
                           
                             dt:data.data.filter(wkf),
                         

                    
                        },
                     {       
                             id:3, 
                             name:lang('Mwezi huu','This Month'), 
                             from:moment().startOf('month').format(),
                             To:moment().format(),
                             txt:`${lang('Mwezi huu, Kuanzia<span class="brown">','This Month, From<span class="brown">')}(${moment().startOf('month').format('dddd, DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                             
                       
                             dt:data.data.filter(mthf),
                          

                        
                        }]

                        AddRow()
                
                
                


                 
           })

     }


DuraTable()

function visted_vistors(dt){
     const NonUserV = [... new Set(dt.filter(i=>i.user_id===null).map(ip=>ip.ipaddres))],
           UserV = [... new Set(dt.filter(i=>i.user_id!=null).map(ip=>ip.user_id))],
           visted = dt.reduce((a,b)=>a+Number(b.visted),0),
           vistors={
            vistors:Number(NonUserV.length + UserV.length),
            visted:visted
           }

           return vistors
}



function createArray(name,from,to){
    const ft =d=>moment(d.date).format()>=from && moment(d.date).format() <= to
            let dtA = theData.state.filter(d=>d.from<=from && d.To>=to),Adt={}
                dtI=[],dt=[],onlineI=[],directI=[],direct=[],online=[],idn = $('#riportData tr').length

            if(dtA.length>0){
                 Adt = dtA[0]
             
                 dt = Adt.dt.filter(ft)
                

                 theArr(dt,name,from,to)

            }else{

             let dta = {data:{ 
                    d:0,
                    r:1,
                    tf:moment(from).format('YYYY-MM-DD'),
                    tt:moment(to).format('YYYY-MM-DD'),
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                },
                url:'/riport/VistorsData'}
                $("#loadMe").modal('show');
                let fct = getRiportData(dta)

                 fct.then(function(data){
                    $("#loadMe").modal('hide');

                     theArr(data.data,name,from,to)

                 })
                    

            }   

                
           
             
             



            }
function theArr(dt,name,from,to){
let           
            txt = moment().startOf('year').format() == from && moment().endOf('day').format() == moment(to).endOf('day').format() ? `</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>` : `${lang('Hadi<span class="brown smallerFont">(','To<span class="brown smallerFont">(')} ${moment(to).endOf('day').format('dddd, DD/MMM/YYYY HH:mm')})</span>`
             ar= { 
                    id:idn+1, 
                    name:name, 
                    from:from,
                    To:to,
                    txt:`${name},${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(from).startOf('day').format('dddd, DD/MM/YYYY')})</span>, ${txt}`, 
                    dt:dt,
                 
                  
                }

             theData.state.push(ar)
             AddRow()
}        


function AddRow(){
    
 let tr='',n=0,chk='',vali=Number($('#MauzoAina').val())
    if(theData.state.length>0){        
        theData.state.forEach(td=>{
        let Df = i => !i.online,  Lf = i=>i.online,Tawi=branch(),
                //  BRANCH SELECTOR FILTER
                dt= Tawi==0?td.dt:td.dt.filter(d=>Number(d.duka)==Tawi),
                vistors = visted_vistors(dt)
                const   homeP = visted_vistors(dt.filter(h=>h.homePage)),
                    About = visted_vistors(dt.filter(h=>h.AboutPage)),
                    Mapp = visted_vistors(dt.filter(h=>h.MapPage)),
                    RegP = visted_vistors(dt.filter(h=>h.RegPage)),
                    ItemsP = visted_vistors(dt.filter(h=>h.ItemPage_id!=null)),
                    CategP = visted_vistors(dt.filter(h=>h.CategoryPage_id!=null)),
                    GroupP = visted_vistors(dt.filter(h=>h.GroupPage_id!=null)),
                    BrandP = visted_vistors(dt.filter(h=>h.BrandPage_id!=null)), 
                    pages = Number(homeP.visted>0) + Number(About.visted>0) + Number(Mapp.visted>0) + Number(RegP.visted>0) + Number(ItemsP.visted>0) + Number(CategP.visted>0) + Number(GroupP.visted) + Number(BrandP.visted)
                

               
           n+=1 
               
            chk+=` <div class="custom-control smallFont d-inline mx-2 custom-checkbox"  >
                        <input type="checkbox" onchange="$('#dataRow${n}').toggle(100)"  checked name="MonthSale" id="MonthSale${n}" class="custom-control-input" style="cursor: pointer !important;"><label class="custom-control-label" style="cursor: pointer !important;" for="MonthSale${n}">${td.name}</label>
                    </div>`
            let bg=''

        

              if(n>3){
                  bg = 'table-info'
              }

            tr+=`
                <tr class=" ${bg}" id="dataRow${n}">
                <td scope="row">
                   <span class="noWordCut"> ${td.name}</span>
                </td>
            
             
                <td class="brown weight600">${vistors.vistors}</td>

                <td class="brown weight600">${pages}</td>
                
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

     
        
    }

}



function placeDt(val){
        
    let  dt =  theData.state.filter(i=>i.id===val)
          

         if(dt.length>0){
              const  theDT = dt[0],
                 
                  Tawi =branch()
                  //  BRANCH SELECTOR FILTER
                 let itms = theDT.dt
                    itms =Tawi==0?itms:itms.filter(d=>Number(d.duka)===Tawi)
                    duraTitle = theDT.txt
                  //Add time to hidden save riport form...........................//
                  $('#fromT').val(moment(theDT.from).startOf('day').format())                    
                  $('#toT').val(moment(theDT.To).endOf('day').format())      

                   N=val             

                  // RETURN  OFFICERS ...............//


                      
                 $('#riporttitle').html(`${lang('Ufupisho','Summary')}, ${theDT.txt}`) 
                              
                const   homeP = visted_vistors(itms.filter(h=>h.homePage)),
                        About = visted_vistors(itms.filter(h=>h.AboutPage)),
                        Mapp = visted_vistors(itms.filter(h=>h.MapPage)),
                        RegP = visted_vistors(itms.filter(h=>h.RegPage)),
                        ItemsP = visted_vistors(itms.filter(h=>h.ItemPage_id!=null)),
                        CategP = visted_vistors(itms.filter(h=>h.CategoryPage_id!=null)),
                        GroupP = visted_vistors(itms.filter(h=>h.GroupPage_id!=null)),
                        BrandP = visted_vistors(itms.filter(h=>h.BrandPage_id!=null)), 
                        pages = Number(homeP.visted>0) + Number(About.visted>0) + Number(Mapp.visted>0) + Number(RegP.visted>0) + Number(ItemsP.visted>0) + Number(CategP.visted>0) + Number(GroupP.visted) + Number(BrandP.visted),
                       
                        muda={from:theDT.from,to:theDT.To} , 
                        tableData = () =>{
                        let  tr=`<tr>
                                <td>${lang('Mwanzo','Home')} </td>
                                <td>${homeP.vistors} </td>
                                <td>${homeP.visted} </td>
                            </tr>`
                            if(About.visted>0){
                                   tr+= `<tr>
                                    <td>${lang('Kuhusu','About')} </td>
                                    <td>${About.vistors} </td>
                                    <td>${About.visted} </td>
                            </tr>`
                            }
                            if(Mapp.visted>0){
                                tr+= `<tr>
                                        <td>${lang('Ramani','Map')} </td>
                                        <td>${Mapp.vistors} </td>
                                        <td>${Mapp.visted} </td>
                                    </tr>`
                            }
                            if(RegP.visted>0){
                                tr+= `<tr>
                                    <td>${lang('Usajiri','Registration')} </td>
                                    <td>${RegP.vistors} </td>
                                    <td>${RegP.visted} </td>>
                                </tr>`                          
                            }
                            if(ItemsP.visted>0){
                                tr+=`<tr>
                                    <td>${lang('Bidhaa','Items')} </td>
                                    <td>${ItemsP.vistors} </td>
                                    <td>${ItemsP.visted} </td>
                                </tr>`
                            }

                            if(CategP.visted>0){
                                tr+=`<tr>
                                    <td>${lang('Aina','Categories')} </td>
                                    <td>${CategP.vistors} </td>
                                    <td>${CategP.visted} </td>
                                </tr>`
                            }

                            if(GroupP.visted>0){
                                tr+=`<tr>
                                    <td>${lang('Kundi','Groups')} </td>
                                    <td>${GroupP.vistors} </td>
                                    <td>${GroupP.visted} </td>
                                </tr>`
                            }

                            if(BrandP.visted>0){
                                tr+=`<tr>
                                            <td>${lang('Chapa','Brands')} </td>
                                            <td>${BrandP.vistors} </td>
                                            <td>${BrandP.visted} </td>
                                    </tr>`
                            }

                            return tr
                          },
                          SummaryPresent = () =>{
                            rw=`
                                <div class="col-6 pb-2 border-bottom">${lang('Watembeleaji','Vistors')}</div>
                                <div class="col-6 weight700 text-right pb-2 border-bottom">${visted_vistors(itms).vistors}</div>

                                <div class="col-6"> ${lang('Kurasa','Pages')} </div>
                                <div class="col-6 weight700 text-right ">${pages}</div>
                            `

                            return rw
                          }

                          $('#AboutBtn').prop('hidden',About.visted==0)
                          $('#mapbtn').prop('hidden',Mapp.visted==0)
                          $('#regBtn').prop('hidden',RegP.visted==0)
                          $('#itmBtn').prop('hidden',ItemsP.visted==0)
                          $('#CategBtn').prop('hidden',CategP.visted==0)
                          $('#GroupBtn').prop('hidden',GroupP.visted==0)
                          $('#BrandBtn').prop('hidden',BrandP.visted==0)
                        
                        

                          $('#GeneralSummary').html(SummaryPresent())
                          $('#vistorsSummaryTable').html(tableData())

                         const  n = nvar

                          MUDA = muda
                          switch (Number(n)) {
                            case 1:
                             const ft = f=>f.homePage,
                                name = lang('Watembeleaji Ukurasa wa Mwanzo','Home Page Vistors'),
                                dtd = itms.filter(ft)
                                
                                HomeAboutRegMapVistors({name,dtd,muda})
                                break;
                            case 2:
                                 const ftn = f=>f.AboutPage,
                                       aname = lang('Watembeleaji Ukurasa wa Kuhusu','About Page Vistors'),
                                       adtd = itms.filter(ftn)

                                HomeAboutRegMapVistors({name:aname,dtd:adtd,muda})
                                break;
                            case 3:
                                if(n==3){
                                  const  mft = f=>f.MapPage,
                                        mname = lang('Watembeleaji Ukurasa wa Ramani','Map Page Vistors'),
                                        mdtd = itms.filter(mft)

                                HomeAboutRegMapVistors({name:mname,dtd:mdtd,muda})
                                }
                                break;
                            case 4:
                                const rft = f=>f.RegPage,
                                      rname = lang('Watembeleaji Ukurasa wa Usajiri wa Biashara','Enterprise Registration Page Vistors'),
                                       rdtd = itms.filter(rft)

                                HomeAboutRegMapVistors({name:rname,dtd:rdtd,muda})
                                break;
                            case 5:
                                const Ift = f=>f.ItemPage_id!=null,
                                      Iname = lang('Watembeleaji Ukurasa wa Bidhaa','Item Page Vistors'),
                                       Idtd = itms.filter(Ift).map(i=>{return {date:i.date,name:i.Bidhaa,id:i.ItemPage_id,visted:i.visted,user_id:i.user_id,ipaddres:i.ipaddres}})

                                ItemCategBrandGroupVistors({name:Iname,dtd:Idtd,muda})
                                break;
                            case 6:
                                const Cft = f=>f.CategoryPage_id!=null,
                                      Cname = lang('Watembeleaji Ukurasa wa Aina za Bidhaa','Item Categories Page Vistors'),
                                       Cdtd = itms.filter(Cft).map(i=>{return {date:i.date,name:i.Aina,id:i.CategoryPage_id,visted:i.visted,user_id:i.user_id,ipaddres:i.ipaddres}})
                                     ItemCategBrandGroupVistors({name:Cname,dtd:Cdtd,muda})
                                break;
                            case 7:
                                const Pft = f=>f.GroupPage_id!=null,
                                      Pname = lang('Watembeleaji Ukurasa wa Kundi la Bidhaa','Items Group Page Vistors'),
                                       Pdtd = itms.filter(Pft).map(i=>{return {date:i.date,name:i.Kundi,id:i.GroupPage_id,visted:i.visted,user_id:i.user_id,ipaddres:i.ipaddres}})
                                    ItemCategBrandGroupVistors({name:Pname,dtd:Pdtd,muda})
                                break;
                            case 8:
                                const Bft = f=>f.BrandPage_id!=null,
                                       Bname = lang('Watembeleaji Ukurasa wa Chapa za Bidhaa','Items Brand Page Vistors'),
                                       Bdtd = itms.filter(Bft).map(i=>{return {date:i.date,name:i.Kampuni,id:i.BrandPage_id,visted:i.visted,user_id:i.user_id,ipaddres:i.ipaddres}})
                                    ItemCategBrandGroupVistors({name:Bname,dtd:Bdtd,muda})
                                break;
                                     
                            }
                     
                          
                      
                     
  }
}


function HomeAboutRegMapVistors(dat){
    itmed = 0
  
    const {name,dtd,muda} = dat,
    LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
   
    dates = [...new Set(dtd.map(i=>i.date))].sort(),
    months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],
    mAmount= months.map(dt=>monthArr(dt)),
    amounts = dates.map(dt=>chartDt(dt)),
    fro = moment(muda.from),
    to   = moment(muda.to),  
    days = Number(to.diff(fro,'days')) + 1  
  



  function monthArr(mth){
      const mthf = l=>Number(moment(l.date).format('YYYYMM'))===Number(mth),
           LST = dtd.filter(mthf),
          
       //    itmz = Wvat==0?itmz:Wvat==1?itmz.filter(v=>v.vat_set):itmz.filter(v=>!v.vat_set)
           vistor = visted_vistors(LST)

      return {
          month:moment(LST[0].date).format('MMMM, YYYY'),
          vistors:vistor.vistors,
          visted:vistor.visted
          
                  
      
      }
  }


  
function chartDt(dt){
    const mthf = l=>l.date===dt,
        LST = dtd.filter(mthf),
        vistor = visted_vistors(LST)

        return {
        date:moment(LST[0].date),
        vistors:vistor.vistors,
        visted:vistor.visted
        
                

        }
     }  


     $('#howMany').text(`${dates.length}/${days}`)
     bidhaaList = days<=31?amounts:mAmount
  
      if(LoC){
  
                 //Draw new Chart................................................................................................................./
                 let title = ` <h6 class="py-2" >${lang('Takwimu','Statistics')}, ${name}, ${duraTitle}</h6>`
                 
                 $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
                  
                     
                 var canvas = document.getElementById('myChartC');
                 var ctx = canvas.getContext('2d');
                 var data= {
                         labels: days<=31?amounts.map(d=>moment(d.date).format('ddd, DD-MM-YYYY')):mAmount.map(m=>m.month),
                         datasets: [{
                             label:lang("Watembeleaji","Vistors"),
                             fill: true,
                             lineTension: 0,
                             backgroundColor: "#1a8cff28",
                             borderColor: "#1a8cff", // The main line color
                             
                             // notice the gap in the data and the spanGaps: true
                             data: days<=31?amounts.map(a=>a.vistors):mAmount.map(m=>m.vistors),
                             spanGaps: true,
                             }, {
                                 label: lang("Imetembelewa","Visted"),
                                 fill: true,
                                 lineTension: 0,
                                 backgroundColor: "#33669928",
                                 borderColor: "#336699", // The main line color
                             
                                 // notice the gap in the data and the spanGaps: false
                                 data:days<=31?amounts.map(a=>Number(a.visted).toFixed(FIXED_VALUE)):mAmount.map(m=>m.visted),
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
                                         return data.datasets[tooltipItems.datasetIndex].label +' : '+ tooltipItems.yLabel;
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
                                     labelString: `${lang('Idadi','Quantity')} `,
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
                        
                         <th> ${lang('Watembeleaji','Vistors')} </th>
                         <th> ${lang('Kutembelewa','Visted')} </th>
                        
                       
                      
                       
                      
                     </tr>
                 </thead>
                 <tbody id="products_list">`,
                 num = 0
                 
                 amo = days<=31?amounts:mAmount
                 amo.reverse().forEach(a=>{
                     num+=1
                    
                     td+=`<tr>
                       <td>${num}</td>
                      
                       <td class="TodayordCut" >${days<=31?moment(a.date).format('ddd, DD/MM/YYYY'):a.month}</td>
                       <td>${a.vistors}</td>
                       <td>${floatValue(a.visted)}</td>
                          
                     
                     
                       `
                 })
  
         td+=`</tbody>
         </table>
         `   
         
     let title = `<h6 class="py-2" >${name}, ${duraTitle}</h6>`
       
  
         $('#theDataPanel').html(`${title} ${td}`)
         
  
         $('#InvoRiportTable').DataTable();
      }
  


}


function ItemCategBrandGroupVistors(dat){
    itmed = 1
    const {name,dtd,muda} = dat,
    LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
    itms = [... new Set(dtd.map(i=>i.id))].map(t=>{
        const itm = dtd.filter(n=>n.id===t)  ,
              vist = visted_vistors(itm) 
        return{
            name:itm[0].name,
            id:itm[0].id,
            vistors:vist.vistors,
            visted:vist.visted,
            itms:itm,
            page:name

    }})

    ITMS = itms

   // $('#howMany').text(`${dates.length}/${days}`)
   // bidhaaList = days<=31?amounts:mAmount
 
     if(LoC){
 
                //Draw new Chart................................................................................................................./
                let title = `<h6 class="py-2" >${lang('Takwimu','Statistics')}, ${name}, ${duraTitle}<h6/>`
                
                $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
                 
                    
                var canvas = document.getElementById('myChartC');
                var ctx = canvas.getContext('2d');
                var data= {
                        labels: itms.map(d=>d.name),
                        datasets: [{
                            label:lang("Watembeleaji","Vistors"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#1a8cff",
                            borderColor: "#1a8cff", // The main line color
                            
                            // notice the gap in the data and the spanGaps: true
                            data: itms.map(d=>d.vistors),
                            spanGaps: true,
                            }, {
                                label: lang("Imetembelewa","Visted"),
                                fill: true,
                                lineTension: 0,
                                backgroundColor: "#336699",
                                borderColor: "#336699", // The main line color
                            
                                // notice the gap in the data and the spanGaps: false
                                data:itms.map(v=>v.visted),
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
                                        return data.datasets[tooltipItems.datasetIndex].label +' : '+ tooltipItems.yLabel.toLocaleString();
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
                                    labelString: `${lang('Idadi','Quantity')} `,
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
                                    labelString:lang('Jina','Name'),
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
                        <th>${lang('Jina','Name')}</th>
                       
                        <th> ${lang('Watembeleaji','Vistors')} </th>
                        <th> ${lang('Kutembelewa','Visted')} </th>
                        <th> ${lang('Onesha','View')} </th>
                       
                      
                     
                      
                     
                    </tr>
                </thead>
                <tbody id="products_list">`,
                num = 0
                
               itms.reverse().forEach(a=>{
                    num+=1
                   
                    td+=`<tr>
                      <td>${num}</td>
                     
                      <td class="noWordCut" >${a.name}</td>
                      <td>${a.vistors}</td>
                      <td>${a.visted}</td>
                      <td>
                        <button type="button" data-val=${a.id}  class="btn btn-sm border0 detailsBtn smallerFont btn-light" title="${lang('Onesha zaidi','More Info')}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z">
                                </path><circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                      </td>
                         
                    
                    
                      `
                })
 
        td+=`</tbody>
        </table>
        `   
        
    let title = `<h6 class="py-2" >${name}, ${duraTitle}<h6/>`
      
 
        $('#theDataPanel').html(`${title} ${td}`)
        
 
        $('#InvoRiportTable').DataTable();
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

$('body').on('click','.riportListChatOn',function(){
    $('.riportListChatOn').addClass('btn-light')
    $('.riportListChatOn').data('riport',Number($(this).data('r')))
    $(this).removeClass('btn-light')
    $(this).addClass('btn-secondary')

   
   
    if(ITMID>0){
         placeDateMonthData(ITMID)

    }else{
        placeDt(N)
       
    }
    
    
})

$('body').on('click','.riportOn',function(){
    
    $('.riportOn').attr('class','btn border-secondary btn-sm riportOn btn-light')
    
    $(this).attr('class','btn border-secondary btn-sm riportOn btn-primary')
 
    
    //$('.riportOn').data('riport',Number($(this).data('r')))

    nvar = Number($(this).data('r'))

    ITMID = 0
  
    placeDt(N)
})

$('body').on('click','.detailsBtn',function(){
    

    const val = Number($(this).data('val'))
     ITMID = val
     placeDateMonthData(val)

})

function placeDateMonthData(val){
        const  dta = ITMS.find(i=>Number(i.id)===val)
            NAME = `${lang('Watembeleaji wa','')}  <i class="darkblue text-capitalize">${dta.name}</i> ${lang('','Vistors')} ` 
            HomeAboutRegMapVistors({name:NAME,dtd:dta.itms,muda:MUDA})
            $('.riportOn').attr('class','btn border-secondary btn-sm riportOn btn-light')
}