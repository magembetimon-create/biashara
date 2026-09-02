function fillStockItemEditModal(itm) {
    if (!itm) return
    const uwiano = Number(itm.uwiano) || 1
    const idadi = Number(itm.idadi) || 0
    const jumlaOnShelf = uwiano > 0 ? Math.floor(idadi / uwiano) : idadi
    const aina = itm.aina || 0
    const chapa = itm.kampuni || itm.brandId || 0
    const supplier = itm.msambaji_id || 0

    $('#kuediti-bidhaa-form').data('value', itm.id)
    $('#kuediti-bidhaa-form').data('bidhaa', itm.bidhaa_id || itm.bidhaa || 0)
    $('#kuedit_jina_la-bidhaa').val(itm.bidhaaN || '')
    $('#kuedit-bidhaa-aina').data('val', aina)
    $('#kuedit-bidhaa-chapa').data('val', chapa)
    $('#bar_code_place').val(itm.sirio || '').attr('placeholder', itm.sirio || '')
    $('#item_namba_place').val(itm.namba || '').attr('placeholder', itm.namba || '')
    $('#kuediti-bidhaa-thamani').val('').data('val', itm.Bei_kuuza_jum).attr('placeholder', itm.Bei_kuuza_jum)
    $('#kuediti-bidhaa-thamanireja').val('').data('val', itm.Bei_kuuza).attr('placeholder', itm.Bei_kuuza)
    $('#kuediti-bidhaa-vipimo').val('').attr('placeholder', itm.vipimoJum || '')
    $('#kuediti-bidhaa-vipimo_reja').val('').attr('placeholder', itm.vipimo || '')
    $('#kuediti-bidhaa-uwiano').val('').data('val', uwiano).attr('placeholder', uwiano)
    $('#kuediti-bidhaa-idadi_jum').val(jumlaOnShelf).attr('placeholder', jumlaOnShelf)
    $('#kuediti-bidhaa-idadi_reja').val(idadi)
    $('#kuediti-bidhaa-maelezo').val(itm.maelezo || '')
    $('#addMaterialtoUse').prop('checked', !!itm.material)
    $('#uwiano-note').text((itm.vipimo || '') + ' / ' + (itm.vipimoJum || ''))

    if (uwiano > 1) {
        $('#kuedit-rejareja').removeAttr('hidden')
    } else {
        $('#kuedit-rejareja').attr('hidden', true)
    }

    if ($('#kuedit-bidhaa-aina').selectpicker) {
        $('#kuedit-bidhaa-aina').selectpicker('refresh')
        $('#kuedit-bidhaa-aina').selectpicker('val', String(aina))
        $('#kuedit-bidhaa-chapa').selectpicker('refresh')
        $('#kuedit-bidhaa-chapa').selectpicker('val', String(chapa))
        $('#kuediti-bidbaa-msambazaji').selectpicker('refresh')
        $('#kuediti-bidbaa-msambazaji').selectpicker('val', String(supplier))
    }

    $('#Item_editModal').modal('show')
    if (typeof loadItemLocation === 'function') {
        loadItemLocation(itm.bidhaa_id || itm.bidhaa, aina)
    }
}

$('body').on('click', '.open-item-edit', function (e) {
    e.preventDefault()
    const id = Number($(this).data('stock'))
    const itm = (window.STOCK_PRODUCTS || []).find(p => Number(p.id) === id)
    if (!itm) {
        toastr.error(lang('Bidhaa haikupatikana', 'Item was not found'), lang('Haikufanikiwa', 'Error'), { timeOut: 2000 })
        return
    }
    fillStockItemEditModal(itm)
})
