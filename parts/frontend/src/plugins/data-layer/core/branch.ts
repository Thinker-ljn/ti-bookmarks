import { Observable } from 'rxjs';
import { combineLatest, filter, map, startWith } from 'rxjs/operators'
import { FruitConstructor } from './fruit';
import Pendding, {MergeFn} from './pending';
import Root from './root'
import Trunk from './trunk'
import { BranchData, DLTrunkSource, KeyMap, Packet } from './types'
import { singleRemove, singleUpdate } from './util'
import Tree from './tree';

export interface BranchInterface<T> {
  default_: Observable<T[]>
  namespace: string
  exampleData: T
}

export type BranchConstructor<T> = new (trunk: Trunk, apiFilter?: RegExp) => BranchInterface<T>
export type SourceFrom = 'axios' | 'cache'
export type InitialDataFlag = 'fetching' | 'finished' | 'error'
export type Method = 'post' | 'patch' | 'delete'
export type AxiosQueue<T> = Array<[Method, Partial<T>]>
export default abstract class Branch<T extends BranchData> implements BranchInterface<T> {
  public tree: Tree
  public trunk: Trunk
  public root: Root
  public trunk_: DLTrunkSource
  public raw_: DLTrunkSource

  public default_: Observable<T[]>
  public init_: Observable<T[]>
  public create_: Observable<T[]>
  public update_: Observable<T[]>
  public delete_: Observable<T[]>

  public pending: Pendding<T>

  public readonly abstract exampleData: T
  public from: SourceFrom = 'axios'
  public apiFilter: RegExp
  public fruitsRegistered: KeyMap<boolean> = {}
  public initailDataFlag: InitialDataFlag = 'fetching'
  private axioxQueue: AxiosQueue<T> = []
  constructor (trunk: Trunk, apiFilter?: RegExp) {
    this.trunk = trunk
    this.root = trunk.root
    this.tree = trunk.tree
    this.trunk_ = trunk.source_
    if (apiFilter) {
      this.apiFilter = apiFilter
    } else {
      this.apiFilter = new RegExp(`^${this.namespace}(\\/)?(\\d+)?([\\?#]|$)`)
    }

    this.pending = new Pendding()
    this.initSources()

    this.get()
  }

  public fill (data: Partial<T>): T {
    const originKeys = Object.keys(data)
    const __uk__ = Object.keys(this.exampleData).filter(k => originKeys.indexOf(k) === -1 && !k.startsWith('__'))
    return Object.assign({}, this.exampleData, data, {__uk__})
  }

  get axios () {
    return this.tree.axios
  }

  get namespace () {
    return this.constructor.name.replace('Branch', '').toLowerCase()
  }

  private initSources () {
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
    this.create_ = this.mergePendding('post', this.pending.mergeCreate)
    this.update_ = this.mergePendding('patch', this.pending.mergeUpdate)
    this.delete_ = this.mergePendding('delete', this.pending.mergeDelete)

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

  get isInitail () {
    return this.initailDataFlag === 'finished'
  }

  private get () {
    let from: SourceFrom = 'cache'
    if (!this.tree.cache.match(this.namespace)) {
      from = 'axios'
      this.axios.get(this.namespace).then(() => {
        this.initailDataFlag = 'finished'
        this.execQueue()
      }, () => {
        this.initailDataFlag = 'error'
      })
    } else {
      this.initailDataFlag = 'finished'
    }

    this.from = from
  }

  private execQueue () {
    while (this.axioxQueue.length) {
      const queue = this.axioxQueue.shift()
      if (queue) {
        const [method, data] = queue
        this[method](data)
      }
    }
  }

  public post (data: Partial<T>) {
    if (!this.isInitail) {
      this.axioxQueue.push(['post', data])
      return
    }
    const fullData = this.fill(data)
    const config = this.pending.push(fullData)
    this.axios.post(this.namespace, data, config)
    return this.default_
  }

  public patch (data: Partial<T>) {
    if (!this.isInitail) {
      this.axioxQueue.push(['patch', data])
      return
    }
    const fullData = this.fill(data)
    const config = this.pending.push(fullData, Pendding.UPDATE)
    this.axios.patch(this.namespace, data, config)
    return this.default_
  }

  public delete (data: Partial<T>) {
    if (!this.isInitail) {
      this.axioxQueue.push(['delete', data])
      return
    }
    const fullData = this.fill(data)
    const config = this.pending.push(fullData, Pendding.DELETE)
    this.axios.delete(`${this.namespace}/${data.id}`, config)
    return this.default_
  }
}
