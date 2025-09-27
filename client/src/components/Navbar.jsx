import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = ({ username }) => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout(); 
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900">
                                MERN Task Manager
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {username && (
                            <span className="text-gray-700 font-medium hidden sm:block">
                                Welcome, {username}!
                            </span>
                        )}
                        <button 
                            onClick={handleLogout} 
                            className="py-1 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;