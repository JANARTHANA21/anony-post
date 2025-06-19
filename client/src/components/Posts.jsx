import { useSelector, useDispatch } from "react-redux";
import { postSelectorAll } from "../features/Posts/Postssclice";
import { incrementLikes } from "../features/Posts/Postssclice";
import { Link } from "react-router-dom";
import Eachpost from "./Eachpost";
export default function Posts({ countryname }) {
  const postdetails = useSelector(postSelectorAll);
  const dispatch = useDispatch();

  const filterposts =
    countryname == "GLOBAL"
      ? postdetails
      : postdetails.filter((post) => post.country == countryname);
  return (
    <div className="min-h-lvh w-dvw bg-amber-900 text-white p-4">
      {filterposts.map((post) => (
        <div key={post.id} className="mb-4 bg-amber-800 p-4 rounded">
          <div className="text-lg font-semibold ">
            {post.text.slice(0, 20)}
            {post.text.length >= 5 ? "..." : ""}
            <Link to={`/posts/${post.id}`} className="text-blue-900">
              read more
            </Link>
          </div>

          <br />
          <div className="text-sm">
            🌍 {post.country} — 🕒 {post.createdAt}
          </div>
          <br />
          <ul className="flex justify-between">
            <div
              onClick={() => dispatch(incrementLikes(post.id))}
              className="text-sm"
            >
              ❤️ {post.likes} likes
            </div>
            <div className="text-sm">✉️ {post.comands} commands</div>
            <div className="text-sm">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/posts/${post.id}`
                  )
                }
              >
                🔗 {post.share}{" "}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    post.text +
                      " - " +
                      window.location.origin +
                      "/posts/" +
                      post.id
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 text-sm ml-2"
                > copy Link and 🟢 Share on WhatsApp</a>
               
              </button>
            </div>
            <h6>✍️ edit</h6> <h6>🗑️ delete</h6>
          </ul>
        </div>
      ))}
    </div>
  );
}
