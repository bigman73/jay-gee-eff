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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeRemoveFile = exports.cloneObject = void 0;
const fast_clone_1 = __importDefault(require("fast-clone"));
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * Clones an object (using fast clone).
 *
 * @param obj - Source object o clone.
 * @returns Cloned object.
 */
const cloneObject = (obj) => (0, fast_clone_1.default)(obj);
exports.cloneObject = cloneObject;
/**
 * Removes a file only if it exists.
 *
 * @param filename - Filename.
 */
const safeRemoveFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_extra_1.default.existsSync(filename)) {
        yield fs_extra_1.default.remove(filename);
    }
});
exports.safeRemoveFile = safeRemoveFile;
