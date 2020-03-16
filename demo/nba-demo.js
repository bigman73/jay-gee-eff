/* eslint-disable no-console */
const path = require('path');
const { JGFContainer } = require('../index');


/**
 * Main program - demonstrates building an NBA JGF graph
 */
const program = async () => {
    console.log('Building the NBA JGF Graph...');
    const container = new JGFContainer(true);
    const { graph } = container;
    graph.type = 'sports';
    graph.label = 'NBA Demo Graph';

    const node1Id = 'lebron-james#2544';
    const node1Label = 'LeBron James';
    const metadata1 = {
        type: 'NBA Player'
    };

    const node2Id = 'la-lakers#1610616839';
    const node2Label = 'Los Angeles Lakers';
    const metadata2 = {
        type: 'NBA Team'
    };

    const playerContractLabel = 'Plays for';

    console.log('Adding two nodes...');
    graph.addNode(node1Id, node1Label, metadata1);
    graph.addNode(node2Id, node2Label, metadata2);

    console.log('Adding an edge...');
    graph.addEdge(node1Id, node2Id, playerContractLabel);

    const filename = path.join(path.dirname(__filename), 'nba-graph.json');
    console.log(`Saving to file -> ${filename}`);
    await container.saveToFile(filename, true);

    console.log('Load the saved JGF file');
    const container2 = new JGFContainer();
    await container2.loadFromFile(filename);

    console.log('Graph nodes:');
    for (const node of container2.graph.nodes) {
        console.log(`\t${node.label} {${node.metadata.type}}`);
    }

    console.log('Graph edges:');
    for (const edge of container2.graph.edges) {
        console.log(`\t${edge.source} (->${edge.label}->) ${edge.target}`);
    }

    console.log('-- DONE --');
};

(async () => {
    await program();
})();
