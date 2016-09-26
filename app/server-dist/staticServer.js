'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (app) {
    // set the view engine to ejs
    app.set('view engine', 'ejs');
    app.set('views', CLIENT_PATH);

    app.use(_express2.default.static(CLIENT_PATH));

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    console.log('started static server');
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLIENT_FOLDER = process.env.NODE_ENV === 'production' ? '../client-dist/' : '../client/';
var CLIENT_PATH = _path2.default.join(__dirname, CLIENT_FOLDER);
//# sourceMappingURL=staticServer.js.map
