const obSupplierOptions = () => {
  let opt = `<option value="0">${lang('Si lazima — chagua', 'Optional — select')}</option>`
  ;(window.OB_SUPPLIERS || []).forEach((s) => {
    const name = String(s.jina || '').replace(/[&<>"]/g, '')
    opt += `<option value="${s.id}">${name}</option>`
  })
  return opt
}

const obEsc = (v) => String(v || '').replace(/[&<>"]/g, '')
const OB_PAGE_SIZE = 50
let OB_ALL_ITEMS = []
let OB_PAGE = 1

const obItemState = (row) => {
  if (!row._ob) {
    row._ob = {
      checked: false,
      sup: Number(row.msambaji_id) || 0,
      idj: 0,
      idr: 0,
      rangi: [],
    }
  }
  return row._ob
}

const obFindItem = (id) => OB_ALL_ITEMS.find((r) => String(r.id) === String(id))

const obHighlightItem = (id, on) => {
  $(`#ob-items-body tr[data-id="${id}"]`).toggleClass('ob-row-selected', !!on)
}

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

const obFlushVisibleItems = () => {
  $('#ob-items-body tr.ob-item-row').each(function () {
    const $row = $(this)
    const id = $row.attr('data-id')
    const item = obFindItem(id)
    if (!item) return
    const st = obItemState(item)
    const $group = $(`#ob-items-body tr[data-id="${id}"]`)
    st.checked = !!$row.find('.ob-row-check').prop('checked')
    st.sup = Number($row.find('.ob-supplier').val()) || 0
    st.idj = Number($group.find('.ob-qty-jum').val()) || 0
    st.idr = Number($group.find('.ob-qty-reja').val()) || 0
    st.rangi = obCollectRangi($row)
  })
}

const obApplyState = (row) => {
  const st = obItemState(row)
  const $row = $(`#ob-items-body tr.ob-item-row[data-id="${row.id}"]`)
  if (!$row.length) return
  $row.find('.ob-row-check').prop('checked', !!st.checked)
  if (st.sup) $row.find('.ob-supplier').val(String(st.sup))
  const $group = $(`#ob-items-body tr[data-id="${row.id}"]`)
  $group.find('.ob-qty-jum').val(st.idj || 0)
  $group.find('.ob-qty-reja').val(st.idr || 0)
  ;(st.rangi || []).forEach((cl) => {
    if (cl.sized && cl.sized.length) {
      cl.sized.forEach((sz) => {
        const $tr = $group.filter(`[data-color-id="${cl.val}"][data-size-id="${sz.val}"]`)
        $tr.find('.ob-sz-jum').val(sz.idadi_jum || 0)
        $tr.find('.ob-sz-reja').val(sz.idadi_rej || 0)
      })
    } else {
      const $tr = $group.filter(`[data-color-id="${cl.val}"]`)
      $tr.find('.ob-cl-jum').val(cl.idadi_jum || 0)
      $tr.find('.ob-cl-reja').val(cl.idadi_rej || 0)
    }
  })
  obHighlightItem(row.id, st.checked)
}

const obSyncHeaderCheck = () => {
  const $checks = $('#ob-items-body .ob-row-check')
  const n = $checks.length
  const c = $checks.filter(':checked').length
  $('#ob-row-all').prop('checked', n > 0 && n === c)
}

const obRenderPager = (total, pages) => {
  const $pager = $('#ob-pager')
  if (!total) {
    $pager.empty()
    return
  }
  const start = (OB_PAGE - 1) * OB_PAGE_SIZE + 1
  const end = Math.min(OB_PAGE * OB_PAGE_SIZE, total)
  let nums = ''
  let from = Math.max(1, OB_PAGE - 2)
  let to = Math.min(pages, from + 4)
  from = Math.max(1, to - 4)
  for (let p = from; p <= to; p++) {
    nums += `<button type="button" class="btn btn-sm ${p === OB_PAGE ? 'btn-primary' : 'btn-outline-secondary'} ob-page-btn mx-1" data-page="${p}">${p}</button>`
  }
  $pager.html(`
    <div class="smallFont text-muted mb-2 mb-md-0">
      ${lang('Inaonesha', 'Showing')} ${start}–${end} ${lang('kati ya', 'of')} ${total}
    </div>
    <div class="d-flex align-items-center flex-wrap">
      <button type="button" class="btn btn-sm btn-outline-secondary ob-page-btn" data-page="${OB_PAGE - 1}" ${OB_PAGE <= 1 ? 'disabled' : ''}>‹</button>
      ${nums}
      <button type="button" class="btn btn-sm btn-outline-secondary ob-page-btn" data-page="${OB_PAGE + 1}" ${OB_PAGE >= pages ? 'disabled' : ''}>›</button>
    </div>
  `)
}

const obRenderRows = (items) => {
  if (!items || !items.length) {
    $('#ob-items-body').html(
      obPlaceholderRow(lang('Hakuna bidhaa zinazokosa kwenye tawi hili', 'No missing items found for this branch'))
    )
    $('#ob-save-btn').prop('disabled', !OB_ALL_ITEMS.some((r) => obItemState(r).checked))
    return
  }
  const supOpt = obSupplierOptions()
  window.OB_SHOW_COLOR = items.some((r) => (r.colors || []).length)
  window.OB_SHOW_SIZE = items.some((r) => (r.colors || []).some((c) => (c.sizes || []).length))

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
    obApplyState(row)
  })
  $('#ob-save-btn').prop('disabled', false)
  obSyncHeaderCheck()
}

const obShowPage = (page) => {
  obFlushVisibleItems()
  const total = OB_ALL_ITEMS.length
  const pages = Math.max(1, Math.ceil(total / OB_PAGE_SIZE) || 1)
  OB_PAGE = Math.min(Math.max(1, Number(page) || 1), pages)
  if (!total) {
    $('#ob-items-body').html(
      obPlaceholderRow(lang('Hakuna bidhaa zinazokosa kwenye tawi hili', 'No missing items found for this branch'))
    )
    $('#ob-save-btn').prop('disabled', true)
    obRenderPager(0, 1)
    return
  }
  const start = (OB_PAGE - 1) * OB_PAGE_SIZE
  obRenderRows(OB_ALL_ITEMS.slice(start, start + OB_PAGE_SIZE))
  obRenderPager(total, pages)
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
        OB_ALL_ITEMS = []
        $('#ob-items-body').html(obPlaceholderRow(lang(resp.message_swa || 'Imeshindwa', resp.message_eng || 'Failed')))
        obRenderPager(0, 1)
        return
      }
      OB_ALL_ITEMS = resp.items || []
      OB_PAGE = 1
      obShowPage(1)
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
    const on = this.checked
    $('#ob-items-body .ob-row-check').each(function () {
      $(this).prop('checked', on)
      const id = $(this).closest('tr').attr('data-id')
      const item = obFindItem(id)
      if (item) obItemState(item).checked = on
      obHighlightItem(id, on)
    })
  })
  $('body').on('change', '.ob-row-check', function () {
    const $tr = $(this).closest('tr')
    const id = $tr.attr('data-id')
    const on = this.checked
    const item = obFindItem(id)
    if (item) obItemState(item).checked = on
    obHighlightItem(id, on)
    obSyncHeaderCheck()
  })
  $('body').on('click', '.ob-page-btn', function () {
    if ($(this).prop('disabled')) return
    obShowPage($(this).data('page'))
  })
  $('#ob-get-btn').on('click', obGetItems)
  $('#ob-save-btn').on('click', function () {
    obFlushVisibleItems()
    const items = []
    OB_ALL_ITEMS.forEach((row) => {
      const st = obItemState(row)
      if (!st.checked) return
      items.push({
        itm: Number(row.id),
        idj: Number(st.idj) || 0,
        idr: Number(st.idr) || 0,
        sup: Number(st.sup) || 0,
        rangi: st.rangi || [],
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
