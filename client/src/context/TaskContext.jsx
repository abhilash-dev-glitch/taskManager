import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // Use the custom hook we created

const TaskContext = createContext();

const API_URL = 'https://task-manager-epxz.vercel.app/api/tasks/';

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Configuration for authenticated requests
    const config = {
        headers: { 
            Authorization: `Bearer ${user?.token}` 
        }
    };

    /**
     * Fetches tasks from the backend and updates state.
     */
    const fetchTasks = async () => {
        if (!user || !user.token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(API_URL, config);
            const sortedTasks = response.data.sort((a, b) => a.completed - b.completed);
            setTasks(sortedTasks);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError('Failed to load tasks.');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };
    
    // In a full implementation, you'd add async functions for
    // addTask, updateTask, and deleteTask here, calling fetchTasks 
    // after a successful mutation to refresh the list.
    
    // Example:
    /*
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(API_URL + taskId, config);
            fetchTasks(); // Refresh list
        } catch (error) {
            setError('Could not delete task.');
        }
    };
    */

    useEffect(() => {
        // Fetch tasks whenever the user logs in
        if (user) {
            fetchTasks();
        } else {
            setTasks([]); // Clear tasks on logout
        }
    }, [user]);

    return (
        <TaskContext.Provider value={{ tasks, loading, error, fetchTasks }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskContext;

// Optional: Create a custom hook for TaskContext for easy consumption
export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};