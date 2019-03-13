// import * as dotenv from 'dotenv'
// dotenv.config()
import * as fs from 'fs'
import * as path from 'path'
import DB from '..';

const connection = DB.connection
console.info(process.env.MYSQL_DB_HOST)
const appPath = path.resolve(__dirname, '../../../../')
console.info(appPath)
const execFn = () => {
  const dir = appPath + '/src/database/migrations'
  const migrations = fs.readdirSync(dir).filter(f => f.endsWith('s'))

  const migrationFn = () => {
    migrations.forEach ((filename) => {
      const fullname = path.join(dir, filename)
      const stats = fs.statSync(fullname)

      if (!stats.isDirectory()) {
        const migration = require(fullname).default
        connection.query(migration)
      }
    })
    connection.end()
  }

  // if (type === 'reset') {
  //   db.dropAllTable().then(migrationFn, (e: Error) => { throw e })
  // } else {
  //   migrationFn()
  // }
  migrationFn()
}

execFn()
