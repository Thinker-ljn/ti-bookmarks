/**
 * prepare: UPDATE table SET f1 = ?, f2 = ? ... [WHERE Clause]
 * bindings:                 [v1,     v2 ... ]
 * ['join', 'set', 'where condition']
 */
import { BaseMainGrammar, CompileResult } from '../base'
import { Data, Value } from './where'
import WhereGrammar from './where'

export default class UpdateGrammar<T extends Data> extends BaseMainGrammar<T> {
  public whereCompiler: WhereGrammar<T> = new WhereGrammar(this.builder)
  public compile (data?: T | T[]): CompileResult {
    if (!data || Array.isArray(data)) { throw new Error('Compile Update Builder Error') }
    const {tableName} = this.builder
    const columns = Object.keys(data).map((column) => `\`${column}\` = ?`).join(', ')

    const where = this.whereCompiler.compile()
    const prepare = `UPDATE \`${tableName}\` SET ${columns} ${where.prepare}`
    const bindings = this.parseBindings(data).concat(where.bindings)
    return {prepare, bindings}
  }

  public parseBindings (data: T): Value[] {
    return Object.keys(data).map((key) => data[key])
  }
}
