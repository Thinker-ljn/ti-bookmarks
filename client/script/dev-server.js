var express = require("express");
var proxyMiddleware = require('http-proxy-middleware')
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack.dev.conf.js");
var config = require('./config')

var app = express();
var compiler = webpack(webpackConfig);

const proxyTable = config.dev.proxyTable
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: true
  }
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use('/', express.static(__dirname + '/../public'));

app.listen(8101, function () {
  console.log("Listening on port 8001!");
});