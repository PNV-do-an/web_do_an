// src/App.jsx - Updated với đầy đủ routes
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

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';

// Layout Components
const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            
            {/* Protected Routes */}
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            
            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
            
            {/* Admin Routes with Layout */}
            <Route path="/admin" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </PrivateRoute>
            } />
            
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
            
            <Route path="/admin/orders" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </PrivateRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <Footer />
        
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;