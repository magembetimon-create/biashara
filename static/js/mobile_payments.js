/* mobile_payments.js – handles summary cards and detail table for Mobile Payments page */

(function () {
  'use strict';

  var currentPeriod = 'today';
  var activeById = '';
  var cache = {
    byId: '',
    rangeFrom: '',
    rangeTo: '',
    rows: []
  };

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

  function toDateOnlyStr(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function parseRowDate(row) {
    if (!row || !row.tarehe) return null;
    var iso = String(row.tarehe).replace(' ', 'T');
    var d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  function getWeekStart(d) {
    var copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var day = copy.getDay();
    var mondayOffset = (day + 6) % 7;
    copy.setDate(copy.getDate() - mondayOffset);
    return copy;
  }

  function getMonthStart(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function getMonthEnd(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  function getDefaultDateRange() {
    var now = new Date();
    var monthStart = getMonthStart(now);
    var monthEnd = getMonthEnd(now);
    var weekStart = getWeekStart(now);
    var start = weekStart < monthStart ? weekStart : monthStart;
    return {
      from: toDateOnlyStr(start),
      to: toDateOnlyStr(monthEnd)
    };
  }

  function setDateInputs(fromStr, toStr) {
    document.getElementById('date-from').value = fromStr;
    document.getElementById('date-to').value = toStr;
  }

  function isInsideCacheRange(fromStr, toStr, byId) {
    if (!cache.rows || cache.rows.length === 0) return false;
    if ((byId || '') !== (cache.byId || '')) return false;
    if (!cache.rangeFrom || !cache.rangeTo) return false;
    return fromStr >= cache.rangeFrom && toStr <= cache.rangeTo;
  }

  function inDateRange(row, fromStr, toStr) {
    var d = parseRowDate(row);
    if (!d) return false;
    var dayStr = toDateOnlyStr(d);
    return dayStr >= fromStr && dayStr <= toStr;
  }

  function filterRowsFromCache(fromStr, toStr, byId) {
    return (cache.rows || []).filter(function (r) {
      if (byId && String(r.by__id || '') !== String(byId)) return false;
      return inDateRange(r, fromStr, toStr);
    });
  }

  function rowsStats(rows) {
    var total = 0;
    for (var i = 0; i < rows.length; i++) {
      total += parseFloat(rows[i].Amount || 0);
    }
    return { count: rows.length, amount: total };
  }

  function computeSummaryFromCache(byId) {
    var now = new Date();
    var todayStr = toDateOnlyStr(now);
    var weekStartStr = toDateOnlyStr(getWeekStart(now));
    var monthStartStr = toDateOnlyStr(getMonthStart(now));

    var todayRows = filterRowsFromCache(todayStr, todayStr, byId);
    var weekRows = filterRowsFromCache(weekStartStr, todayStr, byId);
    var monthRows = filterRowsFromCache(monthStartStr, todayStr, byId);

    return {
      today: rowsStats(todayRows),
      week: rowsStats(weekRows),
      month: rowsStats(monthRows)
    };
  }

  function rowsForPeriodFromCache(period, byId, customFrom, customTo) {
    var now = new Date();
    if (period === 'today') {
      var t = toDateOnlyStr(now);
      return filterRowsFromCache(t, t, byId);
    }
    if (period === 'week') {
      return filterRowsFromCache(toDateOnlyStr(getWeekStart(now)), toDateOnlyStr(now), byId);
    }
    if (period === 'month') {
      return filterRowsFromCache(toDateOnlyStr(getMonthStart(now)), toDateOnlyStr(now), byId);
    }
    return filterRowsFromCache(customFrom, customTo, byId);
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

  function updateViewFromRows(period, rows, byId) {
    updateSummary(computeSummaryFromCache(byId));
    renderRows(rows, rows.length);
    var titleEl = document.getElementById('detail-title');
    var titleBase = LANG === 0 ? 'Malipo ya Simu' : 'Mobile Payments';
    titleEl.textContent = titleBase + ' - ' + periodLabel(period);
  }

  function fetchCustomRangeAndCache(dateFrom, dateTo, byId, cb) {
    var params = new URLSearchParams({
      period: 'custom',
      date_from: dateFrom || '',
      date_to: dateTo || ''
    });
    if (byId) params.append('by_id', byId);

    fetch(DATA_URL + '?' + params.toString(), {
      method: 'GET',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          cache.byId = byId || '';
          cache.rangeFrom = dateFrom;
          cache.rangeTo = dateTo;
          cache.rows = data.rows || [];
          if (typeof cb === 'function') cb(true);
        }
      })
      .catch(function () {
        var msg = LANG === 0 ? 'Hitilafu ya seva' : 'Server error';
        document.getElementById('detail-tbody').innerHTML =
          '<tr><td colspan="6" class="text-center text-danger py-3 smallFont robotoFont">' + msg + '</td></tr>';
        if (typeof cb === 'function') cb(false);
      });
  }

  function loadUsingCacheOrBackend(period, dateFrom, dateTo, byId) {
    activeById = byId || '';
    var fromStr = dateFrom || document.getElementById('date-from').value;
    var toStr = dateTo || document.getElementById('date-to').value;

    if (period === 'custom') {
      if (fromStr && toStr && isInsideCacheRange(fromStr, toStr, byId)) {
        updateViewFromRows('custom', rowsForPeriodFromCache('custom', byId, fromStr, toStr), byId);
        return;
      }
      fetchCustomRangeAndCache(fromStr, toStr, byId, function (ok) {
        if (!ok) return;
        updateViewFromRows('custom', rowsForPeriodFromCache('custom', byId, fromStr, toStr), byId);
      });
      return;
    }

    if (cache.rows && cache.rows.length > 0 && (byId || '') === (cache.byId || '')) {
      updateViewFromRows(period, rowsForPeriodFromCache(period, byId, fromStr, toStr), byId);
      return;
    }

    fetchCustomRangeAndCache(fromStr, toStr, byId, function (ok) {
      if (!ok) return;
      updateViewFromRows(period, rowsForPeriodFromCache(period, byId, fromStr, toStr), byId);
    });
  }

  /* ── Public API (called from HTML onclick) ─────────────────────── */
  window.loadDetail = function (period) {
    currentPeriod = period;
    document.getElementById('period-select').value = period;
    var byId = document.getElementById('by-select').value;
    loadUsingCacheOrBackend(period, '', '', byId);
  };

  window.applyFilter = function () {
    var period = document.getElementById('period-select').value;
    var dateFrom = document.getElementById('date-from').value;
    var dateTo = document.getElementById('date-to').value;
    var byId = document.getElementById('by-select').value;
    currentPeriod = period;
    loadUsingCacheOrBackend(period, dateFrom, dateTo, byId);
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
    var defaults = getDefaultDateRange();
    setDateInputs(defaults.from, defaults.to);
    loadUsingCacheOrBackend('today', defaults.from, defaults.to, '');
  });

})();
