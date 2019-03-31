import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'

const readFile = util.promisify(fs.readFile)
const stat = util.promisify(fs.stat)

export const isDirectory = async (absolutePath: string): Promise<boolean> => {
  try {
    return (await stat(absolutePath)).isDirectory()
  } catch {
    return false
  }
}

export const isFile = async (absolutePath: string): Promise<boolean> => {
  try {
    return (await stat(absolutePath)).isFile()
  } catch {
    return false
  }
}

export const getAbsolutePath = (directory, url: string): string =>
  path.join(directory, url)
export const getFile = (absolutePath: string): Promise<string> =>
  readFile(absolutePath, 'utf-8')
