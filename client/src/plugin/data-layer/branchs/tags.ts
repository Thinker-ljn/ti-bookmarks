import trunk$ from '../trunk'
import { BranchData } from '../types'
import { filterAndScan } from './base'

export interface Tag extends BranchData {
  name: string,
  children?: Tag[],
  parent_id?: number
}

export const tags$ = filterAndScan<Tag>(trunk$, 'tags')

tags$.subscribe(v => console.log('tags', v))
