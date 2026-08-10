(function () {
  const URLS = window.EXP_RECEIPT_URLS || {};

  function csrf() {
    return $('input[name=csrfmiddlewaretoken]').val();
  }

  function appendThumb($preview, att) {
    if (!$preview.length || !att.url) return;
    $preview.find('.text-danger.small').remove();
    $preview.append(
      `<div class="exp-receipt-thumb-wrap" data-attachment-id="${att.id}">
        <a href="${att.url}" target="_blank" rel="noopener"><img src="${att.url}" alt="" class="exp-receipt-thumb"></a>
      </div>`,
    );
  }

  $(document).on('change', '.exp-receipt-file-input', function () {
    const input = this;
    const files = input.files;
    const rekodiId = $(input).data('rekodi-id');
    if (!files || !files.length || !rekodiId) return;

    const fd = new FormData();
    fd.append('csrfmiddlewaretoken', csrf());
    fd.append('rekodi_id', rekodiId);
    for (let i = 0; i < files.length; i += 1) {
      fd.append('images', files[i]);
    }

    const $card = $(input).closest('.exp-receipt-card');
    const $preview = $card.find('.exp-receipt-preview');
    $('#loadMe').modal('show');

    $.ajax({
      url: URLS.upload,
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
    }).done((res) => {
      $('#loadMe').modal('hide');
      hideLoading();
      if (res.success) {
        toastr.success(lang(res.message_swa, res.message_eng));
        (res.attachments || []).forEach((att) => appendThumb($preview, att));
        if ((res.pending_count || 0) === 0) {
          setTimeout(() => { window.location.reload(); }, 800);
        }
      } else {
        toastr.error(lang(res.message_swa, res.message_eng));
      }
      input.value = '';
    }).fail(() => {
      $('#loadMe').modal('hide');
      hideLoading();
      input.value = '';
    });
  });
})();
