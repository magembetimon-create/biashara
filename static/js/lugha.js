  
const IMGFORM = new FormData()

let RELOAD = 0 // this is for uploading image if the page require reload after uloading
let REPlACE_BANNER = 0 //This is to replace the banner location
let GETIMAGEDATA = 0 //For richtext editor images reload
let LAST_FOR_COLOR_IMAGES = false // a variable to clear images for color
let POSDATA = false
let PAGERELOAD = false
const  currencii= $('#entpCurrencii').val(),
      CURRENCII = `<span class="text-primary weight400 smallFont">${currencii}</span>`,
      ISMOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var  IMG_WIDTH = 500

const item_modal_is_shown = () =>{
    return  $('#add-products').data('bs.modal')?._isShown
}

const FIXED_VALUE = 2,DUKANI = Number($('#accountType').val()),PERSONAL = Number($('#accountType').data('personal')),
        CSRF={csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
        SMALLMEDIA = window.outerWidth < 767,
     
         POSTREQUEST = (data)=>{
            return   $.ajax({
                         type: "POST",
                         url: data.url,
                         data: {...CSRF,...data.data},
                       
               })
               
         },        
         GETREQUEST = (data)=>{
            return   $.ajax({
                         type: "GET",
                         url: data.url,
                         data: data.data,
                       
               })
               
         },       
        //  autoComp = SMALLMEDIA?$('#serchAutoCompleteSmall'):$('#serchAutoComplete'),
floatValue = n => Number(Number(n).toFixed(FIXED_VALUE)).toLocaleString(),
lang = (swa,eng) => Number($('#luga').val())==0?swa:eng

function hideLoading() {
  if($('#loadMe').data('bs.modal')?._isShown){
        $('#loadMe').on('shown.bs.modal', function (e) {
        $("#loadMe").modal('hide');
    })
  }

}

// FOR  SEARCH BAR .......................//
var SEARCH_ONSHELF = 0,SEARCH_ITM_BY_BARCODE=0,ON_SHOP=0
$('.searchBarBtn').click(function (e) { 
      e.preventDefault();

      const url = $(this).attr('href'),
             valued = SMALLMEDIA?$('#searchInputForAllSmall').val():$('#searchInputForAll').val(),
             data = {
                data:{ 
                  duka:$(this).data('duka') | 0,
                  ankara:$(this).data('ankara') | 0,
                  adj:$(this).data('adj') | 0,
                  partner:$(this).data('partner') | 0,
                  valued:valued 
              },
                  url:'/searchAll'
             }
              LoadToDB(data)    
             if(valued==''){
                  location.replace(url)
             }else{

             }

});

$('body').on('click','.search_By_Bar',function (e) { 

 

  e.preventDefault();
  
  SEARCH_ONSHELF = Number($(this).data('onshelf'))
  ON_SHOP = Number($(this).data('shop'))||0
  const pos = Number($(this).data('pos')) || 0,
        addItm = Number($(this).data("addItm")) || 0,
        isItm = $(this).data("isItem")
           
        SEARCH_ITM_BY_BARCODE = !(addItm||pos||isItm)

        // console.log({
        //   addItm,
        //   isItm,
        //   SEARCH_ITM_BY_BARCODE
        // });

        $('#livestream_scanner').data('pos',pos)
        if(ISMOBILE){
          start_can()
        }else{
          $('#livestream_scanner').modal('show')
        }
     
     
     
  
});

function searchBarCode(result){
   
    data = {
      data:{
        valued:result?.codeResult?.code || result,
        code:1,
        onshelf:SEARCH_ONSHELF,
        shop:ON_SHOP,
      },
      url:'/searchAll'
    }
    LoadToDB(data)
}

function LoadToDB(data){
                  const searchPost = POSTREQUEST(data)
                  searchPost.then(resp=>{
                      if(resp.success){
                        location.replace(resp.url)
                      }else{
                        toastr.error(lang('Hakuna Taarifa yeyote iliyopatikana.','No information was found'), lang('Haikufanikiwa','Error Alert'), {timeOut: 2000});

                      }
                  })
}


$('body').on('click', function(e) {
 
  if(jQuery('click').filter('.serchAutoComplete').length===0){
      $('.serchAutoComplete').hide();
  }
  
});


var searchData =  window.setTimeout(function(){loadTheData()},300) 
function AutoCompleteSearch(search){

 window.clearTimeout(searchData)
 searchData = window.setTimeout(function(){loadTheData(search)},300) 

}

function loadTheData(search){

  const valu = search?.valu?.val(),
        th_is = search?.valu,
        autoComp = $(`#${search?.placeto}`),
        forShop = Number(search?.shop) || 0,
        data = {
          data:{valued:valu,forShop} ,
          url:'/ecommerce/autoComlleteSearch'

        } 

        // console.log(forShop)


        if(valu!=''){
            loadSearch = GETREQUEST(data)
            loadSearch.then(respo=>{
              autoComp.fadeOut(100)  
              th_is?.siblings('.loadSearchContent').prop('hidden',true)
              th_is?.siblings('.SearchSvg').prop('hidden',false)

              if(respo.list.length>0){
                const searchItms = [... new Set(respo.list.map(n=>n.itm_name))].map(s=>{
                    const list = {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,
                  searchCateg = [... new Set(respo.list.map(n=>n.categ_name))].map(s=>{
                    const list = {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,
                  searchDesc = [... new Set(respo.list.map(n=>n.itm_desc))].map(s=>{
                    const list =  {name:s,shop:'',id:0} 
                        return list   
                  })
                    
                  ,
                  searchGroup = [... new Set(respo.list.map(n=>n.group_name))].map(s=>{
                    const list =  {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,
                  searchBrand = [... new Set(respo.list.map(n=>n.brand))].map(s=>{
                    const list =   {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,
                  searchMama_eng = [... new Set(respo.list.map(n=>n.Mama_eng))].map(s=>{
                    const list =   {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,
                  searchMama_swa = [... new Set(respo.list.map(n=>n.Mama_swa))].map(s=>{
                    const list =   {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,
                  searchBibi_eng = [... new Set(respo.list.map(n=>n.Bibi_eng))].map(s=>{
                    const list =   {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,
                  searchBibi_swa = [... new Set(respo.list.map(n=>n.Bibi_swa))].map(s=>{
                    const list =   {name:s,shop:'',id:0} 
                        return list   
                  })
                  ,

                  shoppy = [... new Set(respo.list.map(i=>i.Interprise_id))],

                  shopyList = shoppy.map(s=>{ const shopp=respo.list.filter(n=>n.Interprise_id === s)[0]; return {duka:shopp.duka,code:shopp.code,id:s}}),



                  searchShop = shopyList.map(s=>{
                    const list =  {name:s.duka,shop:s.code,id:s.id}
                        return list   
                  }),

                  search = [...searchItms,...searchCateg,...searchDesc,...searchGroup,...searchBrand,...searchShop,...searchMama_eng,...searchMama_swa,...searchBibi_eng,...searchBibi_swa]
                   
                   var  lst = ''


                       search.forEach(se=>{
                          var regrex = /[^a-z0-9 ]/gi,
                              searched = new RegExp(valu?.replace(regrex,''), 'i'),
                              srch = se.name+' '+se.shop
                             const goto_for_all= `${se.shop==''?'/ecommerce/searchpanel?valued='+se.name:'/buzinessProfile?value='+se.id}`,
                                   goto_for_entp = `/searchFromIntp?valued=${se.name}&shop=${forShop}`

                             if(srch.match(searched)){
                                 lst +=`<li class="py-2 border-bottom" > 
                                        <a class="d-block text-capitalize" href="${forShop?goto_for_entp:goto_for_all}">${se.name}${se.shop==''?'':`(${se.shop})`}</a>
                                    </li>`
                             }


                       })

                     autoComp.fadeIn(100)  
                     autoComp.children('ul').html(lst)  




              }
                
            })
        }
       



  
}


function redborder(el){
  $(el).addClass('redborder')
}


function removeRedboder(){
  $('.form-control,.made-input').each(function(){
    if($(this).hasClass("redborder")){
      $(this).removeClass("redborder")
    }
    })
}




$('.findItmDirect').click(function(e){
 e.preventDefault()
 const srch = SMALLMEDIA?$('#searchInputForAllSmall').val():$('#searchInputForAll').val()

 if(srch!=''){
   location.replace(`/ecommerce/searchpanel?valued=${srch}`)
 }
})

$('.searchInputForAll').focus(function () { 
  AutoCompleteSearch()
  
});

function checkToken(token){
  if(token!=''){
    $('#loadMe').modal('show')
    const  data = {
        data:{
            token
        },
        url:'/checkToken'
    },
    sendit = POSTREQUEST(data)

    sendit.then(dt=>{
       
        if(dt.success){
            toastr.success(lang('Tokeni zimehakikiwa kikamilifu.','Token confirmed successfully'), lang('Imefanikiwa','Success'), {timeOut: 2000});
            $('#availableAmo').text(Number(dt.amount).toLocaleString())
            $('#availableAmo').data('amo',Number(dt.amount))
        }else{
            
            toastr.error(lang('Tokeni Sio sahihi au ilishatumika tafadhari jaribu tena kwa usahihi.','Incorrect token or token has been used please try again'), lang('Haikufanikiwa','Error Alert'), {timeOut: 2000});

        }

        

        $('#loadMe').modal('hide')
        hideLoading()

        
    }).fail((jqXHR, exception)=>{
        
             
        toastr.error(lang('Kitendo Hakikufanikiwa kutokana na hitilafu tafadhari jaribu tena.','Error occured during operation please try again'), lang('Haikufanikiwa','Error Alert'), {timeOut: 2000});
        $('#loadMe').modal('hide')
       hideLoading()
        
    })            
  }

}


//Change the dark Mode
$('#cb-switch').change(function () { 
    $('#loadMe').modal('show')
    const val = Number($(this).prop('checked')),
          data={data:{
               val
          },
         url:'/setDarkMode'
        },
        sendIt = POSTREQUEST(data)

        sendIt.then(resp=>{
           $('#loadMe').modal('hide')
           hideLoading()
           
           if(resp.success) $('body').toggleClass('dark')
          
        })


 
});


//IMG UPLOAD...............................//

 function ImageUpload(formData){
    $("#loadMe").modal('show');


          IMGFORM.append("csrfmiddlewaretoken",$('input[name=csrfmiddlewaretoken]').val())
        $.ajax({
            url: formData.url,
            type: 'POST',
            data: IMGFORM,
            cache: false,
            processData: false,
            contentType: false,
            success: function (response) {

              if('itm' in formData)getItemData(formData.itm,0) //This fetcth imageItems after uploanding
              
                $("#loadMe").modal('hide');
                hideLoading()
                if(response.success){

                    toastr.success(lang(response.msg_swa,response.msg_eng), lang('Imefanikiwa','Success'), {timeOut: 2000});
                     if(RELOAD && !item_modal_is_shown())location.reload()  //Reload after upload
                     if(REPlACE_BANNER && !item_modal_is_shown()  )location.replace(`/ecommerce/marketing?bn=${response.bn}&${response.to}`)
                     if(GETIMAGEDATA && !item_modal_is_shown()  )getTheImgs() 
                     
                      if(item_modal_is_shown()){
                      $('#add_Item_Img').val('') 
                      $('#the_galley').html('')
                      if(LAST_FOR_COLOR_IMAGES){
                        $('#img_with_color').html('')
                        LAST_FOR_COLOR_IMAGES = false
                      }
                      
                     }

                     
                      
                }else{
                    toastr.error(lang(response.msg_swa,response.msg_eng), lang('Haikufanikiwa','Error'), {timeOut: 2000});

                }

            
            },
            cache: false,
            contentType: false,
            processData: false
        });

 };


 function compressImg(image_file){
  

  
  let reader = new FileReader
  const FD = [] //create an objects array to append other form data 
 
    for (const pair of IMGFORM.entries()) {
        
        FD.push({'key':pair[0],'value':pair[1]})
      }

  reader.readAsDataURL(image_file.img)
 


  reader.onload = (event) => {

     

      let image_URL = event.target.result
      let image = document.createElement("img")
      image.src = image_URL
      
 

      image.onload = (e) => {
          let canvas =document.createElement("canvas")
          let ratio = IMG_WIDTH / e.target.width
          canvas.width = IMG_WIDTH
          canvas.height = e.target.height * ratio

          const context = canvas.getContext("2d")

          context.drawImage(image, 0, 0, canvas.width, canvas.height)

          let new_image_url = context.canvas.toDataURL("image/jpeg",80)


          IMGF = urltoFile(new_image_url)

          // console.log({
          //     'origin':image_file.img.size/1024,
          //     'IMG':IMGF.size/1024
          // }); 
             if(FD.length){
                FD.forEach(v=>{
                  IMGFORM.append(v.key,v.value)
                })
             }
             

              IMGFORM.append('IMG',IMGF)



              let theData = {url:image_file.url}
              if('itm' in image_file) theData = {url:image_file.url,itm:image_file.itm}
                
              ImageUpload(theData)


      }

      
  }

 
}


let urltoFile = (url) =>{
  let arr = url.split(",")
  // console.log(arr)
  let mine = arr[0].match(/:(.*?);/)[1]
  let dt = arr[1]

  let dataStr=atob(dt)
  let n = dataStr.length
  let dataArr = new Uint8Array(n)

  while(n--){
      dataArr[n] = dataStr.charCodeAt(n)
  }

let fname = `IMG-${moment().format('YYYYMMDDHHmmssSSSS')}.jpg` ; 
let file = new File([dataArr],fname,{type: mine});

 return file 
}


let ImgPreview =(input,preview,b4modal)=>{
  let image_file = input.files[0]
//   console.log(input);
  
  let imgLink = URL.createObjectURL(image_file)

  preview.html(`<img src="${imgLink}" style="width:100%">`)
  b4modal.modal("show")

//   console.log('object');

}


//FOR MINI AND PAPER INVOICES
$('.receipt_options').click(function(){
    $('.receipt_options').removeClass('text-primary')
    $('.receipt_options').removeClass('bluebox')
   
    $(this).addClass('text-primary')
    $(this).addClass('bluebox')
    
   const min = Number($(this).data('min')),
         data = {
              data:{min},
              url:"/setInVoFormat"
         }
      $('#print_mini').data('active',min)

      const sendIt = POSTREQUEST(data)
   
})

//PRINTING IVOICES.................................//
$('body').on('click','.actionbtns',function(){
  const invo = Number($(this).data('invo')) || 0,
        lugha= Number($(this).data('lang')),
        min = Number($('#print_mini').data('active')),
        pu = Number($(this).data('pu'))||0,
        theHref = $(this).data('href'),

        url = pu?`/purchase/Risitiprint?qp=${invo}&lang=${lugha}`:`/mauzo/Invoprint?item_valued=${invo}&lang=${lugha}&m=${min}`,
        dtaInv = {
            dta:{
                data:{i:pu?0:invo,p:pu?invo:0},
                url:'/mauzo/printforInv'
            },
            url
        },

        dtaOther = {
          dta:{data:{i:0},
          url:'/mauzo/printforInv'
        },
        url:theHref
      }

  $('#pos_saved_modal').hide()

  
     allowPrintForNative(invo?dtaInv:dtaOther)


  
  
})


 function allowPrintForNative(data){
       const url = data.url

       
      if(ISMOBILE){
       

        const sendIt = POSTREQUEST(data.dta)
        
        sendIt.then(resp=>{
          
          if(resp.success){
             const theUrl = `${url}&r=${resp.id}`
            //  window.ReactNativeWebView.postMessage(theUrl)
             window.open(theUrl,'_blank')
             if(PAGERELOAD)location.reload()


          }else{
            toastr.error(lang(resp.msg_swa,resp.msg_eng), lang('Haijafanikiwa','Error'), {timeOut: 4000});

          }
        })

        // location.replace(url)
       
    }else{
         window.open(url,'_blank')
         if(PAGERELOAD)location.reload()

    }
}


function eTime(tm){
const  min = moment(tm.sT).diff(moment(tm.sF),'minutes'),
        hr = min/60,
        dys = hr/24,
        wk = dys/7,
        tmd = [{
            name:lang('dakika','Minute(s)'),
            isTrue:hr<1,
            value:Math.ceil(min)
        },
        {
          name:lang('Siku','Day(s)'),
          isTrue:dys>=1,
          value:Math.ceil(dys)
        },

        {
            name:lang('Saa','hour(s)'),
            isTrue:hr<24&&hr>=1,
            value:Math.ceil(hr)
        }],

        istime = tmd.filter(t=>t.isTrue)[0]

        return istime
}

