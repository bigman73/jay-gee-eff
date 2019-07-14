const glob = require('glob');

/**
 * Returns all files matching the wild card
 * @param {*} filenameWildcard filename wildcard
 */
const getMatchingfiles = (filenameWildcard) => {
    return new Promise((resolve, reject) => {
        glob(filenameWildcard, (err, files) => {
            if (err) {
                console.log(err);

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