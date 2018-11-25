const mysql = require('mysql')
const DB = require('./instance')

let connection
const init = () => {
  connection = mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })

  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }

    console.log('connected as id ' + connection.threadId)
  })

  const originalQueryMethod = connection.query.bind(connection)
  connection.query = (sql, cb) => new Promise((resolve, reject) => {
    originalQueryMethod(sql, (e, result, fields) => {
      if (cb) return cb(e, result, fields)
      return e ? reject(e) : resolve(result)
    })
  })
}


const getConnection = () => {
  if (!connection) init()

  return connection
}

const db = new DB(getConnection())
module.exports = db

// const db = require('./database')

// db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error
//   console.log('The solution is: ', results[0].solution)
// })

// db.end()
