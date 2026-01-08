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
  FaList
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
    <div className="admin-sidebar bg-dark text-white" style={{ minHeight: '100vh', width: '250px' }}>
      <div className="p-3 border-bottom">
        <h4 className="mb-0">Admin Panel</h4>
        <small className="text-muted">Coffee Shop</small>
      </div>

      <nav className="p-3">
        <ul className="nav nav-pills flex-column">
          {menuItems.map((item, index) => (
            <li className="nav-item mb-2" key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link text-white d-flex align-items-center ${isActive ? 'bg-primary' : ''}`
                }
              >
                <span className="me-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="position-absolute bottom-0 w-100 p-3 border-top">
        <button
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;