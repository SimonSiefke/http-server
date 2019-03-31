window.addEventListener('load', () => {
  const socket = new WebSocket('ws://localhost:3001')
  let count = 0
  socket.addEventListener('message', message => {
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
})
