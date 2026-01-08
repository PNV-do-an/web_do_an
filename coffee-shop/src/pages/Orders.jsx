// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { getUserOrders } from '../services/orderService';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Vui lòng đăng nhập');
        return;
      }
      
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
      toast.error('Lỗi tải đơn hàng');
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
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: 'Chờ xử lý' },
      confirmed: { color: 'info', text: 'Đã xác nhận' },
      shipping: { color: 'primary', text: 'Đang giao' },
      delivered: { color: 'success', text: 'Đã giao' },
      cancelled: { color: 'danger', text: 'Đã hủy' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <span className={`badge bg-${config.color}`}>{config.text}</span>;
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

  return (
    <div className="container py-5">
      <h1 className="mb-4">Đơn hàng của tôi</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày đặt</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.substring(0, 8)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    {order.items.length} sản phẩm
                  </td>
                  <td>{formatPrice(order.total)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {/* Xem chi tiết */}}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;