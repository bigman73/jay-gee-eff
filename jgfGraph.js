const Validator = require('jsonschema').Validator;
const fsExtra = require('fs-extra');
const check = require('check-types');
const jgfSchema = require('./jgfSchema').jgfSchema;

class JGFGraph {
    constructor(type = '', label = '') {
        this.validator = new Validator();

        this.json = {
            type,
            label,
            nodes: [],
            edges: []
        }
    }

    get nodes() {
        return this.json.nodes;
    }

    get edges() {
        return this.json.edges;
    }

    addNode(id, label, metadata = null) {
        // TODO: validate node structure
        let newNode = {
            id,
            label
        };

        if (check.assigned(metadata)) {
            newNode.metadata = metadata;
        }
        this.json.nodes.push(newNode);
    }

    addEdge(source, target, label = null, metadata = null) {
        // TODO: validate edge structure
        let edge = {
            source,
            target
        };
        if (check.assigned(label)) {
            edge.label = label;
        }
        if (check.assigned(metadata)) {
            edge.metadata = metadata;
        }
        this.json.edges.push(edge);
    }

    // async loadFromFile(filename) {
    //     try {
    //         this.json = await fsExtra.readJson(filename);
    //         let valid = this.validator.validate(this.json, jgfSchema);

    //         if (!valid.valid) {
    //             throw new Error(`Invalid JGF format: ${JSON.stringify(valid.errors)}`)
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}

module.exports = {
    JGFGraph
};