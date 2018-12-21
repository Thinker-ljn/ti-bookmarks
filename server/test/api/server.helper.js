const app = require('@src/app')

let server = null
let status = 'close'
after(async function () {
  if (!server || status === 'close') return
  status === 'close'
  await server.close()
})

module.exports = function createServer () {
  if (server) return server
  server = app.listen(80, function () {
    console.log('app listening on port 80!')
  })
  server.app = app
  status = 'open'
  return server
}
