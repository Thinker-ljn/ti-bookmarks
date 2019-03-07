import { Observable, Subject } from 'rxjs';
import { filter, map, combineLatest, startWith, merge } from 'rxjs/operators'
import { singleRemove, singleUpdate } from './util'
import { BranchData, Packet, DLTrunkSource, KeyMap } from './types'
import Trunk from './trunk'
import Root from './root'
import { FruitConstructor, FruitInterface } from './fruit';
import Axios from 'axios';
import Pendding from './pendding';

// type BranchPacket<T> = Packet<Extract<PacketData, T>>
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
  pendding: Pendding<T>

  readonly exampleData: T

  apiFilter: RegExp
  fruitsRegistered: KeyMap<boolean>
  constructor (trunk: Trunk, apiFilter?: RegExp) {
    this.trunk = trunk
    this.root = trunk.root
    this.trunk_ = trunk.source_
    if (apiFilter) this.apiFilter = apiFilter
    else this.apiFilter = new RegExp(`^${this.namespace}(\\/)?(\\d+)?([\\?#]|$)`)

    this.pendding = new Pendding
    this.initSources()

    this.registerFruits()
  }

  registerFruits () {}

  fill (data: Partial<T>): T {
    return Object.assign({}, this.exampleData, data)
  }

  get namespace () {
    return this.constructor.name.replace('Branch', '').toLowerCase()
  }

  initSources () {
    this.raw_ = this.trunk_.pipe(
      filter((packet: Packet<T>) => packet.namespace === this.namespace && this.apiFilter.test(packet.api))
    )

    this.init_ = this.getSourcePart<T[]>('get')
    this.create_ = this.getSourcePart<T>('post')
    this.update_ = this.getSourcePart<T>('patch')
    this.remove_ = this.getSourcePart<T>('delete')

    this.default_ = this.initDefault()
  }

  getSourcePart <T0>(method: string, pendding_?: Subject<T>): Observable<T0> {
    let source_ = this.raw_.pipe(
      filter((packet: Packet<T0>) => packet.method === method),
      map((packet: Packet<T0>) => packet.data),
      startWith()
    )

    if (pendding_) {
      source_ = source_.pipe(
        merge(pendding_)
      )
    }
    return source_
  }

  initDefault (): Observable<T[]> {
    return this.init_.pipe(
      combineLatest(this.create_, this.update_, this.remove_, (i: T[], c: T, u: T, r: T) => {
        i = singleUpdate(i, c)
        i = singleUpdate(i, u)
        i = singleRemove(i, r)
        return i
      }),
      map(data => data.filter(d => d))
    )
  }

  registerFruit <O>(FruitClass: FruitConstructor<T, O>) {
    // if (this.fruitsRegistered[FruitClass.name])
    this.fruitsRegistered[FruitClass.name] = true
    let fruit: FruitInterface<T, O> = new FruitClass(this)
    return fruit.source_
  }

  post (data: Partial<T>) {
    let fullData = this.fill(data)
    let config = this.pendding.push(fullData)
    Axios.post(this.namespace, data, config)
    return this.default_
  }

  patch (data: Partial<T>) {
    let fullData = this.fill(data)
    let config = this.pendding.push(fullData, Pendding.UPDATE)
    Axios.patch(this.namespace, data, config)
    return this.default_
  }

  delete (data: Partial<T>) {
    let fullData = this.fill(data)
    let config = this.pendding.push(fullData, Pendding.DELETE)
    Axios.delete(`${this.namespace}/${data.id}`, config)
    return this.default_
  }
}

export type BranchInstance = InstanceType<typeof Branch>
export interface BranchConstructor<T> {
  new (trunk: Trunk, apiFilter?: RegExp): T
}
