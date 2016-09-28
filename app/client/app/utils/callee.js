import RTCConnection from './RTCConnection'

export default function initCallee (sigChannel, channelCallback) {
    // Override at loading
    sigChannel.onOffer = function (offer, source) {
        console.log('Receive offer from peer:', source, ':', offer)
        const peerConnection = createPeerConnection(source)
        peerConnection.answerToOffer(offer, source)
    }

    function createPeerConnection (peerID) {
        const peerConnection = new RTCConnection(sigChannel, peerID, channelCallback)
        // Override at loading
        sigChannel.onICECandidate = function (ICECandidate, peerID) {
            peerConnection.addIceCandidate(ICECandidate, peerID)
        }

        return peerConnection
    }
}
