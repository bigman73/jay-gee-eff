"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JGFContainer = void 0;
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const jsonschema_1 = require("jsonschema");
const jgfGraph_1 = require("./jgfGraph");
const misc_1 = require("./misc");
let jgfSchemaV2 = null;
/**
 * Reads the JGF Schema V2 from a JSON file.
 */
const readJGFSchemaV2 = () => __awaiter(void 0, void 0, void 0, function* () {
    const jgfSchemaFilename = path_1.default.join(path_1.default.dirname(__filename), 'jgfSchemaV2.json');
    jgfSchemaV2 = yield fs_extra_1.default.readJSON(jgfSchemaFilename);
});
/**
 * JGF Container (main class) of zero or more JGF graphs.
 */
class JGFContainer {
    /**
     * Constructor.
     *
     * @param singleGraph - True for single-graph mode, false for multi-graph mode.
     */
    constructor(singleGraph = true) {
        this._schemaValidator = new jsonschema_1.Validator();
        this._graphs = [];
        this.isSingleGraph = singleGraph;
        if (singleGraph) {
            this.addEmptyGraph();
        }
    }
    /**
     * Returns all graphs, in Multi-Graph mode.
     *
     * @returns List of graphs.
     */
    get graphs() {
        if (this.isSingleGraph) {
            throw new Error('Cannot call graphs() in Single-Graph mode');
        }
        return this._graphs;
    }
    /**
     * Returns the graph, in Single-Graph mode.
     *
     * @returns The single graph.
     */
    get graph() {
        if (!this.isSingleGraph) {
            throw new Error('Cannot call graph() in Multi-Graph mode');
        }
        return this._graphs[0];
    }
    /**
     * Multi-Graph mode flag.
     *
     * @returns True if the container is in Multi-Graph mode, otherwise false.
     */
    get isMultiGraph() {
        return !this.isSingleGraph;
    }
    /**
     * Adds an empty graph.
     *
     * @returns Empty graph.
     */
    addEmptyGraph() {
        const graph = new jgfGraph_1.JGFGraph();
        this._graphs.push(graph);
        return graph;
    }
    /**
     * Loads a JGF file V2 into memory.
     *
     * @param filename - JGF filename.
     */
    loadFromFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jgfSchemaV2) {
                yield readJGFSchemaV2();
            }
            this.json = yield fs_extra_1.default.readJson(filename);
            const valid = this._schemaValidator.validate(this.json, jgfSchemaV2);
            if (!valid.valid) {
                throw new Error(`Invalid JGF format. Validation Errors: ${JSON.stringify(valid.errors)}`);
            }
            this.isSingleGraph = Boolean(this.json.graph);
            if (this.isSingleGraph) {
                const singleGraph = new jgfGraph_1.JGFGraph();
                singleGraph.loadFromJSON(this.json.graph);
                this._graphs = [singleGraph];
            }
            else {
                this._graphs = [];
                this.json.graphs.forEach((graphJson) => {
                    const graphInstance = new jgfGraph_1.JGFGraph();
                    graphInstance.loadFromJSON(graphJson);
                    this._graphs.push(graphInstance);
                });
            }
        });
    }
    /**
     * Loads multiple partial graph files into a single merged in-memory graph.
     *
     * @param filenameWildcard - Pattern to use for partial JGF files.
     * @param type - Graph type.
     * @param label - Graph label.
     */
    loadFromPartialFiles(filenameWildcard, type = 'JGFGraph', label = '') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!jgfSchemaV2) {
                    yield readJGFSchemaV2();
                }
                this._graphs = [];
                this.isSingleGraph = true;
                const mainGraph = this.addEmptyGraph();
                mainGraph.type = type;
                mainGraph.label = label;
                const files = yield (0, misc_1.getMatchingFiles)(filenameWildcard);
                let firstTime = true;
                const allEdgesGroups = [];
                // 1st pass - Read all partial graphs and only add the nodes,
                //   accumulate the edges for the 2nd pass
                for (const filename of files) {
                    console.debug(`Loading partial graph file: ${filename}`);
                    // Load partial JGF graph file
                    // eslint-disable-next-line no-await-in-loop
                    const partialJson = yield fs_extra_1.default.readJson(filename);
                    const valid = this._schemaValidator.validate(this.json, jgfSchemaV2);
                    if (!valid) {
                        throw new Error(`Invalid graph, filename = ${filename}`);
                    }
                    if (firstTime) {
                        mainGraph.directed = partialJson.graph.directed;
                        // TODO: Merge all meta data sections of partial graphs into one
                        mainGraph.metadata = partialJson.graph.metadata;
                        // Remove is partial.
                        //   Merge main graph is always full (non-partial) by definition
                        if ((_a = mainGraph.metadata) === null || _a === void 0 ? void 0 : _a.isPartial) {
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
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    /**
     * Saves the in memory JSON graph into a JGF file.
     *
     * @param filename - JGF filename.
     * @param prettyPrint - True to output a easy to read JSON, false for a compact JSON.
     */
    saveToFile(filename, prettyPrint = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const containerJson = {};
                if (this.isSingleGraph) {
                    containerJson.graph = this._graphs[0].json;
                }
                else {
                    containerJson.graphs = [];
                    this._graphs.forEach((graph) => {
                        containerJson.graphs.push(graph.json);
                    });
                }
                const options = {};
                if (prettyPrint) {
                    options.spaces = 4;
                }
                yield fs_extra_1.default.writeJson(filename, containerJson, options);
            }
            catch (error) {
                console.error(`Failed saving JGF to file ${filename}, error: ${error}`);
                throw error;
            }
        });
    }
}
exports.JGFContainer = JGFContainer;
