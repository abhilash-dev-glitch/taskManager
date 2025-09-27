import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Base API URL for authentication
const API_URL = 'http://localhost:3000/api/auth/';

export const AuthProvider = ({ children }) => {
    // Initialize user state from Local Storage on initial load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Login Function ---
    const login = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(API_URL + 'login', userData);
            
            // 1. Set user state
            const loggedInUser = response.data;
            setUser(loggedInUser); 
            
            // 2. 🔑 Save user and token to Local Storage
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            setLoading(false);
            return loggedInUser;

        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Login failed: Network Error';
            setError(errorMessage);
            return null;
        }
    };
    
    // --- Register Function ---
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(API_URL + 'register', userData);
            
            // 1. Set user state
            const registeredUser = response.data;
            setUser(registeredUser);

            // 2. 🔑 Save user and token to Local Storage
            localStorage.setItem('user', JSON.stringify(registeredUser));

            setLoading(false);
            return registeredUser;

        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Registration failed: Network Error';
            setError(errorMessage);
            return null;
        }
    };

    // --- Logout Function ---
    const logout = () => {
        // 1. 🗑️ Remove user from Local Storage
        localStorage.removeItem('user');
        
        // 2. Clear user state
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;