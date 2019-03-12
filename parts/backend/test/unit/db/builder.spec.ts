import DB from '@/core/database/instance'
import * as assert from 'power-assert'
import { PromiseConnection } from '@/core/database/connection';

DB.setConnection(PromiseConnection.Instance)

describe('Query Build', function () {
  describe('Select Query', function () {
    it('Test 1', async function () {
      let builder = DB.table('table')
      let selectSql = await builder.where('col_a', 123).where('col_b', '>', 54).select('col_a')
      let expectation = 'SELECT `col_a` FROM `table` WHERE `col_a` = 123 AND `col_b` > 54'
      assert(selectSql === expectation)
    })
  })

  describe('Update Query', function () {
    it('Test 1', async function () {
      let builder = DB.table('table')
      let updateSql = await builder.where('col_a', 123).where('col_b', '>', 54).update({col_a: 'aaa', col_b: 2})
      let expectation = 'UPDATE `table` SET `col_a` = \'aaa\', `col_b` = 2 WHERE `col_a` = 123 AND `col_b` > 54'
      assert(updateSql === expectation)
    })
  })

  describe('Insert Query', function () {
    it('Test 1', async function () {
      let builder = DB.table('table')
      let insertSql = await builder.insert([{col_a: 'aaa', col_b: 2}, {col_a: 'aaa', col_b: 2}])
      let expectation = 'INSERT INTO `table` (`col_a`, `col_b`) VALUES (\'aaa\', 2), (\'aaa\', 2)'
      assert(insertSql === expectation)
    })
  })

  describe('Delete Query', function () {
    it('Test 1', async function () {
      let builder = DB.table('table')
      let deleteSql = await builder.where('col_a', 123).where('col_b', '>', 54).delete()
      let expectation = 'DELETE FROM `table` WHERE `col_a` = 123 AND `col_b` > 54'
      assert(deleteSql === expectation)
    })
  })

  // describe('Truncate Query', function () {
  //   it('Test 1', async function () {
  //     let builder = DB.table('table')
  //     let truncateSql = await builder.truncate()
  //     let expectation = 'TRUNCATE TABLE `table`'
  //     assert(truncateSql === expectation)
  //   })
  // })
})