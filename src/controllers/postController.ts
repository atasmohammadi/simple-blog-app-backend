import express from "express";
import { db } from "../models/database";
import { Post } from "../types/types";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Fetch all posts
router.get("/", async (req, res) => {
  const posts: Post[] = await db.readDbFile("posts.json");
  res.json(posts);
});

// Create a post
router.post("/", authMiddleware, async (req, res) => {
  const { author, title, text } = req.body;
  if (!author || !title || !text) {
    return res
      .status(400)
      .send({ message: "Author, title, and text are required." });
  }

  const posts: Post[] = await db.readDbFile("posts.json");
  const newPost: Post = {
    id: posts.length + 1,
    author,
    title,
    text,
    date: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };
  posts.push(newPost);
  await db.writeDbFile("posts.json", posts);
  res.json(newPost);
});

// Delete a post
router.delete("/:id", authMiddleware, async (req, res) => {
  const postId = parseInt(req.params.id);
  let posts: Post[] = await db.readDbFile("posts.json");
  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex === -1) {
    return res.status(404).send({ message: "Post not found." });
  }
  posts = posts.filter((post) => post.id !== postId);
  await db.writeDbFile("posts.json", posts);
  res.status(204).send();
});

// Like a post
router.post("/like", async (req, res) => {
  const { postId } = req.body;
  let posts: Post[] = await db.readDbFile("posts.json");
  const post = posts.find((post) => post.id === postId);
  if (!post) {
    return res.status(404).send({ message: "Post not found." });
  }
  post.likes += 1;
  await db.writeDbFile("posts.json", posts);
  res.json({ id: post.id, likes: post.likes });
});

// Dislike a post
router.post("/dislike", async (req, res) => {
  const { postId } = req.body;
  let posts: Post[] = await db.readDbFile("posts.json");
  const post = posts.find((post) => post.id === postId);
  if (!post) {
    return res.status(404).send({ message: "Post not found." });
  }
  post.dislikes += 1;
  await db.writeDbFile("posts.json", posts);
  res.json({ id: post.id, dislikes: post.dislikes });
});

export const postRoutes = router;
