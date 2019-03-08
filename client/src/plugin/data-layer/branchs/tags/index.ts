import Branch from "../../core/branch";
import { BranchData } from "../../core/types";
import TagTreeFruit from "./fruits/tag-tree";
import TagMapFruit from "./fruits/tag-map";
import TagKinshipFruit from "./fruits/tag-kinship";

export interface DLTag extends BranchData {
  name: string,
  parent_id: number,
  children?: DLTag[]
}

export default class TagsBranch extends Branch<DLTag> {
  readonly tree_ = this.registerFruit(TagTreeFruit, this)
  readonly map_ = this.registerFruit(TagMapFruit, this)
  readonly kinship_ = this.registerFruit(TagKinshipFruit, this)
  readonly exampleData: DLTag = {
    id: 0,
    name: '',
    parent_id: 0,
    __key__: ''
  }
}
