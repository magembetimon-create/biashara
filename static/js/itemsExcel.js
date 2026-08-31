/**
 * Excel template, export, and bulk import for stock items (server-generated xlsx).
 */
(function (window) {
  'use strict';

  var pendingImportFile = null;

  function exportQueryString() {
    var params = [];
    var f = $('#itemsKey').val();
    var bf = $('#brandFilter').val();
    var sup = $('#supFilter').val();
    if (f) params.push('f=' + encodeURIComponent(f));
    if (bf) params.push('bf=' + encodeURIComponent(bf));
    if (sup) params.push('sup=' + encodeURIComponent(sup));
    if (/[?&]uncat=1/.test(window.location.search)) {
      params.push('uncat=1');
    }
    return params.length ? '?' + params.join('&') : '';
  }

  function downloadTemplate() {
    window.location.href = '/stoku/itemsExcelTemplate';
  }

  function downloadCurrentItems() {
    window.location.href = '/stoku/itemsExcelExport' + exportQueryString();
  }

  function renderPreview(preview, total) {
    var $body = $('#items-excel-preview-body');
    $body.empty();
    if (!preview || !preview.length) {
      $body.html('<tr><td colspan="5" class="text-muted">' +
        lang('Hakuna mistari sahihi', 'No valid rows found') + '</td></tr>');
      $('#items-excel-row-count').text('0');
      return;
    }
    preview.forEach(function (r) {
      $body.append(
        '<tr><td>' + r.row + '</td>' +
        '<td class="text-capitalize">' + String(r.jina_la_bidhaa || '—').replace(/</g, '&lt;') + '</td>' +
        '<td>' + String(r.rangi_model || '—').replace(/</g, '&lt;') + '</td>' +
        '<td>' + String(r.size || '—').replace(/</g, '&lt;') + '</td>' +
        '<td>' + String(r.variants || 0) + '</td></tr>'
      );
    });
    if (total > preview.length) {
      $body.append('<tr><td colspan="5" class="text-muted smallFont">' +
        lang('Na bidhaa ', 'And ') + (total - preview.length) +
        lang(' zingine...', ' more...') + '</td></tr>');
    }
    $('#items-excel-row-count').text(total);
  }

  function previewFile(file) {
    var form = new FormData();
    form.append('file', file);
    form.append('preview', '1');
    form.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());

    fetch('/stoku/itemsExcelImportFile?preview=1', {
      method: 'POST',
      headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
      body: form
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.success) {
          toastr.error(lang(data.message_swa, data.message_eng), lang('Hitilafu', 'Error'));
          pendingImportFile = null;
          renderPreview([], 0);
          return;
        }
        renderPreview(data.preview || [], data.count || 0);
        var msg = (data.count || 0) + ' ' + lang('bidhaa', 'items');
        if (data.row_count) {
          msg += ' (' + data.row_count + ' ' + lang('mistari', 'rows') + ')';
        }
        toastr.info(msg, lang('Taarifa', 'Notice'), { timeOut: 2500 });
      })
      .catch(function () {
        pendingImportFile = null;
        toastr.error(lang('Faili halisomeki', 'Could not read file'));
      });
  }

  function appendImportResults(results) {
    var $results = $('#items-excel-results');
    if (!results || !results.length) return;
    results.forEach(function (r) {
      if (r.skipped) return;
      var ok = r.success;
      var msg = lang(r.message_swa, r.message_eng);
      $results.append(
        '<div class="smallFont ' + (ok ? 'text-success' : 'text-danger') + '">' +
        lang('Mstari', 'Row') + ' ' + r.row + ': ' + msg + '</div>'
      );
    });
  }

  function setImportProgress(processed, total, created, failed) {
    var $wrap = $('#items-excel-progress-wrap');
    if (!$wrap.length) return;
    $wrap.show();
    var pct = total ? Math.min(100, Math.round((processed / total) * 100)) : 0;
    $('#items-excel-progress-bar').css('width', pct + '%');
    $('#items-excel-progress-label').text(
      lang('Inaimport bidhaa...', 'Importing items...')
    );
    $('#items-excel-progress-count').text(
      processed + ' / ' + total +
      ' (' + lang('imeongezwa', 'added') + ' ' + created +
      ', ' + lang('hazikufanikiwa', 'failed') + ' ' + failed + ')'
    );
  }

  function finishImport(created, failed) {
    $('#loadMe').modal('hide');
    $('#items-excel-import-btn').prop('disabled', false);
    var msgSwa = 'Imeongezwa ' + created + ' bidhaa, ' + failed + ' hazikufanikiwa';
    var msgEng = 'Added ' + created + ' items, ' + failed + ' failed';
    if (created > 0) {
      toastr.success(lang(msgSwa, msgEng), lang('Imefanikiwa', 'Success'));
      if (typeof getStokuData === 'function') {
        getStokuData('/stoku/getItemsAll');
      }
    } else if (failed === 0) {
      toastr.info(lang(msgSwa, msgEng), lang('Taarifa', 'Notice'));
    } else {
      toastr.error(lang(msgSwa, msgEng), lang('Haikufanikiwa', 'Error'));
    }
  }

  function submitImport() {
    if (!pendingImportFile) {
      toastr.warning(lang('Chagua faili la Excel kwanza', 'Choose an Excel file first'));
      return;
    }
    var $btn = $('#items-excel-import-btn');
    $btn.prop('disabled', true);
    $('#items-excel-results').empty();
    $('#items-excel-progress-wrap').show();
    setImportProgress(0, Number($('#items-excel-row-count').text()) || 0, 0, 0);
    $('#loadMe').modal('show');

    var batchSize = 50;
    var createdTotal = 0;
    var failedTotal = 0;

    function postBatch(offset) {
      var form = new FormData();
      form.append('file', pendingImportFile);
      form.append('offset', String(offset));
      form.append('limit', String(batchSize));
      form.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());

      return fetch('/stoku/itemsExcelImportFile', {
        method: 'POST',
        headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
        body: form
      }).then(function (r) {
        if (!r.ok) throw new Error('import-http');
        return r.json();
      }).then(function (data) {
        if (typeof data.total !== 'number') {
          throw new Error(data.message_eng || 'import');
        }
        createdTotal += Number(data.created || 0);
        failedTotal += Number(data.failed || 0);
        appendImportResults(data.results || []);
        var total = Number(data.total || 0);
        var processed = Number(data.processed || offset);
        setImportProgress(processed, total, createdTotal, failedTotal);
        if (data.done) {
          finishImport(createdTotal, failedTotal);
          return;
        }
        return postBatch(processed);
      });
    }

    postBatch(0).catch(function () {
      $('#loadMe').modal('hide');
      $btn.prop('disabled', false);
      toastr.error(
        lang(
          'Import imesimama. Bidhaa ' + createdTotal + ' zimeshaingia — jaribu tena ili kuendelea na zilizobaki.',
          'Import stopped. ' + createdTotal + ' items were added — try again to continue with the rest.'
        ),
        lang('Hitilafu', 'Error')
      );
    });
  }

  function loadAiPrompt(showToast) {
    var business = ($('#items-excel-ai-business').val() || '').trim();
    var $prompt = $('#items-excel-ai-prompt');
    var $refresh = $('#items-excel-ai-refresh');
    $refresh.prop('disabled', true);
    $prompt.val(lang('Inatengeneza prompt...', 'Building prompt...'));

    var form = new FormData();
    form.append('business', business);
    form.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());

    return fetch('/stoku/itemsExcelAiPrompt', {
      method: 'POST',
      headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
      body: form
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        $refresh.prop('disabled', false);
        if (!data.success || !data.prompt) {
          $prompt.val('');
          toastr.error(
            lang(data.message_swa || 'Imeshindikana', data.message_eng || 'Failed'),
            lang('Hitilafu', 'Error')
          );
          return null;
        }
        $prompt.val(data.prompt);
        if (showToast) {
          toastr.success(lang('Prompt imesasishwa', 'Prompt refreshed'), '', { timeOut: 1500 });
        }
        return data.prompt;
      })
      .catch(function () {
        $refresh.prop('disabled', false);
        $prompt.val('');
        toastr.error(lang('Imeshindikana kutengeneza prompt', 'Could not build prompt'));
        return null;
      });
  }

  function copyAiPrompt() {
    var text = ($('#items-excel-ai-prompt').val() || '').trim();
    if (!text || text === lang('Inatengeneza prompt...', 'Building prompt...')) {
      loadAiPrompt(false).then(function (prompt) {
        if (prompt) copyTextToClipboard(prompt);
      });
      return;
    }
    copyTextToClipboard(text);
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toastr.success(lang('Prompt imenakiliwa', 'Prompt copied'), lang('Imefanikiwa', 'Success'));
      }).catch(function () {
        fallbackCopyText(text);
      });
      return;
    }
    fallbackCopyText(text);
  }

  function fallbackCopyText(text) {
    var $ta = $('#items-excel-ai-prompt');
    $ta.prop('readonly', false);
    $ta.trigger('focus').trigger('select');
    try {
      var ok = document.execCommand('copy');
      if (ok) {
        toastr.success(lang('Prompt imenakiliwa', 'Prompt copied'), lang('Imefanikiwa', 'Success'));
      } else {
        toastr.warning(lang('Nakili kwa mkono kutoka sanduku', 'Please copy manually from the box'));
      }
    } catch (e) {
      toastr.warning(lang('Nakili kwa mkono kutoka sanduku', 'Please copy manually from the box'));
    }
    $ta.prop('readonly', true);
  }

  function downloadAiPromptTxt() {
    var text = ($('#items-excel-ai-prompt').val() || '').trim();
    function save(content) {
      if (!content) return;
      var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'ai_items_excel_prompt.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    if (!text || text === lang('Inatengeneza prompt...', 'Building prompt...')) {
      loadAiPrompt(false).then(save);
      return;
    }
    save(text);
  }

  function bindEvents() {
    $('#btn-items-excel-template').on('click', downloadTemplate);
    $('#btn-items-excel-download').on('click', downloadCurrentItems);

    $(document).on('click', '.items-excel-template-link-ai, #items-excel-template-link', function (e) {
      e.preventDefault();
      downloadTemplate();
    });

    $('#items-excel-ai-modal').on('shown.bs.modal', function () {
      if (!($('#items-excel-ai-prompt').val() || '').trim()) {
        loadAiPrompt(false);
      }
    });
    $('#items-excel-ai-refresh').on('click', function () {
      loadAiPrompt(true);
    });
    $('#items-excel-ai-copy').on('click', copyAiPrompt);
    $('#items-excel-ai-download-txt').on('click', downloadAiPromptTxt);

    var businessTimer = null;
    $('#items-excel-ai-business').on('input', function () {
      clearTimeout(businessTimer);
      businessTimer = setTimeout(function () {
        loadAiPrompt(false);
      }, 600);
    });

    $('#items-excel-file').on('change', function () {
      var file = this.files && this.files[0];
      pendingImportFile = null;
      $('#items-excel-results').empty();
      $('#items-excel-progress-wrap').hide();
      $('#items-excel-progress-bar').css('width', '0%');
      if (!file) {
        renderPreview([], 0);
        return;
      }
      var ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (ext !== '.xlsx' && ext !== '.zip') {
        toastr.error(lang('Chagua faili la .xlsx au .zip', 'Choose a .xlsx or .zip file'));
        this.value = '';
        return;
      }
      pendingImportFile = file;
      previewFile(file);
    });

    $('#items-excel-import-btn').on('click', submitImport);

    $('#items-excel-modal').on('hidden.bs.modal', function () {
      pendingImportFile = null;
      $('#items-excel-file').val('');
      $('#items-excel-preview-body').empty();
      $('#items-excel-row-count').text('0');
      $('#items-excel-results').empty();
      $('#items-excel-progress-wrap').hide();
      $('#items-excel-progress-bar').css('width', '0%');
    });
  }

  $(function () {
    if ($('#btn-items-excel-template').length || $('#btn-items-excel-ai-help').length) {
      bindEvents();
    }
  });

  window.ItemsExcel = {
    downloadTemplate: downloadTemplate,
    downloadCurrentItems: downloadCurrentItems,
    loadAiPrompt: loadAiPrompt
  };
})(window);
