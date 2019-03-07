var webpackConfig = require('./webpack.config.js')

// shared config for all unit tests
module.exports = {
  frameworks: ['mocha', 'power-assert'],
  files: [
    '../index.ts'
  ],
  preprocessors: {
    '../index.ts': ['webpack']
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true
  },
  plugins: [
    'karma-power-assert',
    'karma-mocha-reporter',
    'karma-mocha',
    'karma-webpack'
  ]
}
