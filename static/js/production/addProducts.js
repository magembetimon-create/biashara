
var col = class coloredbn{
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
 colorsb=[]
var coloredItemb = new col(colorsb)


// hifadhi size baada ya kuletwa na function ya kwa ajili ya bili mpya.............................................//
var siz=class storeSizeb{
    constructor(_data){
      this.data=_data
    }
  
    get state(){
      return this.data
    }
  
    set state(newdata){
       this.data=newdata
  
    }
  }
  //var n=false 
   dataSizeb=[]
 var ItemsSizeb =new siz(dataSizeb)

// hifadhi Bidhaa baada ya kuletwa na function ya kwa ajili ya bili mpya.............................................//
var bidhaa__ = class Bizaa{
    constructor(_data){
      this.data=_data
    }
  
    get state(){
      return this.data
    }
  
    set state(newdata){
       this.data=newdata
  
    }
  }
  //var n=false 
 var BillItems =new bidhaa__([])


 function getColor_Size(){
     $('#loadMe').modal('show')
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", 
        url: "/stoku/getSizeColor",
      data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
        $('#loadMe').modal('hide')
        if(data.color.length>0){
            coloredItemb.state=data.color
        }

        if(data.size.length>0){
            ItemsSizeb.state=data.size
        }

        BillItems.state=data.bizaa || []

    })

}

getColor_Size()



//Product search for sales
 //search product.............................................................................//
 var index=-1;	
 $('body').on('keyup','.suggest-holder input', function(){
 // Clear the ul   
 
 let itms = BillItems.state,
     pos= $(this).data('pos')
 $(`.masaki${pos}`).empty();
     
 // Cache the search term
 var search = $(this).val();
 
 // Search regular expression
 var regrex = /[^a-z0-9 ]/gi;
   search = new RegExp(search.replace(regrex,''), 'i');
     var lin;
 
 // Loop through the array
 for(var i in itms ){
     let jina_namba = itms[i].bidhaa__bidhaa_jina + ' ' +itms[i].namba 
     if(jina_namba.match(search)){
        const itmImg = ItemImg.state.filter(im=>itms[i].bidhaa===im.bidhaa)[0]?.picha__picha

     var li=`<li class="row" data-value=${itms[i].id} data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${pos}>
        <div class="col-2 col-md-1">
                <img alt="${lang('Hakuna picha','No image')}" style="max-width:60px;min-width:60px"  src=${itmImg}  >
        </div>
        <div class="col-10 col-md-11" >
       <span  class='suggest-name ' data-value=${itms[i].id} data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${pos} >${ itms[i].bidhaa__bidhaa_jina} </span> 
        <a class="d-block" style='padding:7px'>
            <span class='suggest-description text-danger font-weight-bold' style='float:right'> <span class="darkblue weight500"> ${(itms[i].curenci)}</span>. ${Number(itms[i].Bei_kuuza).toLocaleString()}/=</span>
            <span class='suggest-description' style='float:left'>${itms[i].bidhaa__bidhaa_aina_id__aina }</span>
            <span class='suggest-description' style='color:#47476b'></span>
            <br/>
        </a>

 </div>
    
     
 
    </li>`;
    
    $(`.masaki${pos}`).append(li);
 }
 }
 
 if($(this).val().length > 0){
     $(`.masaki${pos}`).show();
 }else{
     $(`.masaki${pos}`).hide();
 
 }
 
 
 });


 


 
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
 
         let pos = $('.masaki li .suggest-name').eq(index).data('pos'),
            itm_val = $('.masaki li .suggest-name').eq(index).data('value'),
             prod_val = $('.masaki li .suggest-name').eq(index).data('prod')
 
         placedata(pos,itm_val)
         $('.masaki').hide();
       //  color_size(prod_val,pos,coloredItemb.state,ItemsSizeb.state)   
 
         
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
      let prod_val = $(this).data('prod')
 
      placedata(pos,itm_val)
 
      $('.suggest-holder ul').hide();
 
     // color_size(prod_val,pos,coloredItemb.state,ItemsSizeb.state)   
 
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
    let itms=BillItems.state,colrd=false
    const itmf = i=>i.id === itm,
         sel = itms.filter(itmf)
          const it =  sel[0]
          $(`#search${pos}`).val(it.bidhaa__bidhaa_jina)
          $(`#search${pos}`).data('itm',it.id)
     
           //clear the color/size display.....................................//
           $(`#color_obj${pos}`).html('')
           $(`#color_qt${pos}`).text(0)
           $(`#qty${pos}`).val('')
           $(`#qty${pos}`).data('onshelf',it.idadi)
           $(`#qty${pos}`).data('sm',it.bidhaa__vipimo)
           $(`#qty${pos}`).prop('readonly',false)
           $(`#popColored${pos}`).hide()
           $(`.item-attr${pos}`).show()
           $(`#unit_sel${pos}`).prop('disabled',false)


            //check whether the item involve color ......................//
             
            const coloredITn =  coloredItemb.state.filter(x => x.bidhaa === it.bidhaa),
                  of_c = coloredITn.filter(l=>l.colored)
            
              

             if(of_c.length>0){
              color_size(it.bidhaa,pos,coloredItemb.state,ItemsSizeb.state)
              
              $('#modal_color').modal('show')
              $(`#unit_sel${pos}`).prop('disabled',true)
              $(`#qty${pos}`).prop('readonly',true)

             }
         
              showimgAd(pos,it.bidhaa)

         $(`#colored_items${pos}`).data({val:it.id,valu:it.bidhaa});




      //ASSIGN UNIT PRICE
      let units=[], 
      units1 = {
       'id':0,
      unit:it.bidhaa__vipimo,
      price:Number(it.Bei_kuuza),
      qty:1,
      made:false
  }

  units.push(units1)

  let md = m=>m.item_id === it.bidhaa
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




  if (Number(it.bidhaa__idadi_jum)>1){
      units2={ 'id':0,
               unit:it.bidhaa__vipimo_jum,
               price:Number(it.Bei_kuuza_jum),
               qty:it.bidhaa__idadi_jum,
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
    let val =$(this).data('valu'),
         
        pos =$(this).data('pos')

   color_size(val,pos,coloredItemb.state,ItemsSizeb.state)
})

 
//a function to check whether the item has color or size assosiated with it............................................................//
function color_size(val,pos,colored,sized){
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

        const colered = colored.filter(c=>c.bidhaa === val  )
    
    for (let l in colored) {
        // find the corresponding itemm bidhaa from items....................//


        if(colored[l].bidhaa==val && colored[l].colored){
            ina_rangi = true
  
               let selected=0
    
           coloredone+=`
                       <div class="column the_color_itm mb-2" data-colored=true data-pos=${pos} data-rangi_names="${colored[l].nick_name} ${colored[l].color_name}" data-pima='${colored[l].bidhaa__vipimo.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}' data-pima_jum='${colored[l].bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}'  data-valued=${colored[l].id} id='coloredone${colored[l].id}' data-jina=${colored[l].color_name} data-code="${colored[l].color_code}"  data-color=${colored[l].id}>
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
                            
                            >`
                    
                            let prod_color = coloredItem.state,
                                 filt= x=> x.color === colored[l].id
                                //  reducer = (acc,curr) => acc + curr.idadi
                                 const filtered_c = prod_color.filter(filt)
                                 let sum = filtered_c.length

                             
                //   ADD REMOVE COLOR BTN WHEN QUANTITY FOR COLOR IS 0
                 if(sum==0){
                     coloredone+=`           
                            <button class="btn btn-default rangis-ondoa-btn btn-sm float-right text-danger" data-action="/purchase/color_rm" data-prod=${val} data-pos=${pos} data-rangi=${colored[l].id} data->
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                            </button>`
                 } 
                 


                    coloredone+=`<p>
                                <button type="button" class="mr-2 rangi-editing" 
                                data-color=${colored[l].color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")} 
                                data-color_name=${colored[l].color_name.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")} 
                                data-idadi_jum=${colored[l].bidhaa__idadi_jum} 
                                data-valued=${colored[l].id} 
                                data-toggle="modal" data-target="#kuweka-rangi-model" style="height: 25px;width:40px;color:${colored[l].color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                    background:${colored[l].color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                    cursor:pointer;
                                    border-radius:3px;
                                    -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                                    box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                                    border:0;

                                ">
                                   color
                             </button>   
                             <span class="smallerFont">${titleCase(colored[l].color_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, ""))}</span>
                             </p>
                             <div class="coloredscene" data-show="#success${colored[l].id}" data-uwiano=${colored[l].bidhaa__idadi_jum} data-valu=${colored[l].id}  data-colored=true data-class="inputColor${colored[l].id}">
                             `

          //if the item include size place the size input.............................//
           let size=0 ,num=0
           sized.forEach(sz=>{
               if( sz.color == colored[l].id){
                   size+=1
                   num+=sz.idadi,

                    qty_set=0,
                     there_is=false

                //Trace the quantity set for  size.......................//
                    if(size_check!=undefined){
                        const chck = sze => sze.size===sz.id,
                               szed = size_check.filter(chck)

                               if(szed.length>0){
                                 let  szz = szed[0]
                                qty_set =szz.idadi
                                selected+=szz.idadi
                                 there_is=true
                            }

                      //  size_check.
                //     size_check.forEach(szd=>{

                //        if(szd.size==sz.id){

                //        }
                //    })

                    }

                       
                   

                   coloredone+=`
                   <div style="border-top:1px solid #ccc" data-valued=${sz.id} class="sizedscene" data-uwiano=${colored[l].bidhaa__idadi_jum} data-valu=${colored[l].id}  data-show="#success${colored[l].id}" data-class="inputColor0${sz.id}" data-colored=false id="sizedone${sz.id}" data-color=${colored[l].color} data-size="${sz.size}" >
                      <label class="d-block smallFont" for="">${sz.size}</label>`
                   if(Number(colored[l].bidhaa__idadi_jum)>1){
                    coloredone+=`
                   <div class="row py-1">
                         <div class="col-4">
                                <label class="text-primary smallerFont" for="jum">${colored[l].bidhaa__vipimo_jum}</label>
                        </div>                    
                        <div class="col-8">
                            <input  data-valu=${colored[l].id} data-sized=${sz.id}   class="bill-inputColor form-control smallerFont inputColor0${sz.id}" data-uwiano=${Number(colored[l].bidhaa__idadi_jum)}   data-jum=true  type="number" `
                        //show the sat value if the user has alread sat the quantities for given size.....//
                        if(there_is){
                          coloredone+=` value=${Number(qty_set/Number(colored[l].bidhaa__idadi_jum))} `
                        }
                         coloredone+=`>
                        </div>
                    </div>   
                    `
                   }

                    
                   coloredone+=`       
                     <div class="row py-1">
                     <div class="col-4">
                            <label class="text-primary smallerFont" for="jum">${colored[l].bidhaa__vipimo}</label>
                        </div>                    
                        <div class="col-8">
                            <input data-show="#success${colored[l].id}" data-valu=${colored[l].id} data-sized=${sz.id}  data-color=false class="bill-inputColor form-control smallerFont inputColor0${sz.id}" data-uwiano=${Number(colored[l].bidhaa__idadi_jum)}   data-jum=false  type="number" `
                            //show the sat value if the user has alread sat the quantities for given size.....//
                            if(there_is){
                            if(colored[l].bidhaa__idadi_jum==1)  {
                            coloredone+=` value=${Number(qty_set / Number(colored[l].bidhaa__idadi_jum))}` 

                            } else{
                                coloredone+=` value=${Number(qty_set % Number(colored[l].bidhaa__idadi_jum))}` 
    
                            }
                            }
                        coloredone+=`>
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

                            color_check.forEach(clr=>{

                                

                              if(clr.color==colored[l].id){
                                   qty_set = clr.idadi
                                    selected =clr.idadi
                                    there_is=true
                           }

                       })
                        }


            // IN CASE THE ITEM IS TO BE SOLD/PURCHASED IN WHOLESALE AND RETAIL include the wholesale input.................................//
                     if(Number(colored[l].bidhaa__idadi_jum)>1){
                            coloredone+=`  
                                        <div class="row mb-2">
                                            <div class="col-4">
                                               <label class="smallerFont" for="dozen">${colored[l].bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}:</label>
                                            </div>
                                            <div class="col-8">
                                                <input type="number" data-show="#success${colored[l].id}" data-color=true data-jum=true data-uwiano=${colored[l].bidhaa__idadi_jum} placeholder=0 class="smallerFont bill-inputColor form-control inputColor${colored[l].id}" data-wiana=${Number(colored[l].bidhaa__idadi_jum)}  data-valu=${colored[l].id}   type="number" ` 
                                                if(there_is){
                                                    coloredone+=` value=${Number(qty_set/Number(colored[l].bidhaa__idadi_jum))}`
                                                  }
                                            coloredone+=` >
                                                
                                             </div>
                                        </div>`

                             }

                            coloredone+=`
                            <div class="row mb-2">
                                   <div class="col-4">
                                      <label  for="dozen">${colored[l].bidhaa__vipimo}</label>
                                   </div>
                                   <div class="col-8">
                                       <input type="number" data-show="#success${colored[l].id}"  data-uwiano=${colored[l].bidhaa__idadi_jum} data-color=true placeholder=0 data-jum=false class="form-control bill-inputColor inputColor${colored[l].id} smallerFont"  data-valu=${colored[l].id} `
                                       if(there_is){
                                           if(Number(colored[l].bidhaa__idadi_jum)==1){
                                               coloredone+=` value=${qty_set }`
   
                                           }else{
                                               coloredone+=` value=${Number(qty_set % Number(colored[l].bidhaa__idadi_jum))}`
                                               
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

                           <!-- ADD SIZE BUTTON form toggle------------------------------------>

                            <div class="smallerFont text-center border-top"> 
                                <button class="btn btn-default btn-sm bill_size_toggle latoFont smallFont text-primary " data-show="#bill-size_save${colored[l].id}">
                                    ${lang('ongeza size','add size')} 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                     </svg>
                                </button>


                           <!-- ADD SIZE FORM------------------------------------>
                                <div  style="display:none"   id="bill-size_save${colored[l].id}" method="post">

                             <div class="form-group">
                                
                                <label  for="dozen">${lang('Jina la size','Size name')}</label>
                                
                                
                                <input type="text" id="jina-la_size${colored[l].id}"  class="form-control  smallerFont">
                                <small id="bill_name_color_valid${colored[l].id}" hidden class="text-danger smallerFont">${lang('Andika jina la size','write size name')}</small>
                            </div>                            
                             <p class="text-center">
                                  <button action="/stoku/addSize" id="submit-bill-size${colored[l].id}" data-val=${colored[l].bidhaa} data-color=${colored[l].id} data-colori=${colored[l].color} data-pos=${pos}  class="btn btn-primary save_bill_size latoFont" type="click" >
                                    <span class="spinner-border spinner-border-sm" hidden role="status" aria-hidden="true"></span>
                                       ${lang('Weka size','Save Sive')}
                                </button>
                             </p>

                             </div>

                            </div>



                             </div>
                           </div>
                           <div id="Color${colored[l].id}" data-color=${colored[l].color} data-valued=${colored[l].id} class="showingpop241 the_identify"  data-showing="#ona_rang${colored[l].id}" 
                                style="
                                height: 25px;
                                width:40px;
                                color:${colored[l].color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                background:${colored[l].color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
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


                             
                           </div>
                       </div>
                          `
                          number+=1
                          ina_rangi=colored[l].color__colored
                          total_colored+=colored[l].idadi
                          totol_produ=colored[l].bidhaa__idadi
                          idadi_jumla=colored[l].bidhaa__bidhaa__idadi_jum
                          vipimo_jumla=colored[l].bidhaa__bidhaa__vipimo_jum
                          vipimo_reja=colored[l].bidhaa__bidhaa__vipimo
                        
                        }}
             //  add other color option
           coloredone+=`
                       <div class="column mb-2" data-valued=0  data-color=0>
                          <div class="position-absolute showingpop24 p-3 whiteBg" id="ona_rang0" data-add=true data-showing="#ona_rang0"
                            style="border-radius:8px;
                            -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                            box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                            max-width:150px;
                            margin-left:-15px;
                            margin-top:-17px;
                            z-index:5;
                            display:none"
                            >
                          
                            

                        <form action="/stoku/addColor" data-val=${val} data-pos=${pos} id="bill-color_save" method="post">


                        <div class="form-group mb-2">
                             <label for="bill-set_color"  >  ${lang('weka rangi','set color')}  </label>
                           <div class="text-right">
                            <input type="color" data-jina="#jina-la_rangi" id="bill-set_color" value="#ffffff" class="form-control custom-color bill-set_color" >
                            </div>
                          </div>
                                
                            
                             
                             <div class="form-group">
                                
                                <label  for="dozen">${lang('Jina la Rangi','color name')}</label>
                                
                                
                                <input type="text" data-rangi="#bill-set_color" id="jina-la_rangi" placeholder="white" class="form-control bill-inputColor jina-la_rangi smallerFont">
                                <small id="bill_name_color_valid" hidden class="text-danger smallerFont">${lang('Andika jina la rangi','write color name')}</small>
                            </div>     

                             <div class="form-group">
                                
                                <label  for="dozen">${lang('Majina Mengine','Other Names')}</label>
                                
                                
                                <textarea row=2 id="Other_color_name" placeholder="${lang('Nyeupe','White')}" class="form-control bill-inputColor  smallerFont">
                                </textarea>
                                <small id="bill_name_color_valid" hidden class="text-danger smallerFont">${lang('Andika jina la rangi','write color name')}</small>
                            </div>                            
                                                        
                             <p class="text-center">
                                  <button id="submit-bill-color" class="btn btn-primary latoFont" type="submit" >
                                    <span class="spinner-border spinner-border-sm" hidden role="status" aria-hidden="true"></span>
                                    ${lang('Weka Rangi','Save color')}
                                </button>
                             </p>

                             </form>
                             </div>`

                              let idd_rej=0
                           

                        coloredone+=`
                          <div class="showingpop241 the_identify"  data-showing="#ona_rang0" data-color=false 
                               style="height: 25px;width:40px;
                                    background-color:#fff;
                                    color: rgba(255, 255, 255, 0);
                                     background-image: linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%), linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%);
                                    background-position: 0 0, 5px 5px;
                                    background-size: 10px 10px;
                                    cursor:pointer;
                                    -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                                    box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                                    " >
                              color
                              <div class=" position-absolute  " id="success0${pos}"  
                              style="margin-left:21px;
                              margin-top:-18px;
                              height:19px;
                              width:17px;
                              border-radius:50%;
                              color:#fff;
                              background:rgba(2, 167, 2, 0.842);
                              border:1px solid #fff;
                              display:none;">
                                 <span style="top:-1px;left:-1px;position:absolute;">
                                      <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                  </svg>
                                 </span>
                             </div>
                           </div>
                       </div>
                          `

      $(`#is_colored_item${pos}`).show();


    $('#bill_item_color').html(coloredone)
    $('#item_jina').html($(`#place_searched${pos} label`).text())

    
    if(colered.length>0){
        $('#modal_color').modal('show')
    }
     
 }



 //KUONDOA ShINA LA RANGI YA BIDHAA...................................................//
 $('body').off('click','.rangis-ondoa-btn').on('click','.rangis-ondoa-btn',function(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
         pos=$(this).data('pos'),
         val = $(this).data('prod')
    var data={
        data:{
            valued:$(this).data('rangi'),
            csrfmiddlewaretoken:csrfToken

        },
        url:$(this).data('action'),
        hide:'#kuweka-rangi-model'
    }
if(confirm(lang('Je unataka kuondoa Rangi?',' remove  color?'))){
        $.ajax({
            type: "POST",
            url: data.url,
            data: data.data,
            success: function (response) {
                if(response.data.success){
                    toastr.success(lang(response.data.swa,response.data.eng), 'Success Alert', {timeOut: 7000});

                    color_size(val,pos,response.color,response.size)

                }else{
                    toastr.error(lang(response.data.swa,response.data.eng), 'Success Alert', {timeOut: 7000});
                    
                }
                
            }
        });
}
})

//SIZE BUTTON FORM SHOW TOGGLE.....................................................................//
$('body').off('click','.bill_size_toggle').on('click','.bill_size_toggle',function(){
    $($(this).data('show')).toggle(500);    
})


//SAVE SIZE.......................//
$('body').off('click','.save_bill_size').on('click','.save_bill_size', function (e) {
    e.preventDefault()

     let color= $(this).data('color'),
         code= $(this).data('colori'),
         size_jina=$(`#jina-la_size${color}`).val(),
          csrfToken = $('input[name=csrfmiddlewaretoken]').val(),
          value = $(this).data('val'),
          pos = $(this).data('pos')


    let data={
        data:{
            valued:$(this).data('val'),
            size_name:size_jina,          
            rangi:color,
            csrfmiddlewaretoken:csrfToken

        },
        url:$(this).attr('action'),
    }


    if(size_jina!=''){
        $(`#bill_name_color_valid${color}`).prop('hidden',true)
        $(`#submit-bill-size${color} span`).prop('hidden',false)

        $(`#submit-bill-size${color}`).prop('disabled',true)

        $.ajax({
        type: "post",
        url: data.url,
        data: data.data,      
        success: function (response) {
            $(`#submit-bill-size${color} span`).prop('hidden',true)

            if(response.success){
                 ItemsSizeb.state = response.sizing
                   toastr.success(lang(response.message_swa,response.message_eng), 'Success Alert', {timeOut: 7000});
                   color_size(value,pos,coloredItemb.state,ItemsSizeb.state)
                   $(`#ona_rang${color}`).show();

            }else{
                toastr.error(lang(response.message_swa,response.message_eng), 'error Alert', {timeOut: 7000});
            }
        }
    });
    }else{
        $(`#bill_name_color_valid${color}`).prop('hidden',false)
    }
   

})

 //Submit new bill color......................................//
$('body').unbind('submit').on('submit','#bill-color_save', function (e) {
    e.preventDefault()
    let   value = $(this).data('val'),
          pos =   $(this).data('pos')

    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    let rangi_jina=$('#jina-la_rangi').val() || $('#jina-la_rangi').attr('placeholder'), 
     color_code=$('#bill-set_color').val(),
     other_name=$('#Other_color_name').val(),
     idadi_jum=0,
     idadi_reja=0

   

    let data={
        data:{
            other_name:other_name,
            valued:value,
            color_name:rangi_jina,
            color_code:color_code,
            idadi_jum:idadi_jum,
            idadi_reja:idadi_reja,
            mpya:true,
            rangi:0,
            csrfmiddlewaretoken:csrfToken


        },
        url:$(this).attr('action'),
    }

    if(rangi_jina!=''){
        $('#bill_name_color_valid').prop('hidden',true)
        $('#submit-bill-color span').prop('hidden',false)

        $('#submit-bill-color').prop('disabled',true)

        $.ajax({
        type: "post",
        url: data.url,
        data: data.data,      
        success: function (response) {

            if(response.success){
                   coloredItemb.state = response.rangi
                   toastr.success(lang(response.message_swa,response.message_eng), 'Success Alert', {timeOut: 7000});
                   color_size(value,pos,coloredItemb.state,ItemsSizeb.state)

            }else{
                toastr.error(lang(response.message_swa,response.message_eng), 'error Alert', {timeOut: 7000});
            }
        }
    });
    }else{
        $('#bill_name_color_valid').prop('hidden',false)
    }
   
    
    
    
});


//setting color or quntity size in the color/size input...........................
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
            color_id =$(this).data('valu')
           // colored=$(this).data('colored')
    
        
    
    //use the len valiale to detect whether the color contains item size if len == 0  means the item has color only with no size contained
    if(len ==0){
        let idadi=0
    
    
        $('.'+$(this).data('class')).each(function(){
            // pos=$(`#coloredone${$(this).data('valu')}`).data('pos')
    
     if($(this).val()!='' && Number($(this).val())>0){
        if($(this).data('jum')){
          idadi+=Number($(this).val())*uwiano
          tot+=Number($(this).val())*uwiano
        }else{
          idadi+=Number($(this).val())
          tot+=Number($(this).val())
        }
        } 
    
    })
        
        
    
    
          if(idadi>0){
    
    
             //oject to store the color whose qty is set
                let  lr ={
                    'idadi':idadi,
                    'color':color_id
    
                }
                colarr.push(lr)
    
    
               colors+=1
               //show the success checkmark if color quantity is set.................
                $($(this).data('show')).fadeIn(200)
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
                                disp+=`+<span class="smallFont">${vipimo}:</span><span class="text-primary">${idadi%uwiano}</span>`
                              }
                            }
                            
                          disp+=`</span> 
                        
                                    </div>
                                  </div> 
                                         `
                        }else{
                            $($(this).data('show')).fadeOut(100)
    
                        }
            }else{
    
                //if len !=0 then the color contains size........//
                let qty=0,qty_for_color=0
                $(this).children().find('input[type="number"]').each(function(){
                     qty +=Number($(this).val())
                })
               
                if(qty>0){
                    colors+=1
                    
                    $($(this).data('show')).fadeIn(200) //show the green  checkmark  if qty is set to the input ...............................//
    
    
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
                              let szqty=0
                            $('.'+$(this).data('class')).each(function(){
                                // pos=$(`#coloredone${$(this).data('valu')}`).data('pos')
                    
                             if($(this).val()!='' && Number($(this).val())>0){
                              if($(this).data('jum')){
                                szqty+=Number($(this).val())*uwiano
                                tot+=Number($(this).val())*uwiano
                                qty_for_color+=Number($(this).val())*uwiano
                              }else{
                                szqty+=Number($(this).val())
                                tot+=Number($(this).val())
                                qty_for_color+=Number($(this).val())
    
                             }
                             }
                                    })
    
                            if(szqty>0){
    
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
                            }
                          
                            //store the size qty set .....................//
                            let  szd= {
                                'idadi':szqty,
                                'size':$(this).data('valued'),
                                'color':color_id
                            }
    
                            sizearr.push(szd)
                    
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
                   $(`#qty${pos}`).prop('disabled',true)
               }else{
                   $(`#qty${pos}`).prop('disabled',true)
                   
               }
       }else{
           $(`#popColored${pos}`).fadeOut(100)
           $(`#colored_items${pos}`).data('color',[])
           $(`#colored_items${pos}`).data('size',[])
           if(tr.data('jum')){
            $(`#qty${pos}`).prop('disabled',false)
        }else{
            $(`#qty${pos}`).prop('disabled',false)
            
        }
    
       }
    
       //if retail and whole sale ratio is not 1(Retail & wholesale involved) switch to the retail and set the quantity.....//
       let wiana=Number($(this).data('uwiano'))
       if(wiana>1){
          
    
           $(`.jum-panel${pos}`).hide()
           $(`.rej-panel${pos}`).show()
    
           $(`#bill_item${pos}`).data('jum',false)
    
           $(`.idadi-units_disp${pos}`).text($(`#qty${pos}`).data('sm'))
          $(`.units_disp${pos}`).text(`@${$(`#qty${pos}`).data('sm')}`)
    
          if(tot>0){
        $(`#qty${pos}`).val(tot)
        $(`#dropbtn${pos}`).prop('disabled',true) 
          }else{
        $(`#qty${pos}`).val('')
        $(`#dropbtn${pos}`).prop('disabled',false) 
    
          }
    
       }else{
           if(tot>0){
          
         $(`#qty${pos}`).val(tot)
         $(`#dropbtn${pos}`).prop('disabled',true) 
    
           }else{
         $(`#qty${pos}`).val('')
         $(`#dropbtn${pos}`).prop('disabled',false) 
               
           }
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
        <div class="input-group">
          <input
          placeholder="${lang('Andika Jina la Bidhaa','Write Item name')} "
          style="min-width: 210px;"
          type="text" 
          data-pos=${pos}
          id = "search${pos}"
          data-itm = 0
          class="form-control border0 smallFont muhimu-b-kununua-zilizopo suggest-prompt${pos} suggest-prompt input-data latoFont" />
          <button class="btn btn-secondary btn-sm smallFont latoFont input-grouup-append" data-toggle="modal" data-target="#add-products" >
            +${lang('Mpya','New')}
           </button>
        </div>
          <ul class="masaki masaki${pos}" data-hiarch=${pos} style="min-width: 350px;z-index:999999;max-height:250px;overflow-y:scroll"></ul>

        </div>

        <div class="bill-mauzo-namna item-attr${pos} " style="display: none;">
                        <div class="px-1 pt-1 classic_div row">
                            <label for="date" class="col-5" style="font-size: 11px;font-weight:bold;color:rgb(138, 26, 26)">
                                Expire Date:
                            </label>
    
                            <span class="col-7">
                           <input type="date" class="expdate" id="expire${pos}" style="font-size: 11px;border:0;width:100%">  
                        </span>
                        </div>
         </div>
        
    </td>

    <td class="p-1">
        <!-- QUANTITY -->
        <div class="input-group" style="max-width: 190px;">
            <!-- UNITS -->
            <select name="qty_unit${pos}" style="max-width: 80px;" id="unit_sel${pos}" class="input-group-prepend made-input latoFont smallerFont">
                <option value=0 ></option>
            </select>
        <input type="number" data-sm=0 id="qty${pos}" data-onshelf=0 data-pos=${pos} class="form-control sh_qty border0 smallFont" >

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

        <!-- Incase user is not sure of qty.......... -->
                     <div class="cn_uhakika  latoFont">
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input notsureCheck" data-pos=${pos} id="sina_uhakika${pos}" style="cursor: pointer !important;" >
                        <label class="custom-control-label" for="sina_uhakika${pos}" style="cursor: pointer !important;" >
                          ${lang('Sina uhakika','Not sure')}
                        </label>
                      </div>

                      <div class="latoFont smallerFont brown" id="notsureAlert${pos}" data-pos=${pos} style="display: none;" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                          <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                         </svg>
                          
                          ${lang('Weka idadi ya mwisho unayoitegemea','Set the expected top quantity')}
                      </div>

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

//WHEN USER CLICK NOT SURE 
$('body').on('click','.notsureCheck',function(){
    let pos = $(this).data('pos'),
       idadi = Number($(`#qty${pos}`).val()) || 0,
       sure = $(this).prop('checked')


       if(idadi<=0 && sure){
           //show alert for most topexpected quantity if is not set.....................
           $(`#notsureAlert${pos}`).fadeIn(100)
           redborder(`#qty${pos}`)
       }else{
           $(`#notsureAlert${pos}`).fadeOut(100)
       }
})


$('body').on('keyup','.sh_qty',function(){
   let pos = $(this).data('pos'),
       qty= Number($(this).val()) || 0
       if(qty>0){
           $(`#notsureAlert${pos}`).fadeOut(100)
       }else{
           if($(`#sina_uhakika${pos}`).prop('checked')){
             $(`#notsureAlert${pos}`).fadeIn(100)  
           }
       }
    
})



//SAVE PRODUCTION PRODUCTS DATA...........................................///
$('#saveReduceAdj').unbind('submit').submit(function (e) {
    e.preventDefault() 
    let url=$(this).attr("action"),
      //  edit=$(this).data("edit"),
       // bill=$(this).data("bill"),
        csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
       
        pr=Number($(this).data('value')) || 0
        add = Number($(this).data('add')) || 0
        itm_dt=[],zer=0,kuzid=0,
        allColored = [],
        allSized = []

        endDate = $('#complete_date').val()
        kamili = Number($('#uzalishaji_kamili').prop('checked'))
        endelevu = Number($('#uzalishaji_endelevu').prop('checked'))
        notSure = 0

        if(kamili){
            endDate = moment(endDate).format()
        }

    $('.sh_qty').each(function(){
      let pos=$(this).data('pos'),
          notsure = Number($(`#sina_uhakika${pos}`).prop('checked'))
          notSure += notsure,
          qtyyy = Number($(this).val()) || 0,
          expire = $(`#expire${pos}`).val()


        if(qtyyy == 0 ){
            zer += 1
            $(this).addClass('redborder')
        }else{
            if(Number($(`#search${pos}`).data('itm'))>0){
                let uwiano=Number($(`#unit_sel${pos}`).find('option:selected').val()),
                    idadi = Number($(this).val()) || 0,
                    onsh = Number($(this).data('onshelf')),
                
            //Take the color if color/size set qty............//
                sized=[],colored=[],
                color=$(`#colored_items${pos}`).data('color'),
                size= $(`#colored_items${pos}`).data('size')

                //   if(idadi*uwiano >onsh  ){
                //       $(this).addClass('redborder')
                //       kuzid+=1
                //   }

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
                    expire:expire,
                    notsure:notsure
                } 
                
                itm_dt.push(itn)
            }else{
                redborder(`#search${pos}`)
            }
            

            }


    })

 

let data = {
    data:{
        pr:pr,
        date:endDate,
        kamili:kamili,
        notSure:notSure,
        itm:JSON.stringify(itm_dt),
        csrfmiddlewaretoken:csrfToken, 

    },
    url:url
}
   
    // if (Number(to)>0){
        
        if(zer==0 || kamili){

            if((kamili && endDate!='')|| endelevu){
                saveDtAdj(data)
                

            }else{
              if(kamili && endDate == ''){
                  redborder('#complete_date')
              }

              if(!(kamili || endelevu )){
                  redborder('#prod_stage')
              }
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
            toastr.success(lang(respo.msg_swa,respo.msg_eng), 'Success Alert', {timeOut: 7000});
             
                 location.reload()
            
          
        }else{
            toastr.error(lang(respo.msg_swa,respo.msg_eng), 'Error Alert', {timeOut: 7000});

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
            toastr.success(lang(respo.msg_swa,respo.msg_eng), 'Success Alert', {timeOut: 7000});
            if(Boolean(data.data.new)){
             location.replace(`/stoku/bidhaaoda`)
            }else{
             location.replace(`/stoku/receiveNote`)
                
            }
          
        }else{
            toastr.error(lang(respo.msg_swa,respo.msg_eng), 'Error Alert', {timeOut: 7000});

        }
        $("#loadMe").modal('hide');
        hideLoading()
        
    }
});
}

