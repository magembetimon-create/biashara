/* Edit customer on CustomerSales (owner only) */
const csSelectedBranchIds = () =>
  $('#cs-mteja-branches-list .mteja-branch-cb:checked')
    .map((_, el) => Number(el.value))
    .get();

const csEditFinishLoading = () => {
  const loadEl = document.getElementById('loadMe');
  if (loadEl && document.activeElement && loadEl.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  $('#loadMe').modal('hide');
  hideLoading();
};

$(document).ready(() => {
  $('#cs-edit-customer-modal').on('show.bs.modal', () => {
    if (typeof loadMtejaBranchOptions === 'function') {
      loadMtejaBranchOptions(window.CS_CUSTOMER_ID, '#cs-mteja-branches-list');
    }
  });

  $('#cs-form-mteja').on('submit', function (e) {
    e.preventDefault();
    const branches = csSelectedBranchIds();
    if (!branches.length) {
      toastr.warning(lang('Chagua angalau tawi moja', 'Select at least one branch'), lang('Taarifa', 'Info'), { timeOut: 2500 });
      return;
    }
    $('#loadMe').modal('show');
    POSTREQUEST({
      url: '/stoku/mteja',
      data: {
        jina: $('#cs-mteja-jina').val(),
        adress: $('#cs-mteja-address').val(),
        code: $('#cs-mteja-code').val(),
        simu1: $('#cs-mteja-simu1').val(),
        simu2: $('#cs-mteja-simu2').val(),
        mail: $('#cs-mteja-mail').val(),
        isactive: 0,
        value: 0,
        edit: 1,
        valued: window.CS_CUSTOMER_ID,
        branches,
      },
    })
      .done((resp) => {
        csEditFinishLoading();
        if (resp.success) {
          toastr.success(lang(resp.message_swa, resp.message_eng), lang('Imefanikiwa', 'Success'), { timeOut: 2000 });
          $('#cs-edit-customer-modal').modal('hide');
          window.location.reload();
        } else {
          toastr.error(lang(resp.message_swa, resp.message_eng), lang('Haikufanikiwa', 'Error'), { timeOut: 3000 });
        }
      })
      .fail(() => {
        csEditFinishLoading();
      });
  });
});
