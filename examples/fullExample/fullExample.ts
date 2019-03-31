import * as fs from 'fs'
import * as path from 'path'
import { createServer } from '../../src/httpServer'
import { createWebsocketServer } from '../../src/webSocketServer'

const injectedCode = fs.readFileSync(path.join(__dirname, 'injectedCode.js'))
;(async () => {
  const server = createServer({
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
  console.log('👉  http://localhost:3000/fullExample.html')
  const webSocketServer = createWebsocketServer()
  await webSocketServer.listen(3001)
  setInterval(() => {
    webSocketServer.broadCast({
      command: 'increment',
    })
  }, 1000)
})()
