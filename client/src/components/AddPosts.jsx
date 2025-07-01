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
          className="bg-blue-400/55 min-h-dvh w-dvw absolute flex justify-center items-center"
        >
          <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md w-[300px]">
            <h2 className="text-xl font-bold mb-4 text-center">Add Message</h2>

            <label htmlFor="addform" className="block text-sm font-medium mb-1">Post Message:</label>
            <input
              name="addform"
              id="addform"
              type="text"
              placeholder="Enter message"
              className="border p-2 w-full mb-3 rounded"
            />

            <label htmlFor="country" className="block text-sm font-medium mb-1">Choose Country:</label>
            <select name="country" id="country" className="border p-2 w-full mb-3 rounded">
              {countries.map((country, idx) => (
                <option key={idx} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 w-full rounded disabled:opacity-50"
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