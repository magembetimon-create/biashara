
RELOAD = 1
IMG_WIDTH = 1100
let SHOPCELLS = []

let uploadImg = (input,url,b4modal) =>{
      let img =  input.files[0]
      
     b4modal.modal('hide')
      if(Number(img.size/1024) <= 490){
                    IMGFORM.append('IMG',img)
                    let theData = {url}
                      ImageUpload(theData)
          
      }else{
        compressImg({img,url})
      }
      
   
}


  // Poster & 
  $('#poster_form').submit(function(e){
    e.preventDefault();
    
    var input= $('#audioFile'),
        val=$(input).val(),
        extension=val.split('.').pop().toLowerCase();

    if(val=='' && $('#poster_word').val()=='' ){
        alert(lang('Tafadhari chagua file la audio au andika kuhusu biashara','pleae select the audio file'))
        redborder(input)
    }else{
    if(jQuery.inArray(extension, ['mp3','wav','ogg']) == -1 && val != '' )
    {
        alert(lang("File la audio sio sahihi","Invalid audio File"));
        $(this).trigger("reset");
        // $('#userpicsubmit').prop('disabled',true)
        return false;
       }
       else
       {
    $("#loadMe").modal('show');
    $("#poster_sound").modal('hide');


    var form = $(this)
    var formData = new FormData(this);
    $.ajax({
        url: form.attr("action"),
        type: 'POST',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {

            $("#loadMe").modal('hide');
             hideLoading()
             if(response.success){

                toastr.success(lang('Bango Imeongezwa','Poster added'), lang('Imefanikiwa','Success'), {timeOut: 2000});
                 location.reload()
             }else{
                toastr.error(lang(response.msg_swa,response.msg_eng), lang('Haikufanikiwa','Error'), {timeOut: 2000});

             }

        
        },
        cache: false,
        contentType: false,
        processData: false
    });

       }}

});

// SAVE BUSSINESS REGISTRATIONS...................................................//
$('#save_Buz_reg').click(function(){
    let reg=[],
        tin =  $('#tin_id').val(),
        incomplete=0
    $('.reg_attr').each(function(){
       let attr_name = $(this).children().find('.attr_name').val(),
           attr_val = $(this).children().find('.attr_valu').val(),
           edit=$(this).data('edit'),
           value=$(this).data('value')
           if(attr_name==''&& Boolean(Number(edit)) ){
               attr_name = $(this).children().find('.attr_name').attr('placeholder')
           }
           if(attr_val==''&& Boolean(Number(edit)) ){
               attr_val = $(this).children().find('.attr_valu').attr('placeholder')
           }
           reg_ = {reg_name:attr_name,reg_id:attr_val,edit:edit,value:value}

           if(attr_name!='' && attr_val!=''){
               reg.push(reg_)
           }else{
               if(attr_name=='' && attr_val!==''){
                   incomplete+=0
                   redborder($(this).children().find('.attr_name'))
               }
               if(attr_name !='' && attr_val==''){
                   incomplete+=0
                   redborder($(this).children().find('.attr_valu'))
               }
           }
    })

     if(tin!='' || (incomplete==0 && reg.length>0)){
         data={
             data:{
                
                 tin:tin,
                 reg:JSON.stringify(reg),
                 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
             },
             url:'/Buzi_reg',

         }
      
         saveDT(data)
         $('#buz_regModal').modal('hide')
     }

   
})

// Remove registration attribute.........................................
$('body').on('click','.remove_reg',function(){
    if(Number($(this).data('edit'))){
        let val = $(this).data('id')
        if(confirm(lang('Ondoa Usajiri wa biashara','Remove business reistration ')+'?')){
            data={
                data:{
                    val:val,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

                },
                url:'/remove_reg'
            }
            $('#buz_regModal').modal('hide')
            saveDT(data)
        }
    }else{
        $(this).parent('div').parent('.reg_attr').remove()
    }
})


//Change user info display on profile...............//
$('body').on('change','.change_permit_profile',function(e){
  e.preventDefault()
 
  let data={
      data:{
          kifedha:1,
          value:$(this).parent('label').data('id'),
          edit:$(this).parent('label').data('edit'),
          state:Number($(this).prop('checked')),
          csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

      },
      'url':'/updatepermissions'
  }

  saveDT(data)

})


function saveDT(data){
    $("#loadMe").modal('show');

    $.ajax({
        type: "POST",
        data:data.data,
        url:data.url,
     
        success: function (resp) {
            $("#loadMe").modal('hide');
            hideLoading()
            if(resp.success){

                toastr.success(lang(resp.msg_swa,resp.msg_eng), lang('Imefanikiwa','Success'), {timeOut: 2000});
              
                if('kifedha' in data.data){
                    if(!Number(data.data.kifedha)){
                      location.reload() 
                    }
                }else{
                     location.reload()      
                }


             }else{
                toastr.error(lang(resp.msg_swa,resp.msg_eng), lang('Haikufanikiwa','Error'), {timeOut: 2000});

             }

        }
    });
}

// end

//SAVE customers place business place........................//
$('#savetheplace').click(function(){
    const name = $('#Area_name').val(),
          edit =  $('#Area_name').data('edit'),
          data = {
            data:{name,edit,isplace:1,place:0},
            url:"/setplace"
          }

          if(name!=''){
            $('#Area_name').data('edit',0)
            $('#Area_name').val('')
            $('#servPlace').modal('hide')
            sendThedt(data)
          }else{
            redborder('#Area_name')
          }
})

//SAVE customers position/cell business place........................//
$('#savetheCell').click(function(){
    const name = $('#cell_name').val(),
          edit =  $('#cell_name').data('edit'),
          place = $('#shopPlaces').children('.bluebox').first().data('value')
          data = {
            data:{name,edit,isplace:0,place},
            url:"/setplace"
          }

          if(name!=''){
            $('#cell_name').data('edit',0)
            $('#cell_name').val('')
            $('#servCells').modal('hide')
            sendThedt(data)
          }else{
            redborder('#cell_name')
          }
})


function sendThedt(dt){
      $('#loadMe').modal('show')
            const sendIt = POSTREQUEST(dt)
                  sendIt.then(resp=>{
                    $('#loadMe').modal('hide')
                    hideLoading()
                      if(resp.success){
                        SHOPCELLS = resp.cell
                       
                        toastr.success(lang(resp.msg_swa,resp.msg_eng), 'Success Alert', {timeOut: 3000});
                        
                         if(dt.data.isplace) placethePleces(resp)
                         if(!dt.data.isplace) placecells()
                    
                    }else{

                         toastr.error(lang(resp.msg_swa,resp.msg_eng), 'Error Alert', {timeOut: 3000});
 
                      }

                  })
}


$(document).ready(function(){
    $('#loadMe').modal('show')
   const data = {
    data:{load:1},
    url:"/getPlaceCells"
   } ,
   getThedata = POSTREQUEST(data)
   getThedata.then(resp=>{
       SHOPCELLS = resp.cell
    $('#loadMe').modal('hide')
    hideLoading()
        placethePleces(resp)
        
   })
})

//EDIT PLACES .....................................//
$('body').on('click','.editplaces',function(){
    const val = Number($(this).data('value')),
          name = $(this).data('name')

          $('#Area_name').val(name)
          $('#Area_name').data('edit',val)
          $('#servPlace').modal('show')
})

//EDIT CELLS .....................................//
$('body').on('click','.editCells',function(){
    const val = Number($(this).data('value')),
          name = $(this).data('name')

          $('#cell_name').val(name)
          $('#cell_name').data('edit',val)
          $('#servCells').modal('show')
})

//REMOVE PLACES .....................................//
$('body').on('click','.removeplaces',function(){
    const val = Number($(this).data('value')),
          isplace =  Number($(this).data('place'))
          let place =0
          if(!isplace)place = SHOPCELLS.find(c=>c.id===val).area_id
          
          if(confirm(lang('Ondoa Sehemu','Remove Place'))){
             const data ={
                data:{
                    delete:1,edit:val,isplace,place
                },
                url:'/setplace'
             }

             sendThedt(data)
          }
})


function placethePleces(data){

    let plc = '',cl = ''
    data.place.forEach(pl => {
         plc+=`
              <div class="btn-group mr-2  shoplaces" data-value=${pl.id} role="group" aria-label="Button group with nested dropdown">
                              <button   type="button" data-value=${pl.id} data-name="${pl.name}" class="btn btn-light placeBtns btn-sm smallFont">
                                  ${pl.name}
                              </button>
                          
                              <div class="btn-group" role="group">
                              <button id="btnGroupDrop1" type="button" class="btn btn-light btn-sm smallFont dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              </button>
                              <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                  <button class="btn btn-default btn-sm smallFont editplaces dropdown-item" data-name="${pl.name}" data-value=${pl.id}  >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>  
                                      ${lang('Kuediti','Edit')}
                                  </button>

                                  <button class="btn btn-default removeplaces btn-sm smallFont dropdown-item" data-value=${pl.id} data-place=1 >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>                                   
                                  ${lang('Ondoa','Remove')}
                                  </button>
                                  
     
                                 </div>
                              </div>
                          </div>
         `

    });

    $('#shopcells').prop('hidden',!data.place.length)

    $('#shopPlaces').html(plc)
    $('.shoplaces').first().addClass('bluebox')

    placecells()
}

function placecells(){
    const place = Number($('#shopPlaces').children('.bluebox').first().data('value'))
     let li = '', nonli = `<li class="text-capitalize  " > <p class="text-center py-3"> ${lang('Hakuna sehemu iliyowekwa','No added place')}</p></li>`
     SHOPCELLS.filter(c=>c.area_id===place).forEach(cl=>{
        li += `<li class="text-capitalize classic_div row p-3 border-bottom" >
                <div class="col-7" >
                  ${cl.name}
                </div>  

                <div class="col-5 text-right" >
                     <button data-value=${cl.id}  class="btn btn-default viewqr_code btn-sm" title="Q-CODE" >
                            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
                                <path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/>
                            </svg>
                     </button>
                     <button data-name="${cl.name}" data-value=${cl.id} class="btn btn-default editCells btn-sm" title="${lang('Kuediti','Edit')}" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                     </button>

                     <button data-value=${cl.id} data-place=0 class="btn btn-default removeplaces btn-sm" title="${lang('Kuondoa','Remove')}"  >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                </div>  

        
        </li>`
     }) 
     
    
     
     $('#shopcells_list').html(li!=''?li:nonli)
}

$('body').on('click','.placeBtns',function(){
   $('.shoplaces').removeClass('bluebox')
   $(this).parent('.shoplaces').addClass('bluebox')

   placecells()

})

$('body').on('click','.viewqr_code',function(){
    $('#download_qr_btn').prop('disabled',true)
    const  cell = $(this).data('value'),
           name = SHOPCELLS.find(c=>c.id===cell).name,
           url = window.location.host,
           imgBox= document.getElementById("imgBox")
           imgBox.innerHTML=''
           $('#cell_name_heading').text(name)

           qrcode = new QRCode('imgBox',{
            text:`${url}/buzinessProfile?value=${DUKANI}&cell=${cell}`,
            height:300,
            width:300,
        })

       $('#cellqr_code_dwn').modal('show')

        setTimeout(function(){
            const sv_url = $('#imgBox').children('img').attr('src')
                            $("#download_qr_btn").attr('href',sv_url) 
                 
                            $('#download_qr_btn').prop('disabled',false) 

            }, 2000)
     

})

