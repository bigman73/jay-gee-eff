/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import path from 'path'

import fsExtra, { JsonWriteOptions } from 'fs-extra'
import { Validator } from 'jsonschema'

import { GraphJSON, JGFGraph } from './jgfGraph'
import { getMatchingFiles } from './misc'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JSONSchema = any

let jgfSchemaV2: JSONSchema = null

/**
 * Reads the JGF Schema V2 from a JSON file.
 */
const readJGFSchemaV2 = async () => {
  const jgfSchemaFilename = path.join(path.dirname(__filename), 'jgfSchemaV2.json')

  jgfSchemaV2 = await fsExtra.readJSON(jgfSchemaFilename)
}

/**
 * JGF Container (main class) of zero or more JGF graphs.
 */
export class JGFContainer {
  _schemaValidator: Validator
  _graphs: Array<JGFGraph>
  isSingleGraph: boolean
  json: GraphJSON

  /**
   * Constructor.
   *
   * @param singleGraph - True for single-graph mode, false for multi-graph mode.
   */
  constructor(singleGraph = true) {
    this._schemaValidator = new Validator()
    this._graphs = []
    this.isSingleGraph = singleGraph

    if (singleGraph) {
      this.addEmptyGraph()
    }
  }

  /**
   * Returns all graphs, in Multi-Graph mode.
   *
   * @returns List of graphs.
   */
  get graphs(): Array<JGFGraph> {
    if (this.isSingleGraph) {
      throw new Error('Cannot call graphs() in Single-Graph mode')
    }

    return this._graphs
  }

  /**
   * Returns the graph, in Single-Graph mode.
   *
   * @returns The single graph.
   */
  get graph(): JGFGraph {
    if (!this.isSingleGraph) {
      throw new Error('Cannot call graph() in Multi-Graph mode')
    }

    return this._graphs[0]
  }

  /**
   * Multi-Graph mode flag.
   *
   * @returns True if the container is in Multi-Graph mode, otherwise false.
   */
  get isMultiGraph(): boolean {
    return !this.isSingleGraph
  }

  /**
   * Adds an empty graph.
   *
   * @returns Empty graph.
   */
  addEmptyGraph(): JGFGraph {
    const graph = new JGFGraph()
    this._graphs.push(graph)

    return graph
  }

  /**
   * Loads a JGF file V2 into memory.
   *
   * @param filename - JGF filename.
   */
  async loadFromFile(filename: string) {
    if (!jgfSchemaV2) {
      await readJGFSchemaV2()
    }

    this.json = await fsExtra.readJson(filename)
    const valid = this._schemaValidator.validate(this.json, jgfSchemaV2)

    if (!valid.valid) {
      throw new Error(`Invalid JGF format. Validation Errors: ${JSON.stringify(valid.errors)}`)
    }

    this.isSingleGraph = Boolean(this.json.graph)

    if (this.isSingleGraph) {
      const singleGraph = new JGFGraph()
      singleGraph.loadFromJSON(this.json.graph)
      this._graphs = [singleGraph]
    } else {
      this._graphs = []
      this.json.graphs.forEach((graphJson: GraphJSON) => {
        const graphInstance = new JGFGraph()
        graphInstance.loadFromJSON(graphJson)
        this._graphs.push(graphInstance)
      })
    }
  }

  /**
   * Loads multiple partial graph files into a single merged in-memory graph.
   *
   * @param filenameWildcard - Pattern to use for partial JGF files.
   * @param type - Graph type.
   * @param label - Graph label.
   */
  async loadFromPartialFiles(filenameWildcard: string, type = 'JGFGraph', label = '') {
    try {
      if (!jgfSchemaV2) {
        await readJGFSchemaV2()
      }

      this._graphs = []
      this.isSingleGraph = true
      const mainGraph = this.addEmptyGraph()
      mainGraph.type = type
      mainGraph.label = label

      const files = await getMatchingFiles(filenameWildcard)
      let firstTime = true

      const allEdgesGroups = []

      // 1st pass - Read all partial graphs and only add the nodes,
      //   accumulate the edges for the 2nd pass
      for (const filename of files) {
        console.debug(`Loading partial graph file: ${filename}`)

        // Load partial JGF graph file
        // eslint-disable-next-line no-await-in-loop
        const partialJson = await fsExtra.readJson(filename)
        const valid = this._schemaValidator.validate(this.json, jgfSchemaV2)

        if (!valid) {
          throw new Error(`Invalid graph, filename = ${filename}`)
        }

        if (firstTime) {
          mainGraph.directed = partialJson.graph.directed
          // TODO: Merge all meta data sections of partial graphs into one
          mainGraph.metadata = partialJson.graph.metadata

          // Remove is partial.
          //   Merge main graph is always full (non-partial) by definition
          if (mainGraph.metadata?.isPartial) {
            Reflect.deleteProperty(mainGraph.metadata, 'isPartial')
          }
          firstTime = false
        }

        // Add its nodes to the main graph
        if (partialJson.graph.nodes && Object.keys(partialJson.graph.nodes).length > 0) {
          mainGraph.addNodes(partialJson.graph.nodes)
        }

        // TODO: Test that a partial node-less/edge only graph
        //   passes the schema and can be save and loaded

        // Store edges for the 2nd pass
        if (partialJson.graph.edges && partialJson.graph.edges.length > 0) {
          allEdgesGroups.push(partialJson.graph.edges)
        }
      }

      // Second pass - now that all nodes are added to the graph, add the edges
      for (const edgesGroup of allEdgesGroups) {
        mainGraph.addEdges(edgesGroup)
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * Saves the in memory JSON graph into a JGF file.
   *
   * @param filename - JGF filename.
   * @param prettyPrint - True to output a easy to read JSON, false for a compact JSON.
   */
  async saveToFile(filename: string, prettyPrint = false) {
    try {
      const containerJson: GraphJSON = {}
      if (this.isSingleGraph) {
        containerJson.graph = this._graphs[0].json
      } else {
        containerJson.graphs = []
        this._graphs.forEach((graph) => {
          containerJson.graphs.push(graph.json)
        })
      }

      const options: JsonWriteOptions = {}
      if (prettyPrint) {
        options.spaces = 4
      }
      await fsExtra.writeJson(filename, containerJson, options)
    } catch (error) {
      console.error(`Failed saving JGF to file ${filename}, error: ${error}`)
      throw error
    }
  }
}
