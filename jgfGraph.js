const Validator = require('jsonschema').Validator;
const check = require('check-types');
const _ = require('lodash');

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
        if (id in this._nodes) {
            throw new Error(`A node already exists with id = ${id}`);
        }

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

    /**
     * Adds multiple nodes
     * @param {*} nodes A collection of JGF node objects
     */
    addNodes(nodes) {
        for (let node of nodes) {
            if (node.id in this._nodes) {
                throw new Error(`A node already exists with id = ${node.id}`);
            }

            this._nodes[node.id] = node;
        }
    }

    /**
     * Removes an existing graph node
     * @param {*} nodeId Node unique id
     */
    removeNode(nodeId) {
        if (!(nodeId in this._nodes)) {
            throw new Error(`A node doesn't exist with id = ${nodeId}`);
        }

        Reflect.deleteProperty(this._nodes, nodeId);
    }

    /**
     * Lookup a node by a node id
     * @param {*} nodeId Unique node id
     */
    getNode(nodeId) {
        if (!(nodeId in this._nodes)) {
            throw new Error(`A node doesn't exist with id = ${nodeId}`);
        }

        return this._nodes[nodeId];
    }

    /**
     * Adds an edge between a source node and a target node
     * @param {*} sourceId Source node id
     * @param {*} targetId Target node id
     * @param {*} label Edge label (AKA 'relationship type')
     * @param {*} metadata A JSON structure with meta data attributes (or 'properties') of the edge
     */
    addEdge(sourceId, targetId, label = null, metadata = null) {
        // TODO: validate edge structure (syntax)
        if (!sourceId) {
            throw new Error('sourceId parameter is not valid');
        }

        if (!targetId) {
            throw new Error('targetId parameter is not valid');
        }

        // Validate that the edge's nodes exist
        if (!(sourceId in this._nodes)) {
            throw new Error(`source node isn't found in nodes. sourceId = ${sourceId}`);
        }

        if (!(targetId in this._nodes)) {
            throw new Error(`target node isn't found in nodes. targetId = ${targetId}`);
        }

        let edge = {
            sourceId,
            targetId
        };
        if (check.assigned(label)) {
            edge.label = label;
        }
        if (check.assigned(metadata)) {
            edge.metadata = metadata;
        }
        this._edges.push(edge);
    }

    /**
     * Adds multiple edges
     * @param {*} edges A collection of JGF edge obejcts
     */
    addEdges(edges) {
        this._edges.push(...edges);
    }

    /**
     * Removes existing graph edges
     * @param {*} sourceId Source node id
     * @param {*} targetId Target node id
     * @param {*} label Specific edge label type to remove. If empty then all edges will be removed, regardless of their label
     */
    removeEdges(sourceId, targetId, label = '') {
        _.remove(this._edges, (currentEdge) => {
            return currentEdge.sourceId === sourceId &&
                currentEdge.targetId === targetId &&
                (label === '' || currentEdge.label === label);
        });
    }

    /**
     * Get edges between source node and target node, with an optional edge label
     * @param {*} sourceId
     * @param {*} targetIf
     * @param {*} label
     */
    getEdges(sourceId, targetId, label = '') {
        if (!(sourceId in this._nodes)) {
            throw new Error(`A node doesn't exist with id = ${sourceId}`);
        }

        if (!(targetId in this._nodes)) {
            throw new Error(`A node doesn't exist with id = ${targetId}`);
        }

        let edges = _.filter(this._edges, (edge) => {
            return edge.sourceId === sourceId &&
                edge.targetId === targetId &&
                (label === '' || edge.label === label);
        });

        return edges;
    }

}

module.exports = {
    JGFGraph
};