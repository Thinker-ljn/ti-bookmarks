import trunk$ from '../trunk'
import { BranchData } from './util'
import { filterAndScan } from './base'

export interface Bookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

export const bookmarks$ = filterAndScan<Bookmark>(trunk$, 'bookmark')
