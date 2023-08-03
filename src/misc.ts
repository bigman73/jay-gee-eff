import { glob } from 'glob'

/**
 * Returns all files matching the wild card pattern.
 *
 * @param filenameWildcard - File name wildcard pattern.
 * @returns List of matching files.
 */
export const getMatchingFiles = async (filenameWildcard: string): Promise<Array<string>> => {
  const files = await glob(filenameWildcard)

  return files
}
