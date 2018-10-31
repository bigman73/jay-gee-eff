const glob = require('glob');

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