const path = require('path')
require('dotenv').config({path: path.resolve('../../.env')})

const fs = require('fs')
const db = require('./index')

const dir = process.cwd() + '/migrations'
const migrations = fs.readdirSync(dir)

migrations.forEach(function (filename) {
  const fullname = path.join(dir, filename)
  let stats = fs.statSync(fullname)

  if (!stats.isDirectory()) {
    const migration = require(fullname)
    console.log(migration)
    db.query(migration)
  }
})

db.end()
