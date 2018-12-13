const Parameter = require('parameter')
class Controller {
  constructor (ctx) {
    this.validator = new Parameter({
      validateRoot: true
    })
    this.ctx = ctx
  }

  validate (rule, data) {
    let error = this.validator.validate(rule, data)
    if (error) {
      this.ctx.throw(422, JSON.stringify(error))
    }
  }
}

module.exports = Controller
