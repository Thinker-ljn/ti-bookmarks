const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const appPath = path.resolve(__dirname, '../../../../')
const db = require('../index')

module.exports = function () {
  const dir = appPath + '/src/database/migrations'
  console.log(dir)
  const migrations = fs.readdirSync(dir)

  migrations.forEach(function (filename) {
    const fullname = path.join(dir, filename)
    let stats = fs.statSync(fullname)

    if (!stats.isDirectory()) {
      const migration = require(fullname)
      db.query(migration)
    }
  })

  db.end()
}
