const { join } = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { HotModuleReplacementPlugin, DefinePlugin } = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: join(__dirname, 'src', 'index.js'),
    output: {
        path: join(__dirname, 'build'),
        filename: '[hash].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                    },
                },
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: 'file-loader',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
            filename: '[hash].css',
            allChunks: true,
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        new HotModuleReplacementPlugin(),
    ],
    optimization: {
        splitChunks: {
            name: 'vendor',
            filename: '[hash].js',
        },
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
            }),
        ],
    },
    devServer: {
        port: process.env.PORT || 8080,
    },
};
