const { assert } = require('chai');
const { JGFContainer } = require('../jgfContainer');
const fsExtra = require('fs-extra');
const path = require('path');
const common = require('../common');

/* eslint no-invalid-this: 0 */

describe('PartialGraph', () => {
    describe('#partial graph edges', () => {
        it('should add partial graph edges', () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;
            graph.isPartial = true;

            const node1Id = 'lebron-james#2544';
            const node1Label = 'LeBron James';

            const partialNode2Id = 'la-lakers#1610616839';

            const playerContractLabel = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addEdge(node1Id, partialNode2Id, playerContractLabel);

            let edges = graph.edges;
            assert(edges !== null);
            assert.equal(1, edges.length);
        })
    })

    describe('#loadFromPartialFiles', () => {
        it('should load from partial graph files (nba*.json)', async () => {
            let container = new JGFContainer();
            await container.loadFromPartialFiles('./test/examples/nba*.json');
            assert.equal(true, container.isSingleGraph, 'Single loaded (merged) graph is expected');
            let graph = container.graph;

            assert.equal(4, graph.nodes.length, 'two players and two teams');
            assert.equal(2, graph.edges.length, 'two player-team contracts');
        })
    })

    describe('#save and load good partial graphs', () => {
        beforeEach(async () => {
            this.currentTest = {};
            this.currentTest.filename1 = './test/temp/partial-good1.json';
            this.currentTest.filename2 = './test/temp/partial-good2.json';
            this.currentTest.filename3 = './test/temp/partial-good3.json';
            this.currentTest.mainFilename = './test/temp/main-good.json';
            await fsExtra.ensureDir(path.dirname(this.currentTest.filename1));
            await common.safeRemoveFile(this.currentTest.filename1);
            await common.safeRemoveFile(this.currentTest.filename2);
            await common.safeRemoveFile(this.currentTest.filename3);
            await common.safeRemoveFile(this.currentTest.mainFilename);
        })

        it('should save and load partial graphs', async () => {
            let container1 = new JGFContainer(singleGraph = true);
            // Graph1 - with nodes and partial edges
            let graph1 = container1.graph;
            graph1.isPartial = true;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const node3Id = 'kryie-irving#202681';
            const node3Label = 'Kyrie Irving';

            const node4Id = 'boston-celtics#1610612738';
            const node4Label = 'Boston Celtics';

            const playerContractLabel = 'Plays for';

            graph1.addNode(node1Id, node1Label);
            graph1.addEdge(node1Id, node2Id, playerContractLabel);

            let edges = graph1.edges;
            assert(edges !== null);
            assert.equal(1, edges.length);

            let container2 = new JGFContainer(singleGraph = true);
            // Graph 2 - Nodes only
            let graph2 = container2.graph;
            graph2.isPartial = true;

            graph2.addNode(node2Id, node2Label);
            graph2.addNode(node3Id, node3Label)
            graph2.addNode(node4Id, node4Label)

            let container3 = new JGFContainer(singleGraph = true);
            // Graph 3 - Edges only
            let graph3 = container3.graph;
            graph3.isPartial = true;

            graph3.addEdge(node3Id, node4Id, playerContractLabel);

            await container1.saveToFile(this.currentTest.filename1);
            await container2.saveToFile(this.currentTest.filename2);
            await container3.saveToFile(this.currentTest.filename3);

            let container = new JGFContainer();
            const partialWildcard = path.join(
                path.dirname(this.currentTest.filename1),
                'partial-good*.json'
            );
            await container.loadFromPartialFiles(partialWildcard, 'JGFGraph', 'Good Main Graph - merged from partial graphs');
            assert.equal(4, container.graph.nodes.length, '4 total nodes expected');
            assert.equal(2, container.graph.edges.length, '2 total edges expected');

            await container.saveToFile(this.currentTest.mainFilename, prettyPrint = true);

            // Finally, load the merged graph file and ensure it is valid
            await container.loadFromFile(this.currentTest.mainFilename);
        })
    })
});