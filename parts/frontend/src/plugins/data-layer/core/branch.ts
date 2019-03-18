import Axios from 'axios';
import { Observable } from 'rxjs';
import { combineLatest, filter, map, startWith } from 'rxjs/operators'
import { FruitConstructor } from './fruit';
import Pendding, {MergeFn} from './pendding';
import Root from './root'
import Trunk from './trunk'
import { BranchData, DLTrunkSource, KeyMap, Packet } from './types'
import { singleRemove, singleUpdate } from './util'

export interface BranchInterface<T> {
  default_: Observable<T[]>
  exampleData: T
}

export type BranchConstructor<T> = new (trunk: Trunk, apiFilter?: RegExp) => BranchInterface<T>

export default abstract class Branch<T extends BranchData> implements BranchInterface<T> {
  public trunk: Trunk
  public root: Root
  public trunk_: DLTrunkSource
  public raw_: DLTrunkSource

  public default_: Observable<T[]>
  public init_: Observable<T[]>
  public create_: Observable<T[]>
  public update_: Observable<T[]>
  public delete_: Observable<T[]>

  public pendding: Pendding<T>

  public readonly abstract exampleData: T

  public apiFilter: RegExp
  public fruitsRegistered: KeyMap<boolean> = {}
  constructor (trunk: Trunk, apiFilter?: RegExp) {
    this.trunk = trunk
    this.root = trunk.root
    this.trunk_ = trunk.source_
    if (apiFilter) {
      this.apiFilter = apiFilter
    } else {
      this.apiFilter = new RegExp(`^${this.namespace}(\\/)?(\\d+)?([\\?#]|$)`)
    }

    this.pendding = new Pendding()
    this.initSources()

    this.get()
  }

  public fill (data: Partial<T>): T {
    return Object.assign({}, this.exampleData, data)
  }

  get namespace () {
    return this.constructor.name.replace('Branch', '').toLowerCase()
  }

  public initSources () {
    this.raw_ = this.trunk_.pipe(
      filter((packet: Packet<T>) => packet.namespace === this.namespace && this.apiFilter.test(packet.api)),
    )

    this.init_ = this.getSourcePart<T[]>('get').pipe(
      startWith([]),
      map((data: T[]) => {
        return data.map((d: T) => {
          d.__key__ = d.id + '-0'
          return d
        })
      }),
    )
    this.create_ = this.mergePendding('post', this.pendding.mergeCreate)
    this.update_ = this.mergePendding('patch', this.pendding.mergeUpdate)
    this.delete_ = this.mergePendding('delete', this.pendding.mergeDelete)

    this.default_ = this.initDefault()
  }

  public mergePendding (method: string, mergeFn: MergeFn<T>) {
    return mergeFn(this.getSourcePart<T>(method)).pipe(startWith([]))
  }

  public getSourcePart <T0 extends T | T[]> (method: string): Observable<T0> {
    const source_ = this.raw_.pipe(
      filter((packet: Packet<T0>) => packet.method === method),
      map((packet: Packet<T0>) => {
        const data = packet.data
        if (!Array.isArray(data) && packet.__key__) { (data as T).__key__ = packet.__key__ }
        return data
      }),
    )

    return source_
  }

  public initDefault (): Observable<T[]> {
    return this.init_.pipe(
      combineLatest(this.create_, this.update_, this.delete_, (i: T[], c: T[], u: T[], r: T[]) => {
        c.forEach(d => singleUpdate(i, d))
        u.forEach(d => singleUpdate(i, d))
        r.forEach(d => singleRemove(i, d))
        return i
      }),
      map(data => data.filter(d => d)),
    )
  }

  public registerFruit <O, B> (FruitClass: FruitConstructor<O, B>, branch: B) {
    // if (this.fruitsRegistered[FruitClass.name])
    this.fruitsRegistered[FruitClass.name] = true
    const fruit = new FruitClass(branch)
    return fruit.source_
  }

  private get () {
    Axios.get(this.namespace)
  }

  public post (data: Partial<T>) {
    const fullData = this.fill(data)
    const config = this.pendding.push(fullData)
    Axios.post(this.namespace, data, config)
    return this.default_
  }

  public patch (data: Partial<T>) {
    const fullData = this.fill(data)
    const config = this.pendding.push(fullData, Pendding.UPDATE)
    Axios.patch(this.namespace, data, config)
    return this.default_
  }

  public delete (data: Partial<T>) {
    const fullData = this.fill(data)
    const config = this.pendding.push(fullData, Pendding.DELETE)
    Axios.delete(`${this.namespace}/${data.id}`, config)
    return this.default_
  }
}
