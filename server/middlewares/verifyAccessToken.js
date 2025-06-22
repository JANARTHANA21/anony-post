
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import CustomError from '../utils/customError.js';

export default function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new CustomError('Access token missing', 401));
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, config.JWT_SECRET_ACCESS_TOKEN);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return next(new CustomError('Access token expired or invalid', 401));
  }
}