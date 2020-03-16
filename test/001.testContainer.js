const { assert } = require('chai');
const { JGFContainer } = require('../jgfContainer');

describe('Container', () => {
    describe('#createContainerSingleGraph', () => {
        it('should create a valid empty graph container, in Single-Graph mode', () => {
            const container = new JGFContainer(true);
            assert.notEqual(null, container);

            const { graph } = container;
            assert.notEqual(null, graph);
            assert.notEqual(null, graph.nodes);
        });
    });

    describe('#createContainerMultiGraph', () => {
        it('should create a valid empty graph container, in Multi-Graph mode', () => {
            const container = new JGFContainer(false);
            assert.notEqual(null, container);

            const { graphs } = container;
            assert.notEqual(null, graphs);
            assert.equal(0, graphs.length);
        });
    });

    describe('#addEmptyGraph', () => {
        it('should add a graph to the container, in Multi-Graph mode', () => {
            const container = new JGFContainer(false);

            const graph = container.addEmptyGraph();
            assert.equal(1, container.graphs.length);
            assert.notEqual(null, graph);
            assert.notEqual(null, graph.nodes);
        });
    });
});
