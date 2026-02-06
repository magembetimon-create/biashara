// var acc = document.getElementsByClassName("showtoopanel");
// var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     // this.classList.toggle("active");
//     var panel = document.getElementById($($(this).attr('show')));
//     if (panel.style.maxHeight) {
//       panel.style.maxHeight = null;
//     } else {
//       panel.style.maxHeight = panel.scrollHeight + "px";
//       console.log($($(this).attr('show')))
//     } 
//   });
// }


// create aclass to be called whenever an action is made on the div
class setn{
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
//var n=false 

let isset =new setn(false)

class hide_shown{
  constructor(_state){

  }
  get state(){
    return this.stated
  }

  set state(newstate){
     this.stated=newstate

  }


}


$('body').on('click','.showtoopanel',function(){
  $(this).css('border',0)
//   console.log($(this).attr('show'))

var panel = document.getElementById($(this).attr('show'));
if (panel.style.maxHeight) {
    $(this).children('span').html('<img src="/static/pics/chevronup.svg">')
 $($(this).data('panel')).removeClass('slide-top')
isset.state=false
  panel.style.maxHeight = null;
} else {
  panel.style.maxHeight = panel.scrollHeight + "px";
 $($(this).data('panel')).addClass('slide-top')
topslider.top()
  $(this).children('span').html('<img src="/static/pics/chevrondown.svg">')
isset.state=true
  divvar=$(this).data('panel')
} 

})
   



//  $('body').on('mouseup','.slide-top',function(e){

// if ($(e.target).closest(this).length === 0) { 
// var panel = document.getElementById($(this).attr('show'));

// $(this).removeClass('slide-top')
// $('.showtoopanel').children('span').html('<ion-icon name="chevron-down-outline"></ion-icon>')
// panel.style.maxHeight = null;  
//          } 

//  })


 $(document).mouseup(function (e) { 
   if(isset.state){
       if ($(e.target).closest(".slide-top").length 
                === 0) { 
          var panel = document.getElementById($('.slide-top').attr('show'));

         $('.slide-top').removeClass('slide-top')
     $('.showtoopanel').children('span').html('<img src="/static/pics/chevronup.svg">')
        panel.style.maxHeight = null;  
                
      isset.state=false
      } 
   }else if($('.pop').hasClass("pop_show")){
     $('.pop').removeClass("pop_show")
   }
  
}); 
// $('body').on('click','.hidetoopanel',function(){
//     $($(this).attr('hide')).removeClass('d_expand')
//     $($(this).data('panel')).removeClass('slide-top')
//     $(this).hide()
//     $(this).siblings('button').show()
    

    
// })