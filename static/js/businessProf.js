
// When the user scrolls down 20px from the top of the document, show the button
// window.onscroll = function() {
//     scrollFunction()
//     console.log('non')
// };
// console.log('object')

window.addEventListener("scroll", function () {
      if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    $('#go_top').fadeIn(300)
  } else {
     $('#go_top').fadeOut(300)
  }
}, false);
