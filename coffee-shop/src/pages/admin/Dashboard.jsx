// src/pages/admin/Dashboard.jsx - UPDATED
import React, { useState, useEffect } from 'react';
import { getOrderStats, getRecentOrders, getTopProducts } from '../../services/orderService';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaUsers, FaDollarSign, FaBox, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load stats - xử lý lỗi riêng
      try {
        const statsData = await getOrderStats();
        setStats(statsData);
      } catch (statsError) {
        console.warn('Lỗi tải thống kê:', statsError);
        // Vẫn tiếp tục load các phần khác
      }

      // Load recent orders
      try {
        const orders = await getRecentOrders(5);
        setRecentOrders(orders);
      } catch (ordersError) {
        console.warn('Lỗi tải đơn hàng gần đây:', ordersError);
        setRecentOrders([]);
      }

      // Load top products
      try {
        const products = await getTopProducts(5);
        setTopProducts(products);
      } catch (productsError) {
        console.warn('Lỗi tải sản phẩm bán chạy:', productsError);
        setTopProducts([]);
      }

    } catch (error) {
      console.error('Lỗi tải dashboard:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      toast.error('Lỗi tải dữ liệu dashboard');
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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={loadDashboardData}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button 
          className="btn btn-outline-primary"
          onClick={loadDashboardData}
        >
          Làm mới
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Tổng đơn hàng</h5>
                  <h2>{stats.totalOrders || 0}</h2>
                </div>
                <FaShoppingCart size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Tổng doanh thu</h5>
                  <h2>{formatPrice(stats.totalRevenue || 0)}</h2>
                </div>
                <FaDollarSign size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Tổng khách hàng</h5>
                  <h2>{stats.totalUsers || 0}</h2>
                </div>
                <FaUsers size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Đơn chờ xử lý</h5>
                  <h2>{stats.pendingOrders || 0}</h2>
                </div>
                <FaBox size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders and Top Products */}
      <div className="row">
        {/* Recent Orders */}
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Đơn hàng gần đây</h5>
              <span className="badge bg-primary">
                {recentOrders.length} đơn
              </span>
            </div>
            <div className="card-body">
              {recentOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày đặt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td>
                            <strong>#{order.id?.substring(0, 8) || 'N/A'}</strong>
                          </td>
                          <td>{order.userEmail || 'N/A'}</td>
                          <td>{formatPrice(order.total || 0)}</td>
                          <td>
                            <span className={`badge bg-${order.status === 'pending' ? 'warning' : 'success'}`}>
                              {order.status === 'pending' ? 'Chờ xử lý' : 'Đã xử lý'}
                            </span>
                          </td>
                          <td>
                            {order.createdAt 
                              ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                              : 'N/A'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Chưa có đơn hàng nào</p>
                  <small>Đơn hàng mới sẽ xuất hiện ở đây</small>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Top Products */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Sản phẩm bán chạy</h5>
              <span className="badge bg-primary">
                {topProducts.length} sản phẩm
              </span>
            </div>
            <div className="card-body">
              {topProducts.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {topProducts.map((product, index) => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">{index + 1}</span>
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <small className="text-muted">{formatPrice(product.price || 0)}</small>
                        </div>
                      </div>
                      <span className="badge bg-success rounded-pill">
                        {product.totalSold || 0} đã bán
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Chưa có sản phẩm bán chạy</p>
                  <small>Thêm sản phẩm nổi bật để hiển thị</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;