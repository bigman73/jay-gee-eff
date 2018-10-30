const Validator = require('jsonschema').Validator;
const fsExtra = require('fs-extra');
const _ = require('lodash');
//const jgfSchema = require('./jgfSchema').jgfSchema;
const { JGFGraph } = require('./jgfGraph');

class JGFContainer {
    constructor(singleGraph = true) {
        this.validator = new Validator();
        this._graphs = [];
        this.singleGraph = singleGraph;

        if (singleGraph) {
            this.addEmptyGraph();
        }
    }

    get graphs() {
        if (this.singleGraph) {
            throw new Error('Cannot call graphs() in Single-Graph mode')
        }

        return this._graphs;
    }

    get graph() {
        if (!this.singleGraph) {
            throw new Error('Cannot call graph() in Multi-Graph mode')

        }

        return this._graphs[0];
    }

    addEmptyGraph() {
        let graph = new JGFGraph();
        this._graphs.push(graph);

        return graph;
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

    async saveToFile(filename) {
        try {
            let containerJson = {};
            if (this.singleGraph) {
                containerJson.graph = this._graphs[0].json;
            } else {
                containerJson.graphs = [];
                this._graphs.forEach((graph) => {
                    containerJson.graphs.push(graph);
                });
            }

            await fsExtra.writeJson(filename, containerJson);
        } catch (error) {
            console.error(`Failed saving JGF to file ${filename}, error: ${error}`);
            throw error;
        }
    }
}

module.exports = {
    JGFContainer
};