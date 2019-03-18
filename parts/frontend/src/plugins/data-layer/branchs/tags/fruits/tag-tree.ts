import Fruit from '@/plugins/data-layer/core/fruit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import TagsBranch, { DLTag } from '..';

interface TagMap {[key: string]: DLTag[]}
const toTree = (tags: DLTag[]) => {
  const result: DLTag = {
    id: 0,
    __key__: '0-0',
    parent_id: 0,
    name: '标签',
    children: [],
  }
  const tagMap: TagMap = tags.reduce((prev: TagMap, curr: DLTag) => {
    if (!prev[curr.parent_id]) { prev[curr.parent_id] = [] }
    prev[curr.parent_id].push(curr)
    return prev
  }, {})

  function getTagChildren (node: DLTag) {
    const children: DLTag[] = tagMap[node.id] ? tagMap[node.id] : []
    const tempChildren = []
    for (const child of children) {
      child.children = getTagChildren(child)
      tempChildren.push(child)
    }
    return tempChildren
  }
  result.children = getTagChildren(result)

  return [result]
}

export default class TagTreeFruit extends Fruit<DLTag[], TagsBranch> {
  public source_: Observable<DLTag[]> = this.branch.default_.pipe(
    map((tags: DLTag[]) => toTree(tags)),
  )
}
