
import Cs133 from '@/core/plugins/Cs133'
import * as assert from 'power-assert'

describe('Cs133 Test', () => {
  describe('instance', () => {
    it ('new Cs133 should return a instance of Cs133', () => {
      const time = new Cs133()
      assert(time instanceof Cs133 === true)
      assert(time instanceof Date === true)
    })

    it ('format yyyy-mm-dd hh:ii:ss', () => {
      const time = new Cs133(new Date(1992, 7, 12, 11, 22, 33))

      assert(time.formatted === '1992-08-12 11:22:33')
    })

    it ('day offset', () => {
      const time = new Cs133(new Date(1992, 7, 12, 11, 22, 33))
      const afterA2Day = time.dayOffset(2)
      assert(afterA2Day.formatted === '1992-08-14 11:22:33')
      const afterM2Day = time.dayOffset(-2)
      assert(afterM2Day.formatted === '1992-08-10 11:22:33')
    })
  })
})
