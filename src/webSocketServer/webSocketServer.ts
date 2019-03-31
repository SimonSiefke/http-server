import * as http from 'http'
import * as WebSocket from 'ws'
import { HttpServer } from '@/httpServer/httpServer'

interface WebSocketServer extends HttpServer {
  /**
   * Broadcast a message to all connected clients.
   */
  broadCast: (message: object) => void
}

/**
 * Create a web socket server.
 *
 * @example
 * ```js
 * const webSocketServer = createWebSocketServer()
 * webSocketServer.listen(3001)
 * ```
 */
export function createWebsocketServer(): WebSocketServer {
  const server = http.createServer()
  const webSocketServer = new WebSocket.Server({
    server,
  })
  const broadCast = (message: object): void => {
    // Convert the message to a string because websocket can only send strings, not javascript objects
    const json = JSON.stringify(message)
    for (const websocket of webSocketServer.clients) {
      websocket.send(json)
    }
  }
  return {
    listen(port) {
      server.listen(port)
    },
    address() {
      return server.address()
    },
    close() {
      webSocketServer.close()
      server.close()
    },
    broadCast,
  }
}
