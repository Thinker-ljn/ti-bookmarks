const webpack = require('webpack')
const config = require('./webpack.prod.conf.js')

const compiler = webpack(config)

compiler.run(function (err, stats) {
  if (err) throw err

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log('- BUILD FAILED WITH ERRORS. - \n')
    process.exit(1)
  }
  console.log('------------------- \n')
  console.log('- BUILD COMPLETE. - \n')
  console.log('------------------- \n')
})