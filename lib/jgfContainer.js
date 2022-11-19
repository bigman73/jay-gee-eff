"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JGFContainer = void 0;
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var jsonschema_1 = require("jsonschema");
var jgfGraph_1 = require("./jgfGraph");
var misc_1 = require("./misc");
var jgfSchemaV1 = null;
var jgfSchemaV2 = null;
/**
 * Reads the JGF Schema V1 from a JSON file.
 */
var readJGFSchemaV1 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var jgfSchemaFilename;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jgfSchemaFilename = path_1.default.join(path_1.default.dirname(__filename), 'jgfSchemaV1.json');
                return [4 /*yield*/, fs_extra_1.default.readJSON(jgfSchemaFilename)];
            case 1:
                jgfSchemaV1 = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Reads the JGF Schema V2 from a JSON file.
 */
var readJGFSchemaV2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var jgfSchemaFilename;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jgfSchemaFilename = path_1.default.join(path_1.default.dirname(__filename), 'jgfSchemaV2.json');
                return [4 /*yield*/, fs_extra_1.default.readJSON(jgfSchemaFilename)];
            case 1:
                jgfSchemaV2 = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * JGF Container (main class) of zero or more JGF graphs.
 */
var JGFContainer = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param singleGraph - True for single-graph mode, false for multi-graph mode.
     */
    function JGFContainer(singleGraph) {
        if (singleGraph === void 0) { singleGraph = true; }
        this._schemaValidator = new jsonschema_1.Validator();
        this._graphs = [];
        this.isSingleGraph = singleGraph;
        if (singleGraph) {
            this.addEmptyGraph();
        }
    }
    Object.defineProperty(JGFContainer.prototype, "graphs", {
        /**
         * Returns all graphs, in Multi-Graph mode.
         *
         * @returns List of graphs.
         */
        get: function () {
            if (this.isSingleGraph) {
                throw new Error('Cannot call graphs() in Single-Graph mode');
            }
            return this._graphs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFContainer.prototype, "graph", {
        /**
         * Returns the graph, in Single-Graph mode.
         *
         * @returns The single graph.
         */
        get: function () {
            if (!this.isSingleGraph) {
                throw new Error('Cannot call graph() in Multi-Graph mode');
            }
            return this._graphs[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JGFContainer.prototype, "isMultiGraph", {
        /**
         * Multi-Graph mode flag.
         *
         * @returns True if the container is in Multi-Graph mode, otherwise false.
         */
        get: function () {
            return !this.isSingleGraph;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds an empty graph.
     *
     * @returns Empty graph.
     */
    JGFContainer.prototype.addEmptyGraph = function () {
        var graph = new jgfGraph_1.JGFGraph();
        this._graphs.push(graph);
        return graph;
    };
    /**
     * Loads a JGF V1 file into memory.
     * Used for old V1 files.
     *
     * @param filename - JGF filename.
     */
    JGFContainer.prototype.loadFromFileV1 = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, valid, singleGraph, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!!jgfSchemaV1) return [3 /*break*/, 2];
                        return [4 /*yield*/, readJGFSchemaV1()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, fs_extra_1.default.readJson(filename)];
                    case 3:
                        _a.json = _b.sent();
                        valid = this._schemaValidator.validate(this.json, jgfSchemaV1);
                        if (!valid.valid) {
                            throw new Error("Invalid JGF format. Validation Errors: ".concat(JSON.stringify(valid.errors)));
                        }
                        this.isSingleGraph = Boolean(this.json.graph);
                        console.debug("loadFromFile, isSingleGraph: ".concat(this.isSingleGraph));
                        if (this.isSingleGraph) {
                            singleGraph = new jgfGraph_1.JGFGraph();
                            singleGraph.loadFromJSONv1(this.json.graph);
                            this._graphs = [singleGraph];
                        }
                        else {
                            this._graphs = [];
                            this.json.graphs.forEach(function (graphJson) {
                                var graphInstance = new jgfGraph_1.JGFGraph();
                                graphInstance.loadFromJSONv1(graphJson);
                                _this._graphs.push(graphInstance);
                            });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error(error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Loads a JGF file V2 into memory.
     *
     * @param filename - JGF filename.
     */
    JGFContainer.prototype.loadFromFile = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, valid, singleGraph;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!jgfSchemaV2) return [3 /*break*/, 2];
                        return [4 /*yield*/, readJGFSchemaV2()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, fs_extra_1.default.readJson(filename)];
                    case 3:
                        _a.json = _b.sent();
                        valid = this._schemaValidator.validate(this.json, jgfSchemaV2);
                        if (!valid.valid) {
                            throw new Error("Invalid JGF format. Validation Errors: ".concat(JSON.stringify(valid.errors)));
                        }
                        this.isSingleGraph = Boolean(this.json.graph);
                        if (this.isSingleGraph) {
                            singleGraph = new jgfGraph_1.JGFGraph();
                            singleGraph.loadFromJSON(this.json.graph);
                            this._graphs = [singleGraph];
                        }
                        else {
                            this._graphs = [];
                            this.json.graphs.forEach(function (graphJson) {
                                var graphInstance = new jgfGraph_1.JGFGraph();
                                graphInstance.loadFromJSON(graphJson);
                                _this._graphs.push(graphInstance);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Loads multiple partial graph files into a single merged in-memory graph.
     *
     * @param filenameWildcard - Pattern to use for partial JGF files.
     * @param type - Graph type.
     * @param label - Graph label.
     */
    JGFContainer.prototype.loadFromPartialFiles = function (filenameWildcard, type, label) {
        if (type === void 0) { type = 'JGFGraph'; }
        if (label === void 0) { label = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var mainGraph, files, firstTime, allEdgesGroups, _i, files_1, filename, partialJson, valid, _a, allEdgesGroups_1, edgesGroup, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        if (!!jgfSchemaV2) return [3 /*break*/, 2];
                        return [4 /*yield*/, readJGFSchemaV2()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        this._graphs = [];
                        this.isSingleGraph = true;
                        mainGraph = this.addEmptyGraph();
                        mainGraph.type = type;
                        mainGraph.label = label;
                        return [4 /*yield*/, (0, misc_1.getMatchingFiles)(filenameWildcard)];
                    case 3:
                        files = _b.sent();
                        firstTime = true;
                        allEdgesGroups = [];
                        _i = 0, files_1 = files;
                        _b.label = 4;
                    case 4:
                        if (!(_i < files_1.length)) return [3 /*break*/, 7];
                        filename = files_1[_i];
                        console.debug("Loading partial graph file: ".concat(filename));
                        return [4 /*yield*/, fs_extra_1.default.readJson(filename)];
                    case 5:
                        partialJson = _b.sent();
                        valid = this._schemaValidator.validate(this.json, jgfSchemaV2);
                        if (!valid) {
                            throw new Error("Invalid graph, filename = ".concat(filename));
                        }
                        if (firstTime) {
                            mainGraph.directed = partialJson.graph.directed;
                            // TODO: Merge all meta data sections of partial graphs into one
                            mainGraph.metadata = partialJson.graph.metadata;
                            // Remove is partial.
                            //   Merge main graph is always full (non-partial) by definition
                            if (mainGraph.metadata && mainGraph.metadata.isPartial) {
                                Reflect.deleteProperty(mainGraph.metadata, 'isPartial');
                            }
                            firstTime = false;
                        }
                        // Add its nodes to the main graph
                        if (partialJson.graph.nodes && Object.keys(partialJson.graph.nodes).length > 0) {
                            mainGraph.addNodes(partialJson.graph.nodes);
                        }
                        // TODO: Test that a partial node-less/edge only graph
                        //   passes the schema and can be save and loaded
                        // Store edges for the 2nd pass
                        if (partialJson.graph.edges && partialJson.graph.edges.length > 0) {
                            allEdgesGroups.push(partialJson.graph.edges);
                        }
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        // Second pass - now that all nodes are added to the graph, add the edges
                        for (_a = 0, allEdgesGroups_1 = allEdgesGroups; _a < allEdgesGroups_1.length; _a++) {
                            edgesGroup = allEdgesGroups_1[_a];
                            mainGraph.addEdges(edgesGroup);
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _b.sent();
                        console.error(error_2);
                        throw error_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Saves the in memory JSON graph into a JGF file.
     *
     * @param filename - JGF filename.
     * @param prettyPrint - True to output a easy to read JSON, false for a compact JSON.
     */
    JGFContainer.prototype.saveToFile = function (filename, prettyPrint) {
        if (prettyPrint === void 0) { prettyPrint = false; }
        return __awaiter(this, void 0, void 0, function () {
            var containerJson_1, options, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        containerJson_1 = {};
                        if (this.isSingleGraph) {
                            containerJson_1.graph = this._graphs[0].json;
                        }
                        else {
                            containerJson_1.graphs = [];
                            this._graphs.forEach(function (graph) {
                                containerJson_1.graphs.push(graph.json);
                            });
                        }
                        options = {};
                        if (prettyPrint) {
                            options.spaces = 4;
                        }
                        return [4 /*yield*/, fs_extra_1.default.writeJson(filename, containerJson_1, options)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Failed saving JGF to file ".concat(filename, ", error: ").concat(error_3));
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return JGFContainer;
}());
exports.JGFContainer = JGFContainer;
