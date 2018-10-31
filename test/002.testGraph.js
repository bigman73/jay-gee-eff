const chai = require('chai');
const assert = chai.assert;
const { JGFContainer } = require('../jgfContainer');

describe('Graph', () => {
    describe('#addGraphNode', () => {
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
});