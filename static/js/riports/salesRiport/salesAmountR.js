
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
                    s:servs,
                    tf:StartDate,
                    tt:moment().format(),
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                },
                url:'/riport/SalesAmountR'}

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
                                 txt:`${lang('Leo, Kuanzia<span class="brown">','Today, From<span class="brown">')}(${moment().startOf('day').format('dddd DD/MM/YYYY HH:mm')})</span> <span style="color:green"> ${lang('Hadi sasa','Up to now')}</span>`, 
                               
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
                        s:servs,
                        tf:from,
                        tt:to,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                    },
                    url:'/riport/SalesAmountR'}
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
                        txt:`${name},${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(from).startOf('day').format('dddd DD/MM/YYYY')})</span>, ${txt}`, 
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
                    dt= td.dt,
                    dtI =td.dtI,
                    amo = Number(dt.reduce((a,b)=> a + Number(b.amount),0))

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
                  ankara= Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)==Tawi),
                  itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)==Tawi),

                  Na = ByU()


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

                            

                             ankara = Na==0?ankara:ankara.filter(s=>s.Na==Na)
                             itms = Na==0?itms:itms.filter(s=>s.By==Na)
                            

                             let itmO = itms ,
                             vAnakara = ankara.map(a=>Varr(a))
                             function  Varr(a){
                                 let itmz =itmO.filter(m=>Number(m.mauzo_id)==a.id) , ar= {...a,evat:itmz.reduce((a,b)=> a + Number(b.idadi*(vatPer(b.vat,b.bei))),0),vat:itmz.filter(v=>v.vat_set).reduce((a,b)=> a + Number(b.idadi*(vatPer(b.vat,b.bei))),0)}
                                 return ar
                             }
                              //    VAT FILTER

                       
                                

                            

                      let amo = Number(ankara.reduce((a,b)=> a + Number(b.amount),0))
                       
                        viewList({from:theDT.from,to:theDT.To})
                                 
                   

                          let btn = `  <button title="${lang('Hifadhi Riport','Save Riport')}" class="smallMadebuttons border0 text-primary float-right smallFont " data-toggle="modal" data-target="#saveRiportTime" >
                                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
                                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                              </svg>
                                              
                                          </button>`

                          $('#riporttitle').html(`${theDT.txt} ${btn}`) 
                              

                          const retns = document.getElementById('returns'),
                               // itmsR = document.getElementById('Itemsreturns'),
                              //  ilolipwa = document.getElementById('returnedAmount'),
                                pamo = document.getElementById('returnsAmount')
                       


                              animateValue(retns, 0, Number(ankara.length).toFixed(FIXED_VALUE), 500);
                             // animateValue(itmsR, 0, Number(itms.length).toFixed(2), 500);
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


function viewList(muda){
    let  dt =  theData.state.filter(i=>moment(i.from)<=moment(muda.from)&&moment(i.To)>=moment(muda.to))
    if(dt.length>0){
         let ft = i=>  moment(i.tarehe).startOf('day').format() >= moment(muda.from).startOf('day').format()&& moment(i.tarehe).endOf('day').format() <= moment(muda.to).endOf('day').format() ,
          theDT = dt[0],
          vali=Number($('#MauzoAina').val()),online = Number(vali==2 || vali==0),direct = Number(vali==1 || vali == 0),
        
          Df = i => !i.online,  Lf = i=>i.online,Na = ByU(),Tawi = branch(),Wvat=withVat()
         


          //  BRANCH SELECTOR FILTER
          ankara= Tawi==0?theDT.dt:theDT.dt.filter(d=>Number(d.duka)==Tawi),
          itms =Tawi==0?theDT.dtI:theDT.dtI.filter(d=>Number(d.duka)==Tawi)

       
          //USER FILTER
          ankara = Na==0?ankara:ankara.filter(s=>s.Na==Na)
          itms = Na==0?itms:itms.filter(s=>s.By==Na)

          ankara = ankara.filter(ft)
          itms = itms.filter(ft)

        



          tr = `<table id="table-Invoices" class="table table-bordered smallFont" style="width:100%">
                   <thead>
                        <tr class="smallerFont ">
                            
                            <th>#</th>
                            <th> ${lang('Tarehe','Date')}</th>
                            <th> ${lang('Kwa','To')}</th>

                            <th> ${lang('Kurudishwa','Return')}</th>
                            <th> ${lang('Ankara','Invoice')}</th>
                            <th> ${lang('Akaunti','Account')}</th>
                            
                            <th class="browm weight600" > ${lang('Kiasi','Amount')}<span class="text-primary latoFont">(${currencii})</span></th> 

                            <th> ${lang('Makato','Charges')}<span class="text-primary latoFont">(${currencii})</span></th>
                            <th> ${lang('Kiasi kilichopo','Current Amont')}<span class="text-primary latoFont">(${currencii})</span></th>

                            <th> ${lang('Na','By')}</th> 
                            <th> ${lang('Sababu','Reasons')}</th> 
                          
                          
                        </tr>
                    </thead></tbody>`,n=0

                    

                ankara.forEach(a=>{
                    n+=1
                    let itmz =itms.filter(n=>n.ret_id== a.id)

                        
                         
                    tr+= `<tr class="noWordCut" > 
                      <td>${n}</td>
                      <td >${moment(a.tarehe).format('DD-MM-YYYY HH:mm')}</td>
                      <td class="text-capitalize noWordCut" >  ${a.mteja}</td>
                      <td> <a type="button" data-val=${a.id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm text-primary viewAmountR smallerFont " title="${lang('Onesha Notisi','View Notice')}" > ARTN-${a.code} </a></td>
                      <td><a type="button" data-val=${a.ivo_id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm text-primary viewInvo smallerFont " title="${lang('Onesha Ankara','View Invo')}"> INVO-${a.InvoCode}</a></td>
                     
                      <td><a type="button"  data-target="#ShowTheInvo"  class="btn btn-sm brown  latoFont text-capitalize" >${a.akaunti}</a></td>
                      

                      <td  class="brown weight600" >${floatValue(a.amount)}</td>
                       <td  >${floatValue(a.makato)}</td>


                      <td class="" >${floatValue(a.CurrentA)}</td>

                     
                                       
                      <td class="text-capitalize" >${a.f_name} ${a.l_name}</td>
                      <td>${a.maelezo}</td>
                    
                      </tr>
                    ` 
                })   

                
                tr+=`</tbody></table>`
                  

                $('#theDataPanel').html(tr)
                $('#table-Invoices').DataTable();

              



        }    
}

// VIEW RETURNED ITEMS................................................................................................//
$('body').on('click','.viewAmountR',function(){     
    $('#ifPaid').hide()
    $('#ifFidia').html('')
  
  let val = $(this).data('val'),
  data={
     data:{
     val:val,
     s:servs,
     csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
  },
  url:'/riport/TheAmountR' 
  }, fct = getRiportData(data)
  
  
  
  $('#Invo_notFound').hide()
  $('#the_invo_page').hide()
  $('#Invo_loader').show()
  
  fct.then(function(data){
  
     $('#Invo_loader').hide()
  
         
  
     if(data.success){
        $('#IfPaid').hide()  

        $('#theInvoAddress').html(theAmountReturn(data.invo))
         
         $('#the_invo_page').show()
         $('#niAnkara').hide()
     }else{
         $('#Invo_notFound').show()
  
         toastr.error(lang('Haikufanikiwa kutokana na hitilafu.','The operation was not successfully please try again'), lang('Haikufanikiwa','Error Alert'), {timeOut: 7000});
  
     }
    
  })
  
  
  
  
  })



  function theAmountReturn(invoL){

   
    invo = invoL[0]
//console.log(invo)
    return `
            <h5 class="text-secondary my-3 text-center weight600 latoFont" >
                ${lang('NOTISI YA KURUDISHA PESA YA ODA','ORDER AMOUNT RETURN NOTE')}
            </h5>
            <div class="row classic_div pt-3 latoFont" >
                    <div class="col-md-7 border-right">
                        <div class="row" >
                          <div class="col-12">
                            <div class="text-primary">
                               ${lang('Malipo Kutoka','Payment From')} :
                            </div>

                          </div>
                            <div class="col-12">
                                <h5 class="weight600 text-capitalize">
                                    ${invo.dukan}
                                </h5>
                            </div>
                                                         
                            <div class="col-12" style="margin-top:-6px">
                                <h6 class="">
                                    ${invo.mtaa} , ${invo.wilaya} , ${invo.mkoa}
                                </h6>
                            </div>

                        </div>

                       

                        
                  

                </div>

                 <div class="col-md-5 latoFont">

                      <div class="row smallFont" style="margin-top: -6px;">
                        <div class="col-5 text-right">
                            <h6 class="text-danger">
                                ${lang('Tarehe','Invoice Date')}   :
                            </h6>
                        </div>
                        <div class="col-7 text-right">
                            <h6>
                               ${moment(invo.date).format('DD-MM-YYYY')}
                            </h6>
                        </div>  
                      </div>

                      <div class="text-right" >
                         <h6>ARTN-${invo.code}</h6> 
                      </div>

                      <div class="text-right" >
                         <h6>                              
                           <a type="button" data-val=${invo.ivo_id}  class="btn btn-sm text-primary viewInvo smallerFont ">
                              ${invo.order?'ORD-':'INVO-'}${invo.code}
                            </a> 
                         </h6> 
                      </div>
                     

                   <hr>

                

                 </div>
             </div>


             <h6 class="px-3 latoFont" >
                    <span class="text-danger">
                        ${lang('Kwa Mteja','To Customer')}:
                    </span> <br>
                    <span class="weight600 text-capitalize" >
                        ${invo.mteja}
                    </span>
                    </span> <br>

                    <span >
                      ${lang('Simu','Phone')}: ${invo.simu}
                    </span>
                    <br>
                    <span >
                        ${invo.address?invo.address:''}
                    </span>
           </h6> 

           <hr>
           <div class="table-responsive">
             <div class="classic_div" style="min-width: 300px;">
                <div class="row classic_div  " >

                  <div class="col-12">
                      <h6 class="row latoFont">
                        

                          <div class="col-7">
                            <span >${lang('Pesa Iliyorudishwa','Returned Amount')}</span>:
                          </div>
                          <div class="col-5 text-right">
                            <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>: <label >${floatValue(invo.amount)} </label>

                          </div>

                          <div class="col-7">
                            <span >${lang('Makato','Charges')} </span>
                          </div>
                          <div class="col-5 text-right">
                            <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>: <label>${floatValue(invo.makato)} </label>

                          </div>

                          </h6>
                  </div>
                </div>
             </div>
            
           </div>

           <hr>

           <p class="p-3" >
                  ${lang('Imetolewa Na',' Issued By')}:<strong class="text-capitalize" > ${invo.f_name}   ${invo.l_name}</strong>
            </p>

            <h6 class="text-center py-2 mt-2" style="border-left:3px solid yellow;background:#f0f8fc">
                          
                <div class="p-3 d-inline" style="height: 50px;width:50px;border-radius:50%;color:rgb(191, 230, 253)">
                     <span class="text-info">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                             <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                             <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                           </svg>
                     </span>
                  </div>|
                 <span  style="font-family: 'Assistant';" >${invo.maelezo}</span>  
            
             </h6>



             <div class="table-responsive">
               <div class="classic_div " style="width: 700px;">
                 <h6 class="mt-3"> ${lang('Malipo','Payments')}:</h6> 

                <div class="d-flex classic_div" >
                  <div class="px-2">
                    <div class="text-center " 
                          style="
                                height:40px;
                                width:40px;
                                font-size:30px;
                                border:1px solid #f2f2f2;
                                border-radius:50%;
                                background:#fffdfd;
                                -webkit-box-shadow: inset 0px 0px 7px -4px rgba(0,0,0,0.33); 
                                box-shadow: inset 0px 0px 7px -4px rgba(0,0,0,0.33);

                                "> 
                          <div style="margin-top:-5px ;" > $</div> 
                    </div>
                  </div>
                  <div  style="border-left:2px solid #f2f2f2 ;">
                  <ul class="list-unstyled">

                    
                    <li class="py-1" >  
                      <div class="d-flex  latoFont">

                        
                        <span class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
                          <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                          <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                        </svg>                          
                        </span>

                      ${moment(invo.tarehe).format('DD,MMMM,YYYY HH:mm')}
                      

                      <span class="px-4">
                         <span class="darkblue"> ${currencii}</span>. <strong class="brown"> ${floatValue(invo.amount)} </strong>
                      </span>
                      
                        <strong>${invo.akaunti}</strong>

                      

                                              
                        <button class="btn btn-default text-primary btn-sm smallerFont" onclick="$('#show_pay_disp${invo.id}').toggle(400)" >
                                                  
                          ${lang('Maelezo','details')}  :

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        </button>                        
                      

                      </div>

                      <div class="row classic_div border-top" id="show_pay_disp${invo.id}" style="display: none;">
                        <div class="col-6 text-right">
                        ${lang('Kiasi','Amount')}    :
                        </div>
                        <div class="col-6 ">
                            <span class="darkblue"> ${currencii}</span>. <span class="brown weight600"> ${floatValue(invo.amount)} </span>
                        </div>
                        <div class="col-6 text-right">
                            ${lang('Kabla','Before')}   :
                        </div>
                        <div class="col-6">
                                <span class="darkblue"> ${currencii}</span>.  ${floatValue(invo.kabla)} 
                        </div>

                        <div class="col-6 text-right">
                        ${lang('Baada','After')}   :
                        </div>
                        <div class="col-6">
                               <span class="darkblue"> ${currencii}</span>. ${floatValue(invo.baada)} 
                        </div>

                        <div class="col-6 text-right">
                        ${lang('Na','By')}:
                        </div>
                        <div class="col-6">
                          <strong class="text-capitalize" >${invo.f_name} ${invo.l_name} </strong> 
                        </div>

                      </div>
                      
                    </li>

                  

                  </ul>
                  </div>
                </div>
             </div>
             </div>


    
    `

  }

 







