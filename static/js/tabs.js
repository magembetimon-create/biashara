
  //<!-- select options change -->
  $('body').on('change','.machaguo-pesa',function(){
    $($(this).find('option:selected').data('show')).siblings('.to_show').hide()
    $($(this).find('option:selected').data('show')).fadeIn(600)
  // console.log($(this).find('option:selected').data('show'))
  
  
  })




  
//tab animations

$(".tabs-animated a").click(function() {

  var position = $(this).parent().position();
  var width = $(this).parent().width();

  $(".floor").css({
    "left": position.left, 
    "width": width
  });

});


function getnavp(){
var actWidth = $(".tabs-animated").find(".active").parent("li").width();
var actPosition = $(".tabs-animated .nav-item .active").position();

$(".floor").css({
  "left": actPosition.left,
  "width": actWidth
});



// console.log(actPosition)
}


//for mobile sticky bottom nav.........................................................//
var navItems = document.querySelectorAll(".mobile-bottom-nav__item");
navItems.forEach(function(e, i) {
	e.addEventListener("click", function(e) {
		navItems.forEach(function(e2, i2) {
			e2.classList.remove("mobile-bottom-nav__item--active");
		})
    this.classList.add("mobile-bottom-nav__item--active");
    goTo('#nunua-panel')
	});
});






$('body').on('click','.tab_show',function(){
  $($(this).data('show')).siblings('.tab_div').hide()
  $($(this).data('show')).fadeIn(600)
if($(this).hasClass('gotop')){
 topslider.top()

}

})
