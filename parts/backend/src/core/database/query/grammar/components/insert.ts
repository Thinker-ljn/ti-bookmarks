/**
 * prepare: INSERT INTO table (col1, col2, ..) VALUES (?, ? ...), (?, ? ...)  ...
 * bindings:                                         [v10, v20,   v11, v21 ]
 * ['values']
 */

import BaseGrammar, { CompileResult } from '../base'
import { parameterize } from '../utils'
import { Data, Value } from './where'

export default class InsertGrammar<T extends Data> extends BaseGrammar<T> {
  public compile (data?: T | T[]): CompileResult {
    if (!data || !Array.isArray(data)) { throw new Error('Inserted Data Is Not A Array!') }
    const {tableName} = this.builder

    const keys = Object.keys(data[0])
    const columns = keys.map((k) => `\`${k}\``).join(', ')
    const parameters = data.map(() => {
      return '(' + parameterize(keys) + ')'
    }).join(', ')

    const prepare = `INSERT INTO \`${tableName}\` (${columns}) VALUES ${parameters}`
    const bindings = this.parseBindings(data)
    return {prepare, bindings}
  }

  public parseBindings (data: T[]): Value[] {
    if (!data.length) { return [] }
    const keys = Object.keys(data[0])
    return data.reduce((bindings: Value[], d) => {
      return bindings.concat(keys.map((k) => d[k]))
    }, [])
  }
}
