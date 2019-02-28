import { Packet, TruckType }  from '../trunk'
import { filter, scan } from 'rxjs/operators'
import { BranchData, accumulator } from './util'
import { PacketData } from './types'

export default class Base {

}

export const filterAndScan = <T extends BranchData>(trunk$: TruckType, key: string) => {
  type t = Extract<PacketData, T>
  type BranchPacket = Packet<t>
  return trunk$.pipe(
    filter((Packet: BranchPacket) => Packet.key === key),
    scan((prev: T[]|null, curr: BranchPacket): T[] => {
      return accumulator(prev, curr)
    }, [])
  )
}
