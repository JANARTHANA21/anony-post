import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthAxios from '../hooks/useAuthAxios';



export default function Posts({ countryname }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const API = useAuthAxios();
  // Fetch posts
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
  

  // Like post
  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await API.patch(`/api/posts/${postId}/like`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['posts']);
      if (data.msg==='Liked') toast.success(data.msg);
      else toast.warning(data.msg);
    },
    onError: () => toast.error('Failed to like post'),
  });

  // Delete post
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
    <div className="min-h-lvh w-dvw bg-amber-900 text-white p-4">
      {filteredPosts.map((post) => (
        <div key={post._id} className="mb-4 bg-amber-800 p-4 rounded">
          <div className="text-lg font-semibold">
                {post?.content.length>=10 ? post.content.slice(0, 20) + "..." : post.content}
            <Link to={`/posts/${post._id}`} className="text-blue-300 ml-2 underline">
              read more
            </Link>
          </div>

          <div className="text-sm mt-2">
            🌍 {post.country} — 🕒 {new Date(post.createdAt).toLocaleString()}
          </div>

          <ul className="flex justify-between flex-wrap gap-3 mt-4 text-sm">
            <li
              onClick={() => likeMutation.mutate(post._id)}
              className={`cursor-pointer ${likeMutation.isLoading ? 'opacity-50' : ''}`}
            >
              ❤️ {post.likes} likes
            </li>

            <li>✉️ {post.commentsCount || 0} comments</li>

            <li>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/posts/${post._id}`
                  )
                }
              >
                🔗 Copy Link &nbsp;
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    post.text +
                      ' - ' +
                      window.location.origin +
                      '/posts/' +
                      post._id
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 ml-2 underline"
                >
                  Share on WhatsApp
                </a>
              </button>
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
                  if (window.confirm('Are you sure to delete this post?')) {
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
  );
}