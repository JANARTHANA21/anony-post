import dotenv from "dotenv";
dotenv.config();
export const config = {
  MONGO_URI_anonymsg: process.env.MONGO_URI_anonymsg,
  PORT: process.env.PORT,
  JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET__REFRESH_TOKEN: process.env.JWT_SECRET__REFRESH_TOKEN,
  JWT_SECRET_ACCESS_TOKEN_DURATION:process.env.access_duration,
  JWT_SECRET__REFRESH_TOKEN_DURATION:process.env.refresh_duration
};
