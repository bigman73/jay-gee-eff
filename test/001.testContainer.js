const assert = require('assert');
const { JGFContainer } = require('../jgfContainer');

describe('Container', () => {
    describe('#createContainerSingleGraph', () => {
        it('should create a valid empty graph container, in Single-Graph mode', () => {
            let container = new JGFContainer(singleGraph = true);
            assert.notEqual(null, container);

            let graph = container.graph;
            assert.notEqual(null, graph);
            assert.notEqual(null, graph.nodes);
        })
    })

    describe('#createContainerMultiGraph', () => {
        it('should create a valid empty graph container, in Multi-Graph mode', () => {
            let container = new JGFContainer(singleGraph = false);
            assert.notEqual(null, container);

            let graphs = container.graphs;
            assert.notEqual(null, graphs);
            assert.equal(0, graphs.length);
        })
    })

    describe('#addEmptyGraph', () => {
        it('should add a graph to the container, in Multi-Graph mode', () => {
            let container = new JGFContainer(singleGraph = false);

            let graph = container.addEmptyGraph();
            assert.equal(1, container.graphs.length);
            assert.notEqual(null, graph);
            assert.notEqual(null, graph.nodes);
        })
    })
});