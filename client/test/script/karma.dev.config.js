var base = require('./karma.base.config.js')

module.exports = function (config) {
  config.set(Object.assign(base, {
    browsers: ['PhantomJS'],
    reporters: ['mocha'],
    plugins: base.plugins.concat([
      'karma-phantomjs-launcher'
    ])
  }))
}
