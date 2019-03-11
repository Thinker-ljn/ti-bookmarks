import { Value } from "../types";

export function parameterize (values: Value[]) {
  return (new Array(values.length)).fill('?').join(', ')
}