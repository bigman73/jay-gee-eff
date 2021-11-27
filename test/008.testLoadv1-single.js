const { assert } = require('chai');
const { JGFContainer } = require('../src/jgfContainer');

/* eslint no-invalid-this: 0 */

describe('ContainerLoadFromFile Single V1', () => {
  describe('#loadFromFile-carGraphs-v1', () => {
    beforeEach(() => {
      this.currentTest = {};
      this.currentTest.filename = './test/examples/les_miserables_v1.json';
    });

    it('should load the les misrables graphs file for V1 Schema (single graphs)', async () => {
      const container = new JGFContainer();
      await container.loadFromFileV1(this.currentTest.filename);
      assert.equal(true, container.isSingleGraph, 'isSingleGraph is expected');
      const { graph } = container;

      assert.equal('les miserables', graph.type);
      assert.equal(77, Object.keys(graph.nodes).length);
      assert.equal(254, graph.edges.length);
    });
  });
});
