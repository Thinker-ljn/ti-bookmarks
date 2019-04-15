/**
 * prepare: TRUNCATE TABLE table
 * bindings: []
 */
import BaseGrammar from '../base'
import { Data } from './where'

export default class TruncateGrammar<T extends Data> extends BaseGrammar<T> {
  public compile () {
    const {tableName} = this.builder

    return {
      prepare: `TRUNCATE TABLE  \`${tableName}\``,
      bindings: [],
    }
  }
}
