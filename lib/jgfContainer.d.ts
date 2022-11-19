import { Validator } from 'jsonschema';
import { GraphJSON, JGFGraph } from './jgfGraph';
/**
 * JGF Container (main class) of zero or more JGF graphs.
 */
export declare class JGFContainer {
    _schemaValidator: Validator;
    _graphs: Array<JGFGraph>;
    isSingleGraph: boolean;
    json: GraphJSON;
    /**
     * Constructor.
     *
     * @param singleGraph - True for single-graph mode, false for multi-graph mode.
     */
    constructor(singleGraph?: boolean);
    /**
     * Returns all graphs, in Multi-Graph mode.
     *
     * @returns List of graphs.
     */
    get graphs(): Array<JGFGraph>;
    /**
     * Returns the graph, in Single-Graph mode.
     *
     * @returns The single graph.
     */
    get graph(): JGFGraph;
    /**
     * Multi-Graph mode flag.
     *
     * @returns True if the container is in Multi-Graph mode, otherwise false.
     */
    get isMultiGraph(): boolean;
    /**
     * Adds an empty graph.
     *
     * @returns Empty graph.
     */
    addEmptyGraph(): JGFGraph;
    /**
     * Loads a JGF V1 file into memory.
     * Used for old V1 files.
     *
     * @param filename - JGF filename.
     */
    loadFromFileV1(filename: string): Promise<void>;
    /**
     * Loads a JGF file V2 into memory.
     *
     * @param filename - JGF filename.
     */
    loadFromFile(filename: string): Promise<void>;
    /**
     * Loads multiple partial graph files into a single merged in-memory graph.
     *
     * @param filenameWildcard - Pattern to use for partial JGF files.
     * @param type - Graph type.
     * @param label - Graph label.
     */
    loadFromPartialFiles(filenameWildcard: string, type?: string, label?: string): Promise<void>;
    /**
     * Saves the in memory JSON graph into a JGF file.
     *
     * @param filename - JGF filename.
     * @param prettyPrint - True to output a easy to read JSON, false for a compact JSON.
     */
    saveToFile(filename: string, prettyPrint?: boolean): Promise<void>;
}
