// src/App.jsx - FULL CODE ĐÃ SỬA
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import OrderConfirmation from './pages/OrderConfirmation';
import BankTransferConfirmation from './pages/BankTransferConfirmation';
import QrPayment from './pages/QrPayment';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Layout Components
const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-3 p-md-4">
        <div className="container-fluid">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('App.js - Auth state changed:');
      console.log('User email:', currentUser?.email);
      console.log('User UID:', currentUser?.uid);
      console.log('Is admin?', currentUser?.email === 'admin@coffee.com');
      
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'admin@coffee.com');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Đang tải ứng dụng..." />;
  }

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        {/* Header không hiển thị trong admin layout */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Header />} />
        </Routes>
        
        <main className="flex-grow-1">
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<div className="container py-5"><h1>Giới thiệu</h1></div>} />
            <Route path="/contact" element={<div className="container py-5"><h1>Liên hệ</h1></div>} />

            {/* ========== PROTECTED ROUTES ========== */}
            {/* Checkout */}
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            
            {/* Orders */}
            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
            
            {/* Order Detail */}
            <Route path="/order/:orderId" element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            } />
            
            {/* Order Confirmation */}
            <Route path="/order-confirmation/:orderId" element={
              <PrivateRoute>
                <OrderConfirmation />
              </PrivateRoute>
            } />
            
            {/* Bank Transfer Confirmation */}
            <Route path="/bank-transfer-confirmation" element={
              <PrivateRoute>
                <BankTransferConfirmation />
              </PrivateRoute>
            } />
            
            {/* QR Payment */}
            <Route path="/qr-payment" element={
              <PrivateRoute>
                <QrPayment />
              </PrivateRoute>
            } />
            
            {/* ========== ADMIN ROUTES ========== */}
            {/* Dashboard */}
            <Route path="/admin" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </PrivateRoute>
            } />
            
            {/* Products Management */}
            <Route path="/admin/products" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </PrivateRoute>
            } />
            
            <Route path="/admin/products/add" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <AddProduct />
                </AdminLayout>
              </PrivateRoute>
            } />
            
            <Route path="/admin/products/edit/:id" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <EditProduct />
                </AdminLayout>
              </PrivateRoute>
            } />
            
            {/* Orders Management */}
            <Route path="/admin/orders" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </PrivateRoute>
            } />
            
            {/* Users Management (tùy chọn) */}
            <Route path="/admin/users" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </PrivateRoute>
            } />
            
            {/* ========== ERROR ROUTES ========== */}
            {/* 404 Not Found */}
            <Route path="/404" element={
              <div className="container py-5 text-center">
                <h1 className="display-1">404</h1>
                <p className="lead">Trang không tồn tại</p>
                <a href="/" className="btn btn-primary">Về trang chủ</a>
              </div>
            } />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        
        {/* Footer không hiển thị trong admin layout */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
        
        {/* Toast Container - Hiển thị ở mọi trang */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="shadow-sm"
          bodyClassName="fw-normal"
        />
      </div>
    </Router>
  );
}

export default App;