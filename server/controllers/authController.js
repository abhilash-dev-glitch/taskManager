// server/controllers/authController.js

// --- IMPORTS ---
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
// 🎯 FIX/CHECK: Ensure this path is correct. If the file is userModel.js, change to:
const User = require('../models/User'); 

// ... rest of your code ...

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: '30d' 
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
    // ... (No changes needed for registration logic)
    const { username, password } = req.body;

    // 1. Validation
    if (!username || !password) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

    // 2. Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // 3. Create user
    const user = await User.create({
        username,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    // --- START TEST LOGS FOR LOGIN ---
    console.log(`[AUTH LOG] Attempting login for: ${username}`);
    
    // 1. Find user by username
    const user = await User.findOne({ username });

    console.log(`[AUTH LOG] User found in DB: ${!!user}`); // Logs true/false
    
    // 2. Check user and password
    // This is the CRITICAL line where the crash happens if matchPassword fails
    if (user && (await user.matchPassword(password))) {
        
        console.log('[AUTH LOG] Password matched. Token generated.');

        res.json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        });
    } else {
        // This block executes if user is not found OR password comparison fails.
        // If the crash happens before this, you'll see the first log but not this one.
        console.log('[AUTH LOG] Login failed: Invalid credentials.');
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// --- EXPORTS ---
module.exports = { registerUser, loginUser };