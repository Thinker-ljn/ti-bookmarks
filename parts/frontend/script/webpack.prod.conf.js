// const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require("mini-css-extract-plugin")
const baseConfig = require('./webpack.base.conf.js')
const path = require('path')
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssLoader = require('./css-loader')
module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build')
  },
  module: {
    rules: [{
      test: /\.s?css$/,
      exclude: /node_modules/,
      use: [ExtractTextPlugin.loader, cssLoader, { loader: "postcss-loader" }]
    },
    {
      test: /\.css$/,
      exclude: /src/,
      use: [ExtractTextPlugin.loader, { loader: "css-loader" }]
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
