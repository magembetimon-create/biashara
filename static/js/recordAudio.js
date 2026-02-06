
//count recording
sectotal = 0;
function start(){
  
  countup();

  }
  function stop(){
    clearTimeout(timerI)
  }
  
  function countup() {
          let secs = sectotal;
  
          function timer() {
              
                let sd = String(secs%60),
                    md = String(parseInt(secs/60))

                    if(parseInt(secs/60)<10){
                      md = `0${md}`
                    }

                    if(parseInt(secs%60)<10){
                      sd = `0${sd}`
                    }


           $("#count_sec11").html(`${md}:${sd}`)
           secs++;
  
              if( secs > 0 ) {
                  timerI = setTimeout(timer, 1000);
              } else {
                  
                  secs = sectotal
                  countup();
              }
          }
          
          timer();
  }


  //record audio................................................//
  
  class VoiceRecorder {
    constructor() {
     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //  console.log("getUserMedia supported")
     } else {
      //  alert("getUserMedia is not supported on your browser!")
     }
  
      this.mediaRecorder
      this.stream
      this.chunks = []
      this.isRecording = false
  
      this.recorderRef = document.querySelector("#recorder11")
     // this.playerRef = document.querySelector("#audio_chat")
      this.startRef = document.querySelector("#start_record11")
      this.stopRef = document.querySelector("#stop_record11")
      
      this.startRef.onclick = this.startRecording.bind(this)
      this.stopRef.onclick = this.stopRecording.bind(this)
  
      this.constraints = {
        audio: true,
        video: false
      }
      
    }
  
    handleSuccess(stream) {
      this.stream = stream
      this.stream.oninactive = () => {
       // console.log("Stream ended!")
      };
      this.recorderRef.srcObject = this.stream
      this.mediaRecorder = new MediaRecorder(this.stream)
     // console.log(this.mediaRecorder)
      this.mediaRecorder.ondataavailable = this.onMediaRecorderDataAvailable.bind(this)
      this.mediaRecorder.onstop = this.onMediaRecorderStop.bind(this)
      this.recorderRef.play()
      this.mediaRecorder.start()
    }
  
    handleError(error) {
     // console.log("navigator.getUserMedia error: ", error)
     toastr.error(error, lang('Haijafanikiwa','Error'), {timeOut: 2000});

    }
    
    onMediaRecorderDataAvailable(e) { this.chunks.push(e.data) }
    
    onMediaRecorderStop(e) { 
        const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' })
        const audioURL = window.URL.createObjectURL(blob),
        filename =  new Date().toISOString() + '.ogg'
       
       $('#the_textingField').append(`
       <li class="text-right py-1 my-2">
       
       <audio hidden class="hidden_audio" src="${audioURL}" id="audi${$('.hidden_audio').length}" controls >

       </audio>
      <div class="controls">
        <div class="spinner-grow spinner-grow-sm"></div>
        <button class="player-button btn-default btn"  id="play${$('.hidden_audio').length}" data-play="${$('.hidden_audio').length}" >
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </button>
        <input type="range" class="timeline" id="timeline${$('.hidden_audio').length}" max="100" value="0">
         <button data-play="${$('.hidden_audio').length}" class="sound-button btn-default btn ">
           
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

    </li>
       `)


       var elem = document.getElementById('chats_div');
       //    elem.scrollTop = elem.scrollHeight;
       $('#chats_div').animate({scrollTop:elem.scrollHeight}, '600')

        this.chunks = []
        this.stream.getAudioTracks().forEach(track => track.stop())
        this.stream = null

 let    data=new FormData()
        data.append("audio_data", blob, filename)
        data.append("to",$('#chattingForm').data('to'))
        data.append("it",$('#chattingForm').data('item'))
        data.append("od",$('#chattingForm').data('oda'))
        data.append("csrfmiddlewaretoken",$('input[name=csrfmiddlewaretoken]').val())
   
     
      $.ajax({
        type: "POST",
        url: "/sendAudioChat",
        data: data,
        cache: false,
        processData: false,
        contentType: false,
      
        success: function (resp) {
            getChats(resp.to)
        }
    });

    
    }
  
    startRecording() {
      $('#audio_recorder11').fadeIn(400);
      start()
      if (this.isRecording) return
      this.isRecording = true
     // this.startRef.innerHTML = 'Recording...'
    //  this.playerRef.src = ''
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(this.handleSuccess.bind(this))
        .catch(this.handleError.bind(this))
    }
    
    stopRecording() {
      stop()
      $('#audio_recorder11').fadeOut(500)
      if (!this.isRecording) return
      this.isRecording = false
     // this.startRef.innerHTML = 'Record'
      this.recorderRef.pause()
      this.mediaRecorder.stop()



  }
  
}
  
   window.voiceRecorder = new VoiceRecorder()
  

