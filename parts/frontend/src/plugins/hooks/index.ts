import * as React from 'react'

const { useState } = React

interface KeyMap {[key: string]: any}
type SetObjectStateAction = (key: string, value: any) => void
// function UseObjectStateType<S>(initialState: S): [S, SetObjectStateAction<S>]

interface MapSetObject {[key: string]: React.SetStateAction<any>}
export function useObjectState<S extends KeyMap> (object: S) {
  const mapSetObject: MapSetObject = {}
  const newObject: S | KeyMap =  {}
  for (const key of Object.keys(object)) {
    const value = object[key]
    const [v, setV] = useState(value)

    mapSetObject[key] = setV
    newObject[key] = v
  }

  const mapSetObjectFn: SetObjectStateAction = (key, value) => {
    const fn = mapSetObject[key]
    if (fn) { fn(value) }
  }
  return  [newObject, mapSetObjectFn] as [S, SetObjectStateAction]
}

interface BooleanState {
  value: boolean
  reverse: () => void
  set: (nV: boolean) => void,
  toFalse: () => void
  toTrue: () => void
}

export function useBooleanState (value: boolean): BooleanState {
  const [v, setV] = useState(value)
  return {
    value: v,
    reverse: () => {
      const nV = !v
      setV(nV)
    },
    set: setV,
    toFalse: () => {setV(false)},
    toTrue: () => {setV(true)},
  }
}
