import trunk$ from '../trunk'
import { map } from 'rxjs/operators'
import { BranchData, KeyNumberMap } from '../types'
import { filterAndScan } from './base'

export interface Tag extends BranchData {
  name: string,
  children?: Tag[],
  parent_id?: number
}

export type Tags = Tag[]
type TagMap = {[key: string]: Tags}
const toTree = (tags: Tags) => {
  let result: Tag = {
    id: 0,
    name: '标签',
    children: []
  }
  let map: TagMap = tags.reduce((prev: TagMap, curr: Tag) => {
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

type relation = {
  p: number[],
  c: number[]
}
const geneRelation = (tags: Tag[]) => {
  let relation: KeyNumberMap<relation> = {}
  const traverse = (_tag: Tag, parent?: Tag) => {
    let relationOfParent: number[] = []
    relation[_tag.id] = {p: [], c: []}
    if (parent) {
      let pRel = relation[parent.id]
      if (pRel) relationOfParent = pRel.p.slice(0)
      relationOfParent.push(parent.id)
      relation[_tag.id].p = relationOfParent
    }

    for (let pid of relationOfParent) {
      let pRel = relation[pid]
      if (pRel) pRel.c.push(_tag.id)
    }

    if (_tag.children && _tag.children.length) {
      for (let child of _tag.children) {
        traverse(child, _tag)
      }
    }
  }
  if (!tags[0]) return null
  traverse(tags[0])
  return relation
}

export const tags$ = filterAndScan<Tag>(trunk$, 'tags')

export const tagsTree$ = tags$.pipe(
  map((data: Tags) => toTree(data))
)

export const tagsRelation$ = tagsTree$.pipe(
  map((data: Tag[]) => geneRelation(data))
)

tagsRelation$.subscribe(v => {
  console.log('r:', v)
})
