(function (window, $) {
  var DATE_HEAD = /tarehe|date|kuanzia|hadi|\bfrom\b|\bto\b|completion|starting|ordered|receive|kuagiza|kumaliza|kuanza/i;
  var SKIP_DATE = /bado|yet|progress|endelea|n\/a|null|hakuna|loading|inapakia|^—$|^-$|^…$/i;
  var DATE_FMTS = [
    'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',
    'YYYY-MM-DDTHH:mm:ssZ',
    'YYYY-MM-DDTHH:mm:ss',
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm',
    'YYYY-MM-DD',
    'DD/MM/YYYY HH:mm:ss',
    'DD/MM/YYYY HH:mm',
    'DD/MM/YYYY, HH:mm',
    'DD, MMMM YYYY, HH:mm',
    'MMM DD, YYYY HH:mm',
    'MMMM DD, YYYY, h:mm a',
    'MMM. DD, YYYY, h:mm a'
  ];

  function parseTxnMoment(text) {
    if (typeof moment === 'undefined') return null;
    var raw = String(text || '').replace(/\s+/g, ' ').trim();
    if (!raw || !/\d/.test(raw) || SKIP_DATE.test(raw)) return null;
    var m = moment(raw, DATE_FMTS, true);
    return m.isValid() ? m : null;
  }

  function formatDateCell($td) {
    if ($td.data('txnDated')) return;
    if ($td.find('input,select,button.btn-link').length) return;
    if (Number($td.attr('colspan') || 1) > 1) return;
    var text = $td.text().replace(/\s+/g, ' ').trim();
    if (!text || SKIP_DATE.test(text)) return;
    var m = parseTxnMoment(text);
    if (!m) return;
    $td.text(m.format('DD/MM/YYYY HH:mm'));
    $td.data('txnDated', 1);
  }

  function viewHref($row) {
    var $a = $row.find('td:last-child a[href]').filter(function () {
      var h = String($(this).attr('href') || '');
      return h && h !== '#' && h.indexOf('javascript:') !== 0;
    }).first();
    return $a.attr('href') || '';
  }

  function wrapLink($td, href) {
    if (!href || !$td.length) return;
    if ($td.find('a.txn-code-link, a[href]:not([href="#"])').length) return;
    var html = $.trim($td.html());
    if (!html) return;
    $td.addClass('txn-title-cell').html('<a class="txn-code-link" href="' + href + '">' + html + '</a>');
  }

  function enhanceTxnTable(table) {
    var $t = $(table);
    if (!$t.length || !$t.is('table')) return;
    $t.addClass('txn-list');
    $t.closest('.table-responsive, .dataTables_wrapper').addClass('txn-list-wrap');
    var headers = [];
    $t.find('thead th').each(function () {
      headers.push($(this).text().replace(/\s+/g, ' ').trim());
    });
    $t.find('tbody tr').each(function () {
      var $row = $(this);
      var $cells = $row.children('td');
      var href = viewHref($row);
      $cells.each(function (i) {
        var $td = $(this);
        var label = headers[i] || '';
        if (!$td.attr('data-label') && label) $td.attr('data-label', label);
        if (/^(action|view|angalia)$/i.test(label) || $td.find('.bi-eye, .fa-eye').length) {
          $td.addClass('txn-action-cell');
        }
        if (label && DATE_HEAD.test(label) && !/^action$/i.test(label)) formatDateCell($td);
      });
      if (!href) return;
      if (headers[0] === '#') wrapLink($cells.eq(1), href);
      else wrapLink($cells.eq(0), href);
    });
  }

  function enhanceAll() {
    $('table.txn-list').each(function () {
      enhanceTxnTable(this);
    });
  }

  window.enhanceTxnTable = enhanceTxnTable;
  window.enhanceTxnTables = enhanceAll;

  $(function () {
    enhanceAll();
    $(document).on('init.dt draw.dt', function (e, settings) {
      if (settings && settings.nTable) enhanceTxnTable(settings.nTable);
    });
  });
})(window, window.jQuery);
