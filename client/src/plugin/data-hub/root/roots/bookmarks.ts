import axios from 'axios'
import { Api, apiFn } from './type'
const key = 'bookmarks'
let init = false

export interface bookmarksApi extends Api {
  patch: apiFn
}
export type bookmarkMethods = keyof bookmarksApi

const bookmarksApi: bookmarksApi = {
  get: () => {
    if (init) return
    init = true
    return axios.get(`${key}?list=1`)
  },
  post: () => {
    return axios.post(`${key}`)
  },
  patch: () => {
    return axios.patch(`${key}`)
  }

}

export default bookmarksApi
