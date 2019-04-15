import { AxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosError } from 'axios';

export type Method = 'get' | 'post' | 'patch' | 'delete'
export interface DataKeyMap {
  [key: string]: string[]
}
function clone (data: any) {
  if (typeof data !== 'object') {
    return data
  }
  return JSON.parse(JSON.stringify(data))
}
export class MockHandler {
  private id: number = 100
  public store: {[key: string]: any[]} = {}
  public stringifyKeys: DataKeyMap = {}

  public register (namespace: string, data: any[], keys: string[]) {
    this.store[namespace] = clone(data)
    this.stringifyKeys[namespace] = clone(keys)
  }

  public preprocess (namespace: string, method: Method, data?: any) {
    const all = clone(this.store[namespace])
    switch (method) {
      case 'get': return all
      case 'patch': return this.ppPatch(all, data)
      case 'delete': return this.ppPatch(all, data)
    }
    return data ? data : all
  }

  public response (namespace: string, method: Method, config: AxiosRequestConfig) {
    const data = config.data && typeof config.data === 'string' ? JSON.parse(config.data) : clone(config.data)
    const origin = this.store[namespace]
    const cloned = clone(this.store[namespace])
    switch (method) {
      case 'get': return cloned
      case 'post':
        const idData = data.id ? {} : {id: this.id++}
        const pData = Object.assign({}, data, idData)
        origin.push(pData)
        return pData
      case 'patch': 
        const after = this.ppPatch(cloned, data)
        this.update(origin, after)
        return after
      case 'delete':
        const idReg = new RegExp(`(.*\\/)?${namespace}\\/(.*)`)
        const deleteId = Number((config.url || '').replace(idReg, '$2'))
        const index = cloned.findIndex((d: any) => d.id === deleteId)
        let dData = {id: deleteId}
        if (index > -1) {
          dData = cloned[index]
          origin.splice(index)
        }
        return dData
    }
  }

  public update (all: any[], uData: any, remove: boolean = false) {
    const index = all.findIndex((d: any) => d.id === uData.id)
    if (remove) {
      all.splice(index, 1)
    } else {
      all.splice(index, 1, uData)
    }
    return all
  }

  private ppPatch (all: any[], data: any) {
    const originData = all.find((d: any) => d.id === data.id)
    return Object.assign({}, originData, data)
  }

  private stringifyObj (data: any, keys: string[]) {
    const afterFilter = keys.reduce((prev: any, key) => {
      prev[key] = data[key] || '-----'
      return prev
    }, {})
    return afterFilter
  }

  public stringify (data: any, namespace: string) {
    const keys = this.stringifyKeys[namespace]
    let filterData: any
    if (!Array.isArray(data)) {
      filterData = this.stringifyObj(data, keys)
    } else {
      filterData = data.reduce((p: any, c: any) => {
        const afterFilter = this.stringifyObj(c, keys)
        p.push(afterFilter)
        return p
      }, [])
    }
    return JSON.stringify(filterData)
  }
}

export const mockHandler = new MockHandler()

export function MockAdapter (config: AxiosRequestConfig): AxiosPromise<any> {
  // console.info('========into TreeAdapter==========')
  const api = (config.url || '').replace(/^\/?api\//, '')
  const namespace = api.replace(/([^\/\?]+)([\/\?\#\:]?.*)/, '$1')

  const method = config.method as Method
  return new Promise((resolve, reject) => {
    if (!namespace || !method) {
      reject(new Error('Empty Namespace Or Method'))
      return
    }

    const response: AxiosResponse = {
      data: clone(mockHandler.response(namespace, method, config)),
      status: 200,
      statusText: 'ok',
      headers: {},
      config,
      request: {},
    };
    setTimeout(() => {
      if (response.status === 200) {
        resolve(response)
      } else {
        const error = new Error(response.status + ' ' + response.statusText) as AxiosError
        error.config = config
        error.code = response.status + ' ' + response.statusText
        error.response = response
        reject(error)
      }
    }, 50)
  })
}

export const getStringify = (namespace: string) => {
  return (data1: any, data2: any) => {
    return [
      mockHandler.stringify(data1, namespace),
      mockHandler.stringify(data2, namespace),
    ]
  }
}
