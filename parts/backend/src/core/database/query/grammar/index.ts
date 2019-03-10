import BaseGrammar, { GrammarConstructor } from "./base";
import { Data } from "../types";

export default class Grammar<T extends Data> extends BaseGrammar<T> {
  compile () {
    return this.compileComponents()
  }

  concatenate (segments: string[]) {
    return segments.filter(segment => segment).join(' ')
  }

  compileComponents () {
    let ComponentGrammer: GrammarConstructor<T>
    let compiled: string[] = []
    for (ComponentGrammer of this.components) {
      let grammar = new ComponentGrammer(this.builder)
      compiled.push(grammar.compile())
    }

    return this.concatenate(compiled)
  }
}