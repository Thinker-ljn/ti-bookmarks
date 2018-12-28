require('module-alias/register')
require('dotenv').config()
String.prototype.plural = require('@core/lib/plural')
const path = require('path')

const Core = require('@core').Core
const serve = require('koa-static')
const router = require('./router')
const bodyParser = require('koa-bodyparser')

const app = new Core()

// app.use(function (ctx, next) {
//   ctx.set('Access-Control-Allow-Origin', '*')
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
//   ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
//   if (ctx.method !== 'OPTIONS') {
//     return next();
//   }
//   if (!ctx.get('Access-Control-Request-Method')) {
//     // this not preflight request, ignore it
//     return next();
//   }
//   ctx.status = 204
// });

app.use(serve(path.join(__dirname, '..', 'public')))
app.use(bodyParser())
app.use(async (ctx, next) => {
  let parseNumber = function (data) {
    for (let k in data) {
      let v = data[k]
      if (/^\d+$/.test(v)) {
        data[k] = Number(v)
      }
    }
  }

  parseNumber(ctx.request.query)
  parseNumber(ctx.request.body)
  await next();
})
app.use(router.routes())

module.exports = app
