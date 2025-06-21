import { config } from "../config/env.js"
import jwt from 'jsonwebtoken';
import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/User.js";
import CustomError from "../utils/customError.js";

const register= 
    asyncWrapper(async(req,res)=>{
        const {username,email,password}=req.body
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return next(new CustomError("User already exists", 409)); 
        }
        const user=await User.create({username,email,password})
        if (!user) {
            return next(new CustomError("User cant create try again later", 409)); 
        }
        res.status(201).json({msg:"User registered",user});
    });

const login =asyncWrapper(async (req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email}).select('+password');
    if (!user) return next(new CustomError("user not found", 404)); 
    const isMatch=user.comparePassword(password);
    if (!isMatch)  return next(new CustomError("Invalid crendentials", 401)); 
    const token =jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:'7d'});
    user.password=undefined
    res.status(200).json({ msg: "Login successful", token, user });
});
export {register,login};
        
