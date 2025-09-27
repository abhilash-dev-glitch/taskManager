const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path'); 

// Import the error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- CORS Configuration (Production Ready) ---

// 1. Get the frontend URL from environment variables for deployed app
// FALLBACK: 'http://localhost:5173' is always allowed for local development
const frontendUrl = process.env.FRONTEND_URL;

// Configure CORS dynamically
app.use(cors({
    origin: (origin, callback) => {
        // If there is no origin (same-origin, Postman, etc.), allow it
        if (!origin) {
            return callback(null, true);
        }
        
        // Define all allowed origins
        const allowed = [
            'http://localhost:5173',
            frontendUrl // This must be set in Vercel environment variables!
        ];

        if (allowed.includes(origin)) {
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.error(`CORS Blocked: Origin ${origin} not in allowed list.`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
}));

// --- Middleware ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- Error Handler ---
app.use(errorHandler); 

module.exports = app;
