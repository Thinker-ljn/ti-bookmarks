const Builder = require('@core/database/query/builder')
const def = require('@core/lib/def.js')

class Relation {
  constructor (objA, cstcB, connection, options) {
    def.defProp(this, '$oA', objA)
    def.defProp(this, '$keyA', this.formatKey(objA.constructor.name))
    def.defProp(this, '$keyB', this.formatKey(cstcB.name))
    def.defProp(this, '$tableName', this.constructor.parseTableName(objA.constructor, cstcB))
    def.defData(this)

    this.connection = connection
    this.initData()
  }

  static parseTableName (cstcA, cstcB) {
    return [cstcA.name, cstcB.name].sort().join('_').toLowerCase()
  }

  get builder () {
    return new Builder(this.$tableName, this.connection)
  }

  initData () {
    this.$data[this.$keyA] = this.$oA.id
  }

  formatKey (name) {
    return (name + '_id').toLowerCase()
  }

  async attach (id) {
    let ids = id
    let datas = []
    if (!Array.isArray(id)) {
      ids = [id]
    }
    ids.forEach(id => {
      let data = {}
      data[this.$keyA] = this.$oA.id
      data[this.$keyB] = id
      datas.push(data)
    })

    let result = await this.builder.insert(datas)

    return result
  }

  async detach (bid) {
    let query = this.builder.where(this.$keyA, this.$oA.id)
    let result = await query.where(this.$keyB, bid).delete()

    return result
  }

  async sync () {

  }

  async getIds () {
    let query = this.builder.where(this.$keyA, this.$oA.id)
    return await query.select(this.$keyB).get()
  }

  async get () {
    let query = this.builder.where(this.$keyA, this.$oA.id)
    let result = await query.get()
    return result
  }
}

module.exports = Relation
