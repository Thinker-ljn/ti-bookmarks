import { Observable } from 'rxjs'
// import { PacketData } from '../types'

export interface KeyMap<T> {[key: string]: T}
export interface IndexMap<T> {[index: number]: T}

export interface Packet<T> {
  namespace: string,
  api: string,
  method: string,
  status: number,
  __key__?: string,
  data: T
}
export type TrunkPacket = Packet<PacketData>
// type Method = 'get' | 'post' | 'patch' | 'detele'
export type DLTrunkSource = Observable<TrunkPacket>
export type DLTrunkErrorSource = Observable<Packet<Error>>

export type PendingStatus = 'creating' | 'updating' | 'deleting'

export interface BaseData {
  id?: number,
  __status__?: PendingStatus
}

export interface BranchData extends BaseData {
  id: number,
  __key__: string,
  updated_at?: any,
  created_at?: any
}

export interface Tag extends BranchData {
  name: string,
  children?: Tag[],
  parent_id?: number
}

export interface Bookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

export type PacketData = any
