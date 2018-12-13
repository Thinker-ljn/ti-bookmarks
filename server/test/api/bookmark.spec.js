// const dotenv = require('dotenv')
// dotenv.config()

// const app = require('@src/app')
// const request = require('supertest')
// const assert = require('power-assert')
// const db = request('@core/database')
// describe('API: bookmark', async function () {
//   let server = app.listen(9999)
//   await db.query(db.table('bookmarks').truncate())
//   describe('bookmark:create', function () {
//     it ('get:', async function () {
//       let res = await request(server).get('/api/bookmarks')
//       assert(res.status === 200)
//       assert(res.text === '[]')
//     })

//     it ('create: 422', async function () {
//       let res = await request(server)
//         .post('/api/bookmarks')
//         .send('name=test&url=test')
//       assert(res.status === 422)
//     })

//     it ('create: 200', async function () {
//       let res = await request(server)
//         .post('/api/bookmarks')
//         .send('name=test&url=http://www.test.com')
//       assert(res.status === 200)
//     })
//   })
// })
