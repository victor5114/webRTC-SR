const webpack = require('webpack')
const path = require('path')
const loaders = require('./webpack.loaders')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

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
    test: /[\/\\]src[\/\\].*\.scss/,
    loaders: [
        'style?sourceMap',
        'css',
        'sass'
    ]
})

// local css modules
loaders.push({
    test: /[\/\\]src[\/\\].*\.css/,
    loaders: [
        'style?sourceMap',
        'css'
    ]
})

module.exports = {
    entry: {
        callee: [
            `${SRC_PATH}/callee/index.js` // The appʼs entry point
        ],
        caller: [
            `${SRC_PATH}/caller/index.js` // The appʼs entry point
        ]
    },
    output: {
        path: path.join(__dirname, DEST_PATH),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                drop_console: false,
                drop_debugger: true
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin('[contenthash].css', {
            allChunks: true
        }),
        new webpack.optimize.DedupePlugin()
    ]
}
