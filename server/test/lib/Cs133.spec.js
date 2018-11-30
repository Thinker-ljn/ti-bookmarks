const Cs133 = require('@core/lib/Cs133')
const assert = require('power-assert')

describe('Cs133 Test', function () {
  describe('instance', function () {
    it ('new Cs133 should return a instance of Cs133', function () {
      let time = new Cs133()
      assert(time instanceof Cs133 === true)
      assert(time instanceof Date === true)
    })

    it ('format yyyy-mm-dd hh:ii:ss', function () {
      let time = new Cs133(1992, 7, 12, 11, 22, 33)

      assert(time.formatted === '1992-08-12 11:22:33')
    })

    it ('static consitans', function () {
      assert(Cs133.DAY_SEC === 24 * 60 * 60)
    })

    it ('day offset', function () {
      let time = new Cs133(1992, 7, 12, 11, 22, 33)
      let after2Day = time.dayOffset(2)
      assert(after2Day.formatted === '1992-08-14 11:22:33')
      let afterM2Day = time.dayOffset(-2)
      assert(afterM2Day.formatted === '1992-08-10 11:22:33')
    })
  })
})
