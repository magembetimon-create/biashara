function stockSideCsrf() {
    return $('input[name=csrfmiddlewaretoken]').val()
}

function stockSidePost(url, data) {
    data.csrfmiddlewaretoken = stockSideCsrf()
    return $.post(url, data)
}

let STOCK_SIDES = Array.isArray(window.STOCK_SIDES_INIT) ? window.STOCK_SIDES_INIT : []

function renderStockSides() {
    const host = $('#stock-sides-host')
    if (!STOCK_SIDES.length) {
        host.html(`<p class="p-3 text-muted">${lang('Hakuna pande bado. Ongeza upande kama Kulia, Kushoto au Nyuma.', 'No sides yet. Add a side such as Right, Left or Back.')}</p>`)
        return
    }
    let html = ''
    STOCK_SIDES.forEach(side => {
        const cats = (side.aina_ids || []).length
        html += `<div class="card mb-3">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <strong class="text-capitalize">${$('<div>').text(side.name).html()}</strong>
            <span>
              <button type="button" class="btn btn-sm btn-light edit-stock-side" data-id="${side.id}">${lang('Hariri','Edit')}</button>
              <button type="button" class="btn btn-sm btn-outline-danger delete-stock-side" data-id="${side.id}">&times;</button>
            </span>
          </div>
          <div class="card-body">
            <p class="smallFont text-muted mb-2">${lang('Aina zilizounganishwa','Linked categories')}: ${cats}</p>
            <div class="row">
              <div class="col-md-6">
                <h6>${lang('Mistari (lazima)','Rows (required)')}</h6>
                <ul class="list-unstyled mb-2" id="side-rows-${side.id}">${slotListHtml(side.rows, side.id, 'row')}</ul>
                <div class="input-group input-group-sm">
                  <input class="form-control slot-name" data-side="${side.id}" data-kind="row" placeholder="${lang('Ongeza mstari','Add row')}">
                  <div class="input-group-append">
                    <button class="btn btn-outline-primary add-slot" data-side="${side.id}" data-kind="row">+</button>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6>${lang('Safu (si lazima)','Columns (optional)')}</h6>
                <ul class="list-unstyled mb-2">${slotListHtml(side.columns, side.id, 'col')}</ul>
                <div class="input-group input-group-sm">
                  <input class="form-control slot-name" data-side="${side.id}" data-kind="col" placeholder="${lang('Ongeza safu','Add column')}">
                  <div class="input-group-append">
                    <button class="btn btn-outline-primary add-slot" data-side="${side.id}" data-kind="col">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`
    })
    host.html(html)
}

function slotListHtml(list, sideId, kind) {
    if (!list || !list.length) {
        return `<li class="text-muted smallFont">${lang('Hakuna','None')}</li>`
    }
    return list.map(s => `<li class="d-flex justify-content-between border-bottom py-1">
        <span>${$('<div>').text(s.name).html()}</span>
        <button type="button" class="btn btn-sm btn-link text-danger delete-slot" data-side="${sideId}" data-kind="${kind}" data-id="${s.id}">&times;</button>
    </li>`).join('')
}

function applySides(res) {
    if (res && res.sides) {
        STOCK_SIDES = res.sides
        renderStockSides()
    }
}

$('#addStockSideBtn').on('click', function () {
    $('#sideEditId').val(0)
    $('#sideEditName').val('')
    $('#sideEditAina option').prop('selected', false)
    $('#stockSideModal').modal('show')
})

$('body').on('click', '.edit-stock-side', function () {
    const id = Number($(this).data('id'))
    const side = STOCK_SIDES.find(s => s.id === id)
    if (!side) return
    $('#sideEditId').val(id)
    $('#sideEditName').val(side.name)
    $('#sideEditAina option').prop('selected', false)
    ;(side.aina_ids || []).forEach(aid => {
        $('#sideEditAina option[value="' + aid + '"]').prop('selected', true)
    })
    $('#stockSideModal').modal('show')
})

$('#saveStockSideBtn').on('click', function () {
    const aina = $('#sideEditAina').val() || []
    stockSidePost('/stoku/stockSideSave', {
        id: $('#sideEditId').val(),
        name: $('#sideEditName').val(),
        aina_csv: aina.join(','),
    }).done(function (res) {
        if (res.success) {
            $('#stockSideModal').modal('hide')
            applySides(res)
            toastr.success(lang(res.msg_swa || 'Imehifadhiwa', res.msg_eng || 'Saved'))
        } else {
            toastr.error(lang(res.msg_swa || 'Haikufanikiwa', res.msg_eng || 'Failed'))
        }
    })
})

$('body').on('click', '.delete-stock-side', function () {
    if (!confirm(lang('Futa upande huu?', 'Delete this side?'))) return
    stockSidePost('/stoku/stockSideDelete', { id: $(this).data('id') }).done(applySides)
})

$('body').on('click', '.add-slot', function () {
    const side = $(this).data('side')
    const kind = $(this).data('kind')
    const input = $(`.slot-name[data-side="${side}"][data-kind="${kind}"]`)
    stockSidePost('/stoku/stockSideSlotSave', {
        side,
        kind: kind === 'col' ? 'col' : 'row',
        name: input.val(),
    }).done(function (res) {
        if (res.success) {
            applySides(res)
        } else {
            toastr.error(lang(res.msg_swa || 'Haikufanikiwa', res.msg_eng || 'Failed'))
        }
    })
})

$('body').on('click', '.delete-slot', function () {
    stockSidePost('/stoku/stockSideSlotDelete', {
        side: $(this).data('side'),
        kind: $(this).data('kind') === 'col' ? 'col' : 'row',
        id: $(this).data('id'),
    }).done(applySides)
})

$(function () {
    renderStockSides()
})
