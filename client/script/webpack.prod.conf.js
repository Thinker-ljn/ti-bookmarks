const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf.js')
const path = require('path')


module.exports = merge(baseConfig, {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../server/public')
  },
  devtool: '#cource-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ]
})
