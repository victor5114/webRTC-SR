'use strict';

var _http = require('http');

var _ws = require('ws');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _staticServer = require('./staticServer');

var _staticServer2 = _interopRequireDefault(_staticServer);

var _messageHandler = require('./messageHandler');

var _messageHandler2 = _interopRequireDefault(_messageHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 8089;
var server = (0, _http.createServer)();
var wss = new _ws.Server({ server: server });

var app = (0, _express2.default)();

(0, _staticServer2.default)(app);

wss.on('connection', function (ws) {
    console.log('connection from a client');

    wss.broadcast = function (fn, ws) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
        }

        for (var i in this.clients) {
            // Broadcast to anyone except the incoming connection
            if (this.clients[i] !== ws) {
                console.log(i);
                fn.call.apply(fn, [this].concat(args, [this.clients[i]]));
            }
        }
    };

    ws.on('message', function (message, flags) {
        var objMessage = JSON.parse(message);
        if (objMessage.flags === 'broadcast') {
            console.log('BROADCAST');
            // Broadcast message to anyone
            wss.broadcast(_messageHandler.dataHandler, ws, objMessage);
        } else if (objMessage.flags === 'data') {
            console.log('DATA');
            // Compute data and sent by to source
            (0, _messageHandler.dataHandler)(objMessage, ws);
        } else {
            // Handle signal for RTC Session negociation
            (0, _messageHandler2.default)(objMessage, ws);
        }
    });

    ws.on('close', function () {
        var args = {
            type: 'availablePeers',
            availablePeers: ws.id,
            destination: null,
            flags: 'data'
        };
        (0, _messageHandler.deletePeer)(ws.id);
        wss.broadcast(_messageHandler.dataHandler, ws, args);
    });
});

server.on('request', app);
server.listen(PORT, function () {
    return console.log('Listening on ' + server.address().port);
});

console.log('started signaling server on port ' + PORT);
//# sourceMappingURL=server.js.map
