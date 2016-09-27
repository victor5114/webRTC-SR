const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription
const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
const RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate

const servers = { iceServers: [{urls: 'stun:stun.1.google.com:19302'}] }

export default class RTCConnection {
    constructor (sigChannel, peerID, messageCallback) {
        this.peerID = peerID
        this.signalingChannel = sigChannel
        this.messageCallback = messageCallback
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
        this.channel = receiveChannel
        window.channel = receiveChannel
        receiveChannel.onmessage = (evt) => {
            this.messageCallback(evt.data)
        }
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
