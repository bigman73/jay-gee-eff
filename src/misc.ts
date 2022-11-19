import glob from 'glob'

/**
 * Returns all files matching the wild card pattern.
 *
 * @param filenameWildcard - File name wildcard pattern.
 * @returns List of matching files.
 */
export const getMatchingFiles = (filenameWildcard: string): Promise<Array<string>> =>
  new Promise((resolve, reject) => {
    glob(filenameWildcard, (err, files) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed getting filenames, error = ${err}`)

        reject(err)
      } else {
        resolve(files)
      }
    })
  })
