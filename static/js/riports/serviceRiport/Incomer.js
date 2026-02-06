const hali= () => Number($('#HaliyaHuduma').val())




if(Vallow()){
    $('#vatAllowed').show()
}else{
    $('#vatAllowed').hide()
}



function DuraTable(){
        let dta = {
            data:{ 
                    d:0,
                    r:1,
                    tf:StartDate,
                    tt:moment().format(),
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                },
                url:'/riport/ServiceData'}

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
                                 To:moment().format(),
                                 txt:`${lang('Leo, Kuanzia<span class="brown">','Today, From<span class="brown">')}(${moment().startOf('day').format('dddd, DD/MM/YYYY HH:mm')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                               
                                 dtI:data.itms.filter(dy), 
                                 dt:data.data.filter(dy), 
                                 pay:data.pay.filter(dy)


                            },
                         { 
                                 id:2,
                                 name:lang('Wiki hii','This Week'),
                                 from:moment().startOf('isoWeek').format(),
                                 To:moment().format(),
                                 txt:`${lang('Wiki hii,  Kuanzia<span class="brown">','This Week, From<span class="brown">')}(${moment().startOf('isoWeek').format('dddd DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`,   
                             
                                 dtI:data.itms.filter(wkf),
                                 dt:data.data.filter(wkf),
                                 pay:data.pay.filter(wkf)

                        
                            },
                         {       
                                 id:3, 
                                 name:lang('Mwezi huu','This Month'), 
                                 from:moment().startOf('month').format(),
                                 To:moment().format(),
                                 txt:`${lang('Mwezi huu, Kuanzia<span class="brown">','This Month, From<span class="brown">')}(${moment().startOf('month').format('dddd, DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                                 
                                 dtI:data.itms.filter(mthf),
                                 dt:data.data.filter(mthf),
                                 pay:data.pay.filter(mthf)

                            
                            }]

                            AddRow()
                    
                    
                    


                     
               })

         }


DuraTable()


function createArray(name,from,to){
        const ft =d=>moment(d.tarehe).format()>=from && moment(d.tarehe).format() <= to
                let dtA = theData.state.filter(d=>d.from<=from && d.To>=to),Adt={}
                    dtI=[],dt=[],onlineI=[],directI=[],direct=[],online=[],idn = $('#riportData tr').length
 
                if(dtA.length>0){
                     Adt = dtA[0]
                     dtI = Adt.dtI.filter(ft)
                     dt = Adt.dt.filter(ft)
                     pay = Adt.pay.filter(ft)

                     theArr(dtI,dt,pay,name,from,to)

                }else{

                 let dta = {data:{ 
                        d:0,
                        r:1,
                        tf:from,
                        tt:to,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                    },
                    url:'/riport/ServiceData'}
                    $("#loadMe").modal('show');
                    let fct = getRiportData(dta)
    
                     fct.then(function(data){
                        $("#loadMe").modal('hide');

                         theArr(data.itms,data.data,data.pay,name,from,to)

                     })
                        

                }   

                    
               
                 
                 



                }
function theArr(dtI,dt,pay,name,from,to){
  let           
                txt = moment().startOf('year').format() == from && moment().endOf('day').format() == moment(to).endOf('day').format() ? `</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>` : `${lang('Hadi<span class="brown smallerFont">(','To<span class="brown smallerFont">(')} ${moment(to).endOf('day').format('dddd DD/MMM/YYYY HH:mm')})</span>`
                 ar= { 
                        id:idn+1, 
                        name:name, 
                        from:from,
                        To:to,
                        txt:`${name},${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(from).startOf('day').format('dddd, DD/MM/YYYY')})</span>, ${txt}`, 
                        dt:dt,
                        dtI:dtI,
                        pay:pay
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
                    dt= Tawi==0?td.dt:td.dt.filter(d=>Number(d.duka)==Tawi),
                    dtI =Tawi==0?td.dtI:td.dtI.filter(d=>Number(d.duka)==Tawi)

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

                let uzo =  dt.reduce((a,b)=> a + Number(b.amount),0),
                    lipwa =  dt.reduce((a,b)=> a + Number(b.ilolipwa),0)

                  if(n>3){
                      bg = 'table-info'
                  }

                tr+=`
                    <tr class="text-center ${bg}" id="dataRow${n}">
                    <td scope="row">
                       <span class="noWordCut"> ${td.txt}</span>
                    </td>
                
                    
                    <td class=" weight600">${Number(uzo).toLocaleString()}</td>
                    <td class="brown weight600">${Number(lipwa).toLocaleString()}</td>`
                    
                    
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
        
      $('.riportOn').data('val',val || Number($('#firstR').data('val')))
      let  dt =  theData.state.filter(i=>i.id===val)
                
           if(dt.length>0){
                let  theDT = dt[0],
                    n = Number($('#riportSwitch .btn-primary').data('riport')),
                    vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),


                    Df = i => !i.online,  Lf = i=>i.online,Tawi =branch(), status = hali(),
                    //  BRANCH SELECTOR FILTER
                    ankara= Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)==Tawi),
                    itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)==Tawi),
                    payi = Tawi==0?theDT.pay:theDT.pay.filter(d=>Number(d.duka)==Tawi),
                    Na = ByU()


                    //Add time to hidden save riport form...........................//
                    $('#fromT').val(moment(theDT.from).startOf('day').format())                    
                    $('#toT').val(moment(theDT.To).endOf('day').format())                    

                    // ONLINE OR OF LINE FILTER
                    ankara = online&&direct?ankara:online&&!direct?ankara.filter(Lf):direct&&!online?ankara.filter(Df):[]
                    itms = online&&direct?itms:online&&!direct?itms.filter(Lf):direct&&!online?itms.filter(Df):[]
                    payi = online&&direct?payi:online&&!direct?payi.filter(Lf):direct&&!online?payi.filter(Df):[]

                    // SALES  OFFICERS ...............//
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
                               itms = Na==0?itms:itms.filter(s=>s.By===Na)
                               payi = Na==0?payi:payi.filter(s=>s.Na===Na)

                               let itmO = itms 
                            //    vAnakara = ankara.map(a=>Varr(a))
                            //    function  Varr(a){
                            //        let itmz =itmO.filter(m=>Number(m.mauzo_id)==a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)}
                            //        return ar
                            //    }

                            //    VAT COMPLETE & INCOMPLETE...............................................................//
                               ankara = status==0?ankara:status==1?ankara.filter(v=>v.receved):ankara.filter(v=>!v.receved)
                               itms = status==0?itms:status==1?itms.filter(v=>v.receved):itms.filter(v=>!v.receved)
                               payi = status==0?payi:status==1?payi.filter(s=>s.receved):payi.filter(s=>!s.receved)

                                  

                              

                        let tha = Number(itms.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0)),
                            sal = Number(ankara.reduce((a,b)=> a + Number(b.amount),0)),

                            py = Number(ankara.reduce((a,b)=> a + Number(b.ilolipwa),0)),
                            vat = Number(itms.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0))
                            faida = sal - (tha+vat)

                    
                            //$('#Ailolipwa').css(Wvat==0?{'display':'contents'}:{'display':'none'})
                       
                           let btn = `  <button title="${lang('Hifadhi Riport','Save Riport')}" class="smallMadebuttons border0 text-primary float-right smallFont " data-toggle="modal" data-target="#saveRiportTime" >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
                                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                
                                            </button>`

                             duraTitle =  theDT.txt   
                            $('#riporttitle').html(`${theDT.txt} ${btn}`)                           

                            switch (Number(n)) {
                                case 1:
                                    placeInvo(ankara,itms,{from:theDT.from,to:theDT.To})
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

                                case 6:
                                    SalesPerson({itms,ankara})
                                   
                                    break;
                                    
                                
                            
                            }

                            
                            

                            const uzo = document.getElementById('theMauzo'),
                                  thamani = document.getElementById('theValued'),
                                  ilolipwa = document.getElementById('theMalipo'),
                                  faid = document.getElementById('theFaida'),
                                  VaT = document.getElementById('theVAT')


                                animateValue(uzo, 0, Number(sal).toFixed(FIXED_VALUE), 500);
                                animateValue(thamani, 0, Number(tha).toFixed(FIXED_VALUE), 500);
                                animateValue(ilolipwa, 0, Number(py).toFixed(FIXED_VALUE), 700);
                                animateValue(faid, 0, Number(faida).toFixed(FIXED_VALUE), 900);
                                animateValue(VaT, 0, Number(vat).toFixed(FIXED_VALUE), 900);


                              let  dates = [...new Set(ankara.map(i=>i.date))],
                                 fro = moment(theDT.from),
                                 to = moment(theDT.To)
                                 days = Number(to.diff(fro,'days')) + 1

                                $('#theMauzoAv').text(floatValue(sal/dates.length || 0))
                                $('#theMauzoAv1').text(floatValue(sal/days))
                               
                                $('#theValuedAv').text(floatValue(tha/dates.length || 0))
                                $('#theValuedAv1').text(floatValue(tha/days))
                               
                                $('#theMalipoAv').text(floatValue(py/dates.length || 0))
                                $('#theMalipoAv1').text(floatValue(py/days))
                               
                                $('#theFaidaAv').text(floatValue(faida/dates.length || 0))
                                $('#theFaidaAv1').text(floatValue(faida/days))
                               
                                $('#theVATAv').text(floatValue(vat/dates.length || 0))
                                $('#theVATAv1').text(floatValue(vat/days))
                               
                                $('#howManyAv').text(dates.length || 0)
                                $('#howManyAv1').text(days)

                                
                                
                              
                                $('.theFaida').removeClass(Number(faida)>0?'brown':'green')
                                $('.theFaida').addClass(Number(faida)>0?'green':'brown')
                            
                        
                       // act.fct
    }
}
         
 function placeInvo(ankara,itms,muda){
     $('#riportMap').text(lang('Siku','Days'))
     
     let LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
          Wvat = withVat(),
         dates = [...new Set(ankara.map(i=>i.date))].sort(),
         months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],
         mAmount= months.map(dt=>monthArr(dt)),
         amounts = dates.map(dt=>chartDt(dt)),
         fro = moment(muda.from),
         to   = moment(muda.to),  
         days = Number(to.diff(fro,'days')) + 1  
        
        
   

        function monthArr(mth){
            const mthf = l=>Number(moment(l.date).format('YYYYMM'))===Number(mth)
            let invo = ankara.filter(mthf),
                itmz = itms.filter(mthf)
                itmz = Wvat==0?itmz:Wvat==1?itmz.filter(v=>v.vat_set):itmz.filter(v=>!v.vat_set)
             

            return {
                month:moment(invo[0].date).format('MMMM, YYYY'),
                invo:invo,
                from:invo.map(d=>d.tarehe).sort()[0],
                to:invo.map(d=>d.tarehe).sort()[invo.length - 1],
                amount:invo.reduce((a,b)=>a +Number(b.amount),0),
                lipwa:invo.reduce((a,b)=>a +Number(b.ilolipwa),0),
                cost:itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                faida:Number(invo.reduce((a,b)=>a +Number(b.ilolipwa),0)) - Number(itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0)),
                vat:Number(invo.reduce((a,b)=> a + Number(b.vat),0)),
                vate:Number(invo.reduce((a,b)=> a + Number(b.evat),0))
            }
        }


        



           function chartDt(dt){
                let invo = ankara.filter(l=>l.date===dt),
                 itmz = itms.filter(i=>i.date===dt)
                 itmz = Wvat==0?itmz:Wvat==1?itmz.filter(v=>v.vat_set):itmz.filter(v=>!v.vat_set)

                return { 
                         date:dt,
                         from:invo[0].tarehe,
                         to:invo[invo.length - 1].tarehe,
                         invo:invo,
                         amount:invo.reduce((a,b)=>a +Number(b.amount),0),
                         lipwa:invo.reduce((a,b)=>a +Number(b.ilolipwa),0),
                         cost:itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                         faida:Number(invo.reduce((a,b)=>a +Number(b.ilolipwa),0)) - Number(itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0)),
                         vat:Number(invo.reduce((a,b)=> a + Number(b.vat),0)),
                         vate:Number(invo.reduce((a,b)=> a + Number(b.evat),0))
                        }
           }  


    //    VAT filter 
    // amounts =  Wvat==0?amounts:Wvat==1?amounts.filter(v=>Number(v.vat)>0):amounts.filter(v=>(v.vat<v.vate)||v.vat==0)
    // mAmount =  Wvat==0?mAmount:Wvat==1?mAmount.filter(v=>Number(v.vat)>0):mAmount.filter(v=>(v.vat<v.vate)||v.vat==0)

   

    //    
    $('#howMany').text(`${dates.length}/${days}`)

     if(LoC){

                //Draw new Chart................................................................................................................./
                let title = `<h6 class="py-2" >->${lang(`Takwimu ya Mapato kwa kila `,`Service Income Statistics on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
                
                $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
                 
                    
                var canvas = document.getElementById('myChartC');
                var ctx = canvas.getContext('2d');
                var data= {
                        labels: days<=31?amounts.map(d=>moment(d.date).format('dddd, DD/MM/YYYY')):mAmount.map(m=>m.month),
                        datasets: [{
                            label:lang("Mapato","Income"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color
                            
                            // notice the gap in the data and the spanGaps: true
                            data: days<=31?amounts.map(a=>a.amount):mAmount.map(m=>m.amount),
                            spanGaps: true,
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
                type: 'bar',
                data: data,
                options: options
                });	
          

        

     }else{
               let   td=  `<table id="InvoRiportTable" class="table table-bordered smallFont" style="width:100%">
                <thead>
                    <tr class="smallFont ">
                        <th>#</th>
                        <th>${days<=31?lang('Tarehe','Date'):lang('Mwezi','Month')}</th>
                        <th> ${lang('Mapato','Income')}<span class="text-primary latoFont">(${currencii})</span></th>
                        <th> ${lang('Ilolipwa','Paid')}<span class="text-primary latoFont">(${currencii})</span></th>
                        <th> ${lang('Ankara','Invoice(s)')}</th>
                     
                      
                     
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
                      <td>${floatValue(a.amount)}</td>
                      <td class="${Number(a.amount)>Number(a.lipwa)?'text-danger weight600':''}" >${floatValue(a.lipwa)}</td>
                   
                      <td> <button data-from="${a.from}" data-to="${a.to}" class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.invo.length)}</button></td>
                     
                    
                    
                      `
                })

        td+=`</tbody>
        </table>
        `   
        
    let title = `<h6 class="py-2" >->${lang(`Orodha ya Mapato kwa kila `,`Service Income List on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
      

        $('#theDataPanel').html(`${title} ${td}`)
        

        $('#InvoRiportTable').DataTable();
     }


 }
  
 function   placeItems(itms,val){
     let LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
         bd = [... new Set(itms.map(i=>i.bidhaa))],
         bidhaa = bd.map(b=>theItms(b)),
         Tawi  = branch()


         function theItms(b){
             let itm = itms.filter(i=>i.bidhaa == b),
                dura = [
                            {
                            value:1,
                            name:lang('dakika','Minute(s)'),
                            
                            },
                            {
                            value:0,
                            name:'----',
                            
                            },
                            {
                            value:2,
                            name:lang('Saa','hour(s)'),
                            
                            
                            },
                            {
                            value:3,
                            name:lang('Siku','Day(s)'),
                            
                            
                            },
                            {
                            value:4,
                            name:lang('Wiki','Week(s)'),
                            
                            
                            },
                            {
                            value:5,
                            name:lang('mwezi','Month(s)'),
                            
                        
                            },
                            {
                            value:6,
                            name:lang('Miaka','Year(s)'),
                            
                            
                            },
                        
                        ]


             return {
                 id:b,
                 name:itm[0].bidhaaN,
                 tha:itm.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                 sale:itm.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)*b.saveT),0),
                 idadi:itm.reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
                 kipimo:itm[0].kipimo,
                 vat:Number(itm.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
                 tawi:tawi = [... new Set(itm.map(i=>i.duka))].length
             }
         }


         if(LoC){

             //Draw new Chart................................................................................................................./
             let title = `<h6 class="py-2 " >->${lang(`Takwimu ya Mapato ya kila Huduma `,`Service Income Statistics on each Service  `)}, ${duraTitle}<h6/>`
             $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

                    
             var canvas = document.getElementById('myChartC');
             var ctx = canvas.getContext('2d');
             var data= {
                     labels: bidhaa.map(b=>b.name),
                     datasets: [{
                         label:lang("Mapato","Income"),
                         fill: true,
                         lineTension: 0,
                         backgroundColor: "#336699",
                         borderColor: "#336699", // The main line color
                         
                         // notice the gap in the data and the spanGaps: true
                         data: bidhaa.map(a=>a.sale),
                         spanGaps: true,
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
                                 labelString:lang('Huduma','Services'),
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
                 <th>${lang('Huduma','Service')}</th>
                 <th>${lang('vipimo','Units')}</th>
                 <th>${lang('Nafasi','Space')}</th>
                 <th> ${lang('Mapato','Income')} <span class="text-primary latoFont">(${currencii})</span> </th>
                 
                 `
                
               if(Tawi==0){
                  td+=`<th> ${lang('Matawi','Branches')}</th>`  
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
               <td>${floatValue(a.sale)}</td>`

               if(Tawi==0){
                td+=`<td> <button data-val="${val}" data-itm="${a.id}" data-num=1 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>`
            }
         })

 td+=`</tbody>
 </table>
 `   
 let title = `<h6 class="py-2" >->${lang(`Orodha ya Mapato kwa kila Huduma `,`Service Income List on each Service `)} , ${duraTitle}<h6/>`
 $('#theDataPanel').html(title+td)
 $('#SoldItems').DataTable();
         }

 
 }
  
 function   placeCategory(itms,val){
     let aina = Categs.state,
         LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
         bd = [... new Set(itms.map(i=>i.aina))],
         bidhaa = bd.map(b=>theItms(b)),Tawi=branch()

         function theItms(b){
             let itm = itms.filter(i=>i.aina == b)
             return {
                 id:b,
                 name:aina.filter(a=>a.id==b)[0].aina,
                 tha:itm.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                 sale:itm.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)*b.saveT),0),
                 vat:Number(itm.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
                 tawi:tawi = [... new Set(itm.map(i=>i.duka))].length
             }
         }


         if(LoC){

             //Draw new Chart................................................................................................................./
             let title = `<h6 class="py-2 " >->${lang(`Takwimu ya Mapato ya kila Aina ya Huduma `,`Service Income Statistics on each Service Category  `)}, ${duraTitle}<h6/>`
             $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

                    
             var canvas = document.getElementById('myChartC');
             var ctx = canvas.getContext('2d');
             var data= {
                     labels: bidhaa.map(b=>b.name),
                     datasets: [{
                         label:lang("Mapato","Income"),
                         fill: true,
                         lineTension: 0,
                         backgroundColor: "#336699",
                         borderColor: "#336699", // The main line color
                         
                         // notice the gap in the data and the spanGaps: true
                         data: bidhaa.map(a=>a.sale),
                         spanGaps: true,
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
                                 labelString:lang('Aina za Huduma','Services Categories'),
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
             
                 <th> ${lang('Mapato','Income')} <span class="text-primary latoFont">(${currencii})</span> </th>`
            
                
              
                if(Tawi==0){
                    td+=`<th> ${lang('Matawi','Branches')}</th>`  
                 }
              
             td+=`</tr>
         </thead>
         <tbody id="products_list">`,
         num = 0
         
         
         bidhaa.forEach(a=>{
             num+=1
             td+=`<tr>
               <td>${num}</td>
              
               <td class="text-capitalize" >${a.name}</td>
            
               <td>${floatValue(a.sale)}</td>`
        
               if(Tawi==0){
                td+=`<td> <button data-val="${val}" data-itm="${a.id}" data-num=2 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>`
            }
         })

 td+=`</tbody>
 </table>
 `   
 let title = `<h6 class="py-2 " >->${lang(`Orodha ya Mapato ya kila Aina ya Huduma `,`Serices Income List on each Service Category  `)}, ${duraTitle}<h6/>`
 $('#theDataPanel').html(title+td)
 $('#SoldItems').DataTable();
         }

         

         

   

 }
  
 function   placeGroups(itms,val){
    
    let aina = pcategs.state,
    LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
    bd = [... new Set(itms.map(i=>i.kundi))],
    bidhaa = bd.map(b=>theItms(b)),Tawi = branch()

    

    function theItms(b){
        let itm = itms.filter(i=>i.kundi == b)
        return {
            id:b,
            name:aina.filter(a=>a.id==b)[0]?.mahitaji,
            tha:itm.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
            sale:itm.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)*b.saveT),0),
            vat:Number(itm.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
            tawi:tawi = [... new Set(itm.map(i=>i.duka))].length

        }
    }


    if(LoC){

        //Draw new Chart................................................................................................................./
        let title = `<h6 class="py-2 " >->${lang(`Takwimu ya Mapato ya kila Kundi la Huduma `,`Service Income Statistics on each Service Group  `)}, ${duraTitle}<h6/>`
        $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

               
        var canvas = document.getElementById('myChartC');
        var ctx = canvas.getContext('2d');
        var data= {
                labels: bidhaa.map(b=>b.name),
                datasets: [{
                    label:lang("Mapato","Income"),
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "#336699",
                    borderColor: "#336699", // The main line color
                    
                    // notice the gap in the data and the spanGaps: true
                    data: bidhaa.map(a=>a.sale),
                    spanGaps: true,
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
        td=  `<table id="SoldItems" class="table table-bordered smallFont" style="width:100%">
    <thead>
        <tr class="smallFont ">
            <th>#</th>
            <th>${lang('Kundi','Group')}</th>
            <th> ${lang('Mapato','Income')}<span class="text-primary latoFont">(${currencii})</span> </th>`
 
            if(Tawi==0){
                td+=`<th> ${lang('Matawi','Branches')}</th>`  
             }
         
         td+=`</tr>
    </thead>
    <tbody id="products_list">`,
    num = 0
    
    
    bidhaa.forEach(a=>{
        num+=1
        td+=`<tr>
          <td>${num}</td>
         
          <td class="text-capitalize" >${a.name}</td>
       
          <td>${floatValue(a.sale)}</td>`
        
          if(Tawi==0){
            td+=`<td> <button data-val="${val}" data-itm="${a.id}" data-num=3 class="btn btn-default checkByBranch latoFont text-primary"> ${Number(a.tawi)}</button></td>`
        }
    })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >->${lang(`Orodha ya Mapato ya kila Kundi la Huduma `,`Service Income List on each Service Group  `)}, ${duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
    }

    

     }

function   placeAlipia(pay){
    
    
    let ment=pay
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        bd = [... new Set(ment.map(i=>i.Akaunt_id))],
        malipo = bd.map(b=>theItms(b))

        

    

    function theItms(b){
      
        return {
            id:b,
            name:ment.filter(a=>a.Akaunt_id==b)[0]?.akaunti,
            pay:Number(ment.filter(ac=>ac.Akaunt_id==b).reduce((a,b)=> a + Number(b.Amount),0)),
            amount:Number(ment.filter(a=>a.Akaunt_id==b)[0]?.amount),

        }
    }


    if(LoC){

        //Draw new Chart................................................................................................................./
        let title = `<h6 class="py-2 " >->${lang(`Takwimu ya Malipo ya Huduma kwa kila Akaunti ya Malipo`,`Service Payments Statistics on each Payment Account  `)}, ${duraTitle}<h6/>`
        $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

               
        var canvas = document.getElementById('myChartC');
        var ctx = canvas.getContext('2d');
        var data= {
                labels: malipo.map(b=>b.name),
                datasets: [{
                    label:lang("Malipo ya Huduma","Services Payment"),
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
                            labelString:lang('Akaunti za Malipo','Payments Accounts'),
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
            <th> ${lang('Malipo ya Huduma','Services Payment')}<span class="text-primary latoFont">(${currencii})</span> </th>
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
let title = `<h6 class="py-2 " >->${lang(`Orodha ya Malipo ya Huduma kwa kila Akaunti ya Malipo`,`Services Payments List on each Payment Account  `)}, ${duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
    }

    

     }


function SalesPerson(invo){
  let ankara = invo.ankara,
      itms = invo.itms,
      sp = [...new Set(ankara.map(p=>p.Na))],
      LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
      salesP = sp.map((sp)=>{
          let itmz = itms.filter(n=>n.By===sp),
              ivo = ankara.filter(p=>p.Na===sp), 

              tha = Number(itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0)),
              amount = ivo.reduce((a,b)=>a +Number(b.amount),0),
              ilolipwa = ivo.reduce((a,b)=>a +Number(b.ilolipwa),0),
              jina = `${ivo[0].f_name}  ${ivo[0].l_name}`
              vat =  Number(itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0))
          return {
              tha,amount,ilolipwa,vat,jina
          }
      })

    
      if(LoC){

          //Draw new Chart................................................................................................................./
          let title = `<h6 class="py-2 " >->${lang(`Takwimu ya Mapato ya Huduma kwa kila Mtumiaji Aliyehusika`,`Service Income  Statistics on each Service Incharge  `)}, ${duraTitle}<h6/>`
          $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:75vh !important'} "  id="myChartC"></canvas></div>`);

                    
          var canvas = document.getElementById('myChartC');
          var ctx = canvas.getContext('2d');
          var data= {
                  labels: salesP.map(b=>b.jina),
                  datasets: [{
                      label:lang("Mapato","Income"),
                      fill: true,
                      lineTension: 0,
                      backgroundColor: "#336699",
                      borderColor: "#336699", // The main line color
                      
                      // notice the gap in the data and the spanGaps: true
                      data: salesP.map(a=>a.amount),
                      spanGaps: true,
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
                              labelString:lang('Msimamizi Huduma','Service Incharge'),
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
            tr = `<table id="table-Invoices" class="table table-bordered smallFont" style="width:100%">
                <thead>
                    <tr class="smallerFont ">
                        
                        <th>#</th>
                        
                        <th> ${lang('Jina','Name')}</th>
                       
                        <th> ${lang('Kiasi','Amount')}<span class="text-primary latoFont">(${currencii})</span></th> 
                        <th> ${lang('Malipo','Payment')}<span class="text-primary latoFont">(${currencii})</span></th> 
                     
                    </tr>
                </thead></tbody>`,n=0

                

            salesP.reverse().forEach(a=>{
                n+=1
                
                let profit = a.amount - (a.tha+a.vat)        
                tr+= `<tr> 
                    <td>${n}</td>
                    <td class="text-capitalize" >${a.jina}</td>
                    
                    <td  >${floatValue(a.amount)}</td>
                    <td class="${Number(a.amount)>Number(a.ilolipwa)?'text-danger weight600':''}" >${floatValue(a.ilolipwa)}</td>
                
                    
                    </tr>
                ` 
            })   

            
            tr+=`</tbody></table>`
                
            let title = `<h6 class="py-2 " >->${lang(`Orodha ya Mapato kwa kila Mtumiaji Aliyeusika`,`Service Income List on each Service Incharge  `)}, ${duraTitle}<h6/>`

            $('#theDataPanel').html(title+tr)
            $('#table-Invoices').DataTable();
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
        case 2:
            viewCategoryByBranch({val,id})
           break;
        case 3:
            viewGroupByBranch({val,id})
           break;
    
       
    }
    
})


function viewList(muda){
        let  dt =  theData.state.filter(i=>moment(i.from)<=moment(muda.from)&&moment(i.To)>=moment(muda.to))
        if(dt.length>0){
             let ft = i=>  moment(i.tarehe).startOf('day').format() >= moment(muda.from).startOf('day').format()&& moment(i.tarehe).endOf('day').format() <= moment(muda.to).endOf('day').format() ,
              theDT = dt[0],
              vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),
            
              Df = i => !i.online,  Lf = i=>i.online,Na = ByU(),Tawi = branch(),Wvat=withVat(),status= hali()
             


              //  BRANCH SELECTOR FILTER
              ankara= Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)==Tawi),
              itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)==Tawi)

              // ONLINE OR OF LINE FILTER
              ankara = online&&direct?ankara:online&&!direct?ankara.filter(Lf):direct&&!online?ankara.filter(Df):[]
              itms = online&&direct?itms:online&&!direct?itms.filter(Lf):direct&&!online?itms.filter(Df):[]

              //USER FILTER
              ankara = Na==0?ankara:ankara.filter(s=>s.Na===Na)
              itms = Na==0?itms:itms.filter(s=>s.By===Na)

              ankara = ankara.filter(ft)
              itms = itms.filter(ft)

              //VAT FILTER
            //   vAnakara = ankara.map(a=>Varr(a))
            //   function  Varr(a){
            //     let itmz =itms.filter(m=>m.mauzo_id==a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)}       
            //     return ar
            //   }

              
              ankara = status==0?ankara:status==1?ankara.filter(v=>v.receved):ankara.filter(v=>!v.receved)
              itms = status==0?itms:status==1?itms.filter(v=>v.receved):itms.filter(v=>!v.receved)
            //   let itmsOg = itms



              tr = `<table id="table-Invoices" class="table table-bordered smallFont" style="width:100%">
                       <thead>
                            <tr class="smallerFont ">
                                
                                <th>#</th>
                                
                                <th> ${lang('Ankara','Invoice')}</th>
                                <th> ${lang('Tarehe','Date')}</th>
                                <th> ${lang('Jina la Mteja','Customer Name')}</th>
                                <th> ${lang('Kuanzia','From')}</th>
                                <th> ${lang('Hadi','To')}</th>
                                <th> ${lang('Kiasi','Amount')}<span class="text-primary latoFont">(${currencii})</span></th> 
                                <th> ${lang('Malipo','Payment')}<span class="text-primary latoFont">(${currencii})</span></th> 
                                  
         
                                <th>Action</th>
                            </tr>
                        </thead></tbody>`,n=0

                        

                    ankara.reverse().forEach(a=>{
                        n+=1
                        let itmz =itms.filter(n=>n.mauzo_id== a.id),

                             tha = itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                             vat =  itmz.filter(n=>n.vat_set).reduce((a,b)=> a + ((b.idadi-b.returned)*vatPer(b.vat,b.bei)),0),
                             faida = Number(a.amount)-(tha+vat),
                             am = Number(a.amount)
                             
                        tr+= `<tr> 
                          <td>${n}</td>
                          <td>INVO-${a.code}</td>
                          <td>${moment(a.tarehe).format('DD-MM-YYYY HH:mm')}</td>
                            <td class="text-capitalize" >${a.mteja_jina}</td>
                          <td >${moment(a.servFrom).format('DD,MMMM,YYYY  HH:mm')}</td>
                          <td >${moment(a.servTo).format('DD,MMMM,YYYY  HH:mm')}</td>
                          <td  >${floatValue(a.amount)}</td>
                          <td class="${Number(a.amount)>Number(a.ilolipwa)?'text-danger weight600':''}" >${floatValue(a.ilolipwa)}</td>
                       
                          <td>
                            <button type="button" data-val=${a.id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm border0 viewInvo smallerFont btn-light" title="${lang('Onesha Ankara','View Invo')}">
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

                        

                        
                      
                       title = `<h6 class="py-2 " >->${lang(`Orodha ya Ankara za Huduma`,`Serices Invoices List on`)},<span class="darkblue"> ${dur}</span><h6/>`
     
                    $('#theDataPanel').html(title+tr)
                    $('#table-Invoices').DataTable();

                    $('.riportOn').addClass('btn-light')
                    $('.riportOn').removeClass('btn-primary')



            }    
}

function viewItembByBranch(vl){
    let id=vl.id,
        val = vl.val,Wvat=withVat(),Na=ByU(),
        dt =  theData.state.filter(i=>i.id===val),  theDT = dt[0],
        n = Number($('#riportSwitch .btn-primary').data('riport')),
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),

        Df = i => !i.online,  Lf = i=>i.online,Tawi =branch(), status = hali()

       //USER FILTER
        
        ankara = Na==0?theDT.dt:theDT.dt.filter(s=>s.Na==Na),
        itms = Na==0?theDT.dtI.filter(i=>i.bidhaa==id):theDT.dtI.filter(s=>s.By==Na&&s.bidhaa==id),
       

      
        // vAnakara = ankara.map(a=>Varr(a))
        // function  Varr(a){
        //     let itmz =itms.filter(m=>Number(m.mauzo_id)==a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)}
        //     return ar
        // }
         //    VAT FILTER
        ankara = status==0?ankara:status==1?ankara.filter(v=>v.receved):ankara.filter(v=>!v.receved)
        itms = status==0?itms:status==1?itms.filter(v=>v.receved):itms.filter(v=>!v.receved)
   
        // ONLINE OR OF LINE FILTER
        ankara = online&&direct?ankara:online&&!direct?ankara.filter(Lf):direct&&!online?ankara.filter(Df):[]
        itms = online&&direct?itms:online&&!direct?itms.filter(Lf):direct&&!online?itms.filter(Df):[]


        tw =[...new Set(itms.map(m=>m.duka))] 
        matawi = tw.map(t=>formT(t))

        function formT(t){
            let itmz = itms.filter(d=>d.duka==t)
            return {
                id:t,
                name:ankara.filter(d=>d.duka==t)[0].dukan,
                tha:itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                sale:itmz.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
                idadi:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
                kipimo:itmz[0].kipimo,
                vat:Number(itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
           
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
                        label:lang("Mapato","Income"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: matawi.map(a=>a.sale),
                        spanGaps: true,
                        }, {
                            label: lang("Thamani","Cost"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.tha).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Faida","Profit"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "green",
                            borderColor: "bro", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.sale-(a.tha+a.vat)).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                        ]
                    };
                    if(Vallow()){
                        data.datasets.push({
                            label: "VAT",
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "brown",
                            borderColor: "green", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.vat).toFixed(FIXED_VALUE)),
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
                <th>${lang('Nafasi','Space')}</th>
                <th> ${lang('Thamani','Cost')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Mapato','Income')}<span class="text-primary latoFont">(${currencii})</span> </th>`
                if(Vallow()){
                    td+=`<th>VAT<span class="text-primary latoFont">(${currencii})</span></th>`
                }
                td+=`<th> ${lang('Profit','Faida')}<span class="text-primary latoFont">(${currencii})</span></th>
               
             
              
             
            </tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        matawi.forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize weight600 text-primary " ><u>${a.name}</u></td>
              <td class="text-primary" >${a.kipimo}</td>
              <td  >${a.idadi}</td>
              <td>${floatValue(a.tha)}</td>
              <td>${floatValue(a.sale)}</td>`
              if(Vallow()){
                td+=`<td>${floatValue(a.vat)}</td>`
            } 
              td+=`<td ${a.sale<(a.tha+a.vat)?'class="brown weight600"':''}>${floatValue(a.sale-(a.tha+a.vat))}</td>
            
              `
        })
    
    td+=`</tbody>
    </table>
    `   
    
    $('#theDataPanel').html(td)
    $('#SoldItems').DataTable();
        }
    
        
     
        $('#theDataPanel').prepend(`<h6 id="itmTitle" class="py-3" data-itm=${id} data-val=${val} data-num=1 >${lang('Huduma ya','Services on')} <i class="darkblue text-capitalize">${itms[0].bidhaaN}</i>  ${lang('Kwa kila Tawi','In each branch')}</h6>`)

        $('.riportOn').addClass('btn-light')
        $('.riportOn').removeClass('btn-primary')


}

function viewCategoryByBranch(vl){
    let id=vl.id,
        aina = Categs.state.filter(a=>a.id==id),
        val = vl.val,Wvat=withVat(),Na=ByU(),
        dt =  theData.state.filter(i=>i.id===val),  theDT = dt[0],
        n = Number($('#riportSwitch .btn-primary').data('riport')),
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),

        Df = i => !i.online,  Lf = i=>i.online,Tawi =branch(), status=hali()

       //USER FILTER
        
        ankara = Na==0?theDT.dt:theDT.dt.filter(s=>s.Na==Na),
        itms = Na==0?theDT.dtI.filter(i=>i.aina==id):theDT.dtI.filter(s=>s.By==Na&&s.aina==id),
       

      
        // vAnakara = ankara.map(a=>Varr(a))
        // function  Varr(a){
        //     let itmz =itms.filter(m=>Number(m.mauzo_id)==a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)}
        //     return ar
        // }


         //    STATUS FILTER
         ankara = status==0?ankara:status==1?ankara.filter(v=>v.receved):ankara.filter(v=>!v.receved)
         itms = status==0?itms:status==1?itms.filter(v=>v.receved):itms.filter(v=>!v.receved)
         
        // ONLINE OR OF LINE FILTER
        ankara = online&&direct?ankara:online&&!direct?ankara.filter(Lf):direct&&!online?ankara.filter(Df):[]
        itms = online&&direct?itms:online&&!direct?itms.filter(Lf):direct&&!online?itms.filter(Df):[]


        tw =[...new Set(itms.map(m=>m.duka))] 
        matawi = tw.map(t=>formT(t))

        function formT(t){
            let itmz = itms.filter(d=>d.duka==t)
            return {
                id:t,
                name:ankara.filter(d=>d.duka==t)[0].dukan,
                tha:itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                sale:itmz.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
                idadi:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
                kipimo:itmz[0].kipimo,
                vat:Number(itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
           
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
                        label:lang("Mapato","Income"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: matawi.map(a=>a.sale),
                        spanGaps: true,
                        }, {
                            label: lang("Thamani","Cost"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.tha).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Faida","Profit"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "green",
                            borderColor: "bro", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.sale-(a.tha+a.vat)).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                        ]
                    };
                    if(Vallow()){
                        data.datasets.push({
                            label: "VAT",
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "brown",
                            borderColor: "green", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.vat).toFixed(FIXED_VALUE)),
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
             
                <th> ${lang('Ghalama','Cost')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Mapato','Income')}<span class="text-primary latoFont">(${currencii})</span> </th>`
                if(Vallow()){
                    td+=`<th>VAT<span class="text-primary latoFont">(${currencii})</span></th>`
                }
                td+=`<th> ${lang('Profit','Faida')}<span class="text-primary latoFont">(${currencii})</span></th>
               
             
              
             
            </tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        matawi.forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize weight600 text-primary " ><u>${a.name}</u></td>
           
              <td>${floatValue(a.tha)}</td>
              <td>${floatValue(a.sale)}</td>`
              if(Vallow()){
                td+=`<td>${floatValue(a.vat)}</td>`
            } 
              td+=`<td ${a.sale<(a.tha+a.vat)?'class="brown weight600"':''}>${floatValue(a.sale-(a.tha+a.vat))}</td>
            
              `
        })
    
    td+=`</tbody>
    </table>
    `   
    
    $('#theDataPanel').html(td)
    $('#SoldItems').DataTable();
        }
    
        
     
        $('#theDataPanel').prepend(`<h6 id="itmTitle" class="py-3" data-itm=${id} data-val=${val} data-num=2 >${lang('Huduma kwa','Service for')} <i class="darkblue text-capitalize">${aina[0].aina}</i>  ${lang('Kwa kila Tawi','In each branch')}</h6>`)

        $('.riportOn').addClass('btn-light')
        $('.riportOn').removeClass('btn-primary')


}

function viewGroupByBranch(vl){
    let id=vl.id,
        aina = pcategs.state.filter(a=>a.id==id),
        val = vl.val,Wvat=withVat(),Na=ByU(),
        dt =  theData.state.filter(i=>i.id===val),  theDT = dt[0],
        n = Number($('#riportSwitch .btn-primary').data('riport')),
        LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),

        Df = i => !i.online,  Lf = i=>i.online,Tawi =branch(), status = hali()

       //USER FILTER
        
        ankara = Na==0?theDT.dt:theDT.dt.filter(s=>s.Na==Na),
        itms = Na==0?theDT.dtI.filter(i=>i.kundi==id):theDT.dtI.filter(s=>s.By==Na&&s.kundi==id)
       

      
        // vAnakara = ankara.map(a=>Varr(a))
        // function  Varr(a){
        //     let itmz =itms.filter(m=>Number(m.mauzo_id)==a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)}
        //     return ar
        // }
         
       
        //    STATUS FILTER
        ankara = status==0?ankara:status==1?ankara.filter(v=>v.receved):ankara.filter(v=>!v.receved)
        itms = status==0?itms:status==1?itms.filter(v=>v.receved):itms.filter(v=>!v.receved)
                 
   
        // ONLINE OR OF LINE FILTER
        ankara = online&&direct?ankara:online&&!direct?ankara.filter(Lf):direct&&!online?ankara.filter(Df):[]
        itms = online&&direct?itms:online&&!direct?itms.filter(Lf):direct&&!online?itms.filter(Df):[]


        tw =[...new Set(itms.map(m=>m.duka))] 
        matawi = tw.map(t=>formT(t))

        function formT(t){
            let itmz = itms.filter(d=>d.duka==t)
            return {
                id:t,
                name:ankara.filter(d=>d.duka==t)[0].dukan,
                tha:itmz.reduce((a,b)=> a + (b.thamani*(b.idadi-b.returned)/b.uwiano),0),
                sale:itmz.reduce((a,b)=> a + (b.bei*(b.idadi-b.returned)),0),
                idadi:itmz.reduce((a,b)=> a + Number((b.idadi-b.returned)),0),
                kipimo:itmz[0].kipimo,
                vat:Number(itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number((b.idadi-b.returned)*(vatPer(b.vat,b.bei))),0)),
           
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
                        label:lang("Mapato","Income"),
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "#1a8cff",
                        borderColor: "#1a8cff", // The main line color
                        
                        // notice the gap in the data and the spanGaps: true
                        data: matawi.map(a=>a.sale),
                        spanGaps: true,
                        }, {
                            label: lang("Thamani","Cost"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "#336699",
                            borderColor: "#336699", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.tha).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                       ,{
                            label: lang("Faida","Profit"),
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "green",
                            borderColor: "bro", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.sale-(a.tha+a.vat)).toFixed(FIXED_VALUE)),
                            spanGaps: false,
                        }
                        ]
                    };
                    if(Vallow()){
                        data.datasets.push({
                            label: "VAT",
                            fill: true,
                            lineTension: 0,
                            backgroundColor: "brown",
                            borderColor: "green", // The main line color
                        
                            // notice the gap in the data and the spanGaps: false
                            data:matawi.map(a=>Number(a.vat).toFixed(FIXED_VALUE)),
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
             
                <th> ${lang('Galama','Cost')} <span class="text-primary latoFont">(${currencii})</span> </th>
                <th> ${lang('Mapato','Income')}<span class="text-primary latoFont">(${currencii})</span> </th>`
                if(Vallow()){
                    td+=`<th>VAT<span class="text-primary latoFont">(${currencii})</span></th>`
                }
                td+=`<th> ${lang('Profit','Faida')}<span class="text-primary latoFont">(${currencii})</span></th>
               
             
              
             
            </tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        matawi.forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize weight600 text-primary " ><u>${a.name}</u></td>
           
              <td>${floatValue(a.tha)}</td>
              <td>${floatValue(a.sale)}</td>`
              if(Vallow()){
                td+=`<td>${floatValue(a.vat)}</td>`
            } 
              td+=`<td ${a.sale<(a.tha+a.vat)?'class="brown weight600"':''}>${floatValue(a.sale-(a.tha+a.vat))}</td>
            
              `
        })
    
    td+=`</tbody>
    </table>
    `   
    
    $('#theDataPanel').html(td)
    $('#SoldItems').DataTable();
        }
    
        
     
        $('#theDataPanel').prepend(`<h6 id="itmTitle" class="py-3" data-itm=${id} data-val=${val} data-num=3 >${lang('Huduma kwa','Services by')} <i class="darkblue text-capitalize">${aina[0]?.mahitaji}</i>  ${lang('Kwa kila Tawi','In each branch')}</h6>`)

        $('.riportOn').addClass('btn-light')
        $('.riportOn').removeClass('btn-primary')


}


function roadRiportSave(){
    $('#theSavedRiport').show(400)
    $('#saveR_loader').show()
    let dta = {data:{ 
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        serv:1
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
                         <a class=" btn-default smallFont weight600 pr-3" onclick="createArray('${l.title}',moment('${l.From}').startOf('day').format(),moment('${l.to}').endOf('day').format())" type="button"  >${l.title}</a>

                         
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

                    <div  class=" darkblue smallFont weight400">
                            ${l.desc}
                     </div>
                </li>
            `
       })

       

       $('#placeTheRiport').html(data.riport.length>0?li:li2)
       
    })


}

