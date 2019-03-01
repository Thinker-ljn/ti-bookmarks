import * as React from 'react'

let { useState } = React

type KeyMap = {[key: string]: any}
type SetObjectStateAction = (key: string, value: any) => void
// function UseObjectStateType<S>(initialState: S): [S, SetObjectStateAction<S>]

type MapSetObject = {[key: string]: React.SetStateAction<any>}
export function useObjectState<S extends KeyMap> (object: S) {
  let mapSetObject: MapSetObject = {}
  let newObject: S | KeyMap =  {}
  for (let key of Object.keys(object)) {
    let value = object[key]
    let [v, setV] = useState(value)

    mapSetObject[key] = setV
    newObject[key] = v
  }

  let mapSetObjectFn: SetObjectStateAction = function (key, value) {
    let fn = mapSetObject[key]
    if (fn) fn(value)
  }
  return <[S, SetObjectStateAction]>[newObject, mapSetObjectFn]
}
