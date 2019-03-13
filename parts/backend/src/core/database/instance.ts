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
}
