// const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require("mini-css-extract-plugin")
const baseConfig = require('./webpack.base.conf.js')
const path = require('path')
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build')
  },
  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: [ExtractTextPlugin.loader, {
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
      use: [ExtractTextPlugin.loader,{
        loader: "css-loader",
        options: {
          importLoaders: 1
        }
      }]
    },
    {
      test: /\.scss$/,
      use: [ExtractTextPlugin.loader,{
        loader: "css-loader",
        options: {
          importLoaders: 1,
          sourceMap: true,
          modules: true,
          localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
        }
      }, "sass-loader"]
    }]
  },
  devtool: '#source-map',
  plugins: [
    new ExtractTextPlugin("./[name][hash].css")
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})
