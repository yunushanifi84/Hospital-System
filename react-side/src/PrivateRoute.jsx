import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {

        if (!token) navigate('/');
    }, [])

    return token ? children : <Navigate to='/' />
}

export default PrivateRoute