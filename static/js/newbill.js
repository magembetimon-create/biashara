// $(document).ready(function () {
    // this will hold Items color for new bill
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
 var BillItems =new bidhaa__([]),PICHA = []
 

 function getColor_Size(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", 
        url: "/stoku/getSizeColor",
      data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){

        if(data.color.length>0){
            coloredItemb.state=data.color
        }

        if(data.size.length>0){
            ItemsSizeb.state=data.size
        }

        BillItems.state=data.bizaa || []
        PICHA = data.picha

    })
 }
   

 getColor_Size()

// });






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
    const itmImg = PICHA.filter(im=>itms[i].bidhaa===im.bidhaa)[0]?.picha__picha
   
    var li=`<li class="row" data-value=${itms[i].id} data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${$(this).data('pos')}>
        <div class="col-2 col-md-1">
        <img alt="${lang('Hakuna picha','No image')}" style="max-width:60px;min-width:60px"  src=${itmImg}  >
        </div>
   <div class="col-10 col-md-11" >
    <span  class='suggest-name ' data-value=${itms[i].id} data-valu=${itms[i].bidhaa} data-prod=${itms[i].bidhaa} data-pos=${$(this).data('pos')} >${ itms[i].bidhaa__bidhaa_jina} </span> 
   <a class="d-block" style='padding:7px'>
       <span class='suggest-description text-danger font-weight-bold' style='float:right'>${titleCase(itms[i].curenci)}. ${parseInt(itms[i].Bei_kununua).toLocaleString()}/=</span>
       <span class='suggest-description' style='float:left'>${itms[i].bidhaa__bidhaa_aina_id__aina }</span>
       <span class='suggest-description' style='color:#47476b'></span>
       <br/>
    </a>
    <a class="d-block">
    <label class="text-primary pl-2 robotoFont" style="font-size:11px">
    <svg width="1em" height="1.0625em" viewBox="0 0 16 17" class="bi bi-compass mx-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
        <path d="M6.94 7.44l4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
    </svg>
    
    ${itms[i].msambaji_id__jina}</label>
    
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
        color_size(prod_val,pos,coloredItemb.state,ItemsSizeb.state)   

		
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

     color_size(prod_val,pos,coloredItemb.state,ItemsSizeb.state)   

});

$('body').on('click', function(e) {
    if (!$(e.target).closest('.masaki li, .suggest-holder input').length) {
        $('.masaki').hide();
    };
});




//Place item data to its appropriate..............
function placedata(pos,id){

  $(`.item-attr${pos}`).show()
  $(`.jum-panel${pos}`).show()
  $(`#suggest-holder${pos}`).hide()
  $(`.suggest-prompt${pos}`).val('')

  $('#bill_item').data('jum',true)

//Use the 
    let itms=BillItems.state
    for(let i in itms){
        if(itms[i].id==id){
            $(`#place_searched${pos} label`).html(`<strong>${titleCase(itms[i].bidhaa__bidhaa_jina).replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</strong>`)
            $(`#place_searched${pos} #item-desc${pos}`).text(titleCase(itms[i].bidhaa__maelezo))

            showimgBl(pos,itms[i].bidhaa)

            $(`.rej-panel${pos}`).hide()


            $(`.idadi-units_disp${pos}`).text(itms[i].bidhaa__vipimo_jum)
            $(`.units_disp${pos}`).text(`@${itms[i].bidhaa__vipimo_jum}`)

            //Clear idadi && price input  
            $(`.idadi-rej-panel${pos} input`).val('')
            $(`.idadi-jum-panel${pos} input`).val('')
            $(`#bill_bei_jum${pos}`).val('')
            $(`#bill_bei_rej${pos}`).val('')

            //clear the color/size display.....................................//
            $(`#color_obj${pos}`).html('')
            $(`#color_qt${pos}`).text(0)
            $(`#popColored${pos}`).hide()

            //Assign qty input placeholder 1
            $(`.idadi-rej-panel${pos} input`).attr('placeholder',1)
            $(`.idadi-jum-panel${pos} input`).attr('placeholder',1)

            $(`.idadi-rej-panel${pos} input`).data('itm',itms[i].id)
            $(`.idadi-jum-panel${pos} input`).data('itm',itms[i].id)

            $(`.idadi-rej-panel${pos} input`).data('sm',itms[i].bidhaa__vipimo)
            $(`.idadi-jum-panel${pos} input`).data('sm',itms[i].bidhaa__vipimo)

            //Assign item id to color button.....................................//
            $(`#is_colored_item${pos} button`).data('val',itms[i].id)
            $(`#is_colored_item${pos} button`).data('valu',itms[i].bidhaa)


            //Price settings button enabling.................//
            $(`#price_drop_btn${pos}`).prop('disabled',false)
            
            //Assign price input placeholder  the item price
            $(`#bill_bei_jum${pos}`).attr('placeholder',parseInt(itms[i].Bei_kununua).toLocaleString())
            $(`#bill_bei_rej${pos}`).attr('placeholder',parseInt(parseInt(itms[i].Bei_kununua)/parseInt(itms[i].bidhaa__idadi_jum)).toLocaleString())
            
            $(`#bill_bei_jum${pos}`).data('val',parseInt(itms[i].Bei_kununua))
            $(`#bill_bei_rej${pos}`).data('val',parseInt(parseInt(itms[i].Bei_kununua)/parseInt(itms[i].bidhaa__idadi_jum)))
            
            $(`#jum-actual-total${pos}`).val(parseInt(itms[i].Bei_kununua).toLocaleString())
            $(`#rej-actual-total${pos}`).val(parseInt(parseInt(itms[i].Bei_kununua)/parseInt(itms[i].bidhaa__idadi_jum)).toLocaleString())
            
            $(`#jum-total${pos}`).val(parseInt(itms[i].Bei_kununua).toLocaleString())
            $(`#rej-total${pos}`).val(parseInt(parseInt(itms[i].Bei_kununua)/parseInt(itms[i].bidhaa__idadi_jum)).toLocaleString())
            

            //reset vat check
           $(`#vatallow-jum${pos},#vatallow-rej${pos}`).prop('checked',false)

          $(`#vatallow-rej${pos},#vatallow-rej${pos}`).siblings('label').children('input').val('')
            // place vat inclusive boolean
            $(`#vatallow-jum${pos}`).data('include',itms[i].bidhaa__purchtaxInluded)
            $(`#vatallow-rej${pos}`).data('include',itms[i].bidhaa__purchtaxInluded)

            $(`#na_vat${pos}`).prop('checked',itms[i].bidhaa__purchtaxInluded)

              $(`#na_vat_panel${pos}`).show()


            $(`#bill_kuuza_jum${pos}`).attr('placeholder',parseInt(itms[i].Bei_kuuza_jum).toLocaleString())
            $(`#bill_kuuza_rej${pos}`).attr('placeholder',parseInt(itms[i].Bei_kuuza).toLocaleString())

            //The units ....................................//
            let unts=` <button  data-jum=false data-units='${itms[i].bidhaa__vipimo}' data-pos=${pos} data-show=".rej-panel${pos}" data-hide=.jum-panel${pos}  class="btn-light btn btn-sm setPu dropdown-item "  >${titleCase(itms[i].bidhaa__vipimo)}</button>  `

                   if(Number(itms[i].bidhaa__idadi_jum)>1){
                      unts+=`  
                          <hr>            
                          <button  data-jum=true data-units='${itms[i].bidhaa__vipimo_jum}' data-pos=${pos} data-show=".jum-panel${pos}" data-hide=.rej-panel${pos} class="btn-primary btn btn-sm setPu dropdown-item ">${titleCase(itms[i].bidhaa__vipimo_jum)}</button>
                      ` 
                   }
                   $(`#idadi_prod${pos}`).html(unts)

                   $(`#dropbtn${pos}`).prop('disabled',false)
              

            // $(`.setPufirst${pos}`).text(itms[i].bidhaa__vipimo_jum)
            // $(`.setPusecond${pos}`).text(itms[i].bidhaa__vipimo)

            // $(`.setPufirst${pos}`).data('units',itms[i].bidhaa__vipimo_jum)
            // $(`.setPusecond${pos}`).data('units',itms[i].bidhaa__vipimo)


            if(parseInt(itms[i].bidhaa__idadi_jum)>1){

               $(`#manuuzi_namna${pos}`).show()

            }else{
               $(`#manuuzi_namna${pos}`).hide()
                
            }

            

            calculateSum ()
        }
    }


}



//Place Image to its appropriate.................................//
function showimgBl(pos,prod){
    
    let imge=PICHA,coount=0,im_sr='',trp=''
                
            
            for(let im in imge){



                if(imge[im].bidhaa==prod) {
                 coount+=1;
                 im_sr=`<img src="${imge[im].picha__picha}" style="max-width:3.9625em;max-height:3.9em;cursor:pointer">`
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
        jum=$(this).data('jum')

   $(this).addClass('btn-primary')
   $(this).removeClass('btn-light')

   $(this).siblings('.setPu').removeClass('btn-primary')
   $(this).siblings('.setPu').addClass('btn-light')

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

  $(`.idadi-units_disp${$(this).data('pos')}`).text($(this).data('units'))
  $(`.units_disp${$(this).data('pos')}`).text(`@${$(this).data('units')}`)

  calculateSum ()
})

$('body').on('keyup',`.item-bill-jum_idadi,.item-bill-rej_idadi`,function(){

    
    let pos = $(this).data('pos')
    setBillData(pos)
 })

 $('body').on('change','.vat-fill',function(){
    let pos = $(this).data('pos')
    setBillData(pos)
 })

//Clicking the bill item pricece
$('body').on('keyup', '.bill_bei_jum,bill_bei_rej', function (e) {
    let pos = $(this).data('pos')
    setBillData(pos)
});


$('body').on('change','.vat-include',function(){
    let pos = $(this).data('pos')
    $(`#vatallow-jum${pos}`).data('include',$(this).prop('checked'))
    $(`#vatallow-rej${pos}`).data('include',$(this).prop('checked'))


    setBillData(pos)
})

// $('body').on('click', '#add_bill_item', function () {
    

// });

//Adding the bill item
$('#add_bill_item').unbind("click").click(function () {
    
let hasdata=$(`#jum_item_qty${$('#new-bill_tbody tr').last().data('pos')}`).attr('placeholder')


if(hasdata!=undefined){ 
    let pos=$('#new-bill_tbody tr').last().data('pos')
    pos=pos+1
  $('#new-bill_tbody').append(tablerow(pos))

}

// console.log('pos')
});


 //Use code scanner on adding item
 $('#code_scaner_insteady').unbind("click").click(function () {
    let hasdata=$(`#jum_item_qty${$('#new-bill_tbody tr').last().data('pos')}`).attr('placeholder'),
        pos=$('#new-bill_tbody tr').last().data('pos')
      
      if(hasdata!=undefined){ 
         
          pos=pos+1
          $('#new-bill_tbody').append(tablerow(pos))          
  
  
      }
          $('#livestream_scanner').data('pos',pos)
          if(ISMOBILE){
                start_can()
            }else{
                $('#livestream_scanner').modal('show')
            }  
  
   })

$('body').off('click','.remove_bill_item_tr').on('click', '.remove_bill_item_tr', function () {
let hommany=document.getElementById("new-bill_tbody").childElementCount,
    hasdata=$(`#jum_item_qty${$($(this).data('remove')).data('pos')}`).attr('placeholder')


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





$('body').off('click','.expense_bill_record').on('click', '.expense_bill_record', function () {
    let valdata = $(this).data('value')
    let amountdata = $(this).data('amount')

    value = Number($(valdata).find('option:selected').data('value'))
    namel= $(valdata).val()
    amount = Number($(amountdata).val())

   

if($(amountdata).val()!=0 && value!=0){
    $('#bill_expense_workout').prepend(billExpesesRw(value,namel,amount))

 $(valdata).html($(valdata).html())
 $(valdata).selectpicker('refresh')
    $(amountdata).val('')

    expenseSum()


}else{
    alert(lang('Tafadhari jaza sehemu zote Muhimu','Please fill all required fields'))
}

})

$('body').off('click','.remove-expense').on('click', '.remove-expense', function () {
    if(confirm(lang('Ondoa Ghalama','remove expense'))){
        
        $(this).parent('div').parent('td').parent('tr').remove()

        let hommany=document.getElementById("new-bill_tbody").childElementCount;
        if(hommany==1){
            $('.with_expenses').hide()
        }

        expenseSum()

    }
})



function billExpesesRw(value,name,amount){
    $('.with_expenses').fadeIn(500)

 let tr =    `
    <tr class="matumizi_data text-center  latoFont" data-value=${value} data-amount=${amount} style="padding-bottom:5px;height:9px !important" class="smallerFont border-bottom">
       <td data-value=${value}>${name}</td>
       <td>-----</td>
       <td class="bill_expense_sum" data-amount=${amount}>${amount.toLocaleString()}</td>
       <td>
       <div class="form-group mt-2">
       <button class="btn-default remove-expense btn btn-sm text-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
        </svg></button>  </div></td>
    </tr> `;
return tr;
}


function expenseSum(){
let sum = 0
$('.bill_expense_sum').each(function(){
    sum += Number($(this).data('amount'))
})




let items_bill=Number($('#total_bill_cash').data('total'))

$('#total_bill_expenses').text(sum.toLocaleString())

$('#total_bill_wth_expenses').text((sum+items_bill).toLocaleString())

$('#total_bill_wth_expenses').data('total',sum+items_bill)

if(sum>0){
    $('.with_expenses').show()
}else{
        $('.with_expenses').hide()

}

}



//IF ACOUNT IS SELECTED..................................//
$('#malipo-akaunti').change(function(){
    if($(this).find('option:selected').data('value')!='0'){ $(this).selectpicker('setStyle', 'restore-border');$(this).selectpicker('setStyle', 'btn-light');}

    let hommany=document.getElementById("new-bill_tbody").childElementCount,
        total_amount=Number($('#total_bill_cash').data('total')),
        acont_amount= Number($(this).find('option:selected').data('amount'));

    if(hommany>1){
       total_amount=Number($('#total_bill_wth_expenses').data('total'))
    }

    if(total_amount<=acont_amount){
        $('#iliyobaki_bill').attr('placeholder',(acont_amount-total_amount).toLocaleString())
        $('#akaunti_verifier').hide();
    }else{
        $(this).selectpicker('setStyle', 'border-danger');
         $('#iliyobaki_bill').attr('placeholder',lang('Akaunti haina kiasi cha kutosha','insufficient account amount'))
        $('#akaunti_verifier').show();

    }


})

$('#iliyobaki_bill').keyup(function(){
      let val = Number($(this).val()),
         hommany=document.getElementById("new-bill_tbody").childElementCount,
        total_amount=Number($('#total_bill_cash').data('total')),
        acont_amount= Number($('#malipo-akaunti').find('option:selected').data('amount'));

        if(hommany>1){
            total_amount=Number($('#total_bill_wth_expenses').data('total'))
         }

        if(acont_amount < (val+total_amount)) {
            redborder(`#${$(this).attr('id')}`)
        }

})


//SAVE BILL DATA...........................................///
$('#save_bill_data').unbind('submit').submit(function (e) {
    e.preventDefault() 
    let url=$(this).attr("action"),
        edit=$(this).data("edit"),
        bill=$(this).data("bill"),
        rudi=Number($(this).data("rudi")),
        rudi_val=Number($(this).data("rudi_val"))


    let csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    let sup= Number($('#produ_sambazaji-kununua').find('option:selected').data('value')),
    bill_no = 'none',code_set = 0
    if($('#bill_no').val()!=''){
       bill_no = $('#bill_no').val()
       code_set=1
    }

   let date= $('#manunuzi-date').val(),
    inalipiwa = $('#bill_tobe_paid').prop('checked'),
    akaunt = $('#malipo-akaunti').find('option:selected').data('value'),
    due_date = $('#tarehe_kulipa').val(),
    remains = 0,
    remains_set = false,
    item_dt = [],expenses = [],exp_set=false,
     
    acont_amount = 0

    if (inalipiwa && Number(akaunt)>0){
        acont_amount = Number($('#malipo-akaunti').find('option:selected').data('amount'))
    }


    if($('#iliyobaki_bill').val()!=''){
        remains = Number($('#iliyobaki_bill').val())
        remains_set =true
    }


//Bill items data...........................................//
    $('.bill_data').each(function(){
        let pos = $(this).data('pos'),
                  jum= true

        
            let item_data=$(this).data('jumin')
        //check whether the bill item is in retail mode if then take the reja qty input  .......
            if(!$(this).data('jum')){
                 item_data=$(`#bill_item${pos}`).data('rejin')
                 jum = false
            }
            // const vat_per = Number($('#vat_percent').data('vat'))/100 
            let bei = Number($($(item_data).data('bei')).data('val')),
                idadi = 1,
                vat_set = $($(item_data).data('vat_allow')).prop('checked'),
                vat_included = $($(item_data).data('vat_allow')).data('include'),
                bei_set=false,
                sales_set = false,
                sales =0,
                expire = $($(item_data).data('expire')).val(),
                value = $(item_data).data('itm')
        
                if($($(item_data).data('bei')).val()!=''){
                    bei = Number($($(item_data).data('bei')).val())
                    bei_set = true
                }
                const vat_per = Number($('#vat_percent').data('vat'))/100 

                if(!vat_included && vat_set){
                    bei = bei * (1 + vat_per)
                }


                if($($(item_data).data('sale')).val()!=''){
                    sales = Number($($(item_data).data('sale')).val())
                    sales_set = true
                }
                
                if ($(item_data).val()!=''){
                    idadi = Number($(item_data).val())
                }


                //Take the color if color/size set qty............//
                let sized=[],colored=[]
        
                let  color=$(`#colored_items${pos}`).data('color'),
                     size= $(`#colored_items${pos}`).data('size')

                     if(color!=undefined){
                         colored=color
                     }

                     if(size!=undefined){
                         sized=size
                     }



                let itm_data={
                    'color':colored,
                    'size':sized,
                    'bei':bei,
                    'idadi':idadi,
                    'sale':sales,
                    'bei_set':bei_set,
                    'sel_set':sales_set,
                    'vat_set':vat_set,
                    'vat_include':vat_included,
                    'expire':expire,
                    'value':value,
                    'jum':jum
                }


                item_dt.push(itm_data)
                
                
        
             
        
        })    

// //bill other expenses data........................................................//
// let hommany=document.getElementById("new-bill_tbody").childElementCount;
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
         bill:bill,
         sup:sup,
         rudi:rudi,
         rudi_val:rudi_val,         
         date:date,
         bill_no:bill_no,
         code_set:code_set,
         inalipwa:Number(inalipiwa),
         akaunt:Number(akaunt),
         baki:remains,
         baki_set:Number(remains_set),
         kulipa:due_date,
        //  exp_set:Number(exp_set),
        //  exp_dt: JSON.stringify(expenses),
         itm_dt: JSON.stringify(item_dt),
         
        csrfmiddlewaretoken:csrfToken, 
    } ,    
        url:url
    
    }
    // saveStokuData(data)
    


    let total_amount=Number($('#total_bill_cash').data('total'))
    // if(hommany>1){
    //    total_amount=Number($('#total_bill_wth_expenses').data('total'))
    // }

    if(data.data.sup>=1 || Boolean(edit) || Boolean(rudi) ){
        if((!inalipiwa && due_date!='') || (inalipiwa && Number(akaunt)>=1 ) ){
           if(!inalipiwa || (inalipiwa && Number($('#malipo-akaunti').find('option:selected').data('amount'))>= total_amount) ){
              
             if (!inalipiwa || acont_amount>=(remains+total_amount)){
                 if(item_dt.length>0){
                   saveBill(data)
                 }

             }else{
                 alert(lang('kiasi kinachobaki na jumla ya bili kimezidi kiasi kilichopo kwenye akaunti iliyochaguliwa Tafadhari andika kiasi halisi kilichobaki kulingana na malipo ya bili','The stated account balance exceeds and the bill amount exceed the account amount please write correctly'))
               redborder('#iliyobaki_bill')
                }

           }else{
               alert(lang('Akaunti ya malipo iliyochaguliwa haina kiwango cha kutosha kulipia bili','The selected payment account has no sufficient amount to pay the bill please select another account'))
               $('#malipo-akaunti').selectpicker('setStyle', 'border-danger');

            }
        }else{
            if(!inalipiwa && due_date==''){
                alert(lang('Tafadhari weka tarehe ya kulipa','Please set Due bill date'))
                redborder('#tarehe_kulipa')
            }else if(inalipiwa && Number(akaunt)<1 ){
                alert(lang('Tafadhari chagua akaunti ya malipo','Please select Payment account'))
                 $('#malipo-akaunti').selectpicker('setStyle', 'border-danger');

            }
        }

    }else{
        alert(lang('Tafadhari chagua Msambazaji','please select supplier'))
        
        $('#produ_sambazaji-kununua').selectpicker('setStyle', 'border-danger');
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
            toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 2000});
            // getStokuData()
            
            // topslider.top()

            //clear matumizi data...................................................................................//
            $('.matumizi_data').each(function () {
                $(this).remove()
             })
            //Clear items table
            $('.with_expenses').hide();

            if(!Boolean(data.data.edit)){
            $('#new-bill_tbody').html(tablerow(1))

            }
             calculateSum () 
             expenseSum()


             $('#tarehe_kulipa').val('')
             $('#bill_no').val('')
             $('#bill_no').attr('placeholder',respo.bill_no)

            location.replace(`/purchase/viewbill?item_valued=${respo.bil}&backto=allbill`)



          }else{
              toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 2000});
              topslider.top()
              $("#loadMe").modal('hide');
              hideLoading()

          }
    }

    
});
// $("#loadMe").modal('hide');
//     hideLoading()
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

        //  console.log({'sz':size_check,'color':color_check})


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
                            //   console.log(szed)

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
                   if(parseInt(colored[l].bidhaa__idadi_jum)>1){
                    coloredone+=`
                   <div class="row py-1">
                         <div class="col-4">
                                <label class="text-primary smallerFont" for="jum">${colored[l].bidhaa__vipimo_jum}</label>
                        </div>                    
                        <div class="col-8">
                            <input  data-valu=${colored[l].id} data-sized=${sz.id}   class="bill-inputColor form-control smallerFont inputColor0${sz.id}" data-uwiano=${Number(colored[l].bidhaa__idadi_jum)}   data-jum=true  type="number" `
                        //show the sat value if the user has alread sat the quantities for given size.....//
                        if(there_is){
                          coloredone+=` value=${parseInt(qty_set/Number(colored[l].bidhaa__idadi_jum))} `
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
                            coloredone+=` value=${parseInt(qty_set / Number(colored[l].bidhaa__idadi_jum))}` 

                            } else{
                                coloredone+=` value=${parseInt(qty_set % Number(colored[l].bidhaa__idadi_jum))}` 
    
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

                                // console.log({checked:clr.color,color:colored[l].id})
                                

                              if(clr.color==colored[l].id){
                                   qty_set = clr.idadi
                                    selected =clr.idadi
                                    there_is=true
                           }

                       })
                        }


            // IN CASE THE ITEM IS TO BE SOLD/PURCHASED IN WHOLESALE AND RETAIL include the wholesale input.................................//
                     if(parseInt(colored[l].bidhaa__idadi_jum)>1){
                            coloredone+=`  
                                        <div class="row mb-2">
                                            <div class="col-4">
                                               <label class="smallerFont" for="dozen">${colored[l].bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}:</label>
                                            </div>
                                            <div class="col-8">
                                                <input type="number" data-show="#success${colored[l].id}" data-color=true data-jum=true data-uwiano=${colored[l].bidhaa__idadi_jum} placeholder=0 class="smallerFont bill-inputColor form-control inputColor${colored[l].id}" data-wiana=${Number(colored[l].bidhaa__idadi_jum)}  data-valu=${colored[l].id}   type="number" ` 
                                                if(there_is){
                                                    coloredone+=` value=${parseInt(qty_set/Number(colored[l].bidhaa__idadi_jum))}`
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
                                               coloredone+=` value=${parseInt(qty_set % Number(colored[l].bidhaa__idadi_jum))}`
                                               
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
                    toastr.success(lang(response.data.swa,response.data.eng), 'Success Alert', {timeOut: 2000});

                    color_size(val,pos,response.color,response.size)

                }else{
                    toastr.error(lang(response.data.swa,response.data.eng), 'Success Alert', {timeOut: 2000});
                    
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

        //   console.log(code)

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
                   toastr.success(lang(response.message_swa,response.message_eng), 'Success Alert', {timeOut: 2000});
                   color_size(value,pos,coloredItemb.state,ItemsSizeb.state)
                   $(`#ona_rang${color}`).show();

            }else{
                toastr.error(lang(response.message_swa,response.message_eng), 'error Alert', {timeOut: 2000});
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
                   toastr.success(lang(response.message_swa,response.message_eng), 'Success Alert', {timeOut: 2000});
                   color_size(value,pos,coloredItemb.state,ItemsSizeb.state)

            }else{
                toastr.error(lang(response.message_swa,response.message_eng), 'error Alert', {timeOut: 2000});
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
                          disp+=`<span class="smallFont">${vipimo_jum}:</span><span class="text-primary">${parseInt(idadi/uwiano)}</span>`

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
           
            //console.log(qty)
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
                          disp+=`<span class="smallFont">${vipimo_jum}:</span><span class="text-primary">${parseInt(szqty/uwiano)}</span>`

                          if(szqty%uwiano>0){
                            disp+=`+<span class="smallFont">${vipimo}:</span><span class="text-primary">${szqty%uwiano}</span>`
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
   let wiana=Number($(this).data('uwiano'))
   if(wiana>1){
      

       $(`.jum-panel${pos}`).hide()
       $(`.rej-panel${pos}`).show()

       $(`#bill_item${pos}`).data('jum',false)

       $(`.idadi-units_disp${pos}`).text($(`#rej_item_qty${pos}`).data('sm'))
      $(`.units_disp${pos}`).text(`@${$(`#rej_item_qty${pos}`).data('sm')}`)

      if(tot>0){
    $(`#rej_item_qty${pos}`).val(tot)
    $(`#dropbtn${pos}`).prop('disabled',true) 
      }else{
    $(`#rej_item_qty${pos}`).val('')
    $(`#dropbtn${pos}`).prop('disabled',false) 

      }

   }else{
       if(tot>0){
      
     $(`#jum_item_qty${pos}`).val(tot)
     $(`#dropbtn${pos}`).prop('disabled',true) 

       }else{
     $(`#jum_item_qty${pos}`).val('')
     $(`#dropbtn${pos}`).prop('disabled',false) 
           
       }
   }
 


setBillData(pos)

})


function setBillData(pos) {  
    const vat_per =  Number($('#vat_percent').data('vat'))/100

    let item_data = $(`#bill_item${pos}`).data('jumin')

    if(!$(`#bill_item${pos}`).data('jum')){
        item_data = $(`#bill_item${pos}`).data('rejin')
    }

    let sel_bei = $(item_data).data('bei');
    let sel_vat_al = $(item_data).data('vat_allow');
    let sel_vat_disp = $(item_data).data('vat');
    let sel_act_t = $(item_data).data('jum');
    let sel_tw_vat = $(item_data).data('tot_wth_vat');



    let bei =Number($(sel_bei).data('val'));
    let idadi = 1

    let t_bei_with_vat=sel_tw_vat

    if($(sel_bei).val()!=''){
        bei =Number($(sel_bei).val())
    }
    
    if($(item_data).val()!=''){
        idadi = Number($(item_data).val());
    }

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
        $(t_bei_with_vat).val((bei*idadi).toLocaleString())
    }
    calculateSum ()


}



// CALCULATE SUM...........................................................................///
function calculateSum () { 
    let bei_sum = 0,vat_sum=0,actual_sum=0


$('.bill_data').each(function(){
let pos = $(this).data('pos')

    let item_data=$(this).data('jumin')

    if(!$(this).data('jum')){
         item_data=$(`#bill_item${pos}`).data('rejin')
    }

    const vat_per = Number($('#vat_percent').data('vat'))/100 
    let bei = Number($($(item_data).data('bei')).data('val')),
        idadi = 1,vat = 0;

       


        if($($(item_data).data('bei')).val()!=''){
            bei = Number($($(item_data).data('bei')).val())
        }

    
        
        if ($(item_data).val()!=''){
            idadi = Number($(item_data).val())
        }

           
       bei = bei*idadi
        

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

expenseSum()


 }


 //SETTING THE PRICE.......................//

 $('body').on('click','.price_drop_btn',function(){
     let pos =$(this).data('pos'),
         jum =$(`#bill_item${pos}`).data('jum'),
         qty = 0

         if(jum){
           qty = Number($(`#jum_item_qty${pos}`).val()) || 1
         }else{
           qty =  Number($(`#rej_item_qty${pos}`).val())|| 1
         }

         $('#qty_for_pu').attr('placeholder',qty)
         $('#set_pu_price').data('pos',pos)
 })

 //set the price while the set price utton price clicked..................//
 $('#set_pu_price').click(function(){
     let pos = $(this).data('pos'),
       qty =Number($('#qty_for_pu').val()) || Number($('#qty_for_pu').attr('placeholder')),
       price = Number($('#prc_for_pu').val()) || 0,
       jum =$(`#bill_item${pos}`).data('jum')

       if(price>0){
           let bei = price/qty
           if(jum){
            $(`#bill_bei_jum${pos}`).val(bei)
           }else{
            $(`#bill_bei_rej${pos}`).val(bei)              
           }
           setBillData(pos)

           $('#write_price_help').prop('hidden',true)
           $('#Set_price_').modal('hide')
       }else{
           $('#write_price_help').prop('hidden',false)
       }

        
 })




//  PLACE TR DATA ON ITEM ADDITION.........................................//
function tablerow(pos){
    return tr=`
    <tr id="bill_item${pos}" class="bill_data" data-jum=true  data-jumin="#jum_item_qty${pos}" data-rejin="#rej_item_qty${pos}" data-pos=${pos}>
    <!-- IMAGE COL -->
     <td class="pt-2 pb-2" id="imgplace${pos}">
        <svg xmlns="http://www.w3.org/2000/svg" width="2.6em" height="2.6em" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
          </svg>
     </td>


     <!-- ITEM NAME -->
     <td class="py-2">
         <div class="suggest-holder item-attr${pos} " id="suggest-holder${pos}"  style="margin-top: -18px;min-width:310px">
            <div class="input-group container  p-1 bg-primary">
          <input
          placeholder=" ${lang('Andika Jina la Bidhaa ',' Write Item name ')}"
          style="min-width: 200px;"
          type="text" 
          data-pos=${pos}
          id = "search${pos}"
          class="form-control smallFont muhimu-b-kununua-zilizopo suggest-prompt${pos} input-data latoFont" />
         
          <div class="input-group-append">
          <div class="btn-group" role="group" aria-label="Basic example">
                           <button data-pos=${pos} class="btn btn-light btn-sm smallFont search_By_Bar" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upc-scan" viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z"/>
                              </svg>                            
                           </button>
            <button class="btn btn-primary btn-sm smallFont" data-toggle="modal" data-target="#add-products">
                + ${lang(' Mpya ',' Add ')}
            </button>
          </div>
          </div>
        </div>
          <ul class="masaki masaki${pos}" data-hiarch=${pos} style="min-width: 350px;z-index:999999;max-height:250px;overflow-y:scroll"></ul>
        </div>

        <h6 id="place_searched${pos}" style="min-width: 240px;display: none;" class="item-attr${pos} py-2  border-bottom">
            <label class="latoFont" style="color:rgb(108, 39, 236)" for="placeSearch"></label>
            <button class="btn btn-default text-primary btn-sm smallFont item-re-write" data-pos=${pos} data-show="#suggest-holder${pos}">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
            </button>

            
            <span id="item-desc${pos}" class="d-block text-muted smallerFont Assistant">
                  ${lang(' Maelezo ',' Descriptions ')}
            </span>
        </h6>

        <div class="bill-mauzo-namna item-attr${pos} " style="display: none;">
            <div class="px-1 pt-1 classic_div row">
                <label for="date" class="col-5" style="font-size: 11px;font-weight:bold;color:rgb(138, 26, 26)">
                    Expire Date:
                </label>

                <span class="col-7">
               <input type="date" class="expdate " id="expire${pos}" style="font-size: 11px;border:0">  
            </span>
            </div>
        </div>
        </td>


        <!-- QUANTITY-->
     <td class="pb-3 pt-2 qty">
        <div>
            <span class="text-primary d-block float-left   idadi-units_disp${pos}" style="font-size: 11px;"></span>
        </div>        
        
        <div class="input-group pt-2" style="width: 140px;">

        <!-- ITEM UNITS  -->


        <div class="dropdown border input-group-prepend">
           <button class="btn btn-light btn-sm  smallerFont drop_down dropdown-toggle"  title="Units" type="button" id="dropbtn${pos}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
             
           </button>
           <div class="dropdown-menu" id="idadi_prod${pos}" aria-labelledby="dropbtn${pos}">
             

             <!-- <button  data-jum=false data-units='' data-pos=1 data-show=".rej-panel1" data-hide=.jum-panel1   class=" btn-primary btn btn-sm setPu setPusecond1 dropdown-item"  > </button>              
             <button  data-jum=true data-units='' data-pos=1 data-show=".jum-panel1" data-hide=.rej-panel1 class="btn-light btn btn-sm setPu setPufirst1 dropdown-item"> </button>
      -->
           </div>
         </div>

         <div class=" jum-panel${pos}   idadi-jum-panel${pos}" style="padding-left: 0;" >
           <input type="number" data-sale="#bill_kuuza_jum${pos}" data-itm=0 data-expire="#expire${pos}" class=" form-control smallFont item-bill-jum_idadi" id="jum_item_qty${pos}" data-pos=${pos}  data-tot_wth_vat='#jum-total${pos}' data-vat_allow="#vatallow-jum${pos}" data-bei='#bill_bei_jum${pos}' data-vat='#vat-disp-jum${pos}' data-jum='#jum-actual-total${pos}' style="width: 71px;">  
         </div>

         <div class="  rej-panel${pos} idadi-rej-panel${pos}"  style="display: none;padding-left:0">
           <input type="number" data-sale="#bill_kuuza_rej${pos}" data-itm=0 data-expire="#expire${pos}" id="rej_item_qty${pos}" class=" smallFont form-control item-bill-rej_idadi" data-pos=${pos} data-tot_wth_vat='#rej-total${pos}' data-vat_allow="#vatallow-rej${pos}" data-bei='#bill_bei_rej${pos}' data-vat='#vat-disp-rej${pos}' data-jum='#rej-actual-total${pos}' style=" width: 71px;">  
         </div>

         <!-- Button trigger color modal -->
        <div class="text-center border input-group-append" id="is_colored_item${pos}"  style="display: none;">
            <button id="colored_items${pos}" title="${lang('Rangi','Color')}" class="btn btn-default btn-sm colored_items px-1" data-toggle="modal" data-pos=${pos} data-val=0 data-valu=0 data-target="#modal_color">
                 <img  width="20" src="/static/pics/colors.svg"   />
            </button>
         </div>
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
          <label for="" style="cursor: pointer;"  class="smallerFont col-8 latoFont px-2">
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


     <!-- PURCHASE PRICE -->

     <td class="pb-3 pt-2">

      <div class="row classic_div">
           <span class="text-primary float-left units_disp${pos}" style="font-size: 11px;"></span>
      </div> 

       <div class="pt-2 input-group" style="width:150px"> 
         <div class="jum-panel${pos} kununua-jum-panel${pos}"  >
            
        <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
            <label class="mt-1" for=""></label> 
           <div class="box-pointert d-inline "></div>
        </div>

           <input type="number" data-val=0 data-qty='#jum_item_qty${pos}' data-tot_wth_vat='#jum-total${pos}' data-vat_allow="#vatallow-jum${pos}"  data-vat='#vat-disp-jum${pos}' data-jum='#jum-actual-total${pos}' class="border0 form-control money-fomat bill_bei_jum" id="bill_bei_jum${pos}" data-pos=${pos} style="font-size:12px;width: 110px;">  
         </div>

         <div class=" rej-panel${pos} kununua-rej-panel${pos}" style="display: none;" >
       <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
            <label class="mt-1" for=""></label> 
           <div class="box-pointert d-inline "></div>
        </div>
           <input type="number" data-val=0 data-qty='#rej_item_qty${pos}' data-tot_wth_vat='#rej-total${pos}' data-vat_allow="#vatallow-rej${pos}"  data-vat='#vat-disp-rej${pos}' data-jum='#rej-actual-total${pos}'  class=" border0 form-control money-fomat bill_bei_rej" id="bill_bei_rej${pos}" data-pos=${pos} style="font-size:12px;width: 110px;">  
         </div>

         <div class=" input-group-prepend border">
         <button class="btn btn-light btn-sm drop_down price_drop_btn smallerFont" data-pos=${pos} disabled data-toggle="modal" data-target="#Set_price_"  title="Other Price" type="button" id="price_drop_btn${pos}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calculator" viewBox="0 0 16 16">
                 <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
                 <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"/>
               </svg>
         </button>
         </div>
       </div>


        


   <div class="custom-control  custom-checkbox" id="na_vat_panel${pos}" style="display: none;">
        <input type="checkbox" data-pos=${pos} class="custom-control-input vat-include" id="na_vat${pos}">
        <label class="custom-control-label latoFont smallerFont" for="na_vat${pos}"> 
        ${lang(' pamoja na VAT  ',' VAT  included  ')} 
        </label>
   </div> 

  
         
     </td>


     <!--ACTUAL TOTAL .................. . -->
     <td class="pb-3 pt-3 ">
     <div class="row classic_div">
        <span class=" float-left idadi-units_disp${pos}" style="font-size: 11px;color:rgba(240, 248, 255, 0)"></span>
     </div>   

        <div class=" jum-panel${pos} ">
             
                <input type="text" id="jum-actual-total${pos}" readonly class="smallerFont made-input" style="width:100px">
        </div>
        
        <div class=" rej-panel${pos}" style="display: none;">
            
                <input type="text" id="rej-actual-total${pos}" readonly class="smallerFont made-input" style="width:100px">
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
                <input type="text" data-vat_val=0  readonly class="smallerFont made-input" id="vat-disp-jum${pos}" style="width:100px">
            </label>
        </div>
        
        <div class="custom-control rej-panel${pos}  custom-checkbox" style="display: none;">
            <input type="checkbox" data-pos=${pos} data-actual="#rej-actual-total${pos}" data-include=false data-qty='#rej_item_qty${pos}' data-total_with_vat="#rej-total${pos}" data-vat_val=0 data-bei='#bill_bei_rej${pos}' class="custom-control-input vat-fill" id="vatallow-rej${pos}">
            <label class="custom-control-label" for="vatallow-rej${pos}"> 
                <input type="text"  data-vat_val=0  readonly class="smallerFont made-input" id="vat-disp-rej${pos}" style="width:100px">
            </label>
        </div> 

       
    </td>


    <!-- SALES PRICE -->
     <td class="pb-3 pt-2">

        <div class="row classic_div">
            <span class="text-primary float-left units_disp${pos}" style="font-size: 11px;"></span>
       </div> 

         <div class="  jum-panel${pos} pt-2 kununua-jum-panel${pos}" style="padding-left:0">
            

            <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
                <label class="mt-1" for=""></label> 
            <div class="box-pointert d-inline "></div>
            </div>


           <input type="number" class=" form-control money-fomat bill_kuuza_jum" id="bill_kuuza_jum${pos}" style="font-size:12px;width: 110px;">  
         </div>

         <div class=" pt-2  rej-panel${pos} kununua-rej-panel${pos}" style="display: none;" >
            <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
                    <label class="mt-1" for=""></label> 
                <div class="box-pointert d-inline "></div>
            </div>
           <input type="number" class=" form-control money-fomat bill_kuuza_rej" id="bill_kuuza_rej${pos}" style="font-size:12px ;width: 110px;">  
         </div>
         
     </td>

     
    
     
     
    
<!-- TOTAL -->
     <td class="pb-3 pt-3 remove-rw">
     <div class="row classic_div">
         <span class=" float-left idadi-units_disp${pos}" style="font-size: 11px;color:rgba(240, 248, 255, 0)"></span>
      </div> 
         <input type="text" readonly id="jum-total${pos}" class="smallerFont form-control jum-panel${pos}" style="width: 105px;">
         <input type="text" readonly id="rej-total${pos}" class="smallerFont form-control rej-panel${pos}" style="width: 105px;display:none">
   
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

    
}