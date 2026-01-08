// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { toast } from 'react-toastify';
import { FaEye, FaCheck, FaTruck, FaBox, FaTimes } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
      toast.error('Lỗi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      toast.error('Lỗi cập nhật trạng thái');
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: 'Chờ xử lý', icon: <FaEye /> },
      confirmed: { color: 'info', text: 'Đã xác nhận', icon: <FaCheck /> },
      shipping: { color: 'primary', text: 'Đang giao', icon: <FaTruck /> },
      delivered: { color: 'success', text: 'Đã giao', icon: <FaBox /> },
      cancelled: { color: 'danger', text: 'Đã hủy', icon: <FaTimes /> }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return (
      <span className={`badge bg-${config.color}`}>
        {config.icon && <span className="me-1">{config.icon}</span>}
        {config.text}
      </span>
    );
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

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
    <div className="container py-4">
      <h1 className="mb-4">Quản lý đơn hàng</h1>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Tổng đơn</h5>
              <h2 className="text-primary">{orders.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-warning">
            <div className="card-body text-center text-white">
              <h5 className="card-title">Chờ xử lý</h5>
              <h2>{orders.filter(o => o.status === 'pending').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-info">
            <div className="card-body text-center text-white">
              <h5 className="card-title">Đã xác nhận</h5>
              <h2>{orders.filter(o => o.status === 'confirmed').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-primary">
            <div className="card-body text-center text-white">
              <h5 className="card-title">Đang giao</h5>
              <h2>{orders.filter(o => o.status === 'shipping').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-success">
            <div className="card-body text-center text-white">
              <h5 className="card-title">Đã giao</h5>
              <h2>{orders.filter(o => o.status === 'delivered').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-danger">
            <div className="card-body text-center text-white">
              <h5 className="card-title">Đã hủy</h5>
              <h2>{orders.filter(o => o.status === 'cancelled').length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4 mb-2">
              <h5 className="mb-0">Lọc theo trạng thái:</h5>
            </div>
            <div className="col-md-8">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Tất cả
                </button>
                <button
                  className={`btn ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilterStatus('pending')}
                >
                  Chờ xử lý
                </button>
                <button
                  className={`btn ${filterStatus === 'confirmed' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => setFilterStatus('confirmed')}
                >
                  Đã xác nhận
                </button>
                <button
                  className={`btn ${filterStatus === 'shipping' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('shipping')}
                >
                  Đang giao
                </button>
                <button
                  className={`btn ${filterStatus === 'delivered' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilterStatus('delivered')}
                >
                  Đã giao
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <p className="text-muted mb-0">Không có đơn hàng nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id.substring(0, 8)}</strong>
                      </td>
                      <td>
                        <div>
                          <div>{order.shippingInfo?.fullName || 'N/A'}</div>
                          <small className="text-muted">{order.userEmail}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {order.items?.length || 0} sản phẩm
                          <div className="small text-muted">
                            {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items?.length > 2 && '...'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong className="text-danger">{formatPrice(order.total)}</strong>
                      </td>
                      <td>
                        {getStatusBadge(order.status)}
                      </td>
                      <td>
                        <small>{formatDate(order.createdAt)}</small>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Thay đổi
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusChange(order.id, 'confirmed')}
                                disabled={order.status !== 'pending'}
                              >
                                <FaCheck className="me-2" />
                                Xác nhận
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusChange(order.id, 'shipping')}
                                disabled={order.status !== 'confirmed'}
                              >
                                <FaTruck className="me-2" />
                                Đang giao
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusChange(order.id, 'delivered')}
                                disabled={order.status !== 'shipping'}
                              >
                                <FaBox className="me-2" />
                                Đã giao
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                disabled={order.status === 'cancelled' || order.status === 'delivered'}
                              >
                                <FaTimes className="me-2" />
                                Hủy đơn
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;