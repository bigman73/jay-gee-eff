import fastClone from 'fast-clone'
import fsExtra from 'fs-extra'

// eslint-disable-next-line jsdoc/require-jsdoc
export interface GraphMetaData {
  [key: string]: string | boolean | number
}

/**
 * Clones an object (using fast clone).
 *
 * @param obj - Source object o clone.
 * @returns Cloned object.
 */
export const cloneObject = <T>(obj: T): T => fastClone(obj)

/**
 * Removes a file only if it exists.
 *
 * @param filename - Filename.
 */
export const safeRemoveFile = async (filename: string) => {
  if (fsExtra.existsSync(filename)) {
    await fsExtra.remove(filename)
  }
}
