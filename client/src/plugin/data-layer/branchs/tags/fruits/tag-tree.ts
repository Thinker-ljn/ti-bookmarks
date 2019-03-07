import Fruit from "@/plugin/data-layer/core/fruit";
import { DLTag } from "..";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

type TagMap = {[key: string]: DLTag[]}
const toTree = (tags: DLTag[]) => {
  let result: DLTag = {
    id: 0,
    __key__: '0-0',
    parent_id: 0,
    name: '标签',
    children: []
  }
  let map: TagMap = tags.reduce((prev: TagMap, curr: DLTag) => {
    if (!prev[curr.parent_id]) prev[curr.parent_id] = []
    prev[curr.parent_id].push(curr)
    return prev
  }, {})

  function getTagChildren (node: DLTag) {
    const children: DLTag[] = map[node.id] ? map[node.id] : []
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

export default class TagTreeFruit extends Fruit<DLTag> {
  source_: Observable<DLTag[]> = this.branch.default_.pipe(
    map((tags: DLTag[]) => toTree(tags))
  )
}
