const Validator = require('jsonschema').Validator;
const fsExtra = require('fs-extra');
// const _ = require('lodash');
const { JGFGraph } = require('./jgfGraph');
const misc = require('./misc');

let jgfSchema = null;

/**
 * JGF Container (main class) of zero or more JGF graphs
 */
class JGFContainer {
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
            throw new Error('Cannot call graphs() in Single-Graph mode')
        }

        return this._graphs;
    }

    /**
     * Returns the graph, in Single-Graph mode
     */
    get graph() {
        if (!this.isSingleGraph) {
            throw new Error('Cannot call graph() in Multi-Graph mode')
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
        let graph = new JGFGraph();
        this._graphs.push(graph);

        return graph;
    }

    /**
     * Loads a JGF file into memory
     * @param {*} filename JGF filename
     */
    async loadFromFile(filename) {
        try {
            if (!jgfSchema) {
                jgfSchema = await fsExtra.readJSON('./jgfSchema.json');
            }

            this.json = await fsExtra.readJson(filename);
            let valid = this.JGFSchemaValidator.validate(this.json, jgfSchema);

            if (!valid.valid) {
                throw new Error(`Invalid JGF format. Validation Errors: ${JSON.stringify(valid.errors)}`)
            }

            this.isSingleGraph = Boolean(this.json.graph);
            console.log(`loadFromFile, isSingleGraph: ${this.isSingleGraph}`);

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
     * @param {*} filenameWildcard pattern to use for partial JGF files
     */
    async loadFromPartialFiles(filenameWildcard) {
        try {
            if (!jgfSchema) {
                jgfSchema = await fsExtra.readJSON('./jgfSchema.json');
            }


            this._graphs = [];
            this.isSingleGraph = true;
            let mainGraph = this.addEmptyGraph();

            let files = await misc.getMatchingfiles(filenameWildcard);
            let firstTime = true;

            for (let filename of files) {
                console.log(filename);

                // Load partial JGF graph file
                let partialJson = await fsExtra.readJson(filename); // eslint-disable-line no-await-in-loop
                let valid = this.JGFSchemaValidator.validate(this.json, jgfSchema);

                if (!valid) {
                    throw new Error(`Invalid graph, filename = ${filename}`);
                }

                if (firstTime) {
                    mainGraph.label = partialJson.graph.label;
                    mainGraph.type = partialJson.graph.type;
                    mainGraph.directed = partialJson.graph.directed;
                    mainGraph.metadata = partialJson.graph.metadata;
                    firstTime = false;
                }

                // Add its nodes to the main graph
                // TODO: Validate that node doesn't exist already (by node id)
                mainGraph.nodes.push(...partialJson.graph.nodes);

                mainGraph.edges.push(...partialJson.graph.edges);
            }

            // TODO: Validate that all edges have valid nodes (by node id)
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Saves the in memory JSON graph into a JGF file
     * @param {*} filename JGF filename
     */
    async saveToFile(filename) {
        try {
            let containerJson = {};
            if (this.isSingleGraph) {
                containerJson.graph = this._graphs[0]._json;
            } else {
                containerJson.graphs = [];
                this._graphs.forEach((graph) => {
                    containerJson.graphs.push(graph);
                });
            }

            await fsExtra.writeJson(filename, containerJson);
        } catch (error) {
            console.error(`Failed saving JGF to file ${filename}, error: ${error}`);
            throw error;
        }
    }
}

module.exports = {
    JGFContainer
};