/**
 * prepare: WHERE
 * bindings: ...
 * ['where', 'having', 'order', 'union']
 */
import BaseGrammar, { CompileResult } from "../base";
import { Data } from "../../types";
import { parameterize } from "../utils";

export type CompileWhereFn<T extends Data> = (where: Where<T>, not?: boolean) => CompileResult | null
export type Operator = string
export type BooleanOperator = 'AND' | 'OR'
export type Value = string | number
export type Column<T> = keyof T
export type Data = {[key: string]: Value}
export interface Where<T extends Data> {
  column: Column<T>,
  operator: Operator,
  value: Value | Value[],
  boolean: BooleanOperator,
  handler: WhereType<T>
}

export default class WhereGrammar<T extends Data> extends BaseGrammar<T> {
  compile () {
    let {wheres} = this.builder
    
    let prepare: string[] = []
    let bindings: Value[] = []
    wheres.forEach((where, i) => {
      let {handler, boolean} = where
      let result = this[handler](where)
      if (!result) throw 'Compile Where Clause Fail'
      prepare.push((!i ? boolean + ' ' : '') + result.prepare)
      bindings = bindings.concat(result.bindings)
    })
    let finalPrepare = prepare.length ? 'WHERE ' + prepare.join(' ') : ''
    return {
      prepare: finalPrepare,
      bindings: bindings
    }
  }

  compileWhereBase: CompileWhereFn<T> = (where) => {
    let {column, operator, value} = where
    if (Array.isArray(value)) return null
    return {
      prepare: `\`${column}\` ${operator} ? `,
      bindings: [value]
    }
  }

  compileWhereIn: CompileWhereFn<T> = (where, not?: boolean) => {
    let {column, value} = where
    if (!Array.isArray(value)) return null
    let operator = not ? 'NOT' : '' + ' IN'
    return {
      prepare: `\`${column}\` ${operator} ${parameterize(value)}`,
      bindings: value
    }
  }

  compileWhereNotIn: CompileWhereFn<T> = (where) => {
    return this.compileWhereIn(where, true/** not */)
  }

  compileWhereNull: CompileWhereFn<T> = (where, not) => {
    let {column} = where
    let statement = `IS ${not ? 'NOT ' : ' '}NUll`
    return {
      prepare: `\`${column}\` ${statement}`,
      bindings: []
    }
  }

  compileWhereNotNull: CompileWhereFn<T> = (where) => {
    return this.compileWhereNull(where, true/** not */)
  }
}

export type WhereType<T extends Data> =  {[K in keyof WhereGrammar<T>]: WhereGrammar<T>[K] extends CompileWhereFn<T> ? K : never}[keyof WhereGrammar<T>]
