const path = require('path')

const resolve = p => path.resolve(__dirname, '../../', p)

module.exports = {
  mode: 'development',
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['env', "babel-preset-power-assert"]
       },
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: "awesome-typescript-loader"
      }
    ]
  },
  devtool: '#inline-source-map'
}
