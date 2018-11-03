const fsExtra = require('fs-extra');

const cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const safeRemoveFile = async (filename) => {
    if (await fsExtra.exists(filename)) {
        await fsExtra.remove(filename);
    }
};

module.exports = {
    cloneObject,
    safeRemoveFile
};