const { assert } = require('chai');
const { JGFContainer } = require('../src/jgfContainer');

describe('Graph', () => {
  describe('#add graph node', () => {
    it('should add a simple node to a graph', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const nodeId = 'lebron-james#2254';
      const nodeLabel = 'LeBron James';

      graph.addNode(nodeId, nodeLabel);
      assert.equal(1, Object.keys(graph.nodes).length);
      assert.equal(nodeId, Object.keys(graph.nodes)[0]);
      assert.equal(nodeLabel, Object.values(graph.nodes)[0].label);
    });

    it('should add a node to a graph, with meta data', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const nodeId = 'kevin-durant#4497';
      const nodeLabel = 'Kevin Durant';

      const metadata = {
        type: 'NBAPlayer',
        position: 'Power Forward',
        shirt: 35
      };

      graph.addNode(nodeId, nodeLabel, metadata);
      assert.equal(1, Object.keys(graph.nodes).length);
      const node = Object.values(graph.nodes)[0];
      assert.equal('Power Forward', node.metadata.position);
      assert.equal(35, node.metadata.shirt);
    });

    it('should throw an exception when adding a node that already exists', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const nodeId = 'kevin-durant#4497';
      const nodeLabel = 'Kevin Durant';

      graph.addNode(nodeId, nodeLabel);

      assert.throw(() => graph.addNode(nodeId, nodeLabel), Error, 'A node already exists');
    });

    it('should throw an exception when adding nodes that already exist', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const nodeId = 'kevin-durant#4497';
      const nodeLabel = 'Kevin Durant';

      graph.addNode(nodeId, nodeLabel);

      const moreNodes = {
        'kevin-durant#4497': {
          label: 'Kevin Durant'
        },
        'kyrie-irving#9876': {
          label: 'Kyrie Irving'
        }
      };

      assert.throw(() => graph.addNodes(moreNodes), Error, 'A node already exists');
    });
  });

  describe('#update graph node', () => {
    it("should update a node's label", () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const nodeId = 'kevin-love#0000';
      const nodeLabel = 'Kevin Lofe';

      graph.addNode(nodeId, nodeLabel);
      const correctLabel = 'Kevin Love';
      graph.updateNode(nodeId, correctLabel);
      assert.equal(correctLabel, Object.values(graph.nodes)[0].label);
    });
  });

  describe('#removeNode', () => {
    it('should remove a node', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const nodeId = 'kevin-durant#4497';
      const nodeLabel = 'Kevin Durant';

      graph.addNode(nodeId, nodeLabel);

      graph.removeNode(nodeId);
      assert.equal(0, Object.keys(graph.nodes).length, 'After removeNode there should be zero nodes');
    });

    it('should throw an exception when removing a non existant node', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      assert.throws(() => graph.removeNode('some dummy id'), "A node doesn't exist");
    });
  });

  describe('#getNode', () => {
    it('should lookup a node by id', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const nodeId = 'kevin-durant#4497';
      const nodeLabel = 'Kevin Durant';

      graph.addNode(nodeId, nodeLabel);

      const node = graph.getNode(nodeId);
      assert(node !== null);
    });

    it('should throw an exception when looking up a non existant node', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      assert.throws(() => graph.getNode('some dummy id'), "A node doesn't exist");
    });
  });

  describe('#addGraphEdge', () => {
    it('should add a simple edge to a graph', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const node1Id = 'lebron-james#2254';
      const node1Label = 'LeBron James';

      const node2Id = 'la-lakers#1610616839';
      const node2Label = 'Los Angeles Lakers';

      const playerContractRelation = 'Plays for';

      graph.addNode(node1Id, node1Label);
      graph.addNode(node2Id, node2Label);

      assert.equal(2, Object.keys(graph.nodes).length);

      graph.addEdge(node1Id, node2Id, playerContractRelation);

      assert.equal(1, graph.edges.length);
      assert.equal(playerContractRelation, graph.edges[0].relation);
    });
  });

  describe('#removeEdges', () => {
    it('should remove a graph edge', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const node1Id = 'lebron-james#2254';
      const node1Label = 'LeBron James';

      const node2Id = 'la-lakers#1610616839';
      const node2Label = 'Los Angeles Lakers';

      const playerContractRelation = 'Plays for';

      graph.addNode(node1Id, node1Label);
      graph.addNode(node2Id, node2Label);
      graph.addEdge(node1Id, node2Id, playerContractRelation);

      graph.removeEdges(node1Id, node2Id, playerContractRelation);
      assert.equal(0, graph.edges.length, 'After removeEdges there should be zero edges');
    });
  });

  describe('#getEdges', () => {
    it('should lookup edges', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const node1Id = 'lebron-james#2254';
      const node1Label = 'LeBron James';

      const node2Id = 'la-lakers#1610616839';
      const node2Label = 'Los Angeles Lakers';

      const playerContractRelation = 'Plays for';

      graph.addNode(node1Id, node1Label);
      graph.addNode(node2Id, node2Label);
      graph.addEdge(node1Id, node2Id, playerContractRelation);

      const edges = graph.getEdges(node1Id, node2Id, playerContractRelation);
      assert(edges !== null);
      assert.equal(1, edges.length);
    });
  });

  describe('#graphDimensions', () => {
    it('should return zero dimensions for an empty graph', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      const dimensions = graph.graphDimensions;
      assert.equal(0, dimensions.nodes);
      assert.equal(0, dimensions.edges);
    });

    it('should return valid dimensions for a non-empty graph', () => {
      const container = new JGFContainer(true);
      const { graph } = container;

      graph.addNode('node1', 'nodeTypeA');
      graph.addNode('node2', 'nodeTypeB');
      graph.addEdge('node1', 'node2', 'edgeTypeC');

      const dimensions = graph.graphDimensions;
      assert.equal(2, dimensions.nodes);
      assert.equal(1, dimensions.edges);
    });
  });
});
