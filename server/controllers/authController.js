import { config } from "../config/env.js"
import jwt from 'jsonwebtoken';
import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/User.js";
import CustomError from "../utils/customError.js";

const register = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return next(new CustomError("Username already taken", 409));
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(new CustomError("Email already registered", 409));
  }

  const user = await User.create({ username, email, password });
  if (!user) {
    return next(new CustomError("User can't be created. Try again later.", 500));
  }

  res.status(201).json({ msg: "User registered", user });
});

const login =asyncWrapper(async (req,res,next)=>{
    const {email,password}=req.body
    const user=await User.findOne({email}).select('+password');
    if (!user) return next(new CustomError("user not found", 404)); 
    const isMatch=await user.comparePassword(password);
    if (!isMatch)  return next(new CustomError("Invalid crendentials", 401)); 
    const Access_token =  jwt.sign({id:user._id},config.JWT_SECRET_ACCESS_TOKEN,{expiresIn:config.JWT_SECRET_ACCESS_TOKEN_DURATION});
    const refresh_token =  jwt.sign({id:user._id},config.JWT_SECRET__REFRESH_TOKEN,{expiresIn:config.JWT_SECRET__REFRESH_TOKEN_DURATION});
    
    user.password=undefined
    res.cookie('refreshToken',refresh_token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:'Strict',
        maxAge:30*24*60*60*1000
    })
    res.status(200).json({ msg: "Login successful", Access_token, user });
});
export {register,login};
        
