var SHOPCELLSS = []

const loadCells = () => {
    $('#loadMe').modal('show')
   const data = {
    data:{shop:Number($('#qr_scan_cell').data('shop'))||0},
    url:"/getPlaceCells"
   } ,
   getThedata = POSTREQUEST(data)
    const onLoadCellsError = () => {
          $('#loadMe').modal('hide')
          hideLoading()
    }
   getThedata.then(resp=>{
        $('#loadMe').modal('hide')
      hideLoading()
       SHOPCELLSS = resp
   });

    if (typeof getThedata.catch === 'function') {
        getThedata.catch(onLoadCellsError)
    } else if (typeof getThedata.fail === 'function') {
        getThedata.fail(onLoadCellsError)
    }
   
}


$(document).ready(function(){
    loadCells()
})

