import BaseGrammar from "../base";

export default class WhereGrammar<T> extends BaseGrammar<T> {
  compile () {
    return this.compileComponents()
  }
}
