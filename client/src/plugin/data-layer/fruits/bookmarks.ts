import Base from './base'
import { bookmarks$, Bookmark } from '../branchs/bookmarks'

class bookmarks extends Base<Bookmark> {
  constructor () {
    super()
    this.initSource()
  }

  initSource () {
    this.source$ = this.handlePending(bookmarks$)
  }
}

export default bookmarks
