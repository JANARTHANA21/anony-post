import jwt from "jsonwebtoken";
import customError from "../utils/customError";
import { config } from "../config/env";
import User from "../models/User";


export default async function refresh_token(req, res, next) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throw new customError("No refresh token provided", 401);


    const decoded = jwt.verify(token, config.JWT_SECRET__REFRESH_TOKEN);


    const user = await User.findById(decoded.userId);
    if (!user) throw new customError("User not found", 404);


    const accessToken = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET_ACCESS_TOKEN,
      { expiresIn: config.JWT_SECRET_ACCESS_TOKEN_DURATION } 
    );

    return res.status(200).json({ accessToken });
  } catch (error) {

    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return next(new customError("Invalid or expired refresh token", 403));
    }
    return next(error);
  }
}