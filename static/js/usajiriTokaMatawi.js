const obSupplierOptions = () => {
  let opt = `<option value="0">${lang('Si lazima — chagua', 'Optional — select')}</option>`
  ;(window.OB_SUPPLIERS || []).forEach((s) => {
    const name = String(s.jina || '').replace(/[&<>"]/g, '')
    opt += `<option value="${s.id}">${name}</option>`
  })
  return opt
}

const obEsc = (v) => String(v || '').replace(/[&<>"]/g, '')

const obSelectedBranches = () =>
  $('.ob-branch-check:checked')
    .map(function () {
      return Number($(this).val())
    })
    .get()
    .filter(Boolean)

const obPlaceholderRow = (msg) =>
  `<tr><td colspan="7" class="text-center text-muted py-4">${msg}</td></tr>`

const obQtyInputs = (pj, pr, uwiano, jumClass, rejaClass) => {
  let html = `<div class="input-group input-group-sm mb-1">
    <div class="input-group-prepend"><span class="input-group-text">${obEsc(pj || pr)}</span></div>
    <input type="number" min="0" step="any" class="form-control ${jumClass}" placeholder="0" value="0">
  </div>`
  if (Number(uwiano) > 1) {
    html += `<div class="input-group input-group-sm">
      <div class="input-group-prepend"><span class="input-group-text">${obEsc(pr)}</span></div>
      <input type="number" min="0" step="any" class="form-control ${rejaClass}" placeholder="0" value="0">
    </div>`
  }
  return html
}

const obImgCell = (row) => {
  if (row.img) {
    return `<img class="ob-item-img" src="${row.img}" alt="">`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-image text-muted" viewBox="0 0 16 16">
    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
  </svg>`
}

const obColorLabel = (cl) => {
  const code = obEsc(cl.color_code)
  return `<div class="d-flex align-items-center ob-color-block" data-color-id="${cl.id}" data-code="${code}" data-name="${obEsc(cl.color_name)}" data-other="${obEsc(cl.nick_name)}">
    <span class="ob-swatch" style="background:${code}"></span>
    <span class="text-capitalize">${obEsc(cl.color_name) || '—'}</span>
  </div>`
}

const obItemLeaves = (row) => {
  const colors = row.colors || []
  const uwiano = Number(row.uwiano) || 1
  const pj = row.vipimoJum || row.vipimo
  const pr = row.vipimo
  if (!colors.length) {
    return [{
      colorHtml: '---',
      colorSpan: 1,
      showColor: true,
      sizeHtml: '---',
      sizeId: 0,
      sizeName: '',
      qtyHtml: `<div class="ob-qty-wrap">${obQtyInputs(pj, pr, uwiano, 'ob-qty-jum', 'ob-qty-reja')}</div>`,
      colorId: 0,
    }]
  }
  const leaves = []
  colors.forEach((cl) => {
    const sizes = cl.sizes || []
    if (!sizes.length) {
      leaves.push({
        colorHtml: obColorLabel(cl),
        colorSpan: 1,
        showColor: true,
        sizeHtml: '---',
        sizeId: 0,
        sizeName: '',
        qtyHtml: `<div class="ob-qty-wrap">${obQtyInputs(pj, pr, uwiano, 'ob-cl-jum', 'ob-cl-reja')}</div>`,
        colorId: cl.id,
      })
      return
    }
    sizes.forEach((s, i) => {
      leaves.push({
        colorHtml: obColorLabel(cl),
        colorSpan: sizes.length,
        showColor: i === 0,
        sizeHtml: `<span class="text-danger">${obEsc(s.size)}</span>`,
        sizeId: s.id,
        sizeName: s.size,
        qtyHtml: `<div class="ob-qty-wrap">${obQtyInputs(pj, pr, uwiano, 'ob-sz-jum', 'ob-sz-reja')}</div>`,
        colorId: cl.id,
      })
    })
  })
  return leaves
}

const obCollectRangi = ($first) => {
  const id = $first.attr('data-id')
  const $group = $(`#ob-items-body tr[data-id="${id}"]`)
  const rangi = []
  const seen = {}
  $group.each(function () {
    const $tr = $(this)
    const cid = $tr.attr('data-color-id')
    if (!cid || cid === '0') return
    if (!seen[cid]) {
      const $cl = $group.find(`.ob-color-block[data-color-id="${cid}"]`)
      seen[cid] = {
        color_name: $cl.attr('data-name') || '',
        color_code: $cl.attr('data-code') || '',
        other_name: $cl.attr('data-other') || '',
        val: Number(cid) || 0,
        idadi_jum: 0,
        idadi_rej: 0,
        sized: [],
      }
      rangi.push(seen[cid])
    }
    const sizeId = Number($tr.attr('data-size-id')) || 0
    if (sizeId) {
      seen[cid].sized.push({
        size: $tr.attr('data-size') || '',
        val: sizeId,
        idadi_jum: Number($tr.find('.ob-sz-jum').val()) || 0,
        idadi_rej: Number($tr.find('.ob-sz-reja').val()) || 0,
      })
    } else {
      seen[cid].idadi_jum = Number($tr.find('.ob-cl-jum').val()) || 0
      seen[cid].idadi_rej = Number($tr.find('.ob-cl-reja').val()) || 0
    }
  })
  return rangi
}

const obRenderRows = (items) => {
  if (!items || !items.length) {
    $('#ob-items-body').html(
      obPlaceholderRow(lang('Hakuna bidhaa zinazokosa kwenye tawi hili', 'No missing items found for this branch'))
    )
    $('#ob-save-btn').prop('disabled', true)
    return
  }
  const supOpt = obSupplierOptions()
  const showColorCol = items.some((r) => (r.colors || []).length)
  const showSizeCol = items.some((r) => (r.colors || []).some((c) => (c.sizes || []).length))
  window.OB_SHOW_COLOR = showColorCol
  window.OB_SHOW_SIZE = showSizeCol

  let html = ''
  items.forEach((row) => {
    const uwiano = Number(row.uwiano) || 1
    const leaves = obItemLeaves(row)
    const span = leaves.length
    const hasColors = (row.colors || []).length > 0
    leaves.forEach((leaf, i) => {
      const isFirst = i === 0
      html += `<tr class="${isFirst ? 'ob-item-row' : 'ob-item-sub'}" data-id="${row.id}" data-uwiano="${uwiano}" data-has-colors="${hasColors ? 1 : 0}" data-color-id="${leaf.colorId || 0}" data-size-id="${leaf.sizeId || 0}" data-size="${obEsc(leaf.sizeName)}">`
      if (isFirst) {
        html += `<td class="align-middle text-center" rowspan="${span}"><input type="checkbox" class="ob-row-check"></td>
          <td class="align-middle text-center" rowspan="${span}">${obImgCell(row)}</td>
          <td class="align-middle" rowspan="${span}">
            <div class="weight600">${obEsc(row.bidhaaN)}</div>
            <div class="text-muted">${[row.ainaN, row.stName].filter(Boolean).join(' · ')}</div>
            ${row.sirio && row.sirio !== 'none' ? `<div class="text-primary">${obEsc(row.sirio)}</div>` : ''}
          </td>`
      }
      if (leaf.showColor) {
        html += `<td class="align-middle" rowspan="${leaf.colorSpan}">${leaf.colorHtml}</td>`
      }
      html += `<td class="align-middle text-center ob-size-cell">${leaf.sizeHtml}</td>`
      html += `<td class="align-middle">${leaf.qtyHtml}</td>`
      if (isFirst) {
        html += `<td class="align-middle" rowspan="${span}"><select class="form-control form-control-sm ob-supplier">${supOpt}</select></td>`
      }
      html += `</tr>`
    })
  })
  $('#ob-items-body').html(html)
  items.forEach((row) => {
    const $sel = $(`#ob-items-body tr.ob-item-row[data-id="${row.id}"] .ob-supplier`)
    if (row.msambaji_id) $sel.val(String(row.msambaji_id))
  })
  $('#ob-save-btn').prop('disabled', false)
}

const obGetItems = () => {
  const branches = obSelectedBranches()
  if (!branches.length) {
    toastr.warning(
      lang('Chagua tawi angalau moja kwanza', 'Select at least one branch first'),
      '',
      { timeOut: 2200 }
    )
    return
  }
  $('#loadMe').modal('show')
  POSTREQUEST({
    url: window.OB_SEARCH_URL,
    data: { branches: JSON.stringify(branches), q: '' },
  })
    .then((resp) => {
      $('#loadMe').modal('hide')
      hideLoading()
      if (!resp.success) {
        toastr.error(lang(resp.message_swa || 'Imeshindwa', resp.message_eng || 'Failed'), '', { timeOut: 2200 })
        $('#ob-items-body').html(obPlaceholderRow(lang(resp.message_swa || 'Imeshindwa', resp.message_eng || 'Failed')))
        return
      }
      obRenderRows(resp.items || [])
    })
    .fail(() => {
      $('#loadMe').modal('hide')
      hideLoading()
      toastr.error(lang('Hitilafu', 'Error'), '', { timeOut: 2200 })
    })
}

$(document).ready(() => {
  $('#ob-branch-all').on('change', function () {
    $('.ob-branch-check').prop('checked', this.checked)
  })
  $('body').on('change', '.ob-branch-check', function () {
    const all = $('.ob-branch-check').length
    const n = $('.ob-branch-check:checked').length
    $('#ob-branch-all').prop('checked', all > 0 && n === all)
  })
  $('#ob-row-all').on('change', function () {
    $('.ob-row-check').prop('checked', this.checked)
  })
  $('#ob-get-btn').on('click', obGetItems)
  $('#ob-save-btn').on('click', function () {
    const items = []
    $('.ob-item-row').each(function () {
      const $row = $(this)
      if (!$row.find('.ob-row-check').prop('checked')) return
      const id = $row.attr('data-id')
      const $group = $(`#ob-items-body tr[data-id="${id}"]`)
      items.push({
        itm: Number(id),
        idj: Number($group.find('.ob-qty-jum').val()) || 0,
        idr: Number($group.find('.ob-qty-reja').val()) || 0,
        sup: Number($row.find('.ob-supplier').val()) || 0,
        rangi: obCollectRangi($row),
      })
    })
    if (!items.length) {
      toastr.warning(lang('Tia alama bidhaa unazotaka kuongeza', 'Check the items you want to add'), '', { timeOut: 2200 })
      return
    }
    $('#loadMe').modal('show')
    POSTREQUEST({
      url: window.OB_SAVE_URL,
      data: { items: JSON.stringify(items) },
    })
      .then((resp) => {
        $('#loadMe').modal('hide')
        hideLoading()
        if (resp.success) {
          toastr.success(lang(resp.message_swa, resp.message_eng), lang('Imefanikiwa', 'Success'), { timeOut: 2500 })
          obGetItems()
        } else {
          toastr.error(lang(resp.message_swa || 'Imeshindwa', resp.message_eng || 'Failed'), lang('Haukufanikiwa', 'Error'), { timeOut: 2500 })
        }
      })
      .fail(() => {
        $('#loadMe').modal('hide')
        hideLoading()
        toastr.error(lang('Hitilafu', 'Error'), '', { timeOut: 2200 })
      })
  })
})
