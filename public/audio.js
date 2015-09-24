var audioContext = new (window.AudioContext || window.webkitAudioContext)();

if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

if (navigator.getUserMedia){
    navigator.getUserMedia({audio:true}, setUpAudio, function(e) {
      alert('Error capturing audio.');
    });
} else alert('getUserMedia not supported in this browser.');

var audioInput,
  analyser,
  bufferLength,
  dataArray,
  audioAnalyser,
  isSetup = false;

function setUpAudio(e){
  audioInput = audioContext.createMediaStreamSource(e);
  analyser = audioContext.createAnalyser();
  audioInput.connect(analyser);

  analyser.fftSize = 32;
  bufferLength = analyser.frequencyBinCount;

  dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  audioAnalyser = new AudioAnalyser();

  isSetup = true;
}

function AudioAnalyser(){}

AudioAnalyser.prototype.getByteFrequencyData = function(){
  if(!isSetup) return null;
  analyser.getByteTimeDomainData(dataArray);
  return dataArray;
};

// module.exports = new AudioAnalyser();
