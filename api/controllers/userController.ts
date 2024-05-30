import express from "express";
import { db } from "../models/database";

const router = express.Router();

// Ensure users collection exists before using it
async function ensureUsersCollection() {
  if (!db.collection("users")) {
    await db.createCollection("users"); // Create collection if it doesn't exist
  }
}

(async () => {
  await ensureUsersCollection(); // Call on startup
})();

// Get list of all users without passwords (consider adding filtering/pagination later)
router.get("/", async (req, res) => {
  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray(); // Use MongoDB find with projection to exclude password
  res.json(users);
});

// Get a user by ID (without password)
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await db
    .collection("users")
    .findOne({ id: userId }, { projection: { password: 0 } }); // Use MongoDB findOne with projection
  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }
  res.json(user);
});

export const userRoutes = router;
