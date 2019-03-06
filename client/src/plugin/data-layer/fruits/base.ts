import axios from 'axios'
import { Observable, Subject, of } from 'rxjs';
import { BranchData, PendingStatus, IndexMap, KeyMap } from '../types'
import { combineLatest, scan, merge } from 'rxjs/operators';
export interface SourceType {
  [key: string]: Observable<any>
}

let uid = 0
const getUniqueId = (id: number = 0) => {
  return id + '-' + (++uid)
}
const getPendingData = <T extends BranchData>(data: T, status: PendingStatus = 'creating'): [T, any] => {
  let _data = {...data}
  let __key__  = _data.__key__ = getUniqueId(_data.id)
  _data.__status__ = status

  let config = {params: {__key__}}
  return [_data, config]
}

class Base<T extends BranchData> {
  init: boolean
  source$: Observable<T[]>
  customSources: SourceType
  pending$: Subject<T>
  constructor (params?: any) {
    this.init = true
    this.source$ = new Observable
    this.pending$ = new Subject
    let config = params ? {params} : {}
    axios.get(this.namespace, config)
  }

  handlePending (source$: Observable<T[]>): Observable<T[]> {
    let map$ = this.pending$.pipe(
      scan((prev: [IndexMap<T>, T[]], curr: T) => {
        let id = curr.id
        let [udAndDl, create] = prev
        if (!id) {
          create.push(curr)
          return [udAndDl, create]
        }
        if (!udAndDl[id] || udAndDl[id].__key__ < curr.__key__) {
          udAndDl[id] = curr
          return [udAndDl, create]
        }
        return prev
      }, [{}, []]),
      merge(of([{}, []])) // merge a default map value, because the combineLatest api emit initail value util all of internal observables have emitted first value
    )

    let mixSrc: Observable<T[]> = source$.pipe(
      combineLatest(map$, (source: T[], pending: [IndexMap<T>, T[]]) => {
        let [udAndDl, create] = pending
        source = source.map(s => {
          let {__key__} = s
          if (__key__ && udAndDl[s.id] && (udAndDl[s.id].__key__) > __key__) {
            return {...udAndDl[s.id], __key__}
          }
          return s
        })

        let uidMap: KeyMap<boolean> = source.reduce((p: KeyMap<boolean>, c) => {
          if (c.__key__) p[c.__key__] = true
          return p
        }, {})

        create.forEach(p => {
          if (!uidMap[p.__key__]) {
            source.push(p)
          }
        })
        return source
      })
    )

    return mixSrc
  }

  get namespace () {
    return this.constructor.name.replace('Fruit', '').toLowerCase()
  }

  get (key?: string) {
    if (!key) return this.source$
    let sourceKey = key.replace(/^(.*[^$])(\$?)$/, '$1$$')
    let source = this.customSources[sourceKey]
    return source
    // if (!source) {
    //   return source
    // }

    // if (typeof (this as any)[key] === 'function') {
    //   return (this as any)[key]()
    // }
  }

  post (postData: T) {
    let [pendingData, config] = getPendingData(postData)
    this.pending$.next(pendingData)
    // console.log(config)
    axios.post(this.namespace, postData, config)
    return this.get()
  }

  patch (data: T) {
    let [pendingData, config] = getPendingData(data, 'updating')
    this.pending$.next(pendingData)
    axios.patch(this.namespace, data, config)
    return this.get()
  }

  delete (data: T) {
    let [pendingData, config] = getPendingData(data, 'deleting')
    this.pending$.next(pendingData)
    axios.delete(`${this.namespace}/${data.id}`, config)
    return this.get()
  }
}

export default Base
