import cors from "cors";
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "echohaven.vercel.app",
"echohaven-git-main-janarthana-s-projects.vercel.app",
"echohaven-foo5ri5r7-janarthana-s-projects.vercel.app"
];

export default function CORS() {
  return cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS Policy"));
      }
    },
    credentials: true,
  });
}
