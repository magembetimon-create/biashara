
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
        setTimeout(function(){ IntervaFunct(); }, 5000);
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
if(data.notice.length>0){
      notificate(data.notice)
    }  

//  POP  CHAT
if(data.chat.length>0){
    popChat(data.chat,data.owner)
}else{
    $('#chats_pop').fadeOut(50) 
    $('#chats_shake').hide()         
}

//SHOW ADJ NOTES

if(data.adj?.length>0){
    adjss(data.adj)
}

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



function notificate(note){

    $('#there_is_note').text(note.length)
    $('#there_is_note').show()
   
    nt1 = note[0]

   

    pop=[
        {
            note:lang('Kuhamisha Bidhaa','Item Transfer'),
            action:nt1.itmTr,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-90deg-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"/>
          </svg>`,
            
        },
        {
            note:lang('Kuediti Bidhaa','Item Editing'),
            action:nt1.ItemEdit,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>`,
            
        },
        {
            note:lang('Kuediti Aina ya Bidhaa','Items Category Editing'),
            action:nt1.ItemCatEdit,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>`,
            
        },
        {
            note:lang('Kupokea Bidhaa','Item Receive'),
            action:nt1.itmRcv,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-90deg-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.854 14.854a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V3.5A2.5 2.5 0 0 1 6.5 1h8a.5.5 0 0 1 0 1h-8A1.5 1.5 0 0 0 5 3.5v9.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4z"/>
          </svg>`,
            
        },
        {
            note:lang('Kurudisha bidhaa','Item Return'),
            action:nt1.bilRtn,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-cart-dash-fill" viewBox="0 0 16 16">
            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.5 7h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z"/>
          </svg>`,
            
        },
        {
            note:lang('Oda ya Mauzo','Sales Order'),
            action:nt1.saO,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-cart-check" viewBox="0 0 16 16">
            <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>`,
            
        },
        {
            note:lang('Mzigo wa kusafirisha','Package delivery'),
            action:nt1.pickUp,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>`,
            
        },
        {
            note:lang('Mauzo Kurudi','Sales Return'),
            action:nt1.saRtn,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-cart-x" viewBox="0 0 16 16">
            <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>`,
            
        },
        {
            note:lang('Oda ya manunuzi','Purchase Order'),
            action:nt1.puO,
            icon:`<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"  fill="currentColor">
            <path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none"/>
            <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/>
            </svg>`,
            
        },
          ]


const ntI= pop.find(x=>x.action) 
// console.log(pop)

   $('#notify').html(`<h6 style="color: beige;" >${ntI.note}</h6>
   <a href="/notify?vl=${nt1.note}" class="d-flex" style="color: beige;">
   <div class="NoteIcon">
            <div id="NoteIcon"  class="rounded-circle p-2 pt-1 justify-content-center d-flex"  style="align-items:center;background-color: rgb(0, 51, 128);color:#fff;width:40px;height:40px" >
                 ${ntI.icon}
            </div>
     </div> 
     <div class="the-note pl-2 latoFont " id="the_note_msg" >
          ${lang(nt1.msg_swa,nt1.msg_eng)}
     </div>
    </a>`)

   $('#notify').show(500)

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


//adjustemts....
function adjss(adj){
   $('#adjst_notify').show(300)
   $('#adj_by').html(`${adj[0].f_name} ${adj[0].l_name}`)
   $('#adjs_href').attr('href',`/stoku/viewAdjst?item_valued=${adj[0].adjs_id}&un=${Number(adj[0].Return)}`)
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