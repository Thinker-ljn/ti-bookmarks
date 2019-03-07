import Branch from "../../core/branch";
import Fruit from "../../core/fruit";
import { Observable } from "rxjs";
import { BranchData } from "../../core/types";

export interface DLBookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

class BookmarkFruit extends Fruit<DLBookmark> {
  source_: Observable<DLBookmark[]> = this.branch.default_
}

export default class BookmarksBranch extends Branch<DLBookmark> {
  readonly default_: Observable<DLBookmark[]> = this.registerFruit(BookmarkFruit)
}
