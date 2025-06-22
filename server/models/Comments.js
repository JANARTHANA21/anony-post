import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments', default: null },
  content: { type: String, required: true ,maxlength: 2000},
  likes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Comments', commentSchema);