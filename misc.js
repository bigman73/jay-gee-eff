const glob = require('glob');

/**
 * Returns all files matching the wild card pattern
 * @param {*} filenameWildcard filename wildcard pattern
 */
const getMatchingFiles = (filenameWildcard) => new Promise((resolve, reject) => {
    glob(filenameWildcard, (err, files) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error(`Failed getting filenames, error = ${err}`);

            reject(err);
        } else {
            resolve(files);
        }
    });
});

module.exports = {
    getMatchingFiles
};
