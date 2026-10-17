/* Last payment panel + admin edit/delete on customer & vendor statements */
(function () {
  let lastPay = null;

  const canManage = () => Boolean(window.CS_CAN_MANAGE_PAYMENTS);
  const fmt = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const populateAccounts = (selectedId) => {
    const $sel = $('#cs-lastpay-akaunti');
    if (!$sel.length) return;
    const accounts = (window.ALLPAYACCOUNTS || []).filter((d) => !d.supervisor_account);
    let opt = `<option value="">--${lang('Chagua Akaunti', 'Select Account')}--</option>`;
    accounts.forEach((ac) => {
      const name = String(ac.Akaunt_name || '').replace(/[&/"<>]/g, '');
      const sel = Number(ac.id) === Number(selectedId) ? ' selected' : '';
      opt += `<option value="${ac.id}" data-amount="${ac.Amount}"${sel}>${name}</option>`;
    });
    $sel.html(opt);
    if ($sel.selectpicker) $sel.selectpicker('refresh');
  };

  const ensureAccounts = (selectedId) => {
    if (window.ALLPAYACCOUNTS && window.ALLPAYACCOUNTS.length) {
      populateAccounts(selectedId);
      return;
    }
    $.ajax({
      type: 'POST',
      url: '/akaunting/getdata',
      data: { csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() },
    }).done((data) => {
      window.ALLPAYACCOUNTS = data.list || [];
      populateAccounts(selectedId);
    });
  };

  window.csRenderLastPay = function (pay) {
    lastPay = pay && pay.id ? pay : null;
    const $panel = $('#csLastPayPanel');
    if (!lastPay) {
      $panel.addClass('d-none');
      return;
    }
    const cur = window.CS_CURRENCY || '';
    $('#csLastPayAmount').text(`${fmt(lastPay.amount)} ${cur}`.trim());
    const bits = [];
    if (lastPay.datetime || lastPay.date) {
      const m = window.moment && moment(lastPay.datetime || lastPay.date);
      bits.push(m && m.isValid() ? m.format('DD/MM/YYYY HH:mm') : (lastPay.date || ''));
    }
    if (lastPay.account) bits.push(lastPay.account);
    if (lastPay.by) bits.push(lastPay.by);
    if (lastPay.vendor) bits.push(lastPay.vendor);
    $('#csLastPayMeta').text(bits.filter(Boolean).join(' · '));
    $panel.removeClass('d-none');
    if (canManage() && window.CS_PAY_EDIT_URL && window.CS_PAY_DELETE_URL) {
      $('#csLastPayMenu').removeAttr('hidden');
    } else {
      $('#csLastPayMenu').attr('hidden', true);
    }
  };

  const reloadStatement = () => {
    if (typeof window.csReloadStatement === 'function') window.csReloadStatement();
    else window.location.reload();
  };

  $(document).on('click', '#csLastPayEdit', function (e) {
    e.preventDefault();
    if (!lastPay || !canManage()) return;
    ensureAccounts(lastPay.account_id);
    $('#cs-lastpay-kiasi').val(typeof formatMoneyInput === 'function' ? formatMoneyInput(lastPay.amount) : lastPay.amount);
    const d = (lastPay.date || '').slice(0, 10);
    $('#cs-lastpay-date').val(d);
    $('#cs-lastpay-elezo').val(lastPay.desc || '');
    $('#csLastPayEditModal').modal('show');
  });

  $(document).on('click', '#csLastPaySave', function () {
    if (!lastPay || !canManage()) return;
    const amount = typeof moneyValue === 'function' ? moneyValue('#cs-lastpay-kiasi') : Number($('#cs-lastpay-kiasi').val());
    const ac = Number($('#cs-lastpay-akaunti').val() || 0);
    const payD = $('#cs-lastpay-date').val();
    if (!(amount > 0) || !ac || !payD) {
      toastr.error(lang('Jaza kiasi, akaunti na tarehe', 'Enter amount, account and date'), lang('Haikufanikiwa', 'Error'), { timeOut: 2500 });
      return;
    }
    const btn = $(this).prop('disabled', true);
    $('#loadMe').modal('show');
    POSTREQUEST({
      url: window.CS_PAY_EDIT_URL,
      data: {
        ids: (lastPay.ids || [lastPay.id]).join(','),
        id: lastPay.id,
        cust: window.CS_CUSTOMER_ID || '',
        vnd: lastPay.vendor_id || window.CS_VENDOR_ID || '',
        invo_amo: amount,
        paid: amount,
        invo_ac_id: ac,
        ac: ac,
        pay_d: payD,
        lipaElezo: $('#cs-lastpay-elezo').val(),
        branches: JSON.stringify(typeof csSelectedBranches === 'function' ? csSelectedBranches() : []),
      },
    }).then((data) => {
      if (typeof csFinishLoading === 'function') csFinishLoading();
      else $('#loadMe').modal('hide');
      btn.prop('disabled', false);
      if (data && data.success) {
        $('#csLastPayEditModal').modal('hide');
        toastr.success(lang(data.msg_swa || data.swa, data.msg_eng || data.eng), lang('Imefanikiwa', 'Success'), { timeOut: 2500 });
        reloadStatement();
      } else {
        toastr.error(lang((data && (data.msg_swa || data.swa)) || 'Hitilafu', (data && (data.msg_eng || data.eng)) || 'Failed'), lang('Haikufanikiwa', 'Error'), { timeOut: 3000 });
      }
    }).catch((xhr) => {
      if (typeof csFinishLoading === 'function') csFinishLoading();
      else $('#loadMe').modal('hide');
      btn.prop('disabled', false);
      const data = xhr && xhr.responseJSON;
      toastr.error(
        lang((data && (data.msg_swa || data.swa)) || 'Hitilafu', (data && (data.msg_eng || data.eng)) || 'Failed'),
        lang('Haikufanikiwa', 'Error'),
        { timeOut: 3500 }
      );
    });
  });

  $(document).on('click', '#csLastPayDelete', function (e) {
    e.preventDefault();
    if (!lastPay || !canManage()) return;
    if (!confirm(lang('Futa malipo haya? Akaunti na deni vitarudishwa.', 'Delete this payment? The account and debt will be reversed.'))) return;
    $('#loadMe').modal('show');
    POSTREQUEST({
      url: window.CS_PAY_DELETE_URL,
      data: {
        ids: (lastPay.ids || [lastPay.id]).join(','),
        id: lastPay.id,
        cust: window.CS_CUSTOMER_ID || '',
        vnd: lastPay.vendor_id || window.CS_VENDOR_ID || '',
        branches: JSON.stringify(typeof csSelectedBranches === 'function' ? csSelectedBranches() : []),
      },
    }).then((data) => {
      if (typeof csFinishLoading === 'function') csFinishLoading();
      else $('#loadMe').modal('hide');
      if (data && data.success) {
        toastr.success(lang(data.msg_swa || data.swa, data.msg_eng || data.eng), lang('Imefanikiwa', 'Success'), { timeOut: 2500 });
        reloadStatement();
      } else {
        toastr.error(lang((data && (data.msg_swa || data.swa)) || 'Hitilafu', (data && (data.msg_eng || data.eng)) || 'Failed'), lang('Haikufanikiwa', 'Error'), { timeOut: 3000 });
      }
    }).catch((xhr) => {
      if (typeof csFinishLoading === 'function') csFinishLoading();
      else $('#loadMe').modal('hide');
      const data = xhr && xhr.responseJSON;
      toastr.error(
        lang((data && (data.msg_swa || data.swa)) || 'Hitilafu', (data && (data.msg_eng || data.eng)) || 'Failed'),
        lang('Haikufanikiwa', 'Error'),
        { timeOut: 3500 }
      );
    });
  });
})();
