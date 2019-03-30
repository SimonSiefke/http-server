import { createServer } from '../src'

createServer({
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
