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
      <div key={comment._id} className="ml-4 mt-2 border-l pl-4">
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
              className="border p-1 rounded w-full mb-1"
            />
            <div className="space-x-2 text-sm">
              <button type="submit" className="text-blue-600">
                Save
              </button>
              <button
                onClick={() => setEditingCommentId(null)}
                type="button"
                className="text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>{comment.content}</p>
            <div className="text-sm space-x-3 text-gray-700 mt-1">
              <button onClick={() => likeCommentMutation.mutate(comment._id)} >
                ❤️ {comment.likes}{" "}
              </button>
              <button onClick={() => handleReply(comment._id)}>Reply</button>
              <button onClick={() => handleEdit(comment)}>Edit</button>
              <button onClick={() => handleDelete(comment._id)}>Delete</button>
            </div>
          </>
        )}
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
              className="border p-1 rounded w-full mb-1"
              placeholder="Write a reply..."
            />
            <div className="text-sm">
              <button type="submit" className="text-green-600">
                Post Reply
              </button>
              <button
                onClick={() => setReplyTo(null)}
                type="button"
                className="ml-2 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* Recursive rendering of nested children */}
        {comment.children &&
          comment.children.length > 0 &&
          renderComments(comment.children)}
      </div>
    ));
    
  if (postLoading || commentsLoading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold">{post.content}</h2>
      <p>🌍 {post.country}</p>
      <p>🕒 {new Date(post.createdAt).toLocaleString()}</p>
      <p
        className="cursor-pointer"
        onClick={() => likeMutation.mutate(post._id)}
      >
        ❤️ {post.likes} likes
      </p>

      <hr className="my-4" />

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
          placeholder="Add a comment..."
          className="border p-2 w-full mb-2 rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={commentMutation.isPending}
        >
          {commentMutation.isPending ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-4">💬 Comments</h3>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        renderComments(comments)
      )}
    </div>
  );
}
