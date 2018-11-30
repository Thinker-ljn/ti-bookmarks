const assert = require('power-assert')
String.prototype.plural = require('@core/lib/plural')
const Model = require('@core/model/index.js')

describe('model Test', function () {
  class TestModel extends Model {}
  let test = new TestModel
  describe('model instance', function () {
    it ('test model name is TestModel', function () {
      assert(test.$modelName === 'TestModel')
    })

    it ('test model table name is test_models', function () {
      assert(test.$tableName === 'test_models')
    })

    it ('test model data', function () {
      test.a = 1
      test.b = 2
      test.c = 3

      assert(test.$data.a === 1)
      assert(test.$data.b === 2)
      assert(test.$data.c === 3)
      assert(test.$data.d === void 0)
    })
  })
})
