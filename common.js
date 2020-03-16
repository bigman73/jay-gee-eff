const fsExtra = require('fs-extra');
const fastClone = require('fast-clone');

/**
 * Clones an object (using fast clone)
 * @param {*} obj source object o clone
 */
const cloneObject = (obj) => fastClone(obj);

/**
 * Removes a file only if it exists
 * @param {*} filename Filename
 */
const safeRemoveFile = async (filename) => {
    if (await fsExtra.exists(filename)) {
        await fsExtra.remove(filename);
    }
};

module.exports = {
    cloneObject,
    safeRemoveFile
};
