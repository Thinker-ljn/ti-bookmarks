import BaseGrammar from "../base";
import { Data } from "../../types";

export default class SelectGrammar<T extends Data> extends BaseGrammar<T> {
  compile () {
    let {distinct, columns, tableName} = this.builder
    let select = distinct ? 'select distinct' : 'select'
    let columnString = columns.map(col => `\`${col}\``).join(', ')

    return `${select} ${columnString} from ${tableName}`
  }
}
