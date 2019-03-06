import Root from "./root";
import Trunck from "./trunck";
import { KeyMap } from "./types";
import { BranchConstructor, BranchInstance } from './branch'

export default class Tree {
  root: Root
  trunck: Trunck
  branchs: KeyMap<BranchInstance>
  constructor () {
    this.root = new Root
    this.trunck = new Trunck(this.root)
  }

  registerBranch <T extends BranchInstance>(branchClass: BranchConstructor<T>) {
    let name = branchClass.name
    let branch: T
    if (this.branchs[name] instanceof branchClass) {
      branch = this.branchs[name] as T
    } else {
      branch = new branchClass(this.trunck)
      this.branchs[name] = branch
      name = name.replace('Branch', '').toLowerCase()
      Object.defineProperty(this, name, {
        get: () => {
          return branch
        }
      })
    }
    return branch
  }
}


// export const register = <T extends BranchInstance> (branchClass: BranchConstructor<T>) => {
//   let name = branchClass.name
//   let branch: T
//   if (this.branchs[name] instanceof branchClass) {
//     branch = this.branchs[name] as T
//   } else {
//     branch = new branchClass(this.trunck)
//     this.branchs[name] = branch
//   }
//   return branch
// }
