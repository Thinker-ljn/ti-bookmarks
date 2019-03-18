import {BranchConstructor} from './branch';
import Tree from './tree';
import { BranchData } from './types';

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
  const tree = new Tree()
  a.forEach(b => tree.registerBranch(b))
  return tree
}

export default getDL
