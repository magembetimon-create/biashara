
// this will hold a value that detect whether the user has alreard selected a supllier by holding the state value
class selected_supplier{
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
let supplier_selected = new selected_supplier(false)

// this will hold Items color
class colored{
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

let coloredItem = new colored([])

class images{
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
  imgs=[]
  let ItemImg=new images(imgs)

// hifadhi bidhaa baada ya kuletwa na function ya getstoku.............................................//
  class storeProducts{
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
  
  let Items =new storeProducts([])

// hifadhi size baada ya kuletwa na function ya getstoku.............................................//
  class storeSize{
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
  
 let ItemsSize =new storeSize([])


// Store OutStore Data.............................................//
  class OutStore{
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

 let StoreNje =new OutStore([])

// Store OutStore color Data.............................................//
  class OutStoreColor{
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
 let stokucolor =new OutStoreColor([])

// Store OutStore color Data.............................................//
  class OutStoreSize{
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
 let stokusize =new OutStoreSize([])

 var cust=class Customers{
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
var customers =new cust([])

class AinaTu{
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
let Categs = new AinaTu([])

class KampuniTu{
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
let brands = new KampuniTu([])

class KundiTu{
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
let pcategs = new KundiTu([])

class wakusambaza{
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
let sambazia = new KundiTu([])

class prodxnCost{
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
let prdxnCost = new prodxnCost([])


// all emploee and used by salesGive.js
class  TheEmployed{
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
  var thewakazi = new TheEmployed([])

getStokuData("/stoku/getItemsAssociate")


$('#group_categ_select').change(function(){
    const c = Number($(this).val())  

    $('#group_select').val(0)
    $('#group_select').removeClass('darkblue')
    $(`#group_select option`).hide()
	$(`#group_select option[value=0]`).show()

	
    $('#group_select').prop('disabled',true)
    $(this).removeClass('darkblue')

    if (c){
        $(`#group_select option[data-aina=${c}]`).show()
        $('#group_select').prop('disabled',false)
        $(this).addClass('darkblue')
    }

})

$('#group_select').change(function(){
    $(this).removeClass('darkblue')
    if(Number($(this).val())>0)$(this).addClass('darkblue')
})

$('body').on('click','.edit_group',function(){
    const name = $(this).data('name'),
          id = $(this).data('id'),
          group = $(this).data('aina')

          $('#kundi-name').val(name)
          $('#mahitaji-form').data('edit',1)
          $('#mahitaji-form').data('id',id)

          $('#group_select').prop('disabled',false)
          $('#group_select').val(group)
          const aina = $('#group_select').find('option:selected').data('aina')
          $('#group_categ_select').val(aina)

          $('#group_select').addClass('darkblue')
          $('#group_categ_select').addClass('darkblue')

})

$('#mahitaji-form').submit(function(e){
    e.preventDefault()
    const url=$(this).attr("action"),
         mahitaji = $('#kundi-name').val(),
         group = $('#group_select').find('option:selected').val(),
         edit = $(this).data('edit'),
         val = $(this).data('id')


    if(mahitaji!='' && group > 0 ){
        var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

        var data={
       data:{
             mahitaji,
             group,
             edit,
             val,
            csrfmiddlewaretoken:csrfToken, 
        } ,    
            url:url,
            hide:"#kundi-modal",
            form:'#mahitaji-form',
            rl:"/stoku/getItemsAssociate"
        
        }

        $(this).data('edit',0)
        $(this).data('val',0)

        $('#group_select').removeClass('darkblue')
        $('#group_categ_select').removeClass('darkblue')

        $('#group_select').val(0)
        $('#group_categ_select').val(0)

        saveStokuData(data)
        
    }else{
        alert(lang("Tafadhali andika kundi la bidhaa","Please write parent category"))
        redborder('#kundi-name')
    }
})

// save Kampuni.............................................
$('#kampuni-form').submit(function(e){
    e.preventDefault()
    var url=$(this).attr("action")
    var kampuni = $('#kampuni-name').val()
    if(kampuni!=''){
        var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

        var data={
       data:{
            edit:$(this).data('edit'),
            val:$(this).data('value'),
            kampuni:kampuni,
            csrfmiddlewaretoken:csrfToken, 
        } ,    
            url:url,
            
            hide:"#kampuni-modal",
            form:'#kampuni-form',
            rl:"/stoku/getItemsAssociate"
        
        }

        saveStokuData(data)
        $(this).data({value:0,edit:0})

    }else{
        alert(lang("Tafadhali andika jina la kampuni","Please write Company name"))
        redborder('#kampuni-name')
    }
})

// save Stoku.............................................
$('#stoku-nje-form').submit(function(e){
    e.preventDefault()
    let tawi_name= $('#stoku-nje-name').val(),nchi=$('#Nchini').val(),kanda,wilaya,mkoa,mtaa=$('#mtaa-name').val()
    let call = $('#clallcode').val(),pesa=$('#curencii').val(),
        edit = (Number($(this).data('edit')))    

    if($('#clallcode').val()=='255'){
        kanda=$('#kanda').val()
        wilaya=$('#wilaya').val()
        mkoa=$('#select-box1').val()
    }else{
        kanda=$('#kanda-other').val()
        wilaya=$('#wilaya-others').val()
        mkoa=$('#mikoa-others').val()
    }
    var url=$(this).attr("action")
    if((tawi_name!='' && mkoa!='' && wilaya!='' && mtaa!='') || Boolean(edit)){
        var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

        var data={
       data:{
        tawi__:true,
        stoku:tawi_name,
        nchi:nchi,
        call:call,
        pesa:pesa,
        kanda:kanda,
        mkoa:mkoa,
        wilaya:wilaya,
        edit:edit,
        mtaa:mtaa,
        csrfmiddlewaretoken:csrfToken, 
        } ,    
             url:url,
            hide:"#stoku-nje-modal",
            form:'#stoku-nje-form',
            rl:"/stoku/getItems"
        
        }
        saveStokuData(data)
    }else{
        if(tawi_name=='' ){
                redborder('#stoku-nje-name')
        } 

        if(mtaa==''  ){
            redborder('#mtaa-name')
      
        }

        if(kanda==''  ){
            if($('#clallcode').val()=='255'){
                redborder('#kanda')
            }else{
                redborder('#kanda-other')

            }
      
        }
        if(wilaya==''  ){
            if($('#clallcode').val()=='255'){
                redborder('#wilaya')
            }else{
                redborder('#wilaya-others')

            }
      
        }
        if(mkoa==''  ){
            if($('#clallcode').val()=='255'){
                redborder('#select-box1')
            }else{
                redborder('#mikoa-others')

            }
      
        }


    }
})


// save Aina.............................................
$('#aina-form').submit(function(e){
    e.preventDefault()
    const url=$(this).attr("action"),
         aina = $('#aina-name').val(),
         mahiVal=Number($('#mahi-data').val()),
         newP = Number($('#new_p_categ').prop('checked')) || 0,
         newPc = $('#pCategNew').val(),
         selPPc = Number($('#group_select2').val()) || 0

   
         if(aina!='' && (mahiVal || (newP && newPc!='' && selPPc)) ){
           $('#aina-modal').modal('hide')
           $('#loadMe').modal('show')

        const data={
                data:{
                        edit:Number($(this).data('edit')) || 0  ,
                        value:Number($(this).data('value')) || 0 ,
                        aina:aina,
                        mahi:mahiVal,
                        newP,
                        newPc,
                        selPPc
                        
                    } ,    
                        url,
                        // hide:"#aina-modal",
                        // form:'#aina-form',
                        rl:'/stoku/getItemsAssociate'

                    },
                    sendIt = POSTREQUEST(data)
                  
                    sendIt.then(resp=>{
                        const msg = lang(resp.swa,resp.eng)
                        $('#loadMe').modal('hide')
                        hideLoading()
                        if(resp.success){  
                            $(this).data({value:0,edit:0})
                             
                            $('#aina-name').val('')
                            $('#pCategNew').val('')
                            $('#ifNewPcateg').prop('hidden',true)
                            $('#mahi-data').prop('hidden',false)
                            
                            toastr.success(msg, lang('Imefanikiwa','Success'), {timeOut: 2000});
                            getStokuData(data.rl)

                        }else{
                             toastr.error(msg, lang('Haikufanikiwa','Error'), {timeOut: 2000});
                           
                        }
                    })

      
    }else {
        // alert(lang("Tafadhali andika aina ya bidhaa","Please write product category"))
        if(aina=='')redborder('#aina-name')
        if(!newP&&!mahiVal)redborder('#mahi-data')
        if(newP&&newPc=='')redborder('#pCategNew')    
        if(newP&&!selPPc)redborder('#group_select2')    
    }
})


// save wasambazaji.............................................
$('#form-wasambazaji').submit(function(e){
    e.preventDefault()
    var url=$(this).attr("action"),active=$(this).data('active_vendor')

    var jina = $('#sambazaji-jina').val()
    var adress=$('#sambazaji-sehemu').val()
    var code=$('#sambazaji-simu-code').val()
    var simu1=$('#sambazaji-simu').val()
    var simu2=$('#sambazaji-simu2').val()
    var mail=$('#sambazaji-mail').val()
    if(jina!=''){
        if(adress!=''){

            if(simu1.length==9){
                if(code.length>2){
                     var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

        var data={
       data:{
             jina:jina,
             adress:adress,
             edit:$(this).data('edit') || 0,
             valn:$(this).data('value'),
             code:code,
             simu1:simu1,
             simu2:simu2,
             isactive:active,
             value:$(this).data('vendor_value'),
             mail:mail,
            csrfmiddlewaretoken:csrfToken, 
        } ,    
            url:url,
            hide:"#wasambazaji-modal",
            form:'#form-wasambazaji',
            rl:'/stoku/getItemsAssociate'

        
        }
        if(simu2=='' || simu2.length==9){
            supplier_selected.state=false

            saveStokuData(data)

            $(this).data('vendor_value',0)
            $(this).data('active_vendor',0)


        }else{
            alert(lang("Tafadhali Andika namba ya simu kwa simu2 kwa usahihi","Please write Vender contact 2 correctly"))
            redborder('#sambazaji-simu2')
        }

                }else{
                     alert(lang("Tafadhali Andika code ya simu kwa usahihi","Please write country code correctly"))
                    redborder('#sambazaji-simu-code') 
                }
               
            }else{
               alert(lang("Tafadhali Andika namba ya simu kwa simu1 kwa usahihi","Please write Vender contact 1 correctly"))
            redborder('#sambazaji-simu')
            }
            
        }else{
            alert(lang("Tafadhali Andika mahali msambazaji anapatikana","Please write Vender Address"))
            redborder('#sambazaji-sehemu')
        }
      
    }else {
        alert(lang("Tafadhali andika jina la msambazaji","Please write Vendor Name"))
        redborder('#sambazaji-jina')
    }
})

// save Customer.............................................
$('#form-mteja').submit(function(e){
    e.preventDefault()
    var url=$(this).attr("action"),active=$(this).data('active_customer')||0

    var jina = $('#mteja-jina').val(),
       adress=$('#mteja-sehemu').val(),
       code=$('#mteja-simu-code').val(),
       simu1=$('#mteja-simu').val(),
       simu2=$('#mteja-simu2').val(),
       mail=$('#mteja-mail').val(),
       edit = $(this).data('edit'),
       valued = $(this).data('valued')
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
             value:$(this).data('customer_value'),
             mail:mail,
             edit:edit,
             valued:valued,
            csrfmiddlewaretoken:csrfToken, 
        } ,    
            url:url,
            hide:"#wateja-modal",
            form:'#form-mteja',
            rl:'/mauzo/getCustomers'
        
        }


        if(simu2=='' || simu2.length==9){
            // supplier_selected.state=false

            saveStokuData(data)

            $(this).data('customer_value',0)
            $(this).data('active_customer',0)


        }else{
            // alert(lang("Tafadhali Andika namba ya simu kwa simu2 kwa usahihi","Please write Vender contact 2 correctly"))
            redborder('#mteja-simu2')
            $('#mteja-simu2').siblings('small').prop('hidden',false)
        }

                }else{
                    //  alert(lang("Tafadhali Andika code ya simu kwa usahihi","Please write country code correctly"))
                    redborder('#mteja-simu-code') 
                    $('#mteja-simu-code').siblings('small').prop('hidden',false)
                }
               
            }else{
            //    alert(lang("Tafadhali Andika namba ya simu kwa simu1 kwa usahihi","Please write Vender contact 1 correctly"))
            redborder('#mteja-simu')
            $('#mteja-simu').siblings('small').prop('hidden',false)

            }
            
        }else{
            // alert(lang("Tafadhali Andika mahali mmteja anapatikana","Please write Vender Address"))
            redborder('#mteja-sehemu')
            $('#mteja-sehemu').siblings('small').prop('hidden',false)

        }
      
    }else {
        // alert(lang("Tafadhali andika jina la mmteja","Please write Vendor Name"))
        $('#mteja-jina').siblings('small').prop('hidden',false)

        redborder('#mteja-jina')
    }
})




// save NEW product item.................................................................................................//
$('#form-Bidaa-Add').submit(function(e){
    e.preventDefault()
var jina,namba,service,timeP,paidTime,material,vipimo_jum,code,kampuni,sambazaji,kuuza_reja,aina,idadi=0,kununua,idadi_jum=0,kuuza_jum,punguzo,pimoreja,uwiano,stoku_nje=0,stoku_name ,idadi_stocku=0,idadi_reja=0 
var url=$(this).attr("action")
    fromBill = $(this).data('forbill')

    

   jina =($('#jina-la-bidhaa').val()).replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")
   vipimo_jum  =($('#vipimo-vya-bidhaa').val()).replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")
   code         =$('#code-ya-bidhaa').val()
   kampuni      =Number($('#produ_campuni').find('option:selected').data("value")) || 0
   sambazaji = $('#produ_sambazaji').find('option:selected').data("value")
   aina =$('#prodAina').find('option:selected').data("value")
   kununua =Number($('#Bei_ya_kunua').val()) || 0
   expire=$('#expirdate').val()
   namba=$('#namba-ya-bidhaa').val()
   material=Number($('#prodMaterial').prop('checked'))
 
   service=Number($('#ServiceItem').prop('checked'))
   paidTime=Number($('#paidTimely').prop('checked'))
   timeP=Number($('#payPerTime').val())
   colorAttr = $('#attr_name').val()
   thereIsColorAttr = Number(colorAttr != '')


 if(parseInt($('#idadi_bidhaa').val())>0){
        idadi=$('#idadi_bidhaa').val()
 }
 

   kuuza_jum=Number($('#Bei_ya_kuuza').val()) || 0
 

   if($('#pimo-reja').val()!=''){
    pimoreja = $('#pimo-reja').val()
   }else{
    pimoreja = vipimo_jum
   }

   if($('#uwiano-reja').val()!=''){
    uwiano = $('#uwiano-reja').val()
   }else{
    uwiano = 1
   }

   if($('#bei-reja').val()!=''){
    kuuza_reja = Number($('#bei-reja').val()) ||  0
   }else{
    kuuza_reja = kuuza_jum
   }

   if($('#idadi_bidhaa-reja').val()!=''){
    idadi_reja = $('#idadi_bidhaa-reja').val()
   }


   if($('#stoku-nje').prop("checked")) {
          stoku_nje=1

   }

//    stoku_name    =$('#select-stocku').find('option:selected').data("value")
//    if($('#idadi_stoku-jum').val()!=''){
//        idadi_stocku =parseInt($('#idadi_stoku-jum').val())
   
//    }


   let rangi = []
   if(Number($('#idadi_bidhaa').data('colored'))){
       $('.coloredscene_').each(function(){
           let szd = $(this).children('.sizedscene_').length || 0,
               sz=[]

            if(szd!=0){
                        
                        $(this).children('.sizedscene_').each(function(){
                            let szdi = {
                                size:$(this).data('size').replace(/[&\/\\#,+$~%"*?<>{}`]/g, ""),
                                idadi_jum:$(this).children().find('.idadi_jum_').val() || 0,
                                idadi_rej:$(this).children().find('.idadi_reja_').val() || 0,
                            }   
                            sz.push(szdi)
                        })

                        
                        
                     
                    }


            let dt = {
                        color_name:$(this).data('color').replace(/[&\/\\#,+$~%"*?<>{}`]/g, ""),
                        color_code:$(this).data('code'),
                        other_name:$(this).data('other'),
                        idadi_jum:$(this).children().find('.idadi_jum_').val() || 0,
                        idadi_rej:$(this).children().find('.idadi_reja_').val() || 0,
                        sized:sz,
                        pos:$(this).data('pos')
                    }

         

          
             rangi.push(dt)
           
       })

      
   }
   
   

maelezo = ($('#maelezo_ya_bidhaa').val()).replace(/[&\/\\#,+$~%"*?<>{}`]/g, "")

var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
var data={
     data:{

    jina:jina,
    vipimo_jum:vipimo_jum,
    code:code,
    kampuni:kampuni,
    sambazaji:sambazaji,
    kuuza_reja:kuuza_reja,
    aina:aina,
    kununua:kununua,
    kuuza_jum:kuuza_jum,
     namba:namba,
     material:material,
    pimoreja:pimoreja,
    uwiano:uwiano,
    idadi:idadi,
    rangi:JSON.stringify(rangi),
    idadi_reja:idadi_reja,
    bei_reja:0,
    fromBill:fromBill,
    thereIsColorAttr,
    colorAttr,
    // stoku_nje:stoku_nje,
    expire:expire,
    maelezo:maelezo,
    service:service,
    paidTime:paidTime,
    timeP:timeP,
    // stoku_name:stoku_name ,
    // idadi_stocku:idadi_stocku,
    tarehe:"none",  
    new:"False",
    present:"False",  
    saleWithtax: Number($('#item-sal-vat').prop('checked')),
    puchWithtax: Number($('#item-puch-vat').prop('checked')),
    csrfmiddlewaretoken:csrfToken

},
form:'#form-Bidaa-Add',
url:url,
hide:"#none",
rl:'/stoku/getItems'
}


// validate for any empty required field

var isvalid=0
$('.muhimu-b').each(function(){
    
 if($(this).hasClass("rega")){
     if(!Number($(this).val()) && $(this).attr('id') ){
        isvalid+=1
        // console.log($(this).attr('id'));
        $(this).selectpicker('setStyle', 'border-danger');
     }
 }else{
     if($(this).val()==''&& $(this).attr('id') ){
        isvalid+=1
        redborder('#'+$(this).attr('id'))

     }
 }
})

// validate the form if user select that there is wholesaling and retail
var isvalidrej=0

$('.muhimu-br').each(function(){
 if($(this).hasClass("select-data")){
     if($(this).find('option:selected').data('value')=="0" ){
        isvalidrej+=1
        if($('#jum-na-reja').prop("checked")==true){
               redborder('#'+$(this).attr('id'))

        }
     }
 }else{
     if($(this).val()==''){
        isvalidrej+=1
        if($('#jum-na-reja').prop("checked")==true){

        redborder('#'+$(this).attr('id'))
        }
        
     }
 }
})


// check whether there is any unfilled if user opt that there is stoku out
var isvalidStoku=0 //use the valiabe to detect for any empty required input by addig 1
$('.muhimu-st').each(function(){
 if($(this).hasClass("select-data")){
     if($(this).find('option:selected').data('value')=="0"){
        isvalidStoku+=1
        if(stoku_nje==true){
          redborder('#'+$(this).attr('id'))

        }
     }
 }else{
     if($(this).val()==''){
        isvalidStoku+=1

        if(stoku_nje==true){
        redborder('#'+$(this).attr('id'))
        }
        
     }
 }
})

// console.log(isvalid);
// validate form for the basic form
if(isvalid==0){
    //validate form if wholesale and retail is envolved using the valiable
  if($('#jum-na-reja').prop("checked")==false || isvalidrej==0){
    if(stoku_nje==false || isvalidStoku==0){

     
    //validate form if the user selected that there is stock out of shop

        //validate purchase and sales price
        
         if(parseInt(kuuza_jum)>=parseInt(kununua) || Boolean(material) || service ){
             if((parseInt(kuuza_reja)*parseInt(uwiano))>=parseInt(kununua) || !($('#jum-na-reja').prop("checked")) || Boolean(material) || service ){
              if( timeP > 0 || !paidTime ){
                saveStokuData(data)

               $('#idadi_bidhaa').data('colored',0)
               $('#color_alena').html('')
                       
                goTo('#nunua-panel')
              }else{
                  redborder('#payPerTime')
              }
              

            



             }else {
                goTo('#nunua-panel')

            alert(lang("Bei ya kuuza kwa reja reja ni ndogo kuliko bei ya kununulia","The sales  price for retail is less than purchase price"))
             redborder('#Bei_ya_kunua')
             redborder('#bei-reja')  
             }

         }else{
            goTo('#nunua-panel')

            alert(lang("Bei ya kuuza ni ndogo kuliko bei ya kununulia","The sales price is less than purchase price"))
             redborder('#Bei_ya_kunua')
             redborder('#Bei_ya_kuuza')
         } 
          
        }else if(stoku_nje==true && isvalidStoku>0){
            goTo('#nunua-panel')
    
    
            alert(lang("Tafadhari jaza sehemu zote muhimu kwa usahihi","please fill all required fields correctly"))
            console.log('err 1');
    
          }

  }else if($('#jum-na-reja').prop("checked")==true && isvalidrej>0 ){
    goTo('#nunua-panel')

        alert(lang("Tafadhari jaza sehemu zote muhimu kwa usahihi","please fill all required fields correctly"))
        console.log('err 2');

  }

}else{
    goTo('#nunua-panel')
        alert(lang("Tafadhari jaza sehemu zote muhimu kwa usahihi","please fill all required fields correctly"))
        console.log('err 3');

}

})


//save item reistered from other Stock............................................//
$('#addfrom_reistered').submit(function(e){
  e.preventDefault()

  let idadi_jum = Number($('#idadi_jum_jum').val()) || 0,
    idadi_reja= Number($('#idadi_rejareja').val()) || 0,
    rang = Number($('.coloredscene_').length),
    itm = $('#fetch_item').data('val'),
    sup = $('#produ_sambazaji_').val()
  

    let rangi = []
    
   if(rang){
     

       $('.coloredscene_').each(function(){
           let szd = $(this).children('.sizedscene_').length || 0,
               sz=[]

            if(szd!=0){
                        
                        $(this).children('.sizedscene_').each(function(){
                            const szdi = {
                                size:$(this).data('size'),
                                idadi_jum:$(this).children().find('.idadi_jum_').val() || 0,
                                idadi_rej:$(this).children().find('.idadi_reja_').val() || 0,
                                val:$(this).data('val')||0
                            }   
                            sz.push(szdi)
                        })

                        
                        
                     
                    }


            const dt = {
                        color_name:$(this).data('color'),
                        color_code:$(this).data('code'),
                        other_name:$(this).data('other'),
                        idadi_jum:$(this).children().find('.idadi_jum_').val() || 0,
                        idadi_rej:$(this).children().find('.idadi_reja_').val() || 0,
                        val:$(this).data('val')||0,
                        sized:sz
                    }

         

          
             rangi.push(dt)
           
       })

      

      
   } 
   
   const data={
           data:{
               itm:itm,
               idj:idadi_jum,
               idr:idadi_reja,
               sup:sup,
               
               rangi:JSON.stringify(rangi)

           },url:$(this).attr('action')
       }
       

    //    console.log(data);

      if(Number(data.data.itm)>0){
         $("#loadMe").modal('show');
        const sendIt = POSTREQUEST(data)
          sendIt.then(re=>{
                  if(re.success){
                $('#idadi_jum_jum').val('')
                $('#idadi_rejareja').val('')
                $('#idadi_jum_jum').prop('readonly',false)
                $('#idadi_rejareja').prop('readonly',false)

                   $('#idadi_jum_jum').data('color',0)
                    $('#fetch_item').data('val',0)
                    $('#fetch_item').val('')
                    sup = $('#produ_sambazaji_').selectpicker('refresh')

                        

                          toastr.success(lang(re.message_swa,re.message_eng), lang('Imefanikiwa','Success '), {timeOut: 2000});

                  }else{
                           toastr.error(lang(re.message_swa,re.message_eng), lang('Haukufanikiwa','Error '), {timeOut: 2000});
                    
                  }
              })
          
      }else{
          redborder('#fetch_item')
      }

})



//FUNCTION YA KUSAVE STOKU....................................................
function saveStokuData(data){
    $(data.hide).modal('hide');
    $("#loadMe").modal('show');
    $.ajax({
        type: "POST",
        url: data.url,
         data: data.data,
      }).done(function(respo) {
          if(respo.success){
            toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 2000});

            getStokuData(data.rl)

            if(Number(data.data.fromBill)){
                getColor_Size()
            }

            if('tawi__' in data.data){
               location.reload()
            }
            $(data.form).children().find('.select-data').each(function(){
                $(this).html($(this).html())
            })

       $(data.form).children().find('.input-data').val('')
            $('.clear_placeholder').attr('placeholder','')
            $('.vipimo_show').text('')

            // topslider.top()

            $('.verify-customer').prop('hidden',true)

            const itmImgInput = document.getElementById('add_Item_Img'),
                  ifColor = respo.Color
                  //Upload Image if  user added some ................................//
         
             let it = 0 ,last1 = false    //tress the last item and clear the images for color            
            if(itmImgInput.files.length>0 && ifColor?.length==0 && respo?.itm){
                saveItemImages({itmImgInput,c:0,itm:respo.itm,last1})
            }

                              
           
            if(ifColor?.length>0){
                ifColor.forEach(c=>{   
                    it+=1 
                    last1 = it == ifColor.length   
                    const cI = document.getElementById(`Img_Color_input${c.pos}`)
                    saveItemImages({itmImgInput:cI,c:c.id,itm:respo.itm,last1})


                })
            }          

          }else{
              toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 2000});
            //   topslider.top()

          }



        $("#loadMe").modal('hide');
        hideLoading()


      })
}

function saveItemImages(dt){
    const url = '/stoku/kuwekaPicha'
                            
                                IMGFORM.append('hold-color-id',dt.c)
                                IMGFORM.append('hold-produ-id',dt.itm)

                            

                                IMGFORM.append('IMG',null)

                                for (i = 0; i < dt.itmImgInput.files.length; i++) {
                                    if(i==(Number(dt.itmImgInput.files.length)-1) && dt.last1) LAST_FOR_COLOR_IMAGES = true
                                
                                    IMGFORM.delete('IMG')
                                    const img = dt.itmImgInput.files[i]
                                       
                                let theData = {url}

                                if(Number(img.size/1024) <= 490){
                                    IMGFORM.append('IMG',img)
                                    ImageUpload(theData)

                                    }else{
                                    
                                            theData = {img,url}
                                            
                                            compressImg(theData)
                                    }
                                    
                                    if(i==(Number(dt.itmImgInput.files.length)-1)){
                                        IMGFORM.delete('hold-color-id')
                                        IMGFORM.delete('hold-produ-id')
                                        IMGFORM.delete('IMG')
                                    
                                    }     
                        } 
}


// onesha list ya manunuzi kwa invoice iliyobonyezwa
$('body').on('click','.ripia-manunuzi',function(){
    $($(this).data('show')).siblings('.tab_div').hide()
    $($(this).data('show')).fadeIn(600)
    $('#wrap-kulipa-manunuzi').hide()
    document.getElementById("Kukopa-manunuzi").selectedIndex = 0
    $('#dataLoader').show(700)
    // topslider.top()
    var value=$(this).data('valued')
    var supplier=$(this).siblings('.supplier').data('supplier')
    var date=$(this).siblings('.Date').data('Date')
    var amount=$(this).siblings('.amount').data('amount')

    $('#purchase-from').text(titleCase(supplier))
    $('#purchase-Date').text(date)
   $('#save-changes-manunuzi').data('id',value)
   $('#lipia-manunuzi-list').data('id',value)

    getInvoiceList(value)

})



//kuongeza gharama nyingine katika manunuzi
$('#save-changes-manunuzi').submit(function(e){
    e.preventDefault()
    var url=$(this).attr("action")
    gharama=$('#inayolipia-gharama').val()
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
data={
    data:{
       
        gharama:gharama,
        csrfmiddlewaretoken:csrfToken
    },
    url:url,
    rl:"/stoku/getStokuData",
    hide:"#modal-matumizi",
}


if(gharama!=''){   
    saveStokuData(data)

}else {
    alert(lang('Andika gharama','Please write expense'))
    redborder('#inayolipia-gharama')
}

})



//savig data for invoice payment...........................................................//
function saveInvoice(data){
    $(data.hide).modal('hide');
    $("#loadMe").modal('show');
    $.ajax({
        type: "POST",
        url: data.url,
         data: data.data,
      }).done(function(respo) {
          if(respo.success){
            toastr.success(lang(respo.message_swa,respo.message_eng), 'Success Alert', {timeOut: 2000});
           if(respo.value>0){
               getInvoiceList(respo.value)


           }else{
               $('#invoice-data').hide()
               $('#invoice-list').fadeIn(600)
            //    topslider.top()

           }


          // getStokuData()


            $('.select-data').each(function(){
                $(this).html($(this).html())
            })

            $('.input-data').val('')
            $('.vipimo_show').text('')

          }else{
              toastr.error(lang(respo.message_swa,respo.message_eng), 'error Alert', {timeOut: 2000});

          }
        $("#loadMe").modal('hide');
        hideLoading()
      })
}


function getInvoiceList(value){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", // if you choose to use a get, could be a post
        url: "/stoku/getInvoiceData",
      data: {csrfmiddlewaretoken:csrfToken,value:value},
    }).done(function(data){
        $('#dataLoader').hide(700)

        const obj = document.getElementById('purchase-amount');    
        animateValue(obj, 0, Number(data.sum).toFixed(FIXED_VALUE), 1000);


     
        //  $('#purchase-amount').text(parseInt(data.sum).toLocaleString())
        $('#inayobaki-manunuzi').val('')
        $('#inayolipiwa-manunuzi').val('')       
        $('#inayolipiwa-manunuzi').attr('placeholder',parseInt(data.sum).toLocaleString())
        $('#inayobaki-manunuzi').attr('placeholder',0)
  
        $('#real-ivoice-amount').text(parseInt(data.sum))

        if(data.mkopo){
            $('#deni-au-jumla').text(lang("Deni","Debt"))
        }else{
            $('#deni-au-jumla').text(lang("Jumla","Total"))
   
        }
        $('#total-topay').text(parseInt(data.total).toLocaleString())
        $('#total-paid-one').text(parseInt(data.paid).toLocaleString())
       

        var rowM='',n=1
data.manunuzi.forEach(ac => {
    rowM+=`<tr>
             <th scope="row">${n}</th>
             <td >${ac.kwa.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
             <td>${parseInt(ac.kiasi).toLocaleString()}</td>

             <td><span class="smallerFont robotoFont text-primary">${ac.vipimo}</span>. <b>${ac.idadi}</b></td>
             <th>${parseInt(parseInt(ac.idadi) * parseInt(ac.kiasi)).toLocaleString()}/=</th>

             <td>
             <button data-valued=${ac.id} class="btn btn-default text-danger ondoa-manunuzi btn-sm" data-show="#invoice-data">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
             </button>
           
             </td>
             </tr>
             `
             n+=1

})

if(parseInt(data.matumizi_count)>0){
    data.matumizi.forEach(ac => {

    rowM+=`<tr>
             <th scope="row">${n}</th>
             <td >${ac.kwa.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
             <td>---</td>

             <td>---</td>
             <th>${ parseInt(ac.kiasi).toLocaleString()}/=</th>

             <td>
             <button data-valued=${ac.id} class="btn btn-default text-danger ondoa-manunuzi btn-sm" data-show="#invoice-data">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
             </button>
           
             </td>
             </tr>
             `
             n+=1

})
}



$('#list_ya_invoice').html(rowM)

    })
}



//Get all associated stoku data...................................................//
function getStokuData(url){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", 
        url:url,
      data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
                // console.log(data.aina)
        //store data into a items class
        if('products' in data){
        Items.state = data.products
        }

        //store item costs
        prdxnCost.state=data.prdxnCost

        //store item size
        if('sized' in data){
        ItemsSize.state=data.sized
        }
        //store products imgs in 
        if('img' in data){
            ItemImg.state=data.img
            // let size = data.Imgsize.pic_size__sum
            // $('#used-memory').text(parseFloat((size/(1024*1024)).toFixed(3))+'Mb')
        }

        //Store products colors features
        if('bidhaa_Rangi' in data){
            coloredItem.state=data.bidhaa_Rangi
        }

        //store stoku  color
        if('stokuRangi' in data){
            stokucolor.state=data.stokuRangi
        }

        //store stoku size
        if('stokuSize' in data){
            stokusize.state=data.stokuSize
        }

        //store  wateja data.....//
        if('wateja' in data){
            customers.state=data.wateja
            let teja_tu = Number(data.watejatu) || 0
            if(teja_tu){
                placedataTotable(data) 
            }
        }

        //store  wateja data.....//
        if('sambaza' in data){
            sambazia.state=data.sambaza
            placingItmData(data)
        }

        Categs.state = data.aina
        brands.state = data.kampuni
        pcategs.state = data.mahi

        if('stoku_nje' in data){  
            StoreNje.state = data.stoku_nje
        }


        if('products' in data &&  'aina' in data  ){
            placedataTotable(data)
        }

        if('tumizi' in data){
            placeMatumizitu(data)
        }

        

        //this one is for POS....................//
        if(POSDATA)posdata(0)


        //$('#dataLoader').hide(700)
        $("#loadMe").modal('hide');
        hideLoading()
            })
 
}

//place data on onshelf items  table or production table




function placeMatumizitu(data){
    let optM=`<option value=0  data-value=0 >--Chagua Matumizi--</option>`
    //list ya matumizi......................................................................//
    if(data.tumizi.length>0){
        data.tumizi.forEach(ac => {
        optM+=`<option value=${ac.id}  data-value=${ac.id} >${ac.matumizi}</option>`
    })
    }
    //Matumizi....................................//
        $('#chagua-matumizi-manunuzini').html(optM)
        //$('#chagua-matumizi-adjst').html(optM)
        $('#chagua-matumizi-manunuzini').selectpicker('refresh');
      //  $('#chagua-matumizi-adjst').selectpicker('refresh');

}



function placingItmData(data){
        let  opt=`<option  value=0 data-value=0>-------</option>`,
             opt_aina=`<option  value=0 data-value=0>--`+lang("chagua Aina","Select Product Category")+`--</option>`,
             opt_kampu=`<option  value=0 data-value=0>--`+lang("chagua Kampuni","Select Product Company")+`--</option>`,
             opt_sambaza=`<option  value=0 data-value=0>--`+lang("chagua Msambazaji","Select Vender")+`--</option>`,
             Categr = `<option  value=0 data-value=0>--`+lang("chagua Kundi","Select Group")+`--</option>` ,
             CategP = `<option  value=0 data-value=0>--`+lang("chagua Aina ya Kundi","Select Group Category")+`--</option>` 

             const bibiAina = data.ainaMama || [],
                   gr =[... new Set(bibiAina.map(a=>a.aina_id))],
                   bibi = gr.map(f=>{
                      return {
                        id:f,
                        name:bibiAina.filter(a=>a.aina_id === f)[0].aina_eng,
                        jina:bibiAina.filter(a=>a.aina_id === f)[0].aina_swa,
                      }
                   })  
                   
            bibi.forEach(bb=>{
                CategP += `<option value=${bb.id} >${lang(bb.jina,bb.name)} </option>`
            })   

            bibiAina.forEach(bb=>{
                Categr += `<option value=${bb.id} data-aina=${bb.aina_id} >${lang(bb.jina,bb.name)} </option>`
            })   
            
            

       
            data.mahi.forEach(ac => {
                opt+=`<option value=${ac.id} data-value=${ac.id} >${ac.mahitaji.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} </option>`
            })
            data.kampuni.forEach(ac => {
                opt_kampu+=`<option value=${ac.id} data-value=${ac.id} >${ac.kampuni_jina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} </option>`
            })
            data.aina.forEach(ac => {
                opt_aina+=`<option value=${ac.id} data-value=${ac.id} >${ac.aina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} </option>`
            })
            data.sambaza.forEach(ac => {
                opt_sambaza+=`<option value=${ac.id} data-value=${ac.id} >${ac.jina.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} </option>`
            })



            
      
            opt_stocku=`<option  value=0 data-value=0>--`+lang("chagua Stoku","Select stock")+`--</option>`
      
            const br = Number($('#produ_campuni').val()) || 0, 
                  ct = Number(($('#prodAina').val())) || 0, 
                  vd = Number(($('#produ_sambazaji').val())) || 0


            $('#group_categ_select').html(CategP)
            $('#group_categ_select2').html(CategP)
            $('#group_select').html(Categr)
            $('#group_select2').html(Categr)
            $('#produ_sambazaji').html(opt_sambaza)
            $('#produ_sambazaji_').html(opt_sambaza)
            $('#kuediti-bidbaa-msambazaji').html(opt_sambaza)
            $('#prodAina').html(opt_aina)

            
        //kuongeza bidhaa tu.....................................................//
                $('#mahi-data').html(opt)
                

                $('#produ_campuni').html(opt_kampu)
                $('#kuedit-bidhaa-chapa').html(opt_kampu)

                
//kufanya manunuzi .....................................................//
        $('#mahi-data-kununua').html(opt)
        $('#produ_campuni-kununua').html(opt_kampu)
        if(supplier_selected.state==false){
         $('#produ_sambazaji-kununua').html(opt_sambaza)
         $('#sambazaji-for-present').html(opt_sambaza)

        }


        $('#kuedit-bidhaa-aina').html(opt_aina)
        $('#prodAina-kununua').html(opt_aina)
        $('#prodAina-kununua').html(opt_aina)
        
        $('#select-stocku-kununua').html(opt_stocku)
        $('#select-stocku-kununua-zilizopo').html(opt_stocku)


        if(!vd)$('#produ_sambazaji').selectpicker('refresh');
        // $('#produ_sambazaji').val(vd);

        $('#produ_sambazaji_').selectpicker('refresh');
        $('#kuediti-bidbaa-msambazaji').selectpicker('refresh');

        if(!br)$('#produ_campuni').selectpicker('refresh');
        // $('#produ_campuni').val(br);

        $('#kuedit-bidhaa-chapa').selectpicker('refresh');

        $('#kuedit-bidhaa-chapa').selectpicker('val',$('#kuedit-bidhaa-chapa').data('val'))

        if(!ct)$('#prodAina').selectpicker('refresh');
        // $('#prodAina').val(ct);
        // $('#duka_item_aina').selectpicker('refresh');

        $('#produ_sambazaji-kununua').selectpicker('refresh');
        $('#sambazaji-for-present').selectpicker('refresh');
        $('#produ_campuni-kununua').selectpicker('refresh');
        $('#prodAina-kununua').selectpicker('refresh');
        $('#kuedit-bidhaa-aina').selectpicker('refresh');
        $('#kuedit-bidhaa-aina').selectpicker('val',$('#kuedit-bidhaa-aina').data('val'))

    }




   function otherStoku(data){
       if('other_stock' in data){
            data.other_stock.forEach(ac => {
                opt_stocku+=`<option  data-value=${ac.id} >${ac.name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")} </option>`
            })
       }


//stoku za nje
        let st_li='',st_liS='',st_no=0
        data.stoku.forEach(ac => {
            st_no+=1
            st_liS+=`
            <li class="py-2 border-bottom"  data-value=${ac.Interprise} >
            <a href="/stoku/interpnavi/${ac.Interprise}">
                <span  style="font-size:16px;color:#777">${titleCase(ac.Interprise__name).replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>
                <br/>
                <span class="smallerFont">${ac.Interprise__mtaa} ${ac.Interprise__wilaya} ${ac.Interprise__mkoa} </span>
             </a> 
             </li>`
        })


       // $('#matawi_ya_nje').html(st_li)
        $('#matawi_mengine').html(st_liS)

    





        // $('#duka_item_aina').html(opt_aina)
        $('#select-stocku').html(opt_stocku)
        $('#stoku-select2').html(opt_stocku)
        $('#to_interprise').html(opt_stocku)

}





//function for title Case
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }


function produAdjstsSizeColor(color,sized,val,stoku,place,frm,inp){
     var num=0,colored=''
    // let size=ItemsSize.state,color=coloredItem.state
     color.forEach(c=>{
         let stk =0,datafrom=$(frm).data('from')
         if(stoku!=0){
             stk=c.stoku
         }
         if((c.bidhaa==val) || (stk!=0 && (val==c.addedfromprodu || c.bidhaa==datafrom ))){

             if(c.color__colored!=false){
       colored+=`
           <div class=" m-1 column  color_specify" style=";border-radius:2px;width:80px;border:1px solid #000">
      
           <div type="button" style="background:${c.color__color_code};color:${c.color__color_code};">
           ${c.color__color_name}

           <div class=" position-absolute  " id="success${c.id}"  style="display:none;margin-left:60px;margin-top:-19px;height:19px;width:17px;border-radius:50%;color:#fff;background:rgba(2, 167, 2, 0.842);border:1px solid #fff">
            <span style="top:-1px;left:-1px;position:absolute;">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                </svg>
            </span>
           </div>

           <div class=" position-absolute  " id="danger${c.id}"  style="display:none;margin-left:60px;margin-top:-19px;height:17px;width:17px;border-radius:50%;color:rgb(177, 0, 0);background:rgb(248, 248, 248);border:1px solid rgb(177, 0, 0)">
           <span style="top:-1px;left:-1px;position:absolute;">
             <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-exclamation" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
               </svg>
           </span>
            
           </div>



           </div>
           <div class="position-absolute color_speci_iidadi p-1  bg-light" style="margin-top:2px;display:none;width:140px;z-index:99;border:1px solid #B5B4D2;margin-left:-1px">
           <div class=" text-center  border-bottom-secondary smallFont">${titleCase(c.color__color_name) }
           `
           //KAMA BIDHAA HAIHUSISHI MAUZO YA JUMLA JUMLA...........
           if(c.bidhaa__bidhaa__idadi_jum==1){
            colored+=`<sub class="text-primary">${lang(c.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+c.idadi+'</span>','<span class="text-danger">'+ c.idadi+' '+c.bidhaa__bidhaa__vipimo)}`
         //VILE VILE KAMA BIDHAA INAHUSISHA MAUZO YA JUMLA NA REJAREJA.....................//
        }else if((parseInt(parseInt(c.idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum))<1)){
                            colored+=`<sub class="text-primary">${lang(c.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+parseInt(parseInt(c.idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span>','<span class="text-danger">'+parseInt(parseInt(c.idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span> '+c.bidhaa__bidhaa__vipimo)}`
               
           }else{
                         colored+=`<sub class="text-primary">${lang(c.bidhaa__bidhaa__vipimo_jum+': <span class="text-danger"> '+parseInt(parseInt(c.idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span>','<span class="text-danger">'+parseInt(parseInt(c.idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span> '+c.bidhaa__bidhaa__vipimo_jum)}`
               
                         if(parseInt(parseInt(c.idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))!=0){
                            colored+=`${lang(' na '+c.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+parseInt(parseInt(c.idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span>',' and <span class="text-danger">'+parseInt(parseInt(c.idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span> '+c.bidhaa__bidhaa__vipimo)}`
    
                         }
           }

        colored+=`
        </sub>
           </div>`                
             }else{
                 colored+=`
                 <div class=" m-1 column  color_specify" style=";border-radius:2px;width:80px;">
                 <div class="ka-rangi " style="background-color:#fff;color:rgb(0,0,0,0) ; background-image: linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%), linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%);
                 background-position: 0 0, 5px 5px;
                 background-size: 10px 10px;
                 ">No color
                 <div class=" position-absolute  " id="success${c.id}"  style="display:none;margin-left:60px;margin-top:-19px;height:17px;width:17px;border-radius:50%;color:#fff;background:rgba(2, 167, 2, 1);border:1px solid #fff">
                 <span style="top:-3px;left:-1px;position:absolute;">
                      <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                       <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                     </svg>
                 </span>
                  
                 </div>
      
                 <div class=" position-absolute  " id="danger${c.id}"  style="display:none;margin-left:60px;margin-top:-19px;height:17px;width:17px;border-radius:50%;color:rgb(177, 0, 0);background:rgb(248, 248, 248);border:1px solid rgb(177, 0, 0)">
                 <span style="top:-3px;left:-1px;position:absolute;">
                   <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-exclamation" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                       <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                     </svg>
                 </span>
                  
                 </div>
                 
                 </div>           
                 <div class="position-absolute color_speci_iidadi p-1  bg-light" style="margin-top:2px;display:none;width:140px;z-index:99;border:1px solid #B5B4D2;margin-left:-1px">
                 <div class=" text-center  border-bottom-secondary smallFont">No color
                 `

                //  if(stoku==0){
                      if(c.bidhaa__bidhaa__idadi_jum==1){
                               colored+=`<sub class="text-primary">${lang(c.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+c.bidhaa__idadi+'</span>','<span class="text-danger">'+ c.bidhaa__idadi+' '+c.bidhaa__bidhaa__vipimo)}`
                 }else if((parseInt(parseInt(c.bidhaa__idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum))<1)){
                                  colored+=`<sub class="text-primary">${lang(c.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+parseInt(parseInt(c.bidhaa__idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span>','<span class="text-danger">'+parseInt(parseInt(c.bidhaa__idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span> '+c.bidhaa__bidhaa__vipimo)}`
                     
                 }else{
                               colored+=`<sub class="text-primary">${lang(c.bidhaa__bidhaa__vipimo_jum+': <span class="text-danger"> '+parseInt(parseInt(c.bidhaa__idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span>','<span class="text-danger">'+parseInt(parseInt(c.bidhaa__idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span> '+c.bidhaa__bidhaa__vipimo_jum)}`
                     
                               if(parseInt(parseInt(c.bidhaa__idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))!=0){
                                  colored+=`${lang(' na '+c.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+parseInt(parseInt(c.bidhaa__idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span>',' and <span class="text-danger">'+parseInt(parseInt(c.bidhaa__idadi)%parseInt(c.bidhaa__bidhaa__idadi_jum))+'</span> '+c.bidhaa__bidhaa__vipimo)}`
          
                               }
                 }

                
      
              colored+=`
              </sub>
                 </div>`    
             }
     
           //kuweka size.............................//
           var size=0 
           sized.forEach(sz=>{
               if(sz.bidhaa==val && (sz.sized__color==c.color || sz.sized__color==c.color)){
                   size+=1
                   num+=Number(sz.idadi)


                   colored+=`
                   <div style="border-top:1px solid #ccc;border-bottom:1px solid #ccc">`
                 //  if(stoku==0){
                        colored+=`
                   <label class="d-block smallFont" for="">${sz.sized__size}
                   ` 
                //    }else{
                //     colored+=`
                //    <label class="d-block smallFont" for="">${sz.size}
                //    `                        
                //    }
                 
                   if(sz.bidhaa__bidhaa__idadi_jum==1){
                                 colored+=`<sub class="text-primary">${lang(sz.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+sz.idadi+'</span>','<span class="text-danger">'+ sz.idadi+' '+sz.bidhaa__bidhaa__vipimo)}`
                   }else if((parseInt(parseInt(sz.idadi)/parseInt(sz.bidhaa__bidhaa__idadi_jum))<1)){
                                    colored+=`<sub class="text-primary">${lang(sz.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+parseInt(parseInt(sz.idadi)%parseInt(sz.bidhaa__bidhaa__idadi_jum))+'</span>','<span class="text-danger">'+parseInt(parseInt(sz.idadi)%parseInt(sz.bidhaa__bidhaa__idadi_jum))+'</span> '+sz.bidhaa__bidhaa__vipimo)}`
                       
                   }else{
                                 colored+=`<sub class="text-primary">${lang(sz.bidhaa__bidhaa__vipimo_jum+': <span class="text-danger"> '+parseInt(parseInt(sz.idadi)/parseInt(sz.bidhaa__bidhaa__idadi_jum))+'</span>','<span class="text-danger">'+parseInt(parseInt(sz.idadi)/parseInt(sz.bidhaa__bidhaa__idadi_jum))+'</span> '+sz.bidhaa__bidhaa__vipimo_jum)}`
                       
                                 if(parseInt(parseInt(sz.idadi)%parseInt(sz.bidhaa__bidhaa__idadi_jum))!=0){
                                    colored+=`${lang(' na '+sz.bidhaa__bidhaa__vipimo+': <span class="text-danger">'+parseInt(parseInt(sz.idadi)%parseInt(sz.bidhaa__bidhaa__idadi_jum))+'</span>',' and <span class="text-danger">'+parseInt(parseInt(sz.idadi)%parseInt(sz.bidhaa__bidhaa__idadi_jum))+'</span> '+sz.bidhaa__bidhaa__vipimo)}`
            
                                 }
                   }
        
                colored+=`
                   </label>`

                   if(parseInt(sz.idadi)/parseInt(sz.bidhaa__bidhaa__idadi_jum)>=1){

                     colored+=`
                 
                   <label for="jum">T:</label>
                    <input style="width: 78%;" data-valu=${sz.id} data-color=false class="inputColor inputColor${c.id}" data-wiana=${parseInt(sz.bidhaa__bidhaa__idadi_jum)} data-idadi=${parseInt(parseInt(sz.idadi)/parseInt(sz.bidhaa__bidhaa__idadi_jum))} data-val=${c.id} data-reja=0 data-class="inputColor${c.id}" type="number" >
                                        <br>

                    `
                   }

                    if(sz.bidhaa__bidhaa__idadi_jum!=1){
              colored+=`       
                     <label for="jum">R:</label>
                    <input style="width: 78%;" data-valu=${sz.id} data-color=false class="inputColor inputColor${c.id}" data-val=${c.id} data-reja=1 data-idadi=${sz.idadi} data-class="inputColor${c.id}" type="number" >
                    `
                       
               }

              colored+=  ` </div>
`

            }
           })

if(size==0){
    num+=Number(c.idadi)

    if(parseInt(c.idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum)>=1){

     colored+=`

           <label for="jum">T:</label>
               <input style="width: 78%;" data-valu=${c.id} placeholder="${c.bidhaa__bidhaa__vipimo_jum}" data-color=true data-wiana=${parseInt(c.bidhaa__bidhaa__idadi_jum)} data-idadi=${parseInt(parseInt(c.idadi)/parseInt(c.bidhaa__bidhaa__idadi_jum))} data-val=${c.id} class="inputColor inputColor${c.id}" data-reja=0 data-class="inputColor${c.id}" type="number" >
            <br>
               `
    }
               if(c.bidhaa__bidhaa__idadi_jum!=1){
              colored+=`  
                <label for="jum">R:</label>
               <input style="width: 78%;" placeholder="${c.bidhaa__bidhaa__vipimo}" data-valu=${c.id} data-color=true class="inputColor  inputColor${c.id}" data-idadi=${c.idadi} data-val=${c.id} data-reja=1 data-class="inputColor${c.id}" type="number" />`   
               }
}

          colored+=`  </div>
                      </div>`

         }
     } )


     if(num>0){
         $(inp).hide()
         $(frm).data('color',true)
         $(place).html(colored)


     }else{
          $(inp).show()
          $(frm).data('color',false)
         $(place).html('')

     }


}

$('body').on('keyup','.inputColor',function(){
    let itsCom='.'+$(this).data('class'),valn=parseInt($(this).data('val')),incor=0,total=0,rejT=0,jumT=0
  
    //check for all its siblings input of the same color
    $(itsCom).each(function(){
        //take the value by summing all the numbers
        if(parseInt($(this).val())>0){
        total+=parseInt($(this).val())
           
       

        }
        //check wether the number entered exceeds the actual quantity.......
        if(parseInt($(this).val())>parseInt($(this).data('idadi'))){
                      $(this).addClass('redborder')
                      incor+=1

        }else{
 
            if($(this).data('reja')==1 && parseInt($(this).val())+(parseInt($(this).siblings('input').val())* parseInt($(this).siblings('input').data('wiana')))>$(this).data('idadi') ){
                     incor+=1
                      $(this).addClass('redborder')
                      $(this).siblings('input').addClass('redborder')
      
            }else{
                 $(this).removeClass('redborder')
     
            }
            
        }
      

    })

if(total>0){
    if(incor==0 ){
          $('#success'+valn).show()  
         $('#danger'+valn).hide()
    }else{
        $('#danger'+valn).show()
        $('#success'+valn).hide()
    }
}else{
     $('#success'+valn).hide()
     $('#danger'+valn).hide()
        

}

})


//ONDOA BIDHAA KWENYE STOKU.......................................................//
$('body').on('click','.list-delete-item',function(){
    var value =$(this).data('valued')
    var idadi=0,idadi_stock=0,pimo

 for (var i in Items.data) {
    if (Items.data[i].id == value) {
      idadi=parseInt(Items.data[i].idadi);
      pimo=Items.data[i].vipimo;
    }
  }

  for (var out in StoreNje.data) {
    if (StoreNje.data[out].bidhaa_id == value) {
        idadi_stock+=StoreNje.data[out].idadi

    }}

    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()

    data={
        data:{
            value:value,  
            csrfmiddlewaretoken:csrfToken
        },
        value:value,
        url:'/stoku/punguzaBidhaa',
        hide:"#null"
    }
if(parseInt(idadi)==0){

if(parseInt(idadi_stock)==0){
     if(confirm(lang('Je unataka kuodoa katika orodha ya manunuzi ?','Do want to remove from the list ? '))){
  
        saveInvoice(data)
    }
}else{
    alert(lang('Bidhaa haitaondolewa kutokana na uwepo wa stoku ya nje yenye bidhaa hii','the iten can not be removed because there is a number of this item in outstanding stocku'))
}
}else(
    alert(lang('Bidhaa Haitaondolewa kutokana na idadi ya bidhaa '+pimo +'. '+idadi+' zilizopo stoku tafadhari unaweza kupunguza kwa kuediti idadi','The item cannot be removed while there is '+pimo +'. '+idadi+' as outstanding stock you can reduce the quantity to 0 by editing'))
)
   
})












    //FUNCTION YA KUONESHA  SIZE..................................//
function sizing(data_size,color,produ_id){
  
    var tr='',count=0,qty=0,produ_qty=0,uwiano=0,vipimo_rej='',vipimo_jum=''

    data_size.forEach(ac => {
        
        if( ac.sized__color==color && ac.bidhaa==produ_id){
            count+=1
            tr+=`<tr><td>${ac.sized__size}</td>`
            tr+=`<td>`
        if(parseInt(ac.idadi)/parseInt(ac.bidhaa__bidhaa__idadi_jum)>=1){
            tr+=`<span class="text-primary">${ac.bidhaa__bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>.<span class="text-danger">${parseInt(parseInt(ac.idadi)/parseInt(ac.bidhaa__bidhaa__idadi_jum))}</span>`
           
            if(parseInt(ac.idadi)%parseInt(ac.bidhaa__bidhaa__idadi_jum) !=0){
               tr+=`${lang('na ',' and')} <span class="text-primary"> ${ac.bidhaa__bidhaa__vipimo.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>.<span class="text-danger">${parseInt(parseInt(ac.idadi))}</span>`
            }
        
        }else{
             tr+=`<span class="text-primary"> ${ac.bidhaa__bidhaa__vipimo.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>.<span class="text-danger">${parseInt(parseInt(ac.idadi))}</span>`
        } 
            
           tr+=` </td>`
           tr+=`<td>
           <button class="btn btn-default text-success kuedit-size-bidhaa btn-sm" data-size="${ac.sized__size}" data-reja=${parseInt(ac.idadi)%parseInt(ac.bidhaa__bidhaa__idadi_jum)} data-jum=${parseInt(parseInt(ac.idadi)/parseInt(ac.bidhaa__bidhaa__idadi_jum))} data-toggle="modal" data-target="#kuweka-size-model" data-valued=${ac.id}>
           <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
           </button>

           <button type="button" data-action="/stoku/ondoa_size" data-valu=${ac.id} data-color=${ac.color} data-produ=${ac.bidhaa} class="btn text-danger btn-default size-ondoa-btn btn-sm   smallFont" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
       </button>
             </td>
           </tr>
           `
   
           qty+=ac.idadi
           uwiano=ac.bidhaa__bidhaa__idadi_jum
           vipimo_rej=ac.bidhaa__bidhaa__vipimo
           vipimo_jum=ac.bidhaa__bidhaa__vipimo_jum
        }
       
        




    })

    //Check whether the color qty still exceed the total size quantity for the add other size button
    coloredItem.state.forEach(c => {

        if(c.color==color && c.bidhaa==produ_id && c.color__colored){
            produ_qty+= Number(c.idadi)

        }else if(!c.color__colored && c.color==color && c.bidhaa==produ_id){
            produ_qty=Number(c.bidhaa__idadi)
        }
    })

    //if color item qty exceed the qty  the add size button is added..................../
    if(produ_qty>qty){
        let diff = parseInt(produ_qty-qty)

        tr+=`<tr style="background:#f2f2f2"><td> ${lang('Nyingine','Others')} </td>
        <td>
        `
        if(parseInt(diff)/parseInt(uwiano)>=1){
            tr+=`<span class="text-primary">${vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>.<span class="text-danger">${parseInt(parseInt(diff)/parseInt(uwiano))}</span>`
           
            if(parseInt(diff)%parseInt(uwiano) !=0){
               tr+=`${lang('na ',' and')} <span class="text-primary"> ${vipimo_rej.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>.<span class="text-danger">${parseInt(parseInt(diff))}</span>`
            }
        
        }else{
             tr+=`<span class="text-primary"> ${vipimo_rej.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>.<span class="text-danger">${parseInt(parseInt(diff))}</span>`
        } 
            
           tr+=` </td>`
           tr+=`<td>
           <button data-color=0  data-toggle="modal" data-target="#kuweka-size-model" class="kuwekea-size-bidhaa btn text-secondary btn-default  btn-sm"  >
                <svg width="1.6em" height="1.6em" viewBox="0 0 16 16" class="bi bi-node-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5a.5.5 0 0 0-1 0v2h-2a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1h-2v-2z"/>
                </svg>
           </button>

           

             </td>
           </tr>
           `
        
    }


    if(count>=1){$('#size_display').show();$('#bado-size').hide()}else{$('#size_display').hide();$('#bado-size').show()}

$('#sizing-table').html(tr)
}





    //FUNCTION YA KUONESHA  RANGI..................................//
    function coloring(rangi){
        let col=0,coloredone=''
        var total_colored=0,totol_produ =0,idadi_jumla=0,vipimo_jumla,vipimo_reja
      rangi.forEach(ac => {
        coloredone+=`            
                              <div class="column mb-2" data-valued=${ac.id}  data-color=${ac.color}>
                              <div class="position-absolute showingpop24 p-3 whiteBg" id="ona_rang${ac.id}" data-showing="#ona_rang${ac.id}"
                              style="border-radius:8px;
                                -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                                box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                                max-width:150px;
                                margin-left:-15px;
                                margin-top:-17px;
                                z-index:5;
                                display:none"
                                >
                                
                                 <p>
                                    <button type="button" class="mr-1 rangi-editing" 
                                    data-color=${ac.color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")} 
                                    data-color_name=${ac.color__color_name.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")} 
                                    data-idadi_jum=${ac.bidhaa__bidhaa__idadi_jum} 
                                    data-idadi_halisi=${ac.idadi} 
                                    data-valued=${ac.id}
                                    data-nick_name=${ac.color__nick_name} 
                                    data-toggle="modal" data-target="#kuweka-rangi-model" style="height: 25px;width:40px;color:${ac.color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                        background:${ac.color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                                        cursor:pointer;
                                        border-radius:3px;
                                        -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                                        box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                                        border:0;
    
                                    ">
                                       color
                                 </button>   
                                 
                                 ${titleCase(ac.color__color_name.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, ""))}  
                                 
                              


                                 </p>`
                                  let idd_rej=0
                                 if(parseInt(ac.bidhaa__bidhaa__idadi_jum)>1){
                                coloredone+=`   <div class="row mb-2">
                                                <div class="col-12">
                                                  <label class="smallerFont" for="dozen">
                                                    <span class="text-primary smallFont">${ac.bidhaa__bidhaa__vipimo_jum.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>:
                                                    <span class="text-danger"> ${parseInt(parseInt(ac.idadi)/parseInt(ac.bidhaa__bidhaa__idadi_jum))}</span>
                                                  </label>
                                                </div>
                                                </div>
                                               `
    
                                       idd_rej =  Number(ac.idadi)%Number(ac.bidhaa__bidhaa__idadi_jum )      
                                 }else{
                                     idd_rej=Number(ac.idadi)
                                 }
                                coloredone+=`<div class="row mb-2">
                                       <div class="col-12">
                                       <label  for="dozen">
                                        <span class="text-primary">${ac.bidhaa__bidhaa__vipimo}</span>
                                         <span class="text-danger">${idd_rej}</span>
                                        </label>
                                       </div>
                                       
                                   </div>  
                                   <div class="text-right"> 
                                   <button data-rangi=${ac.id} data-action="/stoku/ondoa_color" class="rangi-ondoa-btn  btn btn-default btn-sm  text-danger"
                                 style="right: -12px;top:-6px;">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                 <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                               </svg>
                               </button>     
                                 </div>                    
                               </div>
    
                               <div id="Color${ac.id}" data-color=${ac.color} data-valued=${ac.id} data-color=true class="showingpop241 the_identify"  data-showing="#ona_rang${ac.id}" style="height: 25px;width:50px;color:${ac.color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                               background:${ac.color__color_code.replace(/[&\/\\,+()$~%"*?<>{}`]/g, "")};
                               cursor:pointer;
                               border-radius:3px;
                               -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                               box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                               ">
                                  color
                               </div>
                               
    
    
                           </div>
                              `
                
                           total_colored+=Number(ac.idadi)
                           totol_produ=ac.bidhaa__idadi
                           idadi_jumla=ac.bidhaa__bidhaa__idadi_jum
                           vipimo_jumla=ac.bidhaa__bidhaa__vipimo_jum
                           vipimo_reja=ac.bidhaa__bidhaa__vipimo

                   col+=1
      })


        if(totol_produ>total_colored){
            idadi_nyingine = parseInt(totol_produ-total_colored)

           



            coloredone+=`
                       <div class="column" mb-2 data-valued=0  data-color=0>
                          <div class="position-absolute showingpop24 p-3 whiteBg" id="ona_rang0" data-showing="#ona_rang0"
                          style="border-radius:8px;
                            -webkit-box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37); 
                            box-shadow: 0px 3px 10px -3px rgba(0,0,0,0.37);
                            max-width:150px;
                            margin-left:-15px;
                            margin-top:-17px;
                            z-index:5;
                            display:none"
                            
                            >
                             <p>
                                <button type="button" class="mr-2 kuwekea-rangi-bidhaa" 
                                 
                                data-toggle="modal" data-target="#kuweka-rangi-model" 
                                    style="height: 25px;width:40px;
                                    background-color:#fff;
                                    color: rgba(255, 255, 255, 0);
                                     background-image: linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%), linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%);
                                    background-position: 0 0, 5px 5px;
                                    background-size: 10px 10px;

                                ">
                                   color
                             </button>   
                             
                           <span class="smallerFont">  ${lang('Rangi Nyingine','Other Color')}  </span>
                             
                             </p>`
                              let idd_rej=0
                              if((idadi_jumla)>1 && idadi_nyingine/idadi_jumla >=1){
                                coloredone+=`<div class="row mb-2">
                                            <div class="col-12">
                                                <label class="smallerFont" for="dozen">
                                                <span class="text-primary">${vipimo_jumla.replace(/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</span>:
                                                <span class="text-danger">${parseInt(idadi_nyingine)/parseInt(idadi_jumla)}</span>
                                            
                                            </label>
                                            
                                            </div>
                                            `

                                   idd_rej =  parseInt(idadi_nyingine)%parseInt(idadi_jumla)      
                             }else{
                                 idd_rej=Number(idadi_nyingine)
                             }
                            coloredone+=`<div class="row mb-2">
                                   <div class="col-4">
                                   <label class="smallerFont" for="dozen">${vipimo_reja}</label>
                                   </div>
                                   <div class="col-8">
                                   <input type="number" placeholder=${idd_rej} class="form-control smallerFont">
                                   </div>
                               </div>                            
                           </div>

                           <div  class="showingpop241 the_identify" data-color=false data-showing="#ona_rang0" 
                           style="height: 25px;width:40px;
                                    background-color:#fff;
                                    color: rgba(255, 255, 255, 0);
                                     background-image: linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%), linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%);
                                    background-position: 0 0, 5px 5px;
                                    background-size: 10px 10px;
                                    "
                                    >
                              color
                           </div>
                           


                       </div>
                          `
        }


      


           $('#penye-rangi').html(coloredone)

             $('#rangi-zipo').show()
             $('#rangi-bado').hide()
              var rangi_vla = $('#penye-rangi').children().first().data('color');
              $('#penye-rangi').children().first().children('input').prop('checked',true)
              $('#hold-color-id').val(rangi_vla)
              $('#weka-size-ya-bidhaa').data('rangi',rangi_vla)

              //PLACE IMGS FOR APPROPRIATE PRODUCT
              let imgs=ItemImg.state
            //   placeImg(imgs,rangi_vla)
               let sized=ItemsSize.state
              

              sizing(sized,rangi_vla,produ_id)

      }



    
//COROR SETTING AND COLOR CODE INPUT.....................//
$('body').on('change','#chaguo-la-langi',function () { 
    var n_match = ntc.name($(this).val());
        n_rgb = n_match[0]; // RGB value of closest match
        n_name = n_match[1]; // Text string: Color name
        // n_exactmatch = n_match[2]; // True if exact color match
    $('#jina-la_rangi').attr('placeholder',n_name);   
    });
    
    $('body').on('keyup','#jina-la_rangi',function () {
    
        if( $(this).val()!='' ){
    
            isColor($(this).val(),'#chaguo-la-langi')
        }
    
    });
    
    function isColor(strColor,place){
        var s = new Option().style;
        s.color = strColor;
        if(s.color == strColor){
           let  d = document.createElement("div");
            d.style.color = strColor;
            document.body.appendChild(d)
            //Color in RGB 
            clr=window.getComputedStyle(d).color
               clr=clr.replace('rgb(','')
               clr=clr.replace(')','')
    
                $(place).val(rgbtoHex(clr.split(',')))
                // console.log(rgbtoHex(clr.split(',')))               
    
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
              }
    
              
             
     
              function rgbtoHex(r) {
                return "#" + componentToHex(Number(r[0])) + componentToHex(Number(r[1])) + componentToHex(Number(r[2]));
              }
    
            
    
        }
    
    
      }
         
  

   




//COROR SETTING AND COLOR CODE INPUT.....................//
$('body').on('change','.bill-set_color',function () { 

    var n_match = ntc.name($(this).val());
        n_rgb = n_match[0]; // RGB value of closest match
        n_name = n_match[1]; // Text string: Color name
        // n_exactmatch = n_match[2]; // True if exact color match
    
    $($(this).data('jina')).attr('placeholder',n_name);   
    
});
    
$('body').on('keyup','.jina-la_rangi',function () {
    
        if( $(this).val()!='' ){
    
            isColor($(this).val(),$(this).data('rangi'))
        }
    
    });
    
    function isColor(strColor,place){
        var s = new Option().style;
        s.color = strColor;
    
        
    
        if(s.color == strColor){
    
           let  d = document.createElement("div");
            d.style.color = strColor;
            document.body.appendChild(d)
            //Color in RGB 
            clr=window.getComputedStyle(d).color
               clr=clr.replace('rgb(','')
               clr=clr.replace(')','')
    
                $(place).val(rgbtoHex(clr.split(',')))
                // console.log(rgbtoHex(clr.split(',')))               
    
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
              }
    
              
             
     
              function rgbtoHex(r) {
                return "#" + componentToHex(Number(r[0])) + componentToHex(Number(r[1])) + componentToHex(Number(r[2]));
              }
    
            
    
        }
    
    
      }

   //Show the retail qty input on click
   $('body').on('click','.colored_items',function(){
    const jum_ = Number($(this).data('jum'))
    $(`#submit-bill-colorI`).data('jum_click',jum_)
      $('.input_rej').prop('hidden',jum_)
   })   
    

 function Adding_color(cv,cc,pos,ot){
     let pj=$('#vipimo-vya-bidhaa').val()|| lang('vipimo jumla','Wholesale Measure'),pr=$('#pimo-reja').val()|| lang('vipimo reja','Retail Measure'),uwiano=1
         const jum_ = Number($(`#submit-bill-colorI`).data('jum_click'))
     if($("#fromOtherStocku").data('bs.modal')?._isShown ){
          pj = $('#fetch_item').data('pj')
          pr = $('#fetch_item').data('pr')
          uwiano = $('#fetch_item').data('uwiano')
     }

   

    

     color_img({pos,color:cv})
     checkColor()

      return `
      <div class="column mb-2" id="color_${pos}" data-code=${cc} data-other="${ot}" data-pos=${pos}  data-color=${cv}>
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
  
    <button class="btn btn-default btn-sm  latofont" style="color:black;margin-right:-12px" onclick="$('#color_${pos}').remove();$('#placeColorImage${pos}').remove();set_idadi()">
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
           <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
       </svg>
    </button>


    </p>
     <div class="coloredscene_" id="coloredscene${pos}" data-color="${cv}" data-code="${cc}" data-other="${ot}" data-pos=${pos} >

            <div class="row input_jum">
                <div class="col-4">
                <label for="input_jum" class="smallerFont text-primary" >${pj}</label>
                </div>
                <div class="col-8">
                <input type="number" class="form-control idadi_jum_ smallerFont">
                </div>  
            </div>

            <div class="row input_rej py-2" ${jum_?'hidden':''} >
                <div class="col-4">
                <label for="input_rej" class="smallerFont pimo-reja-disp text-primary" >${pr}</label>
                </div>
                <div class="col-8">
                <input type="number" class="form-control idadi_reja_ smallerFont">
                </div>  
            </div>
    </div>


         <div class="smallerFont text-center border-top mt-3">
            <div class=" addSizing" style="display: none;" >
             
            <div class="form-group">
                <label for="">${lang('Jina la Size','Size Name')}</label>
                <input type="text" name="" id="sizen_${pos}" class="form-control" placeholder="" aria-describedby="helpId">
                <small id="helpIdIn${pos}" hidden class="text-muted text-danger">${lang('Andika Jina la size','Write size Name')}</small>
              </div>

              <button class="btn btn-primary smallerFont latoFont addTheSize" data-pj="${pj}" data-pr="${pr}" data-pos=${pos}  >
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

      
 }   

 $('body').on('click','.addTheSize',function(){
    const pos= $(this).data('pos'),
          pr = $(this).data('pr'),
          pj = $(this).data('pj'),
          size = $(`#sizen_${pos}`).val(),
          sizes = $(`#coloredscene${pos} .sizedscene_`).length,
          spos = `${pos}${sizes}`
        

          if(size!=''){
            if(Number(sizes)==0){
               $(`#coloredscene${pos}`).html(adding_size(size,spos,pj,pr))
            }else{
                $(`#coloredscene${pos}`).append(adding_size(size,spos,pj,pr)) 
            }

            $(`#sizen_${pos}`).val('')

            $(`#helpIdIn${pos}`).prop('hidden',true)

            // console.log(Number($(`#submit-bill-colorI`).data('jum_click')));

            if(Number($(`#submit-bill-colorI`).data('jum_click'))){

                $('.input_jum').prop('hidden',false)
                $('.input_rej').prop('hidden',true)

            }else{
                //  $('.input_jum').prop('hidden',true)
                 $('.input_rej').prop('hidden',false)
            }
        }else{
            $(`#helpIdIn${pos}`).prop('hidden',false)
        }

 })


 function adding_size(sn,pos,pj,pr){
  return`
  <div class="sizedscene_  text-center border-top mt-2 pt-2" id="SIZE_${pos}" data-size="${sn}"  data-pos=${pos}>
    <div class="sz_name" data-size="${sn}" >
   <label class="text-primary latoFont">Size</label>: <label class="text-danger">${sn}</label>

   <!-- REMOVE COLOR BUTTON...............................  -->
  
   <button class="btn btn-default btn-sm  latofont" style="margin-right:-12px" onclick="$('#SIZE_${pos}').remove();set_idadi()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
   </button>

        <div class="row input_jum"  >
            <div class="col-4">
            <label for="input_jum" class="smallerFont text-primary" >${pj}</label>
            </div>
            <div class="col-8">
              <input type="number" class="form-control idadi_jum_ smallerFont">
            </div>  
        </div>

        <div class="row input_rej py-2">
            <div class="col-4">
                 <label for="input_rej" class="smallerFont pimo-reja-disp text-primary" >${pr}</label>
            </div>
            <div class="col-8">
               <input type="number" class="form-control idadi_reja_ smallerFont">
            </div>  
          </div> 
         </div>

  </div>
  `  
     
 }


 function color_img(pos){
    const imgPanel = `
                <label class="color_img border p-2" for="Img_Color_input${pos.pos}" id="placeColorImage${pos.pos}" style="height:180px;width:180px;cursor: pointer;" >
                    <div class="d-block" style="margin-left:-10px;margin-top:-6px;">
                        <span class="p-1 border" style="background-color: #ffffffbe;" >${pos.color}</span>
                    </div>
                        <div id="Color_img${pos.pos}"  style="overflow:hidden;width:170px;height: 170px;margin-top:-20px;z-index-2" >
                                <div class="flex-direction-column  text-center "  >
                                    <img src="/static/pics/addPic.svg" class="classic_div" style="width:130px;height:130px"  alt="" srcset="">
                                </div>
                                <div class="text-center pb-2" >${lang('Weka picha','Add Image')}  </div>
                        </div>
                        
                    

                            <input type="file" hidden accept="image/*" multiple data-val="${pos.pos}" name="Img_Color_input${pos.pos}" class="Img_Color_input" id="Img_Color_input${pos.pos}">
                    
                    </label>
    `

    $('#img_with_color').append(imgPanel)
 }


 $('body').on('keyup','.idadi_jum_,.idadi_reja_',function(){
     set_idadi()
 })


 function set_idadi(){
    let i_jum=0,i_rej=0
      checkColor()
   $('.idadi_jum_').each(function(){
      if($(this).val()!=''){
          i_jum+=Number($(this).val())
      }
   })

   $('.idadi_reja_').each(function(){
      if($(this).val()!=''){
          i_rej+=Number($(this).val())
      }
   })
 
   if(i_jum>0 || i_rej>0){

    if($(`#add-products`).data('bs.modal')?._isShown){
        $('#idadi_bidhaa').prop('readonly',true)
        $('#idadi_bidhaa-reja').prop('readonly',true)

            $('#idadi_bidhaa').data('colored',1)
            $('#idadi_bidhaa').val(i_jum)
            $('#idadi_bidhaa-reja').val(i_rej)
           
    }else{
           
       
         
            $('#idadi_jum_jum').val(i_jum)
            $('#idadi_rejareja').val(i_rej)

        $('#idadi_jum_jum').prop('readonly',true)
        $('#idadi_rejareja').prop('readonly',true)

    }
          

   }else{

       if($(`#add-products`).data('bs.modal')?._isShown){
          $('#idadi_bidhaa').prop('readonly',false)
        $('#idadi_bidhaa-reja').prop('readonly',false)

        $('#idadi_bidhaa').data('colored',0)
        $('#idadi_bidhaa').val('')
        $('#idadi_bidhaa-reja').val('')

       }else{
          
            $('#idadi_jum_jum').val('')
            $('#idadi_rejareja').val('')
       }
   }

  
 }

 function checkColor(){
    const colr = $('.showingpop24').length 
    // console.log(colr);

    if(colr>0){
        $('#img_no_color').prop('hidden',true)
    }else{
        $('#img_no_color').prop('hidden',false)
    }
 }