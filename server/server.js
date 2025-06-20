import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app=express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

import { config } from './config/env.js';
import connectDB from './config/db.js';
import CORS from './config/CORS.js';

app.use(CORS())
app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/dist/index.html'))
})

const start=()=>{
    try {
        app.listen(config.PORT||9000)
        connectDB()
        console.log("server is running on ",config.PORT);
        
    } catch (error) {
        console.error("error on server index file")
    }
}
// starting point
start()