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
    constructor(type = '', label = '', directed = true, metadata = null) {
        this.validator = new Validator();

        this._nodes = {};
        this._edges = [];

        this._type = type;
        this._label = label;
        this._directed = directed;
        this._metadata = metadata;
    }

    /**
     * Loads the graph from a JGF JSON object
     * @param {*} graphJson JGF JSON object
     */
    loadFromJSON(graphJson) {
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
     * Returns the graph type
     */
    get type() {
        return this._type;
    }

    /**
     * Set the graph type
     */
    set type(value) {
        this._type = value;
    }

    /**
     * Returns the graph label
     */
    get label() {
        return this._label;
    }

    /**
     * Set the graph label
     */
    set label(value) {
        this._label = value;
    }

    /**
     * Returns the graph meta data
     */
    get metadata() {
        return this._metadata;
    }

    /**
     * Set the graph meta data
     */
    set metadata(value) {
        this._metadata = value;
    }

    /**
     * Returns all nodes
     */
    get nodes() {
        return Object.values(this._nodes);
    }

    /**
     * Returns all edges
     */
    get edges() {
        return this._edges;
    }

    /**
     * Returns the JGF Json
     */
    get json() {
        let json = {
            type: this._type,
            label: this._label,
            directed: this._directed,
            nodes: [],
            edges: []
        };

        if (check.assigned(this._metadata)) {
            json.metadata = this._metadata;
        }

        if (check.assigned(this._nodes) && Object.keys(this._nodes).length > 0) {
            json.nodes = Object.values(this._nodes);
        }

        if (check.assigned(this._edges) && this._edges.length > 0) {
            json.edges = this._edges;
        }

        return json;
    }

    /**
     * Adds a new node
     * @param {*} id Node id
     * @param {*} label Node label
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

        this._nodes[newNode.id] = newNode;
    }

    addNodes(nodes) {
        for (let node of nodes) {
            this._nodes[node.id] = node;
        }
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
        this._edges.push(edge);
    }

    addEdges(edges) {
        this._edges.push(...edges);
    }
}

module.exports = {
    JGFGraph
};