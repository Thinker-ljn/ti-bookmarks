import Tag from '@be/src/services/tag/model';
import * as assert from 'power-assert'
import * as request from 'supertest'
import createServer from './server.helper';
const server = createServer()
describe('API: tag', () => {
  before(async () => {
    await Tag.newQuery().truncate()
  })

  describe('tag:create', () => {
    it('get:', async () => {
      const res = await request(server).get('/api/tags?tree=1')
      assert(res.status === 200)
      const data = JSON.parse(res.text)
      assert(Array.isArray(data) === true)
      assert(data[0].id === 0)
      assert(data[0].name === '标签')
    })

    it('create: 200', async () => {
      let res = await request(server)
        .post('/api/tags')
        .send({
          name: '娱乐',
        })
      assert(res.status === 200)
      const data = JSON.parse(res.text)
      assert(typeof data === 'object')
      assert(data.name === '娱乐')
      assert(data.parent_id === 0)

      res = await request(server)
        .post('/api/tags')
        .send({
          name: '学习',
          parent_id: data.id,
        })
      const data2 = JSON.parse(res.text)
      assert(typeof data2 === 'object')
      assert(data2.parent_id === data.id)
    })
  })
})
