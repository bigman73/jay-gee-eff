import path from 'path'

import fsExtra from 'fs-extra'

import { safeRemoveFile } from '../src/common'
import { JGFContainer } from '../src/jgfContainer'

import {
  PlayerContractRelation,
  PlayerKyrieIrving,
  PlayerLeBronJames,
  TeamBostonCeltics,
  TeamLALakers
} from './testData'

describe('PartialGraph', () => {
  describe('#partial graph edges', () => {
    it('should add partial graph edges', () => {
      const container = new JGFContainer(true)
      const { graph } = container
      graph.isPartial = true

      graph.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)
      graph.addEdge(PlayerLeBronJames.id, TeamLALakers.id, PlayerContractRelation)

      const { edges } = graph
      expect(edges).not.toBeNull()
      expect(edges.length).toEqual(1)
    })
  })

  describe('#loadFromPartialFiles', () => {
    it('should load from partial graph files (nba*.json)', async () => {
      const container = new JGFContainer()
      await container.loadFromPartialFiles('./tests/examples/nba*.json')
      expect(container.isSingleGraph).toBe(true)
      const { graph } = container

      expect(Object.keys(graph.nodes).length).toEqual(4)
      expect(graph.edges.length).toEqual(2)
    })
  })

  describe('#save and load good partial graphs', () => {
    const Filename1 = './tests/temp/partial-good1.json'
    const Filename2 = './tests/temp/partial-good2.json'
    const Filename3 = './tests/temp/partial-good3.json'
    const MainFilename = './tests/temp/main-good.json'

    beforeEach(async () => {
      await fsExtra.ensureDir(path.dirname(Filename1))
      await safeRemoveFile(Filename1)
      await safeRemoveFile(Filename2)
      await safeRemoveFile(Filename3)
      await safeRemoveFile(MainFilename)
    })

    it('should save and load partial graphs', async () => {
      const container1 = new JGFContainer(true)
      // Graph1 - with nodes and partial edges
      const graph1 = container1.graph
      graph1.isPartial = true

      graph1.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)
      graph1.addEdge(PlayerLeBronJames.id, TeamLALakers.id, PlayerContractRelation)

      const { edges } = graph1
      expect(edges).not.toBeNull()
      expect(edges.length).toEqual(1)

      const container2 = new JGFContainer(true)
      // Graph 2 - Nodes only
      const graph2 = container2.graph
      graph2.isPartial = true

      graph2.addNode(TeamLALakers.id, TeamLALakers.name)
      graph2.addNode(PlayerKyrieIrving.id, PlayerKyrieIrving.name)
      graph2.addNode(TeamBostonCeltics.id, TeamBostonCeltics.name)

      const container3 = new JGFContainer(true)
      // Graph 3 - Edges only
      const graph3 = container3.graph
      graph3.isPartial = true

      graph3.addEdge(PlayerKyrieIrving.id, TeamBostonCeltics.id, PlayerContractRelation)

      await container1.saveToFile(Filename1)
      await container2.saveToFile(Filename2)
      await container3.saveToFile(Filename3)

      const container = new JGFContainer()
      await container.loadFromPartialFiles(
        './tests/temp/partial-good*.json',
        'JGFGraph',
        'Good Main Graph - merged from partial graphs'
      )
      expect(Object.keys(container.graph.nodes).length).toEqual(4)
      expect(container.graph.edges.length).toEqual(2)

      await container.saveToFile(MainFilename, true)

      // Finally, load the merged graph file and ensure it is valid
      await container.loadFromFile(MainFilename)
    }, 60000)
  })
})
