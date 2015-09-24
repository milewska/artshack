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

  analyser.minDecibels = -100;
  analyser.maxDecibels = 0;

  analyser.fftSize = 32;
  bufferLength = analyser.frequencyBinCount;

  dataArray = new Uint8Array(bufferLength);
  floatArray = new Float32Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  audioAnalyser = new AudioAnalyser();

  isSetup = true;
}

function AudioAnalyser(){}

AudioAnalyser.prototype.getByteFrequencyData = function(){
  if(!isSetup) return null;

  analyser.getByteTimeDomainData(dataArray);
  return mergeNumbers(dataArray);
};

AudioAnalyser.prototype.getFloatFrequencyData = function(){
  if(!isSetup) return null;

  analyser.getFloatFrequencyData(floatArray);
  return mergeNumbers(floatArray);
};

function mergeNumbers(array){
  var combined = [];
  for(var i = 0; i < array.length; i+=2){
    combined.push((array[i] + array[i + 1]) / 2);
  }
  return combined;
}

AudioAnalyser.prototype.getBass = function(){
  analyser.getFloatFrequencyData(floatArray);
  return ((floatArray[0] + floatArray[1] + floatArray[2] + floatArray[3]) / 4) * 0.05;
};

AudioAnalyser.prototype.getMid = function(){
  analyser.getFloatFrequencyData(floatArray);
  return ((floatArray[7] + floatArray[8] + floatArray[9] + floatArray[10]) / 4) * 0.05;
};

AudioAnalyser.prototype.getHigh = function(){
  analyser.getFloatFrequencyData(floatArray);
  return ((floatArray[12] + floatArray[13] + floatArray[14] + floatArray[15]) / 4) * 0.05;
};
