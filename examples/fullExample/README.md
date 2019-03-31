# fullExample

```sh
npm run example:fullExample # start this example
```

| client             | server           |
| ------------------ | ---------------- |
| `fullExample.html` | `fullExample.ts` |
| `injectedCode.js`  |                  |

This example shows how to use the http server together with the web socket server to send messages to the client (browser). The http server injects some javascript code into the `fullExample.html` file which is send to the client. The injected code creates a web socket connection to the websocket server and listens for message. Every two seconds, the web socket server sends a message to tell the client to reload the page.

[fullExample.ts](./fullExample.ts): The Websocket server sends a message to the client every second:

```typescript
setInterval(() => {
  const message: WebSocketMessage = {
    command: 'increment',
  }
  webSocketServer.broadCast(message)
}, 1000)
```

[injectedCode.js](./injectedCode.js): And the client listens for messages:

```javascript
socket.addEventListener('message', message => {
  /**
   * @type{WebSocketMessage}
   */
  const data = JSON.parse(message.data)
  console.log(data)
  switch (data.command) {
    case 'increment':
      document.body.innerHTML = `${count++}`
      break
    default:
      throw new Error(`unknown command "${data.command}"`)
  }
})
```
