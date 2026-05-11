/* mobile_payments.js – handles summary cards and detail table for Mobile Payments page */

(function () {
  'use strict';

  var currentPeriod = 'today';

  /* ── Helpers ───────────────────────────────────────────────────── */
  function fmt(n) {
    return CURRENCY + ' ' + parseFloat(n || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }

  function periodLabel(p) {
    var labels = {
      today:  LANG === 0 ? 'Leo'           : 'Today',
      week:   LANG === 0 ? 'Wiki Hii'      : 'This Week',
      month:  LANG === 0 ? 'Mwezi Huu'     : 'This Month',
      custom: LANG === 0 ? 'Tarehe Maalum' : 'Custom Range',
    };
    return labels[p] || p;
  }

  /* ── Summary cards ─────────────────────────────────────────────── */
  function updateSummary(summary) {
    ['today', 'week', 'month'].forEach(function (p) {
      var d = summary[p] || { count: 0, amount: 0 };
      document.getElementById('sum-' + p + '-amount').textContent = fmt(d.amount);
      var recLabel = LANG === 0 ? 'rekodi' : 'records';
      document.getElementById('sum-' + p + '-count').textContent = d.count + ' ' + recLabel;
    });
  }

  /* ── Detail table ──────────────────────────────────────────────── */
  function renderRows(rows, count) {
    var tbody = document.getElementById('detail-tbody');
    document.getElementById('detail-count').textContent = count;

    if (!rows || rows.length === 0) {
      var msg = LANG === 0 ? 'Hakuna rekodi' : 'No records found';
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3 robotoFont smallFont">' + msg + '</td></tr>';
      return;
    }

    var html = '';
    rows.forEach(function (r) {
      var approved = r.admin_approve;
      var statusBadge = approved
        ? '<span class="badge badge-success smallerFont">' + (LANG === 0 ? 'Imeidhinishwa' : 'Approved') + '</span>'
        : '<span class="badge badge-warning smallerFont">' + (LANG === 0 ? 'Inasubiri' : 'Pending') + '</span>';

      html += '<tr>'
        + '<td class="robotoFont">' + (r.tarehe || '—') + '</td>'
        + '<td class="robotoFont">' + (r.by_fname || '') + ' ' + (r.by_lname || '') + '</td>'
        + '<td class="latoFont">' + fmt(r.Amount) + '</td>'
        + '<td class="robotoFont">' + (r.akaunti_name || '—') + '</td>'
        + '<td class="robotoFont">' + (r.aina || '—') + '</td>'
        + '<td>' + statusBadge + '</td>'
        + '</tr>';
    });
    tbody.innerHTML = html;
  }

  /* ── Fetch data ─────────────────────────────────────────────────── */
  function fetchData(period, dateFrom, dateTo, byId) {
    var params = new URLSearchParams({ period: period });
    if (byId) params.append('by_id', byId);
    if (period === 'custom') {
      params.append('date_from', dateFrom || '');
      params.append('date_to', dateTo || '');
    }

    fetch(DATA_URL + '?' + params.toString(), {
      method: 'GET',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          updateSummary(data.summary);
          renderRows(data.rows, data.count);
          var titleEl = document.getElementById('detail-title');
          var titleBase = LANG === 0 ? 'Malipo ya Simu' : 'Mobile Payments';
          titleEl.textContent = titleBase + ' – ' + periodLabel(period);
        }
      })
      .catch(function () {
        var msg = LANG === 0 ? 'Hitilafu ya seva' : 'Server error';
        document.getElementById('detail-tbody').innerHTML =
          '<tr><td colspan="6" class="text-center text-danger py-3 smallFont robotoFont">' + msg + '</td></tr>';
      });
  }

  /* ── Public API (called from HTML onclick) ─────────────────────── */
  window.loadDetail = function (period) {
    currentPeriod = period;
    document.getElementById('period-select').value = period;
    var byId = document.getElementById('by-select').value;
    fetchData(period, '', '', byId);
  };

  window.applyFilter = function () {
    var period = document.getElementById('period-select').value;
    var dateFrom = document.getElementById('date-from').value;
    var dateTo = document.getElementById('date-to').value;
    var byId = document.getElementById('by-select').value;
    currentPeriod = period;
    fetchData(period, dateFrom, dateTo, byId);
  };

  window.onPeriodChange = function () {
    var period = document.getElementById('period-select').value;
    var fromWrap = document.getElementById('date-from-wrap');
    var toWrap = document.getElementById('date-to-wrap');
    if (period === 'custom') {
      fromWrap.classList.remove('d-none');
      toWrap.classList.remove('d-none');
    } else {
      fromWrap.classList.add('d-none');
      toWrap.classList.add('d-none');
    }
  };

  /* ── Auto-load on page ready ────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    fetchData('today', '', '', '');
  });

})();
