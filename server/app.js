const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path'); // Needed for serving static assets in the final setup

// Import the error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- CORS Configuration (Production Ready) ---

// Define the origins based on the environment
const deployedFrontendUrl = process.env.FRONTEND_URL || 'https://task-manager-nl5c.vercel.app/';
const localFrontendUrl = 'http://localhost:5173';

const allowedOrigins = [
    localFrontendUrl,
    deployedFrontendUrl // Will be used when deployed
];

// Configure CORS dynamically
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
        if (!origin) return callback(null, true); 
        
        // If the origin is in our allowed list, permit access
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Reject if origin is not allowed
            const msg = `The CORS policy for this site does not allow access from origin: ${origin}`;
            console.error('CORS Error:', msg);
            callback(new Error(msg), false);
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


// --- DEPLOYMENT STEP: Serve Frontend Assets in Production ---
/* This block is essential if you decide to deploy the server and frontend 
    together on the same host (though separate is recommended). 
    If you deploy separately (Vercel + Render), you can remove this block.
*/
if (process.env.NODE_ENV === 'production') {
    // 1. Set static folder (assuming React build is inside the 'client' directory)
    app.use(express.static(path.join(__dirname, '../client/dist'))); 

    // 2. Any request that is not an API route is routed to the React app
    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../client', 'dist', 'index.html')
        )
    );
} else {
    // Simple response for testing root API path in development
    app.get('/', (req, res) => res.send('API is running...'));
}

// --- Error Handler ---
app.use(errorHandler); 

module.exports = app;
// Note: The app.listen() call should be in a separate file (e.g., server/index.js) or conditional here.
