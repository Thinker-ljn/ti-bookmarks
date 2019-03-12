/**
 * prepare: SELECT col1, col2, .. FROM table ... [WHERE Clause]
 * bindings: [ ]
 * ['select', join', 'where condition']
 */

import { BaseMainGrammar, CompileResult } from "../base";
import { Data, Value } from "./where";
import WhereGrammar from "./where";

export default class SelectGrammar<T extends Data> extends BaseMainGrammar<T> {
  whereCompiler: WhereGrammar<T> = new WhereGrammar(this.builder)
  compile (): CompileResult {
    let {columns, tableName} = this.builder
    let columnStr = columns.map(col => `\`${col}\``).join(', ')

    let where = this.whereCompiler.compile()
    let bindings: Value[] = []
    return {
      prepare: `SELECT ${columnStr} FROM \`${tableName}\` ${where.prepare}`,
      bindings: bindings.concat(where.bindings)
    }
  }
}
