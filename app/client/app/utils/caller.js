import RTCConnection from './RTCConnection'

/**
* @public
* @function initCaller
* @description Init caller connection
* @param {SigChannel} sigChannel - Instance of signaling channel
* @param {String} peerID - peer ID
* @param {String} callerID - caller ID
*/
export default function initCaller (signalingChannel, peerID, callerID) {
    const peerConnection = new RTCConnection(signalingChannel, peerID)
    // :warning the dataChannel must be opened BEFORE creating the offer.
    const _commChannel = peerConnection.pc.createDataChannel(`communication_${callerID}_${peerID}`, {
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
