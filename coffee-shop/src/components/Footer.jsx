// src/components/Footer.jsx - COFFEE SHOP PREMIUM
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaCoffee,
  FaLeaf,
  FaGlassCheers,
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaFileContract
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="coffee-footer">
      <div className="coffee-footer-top">
        <div className="container">
          <div className="row">
            {/* Coffee Beans Decoration */}
            <div className="col-12 text-center mb-4">
              <div className="coffee-beans-decoration">
                <div className="coffee-bean"></div>
                <div className="coffee-bean"></div>
                <div className="coffee-bean"></div>
                <FaCoffee className="coffee-footer-icon" />
                <div className="coffee-bean"></div>
                <div className="coffee-bean"></div>
                <div className="coffee-bean"></div>
              </div>
            </div>

            {/* Company Info */}
            <div className="col-lg-4 mb-5">
              <div className="coffee-footer-brand">
                <div className="coffee-footer-logo mb-3">
                  <FaCoffee className="coffee-logo-icon" />
                  <h3 className="coffee-shop-name">Coffee House</h3>
                </div>
                <p className="coffee-footer-description">
                  "Mỗi giọt cà phê là một câu chuyện, mỗi ly cà phê là một trải nghiệm. 
                  Chúng tôi cam kết mang đến hương vị tuyệt hảo từ những hạt cà phê 
                  được tuyển chọn kỹ lưỡng và rang xay mỗi ngày."
                </p>
                <div className="coffee-social-links mt-4">
                  <a href="#" className="coffee-social-link coffee-facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" className="coffee-social-link coffee-instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="coffee-social-link coffee-twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="coffee-social-link coffee-tiktok">
                    <FaCoffee />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-5">
              <h4 className="coffee-footer-title">Khám phá</h4>
              <ul className="coffee-footer-menu">
                <li>
                  <Link to="/" className="coffee-footer-link">
                    <FaCoffee className="me-2 coffee-link-icon" />
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="coffee-footer-link">
                    <FaCoffee className="me-2 coffee-link-icon" />
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="coffee-footer-link">
                    <FaCoffee className="me-2 coffee-link-icon" />
                    Giỏ hàng
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="coffee-footer-link">
                    <FaCoffee className="me-2 coffee-link-icon" />
                    Đơn hàng
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="coffee-footer-link">
                    <FaCoffee className="me-2 coffee-link-icon" />
                    Về chúng tôi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coffee Categories */}
            <div className="col-lg-2 col-md-6 mb-5">
              <h4 className="coffee-footer-title">Thực đơn</h4>
              <ul className="coffee-footer-menu">
                <li>
                  <a href="#" className="coffee-footer-link">
                    <FaCoffee className="me-2" />
                    <span className="coffee-category-name">Espresso</span>
                    <span className="coffee-category-badge">Phổ biến</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="coffee-footer-link">
                    <FaLeaf className="me-2" />
                    <span className="coffee-category-name">Cà phê phin</span>
                    <span className="coffee-category-badge coffee-badge-new">Mới</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="coffee-footer-link">
                    <FaGlassCheers className="me-2" />
                    <span className="coffee-category-name">Cold Brew</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="coffee-footer-link">
                    <FaCoffee className="me-2" />
                    <span className="coffee-category-name">Trà đặc biệt</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="coffee-footer-link">
                    <FaCoffee className="me-2" />
                    <span className="coffee-category-name">Bánh ngọt</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4 mb-5">
              <h4 className="coffee-footer-title">Liên hệ</h4>
              <div className="coffee-contact-info">
                <div className="coffee-contact-item">
                  <div className="coffee-contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="coffee-contact-details">
                    <h6 className="coffee-contact-title">Địa chỉ</h6>
                    <p className="coffee-contact-text">
                      123 Đường Cà Phê, Quận 1<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
                
                <div className="coffee-contact-item">
                  <div className="coffee-contact-icon">
                    <FaPhone />
                  </div>
                  <div className="coffee-contact-details">
                    <h6 className="coffee-contact-title">Điện thoại</h6>
                    <p className="coffee-contact-text">
                      <a href="tel:+84123456789" className="coffee-contact-link">
                        +84 123 456 789
                      </a>
                      <br />
                      <span className="coffee-contact-hours">
                        (8:00 - 22:00 hàng ngày)
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="coffee-contact-item">
                  <div className="coffee-contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="coffee-contact-details">
                    <h6 className="coffee-contact-title">Email</h6>
                    <p className="coffee-contact-text">
                      <a href="mailto:info@coffeehouse.com" className="coffee-contact-link">
                        info@coffeehouse.com
                      </a>
                      <br />
                      <a href="mailto:order@coffeehouse.com" className="coffee-contact-link">
                        order@coffeehouse.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Newsletter Subscription */}
              <div className="coffee-newsletter mt-4">
                <h6 className="coffee-newsletter-title">Đăng ký nhận tin</h6>
                <p className="coffee-newsletter-text">
                  Nhận ưu đãi đặc biệt và tin tức mới nhất
                </p>
                <div className="coffee-newsletter-form">
                  <input 
                    type="email" 
                    className="coffee-newsletter-input" 
                    placeholder="Email của bạn" 
                  />
                  <button className="coffee-newsletter-btn">
                    <FaRegHeart />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="coffee-footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="coffee-copyright">
                <p className="coffee-copyright-text">
                  © 2024 <span className="coffee-copyright-name">Coffee House</span>. 
                  Tất cả các quyền được bảo lưu.
                </p>
                <div className="coffee-made-with-love">
                  <FaHeart className="coffee-heart-icon" />
                  <span>Made with love and fresh coffee beans</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="coffee-legal-links">
                <a href="#" className="coffee-legal-link">
                  <FaShieldAlt className="me-2" />
                  Chính sách bảo mật
                </a>
                <a href="#" className="coffee-legal-link">
                  <FaFileContract className="me-2" />
                  Điều khoản dịch vụ
                </a>
                <a href="#" className="coffee-legal-link">
                  <FaCoffee className="me-2" />
                  Chính sách giao hàng
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className="coffee-back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <FaCoffee />
      </button>
    </footer>
  );
};

export default Footer;