import Builder from "../builder";
import { Data, Value } from "../types";
import WhereGrammar from "./components/where";

export type CompileResult = {
  prepare: string,
  bindings: Value[]
}

interface GrammarInstance<T extends Data> {
  components: GrammarConstructor<T>[]
  builder: Builder<T>
}

export interface GrammarConstructor<T extends Data> {
  new (builder: Builder<T>): GrammarInstance<T>
}

export default abstract class BaseGrammar<T extends Data> implements GrammarInstance<T> {
  components: GrammarConstructor<T>[] = []
  builder: Builder<T>
  abstract compile (data?: T | T[]): CompileResult

  constructor (builder: Builder<T>) {
    this.builder = builder
  }
}

export abstract class BaseMainGrammar<T extends Data> extends BaseGrammar<T> {
  whereCompiler: WhereGrammar<T> = new WhereGrammar(this.builder)
}
