
//Product search for sales
 //search product.............................................................................//
 var index=-1;	
 $('body').on('keyup','.suggest-holder input', function(){
    const pos= $(this).data('pos'),searchi = $(this).val()
       filterInputData({searchi,pos})
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
              shelfQty = Number(itm.idadi ),

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

              



      if(jina_namba.match(search)){
         const itmImg = ItemImg.state.filter(im=>itm.bidhaa_id===im.bidhaa)[0]?.picha__picha

          let li=`<li class="row" data-value=${itm.id} data-valu=${itm.bidhaa_id} data-prod=${itm.bidhaa_id} data-pos=${pos}>
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
  prics=[]
 var The_price =new prices(prics)
 
var OutstockColor = class clrs{
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
  colrs=[]
 var OutColor =new OutstockColor(colrs)
 

var OutstockSize = class Szs{
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
  colrs=[]
 var OutSize =new OutstockSize(colrs)


 
 // function getColor_Size(coloredItemb,ItemsSizeb){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", 
        url: "/mauzo/Bei_tu",
      data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
 
        if(data.bei.length>0){
            The_price.state=data.bei
            OutColor.state = data.stokuRangi
            OutSize.state = data.stokuSize
        }
 
       
 
    })
 

 

 function placedata(pos,itm){
     //GET THE ITEM
    let itms=Items.state,colrd=false
    const itmf = i=>i.id === itm,
         sel = itms.filter(itmf)
          const it =  sel[0]
          $(`#search${pos}`).val(it.bidhaaN)
          $(`#search${pos}`).data('itm',it.id)

          let desc = ''
          if(it.TransCode!=null) desc = 'RC-'+it.TransCode
          if(it.puCode!=null && it.TransCode==null) desc = 'BILL-'+it.puCode
          if(it.ProdCode!=null && it.TransCode==null) desc = 'BATCH-'+it.ProdCode
          if(it.addCode!=null && it.TransCode==null) desc = 'ADJ-'+it.addCode

          desc = `<u class="ml-1 pl-1 smallFont border-left darkblue" >${desc}</u>`

          $(`#ItemDesc${pos}`).html((it.maelezo || '')+desc)
     
           //clear the color/size display.....................................//
           $(`#color_obj${pos}`).html('')
           $(`#color_qt${pos}`).text(0)
           $(`#qty${pos}`).val('')
           $(`#qty${pos}`).data('onshelf',it.idadi)
           $(`#qty${pos}`).data('notsure',Number(it.notsure)||0)
           $(`#qty${pos}`).data('sm',it.vipimo)
           $(`#qty${pos}`).prop('readonly',false)
           $(`#popColored${pos}`).hide()
           $(`#unit_sel${pos}`).prop('disabled',false)


            //check whether the item involve color ......................//
            let clrd =x => x.bidhaa === it.id 

            const colored =  coloredItem.state.filter(clrd),
                  of_c = colored.filter(l=>l.color__colored)
            
             if(of_c.length>0){
              color_size(it.id,pos,coloredItem.state,ItemsSize.state)
              $('#modal_color').modal('show')
              $(`#unit_sel${pos}`).prop('disabled',true)

             }
         
              showimgAd(pos,it.bidhaa_id)

         $(`#colored_items${pos}`).data('val',it.id);




      //ASSIGN UNIT PRICE
      let units=[], 
      units1 = {
       'id':0,
      unit:it.vipimo,
      price:Number(it.Bei_kuuza),
      qty:1,
      made:false
  }

  units.push(units1)

  let md = m=>m.item_id === it.bidhaa_id
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




  if (Number(it.uwiano)>1){
      units2={ 'id':0,
               unit:it.vipimoJum,
               price:Number(it.Bei_kuuza_jum),
               qty:it.uwiano,
               made:false
           }

           units.push(units2)
  }

  units =[...units,...madone]


let = opt=''
 units.forEach(u=>{
    opt+=`<option value=${u.qty}  >${u.unit}</option>
 ` 
 })

 
 $(`#unit_sel${pos}`).html(opt); 

}




//Place Image to its appropriate.................................//
function showimgAd(pos,prod){
    let imge=ItemImg.state,coount=0,im_sr='',trp=''
                
            for(let im in imge){
                
                if(imge[im].bidhaa==prod) {

                 coount+=1;
                 im_sr=`<img src="${imge[im].picha__picha}" width="40"  style="cursor:pointer">`
                }
            }
            
            if(coount>0){
                trp+=im_sr
            }else{
                 trp+=`       
                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                 <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                 <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
               </svg>`
            }
            $(`#imgplace${pos}`).html(trp)
}


 //On clicking the color button........................................................................//
$('body').off('click','.colored_items').on('click','.colored_items',function(){
    let val =$(this).data('val'),
         
        pos =$(this).data('pos')

   color_size(val,pos,coloredItem.state,ItemsSize.state)

})


 
//setting color or quntity size in the color/size input............................................................................................//
$('body').on('keyup','.bill-inputColor',function(){
    let disp='',colors=0,tot =0 
    let pos=$(`#coloredone${$(this).data('valu')}`).data('pos')
    let colarr=[],sizearr=[]
    $('.coloredscene').each(function(){
      let len =  $(this).children('.sizedscene').length
        let uwiano=Number($(this).data('uwiano')),
            rangi=$(`#coloredone${$(this).data('valu')}`).data('jina'),
            code=$(`#coloredone${$(this).data('valu')}`).data('code'),
            vipimo=$(`#coloredone${$(this).data('valu')}`).data('pima'),
            vipimo_jum=$(`#coloredone${$(this).data('valu')}`).data('pima_jum'),
            color_id =$(this).data('valu'),
            prod_idadi=Number($(this).data('idadi')),
            add = Number($('#saveReduceAdj').data('add')) || 0
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
        if(idadi<=prod_idadi || add ){
                tot+=idadi
        
        }

        } 
    
    })
        
        
    
    //COMPARE THE QUANTITY......................//
          if(idadi>0 && (prod_idadi>=idadi || add ) ){


             //object to store the color whose qty is set....................//
                let  lr ={
                    'idadi':idadi,
                    'color':color_id
    
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
                            <span>
                            ${titleCase(rangi)}=> 
                            </span>
                            `
                            if(uwiano==1 || idadi/uwiano<=1){
                              disp+=`<span class="smallFont">${vipimo}:</span> <span class="text-primary">${idadi}</span>`
                            }else if(uwiano>1 && idadi/uwiano >1){
                              disp+=`<span class="smallFont">${vipimo_jum}:</span><span class="text-primary">${Number(idadi/uwiano)}</span>`
    
                              if(idadi%uwiano>0){
                                disp+=`,<span class="smallFont">${vipimo}:</span><span class="text-primary">${idadi%uwiano}</span>`
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
                            <span >
                            ${titleCase(rangi)} =>
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
                               


    
                            if(szqty>0 && (itm_idadi>=szqty || add )){
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
                                disp+=`,<span class="smallFont">${vipimo}:</span><span class="text-primary">${szqty%uwiano}</span>`
                              }
                            }
                            
                         disp+=`</span> | `


                          //store the size qty set .....................//
                          let  szd= {
                            'idadi':szqty,
                            'size':$(this).data('valued'),
                            'color':color_id
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
                   $(`#qty${pos}`).prop('disabled',true)
                   
               }
       }else{
           $(`#popColored${pos}`).fadeOut(100)
           $(`#colored_items${pos}`).data('color',[])
           $(`#colored_items${pos}`).data('size',[])
           if(tr.data('jum')){
            $(`#jum_item_qty${pos}`).prop('disabled',false)
        }else{
            $(`#qty${pos}`).prop('disabled',false)
            
        }
    
       }
    
       //if retail and whole sale ratio is not 1(Retail & wholesale involved) switch to the retail and set the quantity.....//
    //    let wiana=Number($(this).data('uwiano'))

       if(!$(`#bill_item${pos}`).data('jum')){
         
    
           $(`.jum-panel${pos}`).hide()
           $(`.rej-panel${pos}`).show()
    
        //    $(`#bill_item${pos}`).data('jum',false)
    
        
          if(tot>0){
        $(`#qty${pos}`).val(tot)
    
          }else{
        $(`#qty${pos}`).val(0)
    
          }
    
       }else{
           if(tot>0){
          
         $(`#jum_item_qty${pos}`).val(tot)
           }else{
         $(`#jum_item_qty${pos}`).val(0)
               
           }
       }
     
    
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
        vipimo_reja,
        add = Number($('#saveReduceAdj').data('add')) || 0 
    
    for (let l in colored) {
        // find the corresponding itemm bidhaa from items....................//
        if(Number(colored[l].bidhaa)==Number(val) && (Number(colored[l].idadi)>0 || add ) && colored[l].color__colored){
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
                             <span class="smallerFont">${titleCase(colored[l].color__color_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, ""))}</span>
                             </p>
                             <div class="coloredscene" data-show="#success${colored[l].id}" data-idadi=${colored[l].idadi} data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-valu=${colored[l].id}  data-colored=true data-class="inputColor${colored[l].id}">
                             `

          //if the item include size place the size input.............................//
           let size=0 ,num=0
           sized.forEach(sz=>{
               if( sz.sized__color == colored[l].color && sz.bidhaa == colored[l].bidhaa){
                   size+=1
                   num+=sz.idadi,

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
                   <div style="border-top:1px solid #ccc" data-valued=${sz.id} class="sizedscene mt-2 pt-2" data-idadi=${Number(sz.idadi)} data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-valu=${colored[l].id}  data-show="#success${colored[l].id}" data-class="inputColor0${sz.id}" data-colored=false id="sizedone${sz.id}" data-color=${colored[l].sized__color} data-size="${sz.sized__size}" >
                      <label class="d-block smallFont" for="">${sz.sized__size}</label>`
                
                if(Number(colored[l].bidhaa__bidhaa__idadi_jum)>1 && (Number(sz.idadi)/Number(colored[l].bidhaa__bidhaa__idadi_jum)>=1 || add ) ){
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
                           if((Number(sz.idadi)/Number(pr.idadi)>=1) || add ){
                               coloredone+=`
                        <div class="row py-1">
                         <div class="col-4">
                                <label class="text-primary smallerFont" for="jum">${titleCase(pr.jina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, ""))}</label>
                        </div>                    
                        <div class="col-8">
                            <input  data-valu=${colored[l].id} data-sized=${sz.id}   class="bill-inputColor form-control smallerFont inputColor0${sz.id}" data-uwiano=${Number(pr.qty).toFixed(FIXED_VALUE)}   data-jum=true  type="number" `
                        //show the sett value if the user has alread sat the quantities for given size.....//
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
                        <strong>${Number(sz.idadi).toFixed(FIXED_VALUE)}</strong>
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
                     if(Number(colored[l].bidhaa__bidhaa__idadi_jum)>1 && ((Number(colored[l].idadi)/Number(colored[l].bidhaa__bidhaa__idadi_jum)>=1) || add) ){
                            coloredone+=`  
                                        <div class="row mb-2">
                                            <div class="col-4">
                                               <label class="smallerFont" for="dozen">${colored[l].bidhaa__bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}:</label>
                                            </div>
                                            <div class="col-8">
                                                <input type="number" data-show="#success${colored[l].id}" data-color=true data-jum=true data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-idadi=${colored[l].idadi} placeholder=0 class="smallerFont bill-inputColor form-control inputColor${colored[l].id}" data-wiana=${Number(colored[l].bidhaa__bidhaa__idadi_jum)}  data-valu=${colored[l].id}   type="number" ` 
                                                if(there_is){
                                                    coloredone+=` value=${Number(qty_set/Number(colored[l].bidhaa__bidhaa__idadi_jum))}`
                                                  }
                                            coloredone+=` >
                                                
                                             </div>
                                        </div>`
                             }


                             if(prs.length>0){
                                 prs.forEach(pr=>{
                                     if((Number(colored[l].idadi)/Number(pr.idadi)>=1)  ){
                                      coloredone+=`  
                                        <div class="row mb-2">
                                            <div class="col-4">
                                               <label class="smallerFont" for="dozen">${titleCase(pr.jina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")) }:</label>
                                            </div>
                                            <div class="col-8">
                                                <input type="number" data-show="#success${colored[l].id}" data-color=true data-jum=true data-uwiano=${pr.idadi} data-idadi=${colored[l].idadi} placeholder=0 class="smallerFont bill-inputColor form-control inputColor${colored[l].id}" data-wiana=${Number(pr.idadi)}  data-valu=${colored[l].id}   type="number" ` 
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
                                       <input type="number" data-show="#success${colored[l].id}"  data-uwiano=${colored[l].bidhaa__bidhaa__idadi_jum} data-idadi=${colored[l].idadi} data-color=true placeholder=0 data-jum=false class="form-control bill-inputColor inputColor${colored[l].id} smallerFont"  data-valu=${colored[l].id} `
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
                             <span style="font-size:11px">${lang('Zilizopo','Onshelf qty')}:</span>
                             <div class="row" style="font-size:10px">
                                <div class="col-7">
                                    ${colored[l].bidhaa__bidhaa__vipimo} :
                                </div>
                                <div class="col-5">
                                    <strong>${Number(colored[l].idadi).toFixed(FIXED_VALUE)}</strong> 
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
     $(`#qty${pos}`).prop('readonly',true)
     

}else{
     $(`#is_colored_item${pos}`).hide();
     $(`#qty${pos}`).prop('readonly',false)

}


    $('#bill_item_color').html(coloredone)
    $('#item_jina').html($(`#search${pos}`).val())
     
 }


//SHOW QTY EXCEEDED MSG WHEN USER EXCEED THE ACTUAL STOCK QTY
 $('body').on('keyup',`.sh_qty`,function(){
    let pos = $(this).data('pos'),
        last_qty = Number($(this).val()) || 0 ,
       
        onsh = Number($(this).data('onshelf')), 
        notsure = Number($(this).data('notsure')) || 0, 

        uwiano = Number($(`#unit_sel${pos}`).find('option:selected').val()), 
        sm_u =$(this).data('sm'),
        add = Number($('#saveReduceAdj').data('add')) || 0

        

        //Show qty exceed warning..............
        if((last_qty*uwiano>onsh) && !add && !notsure ){
            let msg=`<small class="text-danger p-2" style="font-size:11px;" > 
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                       <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                       <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                      </svg>                                
                    ${lang(`Ididi zilizopo <span class="text-primary">${sm_u}.</span> <strong>${onsh}</strong>`,`Qty onshef <span class="text-primary">${sm_u}:</span> <strong>${onsh}</strong>`)}
                </small>`

              $(`#idadi_imezidi${pos}`).html(msg)
        }else{
            $(`#idadi_imezidi${pos}`).html('')

        }

   
 })


 //to add another item ............................//
$('body').off('click','#add-btn').on('click', '#add-btn', function () {

    let hasdata=$(`#search${$('#item_tr_tbody tr').last().data('pos')}`).data('itm') || 0
                
    
    
    if(hasdata>0){ 
        let pos=$('#item_tr_tbody tr').last().data('pos'),
            last_qty = Number($(`#qty${pos}`).val())  ,
            onsh = Number($(`#qty${pos}`).data('onshelf')), 
            uwiano = Number($(`#unit_sel${pos}`).find('option:selected').val()),
            add = Number($('#saveReduceAdj').data('add')) || 0 

        

        pos=pos+1
        if((last_qty*uwiano<=onsh)||add){
        $('#item_tr_tbody').append(tablerow(pos))          
        }
    
    }
})

     //Remove  invoice item from the list......................   
$('body').off('click','.remove_bill_item_tr').on('click', '.remove_bill_item_tr', function () {
    let hommany=document.getElementById("item_tr_tbody").childElementCount,
        pos = $(this).data('pos')

        if(hommany!=undefined){
            if(hommany>1){
               $(`#list_tr${pos}`).remove()
            }else{
               
               $('#item_tr_tbody').html(tablerow(1))

            }

        }


})


//  PLACE TR DATA ON ITEM ADDITION.........................................//
function tablerow(pos){
    return tr=`
      
    <tr id="list_tr${pos}" data-pos=${pos} >
    <td   class=" p-1 " >
    
      <!-- IMAGE -->
      <div class="centerItem bg-light" id="imgplace${pos}">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
            </svg>
        </div>

       </td> 

       <td>
        <!-- ITEM NAME -->
        <div class="suggest-holder  item-attr${pos} ">
          <input
          placeholder="${lang('Andika Jina la Bidhaa','Write Item name')} "
          style="min-width: 210px;"
          type="text" 
          data-pos=${pos}
          id = "search${pos}"
          data-itm = 0
          class="form-control text-capitalize border0 darkblue weight500 muhimu-b-kununua-zilizopo suggest-prompt${pos} suggest-prompt input-data latoFont" />
         
          <ul class="masaki masaki${pos}" data-hiarch=${pos} style="min-width: 350px;z-index:999999;max-height:250px;overflow-y:scroll"></ul>

        </div>
        <div class="smallFont latoFont" id="ItemDesc${pos}"></div>

        
    </td>

    <td class="p-1">
        <!-- QUANTITY -->
        <div class="input-group" style="max-width: 190px;">
            <!-- UNITS -->
            <select name="qty_unit${pos}" style="max-width: 80px;" id="unit_sel${pos}" class="input-group-prepend made-input latoFont smallerFont">
                <option value=0 ></option>
            </select>
        <input type="number" data-notsure=0 data-sm=0 id="qty${pos}" data-onshelf=0 data-pos=${pos} class="form-control sh_qty border0 smallFont" >

            <!-- Button trigger color modal -->
           <div class=" input-group-append border" id="is_colored_item${pos}" >
                <button  id="colored_items${pos}" title="${lang('Rangi','Color')}" class="btn btn-light colored_items btn-sm px-1" data-toggle="modal" data-pos=${pos}  data-target="#modal_color"  data-val=0>
                    <img  width="20" src="/static/pics/colors.svg"  />
                </button>
            </div>

            <!-- Button to remove item from table -->
        <button data-pos=${pos} class="btn-default remove_bill_item_tr  btn btn-sm text-danger position-absolute" style="right: -62px;top:12px">
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="currentColor" class="bi bi-dash-circle-dotted" viewBox="0 0 16 16">
              <path d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
            </svg>
        </button>

        </div>

        <div class="idadi_imezidi" id="idadi_imezidi${pos}">
        </div>

        <!-- DISPLAY SHOWED COLOR -->
        <div class="color-wrapper mt-1 text-right" style="height: 35px;">
          <div  id="popColored${pos}" class="py-2 whiteBg p-1 text-left shrink-palet popColored  rounded  "
         
       style="cursor:pointer;display: none;
              ">

        <div class="row classic_div">
           <div style="cursor: pointer;"  class="smallerFont col-8 latoFont px-2">
              ${lang('Rangi','Color')}(<span id="color_qt${pos}" class="text-danger" >0</span>)
           </div>

             <p class="text-right col-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                   <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                 </svg>
             </p>
        </div>
        
          
        

       <div id="color_obj${pos}" style="webkit-box-shadow: 0px 0px 9px -3px rgba(0,0,0,0.37); 
                                         box-shadow: 0px 0px 9px -3px rgba(0,0,0,0.37);" >
               

       </div>

       
       </div>
      </div>
        
    </td>
</tr>
       
    `

    
}

//SAVE REDUCE ADJUSTMENT DATA...........................................///
$('#saveReduceAdj').unbind('submit').submit(function (e) {
    e.preventDefault() 
    let url=$(this).attr("action"),
      //  edit=$(this).data("edit"),
       // bill=$(this).data("bill"),
        csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
        code =  $('#transfer_code').val(),
        date = $('#transfer_date').val(),
        dimage = 0,
        use = 0,
        waste = 0,
        expire = 0,
        nw = 0,
        others=0,
        reasoni = Number($('#adjReason').val()) || 0,
        desc = $('#Reduce_maelezo').val(),
        add = Number($(this).data('add')) || 0
        sup  = $('#produ_sambazaji-kununua').find('option:selected').data('value')
        // to = $('#to_interprise').find('option:selected').data('value'),
        itm_dt=[],zer=0,kuzid=0,
        allColored = [],
        allSized = [],
        matumizi = $('#tumia_jina-adj').val(),
        tumizi_id = Number($('#chagua-matumizi-adjst').val()) || 0
        newExp = Number($('#tumizi_jipya-adj').prop('checked')) || 0
      //  rudi = Number($(this).data('rudi')),
      //  rudi_val = $(this).data('rudi_val')

      asNew = $('#ongeza_kama_mpya').prop('checked')
      onlQty = $('#ongeza_kwa_husika').prop('checked')

      if(asNew){
          reasoni=6
      }

      if(onlQty){
          reasoni=5
      }
       if(reasoni==1){
            use = 1
        }
        if(reasoni==2){
            dimage = 1
        }
        if(reasoni==3){
            expire = 1
        }
        if(reasoni==4){
            waste = 1
        }

        if(reasoni==6){
            nw = 1
        }
        if(reasoni==9){
            others = 1
        }


    $('.sh_qty').each(function(){
        
        let pos=$(this).data('pos'),
             notsure = Number($(this).data('notsure'))||0,
             uwiano=Number($(`#unit_sel${pos}`).find('option:selected').val()),
             idadi = Number($(this).val()) || 0,
             onsh = Number($(this).data('onshelf')),
         //Take the color if color/size set qty............//
              sized=[],colored=[],
              color=$(`#colored_items${pos}`).data('color'),
              size= $(`#colored_items${pos}`).data('size')

        if(($(this).val()=='')&&!notsure){
            zer += 1
            $(this).addClass('redborder')
        }              

              if(((idadi*uwiano >onsh)&&!notsure) || add  ){
                  $(this).addClass('redborder')
                  kuzid+=1
              }

              

              if(color!=undefined){
                  colored=color
                  allColored = [...allColored,...colored]
              }

              if(size!=undefined){
                  sized=size
                  allSized = [...allSized,...sized]  
              }

          let  itn = {
                val:Number($(`#search${pos}`).data('itm')),
                uwiano:uwiano,
                idadi:(Number(idadi)*Number(uwiano)),
                color:colored,
                size:sized,
                notsure:notsure
            } 
            
            itm_dt.push(itn)


    })



    
//check for exceeded duplicates ........................///////

let   size_exceed =false,
color_exceed = false,
 itm_exceed = false


if (allSized.length>0){
const sized_id = [...new Set(allSized.map(x=>x.size))] 
sized_id.forEach(el => {

const chosen_s = allSized.filter(s=>s.size===el),
    all_s = ItemsSize.state.find(s=>s.id===el)
    if(Number(chosen_s.reduce((a,b)=> a + b.idadi,0))>Number(all_s.idadi)){
        size_exceed = true
    }
  
});
}


if (allColored.length>0){
const color_id = [...new Set(allColored.map(x=>x.color))] 

color_id.forEach(el => {

const chosen_c = allColored.filter(c=>c.color===el),
     all_c = coloredItem.state.find(c=>c.id===el)
     if(Number(chosen_c.reduce((a,b)=> a + b.idadi,0))>Number(all_c.idadi)){
         color_exceed = true
     }

});
}

if (itm_dt.length>0){
const items_id = [...new Set(itm_dt.map(x=>x.val))] 

items_id.forEach(el => {

const chosen_i = itm_dt.filter(i=>i.val===el&&!i.notsure),
     all_i = Items.state.find(i=>i.id===el)
      
     if(Number(chosen_i.reduce((a,b)=> a + (b.idadi*b.uwiano),0))>(Number(all_i.idadi))){
         itm_exceed = true
     }
});


}

let data = {
    data:{

        waste:waste,
        use:use,
        dimage:dimage,
        expire:expire,
        others:others,
        nw:nw,
        desc:desc,
        code:code,
        date:date, 
        sup:sup, 
        newExp:newExp,
        matumizi:matumizi,
        tumizi_id:tumizi_id, 
        itm:JSON.stringify(itm_dt),
        csrfmiddlewaretoken:csrfToken, 
    },
    url:url
}
   
    // if (Number(to)>0){
        if(zer==0 && (kuzid == 0 || add ) ){
        if(!(size_exceed||color_exceed||itm_exceed) || add ){
          
            if(!(reasoni==0 && add)){
              
                if(((newExp && matumizi!='') || (!newExp && tumizi_id!=0)) || (Number(others) && !newExp) || add ){
                     saveDtAdj(data)
                }else{
                     redborder('#tumia_jina-adj')
                     $('#chagua-matumizi-adjst').selectpicker('setStyle', 'border-danger')
                 }     
            }else{
                redborder('#how_to_add')
            }
             

          
        }else{
                alert(lang('Bidhaa zimejuridia kwa kuzidi tafadhari hakikisha idadi ya bidhaa haizidi idadi iliyopo stoku','Repeted items number, exceeded the item(s) quntity in stock, please make sure that items quatity is not exceeding stock quantity'))
 
            }
         }
    // }else{
    //     alert(lang('Tafadhari chagua stoku ya kuhamisha','Please select destination wharehouse'))
    //     $('#to_interprise').addClass('redborder')
    // }


})

function saveDtAdj(data){

    $("#loadMe").modal('show');

    $.ajax({
    type: "POST",
    url: data.url,
    data: data.data,
    success: function (respo) {

        if(respo.success){
            toastr.success(lang(respo.msg_swa,respo.msg_eng), 'Success Alert', {timeOut: 2000});
             if('comfirm' in data ){
                 location.reload()
             }else{
                 location.replace(`/stoku/viewAdjst?item_valued=${respo.bil}`)
             }
          
        }else{
            toastr.error(lang(respo.msg_swa,respo.msg_eng), 'Error Alert', {timeOut: 2000});

        }
        $("#loadMe").modal('hide');
        hideLoading()
        
    }
});
}


function delDt(data){
    $("#loadMe").modal('show');

    $.ajax({
    type: "POST",
    url: data.url,
    data: data.data,
    success: function (respo) {

        if(respo.success){
            toastr.success(lang(respo.msg_swa,respo.msg_eng), 'Success Alert', {timeOut: 2000});
            if(Boolean(data.data.new)){
             location.replace(`/stoku/bidhaaoda`)
            }else{
             location.replace(`/stoku/receiveNote`)
                
            }
          
        }else{
            toastr.error(lang(respo.msg_swa,respo.msg_eng), 'Error Alert', {timeOut: 2000});

        }
        $("#loadMe").modal('hide');
        hideLoading()
        
    }
});
}

