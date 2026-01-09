import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { getOrderById } from '../services/orderService';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPrint, FaWhatsapp, FaBox, FaTruck, FaCheckCircle, FaHome, FaMoneyBillWave, FaCreditCard, FaQrcode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Lỗi tải chi tiết đơn hàng:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
      navigate('/orders');
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

  const getStatusText = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xử lý', icon: '⏳', color: '#ffc107' },
      processing: { text: 'Đang xử lý', icon: '⚙️', color: '#0dcaf0' },
      confirmed: { text: 'Đã xác nhận', icon: '✅', color: '#198754' },
      shipping: { text: 'Đang giao hàng', icon: '🚚', color: '#6f42c1' },
      delivered: { text: 'Đã giao hàng', icon: '🎉', color: '#198754' },
      cancelled: { text: 'Đã hủy', icon: '❌', color: '#dc3545' }
    };
    return statusMap[status] || { text: status, icon: '📦', color: '#6c757d' };
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'cod': return <FaMoneyBillWave className="me-2" />;
      case 'banking': return <FaCreditCard className="me-2" />;
      case 'qrcode': return <FaQrcode className="me-2" />;
      default: return <FaCreditCard className="me-2" />;
    }
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

  if (!order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Không tìm thấy đơn hàng
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>
          Quay lại
        </button>
      </div>
    );
  }

  const statusInfo = getStatusText(order.status);

  return (
    <div className="order-detail-page" style={{
      padding: '2rem 0',
      minHeight: '100vh',
      background: '#FFFCF8'
    }}>
      <div className="container py-5">
        {/* Navigation */}
        <div className="mb-4">
          <button 
            className="back-button"
            onClick={() => navigate('/orders')}
            style={{
              background: 'white',
              border: '2px solid #D4A76A',
              color: '#D4A76A',
              borderRadius: '30px',
              padding: '10px 25px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D4A76A';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(212, 167, 106, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#D4A76A';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaArrowLeft className="me-2" />
            Quay lại danh sách đơn hàng
          </button>
          
          <nav aria-label="breadcrumb" style={{
            background: 'transparent',
            padding: '0.75rem 0'
          }}>
            <ol className="breadcrumb" style={{ margin: 0 }}>
              <li className="breadcrumb-item">
                <Link to="/" style={{
                  color: '#8B7355',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaHome className="me-1" />
                  Trang chủ
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/orders" style={{
                  color: '#8B7355',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}>
                  Đơn hàng của tôi
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page" style={{
                color: '#3C2A21',
                fontWeight: '600'
              }}>
                Chi tiết đơn hàng
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Order Header Card */}
            <div className="order-header-card" style={{
              background: 'white',
              borderRadius: '15px',
              border: '1px solid #F5E8C7',
              boxShadow: '0 4px 20px rgba(60, 42, 33, 0.1)',
              marginBottom: '2rem',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(60, 42, 33, 0.05) 0%, rgba(139, 115, 85, 0.05) 100%)',
                padding: '1.5rem',
                borderBottom: '1px solid #F5E8C7'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h4 className="mb-1" style={{ color: '#3C2A21' }}>
                      Đơn hàng #{order.id.substring(0, 8).toUpperCase()}
                    </h4>
                    <p className="text-muted mb-0" style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '10px' }}>📅</span>
                      Ngày đặt: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div style={{
                    background: statusInfo.color,
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{statusInfo.icon}</span>
                    {statusInfo.text}
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div style={{ padding: '1.5rem' }}>
                <h5 className="mb-3" style={{ 
                  color: '#3C2A21',
                  position: 'relative',
                  paddingBottom: '10px'
                }}>
                  Chi tiết sản phẩm
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '50px',
                    height: '3px',
                    background: '#D4A76A',
                    borderRadius: '2px'
                  }}></span>
                </h5>
                {order.items && order.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #F5E8C7',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.background = 'rgba(245, 232, 199, 0.1)';
                    e.currentTarget.style.borderRadius = '10px';
                    e.currentTarget.style.paddingLeft = '10px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderRadius = '0';
                    e.currentTarget.style.paddingLeft = '0';
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        marginRight: '1rem',
                        border: '2px solid #F5E8C7'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div>
                          <h6 className="mb-1" style={{ color: '#3C2A21', fontWeight: '600' }}>
                            {item.name}
                          </h6>
                          <div style={{ color: '#8B7355', fontSize: '0.9rem' }}>
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#D4A76A', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div style={{ color: '#8B7355', fontSize: '0.85rem' }}>
                            {formatPrice(item.price)}/sản phẩm
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Order Summary */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="row">
                    <div className="col-md-6 offset-md-6">
                      <div style={{
                        border: '1px solid #F5E8C7',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        background: 'white',
                        boxShadow: '0 4px 15px rgba(60, 42, 33, 0.08)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ color: '#5C4033' }}>Tạm tính:</span>
                          <span style={{ color: '#3C2A21', fontWeight: '500' }}>
                            {formatPrice(order.total - (order.paymentMethod === 'cod' ? 20000 : 0))}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ color: '#5C4033' }}>Phí vận chuyển:</span>
                          <span style={{ color: order.paymentMethod === 'cod' ? '#D4A76A' : '#198754', fontWeight: '500' }}>
                            {order.paymentMethod === 'cod' ? formatPrice(20000) : 'Miễn phí'}
                          </span>
                        </div>
                        <hr style={{ margin: '1rem 0', borderColor: '#F5E8C7' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: '#3C2A21', fontSize: '1.1rem' }}>Tổng cộng:</strong>
                          <strong style={{ 
                            color: '#D4A76A', 
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                          }}>
                            {formatPrice(order.total)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Info Sidebar */}
          <div className="col-lg-4">
            {/* Shipping Info Card */}
            <div className="info-card" style={{
              background: 'white',
              borderRadius: '15px',
              border: '1px solid #F5E8C7',
              boxShadow: '0 4px 20px rgba(60, 42, 33, 0.1)',
              marginBottom: '1.5rem',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #F5E8C7 0%, #FFF8F0 100%)',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #F5E8C7'
              }}>
                <h5 className="mb-0" style={{ 
                  color: '#3C2A21',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaTruck style={{ color: '#D4A76A' }} />
                  Thông tin giao hàng
                </h5>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <strong style={{ 
                    color: '#5C4033',
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '0.95rem'
                  }}>
                    Người nhận
                  </strong>
                  <div style={{ 
                    color: '#3C2A21',
                    fontWeight: '500',
                    fontSize: '1.05rem'
                  }}>
                    {order.shippingInfo?.fullName}
                  </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <strong style={{ 
                    color: '#5C4033',
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '0.95rem'
                  }}>
                    Số điện thoại
                  </strong>
                  <div style={{ 
                    color: '#3C2A21',
                    fontWeight: '500',
                    fontSize: '1.05rem'
                  }}>
                    {order.shippingInfo?.phone}
                  </div>
                </div>
                <div style={{ marginBottom: order.shippingInfo?.note ? '1.25rem' : '0' }}>
                  <strong style={{ 
                    color: '#5C4033',
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '0.95rem'
                  }}>
                    Địa chỉ
                  </strong>
                  <div style={{ 
                    color: '#3C2A21',
                    lineHeight: '1.6'
                  }}>
                    {order.shippingInfo?.address}
                    {order.shippingInfo?.district && `, ${order.shippingInfo.district}`}
                    {order.shippingInfo?.city && `, ${order.shippingInfo.city}`}
                    {order.shippingInfo?.ward && `, ${order.shippingInfo.ward}`}
                  </div>
                </div>
                {order.shippingInfo?.note && (
                  <div>
                    <strong style={{ 
                      color: '#5C4033',
                      display: 'block',
                      marginBottom: '5px',
                      fontSize: '0.95rem'
                    }}>
                      Ghi chú
                    </strong>
                    <p style={{ 
                      margin: 0,
                      color: '#8B7355',
                      fontStyle: 'italic',
                      padding: '10px',
                      background: '#FFF8F0',
                      borderRadius: '8px',
                      borderLeft: '3px solid #D4A76A'
                    }}>
                      {order.shippingInfo.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Info Card */}
            <div className="info-card" style={{
              background: 'white',
              borderRadius: '15px',
              border: '1px solid #F5E8C7',
              boxShadow: '0 4px 20px rgba(60, 42, 33, 0.1)',
              marginBottom: '1.5rem',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #F5E8C7 0%, #FFF8F0 100%)',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #F5E8C7'
              }}>
                <h5 className="mb-0" style={{ 
                  color: '#3C2A21',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaCreditCard style={{ color: '#D4A76A' }} />
                  Thông tin thanh toán
                </h5>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <strong style={{ 
                    color: '#5C4033',
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '0.95rem'
                  }}>
                    Phương thức
                  </strong>
                  <div style={{ 
                    color: '#3C2A21',
                    fontWeight: '500',
                    fontSize: '1.05rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {getPaymentMethodIcon(order.paymentMethod)}
                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
                     order.paymentMethod === 'banking' ? 'Chuyển khoản ngân hàng' :
                     order.paymentMethod === 'qrcode' ? 'QR Code' : 'Thanh toán'}
                  </div>
                </div>
                <div>
                  <strong style={{ 
                    color: '#5C4033',
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '0.95rem'
                  }}>
                    Trạng thái thanh toán
                  </strong>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 15px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    background: order.paymentStatus === 'paid' 
                      ? 'linear-gradient(135deg, #198754, #28a745)' 
                      : 'linear-gradient(135deg, #ffc107, #fd7e14)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    {order.paymentStatus === 'paid' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons Card */}
            <div className="action-card" style={{
              background: 'white',
              borderRadius: '15px',
              border: '1px solid #F5E8C7',
              boxShadow: '0 4px 20px rgba(60, 42, 33, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1.5rem' }}>
                <button className="action-button" style={{
                  background: 'white',
                  border: '2px solid #28a745',
                  color: '#28a745',
                  borderRadius: '30px',
                  padding: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginBottom: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#28a745';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#28a745';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <FaWhatsapp className="me-2" />
                  Liên hệ hỗ trợ
                </button>
                <button className="action-button" style={{
                  background: 'white',
                  border: '2px solid #6c757d',
                  color: '#6c757d',
                  borderRadius: '30px',
                  padding: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6c757d';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(108, 117, 125, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#6c757d';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <FaPrint className="me-2" />
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        {order.status !== 'cancelled' && (
          <div className="timeline-section mt-5">
            <div className="timeline-card" style={{
              background: 'white',
              borderRadius: '15px',
              border: '1px solid #F5E8C7',
              boxShadow: '0 4px 20px rgba(60, 42, 33, 0.1)',
              padding: '2rem',
              marginTop: '2rem'
            }}>
              <h5 className="mb-4" style={{ 
                color: '#3C2A21',
                position: 'relative',
                paddingBottom: '10px'
              }}>
                Tiến trình đơn hàng
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '50px',
                  height: '3px',
                  background: '#D4A76A',
                  borderRadius: '2px'
                }}></span>
              </h5>
              
              <div style={{ position: 'relative', paddingLeft: '30px' }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '15px',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  background: '#F5E8C7'
                }}></div>
                
                {[
                  { status: 'pending', label: 'Đơn hàng đã đặt', time: order.createdAt },
                  { status: 'processing', label: 'Đang xử lý', time: order.updatedAt },
                  { status: 'confirmed', label: 'Đã xác nhận', time: order.status === 'confirmed' || order.status === 'shipping' || order.status === 'delivered' ? order.updatedAt : null },
                  { status: 'shipping', label: 'Đang giao hàng', time: order.status === 'shipping' || order.status === 'delivered' ? order.updatedAt : null },
                  { status: 'delivered', label: 'Đã giao hàng', time: order.status === 'delivered' ? order.updatedAt : null }
                ].map((step, index) => {
                  const isActive = ['pending', 'processing', 'confirmed', 'shipping', 'delivered']
                    .indexOf(step.status) <= ['pending', 'processing', 'confirmed', 'shipping', 'delivered']
                    .indexOf(order.status);
                  
                  return (
                    <div key={index} style={{ 
                      position: 'relative',
                      marginBottom: '2rem',
                      paddingLeft: '30px'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: '-15px',
                        top: '0',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: isActive ? '#D4A76A' : '#F5E8C7',
                        border: '3px solid white',
                        boxShadow: '0 0 0 3px ' + (isActive ? '#D4A76A' : '#F5E8C7'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        zIndex: 2,
                        transition: 'all 0.3s ease'
                      }}>
                        {isActive ? '✓' : (index + 1)}
                      </div>
                      <div>
                        <h6 style={{ 
                          color: isActive ? '#3C2A21' : '#8B7355',
                          marginBottom: '5px',
                          fontWeight: isActive ? '600' : '400'
                        }}>
                          {step.label}
                        </h6>
                        {step.time && (
                          <p style={{ 
                            color: '#8B7355',
                            fontSize: '0.85rem',
                            margin: 0
                          }}>
                            {formatDate(step.time)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Responsive Styles */}
        <style jsx="true">{`
          @media (max-width: 768px) {
            .order-header-card {
              margin-bottom: 1.5rem;
            }
            
            .info-card, .action-card {
              margin-bottom: 1.5rem;
            }
            
            .timeline-card {
              padding: 1.5rem;
            }
            
            .action-button {
              padding: 10px !important;
              font-size: 0.9rem;
            }
          }
          
          @media (max-width: 576px) {
            .back-button {
              width: 100%;
              justify-content: center;
            }
            
            .breadcrumb {
              font-size: 0.9rem;
            }
            
            .order-detail-page .container {
              padding-left: 15px;
              padding-right: 15px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrderDetail;