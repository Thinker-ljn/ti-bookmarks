import trunk$ from '../trunk'
import { BranchData } from '../types'
import { filterAndScan } from './base'
import { filter, scan, merge, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface Bookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

export const bookmarks$ = filterAndScan<Bookmark>(trunk$, 'bookmarks')

const bookmarkIdsByTagApiReg = /tags\/\d+\/bookmarks/
export type BookmarkIdsByTag = {
  [index: number]: number[]
}
export const bookmarkIdsByTag$: Observable<BookmarkIdsByTag> = trunk$.pipe(
  filter(packet => bookmarkIdsByTagApiReg.test(packet.api)),
  map(packet => packet.data),
  merge(of({})),
  scan((acc: BookmarkIdsByTag, value: BookmarkIdsByTag): BookmarkIdsByTag => {
    return Object.assign(acc, value)
  }, {})
)

// bookmarkIdsByTag$.subscribe(v => {
//   console.log('bookmarkIdsByTag', v)
// })
