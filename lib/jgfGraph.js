"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JGFGraph = void 0;
/* eslint-disable max-lines */
var check_types_1 = __importDefault(require("check-types"));
var jsonschema_1 = require("jsonschema");
// FIXME Use specific lodash, not the entire package
var lodash_1 = __importDefault(require("lodash"));
var common_1 = require("./common");
var jgfNode_1 = require("./jgfNode");
/**
 * A single JGF graph instance, always contained in a parent JGFContainer.
 */
var JGFGraph = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param id - Graph unique id.
     * @param type - Graph classification.
     * @param label - A text display for the graph.
     * @param directed - True for a directed graph, false for an undirected graph.
     * @param metadata - Graph meta data attributes.
     */
    function JGFGraph(id, type, label, directed, metadata) {
        if (id === void 0) { id = ''; }
        if (type === void 0) { type = ''; }
        if (label === void 0) { label = ''; }
        if (directed === void 0) { directed = true; }
        if (metadata === void 0) { metadata = null; }
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
     * Loads the graph from a JGF JSON object, for legacy V1 schema.
     *
     * @param graphJson - JGF JSON object.
     */
    JGFGraph.prototype.loadFromJSONv1 = function (graphJson) {
        this._id = graphJson.id;
        this._type = graphJson.type;
        this._label = graphJson.label;
        this._directed = graphJson.directed || true;
        this._metadata = graphJson.metadata;
        this._nodes = {};
        this._edges = [];
        this.addNodesV1(graphJson.nodes);
        this.addEdges(graphJson.edges);
    };
    /**
     * Loads the graph from a JGF JSON object.
     *
     * @param graphJson - JGF JSON object.
     */
    JGFGraph.prototype.loadFromJSON = function (graphJson) {
        this._id = graphJson.id;
        this._type = graphJson.type;
        this._label = graphJson.label;
        this._directed = graphJson.directed || true;
        this._metadata = graphJson.metadata;
        this._nodes = {};
        this._edges = [];
        this.addNodes(graphJson.nodes);
        this.addEdges(graphJson.edges);
    };
    Object.defineProperty(JGFGraph.prototype, "isPartial", {
        /**
         * Returns the isPartial flag.
         *
         * @returns True if partial graph, otherwise false.
         */
        get: function () {
            return this._isPartial;
        },
        /**
         * Set the isPartial flag.
         */
        set: function (value) {
            this._isPartial = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "id", {
        /**
         * Returns the graph id.
         *
         * @returns Graph id.
         */
        get: function () {
            return this._id;
        },
        /**
         * Set the graph id.
         */
        set: function (value) {
            this._id = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "type", {
        /**
         * Returns the graph type.
         *
         * @returns Graph type.
         */
        get: function () {
            return this._type;
        },
        /**
         * Set the graph type.
         */
        set: function (value) {
            this._type = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "label", {
        /**
         * Returns the graph label.
         *
         * @returns Graph label.
         */
        get: function () {
            return this._label;
        },
        /**
         * Set the graph label.
         */
        set: function (value) {
            this._label = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "metadata", {
        /**
         * Returns the graph meta data.
         *
         * @returns Graph meta data attribute.
         */
        get: function () {
            return this._metadata;
        },
        /**
         * Set the graph meta data.
         */
        set: function (value) {
            this._metadata = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "directed", {
        /**
         * Returns the directed flag.
         *
         * @returns Graph directed flag.
         */
        get: function () {
            return this._directed;
        },
        /**
         * Set the graph directed flag.
         */
        set: function (value) {
            this._directed = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "nodes", {
        /**
         * Returns all nodes.
         *
         * @returns List of all nodes.
         */
        get: function () {
            return (0, common_1.cloneObject)(this._nodes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "edges", {
        /**
         * Returns all edges.
         *
         * @returns List of all edges.
         */
        get: function () {
            return (0, common_1.cloneObject)(this._edges);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFGraph.prototype, "json", {
        /**
         * Returns the graph as JGF Json.
         *
         * @returns Graph as JGF JSON object.
         */
        get: function () {
            var json = {
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
            if (lodash_1.default.isEmpty(json.metadata)) {
                Reflect.deleteProperty(json, 'metadata');
            }
            if (check_types_1.default.assigned(this._nodes) && Object.keys(this._nodes).length > 0) {
                json.nodes = this._nodes;
            }
            if (check_types_1.default.assigned(this._edges) && this._edges.length > 0) {
                json.edges = this._edges;
            }
            return (0, common_1.cloneObject)(json);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a new node.
     *
     * @param id - Node id.
     * @param label - Node label.
     * @param metadata - Node meta data attributes.
     * @throws If node already exists.
     */
    JGFGraph.prototype.addNode = function (id, label, metadata) {
        if (metadata === void 0) { metadata = null; }
        if (id in this._nodes) {
            throw new Error("A node already exists with id = ".concat(id));
        }
        var newNode = new jgfNode_1.JGFNode(id, label);
        if (check_types_1.default.assigned(metadata)) {
            newNode.metadata = metadata;
        }
        this._nodes[id] = newNode;
    };
    /**
     * Adds multiple nodes, for legacy V1 JGF Schema.
     *
     * @param nodes - A collection of JGF node objects.
     * @throws If node already exists.
     */
    JGFGraph.prototype.addNodesV1 = function (nodes) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node.id in this._nodes) {
                throw new Error("A node already exists with id = ".concat(node.id));
            }
            this._nodes[node.id] = node;
        }
    };
    /**
     * Adds multiple nodes.
     *
     * @param nodes - A collection of JGF node objects.
     * @throws If node already exists.
     */
    JGFGraph.prototype.addNodes = function (nodes) {
        for (var _i = 0, _a = Object.entries(nodes); _i < _a.length; _i++) {
            var _b = _a[_i], nodeId = _b[0], node = _b[1];
            if (nodeId in this._nodes) {
                throw new Error("A node already exists with id = ".concat(nodeId));
            }
            this._nodes[nodeId] = node;
        }
    };
    /**
     * Updates an existing node.
     *
     * @param nodeId - Node id.
     * @param label - Updated node label.
     * @param metadata - Updated node meta data attributes.
     * @throws If node doesn't exist.
     */
    JGFGraph.prototype.updateNode = function (nodeId, label, metadata) {
        if (metadata === void 0) { metadata = null; }
        if (!(nodeId in this._nodes)) {
            throw new Error("Can't update node. A node doesn't exist with id = ".concat(nodeId));
        }
        var node = this._nodes[nodeId];
        if (check_types_1.default.assigned(label)) {
            node.label = label;
        }
        if (check_types_1.default.assigned(metadata)) {
            node.metadata = metadata;
        }
    };
    /**
     * Removes an existing graph node.
     *
     * @param nodeId - Node unique id.
     * @throws If node doesn't exist.
     */
    JGFGraph.prototype.removeNode = function (nodeId) {
        if (!(nodeId in this._nodes)) {
            throw new Error("A node doesn't exist with id = ".concat(nodeId));
        }
        Reflect.deleteProperty(this._nodes, nodeId);
    };
    /**
     * Lookup a node by a node id.
     *
     * @param nodeId - Unique node id.
     * @returns Graph node.
     * @throws If node doesn't exist.
     */
    JGFGraph.prototype.getNode = function (nodeId) {
        if (!(nodeId in this._nodes)) {
            throw new Error("A node doesn't exist with id = ".concat(nodeId));
        }
        return (0, common_1.cloneObject)(this._nodes[nodeId]);
    };
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
    JGFGraph.prototype.addEdge = function (source, target, relation, label, metadata, directed, id) {
        if (metadata === void 0) { metadata = null; }
        if (!source) {
            throw new Error('addEdge failed: source parameter is not valid');
        }
        if (!target) {
            throw new Error('addEdge failed: target parameter is not valid');
        }
        if (!this._isPartial) {
            // Validate that the edge's nodes exist
            if (!(source in this._nodes)) {
                throw new Error("addEdge failed: source node isn't found in nodes. source = ".concat(source));
            }
            if (!(target in this._nodes)) {
                throw new Error("addEdge failed: target node isn't found in nodes. target = ".concat(target));
            }
        }
        var edge = {
            source: source,
            target: target,
            id: id,
            relation: relation,
            label: label,
            metadata: metadata,
            directed: directed
        };
        this._edges.push(edge);
    };
    /**
     * Adds multiple edges.
     *
     * @param edges - A collection of JGF edge objects.
     */
    JGFGraph.prototype.addEdges = function (edges) {
        if (edges) {
            for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
                var edge = edges_1[_i];
                this.addEdge(edge.source, edge.target, edge.relation, edge.label, edge.metadata, edge.directed, edge.id);
            }
        }
    };
    /**
     * Removes existing graph edges.
     *
     * @param source - Source node id.
     * @param target - Target node id.
     * @param relation - Specific edge relation type to remove. If empty then all edges will be removed, regardless of their relation.
     */
    JGFGraph.prototype.removeEdges = function (source, target, relation) {
        if (relation === void 0) { relation = ''; }
        lodash_1.default.remove(this._edges, function (currentEdge) {
            return currentEdge.source === source &&
                currentEdge.target === target &&
                (relation === '' || currentEdge.relation === relation);
        });
    };
    /**
     * Get edges between source node and target node, with an optional edge relation.
     *
     * @param source - Node source id.
     * @param target - Node target id.
     * @param relation - Relationship name.
     * @returns List of matching edges.
     * @throws If source or target node don't exist in non partial mode.
     */
    JGFGraph.prototype.getEdges = function (source, target, relation) {
        if (relation === void 0) { relation = ''; }
        if (!this.isPartial) {
            if (!(source in this._nodes)) {
                throw new Error("A node doesn't exist with id = ".concat(source));
            }
            if (!(target in this._nodes)) {
                throw new Error("A node doesn't exist with id = ".concat(target));
            }
        }
        var edges = lodash_1.default.filter(this._edges, function (edge) {
            return edge.source === source &&
                edge.target === target &&
                (relation === '' || edge.relation === relation);
        });
        return (0, common_1.cloneObject)(edges);
    };
    Object.defineProperty(JGFGraph.prototype, "graphDimensions", {
        /**
         * Returns the graph dimensions - Number of nodes and edges.
         *
         * @returns Graph dimensions.
         */
        get: function () {
            var dimensions = {
                nodes: 0,
                edges: 0
            };
            dimensions.nodes = Object.keys(this._nodes).length;
            dimensions.edges = this._edges.length;
            return dimensions;
        },
        enumerable: false,
        configurable: true
    });
    return JGFGraph;
}());
exports.JGFGraph = JGFGraph;
