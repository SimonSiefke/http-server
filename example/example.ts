import * as path from 'path'
import { createServer } from '../src'

createServer({
  directory: path.join(__dirname, '..'),
  onBeforeSend(absolutePath, file, response) {
    if (!absolutePath.endsWith('.html')) {
      response.end(file)
      return
    }
    const newFile = file.replace('Hello', 'no')
    response.end(newFile)
  },
})
