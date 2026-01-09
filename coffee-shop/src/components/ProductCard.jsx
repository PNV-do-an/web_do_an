// src/components/ProductCard.jsx - COFFEE SHOP PREMIUM
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { 
  FaStar, 
  FaCartPlus, 
  FaCoffee, 
  FaFire, 
  FaLeaf, 
  FaRegHeart,
  FaHeart,
  FaEye,
  FaClock,
  FaMugHot
} from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Espresso':
        return <FaFire className="coffee-category-icon" />;
      case 'Cà phê phin':
        return <FaMugHot className="coffee-category-icon" />;
      case 'Cold Brew':
        return <FaLeaf className="coffee-category-icon" />;
      default:
        return <FaCoffee className="coffee-category-icon" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Espresso':
        return 'coffee-category-espresso';
      case 'Cà phê phin':
        return 'coffee-category-traditional';
      case 'Cold Brew':
        return 'coffee-category-coldbrew';
      default:
        return 'coffee-category-other';
    }
  };

  return (
    <div 
      className={`coffee-product-card ${isHovered ? 'coffee-card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="coffee-product-image-container">
        <img
          src={product.image}
          className="coffee-product-image"
          alt={product.name}
        />
        
        {/* Product Badges */}
        <div className="coffee-product-badges">
          {product.isPopular && (
            <span className="coffee-badge coffee-badge-popular">
              <FaFire className="me-1" />
              Phổ biến
            </span>
          )}
          {product.isNew && (
            <span className="coffee-badge coffee-badge-new">
              Mới
            </span>
          )}
          {product.discount && (
            <span className="coffee-badge coffee-badge-discount">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Product Category */}
        <div className="coffee-product-category">
          <span className={`coffee-category-tag ${getCategoryColor(product.category)}`}>
            {getCategoryIcon(product.category)}
            {product.category}
          </span>
        </div>

        {/* Quick Actions */}
        <div className={`coffee-quick-actions ${isHovered ? 'show' : ''}`}>
          <button 
            className="coffee-quick-action-btn coffee-quick-view"
            onClick={() => setShowQuickView(true)}
            title="Xem nhanh"
          >
            <FaEye />
          </button>
          <button 
            className={`coffee-quick-action-btn coffee-quick-favorite ${isFavorite ? 'active' : ''}`}
            onClick={handleFavorite}
            title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Add to Cart Button */}
        <button 
          className={`coffee-add-to-cart-btn ${isHovered ? 'show' : ''}`}
          onClick={handleAddToCart}
        >
          <FaCartPlus className="me-2" />
          Thêm vào giỏ
        </button>
      </div>

      {/* Product Info */}
      <div className="coffee-product-info">
        <div className="coffee-product-header">
          <h3 className="coffee-product-title">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="coffee-product-description">
            {product.description?.substring(0, 80)}...
          </p>
        </div>

        <div className="coffee-product-meta">
          {/* Rating */}
          <div className="coffee-product-rating">
            <div className="coffee-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                  key={star}
                  className={star <= product.rating ? "coffee-star-filled" : "coffee-star-empty"}
                />
              ))}
            </div>
            <span className="coffee-rating-text">
              {product.rating}/5 ({product.reviewCount || 0} đánh giá)
            </span>
          </div>

          {/* Brew Time */}
          {product.brewTime && (
            <div className="coffee-brew-time">
              <FaClock className="me-1" />
              <span>{product.brewTime} phút</span>
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="coffee-product-footer">
          <div className="coffee-price-section">
            <div className="coffee-current-price">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="coffee-original-price">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          
          <div className="coffee-action-buttons">
            <Link 
              to={`/product/${product.id}`} 
              className="coffee-detail-btn"
            >
              Chi tiết
            </Link>
          </div>
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="coffee-stock-warning">
            ⚠️ Chỉ còn {product.stock} sản phẩm
          </div>
        )}
        {product.stock === 0 && (
          <div className="coffee-stock-out">
            🔴 Hết hàng
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="coffee-quick-view-modal">
          <div className="coffee-quick-view-content">
            <button 
              className="coffee-close-quick-view"
              onClick={() => setShowQuickView(false)}
            >
              &times;
            </button>
            <div className="row">
              <div className="col-md-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="img-fluid rounded"
                />
              </div>
              <div className="col-md-6">
                <h4>{product.name}</h4>
                <p className="text-muted">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="text-danger mb-0">{formatPrice(product.price)}</h5>
                    {product.originalPrice && (
                      <del className="text-muted">{formatPrice(product.originalPrice)}</del>
                    )}
                  </div>
                  <button 
                    className="btn coffee-btn-primary"
                    onClick={handleAddToCart}
                  >
                    <FaCartPlus className="me-2" />
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;