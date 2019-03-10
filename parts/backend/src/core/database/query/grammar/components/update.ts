import BaseGrammar from "../base";
import { Data } from "../../types";

export default class UpdateGrammar<T extends Data> extends BaseGrammar<T> {
  compile () {
    let {data, tableName} = this.builder
    let columns = Object.keys(data).map(column => `\`${column}\` = ?`).join(', ')

    let wheres = ''
    return `update \`${tableName}\` set ${columns} ${wheres}`
  }

  getUpdateBindings () {
    // ['join', 'set', 'where', 'having', 'order', 'union']
    // let {data} = this.builder
    // let updateBindings = Object.keys(data).map(key => data[key])
    // let bindings = query.bindings
    // return Object.keys(bindings)
    // .filter(key => key !== 'select' || key !== 'join')
    // .map(key => bindings[key])
    // .reduce((prev, curr) => {
    //   return prev.concat(curr)
    // }, bindings.join.concat(updateBindings))
  }
}
