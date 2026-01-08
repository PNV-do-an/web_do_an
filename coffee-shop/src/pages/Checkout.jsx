// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { createOrder } from '../services/orderService';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);

    // Load user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setFormData(prev => ({
      ...prev,
      email: currentUser.email || '',
      fullName: currentUser.displayName || ''
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        shippingInfo: formData,
        total: calculateTotal() + 20000, // + shipping
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'paid'
      };

      const orderId = await createOrder(orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success('Đặt hàng thành công!');
      navigate(`/order-confirmation/${orderId}`);
      
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Giỏ hàng trống</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/products')}
        >
          Quay lại mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Thanh toán</h1>
      
      <div className="row">
        {/* Order Summary */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Đơn hàng của bạn</h5>
              
              {cartItems.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(20000)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between">
                <strong>Tổng cộng:</strong>
                <strong className="text-danger">
                  {formatPrice(calculateTotal() + 20000)}
                </strong>
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Thông tin giao hàng</h5>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Số điện thoại *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Địa chỉ *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Quận/Huyện</label>
                    <input
                      type="text"
                      className="form-control"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Phường/Xã</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Phương thức thanh toán</h5>
                
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={formData.paymentMethod === 'banking'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Chuyển khoản ngân hàng
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-success btn-lg w-100"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;