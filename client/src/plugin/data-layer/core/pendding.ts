import { Subject, Observable } from "rxjs";
import { BranchData } from "./types";
import { merge } from "rxjs/operators";

export type PendingStatus = 'creating' | 'updating' | 'deleting'
type PenddingSources<T> = {[key: string]: Subject<T>}

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

  mergeCreate (source_: Observable<T>) {
    let pendingSource = this.sources.creating_
    // let dict: {[key: string]: T} = {}
    return source_.pipe(
      merge(pendingSource)
    )
  }
}
