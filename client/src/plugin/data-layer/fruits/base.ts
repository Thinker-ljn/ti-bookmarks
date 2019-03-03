import axios from 'axios'
import { Observable, Subject } from 'rxjs';
import { BranchData, PendindStatus } from '../types'
export interface SourceType {
  [key: string]: Observable<any>
}
let uid = 0
const getUniqueId = () => {
  return ++uid
}
const getPenddingData = <T extends BranchData>(data: T, status: PendindStatus = 'creating'): [T, any] => {
  let _data = {...data}
  if (!_data.__uid__) _data.__uid__ = getUniqueId()
  _data.__status__ = status
  
  let __uid__ = {_data}
  let config = {params: __uid__}
  return [_data, config]
}

class Base<T extends BranchData> {
  init: boolean
  source$: Observable<T[]>
  customSources: SourceType
  pending$: Subject<T>
  constructor (params?: any) {
    this.init = true
    this.pending$ = new Subject
    let config = params ? {params} : {}
    axios.get(this.namespace, config)
  }

  get namespace () {
    return this.constructor.name.toLowerCase()
  }

  get (key?: string) {
    if (!key) return this.source$
    key = key.replace(/^(.*[^$])(\$?)$/, '$1$$')
    let source = this.customSources[key]
    return source
  }

  post (postData: T) {
    let [pendingData, config] = getPenddingData(postData)
    this.pending$.next(pendingData)
    axios.post(this.namespace, postData, config)
    return this.get()
  }

  patch (data: T) {
    let [pendingData, config] = getPenddingData(data, 'updating')
    this.pending$.next(pendingData)
    axios.patch(this.namespace, data, config)
    return this.get()
  }

  delete (data: T) {
    let [pendingData, config] = getPenddingData(data, 'deleting')
    this.pending$.next(pendingData)
    axios.delete(`${this.namespace}/${data.id}`, config)
    return this.get()
  }
}

export default Base
