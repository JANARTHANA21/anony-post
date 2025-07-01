import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true , maxlength: 5000 },
    country: { type: String, default: "global" },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    likedBy: {
  type: [String],
  default: [],
  
},
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);