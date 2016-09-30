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
exports.setConnectedPeer = setConnectedPeer;
exports.deletePeer = deletePeer;
exports.default = onMessage;
exports.dataHandler = dataHandler;
exports.callDataMethod = callDataMethod;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Store the Map of connected peers in realtime */
var connectedPeers = {};

/* Methods used for signaling protocol */
var protocolMethods = ['ICECandidate', 'offer', 'answer', 'init'];

/* Methods used for application Real time communication */
var dataMethods = ['checkAvailablePseudo', 'availablePeers'];

/**
* @public
* @function getConnectedPeers
* @description Get global object connectedPeers
* @return {Object} connectedPeers - The connected peers list.
*/
function getConnectedPeers() {
    return connectedPeers;
}

/**
* @public
* @function setConnectedPeer
* @description Add a new peer in the list or override if already exist
* @param {String} id - Unique peerID
* @param {WebSocket} ws - Websocket connection
*/
function setConnectedPeer(id, ws) {
    connectedPeers[id] = ws;
}

/**
* @public
* @function deletePeer
* @description Delete a peer from list
* @param {String} id - Unique peerID
*/
function deletePeer(id) {
    delete connectedPeers[id];
}

/**
* @public
* @function onMessage
* @description Triggered when websocket channel receives new message
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
function onMessage(message, ws) {
    var type = message.type;


    if (protocolMethods.indexOf(type) > -1) {
        callProtocolMethod(type, message, ws);
    } else {
        throw new Error('Invalid message type');
    }
}

/**
* @private
* @function callProtocolMethod
* @description Simply forward message to other peer during protocol hand ckeck
* @param {string} type - Type of message
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
function callProtocolMethod(type, mess, ws) {
    var _ref;

    var data = mess ? mess[type] : null;
    var args = getConnectedPeers()[mess.destination] ? (_ref = { type: mess.type }, (0, _defineProperty3.default)(_ref, type, data), (0, _defineProperty3.default)(_ref, 'source', ws.id), _ref) : { type: 'error', message: 'Unreachable', destination: mess.destination };

    // If type init we just set a new peer. No response to client needed
    if (type === 'init') {
        console.log('init from peer:', data); // mess.init = socket id
        ws.id = data;
        setConnectedPeer(data, ws);
        return;
    }

    if (args.type === 'error') {
        // Callback message to source
        ws.send((0, _stringify2.default)(args));
    } else {
        // Forward message to destination
        getConnectedPeers()[mess.destination].send((0, _stringify2.default)(args));
    }
}

/**
* @public
* @function dataHandler
* @description Called when applicative message has been received on a channel
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
function dataHandler(message, ws) {
    var type = message.type;


    if (dataMethods.indexOf(type) > -1) {
        callDataMethod(type, message, ws);
    } else {
        throw new Error('Invalid data type : ' + type);
    }
}

/**
* @public
* @function callDataMethod
* @description Simply forward message to other peer during protocol hand ckeck
* @param {string} type - Type of message
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
function callDataMethod(type, mess, ws) {
    var _args;

    var res = null;
    var data = mess ? mess[type] : null;
    switch (type) {
        case 'availablePeers':
            var peers = (0, _keys2.default)(getConnectedPeers());
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

/**
* @private
* @function removeElem
* @description Utility method to remove first occurence of a elem from array.
* @param {Array} array - An array
* @param {string} elem - elem
* @return {Array} array - New array. Don't mutate the first one
*/
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
