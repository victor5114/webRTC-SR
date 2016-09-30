import RTCConnection from './RTCConnection'

/**
* @public
* @function initCallee
* @description Init callee connection
* @param {SigChannel} sigChannel - Instance of signaling channel
* @param {Function} channelCallback - call when a new channel is open
*/
export default function initCallee (sigChannel, channelCallback) {
    // Override at loading
    sigChannel.onOffer = function (offer, source) {
        const peerConnection = createPeerConnection(source)
        peerConnection.answerToOffer(offer, source)
    }

    /**
    * @function createPeerConnection
    * @description create a new peer connection
    * @param {String} peerID - peer ID
    * @return {RTCConnection} - new peer connection
    */
    function createPeerConnection (peerID) {
        const peerConnection = new RTCConnection(sigChannel, peerID, channelCallback)
        // Override at loading
        sigChannel.onICECandidate = (ICECandidate, peerID) => {
            peerConnection.addIceCandidate(ICECandidate, peerID)
        }

        return peerConnection
    }
}
