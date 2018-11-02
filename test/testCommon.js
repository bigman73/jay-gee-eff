const {assert} = require('chai');

/**
 * Assert throws for async functions
 * (chai.assert.throws doesn't support async functions as of 11/1/2018)
 * @param {*} fn Function to test
 * @param {*} regExp Regular expression to match against exception error message
 * @see https://stackoverflow.com/a/46957474/1211805
 */
const assertThrowsAsync = async (fn, regExp) => {
    let f = () => {}; // eslint-disable-line
    try {
        await fn();
    } catch (e) {
        f = () => {
            throw e;
        };
    } finally {
        assert.throws(f, regExp);
    }
};

module.exports = {
    assertThrowsAsync
};