import SignalingChannel from '../utils/signalingChannel'

const CALLEE_ID = 2

export default function initCallee (messageCallback) {
    var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription
    var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
    var RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate

    var wsUri = 'ws://localhost:8089/'
    const signalingChannel = new SignalingChannel(CALLEE_ID, wsUri)
    var servers = { iceServers: [{urls: 'stun:stun.1.google.com:19302'}] }

    function createPeerConnection (peerId) {
        var pc = new RTCPeerConnection(servers, {
            optional: [{
                DtlsSrtpKeyAgreement: true
            }]
        })

        pc.onicecandidate = function (evt) {
            if (evt.candidate) { // empty candidate (wirth evt.candidate === null) are often generated
                signalingChannel.sendICECandidate(evt.candidate, peerId)
            }
        }

        pc.ondatachannel = function (event) {
            var receiveChannel = event.channel
            console.log('channel received')
            window.channel = receiveChannel
            receiveChannel.onmessage = function (event) {
                messageCallback(event.data)
            }
        }

        return pc
    }

    signalingChannel.onOffer = function (offer, source) {
        console.log('receive offer')
        var peerConnection = createPeerConnection(source)
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        peerConnection.createAnswer(function (answer) {
            peerConnection.setLocalDescription(answer)
            console.log('send answer')
            signalingChannel.sendAnswer(answer, source)
        }, function (e) {
            console.error(e)
        })
    }
}
