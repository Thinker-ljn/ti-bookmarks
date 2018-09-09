const Builder = require('./query/builder')
class DB {
  constructor (connection) {
    this.connection = connection
  }

  end () {
    return this.connection.end()
  }

  table (tableName) {
    return new Builder(tableName)
  }

  async all (tableName) {
    let builder = new Builder(tableName)
    let sql = builder.select().get()
    return await this.query(sql)
  }

  async find (tableName, id) {
    let builder = new Builder(tableName)
    let sql = builder.where('id', id).select().get()
    return await this.query(sql)
  }

  async query (sql) {
    let result = await this.connection.query(sql)
    return result
  }

  async insert (table, data) {
    let builder = new Builder(table)
    let sql = builder.insert(data)

    console.log(sql)
    let result = await this.query(sql)

    return result
  }

  async update (table, data, primaryKey = 'id') {
    let pk = primaryKey
    let pkValue = data[pk]

    let builder = new Builder(table)
    let sql = builder.where(pk, pkValue).update(data)

    // let fields = Object.keys(data).filter(f => f !== pk)
    let result = await this.query(sql)

    return result
  }

  async delete (table, primaryValue, primaryKey) {
    let builder = new Builder(table)
    let sql = builder.where(primaryValue, primaryKey).delete()
    let result = await db.query(sql)

    return result
  }
}

module.exports = DB
