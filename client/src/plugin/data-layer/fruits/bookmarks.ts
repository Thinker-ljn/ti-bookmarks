import Base from './base'
import { bookmarks$, bookmarkIdsByTag$, Bookmark } from '../branchs/bookmarks'
import { Tag, IndexMap } from '../types'
import Axios from 'axios';
import { BehaviorSubject} from 'rxjs';
import { combineLatest, pairwise, map, startWith } from 'rxjs/operators';

const currFilterTag$ = new BehaviorSubject<Tag>({id: 0, name: ''})
type IdMap = IndexMap<boolean>
const filterBookmarks$ = bookmarks$.pipe(
  startWith([true, []]),
  combineLatest(bookmarkIdsByTag$, currFilterTag$, (bks: Bookmark[], bkids, tag: Tag): [boolean, Bookmark[]] => {
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
const queryedTag: IdMap = {}

class BookmarksFruit extends Base<Bookmark> {
  constructor () {
    super()
    this.initSource()
  }

  initSource () {
    this.source$ = this.handlePending(filterBookmarks$)
  }

  filterByTag (tag: Tag) {
    currFilterTag$.next(tag)
    if (!tag || queryedTag[tag.id]) return
    queryedTag[tag.id] = true
    Axios.get(`tags/${tag.id}/${this.namespace}`)
  }
}

export default BookmarksFruit
