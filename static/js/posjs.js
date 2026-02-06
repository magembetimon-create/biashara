POSDATA = true 
PAGERELOAD = true
let selected = [],
    POS_ITMS = [],
    ITM_CATEG = 0,
    POSCART = [],
    search_itm = ()=> $('#searchInputForItmm').val(),
    ITMPRICES = [],
    onlyCart = false,
    cartItms = [],
    VAT_allowed = false,
    TOT_SUM,
    Servs = [],
    ServsC = [],
    ServsS = []


const vat_per = Number($('#vat_percent').val()),
      IS_SERVICE = Number($('#ItemListView').data('serv')),
      cartSvg = `
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                    <path d="M8 16H15.2632C19.7508 16 20.4333 13.1808 21.261 9.06908C21.4998 7.88311 21.6192 7.29013 21.3321 6.89507C21.045 6.5 20.4947 6.5 19.3941 6.5H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M8 16L5.37873 3.51493C5.15615 2.62459 4.35618 2 3.43845 2H2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M8.88 16H8.46857C7.10522 16 6 17.1513 6 18.5714C6 18.8081 6.1842 19 6.41143 19H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="10.5" cy="20.5" r="1.5" stroke="currentColor" stroke-width="1.5" />
                    <circle cx="17.5" cy="20.5" r="1.5" stroke="currentColor" stroke-width="1.5" />
            </svg>
       `,

       cancelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                        <path d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg> `


     
   
// function getColor_Size(coloredItemb,ItemsSizeb){
//    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
//    time = moment().format()
//    $.ajax({
//      type: "POST", 
//        url: "/mauzo/Bei_tu",
//      data: {t:time,s:Number($('#add_bill_item').data('service')) || 0,csrfmiddlewaretoken:csrfToken},
//    }).done(function(data){

//        if(data.bei.length>0){
//            The_price.state=data.bei
//        }
//        let servs = Number($('#add_bill_item').data('service')) || 0
//        if(servs){
//            Servs.state = data.servs
//            ServsC.state = data.servsC
//            ServsS.state = data.servsS
           
//        }


//    })




   const thetm = moment().format(),
         toSend = {
            data:{t:thetm,s:IS_SERVICE},
            url:"/mauzo/Bei_tu"
         },
         thenSend = POSTREQUEST(toSend)
        
         thenSend.then(dt=>{
             if(dt.bei.length)ITMPRICES=dt.bei
            if(IS_SERVICE) {
                Servs= dt.servs
                ServsC= dt.servsC
                ServsS= dt.servsS

            }
            
         })



function posdata(c){

 let categ_butn = `
   <li  class="py-1">
            <button data-aina=0 data-categ=0 class="btn border categsBtn text-left text-capitalize latoFont btn-block btn-default">

                 ${lang('Aina Zote','All Categories')}

                 </button>
            </li>`,

     Categ = []
     if(Items.state?.length){

        // Work on categories ........
            
            const goods = x => (Number(x.Bei_kuuza)>0 || !x.material) && !x.service,
                  Services = x => x.service,
             
                all_item = Items.state.filter(x=>IS_SERVICE?Services(x):goods(x)),
                itemsK = [...new Set(all_item.map(i=>i.aina))] 
                 
                        Categ = itemsK.map(i=>getAllItm(i))
                            function getAllItm(i){
                            
                                    return {
                                            id : i,
                                            aina: all_item.filter(itm=>itm.aina === i)[0].ainaN,
                            
                                }
                            }

                        

                        Categ.sort(function(a, b) {
                            return a.aina.localeCompare(b.aina);
                        });

                        Categ.forEach(c => {
                            categ_butn += `
                                    <li class="py-1" >
                                        <button data-aina=${c.id} data-categ=1 class="btn border categsBtn text-left text-capitalize latoFont btn-block btn-light">
                                        ${c.aina}
                                        </button>
                                    </li>
                            `
                        });


                        $('#categsList').html(categ_butn)


                        // WORK ON ITEMS
                        let itms_data = [],
                            colr = coloredItem.state,
                            sz = ItemsSize.state


                        all_item.forEach(itm=>{

                           let itmC = colr.filter(it=>itm.bidhaa_id===it.bidhaa)
                           if(itmC.length){
                             //Item with color ..............................//
                               itmC.forEach(ci=>{
                                  szC=sz.filter(s=>s.sized__color===ci.color)   

                                    if(szC.length){
                                        //Item with color and size............................//
                                        szC.forEach(szd=>{
                                            itms_data.push({
                                                'id':itm.id,
                                                'name':itm.bidhaaN,
                                                'aina':itm.aina,
                                                'color_name':ci.color__color_name,
                                                'color_nick':ci.color__nick_name,
                                                'color_id':ci.id,
                                                'size_name':szd.sized__size,
                                                'size_id':szd.id,
                                                'maelezo':itm.maelezo,
                                                'bei':itm.Bei_kuuza,
                                                'bei_jum':itm.Bei_kuuza_jum,
                                                'thamani':itm.Bei_kununua,
                                                'bidhaa':itm.bidhaa_id,
                                                'idadi':szd.idadi,
                                                'picha':ItemImg.state.filter(im=>im.color_produ===ci.color)[0]?.picha__picha,
                                                'namba':itm.namba,
                                                'brand':itm.brand,
                                                'vipimo':itm.vipimo,
                                                'uwiano':itm.uwiano,
                                                'vipimo_jum':itm.vipimoJum,
                                                'notsure':itm.notsure,
                                                'vat_included':itm.taxInclusive,
                                                'timely':itm.timely,
                                                'sirio':itm.sirio
                                            })   
                                        })

                                    }else{
                                          //Item with color but no size......................//
                                          itms_data.push({
                                                'id':itm.id,
                                                'name':itm.bidhaaN,
                                                'aina':itm.aina,
                                                'color_name':ci.color__color_name,
                                                'color_nick':ci.color__nick_name,
                                                'color_id':ci.id,
                                                'size_name':null,
                                                'size_id':0,
                                                'idadi':ci.idadi,
                                                'maelezo':itm.maelezo,
                                                'bei':itm.Bei_kuuza,
                                                'bei_jum':itm.Bei_kuuza_jum,
                                                'thamani':itm.Bei_kununua,
                                                'bidhaa':itm.bidhaa_id,
                                                'picha':ItemImg.state.filter(im=>im.color_produ===ci.color)[0]?.picha__picha,
                                                'namba':itm.namba,
                                                'brand':itm.brand,
                                                'vipimo':itm.vipimo,
                                                'uwiano':itm.uwiano,
                                                'vipimo_jum':itm.vipimoJum,
                                                'notsure':itm.notsure,
                                                'vat_included':itm.taxInclusive,
                                                'timely':itm.timely,
                                                'sirio':itm.sirio
                                            })   

                                    }

                                  
                               })
                           }else{
                            // itm with no color.................//
                                itms_data.push({
                                     'id':itm.id,
                                     'name':itm.bidhaaN,
                                     'aina':itm.aina,
                                     'color_name':null,
                                     'color_nick':null,
                                     'color_id':0,
                                     'size_name':null,
                                     'size_id':0,
                                     'idadi':itm.idadi,
                                     'maelezo':itm.maelezo,
                                     'bei':itm.Bei_kuuza,
                                     'bei_jum':itm.Bei_kuuza_jum,
                                     'thamani':itm.Bei_kununua,
                                     'bidhaa':itm.bidhaa_id,
                                     'picha':ItemImg.state.filter(im=>im.bidhaa===itm.bidhaa_id)[0]?.picha__picha,
                                     'namba':itm.namba,
                                     'brand':itm.brand,
                                     'vipimo':itm.vipimo,
                                    'uwiano':itm.uwiano,
                                    'vipimo_jum':itm.vipimoJum,
                                    'notsure':itm.notsure,
                                    'vat_included':itm.taxInclusive,
                                    'timely':itm.timely,
                                    'sirio':itm.sirio

                                  })

                           }
                        })

                         

                         POS_ITMS = itms_data
                         posItms()

     }
        


}

function posItms(){
    let pitm = ` `,
        allItms = POS_ITMS
    if(ITM_CATEG!=0){
       allItms = allItms.filter(ct=>ct.aina===ITM_CATEG)
    }

    VAT_allowed = Items.state[0].vat_allow
    

    if(search_itm()!=''){
        const seV = search_itm(),
        serchItms = []

        allItms.forEach(itm=>{
            var regrex = /[^a-z0-9 ]/gi,
                searched = new RegExp(seV?.replace(regrex,''), 'i'),
                srch = `${itm.name} ${itm.namba} ${itm.color_name} ${itm.size_name} ${itm.color_nick}  ${itm.brand}`

            if(srch.match(searched)){
                serchItms.push({
                    'id':itm.id,
                    'name':itm.name,
                    'aina':itm.aina,
                    'color_name':itm.color_name,
                    'color_nick':itm.color_nick,
                    'color_id':itm.color_id,
                    'size_name':itm.size_name,
                    'size_id':itm.size_id,
                    'idadi':itm.idadi,
                    'maelezo':itm.maelezo,
                    'bei':itm.bei,
                    'bei_jum':itm.bei_jum,
                    'thamani':itm.thamani,
                    'bidhaa':itm.bidhaa,
                    'picha':itm.picha,
                    'namba':itm.namba,
                    'brand':itm.brand,
                    'vipimo':itm.vipimo,
                    'uwiano':itm.uwiano,
                    'vipimo_jum':itm.vipimo_jum,
                    'notsure':itm.notsure,
                    'vat_included':itm.vat_included,
                    'timely':itm.timely
                   })
               }


         })

         allItms = serchItms


    }

    if(onlyCart)allItms = cartItms
     
    
    allItms.forEach(pi=>{
      const siz = pi.size_name!=null?`<i class="d-block" >Size:<strong class="brown text-uppercase" >${pi.size_name}</strong></i>`:'',
           color_nik = pi.color_nick!=''?`(${pi.color_nick})`:'',
           color = pi.color_name!=null?`<small> <i class="text-primary" >${pi.color_name}${color_nik}</i> </small> `:''  ,
           picha =`<img src="${pi.picha?pi.picha:'/static/pics/img.svg'}" alt="${lang('Hakuna Picha','No Image')}">`,
           indx = `${pi.id}${pi.color_id}${pi.size_id}`,
           cart = POSCART.filter(itm=>itm.id===pi.id && itm.color===pi.color_id && itm.size===pi.size_id),
           cartqty = cart.length?cart[0].qty:0,
           hidden = cartqty?'':'hidden',
           dura = servDura(),
           
           //this is for Serving service...
           servedI=Servs.filter(p=>p.produ===pi.id && moment(dura.servFrom||moment()) <= moment(p.to) && moment(dura.servTo||moment()) >= moment(p.From) ),
           servedC=ServsC.filter(p=>p.color===pi.color_id && moment(dura.servFrom||moment()) <= moment(p.to) && moment(dura.servTo||moment()) >= moment(p.From) ),
           servedS=ServsS.filter(p=>p.size===pi.size_id && moment(dura.servFrom||moment()) <= moment(p.to) && moment(dura.servTo||moment()) >= moment(p.From)  )
           let svdQty = 0

           if(dura.servFrom&&dura.servTo){
            if(servedI.length)svdQty=servedI.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 
            if(servedC.length)svdQty=servedC.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 
            if(servedS.length)svdQty=servedS.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0)   
           }
          



           pitm+=`
            <li class="list-unstyled" ${IS_SERVICE&&pi.idadi==svdQty?'hidden':''} >



                  <button class="itm_click" data-pos=${indx} data-itm=${pi.id} data-color=${pi.color_id} data-size=${pi.size_id} >

                    <figure>
                         ${picha}

                 <div class="text-right" style="margin-top:-30px;z-index:9999" >
                    <span data-qty=${cartqty} ${hidden} id="itmclickqty${indx}" class="bg-success border px-1" style="height:15px;width:15px;border-radius:50%;color:#fff" >
                     ${cartqty}</span>
                 </div>                          

                      <h6 class="text-capitalize pt-2" >${siz} ${color} ${pi.name}</h6>
                      <small>${pi.maelezo}</small>
                     <small class="text-primary ml-2 text-italic"  ><i> ${pi.vipimo}</i>.</small><small>${Number(pi.idadi-svdQty).toLocaleString()}</small>
                    </figure>

                    <div class="pos-product-price">
                     ${CURRENCII}. ${Number(pi.bei).toLocaleString()} 
                         <svg width="24" height="24" viewBox="0 0 24 24">
                          <title>Add</title><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>
                    </div>
                  </button>


                </li>
      `

           
    })

    $('#pos_itms').html(pitm)
    goTo('#ItemListView')
}

$('body').on('click','.categsBtn',function(){
   const ain = $(this).data('aina')
         $('.categsBtn').removeClass('text-primary')
         $('.categsBtn').removeClass('border-primary')

         if(ain){
              $(this).addClass('text-primary')
              $(this).addClass('border-primary')
         }

         ITM_CATEG = ain
         posItms()
})

$('body').on('click','.itm_click',function(){
    const itm = $(this).data('itm'),
          colr =  $(this).data('color'),
          sz =  $(this).data('size'),
          pos = $(this).data('pos'),
        //   seleqty = $(`#itmclickqty${pos}`),
        //   qty = seleqty.data('qty'),
          clicItm = POS_ITMS.find(it=>it.id===itm&&it.color_id===colr&&it.size_id===sz),
          vipimo = ItemUnits(clicItm),
          dt = {vipimo,pi:clicItm,pos},
          
         itmV = viewSelItem(dt),
         dura = servDura()

        //   curqty = Number(qty+1)

        //   seleqty.prop('hidden',false)

        //   seleqty.data('qty',curqty)

        //   seleqty.text(curqty) 

          

            
        //  placeItm({itm:clicItm,pos,qty:curqty})
         if(!IS_SERVICE||dura.servFrom&&dura.servTo&&dura.servFrom<dura.servTo){
            $('#posItemSelect').modal('show')
            $('#selectedItemView').html(itmV.itm)

            if(itmV.multiSelect){
                $('#UnitsPOS').val(itmV.unit)
            }
         }else{
             $('#Duration_modal').modal('show')
         }
          




})


function viewSelItem(dt){

    const pi = dt.pi,
          pos = dt.pos,

          vipimo = dt.vipimo

    let   tot_p = pi.bei,
          theBei = '',
          cartqty = 1,
          addCartqty = '',
          vat_set = false,
          VAT_inclusive = false,
          DECSC = '',
          CANCEL_BTN = false

    const siz = pi.size_name!=null?`<i>Size:<strong class="brown text-uppercase" >${pi.size_name}</strong></i>`:'',
          color_nik = pi.color_nick!=''?`(${pi.color_nick})`:'',
          color = pi.color_name!=null?` <i class="text-primary text-capitalize" >${pi.color_name}${color_nik}</i>  `:''  ,
          picha =`<img style="max-width: 100%;"  src="${pi.picha?pi.picha:'/static/pics/img.svg'}" alt="${lang('Hakuna Picha','No Image')}">`,
          
          cart = POSCART.filter(itm=>itm.id===pi.id && itm.color===pi.color_id && itm.size===pi.size_id),
          theSameItm = POSCART.filter(itm=>itm.id===pi.id)
          


    const VAT_show = !VAT_allowed?'hidden':'',
          
          DISABLED = theSameItm.length && theSameItm.length!=cart.length?'disabled':'',
          READONLY = theSameItm.length && theSameItm.length!=cart.length?'readonly':'',
          dura = servDura(),
          servT = IS_SERVICE?dura.dura.find(d=>d.value===pi.timely):{name:'',duration:1,opt:'',value:0},
          servD = IS_SERVICE?`<div class="row col-12 pt-1" >
                <div class="col-6">${lang('Kuanzia','From')}:<strong class="brown">${moment(dura.servFrom).format('MM/DD/YYYY HH:mm')}</strong> </div>
                <div class="col-6">${lang('Hadi','To')}:<strong class="brown">${moment(dura.servTo).format('MM/DD/YYYY HH:mm')}</strong></div>
              </div>`:''
          VAT_inclusive = pi.vat_included
           
          if(theSameItm.length ){
            DECSC =`<div class="d-flex mb-1" >
                         <div class="d-flex justify-content-center align-items-center" >   
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>

                          </div>   
                         
                            <div class="ml-2" >
                            ${lang('Bidhaa Nyingine ya aina hii yenye rangi/size tofauti imeshawekwa kapuni, hivyo <u class="brown" >bei haitabadilishwa</u>',"Onother item of the same kind with diffent color/size has already added, hence <u class='brown' >price won't be changed</u>")}
                            </div>
                        </div>` 
            tot_p = theSameItm[0].bei
            theBei = tot_p!=pi.bei?`value=${tot_p}`:''
            vat_set = theSameItm[0].vat_set
            VAT_inclusive = theSameItm[0]?.vat_include
          }

          if(cart.length){
            cartqty = cart[0].qty
            if(cartqty>1)addCartqty=`value=${Number(cartqty)}`
            CANCEL_BTN = true
            const addedDESC = `<div class="mt-1" > 
                                   
                                      <strong class="text-success" >&check; </strong>  ${lang('Bidhaa tayari imeshawekwa kapuni','Item has already added')} 
                                    
                                    
                                        <button  style="display:inline;right:0" class="btn text-danger btn-sm  smallFont latoFont btn-light removeCart" title="${lang('Ondoa','Remove')}" data-pos=${pos} data-color=${pi.color_id} data-itm=${pi.id} data-size=${pi.size_id} >
                                            &times; ${lang('Ondoa','Remove')}
                                        </button>
                                   
                                 </div>`
            DECSC += addedDESC

            if(theSameItm.length==cart.length){
             DECSC = addedDESC
             }
          }

                   
    let svdQty = 0,ItmQty = 0 //Item qty
    const notsure = Number(pi.notsure) || 0,
          VAT = vat_cal({bei:tot_p,idadi:cartqty,inclusive:VAT_inclusive,servT:pi.timely?(servT.duration):1}),
          VAT_include = (VAT_inclusive&&VAT_allowed)?'checked':'',
          VAT_checked = theSameItm[0]?.vat_set ||(VAT_inclusive&&VAT_allowed)?'checked':'',

          //Check for serving service
          
          servedI=Servs.filter(p=>p.produ===pi.id && moment(dura.servFrom||moment()) <= moment(p.to) && moment(dura.servTo||moment()) >= moment(p.From) ),
          servedC=ServsC.filter(p=>p.color===pi.color_id && moment(dura.servFrom||moment()) <= moment(p.to) && moment(dura.servTo||moment()) >= moment(p.From) ),
          servedS=ServsS.filter(p=>p.size===pi.size_id && moment(dura.servFrom||moment()) <= moment(p.to) && moment(dura.servTo||moment()) >= moment(p.From)  )
          

          if(servedI.length)svdQty=servedI.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 
          if(servedC.length)svdQty=servedC.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 
          if(servedS.length)svdQty=servedS.reduce((a,b)=> Number(a) + (Number(b.idadi)-Number(b.serviceReturn)),0) 
     
          if(dura.servFrom&&dura.servTo)ItmQty = pi.idadi - svdQty

       

         let Uopt = ''
         const cost_jum = Number(vipimo.filter(pm=>pm.jum)[0]?.qty) || 1
         vipimo.forEach(u=>{
            Uopt+=`<option data-wholeqty=${cost_jum} data-jum=${u.jum} data-bei=${u.price} data-ratio=${u.qty} data-unit="${u.unit}" value=${u.qty} >${u.unit}</option>`
         })

        tot_p = tot_p*cartqty

       

        // vat_cal({bei:tot_p,idadi:1,inclusive:pi.vat_included})
   
                 const itm  = `
               ${servD}  
               <h6 class="col-12 latoFont py-2 text-capitalize"  > ${siz} ${color} ${pi.name} </h6>
               
               <div class="col-5 col-md-6 ">
                   <div>
                       ${picha}
                    </div>   

                    
                         
                    
                     <div class="form-group mt-2">
                       <label for="item_serial" > ${lang('Namba ya Bidhaa','Item Code')}</label>
                        <textarea id="item_serial" rows="2" class="form-control smallFont latoFont" > </textarea>
                     </div>
                </div>
                <div class="col-7 col-md-6 px-0 row">
                     

                     <div class="col-12">
                         ${lang('Bei','Price')}(<span class="text-primary">${CURRENCII}</span>)
                     </div>

                     <div class="col-12">
                     <div>
                         <div class="input-group">
                            <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
                              <label class="mt-1" for="bill_kuuza_jum1"></label> 
                              <div class="box-pointert d-inline "></div>
                          </div>

                            <input type="number" id="itemCartPrice" ${READONLY} ${theBei} data-tm=${pi.timely?servT.duration:1}  data-notsure=${notsure} data-thamani=${Number(pi.thamani)} data-bei=${Number(pi.bei)} name="itemCartPrice" placeholder="${Number(pi.bei).toLocaleString()}" class="money-fomat priceSetPOS form-control smallerFont btn-sm"  >
                          </div>   
                              <div class="custom-control  custom-checkbox" ${VAT_show} >
                                        <input type="checkbox" ${VAT_include} ${DISABLED}  data-pos=${pos} class="custom-control-input vat-include vat_checkbox" id="na_vat">
                                        <label class="custom-control-label latoFont smallerFont" for="na_vat"> 
                                        ${lang(' pamoja na VAT  ',' VAT  included  ')} ${vat_per}%
                                        </label>
                                </div>
                         
                            </div>
                     </div>

                     <div class="col-12 pt-1">
                         ${IS_SERVICE?lang('nafasi','Space'):lang('Idadi','Qty')}
                     </div>
                     <div class="col-12 pb-1">
                         <div class="input-group">
                             <select class="form-control btn-sm smallerFont input-group input-prepend" name="UnitsPOS" id="UnitsPOS">
                                 ${Uopt}
                             </select>
                            

                            <input type="number" placeholder="1"  ${addCartqty}  data-itm=${pi.id} data-pos=${pos} data-color=${pi.color_id} data-size=${pi.size_id} data-qty=${ItmQty} id="ItmQtyPOS" class="input-group form-control priceSetPOS smallerFont btn-sm"  >
                         </div>
                     </div>

                     <div ${IS_SERVICE?'':'hidden'} class="col-12 pt-1">
                         ${lang('Muda','Duration')}
                     </div>
                     <div ${IS_SERVICE?'':'hidden'} class="col-12 pb-1">
                         <div class="input-group">
                             <select class="form-control btn-sm smallerFont input-group input-prepend" name="duraPOS" id="duraPOS">
                               ${IS_SERVICE?servT.opt:'<option>Days</option>'}
                             </select>
                            

                            <input type="number" placeholder="${IS_SERVICE?servT.duration:'1'}" readonly  id="ServDuration" class="input-group form-control priceSetPOS smallerFont btn-sm"  >
                         </div>
                     </div>


                     <div class="col-12 pt-1" ${VAT_show} >
                         ${lang('Jumla','Total')}(<span class="text-primary">${CURRENCII}</span>)
                     </div>
                     <div class="col-12  pb-1" ${VAT_show} >
                         <div class="input-group">
                            <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
                                <label class="mt-1" for="bill_kuuza_jum1"></label> 
                                <div class="box-pointert d-inline "></div>
                            </div>
                            <input type="number" id="ItmTotalPricePOS" readonly style="font-weight: bolder;" placeholder="${Number(VAT_inclusive?VAT.VPrice:tot_p*(pi.timely?servT.duration:1)).toLocaleString()}" class="money-fomat form-control  "  >
                         </div>
                     </div>

                     <div class="col-12  pt-1" ${VAT_show} >
                         VAT(<span class="text-primary">${CURRENCII}</span>)
                     </div>
                     <div class="col-12  pb-1" ${VAT_show}>
                                <div class="row classic_div">
                                        <span class=" float-left idadi-units_disp${pos}" style="font-size: 11px;color:rgba(240, 248, 255, 0)"></span>
                                    </div> 
                                        <div class="custom-control jum-panel${pos} custom-checkbox">
                                            <input type="checkbox" ${VAT_checked}  ${DISABLED} data-vat=1 class="custom-control-input vat-fill vat_checkbox" id="vatallow-jum">
                                            <label class="custom-control-label" for="vatallow-jum"> 
                                                <input type="text" placeholder=${Number(VAT.VAT).toLocaleString()} data-vat_val=0  readonly class="smallerFont made-input" id="vat-disp-jum" style="width:100%">
                                            </label>
                                        </div>
                                        
                                       
                     </div>

                     <div class="col-12 pt-1">
                         <strong>${lang('Jumla','Total')}</strong>(<span class="text-primary">${CURRENCII}</span>)
                     </div>
                     <div class="col-12  pb-1">
                         <div class="input-group">
                            <div class="show_curency_blockt show_curency position-absolute text-danger   px-3" style="display: none ;">
                                <label class="mt-1" for="bill_kuuza_jum1"></label> 
                                <div class="box-pointert d-inline "></div>
                            </div>
                            <input type="number" id="ItmSubTotalPOS" readonly style="font-weight: bolder;" placeholder="${Number(vat_set&!VAT_inclusive?(tot_p*(pi.timely?servT.duration:1))+VAT.VAT:tot_p*(pi.timely?servT.duration:1)).toLocaleString()}" class="money-fomat form-control  "  >
                         </div>
                     </div>


                        <div class="col-12 mt-2 text-right  " >
                            <span class="p-1 border ${ItmQty==0?'border-danger':''} " id="onshelfIndicatorPOS" >
                            <span class="border-right mr-1 text-danger" ${ItmQty==0?'':'hidden'}  id="qtyAlertPOS" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>

                            </span>
                              ${notsure?lang('Makadilio','Expectetion'):lang('zilizopo','onshelf')}: <i class="text-primary"> ${pi.vipimo}</i>.${Number(ItmQty)}
                            </span>
                        </div>

                        <div class="text-right col-12 py-2" id="lossAlertPOS" hidden  style="font-size:12px"  > 
                            <span class="border-right mr-1 " style="color:rgb(158, 134, 0)" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>

                            </span>
                           <i> ${lang('Hasara','loss')}: ${CURRENCII}.<strong id="lossShowPos" class="brown" ></strong> </i> 
                        </div> 
                </div>

                <div class="col-12 "  >
                      ${DECSC}
                           
                </div>
                
                `
                return {itm,multiSelect:theSameItm.length,unit:theSameItm[0]?.uwiano}

            }

$('body').on('keyup','.priceSetPOS',function(){
    const price = Number($('#itemCartPrice').val()) || Number($('#UnitsPOS').find('option:selected').data('bei')),
          qty = Number($('#ItmQtyPOS').val()) || 1,
          wholeqty = Number($('#UnitsPOS').find('option:selected').data('wholeqty')),
          servT = Number($('#itemCartPrice').data('tm')),
          total = price * qty * servT,
          unitratio = Number($('#UnitsPOS').val()),
          onshelf = Number($('#ItmQtyPOS').data('qty')),
          thamani = (Number($('#itemCartPrice').data('thamani'))*unitratio)/wholeqty,
          notsure = Number($('#itemCartPrice').data('notsure')),
          na_vat = $('#na_vat').prop('checked'),
          allow_vat = $('#vatallow-jum').prop('checked'),
          VAT = vat_cal({bei:price,idadi:qty,inclusive:na_vat,servT})

          


          $('#ItmTotalPricePOS').attr('placeholder',Number(allow_vat&&na_vat?VAT.VPrice:total).toLocaleString())
          $('#ItmSubTotalPOS').attr('placeholder',Number(allow_vat&&!na_vat?VAT.VPrice:total).toLocaleString())
          $('#vat-disp-jum').attr('placeholder',Number(VAT.VAT).toLocaleString())

          //Check if qty is not exceeded .........................................//
          if(unitratio*qty>onshelf&&!notsure){
            $('#onshelfIndicatorPOS').addClass('redborder')
            $('#qtyAlertPOS').prop('hidden',false)
        }else{
            $('#onshelfIndicatorPOS').removeClass('redborder')
            $('#qtyAlertPOS').prop('hidden',true)
        }
         
        if(thamani>(price*unitratio)&&!IS_SERVICE){
           $('#lossAlertPOS').prop('hidden',false)
           $('#lossShowPos').text(Number(thamani-(price*unitratio)).toLocaleString())
        }else{
            $('#lossAlertPOS').prop('hidden',true)
        }

})

$('body').on('change','#UnitsPOS',function(){
     const price = Number($(this).find('option:selected').data('bei')),
           qty = Number($('#ItmQtyPOS').val()) || 1,
           servT = Number($('#itemCartPrice').data('tm')),
           total = price * qty * servT,
           unitratio = Number($(this).val()),
           onshelf = Number($('#ItmQtyPOS').data('qty')),
           thamani = Number($('#itemCartPrice').data('thamani'))*unitratio,
           notsure = Number($('#itemCartPrice').data('notsure')),
           na_vat = $('#na_vat').prop('checked'),
           allow_vat = $('#vatallow-jum').prop('checked'),
           VAT = vat_cal({bei:price,idadi:qty,inclusive:na_vat,servT})
 
            $('#itemCartPrice').val('')
           
           $('#itemCartPrice').attr('placeholder',Number(price).toLocaleString())
           $('#ItmTotalPricePOS').attr('placeholder',Number(allow_vat&&na_vat?VAT.VPrice:total).toLocaleString())
           $('#ItmSubTotalPOS').attr('placeholder',Number(allow_vat&&!na_vat?VAT.VPrice:total).toLocaleString())
           $('#vat-disp-jum').attr('placeholder',Number(VAT.VAT).toLocaleString())
 
           //Check if qty is not exceeded .........................................//
           if(unitratio*qty>onshelf&&!notsure){
             $('#onshelfIndicatorPOS').addClass('redborder')
             $('#qtyAlertPOS').prop('hidden',false)
         }else{
             $('#onshelfIndicatorPOS').removeClass('redborder')
             $('#qtyAlertPOS').prop('hidden',true)
         }
 
        //  if(thamani>(price)&&!IS_SERVICE){
        //     $('#lossAlertPOS').prop('hidden',false)
        //     $('#lossShowPos').text(Number(thamani-price).toLocaleString())
        //  }else{
        //      $('#lossAlertPOS').prop('hidden',true)
        //  }
})

//VAT CHECK BOXES
$('body').on('change','.vat_checkbox',function(){
        const price = Number($('#itemCartPrice').val()) || Number($('#UnitsPOS').find('option:selected').data('bei')),
        servT = Number($('#itemCartPrice').data('tm')),
        qty = Number($('#ItmQtyPOS').val()) || 1,
        total = price * qty *servT,
        isvat = Number($(this).data('vat')) || 0,
        
        na_vat = $('#na_vat').prop('checked'),
        allow_vat = $('#vatallow-jum').prop('checked'),
        VAT = vat_cal({bei:price,idadi:qty,inclusive:na_vat,servT})

        
        $('#ItmTotalPricePOS').attr('placeholder',Number(allow_vat&&na_vat?VAT.VPrice:total).toLocaleString())
        $('#ItmSubTotalPOS').attr('placeholder',Number(allow_vat&&!na_vat?VAT.VPrice:total).toLocaleString())
        $('#vat-disp-jum').attr('placeholder',Number(VAT.VAT).toLocaleString())

        if(isvat&&!allow_vat)$('#na_vat').prop('checked',false)
})

//ADD TO CART...........
$('body').on('click','#addtoCartbtn',function(){
    const qtyIn = $('#ItmQtyPOS'),
          color = qtyIn.data('color'),
          size = qtyIn.data('size'),
          itm = qtyIn.data('itm'),
          pos = qtyIn.data('pos'),
          qty = Number(qtyIn.val()) || 1,
          clicItm = POS_ITMS.find(it=>it.id===itm&&it.color_id===color&&it.size_id===size),

          price = Number($('#itemCartPrice').val()) || Number($('#UnitsPOS').find('option:selected').data('bei')),
       
          total = price * qty,
          units = $('#UnitsPOS').find('option:selected').data('unit'),
          jum = Number($('#UnitsPOS').find('option:selected').data('jum')),
          unitratio = Number($('#UnitsPOS').val()),
          onshelf = Number($('#ItmQtyPOS').data('qty')),
          thamani = Number($('#itemCartPrice').data('thamani'))*unitratio,
          notsure = Number($('#itemCartPrice').data('notsure')),
          na_vat = Number($('#na_vat').prop('checked')),
          allow_vat = Number($('#vatallow-jum').prop('checked')),
          serial = $('#item_serial').val()

          if((unitratio*qty<=onshelf) || notsure){
             placeItm({itm:clicItm,pos,qty,total,units,unitratio,na_vat,allow_vat,jum,serial})
             $('#posItemSelect').modal('hide')
          } 


         
})


function vat_cal(dt){
    const  bei = dt.bei,
           idadi = dt.idadi,
           bei_og = dt.bei_og,
           vat_pert = vat_per/100,
           servT = dt.servT
       

    let bei_with_vat = bei*idadi*servT*(1+vat_pert)
    let bei_with_vat_og = bei_og*idadi*servT*(1+vat_pert)
    let vat = bei * idadi*servT * vat_pert
    // let the_totol = sel_act_t

    if(dt.inclusive){
        bei_with_vat = idadi*servT*bei/(1+vat_pert)
        bei_with_vat_og = idadi*servT*bei_og/(1+vat_pert)
        vat = bei_with_vat * vat_pert
        // t_bei_with_vat = sel_act_t
        // the_totol=sel_tw_vat
    }
   
    const VATp = {
        'VAT':vat,
        'VPrice':bei_with_vat,
        'OGPrice':bei_with_vat_og
        
    }

    return VATp
    

}


// CART LIST .............................................................//
function placeItm(data){

    const  pi = data.itm,
           siz = pi.size_name!=null?`<i>Size:<strong class="brown text-uppercase" >${pi.size_name}</strong></i>`:'',
           color_nik = pi.color_nick!=''?`(${pi.color_nick})`:'',
           color = pi.color_name!=null?` <i class="text-primary text-capitalize" >${pi.color_name}${color_nik}</i>  `:''  ,
           dura = IS_SERVICE?servDura().dura.find(d=>d.value===pi.timely):{name:'',duration:1,opt:'',value:0},
           servT = IS_SERVICE?dura.duration:1,
           tms = IS_SERVICE&&pi.timely?`&times;<span>${dura.duration}</span><span class="text-primary">${dura.name}</span>`:'',
           picha =`<img style="max-width: 40px;"  src="${pi.picha?pi.picha:'/static/pics/img.svg'}" alt="${lang('Hakuna Picha','No Image')}">`
    const  li = `
                 <li class="d-flex border-bottom pb-2 itempos${data.pos}" id="itempos${data.pos}" >
                        <div class="d-flex pr-1 justify-content-center align-items-center" >
                           ${picha}
                        </div>

                        <div>
                        <div class="d-flex"  >     
                            <div class="text-capitalize smallFont" style="min-width:190px" >  ${siz} ${color} ${pi.name} </div>
                            <div class="col-2 text-right "  >         
                            <span type="button" data-pos=${data.pos} data-color=${pi.color_id} data-itm=${pi.id} data-size=${pi.size_id} class=" removeCart" style="font-size:15px" >&times;</span>
                            </div>
                        </div>

                        <div class="row smallerFont">
                            <div class="${IS_SERVICE?'col-8':'col-7'}"> 
                                  
                                     <span class=" add-reduce-btn  " ><span class="text-primary">${CURRENCII}</span>.${Number(data.total/data.qty).toLocaleString()} &times; ${data.qty}</span><span class="add-reduce-btn   text-primary" >${data.units}</span>${tms} 
                                        
                            </div>
                            <div class="${IS_SERVICE?'col-4':'col-5'}"> 
                                     <span class="text-primary" >${CURRENCII}.</span> <strong class="py-1 " style="color:var(--text-muted)" >${Number(data.total*(pi.timely?dura.duration:1)).toLocaleString()} </strong> 
                                     
                            </div>
                        </div>

                        </div>
                    
                    </li> 

             `,
           posItm = [{
              id:pi.id,
              color:pi.color_id,
              size:pi.size_id,
              bei:Number(data.total/data.qty),
              bei_og:pi.bei,
              qty:data.qty,
              uwiano:data.unitratio,
              jum:data.jum,
              match:0,
              vat_set:data.allow_vat,
              vat_include:data.na_vat,
              serial:data.serial.replace(/[/[&\/\\#,+=$~"*?<>`]/g, ""),
              servT,
              notsure:pi.notsure,
              timely:pi.timely
             
           } ] 
           
           if(POSCART.filter(itm=>itm.id===pi.id&&itm.color===pi.color_id&&itm.size===pi.size_id).length){

           
              POSCART = POSCART.map(obj => replaceItem(obj) );
              
               function replaceItem(obj){
                    const itm = posItm.find(o => o.id === obj.id && o.color===obj.color && o.size===obj.size) || obj
                   return itm
               }

              

            }else{
             POSCART.push(posItm[0]) 
             cartItms.push(pi)
           }


            if(POSCART.length){
                $('#cart-indicator').fadeIn(200)
            }

            $('#cartCounter').text(POSCART.length)
            
           $(`#itmclickqty${data.pos}`).prop('hidden',false)
           $(`#itmclickqty${data.pos}`).text(data.qty*data.unitratio)
   

    if($(`.itempos${data.pos}`).length){
        $(`#itempos${data.pos}`).replaceWith(li)
    }else{
        $('#pos_cart').append(li)
    }

    checkout()

}


$('body').on('click','.removeCart',function(){
      const itm = $(this).data('itm'),
            colr =  $(this).data('color'),
            sz =  $(this).data('size'),
            pos = $(this).data('pos')


     if(confirm(lang('Ondoa Bidhaa','Remove Item')))
        {
        
        $(`#itempos${pos}`).remove()
        POSCART = POSCART.filter(obj => !(obj.color===colr && obj.size===sz && obj.id===itm) );
        cartItms = cartItms.filter(obj => !(obj.color_id===colr && obj.size_id===sz && obj.id===itm) )   
         posItms()

         $('#posItemSelect').modal('hide')

         checkout()
        
        }

        if(POSCART.length){
            $('#cart-indicator').fadeIn(200)
        }else{
            $('#cart-indicator').fadeOut(100)
        }

        $('#cartCounter').text(POSCART.length)


})


function ItemUnits(itm){

            let units=[], 
            units1 = {
            'id':0,
            unit:itm.vipimo,
            price:Number(itm.bei),
            qty:1,
            made:false,
            jum:0,
        }

        units.push(units1)



        let md = m=>m.item_id === itm.bidhaa
        const madep = ITMPRICES.filter(md)


        let madone = madep.map(u =>{
            let obj = {
                'id':u.id,
                'unit':u.jina,
                'price':u.bei,
                'qty':u.idadi,
                'made':true,
                'jum':0,
            }
            return obj
            
        })



        if (Number(itm.uwiano)>1){
           let units2={ 
                    'id':0,
                    'unit':itm.vipimo_jum,
                    'price':Number(itm.bei_jum),
                    'qty':itm.uwiano,
                    'made':false,
                    'jum':1
                }

                units.push(units2)
        }

        units =[...units,...madone]

        return units
}

// DISPLAY CART ITEMS ONLY................................//
$('#selected_items').click(function(){
    onlyCart = !onlyCart
    $('#cart_svg').html(onlyCart?cancelSvg:cartSvg)
    posItms()
})


// CHECKOUT PANEL..............................................//


function checkout(){
   let Tot = 0,
       disc = 0,
       VAT_ = 0,
       subTot = 0,
       Og_pr = 0


       POSCART.forEach(pi=>{

        const servTm = pi.timely?pi.servT:1

         const  VAT = vat_cal({bei_og:pi.bei_og,bei:pi.bei,idadi:pi.qty,inclusive:pi.vat_include,servT:servTm})
          
          subTot  += pi.vat_set&pi.vat_include?VAT.VPrice:(pi.bei*pi.qty*servTm)
          Tot += pi.vat_set&!pi.vat_include?VAT.VPrice:(pi.bei*pi.qty*servTm)

          VAT_+= pi.vat_set?VAT.VAT:0,

          Og_pr+=pi.vat_set&pi.vat_include?VAT.OGPrice:(pi.bei_og*pi.qty*servTm)
       })
        
        
               
       const check = `
                           <div ${!VAT_allowed?'hidden':''} class="row">
                
                                <div class="col-5">
                                   ${lang('Jumla kwa Bei','Sub Total')}
                                </div>
                                <div class="col-7 text-right">
                                    <strong>${Number(subTot).toLocaleString()}</strong>  
                                </div>
                            </div>
                  
                           
                            <div ${!VAT_allowed?'hidden':''} class="row">

                                <div class="col-5">
                                    VAT 
                                </div>
                                <div class="col-7 text-right">
                                    <strong>${Number(VAT_).toLocaleString()}</strong>  
                                </div>
                            </div>
                           
                            <h6 class="row border-top">

                                <div class="col-5">
                                   ${lang('Jumla','Total')}
                                </div>
                                <div class="col-7 text-right">
                                    <strong> ${Number(Tot).toLocaleString()} </strong>
                                </div>
                           </h6>
       
                   `
       $('#checkout_panel').html(check)

       TOT_SUM={
         Tot,
         VAT_,
         subTot,
         Og_pr
       }

}


$('#Checkout_btn').click(function(){
    if(POSCART.length){
       
        const DISC = TOT_SUM.Og_pr > TOT_SUM.subTot
        const sum = `
            
                           <div ${!DISC?'hidden':''} class="row">
                
                                <div class="col-5">
                                   ${lang('Jumla kwa Bei','Total By Price')}
                                </div>
                                <div class="col-7 text-right">
                                   <small class="text-primary"> ${CURRENCII}</small>.<strong>${Number(TOT_SUM.Og_pr).toLocaleString()}</strong>  
                                </div>
                            </div>

                           <div ${!DISC?'hidden':''} class="row">
                
                                <div class="col-5">
                                   ${lang('Punguzo','Discount')}
                                </div>
                                <div class="col-7 text-right">
                                    <small class="text-primary"> ${CURRENCII}</small>.<strong>${Number(TOT_SUM.Og_pr-TOT_SUM.subTot).toLocaleString()}</strong>  
                                </div>
                            </div>

                           <div ${!VAT_allowed?'hidden':''} class="row">
                
                                <div class="col-5">
                                   ${lang('Jumla kwa Kuuza','Sub Total')}
                                </div>
                                <div class="col-7 text-right">
                                    <small class="text-primary"> ${CURRENCII}</small>.<strong>${Number(TOT_SUM.subTot).toLocaleString()}</strong>  
                                </div>
                            </div>
                  
                           
                            <div ${!VAT_allowed?'hidden':''} class="row">

                                <div class="col-5">
                                    VAT 
                                </div>
                                <div class="col-7 text-right">
                                    <small class="text-primary"> ${CURRENCII}</small>.<strong>${Number(TOT_SUM.VAT_).toLocaleString()}</strong>  
                                </div>
                            </div>
                           
                            <h6 class="row border-top">

                                <div class="col-5">
                                   ${lang('Inayolipwa','Payable')}
                                </div>
                                <div class="col-7 text-right">
                                  <small class="text-primary"> ${CURRENCII}</small>.<strong> ${Number(TOT_SUM.Tot).toLocaleString()} </strong>
                                </div>
                           </h6>
        
        `
        $('#inayolipwa_invoice').attr('placeholder',Number(TOT_SUM.Tot).toLocaleString())
        $('#inayolipwa_invoice').data('pay',Number(TOT_SUM.Tot))
        $('#pos_summary').html(sum)

        if(IS_SERVICE&&(moment(servDura().servFrom).format()<=moment().format())){
            $('#order_btn').hide()
        }else{
            $('#order_btn').show()
        }

        const tmdiff = moment(servDura().servFrom).diff(moment(),'minutes')
        console.log(tmdiff); 
        if(IS_SERVICE&&(tmdiff>15)){
            $('#sales_btn').hide()
        }else{
            $('#sales_btn').show()
        }


        $('#Checkout_modal').modal('show')
    }else{
        toastr.warning(lang('Taarifa','info'), lang('Hakuna Bidhaa Iliyochaguliwa','No Item has selected'), {timeOut: 3000});

    }
    
})




$('#itm_cart_switch_btn').click(function(){
   const lV = isInViewport()
   goTo('#theCartList')
})




window.addEventListener("scroll", function () {
 
       if(isInViewport()){
        $('#cart-indicator').fadeOut(100)    
       }else{
        $('#cart-indicator').fadeIn(100) 
       }
       

}, false);


function isInViewport() {
    const el = document.getElementById('theCartList')
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}

//SAVE POS DATA...............................................//
$('.save_pos_data').unbind("click").click(function(){
    const oda = $(this).data('order') ,
          itm =  [...new Set(POSCART.map(i=>i.id))],
          colr= POSCART.filter(c=>c.color!=0),
          onlyColr = [...new Set(colr.map(c=>c.color))],
          color_data = onlyColr.map(c=>theColored(c)),
          szd=POSCART.filter(s=>s.size!=0),
          szd_data = szd.map(s=>theSized(s)),
          itm_dt = itm.map(i=>arrange_dt(i)),
          dura = servDura(),
          servFrom =IS_SERVICE?moment(dura.servFrom).format():moment().format(),
          servTo = IS_SERVICE?moment(dura.servTo).format():moment().format()

          function theSized(dt){
            return {
                'idadi':dt.qty,
                'size':dt.size,
                'color':dt.color,
                'notsure':dt.notsure,
                'itm':dt.id
            }
          }
           
        function theColored(dt){
            return {
                'color':dt,
                'itm':colr.filter(i=>i.color===dt)[0].id,
                'idadi':colr.filter(c=>c.color===dt).reduce((a,b)=> a + Number(b.qty),0)
            }
        }  

        function arrange_dt(dt){
            const itmDt = POSCART.filter(i=>i.id===dt) ,
                  theItm =  itmDt[0],
                  data = {
                    color:color_data.filter(i=>i.itm===dt),
                    size:szd_data.filter(s=>s.itm===dt),
                    bei: theItm.vat_set && !theItm.vat_include?(theItm.bei*(1+(vat_per/100))):theItm.bei,
                    idadi:itmDt.reduce((a,b)=> a + Number(b.qty),0),
                    idn:dt,
                    bei_set:theItm.bei!=theItm.bei_og,
                    vat_set:theItm.vat_set,
                    vat_include:theItm.vat_include,
                    value:dt,
                    jum:theItm.jum,
                    notsure:theItm.notsure,
                    uwiano:theItm.uwiano,
                    match:0,
                    servT:theItm.timely?theItm.servT:1,
                    serial:theItm.serial,
                    timely:theItm.timely
                
            }
            return data
          }


          const    custom= Number($('#lim_num').data('cust')),
                    bill_no = 'none',code_set = 0,
                    cusom_name = $('#lim_num').val(),
                    address =    $('#cust_address').val(),
                    simu =       $('#cust_phone').val(),
                    mail =       $('#cust_mail').val(),
                    reg = $('#lim_num').data('reg') || 0 ,
                    reg_val = $('#lim_num').data('reg_val') || 0,
                    date= moment().format('YYYY-MM-DD'),
                    lipaEleza = $('#lipaElezo').val(),

                    inalipiwa = $('#bill_tobe_paid').prop('checked') || false,
                    akaunt = ($('#malipo-akaunti').find('option:selected').data('value')) || 0,
                    due_date = $('#tarehe_kulipa').val(),

                    

                    
                    
                    invo_am = Number($('#inayolipwa_invoice').data('pay')),
                    custom_set=custom!=0?1:0,
                    
                    acont_amount = inalipiwa && Number(akaunt)>0?Number($('#inayolipwa_invoice').val()):0
                    

                    
                  let amount_set = false, amount = Number($('#inayolipwa_invoice').data('pay')) || 0
                      

                    


                    if($('#inayolipwa_invoice').val()!=''){
                        amount = Number($('#inayolipwa_invoice').val()) || 0
                        amount_set =true
                    }
                  
            const   data={
                    data:{
                        edit:0,
                        service:IS_SERVICE,
                        servFrom:servFrom,
                        servTo,
                        now:moment().format(),
                        desc:'',
                        oda:oda,
                        rudi:0,
                        toLabor:0,
                        rudi_val:0,
                        bill:0,
                        sup:custom,
                        date:date,
                        bill_no:bill_no,
                        code_set:code_set,
                        inalipwa:Number(inalipiwa),
                        akaunt:Number(akaunt),
                        amount:amount,
                        amount_set:Number(amount_set),
                        kulipa:due_date,
                        invo_am:invo_am,
                        resev:0,
                        ch:0,
                        lipaEleza:lipaEleza,
                        //  exp_set:Number(exp_set),
                        //  exp_dt: JSON.stringify(expenses),
                        itm_dt: JSON.stringify(itm_dt),
                        
                        cusom_name:cusom_name,
                        address:address,
                        simu:simu,
                        mail:mail,
                        reg:reg,
                        reg_val:reg_val,
                        custom_set:custom_set,
                      
                    } ,    
                        url:'/mauzo/addInvoice'
                    
                    }

          

          if(cusom_name.length>3){
            if((!inalipiwa && due_date!='') || (inalipiwa && Number(akaunt)>=1 && (amount==invo_am || due_date!='')  ) ){
                 if(amount<=invo_am) {
                $('#Checkout_modal').modal('hide')
                $('#loadMe').modal('show')

                const sendit = POSTREQUEST(data)
                sendit.then(respo=>{
                    $('#loadMe').modal('hide')
                    hideLoading()
                        if(respo.success){
                            const action_btns = `
                               <button type="button"  class="btn btn-secondary actionbtns" data-invo=0 data-dismiss="modal">Close</button>
       
                                     <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                                        <button id="print_invo_btn" data-lang="${lang(0,1)}"  type="button" data-invo=${respo.bil}  class="btn btn-primary actionbtns btn-sm smallFont">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                                            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
                                            </svg>
                                                ${inalipiwa?lang('Toa Risiti','Print Recept'):lang('Chapa Ankara','Print Invoice')} 
                                            
                                        </button>
                                    
                                        <div class="btn-group" role="group">
                                        <button id="btnGroupDrop1" type="button" class="btn btn-primary btn-sm smallFont dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                            <button class="btn btn-default actionbtns dropdown-item" data-invo=${respo.bil} data-lang=0 >Swahili</button>
                                            <button class="btn btn-default actionbtns dropdown-item" data-invo=${respo.bil} data-lang=1 >English</button>
                                        </div>
                                        </div>
                                    </div>



                            `
                             $('#pos_saved_succefully_footer').html(action_btns)

                             toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 2000});
                             $('#pos_saved_modal').modal('show')
                            }else{
                             toastr.error(lang(respo.message_swa,respo.message_eng), 'Error Alert', {timeOut: 3000});
                         }
            }
            )
            }else{
                        alert(lang('Kiasi kilicholipwa ni zaidi ya kiasi cha ankara','Payed amount exceeds invoice amount'))
                    }
            }else{
                if((due_date==''&&!inalipiwa)|| (amount!=invo_am && due_date=='')){
                    alert(lang('Tafadhari weka tarehe ya kulipa','Please set  bill Due date'))
                    redborder('#tarehe_kulipa')
                }

                if(inalipiwa && Number(akaunt)<1 ){
                    alert(lang('Tafadhari chagua akaunti ya malipo','Please select Payment account'))
                     $('#malipo-akaunti').selectpicker('setStyle', 'border-danger');
    
                }
               

            }

      

          }else{
            redborder('#lim_num')
            alert(lang('Tafadhari andika jina la mteja','Please write customer name'))
          }

})




//Search customer btn
$('#customer_search_btn').click(function(){
    const code = $('#lim_num').val()
                               
    if(code!=''){
       $('#search_svg').prop('hidden',true)
       $('#loadCustomer').prop('hidden',false)
        data={
            data:{
                code:code,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
            },
            url:'/search_member'
        }
        $('.suggest-holder2n input').val('')
        $('.suggest-holder2n input').data('reg_val',0)
        $('.suggest-holder2n input').data('reg',0)
        $('#cust_address').val('')
        $('#cust_phone').val('')

    $.ajax({
        type:'POST',
        url:data.url,
        data:data.data
    }).done(function(dt){
        if(dt.success) {

          $('#loadCustomer').prop('hidden',true)
          $('#search_svg').prop('hidden',false)
          
           
            let dtu = dt.user[0]
            $('.suggest-holder2n input').val(dtu.name)
            $('.suggest-holder2n input').data('reg_val',dtu.id)
            $('.suggest-holder2n input').data('reg',1)
            $('#cust_address').val(`${dtu.mtaaN} ${dtu.wilaya} ${dtu.mkoa}`)
            $('#cust_phone').val(dtu.phone)
        }else{
            
               toastr.error(lang(dt.msg_swa,dt.msg_eng ), 'error Alert', {timeOut: 4000});

        }
    })

}
})

//SET SERVICE DURATION INPUT VALIDATION.......................//
$('.serviceDuration').change(function(){
       const dura = servDura()
       if(dura.servFrom&&dura.servTo && dura.servFrom>dura.servTo){
          redborder('.serviceDuration')
       }
    })

 //SET DURATION    
 $('#set_duration_time').click(function(){
       const dura = servDura()
      if(dura.servFrom && dura.servTo && dura.servFrom<dura.servTo){
         
            const   dr = `
                  <div class="col-3">
                    ${lang('Kuanzia','From')}:
                   </div>
                   <div class="col-9 text-right">
                   ${moment(dura.servFrom).format('MM/DD/YYYY HH:mm')}
                   </div>
                   <div class="col-3">
                    ${lang('Hadi','To')}:
                   </div>
                   <div class="col-9 text-right">
                   ${moment(dura.servTo).format('MM/DD/YYYY HH:mm')}
                   </div>
               `
               $('#serv_duration').html(dr)
               $('#duration_error').prop('hidden',true)

               $('#Duration_modal').modal('hide')


      }else{
        redborder('.serviceDuration')
        $('#duration_error').prop('hidden',false)
      }
 })

const servDura = () =>{
    const servFrom =IS_SERVICE?$('#serviceFrom').val() :moment().format(),
          servTo = IS_SERVICE?$('#ServiceTo').val() :moment().format(),
          min = moment(servTo).diff(moment(servFrom),'minutes'),
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
          istime = tmd.filter(t=>t.isTrue)[0],
                            dura = [
                                {
                                    value:0,
                                    name:istime?.name,
                                    duration:istime?.value,
                                    opt:`<option value=3 >${istime?.name}</option>`

                                },
                             {
                             value:1,
                             name:lang('dakika','Minute(s)'),
                             duration:Math.ceil(min),
                             opt:`<option value=1 >${lang('dakika','Minute(s)')}</option>`
                           },
                             {
                             value:2,
                             name:lang('Saa','hour(s)'),
                             duration:Math.ceil(min/60),
                             opt:`<option value=2 >${lang('Saa','hour(s)')}</option>`
                           },
                             {
                             value:3,
                             name:lang('Siku','Day(s)'),
                             duration:Math.ceil((min/60)/24),
                             opt:`<option value=3 >${lang('Siku','Day(s)')}</option>`
                           },
                             {
                             value:4,
                             name:lang('Wiki','Week(s)'),
                             duration:Math.ceil(((min/60)/24)/7),
                             opt:`<option value=4 >${lang('Wiki','Week(s)')}</option>`
                           },
                             {
                             value:5,
                             name:lang('mwezi','Month(s)'),
                             duration:Math.ceil(min/(60*24*31)),
                             opt:`<option value=5 >${lang('Miezi','Months(s)')}</option>`
                           },
                             {
                             value:6,
                             name:lang('Miaka','Year(s)'),
                             duration:Math.ceil(Number(Math.ceil(min/(60*24*31)))/12),
                             opt:`<option value=6 >${lang('Miezi','Months(s)')}</option>`
                           },
                        
                        ]
          return {
            servFrom,
            servTo,
            dura
          }

 

}

//Check for the serving service in case the timedate setting modal is closed
$('#Duration_modal').on('hide.bs.modal', function(){
    posItms()
})






