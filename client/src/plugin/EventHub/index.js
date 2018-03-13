const events = {}

const on = function (eventName, cb) {
  if (!events[eventName]) events[eventName] = []
  events[eventName].push(cb)
}

const once = function (eventName, cb) {
  let _cb = function () {
    cb.apply(null, [...arguments])
    off(eventName, arguments.callee)
  }

  on(eventName, _cb)
}

const off = function (eventName, cb) {
  if (!events[eventName]) return
  let index = events[eventName].findIndex(_cb => _cb === cb)

  if (index > -1) {
    events[eventName].splice(index, 1)
  }
}

const emit = function (eventName) {
  if (!events[eventName]) return
  let params = [...arguments].slice(1)
  events[eventName].forEach((cb) => {
    cb.apply(null, params)
  })
}

export {
  on,
  once,
  off,
  emit
}
