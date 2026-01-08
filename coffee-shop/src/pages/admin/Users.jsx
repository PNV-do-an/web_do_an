// src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Lấy users từ orders (tạm thời)
      // Trong thực tế, bạn nên tạo collection users riêng
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      
      const usersMap = new Map();
      snapshot.forEach(doc => {
        const order = doc.data();
        if (order.userId && !usersMap.has(order.userId)) {
          usersMap.set(order.userId, {
            id: order.userId,
            email: order.userEmail,
            name: order.shippingInfo?.fullName || 'Khách hàng',
            lastOrder: order.createdAt,
            orderCount: 1
          });
        } else if (order.userId) {
          const user = usersMap.get(order.userId);
          user.orderCount += 1;
          if (new Date(order.createdAt) > new Date(user.lastOrder)) {
            user.lastOrder = order.createdAt;
          }
        }
      });
      
      setUsers(Array.from(usersMap.values()));
    } catch (error) {
      console.error('Lỗi tải users:', error);
      toast.error('Lỗi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
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
    <div className="container py-4">
      <h1 className="mb-4">Quản lý khách hàng</h1>

      <div className="row mb-4">
        <div className="col-md-3 col-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Tổng khách hàng</h5>
              <h2>{users.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Đơn hàng trung bình</h5>
              <h2>
                {users.length > 0 
                  ? (users.reduce((sum, user) => sum + user.orderCount, 0) / users.length).toFixed(1)
                  : 0
                }
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Số đơn hàng</th>
                  <th>Đơn hàng cuối</th>
                  <th>Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <p className="text-muted mb-0">Chưa có khách hàng nào</p>
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                               style={{ width: '40px', height: '40px' }}>
                            <FaUser />
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            <div className="small text-muted">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaEnvelope className="me-2 text-muted" />
                          {user.email}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary">{user.orderCount}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-muted" />
                          {formatDate(user.lastOrder)}
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">Đang cập nhật...</strong>
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

export default Users;