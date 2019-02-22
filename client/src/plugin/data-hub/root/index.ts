import axios, { AxiosResponse } from 'axios'
import { ReplaySubject } from 'rxjs'
import apiMaps from './roots'
export type rootSource = ReplaySubject<AxiosResponse>
const ROUTE_PREFIX = '/api/'

function useInterceptor (subject: rootSource) {
  axios.defaults.baseURL = ROUTE_PREFIX
  axios.interceptors.response.use(function (response) {
    subject.next(response)
    return response
  }, function (error) {
    subject.next(error)
    return Promise.reject(error)
  })
}

export type absorbKey = 'tags' | 'bookmarks'
export type apisType = typeof apiMaps
export type absorbMethod<T, K extends (keyof T)> = keyof T[K]
export type absorbFn = (key: absorbKey, method: absorbMethod<apisType, absorbKey>, params: any) => any
export class Root {
  source$: rootSource
  constructor () {
    this.source$ = new ReplaySubject
    useInterceptor(this.source$)
  }
  absorb: absorbFn = (key, method, params) => {
    let api = apiMaps[key][method]
    return api(params)
  }
}

const root = new Root

root.source$.subscribe(v => {
  console.log('root', v)
})
export default root
