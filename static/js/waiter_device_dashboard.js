var __tbStatic = window.__tbStatic || (function () {
  var fallback = '/static/';
  var src = '';
  if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
    src = String(document.currentScript.src);
  }
  var idx = src.indexOf('/js/');
  var base = idx > -1 ? src.substring(0, idx + 1) : fallback;
  return function (path) {
    return base + String(path || '').replace(/^\/+/, '');
  };
})();
window.__tbStatic = __tbStatic;
let WAITER_ITEMS = []
let WAITER_CART = []
let WAITER_ITEM_IMG = []
let WAITER_ITEM_CATEG = 0
let WAITER_CATEG_ORIENT = 'horizontal'
const WAITER_UNCATEGORIZED_CATEG = -1
let WAITER_COUNTER_MODE = 'all'
let WAITER_COUNTER_NAME = ''
let WAITER_TABLE_AREAS = []
let WAITER_SELECTED_AREA_ID = 0
let WAITER_TAB = 'pending'
let WAITER_PAYMENT_FILTER = 'all'
let WAITER_SELECTED_ORDER = 0
let WAITER_ACTIVE_PENDING_ORDER = 0
let WAITER_PRINT_PENDING_ORDER = 0
let WAITER_ENABLE_PRINT = false
let WAITER_RIGHT_PANEL = 'items'
let WAITER_ORDERS = {
  pending: [],
  printed: [],
  items: {}
}
const WAITER_INITIAL_RENDER_LIMIT = 20
const WAITER_RENDER_CHUNK = 45
const WAITER_SEARCH_DEBOUNCE_MS = 120
const WAITER_SCROLL_LOAD_PX = 140
let WAITER_RENDER_TICKET = 0
let WAITER_SEARCH_TIMER = null
let WAITER_ITEMS_SCROLL_STATE = {
  list: [],
  idx: 0,
  ticket: 0,
  loading: false,
  bound: false
}

const WAITER_DEVICE_ID = String($('#DEVICE_ID').val() || '').trim()
const WAITER_DEVICE_BIZ = Number($('#DEVICE_BIZ_ID').val() || 0)
const WAITER_ACTIVE_WAITER_ID = String($('#ACTIVE_WAITER_ID').val() || '').trim()

function waiterDeviceRequest(payload) {
  const reqData = Object.assign({}, payload || {})
  if (WAITER_DEVICE_ID) reqData.device_id = WAITER_DEVICE_ID
  if (WAITER_DEVICE_BIZ) reqData.biz = WAITER_DEVICE_BIZ
  return reqData
}

function waiterIsMobileLayout() {
  return window.matchMedia('(max-width: 767px)').matches
}

function waiterCartItemsCount() {
  return WAITER_CART.reduce((sum, x) => sum + Number(x.qty || 0), 0)
}

function waiterSentOrdersCount() {
  return Number((WAITER_ORDERS.pending || []).length) + Number((WAITER_ORDERS.printed || []).length)
}

function waiterOrderFilterCounts() {
  const pending = Array.isArray(WAITER_ORDERS.pending) ? WAITER_ORDERS.pending : []
  const printed = Array.isArray(WAITER_ORDERS.printed) ? WAITER_ORDERS.printed : []
  const tabList = WAITER_TAB === 'pending' ? pending : printed
  const paid = tabList.filter(x => Boolean(x.is_paid)).length
  const unpaid = tabList.filter(x => !Boolean(x.is_paid)).length

  return {
    pending: pending.length,
    printed: printed.length,
    all: tabList.length,
    paid,
    unpaid,
  }
}

function renderWaiterFilterCounts() {
  const counts = waiterOrderFilterCounts()
  $('#waiterPendingCount').text(counts.pending)
  $('#waiterPrintedCount').text(counts.printed)
  $('#waiterAllCount').text(counts.all)
  $('#waiterPaidCount').text(counts.paid)
  $('#waiterUnpaidCount').text(counts.unpaid)
}

function waiterOrdersAmountSummary() {
  const pending = Array.isArray(WAITER_ORDERS.pending) ? WAITER_ORDERS.pending : []
  const printed = Array.isArray(WAITER_ORDERS.printed) ? WAITER_ORDERS.printed : []
  const allOrders = pending.concat(printed)

  const printedTotal = allOrders.reduce((sum, od) => {
    if (Number(od.printed_number || 0) <= 0) return sum
    return sum + Number(od.amount || 0)
  }, 0)

  const paidTotal = allOrders.reduce((sum, od) => sum + Number(od.paid_amount || 0), 0)
  const debtTotal = Math.max(0, printedTotal - paidTotal)

  return {
    printedTotal,
    paidTotal,
    debtTotal,
  }
}

function renderWaiterOrdersAmountSummary() {
  const summary = waiterOrdersAmountSummary()
  $('#waiterSummaryPrintedAmount').text(Number(summary.printedTotal || 0).toLocaleString())
  $('#waiterSummaryPaidAmount').text(Number(summary.paidTotal || 0).toLocaleString())
  $('#waiterSummaryDebtAmount').text(Number(summary.debtTotal || 0).toLocaleString())
}

function updateWaiterMobileNavCounts() {
  const totalOrders = waiterSentOrdersCount()
  $('#waiterMobileCartCount').text(waiterCartItemsCount())
  $('#waiterMobileOrdersCount').text(totalOrders)
  $('#waiterMyOrdersCount').text(totalOrders)
}

function renderWaiterRightPanel() {
  const mobile = waiterIsMobileLayout()
  let panel = WAITER_RIGHT_PANEL
  if (!mobile && panel === 'items') panel = 'current'

  const showItems = panel === 'items'
  const showOrders = panel === 'orders'
  const showCurrent = panel === 'current'

  if (mobile) {
    $('#waiterTopSection').toggle(showItems)
    $('.waiter-search-row').toggle(showItems)
    $('#waiterItemsColumn').toggle(showItems)
    $('#waiterSideColumn').toggle(!showItems)
    if (!showItems) closeWaiterCategPopup()
  } else {
    $('#waiterTopSection').show()
    $('.waiter-search-row').show()
    $('#waiterCategoriesSection').show().removeClass('waiter-categ-popup-open')
    $('#waiterItemsColumn').show()
    $('#waiterSideColumn').show()
  }

  $('#waiterCurrentOrderPanel').toggle(showCurrent)
  $('#waiterMyOrdersPanel').toggle(showOrders)

  $('.waiter-panel-tab').removeClass('btn-primary').addClass('btn-light')
  $(`.waiter-panel-tab[data-panel="${showOrders ? 'orders' : 'current'}"]`).removeClass('btn-light').addClass('btn-primary')

  $('.waiter-mobile-nav-btn').removeClass('active')
  $(`.waiter-mobile-nav-btn[data-mobile-panel="${panel}"]`).addClass('active')
}

function switchWaiterRightPanel(panel) {
  if (panel === 'items' || panel === 'orders') {
    WAITER_RIGHT_PANEL = panel
  } else {
    WAITER_RIGHT_PANEL = 'current'
  }
  renderWaiterRightPanel()
}

function waiterLang(sw, en) {
  return lang(sw, en)
}

function waiterSelectedAccount(selectId) {
  const selected = $(selectId).find('option:selected')
  return {
    id: Number(selected.val() || selected.data('value') || 0),
    aina: String(selected.data('aina') || '').trim().toLowerCase()
  }
}

function renderWaiterPaymentCards(selectId, cardsId, radioName) {
  const cardsWrap = $(cardsId)
  const selectEl = $(selectId)
  if (!cardsWrap.length || !selectEl.length) return

  const selectedId = Number(selectEl.val() || selectEl.find('option:selected').data('value') || 0)
  let html = ''

  selectEl.find('option').each(function() {
    const accountId = Number($(this).val() || $(this).data('value') || 0)
    if (!accountId) return

    const aina = String($(this).data('aina') || '').trim()
    const checked = accountId === selectedId ? 'checked' : ''
    const active = accountId === selectedId ? 'active' : ''

    html += `
      <label class="pay-account-card ${active}">
        <input type="radio" name="${radioName}" data-target="${selectId}" data-value="${accountId}" data-aina="${aina.toLowerCase()}" ${checked}>
        <div class="pay-account-type">${aina || waiterLang('Akaunti', 'Account')}</div>
      </label>
    `
  })

  cardsWrap.html(html)
}

function waiterAmount() {
  return WAITER_CART.reduce((sum, x) => sum + (Number(x.qty) * Number(x.price)), 0)
}

function waiterSearchValue() {
  return String($('#waiterSearchInput').val() || '').trim()
}

function buildWaiterSearchIndex() {
  WAITER_ITEMS.forEach(it => {
    it.__search = String(`${it.bidhaaN || ''} ${it.namba || ''} ${it.sirio || ''} ${it.ainaN || ''} ${it.brand || ''}`).toLowerCase()
  })
}

function waiterFindByBarcode(code) {
  const raw = String(code || '').trim()
  if (!raw) return []
  return WAITER_ITEMS.filter(it => String(it.sirio || '').trim() === raw)
}

function waiterSessionItemImage(itm) {
  if (!itm) return __tbStatic('pics/img.svg')
  const map = typeof waiterImageMap === 'function' ? waiterImageMap() : {}
  return map[Number(itm.bidhaa_id || 0)] || __tbStatic('pics/img.svg')
}

function waiterAddScannedToSession(itm, code) {
  if (!itm || !window.TbBarcode || typeof TbBarcode.addSessionItem !== 'function') return
  TbBarcode.markFound(code)
  TbBarcode.addSessionItem({
    key: String(itm.id),
    name: itm.bidhaaN || '',
    image: waiterSessionItemImage(itm),
    code: String(code || itm.sirio || ''),
  })
}

function waiterHandleBarcodeScan(code) {
  const inSession = window.TbBarcode && typeof TbBarcode.isSessionOpen === 'function' && TbBarcode.isSessionOpen()
  const matches = waiterFindByBarcode(code)
  if (matches.length === 1) {
    const beforeLen = WAITER_CART.length
    const beforeQty = Number((WAITER_CART.find(x => Number(x.id) === Number(matches[0].id)) || {}).qty || 0)
    addWaiterItemToCart(Number(matches[0].id))
    const afterQty = Number((WAITER_CART.find(x => Number(x.id) === Number(matches[0].id)) || {}).qty || 0)
    if (inSession && (afterQty > beforeQty || WAITER_CART.length > beforeLen)) {
      waiterAddScannedToSession(matches[0], code)
    }
    return
  }
  if (matches.length > 1) {
    if (inSession) {
      const itm = matches[0]
      const beforeQty = Number((WAITER_CART.find(x => Number(x.id) === Number(itm.id)) || {}).qty || 0)
      addWaiterItemToCart(Number(itm.id))
      const afterQty = Number((WAITER_CART.find(x => Number(x.id) === Number(itm.id)) || {}).qty || 0)
      if (afterQty > beforeQty) waiterAddScannedToSession(itm, code)
      return
    }
    $('#waiterSearchInput').val(String(code || ''))
    if (typeof updateWaiterSearchClearBtn === 'function') updateWaiterSearchClearBtn()
    WAITER_ITEM_CATEG = 0
    queueWaiterItemsRender()
    return
  }

  const csrfToken = $('input[name=csrfmiddlewaretoken]').val()
  POSTREQUEST({
    data: { code: String(code || ''), csrfmiddlewaretoken: csrfToken },
    url: '/stoku/posBarcodeLookup',
  }).then(resp => {
    if (!resp || !resp.success || !resp.items || !resp.items.length) {
      if (inSession && window.TbBarcode && typeof TbBarcode.markNotFound === 'function') {
        TbBarcode.markNotFound(code)
      } else {
        toastr.warning(waiterLang('Barcode haijapatikana', 'Barcode not found'), '', { timeOut: 2500 })
      }
      return
    }
    const row = resp.items[0]
    if (row && row.id != null && !WAITER_ITEMS.find(x => Number(x.id) === Number(row.id))) {
      WAITER_ITEMS.push(Object.assign({}, row, {
        bidhaaN: row.name || row.bidhaaN || '',
        Bei_kuuza: row.bei != null ? row.bei : row.Bei_kuuza,
      }))
    }
    const itm = WAITER_ITEMS.find(x => Number(x.id) === Number(row.id)) || row
    const beforeQty = Number((WAITER_CART.find(x => Number(x.id) === Number(itm.id || row.id)) || {}).qty || 0)
    addWaiterItemToCart(Number(row.id))
    const afterQty = Number((WAITER_CART.find(x => Number(x.id) === Number(itm.id || row.id)) || {}).qty || 0)
    if (inSession && afterQty > beforeQty) {
      waiterAddScannedToSession({
        id: row.id,
        bidhaaN: itm.bidhaaN || row.name || '',
        bidhaa_id: itm.bidhaa_id || row.bidhaa_id,
        sirio: code,
        picha: row.picha,
      }, code)
    }
  }).catch(() => {
    toastr.error(waiterLang('Hitilafu ya mtandao', 'Network error'), '', { timeOut: 2500 })
  })
}

function initWaiterBarcodeScanner() {
  if (!window.TbBarcode) return
  TbBarcode.init({
    onScan: function (code) {
      waiterHandleBarcodeScan(code)
    },
  })
}

function applyWaiterGroupedRepresentativeQty(items, groupedMembersMap) {
  if (!Array.isArray(items) || !items.length || !groupedMembersMap || typeof groupedMembersMap !== 'object') {
    return items
  }

  const bidhaaQtyMap = {}
  items.forEach(it => {
    if (Number(it.is_grouped_item || 0) === 1) return
    const bidhaaId = Number(it.bidhaa_id || 0)
    if (!bidhaaId) return
    const netQty = Math.max(0, Number(it.idadi || 0) - Number(it.partial_item_reduction_qty || 0))
    bidhaaQtyMap[bidhaaId] = Number(bidhaaQtyMap[bidhaaId] || 0) + netQty
  })

  return items.map(it => {
    if (Number(it.is_grouped_item || 0) !== 1) return it

    const groupedId = String(it.grouped_item_ref_id || '')
    const memberBidhaaIds = Array.isArray(groupedMembersMap[groupedId]) ? groupedMembersMap[groupedId] : []
    if (!memberBidhaaIds.length) return it

    const summedQty = memberBidhaaIds.reduce((sum, bidhaaId) => {
      return sum + Number(bidhaaQtyMap[Number(bidhaaId) || 0] || 0)
    }, 0)

    return {
      ...it,
      idadi: summedQty,
    }
  })
}

function queueWaiterItemsRender() {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(renderWaiterItems)
    return
  }
  setTimeout(renderWaiterItems, 0)
}

function debounceWaiterItemsRender() {
  if (WAITER_SEARCH_TIMER) {
    clearTimeout(WAITER_SEARCH_TIMER)
  }
  WAITER_SEARCH_TIMER = setTimeout(() => {
    queueWaiterItemsRender()
  }, WAITER_SEARCH_DEBOUNCE_MS)
}

function waiterModeLabel(mode) {
  if (mode === 'drinks') return waiterLang('Vinywaji', 'Drinks')
  if (mode === 'kitchen') return waiterLang('Jikoni', 'Kitchen')
  return waiterLang('Zote', 'All')
}

function waiterPrintButtonLabel(printedNumber) {
  const count = Number(printedNumber || 0)
  const meta = $('#waiterPrintLabelMeta')
  const printWord = meta.length
    ? waiterLang(String(meta.data('print-swa') || 'Print'), String(meta.data('print-eng') || 'Print'))
    : waiterLang('Print', 'Print')
  const countWord = meta.length
    ? waiterLang(String(meta.data('count-swa') || 'mara'), String(meta.data('count-eng') || 'times'))
    : waiterLang('mara', 'times')

  return `${printWord} (${count} ${countWord})`
}

function renderActiveCounter(meta) {
  const host = $('#waiterActiveCounter')
  if (!host.length) return

  if (!meta || !meta.counter_name) {
    host.html('')
    return
  }

  const modeText = waiterModeLabel(meta.counter_mode || 'all')
  const role = meta.counter_role ? ` (${meta.counter_role})` : ''
  const staff = meta.counter_staff ? ` - ${meta.counter_staff}` : ''
  host.html(`${waiterLang('Counter Active', 'Active Counter')}: <strong>${meta.counter_name}</strong> <span class="text-muted">${role} - ${modeText}${staff}</span>`)
}

function waiterImageMap() {
  const mp = {}
  WAITER_ITEM_IMG.forEach(im => {
    if (!im || !im.bidhaa) return
    if (!mp[Number(im.bidhaa)] && im.picha__picha) {
      mp[Number(im.bidhaa)] = im.picha__picha
    }
  })
  return mp
}

function normalizeWaiterTableAreas(rawAreas) {
  if (!Array.isArray(rawAreas)) return []

  return rawAreas
    .map(area => {
      const areaId = Number(area && area.id ? area.id : 0)
      const areaName = String(area && area.name ? area.name : '').trim()
      const tables = Array.isArray(area && area.tables)
        ? area.tables.map(tb => ({
            id: Number(tb && tb.id ? tb.id : 0),
            name: String(tb && tb.name ? tb.name : '').trim(),
            area_id: Number(tb && tb.area_id ? tb.area_id : areaId),
            area_name: String(tb && tb.area_name ? tb.area_name : areaName).trim(),
          })).filter(tb => tb.id > 0 && tb.name)
        : []

      return {
        id: areaId,
        name: areaName,
        tables,
      }
    })
    .filter(area => area.id > 0 && area.name && area.tables.length > 0)
}

function setWaiterSelectedTable(tableObj) {
  if (!tableObj) return
  $('#place_where').val(String(tableObj.name || '').trim()).prop('readonly', false)
  $('#the_table_id').val(Number(tableObj.id || 0))
  renderWaiterTableGrid()
}

function renderWaiterTableGrid() {
  const host = $('#waiterTableGrid')
  if (!host.length) return

  if (!WAITER_TABLE_AREAS.length) {
    host.html(`<div class="small text-muted">${waiterLang('Hakuna meza zilizosajiliwa', 'No registered tables')}</div>`)
    return
  }

  const selectedArea = WAITER_TABLE_AREAS.find(ar => Number(ar.id) === Number(WAITER_SELECTED_AREA_ID))
  const selectedTableId = Number($('#the_table_id').val() || 0)

  const areaHtml = WAITER_TABLE_AREAS.map(ar => `
    <button
      type="button"
      class="btn btn-sm waiter-area-btn text-left waiter-device-area-btn ${Number(ar.id) === Number(WAITER_SELECTED_AREA_ID) ? 'btn-primary' : 'btn-light'}"
      data-id="${ar.id}">
      <div class="waiter-table-name">${ar.name}</div>
      <div class="waiter-table-area smallerFont ${Number(ar.id) === Number(WAITER_SELECTED_AREA_ID) ? 'text-white-50' : 'text-muted'}">${ar.tables.length} ${waiterLang('meza', 'tables')}</div>
    </button>
  `).join('')

  let tablePaneHtml = `<div class="small text-muted py-2">${waiterLang('Bonyeza sehemu kushoto kuona meza zake', 'Click a place on the left to see its tables')}</div>`
  if (selectedArea) {
    const tableHtml = selectedArea.tables.map(tb => `
      <button
        type="button"
        class="waiter-table-btn btn btn-sm ${selectedTableId === Number(tb.id) ? 'btn-primary' : 'btn-light'}"
        data-name="${tb.name}"
        data-id="${tb.id}"
        data-area-id="${selectedArea.id}"
        data-area="${selectedArea.name}">
        <div class="waiter-table-area smallerFont text-muted">${selectedArea.name}</div>
        <div class="waiter-table-name">${tb.name}</div>
      </button>
    `).join('')

    tablePaneHtml = tableHtml || `<div class="small text-muted py-2">${waiterLang('Hakuna meza kwenye sehemu hii', 'No tables in this place')}</div>`
  }

  host.html(`
    <div class="row no-gutters waiter-device-table-layout">
      <div class="col-4 pr-2">
        <div class="waiter-device-area-list">${areaHtml}</div>
      </div>
      <div class="col-8 pl-2">
        <div class="waiter-table-grid waiter-device-table-list">${tablePaneHtml}</div>
      </div>
    </div>
  `)
}

function addWaiterItemToCart(id) {
  const itm = WAITER_ITEMS.find(x => Number(x.id) === Number(id))
  if (!itm) return

  const stockQty = Number(itm.idadi || 0)
  const isNotSure = Number(itm.notsure || 0) === 1
  const inCart = WAITER_CART.find(x => Number(x.id) === Number(id))
  const currentQty = Number(inCart?.qty || 0)

  if (!isNotSure && (currentQty + 1) > stockQty) {
    toastr.warning(
      waiterLang('Idadi ya bidhaa haitoshi kwenye stoo.', 'Item quantity exceeds available stock.'),
      waiterLang('Taarifa', 'Info'),
      { timeOut: 2200 }
    )
    return
  }

  if (inCart) {
    inCart.qty += 1
  } else {
    WAITER_CART.push({
      id: Number(id),
      name: itm.bidhaaN,
      price: Number(itm.Bei_kuuza || 0),
      qty: 1,
      vat_set: Number(itm.vat_allow || 0),
      vat_include: Number(itm.taxInclusive || 0),
      notsure: Number(itm.notsure || 0)
    })
  }

  renderWaiterCart()
  queueWaiterItemsRender()
  
  // Trigger animation on card
  const cardEl = $(`.waiter-item-card[data-id="${id}"]`)
  if (cardEl.length) {
    cardEl.addClass('animate-click')
    setTimeout(() => {
      cardEl.removeClass('animate-click')
    }, 600)
  }
}

function renderWaiterCategories() {
  let categBtn = `
    <li class="py-1 waiter-categ-orient-row">
      <button type="button" id="waiterCategOrientToggle" class="btn border btn-light waiter-categ-orient-btn" data-orient="vertical" title=""></button>
    </li>
    <li class="py-1">
      <button data-aina="0" class="btn border waiter-categs-btn text-left text-capitalize latoFont btn-block btn-default">
        ${waiterLang('Aina Zote', 'All Categories')}
      </button>
    </li>
  `

  const goods = WAITER_ITEMS.filter(x => (Number(x.Bei_kuuza || 0) > 0 || !x.material) && !x.service)
  const categIds = [...new Set(goods.map(i => (i.aina != null && i.aina !== '') ? Number(i.aina) : WAITER_UNCATEGORIZED_CATEG))]
  const categs = categIds.map(id => {
    if (Number(id) === WAITER_UNCATEGORIZED_CATEG) {
      return {
        id: WAITER_UNCATEGORIZED_CATEG,
        aina: waiterLang('Bila Aina', 'Uncategorized'),
      }
    }
    const found = goods.find(it => Number(it.aina) === Number(id))
    return {
      id: id,
      aina: found ? (found.ainaN || waiterLang('Bila Aina', 'Uncategorized')) : waiterLang('Bila Aina', 'Uncategorized')
    }
  }).sort((a, b) => String(a.aina).localeCompare(String(b.aina)))

  categs.forEach(c => {
    categBtn += `
      <li class="py-1">
        <button data-aina="${c.id}" class="btn border waiter-categs-btn text-left text-capitalize latoFont btn-block btn-light">
          ${c.aina}
        </button>
      </li>
    `
  })

  $('#waiterCounterNav').html(categBtn)
  syncWaiterCategOrientBtn()
}

function waiterFilteredItems() {
  let allItems = WAITER_ITEMS.filter(it => !it.service && Number(it.Bei_kuuza || 0) > 0)
  const q = waiterSearchValue()

  if (WAITER_ITEM_CATEG !== 0) {
    if (Number(WAITER_ITEM_CATEG) === WAITER_UNCATEGORIZED_CATEG) {
      allItems = allItems.filter(it => !it.aina)
    } else {
      allItems = allItems.filter(it => Number(it.aina || 0) === Number(WAITER_ITEM_CATEG))
    }
  }

  if (!q) return allItems

  const cleaned = q.replace(/[^a-z0-9 ]/gi, '').toLowerCase()
  if (!cleaned) return allItems

  return allItems.filter(it => String(it.__search || '').includes(cleaned))
}

function waiterItemCardHtml(it, imgMap, cartQtyMap) {
  const price = Number(it.Bei_kuuza || 0)
  const picha = imgMap[Number(it.bidhaa_id || 0)] || __tbStatic('pics/img.svg')
  const stockQty = Number(it.idadi || 0)
  const isNotSure = Number(it.notsure || 0) === 1
  const cartQty = Number(cartQtyMap[Number(it.id)] || 0)
  const canAddMore = isNotSure || cartQty < stockQty
  const unit = String(it.vipimo || '')

  return `
    <div class="waiter-item-card" data-id="${it.id}">
      <figure class="waiter-item-figure mb-1">
        <img src="${picha}" alt="${it.bidhaaN || ''}" loading="lazy" decoding="async">
      </figure>
      <div class="waiter-name text-capitalize">${it.bidhaaN}</div>
      <div class="small text-muted">${it.ainaN || ''}</div>
      <div class="waiter-stock-line">
        <small class="text-primary"><i>${unit}</i></small>
        <small class="waiter-stock-value">${stockQty.toLocaleString()}</small>
      </div>
      <div class="smallerFont ${canAddMore ? 'text-muted' : 'text-danger'}">
        ${canAddMore ? '&nbsp;' : waiterLang('Imefika kikomo cha stock', 'Stock limit reached')}
      </div>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <div class="waiter-price">${CURRENCII} ${price.toLocaleString()}</div>
        <button class="btn btn-sm btn-primary addWaiterItem" data-id="${it.id}" ${canAddMore ? '' : 'disabled'} title="${waiterLang('Ongeza', 'Add')}" aria-label="${waiterLang('Ongeza', 'Add')}">+</button>
      </div>
    </div>
  `
}

function waiterCartQtyMap() {
  const cartQtyMap = {}
  WAITER_CART.forEach(it => {
    cartQtyMap[Number(it.id)] = Number(it.qty || 0)
  })
  return cartQtyMap
}

function bindWaiterItemsInfiniteScroll() {
  if (WAITER_ITEMS_SCROLL_STATE.bound) return
  const host = document.getElementById('waiterItemsList')
  if (!host) return
  host.addEventListener('scroll', onWaiterItemsScroll, { passive: true })
  WAITER_ITEMS_SCROLL_STATE.bound = true
}

function onWaiterItemsScroll() {
  const host = document.getElementById('waiterItemsList')
  if (!host) return
  if (host.scrollTop + host.clientHeight >= host.scrollHeight - WAITER_SCROLL_LOAD_PX) {
    appendWaiterItemsChunk()
  }
}

function appendWaiterItemsChunk() {
  const st = WAITER_ITEMS_SCROLL_STATE
  if (st.loading || st.ticket !== WAITER_RENDER_TICKET) return
  if (!st.list.length || st.idx >= st.list.length) return

  st.loading = true
  const host = $('#waiterItemsList')
  const imgMap = waiterImageMap()
  const cartQtyMap = waiterCartQtyMap()
  const nextEnd = Math.min(st.idx + WAITER_RENDER_CHUNK, st.list.length)
  let chunkHtml = ''
  for (let i = st.idx; i < nextEnd; i += 1) {
    chunkHtml += waiterItemCardHtml(st.list[i], imgMap, cartQtyMap)
  }
  host.append(chunkHtml)
  st.idx = nextEnd
  st.loading = false
}

function renderWaiterItems() {
  const ticket = ++WAITER_RENDER_TICKET
  const list = waiterFilteredItems()
  const imgMap = waiterImageMap()
  const cartQtyMap = waiterCartQtyMap()
  const host = $('#waiterItemsList')

  $('#waiterItemsCount').text(list.length)
  bindWaiterItemsInfiniteScroll()

  if (!list.length) {
    WAITER_ITEMS_SCROLL_STATE = { list: [], idx: 0, ticket, loading: false, bound: WAITER_ITEMS_SCROLL_STATE.bound }
    host.html('<div class="waiter-empty">' + waiterLang('Hakuna bidhaa', 'No items') + '</div>')
    return
  }

  const firstEnd = Math.min(WAITER_INITIAL_RENDER_LIMIT, list.length)
  host.html(list.slice(0, firstEnd).map(it => waiterItemCardHtml(it, imgMap, cartQtyMap)).join(''))
  host.scrollTop(0)
  WAITER_ITEMS_SCROLL_STATE = {
    list,
    idx: firstEnd,
    ticket,
    loading: false,
    bound: WAITER_ITEMS_SCROLL_STATE.bound
  }
}

function getWaiterPendingOrderById(orderId) {
  const id = Number(orderId || 0)
  if (!id) return null
  return (WAITER_ORDERS.pending || []).find(x => Number(x.id) === id) || null
}

function syncWaiterActivePendingOrder() {
  const pending = WAITER_ORDERS.pending || []
  const activeId = Number(WAITER_ACTIVE_PENDING_ORDER || 0)
  if (activeId && getWaiterPendingOrderById(activeId)) {
    return activeId
  }
  if (WAITER_CART.length) {
    WAITER_ACTIVE_PENDING_ORDER = 0
    return 0
  }
  if (pending.length) {
    WAITER_ACTIVE_PENDING_ORDER = Number(pending[0].id || 0)
    WAITER_SELECTED_ORDER = WAITER_ACTIVE_PENDING_ORDER
    return WAITER_ACTIVE_PENDING_ORDER
  }
  WAITER_ACTIVE_PENDING_ORDER = 0
  return 0
}

function renderWaiterCurrentOrderActions() {
  const activePending = Number(WAITER_ACTIVE_PENDING_ORDER || 0)
  const $orderBtn = $('#waiter_order_btn')
  if (!$orderBtn.length) return
  if (activePending && !WAITER_CART.length) {
    $orderBtn
      .removeClass('btn-success')
      .addClass('btn-primary')
      .text(waiterLang('Print Order', 'Print Order'))
    $('#waiterCurrentOrderHint').text(
      waiterLang('Oda iliyopewa na msimamizi — bonyeza Print kupunguza stoku', 'Assigned order — tap Print to deduct stock')
    ).show()
    $('#clear_after_print').closest('.form-check').hide()
  } else {
    $orderBtn
      .removeClass('btn-primary')
      .addClass('btn-success')
      .text(waiterLang('Order', 'Order'))
    $('#waiterCurrentOrderHint').hide().text('')
    $('#clear_after_print').closest('.form-check').show()
  }
}

function renderWaiterCart() {
  updateWaiterMobileNavCounts()
  syncWaiterActivePendingOrder()
  renderWaiterCurrentOrderActions()

  const activePending = Number(WAITER_ACTIVE_PENDING_ORDER || 0)
  const pendingItems = activePending
    ? (WAITER_ORDERS.items[String(activePending)] || WAITER_ORDERS.items[activePending] || [])
    : []

  if (activePending && pendingItems.length && !WAITER_CART.length) {
    const pendingOrder = getWaiterPendingOrderById(activePending)
    const header = pendingOrder
      ? `<li class="waiter-cart-meta small text-muted pb-2 mb-2 border-bottom">
          <strong>${waiterLang('Oda', 'Order')} ORD-${pendingOrder.code}</strong><br>
          ${waiterLang('Mteja', 'Customer')}: ${pendingOrder.customer_name || pendingOrder.table || '-'}<br>
          ${waiterLang('Eneo', 'Place')}: ${pendingOrder.place || '-'} — ${pendingOrder.table || '-'}
          ${pendingOrder.is_guest_compound ? `<span class="badge badge-info ml-1">${waiterLang('Mgeni', 'Guest')}</span>` : ''}
        </li>`
      : ''
    const html = pendingItems.map(it => `
      <li class="waiter-cart-item">
        <div>
          <div class="small text-capitalize">${it.name}</div>
          <div class="text-muted smallerFont">${CURRENCII} ${Number(it.price || 0).toLocaleString()}</div>
        </div>
        <div class="meta">
          <strong>${it.qty}</strong>
        </div>
      </li>
    `).join('')
    $('#waiterCartList').html(header + html)
    const total = pendingOrder ? Number(pendingOrder.amount || 0) : pendingItems.reduce((sum, it) => sum + Number(it.total || 0), 0)
    $('#waiterCartTotal').text(total.toLocaleString())
    return
  }

  if (!WAITER_CART.length) {
    $('#waiterCartList').html('<li class="waiter-empty">' + waiterLang('Bado hujaongeza bidhaa', 'No item selected') + '</li>')
    $('#waiterCartTotal').text('0')
    return
  }

  const html = WAITER_CART.map(it => `
    <li class="waiter-cart-item">
      <div>
        <div class="small text-capitalize">${it.name}</div>
        <div class="text-muted smallerFont">${CURRENCII} ${Number(it.price).toLocaleString()}</div>
      </div>
      <div class="meta">
        <button class="btn btn-light btn-sm waiterQty" data-act="minus" data-id="${it.id}">-</button>
        <strong>${it.qty}</strong>
        <button class="btn btn-light btn-sm waiterQty" data-act="plus" data-id="${it.id}" ${Number(it.notsure || 0) === 1 || Number(it.qty) < Number((WAITER_ITEMS.find(w => Number(w.id) === Number(it.id)) || {}).idadi || 0) ? '' : 'disabled'}>+</button>
      </div>
    </li>
  `).join('')

  $('#waiterCartList').html(html)
  $('#waiterCartTotal').text(waiterAmount().toLocaleString())
}

function waiterOrderPayload(opts) {
  const today = moment().format('YYYY-MM-DD')
  const tableName = String(opts.tableName || '').trim()
  const counter = WAITER_COUNTER_NAME || waiterModeLabel(WAITER_COUNTER_MODE)
  const paid = opts.paid ? waiterAmount() : 0
  const akaunt = opts.paid ? Number(opts.akaunt || 0) : 0
  const customerName = String(opts.customerName || '').trim() || tableName

  const itmDt = WAITER_CART.map(x => ({
    color: [],
    size: [],
    bei: Number(x.price),
    idadi: Number(x.qty),
    idn: Number(x.id),
    bei_set: false,
    vat_set: Number(x.vat_set || 0),
    vat_include: Number(x.vat_include || 0),
    value: Number(x.id),
    jum: 0,
    notsure: Number(x.notsure || 0),
    uwiano: 1,
    match: 0,
    servT: 1,
    serial: '',
    timely: 0
  }))

  const desc = `WAITER|table=${tableName}|counter=${counter}|cell=${Number($('#the_cell').val() || 0)}`
  const amount = waiterAmount()
  const tableId = Number($('#the_table_id').val() || 0)

  return {
    data: waiterDeviceRequest({
      edit: 0,
      service: 0,
      servFrom: moment().format(),
      servTo: moment().format(),
      now: moment().format(),
      desc: desc,
      oda: 1,
      rudi: 0,
      toLabor: 0,
      rudi_val: 0,
      bill: 0,
      sup: 0,
      date: today,
      bill_no: 'none',
      code_set: 0,
      inalipwa: paid,
      akaunt: akaunt,
      amount: amount,
      amount_set: 1,
      kulipa: today,
      invo_am: amount,
      resev: 0,
      ch: 0,
      lipaEleza: '',
      itm_dt: JSON.stringify(itmDt),
      cusom_name: customerName,
      table_id: tableId,
      address: '',
      simu: '',
      mail: '',
      reg: 0,
      reg_val: 0,
      custom_set: 0
    }),
    url: '/mauzo/waiter_order'
  }
}

function loadWaiterOrders() {
  const data = {
    data: waiterDeviceRequest({}),
    url: '/mauzo/waiter_orders_data'
  }

  const req = POSTREQUEST(data)
  req.then(resp => {
    if (!resp.success) return
    WAITER_ENABLE_PRINT = Boolean(resp.enable_print)
    WAITER_ORDERS = {
      pending: resp.pending || [],
      printed: resp.printed || [],
      items: resp.items || {}
    }
    syncWaiterActivePendingOrder()
    if ((WAITER_ORDERS.pending || []).length && !WAITER_CART.length) {
      switchWaiterRightPanel('current')
    }
    renderWaiterOrdersAmountSummary()
    updateWaiterMobileNavCounts()
    renderWaiterFilterCounts()
    renderWaiterHistory()
    renderSelectedOrderItems()
    renderWaiterCart()
  })
}

function renderWaiterHistory() {
  renderWaiterFilterCounts()

  let list = WAITER_TAB === 'pending' ? WAITER_ORDERS.pending : WAITER_ORDERS.printed

  if (WAITER_PAYMENT_FILTER === 'paid') {
    list = list.filter(x => Boolean(x.is_paid))
  } else if (WAITER_PAYMENT_FILTER === 'unpaid') {
    list = list.filter(x => !Boolean(x.is_paid))
  }

  if (!list.length) {
    $('#waiterOrderHistory').html('<div class="waiter-empty">' + waiterLang('Hakuna order', 'No orders') + '</div>')
    return
  }

  const html = list.map(o => `
    <div class="waiter-history-card ${WAITER_SELECTED_ORDER === o.id ? 'active' : ''}" data-id="${o.id}">
      <div class="d-flex justify-content-between">
        <strong>ORD-${o.code}</strong>
        <div>
          ${o.is_guest_compound ? `<span class="badge badge-info mr-1">${waiterLang('Mgeni', 'Guest')}</span>` : ''}
          <span class="badge badge-${o.status === 'pending' ? 'warning' : 'success'} mr-1">${o.status}</span>
          <span class="badge badge-${o.is_paid ? 'success' : 'secondary'}">${o.is_paid ? waiterLang('Paid', 'Paid') : waiterLang('Unpaid', 'Unpaid')}</span>
        </div>
      </div>
      <div class="small text-muted mt-1">${waiterLang('Meza','Table')}: ${o.table || '-'}</div>
        <div class="small text-muted">${waiterLang('Eneo','Place')}: ${o.place || o.counter || '-'}</div>
      <div class="small">${CURRENCII} ${Number(o.amount || 0).toLocaleString()}</div>
      <div class="small text-muted">${waiterLang('Paid', 'Paid')}: ${CURRENCII} ${Number(o.paid_amount || 0).toLocaleString()}</div>
      <div class="small text-muted">${waiterLang('Print Count', 'Print Count')}: ${Number(o.printed_number || 0)}</div>
      ${o.status === 'pending' ? `<div class="mt-2 d-flex justify-content-end" style="gap:6px;">
        ${WAITER_ENABLE_PRINT ? `<button class="btn btn-sm btn-outline-primary waiterPrintOrder" data-id="${o.id}" data-status="${o.status}" data-printed="${Number(o.printed_number || 0)}">${waiterPrintButtonLabel(o.printed_number)}</button>` : ''}
        ${!o.is_paid ? `<button class="btn btn-sm btn-outline-success waiterPayOrder" data-id="${o.id}" data-amount="${o.amount}" data-paid="${o.paid_amount}" data-remaining="${o.remaining}">${waiterLang('Lipa', 'Pay')}</button>` : ''}
        ${!o.is_guest_compound ? `<button class="btn btn-sm btn-outline-danger waiterDeleteOrder" data-id="${o.id}">${waiterLang('Futa', 'Delete')}</button>` : ''}
      </div>` : `<div class="mt-2 d-flex justify-content-end" style="gap:6px;">
        ${WAITER_ENABLE_PRINT ? `<button class="btn btn-sm btn-outline-primary waiterPrintOrder" data-id="${o.id}" data-status="${o.status}" data-printed="${Number(o.printed_number || 0)}">${waiterPrintButtonLabel(o.printed_number)}</button>` : ''}
        ${!o.is_paid ? `<button class="btn btn-sm btn-outline-success waiterPayOrder" data-id="${o.id}" data-amount="${o.amount}" data-paid="${o.paid_amount}" data-remaining="${o.remaining}">${waiterLang('Lipa', 'Pay')}</button>` : ''}
      </div>`}
    </div>
  `).join('')

  $('#waiterOrderHistory').html(html)
}

function renderSelectedOrderItems() {
  const data = WAITER_ORDERS.items[String(WAITER_SELECTED_ORDER)] || WAITER_ORDERS.items[WAITER_SELECTED_ORDER] || []
  if (!data.length) {
    $('#waiterSelectedOrderItems').html('<li class="waiter-empty">' + waiterLang('Chagua order kuona items', 'Select order to view items') + '</li>')
    return
  }

  const html = data.map(i => `
    <li class="d-flex justify-content-between border-bottom py-1">
      <span class="text-capitalize">${i.name} (${i.qty} ${i.unit || ''})</span>
      <span>${CURRENCII} ${Number(i.total || 0).toLocaleString()}</span>
    </li>
  `).join('')

  $('#waiterSelectedOrderItems').html(html)
}

function clearCurrentCart() {
  WAITER_CART = []
  renderWaiterCart()
}

function markWaiterOrderPrinted(orderId) {
  const data = {
    data: waiterDeviceRequest({ order: Number(orderId) }),
    url: '/mauzo/waiter_print_order'
  }

  return POSTREQUEST(data)
}

function openWaiterPrintWindow(orderId) {
  const printUrl = `/mauzo/waiter_Invoprint?item_valued=${Number(orderId)}&lang=1&biz=${encodeURIComponent(WAITER_DEVICE_BIZ || 0)}&device_id=${encodeURIComponent(WAITER_DEVICE_ID || '')}`
  const printWin = window.open(printUrl, '_blank')

  if (!printWin) {
    toastr.warning(waiterLang('Ruhusu popup ili kuprint', 'Allow popups to print'), waiterLang('Taarifa', 'Info'), { timeOut: 3000 })
    return false
  }

  return true
}

function proceedPrintAfterMark(orderId) {
  const req = markWaiterOrderPrinted(orderId)
  req.then(resp => {
    if (!resp || !resp.success) {
      const msg = String((resp && resp.msg) || waiterLang('Imeshindikana kuhifadhi print ya order', 'Failed to mark order as printed'))
      alert(msg)
      toastr.warning(msg, waiterLang('Taarifa', 'Info'), { timeOut: 3200 })
      return
    }

    if (!openWaiterPrintWindow(orderId)) {
      return
    }

    toastr.success(waiterLang('Print imehifadhiwa', 'Print saved'), 'Success', { timeOut: 2200 })
    if (Number(orderId) === Number(WAITER_ACTIVE_PENDING_ORDER)) {
      WAITER_ACTIVE_PENDING_ORDER = 0
    }
    loadWaiterOrders()
  }).catch(() => {
    const msg = waiterLang('Hitilafu imetokea wakati wa kuhifadhi print', 'An error occurred while marking print')
    alert(msg)
    toastr.error(msg, waiterLang('Hitilafu', 'Error'), { timeOut: 3200 })
  })

  return req
}

function printWaiterOrder(orderId, firstPrint) {
  if (firstPrint) {
    WAITER_PRINT_PENDING_ORDER = Number(orderId)
    $('#waiterPrintConfirmOrderRef').text(`ORD-${orderId}`)
    $('#waiterPrintConfirmText').text(waiterLang('Uko tayari kuprint order hii?', 'Are you ready to print this order?'))
    $('#waiterPrintConfirmSubtext').text(waiterLang('Ukithibitisha, stock itapunguzwa mara ya kwanza tu.', 'On confirmation, stock is deducted only on first print.'))
    $('#waiterPrintConfirmModal').modal('show')
    return
  }

  proceedPrintAfterMark(orderId)
}

function submitWaiterOrder() {
  const tableName = String($('#place_where').val() || '').trim()
  const isPaid = $('#waiterOrderPaid').prop('checked')
  const payMethod = waiterSelectedAccount('#waiterPayMethod')
  const akaunt = Number(payMethod.id || 0)
  const isCash = String(payMethod.aina || '') === 'cash'
  const customerName = String($('#waiterCustomerName').val() || '').trim()

  if (tableName.length < 1) {
    redborder('#place_where')
    toastr.warning(waiterLang('Weka jina la meza', 'Set table name'), waiterLang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }

  if (!WAITER_CART.length) {
    toastr.warning(waiterLang('Hakuna bidhaa', 'No items selected'), waiterLang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }

  if (isPaid && !akaunt) {
    $('#waiterPayMethodCards').addClass('border-danger')
    toastr.warning(waiterLang('Chagua njia ya malipo', 'Select payment method'), waiterLang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }

  if (isPaid && !isCash && customerName.length < 1) {
    redborder('#waiterCustomerName')
    toastr.warning(waiterLang('Weka jina la mteja', 'Enter customer name'), waiterLang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }

  const payload = waiterOrderPayload({ tableName, paid: isPaid, akaunt, customerName: isCash ? '' : customerName })
  $('#waiterOrderModal').modal('hide')
  $('#loadMe').modal('show')
  const req = POSTREQUEST(payload)

  req.then(resp => {
    $('#loadMe').modal('hide')
    hideLoading()

    if (!resp.success) {
      const msg = waiterLang(resp.message_swa || 'Haijafanikiwa', resp.message_eng || 'Failed')
      toastr.error(msg, lang('Haikufanikiwa','Error'), {timeOut: 2000});
      return
    }

    const orderId = Number(resp.bil)
    const shouldClear = $('#clear_after_print').prop('checked')
    if (shouldClear) {
      printWaiterOrder(orderId)
    }

    const msg = waiterLang(resp.message_swa || 'Order imehifadhiwa', resp.message_eng || 'Order saved')
    toastr.success(msg, lang('Imefanikiwa','Success'), {timeOut: 2000});
    clearCurrentCart()
    WAITER_ACTIVE_PENDING_ORDER = 0
    loadWaiterOrders()
  }).catch(() => {
    $('#loadMe').modal('hide')
    hideLoading()
    const msg = waiterLang('Haijafanikiwa', 'Failed')
    toastr.error(msg, lang('Haikufanikiwa','Error'), {timeOut: 2000});
  })
}

function saveWaiterOrder() {
  const activePending = Number(WAITER_ACTIVE_PENDING_ORDER || 0)
  if (activePending && !WAITER_CART.length) {
    const pendingOrder = getWaiterPendingOrderById(activePending)
    const printedNumber = Number((pendingOrder && pendingOrder.printed_number) || 0)
    printWaiterOrder(activePending, printedNumber <= 0)
    return
  }
  if (!WAITER_CART.length) {
    toastr.warning(waiterLang('Hakuna bidhaa', 'No items selected'), waiterLang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }
  // reset modal fields
  $('#waiterOrderPaid').prop('checked', false)
  $('#waiterPayMethodWrap').hide()
  $('#waiterPayMethod').val('')
  $('#waiterCustomerNameWrap').hide()
  $('#waiterCustomerName').val('')
  $('#place_where').val('').prop('readonly', false)
  $('#the_cell').val('0')
  $('#the_table_id').val('0')
  WAITER_SELECTED_AREA_ID = 0
  renderWaiterTableGrid()
  $('#waiterOrderModal').modal('show')
}

function initializeWaiterItems() {
  $('#waiterItemsList').html('<div class="waiter-empty">' + waiterLang('Inapakia bidhaa...', 'Loading items...') + '</div>')

  const data = {
    data: waiterDeviceRequest({}),
    url: '/mauzo/waiter_items_data'
  }

  const req = POSTREQUEST(data)
  req.then(resp => {
    if (!resp.success) {
      $('#waiterItemsList').html('<div class="waiter-empty">Failed to load items</div>')
      return
    }

    WAITER_ITEMS = applyWaiterGroupedRepresentativeQty(
      (resp.products || []).slice(0),
      resp.grouped_members_map || {}
    )
    buildWaiterSearchIndex()
    WAITER_ITEM_IMG = (resp.img || []).slice(0)
    WAITER_TABLE_AREAS = normalizeWaiterTableAreas(resp.table_areas || [])
    WAITER_SELECTED_AREA_ID = 0

    WAITER_COUNTER_MODE = String(resp.counter_mode || 'all')
    WAITER_COUNTER_NAME = String(resp.counter_name || '')
    renderActiveCounter(resp)
    renderWaiterTableGrid()
    renderWaiterCategories()
    queueWaiterItemsRender()
    initWaiterBarcodeScanner()
  })
}

$('body').on('click', '.addWaiterItem', function() {
  const id = Number($(this).data('id'))
  addWaiterItemToCart(id)
})

$('body').on('click', '.waiter-item-card', function(ev) {
  if ($(ev.target).closest('.addWaiterItem').length) return
  const id = Number($(this).data('id'))
  if (!id) return
  addWaiterItemToCart(id)
})

$('body').on('click', '.waiterQty', function() {
  const id = Number($(this).data('id'))
  const act = String($(this).data('act'))
  const target = WAITER_CART.find(x => Number(x.id) === id)
  const itemDef = WAITER_ITEMS.find(x => Number(x.id) === id)
  if (!target) return

  if (act === 'plus') {
    const stockQty = Number(itemDef?.idadi || 0)
    const isNotSure = Number(target.notsure || itemDef?.notsure || 0) === 1
    if (!isNotSure && (Number(target.qty) + 1) > stockQty) {
      toastr.warning(
        waiterLang('Idadi ya bidhaa haitoshi kwenye stoo.', 'Item quantity exceeds available stock.'),
        waiterLang('Taarifa', 'Info'),
        { timeOut: 2200 }
      )
      return
    }
    target.qty += 1
  }
  if (act === 'minus') target.qty -= 1

  WAITER_CART = WAITER_CART.filter(x => x.qty > 0)
  renderWaiterCart()
  queueWaiterItemsRender()
})

$('body').on('click', '.waiter-categs-btn', function() {
  const ain = Number($(this).data('aina') || 0)
  $('.waiter-categs-btn').removeClass('text-primary border-primary')
  if (ain) {
    $(this).addClass('text-primary border-primary')
  }
  WAITER_ITEM_CATEG = ain
  queueWaiterItemsRender()
  closeWaiterCategPopup()
})

$('body').on('click', '.waiter-history-tab', function() {
  $('.waiter-history-tab').removeClass('btn-primary').addClass('btn-light')
  $(this).removeClass('btn-light').addClass('btn-primary')
  WAITER_TAB = String($(this).data('tab'))
  renderWaiterHistory()
})

$('body').on('click', '.waiter-payment-tab', function() {
  $('.waiter-payment-tab').removeClass('btn-primary').addClass('btn-light')
  $(this).removeClass('btn-light').addClass('btn-primary')
  WAITER_PAYMENT_FILTER = String($(this).data('pay') || 'all')
  renderWaiterHistory()
})

$('body').on('click', '.waiter-history-card', function() {
  WAITER_SELECTED_ORDER = Number($(this).data('id'))
  WAITER_ACTIVE_PENDING_ORDER = WAITER_SELECTED_ORDER
  switchWaiterRightPanel('orders')
  renderWaiterHistory()
  renderSelectedOrderItems()
  renderWaiterCart()
})

$('body').on('click', '.waiter-panel-tab', function() {
  switchWaiterRightPanel(String($(this).data('panel') || 'current'))
})

$('body').on('click', '.waiter-mobile-nav-btn', function() {
  switchWaiterRightPanel(String($(this).data('mobile-panel') || 'items'))
})

$('body').on('click', '.waiterDeleteOrder', function(ev) {
  ev.preventDefault()
  ev.stopPropagation()

  const orderId = Number($(this).data('id') || 0)
  if (!orderId) return

  if (!confirm(waiterLang('Una uhakika unataka kufuta order hii?', 'Are you sure you want to delete this order?'))) {
    return
  }

  const data = {
    data: waiterDeviceRequest({ order: orderId }),
    url: '/mauzo/waiter_delete_order'
  }

  const req = POSTREQUEST(data)
  req.then(resp => {
    if (!resp.success) {
      const msg = String(resp.msg || waiterLang('Imeshindikana kufuta order', 'Failed to delete order'))
      toastr.warning(msg, waiterLang('Taarifa', 'Info'), { timeOut: 2500 })
      return
    }

    if (WAITER_SELECTED_ORDER === orderId) {
      WAITER_SELECTED_ORDER = 0
      WAITER_ACTIVE_PENDING_ORDER = 0
    }

    toastr.success(waiterLang('Order imefutwa', 'Order deleted'), 'Success', { timeOut: 2000 })
    loadWaiterOrders()
  })
})

$('body').on('click', '.waiterPrintOrder', function(ev) {
  ev.preventDefault()
  ev.stopPropagation()

  const orderId = Number($(this).data('id') || 0)
  const printedNumber = Number($(this).data('printed') || 0)
  if (!orderId) return

  const firstPrint = printedNumber <= 0
  printWaiterOrder(orderId, firstPrint)
})

$('body').on('click', '#waiterConfirmPrintedBtn, #waiterConfirmPrintBtn', function() {
  const orderId = Number(WAITER_PRINT_PENDING_ORDER || 0)
  if (!orderId) {
    $('#waiterPrintConfirmModal').modal('hide')
    return
  }

  const btn = $(this)
  btn.prop('disabled', true)
  proceedPrintAfterMark(orderId).always(() => {
    WAITER_PRINT_PENDING_ORDER = 0
    $('#waiterPrintConfirmModal').modal('hide')
    btn.prop('disabled', false)
  })
})

$('body').on('hidden.bs.modal', '#waiterPrintConfirmModal', function() {
  $('#waiterConfirmPrintedBtn').prop('disabled', false)
})

function updateWaiterSearchClearBtn() {
  const hasText = Boolean(String($('#waiterSearchInput').val() || '').length)
  $('#waiterSearchClear').toggle(hasText)
}

function clearWaiterSearchInput() {
  $('#waiterSearchInput').val('')
  updateWaiterSearchClearBtn()
  queueWaiterItemsRender()
}

function waiterCategOrientStorageKey() {
  const waiterId = WAITER_ACTIVE_WAITER_ID || '0'
  const deviceId = WAITER_DEVICE_ID || '0'
  return 'waiterCategOrient_d' + deviceId + '_w' + waiterId
}

function waiterCategOrientIcon(nextMode) {
  if (nextMode === 'vertical') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h4v12H2V2zm6 0h6v3H8V2zm0 5h6v3H8V7zm0 5h6v3H8v-3z"/></svg>'
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>'
}

function syncWaiterCategOrientBtn() {
  const mode = WAITER_CATEG_ORIENT === 'vertical' ? 'vertical' : 'horizontal'
  const nextMode = mode === 'vertical' ? 'horizontal' : 'vertical'
  const $btn = $('#waiterCategOrientToggle')
  if (!$btn.length) return
  $btn.attr('data-orient', nextMode)
  $btn.attr(
    'title',
    nextMode === 'vertical'
      ? waiterLang('Onyesha kushoto (wima)', 'Show left (vertical)')
      : waiterLang('Onyesha juu (mlalo)', 'Show on top (horizontal)')
  )
  $btn.html(waiterCategOrientIcon(nextMode))
}

function applyWaiterCategOrientation(orient) {
  const mode = orient === 'vertical' ? 'vertical' : 'horizontal'
  WAITER_CATEG_ORIENT = mode
  const $nav = $('#waiterCounterNav')
  const $shell = $('.waiter-shell')
  $nav.removeClass('is-horizontal is-vertical').addClass(mode === 'vertical' ? 'is-vertical' : 'is-horizontal')
  $shell.removeClass('waiter-categ-horizontal waiter-categ-vertical')
    .addClass(mode === 'vertical' ? 'waiter-categ-vertical' : 'waiter-categ-horizontal')
  syncWaiterCategOrientBtn()
  try {
    localStorage.setItem(waiterCategOrientStorageKey(), mode)
  } catch (err) {}
}

function initWaiterCategOrientation() {
  let saved = 'horizontal'
  try {
    saved = localStorage.getItem(waiterCategOrientStorageKey()) || 'horizontal'
  } catch (err) {}
  applyWaiterCategOrientation(saved)
}

function openWaiterCategPopup() {
  if (!waiterIsMobileLayout()) return
  $('#waiterCategoriesSection').addClass('waiter-categ-popup-open')
  $('body').addClass('waiter-categ-popup-active')
}

function closeWaiterCategPopup() {
  $('#waiterCategoriesSection').removeClass('waiter-categ-popup-open')
  $('body').removeClass('waiter-categ-popup-active')
}

$('#waiterSearchInput').on('keyup input', function() {
  updateWaiterSearchClearBtn()
  debounceWaiterItemsRender()
})

$('#waiterSearchClear').on('click', function() {
  clearWaiterSearchInput()
  $('#waiterSearchInput').trigger('focus')
})

$('body').on('click', '#waiterCategOrientToggle', function(e) {
  e.preventDefault()
  e.stopPropagation()
  applyWaiterCategOrientation(String($(this).attr('data-orient') || 'horizontal'))
})

$('#waiterOpenCategPopup').on('click', function() {
  openWaiterCategPopup()
})

$('#waiterCloseCategPopup').on('click', function() {
  closeWaiterCategPopup()
})

$('#waiterCategoriesSection').on('click', function(e) {
  if (e.target === this) closeWaiterCategPopup()
})

$(window).on('resize', function() {
  if (!waiterIsMobileLayout()) closeWaiterCategPopup()
})

initWaiterCategOrientation()
updateWaiterSearchClearBtn()

$('#waiter_order_btn').on('click', function() {
  saveWaiterOrder()
})

$('body').on('change', '#waiterOrderPaid', function() {
  if ($(this).prop('checked')) {
    $('#waiterPayMethodWrap').show()
  } else {
    $('#waiterPayMethodWrap').hide()
    $('#waiterPayMethod').val('').trigger('change')
    $('#waiterCustomerNameWrap').hide()
    $('#waiterCustomerName').val('')
  }
})

$('body').on('change', '#waiterPayMethod', function() {
  $('#waiterPayMethodCards').removeClass('border-danger')
  const aina = waiterSelectedAccount('#waiterPayMethod').aina

  renderWaiterPaymentCards('#waiterPayMethod', '#waiterPayMethodCards', 'waiter-pay-method-radio')

  if (aina && aina.toLowerCase() !== 'cash') {
    $('#waiterCustomerNameWrap').show()
  } else {
    $('#waiterCustomerNameWrap').hide()
    $('#waiterCustomerName').val('')
  }
})

$('body').on('click', '.waiter-table-btn', function() {
  const name = String($(this).data('name') || '').trim()
  const tableId = Number($(this).data('id') || 0)
  const areaId = Number($(this).data('area-id') || 0)
  if (areaId) WAITER_SELECTED_AREA_ID = areaId
  setWaiterSelectedTable({ id: tableId, name: name })
  renderWaiterTableGrid()
})

$('body').on('click', '.waiter-area-btn', function() {
  const areaId = Number($(this).data('id') || 0)
  if (!areaId) return
  WAITER_SELECTED_AREA_ID = areaId
  $('#place_where').val('')
  $('#the_table_id').val('0')
  renderWaiterTableGrid()
})

$('body').on('click', '.waiter-table-back-btn', function() {
  WAITER_SELECTED_AREA_ID = 0
  renderWaiterTableGrid()
})

$('body').on('click', '#waiterSubmitOrderBtn', function() {
  submitWaiterOrder()
})

$('#refreshWaiterOrders').on('click', function() {
  loadWaiterOrders()
})

// ---- Pay Order Modal ----
let WAITER_PAY_ORDER_ID = 0

$('body').on('click', '.waiterPayOrder', function(e) {
  e.stopPropagation()
  WAITER_PAY_ORDER_ID = Number($(this).data('id') || 0)
  const amount = Number($(this).data('amount') || 0)
  const paid = Number($(this).data('paid') || 0)
  const remaining = Number($(this).data('remaining') || Math.max(0, amount - paid))

  $('#waiterPaySummaryTotal').text(Number(amount).toLocaleString())
  $('#waiterPaySummaryPaid').text(Number(paid).toLocaleString())
  $('#waiterPaySummaryRemaining').text(Number(remaining).toLocaleString())
  $('#waiterPayAmountInput').val(remaining > 0 ? remaining : '')
  $('#waiterPayAccSelect').val('').trigger('change')
  $('#waiterPayCustomerName').val('')
  $('#waiterPayCustomerWrap').hide()
  $('#waiterPayModal').modal('show')
})

$('body').on('change', '#waiterPayAccSelect', function() {
  $('#waiterPayAccCards').removeClass('border-danger')
  const aina = waiterSelectedAccount('#waiterPayAccSelect').aina

  renderWaiterPaymentCards('#waiterPayAccSelect', '#waiterPayAccCards', 'waiter-pay-acc-radio')

  if (aina && aina.toLowerCase() !== 'cash') {
    $('#waiterPayCustomerWrap').show()
  } else {
    $('#waiterPayCustomerWrap').hide()
    $('#waiterPayCustomerName').val('')
  }
})

$('body').on('change', 'input[name="waiter-pay-method-radio"]', function() {
  const value = String($(this).data('value') || '')
  $('#waiterPayMethod').val(value).trigger('change')
  $('input[name="waiter-pay-method-radio"]').closest('.pay-account-card').removeClass('active')
  $(this).closest('.pay-account-card').addClass('active')
})

$('body').on('change', 'input[name="waiter-pay-acc-radio"]', function() {
  const value = String($(this).data('value') || '')
  $('#waiterPayAccSelect').val(value).trigger('change')
  $('input[name="waiter-pay-acc-radio"]').closest('.pay-account-card').removeClass('active')
  $(this).closest('.pay-account-card').addClass('active')
})

$('body').on('click', '#waiterSubmitPayBtn', function() {
  submitWaiterPayment()
})

function submitWaiterPayment() {
  const amount = Number($('#waiterPayAmountInput').val() || 0)
  const payAcc = waiterSelectedAccount('#waiterPayAccSelect')
  const akaunt = Number(payAcc.id || 0)
  const customerName = String($('#waiterPayCustomerName').val() || '').trim()

  if (amount <= 0) {
    toastr.warning(waiterLang('Weka kiasi cha malipo', 'Enter payment amount'), '', { timeOut: 3000 })
    return
  }
  if (!akaunt) {
    $('#waiterPayAccCards').addClass('border-danger')
    toastr.warning(waiterLang('Chagua njia ya malipo', 'Select payment method'), '', { timeOut: 3000 })
    return
  }

  $('#waiterSubmitPayBtn').prop('disabled', true)

  const req = POSTREQUEST({
    data: waiterDeviceRequest({
      order: WAITER_PAY_ORDER_ID,
      amount: amount,
      akaunt: akaunt,
      customer_name: customerName,
    }),
    url: '/mauzo/waiter_pay_order'
  })

  req.then(resp => {
    $('#waiterSubmitPayBtn').prop('disabled', false)
    if (resp.success) {
      toastr.success(waiterLang('Malipo yamerekodiwa', 'Payment recorded'), 'OK', { timeOut: 3000 })
      $('#waiterPayModal').modal('hide')
      loadWaiterOrders()
    } else {
      toastr.error(resp.msg || waiterLang('Hitilafu', 'Error'), '', { timeOut: 4000 })
    }
  }).catch(() => {
    $('#waiterSubmitPayBtn').prop('disabled', false)
    toastr.error(waiterLang('Hitilafu ya mtandao', 'Network error'), '', { timeOut: 4000 })
  })
}

$(document).ready(function() {
  renderWaiterPaymentCards('#waiterPayMethod', '#waiterPayMethodCards', 'waiter-pay-method-radio')
  renderWaiterPaymentCards('#waiterPayAccSelect', '#waiterPayAccCards', 'waiter-pay-acc-radio')
  switchWaiterRightPanel(waiterIsMobileLayout() ? 'items' : 'current')
  initializeWaiterItems()
  renderWaiterCart()
  loadWaiterOrders()
})

$(window).on('resize', function() {
  renderWaiterRightPanel()
})

$('body').on('click', '#user-exit-btn', function(ev) {
  ev.preventDefault()

  const target = $(this)
  target.addClass('disabled')

  const req = POSTREQUEST({
    data: waiterDeviceRequest({}),
    url: '/mauzo/waiter_device_exit'
  })

  req.then(resp => {
    if (resp && resp.success) {
      window.location.href = String(resp.redirect || `/mauzo/waiter_pos?biz=${encodeURIComponent(WAITER_DEVICE_BIZ || 0)}&device_id=${encodeURIComponent(WAITER_DEVICE_ID || '')}`)
      return
    }

    toastr.warning((resp && resp.msg) || waiterLang('Imeshindikana kutoka', 'Failed to exit waiter'), waiterLang('Taarifa', 'Info'), { timeOut: 3000 })
    target.removeClass('disabled')
  }).catch(() => {
    toastr.error(waiterLang('Hitilafu ya mtandao', 'Network error'), waiterLang('Taarifa', 'Info'), { timeOut: 3000 })
    target.removeClass('disabled')
  })
})
