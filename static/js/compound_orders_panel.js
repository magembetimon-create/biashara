(function () {
  if (!$('#compoundOrdersPanel').length) return;

  const csrf = () => $('input[name=csrfmiddlewaretoken]').val();
  let pollTimer = null;

  function renderOrders(data) {
    const count = Number(data.count || 0);
    const panel = $('#compoundOrdersPanel');
    if (!panel.length) return;

    if (count <= 0) {
      panel.hide();
      $('#compoundOrdersPanelBody').hide();
      return;
    }

    panel.show();
    const badge = $('#compoundOrdersBadge');
    badge.text(count);
    badge.removeClass('d-none');

    const list = $('#compoundOrdersList');
    if (!data.orders || !data.orders.length) {
      list.html('<p class="text-muted small mb-0 px-2">' + lang('Hakuna oda za sehemu', 'No location orders') + '</p>');
      return;
    }

    let html = '';
    data.orders.forEach(function (od) {
      let lines = (od.lines || []).map(function (ln) {
        return '<li class="small">' + (ln.name || '') + ' x' + ln.qty + '</li>';
      }).join('');
      html += '<div class="border-bottom pb-2 mb-2">' +
        '<div class="d-flex justify-content-between align-items-start">' +
        '<div><strong class="text-primary">' + (od.customer_name || lang('Mteja', 'Customer')) + '</strong>' +
        (od.area || od.place ? '<div class="small text-muted">' + (od.area || '') +
        (od.area && od.place ? ' — ' : '') + (od.place || '') + '</div>' : '') +
        '</div>' +
        '<span class="small weight600">' + (data.currency || '') + ' ' + Number(od.amount || 0).toFixed(2) + '</span>' +
        '</div>' +
        '<div class="small text-muted">#' + (od.code || od.id) + '</div>' +
        (od.note ? '<div class="small">' + od.note + '</div>' : '') +
        '<ul class="mb-0 pl-3 mt-1">' + lines + '</ul>' +
        '<a class="btn btn-sm btn-outline-primary mt-1" href="/mauzo/viewCustomOrder?ord=' + od.id + '">' +
        lang('Angalia', 'View') + '</a></div>';
    });
    list.html(html);
  }

  function loadCompoundOrders() {
    $.post('/mauzo/compound_orders_data', { csrfmiddlewaretoken: csrf() })
      .done(function (res) {
        if (res.success) renderOrders(res);
      });
  }

  window.loadCompoundOrders = loadCompoundOrders;

  function startPolling() {
    loadCompoundOrders();
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(loadCompoundOrders, 30000);
  }

  $('#compoundOrdersToggle').on('click', function () {
    $('#compoundOrdersPanelBody').slideToggle(200);
    loadCompoundOrders();
  });

  $(document).ready(startPolling);

  const origDone = window.IntervaFunct;
  if (typeof origDone === 'function') {
    /* traceChange also refreshes via compoundOrders key if present */
  }

  $(document).ajaxSuccess(function (_e, _x, settings) {
    if (settings && settings.url === '/traceChange') {
      /* optional: could merge compoundOrders from traceChange later */
    }
  });
})();
