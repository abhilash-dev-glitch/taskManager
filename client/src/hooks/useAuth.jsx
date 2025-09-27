import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Custom hook to easily consume the AuthContext.
 * Returns the authentication state and methods (user, login, logout).
 */
const useAuth = () => {
    const context = useContext(AuthContext);

    // This check is important: it ensures the hook is only used inside the AuthProvider.
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;