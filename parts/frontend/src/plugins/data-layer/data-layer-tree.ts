import BookmarksBranch from './branchs/bookmarks';
import TagsBranch from './branchs/tags';
import Tree from './core/tree';

class DataLayerTree extends Tree {
  public readonly tags = this.registerBranch(TagsBranch) as TagsBranch
  public readonly bookmarks = this.registerBranch(BookmarksBranch) as BookmarksBranch
}

export default DataLayerTree
