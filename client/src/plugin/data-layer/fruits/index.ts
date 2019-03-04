import tags from './tags'
import bookmarks from './bookmarks'
import { KeyMap } from '../types'

type Union = typeof tags | typeof  bookmarks
const fruitsClasses: KeyMap<Union> = {
  tags: tags,
  bookmarks: bookmarks
}

const fruits: KeyMap<InstanceType<Union>> = {}

const initDL = () => {
  let DL: typeof fruits = Object.create(null)
  for (let key in fruitsClasses) {
    Object.defineProperty(DL, key, {
      get () {
        if (!fruits[key]) {
          let theClass = fruitsClasses[key]
          fruits[key] = new theClass
        }
        return fruits[key]
      },
      set () {
        throw('cannot set value')
      }
    })
  }
  return DL
}

export default initDL
