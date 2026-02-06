var SHOPCELLSS = []

const loadCells = () => {
    $('#loadMe').modal('show')
   const data = {
    data:{shop:Number($('#qr_scan_cell').data('shop'))||0},
    url:"/getPlaceCells"
   } ,
   getThedata = POSTREQUEST(data)
   getThedata.then(resp=>{
        $('#loadMe').modal('hide')
      hideLoading()
       SHOPCELLSS = resp
      

       
   }).error(er=>{
         $('#loadMe').modal('hide')
        hideLoading()
   });
   
}


$(document).ready(function(){
    loadCells()
})

