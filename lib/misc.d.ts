/**
 * A Nullable type.
 */
export declare type Nullable<T> = T | null;
/**
 * Returns all files matching the wild card pattern.
 *
 * @param filenameWildcard - File name wildcard pattern.
 * @returns List of matching files.
 */
export declare const getMatchingFiles: (filenameWildcard: string) => Promise<Array<string>>;
