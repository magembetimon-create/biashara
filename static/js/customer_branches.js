/* Branch visibility for customers (customer_Interprise) */
const loadMtejaBranchOptions = (custId = 0, container = '#mteja-branches-list') => {
  const $box = $(container);
  if (!$box.length) return Promise.resolve();
  $box.html(`<span class="text-muted small">${lang('Inapakia…', 'Loading…')}</span>`);
  const csrfToken = $('input[name=csrfmiddlewaretoken]').val();
  const url = window.CUSTOMER_BRANCH_OPTIONS_URL || '/mauzo/customer-branch-options';
  return $.ajax({
    type: 'POST',
    url,
    data: { csrfmiddlewaretoken: csrfToken, cust: custId || 0 },
  })
    .done((resp) => {
      if (!resp.success || !resp.branches || !resp.branches.length) {
        $box.html(`<span class="text-muted small">${lang('Hakuna matawi', 'No branches')}</span>`);
        return;
      }
      const selected = new Set((resp.selected || []).map(Number));
      let html = '<div class="row mx-0">';
      resp.branches.forEach((b) => {
        const checked = selected.has(Number(b.id)) ? 'checked' : '';
        html += `<div class="col-12 col-sm-6 py-1">
          <label class="mb-0 smallFont d-flex align-items-center">
            <input type="checkbox" class="mteja-branch-cb mr-2" value="${b.id}" ${checked}>
            <span class="text-capitalize">${b.name}</span>
          </label>
        </div>`;
      });
      html += '</div>';
      $box.html(html);
    })
    .fail(() => {
      $box.html(`<span class="text-danger small">${lang('Imeshindwa kupakia matawi', 'Failed to load branches')}</span>`);
    });
};

const selectedMtejaBranchIds = () =>
  $('.mteja-branch-cb:checked')
    .map((_, el) => Number(el.value))
    .get();

$(document).ready(() => {
  $('body').on('show.bs.modal', '#wateja-modal', function () {
    const edit = Number($('#form-mteja').data('edit')) || 0;
    const custId = edit ? Number($('#form-mteja').data('valued')) || 0 : 0;
    loadMtejaBranchOptions(custId);
  });
});
