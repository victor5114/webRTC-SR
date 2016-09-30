import { onAvailablePseudoResponse, onAvailablePeersResponse } from './customEvents'
import { AVAILABLE_PEERS, CHECK_AVAILABLE_PSEUDO } from '../types/dataActions'
import { websocketURL } from '../../env.js'

const wsUri = websocketURL

/**
* @public
* @class SignalingChannel
* @description Wrap an RTC connection
* @this {WebSocket} _ws - Websocket instance
*/
export default class SignalingChannel {
    static _JSONFormatMessage (type, data, destination, flags) {
        return JSON.stringify({
            type: type,
            [type]: data,
            destination,
            flags: flags
        })
    }

    constructor () {
        this._ws = new WebSocket(wsUri)
        this._ws.onopen = this._onConnectionEstablished.bind(this)
        this._ws.onclose = this._onClose
        this._ws.onmessage = this._onMessage.bind(this)
        this._ws.onerror = this._onError
    }

    sendInit (id) {
        this._ws.send(SignalingChannel._JSONFormatMessage('init', id))
    }

    // Main protocol methods
    sendOffer (offer, destination) {
        this._sendMessage('offer', offer, destination, [])
    }

    sendICECandidate (ICECandidate, destination) {
        this._sendMessage('ICECandidate', ICECandidate, destination, [])
    }

    sendAnswer (answer, destination) {
        this._sendMessage('answer', answer, destination, [])
    }

    // Data methods
    sendCheckAvailablePseudo (data, destination = null) {
        this.sendData(CHECK_AVAILABLE_PSEUDO, data, destination)
    }

    sendAvailablePeers (data, destination = null) {
        this.sendData(AVAILABLE_PEERS, data, destination)
    }

    sendData (type, data, destination) {
        this._sendMessage(type, data, destination, 'data')
    }

    // Broadcast method
    sendBroadcast (type, data) {
        this._sendMessage(type, data, null, 'broadcast')
    }

    _sendMessage (type, data, destination, flags) {
        const args = SignalingChannel._JSONFormatMessage(type, data, destination, flags)
        this._ws.send(args)
    }

    // Function to override when define caller
    onICECandidate (ICECandidate, source) {
        console.log('ICECandidate from peer:', source, ':', ICECandidate)
    }

    // Function to override when define callee
    onOffer (offer, source) {
        console.log('offer from peer:', source, ':', offer)
    }

    // Function to override when define caller
    onAnswer (answer, source) {
        console.log('receive answer from ', source)
    }

    onData (type, data, source) {
        console.log('receive data from ', source)
        switch (type) {
        case 'checkAvailablePseudo':
            onAvailablePseudoResponse(data)
            break
        case 'availablePeers':
            onAvailablePeersResponse(data)
            break
        }
    }

    onError (message, destination) {
        console.log('Error : ', destination, ' is', message)
    }

    _onClose () {
        console.error('connection closed')
    }

    _onError (err) {
        console.error('error:', err)
    }

    _onConnectionEstablished () {
        console.log('Connection established')
    }

    _onMessage (evt) {
        var objMessage = JSON.parse(evt.data)
        switch (objMessage.type) {
        case 'ICECandidate':
            this.onICECandidate(objMessage.ICECandidate, objMessage.source)
            break
        case 'offer':
            this.onOffer(objMessage.offer, objMessage.source)
            break
        case 'answer':
            this.onAnswer(objMessage.answer, objMessage.source)
            break
        case 'checkAvailablePseudo':
            this.onData(objMessage.type, objMessage[objMessage.type], objMessage.source)
            break
        case 'availablePeers':
            this.onData(objMessage.type, objMessage[objMessage.type], objMessage.source)
            break
        case 'error':
            this.onError(objMessage.message, objMessage.destination)
            break
        default:
            throw new Error('invalid message type')
        }
    }
}
