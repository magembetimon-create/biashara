

var PAYACC = [],Transactions=[]
const HIM = Number($('#HIMOWNER').val())
function DuraTable(){
        let dta = {
            data:{ 
                    d:0,
                    r:1,
                    s:servs,
                    tf:StartDate,
                    tt:moment().format(),
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                },
                url:'/riport/incoExpndData'}

                $("#loadMe").modal('show');

                let fct = getRiportData(dta)

                 fct.then(function(data){
                   
                    $("#loadMe").modal('hide');

                    let leo = moment().startOf('day').format(),
                        wk = moment().startOf('isoWeek').format(),
                        mth = moment().startOf('month').format()

                        const dy = d=>moment(d.tarehe).format()>=leo,wkf=d=>moment(d.tarehe).format()>=wk,mthf=d=>moment(d.tarehe).format()>=mth,
                              {income,expend,nonExisting} = data
                         
                        theData.state = [{
                                 id:1,
                                 name:lang('Leo','Today'),
                                 from:moment().startOf('day').format(),
                                 To:moment().endOf('day').format(),
                                 txt:`${lang('Leo, Kuanzia<span class="brown">','Today, From<span class="brown">')}(${moment().startOf('day').format('dddd DD/MM/YYYY HH:mm')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                                 OtherInit:nonExisting,
                                 dtI:income.filter(dy), 
                                 dt:expend.filter(dy), 
                                 allincome:income,
                                 allExp:expend
                               


                            },
                         { 
                                 id:2,
                                 name:lang('Wiki hii','This Week'),
                                 from:moment().startOf('isoWeek').format(),
                                 To:moment().endOf('isoWeek').format(),
                                 txt:`${lang('Wiki hii,  Kuanzia<span class="brown">','This Week, From<span class="brown">')}(${moment().startOf('isoWeek').format('dddd, DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`,   
                                 OtherInit:nonExisting,
                                 dtI:income.filter(wkf),
                                 dt:expend.filter(wkf),
                                 allincome:income,
                                 allExp:expend
                            

                        
                            },
                         {       
                                 id:3, 
                                 name:lang('Mwezi huu','This Month'), 
                                 from:moment().startOf('month').format(),
                                 To:moment().endOf('month').format(),
                                 txt:`${lang('Mwezi huu, Kuanzia<span class="brown">','This Month, From<span class="brown">')}(${moment().startOf('month').format('dddd DD/MM/YYYY')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                                 OtherInit:nonExisting,
                                 dtI:income.filter(mthf),
                                 dt:expend.filter(mthf),
                                 allincome:income,
                                 allExp:expend
                               

                            
                            }]

                            AddRow()
                    
                    
                    


                     
               })

}


DuraTable()


function createArray(name,from,to){
        const ft =d=>moment(d.tarehe).format()>=from && moment(d.tarehe).format() <= to
                const dtA = theData.state.filter(d=>d.from<=from && d.To>=to)
                  let  dtI=[],dt=[],onlineI=[],directI=[],direct=[],online=[]
                       idn = $('#riportData tr').length

                if(dtA.length>0){
                    const Adt = dtA[0]
                     
                     dtI = Adt.dtI?.filter(ft)
                     dt = Adt.dt?.filter(ft)
                     nonExisting = Adt.OtherInit
                     allExp = Adt.allExp,
                     allincome = Adt.allincome

                     theArr(dtI,dt,nonExisting,allincome,allExp,name,from,to)
                     

                }else{

                 let dta = {data:{ 
                        d:0,
                        r:1,
                        s:servs,
                        tf:from,
                        tt:to,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                    },
                    url:'/riport/incoExpndData'}
                    $("#loadMe").modal('show');
                    let fct = getRiportData(dta)
    
                     fct.then(function(data){
                        $("#loadMe").modal('hide');

                        const {income,expend,nonExisting,income:allincome,expend:allExp} = data

                         theArr(income,expend,nonExisting,allincome,allExp,name,from,to)

                     })
                        

                }   

                    
               
                 
                 



                }
function theArr(dtI,dt,nonExisting,allinc,allExp,name,from,to){
  let          
                txt = moment().startOf('year').format() == from && moment().endOf('day').format() == moment(to).endOf('day').format() ? `</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>` : `${lang('Hadi<span class="brown smallerFont">(','To<span class="brown smallerFont">(')} ${moment(to).endOf('day').format('dddd DD/MM/YYYY HH:mm')})</span>`
                 ar= { 
                        id:idn+1, 
                        name:name, 
                        from:from,
                        To:to,
                        txt:`${name},${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(from).startOf('day').format('dddd DD/MM/YYYY')})</span>, ${txt}`, 
                        OtherInit:nonExisting,
                        dt:dt,
                        dtI:dtI,
                        allincome:allinc,
                        allExp:allExp
               
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
                    dtI = Tawi==0?td.dtI:td.dtI.filter(d=>d.duka===Tawi)

               n+=1 
                   
                chk+=` <div class="custom-control smallFont d-inline mx-2 custom-checkbox"  >
                            <input type="checkbox" onchange="$('#dataRow${n}').toggle(100)"  checked name="MonthSale" id="MonthSale${n}" class="custom-control-input" style="cursor: pointer !important;"><label class="custom-control-label" style="cursor: pointer !important;" for="MonthSale${n}">${td.name}</label>
                        </div>`
                let bg=''

                const income = dtI.filter(tr=>!tr.kuhamisha)?.reduce((a,b)=>a + Number(b.kiasi),0),
                     expend =  dt.filter(tr=>!tr.kuhamisha)?.reduce((a,b)=>a + Number(b.kiasi),0),
                     makato = dt.reduce((a,b)=>a + Number(b.makato),0)
                   

                  if(n>3){
                      bg = 'table-info'
                  }

                tr+=`
                    <tr class="text-center ${bg}" id="dataRow${n}">
                    <td scope="row">
                       <span class="noWordCut"> ${td.name}</span>
                    </td>
                
                    <td class=" weight600">${floatValue(income)}</td>
                    <td class=" weight600">${floatValue(expend+makato)}</td>
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


                      Tawi =branch(), Wvat = withVat(),
                      //  BRANCH SELECTOR FILTER
                      ankara = Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)==Tawi),
                      itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)==Tawi),

                      nonExisting=Tawi==0?theDT.OtherInit:theDT.OtherInit.filter(d=>Number(d.duka)==Tawi),
                      allIncome=Tawi==0?theDT.allincome:theDT.allincome.filter(d=>Number(d.duka)==Tawi),
                      allExpense = Tawi==0?theDT.allExp:theDT.allExp.filter(d=>Number(d.duka)==Tawi),
                      from = theDT.from,
                
                      Na = ByU()

                      duraTitle = theDT.txt

                      incomeExpSummary({expend:ankara,income:itms,allIncome,allExpense,others:nonExisting,from})

                      switch (Number(n)) {
                        case 1:
                             placedeposit({itms,ankara,muda:{from:theDT.from,to:theDT.To}})
                            break;
                        case 2:
                               placeWithdraw({itms:ankara,ankara:itms,muda:{from:theDT.from,to:theDT.To}})
                             
                           
                            break;
                
                        case 5:
                                placeAlipia()
                           
                            break;
                            
                        
                    
                    }


                  //Add time to hidden save riport form...........................//
                  $('#fromT').val(moment(theDT.from).startOf('day').format())                    
                  $('#toT').val(moment(theDT.To).endOf('day').format())                    

                      
                       
                        // viewList({from:theDT.from,to:theDT.To})
                          $('#riporttitle').html(`${lang('Mapato na Matumizi kwa Ujumla,','Income & Expenditure In General,')} ${theDT.txt} `) 
                              

  }
}


function incomeExpSummary(transaxn){
        const {expend,income,others,allExpense,allIncome,from} = transaxn
   
          const     trf = tr=> !tr.kuhamisha,
               Tawi = branch(),
               payA = [... new Set(Tawi==0?ALLPAYACCOUNTS.map(ac=>ac.id):ALLPAYACCOUNTS.filter(dk=>dk.Interprise_id===Tawi).map(ac=>ac.id))],
               payInitial = payA.map(ac=>{
                 const aff=aci=>aci.Akaunt_id===ac,
                       expd = allExpense.filter(aff),
                       incd = allIncome.filter(aff),
                       expFr = expd.filter(fr=>moment(fr.tarehe).format()<moment(from).format()&&(!fr.kuhamisha || fr.kuhamishaNje)).reduce((a,b)=>a + Number(b.Amount),0),
                       incFr = incd.filter(fr=>moment(fr.tarehe).format()<moment(from).format()&&(!fr.kuhamisha || fr.kuhamishaNje)).reduce((a,b)=>a + Number(b.Amount),0),
                    
                       katwa = expd.filter(fr=>moment(fr.tarehe).format()<moment(from).format()).reduce((a,b)=>a + Number(b.makato),0),
                       initial = expd.length>0 && incd.length>0?expd[0].tarehe<incd[0].tarehe?expd[0].before:incd[0].before:expd.length>0?expd[0].before:incd.length>0?incd[0].before:0,
                       othersA =  others.filter(d=>d.ac===ac).reduce((a,b)=> a + Number(b.amount),0),
                
                       deposit = income.filter(aff),
                       withdraw = expend.filter(aff)

                   
                 return {
                     ac:ac,
                     name:ALLPAYACCOUNTS.find(aci=>aci.id===ac).Akaunt_name || null,
                     intial:Number(initial) + Number(othersA) + Number(incFr) - Number(expFr+katwa),
                     from:ac,
                     to:ac,
                     depositA:deposit.reduce((a,b)=>a + Number(b.Amount),0),
                     withdrawA:withdraw.reduce((a,b)=>a + Number(Number(b.Amount)+Number(b.makato)),0),

                     exp:withdraw,
                     inc:deposit,
                     amount:Number(ALLPAYACCOUNTS.find(aci=>aci.id===ac).Amount) || 0
                 }
               })

               PAYACC = payInitial



               
              //  INCOME TABLE GENERATE ................................................................//
            const  capitalAmount = payInitial.reduce((a,b)=>a + Number(b.intial),0),

              mauzo = income.filter(iv=>iv.invo_id!=null && !iv.serv).reduce((a,b)=>a + Number(b.Amount),0),
              huduma = income.filter(iv=>iv.invo_id!=null && iv.serv).reduce((a,b)=>a + Number(b.Amount),0),
              huduma_nyingine = income.filter(iv=>iv.huduma_nyingine_id!=null).reduce((a,b)=>a + Number(b.Amount),0),
              mtaji = income.filter(iv=>iv.huduma_nyingine_id===null&&iv.invo_id===null&&(!iv.kuhamisha||iv.kuhamishaNje)).reduce((a,b)=>a + Number(b.Amount),0),
              totalIncome = mauzo+huduma+huduma_nyingine+mtaji,

              incomT = () =>{
                let tr = `
                              <tr class="weight600 " style="background-color: rgba(160, 57, 49, 0.13)">
                                    <td>${lang('Kianzio','Opening Amount')}</td>
                                    <td>${floatValue(capitalAmount)}</td>
                              </tr>`

                              if(mauzo>0){
                                 tr+= `<tr>
                                        <td>${lang('Mauzo ya Bidhaa','Goods Sales ')}</td>
                                        <td>${floatValue(mauzo)}</td>
                                  </tr>`
                              }
                            if(huduma>0){
                                 tr+=
                             `<tr>
                                    <td>${lang('Mapato ya Huduma','Services Income ')}</td>
                                    <td>${floatValue(huduma)}</td>
                              </tr>`
                            }

                              if(huduma_nyingine>0){
                                 tr+=`
                                 <tr>
                                    <td>${lang('Mapato ya Huduma Nyingine','Other Services Income ')}</td>
                                    <td>${floatValue(huduma_nyingine)}</td>
                                </tr>`
                            }

                              if(mtaji>0){
                                 tr+=`
                                 <tr>
                                    <td>${lang('Kuongeza Mtaji','Adding Capital')}</td>
                                    <td>${floatValue(mtaji)}</td>
                                 </tr>`
                            }
                          
                          

                          return tr
              },
               
              //EXPENDITURE TABLE GENERATE .....................................................//
              manunuzi = expend.filter(bil=>bil.bill_id!=null).reduce((a,b)=>a + Number(b.Amount),0),
              fidia = expend.filter(bil=>bil.bill_id===null && !bil.kuhamisha && !bil.personal && bil.matumizi_id===null && bil.produxn_id===null).reduce((a,b)=>a + Number(b.Amount),0),
              Uzalishaji = expend.filter(bil=>bil.produxn_id!=null).reduce((a,b)=>a + Number(b.Amount),0),
              use = expend.filter(bil=>bil.matumizi_id!=null),
              used = [... new Set(use.map(u=>u.expenses))],
              makato = expend.reduce((a,b)=>a + Number(b.makato),0),
              hamishaKwendaNje = expend.filter(bil=>bil.kuhamishaNje).reduce((a,b)=>a + Number(b.Amount),0),
              personal = expend.filter(bil=>bil.personal).reduce((a,b)=>a + Number(b.Amount),0),
              matumizi = used.map(us=>{
                return {
                           id:us,
                           amount:use.filter(m=>m.expenses===us).reduce((a,b)=> a + Number(b.Amount),0),
                           name:use.filter(m=>m.expenses===us)[0].matumiziN

                        }
              }
              ),
              totExp = expend.filter(h=>!h.kuhamisha || h.kuhamishaNje).reduce((a,b)=>a+Number(b.Amount),0)+makato,


              ExpendT = () =>{
                let tr = `<tr style="background-color: rgba(160, 57, 49, 0.13)">
                                        <td>-----</td>
                                        <td>-----</td>
                                  </tr>`

                              if(manunuzi>0){
                                 tr+= `<tr>
                                        <td>${lang('Manunuzi ya Bidhaa','Goods Purchases')}</td>
                                        <td>${floatValue(manunuzi)}</td>
                                  </tr>`
                              }
                            if(fidia>0){
                                 tr+=
                             `<tr>
                                    <td>${lang('Kurudisha Pesa ya Mauzo','Sales Return Refunding')}</td>
                                    <td>${floatValue(fidia)}</td>
                              </tr>`
                            }

                              if(Uzalishaji>0){
                                 tr+=`
                                 <tr>
                                    <td>${lang('Kughalamia Uzalishaji','Manufacturing/Proccessing Expenses ')}</td>
                                    <td>${floatValue(Uzalishaji)}</td>
                                </tr>`
                            }

                              if(use.length>0){
                                matumizi.forEach(us=>{
                                   tr+=`
                                      <tr>
                                          <td>${us.name}</td>
                                          <td>${floatValue(us.amount)}</td>
                                      </tr>`
                                })
                                
                            }

                              if(makato>0){
                                   tr+=`
                                      <tr>
                                          <td>${lang('Makato ya Miamala','Transaction Fees')}</td>
                                          <td>${floatValue(makato)}</td>
                                      </tr>`
                             
                                
                            }
                              if(hamishaKwendaNje>0){
                                   tr+=`
                                      <tr>
                                          <td>${lang('Kuhamisha Pesa kwenda Nje','Amount transfer To Other Branches')}</td>
                                          <td>${floatValue(hamishaKwendaNje)}</td>
                                      </tr>`
                             
                                
                            }
                              if(personal>0){
                                   tr+=`
                                      <tr>
                                          <td>${lang('Mambo Binafsi','Personal issues')}</td>
                                          <td>${floatValue(personal)}</td>
                                      </tr>`
                             
                                
                            }
                          
                          

                          return tr
              },

              NetBalance = `${lang('Kiasi Kilichobaki','Net Balance')}: ${CURRENCII}. <strong> ${floatValue(totalIncome+capitalAmount-totExp)} </strong>`


             
        
               $('#incomeTable').html(incomT()) 
               $('#ExpendTable').html(ExpendT()) 
               $('#netIncome').text(floatValue(totalIncome))
               $('#netExpense').text(floatValue(totExp))
               $('#netBalance').html(NetBalance)


}

function placedeposit(itms){
  const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        {itms:itmd,muda,ankara} = itms,
        dates = [...new Set(itmd.map(i=>moment(i.tarehe).format('YYYY-MM-DD')))].sort(),
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],

        mAmount= months.map(dt=>monthArr(dt)),
        amounts = dates.map(dt=>chartDt(dt)),
        

        fro = moment(muda.from),
        to   = moment(muda.to),  
        days = Number(to.diff(fro,'days')) + 1  

 function monthArr(mth){
     const mthf = l=>Number(moment(l.tarehe).format('YYYYMM'))===Number(mth),
           itmz = itmd.filter(mthf)
          
      

     return {
         month:moment(itmz[0]?.tarehe).format('MMMM, YYYY'),
         itms:itmz,
         from:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[0],
         to:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[itmz.length - 1],
         idadi:itmz.length,       
         cost:Number(itmz.reduce((a,b)=> a + Number(b.Amount),0))  ,
         exp:[],
         inc:itmz
      
     }
 }

function chartDt(dt){
    const itmz =  itmd.filter(i=>moment(i.tarehe).format('YYYY-MM-DD')===dt) 
        return { 
                date:dt,
                itms:itmz,
                from:moment(itmz[0]?.tarehe).format('YYYY-MM-DD'),
                to:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[itmz.length - 1],
                idadi:itmz.length,
                cost:Number(itmz.reduce((a,b)=> a + Number(b.Amount),0)),
                exp:[],
                inc:itmz
            }
}  


    $('#howMany').text(`${dates.length}/${days}`)
    Transactions = days<=31?amounts:mAmount
 
     if(LoC){
                
             WithdrawDepositChat({itmsi:itmd,ankara,muda})
           
 
             
        
 
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
                
                     <td> <button data-from="${a.from}" data-to="${a.to}" data-exp=0 class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.idadi)}</button></td>
                     
                    
                    
                      `
                })
 
        td+=`</tbody>
        </table>
        `   
        
    let title = `<h6 class="py-2" >${lang(`Miamala ya Kuweka Pesa kwa Ujumla kwa kila `,`Amount Deposit on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
      
 
        $('#theDataPanel').html(`${title} ${td}`)
        
 
        $('#InvoRiportTable').DataTable();
     }

}

function placeWithdraw(itms){
  const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
  {itms:itmd,muda,ankara} = itms,
  dates = [...new Set(itmd.map(i=>moment(i.tarehe).format('YYYY-MM-DD')))].sort(),
  months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],

  mAmount= months.map(dt=>monthArr(dt)),
  amounts = dates.map(dt=>chartDt(dt)),
  

  fro = moment(muda.from),
  to   = moment(muda.to),  
  days = Number(to.diff(fro,'days')) + 1  

 function monthArr(mth){
     const mthf = l=>Number(moment(l.tarehe).format('YYYYMM'))===Number(mth),
           itmz = itmd.filter(mthf)
          
      

     return {
         month:moment(itmz[0]?.tarehe).format('MMMM, YYYY'),
         itms:itmz,
         from:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[0],
         to:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[itmz.length - 1],
         idadi:itmz.length,       
         cost:Number(itmz.reduce((a,b)=> a + Number(Number(b.Amount)+Number(b.makato)),0)),
         exp:itmz,
         inc:[]
      
     }
 }


    function chartDt(dt){
       const itmz =  itmd.filter(i=>moment(i.tarehe).format('YYYY-MM-DD')===dt) 
         return { 
                  date:dt,
                  itms:itmz,
                  from:moment(itmz[0]?.tarehe).format('YYYY-MM-DD'),
                  to:itmz.map(d=>moment(d.tarehe).format('YYYY-MM-DD')).sort()[itmz.length - 1],
                  idadi:itmz.length,
                  cost:Number(itmz.reduce((a,b)=> a + Number(b.Amount),0)),
                  exp:itmz,
                  inc:[]
               }
    }  


    $('#howMany').text(`${dates.length}/${days}`)
    Transactions = days<=31?amounts:mAmount
 
     if(LoC){

           WithdrawDepositChat({ankara:itmd,itmsi:ankara,muda})
 
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
                
                     <td> <button data-from="${a.from}" data-to="${a.to}" data-exp=1 class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.idadi)}</button></td>
                     
                    
                    
                      `
                })
 
        td+=`</tbody>
        </table>
        `   
        
    let title = `<h6 class="py-2" >${lang(` Miamala ya Kutoa Pesa kwa Ujumla kwa kila `,`Amount Withdraw  on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
      
 
        $('#theDataPanel').html(`${title} ${td}`)
        
 
        $('#InvoRiportTable').DataTable();
     }

}

function placeAlipia(){
  const LoC = Number($('#riportChatRist .btn-secondary').data('riport')),
        malipo = PAYACC
        Transactions = malipo
        
    if(LoC){

      //Draw new Chart................................................................................................................./
      let title = `<h6 class="py-2 " >${lang(`Takwimu ya Kuwekwa na Kutoa Pesa kwa kila Akaunti ya Malipo`,`Amount Deposit & Withdraw Statistics in each Payment Account  `)}, ${duraTitle}<h6/>`
      $('#theDataPanel').html(`${title} <div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);

             
      var canvas = document.getElementById('myChartC');
      var ctx = canvas.getContext('2d');
      var data= {
              labels: malipo.map(b=>b.name),
              datasets: [
                {
                  label:lang("Pesa Ilowekwa","Amount Deposit"),
                  fill: true,
                  lineTension: 0,
                  backgroundColor: "#336699",
                  borderColor: "#336699", // The main line color

                  
                  // notice the gap in the data and the spanGaps: true
                  data: malipo.map(a=>Number(a.depositA).toFixed(FIXED_VALUE)),
                  spanGaps: true,
                  }, 
                {
                  label:lang("Pesa Ilotolewa","Amount Withdraw"),
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
          <th rowspan=3> ${lang('Miamala','Transactions')} </th>
          
          <tr>
            <th colspan=2 > ${lang('Pesa Ilowekwa','Amount Deposit')} </th>
            <th colspan=2 > ${lang('Pesa Ilotolewa','Amount Withdraw')} </th>
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
        <td class=" weight600"  ><button data-from="${a.ac}" data-to="${a.ac}" data-ac=1 data-exp=0 data-all=1 class="btn btn-default checkInvo latoFont text-primary">${Number(a.inc.length)+Number(a.exp.length)}</button></td>

        <td><button data-from="${a.ac}" data-to="${a.ac}" data-ac=1 data-all=0 data-exp=0 class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.inc.length)}</button></td>
        <td>${floatValue(a.depositA)}</td>

        <td><button data-from="${a.ac}" data-to="${a.ac}" data-ac=1 data-all=0 data-exp=1 class="btn btn-default checkInvo latoFont text-primary"> ${Number(a.exp.length)}</button></td>        
        <td>${floatValue(a.withdrawA)}</td>

        
      
        `
  })

td+=`</tbody>
</table>
`   
let title = `<h6 class="py-2 " >${lang(`Pesa kuwekwa na Kutolewa kwa kila Akaunti ya Malipo`,`Amount Deposit & Withdraw  in each Payment Account  `)}, ${duraTitle}<h6/>`
$('#theDataPanel').html(title+td)
$('#SoldItems').DataTable();
  }

}


function WithdrawDepositChat(itms){

    const {itmsi,muda,ankara} = itms,
           itmd = [... itmsi.map(r=>{return{amount:Number(r.Amount),tarehe:r.tarehe,weka:1}}),... ankara.map(r=>{return{amount:Number(r.Amount)+Number(r.makato),tarehe:r.tarehe,weka:0}})],
  
        dates = [...new Set(itmd.map(i=>moment(i.tarehe).format('YYYY-MM-DD')))].sort(),
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))],

        mAmount= months.map(dt=>monthArr(dt)),
        amounts = dates.map(dt=>chartDt(dt)),
        

        fro = moment(muda.from),
        to   = moment(muda.to),  
        days = Number(to.diff(fro,'days')) + 1  

 function monthArr(mth){
     const mthf = l=>Number(moment(l.tarehe).format('YYYYMM'))===Number(mth),
           itmz = itmd.filter(mthf)
           
      

     return {
         month:moment(itmz[0]?.tarehe).format('MMMM, YYYY'),
       
         depoAmo:Number(itmz.filter(w=>w.weka).reduce((a,b)=> a + Number(b.amount),0))  ,
         WithdrAmo:Number(itmz.filter(w=>!w.weka).reduce((a,b)=> a + Number(b.amount),0)),
        
      
     }
 }

function chartDt(dt){
    const itmz =  itmd.filter(i=>moment(i.tarehe).format('YYYY-MM-DD')===dt) 
        return { 
                date:dt,
                depoAmo:Number(itmz.filter(w=>w.weka).reduce((a,b)=> a + Number(b.amount),0))  ,
                WithdrAmo:Number(itmz.filter(w=>!w.weka).reduce((a,b)=> a + Number(b.amount),0)),
            }
}  




  //Draw new Chart................................................................................................................./
  let title = `<h6 class="py-2" >${lang(`Takwimu za Miamala ya Kutoa na Kuweka Pesa kwa kila `,`Amount Deposit & Withdraw Transactions Statistics on each `)} ${days<=31?lang('Siku','Day'):lang('Mwezi','Month')}, ${duraTitle}<h6/>`
                
  $('#theDataPanel').html(`${title}<div class="table-responsive" ><canvas style="${window.outerWidth>800?'max-height:85vh !important':'max-height:70vh !important'} "  id="myChartC"></canvas></div>`);
   
      
  var canvas = document.getElementById('myChartC');
  var ctx = canvas.getContext('2d');
  var data= {
          labels: days<=31?amounts.map(d=>moment(d.date).format('ddd, DD-MM-YYYY')):mAmount.map(m=>m.month),
          datasets: [ 
              {
                  label: lang("Kutoa Pesa","Amount Withdraw"),
                  fill: true,
                  lineTension: 0,
                  backgroundColor: "#BF2B2B15",
                  borderColor: "brown", // The main line color
              
                  // notice the gap in the data and the spanGaps: false
                  data:days<=31?amounts.map(a=>Number(a.WithdrAmo).toFixed(FIXED_VALUE)):mAmount.map(m=>m.WithdrAmo),
                  spanGaps: false,
              },
              {
                  label: lang("Kuweka Pesa","Amount Diposit"),
                  fill: true,
                  lineTension: 0,
                  backgroundColor: "#33669928",
                  borderColor: "#336699", // The main line color
              
                  // notice the gap in the data and the spanGaps: false
                  data:days<=31?amounts.map(a=>Number(a.depoAmo).toFixed(FIXED_VALUE)):mAmount.map(m=>m.depoAmo),
                  spanGaps: false,
              },
             
            
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

$('body').on('click','.checkInvo',function(){
  viewList({from:$(this).data('from'),to:$(this).data('to'),all:Number($(this).data('all')),exp:Number($(this).data('exp')),ac:Number($(this).data('ac'))||0})
})

function viewList(muda){
    
  const {from,to,exp:xp,ac,all} = muda,trnsxn = Transactions.filter(d=>d.from===from && d.to===to)[0],{exp,inc} = trnsxn
  //console.log(Transactions) 
depositTr = () =>{
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


inc.reverse().forEach(dt => {
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
             tr+=`<td>${dt.huduma_nyingine_id?lang('Huduma nyingine','Other Services'):dt.kutoka.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
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
 
withdrawTr = () =>{
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

     exp.reverse().forEach(dt => {
        tr+=`<tr>
                    <td  valign="middle">${num+=1}</td>
                    <td  valign="middle">${moment(dt.tarehe).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td  class="text-capitalize"  valign="middle">${dt.akauntiN?.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                    <td>${floatValue(dt.Amount)}</td>
                    <td>${floatValue(dt.makato)}</td>
                    <td>${floatValue(dt.before)}</td>
                    <td>${floatValue(dt.After)}</td>`
        
                    if(dt.bill_id!=null){
                      let bil = `BIL-<a class="ivoice_details" href="/purchase/viewbill?back_to=akaunting&item_valued=${dt.bill_id}" type="button"  data-id="${dt.bill_id}">${dt.bill_code}</a>`
        
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

}

allTranxn = () =>{
    const depoTrxn = inc.map(t=>
        {
            let invo = `
            <button type="button" data-val=${t.invo_id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm border0 viewInvo smallerFont btn-light" title="${lang('Onesha Ankara','View Invo')}">
                INVO-<span class="text-primary">${t.invo_code}</span>
             </button>
            `,
             invo_desc = t.serv?lang('Mapato Kutokana na Huduma','Service Income'):lang('Mauzo ya Bidhaa','Goods Sales') + ' '+invo
             
             return{
                  date:t.tarehe,
                  amount:t.Amount,
                  before:t.before,
                  after:t.After,
                  weka:1,
                  l_name:t.l_name,
                  f_name:t.f_name,
                  maelezo:t.invo_id?invo_desc:t.maelezo,
                  name:t.akauntiN.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")
                }}),

          withdrTr = exp.map(t=>{
            let bil = `BIL-<a class="ivoice_details" href="/purchase/viewbill?back_to=akaunting&item_valued=${t.bill_id}" type="button"  data-id="${t.bill_id}">${t.bill_code}</a>`
                bil = lang('Kulipia Manunuzi ','Purchase Payment ') + bil

                 return{
                    date:t.tarehe,
                    amount:Number(t.Amount)+Number(t.makato),
                    before:t.before,
                    after:t.After,
                    weka:0,
                    maelezo:t.bill_id?bil:t.maelezo,
                    l_name:t.l_name,
                    f_name:t.f_name,
                    name:t.akauntiN.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}}),
          alltr = [...withdrTr,...depoTrxn]

          alltr.sort((a,b)=>(a.date>b.date)? 1 :(a.date ===b.date)
                                   ?((a.date > b.date)? 1 : -1) : -1 )

                                   let tr=  `
                                   <table id="table-transaxns" table-hover class="table table-bordered smallFont" style="width:100%">
                                    <thead>
                                    <tr class="smallFont ">
                                          <th scope="col">#</th>
                                          <th scope="col"> ${lang('Tarehe','Date')}   </th>
                                          <th scope="col"> ${lang('Muamala','Transaction')}  </th>
                                          <th scope="col"> ${lang('Akaunti','Account')}  </th>
                                          <th scope="col"> ${lang('kiasi','Amount')}<span class="text-primary latoFont">${currencii}</span></th>
                                          <th scope="col"> ${lang('kabla','Before')}   <span class="text-primary latoFont">${currencii}</span></th>
                                          <th scope="col"> ${lang('baada','After')}   <span class="text-primary latoFont">${currencii}</span></th>
                                          <th scope="col"> ${lang('Maelezo','Descriptions')}</th>
                                          <th scope="col"> ${lang('Na','By')} </th>
                                   </tr>
                                  </thead>
                                        <tbody id="products_list">`,
                                       num = 0
                                  
                                       alltr.reverse().forEach(dt => {
                                          tr+=`<tr  ${!dt.weka?`class="usage"`:' '} >
                                                      <td   valign="middle">${num+=1}</td>
                                                      <td   valign="middle">${moment(dt.date).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                      <td >${dt.weka?`<span class="darkblue">${lang('Kuweka Pesa','Amount Deposit')}</span>`:`<span class="brown">${lang('Kutoa Pesa','Amount Withdraw')}</span>`}</td>
                                                      <td   class="text-capitalize "  valign="middle">${dt.name?.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                                                      <td >${floatValue(dt.amount)}</td>
                                                      <td >${floatValue(dt.before)}</td>
                                                      <td >${floatValue(dt.after)}</td>
                                                      <td >${dt.maelezo}</td>
                                                      `
                                          
                                                  
                                                    tr+=`<td class="text-capitalize" >${(dt.f_name || "None").replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "") +' '+ (dt.l_name || "None").replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                                                   </tr>`
                                               
                                                })
                                  
                                                tr+=`</tbody></table>`
                                                return tr                        

        }

                 
           const d1= moment(muda.from).format('YYYY-MM-DD'),
                  d2=moment(muda.to).format('YYYY-MM-DD'),
                  dur = d2>d1?moment(d2).format('MMMM, YYYY'):moment(d2).format('DD/MM/YYYY'),
                  trns = ac?trnsxn.name:dur,
                  title = `<h6 class="py-2 " >${all?lang('Miamala ya Kuweka/Kutoa Pesa','Amount Withdraw/Deposit Transactions'):xp?lang('Miamala ya Kutoa Pesa','Amount Withdraw'):lang('Miamala ya Kuweka Pesa','Amount Deposit')},<span class=" text-capitalize darkblue"> ${trns}</span> ${ac?','+duraTitle:''} <h6/>`,
                  tbr = all?allTranxn():xp?withdrawTr():depositTr()

   
              
              $('#theDataPanel').html(title+tbr)
              $('#table-transaxns').DataTable();


           

              $('.riportOn').addClass('btn-light')
              $('.riportOn').removeClass('btn-primary')


}  





 







