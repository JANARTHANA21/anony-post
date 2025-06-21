import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import connectDB from './config/db.js';
import CORS from './config/CORS.js';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

// actuall app
const app = express();

// monolith
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// __filename → '/Users/you/anony-post/server/server.js'
// __dirname  → '/Users/you/anony-post/server'

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// monolith
// app.use(express.static(path.join(__dirname, '../client/dist')))
// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../client/dist/index.html'))
// })

// middlewares
app.use(CORS());
app.use(express.json());

// routers
app.use('/api/auth', authRouter);

// test route


// global error handler
app.use(errorHandler);
// starting point
const start = () => {
    try {
        app.listen(config.PORT || 9000);
        connectDB();
        console.log("server is running on ", config.PORT);
    } catch (error) {
        console.error("error on server index file");
    }
};

start();