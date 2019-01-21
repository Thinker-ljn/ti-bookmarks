const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../public/asset'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src'),
      '@css': resolve('src/assets/css')
    },
    modules: [process.env.NODE_PATH || 'node_modules', 'node_modules']
  },
  resolveLoader: {
    modules: [process.env.NODE_PATH || 'node_modules', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }, {
          loader: 'eslint-loader'
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico"
    })
  ]
}
