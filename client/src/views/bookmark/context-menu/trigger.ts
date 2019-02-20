type cb = (e: React.MouseEvent, payload: any) => void

const events: cb[] = []
const on = function (cb: cb) {
  events.push(cb)
}

const off = function (cb: cb) {
  let index = events.findIndex(_cb => _cb === cb)

  if (index > -1) {
    events.splice(index, 1)
  }
}

const emit = function (...args: any[]) {
  events.forEach((cb) => {
    cb.apply(null, args)
  })
}

export {
  on,
  off,
  emit
}
