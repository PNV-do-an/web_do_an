// src/pages/Orders.jsx - HOÀN THIỆN
import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { getUserOrders } from '../services/orderService';
import { toast } from 'react-toastify';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaReceipt, FaEye, FaHome, FaShoppingBag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Thêm import CSS

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
      <div className="orders-container">
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mt-4">Đang tải danh sách đơn hàng...</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb" className="orders-breadcrumb">
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
            
            <div className="orders-header d-flex justify-content-between align-items-center">
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
                  className="btn btn-primary refresh-btn"
                  onClick={loadOrders}
                  disabled={loading}
                >
                  {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>
            
            <p className="text-muted mt-2 orders-subtitle">
              Quản lý và theo dõi tất cả đơn hàng của bạn tại đây
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="empty-orders-card card shadow-sm border-0">
            <div className="card-body text-center py-5">
              <FaBox size={80} className="text-muted mb-4 empty-icon" />
              <h3 className="mb-3">Chưa có đơn hàng nào</h3>
              <p className="text-muted mb-4">
                Bạn chưa đặt đơn hàng nào. Hãy khám phá menu và thưởng thức những ly cà phê tuyệt vời!
              </p>
              <Link to="/products" className="btn btn-primary btn-lg px-4 explore-btn">
                <FaShoppingBag className="me-2" />
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="row mb-4">
              <div className="col-12">
                <div className="alert alert-info d-flex align-items-center orders-alert">
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
                  <div className="order-card card shadow-sm border-0">
                    <div className="card-header bg-white border-bottom">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1 order-id">
                            <strong>Đơn hàng:</strong> #{order.id.substring(0, 8).toUpperCase()}
                            {order.orderNumber && (
                              <span className="text-muted ms-2">({order.orderNumber})</span>
                            )}
                          </h5>
                          <p className="text-muted mb-0 order-date">
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
                          <h6 className="order-section-title">Sản phẩm đã đặt:</h6>
                          <div className="mb-3">
                            {order.items && order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="d-flex align-items-center mb-2 order-item">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="rounded me-2 product-image"
                                  />
                                )}
                                <div>
                                  <div className="small product-name">{item.name}</div>
                                  <div className="text-muted small product-details">
                                    {item.quantity} × {formatPrice(item.price)}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {order.items && order.items.length > 3 && (
                              <div className="text-muted small more-products">
                                +{order.items.length - 3} sản phẩm khác
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Order Info */}
                        <div className="col-md-6">
                          <div className="row order-info-row">
                            <div className="col-6">
                              <small className="text-muted d-block">Tổng tiền</small>
                              <strong className="text-danger fs-5 total-price">{formatPrice(order.total)}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Phương thức</small>
                              <strong className="payment-method">
                                {order.paymentMethod === 'cod' ? '💰 COD' : 
                                 order.paymentMethod === 'banking' ? '🏦 Chuyển khoản' : 
                                 order.paymentMethod === 'qrcode' ? '📱 QR Code' : 
                                 '💳 Thanh toán'}
                              </strong>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <small className="text-muted d-block">Địa chỉ giao hàng</small>
                            <div className="small shipping-address">
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
                    
                    <div className="card-footer bg-white border-top order-footer">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">
                            Người nhận: <strong className="receiver-name">{order.shippingInfo?.fullName || order.userEmail}</strong>
                          </small>
                        </div>
                        <div>
                          <button 
                            className="btn btn-primary btn-sm view-detail-btn"
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
                <div className="orders-summary card border-0 bg-light">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-3 mb-3 mb-md-0 summary-item">
                        <div className="text-primary fs-3 fw-bold summary-value">{orders.length}</div>
                        <div className="text-muted summary-label">Tổng đơn hàng</div>
                      </div>
                      <div className="col-md-3 mb-3 mb-md-0 summary-item">
                        <div className="text-success fs-3 fw-bold summary-value">
                          {formatPrice(orders.reduce((sum, order) => sum + (order.total || 0), 0))}
                        </div>
                        <div className="text-muted summary-label">Tổng tiền đã mua</div>
                      </div>
                      <div className="col-md-3 mb-3 mb-md-0 summary-item">
                        <div className="text-warning fs-3 fw-bold summary-value">
                          {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
                        </div>
                        <div className="text-muted summary-label">Đang xử lý</div>
                      </div>
                      <div className="col-md-3 summary-item">
                        <div className="text-success fs-3 fw-bold summary-value">
                          {orders.filter(o => o.status === 'delivered').length}
                        </div>
                        <div className="text-muted summary-label">Đã giao</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .orders-container {
          min-height: 70vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
        }
        
        .orders-breadcrumb {
          background: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }
        
        .orders-breadcrumb .breadcrumb-item a {
          color: #6c757d;
          transition: color 0.3s ease;
        }
        
        .orders-breadcrumb .breadcrumb-item a:hover {
          color: #0d6efd;
          text-decoration: none;
        }
        
        .orders-breadcrumb .breadcrumb-item.active {
          color: #0d6efd;
          font-weight: 500;
        }
        
        .orders-header {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          margin-bottom: 1rem;
        }
        
        .orders-subtitle {
          color: #6c757d;
          font-size: 0.95rem;
        }
        
        .refresh-btn {
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
        }
        
        .empty-orders-card {
          background: white;
          border-radius: 16px;
          margin: 2rem 0;
          transition: transform 0.3s ease;
        }
        
        .empty-orders-card:hover {
          transform: translateY(-5px);
        }
        
        .empty-icon {
          color: #dee2e6 !important;
        }
        
        .explore-btn {
          border-radius: 8px;
          padding: 0.75rem 2rem;
          transition: all 0.3s ease;
        }
        
        .explore-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
        }
        
        .orders-alert {
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #d1ecf1 0%, #c1e7f1 100%);
          border-left: 4px solid #0dcaf0;
        }
        
        .order-card {
          border-radius: 12px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .order-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important;
          border-color: #0d6efd;
        }
        
        .order-card .card-header {
          border-bottom: 2px solid #f8f9fa;
          padding: 1rem 1.5rem;
        }
        
        .order-id {
          color: #212529;
          font-weight: 600;
        }
        
        .order-date {
          font-size: 0.85rem;
        }
        
        .order-section-title {
          color: #495057;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .order-item {
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        
        .order-item:hover {
          background-color: #f8f9fa;
        }
        
        .product-image {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border: 1px solid #dee2e6;
        }
        
        .product-name {
          font-weight: 500;
          color: #495057;
        }
        
        .product-details {
          font-size: 0.8rem;
        }
        
        .more-products {
          font-style: italic;
        }
        
        .order-info-row {
          margin-bottom: 1rem;
        }
        
        .total-price {
          font-weight: 700;
        }
        
        .payment-method {
          color: #0d6efd;
        }
        
        .shipping-address {
          color: #495057;
          line-height: 1.4;
        }
        
        .order-footer {
          background: #f8fafc;
          padding: 0.75rem 1.5rem;
        }
        
        .receiver-name {
          color: #212529;
        }
        
        .view-detail-btn {
          border-radius: 6px;
          padding: 0.375rem 1rem;
          transition: all 0.3s ease;
        }
        
        .view-detail-btn:hover {
          background-color: #0b5ed7;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
        }
        
        .orders-summary {
          border-radius: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e9ecef;
        }
        
        .summary-item {
          padding: 1rem;
        }
        
        .summary-value {
          margin-bottom: 0.5rem;
        }
        
        .summary-label {
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .orders-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .order-card .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .summary-item {
            margin-bottom: 1.5rem;
          }
          
          .product-image {
            width: 35px;
            height: 35px;
          }
        }
        
        /* Animation for loading */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .order-card {
          animation: fadeIn 0.5s ease-out;
        }
        
        /* Status badges custom colors */
        .badge.bg-warning {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          color: #000;
        }
        
        .badge.bg-success {
          background: linear-gradient(135deg, #198754 0%, #157347 100%);
        }
        
        .badge.bg-danger {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }
        
        .badge.bg-info {
          background: linear-gradient(135deg, #0dcaf0 0%, #0ba5c7 100%);
        }
        
        .badge.bg-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
        }
      `}</style>
    </div>
  );
};

export default Orders;