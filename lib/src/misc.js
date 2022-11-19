"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchingFiles = void 0;
const glob_1 = __importDefault(require("glob"));
/**
 * Returns all files matching the wild card pattern.
 *
 * @param filenameWildcard - File name wildcard pattern.
 * @returns List of matching files.
 */
const getMatchingFiles = (filenameWildcard) => new Promise((resolve, reject) => {
    (0, glob_1.default)(filenameWildcard, (err, files) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error(`Failed getting filenames, error = ${err}`);
            reject(err);
        }
        else {
            resolve(files);
        }
    });
});
exports.getMatchingFiles = getMatchingFiles;
