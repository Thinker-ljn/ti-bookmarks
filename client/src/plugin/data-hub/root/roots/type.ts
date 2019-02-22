import {AxiosPromise} from 'axios'
export type apiFn = (params?: any) => AxiosPromise<any>

// type map = {
//   get: apiFn,
//   post: apiFn
// }
interface BaseApi {
  [key: string]: apiFn
}

export interface Api extends BaseApi {
  get: apiFn,
  post: apiFn
}
