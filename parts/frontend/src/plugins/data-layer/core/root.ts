import axios, { AxiosResponse } from 'axios'
import { ReplaySubject } from 'rxjs'
const ROUTE_PREFIX = '/api/'

function useInterceptor (subject: RootSource) {
  axios.defaults.baseURL = ROUTE_PREFIX
  axios.interceptors.response.use((response) => {
    subject.next(response)
    return response
  }, (error) => {
    subject.next(error)
    return Promise.reject(error)
  })
}

export type RootSource = ReplaySubject<AxiosResponse>

export class Root {
  public source_: RootSource

  constructor () {
    this.source_ = new ReplaySubject()
    useInterceptor(this.source_)

    // this.source_.subscribe(v => console.log('root', v))
  }
}

export default Root
