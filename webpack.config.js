const webpack = require('webpack')
const path = require('path')
const loaders = require('./webpack.loaders')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = '127.0.0.1'
const PORT = process.env.WEBPACK_SERVER_PORT || '8888'
const DEST_PATH = './app/client-dist'
const SRC_PATH = './app/client'

// global scss
loaders.push({
    test: /[\/\\](node_modules|global)[\/\\].*\.scss$/,
    loaders: [
        'style',
        'css',
        'sass'
    ]
})
// global css
loaders.push({
    test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
    loaders: [
        'style?sourceMap',
        'css'
    ]
})
// local scss modules
loaders.push({
    test: /[\/\\]app[\/\\].*\.scss/,
    loaders: [
        'style?sourceMap',
        'css',
        'sass'
    ]
})

// local css modules
loaders.push({
    test: /[\/\\]app[\/\\].*\.css/,
    loaders: [
        'style?sourceMap',
        'css'
    ]
})

module.exports = {
    entry: {
        all: [
            `webpack-dev-server/client?http://${HOST}:${PORT}`,
            'webpack/hot/only-dev-server',
            `${SRC_PATH}/index.jsx` // The appʼs entry point
        ]
    },
    devtool: process.env.WEBPACK_DEVTOOL || 'inline-source-map',
    output: {
        path: path.join(__dirname, DEST_PATH),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', 'jsx']
    },
    module: {
        loaders
    },
    devServer: {
        contentBase: SRC_PATH,
        // do not print bundle build stats
        noInfo: true,
        // enable HMR
        hot: true,
        // embed the webpack-dev-server runtime into into an iframe.
        inline: false,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: PORT,
        host: HOST
        // proxy: {
        //     '**': 'http://localhost:8089'
        // }
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'RTC Test',
            template: `${SRC_PATH}/index.html`,
            favicon: `${SRC_PATH}/favicon.ico`
        })
    ]
}
