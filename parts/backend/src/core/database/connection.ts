import Mysql, { Connection, QueryFunction, queryCallback } from "mysql";
import { Value } from "./query/types";

let connection: Connection
export const createConnection = () => {
  return Mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

const init = () => {
  connection =createConnection()

  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }

    console.log('connected as id ' + connection.threadId)
  })

  const originalQueryMethod: QueryFunction = connection.query.bind(connection)

  const promiseQuery = function (options: string, bindings?: Value[] | queryCallback, callback?: queryCallback) {
    let promise = new Promise((resolve, reject) => {
      if (typeof bindings === 'function') {
        callback = bindings
        bindings = void 0
      }

      let finalCallback: queryCallback = (e, result, fields) => {
        if (callback) return callback(e, result, fields)
        return e ? reject(e) : resolve(result)
      }
      
      originalQueryMethod(options, bindings, finalCallback)
    })
    return promise
  };

  (connection.query as any) = promiseQuery
}


export const getConnection = () => {
  if (!connection) init()

  return connection
}
