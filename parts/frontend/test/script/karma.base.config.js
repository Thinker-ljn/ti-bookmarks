var webpackConfig = require('./webpack.config.js')

// shared config for all unit tests
module.exports = {
  frameworks: ['mocha', 'power-assert'],
  basePath: '../..',
  files: [
    'test/**/*.ts'
  ],
  preprocessors: {
    'test/**/*.ts': ['webpack']
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true
  },
  usePolling: true,
  plugins: [
    'karma-power-assert',
    'karma-mocha-reporter',
    'karma-mocha',
    'karma-webpack'
  ]
}
