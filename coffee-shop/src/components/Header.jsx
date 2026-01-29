// src/components/Header.jsx - COFFEE SHOP PREMIUM
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import './Header.css';
import { 
  FaShoppingCart, 
  FaUser, 
  FaCoffee, 
  FaCog, 
  FaSignOutAlt, 
  FaBox, 
  FaBell,
  FaRegBell,
  FaTimes,
  FaCheck,
  FaHome,
  FaStore,
  FaUserTie,
  FaUsers
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // HÀM LOAD THÔNG BÁO
  const loadNotifications = (userId) => {
    if (!userId) return;
    
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifList = [];
        let unread = 0;
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const notification = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
          };
          
          notifList.push(notification);
          if (!data.isRead) {
            unread++;
          }
        });
        
        setNotifications(notifList);
        setUnreadCount(unread);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Lỗi load thông báo:', error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadNotifications(currentUser.uid);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    // Load cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));

    // Event listener cho cập nhật giỏ hàng
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    };

    // Event listener cho thông báo mới
    const handleNewNotification = (event) => {
      if (user && event.detail && event.detail.userId === user.uid) {
        if (user) loadNotifications(user.uid);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('notificationAdded', handleNewNotification);

    // Close dropdown khi click ra ngoài
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribeAuth();
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('notificationAdded', handleNewNotification);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user]);

  // Đánh dấu đã đọc thông báo
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: new Date()
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true } 
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = async () => {
    try {
      const batch = notifications
        .filter(notif => !notif.isRead)
        .map(async (notification) => {
          const notificationRef = doc(db, 'notifications', notification.id);
          await updateDoc(notificationRef, {
            isRead: true,
            readAt: new Date()
          });
        });
      
      await Promise.all(batch);
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  // Xóa thông báo
  const deleteNotification = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { 
        isDeleted: true,
        deletedAt: new Date()
      });
      
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
      });
      
      toast.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      toast.error('Có lỗi xảy ra');
    }
  };
  
  // Hiển thị chi tiết thông báo
  const showNotificationDetail = (notification) => {
    toast.info(
      <div className="coffee-notification-detail p-3">
        <div className="d-flex align-items-center mb-3">
          <div className={`coffee-icon-circle p-2 me-3 ${notification.isRead ? 'bg-brown-light' : 'bg-coffee'}`}>
            <span className="fs-5">{notification.icon || '☕'}</span>
          </div>
          <div>
            <h5 className="mb-1 fw-bold text-brown-dark">{notification.title}</h5>
            <small className="text-brown">
              {formatTime(notification.createdAt)}
            </small>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-0 text-brown">{notification.message}</p>
        </div>
        
        {notification.orderId && (
          <div className="coffee-alert mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-brown-dark">
                <strong>📦 Mã đơn hàng:</strong> #{notification.orderId.slice(-8).toUpperCase()}
              </div>
              <button 
                className="btn btn-sm coffee-btn-primary"
                onClick={() => {
                  toast.dismiss();
                  navigate(`/orders/${notification.orderId}`);
                }}
              >
                Xem đơn hàng
              </button>
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-sm coffee-btn-outline"
            onClick={() => {
              toast.dismiss();
              deleteNotification(notification.id);
            }}
          >
            <FaTimes className="me-1" /> Xóa
          </button>
          
          {!notification.isRead && (
            <button 
              className="btn btn-sm coffee-btn-primary"
              onClick={() => {
                toast.dismiss();
                markAsRead(notification.id);
              }}
            >
              <FaCheck className="me-1" /> Đánh dấu đã đọc
            </button>
          )}
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        closeButton: true,
        className: 'coffee-toast'
      }
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Đăng xuất thành công!');
      navigate('/login');
      setShowDropdown(false);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      toast.error('Lỗi đăng xuất');
    }
  };

  // Kiểm tra có phải admin không
  const isAdmin = user && user.email === 'admin@coffee.com';

  // Format thời gian
  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <header className="coffee-header">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo Coffee Shop */}
          <Link to="/" className="coffee-logo">
            <div className="d-flex align-items-center">
              <div className="coffee-icon-wrapper me-2">
                <FaCoffee className="coffee-main-icon" />
              </div>
              <div>
                <h1 className="coffee-shop-title mb-0">Coffee House</h1>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="d-flex align-items-center coffee-nav">
            <Link to="/" className="coffee-nav-link">
              <FaHome className="me-2" />
              <span>Trang chủ</span>
            </Link>
            <Link to="/products" className="coffee-nav-link">
              <FaStore className="me-2" />
              <span>Sản phẩm</span>
            </Link>
            
            {/* Admin Link */}
            {isAdmin && (
              <Link to="/admin" className="coffee-nav-link coffee-admin-link">
                <FaUserTie className="me-2" />
                <span>Quản trị</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="coffee-cart-btn position-relative mx-3">
              <div className="coffee-cart-icon">
                <FaShoppingCart />
              </div>
              {cartCount > 0 && (
                <span className="coffee-cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications Bell */}
            {user && (
              <div className="dropdown coffee-notification-wrapper mx-3" ref={notificationsRef}>
                <button
                  className="coffee-notification-btn position-relative"
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <div className="coffee-bell-icon">
                    {unreadCount > 0 ? (
                      <FaBell className="coffee-bell-active" />
                    ) : (
                      <FaRegBell />
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <span className="coffee-notification-badge">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="coffee-notification-dropdown show">
                    <div className="coffee-notification-header">
                      <h6 className="coffee-notification-title">
                        <FaBell className="me-2" />
                        Thông báo
                      </h6>
                      {unreadCount > 0 && (
                        <button 
                          className="coffee-btn-sm coffee-btn-outline"
                          onClick={markAllAsRead}
                        >
                          <FaCheck className="me-1" />
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                    
                    {notifications.length > 0 ? (
                      <div className="coffee-notification-list">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`coffee-notification-item ${!notification.isRead ? 'coffee-notification-unread' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              
                              if (!notification.isRead) {
                                markAsRead(notification.id);
                              }
                              
                              setShowNotifications(false);
                              showNotificationDetail(notification);
                            }}
                          >
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className={`coffee-notification-icon ${notification.isRead ? 'bg-brown-light' : 'bg-coffee'}`}>
                                  <span>{notification.icon || '☕'}</span>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                  <h6 className={`coffee-notification-text ${notification.isRead ? 'text-brown' : 'text-brown-dark fw-bold'}`}>
                                    {notification.title}
                                  </h6>
                                  <button
                                    className="coffee-notification-delete"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    title="Xóa thông báo"
                                  >
                                    <FaTimes size={12} />
                                  </button>
                                </div>
                                <p className="coffee-notification-message mb-1">{notification.message}</p>
                                <small className="coffee-notification-time">
                                  {formatTime(notification.createdAt)}
                                </small>
                                {!notification.isRead && (
                                  <span className="coffee-badge-new">Mới</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="coffee-notification-empty">
                        <FaBell className="coffee-empty-icon mb-3" />
                        <p className="coffee-empty-text mb-0">Không có thông báo</p>
                        <small className="coffee-empty-subtext">Thông báo mới sẽ xuất hiện ở đây</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Dropdown */}
            {user ? (
              <div className="dropdown coffee-user-dropdown" ref={dropdownRef}>
                <button
                  className="coffee-user-btn"
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="coffee-user-avatar">
                    <FaUser />
                  </div>
                  <span className="coffee-user-name">
                    {isAdmin ? 'Quản trị viên' : user.email?.split('@')[0]}
                  </span>
                </button>
                
                {showDropdown && (
                  <div className="coffee-user-menu show">
                    <div className="coffee-user-info">
                      <div className="coffee-user-avatar-large">
                        <FaUser />
                      </div>
                      <div>
                        <h6 className="coffee-user-name-large mb-1">{isAdmin ? 'Quản trị viên' : user.email?.split('@')[0]}</h6>
                        <small className="coffee-user-email text-brown">{user.email}</small>
                      </div>
                    </div>
                    
                    <div className="coffee-menu-items">
                      <Link 
                        to="/orders" 
                        className="coffee-menu-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaBox className="me-2" />
                        <span>Đơn hàng của tôi</span>
                      </Link>
                      
                      {isAdmin && (
                        <>
                          <Link 
                            to="/admin" 
                            className="coffee-menu-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaCog className="me-2" />
                            <span>Dashboard</span>
                          </Link>
                          <Link 
                            to="/admin/products" 
                            className="coffee-menu-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaStore className="me-2" />
                            <span>Quản lý sản phẩm</span>
                          </Link>
                          <Link 
                            to="/admin/orders" 
                            className="coffee-menu-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaShoppingCart className="me-2" />
                            <span>Quản lý đơn hàng</span>
                          </Link>
                          <Link 
                            to="/admin/users" 
                            className="coffee-menu-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaUsers className="me-2" />
                            <span>Quản lý người dùng</span>
                          </Link>
                        </>
                      )}
                      
                      <div 
                        className="coffee-menu-item coffee-menu-logout"
                        onClick={handleLogout}
                        role="button"
                        style={{ cursor: 'pointer' }}
                      >
                        <FaSignOutAlt className="me-2" />
                        <span>Đăng xuất</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="coffee-login-btn">
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