import axios from 'axios'
import { Api, apiFn } from './type'
const key = 'tags'
let init = false

export interface tagsApi extends Api {
  delete: apiFn
}
export type tagMethods = keyof tagsApi

const tagsApis: tagsApi = {
  get: () => {
    if (init) return
    init = true
    return axios.get(`${key}?list=1`)
  },
  post: (params) => {
    return axios.post(`${key}`, params)
  },
  delete: (params) => {
    return axios.delete(`${key}/${params.id}`)
  }
}

export default tagsApis
