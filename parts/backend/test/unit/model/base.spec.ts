import plural from '@/core/plugins/plural';
import * as assert from 'power-assert'
String.prototype.plural = plural

import { PromiseConnection } from '@/core/database/connection';
import Model, { IdData } from '@/core/model';
Model.setConnection(PromiseConnection.Instance)

interface TestData extends IdData {
  a: number,
  b: string,
  c: boolean
}
describe('model Test', () => {
  class TestModel<T extends TestData> extends Model<T> {

  }

  const test = new TestModel()

  describe('model instance', () => {
    it ('test model name is TestModel', () => {
      assert(test.modelName === 'TestModel')
    })

    it ('test model table name is test_models', () => {
      assert(test.tableName === 'test_models')
    })

    it ('test model save query', async () => {
      test.set({
        a: 1,
        b: '',
        c: true,
      })

      const actual = await test.save()
      const expected = 'INSERT INTO `test_models` (`a`, `b`, `c`) VALUES (1, \'\', true)'
      assert(expected === actual)
    })

    it ('test model update query', async () => {
      test.set({
        id: 1,
        a: 1,
        b: '',
        c: true,
      })

      const actual = await test.update()
      const expected = 'UPDATE `test_models` SET `a` = 1, `b` = \'\', `c` = true WHERE `id` = 1'
      assert(expected === actual)
    })

    it ('test model delete query', async () => {
      test.set({
        id: 1,
        a: 1,
        b: '',
        c: true,
      })

      const actual = await test.delete()
      const expected = 'DELETE FROM `test_models` WHERE `id` = 1'
      assert(expected === actual)
    })
  })
})
