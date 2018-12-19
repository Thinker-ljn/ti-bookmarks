const Koa = require('koa')
const Model = require('@core/Model')
const Controller = require('@core/controller')
const db = require('@core/database')

class Core extends Koa {
  constructor () {
    super()

    this.db = db
    // this.use(async function (ctx) {
    //   ctx.db = db
    // })
    this.constructor.Model.setConnection(this.db)
  }
}

Core.Model = Model
Core.Controller = Controller
exports.Core = Core
exports.Controller = Controller
exports.Model = Model
