// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success('Đã gửi email đặt lại mật khẩu!');
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('Email không tồn tại');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email không hợp lệ');
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <Link to="/login" className="text-decoration-none d-flex align-items-center mb-4">
                <FaArrowLeft className="me-2" />
                Quay lại đăng nhập
              </Link>
              
              <div className="text-center mb-4">
                <FaEnvelope size={50} className="text-primary mb-3" />
                <h2 className="fw-bold">Quên mật khẩu</h2>
                <p className="text-muted">
                  Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                </p>
              </div>
              
              {sent ? (
                <div className="text-center py-4">
                  <div className="alert alert-success">
                    <h5 className="alert-heading">Email đã được gửi!</h5>
                    <p className="mb-0">
                      Vui lòng kiểm tra hộp thư <strong>{email}</strong> và làm theo hướng dẫn
                    </p>
                  </div>
                  <Link to="/login" className="btn btn-primary mt-3">
                    Quay lại đăng nhập
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Email đăng ký</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi liên kết đặt lại mật khẩu'
                    )}
                  </button>
                </form>
              )}
              
              <div className="text-center mt-4">
                <p className="text-muted small">
                  Nếu không nhận được email, vui lòng kiểm tra thư mục spam
                  hoặc liên hệ hỗ trợ: <strong>support@coffeeshop.com</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;