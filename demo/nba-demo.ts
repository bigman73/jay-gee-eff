/* eslint-disable no-console */
import path from 'path'

import { JGFContainer } from '..'

/**
 * Main program - demonstrates building an NBA JGF graph.
 */
const program = async () => {
  console.log('Building the NBA JGF Graph...')
  const container = new JGFContainer(true)
  const { graph } = container
  graph.id = 'nba-demo-graph-2020'
  graph.type = 'sports'
  graph.label = 'NBA Demo Graph'
  graph.metadata = {
    season: 2020
  }

  const node1Id = 'lebron-james#2544'
  const node1Label = 'LeBron James'
  const metadata1 = {
    type: 'NBA Player'
  }

  const node2Id = 'la-lakers#1610616839'
  const node2Label = 'Los Angeles Lakers'
  const metadata2 = {
    type: 'NBA Team'
  }

  const playerContractRelation = 'plays-for'
  const playerContractLabel = 'Plays for'

  console.log('Adding two nodes...')
  graph.addNode(node1Id, node1Label, metadata1)
  graph.addNode(node2Id, node2Label, metadata2)

  console.log('Adding an edge...')
  graph.addEdge(node1Id, node2Id, playerContractRelation, playerContractLabel)

  const filename = path.join(path.dirname(__filename), 'nba-graph.json')
  console.log(`Saving to file -> ${filename}`)
  await container.saveToFile(filename, true)

  console.log('Load the saved JGF file')
  const container2 = new JGFContainer()
  await container2.loadFromFile(filename)

  console.log('Graph nodes:')
  for (const node of Object.values(container2.graph.nodes)) {
    console.log(`\t${node.label} {${node.metadata?.type}}`)
  }

  console.log('Graph edges:')
  for (const edge of container2.graph.edges) {
    console.log(`\t${edge.source} (->${edge.label}->) ${edge.target}`)
  }

  console.log('-- DONE --')
}

;(async () => {
  await program()
})()
