import { JGFContainer } from '../src/jgfContainer'

describe('JGF Container', () => {
  it('should create a valid empty graph container, in Single-Graph mode', () => {
    const container = new JGFContainer(true)
    expect(container).not.toBeNull()

    const { graph } = container
    expect(graph).not.toBeNull()
    expect(graph.nodes).not.toBeNull()
  })

  it('should create a valid empty graph container, in Multi-Graph mode', () => {
    const container = new JGFContainer(false)
    expect(container).not.toBeNull()

    const { graphs } = container
    expect(graphs).not.toBeNull()
    expect(graphs.length).toEqual(0)
  })

  it('should add a graph to the container, in Multi-Graph mode', () => {
    const container = new JGFContainer(false)
    expect(container).not.toBeNull()

    const graph = container.addEmptyGraph()
    expect(graph).not.toBeNull()
    expect(graph.nodes).not.toBeNull()
    expect(container.graphs.length).toEqual(1)
  })
})
