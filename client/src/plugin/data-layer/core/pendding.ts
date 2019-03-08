import { Subject, Observable } from "rxjs";
import { BranchData } from "./types";
import { merge, scan, map } from "rxjs/operators";

export type PendingStatus = 'creating' | 'updating' | 'deleting'
type PenddingSources<T> = {[key: string]: Subject<T>}

type Dict<T> = {[key: string]: T}
interface Accumulator<T>{
  (acc: Dict<T>, curr: T): Dict<T>
}
export interface MergeFn<T> {
  (source_: Observable<T>, pending_?: Subject<T>): Observable<T[]>
}
export default class Pendding<T extends BranchData> {
  static CREATE: PendingStatus = 'creating'
  static UPDATE: PendingStatus = 'updating'
  static DELETE: PendingStatus = 'deleting'
  uid: number = 0
  sources: PenddingSources<T> = {
    creating_: new Subject,
    updating_: new Subject,
    deleting_: new Subject
  }

  getUniqueKey (data: T) {
    let currId = ++this.uid
    if (!data.id) data.id = -currId

    data.__key__ = data.id + '-' + currId
    return data.__key__
  }

  push (data: T, status: PendingStatus = 'creating'): any {
    let penddingData = {...data}
    let __key__  = this.getUniqueKey(penddingData)
    penddingData.__status__ = status

    let config = {params: {__key__}}

    this.sources[status + '_'].next(penddingData)

    return config
  }

  private merge (source_: Observable<T>, pending_: Subject<T>, scanFn: Accumulator<T>) {
    return source_.pipe(
      merge(pending_),
      scan((acc: Dict<T>, curr: T): Dict<T> => {
        return scanFn(acc, curr)
      }, {}),
      map((dict: Dict<T>) => Object.keys(dict).map(key => dict[key]))
    )
  }

  mergeCreate: MergeFn<T> = (source_) =>{
    let scanFn: Accumulator<T> = (acc, curr) => {
      let exist = acc[curr.__key__]
      if (!exist || curr.id > exist.id) {
        acc[curr.__key__] = curr
      }
      return acc
    }
    return this.merge(source_, this.sources.creating_, scanFn)
  }

  mergeUpdate: MergeFn<T> = (source_, pending_) => {
    let scanFn: Accumulator<T> = (acc, curr) => {
      let exist = acc[curr.id]
        if (!exist) {
          acc[curr.__key__] = curr
        }
        return acc
    }
    if (!pending_) pending_ = this.sources.updating_
    return this.merge(source_, pending_, scanFn)
  }

  mergeDelete: MergeFn<T> = (source_) => {
    return this.mergeUpdate(source_, this.sources.deleting_)
  }
}
