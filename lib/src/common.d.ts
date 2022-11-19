export interface GraphMetaData {
    [key: string]: string | boolean | number;
}
/**
 * Clones an object (using fast clone).
 *
 * @param obj - Source object o clone.
 * @returns Cloned object.
 */
export declare const cloneObject: <T>(obj: T) => T;
/**
 * Removes a file only if it exists.
 *
 * @param filename - Filename.
 */
export declare const safeRemoveFile: (filename: string) => Promise<void>;
