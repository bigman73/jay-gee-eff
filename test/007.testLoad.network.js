const { assert } = require('chai');
const { JGFContainer } = require('../src/jgfContainer');

/* eslint no-invalid-this: 0 */

describe('ContainerLoadFromFile-test-network', () => {
    describe('#loadFromFile-test-network', () => {
        beforeEach(() => {
            this.currentTest = {};
            this.currentTest.filename = './test/examples/test.network.json';
        });

        it('should load the test network file', async () => {
            const container = new JGFContainer();
            await container.loadFromFile(this.currentTest.filename);
            assert.equal(false, container.isMultiGraph, 'single graph is expected');
            const { graph } = container;

            assert.equal('BEL-V1.0', graph.type);
            assert.equal('Human', graph.metadata.speciesName);
            assert.equal(9, Object.keys(graph.nodes).length);
            assert.equal(8, graph.edges.length);
        });
    });
});
