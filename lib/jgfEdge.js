"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JGFEdge = void 0;
/**
 * A single graph edge.
 */
class JGFEdge {
    /**
     * Constructor.
     *
     * @param id - Edge id.
     * @param relation - Edge relation between the source and target nodes.
     * @param label - Edge label.
     * @param source - Source node on the edge.
     * @param target - Target node on the edge.
     */
    constructor(id, relation, label, source, target) {
        this.directed = false;
        this.id = id;
        this.relation = relation;
        this.label = label;
        this.source = source;
        this.target = target;
    }
}
exports.JGFEdge = JGFEdge;
