type cb = (e: React.MouseEvent, payload: any) => void

const events: cb[] = []
const on = (onCb: cb) => {
  events.push(onCb)
}

const off = (offCb: cb) => {
  const index = events.findIndex(currCb => currCb === offCb)

  if (index > -1) {
    events.splice(index, 1)
  }
}

const emit = (...args: any[]) => {
  events.forEach((currCb) => {
    currCb.apply(null, args)
  })
}

export {
  on,
  off,
  emit,
}
