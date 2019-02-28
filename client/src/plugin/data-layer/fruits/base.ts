import axios from 'axios'
import { Observable } from 'rxjs';

export interface SourceType {
  [key: string]: Observable<any>
}
class Base<T> {
  init: boolean
  source$: Observable<T>
  sources: SourceType
  constructor (params?: any) {
    this.init = true
    let config = params ? {params} : {}
    axios.get(this.namespace, config)
  }

  get namespace () {
    return this.constructor.name.toLowerCase()
  }

  get (key?: string) {
    if (!key) return this.source$
    key = key.replace(/^(.*[^$])(\$?)$/, '$1$$')
    let source = this.sources[key]
    return source
  }

  post (params: any) {
    axios.post(this.namespace, params)
    return this.get()
  }

  patch (params: any) {
    axios.patch(this.namespace, params)
    return this.get()
  }

  delete (params: any) {
    axios.delete(`${this.namespace}/${params.id}`)
    return this.get()
  }
}

export default Base
