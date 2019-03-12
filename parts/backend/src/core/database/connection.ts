import { Connection, queryCallback } from "mysql";
import * as mysql from 'mysql'
import { Value } from "./query/grammar/components/where";

// let connection: Connection
export const createConnection = () => {
  return mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

export class PromiseConnection {
  private readonly connection: Connection
  private static _instance: PromiseConnection

  private constructor () {
    this.connection = createConnection()
  }

  public static get Instance()
  {
    return this._instance || (this._instance = new this());
  }

  get state () {
    return this.connection.state
  }

  connect () {
    this.connection.connect(function (err) {
      if (err) {
        console.error('error connecting: ' + err.stack)
        throw err
      }
  
      console.log('connected as id ' + this.connection.threadId)
    })
  }

  query (options: string, bindings?: Value[] | queryCallback, callback?: queryCallback) {
    let promise = new Promise((resolve, reject) => {
      if (typeof bindings === 'function') {
        callback = bindings
        bindings = void 0
      }

      let finalCallback: queryCallback = (e, result, fields) => {
        if (callback) return callback(e, result, fields)
        return e ? reject(e) : resolve(result)
      }
      
      this.connection.query(options, bindings, finalCallback)
    })
    return promise
  }

  format (prepareSql: string, bindings: Value[]) {
    return this.connection.format(prepareSql, bindings)
  }
}

