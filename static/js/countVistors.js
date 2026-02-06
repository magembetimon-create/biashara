function countVistors(){
         const where ={
               home:Number($('#vistors').data('home')) || 0,
               about:Number($('#vistors').data('about')) || 0,
               map:Number($('#vistors').data('map')) || 0,
               reg:Number($('#vistors').data('reg')) || 0,
               item:Number($('#vistors').data('item')) || 0,
               brand:Number($('#vistors').data('brand')) || 0,
               categ:Number($('#vistors').data('categ')) || 0,
               group:Number($('#vistors').data('group')) || 0,
               shop:Number($('#vistors').data('shop')) || 0,
               csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
         }


         $.ajax({
            type: "POST", // if you choose to use a get, could be a post
              url: "/countVistors",
            data: where,
          })
}


countVistors()