import { tags$, tagsTree$ } from './tags'
import { packetData } from '../trunk'
import { Observable } from 'rxjs'

export type branchsType = {[key: string]: Observable<packetData>}
const branchs: branchsType = {
  tags$,
  tagsTree$
}
export default branchs
