import tags from './tags'
import bookmarks from './bookmarks'
// import base from './base'

type MapObj = {
  [key: string]: any
}
const fruitsClasses: MapObj = {
  tags,
  bookmarks
}

const fruits: MapObj = {}

const initDL = () => {
  let DL: any = Object.create(null)
  for (let key in fruitsClasses) {
    Object.defineProperty(DL, key, {
      get () {
        if (!fruits[key]) {
          let theClass = fruitsClasses[key]
          fruits[key] = new theClass
        }
        console.log('get', key, fruits[key])
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
