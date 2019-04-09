const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf.js')
const cssLoader = require('./css-loader')
module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    // 'webpack-hot-middleware/client?reload=true'
    './script/dev-client'
  ],
  module: {
    rules: [{
      test: /\.s?css$/,
      exclude: /node_modules/,
      use: [{ loader: "style-loader" }, cssLoader, { loader: "postcss-loader" }]
    },
    {
      test: /\.css$/,
      exclude: /src/,
      use: [{ loader: "style-loader" }, { loader: "css-loader" }]
    }]
  },
  devtool: "#cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
