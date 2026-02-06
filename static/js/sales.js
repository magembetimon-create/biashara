
// hifadhi size baada ya kuletwa na function ya kwa ajili ya bili mpya.............................................//


// //function getColor_Size(){
//     var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
//     $.ajax({
//       type: "POST", 
//         url: "/mauzo/getCustomers",
//       data: {csrfmiddlewaretoken:csrfToken},
//     }).done(function(data){
//     })

var prices = class prcs{
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

// IF SERVICES...........................................//
var services = class servs{
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
//  SERVICES COLOR...........................................//
var servicesC = class servsC{
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
//  SERVICES COLOR...........................................//
var servicesS = class servsS{
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


var The_price =new prices([]) 
var Servs =new services([])
var ServsC =new servicesC([])
var ServsS =new servicesS([])


// function getColor_Size(coloredItemb,ItemsSizeb){
   var csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
   time = moment().format()
   $.ajax({
     type: "POST", 
       url: "/mauzo/Bei_tu",
     data: {t:time,s:Number($('#add_bill_item').data('service')) || 0,csrfmiddlewaretoken:csrfToken},
   }).done(function(data){

       if(data.bei.length>0){
           The_price.state=data.bei
       }
       let servs = Number($('#add_bill_item').data('service')) || 0
       if(servs){
           Servs.state = data.servs
           ServsC.state = data.servsC
           ServsS.state = data.servsS
           
       }


   })



//Customer search for sales
 //search customer.............................................................................//
 var index=-1;	
 $('body').on('keyup','.suggest-holder2n input', function(){
 // Clear the ul   
 $(`.masaki2n`).empty();

 let custm = customers.state
  
 // Cache the search term
 var search = $(this).val();
 
 // Search regular expression
 var regrex = /[^a-z0-9 ]/gi;
 search = new RegExp(search.replace(regrex,''), 'i');
     var lin;
 
 // Loop through the array
 for(let i in custm ){

 if(custm[i].jina.match(search)){
     let li=`<li data-value=${custm[i].id} >
     <a  class='suggest-name latoFont pl-2 text-capitalize' style="color:" data-value=${custm[i].id}  >${custm[i].jina} </a> 
        <a class="d-block" style='padding:7px'>
            <span class='suggest-description' style='float:left;color:#777'>${custm[i].address }</span>
            <span class='suggest-description' style='color:blue'> (+${custm[i].code} ${Number(custm[i].simu1)}) </span>
        </a>
     </a>
    </li>`;
    
    $(`.masaki2n`).append(li);
 }
 }
 
 if($(this).val().length > 0){
     $(`.masaki2n`).show();
 }else{
     $(`.masaki2n`).hide();
 
 }
 
 
 });
 
     
    //trigger an event when user click the list.............................................// 
 $('body').off('click','.masaki2n li').on('click','.masaki2n li', function(){
     let valu = $(this).data('value')
      let itm = it=>it.id === valu
     const custmi = customers.state.filter(itm)

     $('.suggest-holder2n input').val((custmi[0].jina))
     $('.suggest-holder2n input').data('cust',custmi[0].id)
     $('.suggest-holder2n input').data('reg',0)
     $('.suggest-holder2n input').data('reg_val',0)

     $('#cust_address').val(custmi[0].address)
     $('#cust_phone').val(`+${custmi[0].code} ${custmi[0].simu1}`)
     $('#cust_mail').val(custmi[0].email)

    $(`.masaki2n`).hide();

 });





//Product search for sales
 //search product.............................................................................//
 var index=-1;	
 $('body').on('keyup','.suggest-holder input', function(){
      const pos= $(this).data('pos'),searchi = $(this).val()
        if(searchi!='') filterInputData({searchi,pos})
 });

 
 $('body').on('focus','.suggest-holder input', function(){
      const pos= $(this).data('pos'),searchi = $(this).val()
        if(searchi!='') filterInputData({searchi,pos})
 });


function filterInputData(dt){
      

      const {pos,searchi} = dt,itmsi = Items.state , 
            service = Number($('#add_bill_item').data('service')) || 0;

            $(`.masaki${pos}`).empty();

            var itms = itmsi


      
 
     if(service){
         itms = itms.filter(s=>s.service)
     }else{
         itms = itms.filter(s=>s.timely==0)
     }

     

    var regrex = /[^a-z0-9 ]/gi,
     search = new RegExp(searchi.replace(regrex,''), 'i');
    
     var lin;
 
 // Loop through the array
        itms.reverse().forEach(itm=>{
            const jina_namba = itm.bidhaaN + ' ' +itm.namba,
                

                code = [
                    {code:itm.TransCode,str:'RC-',pu:0,trans:1,prod:0,adj:0},
                    {code:itm.puCode,str:'BILL-',pu:1,trans:0,prod:0,adj:0},
                    {code:itm.ProdCode,str:'BATCH-',pu:0,trans:0,prod:1,adj:0},
                    {code:itm.addCode,str:'ADJ-',pu:0,trans:0,prod:0,adj:1},
                ],
                coded = code.filter(c=>c.code!=null)[0],
                prodxn =  `
                            <svg xmlns="http://www.w3.org/2000/svg"   height="1.2em" width="1.2em" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.93,8.35l-3.6,1.68L14,7.7V6.3l2.33-2.33l3.6,1.68c0.38,0.18,0.82,0.01,1-0.36c0.18-0.38,0.01-0.82-0.36-1l-3.92-1.83 c-0.38-0.18-0.83-0.1-1.13,0.2L13.78,4.4C13.6,4.16,13.32,4,13,4c-0.55,0-1,0.45-1,1v1H8.82C8.4,4.84,7.3,4,6,4C4.34,4,3,5.34,3,7 c0,1.1,0.6,2.05,1.48,2.58L7.08,18H6c-1.1,0-2,0.9-2,2v1h13v-1c0-1.1-0.9-2-2-2h-1.62L8.41,8.77C8.58,8.53,8.72,8.28,8.82,8H12v1 c0,0.55,0.45,1,1,1c0.32,0,0.6-0.16,0.78-0.4l1.74,1.74c0.3,0.3,0.75,0.38,1.13,0.2l3.92-1.83c0.38-0.18,0.54-0.62,0.36-1 C20.75,8.34,20.31,8.17,19.93,8.35z M6,8C5.45,8,5,7.55,5,7c0-0.55,0.45-1,1-1s1,0.45,1,1C7,7.55,6.55,8,6,8z M11.11,18H9.17 l-2.46-8h0.1L11.11,18z"/>
                            </svg>  
                        `,
                rc  = ` <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="bi bi-arrow-return-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                        </svg>`,
                add = `
                                <svg xmlns="http://www.w3.org/2000/svg"  height="1.1em" width="1.1em" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15,17h2v-3h1v-2l-1-5H2l-1,5v2h1v6h9v-6h4V17z M9,18H4v-4h5V18z"/><rect height="2" width="15" x="2" y="4"/>
                                    <polygon points="20,18 20,15 18,15 18,18 15,18 15,20 18,20 18,23 20,23 20,20 23,20 23,18"/>
                                    </svg>
                `,
                pu = `<svg width="1em" height="1.0625em" viewBox="0 0 16 17" class="bi bi-compass mx-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                        <path d="M6.94 7.44l4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
                    </svg>`

              let  shelfQty = Number(itm.idadi )

            //  incase its duration based service
            if(itm.timely>0){
                let servFr = moment($('#serviceFrom').val()),
                    servTo = moment($('#ServiceTo').val()), 
                    bil = $('#save_bill_data').data('bill'),
                    served=Servs.state.filter(p=>p.produ===itm.id && servFr <= moment(p.to) && servTo >= moment(p.From) && Number(bil) != Number(p.bil) ),
                    servedQty = served.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0)

                    shelfQty = Number(shelfQty) - Number(servedQty)
            } 

        if(jina_namba.match(search) && Number(itm.Bei_kuuza)>0){
            const itmImg = ItemImg.state.filter(im=>itm.bidhaa_id===im.bidhaa)[0]?.picha__picha
            var li=`<li class="row" data-value=${itm.id} data-valu=${itm.bidhaa_id} data-prod=${itm.bidhaa_id} data-pos=${pos}>
             <div class="col-2 col-md-1">
               <img alt="${lang('Hakuna picha','No image')}" style="max-width:60px;min-width:60px"  src=${itmImg}  >
             </div>
             
            <div class="col-10 col-md-11" >
            <div  class='suggest-name text-capitalize' data-value=${itm.id} data-valu=${itm.bidhaa_id} data-prod=${itm.bidhaa_id} data-pos=${pos} >${ itm.bidhaaN} </div> 
            <div class="row mt-0 pt-0" style='padding:7px'>
                <div class="col-6 ">
                    <span class='suggest-description' style='float:left'>${itm.ainaN }</span>
                    <span class='suggest-description' style='color:blue'> (${itm.vipimo} .<span class="brown weight600"> ${shelfQty.toFixed(FIXED_VALUE)})</span> </span>
                </div>

                <div class='suggest-description col-6 brown font-weight-bold text-right' > <span class="darkblue weight500"> ${itm.curenci}</span>. ${Number(itm.Bei_kuuza).toLocaleString()}/=<br/> <span class="text-primary weight400"> @${itm.vipimo}</span> </div>
            
                </div>

            <div class="row mt-0 pt-0" style="font-size:11px">
            <div class="text-primary col-8 robotoFont" >
                    ${coded?.pu?pu:''}
                    ${coded?.trans?rc:''}
                    ${coded?.prod?prodxn:''}
                    ${coded?.adj?add:''}

                    <span class="text-capitalize" >
                        ${coded?.trans?itm.RCFrom:coded?.adj?itm.stName:(itm.vendor || itm.stName) }
                    </span>
            </div>

            <div class="col-4 text-right">${coded?.str}${coded?.code} </div>
            
            </div>
            </div>
            
        
            </li>`;
            
            $(`.masaki${pos}`).append(li);
        }
        })
 
        if(searchi.length > 0){
            $(`.masaki${pos}`).show();
        }else{
            $(`.masaki${pos}`).hide();
        
        }
}

 
 $('body').on({keyup: function(e){	
 if(e.which == 38){
     // Down arrow
     index--;
     // Check that we've not tried to select before the first item
     if(index < 0){
         index = 0;		
             $('.masaki li').eq(index).addClass('active');
     }
 
     // Set a variable to show that we've done some keyboard navigation
   var  m = true;
 }else if(e.which == 40){
     // Up arrow
     index++;
     //alert('clicked')
 
     // Check that index is not beyond the last item
     if(index > $('.masaki li').length - 1){
         index = $('.masaki li').length-1;
     }
 
     // Set a variable to show that we've done some keyboard navigation
     m = true;
 }
 
 // Check we've done keyboard navigation
 if(m){
     // Remove the active class
     $('.masaki li.active').removeClass('active');
     $('.masaki li').eq(index).addClass('active');
 } 
 
 if(e.which == 27){
     // Esc key
     $('.masaki').hide();
 }else if(e.which == 13){
     e.preventDefault();
 
     // Enter key
     if(index > -1){
        // index = -1;
     //    $('.suggest-prompt').val($('.masaki li .suggest-name').eq(index).text() );
 
         let pos = $('.masaki li .suggest-name').eq(index).data('pos')
         let itm_val = $('.masaki li .suggest-name').eq(index).data('value')
         // let prod_val = $('.masaki li .suggest-name').eq(index).data('prod')
 
         placedata(pos,itm_val)
         $('.masaki').hide();
         color_size(itm_val,pos,coloredItem.state,ItemsSize.state)   
 
         
     }
 }
 
 
 if(e.which == 38 || e.which == 40 || e.which == 13){
     e.preventDefault();
 }
     }	
     });
     
    //trigger an event when user click the list.............................................// 
 $('body').off('click','.masaki li').on('click','.masaki li', function(){
     // $('.suggest-prompt').val($(this).children('.suggest-name').text() );
      let pos = $(this).data('pos')
      let itm_val = $(this).data('value')
     //  let prod_val = $(this).data('prod')
 
      placedata(pos,itm_val)
 
      $('.suggest-holder ul').hide();
 
 
 });
 
 $('body').on('click', function(e) {
     if (!$(e.target).closest('.masaki li, .suggest-holder input').length) {
         $('.masaki').hide();
     };
  
 });


 
//Place item data to its appropriate..............
function placedata(pos,id){
    $(`.item-attr${pos}`).show()
    $(`.rej-panel${pos}`).show()
    $(`#suggest-holder${pos}`).hide()
    $(`.suggest-prompt${pos}`).val('')
  
    $(`#bill_item${pos}`).data('jum',false)
  
  //Use the 
      let itms=Items.state,colrd=false
      for(let i in itms){
          if(itms[i].id==id){
              $(`#place_searched${pos} label`).html(`<strong>${(itms[i].bidhaaN).replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</strong>`)
              let desc = ''
              if(itms[i].TransCode!=null) desc = 'RC-'+itms[i].TransCode
              if(itms[i].puCode!=null && itms[i].TransCode==null) desc = 'BILL-'+itms[i].puCode
              if(itms[i].ProdCode!=null && itms[i].TransCode==null) desc = 'BATCH-'+itms[i].ProdCode
              if(itms[i].addCode!=null && itms[i].TransCode==null) desc = 'ADJ-'+itms[i].addCode

              desc = `<u class="ml-1 pl-1 smallFont border-left darkblue" >${desc}</u>`

              $(`#place_searched${pos} #item-desc${pos}`).html((itms[i].maelezo || '')+desc)
  
               showimgIn(pos,itms[i].bidhaa_id)
  
              $(`.jum-panel${pos}`).hide()
  
  
              $(`.idadi-units_disp${pos}`).text(itms[i].vipimo)
              $(`.units_disp${pos}`).text(`@${itms[i].vipimo}`)
  
              //Clear idadi && price input  
              $(`.idadi-rej-panel${pos} input`).val('')
              $(`.idadi-jum-panel${pos} input`).val('')
              
  
              //clear the color/size display.....................................//
              $(`#color_obj${pos}`).html('')
              $(`#color_qt${pos}`).text(0)
              $(`#popColored${pos}`).hide()


  
              
  
              $(`.idadi-rej-panel${pos} input`).data('itm',itms[i].id)
              $(`.idadi-jum-panel${pos} input`).data('itm',itms[i].id)



            

              $(`#rej_item_qty${pos}`).data('notsure',Number(itms[i].notsure) || 0)
              $(`#jum_item_qty${pos}`).data('notsure',Number(itms[i].notsure) || 0)

              $(`.idadi-rej-panel${pos} input`).data('sm',itms[i].vipimo)

  
              //Assign item id to color button.....................................//
              $(`#is_colored_item${pos} button`).data('val',itms[i].id)
              $(`#is_colored_item${pos} button`).data('valu',itms[i].bidhaa_id)


            //   if is a service.................................................//
             let service = Number($('#add_bill_item').data('service')) || 0,
                 Shelfidadi = itms[i].idadi

                 

                if(service && Number(itms[i].timely)>0){
                    let timely = itms[i].timely,
                            servFr = moment($('#serviceFrom').val()),
                            servTo = moment($('#ServiceTo').val()),
                            bil = $('#save_bill_data').data('bill'),
                            min = servTo.diff(servFr,'minutes'),
                            dura = [
                             {
                             value:1,
                             name:lang('dakika','Minute(s)'),
                             duration:Math.ceil(min),
                             opt:`<option value=1 >${lang('dakika','Minute(s)')}</option>`
                           },
                             {
                             value:2,
                             name:lang('Saa','hour(s)'),
                             duration:Math.ceil(min/60),
                             opt:`<option value=2 >${lang('Saa','hour(s)')}</option>`
                           },
                             {
                             value:3,
                             name:lang('Siku','Day(s)'),
                             duration:Math.ceil((min/60)/24),
                             opt:`<option value=3 >${lang('Siku','Day(s)')}</option>`
                           },
                             {
                             value:4,
                             name:lang('Wiki','Week(s)'),
                             duration:Math.ceil(((min/60)/24)/7),
                             opt:`<option value=4 >${lang('Wiki','Week(s)')}</option>`
                           },
                             {
                             value:5,
                             name:lang('mwezi','Month(s)'),
                             duration:Math.ceil(min/(60*24*31)),
                             opt:`<option value=5 >${lang('Miezi','Months(s)')}</option>`
                           },
                             {
                             value:6,
                             name:lang('Miaka','Year(s)'),
                             duration:Math.ceil(Number(Math.ceil(min/(60*24*31)))/12),
                             opt:`<option value=6 >${lang('Miezi','Months(s)')}</option>`
                           },
                        
                        ],
                        opt = dura.find(d=>d.value===timely)
                        $(`#servduration${pos}`).html(opt.opt)
                        $(`#serviceDuration${pos}`).val(opt.duration)

                        served=Servs.state.filter(p=>p.produ===itms[i].id && servFr <= moment(p.to) && servTo >= moment(p.From) && Number(bil)!=Number(p.bil) )

                        servedQty = served.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 

                        Shelfidadi = Number(Shelfidadi) - Number(servedQty)

                }else{
                    $(`#serviceDuration${pos}`).val(0)
                }

              $(`.idadi-rej-panel${pos} input`).data('onshelf',Shelfidadi)
              $(`.idadi-jum-panel${pos} input`).data('onshelf',Shelfidadi)
  
  

              let msg=`<small class="text-danger p-2" style="font-size:11px;" > 
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                        </svg>                                
                        ${lang(`Idadi zilizopo <span class="text-primary">${itms[i].vipimo}.</span> <strong>0</strong>`,`Qty onshef <span class="text-primary">${itms[i].vipimo}:</span> <strong>0</strong>`)}
                    </small>`

               if(Shelfidadi==0)   {
                   $(`#idadi_imezidi${pos}`).html(msg)
               }else{
                    $(`#idadi_imezidi${pos}`).html('')
               }  
              
              //Assign price input placeholder  the item price
             
              //check whether the item involve color ......................//
              let clrd =x => x.bidhaa === itms[i].id 

              const colored =  coloredItem.state.filter(clrd),
                    of_c = colored.filter(l=>l.color__colored)
              
               if(of_c.length>0){

              //if item involve color  set the total price to 0 ..
               $(`#jum-actual-total${pos}`).val(0)
              $(`#rej-actual-total${pos}`).val(0)
              
              $(`#jum-total${pos}`).val(0)
              $(`#rej-total${pos}`).val(0)

              //Assign qty input placeholder 0
              $(`.idadi-rej-panel${pos} input`).val(0)
              $(`.idadi-jum-panel${pos} input`).val(0)

               //Assign qty input placeholder 0
               $(`.idadi-rej-panel${pos} input`).attr('placeholder',0)
               $(`.idadi-jum-panel${pos} input`).attr('placeholder',0)

              color_size(itms[i].id,pos,coloredItem.state,ItemsSize.state)

              colrd=true
              $('#modal_color').modal('show')

               }else{
                    $(`#jum-actual-total${pos}`).val(Number(itms[i].Bei_kuuza_jum).toLocaleString())
                    $(`#rej-actual-total${pos}`).val(Number(itms[i].Bei_kuuza).toLocaleString())
                    $(`#jum-total${pos}`).val(Number(itms[i].Bei_kuuza_jum).toLocaleString())
                    $(`#rej-total${pos}`).val(Number(itms[i].Bei_kuuza).toLocaleString())

              //Assign qty input placeholder 1
              $(`.idadi-rej-panel${pos} input`).attr('placeholder',1)
              $(`.idadi-jum-panel${pos} input`).attr('placeholder',1)

              colrd=false
               }
              
  
              //reset vat check
             $(`#vatallow-jum${pos},#vatallow-rej${pos}`).prop('checked',false)
  
            $(`#vatallow-rej${pos},#vatallow-rej${pos}`).siblings('label').children('input').val('')
              // place vat inclusive boolean
              $(`#vatallow-jum${pos}`).data('include',itms[i].taxInclusive)
              $(`#vatallow-rej${pos}`).data('include',itms[i].taxInclusive)
  
              $(`#na_vat${pos}`).prop('checked',itms[i].taxInclusive)
              $(`#vatallow-rej${pos},#vatallow-jum${pos}`).prop('checked',itms[i].taxInclusive)
  
                $(`#na_vat_panel${pos}`).show()
  
  
              $(`#bill_kuuza_jum${pos}`).attr('placeholder',Number(itms[i].Bei_kuuza_jum).toLocaleString())
              $(`#bill_kuuza_rej${pos}`).attr('placeholder',Number(itms[i].Bei_kuuza).toLocaleString())
  
              $(`#bill_kuuza_jum${pos}`).data('val',Number(itms[i].Bei_kuuza_jum))
              $(`#bill_kuuza_rej${pos}`).data('val',Number(itms[i].Bei_kuuza))

              //If item has produced/proccessed ......
              let produced = prdxnCost.state?prdxnCost.state.filter(cost=>cost.id===itms[i].id):[],Coast = 0

                if(produced.length>0) {
                    
                    Coast = Number(produced[0].cost)

                     $(`#bill_kuuza_rej${pos}`).data('bei',Coast)
                        $(`#bill_kuuza_jum${pos}`).data('bei',Coast)
                            
                }else{
    
                        $(`#bill_kuuza_rej${pos}`).data('bei',Number(itms[i].Bei_kununua)/Number(itms[i].uwiano))
                        $(`#bill_kuuza_jum${pos}`).data('bei',Number(itms[i].Bei_kununua)/Number(itms[i].uwiano))
                            
                }

  
               calculateSum ()
               setBillData(pos)



               let units=[], 
                   units1 = {
                    'id':0,
                   unit:itms[i].vipimo,
                   price:Number(itms[i].Bei_kuuza),
                   qty:1,
                   made:false
               }

               units.push(units1)

              

               let md = m=>m.item_id === itms[i].bidhaa_id
               const madep = The_price.state.filter(md)

          
               
               let madone = madep.map(u =>{
                   let obj = {
                       'id':u.id,
                       'unit':u.jina,
                       'price':u.bei,
                       'qty':u.idadi,
                       'made':true
                   }
                   return obj
                   
               })




               if (Number(itms[i].uwiano)>1){
                // console.log(itms[i])
                   units2={ 'id':0,
                            unit:itms[i].vipimoJum,
                            price:Number(itms[i].Bei_kuuza_jum),
                            qty:itms[i].uwiano,
                            made:false
                        }

                        units.push(units2)
               }

               units =[...units,...madone]

           

              unitPrices(itms[i].vipimo,pos,colrd,units)


          }
      }  

  }


//Place Image to its appropriate.................................//
function showimgIn(pos,prod){
    let imge=ItemImg.state,coount=0,im_sr='',trp=''
                

            for(let im in imge){
                if(imge[im].bidhaa==prod) {
                 coount+=1;
                 im_sr=`<img src="${imge[im].picha__picha}" style="max-width:4.9em;max-height:4.9em;cursor:pointer">`
                }
            }
            
            if(coount>0){
                trp+=im_sr
            }else{
                 trp+=`       
            <svg width="2.6625em" height="2.6em" viewBox="0 0 17 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v9l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15.002 9.5V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>`
            }
            $(`#imgplace${pos}`).html(trp)
}


  
$('body').on('click','.item-re-write',function(){
    let pos=$(this).data('pos')
    $(`.item-attr${pos}`).hide()
    $($(this).data('show')).show()
})

$('body').on('click','.setPu',function(){
    let pos=$(this).data('pos'),
        jum=$(this).data('jum'),
        last_qty = Number($(`#rej_item_qty${pos}`).val()) || 1 ,
        onsh = Number($(`#rej_item_qty${pos}`).data('onshelf')), 
        uwiano = Number($(`#rej_item_qty${pos}`).data('unit')), 
        sm_u =$(`#rej_item_qty${pos}`).data('sm'),
        notsure =Number($(`#rej_item_qty${pos}`).data('notsure'))

        //Show qty exceed warning..............
        if((last_qty*uwiano>onsh)&&!notsure){
            let msg=`<small class="text-danger p-2" style="font-size:11px;" > 
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                       <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                       <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                      </svg>                                
                    ${lang(`Idadi zilizopo <span class="text-primary">${sm_u}.</span> <strong>${onsh}</strong>`,`Qty onshef <span class="text-primary">${sm_u}:</span> <strong>${onsh}</strong>`)}
                </small>`

              $(`#idadi_imezidi${pos}`).html(msg)
        }else{
              $(`#idadi_imezidi${pos}`).html('')
            
        }

  $($(this).data('show')).show()
  $($(this).data('hide')).hide()

  $(`#bill_item${pos}`).data('jum',jum)

  if(jum){
      $(`#popColored${pos}`).hide()
  }else{
      if($(`#colored_items${pos}`).data('color')!=undefined || $(`#colored_items${pos}`).data('size')!=undefined){
      $(`#popColored${pos}`).show()

      }
  }


  $(`#bill_kuuza_rej${pos}`).data('val',Number($(this).data('bei')))
  $(`#bill_kuuza_rej${pos}`).attr('placeholder',Number($(this).data('bei')).toLocaleString())

  $(`#rej_item_qty${pos}`).data('unit',Number($(this).data('qty')))

  $(`.idadi-units_disp${pos}`).text($(this).data('units'))
  $(`.units_disp${pos}`).text(`@${$(this).data('units')}`)

   setBillData(pos)

})



$('body').on('keyup',`.item-bill-jum_idadi,.item-bill-rej_idadi`,function(){
    let pos = $(this).data('pos'),
        last_qty = Number($(`#rej_item_qty${pos}`).val()) || 1 ,
        onsh = Number($(`#rej_item_qty${pos}`).data('onshelf')), 
        uwiano = Number($(`#rej_item_qty${pos}`).data('unit')), 
        sm_u =$(`#rej_item_qty${pos}`).data('sm'),
        notsure =Number($(`#rej_item_qty${pos}`).data('notsure'))
        //Show qty exceed warning..............
        if((last_qty*uwiano>onsh)&&!notsure){
            let msg=`<small class="text-danger p-2" style="font-size:11px;" > 
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                       <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                       <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                      </svg>                                
                    ${lang(`Idadi zilizopo <span class="text-primary">${sm_u}.</span> <strong>${onsh}</strong>`,`Qty onshef <span class="text-primary">${sm_u}:</span> <strong>${onsh}</strong>`)}
                </small>`

              $(`#idadi_imezidi${pos}`).html(msg)
        }else{
            $(`#idadi_imezidi${pos}`).html('')

        }

    setBillData(pos)
 })



 $('body').on('change','.vat-fill',function(){
    let pos = $(this).data('pos')
    setBillData(pos)
 })

//Clicking the bill item pricece
$('body').on('keyup', '.bill_kuuza_jum,.bill_kuuza_rej', function (e) {
    let pos = $(this).data('pos'),
        bei = Number($(this).data('bei')),
        uwiano = Number($(`#rej_item_qty${pos}`).data('unit')),
       // idadi = Number($(`#rej_item_qty`).val()) || 1,
        sale_p = Number($(this).val()) || Number($(this).data('val')),
        cu = $('#new-bill_tbody').data('cur'),
        service = Number($('#add_bill_item').data('service')) || 0

         msg=`<small p-2 style="font-size:11px;color:rgb(158, 134, 0)" > 
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
         </svg> `

       
        if(bei== sale_p/uwiano && !service){
          msg+=`${lang(`Bei ya Kununua <span class="text-primary">${cu}.</span> <strong>${Number(bei*uwiano).toLocaleString()}</strong>`,
          `Purchase Price ${cu}. ${Number(bei*uwiano).toLocaleString()}`
          )}</small>`
        }else if(bei>sale_p/uwiano && !service){
          msg+=`${lang(`Hasala <span class="text-primary">${cu}.</span> <strong>${Number(bei-(sale_p/uwiano)).toLocaleString()}</strong>`,
           `<span class="text-primary">${cu}.</span>. <strong>${Number(bei-(sale_p/uwiano)).toLocaleString()}</strong> Loss `
           )}</small>`
        }else{
            msg=''
        }

        $(`#hasra_${pos}`).html(msg)

        setBillData(pos)
});


$('body').on('change','.vat-include',function(){
    let pos = $(this).data('pos')
    $(`#vatallow-jum${pos}`).data('include',$(this).prop('checked'))
    $(`#vatallow-rej${pos}`).data('include',$(this).prop('checked'))


    setBillData(pos)
})


//Adding the Invoice item
$('#add_bill_item').unbind("click").click(function () {
    
    let hasdata=$(`#rej_item_qty${$('#new-bill_tbody tr').last().data('pos')}`).attr('placeholder')
   
    
    if(hasdata!=undefined){ 
        let pos=$('#new-bill_tbody tr').last().data('pos'),
            last_qty = Number($(`#rej_item_qty${pos}`).val()) || 1 ,
            onsh = Number($(`#rej_item_qty${pos}`).data('onshelf')), 
            uwiano = Number($(`#rej_item_qty${pos}`).data('unit')) ,
            notsure = Number($(`#rej_item_qty${pos}`).data('notsure'))
           

        pos=pos+1
        if((last_qty*uwiano<=onsh)||notsure){
        $('#new-bill_tbody').append(tablerow(pos))          
        }
    
    }
 });



 //Use code scanner on adding item
 $('#code_scaner_insteady').unbind("click").click(function () {
  let hasdata=$(`#rej_item_qty${$('#new-bill_tbody tr').last().data('pos')}`).attr('placeholder'),
      pos=$('#new-bill_tbody tr').last().data('pos')
    
    if(hasdata!=undefined){ 
        let last_qty = Number($(`#rej_item_qty${pos}`).val()) || 1 ,
            onsh = Number($(`#rej_item_qty${pos}`).data('onshelf')), 
            uwiano = Number($(`#rej_item_qty${pos}`).data('unit')) 

        

        pos=pos+1
        if(last_qty*uwiano<=onsh){
        $('#new-bill_tbody').append(tablerow(pos))          
        }


    }
        $('#livestream_scanner').data('pos',pos)
        if(ISMOBILE){
            start_can()
        }else{
            $('#livestream_scanner').modal('show')
        }
        


 })



    //Remove  invoice item from the list......................   
$('body').off('click','.remove_bill_item_tr').on('click', '.remove_bill_item_tr', function () {
    let hommany=document.getElementById("new-bill_tbody").childElementCount;
    
    let hasdata=$(`#jum_item_qty${$($(this).data('remove')).data('pos')}`).attr('placeholder')
    
    
    if(hasdata==undefined){
        if(hommany==1){
            $('#new-bill_tbody').html(tablerow(1))
          
         }else{     
             
             $($(this).data('remove')).remove()
         
         }
    
    }else{
    
    if(confirm(lang('Je unataka kuondoa Bidhaa hii?','Remove an Item?'))){
        if(hommany==1){
       $('#new-bill_tbody').html(tablerow(1))
     
    }else{     
        
        $($(this).data('remove')).remove()
    
    }
    
    }
    
    }
    
    calculateSum ()
    });

function setBillData(pos) {  
    const vat_per =  Number($('#vat_percent').data('vat'))/100

    let item_data = $(`#bill_item${pos}`).data('jumin')

    if(!$(`#bill_item${pos}`).data('jum')){
        item_data = $(`#bill_item${pos}`).data('rejin')
    }

    let sel_bei = $(item_data).data('sale'),
       sel_vat_al = $(item_data).data('vat_allow'),
       sel_vat_disp = $(item_data).data('vat'),
       sel_act_t = $(item_data).data('jum'),
       sel_tw_vat = $(item_data).data('tot_wth_vat'),
        bei =Number($(sel_bei).data('val')),
        idadi = 1,
        servT = Number($(`#serviceDuration${pos}`).val()) || 1

    let t_bei_with_vat=sel_tw_vat

    if($(sel_bei).val()!=''){
        bei =Number($(sel_bei).val())
    }
    
    if($(item_data).val()!=''){
        idadi = Number($(item_data).val());
    }

    // idadi = idadi * Number($(item_data).data('unit'))



    let bei_with_vat = bei*idadi*(1+vat_per)
    let vat = bei * idadi * vat_per
    let the_totol = sel_act_t

    if($(sel_vat_al).data('include')){
        bei_with_vat = idadi*bei/(1+vat_per)
        vat = bei_with_vat * vat_per
        t_bei_with_vat = sel_act_t
        the_totol=sel_tw_vat
    }

    $(the_totol).val((bei*idadi).toLocaleString());


    if($(sel_vat_al).prop('checked')){
        $(sel_vat_disp).val(vat.toLocaleString())
        $(t_bei_with_vat).val(bei_with_vat.toLocaleString())
    }else{
        $(sel_vat_disp).val('')
        $(t_bei_with_vat).val((bei*idadi*servT).toLocaleString())
    }

    calculateSum ()


}


// CALCULATE SUM...........................................................................///
function calculateSum () { 
    let bei_sum = 0,vat_sum=0,actual_sum=0


$('.bill_data').each(function(){
let pos = $(this).data('pos'),
    item_data=$(this).data('jumin'),
    servT = Number($(`#serviceDuration${pos}`).val()) || 1

    if(!$(this).data('jum')){
         item_data=$(`#bill_item${pos}`).data('rejin')
    }


    const vat_per = Number($('#vat_percent').data('vat'))/100 
    let bei = Number($($(item_data).data('sale')).data('val')),
        idadi = 1,vat = 0;

       


        if($($(item_data).data('sale')).val()!=''){
            bei = Number($($(item_data).data('sale')).val())
        }

    
        
        if ($(item_data).val()!=''){
            idadi = Number($(item_data).val())
        }

           
       bei = bei*idadi*servT
        

        if ($($(item_data).data('vat_allow')).prop('checked')){

            vat = bei * vat_per     
                        
           if($($(item_data).data('vat_allow')).data('include')){
            bei = bei/(1+vat_per)
            vat = bei * vat_per         
         }
        }

        bei_sum +=( bei + vat)
        actual_sum += bei
        vat_sum += vat 

       

})
    
$('#bill_sub_total').text(actual_sum.toLocaleString())
$('#total_vat_disp').text(vat_sum.toLocaleString())
$('#total_bill_cash').text(bei_sum.toLocaleString())
$('#total_bill_cash').data('total',bei_sum)
$('#inayolipwa_invoice').attr('placeholder',bei_sum.toLocaleString())
$('#inayolipwa_invoice').data('pay',bei_sum)

//expenseSum()


 }



 
 //On clicking the color button........................................................................//
$('body').off('click','.colored_items').on('click','.colored_items',function(){
    let val =$(this).data('val'),
         
        pos =$(this).data('pos')

   color_size(val,pos,coloredItem.state,ItemsSize.state)

})


//a function to check whether the item has color or size assosiated with it............................................................//
 function color_size(val,pos,colored,sized){
    let valu = $(`#is_colored_item${pos} button`).data('valu')
    const prs = The_price.state.filter(x=>x.item_id===valu)
      
  

    let coloredone='',
        number=0,
        color_check = $(`#colored_items${pos}`).data('color'),
        size_check = $(`#colored_items${pos}`).data('size')

    

    let total_colored=0,
        ina_rangi=false,
        totol_produ =0,
        idadi_jumla=0,
        vipimo_jumla,
        vipimo_reja
    
    for (let l in colored) {
        // find the corresponding itemm bidhaa from items....................//



        if(Number(colored[l].bidhaa)==Number(val) && Number(colored[l].idadi)>0 && colored[l].color__colored){

            let service = Number($('#add_bill_item').data('service')) || 0,
                Shelfidadi = colored[l].idadi
                itemServ = Items.state.find(i=>i.id==Number(val))


                //Check qty for served color quantity
            if(service && itemServ.timely > 0){
                servFr = moment($('#serviceFrom').val()) ,
                servTo = moment($('#ServiceTo').val()),
                bil = $('#save_bill_data').data('bill'),
                served=ServsC.state.filter(p=>p.color===colored[l].id && servFr <= moment(p.to) && servTo >= moment(p.From) && Number(bil)!=Number(p.bil) )

                servedQty = served.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 

                 Shelfidadi = Number(Shelfidadi) - Number(servedQty)

                
            }     

            

               let selected=0
    
               total_colored+=1
           coloredone+=`
                       <div class="column mb-2 the_color_itm" data-colored=true data-pos=${pos} data-rangi_names="${colored[l].color__nick_name} ${colored[l].color__color_name}" data-pima='${colored[l].bidhaa__bidhaa__vipimo.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}' data-pima_jum='${colored[l].bidhaa__bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}'  data-valued=${colored[l].id} id='coloredone${colored[l].id}' data-jina=${colored[l].color__color_name} data-code="${colored[l].color__color_code}"  data-color=${colored[l].id}>
                          <div class="position-absolute showingpop24 p-3 whiteBg" id="ona_rang${colored[l].id}" data-showing="#ona_rang${colored[l].id}"
                          style="border-radius:8px;
                            -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                            box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                            max-width:150px;
                            margin-left:-15px;
                            margin-top:13px;
                            z-index:5;
                            display:none;
                            overflow-y:auto"
                            >
                             <p>
                                <button type="button" class="mr-2 rangi-editing" 
                                data-color=${colored[l].color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")} 
                                data-color_name=${colored[l].color__color_name.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")} 
                                data-idadi_jum=${colored[l].bidhaa__bidhaa__idadi_jum} 
                                data-valued=${colored[l].id} 
                                data-toggle="modal" data-target="#kuweka-rangi-model" style="height: 25px;width:40px;color:${colored[l].color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                    background:${colored[l].color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                    cursor:pointer;
                                    border-radius:3px;
                                    -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                                    box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                                    border:0;

                                ">
                                   color
                             </button>   
                             <span class="smallerFont text-capitalize">${colored[l].color__color_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>
                             </p>
                             <div class="coloredscene" data-show="#success${colored[l].id}" data-idadi=${Shelfidadi} data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-valu=${colored[l].id}  data-colored=true data-class="inputColor${colored[l].id}">
                             `

          //if the item include size place the size input.............................//
           let size=0 ,num=0
           sized.forEach(sz=>{
               if( sz.sized__color == colored[l].color && sz.bidhaa == colored[l].bidhaa){
               let ShelfidadiS = Number(sz.idadi)
                
                    //Check qty for served color quantity
                if(service && itemServ.timely > 0){
                    servFr = moment($('#serviceFrom').val()) ,
                    servTo = moment($('#ServiceTo').val()),
                    bil = $('#save_bill_data').data('bill'),

                    served=ServsS.state.filter(p=>p.size===sz.id && servFr <= moment(p.to) && servTo >= moment(p.From) && Number(bil)!=Number(p.bil) )

                    servedQty = served.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 

                    ShelfidadiS = Number(ShelfidadiS) - Number(servedQty)

                    
                } 
                   size+=1
                   num+=ShelfidadiS,

                    qty_set=0,
                     there_is=false

                //Trace the quantity set for  size.......................//
                    if(size_check!=undefined){
                    size_check.forEach(szd=>{
                       if(szd.size==sz.id){
                            qty_set =szd.idadi
                                selected=szd.idadi
                                there_is=true
                       }
                   })
                    }
                   

                   coloredone+=`
                   <div style="border-top:1px solid #ccc" data-valued=${sz.id} class="sizedscene mt-2 pt-2" data-idadi=${Number(ShelfidadiS)} data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-valu=${colored[l].id}  data-show="#success${colored[l].id}" data-class="inputColor0${sz.id}" data-colored=false id="sizedone${sz.id}" data-color=${colored[l].sized__color} data-size="${sz.sized__size}" >
                      <label class="d-block smallFont" for="">${sz.sized__size}</label>`
                
                if(Number(colored[l].bidhaa__bidhaa__idadi_jum)>1 && Number(ShelfidadiS)/Number(colored[l].bidhaa__bidhaa__idadi_jum)>=1 ){
                    coloredone+=`
                   <div class="row py-1">
                         <div class="col-4">
                                <label class="text-primary smallerFont" for="jum">${colored[l].bidhaa__bidhaa__vipimo_jum}</label>
                        </div>                    
                        <div class="col-8">
                            <input  data-valu=${colored[l].id} data-sized=${sz.id}   class="bill-inputColor form-control smallerFont inputColor0${sz.id}" data-uwiano=${Number(colored[l].bidhaa__bidhaa__idadi_jum)}   data-jum=true  type="number" `
                        //show the sat value if the user has alread sat the quantities for given size.....//
                        if(there_is){
                          coloredone+=` value=${Number(qty_set/Number(colored[l].bidhaa__bidhaa__idadi_jum))} `
                        }
                            
                         coloredone+=`>
                        </div>
                    </div>   
                    `
                   }

                   //PLACE OTHER MEASUREMENTS....................//
                   if(prs.length>0){
                       prs.forEach(pr=>{
                           if(Number(ShelfidadiS)/Number(pr.idadi)>=1){
                               coloredone+=`
                        <div class="row py-1">
                         <div class="col-4">
                                <label class="text-primary text-capitalize smallerFont" for="jum">${(pr.jina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, ""))}</label>
                        </div>                    
                        <div class="col-8">
                            <input  data-valu=${colored[l].id} data-sized=${sz.id}   class="bill-inputColor form-control smallerFont inputColor0${sz.id}" data-uwiano=${Number(pr.qty).toFixed(FIXED_VALUE)}   data-jum=true  type="number" `
                        //show the sat value if the user has alread sat the quantities for given size.....//
                        if(there_is){
                          coloredone+=` value=${Number(qty_set/Number(pr.qty))} `
                        }
                            
                         coloredone+=`>
                        </div>
                    </div>   
                    `  
                           }
                       })
                   }




                    
                   coloredone+=`       
                     <div class="row py-1">
                     <div class="col-4">
                            <label class="text-primary smallerFont" for="jum">${colored[l].bidhaa__bidhaa__vipimo}</label>
                    </div>                    
                    <div class="col-8">
                        <input data-show="#success${colored[l].id}" data-valu=${colored[l].id} data-sized=${sz.id}  data-color=false class="bill-inputColor form-control smallerFont inputColor0${sz.id}" data-uwiano=${Number(colored[l].bidhaa__bidhaa__idadi_jum)}   data-jum=false  type="number" `
                        //show the sat value if the user has alread sat the quantities for given size.....//
                        if(there_is){
                         if(colored[l].bidhaa__bidhaa__idadi_jum==1)  {
                        coloredone+=` value=${Number(qty_set / Number(colored[l].bidhaa__bidhaa__idadi_jum))}` 

                         } else{
                            coloredone+=` value=${Number(qty_set % Number(colored[l].bidhaa__bidhaa__idadi_jum))}` 
   
                         }
                        }
                     coloredone+=`>
                    </div>
                   </div>

                   <div class="py-1 classic_div row mt-2 bg-light" id="sizetotal${sz.id}" style="font-size:10px;">
                      <div class="col-7">
                        ${colored[l].bidhaa__bidhaa__vipimo} :
                      </div>
                      <div class="col-5">
                        <strong>${ShelfidadiS}</strong>
                      </div>
                   </div>
                </div>`

            }

            
           })

               //if size is not envolved then show the input for color quantity only.........
                 if(size==0){

                   let qty_set=0,
                       there_is=false
                    //Trace the quantity set for  color.......................//
                        if(color_check!=undefined){

                            color_check.forEach(szd=>{

                              if(szd.color==colored[l].id){

                                   qty_set = szd.idadi
                                    selected =szd.idadi
                                    there_is=true
                           }

                       })
                        }


            // IN CASE THE ITEM IS TO BE SOLD/PURCHASED IN WHOLESALE AND RETAIL include the wholesale input.................................//
                     if(Number(colored[l].bidhaa__bidhaa__idadi_jum)>1 && Number(Shelfidadi)/Number(colored[l].bidhaa__bidhaa__idadi_jum)>=1 ){
                            coloredone+=`  
                                        <div class="row mb-2">
                                            <div class="col-4">
                                               <label class="smallerFont" for="dozen">${colored[l].bidhaa__bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}:</label>
                                            </div>
                                            <div class="col-8">
                                                <input type="number" data-show="#success${colored[l].id}" data-color=true data-jum=true data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-idadi=${Shelfidadi} placeholder=0 class="smallerFont bill-inputColor form-control inputColor${colored[l].id}" data-wiana=${Number(colored[l].bidhaa__bidhaa__idadi_jum)}  data-valu=${colored[l].id}   type="number" ` 
                                                if(there_is){
                                                    coloredone+=` value=${Number(qty_set/Number(colored[l].bidhaa__bidhaa__idadi_jum))}`
                                                  }
                                            coloredone+=` >
                                                
                                             </div>
                                        </div>`
                             }


                             if(prs.length>0){
                                 prs.forEach(pr=>{
                                     if(Number(Shelfidadi)/Number(pr.idadi)>=1){
                                      coloredone+=`  
                                        <div class="row mb-2">
                                            <div class="col-4">
                                               <label class="smallerFont text-capitalize" for="dozen">${(pr.jina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")) }:</label>
                                            </div>
                                            <div class="col-8">
                                                <input type="number" data-show="#success${colored[l].id}" data-color=true data-jum=true data-uwiano=${pr.idadi} data-idadi=${Shelfidadi} placeholder=0 class="smallerFont bill-inputColor form-control inputColor${colored[l].id}" data-wiana=${Number(pr.idadi)}  data-valu=${colored[l].id}   type="number" ` 
                                                if(there_is){
                                                    coloredone+=` value=${Number(qty_set/Number(pr.idadi))}`
                                                  }
                                            coloredone+=` >
                                                
                                             </div>
                                        </div>`
                                     }
                                      
                                 })
                             }

                            coloredone+=`
                            <div class="row mb-2">
                                   <div class="col-4">
                                      <label  for="dozen">${colored[l].bidhaa__bidhaa__vipimo}</label>
                                   </div>
                                   <div class="col-8">
                                       <input type="number" data-show="#success${colored[l].id}"  data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-idadi=${Shelfidadi} data-color=true placeholder=0 data-jum=false class="form-control bill-inputColor inputColor${colored[l].id} smallerFont"  data-valu=${colored[l].id} `
                                       if(there_is){
                                           if(Number(colored[l].bidhaa__bidhaa__idadi_jum)==1){
                                               coloredone+=` value=${qty_set }`
   
                                           }else{
                                               coloredone+=` value=${Number(qty_set % Number(colored[l].bidhaa__bidhaa__idadi_jum))}`
                                               
                                           }
                                      }
                                coloredone+=`
                                          />
                                   </div>
                                 </div>
                              `
                            }
                             
                            //show the color that respond to hover................................//
                          coloredone+=`  
                          

                             </div>
                             <hr>
                             <span style="font-size:11px">${lang('Idadi','Onshelf qty')}:</span>
                             <div class="row" style="font-size:10px">
                                <div class="col-7">
                                    ${colored[l].bidhaa__bidhaa__vipimo} :
                                </div>
                                <div class="col-5">
                                    <strong>${Number(Shelfidadi).toFixed(2)}</strong> 
                                </div>
                             </div>

                           </div>
                           <div id="Color${colored[l].id}" data-color=${colored[l].color} data-valued=${colored[l].id} class="showingpop241 the_identify"  data-showing="#ona_rang${colored[l].id}" 
                                style="
                                height: 25px;
                                width:40px;
                                color:${colored[l].color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                background:${colored[l].color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                cursor:pointer;
                                border-radius:3px;
                                -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                                box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                                ">
                              color

                              <!-- CHECK THE QUANTITY SET COLOR.........................  -->
                              <div class="position-absolute successmark" id="success${colored[l].id}"  
                                style="
                                margin-left:21px;
                                margin-top:-18px;
                                height:19px;
                                width:17px;
                                border-radius:50%;
                                color:#fff;
                                background:rgba(2, 167, 2, 0.842);
                                border:1px solid #fff;
                                `
                                if(selected==0){
                                 coloredone+=`display:none;"`
                                }
                              
                               coloredone+=`> <span style="top:-1px;left:-1px;position:absolute;">
                                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                    </svg>
                                </span>
                             </div>

                             
                              <!-- SHOW ERROR ALert IF THE SET QUANTITY EXCEED THE ACTUAL COLOR.........................  -->
                              <div class="position-absolute text-danger errormark" id="error${colored[l].id}"  
                                style="
                                margin-left:21px;
                                margin-top:-18px;
                                height:19px;
                                width:17px;
                                border-radius:50%;
                                background:#fff;
                                border:1px solid #fff;
                                
                                `
                                 coloredone+=`display:none;"`

                              
                               coloredone+=`> 
                             <span >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                                    </svg>
                              </span>
                             </div>
                           </div>
                       </div>
                          `
                         
         }}



if(total_colored>0){
     $(`#is_colored_item${pos}`).show();
     $(`#rej_item_qty${pos},#jum_item_qty${pos}`).prop('readonly',true)
     calculateSum ()

}else{
     $(`#is_colored_item${pos}`).hide();
     $(`#rej_item_qty${pos},#jum_item_qty${pos}`).prop('readonly',false)

}


    $('#bill_item_color').html(coloredone)
    $('#item_jina').html($(`#place_searched${pos} label`).text())
     
 }



 
//setting color or size quntity  in the color/size input............................................................................................//
$('body').on('keyup','.bill-inputColor',function(){
    let disp='',colors=0,tot =0 
    let pos=$(`#coloredone${$(this).data('valu')}`).data('pos')
    let colarr=[],sizearr=[],notsure = $(`#rej_item_qty${pos}`).data('notsure')

    $('.coloredscene').each(function(){
      let len =  $(this).children('.sizedscene').length
        let uwiano=Number($(this).data('uwiano')),
            rangi=$(`#coloredone${$(this).data('valu')}`).data('jina'),
            code=$(`#coloredone${$(this).data('valu')}`).data('code'),
            vipimo=$(`#coloredone${$(this).data('valu')}`).data('pima'),
            vipimo_jum=$(`#coloredone${$(this).data('valu')}`).data('pima_jum'),
            color_id =$(this).data('valu')
            prod_idadi=Number($(this).data('idadi'))
           // colored=$(this).data('colored')
    
        
    
    //use the len valiale to detect whether the color contains item size if len == 0  means the item has color only with no size contained
    if(len ==0){
        let idadi=0
    
    
        $('.'+$(this).data('class')).each(function(){
            // pos=$(`#coloredone${$(this).data('valu')}`).data('pos')
    
     if($(this).val()!='' && Number($(this).val())>0){
        if($(this).data('jum')){
          idadi+=Number($(this).val())*Number($(this).data('uwiano'))
        //   tot+=Number($(this).val())*uwiano
      
        }else{
          idadi+=Number($(this).val())
        //   tot+=Number($(this).val())
        }
        if(idadi<=prod_idadi){
                tot+=idadi
        
        }

        } 
    
    })
        
        
    
    //COMPARE THE QUANTITY while its color......................//
          if(idadi>0 && (prod_idadi>=idadi || notsure)){


             //oject to store the color whose qty is set....................//
                let  lr ={
                    'idadi':idadi,
                    'color':color_id,
                    'notsure':notsure,
    
                }
                colarr.push(lr)
               colors+=1
               //show the success checkmark if color quantity is set.................
                $($(this).data('show')).fadeIn(200)
                $($(this).data('show')).siblings('.errormark').fadeOut(100)

                disp+=`
                <div class="p-1 smallerFont latoFont ">
                         <div class="rounded p-2  d-inline"
                         style="-webkit-box-shadow: 0px 0px 8px -3px rgba(18,13,255,0.22); 
                         box-shadow: 0px 0px 8px -3px rgba(18,13,255,0.22);"
                         >
                          <label 
                              style="width:15px;
                              height:15px;
                              background:${code};
                              border-radius:100%;
                              color:rgba(240, 248, 255, 0);
                              border:1px solid #ccc"
                              >
                              ''
                          </label> 
                            <span  style="margin-left:6px;font-size:14px">
                            <span class="text-capitalize" >
                               ${(rangi)}=> 
                            </span>
                            `
                            if(uwiano==1 || idadi/uwiano<=1){
                              disp+=`<span class="smallFont">${vipimo}:</span> <span class="text-primary">${idadi}</span>`
                            }else if(uwiano>1 && idadi/uwiano >1){
                              disp+=`<span class="smallFont">${vipimo_jum}:</span><span class="text-primary">${Number(idadi/uwiano)}</span>`
    
                              if(idadi%uwiano>0){
                                disp+=`+<span class="smallFont">${vipimo}:</span><span class="text-primary">${idadi%uwiano}</span>`
                              }
                            }
                            
                          disp+=`</span> 
                        
                                    </div>
                                  </div> 
                                         `
            }else if(idadi>0 && idadi>prod_idadi){
                    $($(this).data('show')).siblings('.errormark').fadeIn(100)
                    $($(this).data('show')).fadeOut(100)
                    idadi=0
                //   tot=0

            }else{
                    $($(this).data('show')).fadeOut(100)
                    $($(this).data('show')).siblings('.errormark').fadeOut(100)
                
            }
            }else{
    
                //if len !=0 then the color contains size........//
                let qty=0,qty_for_color=0
                $(this).children('.sizedscene').find('input[type="number"]').each(function(){

                    // prod_idadi=Number($(`#sizedone${$(this).data('sized')}`).data('idadi'))

                    if($(this).data('jum')){
                     qty +=Number($(this).val())*Number($(this).data('jum'))
                    }else{
                       qty +=Number($(this).val())
                    }
                    
                    // if(qty>prod_idadi){
                    //     //IF THE QUANTITY EXCEED THE TOTAL ONSHELF QUANTITY SET THE QTY TO 0 SO IT DOESNT BEING USED FOR SUM
                    //     qty = 0

                    // }
                })
               
             
                if(qty>0){
                    $($(this).data('show')).fadeIn(200)
                    colors+=1
                     disp+=`           
                       <div class="p-1 smallerFont latoFont ">
                          <div class="rounded p-2  d-inline"
                           style="-webkit-box-shadow: 0px 0px 8px -3px rgba(18,13,255,0.22); 
                           box-shadow: 0px 0px 8px -3px rgba(18,13,255,0.22);"
                          >
                          <label 
                              style="width:15px;
                              height:15px;
                              background:${code};
                              border-radius:100%;
                              color:rgba(240, 248, 255, 0);
                              border:1px solid #ccc"
                              >
                              ''
                          </label> 
                            <span  style="margin-left:6px;font-size:14px">
                            <span class="text-capitalize" >
                               ${(rangi)} =>
                            </span>
                            `
    
                          $(this).children('.sizedscene').each(function(){
                              let szqty=0,itm_idadi=Number($(this).data('idadi')),
                                   itm_prod = Number($(this).data('idadi'))
                            $('.'+$(this).data('class')).each(function(){
                                // pos=$(`#coloredone${$(this).data('valu')}`).data('pos')
                    
                             if($(this).val()!='' && Number($(this).val())>0){
                              if($(this).data('jum')){
                                szqty+=Number($(this).val())*uwiano
                                // tot+=Number($(this).val())*uwiano
                                // qty_for_color+=Number($(this).val())*uwiano
                              }else{
                                szqty+=Number($(this).val())
                                // tot+=Number($(this).val())
                                //qty_for_color+=Number($(this).val())
    
                             }
                             }

                         
  
                                
                                    })
                               


    
                            if(szqty>0 && (itm_idadi>=szqty || notsure )){
                                   $(`#sizetotal${$(this).data('valued')}`).css('border',0)
                                   $(`#sizetotal${$(this).data('valued')}`).removeClass('text-danger')
                                   
                                // $($(this).data('show')).fadeIn(100)
                                // $($(this).parent('coloredscene').data('show')).siblings('.errormark').fadeOut(100)

                                tot+=szqty
                                qty_for_color+=szqty
    
                            disp+=`<span> <span class="text-danger smallFont">${$(this).data('size')} </span> `
    
                                if(uwiano==1 || szqty/uwiano<=1){
                              disp+=`<span class="smallFont">${vipimo}:</span> <span class="text-primary">${szqty}</span>`
                            }else if(uwiano>1 && szqty/uwiano >1){
                              disp+=`<span class="smallFont">${vipimo_jum}:</span><span class="text-primary">${Number(szqty/uwiano)}</span>`
    
                              if(szqty%uwiano>0){
                                disp+=`+<span class="smallFont">${vipimo}:</span><span class="text-primary">${szqty%uwiano}</span>`
                              }
                            }
                            
                         disp+=`</span> | `


                          //store the size qty set .....................//
                          let  szd= {
                            'idadi':szqty,
                            'size':$(this).data('valued'),
                            'color':color_id,
                            'notsure':notsure
                        }

                        sizearr.push(szd)


                           
                        }else if( szqty>0 && itm_idadi<szqty){

                            $(`#sizetotal${$(this).data('valued')}`).css('border','1px solid red')
                            $(`#sizetotal${$(this).data('valued')}`).addClass('text-danger')
                        }else{
                            $(`#sizetotal${$(this).data('valued')}`).removeClass('redborder')
                            $(`#sizetotal${$(this).data('valued')}`).removeClass('text-danger')

                        }
                          
                           
                    
                          })
    
                            
                            
                          disp+=`</span> 
                                    </div>
                                  </div> 
                
                
               
                `
                let  lr ={
                    'idadi':qty_for_color,
                    'color':color_id
    
                }
                colarr.push(lr)
    
            }else{
                $($(this).data('show')).fadeOut(100)
                $($(this).parent('coloredscene').data('show')).siblings('.errormark').fadeOut(100)

    
            }
        }
    
       $(`#color_obj${pos}`).html(disp)
       
    
    
    })
    
        let tr=$(`#bill_item${pos}`)
    
       $(`#color_qt${pos}`).text(colors)
       if(colors>0){
           $(`#colored_items${pos}`).data('color',colarr)
           $(`#colored_items${pos}`).data('size',sizearr)
           $(`#popColored${pos}`).fadeIn(100)
               if(tr.data('jum')){
                   $(`#jum_item_qty${pos}`).prop('disabled',true)
               }else{
                   $(`#rej_item_qty${pos}`).prop('disabled',true)
                   
               }
       }else{
           $(`#popColored${pos}`).fadeOut(100)
           $(`#colored_items${pos}`).data('color',[])
           $(`#colored_items${pos}`).data('size',[])
           if(tr.data('jum')){
            $(`#jum_item_qty${pos}`).prop('disabled',false)
        }else{
            $(`#rej_item_qty${pos}`).prop('disabled',false)
            
        }
    
       }
    
       //if retail and whole sale ratio is not 1(Retail & wholesale involved) switch to the retail and set the quantity.....//
    //    let wiana=Number($(this).data('uwiano'))

       if(!$(`#bill_item${pos}`).data('jum')){
         
    
           $(`.jum-panel${pos}`).hide()
           $(`.rej-panel${pos}`).show()
    
        //    $(`#bill_item${pos}`).data('jum',false)
    
        
          if(tot>0){
        $(`#rej_item_qty${pos}`).val(tot)
    
          }else{
        $(`#rej_item_qty${pos}`).val(0)
    
          }
    
       }else{
           if(tot>0){
          
         $(`#jum_item_qty${pos}`).val(tot)
           }else{
         $(`#jum_item_qty${pos}`).val(0)
               
           }
       }
     
    
    
    setBillData(pos)
    
    })

   
//SAVE INVOINCE DATA...........................................///
$('.save_bill_data').unbind('submit').submit(function (e) {
    e.preventDefault() 
    let url=$(this).attr("action"),
        edit=$(this).data("edit"),
        bill=$(this).data("bill"),
        oda = $(this).data('oda'),
        rudi = Number($(this).data('rudi')),
        rudi_val = $(this).data('rudi_val'),

        // INCASE ITS SERVICE......
         service = Number($('#add_bill_item').data('service')) || 0,
         servFrom = $('#serviceFrom').val() || moment().format(),
         servTo = $('#ServiceTo').val(),
         desc = $('#invoDesc').val(),
         lipaEleza = $('#lipaElezo').val(),
         ch = Number($(this).data('ch')) || 0,
         now = moment().format(),
         resev = Number($('#AnzaUpya').prop('checked')) || 0,
         proceed = Number($('#EndeleZa').prop('checked')) || 0



         

         if(service && servFrom && servTo ){
               servFrom = moment(servFrom).format()
               servTo = moment(servTo).format()
               oda = Number(servFrom > now)
         }
        



    let csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    let custom= Number($('#lim_num').data('cust')),
                 bill_no = 'none',code_set = 0,
                 cusom_name = $('#lim_num').val(),
                 address =    $('#cust_address').val(),
                 simu =       $('#cust_phone').val(),
                 mail =       $('#cust_mail').val(),
                 reg = $('#lim_num').data('reg') || 0 ,
                 reg_val = $('#lim_num').data('reg_val') || 0,
                 toLabor = Number($('#lim_num').data('labour')) || 0

                 custom_set=0
                 if(custom!=0){
                     custom_set=1
                 }

    if($('#invoice_no').val()!=''){
       bill_no = $('#invoice_no').val()
       code_set=1
    }

   let date= $('#mauzo-date').val(),
    inalipiwa = $('#bill_tobe_paid').prop('checked') || false,
    akaunt = ($('#malipo-akaunti').find('option:selected').data('value')) || 0,
    due_date = $('#tarehe_kulipa').val(),
    amount = Number($('#inayolipwa_invoice').data('pay')) || 0,
    amount_set = false,
    item_dt = [],expenses = [],exp_set=false,
     invo_am = Number($('#inayolipwa_invoice').data('pay')),
     acont_amount = 0,
     allSized = [],
     allColored = []

    
    if (inalipiwa && Number(akaunt)>0){
        acont_amount = Number($('#inayolipwa_invoice').val()) || 0
    }


    if($('#inayolipwa_invoice').val()!=''){
        amount = Number($('#inayolipwa_invoice').val()) || 0
        amount_set =true
    }


//Bill items data...........................................//
  
$(".bill_data").each(function(){
    
        let pos = $(this).data('pos'),
            notsure = $(`#rej_item_qty${pos}`).data('notsure')  
                  jum= true
        
            let item_data=$(this).data('jumin')
        //check whether the bill item is in retail mode if then take the reja qty input  .......
            if(!$(this).data('jum')){
                 item_data=$(`#bill_item${pos}`).data('rejin')
                 jum = false
            }


            

            
            // const vat_per = Number($('#vat_percent').data('vat'))/100 
            let bei = Number($($(item_data).data('sale')).data('val')),
         
                vat_set = $($(item_data).data('vat_allow')).prop('checked') || false,
                vat_included = $($(item_data).data('vat_allow')).data('include') || false ,
                bei_set=false,
                // sales_set = false,
                // sales =0,
                // expire = $($(item_data).data('expire')).val(),
                value = $(item_data).data('itm'),
                idn = $(item_data).data('ids'),
                wian =  Number($(item_data).data('unit')),

                match = $(`#bill_item${pos}`).data('match') || 0,

                servT = Number($(`#serviceDuration${pos}`).val()) || 1

        
                if($($(item_data).data('sale')).val()!=''){
                    bei = Number($($(item_data).data('sale')).val())
                    bei_set = true
                }
                const vat_per = Number($('#vat_percent').data('vat'))/100 || 0

                if(!vat_included && vat_set){
                    bei = bei * (1 + vat_per)
                }


                // if($($(item_data).data('sale')).val()!=''){
                //     sales = Number($($(item_data).data('sale')).val())
                //     sales_set = true
                // }


  //Take the color if color/size set qty............//
                    let sized=[],colored=[]
                    let  color=$(`#colored_items${pos}`).data('color'),
                        size= $(`#colored_items${pos}`).data('size')

                        if(color!=undefined){
                            colored=color
                            allColored = [...allColored,...colored]
                        }

                        if(size!=undefined){
                            sized=size
                            allSized = [...allSized,...sized]
                        } 

                        idadi = Number($(item_data).val()) || 1

                        if(colored.length>0){
                           idadi = Number($(item_data).val())
                        }
                        

                if (idadi>0){
                    
                    let itm_data={
                        color:colored,
                        size:sized,
                        bei:bei,
                        idadi:idadi,
                        idn:idn,
                        bei_set:bei_set,
                        vat_set:vat_set,
                        vat_include:vat_included,
                        value:value,
                        jum:jum,
                        notsure:notsure,
                        uwiano:wian,
                        match:match,
                        servT:servT,
                        serial:($(`#serial_add${pos}`).val()).replace(/[/[&\/\\#,+=$~"*?<>`]/g, "") || $(`#serial_add${pos}`).attr('placeholder') ||  ''
                    }


                    item_dt.push(itm_data)

                }

                


               
                
                
        
             
        
})   





//check for exceeded duplicates ........................///////

let   size_exceed =false,
      color_exceed = false,
       itm_exceed = false


if (allSized.length>0){
const sized_id = [...new Set(allSized.map(x=>x.size))] 
sized_id.forEach(el => {
    
    const chosen_s = allSized.filter(s=>s.size===el&&!Number(s.notsure)),
          all_s = ItemsSize.state.find(s=>s.id===el)
          if(Number(chosen_s.reduce((a,b)=> a + b.idadi,0))>Number(all_s.idadi)){
              size_exceed = true
          }
        
});
}


if (allColored.length>0){
const color_id = [...new Set(allColored.map(x=>x.color))] 

color_id.forEach(el => {
    
     const chosen_c = allColored.filter(c=>c.color===el&&!Number(c.notsure)),
           all_c = coloredItem.state.find(c=>c.id===el)
           if(Number(chosen_c.reduce((a,b)=> a + b.idadi,0))>Number(all_c.idadi)){
               color_exceed = true
           }
        
});

 
}



if (item_dt.length>0){
const items_id = [...new Set(item_dt.map(x=>x.value))] 

items_id.forEach(el => {
    
     const chosen_i = item_dt.filter(i=>i.value===el&&!Number(i.notsure)),
           all_i = Items.state.find(i=>i.id===el)
            
           if(Number(chosen_i.reduce((a,b)=> a + (b.idadi*b.uwiano),0))>(Number(all_i.idadi))){
               itm_exceed = true
           }
        
});

 
}

        

// //bill other expenses data........................................................//
let hommany=document.getElementById("new-bill_tbody").childElementCount;
// if(hommany>=1){
//     exp_set=true
//     $('.matumizi_data').each(function () { 
//         let value = $(this).data('value'),
//             amount=  $(this).data('amount')

//         let matum_data={
//             'value':value,
//             'amount':amount
//         }    

//         expenses.push(matum_data)
//      })
// }




    let data={
   data:{
         edit:edit,
         service:service,
         servFrom:servFrom,
         servTo:servTo,
         now:now,
         desc:desc,
         oda:oda,
         rudi:rudi,
         toLabor:toLabor,
         rudi_val:rudi_val,
         bill:bill,
         sup:custom,
         date:date,
         bill_no:bill_no,
         code_set:code_set,
         inalipwa:Number(inalipiwa),
         akaunt:Number(akaunt),
         amount:amount,
         amount_set:Number(amount_set),
         kulipa:due_date,
         invo_am:invo_am,
         resev:resev,
         ch:ch,
         lipaEleza:lipaEleza,
        //  exp_set:Number(exp_set),
        //  exp_dt: JSON.stringify(expenses),
         itm_dt: JSON.stringify(item_dt),
        
         cusom_name:cusom_name,
         address:address,
         simu:simu,
         mail:mail,
         reg:reg,
         reg_val:reg_val,
         custom_set:custom_set,
        csrfmiddlewaretoken:csrfToken, 
    } ,    
        url:url
    
    }

    //CHECK FOR EXCEEDED ITM QTY...............................//
    let zimezidi =false
    $('.item-bill-rej_idadi').each(function(){
        let shelf = Number($(this).data('onshelf')),
             qty = Number($(this).val()) || 1,
             ratio = Number($(this).data('unit')),
             notsure =Number($(this).data('notsure'))
        if((qty*ratio > shelf)&&!notsure){
            zimezidi = true
        }
    })

   

    //    saveStokuData(data)
    


    // let total_amount=Number($('#total_bill_cash').data('total'))
    // if(hommany>1){
    //    total_amount=Number($('#total_bill_wth_expenses').data('total'))
    // }

    if($('#lim_num').val()!='' || Boolean(edit)){
        // var pyd = $('#inayolipwa_invoice')
 
      
        if((!inalipiwa && due_date!='') || (inalipiwa && Number(akaunt)>=1 && (amount==invo_am || due_date!='')  ) || Boolean(edit) ){
        //    if(!inalipiwa || (inalipiwa && Number(sup)) ){
            //  if (!inalipiwa ){
         
         
                if(!zimezidi || Boolean(edit) ){
                    if(!(size_exceed||color_exceed||itm_exceed)){
                  
                 if(item_dt.length>0){
                     if(!service ||( servFrom!='' && servTo !='' && servFrom<servTo  )){
                         if(!ch || ( ch && (resev || proceed ))){
                             saveBill(data)
                         }else{
                             redborder('#how_to_add')
                         }
                         
                       
                     }else{
                         if(servFrom==''){
                             redborder('#serviceFrom')
                         }
                         if(servTo==''){
                             redborder('#ServiceTo')
                         }

                         if(servFrom<servTo){
                             redborder('#serviceFrom')
                             redborder('#serviceFrom')
                         }
                     }
                   
                }

                 }else{
                     alert(lang('Bidhaa zimejuridia kwa kuzidi tafadhari hakikisha idadi ya bidhaa haizidi idadi iliyopo stoku','Repeted items number, exceeded the item(s) quntity in stock, please make sure that items quatity is not exceeding stock quantity'))
                 }
           
                }
                
               

            //  }else{
            //      alert(lang('kiasi kinachobaki na jumla ya bili kimezidi kiasi kilichopo kwenye akaunti iliyochaguliwa Tafadhari andika kiasi halisi kilichobaki kulingana na malipo ya bili','The stated account balance exceeds and the bill amount exceed the account amount please write correctly'))
            //    redborder('#iliyobaki_bill')
            //     }

        //    }else{
        //        alert(lang('Akaunti ya malipo iliyochaguliwa haina kiwango cha kutosha kulipia bili','The selected payment account has no sufficient amount to pay the bill please select another account'))
        //        $('#malipo-akaunti').selectpicker('setStyle', 'border-danger');

        //     }
        }else{
            
            if((!inalipiwa && due_date=='')|| (amount!=invo_am && due_date=='')){
                alert(lang('Tafadhari weka tarehe ya kulipa','Please set  bill Due date'))
                redborder('#tarehe_kulipa')
            }else if(inalipiwa && Number(akaunt)<1 ){
                alert(lang('Tafadhari chagua akaunti ya malipo','Please select Payment account'))
                 $('#malipo-akaunti').selectpicker('setStyle', 'border-danger');

            }
        }

    }else{
        alert(lang('Tafadhari Andika jina la mteja','please write customer name'))
        
        // $('#lim_num').addClass('setStyle', 'border-danger');
        redborder('#lim_num')
        topslider.top()

    }
});


// SAVE BILL DATA............................................//
function saveBill (data) { 
    $("#loadMe").modal('show');


    $.ajax({
    type: "POST",
    url: data.url,
    data: data.data,
    success: function (respo) {
        if(respo.success){
             toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 3000});
            // getStokuData()
            // topslider.top()
            //clear matumizi data...................................................................................//
           
            //Clear items table
             $('#tarehe_kulipa').val('')

            if(!Boolean(data.data.oda)){
            // $('#new-bill_tbody').html(tablerow(1))
            //  $('#invoice_no').val('')
            //  $('#invoice_no').attr('placeholder',respo.bill_no)

            //  $('#lim_num').val('')
            //  $('#cust_address').val('')
            //  $('#cust_phone').val('')
            //  $('#cust_mail').val('')

            location.replace(`/mauzo/viewInvo?item_valued=${respo.bil}&backto=allbill`)
            }else{
            location.replace(`/mauzo/viewOda?item_valued=${respo.bil}&backto=allbill`)
                
            }
            // calculateSum () 
            //  expenseSum()

            

          


          }else{
              toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 2000});
              topslider.top()
              
                $("#loadMe").modal('hide');
                hideLoading()
          }
    }

    
});

 }


 //WORK WITH  SUGESSTED PRICE FOR UNITS ITEMS
  function unitPrices(sm_u,pos,colored,units){
      let drp ='',sp = ''
      
    units.forEach(u => {
        drp+=`
        <div class="btn-group px-0 dropdown-item" role="group" aria-label="Basic example">
        <button  data-jum=false data-units='${u.unit}' data-sm="${sm_u}" data-bei=${u.price} data-qty=${u.qty} data-pos=${pos} data-show=".rej-panel1" data-hide=.jum-panel1   class="text-left smallFont  btn btn-sm border-bottom latoFont setPu text-capitalize"  >${(u.unit)}  <span >(<span class="text-primary"> ${sm_u}</span>: <span class="text-danger">${Number(u.qty).toFixed(FIXED_VALUE)}</span>)</span></button> 
        `
        if(u.made){
           drp+= `<button type="button" data-toggle="modal" data-target="#units_modal" class="btn settingsUnit pr-1" data-sm='${sm_u}' data-units='${u.unit}' data-bei=${u.price} data-pos=${pos} data-qty=${u.qty} data-val=${u.id} >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                   <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                   <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                   </svg>
                 </button>

                 <button type="button" data-action="/mauzo/removeUnit" class="btn removeUnit text-danger px-1" data-sm='${sm_u}' data-units='${u.unit}' data-bei=${u.price} data-pos=${pos} data-qty=${u.qty} data-val=${u.id} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
                 </button>
                 
                 `
        }
      drp+=`</div>`



        // sp for sales pricess
        sp+=`<div class="btn-group px-0 dropdown-item" role="group" aria-label="Basic example">
             <button  data-jum=false data-units='${u.unit}'  data-bei=${u.price} data-qty=${u.qty}  data-pos=${pos} data-show=".rej-panel1" data-hide=.jum-panel1   class=" btn-primary btn btn-sm smallFont text-capitalize border-bottom set_pricing latoFont dropdown-item"  >${u.unit} <span class=" latoFont">(<span class="text-primary">${sm_u}</span>:<span class="text-danger">${Number(u.qty).toFixed(FIXED_VALUE)}</span>=><span class="text-danger">${Number(u.price).toLocaleString()}</span>) </span> </button> `
       
    if(u.made){
        sp+=` <button type="button" data-toggle="modal" data-target="#units_modal" class="btn settingsUnit pr-1" data-sm='${sm_u}' data-units='${u.unit}' data-bei=${u.price} data-pos=${pos} data-qty=${u.qty} data-val=${u.id} >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                   <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                   <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                   </svg>
                 </button>

                 <button type="button" data-action="/mauzo/removeUnit" class="btn removeUnit text-danger px-1" data-sm='${sm_u}' data-units='${u.unit}' data-bei=${u.price} data-pos=${pos} data-qty=${u.qty} data-val=${u.id} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
                 </button>`
        }

        sp+=`</div>`
    
    
            });



    drp+=`<button data-pos=${pos} class="dropdown-item btn-sm latoFont uni_for_idadi text-primary" data-sm='${sm_u}' data-toggle="modal" data-target="#units_modal" >+ ${lang('Ongeza kipimo','Add Unit')}</button>`
    sp+=`<button  data-pos=${pos} class="dropdown-item btn-sm latoFont text-primary  uni_for_idadi"  data-sm='${sm_u}' data-toggle="modal" data-target="#units_modal"  >+ ${lang('Tengeneza Bei','Set Unit Price')}</button>`


     $(`#price_drop_btn${pos}`).prop('disabled',false)


     if(!colored){
      $(`#dropbtn${pos}`).prop('disabled',false)
      $(`#dropbtn${pos}`).siblings('.dropdown-menu').html(drp)
     }else{
        $(`#dropbtn${pos}`).prop('disabled',true)
    
     }
       $(`#price_drop_btn${pos}`).siblings('.dropdown-menu').html(sp)
  }

  //SAVE QUANTITY UNITS ...................................//
  $('#submit_Units').unbind('submit').submit(function(e){
      e.preventDefault()
      let edit = Number($(this).data('edit')),
           val = $(this).data('val')

      if(Boolean(edit) && $('#unit_name').val()=='' ){
          $('#unit_name').val($('#unit_name').attr('placeholder'))
      }

      if(Boolean(edit) && $('#unit_qty').val()=='' ){
          $('#unit_qty').val($('#unit_qty').attr('placeholder'))
      }

      if(Boolean(edit) && $('#unit_price').val()=='' ){
          $('#unit_price').val($('#unit_price').data('bei'))
      }


      let csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
           unit_name = $('#unit_name').val(),
           pos = $(this).data('pos'),
           unit_qty= $('#unit_qty').val(),
           unit_price= $('#unit_price').val(),
           itm = $(`#rej_item_qty${pos}`).data('itm')
           



           data={
               data:{
                   edit:edit,
                   val:val,
                   name:unit_name,
                   qty:Number(unit_qty),
                   price:Number(unit_price),
                   itm:itm,
                   csrfmiddlewaretoken:csrfToken
               },
               url:$(this).attr('action'),
               pos:pos

           }


           if(unit_name!=''){

            if(data.data.qty!=''&& data.data.qty>0){

                if(unit_price!=''&& Number(unit_price)>0){

                    $(this).children().find('input').val('')
                    $(this).children().find('small').prop('hidden',true)
                    $('#units_modal').modal('hide')
                    $('#loadMe').modal('show')

                    save_unitData(data)

                }else{
                    $('#price_Bei').prop('hidden',false)

                }

            }else{
                
            }

           }else{
               $('#price_jina_help').prop('hidden',false)
           }
          



  })

  //SAVE UNITS PRICE...................................//
  $('#submit_price_Units').unbind('submit').submit(function(e){
      e.preventDefault()
      let edit = Number($(this).data('edit')),
           val = $(this).data('val')

      if(Boolean(edit) && $('#price_unit_name').val()=='' ){
          $('#price_unit_name').val($('#price_unit_name').attr('placeholder'))
      }

      if(Boolean(edit) && $('#unit_pr_qty').val()=='' ){
          $('#unit_pr_qty').val($('#unit_pr_qty').attr('placeholder'))
      }

      if(Boolean(edit) && $('#pr_unit_price').val()=='' ){
          $('#pr_unit_price').val($('#pr_unit_price').data('bei'))
      }


      let csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
           unit_name = $('#price_unit_name').val(),
           pos = $(this).data('pos'),
           unit_qty= $('#unit_pr_qty').val(),
           unit_price= $('#pr_unit_price').val(),
           itm = $(`#rej_item_qty${pos}`).data('itm')
           



           data={
               data:{
                   edit:edit,
                   val:val,
                   name:unit_name,
                   qty:Number(unit_qty),
                   price:Number(unit_price),
                   itm:itm,
                   csrfmiddlewaretoken:csrfToken
               },
               url:$(this).attr('action'),
               pos:pos

           }


           if(unit_name!=''){

            if(data.data.qty!=''&& data.data.qty>0){

                if(unit_price!=''&& Number(unit_price)>0){

                    $(this).children().find('input').val('')
                    $(this).children().find('small').prop('hidden',true)
                    $('#price_units_modal').modal('hide')
                    $('#loadMe').modal('show')

                    save_unitData(data)

                }else{
                    $('#pr_price_Bei').prop('hidden',false)

                }

            }else{
                    $('#uni_price_idadi_help').prop('hidden',false)
                
            }

           }else{
               $('#price_jina_help').prop('hidden',false)
           }
          



  })



  function save_unitData(data){

    $.ajax({
        type: "POST",
        url: data.url,
        data: data.data,
        success: function (r) {

            if(r.success){
                toastr.success(lang(r.swa,r.eng), 'Success Alert', {timeOut: 2000});
                 unitPrices(r.sm,data.pos,false,r.price)
             
            }else{
                toastr.error(lang(r.swa,r.eng), 'error Alert', {timeOut: 2000});

            }
               
        }
    });

  }

  //REMOVE UNIT QUANTITY
  $('body').off('click','.removeUnit').on('click','.removeUnit',function(){
      let pos =$(this).data('pos'),
          val=$(this).data('val') ,
          itm = $(`#rej_item_qty${pos}`).data('itm')
          csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

          if(confirm(lang('Ondoa kipimo','remove item unit'))){
            let  data={
                  data:{
                      val:val,
                      csrfmiddlewaretoken:csrfToken,
                      itm:itm

                  },
                  url:$(this).data('action')
              }

              $.ajax({
                  type: "POST",
                  url: data.url,
                  data: data.data,
                  
                  success: function (r) {
                      if(r.success){
                        toastr.success(lang(r.swa,r.eng), 'Success Alert', {timeOut: 2000});
                        placedata(pos,itm)
                      }else{
                        toastr.error(lang(r.swa,r.eng), 'error Alert', {timeOut: 2000});
  
                      }
                      
                  }
              });
          }
  })

  //SET PRICE BUTTON.............................//
  $('#set_pr_unit').click(function(){
    if($('#pr_unit_price').val()!=''){
        let pos = $('#submit_price_Units').data('pos'),
            ratio = Number($(`#rej_item_qty${pos}`).data('unit')),
            bei = Number($('#pr_unit_price').val()) || 0,
            idadi = Number($('#unit_pr_qty').val()) || Number($('#unit_pr_qty').attr('placeholder'))
       
            if(bei>0){
                
             setPrice(pos,ratio,bei,idadi)

            }else{
                $('#pr_price_Bei').prop('hidden',false)
            }


       
    }    
})

$('body').on('click','.set_pricing',function(){
    let pos = $(this).data('pos'),
        idadi = Number($(this).data('qty')),
        bei = Number($(this).data('bei')),

        ratio = Number($(`#rej_item_qty${pos}`).data('unit'))

        // idadi =  Number($(`#rej_item_qty${pos}`).val()) || 1

        setPrice(pos,ratio,bei,idadi) 
                           

})

function setPrice(pos,ratio,bein,idadi){
    $(`#bill_kuuza_rej${pos}`).val(bein*ratio/idadi)
                 setBillData(pos)
                 $('#pr_price_Bei').prop('hidden',true)
                 $('#price_units_modal').modal('hide')
                 $('#pr_unit_price').val('')


                 //check for loss and place it
            let  bei = Number($(`#bill_kuuza_rej${pos}`).data('bei')),
                 
                 uwiano = Number($(`#rej_item_qty${pos}`).data('unit')),
                // idadi = Number($(`#rej_item_qty`).val()) || 1,
                 sale_p = Number($(`#bill_kuuza_rej${pos}`).val()) || Number($(`#bill_kuuza_rej${pos}`).data('val')),
                 cu = $('#new-bill_tbody').data('cur')
                 
                  msg=`<small p-2 style="font-size:11px;color:rgb(158, 134, 0)" > 
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                     <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                     <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                  </svg> `
         
                 if(bei== sale_p/uwiano){
                   msg+=`${lang(`Bei ya Kununua <span class="text-primary">${cu}.</span> <strong>${Number(bei*uwiano).toLocaleString()}</strong>`,
                   `Purchase Price ${cu}. ${Number(bei*uwiano).toLocaleString()}`
                   )}</small>`

                 }else if(bei>sale_p/uwiano){
                   msg+=`${lang(`Hasala <span class="text-primary">${cu}.</span> <strong>${Number(bei-(sale_p/uwiano)).toLocaleString()}</strong>`,
                    `<span class="text-primary">${cu}</span>. <strong>${Number(bei-(sale_p/uwiano)).toLocaleString()}</strong> Loss `
                    )}</small>`
                 }else{
                     msg=''
                 }
         
                 $(`#hasra_${pos}`).html(msg)

                
}

//  PLACE TR DATA ON ITEM ADDITION.........................................//
function tablerow(pos){
    let vat_allow = Items.state[0].vat_allow
        
     tr=`
    <tr id="bill_item${pos}" class="bill_data" data-jum=true  data-jumin="#jum_item_qty${pos}" data-rejin="#rej_item_qty${pos}" data-pos=${pos}>
    <!-- IMAGE COL -->
     <td>
     <div id="imgplace${pos}" class="container centerItem" >
        <svg xmlns="http://www.w3.org/2000/svg" width="2.6em" height="2.6em" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
          </svg>
        </div>  
     </td>


     <!-- ITEM NAME -->
     <td class="py-2">
         <div class="suggest-holder item-attr${pos} " id="suggest-holder${pos}"  style="margin-top: -18px;min-width:310px">
            <div class="input-group container  p-1 bg-secondary">
          <input
          placeholder=" ${lang('Andika Jina la Bidhaa ',' Write Item name ')}"
          style="min-width: 200px;"
          type="text" 
          data-pos=${pos}
          id = "search${pos}"
          class="form-control smallFont muhimu-b-kununua-zilizopo suggest-prompt${pos} input-data latoFont" />
          <div class="btn-group" role="group" aria-label="Basic example">

              <button data-pos=${pos} class="btn btn-light btn-sm smallFont search_By_Bar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upc-scan" viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z"/>
                              </svg>                            
              </button>

          <div class="input-group-append">
             <button class="btn btn-secondary btn-sm smallFont" data-toggle="modal" data-target="#add-products">
                + ${lang(' Mpya ',' Add ')}
             </button>

             </div>


          </div>
        </div>
          <ul class="masaki masaki${pos}" data-hiarch=${pos} style="min-width: 350px;z-index:999999;max-height:250px;overflow-y:scroll"></ul>
        </div>

        <h6 id="place_searched${pos}" style="min-width: 240px;display: none;" class="item-attr${pos} py-2  ">
            <label class="latoFont text-capitalize" style="color:rgb(108, 39, 236)" for="placeSearch"></label>
            <button class="btn btn-default text-primary btn-sm smallFont item-re-write" data-pos=${pos} data-show="#suggest-holder${pos}">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
            </button>
           <!--
            <span id="manuuzi_namna${pos}" >
                <button style="font-size: 10px;" data-jum=true data-units='' data-pos=${pos} data-show=".jum-panel${pos}" data-hide=.rej-panel${pos} class="btn-primary btn btn-sm setPu setPufirst${pos}"> </button>
                <button style="font-size: 10px;" data-jum=false data-units='' data-pos=${pos} data-show=".rej-panel${pos}" data-hide=.jum-panel${pos}   class="btn-light btn btn-sm setPu setPusecond${pos}"  > </button>              
            </span>
            -->

            <div id="item-desc${pos}" class="d-block text-muted py-1 border-bottom smallFont latoFont">
                  ${lang(' Maelezo ',' Descriptions ')}
            </div>

            <textarea  name="serial_add${pos}" style="display: none;" class="form-control smallerFont" id="serial_add${pos}" cols="30" rows="3"></textarea>
            <div class="text-right p-1">
                   <button class="btn btn-light btn-sm seliar_adder smallerFont text-primary latoFont" data-pos=${pos}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-node-plus-fill" viewBox="0 0 16 16">
                        <path d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 1 0z"/>
                      </svg> Serial
                    </button>
            </div>
        </h6>

       
        </td>



        <!-- QUANTITY-->
     <td class="pb-3 pt-2 qty">
        <div class="row classic_div">
            <span class="text-primary float-left d-block idadi-units_disp${pos}" style="font-size: 11px;"></span>
        </div>        
        
        <div class="input-group pt-2" style="width: 140px;">


        <!-- ITEM UNITS  -->
            <div class="dropdown border input-group-prepend">
              <button class="btn btn-light btn-sm  smallerFont drop_down dropdown-toggle" disabled title="Units" type="button" id="dropbtn${pos}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            
               </button>
            <div class="dropdown-menu" id="idadi_prod${pos}" aria-labelledby="dropbtn${pos}">
            
            </div>
        </div>



         <div class=" jum-panel${pos}   idadi-jum-panel${pos}" style="padding-left: 0;" >
           <input type="number" data-sm='' data-notsure=0 data-onshelf=0 data-sale="#bill_kuuza_jum${pos}" data-itm=0 data-expire="#expire${pos}" class=" form-control smallFont border0 item-bill-jum_idadi" id="jum_item_qty${pos}" data-pos=${pos}  data-tot_wth_vat='#jum-total${pos}' data-unit=1 data-vat_allow="#vatallow-jum${pos}" data-bei='#bill_bei_jum${pos}' data-vat='#vat-disp-jum${pos}' data-jum='#jum-actual-total${pos}' style="width: 71px;">  
         </div>

         <div class=" rej-panel${pos} idadi-rej-panel${pos}"  style="display: none;padding-left:0">
           <input type="number" data-sm='' data-notsure=0 data-onshelf=0 data-sale="#bill_kuuza_rej${pos}" data-itm=0 data-expire="#expire${pos}" id="rej_item_qty${pos}" class="border0 smallFont form-control item-bill-rej_idadi" data-pos=${pos} data-tot_wth_vat='#rej-total${pos}' data-unit=1 data-vat_allow="#vatallow-rej${pos}" data-bei='#bill_bei_rej${pos}' data-vat='#vat-disp-rej${pos}' data-jum='#rej-actual-total${pos}' style=" width: 71px;">  
         </div>

         <!-- Button trigger color modal -->
        <div class="input-group-append border" id="is_colored_item${pos}"  
        style="display: none;">
            <button id="colored_items${pos}" title="${lang('Rangi','Color')}" class="btn btn-light colored_items btn-sm px-1" data-toggle="modal" data-pos=${pos} data-val=0 data-valu=0 data-target="#modal_color">
                 <img  width="20" src="/static/pics/colors.svg"   />
            </button>
         </div>
      </div>   
      
      <div class="p-2  idadi_imezidi" id="idadi_imezidi${pos}">
      </div>

      
      <div class="color-wrapper" style="height: 35px;">
      <div  id="popColored${pos}" class="py-2 whiteBg p-1 shrink-palet popColored rounded  "
                  
      style="-webkit-box-shadow: 0px 0px 9px -3px rgba(0,0,0,0.37); 
             box-shadow: 0px 0px 9px -3px rgba(0,0,0,0.37);
             display: none;
             cursor:pointer;
             "
             
       
       >


       <div class="row classic_div">
          <label for="color_obj${pos}" style="cursor: pointer;"  class="smallerFont col-8 latoFont px-2">
             ${lang('Rangi','Color')}(<span id="color_qt${pos}" class="text-danger" >0</span>)
          </label>

            <p class="text-right col-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </p>
       </div>
       
      <div id="color_obj${pos}" >

      </div>
 
      </div>
      </div>

     </td>


     <!-- SALES PRICE -->
     <td class="pb-3 pt-2">

        <div class="row classic_div">
            <span class="text-primary float-left units_disp${pos}" style="font-size: 11px;"></span>
       </div> 


    <div class="input-group  pt-2" style="width:150px">

         <div class="  jum-panel${pos} kununua-jum-panel${pos}" style="padding-left:0">
            

            <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
                <label class="mt-1" for=""></label> 
            <div class="box-pointert d-inline "></div>
            </div>


           <input type="number" data-bei=0 data-pos=${pos} data-val=0 class="border0 form-control money-fomat bill_kuuza_jum" id="bill_kuuza_jum${pos}" style="font-size:12px;width: 110px;">  
         </div>

         <div class="  rej-panel${pos} kununua-rej-panel${pos}" style="display: none;" >
            <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
                    <label class="mt-1" for=""></label> 
                <div class="box-pointert d-inline "></div>
            </div>
           <input type="number" data-bei=0 data-pos=${pos} data-val=0 class="border0 form-control money-fomat bill_kuuza_rej" id="bill_kuuza_rej${pos}" style="font-size:12px ;width: 110px;">  
         </div>

         <!-- PRICE SELECT DROPDOWN -->
         <div class="dropdown input-group-prepend border">
         <button class="btn btn-light btn-sm drop_down smallerFont dropdown-toggle" disabled title="Other Price" type="button" id="price_drop_btn${pos}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           
         </button>
         <div class="dropdown-menu" aria-labelledby="price_drop_btn${pos}">
           

           <!-- <button  data-jum=false data-units='' data-pos=1 data-show=".rej-panel1" data-hide=.jum-panel1   class=" btn-primary btn btn-sm setPu setPusecond1 dropdown-item"  > </button>              
           <button  data-jum=true data-units='' data-pos=1 data-show=".jum-panel1" data-hide=.rej-panel1 class="btn-light btn btn-sm setPu setPufirst1 dropdown-item"> </button>
    -->
            </div>
           </div>
         </div>`

    if (vat_allow){
           tr+=`<div class="custom-control  custom-checkbox" id="na_vat_panel${pos}" style="display: none;">
        <input type="checkbox" data-pos=${pos} class="custom-control-input vat-include" id="na_vat${pos}">
        <label class="custom-control-label latoFont smallerFont" for="na_vat${pos}"> 
        ${lang(' pamoja na VAT  ',' VAT  included  ')} 
        </label>
   </div> `
    }      


    tr+=`<div class="p-2  idadi_imezidi" id="hasra_${pos}">
    </div>
         
     </td>`
let serv = Number($('#add_bill_item').data('service')) || 0 

     if(vat_allow&&!serv){
         tr+=`
 <!--ACTUAL TOTAL .................. . -->
     <td class="pb-3 pt-3 ">
     <div class="row classic_div">
        <span class=" float-left idadi-units_disp${pos}" style="font-size: 11px;color:rgba(240, 248, 255, 0)"></span>
     </div>   

        <div class=" jum-panel${pos} ">
             
                <input type="text" id="jum-actual-total${pos}" readonly class="smallerFont made-input" style="width:110px">
        </div>
        
        <div class=" rej-panel${pos}" style="display: none;">
            
                <input type="text" id="rej-actual-total${pos}" readonly class="smallerFont made-input" style="width:110px">
        </div>
    </td>

     <!-- VAT .................. . -->
     <td class="pb-3 pt-3 ">
        
     <div class="row classic_div">
        <span class=" float-left idadi-units_disp${pos}" style="font-size: 11px;color:rgba(240, 248, 255, 0)"></span>
     </div> 
        <div class="custom-control jum-panel${pos} custom-checkbox">
            <input type="checkbox" data-pos=${pos} data-actual="#jum-actual-total${pos}" data-vat_val=0 data-include=false data-qty='#jum_item_qty${pos}' data-total_with_vat="#jum-total${pos}" data-bei='#bill_bei_jum${pos}' class="custom-control-input vat-fill" id="vatallow-jum${pos}">
            <label class="custom-control-label" for="vatallow-jum${pos}"> 
                <input type="text" data-vat_val=0  readonly class="smallerFont made-input" id="vat-disp-jum${pos}" style="width:110px">
            </label>
        </div>
        
        <div class="custom-control rej-panel${pos}  custom-checkbox" style="display: none;">
            <input type="checkbox" data-pos=${pos} data-actual="#rej-actual-total${pos}" data-include=false data-qty='#rej_item_qty${pos}' data-total_with_vat="#rej-total${pos}" data-vat_val=0 data-bei='#bill_bei_rej${pos}' class="custom-control-input vat-fill" id="vatallow-rej${pos}">
            <label class="custom-control-label" for="vatallow-rej${pos}"> 
                <input type="text"  data-vat_val=0  readonly class="smallerFont made-input" id="vat-disp-rej${pos}" style="width:110px">
            </label>
        </div> 

       
    </td>`
     }

     

     if(serv){
         tr+=`

         <!--SUB TOTAL .................. . -->
         <td class="pb-3 pt-3 ">
         <div class="row classic_div">
            <span class=" float-left idadi-units_disp${pos}" style="font-size: 11px;color:rgba(240, 248, 255, 0)"></span>
         </div>   
    
            <div class=" jum-panel${pos} ">
                 
                    <input type="text" id="jum-actual-total${pos}" readonly class="smallerFont made-input" style="width:110px">
            </div>
            
            <div class=" rej-panel${pos}" style="display: none;">
                
                    <input type="text" id="rej-actual-total${pos}" readonly class="smallerFont made-input" style="width:110px">
            </div>
        </td>
         
         
         <!-- DURATION -->
         <td class="pb-3 pt-2 ">

          <div class="row classic_div">
              <span class="text-primary float-left units_disp${pos}" style="font-size: 11px;"></span>
         </div> 

         <div class="input-group  pt-2" style="width:200px">
         <div class="input-group-prepend  ">
         <select name="servduration${pos}" id="servduration${pos}" class="form-control smallFont" >
             <option value=0 > ${lang('Muda','Time')}</option>
         </select>
       </div>

              <div  style="padding-left:0">
             <input type="number" data-pos=${pos} data-val=0 data-bei=0 class="  form-control   border0" id="serviceDuration${pos}" readonly style="font-size:12px;width: 40px;">  
           </div>

         </div>

         </td>`
     }
   


    

     
    
     
     
    
tr+=`<!-- TOTAL -->
     <td class="pb-3 pt-3 remove-rw">
     <div class="row classic_div">
         <span class=" float-left idadi-units_disp${pos}" style="font-size: 11px;color:rgba(240, 248, 255, 0)"></span>
      </div> 
         <input type="text" readonly id="jum-total${pos}" class="smallerFont form-control jum-panel${pos}" style="width: 115px;">
         <input type="text" readonly id="rej-total${pos}" class="smallerFont form-control rej-panel${pos}" style="width: 115px;display:none">
   
         <div class="text-right remove_bill_item "  style="margin-bottom: 2px;margin-right:0">
             <button data-remove='#bill_item${pos}' type="button" class="btn btn-default btn-sm text-danger remove_bill_item_tr" style="padding: 0 !important;">
                 <span style="font-size:x-large;padding: 3px 4px !important;">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                 <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                 <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
               </svg>                 </span>
                </button>
         </div>
   
        </td>
     
 </tr>     
       
    `

   return tr 
}