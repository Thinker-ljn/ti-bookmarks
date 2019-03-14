import { PromiseConnection } from '@/core/database/connection';
import DB from '@/core/database/instance'
import * as assert from 'power-assert'

DB.setConnection(PromiseConnection.Instance)

describe('Query Build', () => {
  before(() => {
    PromiseConnection.Instance.end()
  })
  describe('Select Query', () => {
    it('Test 1', async () => {
      const builder = DB.table('table')
      const selectSql = await builder.where('col_a', 123).where('col_b', '>', 54).select('col_a')
      const expectation = 'SELECT `col_a` FROM `table` WHERE `col_a` = 123 AND `col_b` > 54'
      assert(selectSql === expectation)
    })
  })

  describe('Update Query', () => {
    it('Test 1', async () => {
      const builder = DB.table('table')
      const updateSql = await builder.where('col_a', 123).where('col_b', '>', 54).update({col_a: 'aaa', col_b: 2})
      const expectation = 'UPDATE `table` SET `col_a` = \'aaa\', `col_b` = 2 WHERE `col_a` = 123 AND `col_b` > 54'
      assert(updateSql === expectation)
    })
  })

  describe('Insert Query', () => {
    it('Test 1', async () => {
      const builder = DB.table('table')
      const insertSql = await builder.insert([{col_a: 'aaa', col_b: 2}, {col_a: 'aaa', col_b: 2}])
      const expectation = 'INSERT INTO `table` (`col_a`, `col_b`) VALUES (\'aaa\', 2), (\'aaa\', 2)'
      assert(insertSql === expectation)
    })
  })

  describe('Delete Query', () => {
    it('Test 1', async () => {
      const builder = DB.table('table')
      const deleteSql = await builder.where('col_a', 123).where('col_b', '>', 54).delete()
      const expectation = 'DELETE FROM `table` WHERE `col_a` = 123 AND `col_b` > 54'
      assert(deleteSql === expectation)
    })
  })

  // describe('Truncate Query', () => {
  //   it('Test 1', async () => {
  //     let builder = DB.table('table')
  //     let truncateSql = await builder.truncate()
  //     let expectation = 'TRUNCATE TABLE `table`'
  //     assert(truncateSql === expectation)
  //   })
  // })
})
