import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Logout: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        console.log('Logged out, isAuthenticated should be false');
        navigate('/');
    }, [navigate, setIsAuthenticated]);

    return null;
};

export default Logout;