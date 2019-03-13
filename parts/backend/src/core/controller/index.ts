import Koa from 'koa'
import Parameter from 'parameter'

export default class Controller {
  public validator: Parameter
  public ctx: Koa.Context
  constructor (ctx: Koa.Context) {
    this.validator = new Parameter({
      validateRoot: true,
    })
    this.ctx = ctx
  }

  public validate (rules: Rules, data: ToBeCheckObj) {
    const error = this.validator.validate(rules, data)
    if (error) {
      this.ctx.throw(422, JSON.stringify(error))
    }
  }
}
