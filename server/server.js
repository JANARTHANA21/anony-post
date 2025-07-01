import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import connectDB from './config/db.js';
import CORS from './config/CORS.js';
import authRouter from './routes/authRoutes.js';
import postRouter from './routes/postRoutes.js'; 
import commentRoutes from './routes/commentRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Setup for __dirname and __filename (for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Middlewares
app.use(CORS());                       
app.use(express.json());         
app.use(cookieParser()); 
app.use(helmet());     

// API Routes
app.use('/api/auth', authRouter);      // ✅ Auth routes
app.use('/api/posts', postRouter);     // ✅ Posts routes
app.use('/api/comments', commentRoutes);  // ✅ Comments routes

// Optional frontend serving (if you want monolith later)
// app.use(express.static(path.join(__dirname, '../client/dist')));
// app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));

// Global Error Handler
app.use(errorHandler);

// Connect DB and Start Server
const start = async () => {
  try {
    await connectDB();
    app.listen(config.PORT || 9000, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

start();