import * as fs from 'fs'
import * as path from 'path'
import { createHttpServer, createWebsocketServer } from '../../src'
import { WebSocketMessage } from './types'

const injectedCode = fs.readFileSync(path.join(__dirname, 'injectedCode.js'))
;(async () => {
  const server = createHttpServer({
    directory: __dirname,
    onBeforeSend(absolutePath, file, response) {
      if (!absolutePath.endsWith('.html')) {
        response.end(file)
        return
      }
      // Inject some code
      const newFile = file.replace(
        '</head>',
        `<script>${injectedCode}</script></head>`
      )
      response.end(newFile)
    },
  })
  await server.listen(3000)
  console.log('👉  http://localhost:3000/webSocketServerExample.html')
  const webSocketServer = createWebsocketServer()
  // @ts-ignore
  await webSocketServer.listen(3001)
  setInterval(() => {
    const message: WebSocketMessage = {
      command: 'increment',
    }
    webSocketServer.broadCast(message)
  }, 1000)
})()
