import Tree from "./core/tree";
import TagBranch, { DLTag } from "./branchs/tags";
import BookmarkBranch, { DLBookmark } from "./branchs/bookmarks";

class DataLayer extends Tree {
  readonly tags: TagBranch = this.registerBranch(TagBranch)
  readonly bookmarks: BookmarkBranch = this.registerBranch(BookmarkBranch)
}

let DL = new DataLayer

export default DL
export {
  DLTag,
  DLBookmark
}
