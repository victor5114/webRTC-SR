const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription
const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
const RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate

const servers = { iceServers: [{urls: 'stun:stun.1.google.com:19302'}] }

/**
* @public
* @class RTCConnection
* @description Wrap an RTC connection
* @this {SigChannel} signalingChannel - Instance of signaling channel
* @this {String} peerID - peer ID
* @this {Function} channelCallback - callback function
* @this {RTCPeerConnection} pc - Instance of RTCPeerConnection
*/
export default class RTCConnection {
    constructor (sigChannel, peerID, channelCallback) {
        this.peerID = peerID
        this.signalingChannel = sigChannel
        this.channelCallback = channelCallback
        this.pc = new RTCPeerConnection(servers, {
            optional: [{
                DtlsSrtpKeyAgreement: true
            }]
        })
        this.pc.ondatachannel = this.onDataChannel.bind(this)
        this.pc.onicecandidate = this.onICECandidate.bind(this)
    }

    createOffer () {
        this.pc.createOffer((offer) => {
            this.pc.setLocalDescription(offer)
            this.signalingChannel.sendOffer(offer, this.peerID)
        }, (e) => {
            console.error(e)
        })
    }

    onICECandidate (evt) {
        if (evt.candidate) { // empty candidate (with evt.candidate === null) are often generated
            this.signalingChannel.sendICECandidate(evt.candidate, this.peerID)
        }
    }

    onDataChannel (evt) {
        var receiveChannel = evt.channel
        console.log('channel received')
        this.channelCallback(this.peerID, receiveChannel)
    }

    addIceCandidate (ICECandidate, source) {
        console.log('receiving ICE candidate from ', source)
        this.pc.addIceCandidate(new RTCIceCandidate(ICECandidate))
    }

    answerToOffer (offer, source) {
        let answer = null
        this.pc.setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => {
                return this.pc.createAnswer()
            })
            .then(answerObj => {
                answer = answerObj
                return this.pc.setLocalDescription(answer)
            })
            .then(() => {
                this.signalingChannel.sendAnswer(answer, source)
            })
            .catch(err => console.error(err))
    }

    ActionAfterAnswer (answer) {
        this.pc.setRemoteDescription(new RTCSessionDescription(answer))
    }
}
