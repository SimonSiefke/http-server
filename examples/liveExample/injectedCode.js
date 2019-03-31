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
