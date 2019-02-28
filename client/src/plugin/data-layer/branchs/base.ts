import { Packet, TruckType }  from '../trunk'
import { filter, scan } from 'rxjs/operators'
import { BranchData, accumulator } from './util'
import { PacketData } from './types'

export default class Base {

}

export const filterAndScan = <T extends BranchData>(trunk$: TruckType, key: string) => {
  type T0 = Extract<PacketData, T>
  type BranchPacket = Packet<T0>
  return trunk$.pipe(
    filter((packet: BranchPacket) => packet.key === key),
    scan((prev: T[]|null, curr: BranchPacket): T[] => {
      return accumulator(prev, curr)
    }, [])
  )
}
