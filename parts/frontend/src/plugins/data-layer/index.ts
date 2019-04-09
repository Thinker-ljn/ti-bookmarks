import { DLBookmark } from './branchs/bookmarks';
import { DLTag } from './branchs/tags';

import DataLayerTree from './data-layer-tree';
import errorHandler from './error-handler';

const DL = new DataLayerTree({
  errorHandler,
})

export default DL
export {
  DLTag,
  DLBookmark,
}
