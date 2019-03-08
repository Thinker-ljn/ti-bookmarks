import Root from "./root";
import Trunk from "./trunk";
import { KeyMap } from "./types";
import { BranchConstructor } from './branch'

export default class Tree {
  root: Root
  trunk: Trunk
  branchsRegistered: KeyMap<boolean> = {}
  constructor () {
    this.root = new Root
    this.trunk = new Trunk(this.root)
  }

  registerBranch <T>(branchClass: BranchConstructor<T>) {
    let name = branchClass.name
    this.branchsRegistered[name] = true

    let branch = new branchClass(this.trunk)
    return branch
  }
}
