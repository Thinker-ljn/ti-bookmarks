import App from '@be/src/app'
import { Server } from 'http';
let server: Server | null = null
let status = 'close'
after(async () => {
  if (!server || status === 'close') { return }
  status = 'close'
  // await App.DB.connection.end()
  await server.close()
})

export default function createServer () {
  if (server) { return server }
  server = App.listen(80, () => {
    console.info('app listening on port 80!')
  })
  // server.App = App
  status = 'open'
  return server
}

export const app = App
