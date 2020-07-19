const { assert } = require('chai');
const fsExtra = require('fs-extra');
const path = require('path');
const { JGFContainer } = require('../src/jgfContainer');

/* eslint no-invalid-this: 0 */

describe('ContainerSaveToFile', () => {
    describe('#saveToFile-onenode', () => {
        beforeEach(async () => {
            this.currentTest = {};
            this.currentTest.filename = './test/temp/test-onenode.json';
            await fsExtra.ensureDir(path.dirname(this.currentTest.filename));
            if (await fsExtra.exists(this.currentTest.filename)) {
                await fsExtra.remove(this.currentTest.filename);
            }
        });

        it('should save a graph that only has one node to a file', async () => {
            const container = new JGFContainer(true);
            const { graph } = container;

            const GraphId = 'nba-test';
            graph.id = GraphId;

            const nodeId = 'lebron-james#2254';
            const nodeLabel = 'LeBron James';

            graph.addNode(nodeId, nodeLabel);

            await container.saveToFile(this.currentTest.filename);

            assert.equal(true, await fsExtra.exists(this.currentTest.filename));
            const stats = await fsExtra.stat(this.currentTest.filename);
            const fileSizeInBytes = stats.size;
            assert.notEqual(0, fileSizeInBytes);

            // Ensure that the saved file is read properly back in, and is a valid JGF file
            const container2 = new JGFContainer();
            container2.loadFromFile(this.currentTest.filename);
            assert.equal(GraphId, container.graph.id);
            assert.equal(1, Object.keys(container.graph.nodes).length);
        });
    });

    describe('#saveToFile-full', () => {
        beforeEach(async () => {
            this.currentTest = {};
            this.currentTest.filename = './test/temp/test-multinodes.json';
            await fsExtra.ensureDir(path.dirname(this.currentTest.filename));
            if (await fsExtra.exists(this.currentTest.filename)) {
                await fsExtra.remove(this.currentTest.filename);
            }
        });

        it('should save a graph that has multiple nodes and edges to a file', async () => {
            const container = new JGFContainer(true);
            const { graph } = container;

            const node1Id = 'kyrie-irving#202681';
            const node1Label = 'Kyrie Irving';
            graph.addNode(node1Id, node1Label);

            const node2Id = 'boston-celtics#1610612738';
            const node2Label = 'Boston Celtics';
            graph.addNode(node2Id, node2Label);

            const edgeRelation = 'Plays for';
            graph.addEdge(node1Id, node2Id, edgeRelation);

            await container.saveToFile(this.currentTest.filename);

            assert.equal(true, await fsExtra.exists(this.currentTest.filename));

            const fileContent = await fsExtra.readJson(this.currentTest.filename);
            assert.equal(2, Object.keys(fileContent.graph.nodes).length);
            assert.equal(1, fileContent.graph.edges.length);
        });
    });
});
