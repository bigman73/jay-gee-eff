"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JGFEdge = void 0;
/**
 * A single graph edge.
 */
var JGFEdge = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param id - Edge id.
     * @param relation - Edge relation between the source and target nodes.
     * @param label - Edge label.
     * @param source - Source node on the edge.
     * @param target - Target node on the edge.
     */
    function JGFEdge(id, relation, label, source, target) {
        this.directed = false;
        this.metadata = null;
        this.id = id;
        this.relation = relation;
        this.label = label;
        this.source = source;
        this.target = target;
    }
    return JGFEdge;
}());
exports.JGFEdge = JGFEdge;
