
//KUWEKA SIFA MUHIMU.................................................................//
$('body').on('submit','.sifa_muhimu',function(e){
    e.preventDefault()
    let sifaInput='#'+$(this).children().find('input').attr('id'),
         value=$(this).data('valued'),sifa=$(sifaInput).val(),
         csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
let data={
    data:{
        value:$(this).data('value'),
        valued:value,
        sifa:sifa,
        new:$(this).data('new'),
        csrfmiddlewaretoken:csrfToken
    },
    url:$(this).attr('action'),
    hide:null
}



if(sifa!=''){
    save_features(data)
    
    if($(this).data('value')==0){
        $(sifaInput).val('')
    }

}else{
    redborder(sifaInput)

}
})


//KUWEKA SIFA MUHIMU.................................................................//
$('body').on('submit','.key_sifa',function(e){
    e.preventDefault()
    let value=$(this).data('valued'),
       sifa=$(this).children().find('.meta-title').val(),
       elezo=$(this).children().find('.meta-keyword').val(),
       title='#'+$(this).children().find('.meta-title').attr('id'),
       key='#'+$(this).children().find('.meta-keyword').attr('id'),
       csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

let data={
    data:{
        new:$(this).data('new'),
        value:$(this).data('value'),
        valued:value,
        sifa:sifa,
        elezo:elezo,
        csrfmiddlewaretoken:csrfToken
    },
    url:$(this).attr('action'),
    hide:null
}

if(sifa!='' && elezo!=''){
    save_features(data)
    
    $(this).children().find('.form-control').val('')

}else{
    if(sifa==''){
            redborder(title)

    }
    if(elezo==''){
      redborder(key)
    }

}

})



//KUWEKA SIFA MUHIMU.................................................................//
$('body').on('click','.update-sifa-muhimu',function(e){
    e.preventDefault()
    let value=$(this).data('valued'),
       sifa=$($(this).data('title')).val(),
       elezo=$($(this).data('key')).val(),
       title=$(this).data('title'),
       key=$(this).data('key'),
       csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
let data={
    data:{
        new:$(this).data('new'),
        value:$(this).data('value'),
        valued:value,
        sifa:sifa,
        elezo:elezo,
        csrfmiddlewaretoken:csrfToken
    },
    url:$(this).attr('action'),
    hide:null
}

if(sifa!='' && elezo!=''){
    save_features(data)
    
    $(this).children().find('.form-control').val('')

}else{
    if(sifa==''){
            redborder(title)

    }
    if(elezo==''){
      redborder(key)
    }

}

})



//KUONDOA SIFA.............................................//
$('body').on('click','.ondoa_sifa',function(){

    let value=$(this).data('value')
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    data={
        data:{value:value ,
        csrfmiddlewaretoken:csrfToken
        },
        url:$(this).attr('action'),
        hide:null
    }
   
    if(confirm(lang('Uhakiki wa kuondoa bonyeza Ok','Do you want to remove'))){
        save_features(data)
    }

})

//KUONDOA SIFA.............................................//
$('body').on('click','.ondoa_keficha',function(){

    let value=$(this).data('value')
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    data={
        data:{value:value ,
        csrfmiddlewaretoken:csrfToken
        },
        url:$(this).attr('action'),
        hide:null
    }
   
    if(confirm(lang('Uhakiki wa kuondoa bonyeza Ok','Do you want to remove'))){
        save_features(data)
    }

})


function save_features(data){
    $("#loadMe").modal('show');

    $.ajax({
        type: "POST",
        url: data.url,
         data: data.data,
      }).done(function(respo) {
         let msg = lang(respo.message_swa,respo.message_eng)
      if(respo.success){
          toastr.success(msg, lang('Imefanikiwa','Success Alert'), {timeOut: 2000});
          if('sm' in respo){
            wekaSifa(respo.sifa)
          }

          if('ks' in respo){
            wekaMaelezoKina(respo.keysifa)
          }
           
          if('edt' in respo || 'cs' in respo ){
              location.reload()
          }

          
  
      }else{
           toastr.error(msg, lang('Haikufanikiwa','Error Alert'), {timeOut: 2000});
      }

    })
}
         



//FUNCTION YA SIFA
function wekaSifa(sifa){
    let li=''
    sifa.forEach(s => {
         li+=`<li>       
                    <form action="/stoku/sifa_muhimu" data-value=${s.id} data-valued=${s.bidhaa} data-new=0 class="sifa_muhimu form-inlinle" method="POST">

                        <div class="input-group mb-1">
                        
                            <input type="text" class="form-control border-defaulti smallFont  robotoFont"  value="${s.sifa}" id="sifa_yenyewe${s.id}" placeholder="sifa muhimu kuhusu bidhaa" aria-label="Recipient's username" aria-describedby="button-addon2">
                            <div class="input-group-append">
                                    <button class="btn btn-default text-success smallerFont btn-sm" type="submit" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg>
                                </button>                            
                                </div>
                            <div class="input-group-append">
                               <button action="/stoku/ondoa_sifa" class="btn btn-default lagerFont ondoa_sifa  btn-sm" type="button" data-value=${s.id} >&times;</button>
                            </div>
                        </div>     
                        </form>


                    </li>`
    });
        
 

    

$("#show-sifa-muhimu").html(li)
}



//FUNCTON KUONESHA MAELEZO KINA
function wekaMaelezoKina(sifa){
    let tr=''
    sifa.forEach(ac => {
           tr+=`
           <div class="row classic_div">
             <div class="col-5">
                <input type="text" value="${ac.key}" id="title${ac.id}" class="  meta-title  form-control">
              </div>
              <div class="col-5">
                  <input type="text" value="${ac.sifa}" id="key${ac.id}" class="form-control ml-2  meta-keyword robotoFont font-weight-light ">
              </div>

              <div class="col-2">
                    <button action="/stoku/maelezo_kina" data-key="#key${ac.id}" data-title="#title${ac.id}" data-new=0 data-valued=${ac.bidhaa} data-value=${ac.id} type="submit" class="btn btn-success update-sifa-muhimu btn-sm smallerFont">${lang('Badili','Change')}</button>  
                    <button  data-value=${ac.id} action="/stoku/ondoa_keficha" type="button" data-valued=${ac.bidhaa} class="btn btn-default ondoa_keficha">&times;</button>
              </div>
              
           </div>
            
           <hr/>
          
           
           `
    })

  $('#key_sifa-show').html(tr)
}


//KUEDIT BIDHAA....................................................................................//
$("#kuediti-bidhaa-form").submit(function(e){
    e.preventDefault()
    let   value = $(this).data('value'),
          Jina = ($('#kuedit_jina_la-bidhaa').val()).replace(/[&\/\\#,+$~%"*?<>{}`]/g, ""),
          sirio = $('#bar_code_place').val(),
          Aina = $('#kuedit-bidhaa-aina').find('option:selected').data('value'),
          Chapa = $('#kuedit-bidhaa-chapa').find('option:selected').data('value'),
          Msambazaji = $('#kuediti-bidbaa-msambazaji').find('option:selected').data('value'),
          Bei = $('#kuediti-bidhaa-thamani').val()||Number($('#kuediti-bidhaa-thamani').data('val')),
          namba = $('#item_namba_place').val()
          vipimo_jum = $('#kuediti-bidhaa-vipimo').val() ||  $('#kuediti-bidhaa-vipimo').attr('placeholder') ,
          Bei_reja = $('#kuediti-bidhaa-thamanireja').val() ||  $('#kuediti-bidhaa-thamanireja').data('val'),
          uwiano = Number($('#kuediti-bidhaa-uwiano').val()) || Number($('#kuediti-bidhaa-uwiano').data('val')) || 1,
          vipimo_reja = $('#kuediti-bidhaa-vipimo_reja').val() || $('#kuediti-bidhaa-vipimo_reja').attr('placeholder') ,
          maelezo = $('#kuediti-bidhaa-maelezo').val(),
          material = Number($('#addMaterialtoUse').prop('checked')),
          csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

          

let data={
    data:{
        Jina:Jina,
        namba:namba,
        value:value,
        Aina:Aina,
        Chapa:Chapa,
        Msambazaji:Msambazaji,
        Bei:Bei,
        sirio:sirio,
        material:material,
        maelezo:maelezo,
        vipimo_jum:(vipimo_jum).replace(/[&\/\\#,+$~%"*?<>{}`]/g, ""),
        Bei_reja:Bei_reja,
        uwiano:uwiano,
       
        vipimo_reja:(vipimo_reja).replace(/[&\/\\#,+$~%"*?<>{}`]/g, ""),
      csrfmiddlewaretoken:csrfToken

    },
    url:$(this).attr('action'),
    hide:null
 
}

$('#Item_editModal').modal('hide')
  save_features(data)
})


// IMAGE PREVIEW ................................................//
// const inputFile = document.getElementById('produ-pic')
const imageView = document.getElementById('image_preview')

// Multiple images preview in browser for items with no color

$('#produ-pic').on('change',function(){
    imagepreview(this)
})

function imagepreview(input){
    // imageView.innerHTML=""
    $('#image_preview').html('')
    
    if (input.files) {
        var filesAmount = input.files.length, fsize=0;

        for (i = 0; i < filesAmount; i++) {
                fsize+=input.files[i].size
            var reader = new FileReader();

            reader.onload = function(event) {
                const imgR = `<div class="col-12 mb-2">
                                <img src="${event.target.result}" style="width:100%" >
                              </div>  
                `
                // $($.parseHTML('<img>')).css({'max-width':'140px','max-height':'140px'}).attr({'src': event.target.result,'class':'m-2'}).appendTo(imageView);
                    
                $(imgR).appendTo(imageView)
           
            }
            
            // $('#show_size').html(`<i> file(s) size <b>${Number(fsize/(1024)).toFixed(2)}KB </b> </i> `)

            reader.readAsDataURL(input.files[i]);
        }
    }

   if(input.files.length>0) $('#thePreviewModal').modal('show')

}


//KUWEKA PICHA YA BIDHAA...............................................................................///
$('#save-produ-img').submit(function(e){
    e.preventDefault();
    const url = $(this).attr('action')
    const imgIn = document.getElementById('produ-pic')
    const itm = $(this).data('itm'),
          color = $('#hold-color-id').val()
    

    IMGFORM.append('hold-color-id',color)
    IMGFORM.append('hold-produ-id',itm)

    $('#thePreviewModal').modal('hide')

    IMGFORM.append('IMG',null)

    for (i = 0; i < imgIn.files.length; i++) {
     
     
        IMGFORM.delete('IMG')
        const img = imgIn.files[i],
              last = (i==(Number(imgIn.files.length)-1))
      let theData = {url}

    if(Number(img.size/1024) <= 490){
        IMGFORM.append('IMG',img)
          if(last) theData = {url,itm}
          ImageUpload(theData)

        }else{
           
                theData = {img,url}
                if(last) theData = {img,url,itm}
                compressImg(theData)
        }
          
        if(i==(Number(imgIn.files.length)-1)){
            IMGFORM.delete('hold-color-id')
            IMGFORM.delete('hold-produ-id')
            IMGFORM.delete('IMG')
           
            
        }
    }

//     let extension = $('#produ-pic').val().split('.').pop().toLowerCase(),
//         itm =  $(this).data('itm')    
//     if(jQuery.inArray(extension, ['jfif','png','jpg','jpeg']) == -1)
//     {
//         alert("Invalid Image File");
//         $(this).trigger("reset");
//         $('#produ-picture').prop('disabled',true)
//     $('#theText').text('Chagua picha')
//         return false;
//        }
//        else
//        {

//     var form = $(this)
//     var formData = new FormData(this);
//       $("#loadMe").modal('show');
  
//  $.ajax({
//         url: form.attr("action"),
//         type: 'POST',
//         data: formData,
//         cache: false,
//         processData: false,
//         contentType: false,
//         success: function (response) {
//         var msg = lang(response.message_swa,response.message_eng)

//              hideLoading()
//              if(response.success){
//                 $('#produ-picture').prop('disabled',true)
//                 $('#theText').text(lang('Chagua picha','Choose image file'))
//                 // getStokuData()
//                 // let imgs=response.img,val=response.color

//                 //   placeImg(ItemPicha.state,val)
//                 getItemData(itm,0)
//                 //  let sized=ItemsSize.state
                 
//                 //  sizing(sized,val,produ_id)

//              }else{
//                 toastr.error(msg, 'Error Alert', {timeOut: 2000});

//              }

        
//         },
//         cache: false,
//         contentType: false,
//         processData: false
//     });

   

//        }

});


//KUONDOA PICHA YA BIDHAA.........................................................//
$('body').on('submit','.Ondoa_picha',function(e){
    e.preventDefault()
    let valued=$(this).data('valued'),
    itm = $(this).data('item')

    var csrfToken = $('input[name=csrfmiddlewaretoken]').val()
let data={
    data:{
        value:valued,
        csrfmiddlewaretoken:csrfToken

    },
    url:$(this).attr('action'),
    hide:null


}


if(confirm(lang('Ondoa picha hii?','remove this image ?'))){
    $("#loadMe").modal('show');

    $.ajax({
        type: "POST",
        url: data.url,
         data: data.data,
      }).done(function(response) {
         $("#loadMe").modal('hide');
         hideLoading()
        if(response.success){

           $('#produ-picture').prop('disabled',true)
           $('#theText').text('Chagua picha')
           let imgs=response.img,val=response.color

     
            ItemPicha= ItemPicha.filter(p=>p.id!=valued)
       

             let vali = $('#penye-rangi').children('.redbox').data('rangi') || $('#penye-rangi').children('.the_identify').first().data('rangi') || 0
               placeImg(ItemPicha,vali)

        }else{
            var msg = lang(response.message_swa,response.message_eng)
           toastr.error(msg, 'Error Alert', {timeOut: 2000});

        }

      })
}

})


//ON CLICKING THE color .......................
$('.the_identify').click(function(){
    $('#jina-la_rangi').val($(this).data('jina'))
    $('#chaguo-la-langi').val($(this).data('code'))
    $('#Other_color_name').val($(this).data('other'))
    $('#weka-rangi-ya-bidhaa').data('rangi',$(this).data('val'))
  })

//KUEDIT RANGI YA BIDHAA.......................................................................//
$('#weka-rangi-ya-bidhaa').submit(function(e){
    e.preventDefault()
    let    value = $(this).data('value'),
            csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
            rangi_jina=$('#jina-la_rangi').val() || $('#jina-la_rangi').attr('placeholder'),
            other_name = $('#Other_color_name').val() || $('#Other_color_name').attr('placeholder'),
            color_code=$('#chaguo-la-langi').val()
           

    let data={
        data:{
            other_name:other_name,
            valued:value,
            color_name:rangi_jina,
            color_code:color_code,
            idadi_jum:0,
            idadi_reja:0,
            mpya:'false',
            rangi:$(this).data('rangi'),
            csrfmiddlewaretoken:csrfToken


        },
        url:$(this).attr('action')
       
    }

    
    
        if($(rangi_jina).val()!=''){
            $('#kuweka-rangi-model').modal('hide')
            save_features(data)
        }else{
            redborder('#jina-la_rangi')
        }
    
})

//ON CLICKING THE SIZE  .......................
$('body').on('click','.item_sized_',function(){
    $('#jina-la_size').val($(this).data('jina'))
    $('#weka-size-ya-bidhaa').data('size',$(this).data('val'))
    $('#weka-size-ya-bidhaa').data('rangi',$(this).data('color'))
  })



//KUWEKA SIZE YA BIDHAA.............................................//
$('#weka-size-ya-bidhaa').submit(function(e){
    e.preventDefault()
    let   value = $(this).data('value')
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    let size_jina=$('#jina-la_size').val()
    
    let data={
        data:{
            valued:value,
            size_name:size_jina,
            idadi_jum:0,
            idadi_reja:0,
            mpya:'false',
            rangi:$(this).data('rangi'),
            size:$(this).data('size'),
            csrfmiddlewaretoken:csrfToken


        },
        url:$(this).attr('action'),
        hide:'#kuweka-size-model'
    }

 
        if($('#jina-la_size').val()!=''){
             $('#kuweka-size-model').modal('hide')
            save_features(data)
            $(`#siz${data.data.size}`).text(data.data.size_name)
            
        }else{
            redborder('#jina-la_size')
        }
   
})

function ShowToItemVistors(dt){
    const {chk,itm} = dt
    data={
      data:{
       chk:Number(chk),
       itm:Number(itm),
    },
    url:'stoku/ShowItemToVistors'
  }
  let send = POSTREQUEST(data)
      send.then(data=>{
         if(data.success){
              toastr.success(lang(data.msg_swa,data.msg_eng), lang('Imefanikiwa','Success'), {timeOut: 2000});
         }else{
              toastr.error(lang(data.msg_swa,data.msg_eng), lang('Haikufanikiwa','Error'), {timeOut: 2000});
  
         }
      }) 
  
  
  }


