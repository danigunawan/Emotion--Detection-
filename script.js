const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

// Resolving navigator.getUserMedia issue 
navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

// A a function to render the real time web cam video 
function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }

// Setting up detection of face 
video.addEventListener('play', () => {

  // Creating a canvas element 
  const canvas  = faceapi.createCanvasFromMedia(video);
  // Adding canves element to the body 
  document.body.append(canvas);
  //Displaying canvas in a absolute position 
  const displaySize = { width: video.width, height: video.height}
  
  // As videos starts playing api is capturing face every 100ms  
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
    .withFaceExpressions()

    console.log(detections);
    // Creating const to detect the movement of the face 
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // Drawing the box 
    faceapi.draw.drawDetections(canvas, resizedDetections)
  }, 100);


});