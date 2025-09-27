const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import the error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- CORS Configuration ---
// Ensure FRONTEND_URL is set in Vercel/Render Environment Variables
const frontendUrl = process.env.FRONTEND_URL;

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., Postman, internal calls)
        if (!origin) {
            return callback(null, true);
        }
        
        const allowed = [
            'http://localhost:5173',
            frontendUrl
        ];

        if (allowed.includes(origin)) {
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
// This is what will show when you visit the backend URL (task-manager-epxz.vercel.app)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Task Manager API is running successfully.' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- Error Handler ---
app.use(errorHandler); 

module.exports = app;
