const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import the error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware'); // ASSUMED FILE PATH

const app = express();

// --- Middleware ---
// Configure CORS to specifically allow your frontend (Running on port 5173)
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));

// Body parser for JSON data
app.use(express.json()); 
// Body parser for URL-encoded form data (less common in API, but good practice)
app.use(express.urlencoded({ extended: false })); 

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- Error Handler ---
// This middleware MUST be placed AFTER your routes.
// It catches errors thrown by express-async-handler and formats the response.
app.use(errorHandler); 

module.exports = app;