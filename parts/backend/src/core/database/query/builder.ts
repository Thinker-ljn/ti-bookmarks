import grammarCompile from "./grammar";
import { Column, Data, Value } from "./grammar/components/where";
import { Where, Operator } from "./grammar/components/where";
import { CompileResult } from "./grammar/base";
import { PromiseConnection } from "../connection";

type BuilderMode = 'query' | 'format'
export default class Builder<T extends Data> {
  connection: PromiseConnection
  tableName: string
  from: string
  wheres: Where<T>[] = []
  columns: Column<T>[] = []
  distinct: boolean = false
  data: T[]
  completed: false
  mode: BuilderMode
  constructor (tableName: string, connection: PromiseConnection, mode: BuilderMode = 'format') {
    this.tableName = tableName
    this.from = tableName
    this.connection = connection
    this.mode = mode
  }

  async query ({prepare, bindings}: CompileResult): Promise<any> {
    prepare = prepare.trim()
    if (this.connection.state === 'disconnected' || this.mode === 'format') {
      return await Promise.resolve(this.connection.format(prepare, bindings))
    }
    return await this.connection.query(prepare, bindings)
  }

  async all () {}

  async find (id: number) {
    return await this.where('id', id).select()
  }

  async select (...columns: Column<T>[]) {
    this.columns = columns
    let compiled: CompileResult = grammarCompile(this, 'select')
    return await this.query(compiled)
  }

  async insert (data: T | T[]) {
    if (!Array.isArray(data)) {
      data = [data]
    }
    let compiled: CompileResult = grammarCompile(this, 'insert', data)
    return await this.query(compiled)
  }

  async update (data: T) {
    let compiled: CompileResult = grammarCompile(this, 'update', data)
    return await this.query(compiled)
  }

  async delete () {
    let compiled: CompileResult = grammarCompile(this, 'delete')
    return await this.query(compiled)
  }

  async truncate () {}

  where (column: Where<T>[]): Builder<T>
  where (column: Column<T>, operator: Value): Builder<T> 
  where (column: Column<T>, operator: Operator, value: Value): Builder<T> 
  where (column: any, operator?: any, value?: any) {
    if (Array.isArray(column)) {
      let wheres = column
      wheres.forEach((where) => {
          this.addWhere(where)
      })
    } else if (typeof column === 'string') {
      if (!value) {
        value = operator
        operator = '='
      } 
      this.addWhere({column, operator, value})
    }
    return this
  }

  whereIn (column: Column<T>, value: Value[]) {
    this.addWhere({column, value, handler: 'compileWhereIn'})
  }

  whereNotIn (column: Column<T>, value: Value[]) {
    this.addWhere({column, value, handler: 'compileWhereNotIn'})
  }

  private addWhere (where: Partial<Where<T>>) {
    let defaultWhere: Where<T> = {
      column: '0', operator: '=', value: '1', boolean: 'AND', handler: 'compileWhereBase'
    }
    let fullWhere: Where<T> = Object.assign({}, defaultWhere, where)
    this.wheres.push(fullWhere)
  }
}
