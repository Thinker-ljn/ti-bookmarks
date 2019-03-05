import TagsFruit from './tags'
import BookmarksFruit from './bookmarks'

class DL {
  _tags: TagsFruit = null
  _bookmarks: BookmarksFruit = null
  get tags() {
    return this._tags ? this._tags : (this._tags = new TagsFruit)
  }
  get bookmarks() {
    return this._bookmarks ? this._bookmarks : (this._bookmarks = new BookmarksFruit)
  }
}

const initDL = () => {
  return new DL
}
export default initDL
