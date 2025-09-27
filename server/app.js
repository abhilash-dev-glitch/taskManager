const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import the error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- CORS Configuration (FORCED FIX) ---

// Define all allowed domains explicitly to bypass any env variable issues.
const allowedOrigins = [
    // 1. Your Frontend URL (Origin)
    'https://task-manager-nl5c.vercel.app', 
    // 2. Your Local Development Frontend
    'http://localhost:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., Postman, internal Vercel calls)
        if (!origin) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked: Origin ${origin} not in allowed list.`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
}));

// --- Middleware ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// --- API Test Route (Health Check) ---
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Task Manager API is running successfully.' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- Error Handler ---
app.use(errorHandler); 

module.exports = app;
