import express from 'express';
import {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} from '../controllers/postController.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';

const router = express.Router();

// Public: Get all posts
router.get('/', getAllPosts);

// Public: Get single post
router.get('/:id', getSinglePost);

// Protected routes below
router.post('/', verifyAccessToken, createPost);
router.patch('/:id', verifyAccessToken, updatePost);
router.delete('/:id', verifyAccessToken, deletePost);
router.patch('/:id/like', verifyAccessToken, toggleLike);

export default router;