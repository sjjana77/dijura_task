import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem('token');
  // If token is in localStorage, mark user as authenticated
  if (token) {
    return children;
  } else {
    return <Navigate to="/react_task" />;
  }
};

export default ProtectedRoute;

