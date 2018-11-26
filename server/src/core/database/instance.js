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
    let result = await this.query(sql)

    return result
  }

  async update (table, data, primaryKey = 'id') {
    let pk = primaryKey
    let pkValue = data[pk]

    let builder = new Builder(table)
    let sql = builder.where(pk, pkValue).update(data)

    let result = await this.query(sql)

    return result
  }

  async delete (table, primaryValue, primaryKey) {
    let builder = new Builder(table)
    let sql = builder.where(primaryValue, primaryKey).delete()
    let result = await this.query(sql)

    return result
  }

  async dropAllTable () {
    let databaseName = this.connection.config.database
    const DISABLE_FOREIGN_KEY = 'SET FOREIGN_KEY_CHECKS = 0;'
    const ENABLE_FOREIGN_KEY = 'SET FOREIGN_KEY_CHECKS = 1;'
    const GET_TABLES = `SELECT
                          table_name
                        FROM
                          information_schema.tables
                        WHERE
                          table_schema = '${databaseName}';`

    await this.query(DISABLE_FOREIGN_KEY)
    let tables = await this.query(GET_TABLES)
    for (let table of tables) {
      let tableName = table.table_name
      let dropTableSql = `DROP TABLE IF EXISTS ${tableName};`
      await this.query(dropTableSql)
    }
    await this.query(ENABLE_FOREIGN_KEY)
  }
}

module.exports = DB
