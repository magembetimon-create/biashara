/* Customer bulk payment – /mauzo/CustomerSales */
let csUnpaidTotalDebt = 0;

const csPopulatePayAccounts = () => {
  const $sel = $('#cs-malipo-akaunti');
  if (!$sel.length) return;
  const accounts = (window.ALLPAYACCOUNTS || []).filter((d) => !d.supervisor_account);
  let opt = `<option data-value="0">--${lang('Chagua Akaunti', 'Select Account')}--</option>`;
  accounts.forEach((ac) => {
    const aina = String(ac.aina || '').replace(/[&/"<>]/g, '');
    const name = String(ac.Akaunt_name || '').replace(/[&/"<>]/g, '');
    opt += `<option data-aina="${aina}" data-amount="${ac.Amount}" data-value="${ac.id}">${name}</option>`;
  });
  $sel.html(opt);
  if ($sel.selectpicker) {
    $sel.selectpicker('refresh');
  }
};

const csValidatePayAmount = () => {
  const debt = Number(csUnpaidTotalDebt) || 0;
  let amo = Number($('#cs-lipa-kiasi').val());
  if (!$('#cs-lipa-kiasi').val()) amo = 0;
  const ac = Number($('#cs-invo-ac-id').val()) || 0;
  if (amo > 0 && amo <= debt && ac > 0) {
    $('#csPayHelp').hide();
    $('#cs-invo-amo').val(amo);
    $('#cs-invo-submitted').prop('disabled', false);
  } else {
    if (amo > debt) $('#csPayHelp').show();
    else $('#csPayHelp').hide();
    $('#cs-invo-submitted').prop('disabled', true);
    if (amo > 0 && amo <= debt) $('#cs-invo-amo').val(amo);
  }
};

const csLoadUnpaidInvoices = () => {
  $('#csUnpaidInvoicesBody').html(
    `<tr><td colspan="3" class="text-center text-muted small">${lang('Inapakia…', 'Loading…')}</td></tr>`
  );
  return POSTREQUEST({
    url: CS_UNPAID_URL,
    data: { cust: CS_CUSTOMER_ID },
  }).then((resp) => {
    if (!resp.success) {
      $('#csUnpaidInvoicesBody').html(
        `<tr><td colspan="3" class="text-center text-danger small">${lang('Imeshindwa', 'Failed')}</td></tr>`
      );
      csUnpaidTotalDebt = 0;
      return;
    }
    csUnpaidTotalDebt = Number(resp.total_debt) || 0;
    $('#csModalTotalDebt').text(Number(csUnpaidTotalDebt).toLocaleString());
    $('#cs-lipa-kiasi').attr('placeholder', csUnpaidTotalDebt.toLocaleString());
    $('#cs-lipa-kiasi').data('debt', csUnpaidTotalDebt);
    if (!resp.invoices || !resp.invoices.length) {
      $('#csUnpaidInvoicesBody').html(
        `<tr><td colspan="3" class="text-center text-muted small">${lang('Hakuna deni', 'No debt')}</td></tr>`
      );
      return;
    }
    let html = '';
    resp.invoices.forEach((inv) => {
      html += `<tr>
        <td class="small">INVO-${inv.code}</td>
        <td class="small">${inv.date || '—'}</td>
        <td class="text-right small">${Number(inv.debt).toLocaleString()}</td>
      </tr>`;
    });
    $('#csUnpaidInvoicesBody').html(html);
  });
};

const csPayToday = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const today = `${d.getFullYear()}-${m}-${day}`;
  $('#cs-pay-d').val(today).attr('max', today);
};

$(document).ready(() => {
  csPayToday();

  $('#cs-modal-malipo').on('show.bs.modal', () => {
    csPopulatePayAccounts();
    if (!window.ALLPAYACCOUNTS || !window.ALLPAYACCOUNTS.length) {
      $.ajax({
        type: 'POST',
        url: '/akaunting/getdata',
        data: { csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() },
      }).done((data) => {
        window.ALLPAYACCOUNTS = data.list || [];
        csPopulatePayAccounts();
      });
    }
    csLoadUnpaidInvoices();
    $('#cs-lipa-kiasi').val('');
    $('#cs-lipa-elezo').val('');
    $('#cs-invo-ac-id').val(0);
    $('#cs-invo-submitted').prop('disabled', true);
    $('#cs-kama-change').hide();
  });

  $('body').on('change', '#cs-malipo-akaunti', function () {
    const v = Number($(this).find('option:selected').data('value')) || 0;
    $('#cs-invo-ac-id').val(v);
    csValidatePayAmount();
  });

  $('body').on('keyup input', '#cs-lipa-kiasi', csValidatePayAmount);

  $('body').on('keyup input', '#cs-kiasi-lipwa', function () {
    let amt = Number($('#cs-lipa-kiasi').val()) || Number($('#cs-lipa-kiasi').data('debt'));
    const paid = Number($(this).val()) || 0;
    if (paid > amt) {
      $('#cs-kiasi-chenji').val((paid - amt).toLocaleString()).css({ background: 'blue', color: '#fff' });
    } else {
      $('#cs-kiasi-chenji').val('').css({ background: '#fff', color: '#777' });
    }
  });

  $('#cs-invo-submitted').on('click', () => {
    const loadEl = document.getElementById('loadMe');
    if (loadEl && document.activeElement && loadEl.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    $('#cs-modal-malipo').modal('hide');
    $('#loadMe').modal('show');
    POSTREQUEST({
      url: CS_PAY_URL,
      data: {
        cust: CS_CUSTOMER_ID,
        invo_ac_id: $('#cs-invo-ac-id').val(),
        invo_amo: $('#cs-invo-amo').val(),
        pay_d: $('#cs-pay-d').val(),
        lipaElezo: $('#cs-lipa-elezo').val(),
      },
    })
      .then((data) => {
        if (typeof csFinishLoading === 'function') csFinishLoading();
        else {
          $('#loadMe').modal('hide');
          hideLoading();
        }
        if (data.success) {
          toastr.success(lang(data.msg_swa, data.msg_eng), lang('Imefanikiwa', 'Success'), { timeOut: 2500 });
          if (typeof csReloadStatement === 'function') csReloadStatement();
          else window.location.reload();
        } else {
          toastr.error(lang(data.msg_swa || data.swa, data.msg_eng || data.eng), lang('Haikufanikiwa', 'Error'), {
            timeOut: 3000,
          });
        }
      })
      .catch(() => {
        if (typeof csFinishLoading === 'function') csFinishLoading();
        else {
          $('#loadMe').modal('hide');
          hideLoading();
        }
      });
  });
});

window.csRefreshPaymentButton = (totalDebt) => {
  const n = Number(totalDebt) || 0;
  if (n > 0.005) $('#csRecordPaymentBtn').removeClass('d-none');
  else $('#csRecordPaymentBtn').addClass('d-none');
};
