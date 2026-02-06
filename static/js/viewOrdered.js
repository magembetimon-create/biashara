

 //SEARCH ITEMTO MATCH.......................................// 
 var index=-1;	
 $('body').on('keyup','#duka_item', function(){
 // Clear the ul   
 const itms=Items.state 
     

    

 let pos= $(this).data('pos')
 $(`.masaki15__`).empty();
     
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
        var li=`<li data-value=${itms[i].id} data-sup=${itms[i].msambaji_id} data-pimo_jum=${itms[i].bidhaa__vipimo_jum} data-pimo_reja=${itms[i].bidhaa__vipimo} data-uwiano=${itms[i].bidhaa__idadi_jum} data-name="${ itms[i].bidhaa__bidhaa_jina}" data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${$(this).data('pos')}>
 
     <span  class='suggest-name ' data-value=${itms[i].id} data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${$(this).data('pos')} >${ itms[i].bidhaa__bidhaa_jina} </span> 
    <a class="d-block" style='padding:7px'>
        <span class='suggest-description text-danger font-weight-bold' style='float:right'>${titleCase(itms[i].curenci)}. ${parseInt(itms[i].Bei_kuuza).toLocaleString()}/=<br/> <span class="text-primary"> @${itms[i].bidhaa__vipimo}</span> </span>
     
        <span class='suggest-description' style='float:left'>${itms[i].bidhaa__bidhaa_aina_id__aina }</span>
        <span class='suggest-description' style='color:#47476b'> (${itms[i].bidhaa__vipimo} . ${parseInt(itms[i].idadi)}) </span>
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
    
    $(`.masaki15__`).append(li);
 }
 }
 
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
          

       let   prod_val = itm.bidhaa,
            name =  itm.bidhaa__bidhaa_jina
            aina = itm.bidhaa__bidhaa_aina_id

            $('#duka_item').val(name)
            $('#duka_item').data('itm',itm_val)
            $('#unitName').val(itm.bidhaa__vipimo)
            $('#per_unit').val(`/${itm.bidhaa__vipimo}`)
            $('#Bei_kwa_kuuza_d').val(parseInt(itm.Bei_kuuza))

            $('#duka_item_aina').selectpicker('val',aina)

}

$('#item_match_form').unbind('submit').submit(function (e) {
    e.preventDefault()
    let itm = $(this).data('item'),       
        match = $('#duka_item').data('itm') || 0,
       
        a_match = Number($('#duka_item_aina').val()),
        newItm = Number($('#Item_jipya').prop('checked')),
        newCat = Number($('#category_jipya').prop('checked')),
        useUnit = Number($('#useUnitRadio').prop('checked')) || 0,
        newUnit = Number($('#newUserUnit').prop('checked')) || 0,
        UnitName =  $('#unitName').val(),
        newRatio =  Number($('#uwianoQty1').val()) || 0,
        salesP =  Number($('#Bei_kwa_kuuza_d').val()) ||  0,
        material = Number($('#production_material').prop('checked')) ||  0,

        data={
            data:{
                itm:itm,
                match:match,
                a_match:a_match,
                newItm:newItm,
                newCat:newCat,
                useUnit:useUnit,
                newUnit:newUnit,
                UnitName:UnitName,
                newRatio:newRatio,
                salesP:salesP,
                material:material,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
            },
            url:$(this).attr('action'),
           
        }

        if(itm){
            if(match>0 || newItm ){
                if(a_match>0 || newCat){
                    if(useUnit || (newUnit && newRatio>0 && UnitName!='' && (salesP || material)  )){
                       
                        submitOder(data)

                    }else{
                        if(!(useUnit || newUnit)){
                            redborder('#unitsMatch')
                        }

                        if(newUnit){
                            if(UnitName==''){
                                redborder('#unitName')
                            }

                            if(newRatio==0){
                                redborder('#uwianoQty1')
                            }
                        }
                    }
                }else{
                    redborder('#duka_item_aina')
                }
            }else{
                redborder('#duka_item')
            }
        } 
        

    


    })



    function submitOder(data){

    
    
        $("#modal_Item_match").modal('hide');
        $("#bil_or_expense").modal('hide');
        $("#loadMe").modal('show');
    
        $.ajax({
            type: "POST",
            url: data.url,
             data: data.data,
          }).done(function(respo) {
             let msg = lang(respo.msg_swa,respo.msg_eng)
          if(respo.success){
              toastr.success(msg, lang('Imefanikiwa','Success Alert'), {timeOut: 7000});
              if(!('receive' in data) ){
                 location.reload() 
              }else{
                  location.replace(`/purchase/viewRecept?item_valued=${respo.id}`)
              }
    
      
          }else{
               toastr.error(msg, lang('Haikufanikiwa','Error Alert'), {timeOut: 7000});
          }
    
        })
      }


