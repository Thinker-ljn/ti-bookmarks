import { AxiosResponse } from 'axios'

import {  filter, map } from 'rxjs/operators'
import Root from './root'
import { DLTrunkErrorSource, DLTrunkSource, Packet, TrunkPacket } from './types'

function generatePacket<T> (response: AxiosResponse<T>): Packet<T> {
  const {data, config, status} = response
  const {url = '', method = '', params} = config
  const api = url.replace(/^\/?api\//, '')
  const namespace = api.replace(/([^\/\?]+)([\/\?\#\:]?.*)/, '$1')
  const packet: Packet<T> = {
    namespace,
    api,
    data,
    method,
    status,
  }

  if (params && params.__key__) { packet.__key__ = params.__key__ }
  return packet
}

export default class Trunk {
  public root: Root
  public raw_: DLTrunkSource
  public source_: DLTrunkSource
  public error_: DLTrunkErrorSource

  constructor (root: Root) {
    this.root = root
    this.initSource()
  }

  public initSource () {
    this.raw_ = this.root.source_.pipe(
      map((response: AxiosResponse) => generatePacket(response)),
    )
    this.source_ = this.raw_.pipe(
      filter((packet: TrunkPacket) => packet.status === 200),
    )

    this.error_ = this.raw_.pipe(
      filter((packet: Packet<Error>) => packet.status !== 200),
    )
  }
}
