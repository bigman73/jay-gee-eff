import { Validator } from 'jsonschema';
import { GraphMetaData } from './common';
import { JGFEdge } from './jgfEdge';
import { JGFNode } from './jgfNode';
import { Nullable } from './misc';
export declare type GraphJSON = any;
/**
 * A single JGF graph instance, always contained in a parent JGFContainer.
 */
export declare class JGFGraph {
    _validator: Validator;
    _nodes: Record<string, JGFNode>;
    _edges: Array<JGFEdge>;
    _id: string;
    _type: string;
    _label: string;
    _directed: boolean;
    _metadata: GraphMetaData;
    _isPartial: boolean;
    /**
     * Constructor.
     *
     * @param id - Graph unique id.
     * @param type - Graph classification.
     * @param label - A text display for the graph.
     * @param directed - True for a directed graph, false for an undirected graph.
     * @param metadata - Graph meta data attributes.
     */
    constructor(id?: string, type?: string, label?: string, directed?: boolean, metadata?: GraphMetaData);
    /**
     * Loads the graph from a JGF JSON object, for legacy V1 schema.
     *
     * @param graphJson - JGF JSON object.
     */
    loadFromJSONv1(graphJson: GraphJSON): void;
    /**
     * Loads the graph from a JGF JSON object.
     *
     * @param graphJson - JGF JSON object.
     */
    loadFromJSON(graphJson: GraphJSON): void;
    /**
     * Returns the isPartial flag.
     *
     * @returns True if partial graph, otherwise false.
     */
    get isPartial(): boolean;
    /**
     * Set the isPartial flag.
     */
    set isPartial(value: boolean);
    /**
     * Returns the graph id.
     *
     * @returns Graph id.
     */
    get id(): string;
    /**
     * Set the graph id.
     */
    set id(value: string);
    /**
     * Returns the graph type.
     *
     * @returns Graph type.
     */
    get type(): string;
    /**
     * Set the graph type.
     */
    set type(value: string);
    /**
     * Returns the graph label.
     *
     * @returns Graph label.
     */
    get label(): string;
    /**
     * Set the graph label.
     */
    set label(value: string);
    /**
     * Returns the graph meta data.
     *
     * @returns Graph meta data attribute.
     */
    get metadata(): GraphMetaData;
    /**
     * Set the graph meta data.
     */
    set metadata(value: GraphMetaData);
    /**
     * Returns the directed flag.
     *
     * @returns Graph directed flag.
     */
    get directed(): boolean;
    /**
     * Set the graph directed flag.
     */
    set directed(value: boolean);
    /**
     * Returns all nodes.
     *
     * @returns List of all nodes.
     */
    get nodes(): Record<string, JGFNode>;
    /**
     * Returns all edges.
     *
     * @returns List of all edges.
     */
    get edges(): Array<JGFEdge>;
    /**
     * Returns the graph as JGF Json.
     *
     * @returns Graph as JGF JSON object.
     */
    get json(): {
        id: string;
        type: string;
        label: string;
        directed: boolean;
        metadata: any;
        nodes: Record<string, JGFNode>;
        edges: Array<JGFEdge>;
    };
    /**
     * Adds a new node.
     *
     * @param id - Node id.
     * @param label - Node label.
     * @param metadata - Node meta data attributes.
     * @throws If node already exists.
     */
    addNode(id: string, label: string, metadata?: GraphMetaData): void;
    /**
     * Adds multiple nodes, for legacy V1 JGF Schema.
     *
     * @param nodes - A collection of JGF node objects.
     * @throws If node already exists.
     */
    addNodesV1(nodes: Array<JGFNode>): void;
    /**
     * Adds multiple nodes.
     *
     * @param nodes - A collection of JGF node objects.
     * @throws If node already exists.
     */
    addNodes(nodes: Record<string, JGFNode>): void;
    /**
     * Updates an existing node.
     *
     * @param nodeId - Node id.
     * @param label - Updated node label.
     * @param metadata - Updated node meta data attributes.
     * @throws If node doesn't exist.
     */
    updateNode(nodeId: string, label: string, metadata?: Nullable<object>): void;
    /**
     * Removes an existing graph node.
     *
     * @param nodeId - Node unique id.
     * @throws If node doesn't exist.
     */
    removeNode(nodeId: string): void;
    /**
     * Lookup a node by a node id.
     *
     * @param nodeId - Unique node id.
     * @returns Graph node.
     * @throws If node doesn't exist.
     */
    getNode(nodeId: string): JGFNode;
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
    addEdge(source: string, target: string, relation?: string, label?: string, metadata?: Nullable<object>, directed?: boolean, id?: string): void;
    /**
     * Adds multiple edges.
     *
     * @param edges - A collection of JGF edge objects.
     */
    addEdges(edges: Array<JGFEdge>): void;
    /**
     * Removes existing graph edges.
     *
     * @param source - Source node id.
     * @param target - Target node id.
     * @param relation - Specific edge relation type to remove. If empty then all edges will be removed, regardless of their relation.
     */
    removeEdges(source: string, target: string, relation?: string): void;
    /**
     * Get edges between source node and target node, with an optional edge relation.
     *
     * @param source - Node source id.
     * @param target - Node target id.
     * @param relation - Relationship name.
     * @returns List of matching edges.
     * @throws If source or target node don't exist in non partial mode.
     */
    getEdges(source: string, target: string, relation?: string): JGFEdge[];
    /**
     * Returns the graph dimensions - Number of nodes and edges.
     *
     * @returns Graph dimensions.
     */
    get graphDimensions(): {
        nodes: number;
        edges: number;
    };
}
