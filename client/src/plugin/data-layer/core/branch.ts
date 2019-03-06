import { Observable, of } from 'rxjs';
import { filter, map, merge, combineLatest } from 'rxjs/operators'
import { singleRemove, singleUpdate } from './util'
import { BranchData, PacketData, Packet, DLTrunkSource, KeyMap } from './types'
import Trunk from './trunk'
import Root from './root'
import { FruitConstructor, FruitInstance } from './fruit';

type BranchPacket<T> = Packet<Extract<PacketData, T>>

export default class Branch<T extends BranchData> {
  trunk: Trunk
  root: Root
  trunk_: DLTrunkSource
  raw_: DLTrunkSource
  default_: Observable<T[]>
  init_: Observable<T[]>
  create_: Observable<T>
  update_: Observable<T>
  remove_: Observable<T>
  apiFilter: RegExp
  fruits: KeyMap<FruitInstance>
  constructor (trunk: Trunk, apiFilter?: RegExp) {
    this.trunk = trunk
    this.root = trunk.root
    this.trunk_ = trunk.source_
    if (apiFilter) this.apiFilter = apiFilter
    else this.apiFilter = new RegExp(`^${this.namespace}(\\/)?(\\d+)?([\\?#]|$)`)

    this.initSources()

    this.registerFruits ()
  }

  registerFruits () {}

  get namespace () {
    return this.constructor.name.replace('Branch', '').toLowerCase()
  }

  initSources () {
    this.raw_ = this.trunk_.pipe(
      filter((packet: Packet<PacketData>) => packet.namespace === this.namespace && this.apiFilter.test(packet.api))
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
      merge(of(null))
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

  registerFruit <T extends FruitInstance>(FruitClass: FruitConstructor<T>) {
    let name = FruitClass.name
    let fruit: T
    if (this.fruits[name] instanceof FruitClass) {
      fruit = this.fruits[name] as T
    } else {
      fruit = new FruitClass(this)
      this.fruits[name] = fruit
      name = name.replace('Fruit', '').toLowerCase()
      Object.defineProperty(this, name, {
        get: () => {
          return fruit
        }
      })
    }
    return fruit
  }

  get (fruitName: string) {
    return this.fruits[fruitName]
  }
}

export type BranchInstance = InstanceType<typeof Branch>
export interface BranchConstructor<T> {
  new (trunk: Trunk, apiFilter?: RegExp): T
}
