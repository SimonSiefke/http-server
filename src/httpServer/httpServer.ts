import * as http from 'http'
import * as mime from 'mime'
import { AddressInfo } from 'net'
import { getAbsolutePath, getFile, isDirectory, isFile } from '@/util/util'
import { parse } from 'url'
/**
 * Http status codes
 */
const enum statusCodes {
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
  /**
   * Start the server and listen for incoming requests.
   */
  listen: (port: number) => void
  /**
   * Close the server.
   */
  close: () => void
  /**
   * Get the address for the server. Only useful for testing.
   */
  address: () => string | AddressInfo
}

/**
 * Creates a http server.
 *
 * @example
 * ```js
 * const server = createHttpServer({
 *  directory: __dirname
 * })
 *
 * server.listen(3000)
 * ```
 */
export function createHttpServer({
  directory,
  onBeforeSend = (absolutePath, file, response) => response.end(file),
}: HttpServerOptions): HttpServer {
  const server = http.createServer(async (request, response) => {
    /**
     * The relative url without query parameters.
     */
    const url = parse(request.url).pathname
    const absolutePath = getAbsolutePath(directory, url)
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
