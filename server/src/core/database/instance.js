const Builder = require('./query/builder')
class DB {
  constructor (connection) {
    this.connection = connection
  }

  end () {
    return this.connection.end()
  }

  table (tableName) {
    return new Builder(tableName, this.connection)
  }

  async query (...args) {
    let result = await this.connection.query(...args)
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
