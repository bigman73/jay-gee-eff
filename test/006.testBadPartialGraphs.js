const { assert } = require('chai');
const nodeAssert = require('assert');
const fsExtra = require('fs-extra');
const path = require('path');
const { JGFContainer } = require('../jgfContainer');
const common = require('../common');

/* eslint no-invalid-this: 0 */

describe('BadPartialGraph', () => {
    describe('#save and load bad partial graphs', () => {
        beforeEach(async () => {
            this.currentTest = {};
            this.currentTest.filename1 = './test/temp/partial-bad3.json';
            this.currentTest.filename2 = './test/temp/partial-bad4.json';
            await fsExtra.ensureDir(path.dirname(this.currentTest.filename1));
            await common.safeRemoveFile(this.currentTest.filename1);
            await common.safeRemoveFile(this.currentTest.filename2);
        });

        it('should save bad partial graphs but fail loading them', async () => {
            const container1 = new JGFContainer(true);
            const graph1 = container1.graph;
            graph1.isPartial = true;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const badNode2Id = 'celtics#1610612738';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph1.addNode(node1Id, node1Label);
            graph1.addEdge(node1Id, badNode2Id, playerContractRelation);

            const { edges } = graph1;
            assert(edges !== null);
            assert.equal(1, edges.length);

            const container2 = new JGFContainer(true);
            const graph2 = container2.graph;
            graph2.isPartial = true;

            graph2.addNode(node2Id, node2Label);

            await container1.saveToFile(this.currentTest.filename1);
            await container2.saveToFile(this.currentTest.filename2);

            const container = new JGFContainer();
            const partialWildcard = path.join(
                path.dirname(this.currentTest.filename1),
                'partial-bad*.json'
            );

            await nodeAssert.rejects(() => container.loadFromPartialFiles(partialWildcard),
                Error, 'Invalid graph');
        });
    });
});
