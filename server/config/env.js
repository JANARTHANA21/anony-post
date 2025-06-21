import dotenv from 'dotenv';
dotenv.config()
export const config = { MONGO_URI_anonymsg: process.env.MONGO_URI_anonymsg, PORT: process.env.PORT,JWT_SECRET:process.env.JWT_SECRET };