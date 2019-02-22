import root, { Root, absorbKey, absorbFn } from './root'
import trunck$, { truckType } from './trunk'
import branchs, { branchsType } from './branch'

import { Observable } from 'rxjs'

class DataHub {
  root: Root
  trunck$: truckType
  branchs: branchsType
  constructor () {
    this.root = root
    this.trunck$ = trunck$
    this.branchs = branchs
  }

  get (key: absorbKey, branch: string & keyof branchsType) {
    branch = branch.replace(/^(.*[^$])(\$?)$/, '$1$$')
    this.action(key, 'get', null)
    return this.branchs[branch] || new Observable
  }

  action:absorbFn = (key, method, params) => {
    return this.root.absorb(key, method, params)
  }
}

export default new DataHub
