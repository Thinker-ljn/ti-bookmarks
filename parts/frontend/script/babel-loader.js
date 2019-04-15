const config = require('./config')
const reactCssModules = [
  "react-css-modules",
  {
    "filetypes": {
      ".scss": {
        "syntax": "postcss-scss",
        "plugins": [
          "postcss-nested"
        ]
      }
    },
    "generateScopedName": config.base.cssScopedName,
    "webpackHotModuleReloading": true
  }
]
const presets = [
  ["env", { "modules": false }],
  "react",
  "stage-2"
]
const plugins = [
  "react-hot-loader/babel",
  reactCssModules
]
module.exports = {
  loader: 'babel-loader',
  options: {
    presets,
    plugins
  }
}
