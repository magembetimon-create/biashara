



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
                    dt= td.dt,
                    dtI =td.dtI

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
                
                    <td class=" weight600">${Number(invo).toLocaleString()}</td>
                    <td class=" weight600">${Number(itms).toLocaleString()}</td>
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

                       
                                

                            

                      let amo = Number(ankara.reduce((a,b)=> a + Number(b.amount),0)),
                          ret = Number(ankara.reduce((a,b)=> a + Number(b.ilolipwa),0))
                       
                  
                     
                        

                          switch (Number(n)) {
                              case 1:
                                  viewList({from:theDT.from,to:theDT.To})
                                  break;
                              case 2:
                                    placeItems(itms)
                                   
                                 
                                  break;
                            //   case 3:
                            //       if(n==3){
                            //           placeCategory(itms,val)
                            //       }
                            //       break;
                            //   case 4:
                            //       placeGroups(itms,val)
                            //       break;
                            //   case 5:
                            //           placeAlipia(payi)
                                 
                            //       break;
                                  
                              
                          
                          }

                          let btn = `  <button title="${lang('Hifadhi Riport','Save Riport')}" class="smallMadebuttons border0 text-primary float-right smallFont " data-toggle="modal" data-target="#saveRiportTime" >
                                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
                                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                              </svg>
                                              
                                          </button>`

                          $('#riporttitle').html(`${theDT.txt} ${btn}`) 
                              

                          const retns = document.getElementById('returns'),
                                itmsR = document.getElementById('Itemsreturns'),
                                ilolipwa = document.getElementById('returnedAmount'),
                                pamo = document.getElementById('returnsAmount')
                       


                              animateValue(retns, 0, Number(ankara.length).toFixed(FIXED_VALUE), 500);
                              animateValue(itmsR, 0, Number(itms.length).toFixed(FIXED_VALUE), 500);
                              animateValue(ilolipwa, 0, Number(ret).toFixed(FIXED_VALUE), 700);
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
                            <th> ${servs?lang('Ankara','Invoice'):lang('Kurudishwa','Return')}</th>`
                            if(!servs){
                                tr+=`<th> ${lang('Ankara','Invoice')}</th>`
                            }

                            tr+=`<th> ${lang('Jina la Mteja','Customer Name')}</th>
                            <th> ${servs?lang('Huduma','Service'):lang('Bidhaa','Items')}</th>
                            <th> ${lang('Kiasi','Amount')}<span class="text-primary latoFont">(${currencii})</span></th> 
                           `
                           if(!servs){
                                tr+=`<th> ${lang('Fidia','Returned')}<span class="text-primary latoFont">(${currencii})</span></th>`  
                           }
                            
                           tr+=`<th> ${lang('Sababu','Reasons')}<span class="text-primary latoFont">(${currencii})</span></th> 
                          
                          
                        </tr>
                    </thead></tbody>`,n=0

                    

                ankara.forEach(a=>{
                    n+=1
                    let itmz = !servs?itms.filter(n=>n.ret_id== a.id):itms.filter(n=>n.mauzo_id== a.id)

                    tr+= `<tr> 
                      <td>${n}</td>
                      <td>${moment(a.tarehe).format('DD-MM-YYYY HH:mm')}</td>
                      <td> <a type="button" data-val=${a.id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm text-primary ${servs?'viewInvo':'viewReturn'} smallerFont " title="${servs?lang('Onesha Ankara','View Invoice'):lang('Onesha Notisi','View Notice')}" > ${servs?'INVO':'RET'}-${a.code} </a></td>`
                     
                      if(!servs){
                              tr+=`<td><a type="button" data-val=${a.ivo_id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm text-primary viewInvo smallerFont " title="${lang('Onesha Ankara','View Invoice')}"> INVO-${a.InvoCode}</a></td>`
                      }
                      
                      tr+=`<td class="text-capitalize" >${servs?a.mteja_jina:a.mteja}</td>

                      <td  >${floatValue(itmz.length)}</td>

                      <td  >${floatValue(a.amount)}</td>`

                      if(!servs){
                            tr+=`<td class="${Number(a.amount)>Number(a.ilolipwa)?'text-danger weight600':''}" >${floatValue(a.ilolipwa)}</td>`
                      }
                     
                      tr+=`<td class="text-capitalize" >${servs?a.desc:a.maelezo}</td>
                    
                      </tr>
                    ` 
                })   

                
                tr+=`</tbody></table>`
                  

                $('#theDataPanel').html(tr)
                $('#table-Invoices').DataTable();

              



        }    
}

 
function   placeItems(itms){

    let  dura = [
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
  

            td=  `<table id="SoldItems" class="table table-bordered smallFont" style="width:100%">
        <thead>
            <tr class="smallFont ">
                <th>#</th>
                <th>${lang('Tarehe','DateTime')}</th>
                <th>${servs?lang('Ankara','Invoice'):lang('Kurudishwa','Returned')}</th>

                <th>${servs?lang('Huduma','Service'):lang('Bidhaa','Item')}</th>                
                <th>${lang('vipimo','Units')}</th>

                <th>${servs?lang('Nafasi','Space'):lang('Mauzo','Sales')}</th>

                <th> ${servs?lang('Bei','Price'):lang('Mauzo','Sales')} <span class="text-primary latoFont">(${currencii})</span> </th>`
            if(servs){
                td+=`
                  <th colspan=2 >${lang('Muda Iliyohudumu','Served Duration ')}</th>
                  <th  >${lang('Mapato Jumla','Total Income')}<span class="text-primary latoFont">(${currencii})</span></th>
                `

                }
                
      td+=`</tr>
        </thead>
        <tbody id="products_list">`,
        num = 0
        
        
        itms.reverse().forEach(a=>{
            num+=1
            td+=`<tr>
              <td>${num}</td>
             
              <td class="text-capitalize" >${moment(servs?a.rudisha:a.tarehe).format('DD-MM-YYYY HH:mm')}</td>
              <td class="text-capitalize" ><a type="button" data-val=${servs?a.mauzo_id:a.ret_id} data-target="#ShowTheInvo" data-toggle="modal" class="btn btn-sm text-primary ${servs?'viewInvo':'viewReturn'} smallerFont " title="${lang('Onesha Notisi','View Notice')}" > ${servs?'INVO':'RET'}-${a.code} </a></td>

              <td class="text-capitalize" >${a.bidhaaN}</td>
              <td class="text-primary" >${a.kipimo}</td>
              <td class="weight600" >${Number(a.idadi).toFixed(FIXED_VALUE)}</td>

              <td>${floatValue(a.bei)}</td>
             `
              if(servs){
                    td+=`
                    <td>${dura.find(i=>i.value==a.timely).name}</td>
                    <td>${a.saveT}</td>
                    <td >${floatValue(a.bei*a.saveT)}</td>
                    `

                }
         
           })

td+=`</tbody>
</table>
`   

$('#theDataPanel').html(td)
$('#SoldItems').DataTable();
      
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



