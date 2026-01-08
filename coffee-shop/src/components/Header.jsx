// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { FaShoppingCart, FaUser, FaCoffee } from 'react-icons/fa';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Lấy số lượng giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link to="/" className="text-white text-decoration-none">
            <h1 className="h3 mb-0">
              <FaCoffee className="me-2" />
              Coffee Shop
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="d-flex align-items-center">
            <Link to="/" className="text-white text-decoration-none mx-3">
              Trang chủ
            </Link>
            <Link to="/products" className="text-white text-decoration-none mx-3">
              Sản phẩm
            </Link>
            
            {user && user.email === 'admin@coffee.com' && (
              <Link to="/admin" className="text-white text-decoration-none mx-3">
                Quản trị
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="text-white text-decoration-none mx-3 position-relative">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <FaUser className="me-2" />
                  {user.email}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/orders" className="dropdown-item">
                      Đơn hàng của tôi
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-light ms-3">
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;