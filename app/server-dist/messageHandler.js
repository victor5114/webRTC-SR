'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectedPeers = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = onMessage;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// exporting for unit tests only
var connectedPeers = exports.connectedPeers = {};

function onMessage(ws, message) {
    var type = message.type;
    switch (type) {
        case 'ICECandidate':
            onICECandidate(message.ICECandidate, message.destination, ws.id);
            break;
        case 'offer':
            onOffer(message.offer, message.destination, ws.id);
            break;
        case 'answer':
            onAnswer(message.answer, message.destination, ws.id);
            break;
        case 'init':
            onInit(ws, message.init);
            break;
        default:
            throw new Error('invalid message type');
    }
}

function onInit(ws, id) {
    console.log('init from peer:', id);
    ws.id = id;
    connectedPeers[id] = ws;
}

function onOffer(offer, destination, source) {
    console.log('offer from peer:', source, 'to peer', destination);
    connectedPeers[destination].send((0, _stringify2.default)({
        type: 'offer',
        offer: offer,
        source: source
    }));
}

function onAnswer(answer, destination, source) {
    console.log('answer from peer:', source, 'to peer', destination);
    connectedPeers[destination].send((0, _stringify2.default)({
        type: 'answer',
        answer: answer,
        source: source
    }));
}

function onICECandidate(ICECandidate, destination, source) {
    console.log('ICECandidate from peer:', source, 'to peer', destination);
    connectedPeers[destination].send((0, _stringify2.default)({
        type: 'ICECandidate',
        ICECandidate: ICECandidate,
        source: source
    }));
}
//# sourceMappingURL=messageHandler.js.map
