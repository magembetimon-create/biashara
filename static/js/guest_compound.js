(function () {
  if (window.__guestCompoundInit) return;
  window.__guestCompoundInit = true;

  function getCsrfToken() {
    const fromInput = $('input[name=csrfmiddlewaretoken]').val();
    if (fromInput) return fromInput;
    const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
        const token = getCsrfToken();
        if (token) xhr.setRequestHeader('X-CSRFToken', token);
      }
    },
  });

  const shopId = () => Number($('#guest_compound_shop').val() || window.GUEST_COMPOUND_SHOP || 0);
  const csrf = () => getCsrfToken();

  window.GUEST_COMPOUND_SHOP = window.GUEST_COMPOUND_SHOP || shopId();

  window.guestCompoundSetCellFromScan = function (cellId) {
    if (!cellId || !shopId()) return;
    $.post('/purchase/guestCompoundSetCell', {
      csrfmiddlewaretoken: csrf(),
      shop: shopId(),
      cell: cellId,
    }).done(function (res) {
      if (res.success) {
        location.reload();
      } else if (window.toastr) {
        toastr.warning(res.message_swa || res.message_eng || 'Error');
      }
    });
  };

  window.guestCompoundAddItem = function (itemId, qty, uwiano) {
    qty = Number(qty) || 1;
    uwiano = Number(uwiano) || 1;
    return $.post('/purchase/guestCompoundAddToCart', {
      csrfmiddlewaretoken: csrf(),
      shop: shopId(),
      itm: itemId,
      qty: qty,
      uwiano: uwiano,
    });
  };

  /** Read pack count + unit size from displaySelItem form (item_idadi, price_select, fractions_qty). */
  function guestCompoundReadQtyFromForm() {
    const uwiano = Number($('#price_select').val()) || 1;
    const units = Number($('#item_idadi').val()) || 0;
    const frac = Number($('#fractions_qty').val()) || 0;
    return { qty: units + frac, uwiano: uwiano };
  }

  function bindCartPage() {
    $('#guestPlaceOrderBtn').off('click.guestCompound').on('click.guestCompound', function () {
      const btn = $(this);
      btn.prop('disabled', true);
      $.post('/purchase/guestCompoundPlaceOrder', {
        csrfmiddlewaretoken: csrf(),
        shop: shopId(),
        cart_id: btn.data('cart') || 0,
        note: $('#guestOrderNote').val() || '',
        customer_name: $('#guestOrderName').val() || '',
        email: $('#guestOrderEmail').val() || '',
        phone: $('#guestOrderPhone').val() || '',
        expected_date: $('#guestOrderExpected').val() || '',
      }).done(function (res) {
        if (res.success) {
          alert(res.message_swa || res.message_eng);
          window.location.href = '/buzinessProfile?value=' + shopId();
        } else {
          btn.prop('disabled', false);
          alert(res.message_swa || res.message_eng || 'Error');
          if (res.need_cell) $('.scan_qr').first().trigger('click');
        }
      }).fail(function () {
        btn.prop('disabled', false);
      });
    });

    $('.guest-remove-line').off('click.guestCompound').on('click.guestCompound', function () {
      const lineId = $(this).data('line');
      $.post('/purchase/guestCompoundRemoveLine', {
        csrfmiddlewaretoken: csrf(),
        shop: shopId(),
        line_id: lineId,
      }).done(function () { location.reload(); });
    });
  }

  function bindProfileButtons() {
    $('body').off('click.guestCompound', '.guest-add-item-btn').on('click.guestCompound', '.guest-add-item-btn', function () {
      const btn = $(this);
      if (btn.prop('disabled') || btn.data('adding')) return;
      if (!csrf()) {
        alert('Session expired. Refresh the page and try again.');
        return;
      }
      const picked = guestCompoundReadQtyFromForm();
      if (picked.qty <= 0) {
        alert('Weka idadi / Enter quantity');
        return;
      }
      btn.data('adding', true).prop('disabled', true);
      guestCompoundAddItem(btn.data('item'), picked.qty, picked.uwiano)
        .done(function (res) {
          if (res.success) {
            if (window.toastr) toastr.success(res.message_swa || res.message_eng);
            if ($('#guestCartCountBadge').length) {
              $('#guestCartCountBadge').text(res.cart_count || 0).show();
            }
          } else {
            alert(res.message_swa || res.message_eng || 'Error');
            if (res.need_cell) $('#guestScanQrBtn').trigger('click');
          }
        })
        .fail(function (xhr) {
          if (xhr.status === 403) {
            alert('CSRF error — refresh the page and try again.');
          }
        })
        .always(function () {
          btn.data('adding', false).prop('disabled', false);
        });
    });
  }

  $(function () {
    bindCartPage();
    bindProfileButtons();
  });
})();
