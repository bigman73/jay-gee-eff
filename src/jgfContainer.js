/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { Validator } = require('jsonschema');
const fsExtra = require('fs-extra');
const path = require('path');
const { JGFGraph } = require('./jgfGraph');
const { getMatchingFiles } = require('./misc');

let jgfSchemaV1 = null;
let jgfSchemaV2 = null;

/**
 * Reads the JGF Schema V1 from a JSON file
 */
const readJGFSchemaV1 = async () => {
    const jgfSchemaFilename = path.join(path.dirname(__filename), 'jgfSchemaV1.json');

    jgfSchemaV1 = await fsExtra.readJSON(jgfSchemaFilename);
};

/**
 * Reads the JGF Schema V2 from a JSON file
 */
const readJGFSchemaV2 = async () => {
    const jgfSchemaFilename = path.join(path.dirname(__filename), 'jgfSchemaV2.json');

    jgfSchemaV2 = await fsExtra.readJSON(jgfSchemaFilename);
};

/**
 * JGF Container (main class) of zero or more JGF graphs
 */
class JGFContainer {
    /**
     * Constructor
     * @param {*} singleGraph true for single-graph mode, false for multi-graph mode
     */
    constructor(singleGraph = true) {
        this.JGFSchemaValidator = new Validator();
        this._graphs = [];
        this.isSingleGraph = singleGraph;

        if (singleGraph) {
            this.addEmptyGraph();
        }
    }

    /**
     * Returns all graphs, in Multi-Graph mode
     */
    get graphs() {
        if (this.isSingleGraph) {
            throw new Error('Cannot call graphs() in Single-Graph mode');
        }

        return this._graphs;
    }

    /**
     * Returns the graph, in Single-Graph mode
     */
    get graph() {
        if (!this.isSingleGraph) {
            throw new Error('Cannot call graph() in Multi-Graph mode');
        }

        return this._graphs[0];
    }

    /**
     * Returns true if the container is in Multi-Graph mode
     */
    get isMultiGraph() {
        return !this.isSingleGraph;
    }

    /**
     * Adds an empty graph
     */
    addEmptyGraph() {
        const graph = new JGFGraph();
        this._graphs.push(graph);

        return graph;
    }

    /**
     * Loads a JGF V1 file into memory
     * Used for old V1 files
     *
     * @param {string} filename JGF filename
     */
    async loadFromFileV1(filename) {
        try {
            if (!jgfSchemaV1) {
                await readJGFSchemaV1();
            }

            this.json = await fsExtra.readJson(filename);
            const valid = this.JGFSchemaValidator.validate(this.json, jgfSchemaV1);

            if (!valid.valid) {
                throw new Error(`Invalid JGF format. Validation Errors: ${JSON.stringify(valid.errors)}`);
            }

            this.isSingleGraph = Boolean(this.json.graph);
            console.debug(`loadFromFile, isSingleGraph: ${this.isSingleGraph}`);

            if (this.isSingleGraph) {
                const singleGraph = new JGFGraph();
                singleGraph.loadFromJSONV1(this.json.graph);
                this._graphs = [singleGraph];
            } else {
                this._graphs = [];
                this.json.graphs.forEach((graphJson) => {
                    const graphInstance = new JGFGraph();
                    graphInstance.loadFromJSONV1(graphJson);
                    this._graphs.push(graphInstance);
                });
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Loads a JGF file V2 into memory
     *
     * @param {string} filename JGF filename
     */
    async loadFromFile(filename) {
        try {
            if (!jgfSchemaV2) {
                await readJGFSchemaV2();
            }

            this.json = await fsExtra.readJson(filename);
            const valid = this.JGFSchemaValidator.validate(this.json, jgfSchemaV2);

            if (!valid.valid) {
                throw new Error(`Invalid JGF format. Validation Errors: ${JSON.stringify(valid.errors)}`);
            }

            this.isSingleGraph = Boolean(this.json.graph);
            console.debug(`loadFromFile, isSingleGraph: ${this.isSingleGraph}`);

            if (this.isSingleGraph) {
                const singleGraph = new JGFGraph();
                singleGraph.loadFromJSON(this.json.graph);
                this._graphs = [singleGraph];
            } else {
                this._graphs = [];
                this.json.graphs.forEach((graphJson) => {
                    const graphInstance = new JGFGraph();
                    graphInstance.loadFromJSON(graphJson);
                    this._graphs.push(graphInstance);
                });
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Loads multiple partial graph files into a single merged in-memory graph
     *
     * @param {string} filenameWildcard pattern to use for partial JGF files
     */
    async loadFromPartialFiles(filenameWildcard, type, label) {
        try {
            if (!jgfSchemaV2) {
                await readJGFSchemaV2();
            }

            this._graphs = [];
            this.isSingleGraph = true;
            const mainGraph = this.addEmptyGraph();
            mainGraph.type = type;
            mainGraph.label = label;

            const files = await getMatchingFiles(filenameWildcard);
            let firstTime = true;

            const allEdgesGroups = [];

            // 1st pass - Read all partial graphs and only add the nodes,
            //   accumulate the edges for the 2nd pass
            for (const filename of files) {
                console.debug(`Loading partial graph file: ${filename}`);

                // Load partial JGF graph file
                // eslint-disable-next-line no-await-in-loop
                const partialJson = await fsExtra.readJson(filename);
                const valid = this.JGFSchemaValidator.validate(this.json, jgfSchemaV2);

                if (!valid) {
                    throw new Error(`Invalid graph, filename = ${filename}`);
                }

                if (firstTime) {
                    mainGraph.directed = partialJson.graph.directed;
                    // TODO: Merge all meta data sections of partial graphs into one
                    mainGraph.metadata = partialJson.graph.metadata;

                    // Remove is partial.
                    //   Merge main graph is always full (non-partial) by definition
                    if (mainGraph.metadata && mainGraph.metadata.isPartial) {
                        Reflect.deleteProperty(mainGraph.metadata, 'isPartial');
                    }
                    firstTime = false;
                }

                // Add its nodes to the main graph
                if (partialJson.graph.nodes && Object.keys(partialJson.graph.nodes).length > 0) {
                    mainGraph.addNodes(partialJson.graph.nodes);
                }

                // TODO: Test that a partial node-less/edge only graph
                //   passes the schema and can be save and loaded

                // Store edges for the 2nd pass
                if (partialJson.graph.edges && partialJson.graph.edges.length > 0) {
                    allEdgesGroups.push(partialJson.graph.edges);
                }
            }

            // Second pass - now that all nodes are added to the graph, add the edges
            for (const edgesGroup of allEdgesGroups) {
                mainGraph.addEdges(edgesGroup);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Saves the in memory JSON graph into a JGF file
     *
     * @param {string} filename JGF filename
     */
    async saveToFile(filename, prettyPrint = false) {
        try {
            const containerJson = {};
            if (this.isSingleGraph) {
                containerJson.graph = this._graphs[0].json;
            } else {
                containerJson.graphs = [];
                this._graphs.forEach((graph) => {
                    containerJson.graphs.push(graph.json);
                });
            }

            const options = {};
            if (prettyPrint) {
                options.spaces = 4;
            }
            await fsExtra.writeJson(filename, containerJson, options);
        } catch (error) {
            console.error(`Failed saving JGF to file ${filename}, error: ${error}`);
            throw error;
        }
    }
}

module.exports = {
    JGFContainer
};
