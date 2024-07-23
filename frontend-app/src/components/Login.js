// src/components/Login.js
import React, { useEffect } from 'react';
import LoginForm from './LoginForm';

const Login = () => {
    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <LoginForm />
    );
};

export default Login;
