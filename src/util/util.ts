import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'

const readFile = util.promisify(fs.readFile)
const stat = util.promisify(fs.stat)

/**
 * Check if the file at the path is a directory.
 */
export const isDirectory = async (absolutePath: string): Promise<boolean> => {
  try {
    return (await stat(absolutePath)).isDirectory()
  } catch {
    return false
  }
}

/**
 * Check if the file at the path is a directory.
 */
export const isFile = async (absolutePath: string): Promise<boolean> => {
  try {
    return (await stat(absolutePath)).isFile()
  } catch {
    return false
  }
}

/**
 * Get the absolute path for a relative url.
 */
export const getAbsolutePath = (directory: string, url: string): string =>
  path.join(directory, url)

/**
 * Get the file for an absolute path.
 */
export const getFile = (absolutePath: string): Promise<string> =>
  readFile(absolutePath, 'utf-8')
