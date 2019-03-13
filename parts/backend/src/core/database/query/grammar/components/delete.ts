/**
 * prepare: DELETE FROM table ... [WHERE Clause]
 * bindings:                 [v1,     v2 ... ]
 * ['where condition']
 */
import { BaseMainGrammar } from '../base'
import { Data, Value } from './where'
import WhereGrammar from './where'

export default class DeleteGrammar<T extends Data> extends BaseMainGrammar<T> {
  public whereCompiler: WhereGrammar<T> = new WhereGrammar(this.builder)
  public compile () {
    const {tableName, where} = this.builder
    if (!where.length) { throw new Error('DELETE Record MUST In WHERE Clause') }
    const whereCompiled = this.whereCompiler.compile()

    const bindings: Value[] = []
    return {
      prepare: `DELETE FROM \`${tableName}\` ${whereCompiled.prepare}`,
      bindings: bindings.concat(whereCompiled.bindings),
    }
  }
}
