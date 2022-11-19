import { GraphMetaData } from './common';
/**
 * A single graph edge.
 */
export declare class JGFEdge {
    id?: string;
    relation?: string;
    label?: string;
    source: string;
    target: string;
    directed?: boolean | undefined;
    metadata: GraphMetaData;
    /**
     * Constructor.
     *
     * @param id - Edge id.
     * @param relation - Edge relation between the source and target nodes.
     * @param label - Edge label.
     * @param source - Source node on the edge.
     * @param target - Target node on the edge.
     */
    constructor(id: string, relation: string, label: string, source: string, target: string);
}
