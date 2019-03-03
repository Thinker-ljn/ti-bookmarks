import { Tag } from './branchs/tags'
import { Bookmark } from './branchs/bookmarks'

export type KeyStringMap<T> = {[key: string]: T}
export type KeyNumberMap<T> = {[key: number]: T}
export type PendindStatus = 'creating' | 'updating' | 'deleting'
export interface BranchData {
  id: number,
  __uid__?: number,
  __status__?: PendindStatus,
  updated_at?: any,
  created_at?: any
}

export type PacketData = Tag | Tag[] | Bookmark | Bookmark[]

export {
  Tag,
  Bookmark
}
