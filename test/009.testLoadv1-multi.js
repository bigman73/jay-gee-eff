const { assert } = require('chai');
const { JGFContainer } = require('../src/jgfContainer');

/* eslint no-invalid-this: 0 */

describe('ContainerLoadFromFile Multi V1', () => {
  describe('#loadFromFile-carGraphs-v1', () => {
    beforeEach(() => {
      this.currentTest = {};
      this.currentTest.filename = './test/examples/car_graphs_v1.json';
    });

    it('should load the car graphs file for V1 Schema (multi graphs)', async () => {
      const container = new JGFContainer();
      await container.loadFromFileV1(this.currentTest.filename);
      assert.equal(true, container.isMultiGraph, 'isMultiGraph is expected');
      const { graphs } = container;

      assert.equal(2, graphs.length, 'car_graphs should have 2 inner graphs');

      const firstGraph = graphs[0];
      assert.equal('car', firstGraph.type);
      assert.equal(4, Object.keys(firstGraph.nodes).length);
      assert.equal(2, firstGraph.edges.length);
    });
  });
});
