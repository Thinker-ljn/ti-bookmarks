import Tree from "./tree";
import Branch, {BranchConstructor} from "./branch";
import Fruit from "./fruit";
import { BranchData } from "./types";

export interface Tag extends BranchData {
  name: string,
  children?: Tag[],
  parent_id?: number
}

export interface Bookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}


class TagFruit extends Fruit {
  test3 () {
    console.log(33333)
  }
}

// class BookmarkFruit extends Fruit {
//   test4 () {
//     console.log(44444)
//   }
// }

class TagBranch extends Branch<Tag> {
  tag?: TagFruit
  registerFruits () {
    this.registerFruit(TagFruit)
  }

  test1 () {
    console.log(111)
  }
}

class BookmarkBranch extends Branch<Bookmark> {
  test2 () {
    console.log(2222)
  }
}
type Ext = {
  Tree: {
    tag?: TagBranch
  }
}

function getDL<T extends BranchConstructor<InstanceType<T>>> (a: T[]) {
  let tree: Tree & Ext['Tree'] = new Tree
  a.forEach(_b => tree.registerBranch(_b))
  return tree
}


const DL = getDL([BookmarkBranch, TagBranch])

