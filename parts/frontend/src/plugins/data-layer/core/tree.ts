import { BranchConstructor } from './branch'
import DataCacheStore from './cache';
import Root from './root';
import Trunk from './trunk';
import { KeyMap } from './types';
import Axios from 'axios';
import TreeErrorHandler, { ErrorHandler } from './error';

interface TreeOptions {
  errorHandler?: ErrorHandler
}
export default class Tree {
  public root: Root
  public trunk: Trunk
  public cache: DataCacheStore
  public errorHandler?: TreeErrorHandler
  private branchsRegistered: KeyMap<boolean> = {}
  private branchs: KeyMap<any> = {}
  public axios = Axios
  constructor (options?: TreeOptions) {
    this.root = new Root(this)
    this.trunk = new Trunk(this.root)
    this.cache = new DataCacheStore(this.trunk)
    if (options && options.errorHandler) {
      this.errorHandler = new TreeErrorHandler(this.trunk, options.errorHandler)
    }
  }

  public registerBranch <T> (branchClass: BranchConstructor<T>) {
    const name = branchClass.name
    if (this.branchs[name]) {
      return this.branchs[name]
    }

    const branch = new branchClass(this.trunk)
    this.branchsRegistered[name] = true
    this.branchs[name] = branch
    this.cache.register(branch.namespace, branch.default_)
    return branch
  }
}
