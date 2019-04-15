import { AxiosResponse, AxiosError } from 'axios'

import { ReplaySubject } from 'rxjs';
import {  filter, map, merge } from 'rxjs/operators'
import Root from './root'
import Tree from './tree';
import { DLTrunkErrorSource, DLTrunkSource, Packet, TrunkPacket } from './types'

function isError (response: AxiosError | AxiosResponse): response is AxiosError {
  return !Reflect.get(response, 'status')
}

function generatePacket<T> (response: AxiosResponse<T>): Packet<T> {
  if (isError(response)) {
    response = response.response as AxiosResponse<T>
  }
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
  public tree: Tree
  public root: Root
  public raw_: DLTrunkSource
  public source_: DLTrunkSource
  public error_: DLTrunkErrorSource
  private cache_: ReplaySubject<TrunkPacket> = new ReplaySubject()

  constructor (root: Root) {
    this.root = root
    this.tree = root.tree
    this.initSource()
  }

  public initSource () {
    this.raw_ = this.root.source_.pipe(
      map((response: AxiosResponse) => generatePacket(response)),
    )
    this.source_ = this.raw_.pipe(
      filter((packet: TrunkPacket) => packet.status === 200),
      merge(this.cache_),
    )

    this.error_ = this.raw_.pipe(
      filter((packet: Packet<AxiosError>) => packet.status !== 200),
    )
  }

  public next <T> (data: Packet<T>) {
    this.cache_.next(data)
  }
}
