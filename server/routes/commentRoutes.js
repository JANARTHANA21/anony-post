import express from "express";
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
  updateComment,
    toggleLikeComment,
} from "../controllers/commentsController.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

const router = express.Router();

// ✅ GET comments by postId (public)
router.get("/:postId", getCommentsByPostId);

// ✅ POST a new comment (protected)
router.post("/", verifyAccessToken, createComment);
// ✅ PATCH a new comment (protected)
router.patch('/:id', verifyAccessToken, updateComment);

// ✅ DELETE a comment (protected)
router.delete("/:id", verifyAccessToken, deleteComment);

 // ✅ Like route (protected)
router.patch("/:id/like", verifyAccessToken, toggleLikeComment);

export default router;