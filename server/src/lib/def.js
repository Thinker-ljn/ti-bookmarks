function defProp (obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    writable: true,
    configurable: false,
    value: value
  })
}

function defData (obj) {
  let model = obj
  Object.defineProperty(model, '$data', {
    enumerable: false,
    configurable: false,
    get: function () {
      let d = {}
      for (let k in model) {
        d[k] = model[k]
      }
      return d
    },
    set: function (data) {
      for (let k in data) {
        model[k] = data[k] // .toString()
      }
    }
  })
}

module.exports = {
  defProp: defProp,
  defData: defData
}
