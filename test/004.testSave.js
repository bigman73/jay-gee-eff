const assert = require('assert');
const { JGFContainer } = require('../jgfContainer');
const fsExtra = require('fs-extra');
const path = require('path');

describe('ContainerSaveToFile', () => {
    describe('#saveToFile-onenode', () => {
        beforeEach(() => {
            this.currentTest = {};
            this.currentTest.filename = './test/temp/test-onenode.jgf';
            fsExtra.ensureDirSync(path.dirname(this.currentTest.filename));
            if (fsExtra.existsSync(this.currentTest.filename)) {
                fsExtra.removeSync(this.currentTest.filename);
            }
        })

        it('should save a graph that only has one node to a file', async () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const nodeId = 'LeBron James';
            const nodeLabel = 'NBAPlayer';

            graph.addNode(nodeId, nodeLabel);

            await container.saveToFile(this.currentTest.filename);

            assert.equal(true, fsExtra.existsSync(this.currentTest.filename));
            const stats = fsExtra.statSync(this.currentTest.filename);
            const fileSizeInBytes = stats.size;
            assert.notEqual(0, fileSizeInBytes);

            const fileContent = fsExtra.readJsonSync(this.currentTest.filename);
            assert.equal(1, fileContent.graph.nodes.length);
        })
    })

    describe('#saveToFile-full', () => {
        beforeEach(() => {
            this.currentTest = {};
            this.currentTest.filename = './test/temp/test-multinodes.jgf';
            fsExtra.ensureDirSync(path.dirname(this.currentTest.filename));
            if (fsExtra.existsSync(this.currentTest.filename)) {
                fsExtra.removeSync(this.currentTest.filename);
            }
        })

        it('should save a graph that has multiple nodes and edges to a file', async () => {
            let container = new JGFContainer(singleGraph = true);
            let graph = container.graph;

            const node1Id = 'Kyrie Irving';
            const node1Label = 'NBAPlayer';
            graph.addNode(node1Id, node1Label);

            const node2Id = 'Boston Celtics';
            const node2Label = 'NBATeam';
            graph.addNode(node2Id, node2Label);

            const edgeLabel = 'Plays for';
            graph.addEdge(node1Id, node2Id, edgeLabel);

            await container.saveToFile(this.currentTest.filename);

            assert.equal(true, fsExtra.existsSync(this.currentTest.filename));

            const fileContent = fsExtra.readJsonSync(this.currentTest.filename);
            assert.equal(2, fileContent.graph.nodes.length);
            assert.equal(1, fileContent.graph.edges.length);
        })
    })

});