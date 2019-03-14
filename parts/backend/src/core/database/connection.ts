import { Connection, queryCallback } from 'mysql'
import * as mysql from 'mysql'
import { Value } from './query/grammar/components/where'

// env params has injected by dotenv/config.
export const createConnection = () => {
  return mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
}

export class PromiseConnection {
  private readonly connection: Connection
  private static instance: PromiseConnection

  private constructor () {
    this.connection = createConnection()
  }

  public static get Instance () {
    return this.instance || (this.instance = new this())
  }

  get state () {
    return this.connection.state
  }

  public connect () {
    this.connection.connect((err) => {
      if (err) {
        throw err
      }
      console.info('connected id:' + this.connection.threadId)
    })
  }

  public end () {
    if (this.state === 'connected' || this.state === 'authenticated') {
      this.connection.end()
    }
  }

  public query (options: string, bindings?: Value[] | queryCallback, callback?: queryCallback) {
    const promise = new Promise((resolve, reject) => {
      if (typeof bindings === 'function') {
        callback = bindings
        bindings = void 0
      }

      const finalCallback: queryCallback = (e, result, fields) => {
        if (callback) { return callback(e, result, fields) }
        return e ? reject(e) : resolve(result)
      }

      this.connection.query(options, bindings, finalCallback)
    })
    return promise
  }

  public format (prepareSql: string, bindings: Value[]) {
    return this.connection.format(prepareSql, bindings)
  }
}
