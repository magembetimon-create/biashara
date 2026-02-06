  // Add Item , Category , Group , Brand Audio desc
  $('#poster_form').submit(function(e){
    e.preventDefault();
    
    var input= $('#audioFile'),
        val=$(input).val(),
        extension=val.split('.').pop().toLowerCase();

    if(val=='' && $('#poster_word').val()=='' ){
        alert(lang('Tafadhari chagua file la audio au andika kuhusu biashara','pleae select the audio file'))
        redborder(input)
    }else{
    if(jQuery.inArray(extension, ['mp3','wav','ogg']) == -1 && val != '' )
    {
        alert(lang("File la audio sio sahihi","Invalid audio File"));
        $(this).trigger("reset");
        // $('#userpicsubmit').prop('disabled',true)
        return false;
       }
       else
       {
    $("#loadMe").modal('show');
    $("#poster_sound").modal('hide');


    var form = $(this)
    var formData = new FormData(this);
    $.ajax({
        url: form.attr("action"),
        type: 'POST',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {

            $("#loadMe").modal('hide');
             hideLoading()
             if(response.success){

                toastr.success(lang('Bango Imeongezwa','Poster added'), lang('Imefanikiwa','Success'), {timeOut: 2000});
                 location.reload()
             }else{
                toastr.error(lang(response.msg_swa,response.msg_eng), lang('Haikufanikiwa','Error'), {timeOut: 2000});

             }

        
        },
        cache: false,
        contentType: false,
        processData: false
    });

       }}

});  


