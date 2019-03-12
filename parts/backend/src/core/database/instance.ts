import Builder from "./query/builder";
import { Data } from "./query/grammar/components/where";
import { PromiseConnection } from "./connection";

export default class DB {
  static connection: PromiseConnection

  static table <T extends Data>(tableName: string) {
    return new Builder<T>(tableName, DB.connection)
  }
  
  static setConnection (connection: PromiseConnection | (() => PromiseConnection)) {
    if (typeof connection === 'function') {
      DB.connection = connection()
    } else {
      DB.connection = connection
    }
  }
}
