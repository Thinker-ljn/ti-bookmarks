
/**
 * A subclass of Date
 * Only works in es6 mode
 */

interface Cs133Opts {
  format?: string
  year?: number
  month?: number
  day?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}
// const restDate = {
//   month: 0, 
//   day: 1, 
//   hours: 0, 
//   minutes: 0, 
//   seconds: 0, 
//   milliseconds: 0
// }
const DAY_SEC = 24 * 60 * 60

type FormatPart = {[K in keyof Cs133]: Cs133[K] extends number ? K : never}[keyof Cs133]
type FormatFlag = "y" | "m" | "d" | "h" | "i" | "s"
type FormatMap = {[key in FormatFlag]: FormatPart}

const formatValue: FormatMap = {
  y: 'year',
  m: 'month',
  d: 'date',
  h: 'hours',
  i: 'minutes',
  s: 'seconds'
}

export default class Cs133 extends Date {
  format: string
  constructor ()
  constructor (opts: Cs133Opts)
  constructor (date: Date)
  constructor (formatString: string)
  constructor (ms: number)
  constructor (value?: any) {
    let opts: Cs133Opts = {}
    
    if (value && value instanceof Date || typeof value === 'string' || typeof value === 'number') {
      super(value)
    } else {
      super()
      opts = value
    }

    this._setOpts(opts)
  }

  private _setOpts (opts: Cs133Opts = {}) {
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
    
    let flag: FormatFlag
    for (flag in formatValue) {
      let key: FormatPart = formatValue[flag]
      formatted = this.replaceFormat(formatted, this[key], flag)
    }
    return formatted
  }

  replaceFormat (format: string, value: number, flag: FormatFlag) {
    let valueStr = value + ''
    let reg = new RegExp(`${flag}+`, 'g')
    return format.replace(reg, function (match) {
      let length = match.length
      valueStr = valueStr.padStart(length, '0')
      return valueStr.slice(-length)
    })
  }

  dayOffset (days: number) {
    let ms = this.getTime()
    let offset = days * DAY_SEC * 1000
    return new Cs133(ms + offset)
  }

  static formatted () {
    let dateInstance = new this
    return dateInstance.formatted
  }

  static dayOffset (days: number) {
    let dateInstance = new this
    return dateInstance.dayOffset(days)
  }
}
