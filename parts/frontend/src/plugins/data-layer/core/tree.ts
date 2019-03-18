import { BranchConstructor } from './branch'
import Root from './root';
import Trunk from './trunk';
import { KeyMap } from './types';

export default class Tree {
  public root: Root
  public trunk: Trunk
  public branchsRegistered: KeyMap<boolean> = {}
  constructor () {
    this.root = new Root()
    this.trunk = new Trunk(this.root)
  }

  public registerBranch <T> (branchClass: BranchConstructor<T>) {
    const name = branchClass.name
    this.branchsRegistered[name] = true

    const branch = new branchClass(this.trunk)
    return branch
  }
}
