import BookmarksBranch, { DLBookmark } from './branchs/bookmarks';
import TagsBranch, { DLTag } from './branchs/tags';
import Tree from './core/tree';

class DataLayer extends Tree {
  public readonly tags = this.registerBranch(TagsBranch) as TagsBranch
  public readonly bookmarks = this.registerBranch(BookmarksBranch) as BookmarksBranch
}

const DL = new DataLayer()

export default DL
export {
  DLTag,
  DLBookmark,
}
