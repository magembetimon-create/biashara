/**
 * Classify existing items: Group / Category / Brand only. Does not change stock.
 */
(function (window) {
  'use strict';

  var pendingFile = null;

  function csrf() {
    return $('input[name=csrfmiddlewaretoken]').val();
  }

  function downloadExisting() {
    window.location.href = '/stoku/itemsClassifyExport';
  }

  function escapeHtml(s) {
    return String(s || '—').replace(/</g, '&lt;');
  }

  function renderPreview(preview, total) {
    var $body = $('#items-classify-preview-body');
    $body.empty();
    if (!preview || !preview.length) {
      $body.html('<tr><td colspan="6" class="text-muted">' +
        lang('Hakuna mistari sahihi', 'No valid rows found') + '</td></tr>');
      $('#items-classify-row-count').text('0');
      return;
    }
    preview.forEach(function (r) {
      $body.append(
        '<tr><td>' + r.row + '</td>' +
        '<td>' + escapeHtml(r.bidhaa_id) + '</td>' +
        '<td class="text-capitalize">' + escapeHtml(r.jina_la_bidhaa) + '</td>' +
        '<td>' + escapeHtml(r.kundi) + '</td>' +
        '<td>' + escapeHtml(r.aina) + '</td>' +
        '<td>' + escapeHtml(r.chapa) + '</td></tr>'
      );
    });
    if (total > preview.length) {
      $body.append('<tr><td colspan="6" class="text-muted smallFont">' +
        lang('Na bidhaa ', 'And ') + (total - preview.length) +
        lang(' zingine...', ' more...') + '</td></tr>');
    }
    $('#items-classify-row-count').text(total);
  }

  function previewFile(file) {
    var form = new FormData();
    form.append('file', file);
    form.append('preview', '1');
    form.append('csrfmiddlewaretoken', csrf());
    fetch('/stoku/itemsClassifyImportFile?preview=1', {
      method: 'POST',
      headers: { 'X-CSRFToken': csrf() },
      body: form
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.success) {
          toastr.error(lang(data.message_swa, data.message_eng), lang('Hitilafu', 'Error'));
          pendingFile = null;
          renderPreview([], 0);
          return;
        }
        renderPreview(data.preview || [], data.count || 0);
        toastr.info((data.count || 0) + ' ' + lang('bidhaa', 'items'), lang('Taarifa', 'Notice'), { timeOut: 2500 });
      })
      .catch(function () {
        pendingFile = null;
        toastr.error(lang('Faili halisomeki', 'Could not read file'));
      });
  }

  function appendResults(results) {
    var $results = $('#items-classify-results');
    if (!results || !results.length) return;
    results.forEach(function (r) {
      if (r.skipped) return;
      var msg = lang(r.message_swa, r.message_eng);
      $results.append(
        '<div class="smallFont ' + (r.success ? 'text-success' : 'text-danger') + '">' +
        lang('Mstari', 'Row') + ' ' + r.row + ': ' + msg + '</div>'
      );
    });
  }

  function setProgress(processed, total, updated, failed) {
    var $wrap = $('#items-classify-progress-wrap');
    $wrap.show();
    var pct = total ? Math.min(100, Math.round((processed / total) * 100)) : 0;
    $('#items-classify-progress-bar').css('width', pct + '%');
    $('#items-classify-progress-label').text(
      lang('Inasasisha kategoria...', 'Updating classification...')
    );
    $('#items-classify-progress-count').text(
      processed + ' / ' + total +
      ' (' + lang('imesasishwa', 'updated') + ' ' + updated +
      ', ' + lang('hazikufanikiwa', 'failed') + ' ' + failed + ')'
    );
  }

  function finish(updated, failed) {
    $('#loadMe').modal('hide');
    $('#items-classify-import-btn').prop('disabled', false);
    var msgSwa = 'Imesasishwa ' + updated + ' bidhaa, ' + failed + ' hazikufanikiwa';
    var msgEng = 'Updated ' + updated + ' items, ' + failed + ' failed';
    if (updated > 0) {
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
    if (!pendingFile) {
      toastr.warning(lang('Chagua faili la Excel kwanza', 'Choose an Excel file first'));
      return;
    }
    var $btn = $('#items-classify-import-btn');
    $btn.prop('disabled', true);
    $('#items-classify-results').empty();
    setProgress(0, Number($('#items-classify-row-count').text()) || 0, 0, 0);
    $('#loadMe').modal('show');

    var updatedTotal = 0;
    var failedTotal = 0;

    function postBatch(offset) {
      var form = new FormData();
      form.append('file', pendingFile);
      form.append('offset', String(offset));
      form.append('limit', '80');
      form.append('csrfmiddlewaretoken', csrf());
      return fetch('/stoku/itemsClassifyImportFile', {
        method: 'POST',
        headers: { 'X-CSRFToken': csrf() },
        body: form
      }).then(function (r) {
        if (!r.ok) throw new Error('import-http');
        return r.json();
      }).then(function (data) {
        if (typeof data.total !== 'number') {
          throw new Error(data.message_eng || 'import');
        }
        updatedTotal += Number(data.updated || 0);
        failedTotal += Number(data.failed || 0);
        appendResults(data.results || []);
        setProgress(Number(data.processed || offset), Number(data.total || 0), updatedTotal, failedTotal);
        if (data.done) {
          finish(updatedTotal, failedTotal);
          return;
        }
        return postBatch(Number(data.processed || offset));
      });
    }

    postBatch(0).catch(function () {
      $('#loadMe').modal('hide');
      $btn.prop('disabled', false);
      toastr.error(
        lang(
          'Imesimama. Bidhaa ' + updatedTotal + ' zimeshasasishwa — jaribu tena kwa zilizobaki.',
          'Stopped. ' + updatedTotal + ' items were updated — try again for the rest.'
        ),
        lang('Hitilafu', 'Error')
      );
    });
  }

  function loadAiPrompt(showToast) {
    var business = ($('#items-classify-ai-business').val() || '').trim();
    var $prompt = $('#items-classify-ai-prompt');
    var $refresh = $('#items-classify-ai-refresh');
    $refresh.prop('disabled', true);
    $prompt.val(lang('Inatengeneza prompt...', 'Building prompt...'));
    var form = new FormData();
    form.append('business', business);
    form.append('csrfmiddlewaretoken', csrf());
    return fetch('/stoku/itemsClassifyAiPrompt', {
      method: 'POST',
      headers: { 'X-CSRFToken': csrf() },
      body: form
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        $refresh.prop('disabled', false);
        if (!data.success || !data.prompt) {
          $prompt.val('');
          toastr.error(lang(data.message_swa || 'Imeshindikana', data.message_eng || 'Failed'), lang('Hitilafu', 'Error'));
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

  function copyPrompt() {
    var text = ($('#items-classify-ai-prompt').val() || '').trim();
    function doCopy(val) {
      if (!val) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(function () {
          toastr.success(lang('Prompt imenakiliwa', 'Prompt copied'), lang('Imefanikiwa', 'Success'));
        });
        return;
      }
      var $ta = $('#items-classify-ai-prompt');
      $ta.prop('readonly', false).trigger('focus').trigger('select');
      try { document.execCommand('copy'); } catch (e) {}
      $ta.prop('readonly', true);
      toastr.success(lang('Prompt imenakiliwa', 'Prompt copied'), lang('Imefanikiwa', 'Success'));
    }
    if (!text || text === lang('Inatengeneza prompt...', 'Building prompt...')) {
      loadAiPrompt(false).then(doCopy);
      return;
    }
    doCopy(text);
  }

  function bindEvents() {
    $('#items-classify-modal').appendTo('body');
    $('#btn-items-classify-download').on('click', downloadExisting);

    $('#items-classify-modal').on('shown.bs.modal', function () {
      if (!($('#items-classify-ai-prompt').val() || '').trim()) {
        loadAiPrompt(false);
      }
    });
    $('#items-classify-ai-refresh').on('click', function () { loadAiPrompt(true); });
    $('#items-classify-ai-copy').on('click', copyPrompt);

    var businessTimer = null;
    $('#items-classify-ai-business').on('input', function () {
      clearTimeout(businessTimer);
      businessTimer = setTimeout(function () { loadAiPrompt(false); }, 600);
    });

    $('#items-classify-file').on('change', function () {
      var file = this.files && this.files[0];
      pendingFile = null;
      $('#items-classify-results').empty();
      $('#items-classify-progress-wrap').hide();
      $('#items-classify-progress-bar').css('width', '0%');
      if (!file) {
        renderPreview([], 0);
        return;
      }
      var ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (ext !== '.xlsx') {
        toastr.error(lang('Chagua faili la .xlsx', 'Choose a .xlsx file'));
        this.value = '';
        return;
      }
      pendingFile = file;
      previewFile(file);
    });

    $('#items-classify-import-btn').on('click', submitImport);

    $('#items-classify-modal').on('hidden.bs.modal', function () {
      pendingFile = null;
      $('#items-classify-file').val('');
      $('#items-classify-preview-body').empty();
      $('#items-classify-row-count').text('0');
      $('#items-classify-results').empty();
      $('#items-classify-progress-wrap').hide();
    });
  }

  $(function () {
    if ($('#items-classify-modal').length) {
      bindEvents();
    }
  });
})(window);
