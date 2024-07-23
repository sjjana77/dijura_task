// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  // If token is in localStorage, mark user as authenticated
  if (token) {
    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/react_task" />;
    }
    return children;
  } else {
    return <Navigate to="/react_task" />;
  }
};

export default ProtectedRoute;
