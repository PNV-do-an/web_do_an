// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaShoppingBag, 
  FaCheckCircle, 
  FaTimesCircle,
  FaCrown,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Lấy tất cả đơn hàng để tổng hợp user data
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      
      const userMap = new Map();
      
      // Process orders để lấy thông tin user
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const userId = order.userId;
        const userEmail = order.userEmail;
        
        if (userId && userEmail) {
          if (!userMap.has(userId)) {
            userMap.set(userId, {
              id: userId,
              email: userEmail,
              name: order.shippingInfo?.fullName || userEmail.split('@')[0],
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: null,
              isAdmin: userEmail === 'admin@coffee.com'
            });
          }
          
          const userData = userMap.get(userId);
          userData.totalOrders++;
          userData.totalSpent += order.total || 0;
          
          const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          if (!userData.lastOrderDate || orderDate > userData.lastOrderDate) {
            userData.lastOrderDate = orderDate;
          }
        }
      });
      
      // Chuyển Map thành Array và sắp xếp
      const usersArray = Array.from(userMap.values());
      usersArray.sort((a, b) => b.totalOrders - a.totalOrders);
      
      setUsers(usersArray);
    } catch (error) {
      console.error('Lỗi tải users:', error);
      toast.error('Không thể tải danh sách người dùng');
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

  const formatDate = (date) => {
    if (!date) return 'Chưa có đơn hàng';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      filterRole === 'all' ||
      (filterRole === 'admin' && user.isAdmin) ||
      (filterRole === 'customer' && !user.isAdmin);
    
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.isAdmin).length,
    totalCustomers: users.filter(u => !u.isAdmin).length,
    totalRevenue: users.reduce((sum, user) => sum + user.totalSpent, 0),
    avgOrdersPerUser: users.length > 0 ? (users.reduce((sum, user) => sum + user.totalOrders, 0) / users.length).toFixed(1) : 0
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-2">
            <FaUsers className="me-3 text-primary" />
            Quản lý người dùng
          </h1>
          <p className="text-muted mb-0">Quản lý và theo dõi người dùng hệ thống</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={loadUsers}
        >
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Tổng người dùng</h5>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <FaUsers size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Khách hàng</h5>
                  <h2 className="mb-0">{stats.totalCustomers}</h2>
                </div>
                <FaUser size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Tổng doanh thu</h5>
                  <h4 className="mb-0">{formatPrice(stats.totalRevenue)}</h4>
                </div>
                <FaShoppingBag size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Đơn hàng/người</h5>
                  <h2 className="mb-0">{stats.avgOrdersPerUser}</h2>
                </div>
                <FaCheckCircle size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo email hoặc tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaFilter />
                </span>
                <select
                  className="form-select"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">Tất cả người dùng</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="customer">Khách hàng</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Danh sách người dùng ({filteredUsers.length})</h5>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Thông tin</th>
                <th>Số đơn hàng</th>
                <th>Tổng chi tiêu</th>
                <th>Đơn hàng cuối</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <FaUser className="text-muted mb-2" size={40} />
                    <p className="text-muted">Không tìm thấy người dùng</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px' }}>
                          <FaUser />
                        </div>
                        <div>
                          <strong className="d-block">{user.name}</strong>
                          <small className="text-muted">
                            <FaEnvelope className="me-1" />
                            {user.email}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary rounded-pill">
                        {user.totalOrders} đơn
                      </span>
                    </td>
                    <td>
                      <strong className="text-success">{formatPrice(user.totalSpent)}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaCalendar className="me-2 text-muted" />
                        <span>{formatDate(user.lastOrderDate)}</span>
                      </div>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <span className="badge bg-danger">
                          <FaCrown className="me-1" />
                          Admin
                        </span>
                      ) : (
                        <span className="badge bg-success">
                          <FaUser className="me-1" />
                          Khách hàng
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => toast.info('Tính năng đang phát triển')}
                        >
                          Xem chi tiết
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => toast.info('Tính năng đang phát triển')}
                        >
                          Khóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="card-footer bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Hiển thị {filteredUsers.length} người dùng
                </small>
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <button className="page-link">«</button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">2</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">3</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">»</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* User Stats Summary */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h6 className="mb-0">Top khách hàng thân thiết</h6>
            </div>
            <div className="card-body">
              {users
                .filter(u => !u.isAdmin)
                .slice(0, 5)
                .map((user, index) => (
                  <div key={user.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="text-primary fw-bold me-3">#{index + 1}</div>
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-success">{formatPrice(user.totalSpent)}</div>
                      <small className="text-muted">{user.totalOrders} đơn hàng</small>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h6 className="mb-0">Thống kê người dùng</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <div className="text-primary fs-3 fw-bold">{stats.totalUsers}</div>
                  <small className="text-muted">Tổng số</small>
                </div>
                <div className="col-4">
                  <div className="text-success fs-3 fw-bold">{stats.totalCustomers}</div>
                  <small className="text-muted">Khách hàng</small>
                </div>
                <div className="col-4">
                  <div className="text-danger fs-3 fw-bold">{stats.totalAdmins}</div>
                  <small className="text-muted">Admin</small>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${(stats.totalCustomers / stats.totalUsers) * 100}%` }}
                  >
                    Khách hàng ({stats.totalCustomers})
                  </div>
                  <div 
                    className="progress-bar bg-danger" 
                    role="progressbar" 
                    style={{ width: `${(stats.totalAdmins / stats.totalUsers) * 100}%` }}
                  >
                    Admin ({stats.totalAdmins})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;