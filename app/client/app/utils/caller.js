// import SignalingChannel from './signalingChannel'
import RTCConnection from './RTCConnection'

export default function initCaller (signalingChannel, peerID) {
    const peerConnection = new RTCConnection(signalingChannel, peerID)
    // :warning the dataChannel must be opened BEFORE creating the offer.
    const _commChannel = peerConnection.pc.createDataChannel('communication', {
        reliable: false
    })

    // Overriden method
    signalingChannel.onAnswer = (answer, source) => {
        console.log('receive answer from ', source)
        peerConnection.ActionAfterAnswer(answer)
    }

    signalingChannel.onICECandidate = (ICECandidate, source) => {
        console.log('receiving ICE candidate from ', source)
        peerConnection.addIceCandidate(ICECandidate)
    }

    // Start the negociation
    peerConnection.createOffer()

    _commChannel.onclose = function (evt) {
        console.log('dataChannel closed')
    }

    _commChannel.onerror = function (evt) {
        console.error('dataChannel error')
    }

    _commChannel.onopen = function () {
        console.log('dataChannel opened')
    }

    // Override this method
    _commChannel.onmessage = function (message) {
        console.log('Received data from channel')
    }

    return _commChannel
}
