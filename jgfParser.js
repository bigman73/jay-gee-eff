const Validator = require('jsonschema').Validator;
const fsExtra = require('fs-extra');
const check = require('check-types');
const jgfSchema = require('./jgfSchema').jgfSchema;

class JgfParser {
    constructor(type = '', label = '') {
        this.validator = new Validator();

        this.json = {
            graph: {
                type,
                label,
                nodes: [],
                edges: []
            }
        }
    }

    get nodes() {
        return this.json.graph.nodes;
    }

    get edges() {
        return this.json.graph.edges;
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
        this.json.graph.nodes.push(newNode);
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
        this.json.graph.edges.push(edge);
    }

    async loadFromFile(filename) {
        try {
            this.json = await fsExtra.readJson(filename);
            let valid = this.validator.validate(this.json, jgfSchema);

            if (!valid.valid) {
                throw new Error(`Invalid JGF format: ${JSON.stringify(valid.errors)}`)
            }
        } catch (error) {
            console.error(error);
        }
    }

    async saveToFile(filename) {
        try {
            await fsExtra.writeJson(filename, this.json);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = {
    JgfParser
};