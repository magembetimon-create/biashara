/* Vendor purchases statement – /purchase/VendorPurchases */

let csActivePreset = 'month';

let csStatementCache = {
  summary: null,
  transactions: [],
  receipts: [],
  periodLabel: '',
};

let csReceiptLayout = { cols: 2, rows: 2 };

const csEsc = (value) => String(value || '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[ch]));

const csFmt = (value) => Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const csFmtQty = (value) => {
  const n = Number(value || 0);
  if (!n) return '—';
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });
};

const csNumCell = (value, className = '', showZero = false) => {
  const n = Number(value || 0);
  if (!n && !showZero) return `<td class="cs-num text-muted">—</td>`;
  if (!n && showZero) return `<td class="cs-num text-muted">0</td>`;
  return `<td class="cs-num ${className}">${csFmt(n)}</td>`;
};

const csBalanceCell = (value) => {
  let n = Number(value || 0);
  if (Math.abs(n) < 0.005) {
    return `<td class="cs-num text-muted">0</td>`;
  }
  const cls = n > 0 ? 'brown weight600' : 'text-success weight600';
  const prefix = n > 0 ? '' : '';
  return `<td class="cs-num ${cls}">${prefix}${csFmt(n)}</td>`;
};

let csLastRange = { tFr: null, tTo: null, label: '' };

const csSelectedBranches = () => {
  const checks = document.querySelectorAll('.cs-branch-check');
  if (!checks.length) {
    return Array.isArray(window.CS_ALLOWED_BRANCHES) && window.CS_ALLOWED_BRANCHES.length
      ? window.CS_ALLOWED_BRANCHES.slice()
      : [window.CS_CURRENT_BRANCH_ID];
  }
  const ids = [];
  checks.forEach((el) => {
    if (el.checked) ids.push(Number(el.value));
  });
  if (!ids.length && window.CS_CURRENT_BRANCH_ID) {
    return [window.CS_CURRENT_BRANCH_ID];
  }
  return ids;
};

const csSyncBranchAll = () => {
  const checks = document.querySelectorAll('.cs-branch-check');
  const all = document.getElementById('csBranchAll');
  if (!all || !checks.length) return;
  all.checked = Array.from(checks).every((el) => el.checked);
};

const csBranchCell = (row) => {
  if (row.kind === 'opening') return `<td class="small text-muted">—</td>`;
  const name = (row.branch || '').trim();
  return `<td class="small text-capitalize">${name || '—'}</td>`;
};

const csKindLabel = (kind) => {
  if (kind === 'opening') return lang('Salio la mwanzo', 'Opening balance');
  if (kind === 'line') return lang('Manunuzi', 'Purchase');
  if (kind === 'payment') return lang('Malipo', 'Payment');
  return kind;
};

const csFormatDateTime = (row) => {
  if (row.kind === 'opening') {
    return row.date ? moment(row.date).format('DD/MM/YYYY') : '—';
  }
  const src = row.datetime || row.date;
  if (!src) return '—';
  const m = moment(src);
  return m.isValid() ? m.format('DD/MM/YYYY HH:mm') : '—';
};

const csItemCell = (row) => {
  if (row.kind === 'opening') {
    return `<span class="text-muted">${lang('Salio la mwanzo', 'Opening balance')}</span>`;
  }
  if (row.kind === 'payment') {
    return '<span class="text-muted">---</span>';
  }
  return row.item || '—';
};

const csRecordedByCell = (row) => {
  if (row.kind === 'opening') return `<td class="small text-muted">—</td>`;
  const name = (row.recorded_by || '').trim();
  return `<td class="small text-capitalize">${name || '—'}</td>`;
};

const csPrintAmount = (value) => {
  const n = Number(value || 0);
  if (!n) return '—';
  return csFmt(n);
};

const csPrintBalance = (value) => {
  let n = Number(value || 0);
  if (Math.abs(n) < 0.005) return '0';
  return csFmt(n);
};

const csUpdateSummary = (summary, periodLabel) => {
  const s = summary || {};
  const debt = Number(s.total_debt) || 0;
  const closing = Number(s.closing_balance) || 0;

  $('#csTotalDebt').text(csFmt(debt));
  $('#csTotalInvoices').text(s.total_invoices ?? 0);
  $('#csTotalPurchase').text(csFmt(s.total_purchase));
  $('#csPeriodInvoices').text(s.period_invoices ?? 0);
  $('#csPeriodPurchase').text(csFmt(s.period_purchase));
  $('#csPeriodPayments').text(csFmt(s.period_payments));

  let closingText = '0';
  if (Math.abs(closing) >= 0.005) {
    closingText = csFmt(closing);
  }
  $('#csClosingBalance').text(closingText);

  if (periodLabel) $('#csPeriodLabel').text(periodLabel);

  const debtCard = $('#csDebtCard');
  if (debt > 0.005) debtCard.addClass('cs-debt');
  else debtCard.removeClass('cs-debt');

  if ($('#csPayVendorBtn').length) {
    $('#csPayVendorBtn').prop('disabled', debt <= 0.005);
  }
};

const csKindReceiptLabel = (kind) => {
  if (kind === 'payment') return lang('Malipo', 'Payment');
  return lang('Bili', 'Bill');
};

const csUpdateReceipts = (receipts, summary) => {
  const list = receipts || [];
  const count = (summary && summary.receipt_count != null) ? summary.receipt_count : list.length;
  const amount = (summary && summary.receipt_amount != null)
    ? Number(summary.receipt_amount)
    : list.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  $('#csReceiptCount').text(count);
  $('#csReceiptAmount').text(csFmt(amount));
  $('#csReceiptsPanel').toggleClass('cs-receipt-panel-empty', count <= 0);
};

const csReceiptCaption = (row) => {
  const when = row.datetime || row.date;
  const m = when ? moment(when) : null;
  const dateStr = m && m.isValid() ? m.format('DD/MM/YYYY HH:mm') : (row.date || '');
  const parts = [
    row.vendor,
    row.ref,
    csKindReceiptLabel(row.kind),
    row.branch,
    dateStr,
    csFmt(row.amount),
  ].filter(Boolean);
  return parts.join(' · ');
};

const csApplyReceiptLayout = () => {
  const { cols } = csReceiptLayout;
  const gallery = document.getElementById('csReceiptsGallery');
  if (!gallery) return;
  gallery.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  gallery.setAttribute('data-cols', String(cols));
  gallery.setAttribute('data-rows', String(csReceiptLayout.rows));
  const cards = gallery.querySelectorAll('.cs-rcpt-card img');
  const perPage = Math.max(1, csReceiptLayout.cols * csReceiptLayout.rows);
  const h = perPage <= 1 ? 420 : (perPage <= 2 ? 320 : (perPage <= 4 ? 220 : 160));
  cards.forEach((img) => { img.style.height = `${h}px`; });
};

const csRenderReceiptsGallery = () => {
  const list = csStatementCache.receipts || [];
  const gallery = $('#csReceiptsGallery');
  if (!gallery.length) return;
  if (!list.length) {
    gallery.html(`<p class="text-muted text-center py-4 mb-0">${lang('Hakuna risiti zilizopakiwa kwa kipindi hiki', 'No uploaded receipts in this period')}</p>`);
    return;
  }
  let html = '';
  list.forEach((row) => {
    html += `<div class="cs-rcpt-card">
      <img src="${csEsc(row.url)}" alt="">
      <div class="cs-rcpt-meta">${csEsc(csReceiptCaption(row))}</div>
    </div>`;
  });
  gallery.html(html);
  csApplyReceiptLayout();
};

window.csPrintReceipts = () => {
  const list = csStatementCache.receipts || [];
  if (!list.length) {
    toastr.info(lang('Hakuna risiti za kuchapisha', 'No receipts to print'), lang('Taarifa', 'Info'), { timeOut: 2000 });
    return;
  }
  const cols = csReceiptLayout.cols;
  const rows = csReceiptLayout.rows;
  const perPage = Math.max(1, cols * rows);
  const meta = window.CS_VENDOR_META || {};
  const title = lang('Risiti za malipo / bili', 'Payment / bill receipts');
  let pages = '';
  for (let i = 0; i < list.length; i += perPage) {
    const chunk = list.slice(i, i + perPage);
    let cells = '';
    chunk.forEach((row) => {
      cells += `<div class="cell"><img src="${csEsc(row.url)}" alt=""><div class="cap">${csEsc(csReceiptCaption(row))}</div></div>`;
    });
    pages += `<section class="page">${cells}</section>`;
  }
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'Segoe UI', Arial, sans-serif; }
      h1 { font-size: 14pt; margin: 0 0 4px; }
      .head { padding: 10mm 10mm 0; }
      .page {
        display: grid;
        grid-template-columns: repeat(${cols}, minmax(0, 1fr));
        grid-template-rows: repeat(${rows}, minmax(0, 1fr));
        gap: 8px;
        page-break-after: always;
        padding: 10mm;
        min-height: calc(100vh - 18mm);
      }
      .cell { border: 1px solid #ccc; display: flex; flex-direction: column; overflow: hidden; }
      .cell img { width: 100%; flex: 1; object-fit: contain; background: #fafafa; }
      .cap { font-size: 9pt; padding: 6px 8px; border-top: 1px solid #ddd; }
      @media print { .head { padding-bottom: 0; } .page { min-height: 250mm; } }
    </style></head><body>
    <div class="head"><h1>${csEsc(meta.dukaName || '')}</h1><div>${title} · ${csEsc(csStatementCache.periodLabel || '')}</div></div>
    ${pages}
    </body></html>`);
  w.document.close();
  w.focus();
  w.print();
};

const csAllVendors = () => !!window.CS_ALL_VENDORS;
const csColSpan = () => (csAllVendors() ? 12 : 11);

const csVendorCell = (row) => {
  if (!csAllVendors()) return '';
  if (row.kind === 'opening') return `<td class="small text-muted">—</td>`;
  const name = (row.vendor || '').trim();
  const id = row.vendor_id;
  if (id) {
    return `<td class="small"><a class="text-capitalize" href="/purchase/VendorPurchases?vnd=${id}">${name || '—'}</a></td>`;
  }
  return `<td class="small text-capitalize">${name || '—'}</td>`;
};

const csRenderTable = (transactions) => {
  const rows = transactions || [];
  if (!rows.length) {
    $('#csStatementBody').html(
      `<tr><td colspan="${csColSpan()}" class="text-center text-muted py-4">${lang('Hakuna miamala kwa kipindi hiki', 'No transactions in this period')}</td></tr>`
    );
    return;
  }

  let html = '';
  rows.forEach((row) => {
    const trClass = row.kind === 'opening' ? 'cs-opening-row' : '';
    html += `<tr class="${trClass}">
      <td class="text-nowrap small">${csFormatDateTime(row)}</td>
      ${csVendorCell(row)}
      ${csBranchCell(row)}
      ${csRecordedByCell(row)}
      <td>${csKindLabel(row.kind)}</td>
      <td class="small">${csItemCell(row)}</td>
      <td class="small text-muted">${row.units || '—'}</td>
      ${row.kind === 'opening' || row.kind === 'payment' ? csNumCell(0) : csNumCell(row.price)}
      ${row.kind === 'opening' || row.kind === 'payment' ? '<td class="cs-num text-muted">—</td>' : `<td class="cs-num">${csFmtQty(row.qty)}</td>`}
      ${csNumCell(row.debt, 'text-dark')}
      ${csNumCell(row.credit, 'text-success')}
      ${csBalanceCell(row.balance)}
    </tr>`;
  });
  $('#csStatementBody').html(html);
};

const csFinishLoading = () => {
  const loadEl = document.getElementById('loadMe');
  if (loadEl && document.activeElement && loadEl.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  $('#loadMe').modal('hide');
  hideLoading();
};

const csLoadStatement = (tFr, tTo, periodLabel) => {
  csLastRange = { tFr, tTo, label: periodLabel || '' };
  $('#loadMe').modal('show');
  return POSTREQUEST({
    url: CS_DATA_URL,
    data: {
      ...(csAllVendors() ? {} : { vnd: CS_VENDOR_ID }),
      tFr,
      tTo,
      branches: JSON.stringify(csSelectedBranches()),
    },
  })
    .then((resp) => {
      csFinishLoading();
      if (!resp.success) {
        toastr.error(lang(resp.swa, resp.eng), lang('Haikufanikiwa', 'Error'), { timeOut: 2500 });
        return;
      }
      csUpdateSummary(resp.summary, periodLabel);
      csStatementCache = {
        summary: resp.summary || {},
        transactions: resp.transactions || [],
        receipts: resp.receipts || [],
        periodLabel: periodLabel || $('#csPeriodLabel').text(),
      };
      csLastRange = { tFr, tTo, label: csStatementCache.periodLabel };
      csRenderTable(resp.transactions);
      csUpdateReceipts(csStatementCache.receipts, csStatementCache.summary);
      if ($('#csReceiptsModal').hasClass('show')) {
        csRenderReceiptsGallery();
      }
    })
    .catch(() => {
      csFinishLoading();
    });
};

const csSetActivePreset = (key) => {
  csActivePreset = key;
  $('.cs-preset-btn').removeClass('active btn-primary').addClass('btn-outline-secondary');
  $(`.cs-preset-btn[data-preset="${key}"]`).removeClass('btn-outline-secondary').addClass('active btn-primary');
};

window.csApplyPreset = (key, label, tFr, tTo) => {
  csSetActivePreset(key);
  csLoadStatement(tFr, tTo, label);
  return false;
};

window.csApplyCustomRange = () => {
  const rname = $('#csDurationName').val().trim();
  const startDate = $('#csStartDate').val();
  const endDate = $('#csEndDate').val();
  if (!startDate || !endDate) {
    toastr.warning(lang('Chagua tarehe', 'Select dates'), lang('Taarifa', 'Info'), { timeOut: 2000 });
    return;
  }
  const label = rname || `${startDate} – ${endDate}`;
  $('#csDurationModal').modal('hide');
  csSetActivePreset('custom');
  $('.cs-preset-btn').removeClass('active btn-primary').addClass('btn-outline-secondary');
  csLoadStatement(moment(startDate).startOf('day').format(), moment(endDate).endOf('day').format(), label);
};

const csPrintStyles = () => `
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1a1a1a; margin: 0; padding: 24px 28px; }
  h1 { font-size: 16pt; margin: 0 0 4px; font-weight: 700; }
  h2 { font-size: 12pt; margin: 0 0 16px; font-weight: 500; color: #444; }
  .meta { display: flex; flex-wrap: wrap; gap: 8px 32px; margin-bottom: 16px; font-size: 10pt; }
  .meta div { min-width: 200px; }
  .meta strong { display: inline-block; min-width: 88px; color: #333; }
  .summary { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 10pt; }
  .summary td { border: 1px solid #ccc; padding: 8px 10px; vertical-align: top; }
  .summary .lbl { background: #f3f4f6; font-weight: 600; width: 28%; }
  .summary .val { text-align: right; font-weight: 600; }
  .period { margin-bottom: 12px; font-size: 10.5pt; padding: 8px 12px; background: #f8f9fa; border-left: 4px solid #0d6efd; }
  table.ledger { width: 100%; border-collapse: collapse; font-size: 9pt; }
  table.ledger th { background: #2c3e50; color: #fff; padding: 8px 6px; text-align: left; font-weight: 600; }
  table.ledger th.num { text-align: right; }
  table.ledger td { border: 1px solid #ddd; padding: 6px; vertical-align: top; }
  table.ledger td.num { text-align: right; white-space: nowrap; }
  table.ledger tr.opening td { background: #fff8e6; font-weight: 600; }
  table.ledger tbody tr:nth-child(even):not(.opening) { background: #fafafa; }
  .foot { margin-top: 20px; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
  @media print {
    body { padding: 12mm 15mm; }
    table.ledger { page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
  }
`;

window.csPrintStatement = () => {
  const { summary, transactions, periodLabel } = csStatementCache;
  if (!transactions || !transactions.length) {
    toastr.info(lang('Hakuna data ya kuchapisha', 'No data to print'), lang('Taarifa', 'Info'), { timeOut: 2000 });
    return;
  }
  const meta = window.CS_VENDOR_META || {};
  const cur = meta.currency || window.CS_CURRENCY || '';
  const s = summary || {};
  const printedAt = moment().format('DD/MM/YYYY HH:mm');

  let ledgerRows = '';
  transactions.forEach((row) => {
    const trClass = row.kind === 'opening' ? ' class="opening"' : '';
    const item = row.kind === 'opening'
      ? lang('Salio la mwanzo', 'Opening balance')
      : (row.kind === 'payment' ? '---' : (row.item || '—'));
    const recorded = row.kind === 'opening' ? '—' : ((row.recorded_by || '').trim() || '—');
    ledgerRows += `<tr${trClass}>
      <td>${csFormatDateTime(row)}</td>
      ${csAllVendors() ? `<td>${row.kind === 'opening' ? '—' : (row.vendor || '—')}</td>` : ''}
      <td>${row.kind === 'opening' ? '—' : (row.branch || '—')}</td>
      <td>${recorded}</td>
      <td>${csKindLabel(row.kind)}</td>
      <td>${item}</td>
      <td>${row.units || '—'}</td>
      <td class="num">${row.kind === 'payment' || row.kind === 'opening' ? '—' : csPrintAmount(row.price)}</td>
      <td class="num">${row.kind === 'payment' || row.kind === 'opening' ? '—' : csFmtQty(row.qty)}</td>
      <td class="num">${csPrintAmount(row.debt)}</td>
      <td class="num">${csPrintAmount(row.credit)}</td>
      <td class="num">${csPrintBalance(row.balance)}</td>
    </tr>`;
  });

  const title = csAllVendors()
    ? lang('Taarifa za Wasambazaji', 'Vendor Statements')
    : lang('Taarifa ya Msambazaji', 'Vendor Statement');
  const w = window.open('', '_blank');
  if (!w) return;

  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} - ${meta.jina || ''}</title>
    <style>${csPrintStyles()}</style></head><body>
    <h1>${meta.dukaName || ''}</h1>
    <h2>${title}</h2>
    <div class="meta">
      <div><strong>${lang('Msambazaji', 'Vendor')}:</strong> ${meta.jina || (csAllVendors() ? lang('Wasambazaji wote', 'All vendors') : '')}</div>
      <div><strong>${lang('Simu', 'Phone')}:</strong> ${meta.phone || ''}</div>
      <div><strong>${lang('Anwani', 'Address')}:</strong> ${meta.address || '—'}</div>
      ${meta.branches ? `<div><strong>${lang('Tawi', 'Branch')}:</strong> ${meta.branches}</div>` : ''}
    </div>
    <table class="summary">
      <tr><td class="lbl">${lang('Deni linalodaiwa', 'Amount owed')} (${cur})</td><td class="val">${csPrintAmount(s.total_debt)}</td>
          <td class="lbl">${lang('Bili (jumla)', 'Bills (all)')}</td><td class="val">${s.total_invoices ?? '—'}</td></tr>
      <tr><td class="lbl">${lang('Manunuzi (jumla)', 'Purchases (all)')} (${cur})</td><td class="val">${csPrintAmount(s.total_purchase)}</td>
          <td class="lbl">${lang('Malipo (kipindi)', 'Payments (period)')} (${cur})</td><td class="val">${csPrintAmount(s.period_payments)}</td></tr>
      <tr><td class="lbl">${lang('Manunuzi (kipindi)', 'Purchases (period)')} (${cur})</td><td class="val">${csPrintAmount(s.period_purchase)}</td>
          <td class="lbl">${lang('Salio la mwisho', 'Closing balance')} (${cur})</td><td class="val">${csPrintBalance(s.closing_balance)}</td></tr>
    </table>
    <div class="period"><strong>${lang('Kipindi', 'Period')}:</strong> ${periodLabel || '—'}</div>
    <table class="ledger">
      <thead><tr>
        <th>${lang('Tarehe', 'Date')}</th>
        ${csAllVendors() ? `<th>${lang('Msambazaji', 'Vendor')}</th>` : ''}
        <th>${lang('Tawi', 'Branch')}</th>
        <th>${lang('Iliyorekodiwa na', 'Recorded by')}</th>
        <th>${lang('Aina', 'Type')}</th>
        <th>${lang('Bidhaa', 'Item')}</th>
        <th>${lang('Vipimo', 'Units')}</th>
        <th class="num">${lang('Bei', 'Price')}</th>
        <th class="num">${lang('Idadi', 'Qty')}</th>
        <th class="num">${lang('Deni', 'Debt')}</th>
        <th class="num">${lang('Malipo', 'Credit')}</th>
        <th class="num">${lang('Salio', 'Balance')}</th>
      </tr></thead>
      <tbody>${ledgerRows}</tbody>
    </table>
    <div class="foot">${lang('Ilichapishwa', 'Printed')}: ${printedAt} · ${cur}</div>
    </body></html>`);
  w.document.close();
  w.focus();
  w.print();
};

let vpOpenBills = [];

const vpToday = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const vpPayAmount = (totalDue) => {
  const raw = $('#bill-lipwa-amount').val();
  if (raw === '' || raw == null) return Number(totalDue) || 0;
  return Number(raw) || 0;
};

const vpAllocate = (bills, amount) => {
  let remaining = Number(amount) || 0;
  return (bills || []).map((b) => {
    const due = Number(b.due) || 0;
    const apply = remaining > 0 ? Math.min(due, remaining) : 0;
    remaining -= apply;
    return { ...b, apply };
  });
};

const vpRenderBills = (bills, amount) => {
  const rows = vpAllocate(bills, amount);
  if (!rows.length) {
    $('#vpPayBillsBody').html(
      `<tr><td colspan="4" class="text-center text-muted small py-2">${lang('Hakuna bili zinazodaiwa', 'No unpaid bills')}</td></tr>`
    );
    return;
  }
  let html = '';
  rows.forEach((b) => {
    const applyCls = b.apply > 0 ? 'text-success weight600' : 'text-muted';
    html += `<tr>
      <td class="small">BILL-${b.code || b.id}</td>
      <td class="small">${b.branch || '—'}</td>
      <td class="small text-right">${csFmt(b.due)}</td>
      <td class="small text-right ${applyCls}">${b.apply ? csFmt(b.apply) : '—'}</td>
    </tr>`;
  });
  $('#vpPayBillsBody').html(html);
};

const vpOnPayInputs = () => {
  const totalDue = Number($('#bill-lipwa-amount').data('amount')) || 0;
  const acId = Number($('#malipo-akaunti').find('option:selected').data('value')) || 0;
  const acAm = Number($('#malipo-akaunti').find('option:selected').data('amount')) || 0;
  const paidRaw = $('#bill-lipwa-amount').val();
  const paidSet = paidRaw !== '' && paidRaw != null;
  const paid = vpPayAmount(totalDue);
  const balRaw = $('#ac-baki-amount').val();
  const balSet = balRaw !== '' && balRaw != null;
  const bal = Number(balRaw) || 0;

  $('#paid_set').val(paidSet ? 1 : 0);
  $('#bal_set').val(balSet ? 1 : 0);
  $('#ac').val(acId || '');

  vpRenderBills(vpOpenBills, paid);
  $('#ac-baki-amount').attr('placeholder', (acAm - paid).toLocaleString());

  $('#helpinId').prop('hidden', true);
  $('#helpinId2').prop('hidden', true);
  $('#helperId').prop('hidden', true);
  $('#helperId2').prop('hidden', true);
  $('#helpedId').prop('hidden', true);

  let ok = true;
  if (!acId) {
    $('#helpinId2').prop('hidden', false);
    ok = false;
  } else if (acAm + 0.0001 < paid) {
    $('#helpinId').prop('hidden', false);
    $('#helperId').prop('hidden', false);
    ok = false;
  }
  if (paid <= 0) ok = false;
  if (paid > totalDue + 0.005) {
    $('#helperId2').prop('hidden', false);
    ok = false;
  }
  if (balSet && acAm - paid + 0.005 < bal) {
    $('#helpedId').prop('hidden', false);
    ok = false;
  }
  $('#save_pay_btn').prop('disabled', !ok);
};

const vpOpenPayModal = () => {
  const branches = csSelectedBranches();
  $('#vpPayBranches').val(JSON.stringify(branches));
  $('#vp-pay-date').val(vpToday());
  $('#bill-lipwa-amount').val('');
  $('#ac-baki-amount').val('');
  $('#paid_set').val(0);
  $('#bal_set').val(0);
  $('#save_pay_btn').prop('disabled', true);

  POSTREQUEST({
    url: window.CS_OPEN_BILLS_URL,
    data: {
      vnd: CS_VENDOR_ID,
      branches: JSON.stringify(branches),
    },
  })
    .then((resp) => {
      if (!resp.success) {
        toastr.error(lang(resp.swa, resp.eng), lang('Haikufanikiwa', 'Error'), { timeOut: 2500 });
        return;
      }
      vpOpenBills = resp.bills || [];
      const totalDue = Number(resp.total_due) || 0;
      $('#bill-lipwa-amount').data('amount', totalDue);
      $('#vpTotalDueLabel').text(csFmt(totalDue));
      if (totalDue <= 0.005) {
        toastr.info(lang('Hakuna deni linalodaiwa', 'No outstanding debt'), lang('Taarifa', 'Info'), { timeOut: 2000 });
        return;
      }
      if ($('#malipo-akaunti option').length < 2 && $('#Chagua-Akaunti option').length) {
        $('#malipo-akaunti').html($('#Chagua-Akaunti').html());
      }
      try {
        $('#malipo-akaunti').selectpicker('refresh');
      } catch (e) { /* ignore */ }
      vpOnPayInputs();
      $('#lipiaBill').modal('show');
    })
    .catch(() => {
      toastr.error(lang('Hitilafu', 'Something went wrong'), lang('Haikufanikiwa', 'Error'), { timeOut: 2500 });
    });
};

const vpSubmitPay = (e) => {
  e.preventDefault();
  if ($('#save_pay_btn').prop('disabled')) return;
  const form = e.currentTarget;
  const formData = new FormData(form);
  formData.set('branches', JSON.stringify(csSelectedBranches()));
  formData.set('pay_d', vpToday());
  $('#save_pay_btn').prop('disabled', true);
  $('#loadMe').modal('show');
  $.ajax({
    url: window.CS_PAY_URL || $(form).attr('action'),
    type: 'POST',
    data: formData,
    cache: false,
    processData: false,
    contentType: false,
  })
    .done((data) => {
      csFinishLoading();
      if (!data.success) {
        toastr.error(lang(data.swa, data.eng), lang('Haikufanikiwa', 'Error'), { timeOut: 3500 });
        vpOnPayInputs();
        return;
      }
      $('#lipiaBill').modal('hide');
      toastr.success(lang(data.swa, data.eng), lang('Imefanikiwa', 'Success'), { timeOut: 2500 });
      try {
        if (typeof getAkaunts !== 'undefined' && getAkaunts.getdata) getAkaunts.getdata();
      } catch (err) { /* ignore */ }
      if (csLastRange.tFr && csLastRange.tTo) {
        csLoadStatement(csLastRange.tFr, csLastRange.tTo, csLastRange.label);
      }
    })
    .fail(() => {
      csFinishLoading();
      vpOnPayInputs();
      toastr.error(lang('Hitilafu', 'Something went wrong'), lang('Haikufanikiwa', 'Error'), { timeOut: 2500 });
    });
};

$(document).ready(() => {
  const monthLabel = lang('Mwezi Huu', 'This Month');
  csSetActivePreset('month');
  csLoadStatement(moment().startOf('month').format(), moment().format(), monthLabel);

  $('#csCustomDateSubmit').on('click', csApplyCustomRange);
  $('#csPrintStatementBtn').on('click', () => csPrintStatement());
  $('#csReceiptsPanel').on('click', () => {
    csRenderReceiptsGallery();
    $('#csReceiptsModal').modal('show');
  });
  $(document).on('click', '.cs-rcpt-layout', function () {
    csReceiptLayout = {
      cols: Number(this.getAttribute('data-cols')) || 1,
      rows: Number(this.getAttribute('data-rows')) || 1,
    };
    $('.cs-rcpt-layout').removeClass('active');
    $(this).addClass('active');
    csApplyReceiptLayout();
  });
  $('#csPrintReceiptsBtn').on('click', () => csPrintReceipts());

  $(document).on('change', '#csBranchAll', function () {
    const on = this.checked;
    $('.cs-branch-check').prop('checked', on);
    if (csLastRange.tFr && csLastRange.tTo) {
      csLoadStatement(csLastRange.tFr, csLastRange.tTo, csLastRange.label);
    }
  });
  $(document).on('change', '.cs-branch-check', function () {
    csSyncBranchAll();
    if (!csSelectedBranches().length && window.CS_CURRENT_BRANCH_ID) {
      $(`.cs-branch-check[value="${CS_CURRENT_BRANCH_ID}"]`).prop('checked', true);
      csSyncBranchAll();
    }
    if (csLastRange.tFr && csLastRange.tTo) {
      csLoadStatement(csLastRange.tFr, csLastRange.tTo, csLastRange.label);
    }
  });

  if (!csAllVendors()) {
    $('#csPayVendorBtn').on('click', () => vpOpenPayModal());
    $('#malipo-akaunti').on('changed.bs.select change', vpOnPayInputs);
    $('#bill-lipwa-amount').on('keyup change', vpOnPayInputs);
    $('#ac-baki-amount').on('keyup change', vpOnPayInputs);
    $('#vendorPayForm').on('submit', vpSubmitPay);
  }
});
