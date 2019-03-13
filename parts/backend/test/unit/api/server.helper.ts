import App from '@/app'
import { Server } from 'http';
let server: Server | null = null
let status = 'close'
after(async () => {
  if (!server || status === 'close') return
  status === 'close'
  await server.close()
})

export default function createServer () {
  if (server) return server
  server = App.listen(80, () => {
    console.log('app listening on port 80!')
  })
  // server.App = App
  status = 'open'
  return server
}

export const app = App
