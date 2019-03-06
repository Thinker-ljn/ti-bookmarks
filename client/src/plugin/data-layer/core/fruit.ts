import {BranchInstance} from './branch'
export default class Fruit {
  branch: BranchInstance
  constructor (branch: BranchInstance) {
    this.branch = branch
  }
}

export type FruitInstance = InstanceType<typeof Fruit>
export interface FruitConstructor<T> {
  new (branch: BranchInstance): T
}
