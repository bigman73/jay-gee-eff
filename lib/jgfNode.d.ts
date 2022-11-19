import { GraphMetaData } from './common';
/**
 * A single graph node.
 */
export declare class JGFNode {
    label: string;
    metadata?: GraphMetaData;
    /**
     * Constructor.
     *
     * @param label - Node label.
     */
    constructor(label: string);
}
