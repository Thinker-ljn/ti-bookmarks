const config = require('./config')
module.exports = {
  loader: "css-loader",
  options: {
    importLoaders: 1,
    sourceMap: true,
    modules: true,
    localIdentName: config.base.cssScopedName
  }
}