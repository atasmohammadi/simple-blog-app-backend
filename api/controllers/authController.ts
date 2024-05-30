import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../models/database";
import { User } from "../types/types";
import { SECRET_KEY } from "../constants";

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

// Helper function to generate JWT token
const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .send({ message: "Username, email, and password are required." });
  }

  const users = await db.collection("users").find({ email }).toArray(); // Use MongoDB find

  const emailExists = users.some((user) => user.email === email);
  if (emailExists) {
    return res.status(400).send({ message: "Email already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: users.length ? users[users.length - 1].id + 1 : 1, // Generate ID
    username,
    email,
    password: hashedPassword,
  };

  try {
    await db.collection("users").insertOne(newUser); // Use MongoDB insert
    res.json(newUser); // Return user without password
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are required." });
  }

  const user = await db.collection("users").findOne({ email }); // Use MongoDB findOne

  if (!user) {
    return res.status(401).send({ message: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid email or password." });
  }

  const token = generateToken(user.id);

  // Return the token and user info (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.json({ ...userWithoutPassword, token });
});

export const authRoutes = router;
