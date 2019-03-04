import { ReplaySubject, Observable } from 'rxjs'
import root from './root'
import { merge, map, filter } from 'rxjs/operators'
import { AxiosResponse } from 'axios'
import { PacketData } from './types'

export type Packet<T> = {
  key: string,
  api: string,
  method: string,
  status: number,
  __key__?: string,
  data: T
}
export type TruckType = Observable<Packet<PacketData>>

function generatePacket<T> (response: AxiosResponse): Packet<T> {
  let {data, config, status} = response
  let {url: api, method, params} = config
  let key = api.replace(/(\/api\/)([^\/\?]+)([\/\?\#\:]?.*)/, '$2')
  let packet: Packet<T> = {
    key,
    api,
    data,
    method,
    status
  }

  if (params && params.__key__) packet.__key__ = params.__key__
  return packet
}

let truck$: TruckType = new ReplaySubject().pipe(
  merge(root.source$),
  map((response: AxiosResponse) => generatePacket(response)),
  filter((packet: Packet<PacketData>) => packet.status === 200)
)
truck$.subscribe(v => {
  console.log('truck', v)
})
export default truck$
