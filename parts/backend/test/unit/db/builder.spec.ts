import DB from '@/core/database/instance'
import assert from 'power-assert'
import { createConnection } from '@/core/database/connection';

DB.setConnection(createConnection)

describe('Query Build', function () {
  describe('Select Query', function () {
    it('Test 1', async function () {
      let builder = DB.table('table')
      let selectSql = await builder.where('col_a', 123).where('col_b', '>', 54).select('col_a')
      let expectation = 'select `col_a` from `table` where `col_a` = 123 and `col_b` > 54'
      assert(selectSql === expectation)
    })
  })

  // describe('Update Query', function () {
  //   it('Test 1', async function () {
  //     let builder = DB.table('table')
  //     let updateSql = await builder.where('col_a', 123).where('col_b', '>', 54).update({col_a: 'aaa', col_b: 2})
  //     let expectation = 'update `table` set `col_a` = \'aaa\', `col_b` = 2 where `col_a` = 123 and `col_b` > 54'
  //     assert(updateSql === expectation)
  //   })
  // })

  // describe('Insert Query', function () {
  //   it('Test 1', async function () {
  //     let builder = DB.table('table')
  //     let insertSql = await builder.insert([{col_a: 'aaa', col_b: 2}, {col_a: 'aaa', col_b: 2}])
  //     let expectation = 'insert into `table` (`col_a`, `col_b`) values (\'aaa\', 2), (\'aaa\', 2)'
  //     assert(insertSql === expectation)
  //   })
  // })

  // describe('Delete Query', function () {
  //   it('Test 1', async function () {
  //     let builder = DB.table('table')
  //     let deleteSql = await builder.where('col_a', 123).where('col_b', '>', 54).delete()
  //     let expectation = 'delete from `table` where `col_a` = 123 and `col_b` > 54'
  //     assert(deleteSql === expectation)
  //   })
  // })

  // describe('Truncate Query', function () {
  //   it('Test 1', async function () {
  //     let builder = DB.table('table')
  //     let truncateSql = await builder.truncate()
  //     let expectation = 'truncate table `table`'
  //     assert(truncateSql === expectation)
  //   })
  // })
})