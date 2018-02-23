require('dotenv').config()
String.prototype.plural = require('./lib/plural')

const Koa = require('koa')
const app = new Koa()
const router = require('./router')
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())
app.use(router.routes())

app.listen(8088, function () {
  console.log('app listening on port 8088!')
})
