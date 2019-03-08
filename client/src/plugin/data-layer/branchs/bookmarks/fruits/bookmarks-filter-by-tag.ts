import Fruit from "@/plugin/data-layer/core/fruit";
import { BehaviorSubject } from "rxjs";
import { IndexMap } from "@/plugin/data-layer/core/types";
import { DLBookmark, DLTag } from "@/plugin/data-layer";
import { startWith, combineLatest, pairwise, map } from "rxjs/operators";
import BookmarksBranch from "..";

export const currFilterTag_ = new BehaviorSubject<DLTag>({id: 0, __key__: '', parent_id: 0, name: ''})

type IdMap = IndexMap<boolean>

export default class BookmarksFilterByTagFruit extends Fruit<DLBookmark[], BookmarksBranch> {
  source_ = this.filter()
  constructor (branch: BookmarksBranch) {
    super(branch)
    this.branch = branch
  }

  filter () {
    let idKeybyTag_ = this.branch.idKeybyTag_
    return this.branch.default_.pipe(
      startWith([true, []]),
      combineLatest(idKeybyTag_, currFilterTag_, (bks: DLBookmark[], bkids, tag: DLTag): [boolean, DLBookmark[]] => {
        if (!tag || !tag.id) return [true, bks]
        if (!bkids[tag.id]) return [false, bks]
        let ids = bkids[tag.id]
        let map: IdMap = ids.reduce((acc: IdMap, curr) => {
          acc[curr] = true
          return acc
        }, {})
        return [true, bks.filter(bk => map[bk.id])]
      }),
      pairwise(),
      map(packet => {
        let [prev, curr] = packet
        let [, pBks] = prev
        let [cFlag, cBks] = curr
        let result = cFlag ? cBks : pBks
        return result
      })
    )
  }
}
