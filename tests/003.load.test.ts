import { JGFContainer } from '../src/jgfContainer'

describe('ContainerLoadFromFile', () => {
  describe('#loadFromFile-carGraphs', () => {
    const currentTest = {
      filename: './tests/examples/car_graphs.json'
    }

    it('should load the car graphs file (multi graphs)', async () => {
      const container = new JGFContainer()
      await container.loadFromFile(currentTest.filename)
      expect(container.isMultiGraph).toBe(true)
      const { graphs } = container

      expect(graphs.length).toEqual(2)

      const firstGraph = graphs[0]
      expect(firstGraph.type).toEqual('car')
      expect(Object.keys(firstGraph.nodes).length).toEqual(4)
      expect(firstGraph.edges.length).toEqual(2)
    })
  })

  describe('#loadInvalidJsonFile', () => {
    it('should throw an error when loading an invalid json file ', async () => {
      const badTestFilename = './tests/examples/bad_car_graphs.json'
      const container = new JGFContainer()
      expect(async () => await container.loadFromFile(badTestFilename)).rejects.toThrowError(
        'Invalid JGF format.'
      )
    })
  })
})
