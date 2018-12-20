const def = require('../lib/def.js')
const Relation = require('./relation')
const Builder = require('@core/database/query/builder')

class Model {
  constructor (options = {}) {
    def.defProp(this, '$modelName', this.constructor.name)
    def.defProp(this, '$tableName', this.constructor.parseTableName())
    def.defProp(this, '$primaryKey', 'id')

    def.defData(this)
  }

  static async all () {
    return await this.newQuery().all()
  }

  static async find (id) {
    let result = await this.newQuery().find(id)
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

    let query = this.constructor.newQuery()
    let result = await query.insert(this.$data)

    this.$data = {id: result.insertId}
    return result
  }

  async update (data = null) {
    if (data) this.$data = data

    let query = this.constructor.newQuery()
    let pkValue = this.$data[this.$primaryKey]
    let result = await query.where(this.$primaryKey, pkValue).update(this.$data)

    return result
  }

  async delete (data = null) {
    if (data) this.$data = data
    let pk = this.$primaryKey
    let pv = this.$data[pk]

    if (!pv) throw 'need primaryKey'
    let query = this.constructor.newQuery()
    let result = await query.where(pk, pv).delete()

    return result
  }

  async truncate () {
    let query = this.constructor.newQuery()
    return await query.truncate()
  }

  static newQuery () {
    if (!this.tableName) this.tableName = this.parseTableName()
    return new Builder(this.tableName, this.connection)
  }

  static setConnection (connection) {
    this.connection = connection
  }

  static parseTableName () {
    return this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().plural()
  }

  belongsToMany (classB) {
    return new Relation(this, classB, this.constructor.connection)
  }
}

module.exports = Model
