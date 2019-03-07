import Branch from "../../core/branch";
import Fruit from "../../core/fruit";
import { Observable } from "rxjs";
import { BranchData } from "../../core/types";
import TagTreeFruit from "./fruits/tag-tree";
import TagMapFruit from "./fruits/tag-map";
import TagKinshipFruit from "./fruits/tag-kinship";

export interface DLTag extends BranchData {
  name: string,
  parent_id: number,
  children?: DLTag[]
}

class TagFruit extends Fruit<DLTag> {
  source_: Observable<DLTag[]> = this.branch.default_
}

export default class TagsBranch extends Branch<DLTag> {
  readonly default_ = this.registerFruit(TagFruit)
  readonly tree_ = this.registerFruit(TagTreeFruit)
  readonly map_ = this.registerFruit(TagMapFruit)
  readonly kinship_ = this.registerFruit(TagKinshipFruit)
  readonly exampleData: DLTag = {
    id: 0, 
    name: '', 
    parent_id: 0, 
    __key__: ''
  }
}
