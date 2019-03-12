import * as assert from 'power-assert'
import plural from '@/core/plugins/plural';
String.prototype.plural = plural

import Model, { IdData } from '@/core/model';
import { PromiseConnection } from '@/core/database/connection';
Model.setConnection(PromiseConnection.Instance)
interface TestData extends IdData {
  a: number,
  b: string,
  c: boolean
}
describe('model Test', function () {
  class TestModel<T extends TestData> extends Model<T> {

  }

  let test = new TestModel

  describe('model instance', function () {
    it ('test model name is TestModel', function () {
      assert(test._modelName === 'TestModel')
    })

    it ('test model table name is test_models', function () {
      assert(test._tableName === 'test_models')
    })

    it ('test model data', async function () {
      test.set({
        a: 1,
        b: '',
        c: true
      })
      
      let actual = await test.save()
      let expected = 'INSERT INTO tests (`a`, `b`, `c`) VALUES (1, \'\', \'true\')'
      assert(expected === actual)
    })
  })
})
