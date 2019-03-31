# liveExample

```sh
npm run example:liveExample # start this example
```

| client             | server           |
| ------------------ | ---------------- |
| `liveExample.html` | `liveExample.ts` |
| `injectedCode.js`  |                  |

This example shows how to create a basic live editing experience for css files. When the css file is saved, the server sends a message to the client via websockets and the client re-fetches the stylesheet without reloading the page.

[liveExample.ts](./liveExample.ts): The Websocket server sends a message to the client when the `liveExample.css` file changes:

```typescript
chokidar.watch(path.join(__dirname, './liveExample.css')).on('change', () => {
  const message: WebSocketMessage = {
    command: 'refresh.css',
  }
  webSocketServer.broadCast(message)
})
```

[injectedCode.js](./injectedCode.js): And the client listens for commands and refreshes the css:

```javascript
/**
 * Refresh all the css links in the html document.
 */
function refreshCSS() {
  const links = document.querySelectorAll('link')
  for (const link of links) {
    if (link.rel === 'stylesheet') {
      link.href += '?'
    }
  }
}

window.addEventListener('load', () => {
  const socket = new WebSocket('ws://localhost:3001')
  socket.addEventListener('message', message => {
    /**
     * @type{import('./types').WebSocketMessage}
     */
    const data = JSON.parse(message.data)
    switch (data.command) {
      case 'refresh.css':
        refreshCSS()
        break
      default:
        throw new Error(`unknown command "${data.command}"`)
    }
  })
})
```
