const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  plugins: [
    new DashboardPlugin({ port: 8080 }),
  ],
});
