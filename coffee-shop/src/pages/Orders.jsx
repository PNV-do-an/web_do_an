// src/pages/Orders.jsx - HOÀN THIỆN
import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { getUserOrders } from '../services/orderService';
import { toast } from 'react-toastify';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaReceipt, FaEye, FaHome, FaShoppingBag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Vui lòng đăng nhập để xem đơn hàng');
        navigate('/login');
        return;
      }
      
      const userOrders = await getUserOrders(user.uid);
      // Sắp xếp theo thời gian mới nhất
      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(userOrders);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = typeof dateString === 'string' 
      ? new Date(dateString) 
      : dateString?.toDate ? dateString.toDate() : new Date();
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: '⏳ Chờ xử lý', icon: <FaClock className="me-1" /> },
      processing: { color: 'info', text: '⚙️ Đang xử lý', icon: <FaClock className="me-1" /> },
      confirmed: { color: 'primary', text: '✅ Đã xác nhận', icon: <FaCheckCircle className="me-1" /> },
      shipping: { color: 'info', text: '🚚 Đang giao', icon: <FaTruck className="me-1" /> },
      delivered: { color: 'success', text: '🎉 Đã giao', icon: <FaCheckCircle className="me-1" /> },
      cancelled: { color: 'danger', text: '❌ Đã hủy', icon: <FaTimesCircle className="me-1" /> }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status, icon: null };
    
    return (
      <span className={`badge bg-${config.color} d-inline-flex align-items-center`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const viewOrderDetail = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-4">Đang tải danh sách đơn hàng...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">
                  <FaHome className="me-1" />
                  Trang chủ
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <FaBox className="me-2" />
                Đơn hàng của tôi
              </li>
            </ol>
          </nav>
          
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">
              <FaBox className="me-3 text-primary" />
              Đơn hàng của tôi
            </h1>
            <div>
              <Link to="/products" className="btn btn-outline-primary me-2">
                <FaShoppingBag className="me-2" />
                Tiếp tục mua sắm
              </Link>
              <button 
                className="btn btn-primary"
                onClick={loadOrders}
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>
          </div>
          
          <p className="text-muted mt-2">
            Quản lý và theo dõi tất cả đơn hàng của bạn tại đây
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <FaBox size={80} className="text-muted mb-4" />
            <h3 className="mb-3">Chưa có đơn hàng nào</h3>
            <p className="text-muted mb-4">
              Bạn chưa đặt đơn hàng nào. Hãy khám phá menu và thưởng thức những ly cà phê tuyệt vời!
            </p>
            <Link to="/products" className="btn btn-primary btn-lg px-4">
              <FaShoppingBag className="me-2" />
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info d-flex align-items-center">
                <FaReceipt className="me-3 fs-4" />
                <div>
                  <strong>Bạn có {orders.length} đơn hàng</strong>
                  <p className="mb-0 small">Nhấn vào "Xem chi tiết" để xem thông tin đầy đủ về đơn hàng</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {orders.map((order) => (
              <div key={order.id} className="col-12 mb-4">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-white border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">
                          <strong>Đơn hàng:</strong> #{order.id.substring(0, 8).toUpperCase()}
                          {order.orderNumber && (
                            <span className="text-muted ms-2">({order.orderNumber})</span>
                          )}
                        </h5>
                        <p className="text-muted mb-0">
                          <small>Ngày đặt: {formatDate(order.createdAt)}</small>
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="row">
                      {/* Products */}
                      <div className="col-md-6">
                        <h6>Sản phẩm đã đặt:</h6>
                        <div className="mb-3">
                          {order.items && order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="rounded me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <div className="small">{item.name}</div>
                                <div className="text-muted small">
                                  {item.quantity} × {formatPrice(item.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {order.items && order.items.length > 3 && (
                            <div className="text-muted small">
                              +{order.items.length - 3} sản phẩm khác
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Order Info */}
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted d-block">Tổng tiền</small>
                            <strong className="text-danger fs-5">{formatPrice(order.total)}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Phương thức</small>
                            <strong>
                              {order.paymentMethod === 'cod' ? '💰 COD' : 
                               order.paymentMethod === 'banking' ? '🏦 Chuyển khoản' : 
                               order.paymentMethod === 'qrcode' ? '📱 QR Code' : 
                               '💳 Thanh toán'}
                            </strong>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <small className="text-muted d-block">Địa chỉ giao hàng</small>
                          <div className="small">
                            {order.shippingInfo?.address && (
                              <>
                                {order.shippingInfo.address}
                                {order.shippingInfo.district && `, ${order.shippingInfo.district}`}
                                {order.shippingInfo.city && `, ${order.shippingInfo.city}`}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer bg-white border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">
                          Người nhận: <strong>{order.shippingInfo?.fullName || order.userEmail}</strong>
                        </small>
                      </div>
                      <div>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => viewOrderDetail(order.id)}
                        >
                          <FaEye className="me-2" />
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="text-primary fs-3 fw-bold">{orders.length}</div>
                      <div className="text-muted">Tổng đơn hàng</div>
                    </div>
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="text-success fs-3 fw-bold">
                        {formatPrice(orders.reduce((sum, order) => sum + (order.total || 0), 0))}
                      </div>
                      <div className="text-muted">Tổng tiền đã mua</div>
                    </div>
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="text-warning fs-3 fw-bold">
                        {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
                      </div>
                      <div className="text-muted">Đang xử lý</div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-success fs-3 fw-bold">
                        {orders.filter(o => o.status === 'delivered').length}
                      </div>
                      <div className="text-muted">Đã giao</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;