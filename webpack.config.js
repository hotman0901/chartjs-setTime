const path  = require('path');
const webpack = require('webpack');
module.exports = {
    entry: path.join(__dirname, 'src', 'app'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js' 

    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }, {
            test: /\.s?css$/,
            use: [
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
          }]
    },
    plugins: [
        // 壓縮 js ，需要require webpack 才能使用
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            },
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, "public"),
        historyApiFallback: true
    },
    devtool: 'cheap-module-eval-source-map'
}