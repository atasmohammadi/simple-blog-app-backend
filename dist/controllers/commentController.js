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
exports.commentRoutes = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../models/database");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = express_1.default.Router();
// Ensure comments collection exists before using it
function ensureCommentsCollection() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!database_1.db.collection("comments")) return [3 /*break*/, 2];
                    return [4 /*yield*/, database_1.db.createCollection("comments")];
                case 1:
                    _a.sent(); // Create collection if it doesn't exist
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ensureCommentsCollection()];
            case 1:
                _a.sent(); // Call on startup
                return [2 /*return*/];
        }
    });
}); })();
// Get comments for a post
router.get("/:postId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, comments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postId = parseInt(req.params.postId);
                return [4 /*yield*/, database_1.db.collection("comments").find({ postId: postId }).toArray()];
            case 1:
                comments = _a.sent();
                res.json(comments);
                return [2 /*return*/];
        }
    });
}); });
// Create a comment
router.post("/", authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, text, newComment, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, postId = _a.postId, text = _a.text;
                if (!postId || !text) {
                    return [2 /*return*/, res.status(400).send({ message: "Post ID and text are required." })];
                }
                _b = {};
                return [4 /*yield*/, database_1.db.collection("comments").countDocuments({})];
            case 1:
                newComment = (_b.id = (_c.sent()) + 1,
                    _b.postId = postId,
                    _b.text = text,
                    _b.date = new Date().toISOString(),
                    _b.likes = 0,
                    _b.dislikes = 0,
                    _b);
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, database_1.db.collection("comments").insertOne(newComment)];
            case 3:
                _c.sent(); // Use MongoDB insertOne
                res.json(newComment);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                console.error("Error creating comment:", error_1);
                res.status(500).send({ message: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Delete a comment
router.delete("/:id", authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, deleteResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = parseInt(req.params.id);
                return [4 /*yield*/, database_1.db
                        .collection("comments")
                        .deleteOne({ id: commentId })];
            case 1:
                deleteResult = _a.sent();
                if (deleteResult.deletedCount === 0) {
                    return [2 /*return*/, res.status(404).send({ message: "Comment not found." })];
                }
                res.status(204).send();
                return [2 /*return*/];
        }
    });
}); });
// Like a comment
router.post("/like", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, updateResult, comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.body.commentId;
                return [4 /*yield*/, database_1.db.collection("comments").updateOne({ id: commentId }, { $inc: { likes: 1 } } // Use MongoDB update with increment
                    )];
            case 1:
                updateResult = _a.sent();
                if (updateResult.modifiedCount === 0) {
                    return [2 /*return*/, res.status(404).send({ message: "Comment not found." })];
                }
                return [4 /*yield*/, database_1.db.collection("comments").findOne({ id: commentId })];
            case 2:
                comment = _a.sent();
                res.json({ id: comment === null || comment === void 0 ? void 0 : comment.id, likes: comment === null || comment === void 0 ? void 0 : comment.likes });
                return [2 /*return*/];
        }
    });
}); });
// Dislike a comment
router.post("/dislike", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, updateResult, comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.body.commentId;
                return [4 /*yield*/, database_1.db.collection("comments").updateOne({ id: commentId }, { $inc: { dislikes: 1 } } // Use MongoDB update with increment
                    )];
            case 1:
                updateResult = _a.sent();
                if (updateResult.modifiedCount === 0) {
                    return [2 /*return*/, res.status(404).send({ message: "Comment not found." })];
                }
                return [4 /*yield*/, database_1.db.collection("comments").findOne({ id: commentId })];
            case 2:
                comment = _a.sent();
                res.json({ id: comment === null || comment === void 0 ? void 0 : comment.id, dislikes: comment === null || comment === void 0 ? void 0 : comment.dislikes });
                return [2 /*return*/];
        }
    });
}); });
exports.commentRoutes = router;
