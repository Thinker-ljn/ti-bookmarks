import { PromiseConnection } from './connection'
import Builder from './query/builder'
import { Data } from './query/grammar/components/where'

export default class DB {
  public static connection: PromiseConnection

  public static table <T extends Data> (tableName: string) {
    return new Builder<T>(tableName, DB.connection)
  }

  public static setConnection (connection: PromiseConnection | (() => PromiseConnection)) {
    if (typeof connection === 'function') {
      DB.connection = connection()
    } else {
      DB.connection = connection
    }
  }

  public static async dropAllTable () {
    const databaseName = this.connection.get('config').database
    const DISABLE_FOREIGN_KEY = 'SET FOREIGN_KEY_CHECKS = 0;'
    const ENABLE_FOREIGN_KEY = 'SET FOREIGN_KEY_CHECKS = 1;'
    const GET_TABLES = `SELECT
                          table_name
                        FROM
                          information_schema.tables
                        WHERE
                          table_schema = '${databaseName}';`

    await this.connection.query(DISABLE_FOREIGN_KEY)
    const tables: any = await this.connection.query(GET_TABLES)
    for (const table of tables) {
      const tableName = table.table_name
      const dropTableSql = `DROP TABLE IF EXISTS ${tableName};`
      await this.connection.query(dropTableSql)
    }
    await this.connection.query(ENABLE_FOREIGN_KEY)
  }
}
