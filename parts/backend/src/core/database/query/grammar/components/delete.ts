/**
 * prepare: DELETE FROM table ... [WHERE Clause]
 * bindings:                 [v1,     v2 ... ]
 * ['where condition']
 */
import { BaseMainGrammar } from "../base";
import { Data, Value } from "../../types";
import WhereGrammar from "./where";

export default class DeleteGrammar<T extends Data> extends BaseMainGrammar<T> {
  whereCompiler: WhereGrammar<T> = new WhereGrammar(this.builder)
  compile () {
    let {tableName, where} = this.builder
    if (!where.length) throw 'DELETE Record MUST In WHERE Clause'
    let whereCompiled = this.whereCompiler.compile()
    
    let bindings: Value[] = []
    return {
      prepare: `DELETE FROM \`${tableName}\` ${whereCompiled.prepare}`,
      bindings: bindings.concat(whereCompiled.bindings)
    }
  }
}
