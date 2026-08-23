
$(document).ready(function () {
  $('#trackFrom').val(moment().startOf('month').format('YYYY-MM-DD'))
  $('#trackTo').val(moment().format('YYYY-MM-DD'))

  $('#itemTrackSearch').autocomplete({
    minLength: 1,
    source: function (request, response) {
      $.ajax({
        type: 'POST',
        url: '/riport/ItemTrackSearch',
        data: {
          q: request.term,
          d: $('#Matawini').val(),
          csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }
      }).then(function (data) {
        const items = (data && data.items) ? data.items : []
        response(items.map(function (it) {
          return {
            label: it.label,
            value: it.label,
            id: it.id,
            unit: it.unit || '',
            name: it.name
          }
        }))
      }).catch(function () {
        response([])
      })
    },
    select: function (e, ui) {
      $('#selectedBidhaa').val(ui.item.id)
      $('#itemTrackSearch').val(ui.item.label)
      loadItemTrack()
    }
  })

  $('#itemTrackSearch').on('input', function () {
    $('#selectedBidhaa').val('')
  })
})

function kindLabel(kind) {
  const map = {
    purchase: lang('Manunuzi', 'Purchase'),
    added: lang('Kuongezwa', 'Added'),
    production: lang('Uzalishaji', 'Production'),
    received: lang('Kupokea (uhamisho)', 'Received (transfer)'),
    sale: lang('Mauzo', 'Sale'),
    sale_return: lang('Kurudisha mauzo', 'Sales return'),
    damage: lang('Kuharibika', 'Damaged'),
    lost: lang('Kupotea', 'Lost'),
    expire: lang('Muda umepita', 'Expired'),
    used: lang('Matumizi', 'Used'),
    used_production: lang('Tumika uzalishaji', 'Used in production'),
    transfer_out: lang('Kuhamisha nje', 'Transferred out'),
    pu_return: lang('Kurudisha manunuzi', 'Purchase return'),
    adjust: lang('Marekebisho', 'Adjustment'),
    registered: lang('Usajili', 'Registered')
  }
  return map[kind] || kind
}

function qtyCell(n) {
  const v = Number(n) || 0
  if (!v) return ''
  return floatValue(v)
}

function loadItemTrack() {
  const bidhaa = Number($('#selectedBidhaa').val() || 0)
  if (!bidhaa) {
    toastr.warning(lang('Chagua bidhaa kwanza', 'Select an item first'), lang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }
  const from = $('#trackFrom').val()
  const to = $('#trackTo').val()
  if (!from || !to) {
    toastr.warning(lang('Weka tarehe ya kuanzia na hadi', 'Set from and to dates'), lang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }
  const tf = moment(from).startOf('day').format()
  const tt = moment(to).endOf('day').format()

  $('#loadMe').modal('show')
  $.ajax({
    type: 'POST',
    url: '/riport/ItemTrackData',
    data: {
      bidhaa: bidhaa,
      d: $('#Matawini').val(),
      tf: tf,
      tt: tt,
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
  }).then(function (resp) {
    $('#loadMe').modal('hide')
    hideLoading()
    if (!resp || !resp.success) {
      toastr.error(lang('Taarifa hazikupatikana', 'Could not load data'), lang('Hitilafu', 'Error'), { timeOut: 3000 })
      return
    }
    renderItemTrack(resp, from, to)
  }).catch(function () {
    $('#loadMe').modal('hide')
    hideLoading()
    toastr.error(lang('Hitilafu ya muunganiko', 'Connection error'), lang('Hitilafu', 'Error'), { timeOut: 3000 })
  })
}

function renderItemTrack(resp, from, to) {
  const item = resp.item || {}
  const unit = item.unit ? ` (${item.unit})` : ''
  $('#itemTrackEmpty').hide()
  $('#itemTrackResult').show()
  $('#PrintItemTrack').show()
  $('#itemTrackTitle').text((item.name || '') + (item.namba ? ' — ' + item.namba : '') + (item.aina ? ' · ' + item.aina : ''))
  $('#itemTrackPeriod').html(
    lang('Kuanzia', 'From') + ' <span class="brown">' + moment(from).format('DD/MM/YYYY') + '</span> ' +
    lang('hadi', 'to') + ' <span class="brown">' + moment(to).format('DD/MM/YYYY') + '</span>' +
    (unit ? ' · ' + lang('Kipimo', 'Unit') + ': ' + item.unit : '')
  )

  $('#itemTrackSummary').html(`
    <tr class="weight600" style="background-color: rgba(160, 57, 49, 0.13)">
      <td>${lang('Idadi kufungua','Opening qty')}</td>
      <td class="text-right">${floatValue(resp.open_qty)}</td>
    </tr>
    <tr>
      <td>${lang('Zilizoingia','In')}</td>
      <td class="text-right" style="color:green">${floatValue(resp.qty_in)}</td>
    </tr>
    <tr>
      <td>${lang('Zilizotoka','Out')}</td>
      <td class="text-right" style="color:brown">${floatValue(resp.qty_out)}</td>
    </tr>
    <tr class="weight600">
      <td>${lang('Idadi kufunga','Closing qty')}</td>
      <td class="text-right">${floatValue(resp.close_qty)}</td>
    </tr>
    <tr>
      <td class="text-muted">${lang('Idadi sasa','Current qty')}</td>
      <td class="text-right text-muted">${floatValue(resp.current_qty)}</td>
    </tr>
  `)

  const events = resp.events || []
  if (!events.length) {
    $('#itemTrackBody').html(`<tr><td colspan="7" class="text-muted">${lang('Hakuna miamala kwenye muda huu','No movements in this period')}</td></tr>`)
    return
  }

  let rows = `
    <tr>
      <td>${moment(from).format('DD/MM/YYYY')}</td>
      <td class="weight600">${lang('Kianzio','Opening')}</td>
      <td></td>
      <td></td>
      <td class="text-right weight600">${floatValue(resp.open_qty)}</td>
      <td></td>
      <td></td>
    </tr>`

  events.forEach(function (ev) {
    const note = ev.note ? ` <span class="text-muted smallFont">${ev.note}</span>` : ''
    rows += `
      <tr>
        <td class="noWordCut">${ev.tarehe ? moment(ev.tarehe).format('DD/MM/YYYY HH:mm') : ''}</td>
        <td>${kindLabel(ev.kind)}${note}</td>
        <td class="text-right" style="color:green">${qtyCell(ev.qty_in)}</td>
        <td class="text-right" style="color:brown">${qtyCell(ev.qty_out)}</td>
        <td class="text-right">${floatValue(ev.balance)}</td>
        <td>${ev.code || ''}</td>
        <td>${ev.dukaN || ''}</td>
      </tr>`
  })

  rows += `
    <tr class="weight600">
      <td>${moment(to).format('DD/MM/YYYY')}</td>
      <td>${lang('Kufunga','Closing')}</td>
      <td></td>
      <td></td>
      <td class="text-right">${floatValue(resp.close_qty)}</td>
      <td></td>
      <td></td>
    </tr>`

  $('#itemTrackBody').html(rows)
}

$('body').on('click', '#PrintItemTrack', function () {
  const result = document.getElementById('itemTrackResult')
  if (!result || result.style.display === 'none') {
    toastr.warning(lang('Onesha ripoti kwanza', 'Show the report first'), lang('Taarifa', 'Info'), { timeOut: 2500 })
    return
  }
  const dukaName = $('#itemTrackDuka').val() || ''
  const printedBy = ($('#itemTrackUser').val() || '').trim()
  const title = ($('#itemTrackTitle').text() || '').trim()
  const period = ($('#itemTrackPeriod').text() || '').trim()
  const printDate = moment().format('ddd, DD MMM YYYY HH:mm')
  const clone = result.cloneNode(true)
  clone.querySelectorAll('button').forEach(function (el) { el.remove() })

  const html = '<!DOCTYPE html>\n<html><head><meta charset="UTF-8"><title>' + dukaName + ' — ' +
    lang('Mwenendo wa Bidhaa', 'Item Movement Track') + '</title><style>' +
    'body{font-family:Arial,sans-serif;font-size:12px;color:#222;padding:16px}' +
    'h2,h4{margin:0 0 4px;text-align:center} table{width:100%;border-collapse:collapse;margin-top:10px}' +
    'th,td{border:1px solid #ccc;padding:4px 7px} thead th{background:#f0f0f0}' +
    '.text-right{text-align:right} .print-meta{text-align:center;color:#555;margin-bottom:12px}' +
    '</style></head><body>' +
    '<h2>' + dukaName + '</h2>' +
    '<h4>' + lang('Mwenendo wa Bidhaa', 'Item Movement Track') + '</h4>' +
    '<div class="print-meta"><strong>' + title + '</strong><br>' + period +
    (printedBy ? '<br>' + lang('Aliyechapisha', 'Printed by') + ': ' + printedBy : '') +
    ' · ' + printDate + '</div>' +
    clone.innerHTML +
    '<script>window.onload=function(){window.print();}<\/script></body></html>'

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  } else {
    toastr.warning(lang('Ruhusu popup ili kuprint', 'Allow popups to print'), lang('Taarifa', 'Info'), { timeOut: 3000 })
  }
})
