const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

// All task routes require authentication
router.route('/')
    .get(protect, getTasks)  // GET /api/tasks
    .post(protect, addTask); // POST /api/tasks

router.route('/:id')
    .put(protect, updateTask)    // PUT /api/tasks/:id
    .delete(protect, deleteTask); // DELETE /api/tasks/:id

module.exports = router;