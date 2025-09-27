import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Added .jsx extension to help the bundler resolve the module path correctly.
import useAuth from '../hooks/useAuth.jsx'; 

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Destructure the login function from the context
    const { login, loading } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

       
        const userData = { username, password };

        try {
            // Pass the single object to the login function
            const result = await login(userData); 
            
            // Assuming AuthContext returns the user object on success
            if (result && result._id) { 
                navigate('/'); 
            } else {
                // This line should technically be unreachable if AuthContext throws on failure,
                // but it's a safe fallback.
                setError('Login failed. Please check your credentials.');
            }

        } catch (err) {
            console.error('Login attempt failed with error:', err);
            
            // This pulls the error message from the AuthContext state or provides a generic fallback
            let errorMessage = 'Login failed.';
            
            if (err.response && err.response.data && err.response.data.message) {
                // Use the specific error message from the backend (e.g., 'Invalid credentials')
                errorMessage = err.response.data.message; 
            } else if (err.message) {
                 // Use the message thrown by the AuthContext provider
                errorMessage = err.message;
            }
            
            // If the server crashed (500), we tell the user the server is having issues.
            if (err.response?.status === 500) {
                errorMessage = 'Server error (500). Please check the backend console.';
            }

            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-900">
                    Task Manager Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 transition duration-150"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 transition duration-150"
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 text-white font-bold rounded-lg transition duration-200 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
                {/* Displaying the error state */}
                {error && <p className="text-center text-sm p-2 bg-red-100 text-red-700 rounded-md border border-red-300">{error}</p>}

                <p className="text-center text-sm text-gray-600 pt-2">
                    Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;