import path from 'path'

import fsExtra from 'fs-extra'

import { JGFContainer } from '../src/jgfContainer'

import {
  PlayerContractRelation,
  PlayerKyrieIrving,
  PlayerLeBronJames,
  TeamBostonCeltics,
  TestGraphId
} from './testData'

describe('ContainerSaveToFile', () => {
  describe('#saveToFile-one-node', () => {
    const currentTest = {
      filename: './tests/temp/test-one-node.json'
    }

    beforeEach(async () => {
      await fsExtra.ensureDir(path.dirname(currentTest.filename))
      if (fsExtra.existsSync(currentTest.filename)) {
        await fsExtra.remove(currentTest.filename)
      }
    })

    it('should save a graph that only has one node to a file', async () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.id = TestGraphId

      graph.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)

      await container.saveToFile(currentTest.filename)

      expect(fsExtra.existsSync(currentTest.filename)).toBe(true)
      const stats = await fsExtra.stat(currentTest.filename)
      const fileSizeInBytes = stats.size
      expect(fileSizeInBytes).toBeGreaterThan(0)

      // Ensure that the saved file is read properly back in, and is a valid JGF file
      const container2 = new JGFContainer()
      await container2.loadFromFile(currentTest.filename)
      expect(container.graph.id).toEqual(TestGraphId)
      expect(Object.keys(container.graph.nodes).length).toEqual(1)
    })
  })

  describe('#saveToFile-full', () => {
    const currentTest = {
      filename: './tests/temp/test-multi-nodes.json'
    }

    beforeEach(async () => {
      await fsExtra.ensureDir(path.dirname(currentTest.filename))
      if (fsExtra.existsSync(currentTest.filename)) {
        await fsExtra.remove(currentTest.filename)
      }
    })

    it('should save a graph that has multiple nodes and edges to a file', async () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.id = TestGraphId

      graph.addNode(PlayerKyrieIrving.id, PlayerKyrieIrving.name)
      graph.addNode(TeamBostonCeltics.id, TeamBostonCeltics.name)

      graph.addEdge(PlayerKyrieIrving.id, TeamBostonCeltics.id, PlayerContractRelation)

      await container.saveToFile(currentTest.filename)

      expect(fsExtra.existsSync(currentTest.filename)).toBe(true)

      const fileContent = await fsExtra.readJson(currentTest.filename)
      expect(Object.keys(fileContent.graph.nodes).length).toEqual(2)
      expect(fileContent.graph.edges.length).toEqual(1)
    })
  })
})
