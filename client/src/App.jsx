import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext'; // NEW IMPORT
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import useAuth from './hooks/useAuth'; 
import './index.css'; 

// Component to protect routes
const ProtectedRoute = ({ element }) => {
    // Note: useAuth implicitly handles loading/initial check
    const { user } = useAuth();
    
    // Renders the protected element, wrapped in TaskProvider, if user is authenticated
    return user ? (
        <TaskProvider>{element}</TaskProvider>
    ) : (
        <Navigate to="/login" replace />
    );
};

function App() {
    return (
        // AuthProvider wraps everything as it's the root of authentication
        <AuthProvider>
            <Router>
                {/* Tailwind CSS base class for the entire app */}
                <div className="App min-h-screen bg-gray-50"> 
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        {/* Protected route using the ProtectedRoute component */}
                        <Route 
                            path="/" 
                            element={<ProtectedRoute element={<DashboardPage />} />} 
                        />
                        
                        {/* Catch-all route to redirect to the dashboard (or login if not authenticated) */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;