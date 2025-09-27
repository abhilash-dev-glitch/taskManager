import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

// 🎯 Defining the API URL is crucial for submission (Fix for the previous error)
const API_URL = 'https://task-manager-ywqb.vercel.app/api/tasks/';

const TaskForm = ({ currentTask, onTaskCreated, onTaskUpdated, clearForm }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // State to hold any submission error
    const [error, setError] = useState(null); 
    const { user } = useAuth();
    
    // Effect to populate the form when a task is selected for editing
    useEffect(() => {
        if (currentTask) {
            setTitle(currentTask.title);
            setDescription(currentTask.description || '');
        } else {
            setTitle('');
            setDescription('');
        }
    }, [currentTask]);

    // Configuration for authenticated requests
    const config = {
        headers: { 
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json', // Specify content type
        }
    };

    // Handler for creating or updating a task
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        if (!title) {
            setError('Task title cannot be empty.');
            return;
        }

        const taskData = { title, description };

        try {
            if (currentTask) {
                // UPDATE operation
                await axios.put(API_URL + currentTask._id, taskData, config);
                onTaskUpdated(); // Trigger task refresh in DashboardPage
            } else {
                // CREATE operation
                await axios.post(API_URL, taskData, config);
                onTaskCreated(); // Trigger task refresh in DashboardPage
            }
            
            // Clear form and reset state after successful submission
            setTitle('');
            setDescription('');
            clearForm(); 

        } catch (err) {
            console.error('Task operation failed:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to connect to the server.');
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
                {currentTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            
            {/* Display Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <input
                type="text"
                placeholder="Task Title (required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none"
            ></textarea>
            
            <div className="flex space-x-3">
                <button 
                    type="submit"
                    className="flex-grow py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                    disabled={!title}
                >
                    {currentTask ? 'Update Task' : 'Create Task'}
                </button>
                {currentTask && (
                    <button 
                        type="button" 
                        onClick={clearForm}
                        className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;