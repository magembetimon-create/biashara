const  beep_audio_ = document.getElementById("beep_audio");
let SCANCELL = 0

$(function() {
    // Create the QuaggaJS config object for the live stream
    var liveStreamConfig = {
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: {max: 640},
                    height: {max: 480},
                    aspectRatio: {min: 1, max: 100},
                    facingMode: "environment" // or "user" for the front camera
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
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
              codeqb = result?.codeResult?.code || result
        // console.log(pos);
        if($("#Item_editModal").data('bs.modal')?._isShown){
            $('#bar_code_place').val(codeqb);

        }else{
                if(!pos){
                if($("#fromOtherStocku").data('bs.modal')?._isShown){
                    let bidh = StoreNje.data,
                    matchi=[]
                    
                    matchi = bidh.filter(x=>x.sirio===codeqb)


                    if(matchi.length>0){
                    let prdc = matchi[0].id
                        
                            placedataI(prdc)
                    
                
                    }else{
                        $('#add-products').modal('show')             
                        $('#code-ya-bidhaa').val(codeqb);

                    }
                
            }else{
                $('#code-ya-bidhaa').val(codeqb);
                
            }
            
        }else{
            let bidh = Items.data,
                matchi=[]
                
                matchi = bidh.filter(x=>x.sirio===codeqb)


                if(matchi.length>0){
                    let prdc = matchi[0].id,
                        val = matchi[0].bidhaa

                    placedata(pos,prdc)
                    color_size(prdc,pos,coloredItem.state,ItemsSize.state) 
                    
                
                }else{
                    $('#add-products').modal('show')             
                    $('#code-ya-bidhaa').val(codeqb);

                }
        }

        }
}


function qr_success(result){
  
     $("#livestream__qr_scanner").modal('hide');
     const url = window.location.host,
           isbar = Number(result) || 0

           
           
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
      
        const the_url = `${data.url}/buzinessProfile?value=${SCANCELL}&cell=`
          
         const cell = Number(data.result.replace(the_url,'')) || 0
        
         const   the_cell = SHOPCELLSS.cell.filter(c=>c.id===cell)

     

              if(the_cell.length){
                $('#the_cell').val(cell)
                $('#place_where').val(the_cell[0].name)
                $('#place_where').prop('readonly',true)
              }
   }
  
  
  const QR_R = ISMOBILE && $("#livestream_scanner").data('bs.modal')?._isShown ? 'interactive':"qr_reader",
    scanner = new Html5Qrcode(/* element id */ QR_R);
  
  $('.scan_qr').click(function (e) { 
       const pos = Number($(this).data('pos')) || 0
       $('#livestream_scanner').data('pos',pos)

       SCANCELL = Number($(this).data('shop')) || 0 //this is to detect if the scan is from customer position 
       start_can()
  });


  $('body').on('click','.ScanBarCode',function(){
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
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      /* handle success */
       beep_play()
       stop_sanning()
       qr_success(decodedResult.decodedText)
  
  };
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  
  dt.len>1?scanner.start({ facingMode: { exact: "environment"} }, config, qrCodeSuccessCallback):scanner.start({ facingMode: { exact: "user"} }, config, qrCodeSuccessCallback);
  
  }
  
  
  
  // stop scanning if is got
  function stop_sanning(){
      scanner.stop().then((ignore) => {
          // QR Code scanning is stopped.
        }).catch((err) => {
          // Stop failed, handle it.
        });
  }
  
  
  
    // // Stop qr-code scanner in any case, when the modal is closed
    $('.stop_qr').on('click', function(){
         stop_sanning()
    });


//Play the scan audio on catchup
function beep_play() {
    beep_audio_.play();
  }