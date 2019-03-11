import { Connection } from "mysql";
import Builder from "./query/builder";
import { Data } from "./query/grammar/components/where";

export default class DB {
  static connection: Connection

  static table <T extends Data>(tableName: string) {
    return new Builder<T>(tableName, DB.connection)
  }
  
  static setConnection (connection: Connection | (() => Connection)) {
    if (typeof connection === 'function') {
      DB.connection = connection()
    } else {
      DB.connection = connection
    }
  }
}
