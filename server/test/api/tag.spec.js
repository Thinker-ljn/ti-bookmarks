const server = require('./server.helper.js')()
const request = require('supertest')
const assert = require('power-assert')
const Tag = require('@src/services/tag/tag.js')

describe('API: tag', function () {
  before(async function () {
    let tag = new Tag()
    await tag.truncate()
  })

  describe('tag:create', function () {
    it('get:', async function () {
      let res = await request(server).get('/api/tags')
      assert(res.status === 200)
      let data = JSON.parse(res.text)
      assert(Array.isArray(data) === true)
      assert(data[0].id === 0)
      assert(data[0].name === '标签')
    })

    it('create: 200', async function () {
      let res = await request(server)
        .post('/api/tags')
        .send({
          name: '娱乐'
        })
      assert(res.status === 200)
      let data = JSON.parse(res.text)
      assert(typeof data === 'object')
      assert(data.name === '娱乐')
      assert(data.parent_id === 0)

      res = await request(server)
        .post('/api/tags')
        .send({
          name: '学习',
          parent_id: data.id
        })
      let data2 = JSON.parse(res.text)
      assert(typeof data2 === 'object')
      assert(data2.parent_id === data.id)
    })
  })
})
