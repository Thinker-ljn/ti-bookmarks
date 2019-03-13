import { Value } from './components/where'

export function parameterize (values: Value[]) {
  return (new Array(values.length)).fill('?').join(', ')
}
