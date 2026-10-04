import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './src/config/db.js';
import noteRouter from './src/routes/note.route.js';
import { globalLimiter } from './src/middlewares/rateLimiter.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
    ...(process.env.CLIENT_URL || '').split(',').map((url) => url.trim()),
    'http://localhost:5173',
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use(globalLimiter);

app.use('/api/v1/note', noteRouter);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error, req, res, next) => {
    console.error(error.stack);

    const status = error.name === 'ValidationError'
        ? 400
        : error.statusCode || error.status || 500;

    res.status(status).json({
        success: false,
        message: status === 500 ? 'Internal server error' : error.message,
    });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running in port: ${PORT}`);
    });
});