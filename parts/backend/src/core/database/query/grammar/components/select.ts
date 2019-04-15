/**
 * prepare: SELECT col1, col2, .. FROM table ... [WHERE Clause]
 * bindings: [ ]
 * ['select', join', 'where condition']
 */

import { BaseMainGrammar, CompileResult } from '../base'
import { Data, Value } from './where'
import WhereGrammar from './where'

export default class SelectGrammar<T extends Data> extends BaseMainGrammar<T> {
  public whereCompiler: WhereGrammar<T> = new WhereGrammar(this.builder)
  public compile (): CompileResult {
    const {columns, tableName} = this.builder
    const columnStr = columns.map((col) => `\`${col}\``).join(', ')

    const where = this.whereCompiler.compile()
    const bindings: Value[] = []
    return {
      prepare: `SELECT ${columnStr || '*'} FROM \`${tableName}\` ${where.prepare}`,
      bindings: bindings.concat(where.bindings),
    }
  }
}
