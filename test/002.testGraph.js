const { assert } = require('chai');
const { JGFContainer } = require('../jgfContainer');

describe('Graph', () => {
    describe('#add graph node', () => {
        it('should add a simple node to a graph', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'LeBron James';
            const nodeLabel = 'NBAPlayer';

            graph.addNode(nodeId, nodeLabel);
            assert.equal(1, graph.nodes.length);
            assert.equal(nodeId, graph.nodes[0].id);
            assert.equal(nodeLabel, graph.nodes[0].label);
        })

        it('should add a node to a graph, with meta data', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'Kevin Durant';
            const nodeLabel = 'NBAPlayer';

            const metadata = {
                position: 'Power Forward',
                shirt: 35
            };

            graph.addNode(nodeId, nodeLabel, metadata);
            assert.equal(1, graph.nodes.length);
            assert.equal('Power Forward', graph.nodes[0].metadata.position);
            assert.equal(35, graph.nodes[0].metadata.shirt);
        })


        it('should throw an exception when adding a node that already exists', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'Kevin Durant';
            const nodeLabel = 'NBAPlayer';

            graph.addNode(nodeId, nodeLabel);

            assert.throw(() => graph.addNode(nodeId, nodeLabel), Error, 'A node already exists');
        })

        it('should throw an exception when adding nodes that already exist', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'Kevin Durant';
            const nodeLabel = 'NBAPlayer';

            graph.addNode(nodeId, nodeLabel);

            const moreNodes = [
                {
                    id: 'Kevin Durant',
                    label: 'NBAPlayer'
                },
                {
                    id: 'Kyrie Irving',
                    label: 'NBAPlayer'
                }
            ];

            assert.throw(() => graph.addNodes(moreNodes), Error, 'A node already exists');
        })

    })

    describe('#update graph node', () => {
        it('should update a node\'s label', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'Kevin Love';
            const nodeLabel = 'NBACoach';

            graph.addNode(nodeId, nodeLabel);
            const correctLabel = 'NBAPlayer';
            graph.updateNode(nodeId, correctLabel);
            assert.equal(correctLabel, graph.nodes[0].label);
        })

    })

    describe('#removeNode', () => {
        it('should remove a node', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'Kevin Durant';
            const nodeLabel = 'NBAPlayer';

            graph.addNode(nodeId, nodeLabel);

            graph.removeNode(nodeId);
            assert.equal(0, graph.nodes.length, 'After removeNode there should be zero nodes');
        })

        it('should throw an exception when removing a non existant node', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            assert.throws(() => graph.removeNode('some dummy id'), 'A node doesn\'t exist');
        })
    })

    describe('#getNode', () => {
        it('should lookup a node by id', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'Kevin Durant';
            const nodeLabel = 'NBAPlayer';

            graph.addNode(nodeId, nodeLabel);

            let node = graph.getNode(nodeId);
            assert(node !== null);
            assert(node.id === nodeId);
        })

        it('should throw an exception when looking up a non existant node', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            assert.throws(() => graph.getNode('some dummy id'), 'A node doesn\'t exist');
        })
    })
    describe('#addGraphEdge', () => {
        it('should add a simple edge to a graph', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const node1Id = 'LeBron James';
            const node1Label = 'NBAPlayer';

            const node2Id = 'LA Lakers';
            const node2Label = 'NBATeam';

            const playerContractLabel = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);

            assert.equal(2, graph.nodes.length);

            graph.addEdge(node1Id, node2Id, playerContractLabel);

            assert.equal(1, graph.edges.length);
            assert.equal(playerContractLabel, graph.edges[0].label);
        })
    })

    describe('#removeEdges', () => {
        it('should remove a graph edge', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const node1Id = 'LeBron James';
            const node1Label = 'NBAPlayer';

            const node2Id = 'LA Lakers';
            const node2Label = 'NBATeam';

            const playerContractLabel = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);
            graph.addEdge(node1Id, node2Id, playerContractLabel);

            graph.removeEdges(node1Id, node2Id, playerContractLabel);
            assert.equal(0, graph.edges.length, 'After removeEdges there should be zero edges');
        })
    })

    describe('#getEdges', () => {
        it('should lookup edges', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const node1Id = 'LeBron James';
            const node1Label = 'NBAPlayer';

            const node2Id = 'LA Lakers';
            const node2Label = 'NBATeam';

            const playerContractLabel = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);
            graph.addEdge(node1Id, node2Id, playerContractLabel);

            let edges = graph.getEdges(node1Id, node2Id, playerContractLabel);
            assert(edges !== null);
            assert.equal(1, edges.length);
        })

    })
});