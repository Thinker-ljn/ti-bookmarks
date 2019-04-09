const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const babelLoader = require('./babel-loader')
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
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@fe': resolve('./'),
      '@interfaces': resolve('../interfaces')
    },
    modules: [process.env.NODE_PATH || 'node_modules', 'node_modules']
  },
  resolveLoader: {
    modules: [process.env.NODE_PATH || 'node_modules', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [babelLoader]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: /src/,
        use: [
          babelLoader, 
          {
            loader: 'awesome-typescript-loader'
          }
        ]
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
