import * as http from 'http'
import * as WebSocket from 'ws'
import { HttpServer } from './httpServer'

interface WebSocketServerOptions {}

interface WebSocketServer extends HttpServer {
  broadCast: (message: object) => void
}

export function createWebsocketServer(): WebSocketServer {
  const server = http.createServer()
  const webSocketServer = new WebSocket.Server({
    server,
  })
  const broadCast = (msg: object) => {
    const json = JSON.stringify(msg)
    for (const websocket of webSocketServer.clients) {
      websocket.send(json)
    }
  }
  return {
    listen(port) {
      return new Promise(resolve => server.listen(port, resolve))
    },
    close() {
      webSocketServer.close()
      server.close()
    },
    broadCast,
  }
}
