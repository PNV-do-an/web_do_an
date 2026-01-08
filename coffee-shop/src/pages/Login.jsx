// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Đăng nhập với Google thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
      toast.error(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Đăng nhập với Facebook thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập Facebook:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Đăng nhập</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
              
              <div className="text-center mb-3">
                <span className="text-muted">Hoặc đăng nhập với</span>
              </div>
              
              <div className="d-grid gap-2 mb-4">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle className="me-2" />
                  Google
                </button>
                
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleFacebookLogin}
                >
                  <FaFacebook className="me-2" />
                  Facebook
                </button>
              </div>
              
              <div className="text-center">
                <p className="mb-0">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;