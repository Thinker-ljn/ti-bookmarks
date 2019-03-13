import * as assert from 'power-assert'

import { PromiseConnection } from '@/core/database/connection';
import Model, { IdData } from '@/core/model';
Model.setConnection(PromiseConnection.Instance)

interface TestData extends IdData {
  a: number,
  b: string,
  c: boolean
}
describe('model Test', () => {
  class TestModel<T extends TestData> extends Model<T> {}
  class Tag<T extends IdData> extends Model<T> {}
  class Bookmark<T extends IdData> extends Model<T> {
    public tags () {
      return this.belongsToMany(Tag)
    }
  }

  const test = new TestModel()

  describe('model instance', () => {
    it ('test model name is TestModel', () => {
      assert(test.modelName === 'TestModel')
    })

    it ('test model table name is test_models', () => {
      assert(test.tableName === 'test_models')
    })

    it ('test model find', async () => {
      const actual = await TestModel.newQuery().find(1)
      const expected = 'SELECT * FROM `test_models` WHERE `id` = 1'
      assert(expected === actual)
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

  describe('model relationship', () => {
    it ('belongs to many Attach test', async () => {
      const bk = new Bookmark()
      bk.set({id: 2})
      const actual = [
        await bk.tags().attach(1),
        await bk.tags().attach([1, 2, 3]),
      ]
      const expected = [
        'INSERT INTO `bookmark_tag` (`bookmark_id`, `tag_id`) VALUES (2, 1)',
        'INSERT INTO `bookmark_tag` (`bookmark_id`, `tag_id`) VALUES (2, 1), (2, 2), (2, 3)',
      ]
      assert(expected[0] === actual[0])
      assert(expected[1] === actual[1])
    })
    it ('belongs to many Detach test', async () => {
      const bk = new Bookmark()
      bk.set({id: 2})
      const actual = [
        await bk.tags().detach(1),
        await bk.tags().detach([1, 2, 3])
      ]
      const expected = [
        'DELETE FROM `bookmark_tag` WHERE `bookmark_id` = 2 AND `tag_id` = 1',
        'DELETE FROM `bookmark_tag` WHERE `bookmark_id` = 2 AND `tag_id` IN (1, 2, 3)',
      ]
      assert(expected[0] === actual[0])
      assert(expected[1] === actual[1])
    })
  })
})
