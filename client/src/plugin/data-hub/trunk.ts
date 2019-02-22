import { ReplaySubject, Observable } from 'rxjs'
import root from './root'
import { merge, map } from 'rxjs/operators'
import { AxiosResponse } from 'axios'
import { tag } from './branch/tags'

export type packetData = tag[]
export type packet<T> = {
  key: string,
  api: string,
  method: string,
  status: number,
  data: T
}
export type truckType = Observable<packet<packetData>>
// export type action = 'init' | 'create' | 'update' | 'remove'
function generatePacket (response: AxiosResponse) {
  let {data, config, status} = response
  let {url: api, method} = config
  let key = api.replace(/(\/api\/)([^\/\?]+)([\/\?\#\:]?.*)/, '$2')
  let packet = {
    key,
    api,
    data,
    method,
    status
  }
  return packet
}

let truck$: truckType = new ReplaySubject().pipe(
  merge(root.source$),
  map((response: AxiosResponse) => generatePacket(response))
)
truck$.subscribe(v => {
  console.log('truck', v)
})
export default truck$
