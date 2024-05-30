import express from "express";
import { db } from "../models/database";
import { Post } from "../types/types";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Ensure posts collection exists before using it
async function ensurePostsCollection() {
  if (!db.collection("posts")) {
    await db.createCollection("posts"); // Create collection if it doesn't exist
  }
}

(async () => {
  await ensurePostsCollection(); // Call on startup
})();

// Fetch all posts
router.get("/", async (req, res) => {
  const posts = await db.collection("posts").find().toArray(); // Use MongoDB find
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

  const newPost: Post = {
    id: (await db.collection("posts").countDocuments({})) + 1, // Generate ID using count
    author,
    title,
    text,
    date: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };

  try {
    await db.collection("posts").insertOne(newPost); // Use MongoDB insertOne
    res.json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

// Delete a post
router.delete("/:id", authMiddleware, async (req, res) => {
  const postId = parseInt(req.params.id);
  const deleteResult = await db.collection("posts").deleteOne({ id: postId }); // Use MongoDB deleteOne

  if (deleteResult.deletedCount === 0) {
    return res.status(404).send({ message: "Post not found." });
  }

  res.status(204).send();
});

// Like a post
router.post("/like", async (req, res) => {
  const { postId } = req.body;

  const updateResult = await db.collection("posts").updateOne(
    { id: postId },
    { $inc: { likes: 1 } } // Use MongoDB update with increment
  );

  if (updateResult.modifiedCount === 0) {
    return res.status(404).send({ message: "Post not found." });
  }

  const post = await db.collection("posts").findOne({ id: postId }); // Fetch updated post
  res.json({ id: post?.id, likes: post?.likes });
});

// Dislike a post
router.post("/dislike", async (req, res) => {
  const { postId } = req.body;

  const updateResult = await db.collection("posts").updateOne(
    { id: postId },
    { $inc: { dislikes: 1 } } // Use MongoDB update with increment
  );

  if (updateResult.modifiedCount === 0) {
    return res.status(404).send({ message: "Post not found." });
  }

  const post = await db.collection("posts").findOne({ id: postId }); // Fetch updated post
  res.json({ id: post?.id, dislikes: post?.dislikes });
});

export const postRoutes = router;
