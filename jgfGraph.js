const Validator = require('jsonschema').Validator;
const check = require('check-types');

/**
 * A single JGF graph instance, always contained in a parent JGFContainer
 */
class JGFGraph {

    /**
     * Constructor
     * @param {*} type graph classification
     * @param {*} label a text display for the graph
     * @param {*} directed true for a directed graph, false for an undirected graph
     * @param {*} metadata A JSON structure with meta data attributes (or 'properties') for the graph
     */
    constructor(type = '', label = '', directed = true, metadata = {}) {
        this.validator = new Validator();

        this._json = {
            type,
            label,
            directed,
            metadata,
            nodes: [],
            edges: []
        }
    }

    /**
     * Loads the graph from a JGF JSON object
     * @param {*} graphJson JGF JSON object
     */
    loadFromJSON(graphJson) {
        this._json = graphJson;
    }

    /**
     * Returns the graph type
     */
    get type() {
        return this._json.type;
    }

    /**
     * Set the graph type
     */
    set type(value) {
        this._json.type = value;
    }

    /**
     * Returns the graph label
     */
    get label() {
        return this._json.label;
    }

    /**
     * Set the graph label
     */
    set label(value) {
        this._json.label = value;
    }

    /**
     * Returns the graph meta data
     */
    get metadata() {
        return this._json.metadata;
    }

    /**
     * Set the graph meta data
     */
    set metadata(value) {
        this._json.metadata = value;
    }

    /**
     * Returns all nodes
     */
    get nodes() {
        return this._json.nodes;
    }

    /**
     * Returns all edges
     */
    get edges() {
        return this._json.edges;
    }

    /**
     * Adds a new node
     * @param {*} id Node id
     * @param {*} label Node label (AKA 'node type')
     * @param {*} metadata A JSON structure with meta data attributes (or 'properties') of the node
     */
    addNode(id, label, metadata = null) {
        // TODO: validate node structure
        let newNode = {
            id,
            label
        };

        if (check.assigned(metadata)) {
            newNode.metadata = metadata;
        }
        this._json.nodes.push(newNode);
    }

    /**
     * Adds an edge between a source node and a target node
     * @param {*} source Source node id
     * @param {*} target Target node id
     * @param {*} label Edge label (AKA 'relationship type')
     * @param {*} metadata A JSON structure with meta data attributes (or 'properties') of the edge
     */
    addEdge(source, target, label = null, metadata = null) {
        // TODO: validate edge structure (syntax)
        // TODO: validate that edges exists (semantics, use hashmap)
        let edge = {
            source,
            target
        };
        if (check.assigned(label)) {
            edge.label = label;
        }
        if (check.assigned(metadata)) {
            edge.metadata = metadata;
        }
        this._json.edges.push(edge);
    }
}

module.exports = {
    JGFGraph
};