// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    // Listen for cart updates
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    toast.success('Đã xóa sản phẩm');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
    toast.success('Đã xóa giỏ hàng');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <h2 className="mb-4">Giỏ hàng trống</h2>
          <p className="text-muted mb-4">Hãy thêm sản phẩm vào giỏ hàng!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Giỏ hàng của bạn</h1>
      
      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              {cartItems.map(item => (
                <div key={item.id} className="d-flex align-items-center border-bottom pb-3 mb-3">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded me-3"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  
                  {/* Product Info */}
                  <div className="flex-fill">
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="text-danger fw-bold mb-0">{formatPrice(item.price)}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="d-flex align-items-center me-4">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  {/* Total Price */}
                  <div className="text-end me-4">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              
              <button
                className="btn btn-outline-danger mt-3"
                onClick={clearCart}
              >
                Xóa giỏ hàng
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="card-title mb-4">Tóm tắt đơn hàng</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Số sản phẩm:</span>
                <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(20000)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <strong>Tổng cộng:</strong>
                <strong className="text-danger fs-5">
                  {formatPrice(calculateTotal() + 20000)}
                </strong>
              </div>
              
              <button
                className="btn btn-success w-100 btn-lg"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </button>
              
              <button
                className="btn btn-outline-primary w-100 mt-3"
                onClick={() => navigate('/products')}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;