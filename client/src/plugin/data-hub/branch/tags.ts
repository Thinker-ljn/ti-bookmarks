import trunk$, { packet }  from '../trunk'
import { filter, map, scan } from 'rxjs/operators'
import { branchData, create, remove } from './util'
// const tagsTree

export interface tag extends branchData {
  name: string,
  children?: tag[],
  parent_id?: number
}

type tags = tag[]
type map = {[key: string]: tags}
type tagPacket = packet<tags|tag>
const toTree = (tags: tags) => {
  let result: tag = {
    id: 0,
    name: '标签',
    children: []
  }
  let map: map = tags.reduce((prev: map, curr: tag) => {
    if (!prev[curr.parent_id]) prev[curr.parent_id] = []
    prev[curr.parent_id].push(curr)
    return prev
  }, {})

  function getTagChildren (node: tag) {
    const children: tags = map[node.id] ? map[node.id] : []
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
  filter((packet: tagPacket) => packet.key === 'tags'),
  scan((prev: tags|null, curr: tagPacket): tags => {
    if (!prev) prev = []
    let {data, method} = curr
    if (method === 'get') prev = prev.concat(data)
    if (method === 'post') prev = create(prev, data)
    if (method === 'delete') prev = remove(prev, data)
    return prev
  }, [])
)

export const tagsTree$ = tags$.pipe(
  map((data: tags) => toTree(data))
)
tags$.subscribe(v => {
  console.log('tag', v)
})
// export default tags$
