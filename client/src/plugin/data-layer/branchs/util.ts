import { Packet }  from '../trunk'

export type KeyStringMap<T> = {[key: string]: T}
export type KeyNumberMap<T> = {[key: number]: T}

export interface BranchData {
  id: number,
  updated_at?: any,
  created_at?: any
}
type mixFn = <T extends BranchData> (prev: T[], curr: T | T[]) => T[]
type singleFn = <T extends BranchData> (prev: T[], curr: T) => T[]

export const create: mixFn = function (prev, curr) {
  const singleCreate: singleFn = function (prev, curr) {
    let item = prev.find(item => item.id === curr.id)
    if (!item) prev.push(curr)
    return prev
  }
  if (!Array.isArray(curr)) {
    prev = singleCreate(prev, curr)
    return prev
  }
  for (let _curr of curr) {
    prev = singleCreate(prev, _curr)
  }
  return prev
}

export const update: mixFn = function (prev, curr) {
  const singleUpdate: singleFn = function (prev, curr) {
    let index = prev.findIndex(item => item.id === curr.id)
    if (index > -1) prev.splice(index, 1, curr)
    return prev
  }
  if (!Array.isArray(curr)) {
    prev = singleUpdate(prev, curr)
    return prev
  }
  for (let _curr of curr) {
    prev = singleUpdate(prev, _curr)
  }
  return prev
}

export const remove: mixFn = function (prev, curr) {
  const singleRemove: singleFn = function (prev, curr) {
    let index = prev.findIndex(item => item.id === curr.id)
    if (index > -1) prev.splice(index, 1)
    return prev
  }
  if (!Array.isArray(curr)) {
    prev = singleRemove(prev, curr)
    return prev
  }
  for (let _curr of curr) {
    prev = singleRemove(prev, _curr)
  }
  return prev
}

export const accumulator = <T extends BranchData>(prev: T[] | null, curr: Packet<T | T[]>): T[] => {
  if (!prev) prev = []
  let {data, method} = curr
  if (method === 'get') prev = prev.concat(data)
  if (method === 'post') prev = create(prev, data)
  if (method === 'delete') prev = remove(prev, data)
  return prev
}
