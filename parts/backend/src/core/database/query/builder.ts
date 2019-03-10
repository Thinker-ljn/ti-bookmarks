import Grammar from "./grammar";
import Mysql from "mysql";
import { Where, Column, Data } from "./types";

export default class Builder<T extends Data> {
  grammar: Grammar<T>
  connection: Mysql.Connection
  tableName: string
  from: string
  wheres: Where<T>[] = []
  columns: Column<T>[] = []
  distinct: boolean = false
  data: T[]
  constructor (tableName: string, connection: Mysql.Connection) {
    this.grammar = new Grammar<T>(this)
    this.tableName = tableName
    this.from = tableName
    this.connection = connection
  }

  where (column: string, operator: string, value: string): Builder<T>
  where (column: string, value: string): Builder<T> 
  where (wheres: Where<T>[]): Builder<T> 
  where (wheres: any): Builder<T> {
    if (Array.isArray(wheres)) {

    }
    return this
  }

  // private addWheres (column: string, operator: Operator, value: Value, boolean: BooleanOperator = 'and', handler: GrammarConstructor) {
  //   this.addBindings(value, 'where')
  //   this.wheres.push({
  //     column: column,
  //     operator: operator,
  //     value: value,
  //     boolean: boolean,
  //     handler: handler
  //   })
  //   return this
  // }

  // private addBindings (value: Value) {

  // }

  select (...columns: Column<T>[]) {
    this.columns = columns
    return this
  }

  async get () {}

  async all () {}

  async find (id: number) {}

  async insert (data: T | T[]) {
    if (!Array.isArray(data)) {
      data = [data]
    }
    this.data = data
  }

  async update () {}

  async delete () {}

  async truncate () {}
}
