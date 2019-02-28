import axios, { AxiosResponse } from 'axios'
import { ReplaySubject } from 'rxjs'
const ROUTE_PREFIX = '/api/'

function useInterceptor (subject: RootSource) {
  axios.defaults.baseURL = ROUTE_PREFIX
  axios.interceptors.response.use(function (response) {
    subject.next(response)
    return response
  }, function (error) {
    subject.next(error)
    return Promise.reject(error)
  })
}

export type RootSource = ReplaySubject<AxiosResponse>

export class Root {
  source$: RootSource

  constructor () {
    this.source$ = new ReplaySubject
    useInterceptor(this.source$)
  }
}

const root = new Root

// root.source$.subscribe(v => {
//   console.log('root', v)
// })
export default root
