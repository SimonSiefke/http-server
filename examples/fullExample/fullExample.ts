import { createServer } from '../../src/httpServer'
import { createWebsocketServer } from '../../src/webSocketServer'
;(async () => {
  const server = createServer({
    directory: __dirname,
    onBeforeSend(absolutePath, file, response) {
      if (!absolutePath.endsWith('.html')) {
        response.end(file)
        return
      }
      // Inject some code
      const newFile = file.replace('Hello', 'Goodbye')
      response.end(newFile)
    },
  })
  await server.listen(3000)
  console.log('listening on http://localhost:3000')
  const webSocketServer = createWebsocketServer()
  await webSocketServer.listen(3001)
  console.log('listening on http://localhost:3001')
})()
