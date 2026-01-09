// src/pages/Login.jsx - Thêm Facebook Login
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
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaCoffee, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false
  });
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
      
      if (error.code === 'auth/user-not-found') {
        toast.error('Tài khoản không tồn tại');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Mật khẩu không đúng');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email không hợp lệ');
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithPopup(auth, provider);
      toast.success('Đăng nhập với Google thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
      
      if (error.code === 'auth/popup-blocked') {
        toast.error('Popup bị chặn. Vui lòng cho phép popup');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.warning('Bạn đã đóng cửa sổ đăng nhập');
      } else {
        toast.error('Đăng nhập Google thất bại');
      }
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleFacebookLogin = async () => {
    setSocialLoading(prev => ({ ...prev, facebook: true }));
    
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('public_profile');
      provider.setCustomParameters({ 'display': 'popup' });
      
      await signInWithPopup(auth, provider);
      toast.success('Đăng nhập với Facebook thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập Facebook:', error);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('Email này đã được đăng ký với phương thức khác');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup bị chặn. Vui lòng cho phép popup');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.warning('Bạn đã đóng cửa sổ đăng nhập');
      } else {
        toast.error(`Đăng nhập Facebook thất bại: ${error.message}`);
      }
    } finally {
      setSocialLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 140px)', // Trừ chiều cao header và footer
      background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E8C7 100%)',
      padding: '40px 0',
      position: 'relative',
      width: '100%',
      margin: 0
    }}>
      {/* Background Coffee Beans */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '20px',
              height: '40px',
              background: '#D4A76A',
              borderRadius: '50%',
              opacity: 0.05,
              transform: `rotate(${Math.random() * 90}deg)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatBean 6s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container-fluid" style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        zIndex: 1 
      }}>
        {/* Back Button */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(60, 42, 33, 0.1)',
              border: '1px solid rgba(212, 167, 106, 0.3)',
              color: '#5C4033',
              padding: '12px 25px',
              borderRadius: '25px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 167, 106, 0.2)';
              e.currentTarget.style.borderColor = '#D4A76A';
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(60, 42, 33, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(212, 167, 106, 0.3)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <FaArrowLeft className="me-2" />
            Quay lại trang chủ
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(60, 42, 33, 0.15)',
              border: '1px solid #F5E8C7',
              maxWidth: '1100px',
              margin: '0 auto'
            }}>
              <div className="row g-0" style={{ minHeight: '600px' }}>
                {/* Left Side - Graphic */}
                <div className="col-lg-5 d-none d-lg-block" style={{
                  background: 'linear-gradient(135deg, #3C2A21 0%, #5C4033 100%)',
                  padding: '60px 50px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Animated coffee steam */}
                  <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '100px'
                  }}>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: `${20 + i * 30}px`,
                          width: '20px',
                          height: '50px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          animation: `steamRise 3s ease-in-out infinite`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  <FaCoffee style={{
                    fontSize: '80px',
                    color: '#D4A76A',
                    filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))',
                    marginBottom: '40px',
                    animation: 'float 3s ease-in-out infinite'
                  }} />
                  
                  <h2 style={{
                    color: '#F5E8C7',
                    fontFamily: "'Georgia', serif",
                    marginBottom: '20px',
                    fontSize: '2.2rem',
                    fontWeight: 'bold'
                  }}>
                    Welcome Back!
                  </h2>
                  
                  <p style={{
                    color: '#D2B48C',
                    marginBottom: '40px',
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    maxWidth: '350px'
                  }}>
                    Đăng nhập để khám phá thế giới cà phê đặc biệt của chúng tôi và nhận những ưu đãi dành riêng cho thành viên.
                  </p>
                  
                  <div style={{
                    width: '100%',
                    padding: '30px',
                    background: 'rgba(212, 167, 106, 0.1)',
                    borderRadius: '15px',
                    border: '1px solid rgba(212, 167, 106, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h4 style={{
                      color: '#F5E8C7',
                      marginBottom: '20px',
                      fontSize: '1.3rem'
                    }}>
                      Lợi ích thành viên
                    </h4>
                    
                    {[
                      'Ưu đãi đặc biệt và khuyến mãi',
                      'Theo dõi đơn hàng dễ dàng',
                      'Tích điểm và đổi quà hấp dẫn',
                      'Nhận thông báo sản phẩm mới'
                    ].map((benefit, index) => (
                      <div 
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#F5E8C7',
                          marginBottom: '15px',
                          fontSize: '0.95rem'
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          background: '#D4A76A',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '15px',
                          flexShrink: 0
                        }}>
                          <span style={{ color: '#3C2A21', fontWeight: 'bold' }}>{index + 1}</span>
                        </div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="col-lg-7" style={{ padding: '60px 50px' }}>
                  {/* Header */}
                  <div style={{ marginBottom: '40px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #D4A76A 0%, #8B7355 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <FaCoffee size={24} />
                      </div>
                      <div>
                        <h1 style={{
                          fontFamily: "'Georgia', serif",
                          color: '#3C2A21',
                          margin: 0,
                          fontSize: '28px',
                          fontWeight: 'bold'
                        }}>
                          Coffee House
                        </h1>
                        <p style={{ color: '#8B7355', margin: '5px 0 0 0', fontSize: '14px' }}>
                          Premium Coffee Experience
                        </p>
                      </div>
                    </div>
                    
                    <h2 style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#3C2A21',
                      marginBottom: '10px'
                    }}>
                      Đăng nhập tài khoản
                    </h2>
                    <p style={{ color: '#8B7355', fontSize: '1.1rem', margin: 0 }}>
                      Đăng nhập để tiếp tục trải nghiệm thế giới cà phê của chúng tôi
                    </p>
                  </div>
                  
                  {/* Social Login Buttons */}
                  <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={socialLoading.google}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          border: '2px solid #F5E8C7',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          fontWeight: 600,
                          color: '#5C4033',
                          transition: 'all 0.3s ease',
                          cursor: socialLoading.google ? 'not-allowed' : 'pointer',
                          fontSize: '16px',
                          opacity: socialLoading.google ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!socialLoading.google) {
                            e.currentTarget.style.borderColor = '#DB4437';
                            e.currentTarget.style.background = 'rgba(219, 68, 55, 0.05)';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!socialLoading.google) {
                            e.currentTarget.style.borderColor = '#F5E8C7';
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {socialLoading.google ? (
                          <>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              border: '2px solid rgba(91, 68, 49, 0.3)',
                              borderTopColor: '#5B4431',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            <span>Đang xử lý...</span>
                          </>
                        ) : (
                          <>
                            <FaGoogle size={20} />
                            <span>Google</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleFacebookLogin}
                        disabled={socialLoading.facebook}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          border: '2px solid #F5E8C7',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          fontWeight: 600,
                          color: '#5C4033',
                          transition: 'all 0.3s ease',
                          cursor: socialLoading.facebook ? 'not-allowed' : 'pointer',
                          fontSize: '16px',
                          opacity: socialLoading.facebook ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!socialLoading.facebook) {
                            e.currentTarget.style.borderColor = '#4267B2';
                            e.currentTarget.style.background = 'rgba(66, 103, 178, 0.05)';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!socialLoading.facebook) {
                            e.currentTarget.style.borderColor = '#F5E8C7';
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {socialLoading.facebook ? (
                          <>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              border: '2px solid rgba(91, 68, 49, 0.3)',
                              borderTopColor: '#5B4431',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            <span>Đang xử lý...</span>
                          </>
                        ) : (
                          <>
                            <FaFacebook size={20} />
                            <span>Facebook</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div style={{ textAlign: 'center', position: 'relative', margin: '30px 0' }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #F5E8C7, transparent)'
                      }}></div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0 20px',
                        background: 'white',
                        color: '#8B7355',
                        fontSize: '14px',
                        fontWeight: 500,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        Hoặc đăng nhập với email
                      </span>
                    </div>
                  </div>
                  
                  {/* Login Form */}
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '25px' }}>
                      <label style={{
                        display: 'block',
                        color: '#5C4033',
                        fontWeight: 600,
                        marginBottom: '10px',
                        fontSize: '15px'
                      }}>
                        <FaEnvelope style={{ marginRight: '10px', color: '#D4A76A' }} />
                        Địa chỉ email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          border: '2px solid #F5E8C7',
                          borderRadius: '12px',
                          fontSize: '16px',
                          transition: 'all 0.3s ease',
                          background: 'white',
                          color: '#3C2A21',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#D4A76A';
                          e.target.style.boxShadow = '0 0 0 4px rgba(212, 167, 106, 0.15)';
                          e.target.style.background = '#FFFCF8';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#F5E8C7';
                          e.target.style.boxShadow = 'none';
                          e.target.style.background = 'white';
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '30px' }}>
                      <label style={{
                        display: 'block',
                        color: '#5C4033',
                        fontWeight: 600,
                        marginBottom: '10px',
                        fontSize: '15px'
                      }}>
                        <FaLock style={{ marginRight: '10px', color: '#D4A76A' }} />
                        Mật khẩu
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Nhập mật khẩu của bạn"
                          style={{
                            width: '100%',
                            padding: '16px 50px 16px 20px',
                            border: '2px solid #F5E8C7',
                            borderRadius: '12px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            background: 'white',
                            color: '#3C2A21',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#D4A76A';
                            e.target.style.boxShadow = '0 0 0 4px rgba(212, 167, 106, 0.15)';
                            e.target.style.background = '#FFFCF8';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#F5E8C7';
                            e.target.style.boxShadow = 'none';
                            e.target.style.background = 'white';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#8B7355',
                            cursor: 'pointer',
                            fontSize: '18px',
                            transition: 'color 0.3s ease',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#D4A76A';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#8B7355';
                          }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <div></div>
                        <Link 
                          to="/forgot-password" 
                          style={{
                            color: '#D4A76A',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            transition: 'color 0.3s ease',
                            padding: '5px 0'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#8B7355';
                            e.target.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#D4A76A';
                            e.target.style.textDecoration = 'none';
                          }}
                        >
                          Quên mật khẩu?
                        </Link>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #D4A76A 0%, #8B7355 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '17px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: loading ? 0.7 : 1,
                        marginTop: '10px'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 15px 30px rgba(212, 167, 106, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          <span>Đang xử lý...</span>
                        </>
                      ) : (
                        <>
                          <FaCoffee />
                          <span>Đăng nhập</span>
                        </>
                      )}
                    </button>
                  </form>
                  
                  {/* Register Link */}
                  <div style={{
                    textAlign: 'center',
                    margin: '35px 0',
                    padding: '25px',
                    background: 'rgba(245, 232, 199, 0.15)',
                    borderRadius: '12px',
                    border: '1px solid rgba(212, 167, 106, 0.2)'
                  }}>
                    <p style={{ color: '#5C4033', margin: 0, fontSize: '16px' }}>
                      Chưa có tài khoản?{' '}
                      <Link 
                        to="/register" 
                        style={{
                          color: '#D4A76A',
                          textDecoration: 'none',
                          fontWeight: 600,
                          transition: 'color 0.3s ease',
                          fontSize: '16px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#8B7355';
                          e.target.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#D4A76A';
                          e.target.style.textDecoration = 'none';
                        }}
                      >
                        Tạo tài khoản mới
                      </Link>
                    </p>
                    <p style={{ color: '#8B7355', fontSize: '14px', margin: '10px 0 0 0', opacity: 0.8 }}>
                      Đăng ký chỉ mất 1 phút và mở ra nhiều đặc quyền
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes floatBean {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.05; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 0.1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes steamRise {
          0% { 
            transform: translateY(0) scale(0.5);
            opacity: 0; 
          }
          50% { 
            transform: translateY(-40px) scale(1);
            opacity: 0.3; 
          }
          100% { 
            transform: translateY(-80px) scale(0.5);
            opacity: 0; 
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Responsive Styles */
        @media (max-width: 1200px) {
          .col-lg-5, .col-lg-7 {
            padding: 50px 40px !important;
          }
        }
        
        @media (max-width: 992px) {
          .col-lg-5.d-none.d-lg-block {
            display: none !important;
          }
          
          .col-lg-7 {
            width: 100% !important;
            padding: 50px 40px !important;
          }
          
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 0 15px !important;
          }
          
          .col-lg-7 {
            padding: 40px 30px !important;
          }
          
          div[style*="padding: 60px 50px"] {
            padding: 40px 30px !important;
          }
          
          h2[style*="font-size: 2rem"] {
            font-size: 1.8rem !important;
          }
          
          h2[style*="font-size: 2.2rem"] {
            font-size: 2rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .col-lg-7 {
            padding: 30px 20px !important;
          }
          
          div[style*="padding: 60px 50px"] {
            padding: 30px 20px !important;
          }
          
          h2[style*="font-size: 2rem"] {
            font-size: 1.6rem !important;
          }
          
          h1[style*="font-size: 28px"] {
            font-size: 24px !important;
          }
          
          button[style*="padding: 16px"] {
            padding: 14px !important;
          }
          
          input[style*="padding: 16px"] {
            padding: 14px 18px !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="margin: 35px 0"] {
            padding: 20px 15px !important;
          }
          
          button[style*="padding: 18px"] {
            padding: 16px !important;
          }
        }
        
        /* Print Styles */
        @media print {
          div[style*="background:"] {
            background: white !important;
          }
          
          button, .col-lg-5 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;