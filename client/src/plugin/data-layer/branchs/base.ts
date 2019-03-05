import { Packet, TruckType }  from '../trunk'
import { filter, scan, map } from 'rxjs/operators'
import { accumulator } from './util'
import { BranchData, PacketData } from '../types'
import { Observable } from 'rxjs';

export default class Base {

}

const addKey = function <T extends BranchData>(data: T[]) {
  // since we used react hooks, we need a new array reference to update our UI
  return data.slice(0).map(d => {
    if (!d.__key__) d.__key__ = d.id + '-0'
    return d
  })
}

export const filterAndScan = <T extends BranchData>(trunk$: TruckType, api: string): Observable<T[]> => {
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
