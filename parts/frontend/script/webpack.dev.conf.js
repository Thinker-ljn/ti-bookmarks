const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf.js')

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    // 'webpack-hot-middleware/client?reload=true'
    './script/dev-client'
  ],
  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader", // translates CSS into CommonJS
        options: {
          importLoaders: 1,
          sourceMap: true,
          modules: true,
          localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
        }
      }]
    },
    {
      test: /\.css$/,
      exclude: /src/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader", // translates CSS into CommonJS
        options: {
          importLoaders: 1
        }
      }]
    },
    {
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          sourceMap: true,
          modules: true,
          localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
        }
      }, {
        loader: "postcss-loader"
      }]
    }]
  },
  devtool: "#cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
