

function getLabours(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
      type: "POST", // if you choose to use a get, could be a post
        url: "/getWorkers",
      data: {csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
        thewakazi.state=data.worker
    })
}

getLabours()


//Customer search for sales
 //search customer.............................................................................//
 var index=-1;	
 $('body').on('keyup','.suggest-holder2nL input', function(){
 // Clear the ul   
 $(`.masaki2nL`).empty();

 let labors = thewakazi.state
  
 // Cache the search term
 var search = $(this).val();
 
 // Search regular expression
 var regrex = /[^a-z0-9 ]/gi;
 search = new RegExp(search.replace(regrex,''), 'i');
     var lin;
 

  // Loop through the array
  labors.forEach(l => {
    let jina_namba = l.jina + ' ' +l.workerId 
    if(jina_namba.match(search)){
        var li=`<li data-value=${l.id}  >
 
     <div  class='suggest-name text-capitalize py-1' > 
       <span class="pr-1 border-right mr-1"> ${l.workerId}</span> <span class="brown"> ${l.jina} </span> </div> 
       <div class="p-1 border-top" >${l.kazi}</div>
      
    </li>`;
    
    $(`.masaki2nL`).append(li);

    }

 });
 
 if($(this).val().length > 0){
     $(`.masaki2nL`).show();
 }else{
     $(`.masaki2nL`).hide();
 
 }
 
 
 });
 
     
    //trigger an event when user click the list.............................................// 
 $('body').off('click','.masaki2nL li').on('click','.masaki2nL li', function(){
     let valu = $(this).data('value')
      let itm = it=>it.id === valu
     const custmi = thewakazi.state.filter(itm)

     $('.suggest-holder2nL input').val(titleCase(custmi[0].jina))
     $('.suggest-holder2nL input').data('cust',custmi[0].id)
     $('.suggest-holder2nL input').data('reg',0)
     $('.suggest-holder2nL input').data('reg_val',0)

     $('#cust_address').val(custmi[0].address)
     $('#cust_phone').val(`+${custmi[0].code} ${custmi[0].simu1}`)
     $('#cust_mail').val(custmi[0].email)

    $(`.masaki2nL`).hide();

 });
