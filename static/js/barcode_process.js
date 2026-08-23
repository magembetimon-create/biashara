const  beep_audio_ = document.getElementById("beep_audio");
let SCANCELL = 0

$(function() {
    // Create the QuaggaJS config object for the live stream
    var liveStreamConfig = {
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: { min: 640, ideal: 1920 },
                    height: { min: 480, ideal: 1080 },
                    aspectRatio: {min: 1, max: 100},
                    facingMode: "environment"
                }
            },
            locator: {
                patchSize: "small",
                halfSample: false
            },
            numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
            decoder: {
                "readers":[
                    {"format":"ean_reader","config":{}}
                ]
            },
            locate: true
        };
    // The fallback to the file API requires a different inputStream option. 
    // The rest is the same 
    var fileConfig = $.extend(
            {}, 
            liveStreamConfig,
            {
                inputStream: {
                    size: 800
                }
            }
        );
    // Start the live stream scanner when the modal opens
    $('#livestream_scanner').on('shown.bs.modal', function (e) {
   
                Quagga.init(
                    liveStreamConfig, 
                    function(err) {
                        if (err) {
                            $('#livestream_scanner .modal-body .error').html('<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> '+err.name+'</strong>: '+err.message+'</div>');
                            Quagga.stop();
                            return;
                        }
                        Quagga.start();
                        if (window.TbScanCamera && typeof TbScanCamera.enhance === 'function') {
                          setTimeout(function () { TbScanCamera.enhance('interactive') }, 250)
                        }
                    }
                );   
       


    });
    
    // Make sure, QuaggaJS draws frames an lines around possible 
    // barcodes on the live stream
    Quagga.onProcessed(function(result) {

        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });
    
    // Once a barcode had been read successfully, stop quagga and 
    // close the modal after a second to let the user notice where 
    // the barcode had actually been found.
    Quagga.onDetected(function(result) {    
        beep_play()		
        if (result.codeResult.code){
            const code = result.codeResult.code
            if (window.POSDATA && typeof posHandleBarcodeScan === 'function') {
                posHandleBarcodeScan(code)
                Quagga.stop()
                setTimeout(function(){ $('#livestream_scanner').modal('hide');$('#livestream_scanner').data('pos',0) }, 100)
                return
            }
            if ((document.getElementById('waiterPageRoot') || document.getElementById('deviceDashboardRoot')) && typeof waiterHandleBarcodeScan === 'function') {
                waiterHandleBarcodeScan(code)
                Quagga.stop()
                setTimeout(function(){ $('#livestream_scanner').modal('hide');$('#livestream_scanner').data('pos',0) }, 100)
                return
            }
            //if the itme edit modal is shown......................//   
            if(SEARCH_ITM_BY_BARCODE){
                searchBarCode(result)
            }else{
                getItemsForItems(result)
            }

            SEARCH_ITM_BY_BARCODE = 0

            Quagga.stop();	
            setTimeout(function(){ $('#livestream_scanner').modal('hide');$('#livestream_scanner').data('pos',0) }, 100);			
        }
    });
    



    // Stop quagga in any case, when the modal is closed
    $('#livestream_scanner').on('hide.bs.modal', function(){
        if (window.TbScanCamera && typeof TbScanCamera.cleanup === 'function') {
            TbScanCamera.cleanup()
        }
        if (Quagga){
            Quagga.stop();	
        }
        $('#livestream_scanner').data('pos',0)
    });
    
 


});

// $('body').on('click','.live_code_scanner',function(){
//     $('#livestream_scanner').data('pos',$(this).data('pos'))
// })


function getItemsForItems(result){
        const pos = $('#livestream_scanner').data('pos'),
              codeqb = String(result?.codeResult?.code || result || '').trim()
        if (!codeqb) return

        // About Item (edit) — fill barcode field
        if($("#Item_editModal").data('bs.modal')?._isShown){
            $('#bar_code_place').val(codeqb);
            return
        }

        // Register item from other branch — search & fill form
        if($("#fromOtherStocku").data('bs.modal')?._isShown){
            const bidh = (typeof StoreNje !== 'undefined' && StoreNje.data) ? StoreNje.data : []
            const matchi = bidh.filter(x => String(x.sirio || '').trim() === codeqb)

            if(matchi.length > 0){
                placedataI(matchi[0].id)
            } else {
                toastr.warning(
                    typeof lang === 'function'
                        ? lang('Barcode haijapatikana kwenye matawi', 'Barcode not found in other branches')
                        : 'Barcode not found',
                    '',
                    { timeOut: 2500 }
                )
                $('#fetch_item').val(codeqb)
            }
            return
        }

        // Item/Service Register — fill Bar Code field
        if($("#add-products").data('bs.modal')?._isShown || $('#code-ya-bidhaa').length){
            if(!pos){
                $('#code-ya-bidhaa').val(codeqb);
                return
            }
        }

        if(!pos){
            $('#code-ya-bidhaa').val(codeqb);
            return
        }

        // POS cart row barcode lookup (legacy)
        let bidh = Items.data,
            matchi = bidh.filter(x => String(x.sirio || '').trim() === codeqb)

        if(matchi.length > 0){
            let prdc = matchi[0].id
            placedata(pos, prdc)
            color_size(prdc, pos, coloredItem.state, ItemsSize.state)
        } else {
            $('#add-products').modal('show')
            $('#code-ya-bidhaa').val(codeqb);
        }
}


function qr_success(result){
  
     const sessionOpen = window.TbBarcode && typeof TbBarcode.isSessionOpen === 'function' && TbBarcode.isSessionOpen()
     const fieldCapture = window.TbBarcode && typeof TbBarcode.isFieldCaptureOpen === 'function' && TbBarcode.isFieldCaptureOpen()
     if (!sessionOpen) {
       $("#livestream__qr_scanner").modal('hide');
     }
     const url = window.location.host,
           isbar = Number(result) || 0
     const code = String(result || '').trim()

    // Field capture for register/edit/other-branch is handled by TbBarcode.openFieldCapture.
    if (fieldCapture) {
        SEARCH_ITM_BY_BARCODE = 0
        return
    }

    // Continuous POS/waiter session
    if (sessionOpen && window.POSDATA && typeof posHandleBarcodeScan === 'function' && code) {
        posHandleBarcodeScan(code)
        SEARCH_ITM_BY_BARCODE = 0
        return
    }
    if (sessionOpen && (document.getElementById('waiterPageRoot') || document.getElementById('deviceDashboardRoot')) && typeof waiterHandleBarcodeScan === 'function' && code) {
        waiterHandleBarcodeScan(code)
        SEARCH_ITM_BY_BARCODE = 0
        return
    }

    // Register / edit / other-branch (one-shot via barcode_process scanner)
    if (
        $("#Item_editModal").data('bs.modal')?._isShown ||
        $("#fromOtherStocku").data('bs.modal')?._isShown ||
        $("#add-products").data('bs.modal')?._isShown
    ) {
        getItemsForItems(code || result)
        SEARCH_ITM_BY_BARCODE = 0
        return
    }

    if (window.POSDATA && typeof posHandleBarcodeScan === 'function' && code) {
        posHandleBarcodeScan(code)
        SEARCH_ITM_BY_BARCODE = 0
        return
    }
    if ((document.getElementById('waiterPageRoot') || document.getElementById('deviceDashboardRoot')) && typeof waiterHandleBarcodeScan === 'function' && code) {
        waiterHandleBarcodeScan(code)
        SEARCH_ITM_BY_BARCODE = 0
        return
    }
           
           
    //   console.log({result,SCANCELL})
    if(isbar!=0){
             
            if(SEARCH_ITM_BY_BARCODE){
                
                data = {
                  data:{
                    valued:result?.codeResult?.code || result,
                    code:1,
                    onshelf:SEARCH_ONSHELF,
                    shop:ON_SHOP,
                  },
                  url:'/searchAll'
                }
                LoadToDB(data)

            }else{
                getItemsForItems(isbar)
            }

            SEARCH_ITM_BY_BARCODE = 0

    }else{
       result.includes(url)?SCANCELL?addPosCell({url,result}):location.replace(result.replace(url,'')):toastr.error(lang('QR-CODE haitambuliki','Unknown QR-CODE'), 'error Alert', {timeOut: 2000});
   
    }
     

  }
  
  
  function error(err){
      console.error(err);
  }

  //Thie is when user scan qr to trigger his location
   function addPosCell(data){
        let cell = 0
        try {
          const raw = String(data.result || '')
          const href = raw.match(/^https?:\/\//i) ? raw : ('https://' + raw.replace(/^\/+/, ''))
          const u = new URL(href)
          cell = Number(u.searchParams.get('cell') || 0)
        } catch (e) {
          const the_url = `${data.url}/buzinessProfile?value=${SCANCELL}&cell=`
          cell = Number(String(data.result || '').replace(the_url, '')) || 0
        }

         if ($('#guest_compound_shop').length && typeof guestCompoundSetCellFromScan === 'function') {
            guestCompoundSetCellFromScan(cell);
            return;
         }
        
         const   the_cell = SHOPCELLSS.cell.filter(c=>c.id===cell)

     

              if(the_cell.length){
                $('#the_cell').val(cell)
                $('#place_where').val(the_cell[0].name)
                $('#place_where').prop('readonly',true)
              }
   }
  
  
  const QR_R = ISMOBILE && $("#livestream_scanner").data('bs.modal')?._isShown ? 'interactive':"qr_reader",
    scanner = new Html5Qrcode(/* element id */ QR_R);
  let barcodeProcessRunning = false
  let barcodeProcessStopping = false
  
  $('.scan_qr').click(function (e) { 
       const pos = Number($(this).data('pos')) || 0
       $('#livestream_scanner').data('pos',pos)

       SCANCELL = Number($(this).data('shop')) || 0 //this is to detect if the scan is from customer position 
       start_can()
  });


  $('body').on('click','.ScanBarCode',function(e){
    e.preventDefault()
    // One-shot: fill register/edit field or search other-branch item, then close.
    // Do NOT open the continuous POS session modal here.
    SEARCH_ITM_BY_BARCODE = 0
    if (window.TbBarcode && typeof window.TbBarcode.openFieldCapture === 'function') {
      window.TbBarcode.openFieldCapture({
        onCode: function (code) {
          if (typeof getItemsForItems === 'function') {
            getItemsForItems(code)
          } else if ($("#Item_editModal").data('bs.modal')?._isShown) {
            $('#bar_code_place').val(code)
          } else {
            $('#code-ya-bidhaa').val(code)
          }
        }
      })
      return
    }
    if(ISMOBILE){
        start_can()
    }else{
        $('#livestream_scanner').modal('show')
    }
  })

  
  function start_can(){
    if(!$("#livestream_scanner").data('bs.modal')){
        $('#livestream__qr_scanner').modal('show')
    }
    
  
          Html5Qrcode.getCameras().then(devices => {
          /**
           * devices would be an array of objects of type:
           * { id: "id", label: "label" }
           */
          if (devices && devices.length) {
              // console.log(devices.length)
              const    len = devices.length, 
              cameraId = devices[0].id;
              // .. use this to start scanning.
              //   console.log(cameraId)
              
              startIt({len,cameraId})
  
  
          // startIt(cameraId)
          }
      }).catch(err => {
          // handle err
      });
  }
  
  function startIt(dt){
  if (barcodeProcessRunning || barcodeProcessStopping) return
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      /* handle success */
       beep_play()
       stop_sanning()
       qr_success(decodedResult.decodedText)
  
  };
  const config = (window.TbScanCamera && typeof TbScanCamera.qrConfig === 'function')
    ? TbScanCamera.qrConfig()
    : { fps: 15, qrbox: { width: 280, height: 140 } }
  const cameraId = dt.len > 1
    ? { facingMode: { ideal: 'environment' } }
    : { facingMode: { ideal: 'user' } }
  const rootId = typeof QR_R === 'string' ? QR_R : 'qr_reader'

  function afterStart() {
    barcodeProcessRunning = true
    barcodeProcessStopping = false
    if (window.TbScanCamera && typeof TbScanCamera.enhance === 'function') {
      TbScanCamera.enhance(rootId)
    }
  }

  const startPromise = scanner.start(cameraId, config, qrCodeSuccessCallback)
  if (startPromise && typeof startPromise.then === 'function') {
    startPromise.then(afterStart).catch(function () {
      const low = Object.assign({}, config, {
        videoConstraints: { facingMode: cameraId.facingMode }
      })
      scanner.start(cameraId, low, qrCodeSuccessCallback).then(afterStart).catch(function () {
        barcodeProcessRunning = false
        barcodeProcessStopping = false
      })
    })
  } else {
    afterStart()
  }
  
  }
  
  
  
  // stop scanning if is got
  function stop_sanning(){
      if (window.TbScanCamera && typeof TbScanCamera.cleanup === 'function') {
        TbScanCamera.cleanup()
      }
      if (!scanner || !barcodeProcessRunning || barcodeProcessStopping) return
      barcodeProcessStopping = true
      barcodeProcessRunning = false
      try {
        const stopped = scanner.stop()
        if (stopped && typeof stopped.then === 'function') {
          stopped.then(function () {
            barcodeProcessStopping = false
          }).catch(function () {
            barcodeProcessStopping = false
          })
        } else {
          barcodeProcessStopping = false
        }
      } catch (err) {
        barcodeProcessStopping = false
      }
  }
  
  
  
    // Stop once on modal hide (Close buttons use data-dismiss — avoid double stop on click).
    $('#livestream__qr_scanner')
      .off('hide.bs.modal.barcodeprocess')
      .on('hide.bs.modal.barcodeprocess', function () {
        stop_sanning()
      });


//Play the scan audio on catchup
function beep_play() {
    beep_audio_.play();
  }