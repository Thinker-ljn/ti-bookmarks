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

    it ('test model table name is testmodels', () => {
      assert(test.tableName === 'testmodels')
    })

    it ('test model query', async () => {
      test.set({
        a: 1,
        b: '',
        c: true,
      })


      const actual = await test.save()
      const expected = 'INSERT INTO `testmodels` (`a`, `b`, `c`) VALUES (1, \'\', true)'
      assert(expected === actual)
    })
  })
})
