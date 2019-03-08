import Tree from "./core/tree";
import TagsBranch, { DLTag } from "./branchs/tags";
import BookmarksBranch, { DLBookmark } from "./branchs/bookmarks";

class DataLayer extends Tree {
  readonly tags = this.registerBranch(TagsBranch) as TagsBranch
  readonly bookmarks = this.registerBranch(BookmarksBranch) as BookmarksBranch
}

let DL = new DataLayer

export default DL
export {
  DLTag,
  DLBookmark
}
