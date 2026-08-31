/* Payment Statement – Taarifa ya Malipo */
let psPayData = [];
let psActiveRowId = null;

const psFilters = () => {
  const branch = Number($('#branchFilter').val()) || 0;
  const today = {
    key: 'today',
    rname: lang('Leo', 'Today'),
    tFr: moment().startOf('day').format(),
    tTo: moment().format(),
  };
  const week = {
    key: 'week',
    rname: lang('Wiki Hii', 'This Week'),
    tFr: moment().startOf('isoWeek').format(),
    tTo: moment().format(),
  };
  const month = {
    key: 'month',
    rname: lang('Mwezi Huu', 'This Month'),
    tFr: moment().startOf('month').format(),
    tTo: moment().format(),
  };
  return {
    branch,
    today,
    week,
    month,
    account: Number($('#psAccountFilter').val()) || 0,
    recordedBy: Number($('#psRecordedByFilter').val()) || 0,
    direction: $('#psDirectionFilter').val() || '',
  };
};

const psFormatNumber = (value) => Number(value || 0).toLocaleString();

const psAmountCell = (value, className = '') => {
  if (value === null || value === undefined) {
    return `<td class="text-right text-muted">---</td>`;
  }
  return `<td class="text-right ${className}">${psFormatNumber(value)}</td>`;
};

const psPartyCell = (item) => {
  if (item.direction === 'in') {
    const parts = [];
    if (item.kutoka) parts.push(item.kutoka);
    if (item.invo_code) parts.push(item.invo_code);
    return parts.length ? parts.join(' / ') : '<span class="text-muted">---</span>';
  }
  const parts = [];
  if (item.kwenda) parts.push(item.kwenda);
  if (item.expense_name) parts.push(item.expense_name);
  if (item.bill_code) parts.push(item.bill_code);
  return parts.length ? parts.join(' / ') : '<span class="text-muted">---</span>';
};

const psDescriptionCell = (item) => {
  if (item.maelezo) return item.maelezo;
  if (item.direction === 'in') {
    if (item.mauzo || item.order || item.from_waiter_payments_id) return lang('Malipo ya mauzo', 'Sales payment');
    if (item.kuhamisha) return lang('Uhamisho wa pesa (mapokezi)', 'Transfer in');
    if (item.huduma) return lang('Malipo ya huduma', 'Service payment');
    if (item.mtaji) return lang('Mtaji', 'Capital');
    return lang('Mapokezi', 'Received');
  }
  if (item.personal) return lang('Mambo binafsi', 'Personal');
  if (item.expense_name) return item.expense_name;
  if (item.bill_code) return lang('Malipo ya manunuzi', 'Purchase payment') + ' ' + item.bill_code;
  if (item.kuhamisha) return lang('Uhamisho wa pesa (malipo)', 'Transfer out');
  return lang('Malipo', 'Payment');
};

const psPostData = (extra = {}) => {
  const filters = psFilters();
  return {
    account: filters.account,
    recordedBy: filters.recordedBy,
    direction: filters.direction,
    branch: filters.branch,
    ...extra,
  };
};

const psFindRow = (data) => {
  if (data.key) return psPayData.find((d) => d.key === data.key);
  return psPayData.find((d) => !d.key && d.tFr === data.tFr && d.tTo === data.tTo && d.rname === data.rname);
};

const psArrayCreate = (data) => {
  const existing = psFindRow(data);
  if (existing) {
    Object.assign(existing, data, { loaded: false, transactions: [] });
    return existing;
  }
  const row = {
    id: psPayData.length + 1,
    loaded: false,
    transactions: [],
    ...data,
  };
  psPayData.push(row);
  return row;
};

const psCreateTr = () => {
  let tr = '';
  psPayData.forEach((d) => {
    const summary = d.summary || {};
    const recCount = Number(summary.count_in || 0) + Number(summary.count_out || 0);
    tr += `<tr data-report="${d.id}" class="cursor-pointer moreDetails">
      <td><a href="#" data-report="${d.id}" class="moreDetails text-primary">${d.rname}</a></td>
      <td>${psFormatNumber(recCount)}</td>
      <td class="text-success">${psFormatNumber(summary.received)}</td>
      <td class="text-danger">${psFormatNumber(summary.paid)}</td>
      <td>${psFormatNumber(summary.net)}</td>
    </tr>`;
  });
  $('#paymentSummaryBody').html(tr);
};

const psLoadSummaryRow = ({ tFr, tTo, rname, key = '' }) => {
  $('#loadMe').modal('show');
  return POSTREQUEST({
    url: PS_DATA_URL,
    data: psPostData({ tFr, tTo, summaryOnly: 1 }),
  }).then((resp) => {
    $('#loadMe').modal('hide');
    hideLoading();
    if (!resp.success) {
      toastr.error(lang(resp.swa, resp.eng), lang('Haikufanikiwa', 'Error'), { timeOut: 2000 });
      return null;
    }
    psArrayCreate({ key, rname, tFr, tTo, summary: resp.summary || {} });
    psCreateTr();
    return psFindRow({ key, tFr, tTo, rname });
  }).catch(() => {
    $('#loadMe').modal('hide');
    hideLoading();
    return null;
  });
};

const psRenderPaymentDetails = (row) => {
  psActiveRowId = row.id;
  $('#paymentDetailsTitle').html(
    lang('Taarifa ya Malipo - ', 'Payment Statement - ') + `<span class="text-primary">${row.rname}</span>`
  );
  const transactions = row.transactions || [];
  if (!transactions.length) {
    $('#paymentsBody').html(`<tr><td colspan="10" class="text-center text-muted">${lang('Hakuna miamala', 'No transactions found')}</td></tr>`);
  } else {
    let html = '';
    transactions.forEach((item) => {
      html += `<tr>
        <td>${item.date ? moment(item.date).format('DD/MM/YYYY HH:mm') : '-'}</td>
        <td>${item.branch_name || '-'}</td>
        <td>${item.account_name || '-'}</td>
        <td class="text-right">${psFormatNumber(item.before)}</td>
        ${psAmountCell(item.received_amount, 'text-success')}
        ${psAmountCell(item.withdrawal_amount, 'text-danger')}
        <td class="text-right">${psFormatNumber(item.after)}</td>
        <td>${psPartyCell(item)}</td>
        <td>${psDescriptionCell(item)}</td>
        <td class="text-capitalize">${item.recorded_by || '-'}</td>
      </tr>`;
    });
    $('#paymentsBody').html(html);
  }
  $('#paymentSummary').hide();
  $('#paymentDetails').show();
};

const psLoadDetails = (row) => {
  if (!row) return Promise.resolve();
  $('#loadMe').modal('show');
  return POSTREQUEST({
    url: PS_DATA_URL,
    data: psPostData({ tFr: row.tFr, tTo: row.tTo }),
  }).then((resp) => {
    $('#loadMe').modal('hide');
    hideLoading();
    if (!resp.success) {
      toastr.error(lang(resp.swa, resp.eng), lang('Haikufanikiwa', 'Error'), { timeOut: 2000 });
      return;
    }
    row.summary = resp.summary || {};
    row.transactions = resp.transactions || [];
    row.loaded = true;
    psRenderPaymentDetails(row);
  }).catch(() => {
    $('#loadMe').modal('hide');
    hideLoading();
  });
};

window.psCreateArray = (rname, tFr, tTo) => {
  const existing = psFindRow({ tFr, tTo, rname });
  if (existing) {
    toastr.info(lang('tayari ipo', 'already exists'), lang('Taarifa', 'Info'), { timeOut: 2000 });
    return false;
  }
  psLoadSummaryRow({ tFr, tTo, rname });
  return false;
};

const psReloadAll = () => {
  const activeKey = psActiveRowId ? (psPayData.find((d) => d.id === psActiveRowId)?.key || null) : null;
  const activeCustom = psActiveRowId ? psPayData.find((d) => d.id === psActiveRowId) : null;

  psPayData = [];
  const { today, week, month } = psFilters();
  $('#loadMe').modal('show');

  return POSTREQUEST({
    url: PS_DATA_URL,
    data: psPostData({ overview: 1 }),
  }).then((resp) => {
    $('#loadMe').modal('hide');
    hideLoading();
    if (!resp.success) return;

    const overview = resp.overview || {};
    [
      { ...today, summary: overview.today || {} },
      { ...week, summary: overview.week || {} },
      { ...month, summary: overview.month || {} },
    ].forEach((preset) => {
      psArrayCreate({
        key: preset.key,
        rname: preset.rname,
        tFr: preset.tFr,
        tTo: preset.tTo,
        summary: preset.summary,
        loaded: true,
      });
    });
    psCreateTr();

    if ($('#paymentDetails').is(':visible') && psActiveRowId) {
      let row = null;
      if (activeKey) row = psPayData.find((d) => d.key === activeKey);
      else if (activeCustom) {
        row = psPayData.find((d) => !d.key && d.tFr === activeCustom.tFr && d.tTo === activeCustom.tTo && d.rname === activeCustom.rname);
      }
      if (row) psLoadDetails(row);
      else {
        $('#paymentDetails').hide();
        $('#paymentSummary').show();
        psActiveRowId = null;
      }
    }
  }).catch(() => {
    $('#loadMe').modal('hide');
    hideLoading();
  });
};

const psPrintReport = () => {
  const row = psPayData.find((d) => d.id === psActiveRowId);
  if (!row || !row.transactions || !row.transactions.length) {
    toastr.info(lang('Hakuna data ya kuchapisha', 'No data to print'), lang('Taarifa', 'Info'), { timeOut: 2000 });
    return;
  }
  const w = window.open('', '_blank');
  if (!w) return;
  let body = '';
  row.transactions.forEach((item) => {
    body += `<tr>
      <td>${item.date ? moment(item.date).format('DD/MM/YYYY HH:mm') : '-'}</td>
      <td>${item.branch_name || ''}</td>
      <td>${item.account_name || ''}</td>
      <td>${psFormatNumber(item.before)}</td>
      <td>${item.received_amount != null ? psFormatNumber(item.received_amount) : '---'}</td>
      <td>${item.withdrawal_amount != null ? psFormatNumber(item.withdrawal_amount) : '---'}</td>
      <td>${psFormatNumber(item.after)}</td>
      <td>${psPartyCell(item).replace(/<[^>]+>/g, '')}</td>
      <td>${psDescriptionCell(item).replace(/<[^>]+>/g, '')}</td>
      <td>${item.recorded_by || ''}</td>
    </tr>`;
  });
  w.document.write(`<html><head><title>${row.rname}</title>
    <style>body{font-family:Arial,sans-serif;font-size:11px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:4px}</style>
    </head><body><h3>${lang('Taarifa ya Malipo', 'Payment Statement')}: ${row.rname}</h3>
    <table><thead><tr>
    <th>${lang('Tarehe', 'Date')}</th><th>${lang('Tawi', 'Branch')}</th><th>${lang('Akaunti', 'Account')}</th>
    <th>${lang('Kabla', 'Before')}</th><th>${lang('Mapokezi', 'Received')}</th><th>${lang('Kutoa', 'Withdrawal')}</th>
    <th>${lang('Baada', 'After')}</th><th>From/To</th><th>${lang('Maelezo', 'Description')}</th><th>${lang('Aliyerekebisha', 'Recorded By')}</th>
    </tr></thead><tbody>${body}</tbody></table></body></html>`);
  w.document.close();
  w.focus();
  w.print();
};

$(document).ready(() => {
  psReloadAll();

  $('body').on('click', '.moreDetails', function (e) {
    e.preventDefault();
    const val = Number($(this).data('report'));
    const row = psPayData.find((d) => d.id === val);
    if (!row) return;
    psLoadDetails(row);
  });

  $('#backToSummary').on('click', () => {
    psActiveRowId = null;
    $('#paymentDetails').hide();
    $('#paymentSummary').show();
  });

  $('#customDateSubmit').on('click', () => {
    const rname = $('#durationName').val().trim();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    if (!rname || !startDate || !endDate) return;
    $('#durationModal').modal('hide');
    window.psCreateArray(rname, moment(startDate).startOf('day').format(), moment(endDate).endOf('day').format());
  });

  $('#branchFilter, #psAccountFilter, #psRecordedByFilter, #psDirectionFilter').on('change', () => {
    psReloadAll();
  });

  $('#printPaymentStatement').on('click', psPrintReport);
});
