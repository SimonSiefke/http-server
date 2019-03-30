import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'
import * as util from 'util'

const fsReadFile = util.promisify(fs.readFile)
const fsStat = util.promisify(fs.stat)

enum statusCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

const isDirectory = async (path: string) => {
  try {
    return (await fsStat(path)).isDirectory()
  } catch {
    return false
  }
}

const isFile = async (path: string) => {
  try {
    return (await fsStat(path)).isFile()
  } catch {
    return false
  }
}

const getAbsolutePath = (directory, url: string) => path.join(directory, url)
const getFile = (path: string) => fsReadFile(path, 'utf-8')

export interface HttpServerOptions {
  directory: string
  onBeforeSend: (
    absolutePath: string,
    file: string,
    response: http.ServerResponse
  ) => void
}

export interface HttpServer {
  listen: (port: number) => void
  close: () => void
}

export function createServer({
  directory,
  onBeforeSend,
}: HttpServerOptions): HttpServer {
  const server = http.createServer(async (request, response) => {
    const absolutePath = getAbsolutePath(directory, request.url)
    /**
     * Try to send a file, but send an error if the file doesn't exist
     */
    const trySend = async (absolutePath: string) => {
      try {
        const file = await getFile(absolutePath)
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
        isFile(absolutePath + 'index.html'),
      ]).then(values => values.every(value => value))
    ) {
      await trySend(absolutePath + 'index.html')
      return
    }
    // No file found
    response.statusCode = statusCodes.NOT_FOUND
    response.end()
  })

  return {
    listen(port) {
      return new Promise(resolve => server.listen(port, resolve))
    },
    close() {
      server.close
    },
  }
}
