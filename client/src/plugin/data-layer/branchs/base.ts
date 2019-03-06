import { Packet, DLTruckSource }  from '../trunk'
import { filter, scan, map, merge, combineLatest } from 'rxjs/operators'
import { accumulator, singleRemove, singleUpdate } from './util'
import { BranchData, PacketData } from '../types'
import { Observable, of } from 'rxjs';

const addKey = function <T extends BranchData>(data: T[]) {
  // since we used react hooks, we need a new array reference to update our UI
  return data.slice(0).map(d => {
    if (!d.__key__) d.__key__ = d.id + '-0'
    return d
  })
}

export const filterAndScan = <T extends BranchData>(trunk$: DLTruckSource, api: string): Observable<T[]> => {
  type T0 = Extract<PacketData, T>
  type BranchPacket = Packet<T0>
  return trunk$.pipe(
    filter((packet: BranchPacket) => packet.api === api),
    scan((prev: T[]|null, curr: BranchPacket): T[] => {
      return accumulator(prev, curr)
    }, []),
    map((data: T[]) => addKey(data))
  )
}

type BranchPacket<T> = Packet<Extract<PacketData, T>>
export default class BaseBranch<T extends BranchData> {
  trunck_: DLTruckSource
  raw_: DLTruckSource
  default_: Observable<T[]>
  init_: Observable<T[]>
  create_: Observable<T>
  update_: Observable<T>
  remove_: Observable<T>
  apiFilter: RegExp
  constructor (trunck_: DLTruckSource, apiFilter?: RegExp) {
    this.trunck_ = trunck_
    if (apiFilter) this.apiFilter = apiFilter
    else this.apiFilter = new RegExp(`^${this.namespace}(\\/)?(\\d+)?([\\?#]|$)`)
    this.initSources()
  }

  get namespace () {
    return this.constructor.name.replace('Branch', '').toLowerCase()
  }

  initSources () {
    this.raw_ = this.trunck_.pipe(
      filter((packet: Packet<PacketData>) => packet.key === this.namespace && this.apiFilter.test(packet.api))
    )

    this.init_ = this.getSourcePart<T[]>('get')
    this.create_ = this.getSourcePart<T>('post')
    this.update_ = this.getSourcePart<T>('patch')
    this.remove_ = this.getSourcePart<T>('delete')

    this.default_ = this.initDefault()
  }

  getSourcePart<T0> ( method: string): Observable<T0> {
    return this.raw_.pipe(
      filter((packet: BranchPacket<T0>) => packet.method === method),
      map((packet: BranchPacket<T0>) => packet.data),
      merge(of([]))
    )
  }

  initDefault (): Observable<T[]> {
    return this.init_.pipe(
      combineLatest(this.create_, this.update_, this.remove_, (i: T[], c: T, u: T, r: T) => {
        i = singleUpdate(i, c)
        i = singleUpdate(i, u)
        i = singleRemove(i, r)
        return i
      })
    )
  }
}
