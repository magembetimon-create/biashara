function getChats(to){
   
      if(!($("#ChattingModal").data('bs.modal')?._isShown)){ 
                    $('#ChattingModal').modal('show')
                    $('.chatts_display').hide()
                    $('#chat_loader').show() 
       }
     

  

 const dta = {
       url: "/AllChats",
       data: {to:to,} 
      },sendIT = POSTREQUEST(dta)

      sendIT.then(data=>{
        if(data.success){

            

          $('#chattingForm').data('ans',0);
          $('#display-alert').fadeOut(300)

              $('#chattingForm').data('to',to)  
              
               getUserChats()

                  $('#chat_loader').hide() 
                  $('.chatts_display').show()


            
            let tar = moment().format("YYYYMMDD"),
                img = data.to.picha,
                name=data.to.name

                

              $('#the_textingField').data('date',tar)
              $('#toName').text(name)
              if( img!=''){
               
                  $('#toImg').html(`
                     <img src="${img}" style="width:50px;height:50px;border-radius:50%">
                  `)
              }else{
                  $('#toImg').html(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>
              
                  `)
              }

            

             if(data.chat.length>0){
              
                 const allTextdt = data.chat.map(t=>theDate(t.date) )
                      function theDate(d){
                              return Number(moment(d).format("YYYYMMDD"))
                      }

                  const date_text = [...new Set(allTextdt)]                        

                      
                let li=``
             
                if(date_text.length>0){
                    date_text.reverse().forEach(dt => {
                    const tdytxt = data.chat.filter(d=>Number(moment(d.date).format("YYYYMMDD"))==Number(dt))
                       
                     if(tdytxt.length>0){
                          li+=`<li class="py-1 text-center border-bottom   whiteBg"  > `
                      // ${moment(tdytxt[0].date).format("DD MMM YYYY")} 
                      let  dd =  Number(tar)-Number(dt)  
                      if(Number(dt)==Number(tar)){
                          li+=` ${lang('Leo','Today')}`
                      }else if(dd==1){
                         li+=`${lang('Jana','Yesterday')}`
                      }else if(dd>1&&dd<7){
                          li+=`${moment(tdytxt[0].date).format("dddd")} `
                      }else{
                           li+=`${moment(tdytxt[0].date).format("DD/MM/YYYY")} `
                      }


                      

                      
                          
                      li+=`</li >`,
                              by = Number($('#the_textingField').data('by'))
                             
                          tdytxt.reverse().forEach(txt => {
                              let left = 'right',
                                  
                                  color = 'rgba(151, 168, 190, 0.418)',
                                  border_radius = '20px 0 20px 20px',
                                  na = txt.f_name + ' '+ txt.l_name ,
                                  flex = "flex-row-reverse",
                                  read = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                                            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"/>
                                            <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"/>
                                          </svg>`,
                                 kiwa = 'akiwa katika',
                                 swari = ``      
                                  
                              
                                                      
                              if(!(Number(to)==Number(txt.kwa))){
                                  
                                      left = 'left'
                                      color = 'rgba(185, 155, 154, 0.486)'
                                      border_radius = '0 20px 20px 20px'
                                      flex = "flex-row"  
                                      read=''
                                      
                                      
                              }

                              if(by==Number(txt.By_id)){
                                  na = lang('Wewe','You')
                                  kiwa = 'ukiwa katika' 
                              } 
                              



                               li+=`<li class="my-2  text-${left}" id="text${txt.id}" >
                                <div class="d-flex ${flex} pt-2">
                                      <div data-qz="${txt.qzTo_id}" data-item="${txt.onItem_id}" data-onItem="${txt.item}" data-text="${txt.msg}"class="p-2 text-left smallFont penye-msg" style="background-color: ${color};border-radius:${border_radius};max-width:200px">
                                    
                               `
                              
                              if(txt.audio == "" || txt.to_deleted ){
                                   //li+=``
                                     if(txt.msg!='' && !(txt.to_deleted || (txt.from_deleted && (Number(to)==Number(txt.kwa))) ) ) {
                                       
                                      li+=`${txt.msg.replace(/[<>{}$()`]/g, "")}`

                                      if(txt.jibu!=null){
                                        const ansTo = data.chat.find(x=>x.qzTo_id===txt.jibu)
                                        
                                        
                                            
                                        //IF CHATS IS ANSWER TO MESSAGE ASKED ON ITEM
                                        li+=`
                                        <hr/> 
                                         <span class="text-info" >${lang('Jibu kwa','Answer To')}</span>
                                        <i style="color:#520b0b">
                                           ${ansTo.msg}
                                        </i>
                                        <span class="text-info" >${lang('Kwa','On')}</span>
                                        <a class="text-capitalize" href="/displaySelItem?i=${ansTo.onItem_id}&value=${ansTo.kwa}" >
                                              <i>${ansTo.item}</i>
                                          </a>
                                        `
                                      }

                                            }else{

                                              li+=`<i class="text-danger  smallerFont" >
                                                  <u>${lang('Ujumbe umefutwa','Messege deleted')}</u>
                                                  </i>`
                                            } 
                                        
                                       // li+=``
                              

                              }else{
                                //AUDIO TEXT DISPLAY ...........................................//
                                  li+=`                   
                                      <audio hidden class="hidden_audio" src="${txt.audio}" id="audi${txt.id}" controls >
                              
                                      </audio>
                                      <div class="controls">
                                         
                                          <button class="player-button btn-default btn"  id="play${txt.id}" data-play="${txt.id}" >
                                          
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
                                                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                                          </svg>
                                          </button>
                                          <input type="range" class="timeline" id="timeline${txt.id}" max="100" value="0">
                                          <button data-play="${txt.id}" class="sound-button btn-default btn ">
                                          
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
                                              <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                                          </svg>
                                          </button>

                                          </br>
                                      </div>

                                    

                                      `
                              }  

                              //INCASE THE USER WROTE WHEN ON PURCHASE OR SALES ORDER
                              if(txt.onOrder_id!=null){
                                let niPuOda = '',
                                    niSaOda = '',
                                    PU = 'BIL',
                                    INVO = 'INVO'

                                 if(txt.nipuoda){
                                     niPuOda = lang('oda ya','Order')
                                     PU = 'PUO'
                                     INVO = 'ORD'
                                 }

                                 if(txt.pickups && txt.thePick == PERSONAL ){
                                     niPuOda = lang('Mzigo','Package')
                                     PU = 'PACK'
                                     INVO = 'PACK'                                    
                                 }

                                 if(txt.niSaOda){
                                     niSaOda = lang('oda ya','Order')
                                 }

                           
                                li+=`<div class="smallFont mt-1" style="border-top:1px solid #f2f2f2">`
                               if((Number(txt.odaFrom)==Number(DUKANI)) ){
                                   li+=`
                                     <span class="text-info smallerFont " >${lang(`Juu ya ${niSaOda} mauzo`,`On Sales ${niSaOda}`)}</span>
                                   <a   href="/mauzo/viewOda?item_valued=${txt.pu}" ><i style="color:brown">${INVO}-${txt.oda}</i></a>

                                   
                                   `
                               }else if(txt.pickups && txt.thePick == PERSONAL ){
                                    li+=`
                                    
                                    <span class="text-info smallerFont " >${lang(`Juu ya mzigo`,`On Package `)}</span>
                                    <a href="/purchase/ViewPickup?p=${Number(txt.pu)}" ><i style="color:brown">PACK-${txt.pickCode}</i></a>
                                    `
                               }else{ 
                                  li+=`
                                  <span class="text-info smallerFont " >${lang(`Juu ya ${niPuOda} Manunuzi`,`On Purchase ${niSaOda}`)}</span>
                                   <a href="/purchase/viewOdered?value=${txt.odaFrom}&pu=${txt.pu}" ><i style="color:brown">${PU}-${txt.puO}</i></a>
                                  
                                     `
                               }
                               li+=`</div>`
                             }

                               //WHEN ON ITEM ................................................// 
                               if(txt.item!=null   ){
                                li+=`
                                <div class="mt-1" style="border-top:1px solid #f2f2f2">
                                <span class="text-info" >${lang(kiwa,'when on')}</span>
                                <a class="text-capitalize" href="/displaySelItem?i=${txt.onItem_id}&value=${txt.item_from}" >
                                    <i>${txt.item}</i>
                                </a>
                                </div>
                                `

                             
                                }


                              li+=` </div></div>`

                              let tog = '',drop=''
                              if(!(txt.to_deleted || (txt.from_deleted && (Number(to)==Number(txt.kwa))))){
                                tog = 'data-toggle="dropdown"'
                                drop = 'dropdown-toggle'
                              }


                              li+=`    
                              
                               <div class=" mt-1 d-block position-relative text-capitalize text-${left} dropright" id="txtBy${txt.id}"  >
                               
                                <button type="button" class="btn btn-default latoFont ${drop} " ${tog} aria-haspopup="true" aria-expanded="false" style="font-size: 11px;color:#777">
                                `  
                                if(txt.Anyuser_read){
                                 li+= `<span class="text-primary" > 
                                          ${read}
                                      </span>`
                                }
                                
                                li+=`${na} <span class="border-left ml-1 pl-1 " >${moment(txt.date).format('hh:mm:ssa')}</span>  
                                 </button>`  
                                
                                 if(!(txt.to_deleted || (txt.from_deleted && (Number(to)==Number(txt.kwa))))){
                                      
                                    li+=`<div class="dropdown-menu smallerFont dropdown-menu-right latoFont text-secondary">`
                                      
                                    //WHEN THE USER IS ON ITEM SET MESSAGE AS ASKED QUESTION.........................................//
                                    if(!(Number(to)==Number(txt.kwa)) && txt.item_from == txt.kwa && txt.qzTo_id == null && txt.msg!='' ){
                                        li+= `<button class="dropdown-item" type="button" 
                                            onclick="var dt={data:{txt:${txt.id},csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},url:'/asQuestion'};sendTxtData(dt)"
                                          
                                            title="${lang('Weka ujumbe kama swali lililourizwa kuhusu bidhaa','Set text as asked question about the Item')}">
                                              <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="#4b4b4b">
                                              <path d="M0 0h24v24H0V0z" fill="none"/>
                                              <path d="M11 23.59v-3.6c-5.01-.26-9-4.42-9-9.49C2 5.26 6.26 1 11.5 1S21 5.26 21 10.5c0 4.95-3.44 9.93-8.57 12.4l-1.43.69zM11.5 3C7.36 3 4 6.36 4 10.5S7.36 18 11.5 18H13v2.3c3.64-2.3 6-6.08 6-9.8C19 6.36 15.64 3 11.5 3zm-1 11.5h2v2h-2zm2-1.5h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/>
                                            </svg>
                                                ${lang('Swari Kuhusu Bidhaa','Question About Item')}
                                            </button>`
                                      }

                                      //WHEN MESSAE IS SET AS QUESTION REMOVE  OR ANSWER
                                      if(txt.qzTo_id != null){
                                        li+=`
                                          <button class="dropdown-item "
                                           onclick="$('#chattingForm').data('ans',${txt.qzTo_id});
                                                 $('#display-alert').fadeIn(500)
                                           "
                                          
                                          title="${lang('Ujumbe huu umewekwa kama swari lililoulizwa kuhusu bidhaa','This text message added to asked question about ana item')}" type="button">
                                                
                                          <svg xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 24 24"  fill="#4b4b4b">
                                          <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H5.17L4,17.17V4h16V16z"/><polygon points="12,15 13.57,11.57 17,10 13.57,8.43 12,5 10.43,8.43 7,10 10.43,11.57"/>
                                          </svg>
                                                

                                               ${lang('Ongeza jibu kwa Swari','Add Answer to asked Question')}  
                                             </button> 

                                             <button class="dropdown-item" 
                                             onclick="var dt={data:{txt:${txt.id},csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},url:'/toaSwari'};if(confirm('${lang('Ondoa Ujumbe kama swari kwa bidhaa','Remove Chat as question to an Item')}')){sendTxtData(dt)}"
                                             title="${lang('Ujumbe huu umewekwa kama swari lililoulizwa kuhusu bidhaa','This text message added to asked question about ana item')}"  type="button">
                                                
                                             <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="#4b4b4b">
                                             <path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 4v12h-1.34l1.91 1.91C21.39 17.66 22 16.9 22 16V4c0-1.1-.9-2-2-2H4.66l2 2H20zM6 12h2v2H6zm12-3h-6.34l2 2H18zm0-3h-8v1.34l.66.66H18zM1.41 1.59L0 3l2.01 2.01L2 22l4-4h9l5.73 5.73 1.41-1.41L1.41 1.59zM5.17 16L4 17.17V7l2 2v2h2l5 5H5.17z"/>
                                            </svg>
                                                

                                               ${lang('Ondoa ujumbe kama swari','Remove text as Question')}  
                                             </button> 
                                             </div>
                                        `
                                      }else{
                                      li+=`<button class="dropdown-item " 
                                      
                                      onclick="var dt={data:{txt:${txt.id},csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},url:'/futatext'};if(confirm('${lang('Ondoa Ujumbe','Remove Chat')}')){sendTxtData(dt)}" type="button">
                                          <span class="text-danger">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                              </svg>
                                          </span>

                                        ${lang('Futa ujumbe','Delete chat')}  
                                        </button> 
                                        </div>`                              
                                      }

                                     

                                  }

                                 

                                
                                   li+=`
                                   </div>

                               
                               </li>`
                            

                              
                          });

                          $('#the_textingField').html(li)
                          
                          var elem = document.getElementById('chats_div');
                          //    elem.scrollTop = elem.scrollHeight;
                          $('#chats_div').animate({scrollTop:elem.scrollHeight}, 1)
                          
                          


                              
                      }
                    })
                }else{
                    $('#the_textingField').append(
                    `<li><div class="container d-flex justify-content-center align-items-center" style="min-height:199px">
                    <p>${lang('Hakuna ujumbe kwa sasa','No chats availabe')}</p>
                    </div></li>`
                )
                }
               
                
            }else{
                $('.the_textingField').append(
                    `<li><div class="container d-flex justify-content-center align-items-center" style="min-height:199px">
                    <p>${lang('Hakuna ujumbe kwa sasa','No chats availabe')}</p>
                    </div></li>`
                )
            }

            if(data.to.phone){
              const ph = `
                  <a href="tel:${data.to.phone}" class="nodecoration text-muted border" style="font-size: 1.1em;color:var(--fontColor);padding: 5px;border-radius:7px" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    |
                    ${data.to.phone}
                </a> 
              `

              $('#phoneCall').html(ph)
            }else{
              $('#phoneCall').html('')
            }


         }else{
       
          toastr.error(lang('Haikufanikiwa kutokana na hitilafu tafadhali jaribu tena',"an error occurred please try again", 'error Alert', {timeOut: 2000}));
         }
      })


}

$('#chattingForm').submit(function (e) { 
    e.preventDefault();

  let  text = $('#thet_text').val() || '',
       to = $(this).data('to') ,
       it = $(this).data('item') ,
       od = $(this).data('oda') 
       

    if(text.trim()!=''){
        $('the_text_area').removeClass('redborder')
        $('#the_textingField').append(
            `
            <li class="text-right py-1 my-2">
                     <div class="spinner-grow spinner-grow-sm"></div>
                      <div class="p-2 float-right smallFont" style="background-color: rgba(151, 168, 190, 0.418);border-radius:20px 0 20px 20px;max-width:50%">
                          ${text}
                      </div>
                      
                  </li>
            `
        )
        var elem = document.getElementById('chats_div');
        //    elem.scrollTop = elem.scrollHeight;
        $('#chats_div').animate({scrollTop:elem.scrollHeight}, 300)
        $('#thet_text').val('')
           data={
             data:{
               it:it,
                od:od,
                to:to,
                ans:$(this).data('ans'),
                text:text,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
          },url:"/sendChat"
           }
          sendTxtData(data)
           
       
    }else{
        redborder('#the_text_area')
    }
    
});



function sendTxtData(data){
    if('txt' in data.data){
      $(`#txtBy${data.data.txt}`).prepend(`<div class="spinner-grow spinner-grow-sm"></div>`);
    }
     $.ajax({
            type: "POST",
            url: data.url,
            data: data.data,
            success: function (resp) {
              if('txt' in data.data){
                if (resp.success){
                  toastr.success(lang(resp.msg_swa,resp.msg_eng), lang('Imefanikiwa','Success'), {timeOut: 2000});

                }else{
                  toastr.error(lang(resp.msg_swa,resp.msg_eng), lang('Haijafanikiwa','Error'), {timeOut: 2000});

                }
              }

              if('reload' in data ){
                location.reload()
              }else{
                getChats(resp.to)
              }
                

            }
        });

}



function markReadChat(chat){
    // $('.chatts_display').hide()
    $.ajax({
        type: "POST",
        url: "/markReadChat",
        data: {
         chat:chat,
         csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },success: function (data) {
            if(data.success){
                $('#ChattingModal').modal('show')
            }
            getChats(data.to)
            
         }
   })
        
}



function getUserChats(){

    $.ajax({
         type: "POST", 
           url: "/getUserChats",
           data: {csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
         }).done(function(data){
          $('#chatted_loader').hide()
           let lis = '',
               tar = moment().format("YYYYMMDD")
  
              
         if(data.data){
         const ALLCHATs = data.chats
              ALLCHATs.sort((a,b)=>(a.chatId>b.chatId)? 1 :(a.chatId ===b.chatId)
              ?((a.chatId > b.chatId)? 1 : -1) : -1 )

         ALLCHATs.reverse().forEach(c=>{
          let dt = moment(c.last_chat.at).format("YYYYMMDD"),
              dd =  Number(tar)-Number(dt),
              when = '',
              userImg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>`
  
  
          if(Number(dt)==Number(tar)){
            when=` ${lang('Leo','Today')}`
          }else if(dd==1){
            when=`${lang('Jana','Yesterday')}`
          }else if(dd>1&&dd<7){
            when=`${moment(c.last_chat.at).format("dddd")} `
          }else{
            when=`${moment(c.last_chat.at).format("DD/MM/YYYY")} `
          }
  
           lis+=`
           <li class="px-2 latoFont  border-bottom" data-user="${c.name}" >
            <a type="button" onclick="getChats(${c.to})"   >
              <div class="row ">
               <div class="col-2 centerItem">
                    <div  class="the_chat_img centerItem"  >`
  
                     if(c.duka && c.logo!='' ){
                       lis+=`<img src="${c.logo}"  > `
                     }else if(c.owner_pic && !c.duka ){
                       lis+=`<img src="${c.owner_pic}"  > `
                        
                     }else{
                       lis+=userImg
                     }
                     
  
  
        lis+=`</div>
               </div>
               <div class="col-10 ">
                 <div >
                  <div class="content fontColor ">
                  <h6 style="font-weight: 500;" class="text-capitalize" >${c.name}</h6>
                   <div class="msg" style="margin-top: -9px;" >`
                    if(c.anread>0){
                         lis+=` <span class="badge badge-danger latoFont"  >${c.anread}</span>`
                    }
                    
                    lis+=` <span class="text-muted font-weight-light">`
                       
                      if(c.last_chat.audio==''){
                        lis+=c.last_chat.text.slice(0,18) 
                      }else{
                        lis+=`
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
                          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                        `
                      }
                    
                  lis+= ` 
                    <br>
                     ${when} ${moment(c.last_chat.at).format('hh:mma')}
                    </span>
                    </div>
           
                 </div>
                 </div>
      
                </div>
             </div>
            </a>
           
          </li>    
           `
         })
  
         } 
         else{
             lis=`<li class="text-center mt-5">${lang('Hakuna chati zilizopatikana kwa sasa','No chats available')}</li>`
         }
        $('#chatted_users').html(lis)
        })
      }



      