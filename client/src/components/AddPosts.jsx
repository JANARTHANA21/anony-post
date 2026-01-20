import { useRef, useState } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthAxios from "../hooks/useAuthAxios";


export default function AddPosts() {
  const countries = [
    { code: 'GLOBAL', name: '🌍 Global' },
    { code: 'IN', name: '🇮🇳 India' },
    { code: 'US', name: '🇺🇸 United States' },
    { code: 'UK', name: '🇬🇧 United Kingdom' },
    { code: 'CA', name: '🇨🇦 Canada' },
    { code: 'AU', name: '🇦🇺 Australia' },
  ];
  const API = useAuthAxios();
  const [added, setAdded] = useState(false);
  const boxRef = useRef();
  const queryClient = useQueryClient();

  useClickOutside(boxRef, () => setAdded(false));

  const mutation = useMutation({
    mutationFn: async ({ content, country }) => {
      const res = await API.post("/api/posts", { content, country }, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post added successfully!");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setAdded(false);
    },
    onError: (error) => {
      toast.error("Failed to add post: " + error.message);
    },
  });

  function onSubmit(e) {
    e.preventDefault();
    const content = e.target.elements.addform.value.trim();
    const country = e.target.elements.country.value;

    if (!content) {
      toast.error("Post content is required");
      return;
    }

    mutation.mutate({ content, country });
  }

  return (
    <>
      <button
        onClick={() => setAdded(true)}
        className="bg-amber-300 rounded-2xl px-4 py-2"
      >
        Add Post
      </button>

      {added && (
        <div
          ref={boxRef}
          className="bg-blue-400/55 min-h-dvh w-dvw fixed top-0 left-0 flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setAdded(false)}
        >
          <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-2xl w-[350px] border border-gray-100 relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setAdded(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Message</h2>

            <label htmlFor="addform" className="block text-sm font-semibold mb-2 text-gray-700">Post Message:</label>
            <input
              name="addform"
              id="addform"
              type="text"
              placeholder="Enter your message..."
              className="border-2 border-gray-300 p-3 w-full mb-5 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white text-gray-900 placeholder-gray-500"
            />

            <label htmlFor="country" className="block text-sm font-semibold mb-2 text-gray-700">Choose Country:</label>
            <select name="country" id="country" className="border-2 border-gray-300 p-3 w-full mb-6 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white text-gray-900">
              {countries.map((country, idx) => (
                <option key={idx} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 w-full rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Add"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
