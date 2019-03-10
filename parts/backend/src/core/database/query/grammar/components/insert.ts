import BaseGrammar from "../base";
import { Value, Data } from "../../types";

export default class InsertGrammar<T extends Data> extends BaseGrammar<T> {
  compile () {
    let {tableName, data} = this.builder
    if (!data.length) return ''

    let keys = Object.keys(data[0])
    let columns = keys.map(k => `\`${k}\``).join(', ')
    let parameters = data.map(() => {
      return '(' + (new Array(keys.length)).fill('?').join(', ') + ')'
    }).join(', ')

    return `insert into \`${tableName}\` (${columns}) values ${parameters}`
  }

  getBindings () {
    let { data } = this.builder
    if (!data.length) return ''
    let keys = Object.keys(data[0])
    return data.reduce((bindings: Value[], d) => {
      return bindings.concat(keys.map(k => d[k]))
    }, [])
  }
}
