class MudaData{
  constructor(_state){
      this.stated=_state
  }
  get state(){
    return this.stated
  }

  set state(newstate){
     this.stated=newstate
  }
}



let theData = new MudaData([])


class BillState{
  constructor(_state){
      this.stated=_state
  }
  get state(){
    return this.stated
  }

  set state(newstate){
     this.stated=newstate
  }
}

class BillData{
  constructor(_state){
      this.stated=_state
  }
  get state(){
    return this.stated
  }

  set state(newstate){
     this.stated=newstate
  }
}

class BidhaaState{
  constructor(_state){
      this.stated=_state
  }
  get state(){
    return this.stated
  }

  set state(newstate){
     this.stated=newstate
  }
}


var bilList = new BillState([]),
    billData = new BillData([]),
    bidhaaState = new BidhaaState([])
  

const  urli= $('#PeriodTable').data('urli'),servs=Number($('#PeriodTable').data('service')) || 0, withVat = ()=> Number($('#NaVat').val()) || 0,byVendor=()=> Number($('#NaVendor').val()) || 0, branch = () =>  Number($('#Matawini').val()), ByU =()=> Number($('#Waliotumia').val()) || 0 , Vallow =() =>  Number($('#Matawini').find('option:selected').data('vat')), vatPer = (p,b) =>  Vallow()?(Number(p)*Number(b))/(100+Number(p)):0
var duraTitle = '',Uzalishaji,theBillss = [],MARKED = 0,
    VAL=0, //This valiable is used to fetch data from the timely list data array
    placedataPanel = $('#theDataPanel'),// This will display the information according to when the user is on bills or items selection 
    OnlyDate=0 // this is when only Date and not with Time is required ....................//

    // MONTH START OR WEEK..........................................................//
const monthSt = moment().startOf('month').format(),
      weakStart = moment().startOf('isoWeek').format(),
      StartDate = monthSt<=weakStart?monthSt:weakStart 
function getRiportData(data){
    
   // $("#loadMe").modal('show');
   return   $.ajax({
                type: "POST",
                url: data.url,
                data: data.data,
              
      })
      
}



// VIEW INVOICES .....................................................................................................//
$('body').on('click','.viewInvo',function(){     
      $('#IfPaid').hide()

let val = $(this).data('val'),
   data={
       data:{
       val:val,
       csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
   },
   url:'/riport/theInvo' 
}, fct = getRiportData(data)


   
   $('#Invo_notFound').hide()
   $('#the_invo_page').hide()
   $('#Invo_loader').show()

   fct.then(function(data){

       $('#Invo_loader').hide()

           

       if(data.success){
           $('#theInvoAddress').html(theInvoAddress(data.invo,data.changed))

           
           $('#ifFidia').html(data.fidia.length>0?ifFidia(data.fidia):'')

           theInvoTable(data)
           $('#TheInvoPage').text(floatValue(data.invo.amount))
           $('#TheInvoBy').text(`${data.invo.f_name} ${data.invo.l_name}`)
           $('#TheMalipoLi').html(theInvoPayments(data.malipo))
          
            if(data.malipo.length>0){
             $('#IfPaid').show()
           }else{
             $('#IfPaid').hide()
           }

           


           $('#the_invo_page').show()
           $('#niAnkara').show()
       }else{
           $('#Invo_notFound').show()

           toastr.error(lang('Haikufanikiwa kutokana na hitilafu.','The operation was not successfully please try again'), lang('Haikufanikiwa','Error Alert'), {timeOut: 7000});

       }
      
   })




})

function theInvoTable(iv){
$('#ifcolor').hide()
$('#ifSize').hide()

let tot_vat=0,vat_include = false,vat_set=false,sub_tot=0
const vatper = Number(iv.invo.vat)/100
let itms=iv.itms,
   colors=iv.color.map(c=>colored(c)),
   sizes=iv.size.map(s=>sizing(s)),
   pr = iv.bei,
   tr='', sales=0,total_vat=0,rnum = 0,
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

   if(colors.length>0){
       $('#ifcolor').show()
   }
   if(sizes.length>0){
       $('#ifSize').show()
   }
  
   

   

   function colored(c){
       return {itm:c.mauzo_id,val:c.id,idadi:Number(c.idadi-c.returned),color_name:c.color_name,color_code:c.color_code}
   }

   function sizing(s){
       return {color:s.color_id,size:s.sized,idadi:Number(s.idadi-s.returned)}
   }


   


   

itms.forEach(itm=>{
let col = c =>c.itm === itm.val,prc = p =>p.prod ===itm.prod,muda = dura.find(v=>v.value===itm.timely)
const colr = colors.filter(col),prices = pr.filter(prc)
let beis = 0 ,idadis=0,idad=0,vpmo='',sale=0
const sold_p = Number(itm.sold/(1+vatper)),
      bei = sold_p > itm.bei?sold_p:itm.bei

let prics = [],
  prc1 = {
   unit:itm.vipimo,
   price:Number(itm.bei),
   qty:1
  } 

prics.push(prc1)   

rnum+=1

if(Number(itm.uwiano)>1){
   prc2={
        unit:itm.vipimo_jum,
        price:Number(itm.bei_jum),
        qty:Number(itm.uwiano)
   }
   prics.push(prc2)

}


prics = [...prics,...pr]

tr+=`
<tr class="text-center   latoFont" style="padding: 10px 3px !important;">`


if(colr.length==0){

let prp = b => Number(itm.idadi) % Number(b.qty)===0,
  prop_price = prics.filter(prp)

  if(prop_price.length == 0){
   prop_price = prics.filter(b=>Number(b.qty)===1)
}  

prop_price.sort((a,b)=>(a.qty>b.qty)? 1 :(a.qty ===b.qty)
?((a.qty > b.qty)? 1 : -1) : -1 )
let ps = prop_price[prop_price.length-1]  
    
       beis = Number(bei)*Number(ps.qty)

   vpmo = ps.unit
   idad = Number(itm.idadi)/Number(ps.qty)
   sale=Number(itm.sold)*Number(itm.idadi)

if( itm.vat_set){
//REGULATE MEASUARES.............//
   beis= itm.vat_include?(beis/(1+vatper)):beis
   sales+=(Number(itm.sold)/(1+vatper))*Number(itm.idadi)*itm.muda
   sale=sale/(1+vatper)               

}else{
   sales+=Number(itm.sold)*Number(itm.idadi)*itm.muda

}

sub_tot+=(beis*idad*itm.muda)
if(itm.vat_set){
total_vat+=sale*vatper*itm.muda
}


tr+=`
<td  >${rnum}</td>
<td class="text-left" > 
<div class="d-flex"  >
<div  style="width:40px;heigth:40px" >`
 if(itm.picha!=''){
   tr+=` <img src="${itm.picha}" style="max-width:100%;max-height:100%"  >`
  }else{
      tr+=` <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
      </svg>`
  }
tr+=`</div>

   <div class="ml-1" >
   <div><strong class="pl-1  text-capitalize" style="color: #3989c6"> ${itm.jina}</strong></div>
   <div class="pl-2 text-muted smallerFont itm_desc" style="color:blue">${itm.maelezo}</div>
   <div class="pl-2  smallerFont itm_desc font-weight-bold" >${itm.serial?.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "") || ' '}</div>
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
<td style="padding: 10px 3px !important;" > 
       ${Number(beis).toLocaleString()} 
</td>` 

tr+=` <td style="padding: 10px 3px !important;" > ${Number(idad).toFixed(FIXED_VALUE)}
  </td> 
  <td style="padding: 10px 3px !important;" >${ (beis * Number(idad)).toLocaleString()} </td> 
  `
  if(iv.invo.service){
    tr+=`
      <td  style="padding: 10px 3px !important;" >${muda.name} </td> 
      <td  style="padding: 10px 3px !important;" >${itm.muda} </td> 
      <td  style="padding: 10px 3px !important;" >${(beis * Number(idad)*Number(itm.muda)).toLocaleString()} </td> 

    `
  }

}else{
var span=colr.length+1
if(span==2){
span=1
}  


tr+=`<td class="rnum" rowspan="${span} ">${rnum}</td>
      <td class="text-left span1" id="span_${itm.val}" rowspan="${span}">
      <div class="d-flex "  >
      <div  style="width:40px;heigth:40px" >`
      if(itm.picha!=''){
        tr+=` <img src="${itm.picha}" style="max-width:100%;max-height:100%"  >`
        }else{
            tr+=` <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
            </svg>`
        }
      tr+=`</div>
      <div class="ml-1" >
        <div><strong class="pl-1 text-capitalize" style="color: #3989c6"> ${itm.jina} </strong></div>
        <div class="pl-2 itm_desc text-muted smallerFont" style="color:blue">${itm.maelezo}</div>
        <div class="pl-2  smallerFont itm_desc font-weight-bold" >${itm.serial?.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")|| ''}</div>
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

   beis = Number(bei)*Number(ps.qty)


vpmo = ps.unit
idad = Number(col.idadi)/Number(ps.qty)
sale=Number(itm.sold)*Number(col.idadi)

if( itm.vat_set){
//REGULATE MEASUARES.............//
beis= itm.vat_include?(beis/(1+vatper)):beis
sales+=Number(itm.sold)/(1+vatper)*Number(col.idadi)*itm.muda
sale=sale/(1+vatper)               

}else{
sales+=Number(itm.sold)*Number(col.idadi)*itm.muda

}

sub_tot+=(beis*idad*itm.muda)
if(itm.vat_set){
   total_vat+=sale*vatper*itm.muda
}

tr+=`<td style="padding: 10px 3px !important;" class="smallerFont text-left text-capitalize ">
     <div class="d-flex">   
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
         ${col.color_name}
     </div>
 </td> `
 if(sizes.length>0){
 tr+=`<td style="padding: 10px 3px !important;"> --- </td> `
 }

  
 
 tr+=`<td style="padding: 10px 3px !important;" >${vpmo}</td>
      <td style="padding: 10px 3px !important;" > 
                ${Number(beis).toLocaleString()} 
      </td>`


tr+=` <td style="padding: 10px 3px !important;" > 
          ${Number(idad).toFixed(FIXED_VALUE)}
      </td> 
      <td style="padding: 10px 3px !important;" >${ (beis * Number(idad)).toLocaleString()} </td> `

      if(iv.invo.service){
        tr+=`
          <td  style="padding: 10px 3px !important;" >${muda.name} </td> 
          <td  style="padding: 10px 3px !important;" >${itm.muda} </td> 
          <td  style="padding: 10px 3px !important;" >${(beis * Number(idad)*Number(itm.muda)).toLocaleString()} </td> 
    
        `
      }

}else{
tr+=`<td style="padding: 10px 3px !important;" `
if(sz.length>1){
  tr+=` rowspan=${sz.length+1}` 
}

tr+=` data-itm="${itm.val}" class="span2 smallerFont text-left text-capitalize" >
    
     <div class="d-flex">

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
         ${col.color_name}
     </div>
 </td>` 

sz.forEach(s=>{

   let prp = b => s.idadi % b.qty===0,
       prop_price = prics.filter(prp)

       if(prop_price.length == 0){
         prop_price = prics.filter(b=>Number(b.qty)===1)
     }  
     
    prop_price.sort((a,b)=>(a.qty>b.qty)? 1 :(a.qty ===b.qty)
      ?((a.qty > b.qty)? 1 : -1) : -1 )
    let ps = prop_price[prop_price.length-1]
       beis = Number(bei)*Number(ps.qty)
   vpmo = ps.unit
   idad = Number(s.idadi)/Number(ps.qty)
   sale=Number(itm.sold)*Number(s.idadi)

if( itm.vat_set){
//REGULATE MEASUARES.............//
   beis= itm.vat_include?(beis/(1+vatper)):beis
   sales+=Number(itm.sold)/(1+vatper)*Number(s.idadi)*itm.muda
   sale=sale/(1+vatper)               

}else{
   sales+=Number(itm.sold)*Number(s.idadi)*itm.muda

}
   sub_tot+=(beis*idad*itm.muda)
   if(itm.vat_set){
       total_vat+=sale*vatper*itm.muda
   }

 if(sz.length>1){
  tr+=`<tr class="text-center   latoFont" style="padding: 10px 3px !important;"> `
    
 }   

  tr+=`<td class="text-center" style="padding: 10px 3px !important;"><span class="text-danger smallFont"> ${s.size}</span></td>` 
 
  tr+=`<td style="padding: 10px 3px !important;" >${vpmo}</td>
       <td style="padding: 10px 3px !important;" > 
                   ${Number(beis).toLocaleString()} 
       </td>`


      tr+=`  <td class="text-center " style="padding: 10px 3px !important;" > ${Number(idad).toFixed(FIXED_VALUE)} 
      </td> 
       <td class="text-center " style="padding: 10px 3px !important;" >${ (beis * Number(idad)).toLocaleString()} </td> `
       if(iv.invo.service){
        tr+=`
          <td  style="padding: 10px 3px !important;" >${muda.name} </td> 
          <td  style="padding: 10px 3px !important;" >${itm.muda} </td> 
          <td  style="padding: 10px 3px !important;" >${(beis * Number(idad)*Number(itm.muda)).toLocaleString()} </td> 
    
        `
      }
  
       if(sz.length>1){
 tr+=`  </tr>`
}
  

    
})
}


tr+=`</tr>
`
})

}
if(span>2){
    tr+=`</tr>`
}


})  



$('#view-invo_tbody').html(tr)
if(sub_tot-sales>0){
$('#when_discount').show()
}else{
$('#when_discount').hide()   
}

$('#bei_halisi').text(sub_tot.toLocaleString())
$('#punguzo_tu').text((sub_tot-sales).toLocaleString())

$('#bei_bila_vat').text(sales.toLocaleString())

if(total_vat>0){
$('#show_vat_if').show()
}else{
$('#show_vat_if').hide()

}
$('#the_invo_vat').text(total_vat.toLocaleString())
$('#vatp').text(floatValue(iv.invo.vat))
//This will add a rowspan to all items if size is also involved

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

function theInvoAddress(iv,change){

   tr=`
   <div class="row classic_div pt-3" >
           
     <div class="col-12 border-bottom text-center" >
        <address>
            `
                                   
                    if(iv.logo){
                      tr+=`  <div class="pl-5" style="height: 50px;">
                              <img src="${iv.logo}" style="height:100%">
                          </div> `
                    }
                                  
                                 
                                     tr+=`<h5 class="font-weight-bold text-capitalize" id="Invo_name" >
                                         ${iv.duka}
                                     </h5>
                                
                                                              
                                 <div class="col-12" style="margin-top:-6px">
                                    <h6 class="text-capitalize" id="Invo_place" >
                                        ${(iv.mtaa).toLowerCase()}, ${(iv.kata).toLowerCase()}, ${iv.wilaya.toLowerCase()}, ${iv.mkoa.toLowerCase()}, ${iv.nchi.toLowerCase()}
                                    </h6>
                                 </div>

                                 <div class="col-12" style="margin-top:-6px">
                                     <h6 class="text-capitalize">
                                        ${iv.jengo||''}
                                     </h6>
                                 </div>
     
                         
     
                              <div class="row" style="margin-top: -6px;">
                                <div class="col-12">
                                     <h6 class="">
                                       code:${iv.Intp_code}
                                     </h6>
                                 </div>
                              
                             </div>
                           </address>    
     </div>
    
                       
                      <div class="col-md-12">
                        
                          <h2 class="text-danger latoFont">
                              ${lang(iv.service?'ANKARA YA HUDUMA':'ANKARA',iv.service?'SERVICE INVOICE':'INVOICE')} 
                          </h2>
                           <div class="" style="margin-top:-9px">
                              <h5 id="invo_code">INVO-${iv.code}</h5> 
                           </div>
                           <hr>
     
                           <div class="row " style="margin-top: -6px;">
                             <div class="col-5 ">
                                 <p class="text-danger">
                                     ${lang('Tarehe ','Invoice Date')}
                                 </p>
                             </div>
                             <div class="col-7 ">
                                 <p id="invo_tarehe" >
                                     ${moment(iv.date).format('DD/MM/YYYY')}
                                 </p>
                             </div>  
                           </div>
     
                        <div class="row " style="margin-top: -6px;">
                         <div class="col-5 ">
                          
                             <p class="  text-danger ">
                                  ${lang('Tarehe Kukamilisha','Due date')}
                             </p>
                            
                         </div>
                         <div class="col-7 ">
     
     
                           <p >
                                 <span id="invo_kulipa" class="${Number(iv.ilolipwa)<Number(iv.amount)?'bg-danger text-light p-1':''}">
                                    ${moment(iv.kulipa).format('DD/MM/YYYY')}
                                 </span>
                                  
                             </p>
                           
                         </div>
                         </div>
     
                         
                     <div class="row ">
                         <div class="col-5">
                             <h6>
                                 ${lang('Malipo','Payments')} :
                             </h6>
                         </div>
                       <h6 class="col-7">
                        
                             <strong id="invo_malipo">
                                 ${floatValue(Number((iv.ilolipwa)/Number(iv.amount))*100 | 0 )}%
                             </strong>
                         </h6>
     
                         </div>
     
       
                         
     
     
                      </div>
                  </div>`

                  if(iv.service){
                    $('.Hudumia').prop('hidden',false)
                    tr+=`
                    <hr>
                    <div class ="latoFont">
                    <div class="latoFont px-2 px-md-3 weight600">
                       
                        ${lang('Muda wa Huduma','Service Duration')} 
                    </div> 
                   <div class="row px-2 px-md-3">
                       <div class="col-md-7 row">
                           <div class="col-3 brown"> ${lang('Kuanzia','From')}:  </div>
                           <div class="col-8 weight500">
                              ${moment(iv.servFrom).format(' DD/MM/YYYY, HH:mm')}  
                                
                            </div>
                          
                       </div>
                       <div class="col-md-7 row"> 
                         <div class="col-3 brown"> ${lang('Hadi','To')} :  </div>
                           <div class="col-8 weight500">
                            ${moment(iv.servTo).format(' DD/MM/YYYY, HH:mm')}
                           </div>
                           
                        </div>`

                        if(iv.change){
                        tr+= `
                                <div class="col-md-7 row"> 
                                  <div class="col-3 brown weight600"> ${lang('Kubadilishwa','Changed on')}: </div>
                                    <div class="col-8 weight500">
                                      ${moment(iv.Changed).format('DD/MM/YYYY, HH:mm')}
                                    </div>
                                  </div>
                            </div>
                          `
                        }
                     
                      tr+= `<hr/></div>`
                  }else{
                    $('.Hudumia').prop('hidden',true)
                  }
                  
                   tr+=`<hr>
                    <div class="row px-3">
                     <div class="col-md latoFont" style="font-weight: 500;">
                       <span class="text-danger">
                           ${lang('Bili kwa','Bill To')}:
                       </span> <br>
                       <address >
                         
                          <strong id="invo_mteja" class="text-capitalize" > ${iv.mteja_jina} </strong>
                       <br> 
                       ${iv.simu?`${lang('Simu','Phone')} ${iv.simu}`:''}
                      <br>
                         <span class="text-capitalize">${(!iv.online?iv?.address:iv.OnlineAddress).toLowerCase()+`<br>` + iv.onlineJengo}</span>
                       </address>
                   </div> 
     
                      <div class="col-md">
                          <h6 class="row  ">
                              <div class="col-4">
                                <span class="text-danger">${lang('Kiasi','Amount')}</span>:
                              </div>
                              <div class="col-8 text-right">
                                <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>. <label class="text-danger" id="invo_kiasi" >${floatValue(iv.amount)} </label>

                              </div>
     
                              <div class="col-4">
                                <span class="text-danger">${lang('Ilolipwa','Paid')} </span>:
                              </div>
                              <div class="col-8 text-right">
                                <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>. <label class="text-success" id="invo_ilolipwa" > ${floatValue(iv.ilolipwa)}</label>
     
                              </div>`
     
                              if(iv.amount>iv.ilolipwa){
                                   tr+=    `<div class="col-4 invo_deni border-top">
                                           <span class="text-danger">${lang('Deni','Debt')}   </span>:
                                       </div>
                                       <div class="col-8 invo_deni border-top text-right">
                                           <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>. <label id="invo_deni" class="text-danger">
                                           ${floatValue(iv.amount-iv.ilolipwa)}
                                           </label></div>`
     
                              }
                        
                              
     
                             
                        tr+= ` </h6>
                      </div>
                    </div>
                    <br>


   `

   

   return tr
}

function theInvoPayments(py){
let li=``
py.forEach(m=>{
li+=  ` <li>
                <div class="d-flex latoFont">
                   <p>
                   <span class="px-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
                     <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                     <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                   </svg>                          
                   </span>
                    
                      ${moment(m.tarehe).format(' DD/MM/YYYY, HH:mm:')}
                    
                
                 </p>
                 <p class="px-4">
                  <span class="text-primary"> ${currencii}</span>. <strong class="brown" > ${floatValue(m.Amount)} </strong>
                 </p>
                 <p >
                  <strong class="text-capitalize" >${m.akaunti}</strong>

                 </p>

                 <p>                       
                   <button class="btn btn-default text-primary btn-sm smallerFont" onclick="$('#show_pay_disp${m.id}').toggle(400)" >
                                             
                    ${lang('Maelezo','details')} :

                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                     <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                   </svg>
                  </button>                        
                 </p>

                </div>

   <div class="row classic_div border-top" id="show_pay_disp${m.id}" style="display: none;">
                  <div class="col-6 text-right">
                         ${lang('Kiasi','Amount')}:
                  </div>
                  <div class="col-6 ">
                   <span class="darkblue latoFont smallFont">${currencii}</span>. <span class="brown weight600">${floatValue(m.Amount)} </span>  
                  </div>
                  <div class="col-6 text-right">
                      ${lang('Kabla','Before')} :
                  </div>
                  <div class="col-6">
                   <span class="darkblue latoFont smallFont">${currencii}</span>. ${floatValue(m.before)} 
                  </div>

                  <div class="col-6 text-right">
                    ${lang('Baada','After')}:
                  </div>
                  <div class="col-6">
                    <span class="darkblue latoFont smallFont">${currencii}</span> . ${floatValue(m.After)} 
                  </div>

                  
                   <div class="col-6 text-right">
                       ${lang('Maelezo','Description')} :
                   </div>
                   <div class="col-6">
                     <span class="darkblue" > ${m.maelezo?.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")|| '--------'}</span> 
                   </div>
                   

                  <div class="col-6 text-right">
                      ${lang('Na','By')}:
                  </div>
                  <div class="col-6">
                    <strong class="text-capitalize" >${m.ByF} ${m.ByL}</strong> 
                  </div>

                </div>
                </li>`

})
return li

}

function ifFidia(fidia){

  let ref = fidia[0]

  return `
             <h6 class="py-3" style="border-left: 3px solid #9c4545 ;background:rgb(250, 242, 242)">
                        <span class="px-2" style="color:#9c4545;">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
                           <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                         </svg>
                        </span>
                         
     
                        ${lang('Fidia ya bidhaa zilizorudishwa, kiasi','Refunding the returned items, amount')}  <span class="darkblue">${currencii}</span> .<span class="brown">${floatValue(ref.re_am)}</span> ,
                         <a class="text-primary viewReturn" type="button" data-val=${ref.sale_rtn_id} >
                             RE-${ref.ref}
     
                         </a>
                       
       </h6>
  `
}


// VIEW RETURNED ITEMS................................................................................................//
$('body').on('click','.viewReturn',function(){     
  $('#IfPaid').hide()
  $('#ifFidia').html('')

let val = $(this).data('val'),
data={
   data:{
   val:val,
   csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
},
url:'/riport/theItmReturn' 
}, fct = getRiportData(data)



$('#Invo_notFound').hide()
$('#the_invo_page').hide()
$('#Invo_loader').show()

fct.then(function(data){

   $('#Invo_loader').hide()

       

   if(data.success){
       $('#theInvoAddress').html(theReturnAddress(data.invo))
      $('#ifFidia').html(ReturnDesc(data.invo.maelezo))

      

       theReturnTable(data)
       $('#TheInvoPage').text(floatValue(data.invo.amount))
       $('#TheInvoBy').text(`${data.invo.f_name} ${data.invo.l_name}`)

       $('#TheMalipoLi').html(theReturnPayments(data.malipo))
       if(data.malipo.length>0){
        $('#IfPaid').show()
      }else{
        $('#IfPaid').hide()
      }



       $('#the_invo_page').show()
   }else{
       $('#Invo_notFound').show()

       toastr.error(lang('Haikufanikiwa kutokana na hitilafu.','The operation was not successfully please try again'), lang('Haikufanikiwa','Error Alert'), {timeOut: 7000});

   }
  
})




})

function theReturnTable(iv){
      $('#ifcolor').hide()
      $('#ifSize').hide()

      let tot_vat=0,vat_include = false,vat_set=false,sub_tot=0
      const vatper = 0
      let itms=iv.itms,
      colors=iv.color,
      sizes=iv.size,
      pr = iv.bei,
      tr='', sales=0,total_vat=0,rnum = 0

      if(colors.length>0){
          $('#ifcolor').show()
      }
      if(sizes.length>0){
          $('#ifSize').show()
      }

     

      itms.forEach(itm=>{
      let col = c =>c.itm === itm.val,prc = p =>p.prod ===itm.prod
      const colr = colors.filter(col),prices = pr.filter(prc)
      let beis = 0 ,idadis=0,idad=0,vpmo='',sale=0

      let prics = [],
      prc1 = {
      unit:itm.vipimo,
      price:Number(itm.bei),
      qty:1
      } 

      prics.push(prc1)   

      rnum+=1

      if(Number(itm.uwiano)>1){
      prc2={
          unit:itm.vipimo_jum,
          price:Number(itm.bei_jum),
          qty:Number(itm.uwiano)
      }
      prics.push(prc2)

      }


      prics = [...prics,...pr]

      tr+=`
      <tr class="text-center   latoFont" style="padding: 10px 3px !important;">`
                             if(colr.length==0){

                              let prp = b => itm.idadi % b.qty===0
                              const prop_price = prics.filter(prp)

                               prop_price.sort((a,b)=>(a.qty>b.qty)? 1 :(a.qty ===b.qty)
                                 ?((a.qty > b.qty)? 1 : -1) : -1 )
                               let ps = prop_price[prop_price.length-1]  
                                       
                                          beis = Number(itm.bei)*Number(ps.qty)

                                     

                                      vpmo = ps.unit
                                      idad = Number(itm.idadi)/Number(ps.qty)
                                      sale=Number(itm.sold)*Number(itm.idadi)

                              if( itm.vat_set){
                                  //REGULATE MEASUARES.............//
                                      beis= (beis/(1+vatper))
                                      sales+=Number(itm.sold)/(1+vatper)*Number(itm.idadi)
                                      sale=sale/(1+vatper)               

                              }else{
                                      sales+=Number(itm.sold)*Number(itm.idadi)

                              }

                              sub_tot+=(beis*idad)
                              if(itm.vat_set){
                                  total_vat+=sale*vatper
                              }

                               
                              tr+=`
                              <td  >${rnum}</td>
                              <td class="text-left" > 
                                <div class="d-flex">
                                  <div  style="width:40px;heigth:40px" >`
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
                                      <div><strong class="pl-1  text-capitalize" style="color: #3989c6"> ${itm.jina}</strong></div>
                                      <div class="pl-2 text-muted smallerFont itm_desc" style="color:blue">${itm.maelezo }</div>
                                      <div class="pl-2  smallerFont itm_desc font-weight-bold" >${(itm.serial || '' ).replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</div>
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
                                <td style="padding: 10px 3px !important;" > 
                                          ${Number(beis).toLocaleString()} 
                               </td>` 

                               tr+=` <td style="padding: 10px 3px !important;" > ${Number(idad).toFixed(FIXED_VALUE)}
                               </td> 
                                     <td style="padding: 10px 3px !important;" >${ (beis * Number(idad)).toLocaleString()} </td> 
                              `
                           
                          }else{
                              let span=colr.length+1
                                   
                                
                              
                              tr+=`
                              <td class="rnum" rowspan="${span} ">${rnum}</td>
                              <td class="text-left span1" id="span_${itm.val}" rowspan="${span}">
                                <div class="d-flex">
                                  <div  style="width:40px;heigth:40px" >`
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
                                    <div><strong class="pl-1 text-capitalize " style="color: #3989c6"> ${itm.jina} </strong></div>
                                    <div class="pl-2 itm_desc text-muted smallerFont" style="color:blue">${itm.maelezo  }</div>
                                    <div class="pl-2 itm_desc text-muted smallerFont" style="color:blue">${itm.serial?.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "") || ''}</div>
                                  </div>
                              </td>` 
                             
                              colr.forEach(col=>{
                                  let szi = s=> s.color == col.val
                                  const sz = sizes.filter(szi)


                         tr+=`<tr class=" text-center  latoFont" style="padding: 10px 3px !important;">`
                                if(sz.length==0){
                                  let prp = b => col.idadi % b.qty===0
                                  const prop_price = prics.filter(prp)
  
                                   prop_price.sort((a,b)=>(a.qty>b.qty)? 1 :(a.qty ===b.qty)
                                     ?((a.qty > b.qty)? 1 : -1) : -1 )
                                   let ps = prop_price[prop_price.length-1]

                                      beis = Number(itm.bei)*Number(ps.qty)

                                  
                                  vpmo = ps.unit
                                  idad = Number(col.idadi)/Number(ps.qty)
                                  sale=Number(itm.sold)*Number(col.idadi)

                          if( itm.vat_set){
                              //REGULATE MEASUARES.............//
                                  beis= (beis/(1+vatper))
                                  sales+=Number(itm.sold)/(1+vatper)*Number(col.idadi)
                                  sale=sale/(1+vatper)               

                          }else{
                                  sales+=Number(itm.sold)*Number(col.idadi)

                          }

                                  sub_tot+=(beis*idad)
                                  if(itm.vat_set){
                                      total_vat+=sale*vatper
                                  }

                                    tr+=`<td style="padding: 10px 3px !important;" class="smallerFont text-left">
                                      <label 
                                      style="width:15px;
                                      height:15px;
                                      background:${col.color_code};
                                      border-radius:100%;
                                      color:rgba(240, 248, 255, 0);
                                      border:1px solid #ccc"
                                      calss = "text-capitalize"
                                      >
                                      ''
                                  </label> 
                                  ${col.color_name}
                                    </td> `
                                    if(sizes.length>0){
                                    tr+=`<td style="padding: 10px 3px !important;"> --- </td> `
                                    }

                                     
                                    
                                    tr+=`<td style="padding: 10px 3px !important;" >${vpmo}</td>
                                    <td style="padding: 10px 3px !important;" > 
                                              ${Number(beis).toLocaleString()} 
                                   </td>`

                                  
                                  tr+=` <td style="padding: 10px 3px !important;" > 
                                      ${Number(idad).toFixed(FIXED_VALUE)}
                                  </td> 
                                        <td style="padding: 10px 3px !important;" >${ (beis * Number(idad)).toLocaleString()} </td> `
                      
                               }else{
                                  tr+=`<td style="padding: 10px 3px !important;" `
                                  if(sz.length>1){
                                     tr+=` rowspan=${sz.length+1}` 
                                  }
                                  
                                 tr+=` data-itm="${itm.val}" class="span2 smallerFont text-left" >

                                      <label class="text-capitalize"
                                      style="width:15px;
                                      height:15px;
                                      background:${col.color_code};
                                      border-radius:100%;
                                      color:rgba(240, 248, 255, 0);
                                      border:1px solid #ccc"
                                      >
                                      ''
                                  </label> 
                                      ${col.color_name}</td>` 
                                   
                                   sz.forEach(s=>{

                                      let prp = b => s.idadi % b.qty===0
                                      const prop_price = prics.filter(prp)
      
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
                                          <td style="padding: 10px 3px !important;" > 
                                                      ${Number(beis).toLocaleString()} 
                                          </td>`


                                         tr+=`  <td class="text-center " style="padding: 10px 3px !important;" > ${Number(idad).toFixed(FIXED_VALUE)} 
                                         </td> 
                                          <td class="text-center " style="padding: 10px 3px !important;" >${ (beis * Number(idad)).toLocaleString()} </td> `
                                     if(sz.length>1){
                                    tr+=`  </tr>`
                                  }
                                     
                            
                                       
                                   })
                               }
                                
                             
                                  tr+=`</tr>
                              `
                              })
                             
                          }

                          tr+=`</tr>`



                          


                            })  

                         
                            
                            $('#view-invo_tbody').html(tr)

                            if(sub_tot-sales>0){
                              $('#when_discount').show()
                            }

                            $('#bei_halisi').text(sub_tot.toLocaleString())
                            $('#punguzo_tu').text((sub_tot-sales).toLocaleString())

                            $('#bei_bila_vat').text(sales.toLocaleString())
                            
                            if(total_vat>0){
                                $('#show_vat_if').show()
                            }else{
                                 $('#show_vat_if').hide()
                               
                            }
                            $('#the_invo_vat').text(total_vat.toLocaleString())

                            $('.span2').each(function(){
                                if(Number($(this).attr('rowspan'))){
                                let rowspan=Number($(this).attr('rowspan'))-1,
                                    parent='#span_'+$(this).data('itm'),
                                    prow= Number($(parent).attr('rowspan'))
                               $(parent).attr('rowspan',prow + rowspan)
                               }
                              //  $(parent).attr('rowspan',Number(parent.attr('rowspan'))+1)
                               // console.log(prow)
                            })
                           
                           


                        
                         
                      
                      //PRINT BILL
                     
                      
                   
                     

}

function theReturnAddress(iv){
tr=`
<div class="row classic_div pt-3" >
                     <div class="col-md-6 border-right">
                       <address>
                             <div class="row" >
                            
                             <div class="col-12">`
                               
                          
                              
                             
                                 tr+=`<h5 class="font-weight-bold text-capitalize" id="Invo_name" >
                                     ${iv.duka}
                                 </h5>
                             </div>
                                                          
                             <div class="col-12" style="margin-top:-6px">
                                 <h6 class="text-capitalize" id="Invo_place" >
                                     ${(iv.mtaa).toLowerCase()}, ${(iv.kata).toLowerCase()}, ${iv.wilaya.toLowerCase()}, ${iv.mkoa.toLowerCase()}, ${iv.nchi.toLowerCase()}
                                 </h6>
                             </div>
                             <div class="col-12" style="margin-top:-6px">
                                 <h6 class="">
                                    ${iv.jengo||''}
                                 </h6>
                             </div>
 
                         </div>
 
                          <div class="row" style="margin-top: -6px;">
                            <div class="col-12">
                                 <h6 class="">
                                   code:${iv.Intp_code}
                                 </h6>
                             </div>
                         
                         
 
                               
                            
                             
                         </div>
                       </address>
   
                     <br>
 
                    </div>
                  <div class="col-md-6">
                    
                      <h4 class="text-secondary text-md-right">
                          ${lang('NOTISI YA KURUDISHA BIDHAA','SALES RETURN NOTE')} 
                      </h4>
                       <div class="text-md-right " style="margin-top:-9px">
                          <h5 id="invo_code">RE-${iv.code}</h5> 
                          <h5 class="text-primary">INVO-${iv.invoCode}</h5> 
                       </div>
                       <hr>
 
                       <div class="row " style="margin-top: -6px;">
                         <div class="col-5 text-right">
                             <p class="text-danger">
                                 ${lang('Tarehe ','Invoice Date')}
                             </p>
                         </div>
                         <div class="col-7 text-right">
                             <p id="invo_tarehe" >
                                 ${iv.date}
                             </p>
                         </div>  
                       </div>
 
                    <div class="row " style="margin-top: -6px;">
                     <div class="col-5 text-right">
                      
                         <p class="  text-danger text-right">
                              ${lang('Tarehe Kukamilisha','Due date')}
                         </p>
                        
                     </div>
                     <div class="col-7 text-right">
 
 
                       <p >
                             <span id="invo_kulipa" class="bg-danger p-1 text-light">
                                ${iv.kulipa}
                             </span>
                              
                         </p>
                       
                     </div>
                     </div>
 
                     
                 <div class="row text-right">
                     <div class="col-5">
                         <h6>
                             ${lang('Fidia','Refund')} :
                         </h6>
                     </div>
                   <h6 class="col-7">
                    
                         <strong id="invo_malipo">
                             ${floatValue((Number(iv.ilolipwa)/Number(iv.amount))*100)}%
                         </strong>
                     </h6>
 
                     </div>
 
   
                     
 
 
                  </div>
              </div>
              
                <hr>
                <div class="row px-3">
                 <div class="col-md latoFont" style="font-weight: 500;">
                   <span class="text-danger">
                       ${lang('Bili kwa','Bill To')}:
                   </span> <br>
                   <address >
                     
                      <strong id="invo_mteja" class="text-capitalize" > ${iv.mteja_jina} </strong>
                   <br> 
                   ${iv.simu?`${lang('Simu','Phone')} ${iv.simu}`:''}
                      
                  <br>
                    <span class="text-capitalize"> ${(iv.address).toLowerCase()} </span>
                   </address>
               </div> 
 
                  <div class="col-md">
                      <h6 class="row  ">
                          <div class="col-4">
                            <span class="text-danger">${lang('Kiasi','Amount')}</span>:
                          </div>
                          <div class="col-8 text-right">
                            <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>. <label class="text-danger" id="invo_kiasi" >${floatValue(iv.amount)} </label>

                          </div>
 
                          <div class="col-4">
                            <span class="text-danger">${lang('Ilorudishwa','Refunded')} </span>:
                          </div>
                          <div class="col-8 text-right">
                            <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>. <label class="text-success" id="invo_ilolipwa" > ${floatValue(iv.ilolipwa)}</label>
 
                          </div>`
 
                          if(iv.amount>iv.ilolipwa){
                               tr+=    `<div class="col-4 invo_deni border-top">
                                       <span class="text-danger">${lang('Deni','Debt')}   </span>:
                                   </div>
                                   <div class="col-8 invo_deni border-top text-right">
                                       <span class="smallerFont" style="color: #2900dd;"> ${currencii}</span>. <label id="invo_deni" class="text-danger">
                                       ${floatValue(iv.amount-iv.ilolipwa)}
                                       </label></div>`
 
                          }
                    
                          
 
                         
                    tr+= ` </h6>
                  </div>
                </div>
                <br>
`

return tr
}

function theReturnPayments(py){
          let li=``
          py.forEach(m=>{
          li+=  ` <li>`
          if(m.ivo_id){
              li+=`
              <p>
                        <span class="px-2">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
                          <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                          <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                        </svg>                          
                        </span> 
                       

                      ${moment(m.tareheInvo).format(' DD/MM/YYYY, HH:mm')}
                       

                        <span class="px-4"> <span class="darkblue" >${currencii}.</span> 

                             <strong>${floatValue(m.re_am)}</strong> 
                           
                      
                        </span>
                        ${lang('Ilirudishwa kupitia Ankara','Refunded via Invoice')}
                        <a class="text-primary viewInvo" data-val=${m.ivo_id}  type="button"  > INVO-${m.InvoCode}</a>  
                      </p> 
              `
          }else{
              li+= `<div class="d-flex latoFont">
                                          <p>
                                          <span class="px-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
                                          <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                                          <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                          </svg>                          
                                          </span>
                                          
                                              ${moment(m.tarehe).format(' DD/MM/YYYY HH:mm:')}
                                          
                                      
                                      </p>
                                      <p class="px-4">
                                          <span class="text-primary"> ${currencii}</span>. <strong class="brown" > ${floatValue(m.Amount)} </strong>
                                      </p>
                                      <p>
                                          <strong class="text-capitalize" >${m.akaunti}</strong>

                                      </p>

                                      <p>                       
                                          <button class="btn btn-default text-primary btn-sm smallerFont" onclick="$('#show_pay_disp${m.id}').toggle(400)" >
                                                                  
                                          ${lang('Maelezo','details')} :

                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                          <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                          </svg>
                                          </button>                        
                                      </p>

                                      </div>

                          <div class="row classic_div border-top" id="show_pay_disp${m.id}" style="display: none;">
                                          <div class="col-6 text-right">
                                              ${lang('Kiasi','Amount')}:
                                          </div>
                                          <div class="col-6 ">
                                          <span class="darkblue latoFont smallFont">${currencii}</span>. <span class="brown weight600">${floatValue(m.Amount)} </span>  
                                          </div>
                                          <div class="col-6 text-right">
                                              ${lang('Kabla','Before')} :
                                          </div>
                                          <div class="col-6">
                                          <span class="darkblue latoFont smallFont">${currencii}</span>. ${floatValue(m.before)} 
                                          </div>

                                          <div class="col-6 text-right">
                                          ${lang('Baada','After')}:
                                          </div>
                                          <div class="col-6">
                                          <span class="darkblue latoFont smallFont">${currencii}</span> . ${floatValue(m.After)} 
                                          </div>

                                          
                                      
                                          

                                          <div class="col-6 text-right">
                                              ${lang('Na','By')}:
                                          </div>
                                          <div class="col-6">
                                          <strong class="text-capitalize" >${m.ByF} ${m.ByL}</strong> 
                                          </div>

                                      </div>`
          }
          

                    li+=`</li>`

          })
          return li

}

function ReturnDesc(desc){

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


function removeSaved(val){
  if(confirm(lang('Ondoa kutokaripoti zilizohifadhiwa','Remove from saved reports'))){
      $('#loadMe').modal('show')
      let dta = {data:{ 
          val:val,
          csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
      },
      url:'/riport/removeSaved'},
      riports = getRiportData(dta)
      
      riports.then(function(data){
          if(data.success){
              roadRiportSave()
              toastr.success(lang(data.msg_swa,data.msg_eng), lang('Imefanikiwa','success'), {timeOut: 7000});
            
          }else{
              toastr.error(lang(data.msg_swa,data.msg_eng), lang('Haijafanikiwa','Error'), {timeOut: 7000});
          
              }
           $('#loadMe').modal('hide')
      })
  }
}

