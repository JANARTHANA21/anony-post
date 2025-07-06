import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthAxios from '../hooks/useAuthAxios';

export default function Posts({ countryname }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const API = useAuthAxios();

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await API.get('/api/posts');
      return res.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await API.patch(`/api/posts/${postId}/like`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['posts']);
      if (data.msg === 'Liked') toast.success(data.msg);
      else toast.warning(data.msg);
    },
    onError: () => toast.error('Failed to like post'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await API.delete(`/api/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Post deleted');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  if (isLoading) return <p className="text-white text-center">Loading...</p>;
  if (isError) return <p className="text-red-500 text-center">Error loading posts</p>;

  const filteredPosts =
    countryname === 'GLOBAL'
      ? posts
      : posts.filter((post) => post.country === countryname);

return (
  <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white px-4 py-8">
    <h1 className="text-3xl font-bold text-center mb-8">Explore Posts</h1>

    <div className="grid gap-6 max-w-4xl mx-auto">
      {filteredPosts.map((post) => (
        <div
          key={post._id}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl border border-white/20"
        >
          <div className="text-lg font-semibold mb-2">
            {post?.content.length >= 10
              ? post.content.slice(0, 40) + "..."
              : post.content}
            <Link
              to={`/posts/${post._id}`}
              className="text-blue-300 ml-2 underline hover:text-blue-400"
            >
              read more
            </Link>
          </div>

          <div className="text-sm text-gray-300">
            🌍 {post.country} — 🕒{" "}
            {new Date(post.createdAt).toLocaleString()}
          </div>

          <ul className="flex flex-wrap gap-4 mt-4 text-sm text-white font-medium">
            <li
              onClick={() => likeMutation.mutate(post._id)}
              className={`cursor-pointer hover:text-pink-400 transition ${
                likeMutation.isLoading ? "opacity-50" : ""
              }`}
            >
              ❤️ {post.likes} Likes
            </li>

            <li>💬 {post.commentsCount || 0} Comments</li>

            <li>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/posts/${post._id}`
                  )
                }
              >
                🔗 Copy Link
              </button>
            </li>

            <li>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  post.text +
                    " - " +
                    window.location.origin +
                    "/posts/" +
                    post._id
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 underline"
              >
                📤 WhatsApp
              </a>
            </li>

            <li>
              <button
                onClick={() => navigate(`/edit-post/${post._id}`)}
                className="text-yellow-400 underline"
              >
                ✏️ Edit
              </button>
            </li>

            <li>
              <button
                disabled={deleteMutation.isLoading}
                onClick={() => {
                  if (window.confirm("Are you sure to delete this post?")) {
                    deleteMutation.mutate(post._id);
                  }
                }}
                className="text-red-400 underline disabled:opacity-40"
              >
                🗑️ Delete
              </button>
            </li>
          </ul>
        </div>
      ))}
    </div>
  </div>
);
}