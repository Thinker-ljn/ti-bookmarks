import Base from './base'
import { bookmarks$, Bookmark } from '../branchs/bookmarks'

class bookmarks extends Base<Bookmark[]> {
  constructor () {
    super()
    this.source$ = bookmarks$
  }
}

export default bookmarks
