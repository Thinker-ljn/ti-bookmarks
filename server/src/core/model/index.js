const db = require('../database')
const def = require('../lib/def.js')
const Relation = require('./relation')

class Model {
  constructor (options = {}) {
    def.defProp(this, '$modelName', this.constructor.name)
    def.defProp(this, '$tableName', this.constructor.parseTableName())
    def.defProp(this, '$primaryKey', 'id')

    def.defData(this)
  }

  static async all () {
    let tableName = this.parseTableName()

    let result = await db.all(tableName)
    return result
  }

  static async find (id) {
    let tableName = this.parseTableName()

    let result = await db.find(tableName, id)

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

  belongsToMany (classB) {
    return new Relation(this, classB)
  }
}

module.exports = Model
