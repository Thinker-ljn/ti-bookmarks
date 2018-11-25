const mysql = require('mysql')
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
  constructor (tableName) {
    this.grammar = new Grammar
    this.bindings = {
      select: [],
      join: [],
      where: [],
      having: [],
      order: [],
      union: []
    }

    this.tableName = tableName
    this.from = tableName
    this.wheres = []
    this.columns = []
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

  get () {
    return mysql.format(this.toSql(), this.getBindings())
  }

  select () {
    this.columns = [...arguments]
    return this
  }

  insert (data) {
    if (!Array.isArray(data)) {
      data = [data]
    }

    let sql = this.grammar.compileInsert(this, data)
    let bindings = this.grammar.getInsertBindings(this, data)
    return mysql.format(sql, bindings)
  }

  update (data) {
    let sql = this.grammar.compileUpdate(this, data)
    let bindings = this.grammar.getUpdateBindings(this, data)
    return mysql.format(sql, bindings)
  }

  delete () {
    let sql = this.grammar.compileDelete(this)
    return mysql.format(sql, this.getBindings())
  }

  toSql () {
    return this.grammar.compileComponents(this)
  }
}

module.exports = Builder
