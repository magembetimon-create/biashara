/**
 * Unified barcode scanning: USB/HID wedge scanners + camera (mobile & desktop).
 * Session modal: top = camera or HID icon + last code; bottom = scanned items list.
 * Usage:
 *   TbBarcode.init({ onScan: function(code, source) { ... } })
 *   TbBarcode.openCamera()  // opens session modal
 *   TbBarcode.addSessionItem({ key, name, image, code })
 */
(function (window, $) {
  'use strict'

  const SCAN_GAP_MS = 60
  const MIN_CODE_LEN = 3
  const HID_TERMINATORS = new Set(['Enter', 'Tab'])
  const MODAL_SEL = '#livestream__qr_scanner'

  let config = {
    onScan: null,
    enabled: true,
    captureInput: null,
    ignoreSelector: 'textarea, [contenteditable="true"]',
    allowInputs: false,
  }

  let hidBuffer = ''
  let hidLastKeyAt = 0
  let quaggaBound = false
  let html5Scanner = null
  let html5Running = false
  let html5Stopping = false
  let sessionOpen = false
  let sessionMode = 'hid' // 'camera' | 'hid'
  let captureMode = null // null | 'session' | 'field'
  let fieldCaptureCallback = null
  let listenersBound = false
  let sessionItems = [] // { key, name, image, code, qty }

  function lang(swa, eng) {
    if (typeof window.lang === 'function') return window.lang(swa, eng)
    const luga = Number($('#luga').val())
    return luga === 0 ? swa : eng
  }

  function beep() {
    const el = document.getElementById('beep_audio')
    if (el && typeof el.play === 'function') {
      el.play().catch(function () {})
    }
  }

  function normalizeCode(raw) {
    return String(raw || '').trim()
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function defaultImage() {
    if (typeof window.__tbStatic === 'function') return window.__tbStatic('pics/img.svg')
    return '/static/pics/img.svg'
  }

  function ensureSessionDom() {
    const $modal = $(MODAL_SEL)
    if (!$modal.length) return false
    if (!$modal.find('.tb-scan-session-body').length) {
      $modal.find('.modal-dialog').addClass('modal-lg modal-dialog-centered')
      $modal.attr('data-backdrop', 'static')
      $modal.attr('data-keyboard', 'false')
      $modal.find('.modal-body').addClass('p-0').html(
        '<div class="tb-scan-session-body">' +
          '<div class="tb-scan-top">' +
            '<div id="qr_reader" class="tb-scan-camera viewport"></div>' +
            '<div id="tb-scan-hid-panel" class="tb-scan-hid-panel">' +
              '<div class="tb-scan-hid-icon" aria-hidden="true">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="currentColor" viewBox="0 0 16 16">' +
                  '<path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>' +
                  '<path d="M2 4.5a.5.5 0 0 1 .5-.5h1v8h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 .5-.5h1v8h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 .5-.5h.5v8H8.5a.5.5 0 0 1-.5-.5v-7zm2.5 0a.5.5 0 0 1 .5-.5h1v8h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 .5-.5h1v8h-1a.5.5 0 0 1-.5-.5v-7z"/>' +
                '</svg>' +
              '</div>' +
              '<p class="tb-scan-hid-hint mb-0" id="tb-scan-hid-hint"></p>' +
            '</div>' +
            '<div class="tb-scan-last-code">' +
              '<span class="tb-scan-last-label" id="tb-scan-last-label"></span> ' +
              '<strong id="tb-scan-last-code">—</strong>' +
            '</div>' +
            '<div id="qr_error" class="error tb-scan-error"></div>' +
          '</div>' +
          '<div class="tb-scan-bottom">' +
            '<div class="tb-scan-bottom-head d-flex justify-content-between align-items-center">' +
              '<strong id="tb-scan-bottom-title"></strong>' +
              '<span class="text-muted small" id="tb-scan-session-count">0</span>' +
            '</div>' +
            '<ul id="tb-scan-session-list" class="list-unstyled mb-0 tb-scan-session-list"></ul>' +
            '<div id="tb-scan-session-empty" class="text-muted text-center py-3 small"></div>' +
          '</div>' +
        '</div>'
      )
    }
    $('#tb-scan-hid-hint').text(
      lang('Tumia barcode scanner au kamera kuskani bidhaa', 'Use a barcode scanner or camera to scan items')
    )
    $('#tb-scan-last-label').text(lang('Barcode:', 'Barcode:'))
    $('#tb-scan-bottom-title').text(lang('Bidhaa zilizoskaniwa', 'Scanned items'))
    $('#tb-scan-session-empty').text(lang('Bado hakuna bidhaa. Skani barcode...', 'No items yet. Scan a barcode...'))
    $modal.find('.modal-title').text(lang('Barcode Scanner', 'Barcode Scanner'))
    $modal.find('.modal-footer .stop_qr').text(lang('Maliza / Funga', 'Done / Close'))
    return true
  }

  function setSessionMode(mode) {
    sessionMode = mode === 'camera' ? 'camera' : 'hid'
    const $cam = $('#qr_reader')
    const $hid = $('#tb-scan-hid-panel')
    if (sessionMode === 'camera') {
      $cam.show()
      $hid.attr('hidden', true)
    } else {
      $cam.hide()
      $hid.removeAttr('hidden')
    }
  }

  function setLastCode(code, source) {
    const c = normalizeCode(code)
    $('#tb-scan-last-code').text(c || '—')
    if (source === 'hid' || source === 'capture-input') {
      // Keep camera if already running; otherwise show HID panel.
      if (!html5Running) setSessionMode('hid')
    }
  }

  function renderSessionList() {
    const $list = $('#tb-scan-session-list')
    const $empty = $('#tb-scan-session-empty')
    const $count = $('#tb-scan-session-count')
    if (!$list.length) return

    const totalQty = sessionItems.reduce(function (s, it) { return s + Number(it.qty || 0) }, 0)
    $count.text(
      totalQty
        ? (lang('Jumla', 'Total') + ': ' + totalQty)
        : '0'
    )

    if (!sessionItems.length) {
      $list.empty()
      $empty.show()
      return
    }
    $empty.hide()
    $list.html(sessionItems.map(function (it) {
      const img = it.image || defaultImage()
      return (
        '<li class="tb-scan-session-item d-flex align-items-center">' +
          '<img class="tb-scan-session-img" src="' + escapeHtml(img) + '" alt="" loading="lazy">' +
          '<div class="tb-scan-session-meta flex-grow-1 min-width-0">' +
            '<div class="tb-scan-session-name text-capitalize text-truncate">' + escapeHtml(it.name || '') + '</div>' +
            '<div class="tb-scan-session-code text-muted small text-truncate">' + escapeHtml(it.code || '') + '</div>' +
          '</div>' +
          '<div class="tb-scan-session-qty">' +
            '<span class="badge badge-primary">' + Number(it.qty || 0) + '</span>' +
          '</div>' +
        '</li>'
      )
    }).join(''))
  }

  function clearSession() {
    sessionItems = []
    $('#tb-scan-last-code').text('—')
    $('#qr_error').text('')
    renderSessionList()
  }

  function addSessionItem(item) {
    if (!item || !item.key) return null
    const key = String(item.key)
    let row = sessionItems.find(function (x) { return String(x.key) === key })
    if (row) {
      row.qty = Number(row.qty || 0) + 1
      if (item.name) row.name = item.name
      if (item.image) row.image = item.image
      if (item.code) row.code = item.code
    } else {
      row = {
        key: key,
        name: item.name || '',
        image: item.image || defaultImage(),
        code: item.code || '',
        qty: 1,
      }
      sessionItems.unshift(row)
    }
    renderSessionList()
    return row
  }

  function markNotFound(code) {
    setLastCode(code)
    $('#qr_error').text(lang('Barcode haijapatikana: ', 'Barcode not found: ') + normalizeCode(code))
  }

  function markFound(code) {
    setLastCode(code)
    $('#qr_error').text('')
  }

  function finishFieldCapture(code) {
    code = normalizeCode(code)
    if (!code || code.length < MIN_CODE_LEN) return
    beep()
    setLastCode(code)
    const cb = fieldCaptureCallback
    fieldCaptureCallback = null
    captureMode = null
    stopCamera()
    // Close after a tick so the last-code UI can paint briefly.
    $(MODAL_SEL).modal('hide')
    if (typeof cb === 'function') {
      try { cb(code) } catch (err) { console.error(err) }
    }
  }

  function dispatchScan(code, source) {
    code = normalizeCode(code)
    if (!code || code.length < MIN_CODE_LEN) return

    // One-shot register/edit capture: fill field / search, then close.
    if (captureMode === 'field') {
      finishFieldCapture(code)
      return
    }

    beep()
    if (sessionOpen) {
      setLastCode(code, source)
    }
    if (typeof config.onScan === 'function') {
      config.onScan(code, source || 'unknown')
    }
  }

  function isIgnoredTarget(el) {
    if (!el) return false
    if (el.classList && el.classList.contains('tb-barcode-capture')) return false
    if (config.allowInputs) return false
    if (el.closest && el.closest('.tb-barcode-allow-input')) return false
    // While session modal is open, allow HID even if focus is inside the modal.
    if (sessionOpen && el.closest && el.closest(MODAL_SEL)) return false
    const tag = (el.tagName || '').toLowerCase()
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
    if (el.isContentEditable) return true
    return false
  }

  function resetHidBuffer() {
    hidBuffer = ''
    hidLastKeyAt = 0
  }

  function handleHidKeydown(e) {
    if (!config.enabled) return
    if (!config.onScan && captureMode !== 'field') return
    if (isIgnoredTarget(e.target)) return

    const now = Date.now()
    if (hidLastKeyAt && (now - hidLastKeyAt) > SCAN_GAP_MS) {
      hidBuffer = ''
    }
    hidLastKeyAt = now

    if (HID_TERMINATORS.has(e.key)) {
      if (hidBuffer.length >= MIN_CODE_LEN) {
        e.preventDefault()
        dispatchScan(hidBuffer, 'hid')
      }
      resetHidBuffer()
      return
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      hidBuffer += e.key
    }
  }

  function handleCaptureInput(e) {
    const val = normalizeCode(e.target.value)
    if (!val) return
    if (e.key === 'Enter' || e.type === 'change') {
      e.preventDefault()
      dispatchScan(val, 'capture-input')
      e.target.value = ''
    }
  }

  function ensureCaptureInput() {
    let el = document.getElementById('tbBarcodeCapture')
    if (!el) {
      el = document.createElement('input')
      el.type = 'text'
      el.id = 'tbBarcodeCapture'
      el.className = 'tb-barcode-capture'
      el.setAttribute('autocomplete', 'off')
      el.setAttribute('autocapitalize', 'off')
      el.setAttribute('spellcheck', 'false')
      el.setAttribute('aria-hidden', 'true')
      el.setAttribute('tabindex', '-1')
      document.body.appendChild(el)
    }
    return el
  }

  function focusCapture() {
    const el = ensureCaptureInput()
    if (document.activeElement && isIgnoredTarget(document.activeElement)) return
    try {
      el.focus({ preventScroll: true })
    } catch (err) {
      el.focus()
    }
  }

  function stopCamera() {
    if (window.Quagga && typeof Quagga.stop === 'function') {
      try { Quagga.stop() } catch (err) {}
    }
    if (!html5Scanner || typeof html5Scanner.stop !== 'function') return
    if (!html5Running || html5Stopping) return

    html5Stopping = true
    html5Running = false
    try {
      const stopped = html5Scanner.stop()
      if (stopped && typeof stopped.then === 'function') {
        stopped.then(function () {
          html5Stopping = false
        }).catch(function () {
          html5Stopping = false
        })
      } else {
        html5Stopping = false
      }
    } catch (err) {
      html5Stopping = false
    }
  }

  function bindQuagga() {
    if (quaggaBound || !window.Quagga) return
    quaggaBound = true
  }

  function startHtml5Camera() {
    if (typeof Html5Qrcode === 'undefined') {
      setSessionMode('hid')
      $('#qr_error').text(lang('Kamera haipatikani, tumia barcode scanner', 'Camera unavailable — use a barcode scanner'))
      return
    }

    if (!html5Scanner) {
      html5Scanner = new Html5Qrcode('qr_reader')
    }

    const qrConfig = {
      fps: 10,
      qrbox: { width: 280, height: 140 },
    }
    if (typeof Html5QrcodeSupportedFormats !== 'undefined') {
      qrConfig.formatsToSupport = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ]
    }

    function launchScanner() {
      Html5Qrcode.getCameras().then(function (devices) {
        if (!devices || !devices.length) {
          setSessionMode('hid')
          $('#qr_error').text(lang('Kamera haipatikani, tumia barcode scanner', 'Camera unavailable — use a barcode scanner'))
          return
        }
        const cameraId = devices.length > 1
          ? { facingMode: 'environment' }
          : devices[0].id

        if (html5Running) return

        setSessionMode('camera')
        html5Scanner.start(
          cameraId,
          qrConfig,
          function (decodedText) {
            if (captureMode === 'field') {
              finishFieldCapture(decodedText)
              return
            }
            // Keep session + camera running for continuous scans.
            dispatchScan(decodedText, 'camera')
          },
          function () {}
        ).then(function () {
          html5Running = true
          html5Stopping = false
          setSessionMode('camera')
          $('#qr_error').text('')
        }).catch(function (err) {
          html5Running = false
          html5Stopping = false
          setSessionMode('hid')
          $('#qr_error').text(String(err))
        })
      }).catch(function (err) {
        setSessionMode('hid')
        $('#qr_error').text(String(err))
      })
    }

    if (html5Running) {
      html5Stopping = true
      html5Running = false
      try {
        const stopped = html5Scanner.stop()
        if (stopped && typeof stopped.then === 'function') {
          stopped.then(function () {
            html5Stopping = false
            launchScanner()
          }).catch(function () {
            html5Stopping = false
            launchScanner()
          })
        } else {
          html5Stopping = false
          launchScanner()
        }
      } catch (err) {
        html5Stopping = false
        launchScanner()
      }
    } else {
      launchScanner()
    }
  }

  function ensureListeners() {
    if (listenersBound) return
    listenersBound = true
    document.addEventListener('keydown', handleHidKeydown, true)
    const cap = ensureCaptureInput()
    cap.addEventListener('keydown', handleCaptureInput)
    cap.addEventListener('change', handleCaptureInput)
    bindQuagga()
    bindModalEvents()
  }

  function setUiForCaptureMode(mode) {
    const $bottom = $('.tb-scan-bottom')
    const $body = $('.tb-scan-session-body')
    if (mode === 'field') {
      $bottom.hide()
      $body.addClass('tb-scan-field-mode')
      $(MODAL_SEL).find('.modal-title').text(lang('Skani Barcode', 'Scan Barcode'))
      $(MODAL_SEL).find('.modal-footer .stop_qr').text(lang('Funga', 'Close'))
      $('#tb-scan-hid-hint').text(
        lang('Skani barcode ili kuijaza kwenye field', 'Scan a barcode to fill the field')
      )
    } else {
      $bottom.show()
      $body.removeClass('tb-scan-field-mode')
      $(MODAL_SEL).find('.modal-title').text(lang('Barcode Scanner', 'Barcode Scanner'))
      $(MODAL_SEL).find('.modal-footer .stop_qr').text(lang('Maliza / Funga', 'Done / Close'))
      $('#tb-scan-hid-hint').text(
        lang('Tumia barcode scanner au kamera kuskani bidhaa', 'Use a barcode scanner or camera to scan items')
      )
    }
  }

  function openSession() {
    ensureListeners()
    ensureSessionDom()
    captureMode = 'session'
    fieldCaptureCallback = null
    sessionOpen = true
    clearSession()
    setUiForCaptureMode('session')
    setSessionMode('hid')
    $(MODAL_SEL).modal({ backdrop: 'static', keyboard: false, show: true })

    if (typeof Html5Qrcode !== 'undefined') {
      startHtml5Camera()
    } else {
      setSessionMode('hid')
    }

    setTimeout(focusCapture, 300)
  }

  /**
   * One-shot capture for item register / edit / other-branch search.
   * On first successful scan: callback(code) then close modal.
   */
  function openFieldCapture(opts) {
    opts = opts || {}
    ensureListeners()
    ensureSessionDom()
    captureMode = 'field'
    fieldCaptureCallback = typeof opts.onCode === 'function' ? opts.onCode : null
    sessionOpen = true
    clearSession()
    setUiForCaptureMode('field')
    setSessionMode('hid')
    $(MODAL_SEL).modal({ backdrop: true, keyboard: true, show: true })

    if (typeof Html5Qrcode !== 'undefined') {
      startHtml5Camera()
    } else {
      setSessionMode('hid')
    }

    setTimeout(focusCapture, 300)
  }

  function closeSessionCleanup() {
    sessionOpen = false
    const wasField = captureMode === 'field'
    captureMode = null
    fieldCaptureCallback = null
    stopCamera()
    $('.tb-scan-bottom').show()
    $('.tb-scan-session-body').removeClass('tb-scan-field-mode')
    if (!wasField) {
      setTimeout(focusCapture, 200)
    }
  }

  function bindModalEvents() {
    $(MODAL_SEL)
      .off('hide.bs.modal.tbbarcode')
      .on('hide.bs.modal.tbbarcode', function () {
        closeSessionCleanup()
      })
      .off('shown.bs.modal.tbbarcode')
      .on('shown.bs.modal.tbbarcode', function () {
        setTimeout(focusCapture, 200)
      })
  }

  const TbBarcode = {
    init: function (opts) {
      config = Object.assign({}, config, opts || {})
      document.removeEventListener('keydown', handleHidKeydown, true)
      listenersBound = false
      ensureListeners()
      ensureSessionDom()

      $(document).off('click.tbbarcode', '.tb-open-barcode-camera').on('click.tbbarcode', '.tb-open-barcode-camera', function (e) {
        e.preventDefault()
        openSession()
      })

      setTimeout(focusCapture, 500)
      $(window).off('focus.tbbarcode').on('focus.tbbarcode', function () {
        if (!sessionOpen) setTimeout(focusCapture, 200)
      })
    },

    openCamera: openSession,
    openSession: openSession,
    openFieldCapture: openFieldCapture,
    focusCapture: focusCapture,
    scan: dispatchScan,
    setEnabled: function (flag) {
      config.enabled = !!flag
    },
    stopCamera: stopCamera,
    isSessionOpen: function () {
      return sessionOpen && captureMode === 'session'
    },
    isFieldCaptureOpen: function () {
      return sessionOpen && captureMode === 'field'
    },
    addSessionItem: addSessionItem,
    markNotFound: markNotFound,
    markFound: markFound,
    setLastCode: setLastCode,
    clearSession: clearSession,
    getSessionItems: function () {
      return sessionItems.slice()
    },
  }

  window.TbBarcode = TbBarcode
})(window, jQuery)
