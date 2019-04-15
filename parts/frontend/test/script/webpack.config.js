const path = require('path')
const webpack = require('webpack')
const cwd = process.cwd()
console.log(cwd)
const resolve = p => path.resolve(cwd, p)

module.exports = {
  mode: 'development',
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      '@': resolve('src')
    }
  },
  watchOptions: {
    ignored: /node_modules/,
    // aggregateTimeout: 300,
    // poll: true
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   options: {
      //     presets: ['env', "babel-preset-power-assert"]
      //   },
      //   exclude: /node_modules/
      // },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', "babel-preset-power-assert"]
            },
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  devtool: "#source-map",
  plugins: [
    new webpack.ProvidePlugin({
        'Promise': 'es6-promise'
    })
  ]
}
