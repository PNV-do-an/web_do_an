// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCartPlus } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
          {product.description?.substring(0, 100)}...
        </p>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-danger fw-bold">{formatPrice(product.price)}</span>
            <div className="d-flex align-items-center">
              <FaStar className="text-warning me-1" />
              <span>4.5</span>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <Link 
              to={`/product/${product.id}`} 
              className="btn btn-outline-primary flex-fill"
            >
              Xem chi tiết
            </Link>
            <button 
              className="btn btn-success"
              onClick={handleAddToCart}
            >
              <FaCartPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;