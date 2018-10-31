const assert = require('assert');
const { JGFContainer } = require('../jgfContainer');

/* eslint no-invalid-this: 0 */

describe('ContainerLoadFromFile', () => {
    describe('#loadFromFile-carGraphs', () => {
        beforeEach(() => {
            this.currentTest = {};
            this.currentTest.filename = './test/examples/car_graphs.json';
        })

        it('should load the car graphs file (multi graphs)', async () => {
            let container = new JGFContainer();
            await container.loadFromFile(this.currentTest.filename);
            assert.equal(true, container.isMultiGraph, 'isMultiGraph is expected');
            let graphs = container.graphs;

            assert.equal(2, graphs.length, 'car_graphs should have 2 inner graphs');

            let firstGraph = graphs[0];
            assert.equal('car', firstGraph.type);
            assert.equal(4, firstGraph.nodes.length);
            assert.equal(2, firstGraph.edges.length);
        })
    })

});