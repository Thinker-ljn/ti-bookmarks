const db = require('../database')

class Model {
  constructor (options = {}) {
    this.$tableName =
    this.$primaryKey = 'id'

    this.defProp('$tableName', this.constructor.parseTableName())
    this.defProp('$primaryKey', 'id')

    this.defData()
  }

  static async all () {
    let tableName = this.parseTableName()

    let result = await db.query('SELECT * FROM ' + tableName)
    return result
  }

  async save (data = null) {
    if (data) this.$data = data
    if (this.$data.id) {
      return this.update()
    }

    let fields = Object.keys(this.$data)

    let sets = fields.map(f => ' `' + f + '` = \'' + data[f] + '\'').join(',')

    let result = await db.query('INSERT INTO ' + this.$tableName + ' SET' + sets)

    this.$data = {id: result.insertId}
    return result
  }

  async update (data = null) {
    if (data) this.$data = data

    let pk = this.$primaryKey
    let pkValue = this.$data.id

    let fields = Object.keys(this.$data).filter(f => f !== pk)

    let sets = fields.map(f => ' `' + f + '` = \'' + this.$data[f] + '\'').join(',')

    let result = await db.query('UPDATE ' + this.$tableName + ' SET' + sets + ' WHERE ' + pk + ' = ' + pkValue)

    return result
  }

  static parseTableName () {
    return this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().plural()
  }

  defProp (key, value) {
    Object.defineProperty(this, key, {
      enumerable: false,
      writable: true,
      configurable: false,
      value: value
    })
  }

  defData () {
    let model = this
    Object.defineProperty(this, '$data', {
      enumerable: false,
      configurable: false,
      get: function () {
        let d = {}
        for (let k in model) {
          d[k] = model[k]
        }
        return d
      },
      set: function (data) {
        for (let k in data) {
          model[k] = data[k] // .toString()
        }
      }
    })
  }
}

module.exports = Model
