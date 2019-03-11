/**
 * prepare: SELECT col1, col2, .. FROM table ... [WHERE Clause]
 * bindings: [ ]
 * ['select', join', 'where condition']
 */

import { BaseMainGrammar, CompileResult } from "../base";
import { Data, Value } from "../../types";

export default class SelectGrammar<T extends Data> extends BaseMainGrammar<T> {
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
