const events = []

const on = function (cb) {
  events.push(cb)
}

const off = function (cb) {
  let index = events.findIndex(_cb => _cb === cb)

  if (index > -1) {
    events.splice(index, 1)
  }
}

const emit = function () {
  events.forEach((cb) => {
    cb.apply(null, [...arguments])
  })
}

export {
  on,
  off,
  emit
}
