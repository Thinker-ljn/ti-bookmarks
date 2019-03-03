import { Packet, TruckType }  from '../trunk'
import { filter, scan, map } from 'rxjs/operators'
import { accumulator } from './util'
import { BranchData, PacketData } from '../types'
import { Observable } from 'rxjs';

export default class Base {

}

export const filterAndScan = <T extends BranchData>(trunk$: TruckType, key: string): Observable<T[]> => {
  type T0 = Extract<PacketData, T>
  type BranchPacket = Packet<T0>
  return trunk$.pipe(
    filter((packet: BranchPacket) => packet.key === key),
    scan((prev: T[]|null, curr: BranchPacket): T[] => {
      return accumulator(prev, curr)
    }, []),
    map((data: T[]) => data.slice(0)) 
  )
}
