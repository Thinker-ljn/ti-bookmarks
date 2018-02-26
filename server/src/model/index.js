const db = require('../database')

class Model {
  constructor (options = {}) {
    this.defProp('$tableName', this.constructor.parseTableName())
    this.defProp('$primaryKey', 'id')

    this.defData()
  }

  static async all () {
    let tableName = this.parseTableName()

    let result = await db.query('SELECT * FROM ' + tableName)
    return result
  }

  static async find (id) {
    let tableName = this.parseTableName()

    let result = await db.query('SELECT * FROM ' + tableName + ' WHERE id = ' + id)

    if (!result.length) {
      throw 'Cannot find the model'
    }

    let model = new this

    model.$data = result[0]
    return model
  }

  async save (data = null) {
    if (data) this.$data = data
    if (this.$data.id) {
      return this.update()
    }

    let result = await db.insert(this.$tableName, this.$data)

    this.$data = {id: result.insertId}
    return result
  }

  async update (data = null) {
    if (data) this.$data = data

    let result = await db.update(this.$tableName, this.$data, this.$primaryKey)

    return result
  }

  async delete (data = null) {
    if (data) this.$data = data
    let pk = this.$primaryKey
    let pv = this.$data[pk]

    if (!pv) throw 'need primaryKey'

    let result = await db.delete(this.$tableName, pv, pk)

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
