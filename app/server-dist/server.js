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

// import url from 'url'
var PORT = process.env.PORT || 8089;
var server = (0, _http.createServer)();
var wss = new _ws.Server({ server: server });

var app = (0, _express2.default)();

wss.on('connection', function (ws) {
    // var location = url.parse(ws.upgradeReq.url, true)
    console.log('connection from a client');
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function (message) {
        var objMessage = JSON.parse(message);
        (0, _messageHandler2.default)(ws, objMessage);
    });
});

server.on('request', app);
server.listen(PORT, function () {
    return console.log('Listening on ' + server.address().port);
});

(0, _staticServer2.default)(app);

console.log('started signaling server on port ' + PORT);
//# sourceMappingURL=server.js.map
