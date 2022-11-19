"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JGFNode = void 0;
/**
 * A single graph node.
 */
var JGFNode = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param id - Node id.
     * @param label - Node label.
     */
    function JGFNode(id, label) {
        this.id = id;
        // this.name = name
        this.label = label;
    }
    return JGFNode;
}());
exports.JGFNode = JGFNode;
