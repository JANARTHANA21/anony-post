import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthAxios from "../hooks/useAuthAxios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Eachpost() {
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const API = useAuthAxios();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch post
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await API.get(`/api/posts/${id}`);
      return res.data;
    },
  });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id,user?._id],
    queryFn: async () => {
      const res = await API.get(`/api/comments/${id}`);
      return res.data.comments;
    },
  });
  // Like commands

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await API.patch(`/api/comments/${commentId}/like`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id,user?._id]);
    },
  });

  // Create comment
  const commentMutation = useMutation({
    mutationFn: async ({ content, parentId = null }) => {
      return await API.post("/api/comments", { postId: id, content, parentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id]);
      setNewComment("");
      setReplyTo(null);
    },
  });

  // Edit comment
  const editMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      return await API.patch(`/api/comments/${id}`, { content });
    },
    onSuccess: () => {
      toast.success("Comment updated");
      queryClient.invalidateQueries(["comments", id]);
      setEditingCommentId(null);
      setEditContent("");
    },
  });

  // Delete comment
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      return await API.delete(`/api/comments/${commentId}`);
    },
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries(["comments", id]);
    },
  });

  const handleReply = (parentId) => setReplyTo(parentId);

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate(commentId);
    }
  };  

  
  const renderComments = (commentsList) =>
    commentsList.map((comment) => (
  <div key={comment._id} className="ml-4 mt-4 pl-4 border-l-2 border-indigo-500/40">
  <div className="bg-white/10 p-3 rounded-lg shadow-sm text-sm text-white">
    {editingCommentId === comment._id ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editContent.trim()) {
            editMutation.mutate({ id: comment._id, content: editContent });
          }
        }}
      >
        <input
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-200"
        />
        <div className="mt-2 flex gap-2 text-xs">
          <button type="submit" className="text-green-300 hover:underline">
            💾 Save
          </button>
          <button
            onClick={() => setEditingCommentId(null)}
            type="button"
            className="text-gray-300 hover:underline"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    ) : (
      <>
        <p className="text-white">{comment.content}</p>
        <div className="flex gap-4 text-xs text-gray-300 mt-1">
          <button onClick={() => likeCommentMutation.mutate(comment._id)}>
            ❤️ {comment.likes}
          </button>
          <button onClick={() => handleReply(comment._id)}>↩️ Reply</button>
          <button onClick={() => handleEdit(comment)}>✏️ Edit</button>
          <button onClick={() => handleDelete(comment._id)}>🗑️ Delete</button>
        </div>
      </>
    )}

    {/* Reply input box */}
    {replyTo === comment._id && (
      <form
        className="mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (newComment.trim()) {
            commentMutation.mutate({
              content: newComment,
              parentId: comment._id,
            });
          }
        }}
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-200"
          placeholder="Write a reply..."
        />
        <div className="mt-1 text-xs">
          <button type="submit" className="text-green-300 hover:underline">
            💬 Post Reply
          </button>
          <button
            onClick={() => setReplyTo(null)}
            type="button"
            className="ml-2 text-gray-300 hover:underline"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    )}
  </div>

  {comment.children?.length > 0 && renderComments(comment.children)}
</div>
    ));
    
  if (postLoading || commentsLoading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

return (
  <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white">
    <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-indigo-100 mb-1">{post.content}</h2>
      <p className="text-indigo-300">🌍 {post.country}</p>
      <p className="text-indigo-400 mb-2">🕒 {new Date(post.createdAt).toLocaleString()}</p>
      <p
        className="cursor-pointer text-pink-300 hover:text-pink-400 transition"
        onClick={() => likeMutation.mutate(post._id)}
      >
        ❤️ {post.likes} likes
      </p>

      <hr className="my-4 border-indigo-300/30" />

      {/* Add Comment */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newComment.trim()) {
            commentMutation.mutate({ content: newComment });
          }
        }}
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="💬 Add a comment..."
          className="w-full rounded-lg border border-indigo-400/30 bg-white/10 text-white placeholder-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={commentMutation.isPending}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium shadow-md transition"
        >
          {commentMutation.isPending ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6 mb-3 text-emerald-300">
        💬 Comments
      </h3>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-300">No comments yet.</p>
        ) : (
          renderComments(comments)
        )}
      </div>
    </div>

    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
    `}</style>
  </div>
);
}
