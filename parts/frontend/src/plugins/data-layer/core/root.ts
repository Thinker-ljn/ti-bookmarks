import { AxiosResponse } from 'axios'
import { ReplaySubject } from 'rxjs'
import Tree from './tree';
const ROUTE_PREFIX = '/api/'

function useInterceptor (root: Root) {
  const subject = root.source_
  const axios = root.tree.axios
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
  public tree: Tree
  public source_: RootSource

  constructor (tree: Tree) {
    this.tree = tree
    this.source_ = new ReplaySubject()
    useInterceptor(this)
  }
}

export default Root
