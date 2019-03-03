import trunk$ from '../trunk'
import { BranchData } from '../types'
import { filterAndScan } from './base'

export interface Bookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

export const bookmarks$ = filterAndScan<Bookmark>(trunk$, 'bookmarks')

bookmarks$.subscribe(v => {
  console.log('bookmarks', v)
})
