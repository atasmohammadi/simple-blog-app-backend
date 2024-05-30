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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.db = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var DATA_PATH = path_1.default.join(__dirname, "../data");
function ensureDataDirExists() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_extra_1.default.ensureDir(DATA_PATH)];
                case 1:
                    _a.sent(); // Create data directory if it doesn't exist
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    // Ignore errors if directory already exists
                    if (error_1.code !== "EEXIST") {
                        console.error("Error creating data directory:", error_1);
                        throw error_1;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function readDbFile(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureDataDirExists()];
                case 1:
                    _a.sent(); // Ensure data directory exists
                    filePath = path_1.default.join(DATA_PATH, filename);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 8]);
                    return [4 /*yield*/, fs_extra_1.default.readJson(filePath)];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    error_2 = _a.sent();
                    if (!(error_2.code === "ENOENT")) return [3 /*break*/, 6];
                    return [4 /*yield*/, fs_extra_1.default.writeJson(filePath, {}, { spaces: 2 })];
                case 5:
                    _a.sent(); // Create empty file
                    return [2 /*return*/, null];
                case 6:
                    console.error("Error reading the database file: ".concat(filename), error_2);
                    throw error_2;
                case 7: return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function writeDbFile(filename, data) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureDataDirExists()];
                case 1:
                    _a.sent(); // Ensure data directory exists
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    filePath = path_1.default.join(DATA_PATH, filename);
                    return [4 /*yield*/, fs_extra_1.default.writeJson(filePath, data, { spaces: 2 })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error("Error writing the database file: ".concat(filename), error_3);
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.db = {
    readDbFile: readDbFile,
    writeDbFile: writeDbFile,
};
