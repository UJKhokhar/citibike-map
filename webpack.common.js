const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const VENDOR_LIBS = [
  'axios',
  // Want to add this but unresolved errors 'csvtojson',
  'lodash',
  'mapbox-gl',
  'memoizee',
  'react',
  'react-dom',
  'react-mapbox-gl',
  'react-rangeslider',
  'react-redux',
  'react-router',
  'redux',
  'redux-promise',
];

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_END === 'development',
});

const config = {
  entry: {
    bundle: './src/index.jsx',
    vendor: VENDOR_LIBS,
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
  },

  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
          fallback: 'style-loader',
        }),
      }],
    noParse: /(mapbox-gl)\.js$/,
  },

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
    },
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

module.exports = config;
