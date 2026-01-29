// src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaSignOutAlt,
  FaPlus,
  FaList,
  FaHome
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: <FaTachometerAlt />
    },
    {
      path: '/admin/products',
      name: 'Sản phẩm',
      icon: <FaBox />
    },
    {
      path: '/admin/products/add',
      name: 'Thêm sản phẩm',
      icon: <FaPlus />
    },
    {
      path: '/admin/orders',
      name: 'Đơn hàng',
      icon: <FaShoppingCart />
    },
    {
      path: '/admin/users',
      name: 'Khách hàng',
      icon: <FaUsers />
    }
  ];

  return (
    <div className="admin-sidebar bg-dark text-white d-flex flex-column" style={{ minHeight: '100vh', width: '250px' }}>
      <div className="p-3 border-bottom">
        <h4 className="mb-0">Admin Panel</h4>
        <small className="text-muted">Coffee Shop</small>
      </div>

      <nav className="p-3 flex-grow-1">
        <ul className="nav nav-pills flex-column">
          {menuItems.map((item, index) => (
            <li className="nav-item mb-2" key={index}>
              <NavLink
                to={item.path}
                end={item.path === '/admin' || item.path === '/admin/products'}
                className={({ isActive }) => 
                  `nav-link text-white d-flex align-items-center`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#D4A76A' } : {}}
              >
                <span className="me-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-top">
        <NavLink 
          to="/" 
          className="nav-link text-white d-flex align-items-center mb-3"
        >
          <span className="me-3"><FaHome /></span>
          Xem trang web
        </NavLink>
        <button 
          className="nav-link text-white d-flex align-items-center w-100 border-0 bg-transparent p-0"
          onClick={handleLogout}
        >
          <span className="me-3"><FaSignOutAlt /></span>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;