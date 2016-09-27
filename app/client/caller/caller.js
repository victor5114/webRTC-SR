import SignalingChannel from '../utils/signalingChannel'
import RTCConnection from '../utils/RTCConnection'

const CALLER_ID = 1

export default function initCaller (messageCallback) {
    const signalingChannel = new SignalingChannel(CALLER_ID)

    return function startCommunication (peerID) {
        const peerConnection = new RTCConnection(signalingChannel, peerID, messageCallback)

        // Override this method
        signalingChannel.onAnswer = (answer, source) => {
            console.log('receive answer from ', source)
            peerConnection.ActionAfterAnswer(answer)
        }

        signalingChannel.onICECandidate = (ICECandidate, source) => {
            console.log('receiving ICE candidate from ', source)
            peerConnection.addIceCandidate(ICECandidate)
        }

        // :warning the dataChannel must be opened BEFORE creating the offer.
        var _commChannel = peerConnection.pc.createDataChannel('communication', {
            reliable: false
        })

        // Start the negociation
        peerConnection.createOffer()

        window.channel = _commChannel

        _commChannel.onclose = function (evt) {
            console.log('dataChannel closed')
        }

        _commChannel.onerror = function (evt) {
            console.error('dataChannel error')
        }

        _commChannel.onopen = function () {
            console.log('dataChannel opened')
        }

        _commChannel.onmessage = function (message) {
            messageCallback(message.data)
        }
    }
}
