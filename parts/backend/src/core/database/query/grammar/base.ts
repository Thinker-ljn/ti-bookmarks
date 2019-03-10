import Builder from "../builder";
import { Data } from "../types";

interface GrammarInstance<T extends Data> {
  components: GrammarConstructor<T>[]
  builder: Builder<T>
  compile (): string
}

export interface GrammarConstructor<T extends Data> {
  new (builder: Builder<T>): GrammarInstance<T>
}

export default abstract class BaseGrammar<T extends Data> implements GrammarInstance<T> {
  components: GrammarConstructor<T>[] = []
  builder: Builder<T>
  abstract compile (): string 

  constructor (builder: Builder<T>) {
    this.builder = builder
  }
}