// src/components/LoadingSpinner.jsx
import React from 'react';
import { FaCoffee } from 'react-icons/fa';

const LoadingSpinner = ({ message = "Đang tải..." }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mb-4">
          <FaCoffee size={48} className="text-primary" />
        </div>
        <h3 className="text-primary mb-2">Coffee Shop</h3>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;