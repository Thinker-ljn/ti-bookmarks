import Bookmark from '@/services/bookmark/model';
import SpacedRepetition from '@/services/spaced-repetition';
import * as assert from 'power-assert'
import * as request from 'supertest'
import createServer, { app } from './server.helper';
const server = createServer()

describe('API: bookmark', () => {
  const db = app.DB
  before(async () => {
    await Bookmark.newQuery().truncate()
    await SpacedRepetition.newQuery().truncate()
    await db.table('bookmark_tag').truncate()
  })

  describe('bookmark:create', () => {
    it('get:', async () => {
      const res = await request(server).get('/api/bookmarks')
      assert(res.status === 200)
      assert(res.text === '[]')
    })

    it('create: 422', async () => {
      const res = await request(server)
        .post('/api/bookmarks')
        .send('name=test&url=test')
      assert(res.status === 422)
    })

    it('create: 200', async () => {
      const res = await request(server)
        .post('/api/bookmarks')
        .send({
          name: 'baidu',
          url: 'http://www.baidu.com',
        })
      assert(res.status === 200)
    })

    it('create: with repeat and tag_id', async () => {
      const res = await request(server)
        .post('/api/bookmarks')
        .send({
          name: 'zhihu',
          url: 'http://www.zhihu.com',
          tag_id: 1,
          repeat: 1,
        })
      assert(res.status === 200)
      const srs = await SpacedRepetition.all()
      assert(srs.length === 5)

      const bts = await db.table('bookmark_tag').select()
      assert(bts.length === 1)
      assert(bts[0].tag_id === 1)
    })
  })
})
