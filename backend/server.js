import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/config/db.js';
import noteRouter from './src/routes/note.route.js'
import { globalLimiter } from './src/middlewares/rateLimiter.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(globalLimiter);

app.use('/api/v1/note', noteRouter);

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
});

app.use((error, req, res, next) => { 
    console.error(error.stack);
    const status = error.statusCode || 500;
    res.status(status).json({
        success: false,
        message: error.message || 'Internal server error'
    });
});

connectDB().then(() => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running in port: ${PORT}`);
        })
    } catch (error) {
        return res.status(500).json({ message: "something wrong" });
        process.exit(1);
    }
});