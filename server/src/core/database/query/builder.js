const Grammar = require('./grammar')

const operators = [
  '=', '<', '>', '<=', '>=', '<>', '!=',
  'like', 'not like', 'ilike',
  '&', '|', '#', '<<', '>>', '>>=', '=<<',
  '@>', '<@', '?', '?|', '?&', '||', '-', '-', '#-',
]

// const bindings = {
//   select: ['select', 'join', 'where', 'having', 'order', 'union'],
//   update: ['join', 'set', 'where', 'having', 'order', 'union']
// }

class Builder {
  constructor (tableName, connection) {
    this.grammar = new Grammar
    this.bindings = {
      select: [],
      join: [],
      where: [],
      having: [],
      order: [],
      union: []
    }

    this.connection = connection
    this.tableName = tableName
    this.from = tableName
    this.wheres = []
    this.columns = []
  }

  whereIn (column, values) {

  }

  where () {
    let argvLen = arguments.length
    if (argvLen === 1) {
      return this.addArrayOfWheres(arguments[0])
    }

    if (argvLen === 2) {
      let column = arguments[0], operator = '=', value = arguments[1]
      return this.addWheres(column, operator, value)
    }

    let column = arguments[0], operator = arguments[1], value = arguments[2]
    return this.addWheres(column, operator, value)
  }

  invalidOperator (operator) {
    return !operators.includes(operator)
  }

  addArrayOfWheres (whereArrays) {
    for (let whereArray of whereArrays) {
      if (!Array.isArray(whereArray)) {
        // todo throw
      }
      let column = whereArray[0], operator = whereArray[1], value = whereArray[2]
      return this.addWheres(column, operator, value)
    }
  }

  addWheres (column, operator, value, boolean = 'and', type = 'basic') {
    if (this.invalidOperator(operator)) {
      // todo throw
    }
    this.addBindings(value, 'where')
    this.wheres.push({
      column: column,
      operator: operator,
      value: value,
      boolean: boolean,
      type: type
    })
    return this
  }

  addBindings (binding, type) {
    if (this.bindings[type]) {
      this.bindings[type].push(binding)
    }
  }

  getBindings () {
    return [].concat.apply([], Object.keys(this.bindings).map(key => this.bindings[key]))
  }

  select () {
    this.columns = [...arguments]
    return this
  }

  async all () {
    return await this.select().get()
  }

  async find (id) {
    return await this.where('id', id).select().get()
  }

  async get () {
    return await this.connection.query(this.toSql(), this.getBindings())
  }

  async insert (data) {
    if (!Array.isArray(data)) {
      data = [data]
    }

    let sql = this.grammar.compileInsert(this, data)
    let bindings = this.grammar.getInsertBindings(this, data)
    return await this.connection.query(sql, bindings)
  }

  async update (data) {
    let sql = this.grammar.compileUpdate(this, data)
    let bindings = this.grammar.getUpdateBindings(this, data)
    return await this.connection.query(sql, bindings)
  }

  async delete () {
    let sql = this.grammar.compileDelete(this)
    return await this.connection.query(sql, this.getBindings())
  }

  async truncate () {
    let sql = this.grammar.compileTruncate(this)
    return await this.connection.query(sql)
  }

  toSql () {
    return this.grammar.compileComponents(this)
  }
}

module.exports = Builder
