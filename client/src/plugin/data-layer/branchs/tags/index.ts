import Branch from "../../core/branch";
import Fruit from "../../core/fruit";
import { Observable } from "rxjs";
import { BranchData } from "../../core/types";
import TagTreeFruit from "./fruits/tag-tree";

export interface DLTag extends BranchData {
  name: string,
  parent_id: number,
  children?: DLTag[]
}

class TagFruit extends Fruit<DLTag> {
  source_: Observable<DLTag[]> = this.branch.default_
}

export default class TagsBranch extends Branch<DLTag> {
  readonly default_: Observable<DLTag[]> = this.registerFruit<DLTag[]>(TagFruit)
  readonly tree_ = this.registerFruit<DLTag[]>(TagTreeFruit)
}
