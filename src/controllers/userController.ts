import express from "express";
import { db } from "../models/database";
import { User } from "../types/types";

const router = express.Router();

// Get list of all users without passwords
router.get("/", async (req, res) => {
  let users: User[] = await db.readDbFile("users.json");
  // Exclude password from the user objects
  const usersWithoutPasswords = users.map(
    ({ password, ...userWithoutPassword }) => userWithoutPassword
  );
  res.json(usersWithoutPasswords);
});

export const userRoutes = router;
