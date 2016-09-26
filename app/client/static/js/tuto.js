var videoArea = document.querySelector('video')
var videoSelect = document.querySelector('#camera')
var profilePicCanvas = document.querySelector('#profilePicCanvas')
var profilePictureOutput = document.querySelector('#profilePictureOutput')
var videoTag = document.querySelector('#videoTag')
var takeProfilePicture = document.querySelector('#takeProfilePicture')

var width = 240
var height = 240
var streaming = false

takeProfilePicture.addEventListener('click', function (ev) {
    takeProfilePic()
    ev.PreventDefault()
}, false)

videoTag.addEventListener('canplay', function (ev) {
    if (!streaming) {
        height = videoTag.videoHeight / (videoTag.videoWidth / width)

        // Firefox currently has a bug where the height can't be read
        if (isNaN(height)) {
            height = width / (4 / 3)
        }

        videoTag.setAttribute('width', width)
        videoTag.setAttribute('height', height)
        profilePicCanvas.setAttribute('width', width)
        profilePicCanvas.setAttribute('height', height)
        streaming = true
    }
}, false)

function takeProfilePic () {
    var context = profilePicCanvas.getContext('2d')
    if (width && height) {
        profilePicCanvas.width = width
        profilePicCanvas.height = height
        context.drawImage(videoTag, 0, 0, width, height)

        var data = profilePicCanvas.toDataURL('image/png')
        profilePictureOutput.setAttribute('src', data)
    }
}

if (typeof MediaStreamTrack === 'undefined' || typeof MediaStreamTrack.getSources === 'undefined') {
    document.querySelector('#cameraSelector').style.visibility = 'hidden'
} else {
    MediaStreamTrack.getSources(getCameras)
}

videoSelect.onchange = startStream

function getCameras (sourceInfos) {
    for (var i = 0; i !== sourceInfos.length; i++) {
        var sourceInfo = sourceInfos[i]
        var option = document.createElement('option')
        option.value = sourceInfo.id
        if (sourceInfo.kind === 'video') {
            option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1)
            videoSelect.appendChild(option)
        }
    }
}

startStream()

function startStream () {
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
    // var videoSource = videoSelect.value
    var constraints = {
        audio: false,
        video: false
    }

    navigator.getUserMedia(constraints, onSuccess, onError)
}

function onSuccess (stream) {
    console.log('Success! We have a stream!')
    videoArea.src = window.URL.createObjectURL(stream)
    videoArea.play()
}

function onError (error) {
    console.log('Error with getUserMedia: ', error)
}
