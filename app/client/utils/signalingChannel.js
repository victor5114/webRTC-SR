const wsUri = 'ws://localhost:8089/'

export default class SignalingChannel {

    static _JSONFormatMessage (type, data, destination) {
        return JSON.stringify({
            type: type,
            [type]: data,
            destination
        })
    }

    constructor (id, url) {
        this._ws = new WebSocket(wsUri)
        this._ws.onopen = this._onConnectionEstablished.bind(this, id)
        this._ws.onclose = this._onClose
        this._ws.onmessage = this._onMessage.bind(this)
        this._ws.onerror = this._onError
    }

    sendOffer (offer, destination) {
        this._sendMessage('offer', offer, destination)
    }

    sendICECandidate (ICECandidate, destination) {
        this._sendMessage('ICECandidate', ICECandidate, destination)
    }

    sendAnswer (answer, destination) {
        this._sendMessage('answer', answer, destination)
    }

    _sendMessage (type, data, destination) {
        const args = SignalingChannel._JSONFormatMessage(type, data, destination)
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

    onError (message, destination) {
        console.log('Error : ', destination, ' is', message)
    }

    _onClose () {
        console.error('connection closed')
    }

    _onError (err) {
        console.error('error:', err)
    }

    _onConnectionEstablished (id) {
        this._ws.send(SignalingChannel._JSONFormatMessage('init', id))
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
        case 'error':
            this.onError(objMessage.message, objMessage.destination)
            break
        default:
            throw new Error('invalid message type')
        }
    }
}
