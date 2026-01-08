// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getOrderStats, getRecentOrders, getTopProducts } from '../../services/orderService';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaUsers, FaDollarSign, FaBox } from 'react-icons/fa';

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsData = await getOrderStats();
      setStats(statsData);

      // Load recent orders
      const orders = await getRecentOrders(5);
      setRecentOrders(orders);

      // Load top products
      const products = await getTopProducts(5);
      setTopProducts(products);

    } catch (error) {
      console.error('Lỗi tải dashboard:', error);
      toast.error('Lỗi tải dữ liệu');
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
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Tổng đơn hàng</h5>
                  <h2>{stats.totalOrders}</h2>
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
                  <h2>{formatPrice(stats.totalRevenue)}</h2>
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
                  <h2>{stats.totalUsers}</h2>
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
                  <h2>{stats.pendingOrders}</h2>
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
            <div className="card-header">
              <h5 className="mb-0">Đơn hàng gần đây</h5>
            </div>
            <div className="card-body">
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
                        <td>#{order.id.substring(0, 8)}</td>
                        <td>{order.userEmail}</td>
                        <td>{formatPrice(order.total)}</td>
                        <td>
                          <span className={`badge bg-${order.status === 'pending' ? 'warning' : 'success'}`}>
                            {order.status === 'pending' ? 'Chờ xử lý' : 'Đã xử lý'}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Products */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Sản phẩm bán chạy</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {topProducts.map((product, index) => (
                  <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="me-2">{index + 1}.</span>
                      {product.name}
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      {product.totalSold} đã bán
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;