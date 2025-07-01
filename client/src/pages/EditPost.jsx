import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAuthAxios from '../hooks/useAuthAxios';

export default function EditPost() {
  const API = useAuthAxios();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const countries = [
    { code: 'GLOBAL', name: '🌍 Global' },
    { code: 'IN', name: '🇮🇳 India' },
    { code: 'US', name: '🇺🇸 United States' },
    { code: 'UK', name: '🇬🇧 United Kingdom' },
    { code: 'CA', name: '🇨🇦 Canada' },
    { code: 'AU', name: '🇦🇺 Australia' },
  ];

  const [form, setForm] = useState({ content: '', country: 'GLOBAL' });

  // Fetch post by ID
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await API.get(`/api/posts/${id}`);
      return res.data;
    },
  });

  // Set form state once data is fetched
  useEffect(() => {
    if (post) {
      setForm({ content: post.text, country: post.country });
    }
  }, [post]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await API.patch(
        `/api/posts/${id}`,
        { content: form.content, country: form.country },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Post updated!');
      queryClient.invalidateQueries(['posts']);
      navigate('/posts');
    },
    onError: (err) => {
      toast.error('Update failed: ' + err.message);
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      toast.error('Content is required');
      return;
    }
    mutation.mutate();
  };

  if (isLoading) return <p className="p-4">Loading post...</p>;
  if (isError || !post) return <p className="p-4 text-red-600">Post not found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">Post Message:</label>
        <input
          type="text"
          name="content"
          value={form.content}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <label className="block font-medium mb-1">Country:</label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        >
          {countries.map((c, idx) => (
            <option key={idx} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}