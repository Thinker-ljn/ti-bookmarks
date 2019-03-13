/**
 * prepare: WHERE
 * bindings: ...
 * ['where', 'having', 'order', 'union']
 */
import BaseGrammar, { CompileResult } from '../base'
import { parameterize } from '../utils'

export type CompileWhereFn<T extends Data> = (where: Where<T>, not?: boolean) => CompileResult | null
export type Operator = string
export type BooleanOperator = 'AND' | 'OR'
export type Value = string | number | boolean | undefined
export type Column<T> = keyof T
export interface Data {[key: string]: Value}
export interface Where<T extends Data> {
  column: Column<T>,
  operator: Operator,
  value: Value | Value[],
  booleanOperator: BooleanOperator,
  handler: WhereType<T>
}

export default class WhereGrammar<T extends Data> extends BaseGrammar<T> {
  public compile () {
    const {wheres} = this.builder

    const prepare: string[] = []
    let bindings: Value[] = []
    wheres.forEach((where, i) => {
      const {handler, booleanOperator} = where
      const result = this[handler](where)
      if (!result) { throw new Error('Compile Where Clause Fail') }
      prepare.push((i ? booleanOperator + ' ' : '') + result.prepare)
      bindings = bindings.concat(result.bindings)
    })
    const finalPrepare = prepare.length ? 'WHERE ' + prepare.join(' ') : ''
    return {
      prepare: finalPrepare,
      bindings,
    }
  }

  public compileWhereBase: CompileWhereFn<T> = (where) => {
    const {column, operator, value} = where
    if (Array.isArray(value)) { return null }
    return {
      prepare: `\`${column}\` ${operator} ?`,
      bindings: [value],
    }
  }

  public compileWhereIn: CompileWhereFn<T> = (where, not?: boolean) => {
    const {column, value} = where
    if (!Array.isArray(value)) { return null }
    const operator = not ? 'NOT ' : '' + 'IN'
    return {
      prepare: `\`${column}\` ${operator} (${parameterize(value)})`,
      bindings: value,
    }
  }

  public compileWhereNotIn: CompileWhereFn<T> = (where) => {
    return this.compileWhereIn(where, true/** not */)
  }

  public compileWhereNull: CompileWhereFn<T> = (where, not) => {
    const {column} = where
    const statement = `IS ${not ? 'NOT ' : ' '}NUll`
    return {
      prepare: `\`${column}\` ${statement}`,
      bindings: [],
    }
  }

  public compileWhereNotNull: CompileWhereFn<T> = (where) => {
    return this.compileWhereNull(where, true/** not */)
  }
}

export type WhereType<T extends Data> = {
  [K in keyof WhereGrammar<T>]: WhereGrammar<T>[K] extends CompileWhereFn<T> ? K : never
}[keyof WhereGrammar<T>]
