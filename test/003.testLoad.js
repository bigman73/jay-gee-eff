const { assert } = require('chai');
const nodeAssert = require('assert');
const { JGFContainer } = require('../src/jgfContainer');

/* eslint no-invalid-this: 0 */

describe('ContainerLoadFromFile', () => {
  describe('#loadFromFile-carGraphs', () => {
    beforeEach(() => {
      this.currentTest = {};
      this.currentTest.filename = './test/examples/car_graphs.json';
    });

    it('should load the car graphs file (multi graphs)', async () => {
      const container = new JGFContainer();
      await container.loadFromFile(this.currentTest.filename);
      assert.equal(true, container.isMultiGraph, 'isMultiGraph is expected');
      const { graphs } = container;

      assert.equal(2, graphs.length, 'car_graphs should have 2 inner graphs');

      const firstGraph = graphs[0];
      assert.equal('car', firstGraph.type);
      assert.equal(4, Object.keys(firstGraph.nodes).length);
      assert.equal(2, firstGraph.edges.length);
    });
  });

  describe('#loadInvalidJsonFile', () => {
    it('should throw an error when loading an invalid json file ', async () => {
      const badTestFilename = './test/examples/bad_car_graphs.json';
      const container = new JGFContainer();
      await nodeAssert.rejects(() => container.loadFromFile(badTestFilename), Error, 'Invalid JGF format.');
    });
  });
});
