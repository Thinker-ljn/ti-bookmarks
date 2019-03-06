import { AxiosResponse } from 'axios'

import Root from './root'
import {  map, filter } from 'rxjs/operators'
import { Packet, TrunckPacket, DLTrunckSource, DLTrunckErrorSource } from './types'

function generatePacket<T> (response: AxiosResponse<T>): Packet<T> {
  let {data, config, status} = response
  let {url, method, params} = config
  let api = url.replace(/^\/?api\//, '')
  let namespace = api.replace(/([^\/\?]+)([\/\?\#\:]?.*)/, '$1')
  let packet: Packet<T> = {
    namespace,
    api,
    data,
    method,
    status
  }

  if (params && params.__key__) packet.__key__ = params.__key__
  return packet
}

export default class Trunck {
  root: Root
  raw_: DLTrunckSource
  source_: DLTrunckSource
  error_: DLTrunckErrorSource

  constructor (root: Root) {
    this.root = root
    this.initSource()
  }

  initSource () {
    this.raw_ = this.root.source_.pipe(
      map((response: AxiosResponse) => generatePacket(response))
    )
    this.source_ = this.raw_.pipe(
      filter((packet: TrunckPacket) => packet.status === 200)
    )

    this.error_ = this.raw_.pipe(
      filter((packet: Packet<Error>) => packet.status !== 200)
    )
  }
}
