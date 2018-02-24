const db = require('../database')

class Model {
  constructor (data = {}) {
    this.$tableName = this.constructor.parseTableName()
    this.$primaryKey = 'id'
    this.$data = data
  }

  static async all () {
    let tableName = this.parseTableName()

    let result = await db.query('SELECT * FROM ' + tableName)
    return result
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

  static parseTableName () {
    return this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().plural()
  }
}

module.exports = Model
