"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var constants_1 = require("../constants");
var authMiddleware = function (req, res, next) {
    // Check for the token in the authorization header
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .send({ message: "Authentication token is required." });
    }
    // Extract the token
    var token = authHeader.split(" ")[1];
    try {
        // Verify the token
        var decoded = jsonwebtoken_1.default.verify(token, constants_1.SECRET_KEY);
        // Add the user's ID to the request if needed
        req.user = { id: decoded.id };
        next();
    }
    catch (error) {
        return res.status(401).send({ message: "Invalid or expired token." });
    }
};
exports.authMiddleware = authMiddleware;
