import Post from '../models/Post.js';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import CustomError from '../utils/customError.js';

//Get all posts
export const getAllPosts = asyncWrapper(async (req, res) => {
  const posts = await Post.find().sort({ likes: -1,commentsCount:-1 });
  res.status(200).json(posts);
});

//Get single post
export const getSinglePost = asyncWrapper(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new CustomError("Post not found", 404));
  res.status(200).json(post);
});

//Create new post
export const createPost = asyncWrapper(async (req, res, next) => {
  const { content, country } = req.body;
  if (!content) return next(new CustomError("Content is required", 400));
  const newPost = await Post.create({ content, country });
  res.status(201).json(newPost);
});

//Update post
export const updatePost = asyncWrapper(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) return next(new CustomError("Post not found", 404));
  res.status(200).json(post);
});

//Like/unlike post
export const toggleLike = asyncWrapper(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new CustomError("Post not found", 404));

  const userId = req.user.id;

  if (post.likedBy.includes(userId)) {
    // If already liked —> Unlike
    post.likes = Math.max(0, post.likes - 1);
    post.likedBy = post.likedBy.filter((id) => id !== userId);
    await post.save();
    return res.status(200).json({ msg: "Unliked", likes: post.likes });
  } else {
    // Like it
    post.likes += 1;
    post.likedBy.push(userId);
    await post.save();
    return res.status(200).json({ msg: "Liked", likes: post.likes });
  }
});

//Delete post
export const deletePost = asyncWrapper(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return next(new CustomError("Post not found", 404));
  res.status(200).json({ msg: "Post deleted successfully" });
});