// const dotenv = require('dotenv')
// dotenv.config()

const app = require('@src/app')
const request = require('supertest')
const assert = require('power-assert')
const Bookmark = require('@src/services/bookmark/bookmark.js')
const SpacedRepetition = require('@src/services/spaced-repetition.js')

describe('API: bookmark', function () {
  let server = app.listen(9900)
  before(async function () {
    let bk = new Bookmark()
    await bk.truncate()
    let sr = new SpacedRepetition()
    await sr.truncate()
    let db = Bookmark.connection
    await db.table('bookmark_tag').truncate()
  })

  after(async function () {
    await server.close()
  })

  describe('bookmark:create', function () {
    it('get:', async function () {
      let res = await request(server).get('/api/bookmarks')
      assert(res.status === 200)
      assert(res.text === '[]')
    })

    it('create: 422', async function () {
      let res = await request(server)
        .post('/api/bookmarks')
        .send('name=test&url=test')
      assert(res.status === 422)
    })

    it('create: 200', async function () {
      let res = await request(server)
        .post('/api/bookmarks')
        .send({
          name: 'baidu',
          url: 'http://www.baidu.com'
        })
      assert(res.status === 200)
    })

    it('create: with repeat and tag_id', async function () {
      let res = await request(server)
        .post('/api/bookmarks')
        .send({
          name: 'zhihu',
          url: 'http://www.zhihu.com',
          tag_id: 1,
          repeat: 1
        })
      assert(res.status === 200)
      let srs = await SpacedRepetition.all()
      assert(srs.length === 5)

      let db = Bookmark.connection
      let bts = await db.table('bookmark_tag').select().get()
      assert(bts.length === 1)
      assert(bts[0].tag_id === 1)
    })
  })
})
