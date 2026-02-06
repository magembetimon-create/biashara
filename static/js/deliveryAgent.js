

function  getAget(){
    $.ajax({
    type: "POST",
    url: "/getAgentdata",
    data: {csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
    success: function (rs) {

        $("#loadMe").modal('hide');
        hideLoading()

        let ag = rs.agent ,
            as = `<option value=0 >--${lang('Chagua Ajenti','Select Agent')} --</option>`
       if(ag.length>0){
                  ag.forEach(el => {
           as+=`<option data-value=${el.id} data-agent=${el.pat} value=${el.id}  > ${el.first_name}  ${el.last_name} </option>`
       });
       }else{
           as+=`<option value=0>${lang('Hakuna Agent','No Agent Found')}</option>`
       }


       $('#Delivery_agenting').html(as)
       $('#Delivery_agenting').selectpicker('refresh')
        
    }
});
}


getAget()



