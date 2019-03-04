import { Packet }  from '../trunk'
import { BranchData } from '../types'

type SingleFn = <T extends BranchData> (prev: T[], curr: T) => T[]

type ExecFn<T extends BranchData> = (fn: SingleFn) => T[]
type GetUpdateFn = <T extends BranchData> (prev: T[], curr: T | T[]) => ExecFn<T>

function findIndex<T extends BranchData> (prev: T[], curr: T): number {
  return prev.findIndex(item => item.id === curr.id)
}

const singleUpdate: SingleFn = function (prev, curr) {
  let index = findIndex(prev, curr)
  if (index > -1) prev.splice(index, 1, curr)
  else prev.push(curr)
  return prev
}

const singleRemove: SingleFn = function (prev, curr) {
  let index = findIndex(prev, curr)
  if (index > -1) prev.splice(index, 1)
  return prev
}

const getUpdateFn: GetUpdateFn = function (prev, curr) {
  return function (SingleFn) {
    if (!Array.isArray(curr)) {
      prev = SingleFn(prev, curr)
      return prev
    }
    for (let _curr of curr) {
      prev = SingleFn(prev, _curr)
    }
    return prev
  }
}

export const accumulator = <T extends BranchData>(prev: T[] | null, curr: Packet<T | T[]>): T[] => {
  if (!prev) prev = []
  let {data, method, __key__} = curr
  if (!Array.isArray(data) && __key__) data.__key__ = __key__
  if (method === 'get') prev = prev.concat(data)
  let updateFn = getUpdateFn(prev, data)
  if (method === 'post') prev = updateFn(singleUpdate)
  if (method === 'patch') prev = updateFn(singleUpdate)
  if (method === 'delete') prev = updateFn(singleRemove)
  return prev
}
