import { mockHandler, MockAdapter, getStringify } from './mock'
import Axios, { AxiosStatic } from 'axios';

import Tree from '@/plugins/data-layer/core/tree';
// import TagsBranch from '@/plugins/data-layer/branchs/tags';
import BookmarksBranch from '@/plugins/data-layer/branchs/bookmarks';
Axios.defaults.adapter = MockAdapter

class MockTree extends Tree {
  // public readonly tags: TagsBranch
  public readonly bookmarks: BookmarksBranch
  constructor (axios: AxiosStatic = Axios) {
    super ()
    this.cache.clear()
    this.axios = axios
    // this.tags = this.registerBranch(TagsBranch) as TagsBranch
    this.bookmarks = this.registerBranch(BookmarksBranch) as BookmarksBranch
  }
}

export default MockTree
export {
  mockHandler, getStringify,
}
