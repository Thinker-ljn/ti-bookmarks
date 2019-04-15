import { DLBookmark, DLTag } from '@fe/src/plugins/data-layer';
import Fruit from '@fe/src/plugins/data-layer/core/fruit';
import { IndexMap } from '@fe/src/plugins/data-layer/core/types';
import { BehaviorSubject } from 'rxjs';
import { combineLatest, map, pairwise, startWith } from 'rxjs/operators';
import BookmarksBranch from '..';

export const currFilterTag_ = new BehaviorSubject<DLTag>({id: 0, __key__: '', parent_id: 0, name: ''})

type IdMap = IndexMap<boolean>
type Pairwise = [boolean, DLBookmark[]]
export default class BookmarksFilterByTagFruit extends Fruit<DLBookmark[], BookmarksBranch> {
  public source_ = this.filter()
  constructor (branch: BookmarksBranch) {
    super(branch)
    this.branch = branch
  }

  public filter () {
    const idKeybyTag_ = this.branch.idKeybyTag_
    const defaultStart: Pairwise = [true, []]
    return this.branch.default_.pipe(
      combineLatest(idKeybyTag_, currFilterTag_, (bks: DLBookmark[], bkids, tag: DLTag): Pairwise => {
        if (!tag || !tag.id) { return [true, bks] }
        if (!bkids[tag.id]) { return [false, bks] }
        const ids = bkids[tag.id]
        const idMap: IdMap = ids.reduce((acc: IdMap, curr) => {
          acc[curr] = true
          return acc
        }, {})
        return [true, bks.filter(bk => idMap[bk.id])]
      }),
      startWith(defaultStart)
    ).pipe(
      pairwise(),
      map(packet => {
        const [prev, curr] = packet
        const [, pBks] = prev
        const [cFlag, cBks] = curr
        const result = cFlag ? cBks : pBks
        return result
      }),
    )
  }
}
