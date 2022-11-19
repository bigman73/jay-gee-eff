import { GraphMetaData } from './common';
/**
 * A single graph node.
 */
export declare class JGFNode {
    id: string;
    label: string;
    metadata?: GraphMetaData;
    /**
     * Constructor.
     *
     * @param id - Node id.
     * @param label - Node label.
     */
    constructor(id: string, label: string);
}
