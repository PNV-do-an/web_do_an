// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { toast } from 'react-toastify';
import { FaStar, FaArrowLeft } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Không tìm thấy sản phẩm');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Đã thêm vào giỏ hàng!');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <p>Sản phẩm không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button 
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" />
        Quay lại
      </button>

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          
          <div className="d-flex align-items-center mb-3">
            <FaStar className="text-warning me-1" />
            <FaStar className="text-warning me-1" />
            <FaStar className="text-warning me-1" />
            <FaStar className="text-warning me-1" />
            <FaStar className="text-warning me-1" />
            <span className="ms-2">(4.5/5)</span>
          </div>

          <div className="mb-3">
            <span className="text-danger fw-bold fs-3">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="mb-4">
            <h5>Mô tả</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          <div className="mb-4">
            <h5>Danh mục</h5>
            <span className="badge bg-primary">{product.category}</span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <h5>Số lượng</h5>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="mx-3 fs-5">{quantity}</span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary btn-lg flex-fill"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
            <button
              className="btn btn-success btn-lg flex-fill"
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;