import express from "express";
import { register, login } from "../controllers/authController.js";
import refresh_token from "../controllers/refreshToken.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh_token);

export default authRouter;