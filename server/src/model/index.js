const db = require('../database')

class Model {
  constructor (data = {}) {
    this.$tableName = this.parseTableName()
    this.$primaryKey = 'id'
    this.$data = data
  }

  async save (data = null) {
    if (!data) data = this.$data
    if (data.id) {
      return this.update(data)
    }

    let fields = Object.keys(data)

    let sets = fields.map(f => ' `' + f + '` = \'' + data[f] + '\'').join(',')

    let result = await db.query('INSERT INTO ' + this.$tableName + ' SET' + sets)
    return result
  }

  async update (data) {
    let pk = this.$primaryKey
    let pkValue = data.id

    let fields = Object.keys(data).filter(f => f !== pk)

    let sets = fields.map(f => ' `' + f + '` = \'' + data[f] + '\'').join(',')

    let result = await db.query('UPDATE ' + this.$tableName + ' SET' + sets + ' WHERE ' + pk + ' = ' + pkValue)

    return result
  }

  parseTableName () {
    return this.constructor.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().plural()
  }
}

module.exports = Model
