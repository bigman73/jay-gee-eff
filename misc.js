const glob = require('glob');

/**
 * Returns all files matching the wild card pattern
 * @param {*} filenameWildcard filename wildcard pattern
 */
const getMatchingfiles = (filenameWildcard) => {
    return new Promise((resolve, reject) => {
        glob(filenameWildcard, (err, files) => {
            if (err) {
                console.log(`Failed getting filenames, error = ${err}`);

                reject(err);
            } else {
                resolve(files);
            }
        });
    })
};

module.exports = {
    getMatchingfiles
};