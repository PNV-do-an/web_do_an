// src/components/Header.jsx - FIXED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { FaShoppingCart, FaUser, FaCoffee, FaCog, FaSignOutAlt, FaBox } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Load cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));

    // Event listener cho cập nhật giỏ hàng
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    // Close dropdown khi click ra ngoài
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      window.removeEventListener('cartUpdated', handleCartUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Đăng xuất thành công!');
      navigate('/login');
      setShowDropdown(false);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      toast.error('Lỗi đăng xuất');
    }
  };

  // Kiểm tra có phải admin không
  const isAdmin = user && user.email === 'admin@coffee.com';

  return (
    <header className="bg-dark text-white py-3 shadow sticky-top">
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
            
            {/* Admin Link */}
            {isAdmin && (
              <Link to="/admin" className="text-white text-decoration-none mx-3">
                <FaCog className="me-1" />
                Admin
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

            {/* User Dropdown - CUSTOM DROPDOWN */}
            {user ? (
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FaUser className="me-2" />
                  {isAdmin ? 'Admin' : user.email?.split('@')[0]}
                </button>
                
                {showDropdown && (
                  <div className="dropdown-menu show" style={{
                    position: 'absolute',
                    inset: '0px auto auto 0px',
                    margin: '0px',
                    transform: 'translate(-100px, 40px)'
                  }}>
                    <Link 
                      to="/orders" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaBox className="me-2" />
                      Đơn hàng của tôi
                    </Link>
                    
                    {isAdmin && (
                      <>
                        <Link 
                          to="/admin" 
                          className="dropdown-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FaCog className="me-2" />
                          Dashboard
                        </Link>
                        <Link 
                          to="/admin/products" 
                          className="dropdown-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          Quản lý sản phẩm
                        </Link>
                        <Link 
                          to="/admin/orders" 
                          className="dropdown-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          Quản lý đơn hàng
                        </Link>
                      </>
                    )}
                    
                    <div className="dropdown-divider"></div>
                    
                    <button 
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
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