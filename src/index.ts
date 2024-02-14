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
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());
app.use(bodyParser.json());

// Define routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
