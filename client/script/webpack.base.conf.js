const path = require('path')

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
        use: [{
            loader: "style-loader?sourceMap"
        }, {
            loader: "css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]"
        }]
      },
      {
        test: /\.css$/,
        exclude: /src/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
        }]
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
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
