import Parameter from 'parameter'
import Koa from 'koa'

export default class Controller {
  validator: Parameter
  ctx: Koa.Context
  constructor (ctx: Koa.Context) {
    this.validator = new Parameter({
      validateRoot: true
    })
    this.ctx = ctx
  }

  validate (rules: Rules, data: ToBeCheckObj) {
    let error = this.validator.validate(rules, data)
    if (error) {
      this.ctx.throw(422, JSON.stringify(error))
    }
  }
}
