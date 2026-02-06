
  
  class topslide{
      constructor (_hash){

        this.hash = _hash

      }


      top(){
        $('html, body').animate({
            scrollTop: $(this.hash).offset().top 
          }, 300, function(){
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = this.hash;
          }); 
      }
  }

// let topslider = new topslide('#topper')

// topslider.top()


// Animate numbers

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min(parseInt(timestamp - startTimestamp) / duration, 1);
    if(obj){
      obj.innerHTML = (floatValue(progress * (end - start) + start));
    }
     
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function animateValueAsNum(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min(parseInt(timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = floatValue(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}


//go to top of to a div riquired
function goTo(toping){
  //Making div top Top
 const hash = toping,
   moveTo = Number($(hash).offset().top - 90);

   // Using jQuery's animate() method to add smooth page scroll
   // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
   $('html, body').animate({
     scrollTop: moveTo
   }, 800, function(){
     // Add hash (#) to URL when done scrolling (default click behavior)
    //  window.location.hash = hash;
   });

   
}


  
