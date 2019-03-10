import { GrammarConstructor } from "./grammar/base";

export type Operator = string
export type BooleanOperator = 'and' | 'or'
export type Value = string | number
export type Column<T> = keyof T
export type KeyMap<T> = {[key: string]: T}
export type Data = KeyMap<Value>
export interface Where<T extends Data> {
  column: Column<T>,
  operator: Operator,
  value: Value,
  boolean: BooleanOperator,
  handler: GrammarConstructor<T>
}