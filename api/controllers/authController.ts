import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../models/database";
import { User } from "../types/types";
import { SECRET_KEY } from "../constants";

const router = express.Router();

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

  const users: User[] = await db.readDbFile("users.json");

  const emailExists = users.some((user) => user.email === email);
  if (emailExists) {
    return res.status(400).send({ message: "Email already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
  };
  users.push(newUser);
  await db.writeDbFile("users.json", users);

  // Do not return password
  const { password: _, ...userWithoutPassword } = newUser;
  res.json(userWithoutPassword);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are required." });
  }

  const users: User[] = await db.readDbFile("users.json");
  const user = users.find((user) => user.email === email);

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
