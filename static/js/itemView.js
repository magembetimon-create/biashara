
  var  ItemPicha=[],ItemSize = [],ITMVAL = 0
  

  function getItemData(itm,value){
 
    // $.ajax({
    //   type: "POST", // if you choose to use a get, could be a post
    //     url: "/getItemData",
    //   data: {csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),i:itm,value:value},
    // }).done(function(data){

    //   // console.log(data)
      
     

    //   //  console.log({data:data.picha,val:val,itm:itm,value:value})
    // })

    const dataS = {
      data:{
        i:itm,value:value
      },
      url:"/getItemData"
    },
    sendIt = GETREQUEST(dataS)
    sendIt.then(data=>{
      
      ItemPicha = data.picha
      ItemSize= data.size
      let val = $('#penye-rangi').children('.redbox').data('rangi') || $('#penye-rangi').children('.the_identify').first().data('rangi') || 0
      placeImg(data.picha,val)
      placeSize(data.size,val)
    })
}


//FUNCTION YA KUONESHA  SIZE..................................//
function  placeSize(size,val){
  
  const szn = size.filter(s=>s.color===val)
  let sz = ''
  if(szn.length>0){
    
    szn.forEach(s => {
      sz+=`
      <span data-toggle="modal" id="siz${s.id}" data-target="#kuweka-size-model" data-idadi=${s.idadi} data-val=${s.id} data-color=${s.color} data-jina="${s.size_name}" class="text-danger border item_sized_ btn btn-default mx-1 px-2 py-0" >
        ${s.size_name.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}
      </span>
      `
    });
    
  }else{
    sz+=`<span class="text-primary btn btn-default px-2 py-0" >${lang('Hakuna','None')}</span>`
  }
  
  // $('#penye_size').html(sz)
  
}

//FUNCTION YA KUONESHA  PICHA..................................//

function  placeImg(imgs,val){

      const IMGS = imgs?.filter(r=>Number(r.rangi)===Number(val)),
            PICSIZE = (!val?imgs:IMGS).reduce((a,b)=>a+Number(b.size),0)  
            
            

      let img_div='',imgs_panel='',many=0,imgdots='',
          owner = Number($('#penye-picha').data('owner')) || 0
      
      for (var im in imgs.reverse()) {
          if(Number(imgs[im].rangi)==Number(val) || !val ){
              many+=1
  
             img_div+=`
             <div class="mySlides  " data-id=${imgs[im].id}  style="padding:0" >
             
             `
              if(owner){
               img_div+=`
               <form action="/stoku/ondoaPicha"  class="Ondoa_picha" data-valued=${imgs[im].id} data-item=${imgs[im].bidhaa_id} method="POST">  
                <h6 style="text-align:right "  >
                <button type="submit" title="${lang('Ondoa','remove')}" class="btn btn-light btn-sm robotoFont smallerFont">
                   
                <svg width="25" height="25" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>                 </button>
                </h6>
             </form>
             
             `
              }
             
            img_div+=   ` 
            <div class="text-center" style="width:100%;height:100%">
             
             <img src="${imgs[im].img}" class="clasic_div"  style="max-height:100%;max-width:100%">
           
           </div>
           </div>

             `
  
             imgs_panel+=`
                      <div class="column px-1">
                          <img class="demo cursor" src="${imgs[im].img}" style="max-width:50px;max-height:50px" onclick="currentSlide(${many})" alt="Item Img">
                      </div>
             `

             imgdots+=`<span class="dot demo" onclick="currentSlide(${many})"></span>`
          }}
  
  if(many>0){
       const img_div_sum=img_div + ((IMGS.length>1 && val) || (many>1 && !val) ?`<a class="prev" onclick="plusSlides(-1)">❮</a><a class="next" onclick="plusSlides(1)">❯</a>`:''),
              imgs_panel_sum= `<div class="${window.innerWidth<=766?'text-center':'row mt-2'} ${many<=1?'d-none':''}"> ${window.innerWidth<=766?imgdots:imgs_panel} </div>` ,
              img_show =  img_div_sum +  imgs_panel_sum
           
      
      $('#penye-picha').html(img_show)
  
      
        showSlides(1);
     
      
  
  }else{
    $('#penye-picha').html(`<svg width="100%"  viewBox="0 0 16 16" class="bi bi-card-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M14.5 3h-13a.5.5 0 0 0-.5.5v9c0 .013 0 .027.002.04V12l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15 9.499V3.5a.5.5 0 0 0-.5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm4.502 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
   </svg> `)
  }

  $('#used-memory').text(Number(PICSIZE/1024).toFixed(2) + 'KB') 

}
       

$('body').on('click','.item_sized_',function(){
  $(this).siblings().removeClass('bluebox')
  $(this).addClass('bluebox')
  place_idadi()
  let qty =$('.bluebox').data('qty'),
  uwiano = Number($('.bluebox').data('uwiano')) || 1
  $('#item_idadi').val(Number(qty)/Number(uwiano))
  $('#price_select').val(uwiano)
})

$('body').on('mouseenter','.the_identify',function(){
  let other = $(this).data('other') || ''
  if(other != 'None' ) {
    other =  `<small class="text-primary"> (${other.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")})</small>`
  }else{
    other = ''
  }

  $('#hold-color-id').val($(this).data('val'));
  $('#color_text').html($(this).attr('title')+other);
  $(this).siblings('.the_identify').removeClass('redbox');
  $(this).addClass('redbox')
  val = $(this).data('rangi')
  placeImg(ItemPicha,val)
  
  let size_length = $(`.item_sized_${val}`).length
  if(size_length>0){
        $('#hakuna_size').hide()
      }else{
        $('#hakuna_size').show()
      }
  $(`.item_sized_`).hide()
  $(`.item_sized_${val}`).fadeIn()

  $('#penye_size').children(`.item_sized_`).removeClass('bluebox')
  $('#penye_size').children(`.item_sized_${val}`).first().addClass('bluebox')
  let uwiano = Number($('.bluebox').data('uwiano')) || Number($('.redbox').data('uwiano')) || 1
          $('#price_select').val(uwiano)
  place_idadi() 

  let qty =$('.bluebox').data('qty') || $('.redbox').data('qty')
                $('#item_idadi').val(Number(qty)/Number(uwiano))
                $('#price_select').val(uwiano)
              


              
                

})

//Sum quantities function
  function sum_q(bei){
    let rangi_c = 0,
        size_c = 0,
        tr = '',
        sum= 0
        
    
  rangi_c = $('#penye-rangi .the_identify').length
  size_c = $('#penye_size .item_sized_').length
   
  if(rangi_c>0){
    $('.the_identify').each(function(){

     
      if(Number($(this).data('qty'))>0){
          
         var sized = $(`.item_sized_${$(this).data('rangi')}`).length
            //Incase thecolor involves size......... 
          if(sized>0){

            let rangi = $(this).data('jina')

            $(`.item_sized_${$(this).data('rangi')}`).each(function(){
              if(Number($(this).data('qty'))){
                 let r = bei.filter(x=>x.idadi===$(this).data('uwiano'))[0]
               
                sum+=r.bei*Number($(this).data('qty'))/r.idadi
            tr+=`<tr class="smallFont" > 
              <td class="text-capitalize" >${rangi.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td> 
              
               <td  >${$(this).data('jina')}</td>
               <td>${r.jina.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
               <td>${Number($(this).data('qty'))/r.idadi}</td>
               <td>${r.bei.toLocaleString()}</td>
               <td>${(r.bei*Number($(this).data('qty'))/Number($(this).data('uwiano'))).toLocaleString()}</td>
               `
                   tr+=`</tr>` 
              }
              
            
            
            })

            //else if no size Involved.....................................//
          }else{
            let r = bei.filter(x=>x.idadi===$(this).data('uwiano'))[0]
           
                
                
                sum+=r.bei*Number($(this).data('qty'))/r.idadi
            tr+=`<tr class="smallFont" > 
              <td class="text-capitalize" >${$(this).data('jina').replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>`  
              if(size_c>0){
                tr+=`<td>--</td>`  
              }
               tr+=`
               <td>${r.jina.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
               <td>${Number($(this).data('qty'))/r.idadi}</td>
               <td>${r.bei.toLocaleString()}</td>
               <td>${(r.bei*Number($(this).data('qty'))/Number($(this).data('uwiano'))).toLocaleString()}</td>`

               if(Number($('#item_idadi').data('timely'))){
                 let muda = Number($('#item_idadi').data('muda'))
                      tr+=` <td>${muda}</td>
                            <td>${(muda*r.bei*Number($(this).data('qty'))/Number($(this).data('uwiano'))).toLocaleString()}</td>
                      `
               }
               

            
            tr+=`</tr>` 
          }
      }
    })

    $('#q_cart_sumary').html(tr)

    //If no color or size Involed....................
  }else{


    setTimeout(setBei(),1000)

    function setBei(){
      let bei = Number($('#price_select').find('option:selected').data('bei')),
        wiano = Number($('#price_select').find('option:selected').data('idadi')),
        jina = $('#price_select').find('option:selected').data('jina'),
        idadi= Number($('#item_idadi').val())

    sum = bei*idadi

    
  
    const se_i = document.getElementById('taken_qty');
    animateValue(se_i, 0, parseInt(idadi), 100);

    const se_p = document.getElementById('perPrice');
    animateValue(se_p, 0, parseInt(bei), 500);
      $('#per_price').text('/'+jina)
      $('#Measure_val').text(jina)
    }
    

  }

  if(Number($('#item_idadi').data('timely'))){
    sum = Number($('#item_idadi').data('muda')) * sum
  }


  const tot_i = document.getElementById('total_bei');
   animateValue(tot_i, 0, parseInt(sum), 700);

   $('#total_bei').data('bei',sum)

  }


//SEARCH ITEMTO MATCH.......................................// 
var index=-1;	
 $('body').on('keyup','#duka_item', function(){
 // Clear the ul   
 const itms = Items.state,
       pos= $(this).data('pos')
 $(`.masaki15__`).empty();
     
 // Cache the search term
 var search = $(this).val();
 
 // Search regular expression
 var regrex = /[^a-z0-9 ]/gi;
 search = new RegExp(search.replace(regrex,''), 'i');
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
  var li=`<li data-value=${itm.id} data-valu=${itm.bidhaa_id} data-prod=${itm.bidhaa_id} data-pos=${pos}>

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
  
  

  </li>`;
  
  $(`.masaki15__`).append(li);
}
})
 
 if($(this).val().length > 0){
     $(`.masaki15__`).show();
 }else{
     $(`.masaki15__`).hide();
 
 }
 
 
 });

 $('body').on({keyup: function(e){	
    if(e.which == 38){
        // Down arrow
        index--;
        // Check that we've not tried to select before the first item
        if(index < 0){
            index = 0;		
                $('.masaki15__ li').eq(index).addClass('active');
        }
    
        // Set a variable to show that we've done some keyboard navigation
      var  m = true;
    }else if(e.which == 40){
        // Up arrow
        index++;
        //alert('clicked')
    
        // Check that index is not beyond the last item
        if(index > $('.masaki15__ li').length - 1){
            index = $('.masaki15__ li').length-1;
        }
    
        // Set a variable to show that we've done some keyboard navigation
        m = true;
    }
    
    // Check we've done keyboard navigation
    if(m){
        // Remove the active class
        $('.masaki15__ li.active').removeClass('active');
        $('.masaki15__ li').eq(index).addClass('active');
    } 
    
    if(e.which == 27){
        // Esc key
        $('.masaki15__').hide();
    }
    
    
    if(e.which == 38 || e.which == 40 || e.which == 13){
        e.preventDefault();
    }
        }	
  });

       //trigger an event when user click the list.............................................// 
 $('body').off('click','.suggest-holder .masaki15__ li').on('click','.suggest-holder .masaki15__ li', function(){
        // $('.suggest-prompt').val($(this).children('.suggest-name').text() );
         let itm_val = $(this).data('value')
              placeItmData(itm_val)
  
});


    
function   placeItmData(itm_val){

     $('.masaki15__').hide()
     let items=Items.data,
          itm=items.find(x=>x.id==itm_val)
          

       let   prod_val = itm.bidhaa_id,
            name =  itm.bidhaaN
            aina = itm.aina

            $('#duka_item').val(name)
            $('#duka_item').data('itm',itm_val)
            $('#unitName').val(itm.vipimo)
            $('#per_unit').val(`/${itm.vipimo}`)
            $('#Bei_kwa_kuuza_d').val(parseInt(itm.Bei_kuuza))

            $('#duka_item_aina').selectpicker('val',aina)

}


var slideIndex = 1;


$('#penye-picha').on('touchstart', function(event) {
  const xClick = event.originalEvent.touches[0].pageX;

  $(this).on('touchmove', function(event) {
    const xMove = event.originalEvent.touches[0].pageX;
    const sensitivityInPx = 8;

    if (Math.floor(xClick - xMove) > sensitivityInPx) {
      plusSlides(1);
      $(this).off('touchmove');
    } 
    else if (Math.floor(xClick - xMove) < -sensitivityInPx) {
      plusSlides(-1);
      $(this).off('touchmove');
    }
  });
});



function plusSlides(n) {
  showSlides(slideIndex += n);
}


function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {

  let i,
   slides = document.getElementsByClassName("mySlides"),
   dots = window.innerWidth>766?document.getElementsByClassName("demo"):document.getElementsByClassName("dot"),
   active =  window.innerWidth>766?'active':'activedot'
  if (n > slides.length || n==1) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(active, "");
  }


  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += active;
}


function UserItemSave(it){
  const {itm,svd} = it,
  dta = {data:{
    itm:itm,
    svd:svd
  },
  url:'/UserSaveItem'

},
respo= POSTREQUEST(dta)

respo.then(data=>{
  if(data.success){
    if(data.svd){
        toastr.success(lang(data.msg_swa,data.msg_eng), lang('Imefanikiwa','Success'), {timeOut: 2000});
    }else{
        toastr.info(lang(data.msg_swa,data.msg_eng), lang('Imefanikiwa','Success'), {timeOut: 2000});

    }
   
    $('#saveItemd svg').attr('fill',`${data.svd?'brown':'none'}`)

  }else{
    toastr.error(lang(data.msg_swa,data.msg_eng), lang('Haikufanikiwa','Error'), {timeOut: 2000});

}
})

}






