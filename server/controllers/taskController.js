// server/controllers/taskController.js
const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
// Assuming the user is available on the request via the 'protect' middleware
const User = require('../models/User'); 

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    // Find tasks that belong to the user ID attached by the 'protect' middleware
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
});

// @desc    Add a new task
// @route   POST /api/tasks
// @access  Private
const addTask = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400);
        throw new Error('Please add a task title');
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description || '', // Optional description
        user: req.user.id, // Associate the task with the logged-in user
    });

    res.status(201).json(task);
});

// @desc    Update a specific task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Check for user ownership: Task must belong to the logged-in user
    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to update this task');
    }
    
    // Allow updating 'title', 'description', and 'completed'
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true } // Return the new document
    );

    res.status(200).json(updatedTask);
});

// @desc    Delete a specific task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Check for user ownership
    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete this task');
    }

    await Task.deleteOne({ _id: req.params.id }); 

    res.status(200).json({ id: req.params.id, message: 'Task removed' });
});


module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
};