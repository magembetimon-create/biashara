var index=-1;	
 $('body').on('keyup','#fetch_item', function(){
 // Clear the ul   
 let itmsi = StoreNje.data,
     itms=itmsi
//  console.log(itms)


 let pos= $(this).data('pos')
 $(`.masaki15_`).empty();
     
 // Cache the search term
 var search = $(this).val();
 
 // Search regular expression
 var regrex = /[^a-z0-9 ]/gi;
 search = new RegExp(search.replace(regrex,''), 'i');
     var lin;
 
 // Loop through the array
 for(var i in itms ){
 if(itms[i].bidhaaN.match(search)){
     var li=`<li data-value=${itms[i].id} data-sup=${itms[i].msambaji_id} data-pimo_jum=${itms[i].vipimoJum} data-pimo_reja=${itms[i].vipimo} data-uwiano=${itms[i].uwiano} data-name="${ itms[i].bidhaaN}" data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${$(this).data('pos')}>
 
     <span  class='suggest-name ' data-value=${itms[i].id} data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${$(this).data('pos')} >${ itms[i].bidhaaN} </span> 
    <a class="d-block" style='padding:7px'>
        <span class='suggest-description text-danger font-weight-bold' style='float:right'>${titleCase(itms[i].curenci)}. ${parseInt(itms[i].Bei_kuuza).toLocaleString()}/=<br/> <span class="text-primary"> @${itms[i].vipimo}</span> </span>
     
        <span class='suggest-description' style='float:left'>${itms[i].ainaN }</span>
        <span class='suggest-description' style='color:#47476b'> (${itms[i].vipimo} . ${parseInt(itms[i].idadi)}) </span>
     </a>
     <a class="d-block">
     <label class="text-primary pl-2 robotoFont" style="font-size:11px">
     <svg width="1em" height="1.0625em" viewBox="0 0 16 17" class="bi bi-compass mx-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path fill-rule="evenodd" d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
         <path d="M6.94 7.44l4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
     </svg>
     
     ${itms[i].msambaji_id__jina}</label>
     
     </a>
    
     
 
    </li>`;
    
    $(`.masaki15_`).append(li);
 }
 }
 
 if($(this).val().length > 0){
     $(`.masaki15_`).show();
 }else{
     $(`.masaki15_`).hide();
 
 }
 
 
 });

 $('body').on({keyup: function(e){	
    if(e.which == 38){
        // Down arrow
        index--;
        // Check that we've not tried to select before the first item
        if(index < 0){
            index = 0;		
                $('.masaki15_ li').eq(index).addClass('active');
        }
    
        // Set a variable to show that we've done some keyboard navigation
      var  m = true;
    }else if(e.which == 40){
        // Up arrow
        index++;
        //alert('clicked')
    
        // Check that index is not beyond the last item
        if(index > $('.masaki15_ li').length - 1){
            index = $('.masaki15_ li').length-1;
        }
    
        // Set a variable to show that we've done some keyboard navigation
        m = true;
    }
    
    // Check we've done keyboard navigation
    if(m){
        // Remove the active class
        $('.masaki15_ li.active').removeClass('active');
        $('.masaki15_ li').eq(index).addClass('active');
    } 
    
    if(e.which == 27){
        // Esc key
        $('.masaki15_').hide();
    }
    
    
    if(e.which == 38 || e.which == 40 || e.which == 13){
        e.preventDefault();
    }
        }	
  });

       //trigger an event when user click the list.............................................// 
 $('body').off('click','.suggest-holderI .masaki15_ li').on('click','.suggest-holderI .masaki15_ li', function(){
        // $('.suggest-prompt').val($(this).children('.suggest-name').text() );
         let itm_val = $(this).data('value')
             placedataI(itm_val)
});




function placedataI(itm_val){
      let items=StoreNje.data,
          itm=items.find(x=>x.id==itm_val)
          

       let   prod_val = itm.bidhaa,
            name =  itm.bidhaaN,
            pj =  itm.vipimoJum,
            pr =  itm.vipimo,
            uwiano = Number( itm.uwiano),
            sup= itm.msambaji_id


            
                $('.idadi_rejareja').prop('hidden',uwiano==1)
           
    
            $('#idadi_jum_jum').val('')
            $('#idadi_rejareja').val('')
    
               $('#fetch_item').data('val',itm_val)
                 $('#fetch_item').val(name)
                 $('#fetch_item').data('uwiano',uwiano)
                 $('#fetch_item').data('pj',pj)
                 $('#fetch_item').data('pr',pr)
                
                 $('#vipimo_idadi_jum_').text(`(${pj})`)
                 $('#vipimo_idadi_reja_').text(`(${pr})`)
                 $('#produ_sambazaji_').selectpicker('val',sup)
    
                 showimg(prod_val)
             $('.suggest-holderI ul').hide();
    
    
    
             color_sizei(prod_val,stokucolor.state,stokusize.state,uwiano,pr,pj) 
          
          
     //   placedata(pos,itm_val)
}

    
    $('body').on('click', function(e) {
        if (!$(e.target).closest('.masaki15_ li, .suggest-holder input').length) {
            $('.masaki15_').hide();
        };
    });
   

    

//Place Image to its appropriate.................................//
function showimg(prod){
    let imge=ItemImg.state,coount=0,im_sr='',trp=''
                
            for(let im in imge){
                
                if(imge[im].bidhaa==prod) {

                 coount+=1;
                 im_sr=`<img src="/media/${imge[im].picha__picha}" height="80"  style="cursor:pointer">`
                }
            }
            
            if(coount>0){
                trp+=im_sr
            }else{
                 trp+=`       
                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                 <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                 <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
               </svg>`
            }

            


            $(`#imgplaceI`).html(trp)
}


function color_sizei(itm,color,size,uwiano,pr,pj){
    const colr = color.filter(x=>x.prod === itm )
    $('#idadi_jum_jum').data('color',0)
    $('#idadi_jum_jum').prop('readonly',false)
    $('#idadi_rejareja').prop('readonly',false)

    if(colr.length > 0 ){
        $('#modal_color4').modal('show')  
        $('#idadi_jum_jum').data('color',1)
            $('#idadi_jum_jum').prop('readonly',true)
            $('#idadi_rejareja').prop('readonly',true)

            $('#idadi_jum_jum').val('')
            $('#idadi_rejareja').val('')
    }

    let col=``

    colr.forEach(cl => {
        let pos=cl.id,cc=cl.color_code,cv=cl.color_name,ot=cl.nick_name
         
        const sz = size.filter(s=>s.colr===cl.id)

        col+=`
        <div class="column mb-2" id="color_${pos}" data-val=${cl.id} data-code=${cc} data-other="${ot}" data-pos=${pos}  data-color=${cv}>
        <div class="position-absolute showingpop24 p-3 whiteBg" id="ona_rang0${pos}" data-add=true data-showing="#ona_rang0"
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
   
   
     <p class="d-flex">
       <button type="button" class="mr-2 rangi-editing" 
       data-color=0
       data-color_name='' 
       data-idadi_jum=0
       data-valued=0 
       data-toggle="modal" data-target="#kuweka-rangi-model" style="height: 25px;width:40px;color:${cc};
           background:${cc};
           cursor:pointer;
           border-radius:3px;
           -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
           box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
           border:0;

       ">
          color
    </button>   
    <span class="smallerFont">${cv}</span>

    <!-- REMOVE COLOR BUTTON...............................  -->
  
    <button class="btn btn-default btn-sm  latofont" style="color:black;margin-right:-12px" onclick="$('#color_${pos}').remove();set_idadi()">
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
           <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
       </svg>
    </button>


    </p>
     <div class="coloredscene_" id="coloredscene${pos}" data-val=${cl.id} data-color=${cv} data-code=${cc} data-other="${ot}" data-pos=${pos} >`
        
    if(sz.length>0){
        sz.forEach(s=>{
            let pos=s.id,sn=s.size
            col+=`
                <div class="sizedscene_ text-center border-top mt-2 pt-2" id="SIZE_${pos}" data-val=${s.id} data-size="${sn}"  data-pos=${pos}>
                    <div class="sz_name" data-size="${sn}" >
                            <label class="text-primary latoFont">Size</label>: <label class="text-danger">${sn}</label>

                            <!-- REMOVE COLOR BUTTON...............................  -->
                            
                            <button class="btn btn-default btn-sm  latofont" style="margin-right:-12px" onclick="$('#SIZE_${pos}').remove();set_idadi()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>

                            <div class="row input_jum">
                                <div class="col-4">
                                     <label for="input_jum" class="smallerFont text-primary" >${pj}</label>
                                </div>
                                <div class="col-8">
                                   <input type="number" class="form-control idadi_jum_ smallerFont">
                                </div>  
                            </div>`
                           
                            if(uwiano>1){
                             col+= `<div class="row input_rej py-2">
                                        <div class="col-4">
                                            <label for="input_rej" class="smallerFont text-primary" >${pr}</label>
                                          </div>
                                        <div class="col-8">
                                            <input type="number" class="form-control idadi_reja_ smallerFont">
                                        </div>  
                                    </div> 
                                 `
                            }

                   col+=`</div>
                   </div>
                `
        })
        

    }else{
        col+=`<div class="row input_jum">
                <div class="col-4">
                  <label for="input_jum" class="smallerFont text-primary" >${pj}</label>
                </div>
                <div class="col-8">
                   <input type="number" class="form-control idadi_jum_ smallerFont">
                </div>  
           </div>`


         if(uwiano>1){
               col+= ` <div class="row input_rej py-2">
                            <div class="col-4">
                                 <label for="input_rej" class="smallerFont text-primary" >${pr}</label>
                            </div>
                            <div class="col-8">
                               <input type="number" class="form-control idadi_reja_ smallerFont">
                            </div>  
                        </div>
                    `
         }
    }
     
     


        col+=`</div>
         
         <div class="smallerFont text-center border-top mt-3">
            <div class=" addSizing" style="display: none;" >
             
            <div class="form-group">
                <label for="">${lang('Jina la Size','Size Name')}</label>
                <input type="text" name="" id="sizen_${pos}" class="form-control" placeholder="" aria-describedby="helpId">
                <small id="helpIdIn${pos}" hidden class="text-muted text-danger">${lang('Andika Jina la size','Write size Name')}</small>
              </div>

              <button class="btn btn-primary smallerFont latoFont"
              onclick="
                  let pos = $('#coloredscene${pos}').children('.sizedscene_').last().data('pos') || 0,
                      size = $('#sizen_${pos}').val();
                      
                      if(size!=''){
                          if(Number(pos)==0){
                             $('#coloredscene${pos}').html(adding_size(size,pos+1))
                          }else{
                              $('#coloredscene${pos}').append(adding_size(size,pos+1)) 
                          }

                          $('#sizen_${pos}').val('')

                          $('#helpIdIn${pos}').prop('hidden',true)

                          if(Number($('#submit-bill-colorI').data('jum_click'))){
                              $('.input_rej').hide()
                          }
                      }else{
                          $('#helpIdIn${pos}').prop('hidden',false)
                      }
              "
              >
                ${lang('Weka size','Add size')}
              </button>

              <hr>
            </div>
           
            

            <button onclick="$(this).siblings('.addSizing').toggle(300)" class="btn btn-default btn-sm latoFont text-primary">
                ${lang('Weka Size','Add Size')}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
               <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
            </button>                 
         </div>
     </div>        

   


      <div class="showingpop241 "  data-showing="#ona_rang0${pos}" data-color=false 
       style="height: 25px;width:40px;
           background-color:${cc};
           cursor:pointer;
           -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
           box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
           ">
     
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
    });

    $('#color_alena').html(col)
}