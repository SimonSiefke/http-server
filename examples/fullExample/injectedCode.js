window.addEventListener('load', () => {
  const socket = new WebSocket('ws://localhost:3001')
  socket.addEventListener('message', () => {
    window.location.reload()
  })
})
