import Fruit from "@/plugin/data-layer/core/fruit";
import { DLTag } from "@/plugin/data-layer";
import { map } from "rxjs/operators";
import TagsBranch from "..";

type Kinship = {
  p: number[],
  c: number[]
}

type KinshipMap = {
  [key: number]: Kinship
}
const geneKinship = (tags: DLTag[]) => {
  let kinship: KinshipMap = {}
  const traverse = (_tag: DLTag, parent?: DLTag) => {
    let kinshipOfParent: number[] = []
    kinship[_tag.id] = {p: [], c: []}
    if (parent) {
      let pRel = kinship[parent.id]
      if (pRel) kinshipOfParent = pRel.p.slice(0)
      kinshipOfParent.push(parent.id)
      kinship[_tag.id].p = kinshipOfParent
    }

    for (let pid of kinshipOfParent) {
      let pRel = kinship[pid]
      if (pRel) pRel.c.push(_tag.id)
    }

    if (_tag.children && _tag.children.length) {
      for (let child of _tag.children) {
        traverse(child, _tag)
      }
    }
  }
  if (!tags[0]) return {}
  traverse(tags[0])
  return kinship
}

export default class TagKinshipFruit extends Fruit<KinshipMap, TagsBranch> {
  readonly source_ = this.branch.default_.pipe(
    map(tags => geneKinship(tags))
  )
}
