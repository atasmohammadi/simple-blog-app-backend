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
// Get comments for a post
router.get("/:postId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, comments, postComments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postId = parseInt(req.params.postId);
                return [4 /*yield*/, database_1.db.readDbFile("comments.json")];
            case 1:
                comments = _a.sent();
                postComments = comments.filter(function (comment) { return comment.postId === postId; });
                res.json(postComments);
                return [2 /*return*/];
        }
    });
}); });
// Create a comment
router.post("/", authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, text, comments, newComment;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, postId = _a.postId, text = _a.text;
                if (!postId || !text) {
                    return [2 /*return*/, res.status(400).send({ message: "Post ID and text are required." })];
                }
                return [4 /*yield*/, database_1.db.readDbFile("comments.json")];
            case 1:
                comments = _b.sent();
                newComment = {
                    id: comments.length + 1,
                    postId: postId,
                    text: text,
                    date: new Date().toISOString(),
                    likes: 0,
                    dislikes: 0,
                };
                comments.push(newComment);
                return [4 /*yield*/, database_1.db.writeDbFile("comments.json", comments)];
            case 2:
                _b.sent();
                res.json(newComment);
                return [2 /*return*/];
        }
    });
}); });
// Delete a comment
router.delete("/:id", authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comments, commentIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = parseInt(req.params.id);
                return [4 /*yield*/, database_1.db.readDbFile("comments.json")];
            case 1:
                comments = _a.sent();
                commentIndex = comments.findIndex(function (comment) { return comment.id === commentId; });
                if (commentIndex === -1) {
                    return [2 /*return*/, res.status(404).send({ message: "Comment not found." })];
                }
                comments = comments.filter(function (comment) { return comment.id !== commentId; });
                return [4 /*yield*/, database_1.db.writeDbFile("comments.json", comments)];
            case 2:
                _a.sent();
                res.status(204).send();
                return [2 /*return*/];
        }
    });
}); });
// Like a comment
router.post("/like", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comments, comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.body.commentId;
                return [4 /*yield*/, database_1.db.readDbFile("comments.json")];
            case 1:
                comments = _a.sent();
                comment = comments.find(function (comment) { return comment.id === commentId; });
                if (!comment) {
                    return [2 /*return*/, res.status(404).send({ message: "Comment not found." })];
                }
                comment.likes += 1;
                return [4 /*yield*/, database_1.db.writeDbFile("comments.json", comments)];
            case 2:
                _a.sent();
                res.json({ id: comment.id, likes: comment.likes });
                return [2 /*return*/];
        }
    });
}); });
// Dislike a comment
router.post("/dislike", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comments, comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.body.commentId;
                return [4 /*yield*/, database_1.db.readDbFile("comments.json")];
            case 1:
                comments = _a.sent();
                comment = comments.find(function (comment) { return comment.id === commentId; });
                if (!comment) {
                    return [2 /*return*/, res.status(404).send({ message: "Comment not found." })];
                }
                comment.dislikes += 1;
                return [4 /*yield*/, database_1.db.writeDbFile("comments.json", comments)];
            case 2:
                _a.sent();
                res.json({ id: comment.id, dislikes: comment.dislikes });
                return [2 /*return*/];
        }
    });
}); });
exports.commentRoutes = router;
