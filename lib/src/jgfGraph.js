"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JGFGraph = void 0;
/* eslint-disable max-lines */
const check_types_1 = __importDefault(require("check-types"));
const jsonschema_1 = require("jsonschema");
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const common_1 = require("./common");
const jgfNode_1 = require("./jgfNode");
/**
 * A single JGF graph instance, always contained in a parent JGFContainer.
 */
class JGFGraph {
    /**
     * Constructor.
     *
     * @param id - Graph unique id.
     * @param type - Graph classification.
     * @param label - A text display for the graph.
     * @param directed - True for a directed graph, false for an undirected graph.
     * @param metadata - Graph meta data attributes.
     */
    constructor(id = '', type = '', label = '', directed = true, metadata) {
        this._validator = new jsonschema_1.Validator();
        this._nodes = {};
        this._edges = [];
        this._id = id;
        this._type = type;
        this._label = label;
        this._directed = directed;
        this._metadata = metadata;
        this._isPartial = false;
    }
    /**
     * Loads the graph from a JGF JSON object.
     *
     * @param graphJson - JGF JSON object.
     */
    loadFromJSON(graphJson) {
        this._id = graphJson.id;
        this._type = graphJson.type;
        this._label = graphJson.label;
        this._directed = graphJson.directed || true;
        this._metadata = graphJson.metadata;
        this._nodes = {};
        this._edges = [];
        this.addNodes(graphJson.nodes);
        this.addEdges(graphJson.edges);
    }
    /**
     * Returns the isPartial flag.
     *
     * @returns True if partial graph, otherwise false.
     */
    get isPartial() {
        return this._isPartial;
    }
    /**
     * Set the isPartial flag.
     */
    set isPartial(value) {
        this._isPartial = value;
    }
    /**
     * Returns the graph id.
     *
     * @returns Graph id.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the graph id.
     */
    set id(value) {
        this._id = value;
    }
    /**
     * Returns the graph type.
     *
     * @returns Graph type.
     */
    get type() {
        return this._type;
    }
    /**
     * Set the graph type.
     */
    set type(value) {
        this._type = value;
    }
    /**
     * Returns the graph label.
     *
     * @returns Graph label.
     */
    get label() {
        return this._label;
    }
    /**
     * Set the graph label.
     */
    set label(value) {
        this._label = value;
    }
    /**
     * Returns the graph meta data.
     *
     * @returns Graph meta data attribute.
     */
    get metadata() {
        return this._metadata;
    }
    /**
     * Set the graph meta data.
     */
    set metadata(value) {
        this._metadata = value;
    }
    /**
     * Returns the directed flag.
     *
     * @returns Graph directed flag.
     */
    get directed() {
        return this._directed;
    }
    /**
     * Set the graph directed flag.
     */
    set directed(value) {
        this._directed = value;
    }
    /**
     * Returns all nodes.
     *
     * @returns List of all nodes.
     */
    get nodes() {
        return (0, common_1.cloneObject)(this._nodes);
    }
    /**
     * Returns all edges.
     *
     * @returns List of all edges.
     */
    get edges() {
        return (0, common_1.cloneObject)(this._edges);
    }
    /**
     * Returns the graph as JGF Json.
     *
     * @returns Graph as JGF JSON object.
     */
    get json() {
        const json = {
            id: this._id,
            type: this._type,
            label: this._label,
            directed: this._directed,
            metadata: {},
            nodes: {},
            edges: []
        };
        if (check_types_1.default.assigned(this._metadata)) {
            json.metadata = this._metadata;
        }
        if (this._isPartial) {
            json.metadata.isPartial = this._isPartial;
        }
        if ((0, lodash_isempty_1.default)(json.metadata)) {
            Reflect.deleteProperty(json, 'metadata');
        }
        if (check_types_1.default.assigned(this._nodes) && Object.keys(this._nodes).length > 0) {
            json.nodes = this._nodes;
        }
        if (check_types_1.default.assigned(this._edges) && this._edges.length > 0) {
            json.edges = this._edges;
        }
        return (0, common_1.cloneObject)(json);
    }
    /**
     * Adds a new node.
     *
     * @param id - Node id.
     * @param label - Node label.
     * @param metadata - Node meta data attributes.
     * @throws If node already exists.
     */
    addNode(id, label, metadata) {
        if (id in this._nodes) {
            throw new Error(`A node already exists with id = ${id}`);
        }
        const newNode = new jgfNode_1.JGFNode(label);
        if (check_types_1.default.assigned(metadata)) {
            newNode.metadata = metadata;
        }
        this._nodes[id] = newNode;
    }
    /**
     * Adds multiple nodes.
     *
     * @param nodes - A collection of JGF node objects.
     * @throws If node already exists.
     */
    addNodes(nodes) {
        for (const [nodeId, node] of Object.entries(nodes)) {
            if (nodeId in this._nodes) {
                throw new Error(`A node already exists with id = ${nodeId}`);
            }
            this._nodes[nodeId] = node;
        }
    }
    /**
     * Updates an existing node.
     *
     * @param nodeId - Node id.
     * @param label - Updated node label.
     * @param metadata - Updated node meta data attributes.
     * @throws If node doesn't exist.
     */
    updateNode(nodeId, label, metadata) {
        if (!(nodeId in this._nodes)) {
            throw new Error(`Can't update node. A node doesn't exist with id = ${nodeId}`);
        }
        const node = this._nodes[nodeId];
        if (check_types_1.default.assigned(label)) {
            node.label = label;
        }
        if (check_types_1.default.assigned(metadata)) {
            node.metadata = metadata;
        }
    }
    /**
     * Removes an existing graph node.
     *
     * @param nodeId - Node unique id.
     * @throws If node doesn't exist.
     */
    removeNode(nodeId) {
        if (!(nodeId in this._nodes)) {
            throw new Error(`A node doesn't exist with id = ${nodeId}`);
        }
        Reflect.deleteProperty(this._nodes, nodeId);
    }
    /**
     * Lookup a node by a node id.
     *
     * @param nodeId - Unique node id.
     * @returns Graph node.
     * @throws If node doesn't exist.
     */
    getNode(nodeId) {
        if (!(nodeId in this._nodes)) {
            throw new Error(`A node doesn't exist with id = ${nodeId}`);
        }
        return (0, common_1.cloneObject)(this._nodes[nodeId]);
    }
    /**
     * Adds an edge between a source node and a target node.
     *
     * @param source - Source node id.
     * @param target - Target node id.
     * @param relation - Edge relation (AKA 'relationship type').
     * @param label - Edge label (the display name of the edge).
     * @param metadata - Custom edge meta data.
     * @param directed - True for a directed edge, false for undirected.
     * @param id - Edge identity.
     * @throws If source or target are invalid.
     */
    addEdge(source, target, relation, label, metadata, directed, id) {
        if (!source) {
            throw new Error('addEdge failed: source parameter is not valid');
        }
        if (!target) {
            throw new Error('addEdge failed: target parameter is not valid');
        }
        if (!this._isPartial) {
            // Validate that the edge's nodes exist
            if (!(source in this._nodes)) {
                throw new Error(`addEdge failed: source node isn't found in nodes. source = ${source}`);
            }
            if (!(target in this._nodes)) {
                throw new Error(`addEdge failed: target node isn't found in nodes. target = ${target}`);
            }
        }
        const edge = {
            source,
            target,
            id,
            relation,
            label,
            metadata,
            directed
        };
        this._edges.push(edge);
    }
    /**
     * Adds multiple edges.
     *
     * @param edges - A collection of JGF edge objects.
     */
    addEdges(edges) {
        if (edges) {
            for (const edge of edges) {
                this.addEdge(edge.source, edge.target, edge.relation, edge.label, edge.metadata, edge.directed, edge.id);
            }
        }
    }
    /**
     * Removes existing graph edges.
     *
     * @param source - Source node id.
     * @param target - Target node id.
     * @param relation - Specific edge relation type to remove. If empty then all edges will be removed, regardless of their relation.
     */
    removeEdges(source, target, relation = '') {
        this._edges = this._edges.filter((currentEdge) => !(currentEdge.source === source &&
            currentEdge.target === target &&
            (relation === '' || currentEdge.relation === relation)));
    }
    /**
     * Get edges between source node and target node, with an optional edge relation.
     *
     * @param source - Node source id.
     * @param target - Node target id.
     * @param relation - Relationship name.
     * @returns List of matching edges.
     * @throws If source or target node don't exist in non partial mode.
     */
    getEdges(source, target, relation = '') {
        if (!this.isPartial) {
            if (!(source in this._nodes)) {
                throw new Error(`A node doesn't exist with id = ${source}`);
            }
            if (!(target in this._nodes)) {
                throw new Error(`A node doesn't exist with id = ${target}`);
            }
        }
        const edges = this._edges.filter((edge) => edge.source === source &&
            edge.target === target &&
            (relation === '' || edge.relation === relation));
        return (0, common_1.cloneObject)(edges);
    }
    /**
     * Returns the graph dimensions - Number of nodes and edges.
     *
     * @returns Graph dimensions.
     */
    get graphDimensions() {
        const dimensions = {
            nodes: 0,
            edges: 0
        };
        dimensions.nodes = Object.keys(this._nodes).length;
        dimensions.edges = this._edges.length;
        return dimensions;
    }
}
exports.JGFGraph = JGFGraph;
