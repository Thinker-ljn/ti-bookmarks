import { PromiseConnection } from '../connection'
import grammarCompile from './grammar'
import { CompileResult } from './grammar/base'
import { Column, Data, Value } from './grammar/components/where'
import { Operator, Where } from './grammar/components/where'

export default class Builder<T extends Data> {
  public connection: PromiseConnection
  public tableName: string
  public from: string
  public wheres: Array<Where<T>> = []
  public columns: Array<Column<T>> = []
  public distinct: boolean = false
  public completed: false
  constructor (tableName: string, connection: PromiseConnection) {
    this.tableName = tableName
    this.from = tableName
    this.connection = connection
  }

  public async query ({prepare, bindings}: CompileResult): Promise<any> {
    prepare = prepare.trim()
    if (this.connection.state === 'disconnected') {
      return await Promise.resolve(this.connection.format(prepare, bindings))
    }
    return await this.connection.query(prepare, bindings)
  }

  public async all () {
    return this.select()
  }

  public async find (id: number) {
    return await this.where('id', id).select()
  }

  public async select (...columns: Array<Column<T>>) {
    this.columns = columns
    const compiled: CompileResult = grammarCompile(this, 'select')
    return await this.query(compiled)
  }

  public async insert (data: T | T[]) {
    if (!Array.isArray(data)) {
      data = [data]
    }
    const compiled: CompileResult = grammarCompile(this, 'insert', data)
    return await this.query(compiled)
  }

  public async update (data: T) {
    const compiled: CompileResult = grammarCompile(this, 'update', data)
    return await this.query(compiled)
  }

  public async delete () {
    const compiled: CompileResult = grammarCompile(this, 'delete')
    return await this.query(compiled)
  }

  public async truncate () {}

  public where (column: Array<Where<T>>): Builder<T>
  public where (column: Column<T>, operator: Value): Builder<T>
  public where (column: Column<T>, operator: Operator, value: Value): Builder<T>
  public where (column: any, operator?: any, value?: any) {
    if (Array.isArray(column)) {
      const wheres = column
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

  public whereIn (column: Column<T>, value: Value | Value[]) {
    if (!Array.isArray(value)) {
      return this.where(column, value)
    }
    this.addWhere({column, value, handler: 'compileWhereIn'})
    return this
  }

  public whereNotIn (column: Column<T>, value: Value[]) {
    this.addWhere({column, value, handler: 'compileWhereNotIn'})
    return this
  }

  private addWhere (where: Partial<Where<T>>) {
    const defaultWhere: Where<T> = {
      column: '0', operator: '=', value: '1', booleanOperator: 'AND', handler: 'compileWhereBase',
    }
    const fullWhere: Where<T> = Object.assign({}, defaultWhere, where)
    this.wheres.push(fullWhere)
  }
}
