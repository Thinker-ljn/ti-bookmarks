const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const baseConfig = require('./webpack.base.conf.js')

module.exports = merge(baseConfig, {
  entry: [
    'webpack-hot-middleware/client?reload=true'
  ],
  devtool: "#cheap-module-eval-source-map",
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
