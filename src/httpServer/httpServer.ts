import * as http from 'http'
import * as mime from 'mime'
import { AddressInfo } from 'net'
import { getAbsolutePath, getFile, isDirectory, isFile } from '../util/util'

enum statusCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export interface HttpServerOptions {
  directory: string
  onBeforeSend?: (
    absolutePath: string,
    file: string,
    response: http.ServerResponse
  ) => void
}

export interface HttpServer {
  listen: (port: number) => void
  close: () => void
  address: () => string | AddressInfo
}

export function createHttpServer({
  directory,
  onBeforeSend = (absolutePath, file, response) => response.end(file),
}: HttpServerOptions): HttpServer {
  const server = http.createServer(async (request, response) => {
    const absolutePath = getAbsolutePath(directory, request.url)
    /**
     * Try to send a file, but send an error if the file doesn't exist.
     */
    // eslint-disable-next-line no-shadow
    const trySend = async (absolutePath: string): Promise<void> => {
      try {
        const file = await getFile(absolutePath)
        const type = mime.getType(absolutePath)
        if (type) {
          response.setHeader('Content-Type', type)
        }
        await onBeforeSend(absolutePath, file, response)
        return
      } catch {
        response.statusCode = statusCodes.SERVER_ERROR
        response.end()
      }
    }
    // look for '/index.html'
    if (await isFile(absolutePath)) {
      await trySend(absolutePath)
      return
    }
    // when path equals '/' look for '/index.html'
    if (
      await Promise.all([
        isDirectory(absolutePath),
        isFile(`${absolutePath}index.html`),
      ]).then(values => values.every(value => value))
    ) {
      await trySend(`${absolutePath}index.html`)
      return
    }
    // No file found
    response.statusCode = statusCodes.NOT_FOUND
    response.end()
  })

  return {
    address() {
      return server.address()
    },
    listen(port) {
      server.listen(port)
    },
    close() {
      server.close()
    },
  }
}
