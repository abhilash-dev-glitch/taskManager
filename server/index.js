// server/index.js
// This file acts as the entry point for Vercel's serverless function.

// We export the Express app instance from your main server file.
// IMPORTANT: Make sure your main server file (e.g., server.js) exports the app instance, 
// not just starts the listener.

const app = require('./server'); // Assuming your main server file is named 'server.js'

module.exports = app;

// The listening logic (app.listen(PORT, ...)) must be removed or wrapped 
// in an if statement to avoid conflict with the serverless environment.
