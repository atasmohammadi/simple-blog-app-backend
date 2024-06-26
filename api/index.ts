require("dotenv").config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import { authRoutes } from "./controllers/authController";
import { postRoutes } from "./controllers/postController";
import { commentRoutes } from "./controllers/commentController";
import { userRoutes } from "./controllers/userController";

const app = express();
const PORT = process.env.PORT || 80;

// Enable CORS for all requests
const corsOptions = {
  origin: [
    "https://blog-ts-mui-frontend.vercel.app",
    "https://blog-app-eta-gold.vercel.app",
    "*",
  ], // Allow all origins
  credentials: true, // Allow credentials
  allowedHeaders: "*", // Allow any headers
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Optional: Specify allowed methods
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json());

// Define routes
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
