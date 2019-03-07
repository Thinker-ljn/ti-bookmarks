import Tree from "./tree";
import  {BranchConstructor} from "./branch";
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

function getDL<T extends BranchConstructor<InstanceType<T>>> (a: T[]) {
  let tree = new Tree
  a.forEach(_b => tree.registerBranch(_b))
  return tree
}


// const DL = getDL([BookmarkBranch, TagBranch])

export default getDL
