import { Observable } from 'rxjs';
import { filter, map, scan, startWith } from 'rxjs/operators';
import { DLTag } from '../..';
import Branch from '../../core/branch';
import { BranchData, IndexMap } from '../../core/types';
import BookmarksFilterByTagFruit, { currFilterTag_ } from './fruits/bookmarks-filter-by-tag';
const queryedTag: IndexMap<boolean> = {}

export interface DLBookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

const bookmarkIdsByTagApiReg = /tags\/\d+\/bookmarks/
export type BookmarkIdsByTag = IndexMap<number[]>

export default class BookmarksBranch extends Branch<DLBookmark> {
  public readonly exampleData: DLBookmark = {
    id: 0,
    name: '',
    url: '',
    __key__: '',
  }

  public readonly idKeybyTag_ = this.initIdKeyByTag_()
  public readonly filterByTag_ = this.registerFruit(BookmarksFilterByTagFruit, this)

  public initIdKeyByTag_ (): Observable<BookmarkIdsByTag> {
    return this.trunk_.pipe(
      filter(packet => bookmarkIdsByTagApiReg.test(packet.api)),
      map(packet => packet.data),
      scan((acc: BookmarkIdsByTag, value: BookmarkIdsByTag): BookmarkIdsByTag => {
        return Object.assign(acc, value)
      }, {}),
      startWith({}),
    )
  }

  public filterByTag (tag: DLTag) {
    currFilterTag_.next(tag)
    if (!tag || queryedTag[tag.id]) { return }

    queryedTag[tag.id] = true
    this.axios.get(`tags/${tag.id}/${this.namespace}`)
  }
}
