import React from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

// ... (API_URL, useAuth, and rest of logic)

const TaskItem = ({ task, onEdit, onDelete }) => {
    const { user } = useAuth();
    
    // ... (handleDelete and handleToggleComplete logic)

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                // ... axios delete call
                onDelete(); 
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
    };

    const handleToggleComplete = async () => {
        try {
            // ... axios put call
            onDelete(); 
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };


    return (
        <div 
            className={`p-5 rounded-xl shadow-md flex justify-between items-start transition duration-200 ${
                task.completed 
                    ? 'bg-green-100 border-l-4 border-green-500 opacity-70' 
                    : 'bg-white border-l-4 border-gray-200 hover:shadow-lg'
            }`}
        >
            <div className="flex-1 mr-4 cursor-pointer" onClick={handleToggleComplete}>
                <h3 
                    className={`text-xl font-semibold ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}
                >
                    {task.title}
                </h3>
                {task.description && (
                    <p className={`text-gray-600 mt-1 text-sm ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                    </p>
                )}
                <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                    task.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-400 text-gray-800'
                }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                </span>
            </div>
            
            <div className="flex space-x-2">
                <button 
                    onClick={() => onEdit(task)}
                    className="p-2 text-sm font-medium rounded-full text-indigo-600 hover:text-indigo-800 transition duration-150 hover:bg-indigo-100"
                    title="Edit Task"
                >
                    {/* SVG Icon for Edit (Conceptual) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.586 3.586l-7.793 7.793V17h2.586l7.793-7.793-2.828-2.828z"/></svg>
                </button>
                <button 
                    onClick={handleDelete} 
                    className="p-2 text-sm font-medium rounded-full text-red-600 hover:text-red-800 transition duration-150 hover:bg-red-100"
                    title="Delete Task"
                >
                    {/* SVG Icon for Delete (Conceptual) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd"/></svg>
                </button>
            </div>
        </div>
    );
};

export default TaskItem;