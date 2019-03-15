import * as fs from 'fs'
import * as path from 'path'
import { PromiseConnection } from '../connection';

type ExecType = 'reset' | 'clean' | 'normal'
export interface Options {
  type?: ExecType
  path?: string
  extension?: string
}
export default class Migration {
  private path: string = './build/src/database/migrations'
  private extension: string = '.js'
  private connection: PromiseConnection

  constructor (connection: PromiseConnection) {
    this.connection = connection
  }

  public exec (options: Options) {
    const type = options.type || 'normal'
    if (process.env.MODE !== 'cli') {
      throw Error('Migration Exec Need A Cli Mode!')
    }
    if (type === 'clean') {
      return this.dropAllTable()
    } else if (type === 'reset') {
      this.dropAllTable().then(() => {
        return this.migrationFn(options)
      }, (e: Error) => { throw e })
    } else {
      return this.migrationFn(options)
    }
  }

  private async migrationFn (options: Options) {
    const dir = options.path || path.resolve(process.cwd(), this.path)
    const extension = options.extension || this.extension
    const migrations = fs.readdirSync(dir).filter(f => f.endsWith(extension))
    await migrations.forEach (async (filename) => {
      const fullname = path.join(dir, filename)
      const stats = fs.statSync(fullname)

      if (!stats.isDirectory()) {
        let migration = require(fullname)
        if (typeof migration !== 'string') {
          migration = migration.default
        }
        await this.connection.query(migration)
      }
    })
  }

  private async dropAllTable () {
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
