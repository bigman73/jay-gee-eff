import { JGFContainer } from '../src/jgfContainer'
import { JGFNode } from '../src/jgfNode'

import {
  PlayerContractRelation,
  PlayerKevinDurant,
  PlayerKyrieIrving,
  PlayerLeBronJames,
  TeamLALakers
} from './testData'

describe('JGF Graph', () => {
  describe('#add graph node', () => {
    it('should add a simple node to a graph', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)
      expect(Object.keys(graph.nodes).length).toEqual(1)
      expect(PlayerLeBronJames.id).toEqual(Object.keys(graph.nodes)[0])
      expect(PlayerLeBronJames.name).toEqual(Object.values(graph.nodes)[0].label)
    })

    it('should add a node to a graph, with meta data', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerKevinDurant.id, PlayerKevinDurant.name, PlayerKevinDurant.metadata)
      expect(Object.keys(graph.nodes).length).toEqual(1)
      const node = Object.values(graph.nodes)[0]
      expect(node.metadata?.position).toEqual(PlayerKevinDurant.metadata.position)
      expect(node.metadata?.shirt).toEqual(PlayerKevinDurant.metadata.shirt)
    })

    it('should throw an exception when adding a node that already exists', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerKevinDurant.id, PlayerKevinDurant.name)

      expect(() => graph.addNode(PlayerKevinDurant.id, PlayerKevinDurant.name)).toThrow(
        'A node already exists'
      )
    })

    it('should throw an exception when adding nodes that already exist', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerKevinDurant.id, PlayerKevinDurant.name)

      const moreNodes: Record<string, JGFNode> = {
        [PlayerKevinDurant.id]: {
          label: PlayerKevinDurant.name
        },
        [PlayerKyrieIrving.id]: {
          label: PlayerKyrieIrving.name
        }
      }

      expect(() => graph.addNodes(moreNodes)).toThrow('A node already exists')
    })
  })

  describe('#update graph node', () => {
    it("should update a node's label", () => {
      const container = new JGFContainer(true)
      const { graph } = container

      const nodeId = 'kevin-love#0000'
      const nodeLabel = 'Kevin Lofe'

      graph.addNode(nodeId, nodeLabel)
      const correctLabel = 'Kevin Love'
      graph.updateNode(nodeId, correctLabel)
      expect(correctLabel).toEqual(Object.values(graph.nodes)[0].label)
    })
  })

  describe('#removeNode', () => {
    it('should remove a node', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerKevinDurant.id, PlayerKevinDurant.name)

      graph.removeNode(PlayerKevinDurant.id)
      expect(Object.keys(graph.nodes).length).toEqual(0)
    })

    it('should throw an exception when removing a non existent node', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      expect(() => graph.removeNode('some dummy id')).toThrow("A node doesn't exist")
    })
  })

  describe('#getNode', () => {
    it('should lookup a node by id', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      const nodeId = 'kevin-durant#4497'
      const nodeLabel = 'Kevin Durant'

      graph.addNode(nodeId, nodeLabel)

      const node = graph.getNode(nodeId)
      expect(node).not.toBeNull()
    })

    it('should throw an exception when looking up a non existent node', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      expect(() => graph.getNode('some dummy id')).toThrow("A node doesn't exist")
    })
  })

  describe('#addGraphEdge', () => {
    it('should add a simple edge to a graph', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)
      graph.addNode(TeamLALakers.id, TeamLALakers.name)

      expect(Object.keys(graph.nodes).length).toEqual(2)

      graph.addEdge(PlayerLeBronJames.id, TeamLALakers.id, PlayerContractRelation)

      expect(graph.edges.length).toEqual(1)
      expect(graph.edges[0].relation).toEqual(PlayerContractRelation)
    })
  })

  describe('#removeEdges', () => {
    it('should remove a graph edge', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)
      graph.addNode(TeamLALakers.id, TeamLALakers.name)
      graph.addEdge(PlayerLeBronJames.id, TeamLALakers.id, PlayerContractRelation)

      graph.removeEdges(PlayerLeBronJames.id, TeamLALakers.id, PlayerContractRelation)
      expect(graph.edges.length).toEqual(0)
    })
  })

  describe('#getEdges', () => {
    it('should lookup edges', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode(PlayerLeBronJames.id, PlayerLeBronJames.name)
      graph.addNode(TeamLALakers.id, TeamLALakers.name)
      graph.addEdge(PlayerLeBronJames.id, TeamLALakers.id, PlayerContractRelation)

      const edges = graph.getEdges(PlayerLeBronJames.id, TeamLALakers.id, PlayerContractRelation)
      expect(edges).not.toBeNull()
      expect(edges.length).toEqual(1)
    })
  })

  describe('#graphDimensions', () => {
    it('should return zero dimensions for an empty graph', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      const dimensions = graph.graphDimensions
      expect(dimensions.nodes).toEqual(0)
      expect(dimensions.edges).toEqual(0)
    })

    it('should return valid dimensions for a non-empty graph', () => {
      const container = new JGFContainer(true)
      const { graph } = container

      graph.addNode('node1', 'nodeTypeA')
      graph.addNode('node2', 'nodeTypeB')
      graph.addEdge('node1', 'node2', 'edgeTypeC')

      const dimensions = graph.graphDimensions
      expect(dimensions.nodes).toEqual(2)
      expect(dimensions.edges).toEqual(1)
    })
  })
})
