"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var swaggerUi = __importStar(require("swagger-ui-express"));
var swaggerDocument = __importStar(require("./swagger.json"));
var authController_1 = require("./controllers/authController");
var postController_1 = require("./controllers/postController");
var commentController_1 = require("./controllers/commentController");
var userController_1 = require("./controllers/userController");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 80;
// Enable CORS for all requests
var corsOptions = {
    origin: [
        "https://blog-ts-mui-frontend.vercel.app",
        "https://blog-app-eta-gold.vercel.app",
        "*",
    ],
    credentials: true,
    allowedHeaders: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Optional: Specify allowed methods
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
// Define routes
app.get("/", function (req, res) { return res.send("Express on Vercel"); });
app.use("/auth", authController_1.authRoutes);
app.use("/posts", postController_1.postRoutes);
app.use("/comments", commentController_1.commentRoutes);
app.use("/users", userController_1.userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, function () {
    console.log("Server running on http://localhost:".concat(PORT));
});
