import { createServer } from '../../src/httpServer'

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
;(async () => {
  await server.listen(3000)
  console.log('listening on http://localhost:3000')
})()