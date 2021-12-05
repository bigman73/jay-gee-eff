/* eslint-disable no-console */
const { JGFContainer } = require('jay-gee-eff');
const path = require('path');

/**
 * Main test program
 */
const program = async () => {
  // eslint-disable-next-line global-require
  const { version: moduleVersion } = require('./node_modules/jay-gee-eff/package.json');
  console.log(`jay-gee-eff, version: ${moduleVersion}`);
  console.log('------------------------------------');

  console.log('Building the NBA JGF Graph...');
  const container = new JGFContainer(true);
  const { graph } = container;
  graph.type = 'sports';
  graph.label = 'NBA Demo Graph';
  graph.id = 'nba';

  const node1Id = 'LeBron James';
  const node1Label = 'NBAPlayer';

  const node2Id = 'LA Lakers';
  const node2Label = 'NBATeam';

  const playerContractLabel = 'Plays for';

  console.log('Adding two nodes...');
  graph.addNode(node1Id, node1Label);
  graph.addNode(node2Id, node2Label);

  console.log('Adding an edge...');
  graph.addEdge(node1Id, node2Id, playerContractLabel);

  const filename = path.join(path.dirname(__filename), 'output/nba-graph.json');
  console.log(`Saving to file -> ${filename}`);
  await container.saveToFile(filename, true);

  console.log('Loading saved file...');
  const container2 = new JGFContainer(true);

  await container2.loadFromFile('output/nba-graph.json');
  console.log(
    `Container loaded, container2: Nodes = ${Object.keys(container2.graph.nodes).length}`
  );

  console.log('-- DONE --');
};

(async () => {
  await program();
})();
