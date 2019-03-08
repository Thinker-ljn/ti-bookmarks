import Branch from "../../core/branch";
import { Observable } from "rxjs";
import { BranchData, IndexMap } from "../../core/types";
import { filter, scan, map, startWith } from 'rxjs/operators';
import BookmarksFilterByTagFruit, { currFilterTag_ } from "./fruits/bookmarks-filter-by-tag";
import { DLTag } from "../..";
import Axios from "axios";
const queryedTag: IndexMap<boolean> = {}

export interface DLBookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

const bookmarkIdsByTagApiReg = /tags\/\d+\/bookmarks/
export type BookmarkIdsByTag = IndexMap<number[]>

// class BookmarkFruit extends Fruit<DLBookmark[], BookmarksBranch> {
//   source_: Observable<DLBookmark[]> = this.branch.default_
// }

export default class BookmarksBranch extends Branch<DLBookmark> {
  readonly exampleData: DLBookmark = {
    id: 0,
    name: '',
    url: '',
    __key__: ''
  }

  readonly idKeybyTag_ = this.initIdKeyByTag_()
  readonly filterByTag_ = this.registerFruit(BookmarksFilterByTagFruit, this)

  initIdKeyByTag_ (): Observable<BookmarkIdsByTag> {
    return this.trunk_.pipe(
      filter(packet => bookmarkIdsByTagApiReg.test(packet.api)),
      map(packet => packet.data),
      scan((acc: BookmarkIdsByTag, value: BookmarkIdsByTag): BookmarkIdsByTag => {
        return Object.assign(acc, value)
      }, {}),
      startWith({})
    )
  }

  filterByTag (tag: DLTag) {
    currFilterTag_.next(tag)
    if (!tag || queryedTag[tag.id]) return

    queryedTag[tag.id] = true
    Axios.get(`tags/${tag.id}/${this.namespace}`)
  }
}
