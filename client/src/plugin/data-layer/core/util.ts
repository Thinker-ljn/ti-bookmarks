import { BranchData } from './types'

type SingleFn = <T extends BranchData> (prev: T[], curr: T) => T[]

function findIndex<T extends BranchData> (prev: T[], curr: T): number {
  return prev.findIndex(item => item.id === curr.id)
}

export const singleUpdate: SingleFn = function (prev, curr) {
  let index = findIndex(prev, curr)
  if (index > -1) prev.splice(index, 1, curr)
  else prev.push(curr)
  return prev
}

export const singleRemove: SingleFn = function (prev, curr) {
  let index = findIndex(prev, curr)
  if (index > -1) prev.splice(index, 1)
  return prev
}
