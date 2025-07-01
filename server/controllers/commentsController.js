import Comment from "../models/Comment.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import CustomError from "../utils/customError.js";
import Post from '../models/Post.js';

// ✅ Create a new comment
export const createComment = asyncWrapper(async (req, res) => {
  const { postId, parentId, content } = req.body;

  if (!postId || !content) {
    throw new CustomError("Post ID and content are required", 400);
  }

  const newComment = await Comment.create({
    postId,
    parentId: parentId || null,
    content,
  });

  await Post.findByIdAndUpdate(postId,{$inc:{commentsCount:1}})

  res.status(201).json({ msg: "Comment created", comment: newComment });
});

// ✅ Get all comments for a specific post and added a children all comments
//    for inmemory access from frontend
function buildCommentTree(comments, parentId = null) {
  return comments
    .filter(c => String(c.parentId) === String(parentId))
    .map(c => ({
      _id: c._id,
      postId: c.postId,
      parentId: c.parentId,
      content: c.content,
      likes: c.likes,
      likedBy: c.likedBy,
      createdAt: c.createdAt,
      children: buildCommentTree(comments, c._id),
    }));
}


export const getCommentsByPostId = asyncWrapper(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId }).sort({ createdAt: -1 }).lean();
  const nested = buildCommentTree(comments);
  res.status(200).json({ comments: nested });
});

//  toggle Like
export const toggleLikeComment = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  const comment = await Comment.findById(id);
  if (!comment) throw new CustomError("Comment not found", 404);

  const alreadyLiked = comment.likedBy.includes(userId);

  if (alreadyLiked) {
    comment.likedBy.pull(userId);
    comment.likes -= 1;
    await comment.save();
    return res.status(200).json({ msg: "Unliked", likes: comment.likes });
  } else {
    comment.likedBy.push(userId);
    comment.likes += 1;
    await comment.save();
    return res.status(200).json({ msg: "Liked", likes: comment.likes });
  }
});

// ✅ Patch update comment
export const updateComment = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const updated = await Comment.findByIdAndUpdate(id, { content }, { new: true });
  if (!updated) throw new CustomError("Comment not found", 404);

  res.status(200).json({ msg: "Comment updated", comment: updated });
});

// ✅ Delete comment
export const deleteComment = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const deleted = await Comment.findByIdAndDelete(id);
  if (!deleted) throw new CustomError("Comment not found", 404);
  await Post.findByIdAndUpdate(deleted.postId, {
  $inc: { commentsCount: -1 },
});

  res.status(200).json({ msg: "Comment deleted" });
});