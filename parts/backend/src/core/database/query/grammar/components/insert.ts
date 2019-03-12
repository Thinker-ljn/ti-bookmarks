/**
 * prepare: INSERT INTO table (col1, col2, ..) VALUES (?, ? ...), (?, ? ...)  ...
 * bindings:                                         [v10, v20,   v11, v21 ]
 * ['values']
 */

import BaseGrammar, { CompileResult } from "../base";
import { parameterize } from "../utils";
import { Data, Value } from "./where";

export default class InsertGrammar<T extends Data> extends BaseGrammar<T> {
  compile (data?: T | T[]): CompileResult {
    if (!data || !Array.isArray(data)) throw 'Inserted Data Is Not A Array!'
    let {tableName} = this.builder

    let keys = Object.keys(data[0])
    let columns = keys.map(k => `\`${k}\``).join(', ')
    let parameters = data.map(() => {
      return '(' + parameterize(keys) + ')'
    }).join(', ')

    let prepare = `INSERT INTO \`${tableName}\` (${columns}) VALUES ${parameters}`
    let bindings = this.parseBindings(data)
    return {prepare, bindings}
  }

  parseBindings (data: T[]): Value[] {
    if (!data.length) return []
    let keys = Object.keys(data[0])
    return data.reduce((bindings: Value[], d) => {
      return bindings.concat(keys.map(k => d[k]))
    }, [])
  }
}
