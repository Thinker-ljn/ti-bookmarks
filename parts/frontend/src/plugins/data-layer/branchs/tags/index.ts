import Branch from '../../core/branch';
import { BranchData } from '../../core/types';
import TagKinshipFruit from './fruits/tag-kinship';
import TagMapFruit from './fruits/tag-map';
import TagTreeFruit from './fruits/tag-tree';

export interface DLTag extends BranchData {
  name: string,
  parent_id: number,
  children?: DLTag[]
}

export default class TagsBranch extends Branch<DLTag> {
  public readonly tree_ = this.registerFruit(TagTreeFruit, this)
  public readonly map_ = this.registerFruit(TagMapFruit, this)
  public readonly kinship_ = this.registerFruit(TagKinshipFruit, this)
  public readonly exampleData: DLTag = {
    id: 0,
    name: '',
    parent_id: 0,
    __key__: '',
  }
}
