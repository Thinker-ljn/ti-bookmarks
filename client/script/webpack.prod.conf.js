const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require("mini-css-extract-plugin")
const baseConfig = require('./webpack.base.conf.js')
const path = require('path')


module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../server/public')
  },
  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader", // translates CSS into CommonJS
          options: {
            importLoaders: 1,
            sourceMap: true,
            modules: true,
            localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
          }
        }]
      })
    },
    {
      test: /\.css$/,
      exclude: /src/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader?sourceMap",
        use: {
          loader: "css-loader",
          options: {
            importLoaders: 1
          }
        }
      })
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader", // translates CSS into CommonJS
          options: {
            importLoaders: 1,
            sourceMap: true,
            modules: true,
            localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
          }
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      })
    }]
  },
  devtool: '#cource-map',
  plugins: [
    new ExtractTextPlugin("./[name][hash].css"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ]
})
