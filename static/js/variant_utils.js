/**
 * Shared helpers for product variants (color, model, size, etc.)
 * Uses bidhaa.colorAttr as the display label ("Rangi", "Model", ...).
 */
(function (window) {
  'use strict';

  const COLOR_ATTR_WORDS = new Set(['', 'rangi', 'color', 'colour', 'colors', 'colours']);

  const _attrByStoku = {};
  const _attrByProd = {};

  function _lang(swa, eng) {
    return typeof window.lang === 'function' ? window.lang(swa, eng) : eng;
  }

  function variantLabel(colorAttr) {
    const trimmed = colorAttr != null ? String(colorAttr).trim() : '';
    if (trimmed) return trimmed;
    return _lang('Rangi', 'Color');
  }

  function isColorMode(colorAttr) {
    const trimmed = colorAttr != null ? String(colorAttr).trim().toLowerCase() : '';
    return COLOR_ATTR_WORDS.has(trimmed);
  }

  function registerFromProducts(products) {
    if (!Array.isArray(products)) return;
    products.forEach(function (p) {
      const attr = p.colorAttr;
      if (attr == null || String(attr).trim() === '') return;
      if (p.id != null) _attrByStoku[Number(p.id)] = attr;
      const prodId = p.bidhaa != null ? p.bidhaa : p.bidhaa_id;
      if (prodId != null) _attrByProd[Number(prodId)] = attr;
    });
  }

  function registerFromColorRows(rows) {
    if (!Array.isArray(rows)) return;
    rows.forEach(function (r) {
      const attr = r.bidhaa__bidhaa__colorAttr != null
        ? r.bidhaa__bidhaa__colorAttr
        : r.bidhaa__colorAttr;
      if (attr == null || String(attr).trim() === '') return;
      if (r.bidhaa != null) _attrByStoku[Number(r.bidhaa)] = attr;
      if (r.prod != null) _attrByProd[Number(r.prod)] = attr;
    });
  }

  function getVariantAttr(stokuId, prodId) {
    if (stokuId != null && _attrByStoku[Number(stokuId)]) {
      return _attrByStoku[Number(stokuId)];
    }
    if (prodId != null && _attrByProd[Number(prodId)]) {
      return _attrByProd[Number(prodId)];
    }
    return null;
  }

  function resolveVariantAttr(stokuId, coloredRows) {
    const fromMap = getVariantAttr(stokuId, null);
    if (fromMap) return fromMap;
    if (!Array.isArray(coloredRows)) return null;
    for (let i = 0; i < coloredRows.length; i++) {
      const row = coloredRows[i];
      if (Number(row.bidhaa) !== Number(stokuId)) continue;
      const attr = row.bidhaa__bidhaa__colorAttr != null
        ? row.bidhaa__bidhaa__colorAttr
        : row.bidhaa__colorAttr;
      if (attr != null && String(attr).trim() !== '') return attr;
    }
    return null;
  }

  function applyVariantModalLabels(itemName, stokuId, prodId) {
    const $modal = $('#modal_color');
    if (!$modal.length) return null;

    const attr = getVariantAttr(stokuId, prodId) || resolveVariantAttr(stokuId, []);
    const label = variantLabel(attr);
    const colorMode = isColorMode(attr);
    const name = itemName || '';

    const $title = $modal.find('.modal-title');
    const icon = $title.find('img').prop('outerHTML') || '';
    const nameSpan = '<span style="color:rgb(108, 39, 236)" id="item_jina">' + name + '</span>';
    let titleText;
    if (colorMode) {
      titleText = icon + ' ' + _lang('Rangi/Vielelezo kwa ', 'Variants for ') + nameSpan;
    } else {
      titleText = icon + ' ' + label + ' ' + _lang('kwa ', 'for ') + nameSpan;
    }
    $title.html(titleText);

    const filterLabel = _lang('Tafuta ', 'Filter ') + label;
    $modal.find('[data-variant-filter-label]').text(filterLabel + ':');
    $modal.find('#filter_itm_color').attr('placeholder', filterLabel);

    $modal.data('variantAttr', attr);
    $modal.data('variantColorMode', colorMode);

    return attr;
  }

  function updateColoredButtonTitle(pos, stokuId, prodId, coloredRows) {
    const attr = resolveVariantAttr(stokuId, coloredRows) || getVariantAttr(stokuId, prodId);
    const label = variantLabel(attr);
    $('#colored_items' + pos).attr('title', label);
  }

  function _safeStr(val) {
    return String(val || '').replace(/[&\/\\#,+()$~%"*?<>{}`]/g, '');
  }

  function variantPopupHeader(colorCode, colorName, colorAttr, dataAttrs, capitalize) {
    const name = _safeStr(colorName);
    if (isColorMode(colorAttr)) {
      const code = _safeStr(colorCode || '#cccccc');
      const capClass = capitalize ? ' text-capitalize' : '';
      return (
        '<button type="button" class="mr-2 rangi-editing" ' + (dataAttrs || '') +
        ' style="height:25px;width:40px;color:' + code + ';background:' + code +
        ';cursor:pointer;border-radius:3px;-webkit-box-shadow:0px 3px 10px -3px rgba(0,0,0,0.37);' +
        'box-shadow:0px 3px 10px -3px rgba(0,0,0,0.37);border:0;">color</button>' +
        '<span class="smallerFont' + capClass + '">' + name + '</span>'
      );
    }
    return '<span class="badge badge-light border mr-2 px-2 py-1 smallerFont font-weight-bold text-capitalize">' + name + '</span>';
  }

  function variantPosLabel(colorName, colorNick, colorAttr) {
    const name = colorName || '';
    const nick = colorNick ? ' (' + colorNick + ')' : '';
    if (isColorMode(colorAttr)) {
      return name + nick;
    }
    const label = variantLabel(colorAttr);
    return name ? (label + ': ' + name + nick) : '';
  }

  function isRegistrationNonColorMode() {
    return $('#variant_non_color').prop('checked') === true;
  }

  function updateRegistrationModalUI() {
    const $modal = $('#modal_color4');
    if (!$modal.length) return;

    const nonColor = isRegistrationNonColorMode();
    const attr = ($('#attr_name').val() || '').trim();
    const label = attr || _lang('Kielelezo', 'Variant');

    const title = nonColor
      ? _lang('Weka Kielelezo (si rangi)', 'Set text variant (not color)')
      : _lang('Weka Rangi / Kielelezo', 'Set Color / Variant');
    $modal.find('.modal-title').html(
      '<img width="30" src="' + ($modal.find('.modal-title img').attr('src') || '') + '" /> ' + title
    );

    $('#variant_non_color_panel').toggle(nonColor);
    $('#variant_color_add_section').toggle(!nonColor);

    $('[data-variant-inline-name-label]').text(
      label + ' ' + _lang('No.', 'No.')
    );
    $('#variant_text_name').attr('placeholder', nonColor ? 'AC-2015' : '');
    $('#variant_text_add_btn').text(_lang('Ongeza ', 'Add ') + label);

    if (!nonColor) {
      $('#attr_name').attr('placeholder', _lang('Rangi', 'Color'));
      $modal.find('[data-variant-add-label]').text(_lang('Weka Rangi', 'Set Color'));
      $modal.find('[data-variant-name-label]').text(_lang('Jina', 'Name'));
      $('#jina-la_rangiI').attr('placeholder', _lang('Nyeupe', 'White'));
      $('#submit-bill-colorI').text(_lang('Ongeza Rangi', 'Add Color'));
    }
  }

  function variantPickerTileHtml(opts) {
    const tileId = opts.tileId || ('Color' + opts.id)
    const popupSelector = opts.popupSelector || ('#ona_rang' + opts.id)
    const name = _safeStr(opts.colorName)
    const checkId = opts.checkId || ('success' + opts.id)
    const selected = Number(opts.selected || 0)
    const checkDisplay = selected > 0 ? '' : 'display:none;'
    const checkHtml = `<div class="position-absolute successmark" id="${checkId}" style="margin-left:21px;margin-top:-18px;height:19px;width:17px;border-radius:50%;color:#fff;background:rgba(2,167,2,0.842);border:1px solid #fff;${checkDisplay}"><span style="top:-1px;left:-1px;position:absolute;"><svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/></svg></span></div>`
    const errorHtml = opts.withError ? `<div class="position-absolute text-danger errormark" id="error${opts.id}" style="margin-left:21px;margin-top:-18px;height:19px;width:17px;border-radius:50%;background:#fff;border:1px solid #fff;display:none;"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg></span></div>` : ''
    const extraData = opts.extraData || ''

    if (isColorMode(opts.colorAttr)) {
      const code = _safeStr(opts.colorCode || '#cccccc')
      return `<div id="${tileId}" class="showingpop241 the_identify ${opts.extraClass || ''}" data-showing="${popupSelector}" ${extraData} style="height:25px;width:40px;color:${code};background:${code};cursor:pointer;border-radius:3px;-webkit-box-shadow:0px 3px 10px -3px rgba(0,0,0,0.37);box-shadow:0px 3px 10px -3px rgba(0,0,0,0.37);position:relative;">${checkHtml}${errorHtml}</div>`
    }

    return `<div id="${tileId}" class="showingpop241 the_identify variant-text-tile btn btn-light border text-danger text-capitalize ${opts.extraClass || ''}" data-showing="${popupSelector}" ${extraData} style="min-height:28px;min-width:52px;padding:2px 10px;cursor:pointer;display:inline-block;position:relative;border-radius:4px;-webkit-box-shadow:0px 3px 10px -3px rgba(0,0,0,0.37);box-shadow:0px 3px 10px -3px rgba(0,0,0,0.37);"><span class="smallerFont font-weight-bold">${name}</span>${checkHtml}${errorHtml}</div>`
  }

  window.VariantUtils = {
    variantLabel: variantLabel,
    isColorMode: isColorMode,
    registerFromProducts: registerFromProducts,
    registerFromColorRows: registerFromColorRows,
    getVariantAttr: getVariantAttr,
    resolveVariantAttr: resolveVariantAttr,
    applyVariantModalLabels: applyVariantModalLabels,
    updateColoredButtonTitle: updateColoredButtonTitle,
    variantPopupHeader: variantPopupHeader,
    variantPosLabel: variantPosLabel,
    variantPickerTileHtml: variantPickerTileHtml,
    updateRegistrationModalUI: updateRegistrationModalUI,
    isRegistrationNonColorMode: isRegistrationNonColorMode,
  };
})(window);
