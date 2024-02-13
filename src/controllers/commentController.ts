import express from "express";
import { db } from "../models/database";
import { Comment } from "../types/types";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Get comments for a post
router.get("/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const comments: Comment[] = await db.readDbFile("comments.json");
  const postComments = comments.filter((comment) => comment.postId === postId);
  res.json(postComments);
});

// Create a comment
router.post("/", authMiddleware, async (req, res) => {
  const { postId, text } = req.body;
  if (!postId || !text) {
    return res.status(400).send({ message: "Post ID and text are required." });
  }

  const comments: Comment[] = await db.readDbFile("comments.json");
  const newComment: Comment = {
    id: comments.length + 1,
    postId,
    text,
    date: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };
  comments.push(newComment);
  await db.writeDbFile("comments.json", comments);
  res.json(newComment);
});

// Delete a comment
router.delete("/:id", authMiddleware, async (req, res) => {
  const commentId = parseInt(req.params.id);
  let comments: Comment[] = await db.readDbFile("comments.json");
  const commentIndex = comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (commentIndex === -1) {
    return res.status(404).send({ message: "Comment not found." });
  }
  comments = comments.filter((comment) => comment.id !== commentId);
  await db.writeDbFile("comments.json", comments);
  res.status(204).send();
});

// Like a comment
router.post("/like", async (req, res) => {
  const { commentId } = req.body;
  let comments: Comment[] = await db.readDbFile("comments.json");
  const comment = comments.find((comment) => comment.id === commentId);
  if (!comment) {
    return res.status(404).send({ message: "Comment not found." });
  }
  comment.likes += 1;
  await db.writeDbFile("comments.json", comments);
  res.json({ id: comment.id, likes: comment.likes });
});

// Dislike a comment
router.post("/dislike", async (req, res) => {
  const { commentId } = req.body;
  let comments: Comment[] = await db.readDbFile("comments.json");
  const comment = comments.find((comment) => comment.id === commentId);
  if (!comment) {
    return res.status(404).send({ message: "Comment not found." });
  }
  comment.dislikes += 1;
  await db.writeDbFile("comments.json", comments);
  res.json({ id: comment.id, dislikes: comment.dislikes });
});

export const commentRoutes = router;
