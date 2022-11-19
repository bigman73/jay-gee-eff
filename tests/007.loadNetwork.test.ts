import { JGFContainer } from '../src/jgfContainer'

describe('ContainerLoadFromFile-test-network', () => {
  describe('#loadFromFile-test-network', () => {
    const TestFilename = './tests/examples/test.network.json'

    it('should load the test network file', async () => {
      const container = new JGFContainer()
      await container.loadFromFile(TestFilename)
      expect(container.isMultiGraph).toBe(false)
      const { graph } = container

      expect(graph.type).toEqual('BEL-V1.0')
      expect(graph.metadata?.speciesName).toEqual('Human')
      expect(Object.keys(graph.nodes).length).toEqual(9)
      expect(graph.edges.length).toEqual(8)
    })
  })
})
