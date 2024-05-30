import express from "express";
import { db } from "../models/database";
import { Comment } from "../types/types";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Ensure comments collection exists before using it
async function ensureCommentsCollection() {
  if (!db.collection("comments")) {
    await db.createCollection("comments"); // Create collection if it doesn't exist
  }
}

(async () => {
  await ensureCommentsCollection(); // Call on startup
})();

// Get comments for a post
router.get("/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const comments = await db.collection("comments").find({ postId }).toArray(); // Use MongoDB find
  res.json(comments);
});

// Create a comment
router.post("/", authMiddleware, async (req, res) => {
  const { postId, text } = req.body;
  if (!postId || !text) {
    return res.status(400).send({ message: "Post ID and text are required." });
  }

  const newComment: Comment = {
    id: (await db.collection("comments").countDocuments({})) + 1, // Generate ID using count
    postId,
    text,
    date: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };

  try {
    await db.collection("comments").insertOne(newComment); // Use MongoDB insertOne
    res.json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

// Delete a comment
router.delete("/:id", authMiddleware, async (req, res) => {
  const commentId = parseInt(req.params.id);
  const deleteResult = await db
    .collection("comments")
    .deleteOne({ id: commentId }); // Use MongoDB deleteOne

  if (deleteResult.deletedCount === 0) {
    return res.status(404).send({ message: "Comment not found." });
  }

  res.status(204).send();
});

// Like a comment
router.post("/like", async (req, res) => {
  const { commentId } = req.body;

  const updateResult = await db.collection("comments").updateOne(
    { id: commentId },
    { $inc: { likes: 1 } } // Use MongoDB update with increment
  );

  if (updateResult.modifiedCount === 0) {
    return res.status(404).send({ message: "Comment not found." });
  }

  const comment = await db.collection("comments").findOne({ id: commentId }); // Fetch updated comment
  res.json({ id: comment?.id, likes: comment?.likes });
});

// Dislike a comment
router.post("/dislike", async (req, res) => {
  const { commentId } = req.body;

  const updateResult = await db.collection("comments").updateOne(
    { id: commentId },
    { $inc: { dislikes: 1 } } // Use MongoDB update with increment
  );

  if (updateResult.modifiedCount === 0) {
    return res.status(404).send({ message: "Comment not found." });
  }

  const comment = await db.collection("comments").findOne({ id: commentId }); // Fetch updated comment
  res.json({ id: comment?.id, dislikes: comment?.dislikes });
});

export const commentRoutes = router;
