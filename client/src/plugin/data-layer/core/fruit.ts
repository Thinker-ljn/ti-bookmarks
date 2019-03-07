import Branch from './branch'
import { BranchData } from './types';
import { Observable } from 'rxjs';

export interface FruitInterface<T extends BranchData, O> {
  branch: Branch<T>
  source_: Observable<O>
}

export interface FruitConstructor<T extends BranchData, O> {
  new (branch: Branch<T>): FruitInterface<T, O>
}

export default class Fruit<T extends BranchData, O = T[]> implements FruitInterface<T, O> {
  branch: Branch<T>
  source_: Observable<O>
  constructor (branch: Branch<T>) {
    this.branch = branch
  }
}

// export type FruitInstance = InstanceType<typeof Fruit>
