(function () {
  let SHIFT_FEATURE_ENABLED = false;

  function csrfToken() {
    return $('input[name=csrfmiddlewaretoken]').val();
  }

  function applyFeatureState() {
    const enabled = !!SHIFT_FEATURE_ENABLED;
    const owner = Number($('#ShiftOwner').val() || 0) === 1;
    const stateText = enabled
      ? lang('Mfumo wa zamu uko ON', 'Shift management is ON')
      : lang('Mfumo wa zamu uko OFF', 'Shift management is OFF');
    $('#ShiftFeatureState').html(`<span class="${enabled ? 'text-success' : 'text-danger'}">${stateText}</span>`);

    $('#OpenShiftBtn').prop('disabled', !enabled);
    $('#CloseShiftBtn').prop('disabled', !enabled);

    if (owner) {
      $('#ToggleShiftFeatureBtn')
        .data('enabled', enabled ? 1 : 0)
        .removeClass('btn-outline-secondary btn-success btn-danger')
        .addClass(enabled ? 'btn-danger' : 'btn-success')
        .text(enabled ? lang('Zima mfumo wa zamu', 'Disable shift management') : lang('Washa mfumo wa zamu', 'Enable shift management'));
    }
  }

  function money(v) {
    return floatValue(Number(v || 0));
  }

  function safeDate(v) {
    if (!v) {
      return '-';
    }
    return moment(v).format('ddd DD/MM/YYYY HH:mm');
  }

  function shiftStatusBadge(status) {
    const st = String(status || '').toLowerCase();
    if (st === 'open') {
      return '<span class="badge badge-warning">OPEN</span>';
    }
    if (st === 'closed') {
      return '<span class="badge badge-info">CLOSED</span>';
    }
    if (st === 'verified') {
      return '<span class="badge badge-success">VERIFIED</span>';
    }
    return `<span class="badge badge-secondary">${status}</span>`;
  }

  function setSummary(data) {
    const summary = data.summary || {};
    const txt = `${lang('Idadi ya zamu', 'Shifts')}: <strong>${Number(summary.count || 0).toLocaleString()}</strong> | ` +
      `${lang('Mauzo', 'Sales')}: <strong>${money(summary.sales)}</strong> | ` +
      `${lang('Matumizi', 'Expenses')}: <strong>${money(summary.expenses)}</strong> | ` +
      `${lang('Deposit', 'Deposits')}: <strong>${money(summary.deposits)}</strong> | ` +
      `${lang('Tofauti', 'Variance')}: <strong>${money(summary.variance)}</strong>`;

    $('#ShiftSummary').html(txt);
  }

  function renderRows(data) {
    const rows = data.rows || [];
    let tr = '';

    rows.forEach((r) => {
      tr += `
      <tr>
        <td class="weight600">${r.code}</td>
        <td>${r.branch_name || '-'}</td>
        <td>${safeDate(r.starts_at)}</td>
        <td>${safeDate(r.ends_at)}</td>
        <td>${shiftStatusBadge(r.status)}</td>
        <td>${money(r.sales)}</td>
        <td>${money(r.expenses)}</td>
        <td>${money(r.deposits)}</td>
        <td class="${Number(r.variance) < 0 ? 'text-danger' : 'text-success'}">${money(r.variance)}</td>
        <td>
          ${String(r.status).toLowerCase() === 'closed' ? `<button class="btn btn-sm btn-success verifyShiftBtn" data-id="${r.id}">${lang('Hakiki', 'Verify')}</button>` : '-'}
        </td>
      </tr>`;
    });

    $('#ShiftReportRows').html(tr);
  }

  function loadCurrentShift() {
    return $.ajax({
      type: 'POST',
      url: '/akaunting/currentShiftData',
      data: { csrfmiddlewaretoken: csrfToken() }
    }).then((res) => {
      SHIFT_FEATURE_ENABLED = !!res.shift_enabled;
      applyFeatureState();

      if (!res.success || !res.has_shift) {
        $('#CurrentShiftCard').html(`<span class="text-muted">${lang('Hakuna zamu inayoendelea', 'No active shift')}</span>`);
        return;
      }

      const sh = res.shift;
      const members = (res.members || []).map((m) => `${m.first_name || ''} ${m.last_name || ''} (${m.role})`).join(', ');
      $('#CurrentShiftCard').html(
        `<div><strong>${sh.code}</strong> - ${shiftStatusBadge(sh.status)}</div>` +
        `<div>${lang('Imeanza', 'Started')}: ${safeDate(sh.starts_at)}</div>` +
        `<div>${lang('Opening cash', 'Opening cash')}: ${money(sh.opening_cash)}</div>` +
        `<div class="smallerFont text-muted">${members || '-'}</div>`
      );
    });
  }

  function loadShiftReport() {
    const fromDate = $('#ShiftFromDate').val();
    const toDate = $('#ShiftToDate').val();
    const branch = Number($('#ShiftBranch').val() || 0);

    const tf = fromDate ? moment(fromDate).startOf('day').format() : moment().startOf('month').format();
    const tt = toDate ? moment(toDate).endOf('day').format() : moment().format();

    $('#ShiftReportRows').html('');

    return $.ajax({
      type: 'POST',
      url: '/akaunting/shiftReportData',
      data: {
        tf: tf,
        tt: tt,
        branch: branch,
        csrfmiddlewaretoken: csrfToken()
      }
    }).then((res) => {
      if (!res.success) {
        toastr.error(lang('Ripoti ya zamu haikupatikana', 'Shift report failed'));
        return;
      }
      SHIFT_FEATURE_ENABLED = !!res.shift_enabled;
      applyFeatureState();
      renderRows(res);
      setSummary(res);
    });
  }

  function openShift() {
    if (!SHIFT_FEATURE_ENABLED) {
      toastr.warning(lang('Admin amezima mfumo wa zamu', 'Shift management is disabled by admin'));
      return;
    }
    return $.ajax({
      type: 'POST',
      url: '/akaunting/openShift',
      data: {
        shift_type: $('#OpenShiftType').val(),
        opening_cash: $('#OpenShiftCash').val(),
        notes: $('#OpenShiftNotes').val(),
        csrfmiddlewaretoken: csrfToken()
      }
    }).then((res) => {
      if (!res.success) {
        toastr.error(res.message_swa || res.message_eng || lang('Haikufanikiwa', 'Failed'));
        return;
      }
      toastr.success(res.message_swa || res.message_eng || lang('Imefanikiwa', 'Success'));
      $('#OpenShiftCash').val('');
      $('#OpenShiftNotes').val('');
      loadCurrentShift();
      loadShiftReport();
    });
  }

  function closeShift() {
    if (!SHIFT_FEATURE_ENABLED) {
      toastr.warning(lang('Admin amezima mfumo wa zamu', 'Shift management is disabled by admin'));
      return;
    }
    return $.ajax({
      type: 'POST',
      url: '/akaunting/closeShift',
      data: {
        actual_closing_cash: $('#CloseShiftCash').val(),
        notes: $('#CloseShiftNotes').val(),
        csrfmiddlewaretoken: csrfToken()
      }
    }).then((res) => {
      if (!res.success) {
        toastr.error(res.message_swa || res.message_eng || lang('Haikufanikiwa', 'Failed'));
        return;
      }
      toastr.success(res.message_swa || res.message_eng || lang('Imefanikiwa', 'Success'));
      $('#CloseShiftCash').val('');
      $('#CloseShiftNotes').val('');
      loadCurrentShift();
      loadShiftReport();
    });
  }

  function verifyShift(shiftId) {
    if (!SHIFT_FEATURE_ENABLED) {
      toastr.warning(lang('Admin amezima mfumo wa zamu', 'Shift management is disabled by admin'));
      return;
    }
    return $.ajax({
      type: 'POST',
      url: '/akaunting/verifyShift',
      data: {
        shift_id: shiftId,
        csrfmiddlewaretoken: csrfToken()
      }
    }).then((res) => {
      if (!res.success) {
        toastr.error(res.message_swa || res.message_eng || lang('Haikufanikiwa', 'Failed'));
        return;
      }
      toastr.success(res.message_swa || res.message_eng || lang('Imefanikiwa', 'Success'));
      loadShiftReport();
    });
  }

  function initDates() {
    const now = moment();
    $('#ShiftFromDate').val(now.startOf('month').format('YYYY-MM-DD'));
    $('#ShiftToDate').val(moment().format('YYYY-MM-DD'));
  }

  function toggleShiftFeature() {
    const owner = Number($('#ShiftOwner').val() || 0) === 1;
    if (!owner) {
      return;
    }

    const nextEnabled = !(Number($('#ToggleShiftFeatureBtn').data('enabled') || 0) === 1);
    return $.ajax({
      type: 'POST',
      url: '/akaunting/setShiftManagementStatus',
      data: {
        enabled: nextEnabled ? 1 : 0,
        csrfmiddlewaretoken: csrfToken()
      }
    }).then((res) => {
      if (!res.success) {
        toastr.error(res.message_swa || res.message_eng || lang('Haikufanikiwa', 'Failed'));
        return;
      }
      SHIFT_FEATURE_ENABLED = !!res.enabled;
      applyFeatureState();
      toastr.success(res.message_swa || res.message_eng || lang('Imefanikiwa', 'Success'));
      loadCurrentShift();
      loadShiftReport();
    });
  }

  $('body').on('click', '#ReloadShiftReport', function () {
    loadShiftReport();
  });

  $('body').on('click', '#OpenShiftBtn', function () {
    openShift();
  });

  $('body').on('click', '#CloseShiftBtn', function () {
    closeShift();
  });

  $('body').on('click', '.verifyShiftBtn', function () {
    const shiftId = Number($(this).data('id') || 0);
    if (shiftId > 0) {
      verifyShift(shiftId);
    }
  });

  $('body').on('click', '#ToggleShiftFeatureBtn', function () {
    toggleShiftFeature();
  });

  initDates();
  loadCurrentShift();
  loadShiftReport();
})();
