// src/pages/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
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
      <div className="container py-5 text-center">
        <h2 className="text-danger mb-4">Không tìm thấy đơn hàng</h2>
        <Link to="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-success">
            <div className="card-body p-5 text-center">
              {/* Success Icon */}
              <div className="mb-4">
                <FaCheckCircle size={80} className="text-success" />
              </div>

              {/* Title */}
              <h1 className="mb-3">Đặt hàng thành công!</h1>
              <p className="text-muted mb-4">
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
              </p>

              {/* Order Info */}
              <div className="card bg-light mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Thông tin đơn hàng</h5>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <strong>Mã đơn hàng:</strong>
                      <p className="text-primary">#{order.id.substring(0, 8)}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Ngày đặt:</strong>
                      <p>{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Tổng tiền:</strong>
                      <p className="text-danger fs-5">{formatPrice(order.total)}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Trạng thái:</strong>
                      <p>
                        <span className="badge bg-warning">Chờ xử lý</span>
                      </p>
                    </div>
                    <div className="col-md-12 mb-2">
                      <strong>Phương thức thanh toán:</strong>
                      <p>{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="card bg-light mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Thông tin giao hàng</h5>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <strong>Họ tên:</strong>
                      <p>{order.shippingInfo?.fullName}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Số điện thoại:</strong>
                      <p>{order.shippingInfo?.phone}</p>
                    </div>
                    <div className="col-12 mb-2">
                      <strong>Địa chỉ:</strong>
                      <p>{order.shippingInfo?.address}</p>
                    </div>
                    {order.shippingInfo?.note && (
                      <div className="col-12 mb-2">
                        <strong>Ghi chú:</strong>
                        <p>{order.shippingInfo.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card bg-light mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Sản phẩm đã đặt</h5>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Đơn giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  className="rounded me-3"
                                />
                                <div>
                                  <strong>{item.name}</strong>
                                </div>
                              </div>
                            </td>
                            <td>{item.quantity}</td>
                            <td>{formatPrice(item.price)}</td>
                            <td>{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end">
                            <strong>Tạm tính:</strong>
                          </td>
                          <td>{formatPrice(order.total - 20000)}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="text-end">
                            <strong>Phí vận chuyển:</strong>
                          </td>
                          <td>{formatPrice(20000)}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="text-end">
                            <strong>Tổng cộng:</strong>
                          </td>
                          <td className="text-danger fs-5">{formatPrice(order.total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <Link to="/" className="btn btn-primary btn-lg">
                  <FaHome className="me-2" />
                  Về trang chủ
                </Link>
                <Link to="/products" className="btn btn-success btn-lg">
                  <FaShoppingBag className="me-2" />
                  Tiếp tục mua sắm
                </Link>
                <Link to="/orders" className="btn btn-outline-primary btn-lg">
                  Xem đơn hàng của tôi
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-5">
                <p className="text-muted small">
                  Chúng tôi sẽ liên hệ với bạn qua số điện thoại để xác nhận đơn hàng trong vòng 24 giờ.
                  <br />
                  Mọi thắc mắc vui lòng liên hệ hotline: <strong>1900 1234</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;