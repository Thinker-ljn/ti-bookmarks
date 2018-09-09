const db = require('../database')
const def = require('../lib/def.js')

class Relation {
  constructor (objA, cstcB, options) {
    def.defProp(this, '$oA', objA)
    def.defProp(this, '$keyA', this.formatKey(objA.constructor.name))
    def.defProp(this, '$keyB', this.formatKey(cstcB.name))
    def.defProp(this, '$tableName', this.constructor.parseTableName(objA.constructor, cstcB))
    def.defData(this)

    this.initData()
  }

  static parseTableName (cstcA, cstcB) {
    return [cstcA.name, cstcB.name].sort().join('_').toLowerCase()
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
    let result = await db.insert(this.$tableName, datas)

    return result
  }

  async detach (id) {
    this.$data[this.$keyB] = id
    let result = await db.delete(this.$tableName, this.$data)

    return result
  }
}

module.exports = Relation