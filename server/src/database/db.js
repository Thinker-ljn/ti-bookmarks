class DB {
  constructor (connection) {
    this.connection = connection
  }

  escape (value) {
    return this.connection.escape(value)
  }

  escapeId (value) {
    return this.connection.escapeId(value)
  }

  end () {
    return this.connection.end()
  }

  async query (sql) {
    let result = await this.connection.query(sql)
    return result
  }

  async insert (table, data) {
    let fields = Object.keys(data)

    let sets = fields.map(f => this.escapeId(f) + ' = ' + this.escape(data[f])).join(',')

    let sql = 'INSERT INTO ' + this.escapeId(table) + ' SET ' + sets

    console.log(sql)
    let result = await this.query(sql)

    return result
  }

  async update (table, data, primaryKey = 'id') {
    let pk = primaryKey
    let pkValue = data[pk]

    let fields = Object.keys(data).filter(f => f !== pk)

    let sets = fields.map(f => this.escapeId(f) + ' = ' + this.escape(data[f])).join(',')

    let sql = 'UPDATE ' + this.escapeId(table) + ' SET ' + sets + ' WHERE ' + this.escapeId(pk) + ' = ' + this.escape(pkValue)
    let result = await this.query(sql)

    return result
  }

  async delete (table, primaryValue, primaryKey) {
    let sql = 'DELETE FROM ' + this.escapeId(table) + ' WHERE ' + this.escapeId(primaryKey) + ' = ' + this.escape(primaryValue)
    let result = await db.query(sql)

    return result
  }
}

module.exports = DB
