// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = auth.currentUser;
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra admin
  const isAdmin = user.email === 'admin@coffee.com';
  
  if (adminOnly && !isAdmin) {
    // Nếu không phải admin, chuyển về trang chủ
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;