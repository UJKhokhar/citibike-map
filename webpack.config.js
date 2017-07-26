const path = require('path');
const webpack = require('webpack');

const VENDOR_LIBS = [
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'redux'
];

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_END === 'development'
})

const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader'
          }],
          fallback: 'style-loader'
        })
    }]
  },
  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    })
  ]
};

module.exports = config;
