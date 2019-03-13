import Builder from '../builder'
import WhereGrammar, { Data, Value } from './components/where'

export interface CompileResult {
  prepare: string,
  bindings: Value[],
}

interface GrammarInstance<T extends Data> {
  components: Array<GrammarConstructor<T>>
  builder: Builder<T>
}

export type GrammarConstructor<T extends Data> = new (builder: Builder<T>) => GrammarInstance<T>

export default abstract class BaseGrammar<T extends Data> implements GrammarInstance<T> {
  public components: Array<GrammarConstructor<T>> = []
  public builder: Builder<T>
  public abstract compile (data?: T | T[]): CompileResult

  constructor (builder: Builder<T>) {
    this.builder = builder
  }
}

// tslint:disable-next-line: max-classes-per-file
export abstract class BaseMainGrammar<T extends Data> extends BaseGrammar<T> {
  public abstract whereCompiler: WhereGrammar<T>
}
