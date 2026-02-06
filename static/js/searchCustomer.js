//Customer search for sales
 //search customer.............................................................................//
 var index=-1;	
 $('body').on('keyup','.suggest-holder2n input', function(){
 // Clear the ul   
 $(`.masaki2n`).empty();

 let custm = customers.state
  
 // Cache the search term
 var search = $(this).val();
 
 // Search regular expression
 var regrex = /[^a-z0-9 ]/gi;
 search = new RegExp(search.replace(regrex,''), 'i');
     var lin;
 
 // Loop through the array
 for(let i in custm ){

 if(custm[i].jina.match(search)){
     let li=`<li data-value=${custm[i].id} >
     <a  class='suggest-name latoFont pl-2 text-capitalize' style="color:" data-value=${custm[i].id}  >${custm[i].jina} </a> 
        <a class="d-block" style='padding:7px'>
            <span class='suggest-description' style='float:left;color:#777'>${custm[i].address }</span>
            <span class='suggest-description' style='color:blue'> (+${custm[i].code} ${Number(custm[i].simu1)}) </span>
        </a>
     </a>
    </li>`;
    
    $(`.masaki2n`).append(li);
 }
 }
 
 if($(this).val().length > 0){
     $(`.masaki2n`).show();
 }else{
     $(`.masaki2n`).hide();
 
 }
 
 
 });
 
     
    //trigger an event when user click the list.............................................// 
 $('body').off('click','.masaki2n li').on('click','.masaki2n li', function(){
     let valu = $(this).data('value')
      let itm = it=>it.id === valu
     const custmi = customers.state.filter(itm)

     $('.suggest-holder2n input').val((custmi[0].jina))
     $('.suggest-holder2n input').data('cust',custmi[0].id)
     $('.suggest-holder2n input').data('reg',0)
     $('.suggest-holder2n input').data('reg_val',0)

     $('#cust_address').val(custmi[0].address)
     $('#cust_phone').val(`+${custmi[0].code} ${custmi[0].simu1}`)
     $('#cust_mail').val(custmi[0].email)

    $(`.masaki2n`).hide();

 });
