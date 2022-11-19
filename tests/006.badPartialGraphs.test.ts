import path from 'path'

import fsExtra from 'fs-extra'

import { safeRemoveFile } from '../src/common'
import { JGFContainer } from '../src/jgfContainer'

import { PlayerContractRelation, PlayerLeBronJames, TeamLALakers } from './testData'

/* eslint no-invalid-this: 0 */

describe('BadPartialGraph', () => {
  describe('#save and load bad partial graphs', () => {
    const Filename1 = './tests/temp/partial-bad3.json'
    const Filename2 = './tests/temp/partial-bad4.json'

    beforeEach(async () => {
      await fsExtra.ensureDir(path.dirname(Filename1))
    })

    beforeEach(async () => {
      await safeRemoveFile(Filename1)
      await safeRemoveFile(Filename2)
    })

    it('should save bad partial graphs but fail loading them', async () => {
      const container1 = new JGFContainer(true)
      const graph1 = container1.graph
      graph1.isPartial = true

      const badNode2Id = 'celtics#1610612738'

      graph1.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)
      graph1.addEdge(PlayerLeBronJames.id, badNode2Id, PlayerContractRelation)

      const { edges } = graph1
      expect(edges).not.toBeNull()
      expect(edges.length).toEqual(1)

      const container2 = new JGFContainer(true)
      const graph2 = container2.graph
      graph2.isPartial = true

      graph2.addNode(TeamLALakers.id, TeamLALakers.name)

      await container1.saveToFile(Filename1)
      await container2.saveToFile(Filename2)

      const container = new JGFContainer()
      expect(() =>
        container.loadFromPartialFiles('./tests/temp/partial-bad*.json')
      ).rejects.toThrow('Invalid graph')
    })
  })
})
