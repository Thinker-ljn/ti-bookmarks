require('module-alias/register')
require('dotenv').config()
String.prototype.plural = require('@core/lib/plural')
const path = require('path')

const Koa = require('koa')
const serve = require('koa-static')
const app = new Koa()
const router = require('./router')
const bodyParser = require('koa-bodyparser')

app.use(function (ctx, next) {
  if (ctx.method !== 'OPTIONS') {
    return next();
  }
  if (!ctx.get('Access-Control-Request-Method')) {
    // this not preflight request, ignore it
    return next();
  }
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  ctx.status = 204;
});

app.use(serve(path.join(__dirname, '..', 'public')))
app.use(bodyParser())
app.use(router.routes())

app.listen(80, function () {
  console.log('app listening on port 80!')
})
