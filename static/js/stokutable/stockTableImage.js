function stockImgPlaceholderSvg() {
    return `<svg width="2.4625em" height="2.4em" viewBox="0 0 17 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v9l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15.002 9.5V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>`
}

function stockImgCellHtml(bidhaaId, stockId, name, imge) {
    let url = ''
    for (const im in imge) {
        if (Number(imge[im].bidhaa) === Number(bidhaaId)) {
            url = imge[im].picha__picha
        }
    }
    const safeName = String(name || '').replace(/"/g, '&quot;').replace(/</g, '')
    const inner = url
        ? `<img src="${url}" style="max-width:3.9625em;max-height:3.9em">`
        : stockImgPlaceholderSvg()
    return `<div class="stock-item-img" data-bidhaa="${bidhaaId}" data-stock="${stockId}" data-name="${safeName}" style="cursor:pointer;display:inline-block" title="${lang('Ongeza picha', 'Add image')}">${inner}</div>`
}

function applyStockTableImage(bidhaaId, response) {
    const pics = (response.img || []).filter(p => Number(p.bidhaa) === Number(bidhaaId))
    const last = pics.length ? pics[pics.length - 1] : null
    const url = last && last.picha__picha
    if (!url) return
    if (typeof ItemImg !== 'undefined' && ItemImg.state) {
        ItemImg.state = (ItemImg.state || []).filter(p => Number(p.bidhaa) !== Number(bidhaaId)).concat(pics)
    }
    $(`.stock-item-img[data-bidhaa="${bidhaaId}"]`).html(
        `<img src="${url}" style="max-width:3.9625em;max-height:3.9em">`
    )
}

if (window.__stockTableImageBound) {
    // already wired — avoid double preview / double upload
} else {
window.__stockTableImageBound = true

$(function () {
    $('body').off('click.stockTableImg', '.stock-item-img').on('click.stockTableImg', '.stock-item-img', function (e) {
        e.preventDefault()
        e.stopPropagation()
        const $el = $(this)
        const stockId = $el.data('stock')
        if (!stockId) return
        $('#table-save-produ-img').data('itm', stockId)
        $('#table-save-produ-img').data('bidhaa', $el.data('bidhaa'))
        $('#table-preview-item-name').text($el.data('name') || '')
        const input = document.getElementById('table-produ-pic')
        if (!input) return
        input.value = ''
        input.click()
    })

    $('#table-produ-pic').off('change.stockTableImg').on('change.stockTableImg', function () {
        const input = this
        const preview = $('#table_image_preview')
        preview.html('')
        if (!input.files || !input.files.length) return
        for (let i = 0; i < input.files.length; i++) {
            const reader = new FileReader()
            reader.onload = function (event) {
                preview.append(`<div class="col-12 mb-2"><img src="${event.target.result}" style="width:100%"></div>`)
            }
            reader.readAsDataURL(input.files[i])
        }
        $('#tablePreviewModal').modal('show')
    })

    $('#table-save-produ-img').off('submit.stockTableImg').on('submit.stockTableImg', function (e) {
        e.preventDefault()
        e.stopImmediatePropagation()
        const url = $(this).attr('action')
        const imgIn = document.getElementById('table-produ-pic')
        const itm = $(this).data('itm')
        const bidhaa = $(this).data('bidhaa')
        const color = 0
        if (!imgIn || !imgIn.files || !imgIn.files.length || !itm) return

        IMGFORM.append('hold-color-id', color)
        IMGFORM.append('hold-produ-id', itm)
        $('#tablePreviewModal').modal('hide')
        IMGFORM.append('IMG', null)

        for (let i = 0; i < imgIn.files.length; i++) {
            IMGFORM.delete('IMG')
            const img = imgIn.files[i]
            const last = i === (imgIn.files.length - 1)
            let theData = { url }
            if (last) {
                theData.onSuccess = function (response) {
                    applyStockTableImage(bidhaa, response)
                    imgIn.value = ''
                }
            }
            if (Number(img.size / 1024) <= 490) {
                IMGFORM.append('IMG', img)
                ImageUpload(theData)
            } else {
                theData.img = img
                compressImg(theData)
            }
            if (last) {
                IMGFORM.delete('hold-color-id')
                IMGFORM.delete('hold-produ-id')
                IMGFORM.delete('IMG')
            }
        }
    })
})
}
