'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.getConnectedPeers = getConnectedPeers;
exports.deletePeer = deletePeer;
exports.default = onMessage;
exports.dataHandler = dataHandler;
exports.callDataMethod = callDataMethod;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectedPeers = {};

var protocolMethods = ['ICECandidate', 'offer', 'answer', 'init'];
var dataMethods = ['checkAvailablePseudo', 'availablePeers'];

function getConnectedPeers() {
    return connectedPeers;
}

function deletePeer(id) {
    delete connectedPeers[id];
}

function onMessage(message, ws) {
    var type = message.type;


    if (protocolMethods.indexOf(type) > -1) {
        callProtocolMethod(type, message, ws);
    } else {
        throw new Error('Invalid message type');
    }
}

function callProtocolMethod(type, mess, ws) {
    var _ref;

    var data = mess ? mess[type] : null;
    var args = connectedPeers[mess.destination] ? (_ref = { type: mess.type }, (0, _defineProperty3.default)(_ref, type, data), (0, _defineProperty3.default)(_ref, 'source', ws.id), _ref) : { type: 'error', message: 'Unreachable', destination: mess.destination };

    if (type === 'init') {
        console.log('init from peer:', data); // mess.init = socket id
        ws.id = data;
        connectedPeers[data] = ws;
        return;
    }

    if (args.type === 'error') {
        ws.send((0, _stringify2.default)(args)); // Callback message to source
    } else {
        connectedPeers[mess.destination].send((0, _stringify2.default)(args)); // Forward message to destination
    }
}

// Simulate Router behaviour
function dataHandler(message, ws) {
    var type = message.type;


    if (dataMethods.indexOf(type) > -1) {
        callDataMethod(type, message, ws);
    } else {
        throw new Error('Invalid data type : ' + type);
    }
}

// Sync methods (No complex async operation here)
function callDataMethod(type, mess, ws) {
    var _args;

    var res = null;
    var data = mess ? mess[type] : null;
    console.log(type);
    switch (type) {
        case 'availablePeers':
            var peers = (0, _keys2.default)(getConnectedPeers());
            console.log(peers);
            res = removeElem(peers, data);
            break;
        case 'checkAvailablePseudo':
            res = (0, _keys2.default)(getConnectedPeers()).indexOf(data) === -1;
            break;
        default:
            break;
    }

    // In the callDataMethod source
    var args = (_args = { type: type }, (0, _defineProperty3.default)(_args, type, res), (0, _defineProperty3.default)(_args, 'source', data), _args);
    ws.send((0, _stringify2.default)(args));
}

// Mutate function
function removeElem(array, elem) {
    if (!array) {
        throw new Error('array must be an array');
    }

    if (!elem) {
        return array;
    }

    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}
//# sourceMappingURL=messageHandler.js.map
