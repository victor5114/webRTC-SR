module.exports = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|public)/,
        loaders: ['react-hot-loader/webpack']
    },
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|public)/,
        loader: 'babel',
        query: {
            presets: ['es2015'],
            plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties']
        }
    },
    // React Widget configuration
    {
        test: /\.gif$/,
        loader: 'url-loader?mimetype=image/png'
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
    },
    // Custom configuration
    {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'file-loader?name=[name].[ext]'
    },
    {
        test: /\.(woff|woff2)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader?prefix=font/&limit=5000'
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
    },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
    },
    {
        test: /\.gif/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader?limit=10000&mimetype=image/gif'
    },
    {
        test: /\.jpg/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader?limit=10000&mimetype=image/jpg'
    },
    {
        test: /\.png/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader?limit=10000&mimetype=image/png'
    }
]
