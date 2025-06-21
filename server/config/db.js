import mongoose from "mongoose";
import {config} from "./env.js";
export default async function connectDB(){
    try{
        const conn=await mongoose.connect(config.MONGO_URI_anonymsg)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch (error){
    console.error(` MongoDB connection error: ${error.message}`)
    process.exit(1)
    }
}