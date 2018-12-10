const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
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
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader?sourceMap",
          use: "css-loader"
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
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("./[name][hash:8].css"),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico"
    })
  ]
}
