import { DLTag } from '@fe/src/plugins/data-layer';
import Fruit from '@fe/src/plugins/data-layer/core/fruit';
import { map } from 'rxjs/operators';
import TagsBranch from '..';

interface Kinship {
  p: number[],
  c: number[]
}

interface KinshipMap {
  [key: number]: Kinship
}
const geneKinship = (tags: DLTag[]) => {
  const kinship: KinshipMap = {}
  const traverse = (currTag: DLTag, parent?: DLTag) => {
    let kinshipOfParent: number[] = []
    kinship[currTag.id] = {p: [], c: []}
    if (parent) {
      const pRel = kinship[parent.id]
      if (pRel) { kinshipOfParent = pRel.p.slice(0) }
      kinshipOfParent.push(parent.id)
      kinship[currTag.id].p = kinshipOfParent
    }

    for (const pid of kinshipOfParent) {
      const pRel = kinship[pid]
      if (pRel) { pRel.c.push(currTag.id) }
    }

    if (currTag.children && currTag.children.length) {
      for (const child of currTag.children) {
        traverse(child, currTag)
      }
    }
  }
  if (!tags[0]) { return {} }
  traverse(tags[0])
  return kinship
}

export default class TagKinshipFruit extends Fruit<KinshipMap, TagsBranch> {
  public readonly source_ = this.branch.default_.pipe(
    map(tags => geneKinship(tags)),
  )
}
