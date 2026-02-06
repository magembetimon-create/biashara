
// this will hold Items color
class labourer{
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

let wakazi = new labourer([])
var PICHAZAO = [],
    pichazao = id => PICHAZAO.find(i=>i.id===id).picha


function getLabours(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", // if you choose to use a get, could be a post
        url: "/getWorkers",
      data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
        wakazi.state=data.worker
        PICHAZAO = data.img
    })
}

getLabours()

 //search labour.............................................................................//
 var index=-1;	
 $('body').on('keyup','.suggest-holder input', function(){
 // Clear the ul   
 let labor = wakazi.state,
     labors=labor.reverse()

 let pos= $(this).data('pos')
 $(`.masaki${pos}`).empty();
     
 // Cache the search term
 var search = $(this).val();
 
 // Search regular expression
 var regrex = /[^a-z0-9 ]/gi;
 search = new RegExp(search.replace(regrex,''), 'i');
     var lin;
 
 // Loop through the array
 labors.forEach(l => {
    let jina_namba = l.jina + ' ' +l.workerId 
    if(jina_namba.match(search)){
        var li=`<li data-value=${l.id} data-pos=${$(this).data('pos')} >
 
     <div  class='suggest-name text-capitalize py-1' data-pos="${$(this).data('pos')}"> <span class="pr-1 border-right mr-1"> ${l.workerId}</span> <span class="brown"> ${l.jina} </span> </div> 
      <div class="p-1 border-top" >${l.kazi}</div>
      
    </li>`;
    
    $(`.masaki${pos}`).append(li);

    }

 });

 
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




 //to add another worker ............................//
 $('body').off('click','#add-btn').on('click', '#add-btn', function () {

    let hasdata=$(`#search${$('#item_tr_tbody tr').last().data('pos')}`).data('itm') || 0
                
    
    
    if(hasdata>0){ 
        let pos=$('#item_tr_tbody tr').last().data('pos')
        pos=pos+1
        $('#item_tr_tbody').append(tablerow(pos))          
       
    
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
            <svg xmlns="http://www.w3.org/2000/svg"  height="30" width="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,15c-2.67,0-8,1.34-8,4v2h16v-2C17,16.34,11.67,15,9,15z"/>
                <path d="M22.1,6.84c0.01-0.11,0.02-0.22,0.02-0.34c0-0.12-0.01-0.23-0.03-0.34l0.74-0.58c0.07-0.05,0.08-0.15,0.04-0.22l-0.7-1.21 c-0.04-0.08-0.14-0.1-0.21-0.08L21.1,4.42c-0.18-0.14-0.38-0.25-0.59-0.34l-0.13-0.93C20.36,3.06,20.29,3,20.2,3h-1.4 c-0.09,0-0.16,0.06-0.17,0.15L18.5,4.08c-0.21,0.09-0.41,0.21-0.59,0.34l-0.87-0.35c-0.08-0.03-0.17,0-0.21,0.08l-0.7,1.21 c-0.04,0.08-0.03,0.17,0.04,0.22l0.74,0.58c-0.02,0.11-0.03,0.23-0.03,0.34c0,0.11,0.01,0.23,0.03,0.34l-0.74,0.58 c-0.07,0.05-0.08,0.15-0.04,0.22l0.7,1.21c0.04,0.08,0.14,0.1,0.21,0.08l0.87-0.35c0.18,0.14,0.38,0.25,0.59,0.34l0.13,0.93 C18.64,9.94,18.71,10,18.8,10h1.4c0.09,0,0.16-0.06,0.17-0.15l0.13-0.93c0.21-0.09,0.41-0.21,0.59-0.34l0.87,0.35 c0.08,0.03,0.17,0,0.21-0.08l0.7-1.21c0.04-0.08,0.03-0.17-0.04-0.22L22.1,6.84z M19.5,7.75c-0.69,0-1.25-0.56-1.25-1.25 s0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25S20.19,7.75,19.5,7.75z"/><path d="M19.92,11.68l-0.5-0.87c-0.03-0.06-0.1-0.08-0.15-0.06l-0.62,0.25c-0.13-0.1-0.27-0.18-0.42-0.24l-0.09-0.66 C18.12,10.04,18.06,10,18,10h-1c-0.06,0-0.11,0.04-0.12,0.11l-0.09,0.66c-0.15,0.06-0.29,0.15-0.42,0.24l-0.62-0.25 c-0.06-0.02-0.12,0-0.15,0.06l-0.5,0.87c-0.03,0.06-0.02,0.12,0.03,0.16l0.53,0.41c-0.01,0.08-0.02,0.16-0.02,0.24 c0,0.08,0.01,0.17,0.02,0.24l-0.53,0.41c-0.05,0.04-0.06,0.11-0.03,0.16l0.5,0.87c0.03,0.06,0.1,0.08,0.15,0.06l0.62-0.25 c0.13,0.1,0.27,0.18,0.42,0.24l0.09,0.66C16.89,14.96,16.94,15,17,15h1c0.06,0,0.12-0.04,0.12-0.11l0.09-0.66 c0.15-0.06,0.29-0.15,0.42-0.24l0.62,0.25c0.06,0.02,0.12,0,0.15-0.06l0.5-0.87c0.03-0.06,0.02-0.12-0.03-0.16l-0.52-0.41 c0.01-0.08,0.02-0.16,0.02-0.24c0-0.08-0.01-0.17-0.02-0.24l0.53-0.41C19.93,11.81,19.94,11.74,19.92,11.68z M17.5,13.33 c-0.46,0-0.83-0.38-0.83-0.83c0-0.46,0.38-0.83,0.83-0.83s0.83,0.38,0.83,0.83C18.33,12.96,17.96,13.33,17.5,13.33z"/><path d="M4.74,9h8.53c0.27,0,0.49-0.22,0.49-0.49V8.49c0-0.27-0.22-0.49-0.49-0.49H13c0-1.48-0.81-2.75-2-3.45V5.5 C11,5.78,10.78,6,10.5,6S10,5.78,10,5.5V4.14C9.68,4.06,9.35,4,9,4S8.32,4.06,8,4.14V5.5C8,5.78,7.78,6,7.5,6S7,5.78,7,5.5V4.55 C5.81,5.25,5,6.52,5,8H4.74C4.47,8,4.25,8.22,4.25,8.49v0.03C4.25,8.78,4.47,9,4.74,9z"/><path d="M9,13c1.86,0,3.41-1.28,3.86-3H5.14C5.59,11.72,7.14,13,9,13z"/>
            </svg>
        </div>

       </td> 

       <td>
        <!-- ITEM NAME -->
        <div class="suggest-holder  item-attr${pos} ">
          <input
          placeholder="${lang('Andika Jina la Mfanyakazi ',' Write Labour name')} "
          style="min-width: 210px;"
          type="text" 
          data-pos=${pos}
          id = "search${pos}"
          data-itm = 0
          class="weight600 brown text-capitalize form-control border0 smallFont muhimu-b-kununua-zilizopo suggest-prompt${pos} suggest-prompt input-data latoFont" />
         
          <ul class="masaki masaki${pos}" data-hiarch=${pos} style="min-width: 350px;z-index:999999;max-height:250px;overflow-y:scroll"></ul>

        </div>
        
    </td>

    <td class="p-1">
        <textarea name="laborTask${pos}" id="laborTask${pos}" data-pos=${pos} class="laborTask form-control"></textarea>
        <!-- Button to remove item from table -->
        <div class="text-right">
             <button data-pos=${pos} class="btn-default remove_bill_item_tr  btn btn-sm text-danger " >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="currentColor" class="bi bi-dash-circle-dotted" viewBox="0 0 16 16">
              <path d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
            </svg>
        </button>
        </div>
        </td>
</tr>
       
    `
    
}

function placedata(pos,itm_val){
    const wk = wakazi.state.find(i=>i.id===itm_val)

    $(`#search${pos}`).data('itm',itm_val)
    $(`#search${pos}`).val(wk.jina)
    if(wk.picha){
            $(`#imgplace${pos}`).html(`
                    <img  style="max-width:40px;max-height:40px" src="${pichazao(wk.id)}">
                    `)
    }else{
        $(`#imgplace${pos}`).html(`<svg xmlns="http://www.w3.org/2000/svg"  height="30" width="30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9,15c-2.67,0-8,1.34-8,4v2h16v-2C17,16.34,11.67,15,9,15z"/>
        <path d="M22.1,6.84c0.01-0.11,0.02-0.22,0.02-0.34c0-0.12-0.01-0.23-0.03-0.34l0.74-0.58c0.07-0.05,0.08-0.15,0.04-0.22l-0.7-1.21 c-0.04-0.08-0.14-0.1-0.21-0.08L21.1,4.42c-0.18-0.14-0.38-0.25-0.59-0.34l-0.13-0.93C20.36,3.06,20.29,3,20.2,3h-1.4 c-0.09,0-0.16,0.06-0.17,0.15L18.5,4.08c-0.21,0.09-0.41,0.21-0.59,0.34l-0.87-0.35c-0.08-0.03-0.17,0-0.21,0.08l-0.7,1.21 c-0.04,0.08-0.03,0.17,0.04,0.22l0.74,0.58c-0.02,0.11-0.03,0.23-0.03,0.34c0,0.11,0.01,0.23,0.03,0.34l-0.74,0.58 c-0.07,0.05-0.08,0.15-0.04,0.22l0.7,1.21c0.04,0.08,0.14,0.1,0.21,0.08l0.87-0.35c0.18,0.14,0.38,0.25,0.59,0.34l0.13,0.93 C18.64,9.94,18.71,10,18.8,10h1.4c0.09,0,0.16-0.06,0.17-0.15l0.13-0.93c0.21-0.09,0.41-0.21,0.59-0.34l0.87,0.35 c0.08,0.03,0.17,0,0.21-0.08l0.7-1.21c0.04-0.08,0.03-0.17-0.04-0.22L22.1,6.84z M19.5,7.75c-0.69,0-1.25-0.56-1.25-1.25 s0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25S20.19,7.75,19.5,7.75z"/><path d="M19.92,11.68l-0.5-0.87c-0.03-0.06-0.1-0.08-0.15-0.06l-0.62,0.25c-0.13-0.1-0.27-0.18-0.42-0.24l-0.09-0.66 C18.12,10.04,18.06,10,18,10h-1c-0.06,0-0.11,0.04-0.12,0.11l-0.09,0.66c-0.15,0.06-0.29,0.15-0.42,0.24l-0.62-0.25 c-0.06-0.02-0.12,0-0.15,0.06l-0.5,0.87c-0.03,0.06-0.02,0.12,0.03,0.16l0.53,0.41c-0.01,0.08-0.02,0.16-0.02,0.24 c0,0.08,0.01,0.17,0.02,0.24l-0.53,0.41c-0.05,0.04-0.06,0.11-0.03,0.16l0.5,0.87c0.03,0.06,0.1,0.08,0.15,0.06l0.62-0.25 c0.13,0.1,0.27,0.18,0.42,0.24l0.09,0.66C16.89,14.96,16.94,15,17,15h1c0.06,0,0.12-0.04,0.12-0.11l0.09-0.66 c0.15-0.06,0.29-0.15,0.42-0.24l0.62,0.25c0.06,0.02,0.12,0,0.15-0.06l0.5-0.87c0.03-0.06,0.02-0.12-0.03-0.16l-0.52-0.41 c0.01-0.08,0.02-0.16,0.02-0.24c0-0.08-0.01-0.17-0.02-0.24l0.53-0.41C19.93,11.81,19.94,11.74,19.92,11.68z M17.5,13.33 c-0.46,0-0.83-0.38-0.83-0.83c0-0.46,0.38-0.83,0.83-0.83s0.83,0.38,0.83,0.83C18.33,12.96,17.96,13.33,17.5,13.33z"/><path d="M4.74,9h8.53c0.27,0,0.49-0.22,0.49-0.49V8.49c0-0.27-0.22-0.49-0.49-0.49H13c0-1.48-0.81-2.75-2-3.45V5.5 C11,5.78,10.78,6,10.5,6S10,5.78,10,5.5V4.14C9.68,4.06,9.35,4,9,4S8.32,4.06,8,4.14V5.5C8,5.78,7.78,6,7.5,6S7,5.78,7,5.5V4.55 C5.81,5.25,5,6.52,5,8H4.74C4.47,8,4.25,8.22,4.25,8.49v0.03C4.25,8.78,4.47,9,4.74,9z"/><path d="M9,13c1.86,0,3.41-1.28,3.86-3H5.14C5.59,11.72,7.14,13,9,13z"/>
     </svg>`)
    }

   
}


//SAVE MATERIAL ADJUSTMENT DATA...........................................///
$('#saveReduceAdj').unbind('submit').submit(function (e) {
    e.preventDefault() 
    let url=$(this).attr("action"),
      
        csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
      
        nw = 0,
        zer = 0,
        pr=Number($(this).data('value')) || 0,
        worker_dt =[]
     

  

     

    $('.laborTask').each(function(){

        if($(this).val().trim()==''){
            zer += 1
            $(this).addClass('redborder')
        }

   

        let pos=$(this).data('pos')
       

       
          let  itn = {
                val:Number($(`#search${pos}`).data('itm')),
                task:$(this).val(),
             
            } 
            
            worker_dt.push(itn)


    })

  

let data = {
    data:{
        pr:pr,
        workers:JSON.stringify(worker_dt),
        csrfmiddlewaretoken:csrfToken, 
    },
    url:url
}
   
    // if (Number(to)>0){
        if(zer==0 ){
          saveProd(data) 
          console.log(data)
        }
       
    // }else{
    //     alert(lang('Tafadhari chagua stoku ya kuhamisha','Please select destination wharehouse'))
    //     $('#to_interprise').addClass('redborder')
    // }


})

function saveProd(data){

    $("#loadMe").modal('show');

    $.ajax({
    type: "POST",
    url: data.url,
    data: data.data,
    success: function (respo) {

        if(respo.success){
            toastr.success(lang(respo.msg_swa,respo.msg_eng), 'Success Alert', {timeOut: 7000});
             
                 location.replace(`/production/productonLabours?pr=${respo.pr}`)
            
          
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


// save Customer.............................................
$('#form-worker').submit(function(e){
    e.preventDefault()
    var url=$(this).attr("action"),active=$(this).data('active_worker')

    var jina = $('#worker-jina').val(),
        adress=$('#worker-sehemu').val(),
        code=$('#worker-simu-code').val(),
        simu1=$('#worker-simu').val(),
        simu2=$('#worker-simu2').val(),
        kazi=$('#worker-mail').val(),
        kazi=$('#worker-mail').val(),
        namba = $('#worker-Id').val(),
        edit = $(this).data('edit'),
        value = $(this).data('valued')
    if(jina!=''){
        if(adress!=''){

            if(simu1.length==9){
                if(code.length>2){
                     var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

        var data={
       data:{
             jina:jina,
             adress:adress,
             code:code,
             simu1:simu1,
             simu2:simu2,
             isactive:active,
             valued:value,
             edit:edit,
             namba:namba,
             value:$(this).data('worker_value'),
             kazi:kazi,
            csrfmiddlewaretoken:csrfToken, 
        } ,    
            url:url,
            hide:"#workers-modal",
            form:'#form-worker'

        
        }
        if(simu2=='' || simu2.length==9){
            // supplier_selected.state=false
            if(kazi!=''){
                 saveWorkData(data)
            }else{
                redborder('#worker-mail')
            }


        }else{
            // alert(lang("Tafadhali Andika namba ya simu kwa simu2 kwa usahihi","Please write Vender contact 2 correctly"))
            redborder('#worker-simu2')
            $('#worker-simu2').siblings('small').prop('hidden',false)
        }

                }else{
                    //  alert(lang("Tafadhali Andika code ya simu kwa usahihi","Please write country code correctly"))
                    redborder('#worker-simu-code') 
                    $('#worker-simu-code').siblings('small').prop('hidden',false)
                }
               
            }else{
            //    alert(lang("Tafadhali Andika namba ya simu kwa simu1 kwa usahihi","Please write Vender contact 1 correctly"))
            redborder('#worker-simu')
            $('#worker-simu').siblings('small').prop('hidden',false)

            }
            
        }else{
            // alert(lang("Tafadhali Andika mahali mworker anapatikana","Please write Vender Address"))
            redborder('#worker-sehemu')
            $('#worker-sehemu').siblings('small').prop('hidden',false)

        }
      
    }else {
        // alert(lang("Tafadhali andika jina la mworker","Please write Vendor Name"))
        $('#worker-jina').siblings('small').prop('hidden',false)

        redborder('#worker-jina')
    }
})


//FUNCTION YA KUSAVE STOKU....................................................
function saveWorkData(data){
    $(data.hide).modal('hide');
    $("#loadMe").modal('show');
    $.ajax({
        type: "POST",
        url: data.url,
         data: data.data,
      }).done(function(respo) {
          if(respo.success){
            toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 7000});
          
            $(data.form).data('worker_value',0)
            $(data.form).data('active_worker',0)
            $(data.form).data('edit',0)

            $('#worker-Id').val('')
            $('#worker-jina').val('')
            $('#worker-sehemu').val('')
            
            $('#worker-simu').val('')
            $('#worker-simu2').val('')
            $('#worker-mail').val('')

            


            getLabours() 
    
          }else{
              toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 7000});
              

          }
        $("#loadMe").modal('hide');
        hideLoading()
      })
}