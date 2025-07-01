import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import User from "../models/User.js";
import customError from "../utils/customError.js";

export default async function refresh_token(req, res, next) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throw new customError("No refresh token provided", 401);

    const decoded = jwt.verify(token, config.JWT_SECRET__REFRESH_TOKEN);

    // Match the field name with the one used in login (id)
    const user = await User.findById(decoded.id);
    if (!user) throw new customError("User not found", 404);

    const accessToken = jwt.sign(
      { id: user._id },
      config.JWT_SECRET_ACCESS_TOKEN,
      { expiresIn: config.JWT_SECRET_ACCESS_TOKEN_DURATION }
    );

    // Optionally: You can remove password from user response
    user.password = undefined;

    return res.status(200).json({ accessToken, user });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return next(new customError("Invalid or expired refresh token", 403));
    }
    return next(error);
  }
}