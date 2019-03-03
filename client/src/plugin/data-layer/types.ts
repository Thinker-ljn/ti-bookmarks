import { Tag } from './branchs/tags'
import { Bookmark } from './branchs/bookmarks'

export type KeyMap<T> = {[key: string]: T}
export type IndexMap<T> = {[index: number]: T}
export type PendingStatus = 'creating' | 'updating' | 'deleting'
export interface BranchData {
  id?: number,
  __key__?: string,
  __status__?: PendingStatus,
  updated_at?: any,
  created_at?: any
}

export type PacketData = Tag | Tag[] | Bookmark | Bookmark[]

export {
  Tag,
  Bookmark
}
