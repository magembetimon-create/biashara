/* Customer sales statement – /mauzo/CustomerSales */

let csActivePreset = 'month';

let csStatementCache = {
  summary: null,
  transactions: [],
  periodLabel: '',
};

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
  const cls = n > 0 ? 'text-success weight600' : 'brown weight600';
  const prefix = n > 0 ? '+' : '';
  return `<td class="cs-num ${cls}">${prefix}${csFmt(n)}</td>`;
};

const csKindLabel = (kind) => {
  if (kind === 'opening') return lang('Salio la mwanzo', 'Opening balance');
  if (kind === 'line') return lang('Manunuzi', 'Purchase');
  if (kind === 'order') return lang('Agizo', 'Order');
  if (kind === 'payment') return lang('Malipo', 'Payment');
  if (kind === 'prepaid') return lang('Malipo agizo', 'Prepaid order');
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
  const name = row.item || '—';
  if (row.kind === 'line' && row.invo_id) {
    return `<button type="button" class="cs-invo-ref viewInvo btn btn-link btn-sm p-0 align-baseline text-primary text-left"
      data-val="${row.invo_id}" data-toggle="modal" data-target="#ShowTheInvo">${name}</button>`;
  }
  return name;
};

const csPrintAmount = (value) => {
  const n = Number(value || 0);
  if (!n) return '—';
  return csFmt(n);
};

const csPrintBalance = (value) => {
  let n = Number(value || 0);
  if (Math.abs(n) < 0.005) return '0';
  const prefix = n > 0 ? '+' : '';
  return `${prefix}${csFmt(n)}`;
};

const csUpdateSummary = (summary, periodLabel) => {
  const s = summary || {};
  const debt = Number(s.total_debt) || 0;
  const credit = Number(s.customer_credit) || 0;
  const closing = Number(s.closing_balance) || 0;

  $('#csTotalDebt').text(csFmt(debt));
  $('#csCustomerCredit').text(csFmt(credit));

  const creditCard = $('#csCreditCard');
  if (credit > 0.005) creditCard.removeClass('d-none');
  else creditCard.addClass('d-none');

  $('#csTotalInvoices').text(s.total_invoices ?? 0);
  $('#csTotalPurchase').text(csFmt(s.total_purchase));
  $('#csPeriodInvoices').text(s.period_invoices ?? 0);
  $('#csPeriodPurchase').text(csFmt(s.period_purchase));
  $('#csPeriodPayments').text(csFmt(s.period_payments));

  let closingText = '0';
  if (Math.abs(closing) >= 0.005) {
    closingText = closing > 0 ? `+${csFmt(closing)}` : csFmt(closing);
  }
  $('#csClosingBalance').text(closingText);

  if (periodLabel) $('#csPeriodLabel').text(periodLabel);

  const debtCard = $('#csDebtCard');
  if (debt > 0.005) debtCard.addClass('cs-debt');
  else debtCard.removeClass('cs-debt');
  if (typeof csRefreshPaymentButton === 'function') csRefreshPaymentButton(debt);
};

const csRenderTable = (transactions) => {
  const rows = transactions || [];
  if (!rows.length) {
    $('#csStatementBody').html(
      `<tr><td colspan="9" class="text-center text-muted py-4">${lang('Hakuna miamala kwa kipindi hiki', 'No transactions in this period')}</td></tr>`
    );
    return;
  }

  let html = '';
  rows.forEach((row) => {
    const trClass = row.kind === 'opening' ? 'cs-opening-row' : row.kind === 'order' ? 'cs-order-row' : '';
    html += `<tr class="${trClass}">
      <td class="text-nowrap small">${csFormatDateTime(row)}</td>
      <td>${csKindLabel(row.kind)}</td>
      <td class="small">${csItemCell(row)}</td>
      <td class="small text-muted">${row.units || '—'}</td>
      ${row.kind === 'opening' || row.kind === 'payment' || row.kind === 'prepaid' ? csNumCell(0) : csNumCell(row.price)}
      ${row.kind === 'opening' || row.kind === 'payment' || row.kind === 'prepaid' ? '<td class="cs-num text-muted">—</td>' : `<td class="cs-num">${csFmtQty(row.qty)}</td>`}
      ${csNumCell(row.debt, 'text-dark', row.kind === 'order')}
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
  $('#loadMe').modal('show');
  return POSTREQUEST({
    url: CS_DATA_URL,
    data: {
      cust: CS_CUSTOMER_ID,
      tFr,
      tTo,
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
        periodLabel: periodLabel || $('#csPeriodLabel').text(),
      };
      csRenderTable(resp.transactions);
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

window.csReloadStatement = () => {
  const label = $('#csPeriodLabel').text() || lang('Mwezi Huu', 'This Month');
  const preset = csActivePreset;
  if (preset === 'today') {
    csLoadStatement(moment().startOf('day').format(), moment().format(), label);
  } else if (preset === 'week') {
    csLoadStatement(moment().startOf('isoWeek').format(), moment().format(), label);
  } else if (preset === 'month') {
    csLoadStatement(moment().startOf('month').format(), moment().format(), label);
  } else {
    window.location.reload();
  }
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
  const meta = window.CS_CUSTOMER_META || {};
  const cur = meta.currency || window.CS_CURRENCY || '';
  const s = summary || {};
  const printedAt = moment().format('DD/MM/YYYY HH:mm');

  let ledgerRows = '';
  transactions.forEach((row) => {
    const trClass = row.kind === 'opening' ? ' class="opening"' : '';
    const item = row.kind === 'opening' ? lang('Salio la mwanzo', 'Opening balance') : (row.item || '—');
    ledgerRows += `<tr${trClass}>
      <td>${csFormatDateTime(row)}</td>
      <td>${csKindLabel(row.kind)}</td>
      <td>${item}</td>
      <td>${row.units || '—'}</td>
      <td class="num">${row.kind === 'payment' || row.kind === 'prepaid' || row.kind === 'opening' ? '—' : csPrintAmount(row.price)}</td>
      <td class="num">${row.kind === 'payment' || row.kind === 'prepaid' || row.kind === 'opening' ? '—' : csFmtQty(row.qty)}</td>
      <td class="num">${csPrintAmount(row.debt)}</td>
      <td class="num">${csPrintAmount(row.credit)}</td>
      <td class="num">${csPrintBalance(row.balance)}</td>
    </tr>`;
  });

  const creditRow = Number(s.customer_credit) > 0.005
    ? `<tr><td class="lbl">${lang('Credit (agizo prepaid)', 'Prepaid order credit')} (${cur})</td><td class="val">${csPrintAmount(s.customer_credit)}</td><td colspan="2"></td></tr>`
    : '';

  const title = lang('Taarifa ya Mteja', 'Customer Statement');
  const w = window.open('', '_blank');
  if (!w) return;

  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} - ${meta.jina || ''}</title>
    <style>${csPrintStyles()}</style></head><body>
    <h1>${meta.dukaName || ''}</h1>
    <h2>${title}</h2>
    <div class="meta">
      <div><strong>${lang('Mteja', 'Customer')}:</strong> ${meta.jina || ''}</div>
      <div><strong>${lang('Simu', 'Phone')}:</strong> ${meta.phone || ''}</div>
      <div><strong>${lang('Anwani', 'Address')}:</strong> ${meta.address || '—'}</div>
      ${meta.branches ? `<div><strong>${lang('Matawi', 'Branches')}:</strong> ${meta.branches}</div>` : ''}
    </div>
    <table class="summary">
      <tr><td class="lbl">${lang('Deni lote', 'Total debt')} (${cur})</td><td class="val">${csPrintAmount(s.total_debt)}</td>
          <td class="lbl">${lang('Ankara (jumla)', 'Invoices (all)')}</td><td class="val">${s.total_invoices ?? '—'}</td></tr>
      ${creditRow}
      <tr><td class="lbl">${lang('Manunuzi (jumla)', 'Purchases (all)')} (${cur})</td><td class="val">${csPrintAmount(s.total_purchase)}</td>
          <td class="lbl">${lang('Malipo (kipindi)', 'Payments (period)')} (${cur})</td><td class="val">${csPrintAmount(s.period_payments)}</td></tr>
      <tr><td class="lbl">${lang('Manunuzi (kipindi)', 'Purchases (period)')} (${cur})</td><td class="val">${csPrintAmount(s.period_purchase)}</td>
          <td class="lbl">${lang('Salio la mwisho', 'Closing balance')} (${cur})</td><td class="val">${csPrintBalance(s.closing_balance)}</td></tr>
    </table>
    <div class="period"><strong>${lang('Kipindi', 'Period')}:</strong> ${periodLabel || '—'}</div>
    <table class="ledger">
      <thead><tr>
        <th>${lang('Tarehe', 'Date')}</th>
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

$(document).ready(() => {
  const monthLabel = lang('Mwezi Huu', 'This Month');
  csSetActivePreset('month');
  csLoadStatement(moment().startOf('month').format(), moment().format(), monthLabel);

  $('#csCustomDateSubmit').on('click', csApplyCustomRange);
  $('#csPrintStatementBtn').on('click', () => csPrintStatement());

  $('#ShowTheInvo').on('hidden.bs.modal', () => {
    $('#Invo_loader').hide();
    $('#Invo_notFound').hide();
    $('#the_invo_page').hide();
    $('#IfPaid').hide();
  });
});
