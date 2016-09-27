import SignalingChannel from '../utils/signalingChannel'
import RTCConnection from '../utils/RTCConnection'

const CALLEE_ID = 2

export default function initCallee (messageCallback) {
    const signalingChannel = new SignalingChannel(CALLEE_ID)

    function createPeerConnection (peerID) {
        const peerConnection = new RTCConnection(signalingChannel, peerID, messageCallback)
        // Override at loading
        signalingChannel.onICECandidate = function (ICECandidate, peerID) {
            peerConnection.addIceCandidate(ICECandidate, peerID)
        }

        return peerConnection
    }
    // Override at loading
    signalingChannel.onOffer = function (offer, source) {
        console.log('Receive offer from peer:', source, ':', offer)
        const peerConnection = createPeerConnection(source)
        peerConnection.answerToOffer(offer, source)
    }
}
