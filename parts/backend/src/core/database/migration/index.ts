import * as fs from 'fs'
import * as path from 'path'
import { PromiseConnection } from '../connection';

type ExecAction = 'reset' | 'refresh' | 'normal'
export interface Options {
  action?: ExecAction
  path?: string
  extension?: string
}
export default class Migration {
  private path: string = './src/database/migrations'
  private extension: string = '.js'
  private connection: PromiseConnection

  constructor (connection: PromiseConnection) {
    this.connection = connection
  }

  public exec (options: Options): Promise<any> {
    const action = options.action || 'normal'
    if (process.env.MODE !== 'cli') {
      Promise.reject(Error('Migration Exec Need A Cli Mode!'))
    }
    console.info('====== Migration Start ======')
    if (action === 'reset') {
      return this.dropAllTable()
    } else if (action === 'refresh') {
      return this.dropAllTable().then(() => {
        return this.migrationFn(options)
      }, (e: Error) => { Promise.reject(e) })
    } else {
      return this.migrationFn(options)
    }
  }

  private async migrationFn (options: Options) {
    const dir = options.path || path.resolve(process.cwd(), this.path)
    const extension = options.extension || this.extension
    const migrations = fs.readdirSync(dir).filter(f => f.endsWith(extension))

    const migrationQuery: Array<Promise<any>> = []
    migrations.forEach (async (filename) => {
      const fullname = path.join(dir, filename)
      const stats = fs.statSync(fullname)

      if (!stats.isDirectory()) {
        let migration = require(fullname)
        if (typeof migration !== 'string') {
          migration = migration.default
        }
        console.info(`====== Start Create Table: ${fullname} =====`)
        migrationQuery.push(this.connection.query(migration))
      }
    })
    await Promise.all(migrationQuery)
    console.info('====== Created =====')
    await this.connection.end()
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
    console.info('====== Start Drop Table =====')
    await this.connection.query(DISABLE_FOREIGN_KEY)
    const tables: any = await this.connection.query(GET_TABLES)
    if (!tables.length) {
      console.info('====== Database Tables Is Empty ======')
    }
    for (const table of tables) {
      const tableName = table.table_name
      const dropTableSql = `DROP TABLE IF EXISTS ${tableName};`
      await this.connection.query(dropTableSql)
      console.info(`====== Dropped Table: ${tableName} ======`)
    }
    await this.connection.query(ENABLE_FOREIGN_KEY)
  }
}
