
var ALLOWED = true
const MsgRead = document.getElementById('msgRead'),
      newMsg = document.getElementById('notifyAudio')
// setInterval(
 function IntervaFunct() {
        var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
        // let getstaffobj= new getstaff()
     $.ajax({
        type: "POST", // if you choose to use a get, could be a post
         url: "/traceChange",
        data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
        $('#network_').fadeOut(100)
        setTimeout(function(){ IntervaFunct(); }, 30000);
         $('#ShowNewBanners').prop('hidden',data.newPosts == 0)     
         $('#shakeForNewPosts').prop('hidden',data.newPosts == 0)     
         $('#newBanner').text(data.newPosts)   
         
         
            
      

    if(data.duka != DUKANI )
    {
         location.replace("/userdash")
    }
    //bills showup
        billProcess(data.unpaid,data.halfpaid)
    //oder_noty
        orderprocess(data.order)
    
    
        let x = data.online, y=$("#storeUseronline").text(), asum=$('#AkauntiChange').text(),anewsum=data.Asum?.Amount__sum
// detect new logedin user


            if(x!=y && data.entp ){
                getstaffobj.allstaff() 
            }  

 //FOR RATINGS : IF RATINGS AVAILABLE
 
 if(data.ratings){
    $('#ifRating').show(500)
 }else{
    $('#ifRating').hide(500)
 }           

//   detect if there is a change in akaunts 
           if(((parseInt(asum)!=parseInt(anewsum)) || ($('#numberAc').text()!=data.Count)) && data.entp){
              getAkaunts.getdata()     
           }

// POP NOTIICATIONS IF ANY ..............................................................//
const pendingReceipts = Number(data.pendingExpenseReceipts || 0);
const hubPending = Number(data.hubPending || 0);
    if ((data.notice && data.notice.length > 0) || hubPending > 0) {
      notificate(data.notice || [], hubPending);
} else {
      $('#there_is_note').hide();
      $('#notify').hide();
}

const compoundOrders = Number(data.compoundOrders || 0);
const compoundPanel = $('#compoundOrdersPanel');
if (compoundPanel.length) {
  if (compoundOrders > 0) {
    compoundPanel.show();
    $('#compoundOrdersBadge').text(compoundOrders).removeClass('d-none');
    if (typeof window.loadCompoundOrders === 'function') {
      window.loadCompoundOrders();
    }
  } else {
    compoundPanel.hide();
    $('#compoundOrdersPanelBody').hide();
  }
}

//  POP  CHAT
if(data.chat.length>0){
    popChat(data.chat,data.owner)
}else{
    $('#chats_pop').fadeOut(50) 
    $('#chats_shake').hide()         
}

//SHOW ADJ NOTES — hub badge only, no popup

if(data?.pickup.length>0) pickUp(data.pickup)

    }).fail(function(jqXHR, exception){
        setTimeout(function(){ IntervaFunct(); }, 5000);
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        $('#network_').show(400)
        $('#loadMe').modal('hide')
    })
}
// ,2000)

IntervaFunct() 

function orderprocess(oda){
    if(oda>0){
        $('#saOda_shake').show(500)
        $('#saOda_shake').text(oda)
    }else{
        $('#saOda_shake').fadeOut(500)
        $('#saOda_shake').text(0)
    }
}


//showing up bills
function billProcess(unpaid,halfpaid){

    if(unpaid>0){
         $('#bil_hazijalipiwa').fadeIn(200)
     }else{
         $('#bil_hazijalipiwa').fadeOut(300)
      }
     if(halfpaid>0){
         $('#bil_malipo_kiasi').fadeIn(200)
     }else{
         $('#bil_malipo_kiasi').fadeOut(300)
         
     }
}



function notificate(note, extraCount){
    extraCount = Number(extraCount || 0);
    const baseLen = note && note.length ? note.length : 0;
    const total = baseLen + extraCount;
    $('#notify').empty().hide();
    if (total <= 0) {
      $('#there_is_note').hide().text('');
      return;
    }
    $('#there_is_note').text(total).css('display', 'block');
}


//pop chats
function popChat(chat,owner){
  //console.log(chat)
   const adm_read = chat.filter(t=>!t.admin_read),
         any_read = chat.filter(t=>!t.Anyuser_read)
         $('#chats_shake').show()
   if (owner){
       
       $('#chats_shake').text(adm_read.length)
   }else{
        $('#chats_shake').text(any_read.length)
   }



   getUserChats()

//    SHOW POP ...........................//
  
   newMsg.play()
   
    let  txt = any_read[0] 

    
   if(txt){
         let    text_pop=`
    
    <div onclick="getChats(${txt.From_id});$(this).hide(400)"  class="btn chat_pop_btn d-flex justify-content-center aligns-items-center" data-from=0 >

      <div class="chat_user_img  d-flex ml-2 aligns-items-center p-2 text-light" style="width: 130px;border-radius:20px;height:45px;background:rgb(0, 102, 255)" >
         
          <div class="smallerFont px-1 font-weight-light latoFont " >`
          if(txt.audio==""){
            if(txt.msg.length>20){
                text_pop+=`${ txt.msg.replace(/[\/\\#,$~%"*?<>{}`]/g, "").slice(0,18)} ...`
            }else{
                text_pop+=`${ txt.msg.replace(/[\/\\#,$~%"*?<>{}`]/g, "")}`
            }
            }else{
                                
                text_pop+=`
                <span style="color:#fff;float:center">
               
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
                    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                </svg>
            </span>
                `
            }   


         text_pop+=`</div>
      </div> 
        <div  style="height: 12px;width:12px;transform:rotate(45deg);margin-left:-8px;margin-top:18px;background:rgb(0, 102, 255)" >
        </div>    
        <div class="chat_user_img whiteBg ml-1 " style="border-radius: 50%;height:47px;width:47px;border:2px solid rgb(0, 102, 255)" >
    `
        if(txt.imgBy!=''){
            text_pop+=`<img class="classic_div" style="height:100%;width:100%;border-radius:50%;" src="${txt.imgBy}" alt="">`
            }else{
                text_pop+=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg> `
              }
    
    


       text_pop+=`</div>
                   </div>`
        $('#chats_pop').html(text_pop)      
        if(!$('#ChattingModal').data('bs.modal')?._isShown){
             $('#chats_pop').show(500)
              
        }else{
            const  sendTo = Number($('#chattingForm').data('to'))
            if(sendTo==Number(txt.From_id)){
                getChats(txt.From_id)
                MsgRead.play()
            }

        }    
   }
        
       
   


}


//PICKUPS............................//
function pickUp(pk){
    let pck= ``

    pk.forEach(p => {
        pck += `
        <a href="/purchase/ViewPickup?p=${Number(p.id)}" class="d-flex smallFont latoFont shadowed noprimary my-2 whiteBg p-3">
        <div class="deliveryIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>  
        </div>
        <div class="border-left ml-1 pl-1">
          <h6 class="darkblue" >PACK-${p.codi}</h6>
          <div>${lang('Kutoka','From')}: <u class="text-primary text-capitalize">${p.From}</u></div>
          <div>${lang('Kwenda kwa','To')}: <u class="text-primary text-capitalize"> ${p.To}</u></div>
        </div>
      </a>
        `
    });

    $('#pickupNote').html(pck)
}


//setInterval(function(){console.log('yes');},100)

//setTimeout(function(){ IntervaFunct(); }, 2000);