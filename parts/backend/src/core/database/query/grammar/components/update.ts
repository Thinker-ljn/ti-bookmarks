/**
 * prepare: UPDATE table SET f1 = ?, f2 = ? ... [WHERE Clause]
 * bindings:                 [v1,     v2 ... ]
 * ['join', 'set', 'where condition']
 */
import { CompileResult, BaseMainGrammar } from "../base";
import { Data, Value } from "../../types";
import WhereGrammar from "./where";

export default class UpdateGrammar<T extends Data> extends BaseMainGrammar<T> {
  whereCompiler: WhereGrammar<T> = new WhereGrammar(this.builder)
  compile (data?: T | T[]): CompileResult {
    if (!data || Array.isArray(data)) throw 'Compile Update Builder Error'
    let {tableName} = this.builder
    let columns = Object.keys(data).map(column => `\`${column}\` = ?`).join(', ')

    let where = this.whereCompiler.compile()
    let prepare = `UPDATE \`${tableName}\` SET ${columns} ${where.prepare}`
    let bindings = this.parseBindings(data).concat(where.bindings)
    return {prepare, bindings}
  }

  parseBindings (data: T): Value[] {
    return Object.keys(data).map(key => data[key])
  }
}
