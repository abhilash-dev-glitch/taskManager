import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth'; 

// 🎯 CRITICAL FIX: Ensure this port matches your backend server port (usually 5000)
const API_URL = 'https://task-manager-ywqb.vercel.app/api/tasks/'; 

const DashboardPage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configuration must be defined inside the component scope to access the state 'user'
    const config = {
        headers: { 
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json', // Added content type
        }
    };

    // --- Data Fetching Logic ---
    const fetchTasks = async () => {
        // Essential check: prevent API call if user or token is missing
        if (!user || !user.token) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Note: The config object includes the Bearer token
            const response = await axios.get(API_URL, config); 
            
            // Sort tasks: pending (false) first, then completed (true)
            const sortedTasks = response.data.sort((a, b) => a.completed - b.completed);
            setTasks(sortedTasks);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            // Show more specific error to the user if 401 (Unauthorized)
            if (err.response && err.response.status === 401) {
                 setError('Session expired or unauthorized. Please log in again.');
            } else {
                 setError('Failed to load tasks. Check server connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Call fetchTasks on initial mount and whenever the user state changes (login/logout)
    useEffect(() => {
        if (user) {
            fetchTasks();
        } else {
            setTasks([]); // Clear tasks on logout
            setLoading(false);
        }
    }, [user]);

    // --- Task Manipulation Logic ---

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(API_URL + taskId, config);
            fetchTasks(); // Refresh list after successful deletion
        } catch (err) {
            console.error("Error deleting task:", err);
            setError('Could not delete task.');
        }
    };

    const handleToggleComplete = async (task) => {
        const updatedStatus = { completed: !task.completed };
        try {
            // Use PUT request to update the task status
            await axios.put(API_URL + task._id, updatedStatus, config);
            fetchTasks(); // Refresh list to reflect the new status and sorting
        } catch (err) {
            console.error("Error toggling task completion:", err);
            setError('Could not update task status.');
        }
    };


    // --- UI State Handlers ---
    const handleEditClick = (task) => {
        setCurrentTask(task);
        setIsEditing(true);
    };

    const handleClearForm = () => {
        setCurrentTask(null);
        setIsEditing(false);
    };
    
    // Split tasks into active and completed groups for better visual organization
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    // --- Render Logic ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar username={user?.username} />
            
            <main className="flex-grow max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
                
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        My Task List 🚀
                    </h1>
                    <p className="mt-2 text-lg text-gray-500">
                        Stay organized and boost your productivity.
                    </p>
                </header>

                {/* Task Form Section */}
                <div className="mb-10 p-6 bg-white shadow-xl rounded-2xl border border-blue-100">
                    <TaskForm 
                        currentTask={currentTask} 
                        // Task creation and update both trigger fetchTasks to refresh the list
                        onTaskCreated={fetchTasks} 
                        onTaskUpdated={fetchTasks}
                        clearForm={handleClearForm}
                        isEditing={isEditing}
                    />
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <p className="text-center text-blue-500 font-medium text-lg">Loading tasks...</p>
                )}
                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}
                
                {/* Task List Section */}
                {!loading && !error && (
                    <div className="space-y-8">
                        
                        {/* Active Tasks */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Current Tasks ({activeTasks.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeTasks.length > 0 ? (
                                    activeTasks.map(task => (
                                        <TaskItem 
                                            key={task._id} 
                                            task={task} 
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteTask} // Use the new handler
                                            onToggleComplete={handleToggleComplete} // New handler
                                            isCurrentlyEditing={isEditing} 
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic md:col-span-3">
                                        All caught up! Time to add a new task. 🎉
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Completed Tasks */}
                        {completedTasks.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2 mt-10">
                                    Completed ({completedTasks.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
                                    {completedTasks.map(task => (
                                        <TaskItem 
                                            key={task._id} 
                                            task={task} 
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteTask} // Use the new handler
                                            onToggleComplete={handleToggleComplete} // New handler
                                            isCurrentlyEditing={isEditing}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;