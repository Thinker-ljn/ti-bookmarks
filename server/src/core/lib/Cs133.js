/**
 * A subclass of Date
 * Only works in es6 mode
 */
const DAY_SEC = 24 * 60 * 60
class Cs133 extends Date {
  static get DAY_SEC () {
    return DAY_SEC
  }

  constructor (opts) {
    let superArgs = [...arguments]
    if (typeof opts === 'object') {
      superArgs.shift()
    } else {
      opts = {}
    }

    super (...superArgs)
    this._setOpts(opts)
  }

  _setOpts (opts) {
    this.format = opts.format || 'yyyy-mm-dd hh:ii:ss'
  }

  get year () {
    return this.getFullYear()
  }

  get month () {
    return this.getMonth() + 1
  }

  get date () {
    return this.getDate()
  }

  get hours () {
    return this.getHours()
  }

  get minutes () {
    return this.getMinutes()
  }

  get seconds () {
    return this.getSeconds()
  }

  get formatted () {
    let formatted = this.format
    let formatValue = {
      y: 'year',
      m: 'month',
      d: 'date',
      h: 'hours',
      i: 'minutes',
      s: 'seconds'
    }
    for (let flag in formatValue) {
      let key = formatValue[flag]
        formatted = this.replaceFormat(formatted, this[key], flag)
    }
    return formatted
  }

  replaceFormat (format, value, flag) {
    value += ''
    let reg = new RegExp(`${flag}+`, 'g')
    return format.replace(reg, function (match) {
      let length = match.length
      value = value.padStart(length, '0')
      return value.slice(-length)
    })
  }

  dayOffset (days) {
    const cstr = this.constructor
    let ms = this.getTime()
    let offset = days * cstr.DAY_SEC * 1000
    return new cstr(ms + offset)
  }

  static formatted () {
    let dateInstance = new this
    return dateInstance.formatted
  }

  static dayOffset (days) {
    let dateInstance = new this
    return dateInstance.dayOffset(days)
  }
}

module.exports = Cs133
