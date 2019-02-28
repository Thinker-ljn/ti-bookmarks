import trunk$, { Packet }  from '../trunk'
import { filter, map, scan } from 'rxjs/operators'
import { BranchData, accumulator } from './util'

export interface Tag extends BranchData {
  name: string,
  children?: Tag[],
  parent_id?: number
}

export type Tags = Tag[]
type map = {[key: string]: Tags}
type TagPacket = Packet<Tags|Tag>
const toTree = (tags: Tags) => {
  let result: Tag = {
    id: 0,
    name: '标签',
    children: []
  }
  let map: map = tags.reduce((prev: map, curr: Tag) => {
    if (!prev[curr.parent_id]) prev[curr.parent_id] = []
    prev[curr.parent_id].push(curr)
    return prev
  }, {})

  function getTagChildren (node: Tag) {
    const children: Tags = map[node.id] ? map[node.id] : []
    let _children = []
    for (let child of children) {
      child.children = getTagChildren(child)
      _children.push(child)
    }
    return _children
  }
  result.children = getTagChildren(result)

  return [result]
}

export const tags$ = trunk$.pipe(
  filter((packet: TagPacket) => packet.key === 'tags'),
  scan((prev: Tags|null, curr: TagPacket): Tags => {
    return accumulator(prev, curr)
  }, [])
)

export const tagsTree$ = tags$.pipe(
  map((data: Tags) => toTree(data))
)
